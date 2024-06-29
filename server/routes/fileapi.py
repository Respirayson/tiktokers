from flask import request, jsonify
from flask_restful import Resource
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import pandas as pd
import os

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
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            # Parse CSV and compute statistics
            df = pd.read_csv(file_path)
            stats = self.compute_statistics(df)
            return jsonify({"name": filename, "status": "success", "statistics": stats})
        else:
            return jsonify({'message': 'File type not allowed', "status": "unsuccessful"})

    def compute_statistics(self, df):
        stats = {
            "Data Type": {},
            "Distinct values": {},
            "Missing values": {},
            "Mean": {},
            "Median": {},
            "Mode": {},
            "Standard Deviation": {},
            "Variance": {}
        }

        for column in df.columns:
            stats["Data Type"][column] = str(df[column].dtype)
            stats["Distinct values"][column] = int(df[column].nunique()) > 0
            stats["Missing values"][column] = bool(df[column].isna().any())
            stats["Mean"][column] = float(df[column].mean()) if pd.api.types.is_numeric_dtype(df[column]) else "NA"
            stats["Median"][column] = float(df[column].median()) if pd.api.types.is_numeric_dtype(df[column]) else "NA"
            if not df[column].mode().empty:
                mode_value = df[column].mode()[0]
                stats["Mode"][column] = (
                    int(mode_value) if pd.api.types.is_integer_dtype(mode_value) else
                    float(mode_value) if pd.api.types.is_float_dtype(mode_value) else
                    str(mode_value)
                )
            else:
                stats["Mode"][column] = "NA"
            stats["Standard Deviation"][column] = float(df[column].std()) if pd.api.types.is_numeric_dtype(df[column]) else "NA"
            stats["Variance"][column] = float(df[column].var()) if pd.api.types.is_numeric_dtype(df[column]) else "NA"

        return stats
