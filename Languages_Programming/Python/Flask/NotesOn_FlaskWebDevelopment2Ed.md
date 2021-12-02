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

* `current_app.name` fails until there is an active app context pushed

### Request Dispatching

* On receiving a request, flask looks up the URL in the app's URL map
* The map is built from two sources
    * `app.route` decorators
    * calls to `app.add_url_rule()`
* You can inspect an app's URL map via `app.url_map`

### The Request Object

* The request object is exposed via the `request` context variable
* Most commonly used attributes and methods:
    * `form` - dict with all form fields submitted in request
    * `args` - dict with all args in the query string
    * `values` - dict with combined values of `form` and `args`
    * `cookies` - dict with all cookies included in request
    * `headers` - dict with all HTTP headers in request
    * `files` - dict with all file uploads in request
    * `get_data()` - returns buffered data from request body
    * `get_json()` - returns python dict with parsed JSON from request body
    * `blueprint` - name of Flask blueprint handling request
    * `endpoint` - name of Flask endpoint handling request (name of the view function)
    * `method` - HTTP request method
    * `scheme` - URL scheme
    * `is_secure()` - true if request came over HTTPS
    * `host` - host defined in request, including port number if specified by client
    * `path` - path part of URL
    * `query_string` - query string from URL as a raw binary string
    * `full_path` - path and query string together
    * `url` - complete URL requested by the client
    * `base_url` - same as `url` but without query string
    * `remote_addr` - IP address of the client
    * `environ` - raw WSGI env dict for the request

### Request Hooks

* You can register common functions to be invoked before/after a request is dispatched
* Request hooks are implemented as decorators:
    * `before_request` - registers a function to run before each request
    * `before_first_request` - run only before first request is handled, useful for server initialization tasks
    * `after_request` - after each request, if no unhandled exceptions occurred
    * `teardown_request` - run after each request even if unhandled exceptions occurred
* Common to share data between request hook functions and view functions via the `g` context global
* Example: a `before_request` handler loads the logged in user from the db, stores it in `g.user`, then the view function can retrieve it from there

### Responses

* Flask expects the return value of a function to be the response to the request
* Mostly that's just a simple string that's sent back as an HTML page
* HTTP requires more than a string as a response, needs status code, etc
* By default Flask returns 200 OK, but if you need to respond with a different one you can add the numeric code as a second return value: `return '<h1>Bad Request</h1>', 400`
* Responses returned by view funcs can also take a third arg, a dict of headers to add to the HTTP response
* Flask view functions also have the option of returning a response object, rather than 1, 2, or 3 tuples
* `make_response()` takes one, two, or three args, the same values to return from a view func
* May be useful to generate the response object inside the view function, then use its methods to further configure the response.
* Creating a response object, setting a cookie in it:

    ```Python
    from flask import make_response

    @app.route('/')
    def index():
        response = make_response('<h1>Document with cookie</h1>')
        response.set_cookie('foo', 'bar')
        return response
    ```

* Most commonly used attributes and methods of response objects:
    * `status_code` - HTTP code
    * `headers` - dict-like obj of headers to be sent
    * `set_cookie()` - add a cookie
    * `delete_cookie()`
    * `content_length` - length of response body
    * `content_type` - media type of response body
    * `set_data()` - set response body as string or bytes
    * `get_data()` - get response body
* Redirects are special, don't have a page document, just passes a new URL
* The helper function `redirect()` is useful, rather than explicitly passing a 302:

    ```Python
    from flask import redirect

    @app.route('/')
    def index():
        return redirect('http://www.example.com')
    ```

* Also useful is `abort()` which lets you do error handling:

    ```Python
    from flask import abort

    @app.route('/user/<id>')
    def get_user(id):
        user = load_user(id)
        if not user:
            abort(404)
        return '<h1>Hi, {}</h1>'.format(user.name)
    ```

## Flask Extensions

* There's lots of 'em.

# Chapter 3: Templates

## Jinja2 Template Engine

* A jinja2 template is a file with response text
* Dynamic components are in double braces

### Rendering Templates

* By default Flask looks for templates in a `templates` subdirectory of the main app directory
* Flask provides `render_template()` to integrate jinja2 templates

### Variables

* Template vars are in double braces, `{{ somename }}`
* Jinja can ingest variable values of any type, even lists, dicts, objects
* Variables can be modified with filters, separated by a pipe: `{{ somename|somefilter }}`
* Commonly used filters:
    * `safe` - renders value without applying escapes
    * `capitalize` - converts first char to UC, rest to lc
    * `lower`
    * `upper`
    * `title`
    * `trim` - removes leading and trailing whitespace
    * `striptags` - removes HTML tags before rendering

### Control Structures

* Flow control:

    ```Jinja2
    {% if user %}
        Hello, {{ user }}
    {% else %}
        Hello, stranger
    {% endif %}

    <ul>
        {% for comment in comments %}
            <li>{{ comment }}</li>
        {% endfor %}
    </ul>
    ```

* Also supports macros, which are like Python functions:

    ```Jinja2
    {% macro render_comment(comment) %}
        <li>{{ comment }}</li>
    {% endmacro %}

    <ul>
        {% for comment in comments %}
            {{ render_comment(comment) }}
        {% endfor %}
    </ul>
    ```

* Macros can be stored elsewhere and imported

    ```
    {% import 'macros.html' as macros %}
    <ul>
        {% for comment in comments %}
            {{ macros.render_comment(comment) }}
        {% endfor %}
    </ul>
    ```

* Reusable template chunks can be included with

    ```
    {% include 'common.html' %}
    ```

* Templates have inheritance. Base template in `base.html`:

    ```
    <html>
    <head>
    {% block head %}
        <title>{% block title %}{% endblock %} - My App</title>
    </head>
    <body>
        {% block body %}
        {% endblock %}
    </body>
    </html>
    ```

* Base templates define blocks that are overridden by derived templates
* Derived template:

    ```
    {% extends "base.html" %}
    {% block title %}Index{% endblock %}
    {% block head %}
        {{ super() }}
        <style>
        </style>
    {% endblock %}
    {% block body %}
    <h1>Hello.</h1>
    {% endblock %}
    ```

* `extends` directive gives derivation
* `super()` references the contents of the block in the base template

## Bootstrap Integration with Flask-Bootstrap

Don't care.

## Custom Error Pages

* An app can define custom error pages based on templates
* Two most common are 404 and 500
* Custom error handlers:

    ```Python
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('500.html'), 500
    ```

## Links

* Any app with more than one route needs links that connect different pages
* `url_for()` helper function generates URLs from the app's URL map
* In its simplest usage it takes the view function name as its single arg and returns teh URL
* Calling with `_external=True` returns an absolute URL
* You can generate dynamic links by passing the dynamic bits as keyword args

# Chapter 5: Databases

## Database Management with Flask-SQLAlchemy

* Simplifies using SQLAlchemy in flask apps

