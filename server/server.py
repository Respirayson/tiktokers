from flask import Flask, request, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room

from dotenv import load_dotenv
import os
import psycopg2
import logging
import sys
import traceback
import time
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
import threading
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import base64
from io import BytesIO


from routes.fileapi import FileHandler
from routes.explorationapi import (
    OversampleHandler,
    UndersampleHandler,
    ImputeHandler,
    OutlierHandler,
    SmoteHandler,
    UpdateHandler,
)
from routes.preprocessingapi import EncodeHandler, ScaleHandler, SelectFeaturesHandler
from logging.handlers import RotatingFileHandler
from common import settings
from pathlib import Path
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split

load_dotenv()
logger = logging.getLogger()
socketio = SocketIO()


def start_logger():
    logformatter = logging.Formatter(settings.LOG_FORMAT)

    filepath = Path(settings.LOG_FILE)
    filepath.parent.mkdir(exist_ok=True, parents=True)
    logger.setLevel(settings.DEFAULT_LEVELS[settings.FILE_LOG_LEVEL])
    fh = RotatingFileHandler(settings.LOG_FILE, maxBytes=(1048576 * 5), backupCount=7)
    fh.setFormatter(logformatter)
    logger.addHandler(fh)

    consoleHandler = logging.StreamHandler(sys.stdout)
    consoleHandler.setFormatter(logging.Formatter(settings.CONSOLE_LOG_FORMAT))
    consoleHandler.setLevel(settings.DEFAULT_LEVELS[settings.CONSOLE_LOG_LEVEL])
    logger.addHandler(consoleHandler)

    logger.info("FlaskServer started")


UPLOAD_FOLDER = "data"


class ConfigurableNN(nn.Module):
    def __init__(self, input_size, hidden_layers, num_classes):
        super(ConfigurableNN, self).__init__()
        layers = []
        prev_size = input_size
        for size in hidden_layers:
            layers.append(nn.Linear(prev_size, size))
            layers.append(nn.ReLU())
            prev_size = size
        layers.append(nn.Linear(prev_size, num_classes))  # Adjust for multi-class
        self.model = nn.Sequential(*layers)

    def forward(self, x):
        x = torch.flatten(x, 1)
        return self.model(x)


def train_model(file_path, target_column, selected_columns, hidden_layers, epochs, room):
    try:
        df = pd.read_csv(file_path)
        df = df[selected_columns + [target_column]]
        df = pd.get_dummies(df)

        X = df.drop(columns=[target_column]).values
        y = df[target_column].values

        input_size = X.shape[1]
        num_classes = len(np.unique(y))

        model = ConfigurableNN(input_size, hidden_layers, num_classes)
        criterion = nn.CrossEntropyLoss()  # Use CrossEntropyLoss for multi-class
        optimizer = optim.Adam(model.parameters(), lr=0.001)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        train_loader = DataLoader(TensorDataset(torch.tensor(X_train, dtype=torch.float32), torch.tensor(y_train, dtype=torch.long)), batch_size=64, shuffle=True)

        for epoch in range(epochs):
            model.train()
            for inputs, targets in train_loader:
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                optimizer.step()

            socketio.emit('training_progress', {'epoch': epoch + 1, 'loss': loss.item()}, room=room)

        model.eval()
        with torch.no_grad():
            y_pred = model(torch.tensor(X_test, dtype=torch.float32)).argmax(dim=1).numpy()

        cm = confusion_matrix(y_test, y_pred)
        labels = sorted(np.unique(y_test))
        plt.figure(figsize=(10, 7))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
        plt.xlabel('Predicted')
        plt.ylabel('True')
        plt.title('Confusion Matrix')

        buffer = BytesIO()
        plt.savefig(buffer, format="png")
        buffer.seek(0)
        confusion_matrix_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()

        socketio.emit('training_complete', {'message': 'Training complete!', 'confusion_matrix': confusion_matrix_image}, room=room)

    except Exception as e:
        logger.error(f"Training error: {e}")
        traceback.print_exc()
        socketio.emit('training_error', {'message': str(e)}, room=room)


class TrainModelHandler(Resource):
    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']
        selected_columns = data['selected_columns']
        hidden_layers = data['hidden_layers']
        epochs = data['epochs']

        file_path = os.path.join("data", filename)

        # Join the room based on filename
        room = filename

        thread = threading.Thread(target=train_model, args=(file_path, target_column, selected_columns, hidden_layers, epochs, room))
        thread.start()
        return jsonify({"status": "success", "message": "Model training started."})


def start_app():
    try:
        start_logger()
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        print("MLBB : unable to enable logger")

    try:
        app = Flask(__name__)
        cors = CORS(app=app)
        app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
        app.config["CORS_HEADERS"] = "Content-Type"

        api = Api(app)
        socketio.init_app(app, cors_allowed_origins="*")

        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            dbname=os.getenv("DATABASE"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
        )

        # Test the db connection
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        logger.info("Testing the database connection " + str(cur.fetchall()))
        cur.close()
        conn.close()

        api.add_resource(FileHandler, "/upload")
        api.add_resource(UpdateHandler, "/update")
        api.add_resource(TrainModelHandler, "/train")

        api.add_resource(OversampleHandler, "/exploration/oversample")
        api.add_resource(SmoteHandler, "/exploration/smote")
        api.add_resource(UndersampleHandler, "/exploration/undersample")
        api.add_resource(ImputeHandler, "/exploration/impute")
        api.add_resource(OutlierHandler, "/exploration/outlier")

        api.add_resource(EncodeHandler, "/preprocessing/encode")
        api.add_resource(ScaleHandler, "/preprocessing/scale")
        api.add_resource(SelectFeaturesHandler, "/preprocessing/features")

        @socketio.on("connect")
        def handle_connect():
            print("Client connected")
            socketio.send("You are connected to the WebSocket server")

        @socketio.on("disconnect")
        def handle_disconnect():
            print("Client disconnected")

        @socketio.on("join")
        def on_join(data):
            room = data['room']
            join_room(room)
            emit('status', {'msg': f'Joined room: {room}'}, room=room)

        logger.info("Running FlaskServer")
        return app, socketio
    except Exception as e:
        logger.error(e)
        logger.error(traceback.format_exc())
        logger.error("Unable to start FlaskServer")
        return None, None


if __name__ == "__main__":
    my_app, my_socketio = start_app()
    if my_app and my_socketio:
        logger.info("Running MLBB")
        my_socketio.run(
            my_app,
            use_reloader=True,
            host="localhost",
            port=int(settings.SERVER_PORT),
            debug=True,
        )
    else:
        logger.error("Error starting MLBB")
    exit(1)
else:
    gunicorn_app, _ = start_app()
