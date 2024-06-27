from flask import Flask, flash, request, redirect, url_for
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.utils import secure_filename

from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

UPLOAD_FOLDER = "data"
ALLOWED_EXTENSIONS = {'csv', 'npy'}

class FileHandler(Resource):

    def __init__(self):
        pass

    def is_file_allowed(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def get(self):
        return "Hello world"

    def post(self):
        form = request.form.to_dict()
        print(form)
        
        if 'file' not in request.files:
            return 'No file part'

        file = request.files.get('file')
        if file and self.is_file_allowed(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            return "File uploaded successfully"
