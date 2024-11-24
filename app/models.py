from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f'User {self.username}'
    
    def to_json(self):
        return {"usernamme":self.username, "email":self.email}
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Repository(db.Model):
    repo_id = db.Column(db.String(40), primary_key=True)
    repo_name = db.Column(db.String(40), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    owner = db.relationship('User', backref=db.backref('repository', lazy=True))
    
    def set_owner_email(self, owner):
        self.owner = owner
    
    def to_json(self):
        return {"repo_id":self.repo_id, "repo_name":self.repo_name, "owner_id":self.owner_id}
     
class Images(db.Model):
    image_id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(128), nullable=False)
    repo_id = db.Column(db.String(40), db.ForeignKey('repository.repo_id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    width = db.Column(db.String(40), nullable=False)
    height = db.Column(db.String(40), nullable=False)
    uploaded_on = db.Column(db.Date, nullable=False)
    owner = db.relationship('User', backref=db.backref('images', lazy=True))
    repository = db.relationship('Repository', backref=db.backref('images', lazy=True))

    def set_owner_id(self, owner_id):
        self.owner_id = owner_id
    
    def set_repo_id(self, repo_id):
        self.repo_id = repo_id
    
    def to_json(self):
        return {"image_id":self.image_id, "immage_url":self.image_url, "uploaded_on":self.uploaded_on, "width":self.width, "height": self.height}

