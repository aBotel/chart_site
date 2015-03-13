#!/Users/ab/code/virtualenv/fydp_site/venv_files/bin/python
from app import app
import socket

debug = True

#Runs the web server locally
if debug:
	app.run(debug=True)
else:
	ipaddress = socket.gethostbyname(socket.gethostname())
	print(ipaddress)
	app.run(host=ipaddress,debug=True)