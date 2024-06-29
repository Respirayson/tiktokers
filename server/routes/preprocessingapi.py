from flask import request, jsonify
from flask_restful import Resource
from dotenv import load_dotenv
import pandas as pd
import os
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.feature_selection import VarianceThreshold

load_dotenv()

UPLOAD_FOLDER = "data"

class EncodeHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Encode API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        columns = data['columns']

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        df = pd.read_csv(file_path)

        encoder = OneHotEncoder(sparse=False)
        encoded = encoder.fit_transform(df[columns])
        df_encoded = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(columns))
        df = df.drop(columns, axis=1).join(df_encoded)

        df.to_csv(file_path, index=False)
        return df.to_json(orient='records')

class ScaleHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Scale API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        columns = data['columns']

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        df = pd.read_csv(file_path)

        scaler = StandardScaler()
        df[columns] = scaler.fit_transform(df[columns])

        df.to_csv(file_path, index=False)
        return df.to_json(orient='records')

class SelectFeaturesHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Select Features API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        threshold = data.get('threshold', 0.0)  # default to 0.0 if not provided

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        df = pd.read_csv(file_path)

        selector = VarianceThreshold(threshold=threshold)
        df_selected = pd.DataFrame(selector.fit_transform(df), columns=df.columns[selector.get_support()])

        df_selected.to_csv(file_path, index=False)
        return df_selected.to_json(orient='records')

