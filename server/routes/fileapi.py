from flask import request, jsonify
from flask_restful import Resource
from werkzeug.utils import secure_filename

from dotenv import load_dotenv
import os

load_dotenv()

UPLOAD_FOLDER = "data"
ALLOWED_EXTENSIONS = {"csv", "npy"}

class FileHandler(Resource):

    def __init__(self):
        pass

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
            return jsonify({'message': 'File type not allowed', "status": "unsuccessful"})

        file = request.files.get("file")
        if file and self.is_file_allowed(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            return jsonify({"name": filename, "status": "success"})
