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
        statistics = {
            "data_type": {},
            "distinct_values": {},
            "missing_values": {},
            "mean": {},
            "median": {},
            "mode": {},
            "std_deviation": {},
            "variance": {}
        }

        for column in df.columns:
            statistics["data_type"][column] = str(df[column].dtype)
            statistics["distinct_values"][column] = str(int(df[column].nunique()) > 0)
            statistics["missing_values"][column] = str(df[column].isna().any())
            statistics["mean"][column] = round(float(df[column].mean()), 3) if pd.api.types.is_numeric_dtype(df[column]) else "NA"
            statistics["median"][column] = round(float(df[column].median()), 3) if pd.api.types.is_numeric_dtype(df[column]) else "NA"
            if not df[column].mode().empty:
                mode_value = df[column].mode()[0]
                statistics["mode"][column] = (
                    int(mode_value) if pd.api.types.is_integer_dtype(mode_value) else
                    round(float(mode_value), 3) if pd.api.types.is_float_dtype(mode_value) else
                    str(mode_value)
                )
            else:
                statistics["mode"][column] = "NA"
            statistics["std_deviation"][column] = round(float(df[column].std()), 3) if pd.api.types.is_numeric_dtype(df[column]) else "NA"
            statistics["variance"][column] = round(float(df[column].var()), 3) if pd.api.types.is_numeric_dtype(df[column]) else "NA"

        # Transforming statistics to the required format
        formatted_stats = []
        for stat in statistics:
            row = {"statistic": stat}
            for column in df.columns:
                row[column] = statistics[stat][column]
            formatted_stats.append(row)

        return formatted_stats
