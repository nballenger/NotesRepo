# Notes on Flask Web Development, 2nd Ed.

By Miguel Grinberg, O'Reilly Media, March 2018; ISBN 9781491991732

# Chapter 1: Installation

* Three main dependencies, all by the Flask author, Armin Ronacher:
    * WSGI
    * Jinja2
    * CLI integration via Click
* No native DB support, form validation, user auth, etc. It's all extension based.

# Chapter 2: Basic Application Structure

## Initialization

* All apps require an initialization instance
* Web server passes all requests to that object for handling, via WSGI
* It's an instance of `Flask`:

        from flask import Flask
        app = Flask(__name__)

## Routes and View Functions

* Requests go to teh server, then to the flask app instance
* The instance has to map urls to python functions via routes
* Easiest way to define a route is the `app.route` decorator:

        @app.route('/')
        def index():
            return '<h1>Hello world</h1>'

* You can also use `app.add_url_rule(path, name, fn)`
* Functions that handle app urls are 'view functions'
* Return value of a view function is the response
* There's a variable syntax to the route decorator:

        @app.route('/user/<name>')
        def user(name):
            return 'hi, {}'.format(name)

* Dynamic bits are strings by default but can be typed: `/usr/<int:id>`

## Development Web Server

