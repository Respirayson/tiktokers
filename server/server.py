import eventlet

eventlet.monkey_patch()

from flask import Flask, request, send_file, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_socketio import SocketIO, join_room
from werkzeug.utils import secure_filename

from dotenv import load_dotenv
import os
import logging
import sys
import traceback
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import io
import uuid
from sklearn.cluster import KMeans
import joblib

os.environ["LOKY_MAX_CPU_COUNT"] = "1"


from routes.fileapi import FileHandler
from routes.explorationapi import (
    OversampleHandler,
    UndersampleHandler,
    ImputeHandler,
    OutlierHandler,
    SmoteHandler,
    UpdateHandler,
)
from routes.preprocessingapi import (
    EncodeHandler,
    ScaleHandler,
    SelectFeaturesHandler,
    DropColumns,
)
from logging.handlers import RotatingFileHandler
from common import settings
from pathlib import Path
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score

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
    def __init__(self, input_size, layers_config, num_classes):
        super(ConfigurableNN, self).__init__()
        layers = []
        prev_size = input_size
        for layer in layers_config:
            if layer["name"] == "Linear":
                layers.append(nn.Linear(prev_size, int(layer["units"])))
                prev_size = int(layer["units"])
            elif layer["name"] == "ReLU":
                layers.append(nn.ReLU())
            elif layer["name"] == "LeakyReLU":
                layers.append(nn.LeakyReLU())
            elif layer["name"] == "BatchNorm":
                layers.append(nn.BatchNorm1d(prev_size))
            elif layer["name"] == "Dropout":
                layers.append(nn.Dropout(float(layer["rate"])))
            # Add other layers as needed
        layers.append(nn.Linear(prev_size, num_classes))  # Output layer
        self.model = nn.Sequential(*layers)

    def forward(self, x):
        x = torch.flatten(x, 1)
        return self.model(x)


class ConfigurableLinRegNN(nn.Module):
    def __init__(self, input_size, layers_config):
        super(ConfigurableLinRegNN, self).__init__()
        layers = []
        prev_size = input_size
        for layer in layers_config:
            if layer["name"] == "Linear":
                layers.append(nn.Linear(prev_size, int(layer["units"])))
                prev_size = int(layer["units"])
            elif layer["name"] == "ReLU":
                layers.append(nn.ReLU())
            elif layer["name"] == "LeakyReLU":
                layers.append(nn.LeakyReLU())
            elif layer["name"] == "BatchNorm":
                layers.append(nn.BatchNorm1d(prev_size))
            elif layer["name"] == "Dropout":
                layers.append(nn.Dropout(float(layer["rate"])))
        layers.append(nn.Linear(prev_size, 1))
        self.model = nn.Sequential(*layers)

    def forward(self, x):
        x = torch.flatten(x, 1)
        return self.model(x)


def train_model(
    file_path,
    target_column,
    selected_columns,
    layers_config,
    epochs,
    learning_rate,
    grad_clipping,
    room,
):
    try:
        df = pd.read_csv(file_path)
        df = df[selected_columns + [target_column]]
        df = pd.get_dummies(df)

        X = df.drop(columns=[target_column]).values
        y = df[target_column].values

        # Encode the target labels
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(y)

        input_size = X.shape[1]
        num_classes = len(np.unique(y))

        if np.max(y) >= num_classes:
            raise ValueError(
                f"Target value {np.max(y)} is out of bounds for {num_classes} classes."
            )

        model = ConfigurableNN(input_size, layers_config, num_classes)
        criterion = nn.CrossEntropyLoss()  # Use CrossEntropyLoss for multi-class
        optimizer = optim.Adam(model.parameters(), lr=learning_rate)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        train_loader = DataLoader(
            TensorDataset(
                torch.tensor(X_train, dtype=torch.float32),
                torch.tensor(y_train, dtype=torch.long),
            ),
            batch_size=64,
            shuffle=True,
        )

        for epoch in range(epochs):
            model.train()
            for inputs, targets in train_loader:
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                if grad_clipping:
                    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                optimizer.step()

            socketio.emit(
                "training_progress",
                {"epoch": epoch + 1, "loss": loss.item()},
                room=room,
            )
            socketio.sleep(0)

        model.eval()
        with torch.no_grad():
            y_pred = (
                model(torch.tensor(X_test, dtype=torch.float32)).argmax(dim=1).numpy()
            )

        accuracy = float(accuracy_score(y_test, y_pred))

        cm = confusion_matrix(y_test, y_pred)
        labels = label_encoder.inverse_transform(sorted(np.unique(y_test)))
        plt.figure(figsize=(10, 7))
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=labels,
            yticklabels=labels,
        )
        plt.xlabel("Predicted")
        plt.ylabel("True")
        plt.title("Confusion Matrix")

        buffer = BytesIO()
        plt.savefig(buffer, format="png")
        buffer.seek(0)
        confusion_matrix_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
        plt.close()

        filename = secure_filename(f"{uuid.uuid4().hex}.pth")
        file_path = os.path.join("models", filename)
        torch.save(model.state_dict(), file_path)

        socketio.emit(
            "training_complete",
            {
                "message": "Training complete!",
                "confusion_matrix": confusion_matrix_image,
                "filename": f"{filename}.pth",
                "accuracy": accuracy,
            },
            room=room,
        )

    except Exception as e:
        logger.error(f"Training error: {e}")
        traceback.print_exc()
        socketio.emit("training_error", {"message": str(e)}, room=room)


def train_model_lin_reg(
    file_path,
    target_column,
    selected_columns,
    layers_config,
    epochs,
    learning_rate,
    grad_clipping,
    room,
):
    try:
        df = pd.read_csv(file_path)
        df = df[selected_columns + [target_column]]
        df = pd.get_dummies(df)

        X = df.drop(columns=[target_column]).astype("float32").values
        y = df[target_column].astype("float32").values

        input_size = X.shape[1]

        model = ConfigurableLinRegNN(
            input_size, layers_config
        )  # Input fields batch_norm and dropout later
        criterion = nn.MSELoss()  # Use Mean Squared Error for Linear Regression
        optimizer = optim.Adam(model.parameters(), lr=learning_rate)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        y_train = y_train.reshape(-1, 1)
        y_test = y_test.reshape(-1, 1)

        train_loader = DataLoader(
            TensorDataset(
                torch.tensor(X_train, dtype=torch.float32),
                torch.tensor(y_train, dtype=torch.float32),
            ),
            batch_size=64,
            shuffle=True,
        )

        for epoch in range(epochs):
            model.train()
            for inputs, targets in train_loader:
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                if grad_clipping:
                    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                optimizer.step()

            socketio.emit(
                "training_progress",
                {"epoch": epoch + 1, "loss": loss.item()},
                room=room,
            )
            socketio.sleep(0)

        model.eval()
        with torch.no_grad():
            y_pred = model(torch.tensor(X_test, dtype=torch.float32)).numpy()

        # Calculate accuracy metrics
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        # Visualizations
        # Scatter Plot with Regression Line
        plt.figure(figsize=(10, 6))
        plt.scatter(X_test[:, 0], y_test, color='blue', label='Actual Data')
        
        # Sort the X_test and corresponding y_pred for proper line plotting
        sorted_indices = np.argsort(X_test[:, 0], axis=0)
        plt.plot(X_test[sorted_indices, 0], y_pred[sorted_indices], color='red', label='Regression Line')
        
        plt.xlabel('X')
        plt.ylabel('Y')
        plt.title('Scatter Plot with Regression Line')
        plt.legend()
        scatter_buffer = BytesIO()
        plt.savefig(scatter_buffer, format="png")
        scatter_buffer.seek(0)
        scatter_image = base64.b64encode(scatter_buffer.getvalue()).decode('utf-8')
        plt.close()

        # Residual Plot
        residuals = y_test - y_pred
        plt.figure(figsize=(10, 6))
        plt.scatter(y_pred, residuals, color='purple')
        plt.hlines(0, min(y_pred), max(y_pred), colors='gray', linestyles='dashed')
        plt.xlabel('Predicted Values')
        plt.ylabel('Residuals')
        plt.title('Residual Plot')
        residual_buffer = BytesIO()
        plt.savefig(residual_buffer, format="png")
        residual_buffer.seek(0)
        residual_image = base64.b64encode(residual_buffer.getvalue()).decode('utf-8')
        plt.close()

        filename = secure_filename(uuid.uuid4().hex)
        torch.save(model.state_dict(), f"models/{filename}.pth")

        socketio.emit(
            "training_complete",
            {
                "message": "Training complete!",
                "filename": f"{filename}.pth",
                "mae": float(mae),
                "r2": float(r2),
                "scatter_plot": scatter_image,
                "residual_plot": residual_image,
            },
            room=room,
        )

    except Exception as e:
        logger.error(f"Training error: {e}")
        traceback.print_exc()
        socketio.emit("training_error", {"message": str(e)}, room=room)


def train_model_k_means(
    file_path, selected_columns, clusters, iterations, tolerance, room
):
    try:
        df = pd.read_csv(file_path)
        df = df[selected_columns]
        df = pd.get_dummies(df)

        X = df.astype("float32").values

        old_stdout = sys.stdout
        sys.stdout = StreamToLogger(room)

        try:
            kmeans = KMeans(
                n_clusters=clusters, max_iter=iterations, tol=tolerance, verbose=1
            ).fit(X)
        finally:
            sys.stdout = old_stdout  # Reset stdout

        filename = secure_filename(f"{uuid.uuid4().hex}.joblib")
        file_path = os.path.join("models", filename)
        joblib.dump(kmeans, file_path)

        socketio.emit(
            "training_complete",
            {"message": "Training complete!", "filename": filename},
            room=room,
        )

    except Exception as e:
        logger.error(f"Training error: {e}")
        traceback.print_exc()
        socketio.emit("training_error", {"message": str(e)}, room=room)


class TrainModelHandler(Resource):
    def post(self):
        data = request.json
        filename = data["filename"]
        target_column = data["target_column"]
        selected_columns = data["selected_columns"]
        layers_config = data["hidden_layers"]
        epochs = data["epochs"]
        learning_rate = data["learning_rate"]
        grad_clipping = data["grad_clipping"]

        file_path = os.path.join("data", filename)

        # Join the room based on filename
        room = filename

        # thread = threading.Thread(
        #     target=train_model,
        #     args=(
        #         file_path,
        #         target_column,
        #         selected_columns,
        #         layers_config,
        #         epochs,
        #         learning_rate,
        #         grad_clipping,
        #         room,
        #     ),
        # )
        # thread.start()
        socketio.start_background_task(
            train_model,
            file_path,
            target_column,
            selected_columns,
            layers_config,
            epochs,
            learning_rate,
            grad_clipping,
            room,
        )
        return jsonify({"status": "success", "message": "Model training started."})


class TrainLinRegModelHandler(Resource):
    def post(self):
        data = request.json
        filename = data["filename"]
        target_column = data["target_column"]
        selected_columns = data["selected_columns"]
        hidden_layers = data["hidden_layers"]
        epochs = data["epochs"]
        learning_rate = data["learning_rate"]
        grad_clipping = data["grad_clipping"]

        file_path = os.path.join("data", filename)

        # Join the room based on filename
        room = filename

        # thread = threading.Thread(
        #     target=train_model_lin_reg,
        #     args=(
        #         file_path,
        #         target_column,
        #         selected_columns,
        #         hidden_layers,
        #         epochs,
        #         learning_rate,
        #         grad_clipping,
        #         room,
        #     ),
        # )
        # thread.start()
        socketio.start_background_task(
            train_model_lin_reg,
            file_path,
            target_column,
            selected_columns,
            hidden_layers,
            epochs,
            learning_rate,
            grad_clipping,
            room,
        )
        return jsonify({"status": "success", "message": "Model training started."})


class TrainKMeansModelHandler(Resource):
    def post(self):
        data = request.json
        filename = data["filename"]
        selected_columns = data["selected_columns"]
        clusters = data["clusters"]
        iterations = data["epochs"]
        tolerance = data["tolerance"]

        file_path = os.path.join("data", filename)

        # Join the room based on filename
        room = filename

        # thread = threading.Thread(target=train_model_k_means, args=(file_path, selected_columns, clusters, iterations, tolerance, room))
        socketio.start_background_task(
            train_model_k_means,
            file_path,
            selected_columns,
            clusters,
            iterations,
            tolerance,
            room,
        )
        # thread.start()
        return jsonify({"status": "success", "message": "Model training started."})


class StreamToLogger(io.StringIO):
    def __init__(self, room):
        super().__init__()
        self.line_buffer = []
        self.iterations = 0
        self.room = room

    def write(self, buf):
        lines = buf.splitlines()
        for line in lines:
            if line.strip():
                self.iterations += 1
                socketio.emit(
                    "training_progress", {"epoch": self.iterations}, room=self.room
                )
                socketio.sleep(0)


class ExportModel(Resource):
    def post(self):
        try:
            data = request.json
            filename = data["filename"]
            file_path = os.path.join("models", filename)
            return send_file(file_path, as_attachment=True)
        except Exception as e:
            return jsonify(
                {"message": f"Exception Occured: {e}", "status": "unsuccessful"}
            )


class CheckApiService(Resource):
    def get(self):
        return jsonify({"message": "API Service is Active. Welcome to MLBB!"})


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
        socketio.init_app(app, cors_allowed_origins="*", async_mode="eventlet")

        if not os.path.exists("models"):
            os.makedirs("models")

        api.add_resource(CheckApiService, "/")
        api.add_resource(FileHandler, "/upload")
        api.add_resource(UpdateHandler, "/update")
        api.add_resource(TrainModelHandler, "/train")
        api.add_resource(TrainLinRegModelHandler, "/train/linreg")
        api.add_resource(TrainKMeansModelHandler, "/train/kmeans")
        api.add_resource(ExportModel, "/export")

        api.add_resource(OversampleHandler, "/exploration/oversample")
        api.add_resource(SmoteHandler, "/exploration/smote")
        api.add_resource(UndersampleHandler, "/exploration/undersample")
        api.add_resource(ImputeHandler, "/exploration/impute")
        api.add_resource(OutlierHandler, "/exploration/outlier")

        api.add_resource(EncodeHandler, "/preprocessing/encode")
        api.add_resource(ScaleHandler, "/preprocessing/scale")
        api.add_resource(SelectFeaturesHandler, "/preprocessing/features")
        api.add_resource(DropColumns, "/preprocessing/drop")

        @socketio.on("connect")
        def handle_connect():
            print("Client connected")
            socketio.send("You are connected to the WebSocket server")

        @socketio.on("disconnect")
        def handle_disconnect():
            print("Client disconnected")

        @socketio.on("join")
        def on_join(data):
            room = data["room"]
            join_room(room)

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
            host="127.0.0.1",
            port=int(settings.SERVER_PORT),
            debug=True,
        )
    else:
        logger.error("Error starting MLBB")
    exit(1)
else:
    gunicorn_app, _ = start_app()
