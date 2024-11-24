import cloudinary
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from .config import Config
import json 

from torchvision import models
from torchvision.models import resnet50, resnet101
from torchvision.transforms import transforms
from PIL import Image
from torch import unsqueeze


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


imagenet_class_index = json.load(open('./imagenet_class_index.json'))
model = resnet50(weights='IMAGENET1K_V2')
model.eval()

#Utilities
preprocess = transforms.Compose([transforms.Resize(256), transforms.CenterCrop(224), transforms.ToTensor(), transforms.Normalize(
                                            mean=[0.485, 0.456, 0.406],
                                            std=[0.229, 0.224, 0.225])])

def preprocess_image(image):
    # image = Image.open(io.BytesIO(image_bytes))
    return unsqueeze(preprocess(image), 0)

def predict(image_bytes):
    image = preprocess_image(image_bytes)
    # print(image)
    output = model.forward(image)
    _, y_hat = output.max(1)
    predicted_idx = str(y_hat.item())
    return imagenet_class_index[predicted_idx]


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    cors = CORS(app)

    # Configuration       
    cloudinary.config( 
        cloud_name = app.config['CLOUD_NAME'], 
        api_key = "337624462649811",#app.config['API_KEY'], 
        api_secret = "Eo_ewv5I02Ajr-ojAIBvKqvyuEU",#app.config['API_SECRET'], # Click 'View API Keys' above to copy your API secret
        secure=True
    )
    cloudinary.config.log_level = "debug"
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Enable CORS globally with restrictions
    cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    
    from .routes.auth import auth_bp
    from .routes.routes import main
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(main, url_prefix='/api')

    return app
