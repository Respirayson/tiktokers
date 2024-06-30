from flask import request, jsonify
from flask_restful import Resource
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import os
from imblearn.under_sampling import RandomUnderSampler
from imblearn.over_sampling import RandomOverSampler, SMOTE
from sklearn.impute import SimpleImputer
from werkzeug.utils import secure_filename

load_dotenv()

UPLOAD_FOLDER = "data"

class OversampleHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Oversample API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return jsonify({'message': f'Target column {target_column} not found in data.', "status": "unsuccessful"})

        X = df.drop(columns=[target_column])
        y = df[target_column]

        ros = RandomOverSampler()
        X_res, y_res = ros.fit_resample(X, y)

        df_resampled = pd.concat([X_res, y_res], axis=1)
        df_resampled.to_csv(file_path, index=False)
        formatted_data = df_resampled.to_dict(orient='records')
        return jsonify({"data": formatted_data})
    
class OversamplePreviewHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Oversample Preview API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return jsonify({'message': f'Target column {target_column} not found in data.', "status": "unsuccessful"})

        X = df.drop(columns=[target_column])
        y = df[target_column]

        ros = RandomOverSampler()
        X_res, y_res = ros.fit_resample(X, y)

        df_resampled = pd.concat([X_res, y_res], axis=1)
        formatted_data = df_resampled.to_dict(orient='records')
        return jsonify({"data": formatted_data})

class UndersampleHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Undersample API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return jsonify({'message': f'Target column {target_column} not found in data.', "status": "unsuccessful"})

        X = df.drop(columns=[target_column])
        y = df[target_column]

        rus = RandomUnderSampler()
        X_res, y_res = rus.fit_resample(X, y)

        df_resampled = pd.concat([X_res, y_res], axis=1)
        df_resampled.to_csv(file_path, index=False)
        formatted_data = df_resampled.to_dict(orient='records')
        return jsonify({"data": formatted_data})

class UndersamplePreviewHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Undersample Preview API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return jsonify({'message': f'Target column {target_column} not found in data.', "status": "unsuccessful"})

        X = df.drop(columns=[target_column])
        y = df[target_column]

        rus = RandomUnderSampler()
        X_res, y_res = rus.fit_resample(X, y)

        df_resampled = pd.concat([X_res, y_res], axis=1)
        formatted_data = df_resampled.to_dict(orient='records')
        return jsonify({"data": formatted_data})
    
class SmoteHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "SMOTE API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return jsonify({'message': f'Target column {target_column} not found in data.', "status": "unsuccessful"})

        X = df.drop(columns=[target_column])
        y = df[target_column]

        smote = SMOTE()
        X_res, y_res = smote.fit_resample(X, y)

        df_resampled = pd.concat([X_res, y_res], axis=1)
        df_resampled.to_csv(file_path, index=False)

        formatted_data = df_resampled.to_dict(orient='records')
        return jsonify({"data": formatted_data})
    
class SmotePreviewHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "SMOTE Preview API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        target_column = data['target_column']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return jsonify({'message': f'Target column {target_column} not found in data.', "status": "unsuccessful"})

        X = df.drop(columns=[target_column])
        y = df[target_column]

        smote = SMOTE()
        X_res, y_res = smote.fit_resample(X, y)

        df_resampled = pd.concat([X_res, y_res], axis=1)

        formatted_data = df_resampled.to_dict(orient='records')
        return jsonify({"data": formatted_data})

class ImputeHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Impute API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        strategy = data.get('strategy', 'mean')  # default to mean if not provided

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        imputer = SimpleImputer(strategy=strategy)
        df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
        
        df_imputed.to_csv(file_path, index=False)
        return df_imputed.to_json(orient='records')
    
class OutlierHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Outlier API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        columns = data['columns']
        strategy = data.get('strategy', 'remove')  # default to remove if not provided

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.read_csv(file_path)

        if strategy == 'remove':
            for col in columns:
                df = df[(np.abs(df[col] - df[col].mean()) <= (3 * df[col].std()))]
        elif strategy == 'cap':
            for col in columns:
                lower_cap = df[col].mean() - 3 * df[col].std()
                upper_cap = df[col].mean() + 3 * df[col].std()
                df[col] = np.where(df[col] < lower_cap, lower_cap, df[col])
                df[col] = np.where(df[col] > upper_cap, upper_cap, df[col])

        df.to_csv(file_path, index=False)
        return df.to_json(orient='records')