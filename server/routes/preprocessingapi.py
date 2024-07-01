from flask import request, jsonify
from flask_restful import Resource
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.feature_selection import VarianceThreshold
from werkzeug.utils import secure_filename

load_dotenv()

UPLOAD_FOLDER = "data"


class EncodeHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Encode API connected."})

    def post(self):
        data = request.json
        filename = data["filename"]
        columns = data["columns"]

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        # Ensure the columns to be encoded exist in the DataFrame
        missing_columns = [col for col in columns if col not in df.columns]
        if missing_columns:
            return jsonify(
                {
                    "message": f"Columns {missing_columns} not found in data.",
                    "status": "unsuccessful",
                }
            )

        encoder = OneHotEncoder(
            sparse_output=False, drop="first"
        )  # Set drop='first' to avoid multicollinearity
        encoded = encoder.fit_transform(df[columns])
        df_encoded = pd.DataFrame(
            encoded, columns=encoder.get_feature_names_out(columns)
        )

        # Drop original columns and join with encoded DataFrame
        df = df.drop(columns, axis=1).reset_index(drop=True).join(df_encoded)

        df = df.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

        formatted_data = df.to_dict(orient="records")
        return jsonify({"data": formatted_data})


class ScaleHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Scale API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        columns = data['columns']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        # Select only numeric columns
        numeric_cols = df[columns].select_dtypes(include=['number']).columns

        scaler = StandardScaler()
        df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

        df = df.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

        formatted_data = df.to_dict(orient='records')
        return jsonify({"data": formatted_data})


class SelectFeaturesHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Select Features API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        threshold = data.get('threshold', 0.0)  # default to 0.0 if not provided
        if threshold == None:
            threshold = 0.0
        
        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        # Select only numeric columns for feature selection
        numeric_cols = df.select_dtypes(include=['number']).columns
        df_numeric = df[numeric_cols]

        selector = VarianceThreshold(threshold=threshold)
        df_selected = pd.DataFrame(selector.fit_transform(df_numeric), columns=df_numeric.columns[selector.get_support()])

        df_selected = pd.concat([df.drop(numeric_cols, axis=1), df_selected], axis=1)

        df_selected = df_selected.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

        formatted_data = df_selected.to_dict(orient='records')
        return jsonify({"data": formatted_data})

