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
from routes.fileapi import FileHandler
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

load_dotenv()

UPLOAD_FOLDER = "data"

class UpdateHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Update Data API connected."})

    def post(self):
        data = request.json
        filename = data['filename']
        resampled_data = data['data']

        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        df = pd.DataFrame(resampled_data)
        df.to_csv(file_path, index=False)

        return jsonify({"status": "success", "message": "Data saved successfully."})

class LinearRegressionHandler(Resource):
    def get(self):
        return jsonify({"status": "success", "message": "Linear Regression API connected."})

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

        lr = LinearRegression()
        lr.fit(X, y)

        predictions = lr.predict(X)

        formatted_data = {
            'predictions': predictions.tolist(),
            'coefficients': lr.coef_.tolist(),
            'intercept': lr.intercept_
        }

        plt.scatter(X, y, label='Actual values')
        plt.plot(X, predictions, label='Predicted values')
        plt.xlabel('Feature values')
        plt.ylabel('Target values')
        plt.title('Linear Regression Plot')
        plt.legend()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)

        # Encode the plot as base64
        plot_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

        # Get the intercept and coefficients
        intercept = lr.intercept_[0]
        coefficients = lr.coef_[0]

        # Return the results as JSON
        return jsonify({
            'plot': plot_base64,
            'intercept': intercept,
            'coefficients': coefficients.tolist()
        })
    
class OversampleHandler(Resource):
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
        df_resampled = df_resampled.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

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
        df_resampled = df_resampled.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

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

        df_resampled = df_resampled.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

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

        if strategy in ['mean', 'median']:
            # Select only numeric columns
            numeric_cols = df.select_dtypes(include=['number']).columns
            imputer = SimpleImputer(strategy=strategy)
            df[numeric_cols] = imputer.fit_transform(df[numeric_cols])
        else:
            # Impute all columns for other strategies
            imputer = SimpleImputer(strategy=strategy)
            df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

        df = df.replace({np.nan: None})

        formatted_data = df.to_dict(orient='records')

        return jsonify({"data": formatted_data})
    
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
                z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
                df = df[z_scores <= 3]
        elif strategy == 'cap':
            for col in columns:
                lower_cap = df[col].mean() - 3 * df[col].std()
                upper_cap = df[col].mean() + 3 * df[col].std()
                df[col] = np.where(df[col] < lower_cap, lower_cap, df[col])
                df[col] = np.where(df[col] > upper_cap, upper_cap, df[col])

        df = df.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

        formatted_data = df.to_dict(orient='records')
        return jsonify({"data": formatted_data})