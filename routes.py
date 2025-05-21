from flask import render_template, flash, redirect, url_for, request
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db
from models import User
from forms import RegistrationForm, LoginForm
from forms import ForgotPasswordForm

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        email = form.email.data
        # Add your logic to handle the forgot password request here
        # For example, send a password reset email to the user
        flash('A password reset link has been sent to your email address.', 'info')
        return redirect(url_for('login'))
    return render_template('forgot_password.html', form=form)

    
@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/meal')
@login_required
def meal():
    return render_template('meal.html')

@app.route('/ct')
@login_required
def ct():
    return render_template('ct.html')

@app.route('/welcome')
def welcome():
    return render_template('welcome.html')

from flask import jsonify
from flask_login import login_required, current_user
from models import FitnessProfile
from datetime import datetime

@app.route('/namepg')
def namepg():
    return render_template('namepg.html')

@app.route('/api/fitness-profile', methods=['POST'])
@login_required
def save_fitness_profile():
    import traceback
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    name = data.get('name')
    goals = data.get('goals')
    workout_level = data.get('workout_level')
    gender = data.get('gender')
    birthdate_str = data.get('birthdate')
    height = data.get('height')
    weight = data.get('weight')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    # Parse birthdate string to date object
    birthdate = None
    if birthdate_str:
        try:
            birthdate = datetime.strptime(birthdate_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid birthdate format'}), 400

    # Validate and convert height and weight
    try:
        height_val = float(height) if height else None
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid height value'}), 400

    try:
        weight_val = float(weight) if weight else None
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid weight value'}), 400

    # Convert goals list to comma-separated string if needed
    goals_str = ''
    if isinstance(goals, list):
        goals_str = ','.join(goals)
    elif isinstance(goals, str):
        goals_str = goals
    else:
        goals_str = ''

    try:
        # Check if profile exists for user, update if yes
        profile = FitnessProfile.query.filter_by(user_id=current_user.id).first()
        if profile:
            profile.name = name
            profile.goals = goals_str
            profile.workout_level = workout_level
            profile.gender = gender
            profile.birthdate = birthdate
            profile.height = height_val
            profile.weight = weight_val
        else:
            profile = FitnessProfile(
                user_id=current_user.id,
                name=name,
                goals=goals_str,
                workout_level=workout_level,
                gender=gender,
                birthdate=birthdate,
                height=height_val,
                weight=weight_val
            )
            db.session.add(profile)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Error saving fitness profile:", e)
        traceback.print_exc()
        return jsonify({'error': 'Failed to save fitness profile'}), 500

    return jsonify({'message': 'Fitness profile saved successfully'})

@app.route('/api/fitness-profile', methods=['GET'])
@login_required
def get_fitness_profile():
    profile = FitnessProfile.query.filter_by(user_id=current_user.id).first()
    if not profile:
        return jsonify({}), 404

    profile_data = {
        'name': profile.name,
        'goals': profile.goals.split(',') if profile.goals else [],
        'workout_level': profile.workout_level,
        'gender': profile.gender,
        'birthdate': profile.birthdate.isoformat() if profile.birthdate else None,
        'height': profile.height,
        'weight': profile.weight
    }
    return jsonify(profile_data)

@app.route('/index')
def index():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            flash('Login successful!', 'success')
            flash('Invalid credentials', 'error')
            return redirect(url_for('register'))
        
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            flash('Email already registered')
            return redirect(url_for('register'))
        
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Registration successful!')
        return redirect(url_for('welcome'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard'))
        flash('Invalid username or password')
    return render_template('login.html', form=form)

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/user_profile')
@login_required
def user_profile():
    return render_template('profile.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')
