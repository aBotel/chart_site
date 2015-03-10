mkdir fydp_site
cd fydp_site
virtualenv -p /usr/local/bin/python3 ./venv_files
./venv_files/bin/pip install flask
./venv_files/bin/pip install flask-login
./venv_files/bin/pip install flask-openid
./venv_files/bin/pip install flask-mail
./venv_files/bin/pip install flask-sqlalchemy
./venv_files/bin/pip install sqlalchemy-migrate
./venv_files/bin/pip install flask-whooshalchemy
./venv_files/bin/pip install flask-wtf
./venv_files/bin/pip install flask-babel
./venv_files/bin/pip install guess_language
./venv_files/bin/pip install flipflop
./venv_files/bin/pip install coverage
mkdir app
mkdir app/static
mkdir app/templates
mkdir tmp
