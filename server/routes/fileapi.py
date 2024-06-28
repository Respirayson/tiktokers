from flask import request, jsonify
from flask_restful import Resource
from werkzeug.utils import secure_filename

from dotenv import load_dotenv
import os

from flask_restful import reqparse
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans

load_dotenv()

UPLOAD_FOLDER = "data"
ALLOWED_EXTENSIONS = {"csv", "npy"}

class FileHandler(Resource):

    def __init__(self):
        # Ensure the upload folder exists when the class is instantiated
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

    def is_file_allowed(self, filename):
        return (
            "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
        )

    def get(self):
        return jsonify(
            {"status": "success", "message": "Uploading file API connected."}
        )

    def post(self):
        if "file" not in request.files:
            return jsonify({'message': 'No file part', "status": "unsuccessful"})

        file = request.files.get("file")
        if file and self.is_file_allowed(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            return jsonify({"name": filename, "status": "success"})
        else:
            return jsonify({'message': 'File type not allowed', "status": "unsuccessful"})
        


class TrainModelHandler(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('modelType', type=str, required=True, help='Model type is required')
        parser.add_argument('filePath', type=str, required=True, help='File path is required')
        parser.add_argument('learningType', type=str, required=True, help='Learning type is required (supervised or unsupervised)')
        args = parser.parse_args()

        model_type = args['modelType']
        file_path = args['filePath']
        learning_type = args['learningType']

        if not os.path.exists(file_path):
            return jsonify({'status': 'error', 'message': 'File does not exist'})

        df = pd.read_csv(file_path)

        if learning_type == 'supervised':
            if 'label' not in df.columns:
                return jsonify({'status': 'error', 'message': 'Label column is missing for supervised learning'})
            X = df.drop('label', axis=1).values
            y = df['label'].values

            if model_type == 'linear_regression':
                model = LinearRegression()
                model.fit(X, y)
                coefficients = model.coef_.tolist()
                intercept = model.intercept_
                return jsonify({'status': 'success', 'model': 'linear_regression', 'coefficients': coefficients, 'intercept': intercept})
            else:
                return jsonify({'status': 'error', 'message': 'Invalid model type for supervised learning'})
        
        elif learning_type == 'unsupervised':
            X = df.values

            if model_type == 'kmeans':
                model = KMeans(n_clusters=3)
                model.fit(X)
                labels = model.labels_.tolist()
                return jsonify({'status': 'success', 'model': 'kmeans', 'labels': labels})
            else:
                return jsonify({'status': 'error', 'message': 'Invalid model type for unsupervised learning'})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid learning type'})

