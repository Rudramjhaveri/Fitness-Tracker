from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config
import os
import json
from PIL import Image # type: ignore
import io
import base64
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def calculate_simple_nutrition(image):
    try:
        # Convert image to RGB if it's not
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Get image properties
        width, height = image.size
        
        # Convert to grayscale and calculate average brightness
        gray_image = image.convert('L')
        pixels = list(gray_image.getdata())
        brightness = sum(pixels) / len(pixels)
        
        # Calculate calories based on image properties
        if brightness < 85:  # Dark image (likely meat or heavy dishes)
            base_calories = 600
        elif brightness < 170:  # Medium brightness (mixed dishes)
            base_calories = 400
        else:  # Bright image (likely salads or light dishes)
            base_calories = 200
            
        logger.info(f"Image analysis - Size: {width}x{height}, Brightness: {brightness:.2f}, Base calories: {base_calories}")
        
        # Calculate macros based on calories
        protein = int(base_calories * 0.3 / 4)  # 30% of calories from protein (4 cal/g)
        carbs = int(base_calories * 0.4 / 4)    # 40% of calories from carbs (4 cal/g)
        fat = int(base_calories * 0.3 / 9)      # 30% of calories from fat (9 cal/g)
        
        nutrition = {
            'calories': base_calories,
            'protein': protein,
            'carbs': carbs,
            'fat': fat
        }
        
        logger.info(f"Calculated nutrition: {nutrition}")
        return nutrition
        
    except Exception as e:
        logger.error(f"Error in calculate_simple_nutrition: {str(e)}\n{traceback.format_exc()}")
        return None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}


@app.route('/api/detect-calories', methods=['POST'])
def detect_calories():
    try:
        if 'image' not in request.files:
            logger.error("No image file in request")
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            logger.error("Empty filename")
            return jsonify({'error': 'No selected file'}), 400
        
        if not allowed_file(file.filename):
            logger.error(f"Invalid file type: {file.filename}")
            return jsonify({'error': 'Invalid file type. Please use JPG, PNG, or GIF'}), 400

        try:
            # Read image data
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            logger.info(f"Successfully opened image: {file.filename}")
            
            # Calculate nutrition
            nutrition = calculate_simple_nutrition(image)
            
            if nutrition:
                logger.info(f"Successfully calculated nutrition: {nutrition}")
                return jsonify(nutrition)
            else:
                logger.error("Failed to calculate nutrition")
                return jsonify({'error': 'Could not analyze the image'}), 500
                
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}\n{traceback.format_exc()}")
            return jsonify({'error': 'Error processing the image'}), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': 'Server error'}), 500


app.config.from_object(Config)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

from routes import *

if __name__ == '__main__':
    # Make sure the uploads directory exists
    os.makedirs('uploads', exist_ok=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True,port =9000)