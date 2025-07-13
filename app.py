import os
import random
import csv
import string
from flask import Flask, request, render_template, redirect, url_for, session, flash
from flask_mail import Mail, Message
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from datetime import datetime

app = Flask(__name__)

load_dotenv(dotenv_path="info.env")

# Get key from file env
cipher_key = os.getenv('CIPHER_KEY').encode()
cipher_suite = Fernet(cipher_key)

encoded_password = os.getenv('EMAIL_PASS_ENCODE').encode()
EMAIL_PASS = cipher_suite.decrypt(encoded_password).decode()

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = EMAIL_PASS
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def log_in():
    return render_template('log_in.html')

@app.route('/request_mem')
def request_mem():
    return render_template('request_mem.html')

@app.route('/required_password')
def required_pass():
    return render_template('required_pass.html')

######
# Fill the requirement and send via mail (For example)
@app.route('/send_email', methods=['GET', 'POST'])
def send_email():
    name = request.form['Name']
    email = request.form['Email']
    cc = request.form['Cc']
    subject = request.form['Subject']
    message = request.form['Message']

    msg = Message(subject, sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email], cc=[cc])
    msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"

    try:
        mail.send(msg)
        return render_template('index.html', message='Email sent successfully')
    except Exception as e:
        return render_template('index.html', error=str(e))

##################################### OTP for User ###################################################
#Random otp for the next step
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

# Get OTP for log in    
@app.route('/send_otp', methods=['POST'])
def send_otp():
    email = request.form['email']
    otp = generate_otp()

    session['otp'] = otp 
    session['email'] = email  

    msg = Message('Secret OTP from EDA Support', sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email])
    msg.body = f'Your OTP code is: {otp}\n\nThis is automated mail.\nPlease do-not reply.\n\nThank you.'

    try:
        mail.send(msg)
        return render_template('log_in.html', step="otp", email=email, message1='OTP has been sent to your email.')
    except Exception as e:
        return render_template('log_in.html', step="email", error1=str(e))
    
#Verified OTP from user
@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    user_otp = request.form['otp']
    if 'otp' in session and session['otp'] == user_otp:
        return redirect(url_for('success'))
    else:
        return render_template('log_in.html', error2='Invalid OTP. Please try again.')
########################################### OTP for admin #####################################################################   
# Get OTP for log in    
@app.route('/send_otp_admin', methods=['POST'])
def send_otp_admin():
    email_admin = request.form['email_admin']    
    otp_admin = generate_otp()

    session['otp_admin'] = otp_admin 
    session['email_admin'] = email_admin  

    # if 'email_admin' in session and (session['email_admin'] == "quoc.duong.pz@renesas.com" or session['email_admin'] == "tam.nguyen.xh@renesas.com"):
    if email_admin in ["quoc.duong.pz@renesas.com", "tam.nguyen.xh@renesas.com"]:
        msg = Message('Secret OTP from EDA Support', sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email_admin])
        msg.body = f'Hi admin,\n\nYour OTP code is:\n\n\t\t{otp_admin}\n\nThis is automated mail.\nPlease do-not reply.\n\nThank you.'
        try:
            mail.send(msg)
            return render_template('required_pass.html', step="otp", email=email_admin, message_mail_admin='OTP has been sent to your email.')
        except Exception as e:
            return render_template('required_pass.html', step="email", error_mail_admin=str(e))
    else:
        return render_template('required_pass.html', warning_mail_admin='You are not admin of this page.')
    
# Verified OTP from user
@app.route('/verify_otp_admin', methods=['POST'])
def verify_otp_admin():
    admin_otp = request.form['otp_admin']
    if 'otp_admin' in session and session['otp_admin'] == admin_otp:
        session['admin_auth'] = True
        return redirect(url_for('admin'))
    else:
        return render_template('required_pass.html', error_admin='Invalid OTP. Please try again.')
    
# def admin_dashboard():
#     if 'admin_auth' in session and session in session['admin_auth']:
#         return redirect(url_for('admin'))
#     else:
#         return redirect(url_for('required_password'))
    
@app.route('/developer_mode')
def developer_mode():
    # if 'admin_auth' in session and session in session['admin_auth']:
    if session.get('admin_auth'):
        return redirect(url_for('admin'))
    else:
        return render_template('required_pass.html')
    
@app.route('/logout')
def logout():
    session.clear()  # Clear all session data
    return render_template('index.html')
    
##############################################################################################################################
################ Member request and approve them ########################   
@app.route('/add_user', methods=['POST'])
def add_user():
    user_name = request.form['user_name']
    user_email = request.form['user_email']
    user_team = request.form['user_team']
    add_pending_user(user_email, user_name, user_team)          
    
    if is_user_allowed(user_email):
        message_mem = "User has been approved."
    else:
        users = get_pending_users()
        for user in users:
            if user['user_email'] == user_email:
                message_mem = 'User added successfully, awaiting admin approval.'
    return render_template('request_mem.html', message_request=message_mem)

### This is a sub function serve for add_user
def add_pending_user(user_email, user_name, user_team):
    file_approve = os.path.isfile('approved_users.csv')
    with open('approved_users.csv', mode='a', newline='') as file:
        csv_writer = csv.writer(file)
        if not file_approve:
                csv_writer.writerow(['user_email', 'user_name', 'registration_date'])
    if is_user_allowed(user_email):
        return False   
    else:
        users = get_pending_users()
        for user in users:
            if user['user_email'] == user_email:
                return False            
    registration_date = datetime.now().strftime('%Y-%m-%d')
    file_exist = os.path.isfile('pending_users.csv')
    with open('pending_users.csv', mode='a', newline='') as file:
        csv_writer = csv.writer(file)
        if not file_exist:
            csv_writer.writerow(['user_email', 'user_name', 'user_team', 'registration_date'])
        csv_writer.writerow([user_email, user_name, user_team, registration_date])
    
    email_request = "quoc.duong.pz@renesas.com"
    msg = Message("You have a new request from EDA Support", sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[email_request])
    msg.body = f'Email: {user_email} send a new request.\nPleasle review the request carefully.\nThank you.'

    try:
        mail.send(msg)
        return True
    except Exception as e:
        return False
    
### Get data from add pending user and store them in list users []
def get_pending_users():
    users = []
    try:
        with open('pending_users.csv', mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                users.append(row)
    except FileNotFoundError:
        print("File not found")
    return users

### Admin call sub function and control
@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        action = request.form['action']
        user_email  = request.form['user_email']
        user_name  = request.form.get('user_name', '')
        # user_team  = request.form['user_team']

        if action == 'approve_user':
            approve_user(user_email)
        return redirect(url_for('admin'))

    pending_users = get_pending_users()
    return render_template('admin.html', pending_users=pending_users)
### Sub function approve user
def approve_user(user_email):
    with open('approved_users.csv', mode='a', newline='') as file:
        csv_writer = csv.writer(file)
        for user in get_pending_users():
            if user['user_email'] == user_email:
                csv_writer.writerow([user_email, user['user_name'], user['registration_date']])
                break

    with open('pending_users.csv', mode='r') as file:
        rows = list(csv.reader(file))

    with open('pending_users.csv', mode='w', newline='') as file:
        csv_writer = csv.writer(file)
        for row in rows:
            if row[0] != user_email:
                csv_writer.writerow(row)
    msg = Message("You have been approved by admin", sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[user_email])
    msg.body = f'Hello {user['user_name']},\n\nYou have been approved by admin.\nYou are now free to submit your issue to EDA Support.\n\nThank you.'
    try:
        mail.send(msg)
        return True
    except Exception as e:
        return False
    
### Check allowed users
def is_user_allowed(user_email):
    with open('approved_users.csv', mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            if row['user_email'] == user_email:
                return True
    return False

################ The end of request and approve ########################                  

# Move to the next page
@app.route('/success')
def success():
    return render_template('success.html')

if __name__ == '__main__':
    app.run(debug=True)