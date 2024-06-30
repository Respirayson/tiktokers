from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS

from dotenv import load_dotenv
import os
import psycopg2
import logging
import sys
import traceback

from routes.fileapi import FileHandler
from routes.explorationapi import (
    OversampleHandler,
    UndersampleHandler,
    ImputeHandler,
    OutlierHandler,
    SmoteHandler,
    OversamplePreviewHandler,
    SmotePreviewHandler,
    UndersamplePreviewHandler,
)
from routes.preprocessingapi import EncodeHandler, ScaleHandler, SelectFeaturesHandler
from logging.handlers import RotatingFileHandler
from common import settings
from pathlib import Path

load_dotenv()
logger = logging.getLogger()


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

        conn = psycopg2.connect(
            host=os.getenv("HOST"),
            dbname=os.getenv("DATABASE"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("PORT"),
        )

        # Test the db connection
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        logger.info("Testing the database connection " + str(cur.fetchall()))
        cur.close()
        conn.close()

        api.add_resource(FileHandler, "/upload")
        api.add_resource(OversampleHandler, "/exploration/oversample")
        api.add_resource(OversamplePreviewHandler, "/exploration/oversample/preview")
        api.add_resource(SmoteHandler, "/exploration/smote")
        api.add_resource(SmotePreviewHandler, "/exploration/smote/preview")
        api.add_resource(UndersampleHandler, "/exploration/undersample")
        api.add_resource(UndersamplePreviewHandler, "/exploration/undersample/preview")
        
        api.add_resource(ImputeHandler, "/exploration/impute")
        api.add_resource(OutlierHandler, "/exploration/outlier")
        api.add_resource(EncodeHandler, "/preprocessing/encode")
        api.add_resource(ScaleHandler, "/preprocessing/scale")
        api.add_resource(SelectFeaturesHandler, "/preprocessing/features")

        logger.info("Running FlaskServer")
        return app
    except Exception as e:
        logger.error(e)
        logger.error(traceback.format_exc())
        logger.error("Unable to start FlaskServer")
        return None


if __name__ == "__main__":
    my_app = start_app()
    if my_app:
        logger.info("Running MLBB")
        my_app.run(
            use_reloader=True,
            host="localhost",
            port=int(settings.SERVER_PORT),
            debug=True,
        )
    else:
        logger.error("Error starting MLBB")
    exit(1)
else:
    gunicorn_app = start_app()
