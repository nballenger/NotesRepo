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

* If you define an environment var `FLASK_APP` set to the path to your app code, you can run `flask run` to start a dev server on port 5000
* You can also call it internal to an app by calling `app.run()`

## Debug mode

* You can start a flask app in debug mode, which enables the reloader and the debugger
* The reloader watches source files and autorestarts the server when you modify them
* The debugger is a web tool in the browser that shows up when your app raises an unhandled exception
* Debug is off by default, enable with `FLASK_DEBUG=1`
* Programmatically that's `app.run(debug=True)`

## CLI options

* `flask shell` starts a python shell in the context of the application
* `flask run` starts the dev server
* It's got some options.

## The request-response cycle

### Application and request contexts

* For any new request, flask has to make some objects available to the view function
* The request object encapsulates the HTTP request that came in
* Since you don't want to send everything as args to every view function, flask uses contexts to temporarily make some objects globally accessible
* There are two contexts in flask: application context and request context
* Variables exposed in these contexts:
    * `current_app` - app context, represents the app instance for the active application
    * `g` - app context, object the app can use for temp storage during request handling, reset with each request
    * `request` - request context, encapsulates the HTTP request
    * `session` - request context, represents the user session
* Both contexts are activated (pushed) before dispatching a request to the application, and removes them after the request is handled
* If any of the variables above are accessed without an active application or request context, an error is raised
* Example usage from the repl:

        from hello import app
        from flask import current_app
        current_app.name                # raises a RuntimeError
        app_ctx = app.app_context()
        app_ctx.push()
        current_app.name                # returns app name
        app_ctx.pop()


