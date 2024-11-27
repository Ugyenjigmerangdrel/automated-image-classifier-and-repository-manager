from flask import Blueprint, request, jsonify, render_template, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from .. import db
from ..models import User, Repository, Images
from werkzeug.utils import secure_filename
import os
from PIL import Image
from app import predict
from sqlalchemy import and_
from datetime import datetime, date, timedelta

import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import time
import hashlib
import random
import string

main = Blueprint("main", __name__)


# Routes
@main.route('/', methods=['GET'])
@jwt_required()
def index():
    users = User.query.all()
    x = [user.to_json() for user in users]
    print(x)
    return jsonify([user.to_json() for user in users])


@main.route('/images/upload', methods=['POST'])
@jwt_required()
def image_upload():
    current_user = get_jwt_identity()
       
    user = User.query.filter_by(email=current_user).first()

    print(user.to_json())
    files = request.files.getlist('file')

    if not files:
        return jsonify({"msg": "No files found in request!"}), 400
    
    # print(files)
    missing_file = []
    for file in files:
        # print(file)
        if file.filename == '':
            missing_file.append(file.filename)
    
    if len(missing_file) != 0:
        return jsonify({"msg": f'Missing file for ${missing_file}'}), 400

    uploaded_files=[]
    predictions = []
    dimensions = []
    for file in files:
        if file:
            
            filename = secure_filename(file.filename)

            # Construct the folder path for the user
            user_folder = os.path.join(current_app.config['STORAGE_FOLDER'], user.email, 'temp')
            print(user_folder)

            # Check if the folder exists; if not, create it
            if not os.path.exists(user_folder):
                print("Folder does not exist. Creating it...")
                os.makedirs(user_folder)  # Create the folder
            

            # Save the file into the user's folder
            file_path = os.path.join(user_folder, filename)
            file.save(file_path)
            uploaded_files.append(filename)

            # Open the image and get dimensions
            image = Image.open(file_path).convert("RGB")
            width, height = image.size
            dimensions.append({"filename": filename, "width": width, "height": height})

            # Run predictions
            class_id, class_name = predict(image)

            # Perform check on database
            class_repo = Repository.query.filter(and_(Repository.repo_id == f'{user.id}-{class_id}', Repository.owner_id == user.id)).all()
            print("Repo exists", class_repo, class_id, user.id)
            if not class_repo:
                new_repo = Repository(repo_id=f'{user.id}-{class_id}', repo_name=class_name, owner_id=user.id)
                db.session.add(new_repo)
                db.session.commit()

            # Upload an image to cloudinary
            upload_result = cloudinary.uploader.upload(file_path, public_id=filename)
            print(upload_result["secure_url"])
            image_uri = upload_result["secure_url"]
            os.remove(file_path)
            
           
            upload_date = date.today()
            new_image = Images(image_url=image_uri, repo_id=f'{user.id}-{class_id}', owner_id=user.id, uploaded_on=upload_date, width=width, height=height)
            db.session.add(new_image)
            db.session.commit()

            predictions.append((class_id, class_name))

    return jsonify({"msg": f"Uploaded Successfully!", "filelist": uploaded_files, "Predictions": predictions, "Dimensions": dimensions}), 200
        
@main.route('/images/list_repo', methods=['GET'])
@jwt_required()
def fetch_repositories():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    repositories = Repository.query.filter_by(owner_id=user.id).all()

    result = db.session.query(Repository, User).join(User).filter(Repository.owner_id == user.id).all()

    repo = []
    for r, user in result:
        repo.append({"repo_id":r.repo_id, "repo_name":r.repo_name, "owner_id":r.owner_id, "owner_name":user.username, "owner_email":user.email})

    return jsonify({"repo":repo}), 200


@main.route('/images/repo/image/<string:repoId>', methods=['GET'])
@jwt_required()
def fetch_images(repoId):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    #checking if the repo actually belongs to the user
    repo = Repository.query.filter_by(repo_id=repoId).first()
    if repo.owner_id != user.id:
        return jsonify({"msg":"There is not such repository with this repository id!"}), 400
    
    result = db.session.query(Images, Repository).join(Repository).filter(and_(Images.owner_id==user.id, Images.repo_id==repoId)).all()
    list_img = []
    for i, r in result:
        list_img.append({"image":i.to_json(), "repo_name":r.repo_name})

    return jsonify({"image_list":list_img})

@main.route('/images/list', methods=['GET'])
@jwt_required()
def fetchAllImages():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    
    images = Images.query.filter(and_(Images.owner_id==user.id)).all()

    result = db.session.query(Images, Repository).join(Repository).filter(Images.owner_id==user.id).all()
    list_img = []
    for i, r in result:
        list_img.append({"image":i.to_json(), "repo_name":r.repo_name})

    print(list_img)
    image_list = [img.to_json() for img in images]

    return jsonify({"image_list":list_img}), 200

@main.route('/images/update_repo', methods=['PUT'])
@jwt_required()
def updateImageClass():
    data = request.get_json()
    image_id = data.get('image_id')
    new_repo = data.get('new_repo_id')
    image = Images.query.filter_by(image_id=int(image_id)).first()
    image.repo_id = new_repo
    db.session.commit()

    return jsonify({"msg":"Succesfully Received!"}), 200

@main.route('/images/repo/delete/<string:repoId>', methods=['DELETE'])
@jwt_required()
def deleteRepo(repoId):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    #checking if the repo actually belongs to the user
    repo = Repository.query.filter_by(repo_id=repoId).first()

    if repo.owner_id != user.id:
        return jsonify({"msg":"There is not such repository with this repository id!"}), 400
    
    delete_images = Images.query.filter_by(repo_id=repo.repo_id).delete()
    Repository.query.filter_by(repo_id=repo.repo_id).delete()
    db.session.commit()

    return jsonify({"msg":"Deleted the repository successfully!"}),200


@main.route('/images/delete/<string:imageId>', methods=['DELETE'])
@jwt_required()
def deleteImage(imageId):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    #checking if the repo actually belongs to the user
    image = Images.query.filter_by(image_id=imageId).first()

    if image.owner_id != user.id:
        return jsonify({"msg":"There is not such image with this image id!"}), 400
    
    delete_images = Images.query.filter_by(image_id=imageId).delete()
    db.session.commit()

    return jsonify({"msg":"Deleted the image successfully!"}),200

# Utils
def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@main.route('/images/repo/add_repo', methods=['POST'])
@jwt_required()
def addRepo():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    data = request.get_json()
    repo_name = data.get('repo_name')

    if(repo_name == ''):
        return jsonify({'msg':'Class name is Required'}), 400

    rand_id = id_generator()

    new_repo = Repository(repo_id=f'{user.id}-{rand_id}', repo_name=repo_name, owner_id=user.id)
    db.session.add(new_repo)
    db.session.commit()

    return jsonify({'msg':'Added New Album Succesfully'}), 200

