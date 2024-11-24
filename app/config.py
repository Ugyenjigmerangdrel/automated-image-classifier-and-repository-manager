import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'aesop')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'secret')
    STORAGE_FOLDER = './app/uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    CLOUD_NAME = os.environ.get('CLOUD_NAME')
    API_KEY = os.environ.get('API_KEY')
    API_SECRET = os.environ.get("API_SECRET") # Click 'View API Keys' above to copy your API secret
    