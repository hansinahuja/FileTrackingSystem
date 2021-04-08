from flask import Flask, session, render_template , request , jsonify, redirect
import requests

app = Flask(__name__)
app.secret_key = "not a secret key"

@app.route('/')
def root():
	return "<font face='comic sans ms'><center><br><br><h1>File Tracking System</h1><br><h3>Project currently under development!</h3><img src='https://i.pinimg.com/originals/ef/03/f8/ef03f898ffa6f5eac9a37622cd73cd4b.gif'>"

@app.route('/home')
def home():
	return render_template('index.jinja2')

@app.route('/login')
def login():
	return render_template('login.jinja2')

@app.route('/otp', methods=['POST'])
def otp():
	form_data = {'email' : request.form["email"]}
	response = requests.post(url = "http://10.10.9.72:5000/generateOTP", data = form_data).json()

	if response['error'] == False:
		session['email'] = form_data["email"]
		return render_template('otp.jinja2', context = {"email" : form_data["email"]})
	else:
		return response['msg']

@app.route('/redirect', methods=['POST'])
def redirect():
	form_data = {"email" : session["email"], "otp" : request.form["otp"], "login": True}
	response = requests.post(url = "http://10.10.9.72:5000/verifyOTP", data = form_data).json()

	if response["match"]:
		if response['name'] != '' and response['office'] != '':
			context = {"email" : session["email"], "name" : response['name'], "offices" : response["offices"]}
			return render_template('dashboard.jinja2', context = context)
		else:
			return render_template('set_name.jinja2')
	else:
		return response["msg"]

@app.route('/set_name', methods=["POST"])
def set_name():
	form_data = {"name" : request.form["name"]}
	response = requests.post(url = "http://10.10.9.72:5000/setName", data = form_data).json()

	if response["error"] == False:
		return redirect("/dashboard")
	else:
		return response["msg"]

@app.route('/dashboard')
def dashboard():
	return render_template('dashboard.jinja2')

if __name__ == '__main__':
	app.run(debug = True)