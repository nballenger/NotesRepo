# Notes on Flask Web Development

by Miguel Grinberg, O'Reilly Media 2014, ISBN 978-1-4493-7262-0

## Chapter 1: Installation

* Designed as extensible from the ground up.
* Two main dependencies, both authored by Flask author:
    * WSGI from Werkzeug
    * Templates from Jinja2
* Installation:
    * Make sure you've got a virtualenv
    * Activate it, install `flask` with pip

## Chapter 2: Basic Application Structure

### Initialization

* All flask apps must create an 'application instance'
* App instance is an object of class `Flask`
* Arg to the constructor is the name of hte main module/package of the app

```Python
from flask import Flask
app = Flask(__name__)
```

### Routes and View Functions

* Requests are sent to the app instance's functions according to the routes
* Ex of a declarative route, and a syntax for args:

```Python
@app.route('/')
def index():
    return '<h1>Hello World!</h1>'

@app.route('/user/<name>')
def user(name):
    return '<h1>Hello, %s!</h1>' % name

@app.route('/user/<name>/widgets/<int:id>')
def widgets(name, id):
    return '<h1>Widget %d</h1>' % (id)
```

### Server Startup

* App instance has a `run` method that launches the dev server
* You can pass a couple args to `run()`, like `debug`

### A Complete Application

```Python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)
```

### The Request-Response Cycle

#### Application and Request Contexts

* Rather than pass the request object as an arg to views, Flask uses contexts to temporarily make certain objects globally accessible.
* For example, the following treats `request` as though it were global:

```Python
from flask import request

@app.route('/')
def index():
    user_agent = request.headers.get('User-Agent')
    return 'Your browser is %s' % user_agent
```

* There are two contexts in Flask: application context, request context
* There are context globals available:
    * `current_app` - app instance of active application
    * `g` - object the app can use for temp storage during a request
    * `request` - request object
    * `session` - user session dictionary
* Flask activates ('pushes') the contexts before dispatching a request, removes them when the request is handled.
* When the application context is pushed, `current_app` and `g` become available
* When the request context is pushed, `request` and `session` do

#### Request Dispatching

* Request comes in, Flask looks it up in the app's URL map
* You can inspect the map via: `from myapp import app;app.url_map`

#### Request hooks

* If you need to execute code before or after each request, you can register functions to run pre or post.
* Request hooks are decorators, and there are four of them:
    * `before_first_request` - run before first request is handled
    * `before_request` - run before each request
    * `after_request` - after each request, if no unhandled exceptions happened
    * `teardown_request` - run after each request even if unhandled exceptions
* Common pattern for sharing data between request hook functions is to store into the context global `g`

#### Responses

* Flask expects the return value of a view function to be the response to the request.
* Mostly you return strings with a default status code of 200
* You can set the status code explicitly by returning `return 'something', 400`
* You can also give a third arg, a dict of header values.
* Alternately, return a Response object:

```Python
# Returning a 400:
from flask import make_response

@app.route('/')
def index():
    response = make_response('<h1>This document has a cookie.</h1>')
    response.set_cookie('answer','42')
    return response


# Returning a redirect:
from flask import redirect

@app.route('/')
def index():
    return redirect('http://www.example.com')
    

# Returning a 404:
from flask import abort

@app.route('/user/<id>')
def get_user(id):
    user = load_user(id)
    if not user:
        abort(404)
    return '<h1>Hi, %s</h1>' % user.name
```

### Flask Extensions

* Following section adds an extension that adds command line arguments

#### Command-line options with Flask-Script

* The dev server can take startup config options, but only as args to `app.run()`
* Better would be to give command line args
* Flask-Script adds a command line parser to the flask app: `pip install flask-script`
* Using it:

```Python
from flask.ext.script import Manager
manager = Manager(app)

# ...

if __name__ == '__main__':
    manager.run()
```

## Chapter 3: Templates

### The Jinja2 Template Engine

#### Rendering Templates

* By default Flask looks for templates in a `templates` subfolder in the app
* If you have templates for index.html and user.html, the view functions would be:

```Python
from flask import Flask, render_template

# ...

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)
```

#### Variables

* Jinja2 recognizes variables of any type
* Variables are interpolated via double braces: `{{ varname }}`
* Jinja2 comes with a number of filters, used via `{{ varname|filtername }}`
* Common filters:
    * `safe` - renders value with no escaping
    * `capitalize` - capitalizes first letter
    * `lower`
    * `upper`
    * `title`
    * `trim`
    * `striptags`

#### Control Structures

```
{% if user %}
    Hello, {{ user }}!
{% else %}
    Hello!
{% endif %}


{% for comment in comments %}
    <li>{{ comment }}</li>
{% endfor %}


{% macro render_comment(comment) %}
    <li>{{ comment }}</li>
{% endmacro %}

{% for comment in comments %}
    {{ render_comment(comment) }}
{% endfor %}


{% import 'macros.html' as macros %}
{% for comment in comments %}
    {{ macros.render_comment(comment) }}
{% endfor %}


{% include 'common.html' %}
```

##### Template inheritance

base.html:

```Python
<html>
    <head>
        {% block head %}
        <title>{% block title %}{% endblock %} - My Application</title>
        {% endblock %}
    </head>
    <body>
        {% block body %}
        {% endblock %}
    </body>
</html>
```

Inheriting template:

```Python
{% extends "base.html" %}
{% block title %}Index{% endblock %}
{% block head %}
    {{ super() }}
    <style>
    </style>
{% endblock %}
{% block body %}
<h1>Hello, World!</h1>
{% endblock %}
```

### Twitter Bootstrap Integration with Flask-Bootstrap

* Install with `pip install flask-bootstrap`
* Initialize with 

```Python
from flask.ext.bootstrp import Bootstrap
# ...
bootstrap = Bootstrap(app)
```

* Creates a base template with all bootstrap files in it
* Allows derived templates like:

```Python
{% extends "bootstrap/base.html" %}

{% block title %}Flasky{% endblock %}

{% block navbar %}
<div class="navbar navbar-inverse" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle"
             data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/">Flasky</a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li><a href="/">Home</a></li>
            </ul>
        </div>
    </div>
</div>
{% endblock %}

{% block content %}
<div class="container">
    <div class="page-header">
        <h1>Hello, {{ name }}!</h1>
    </div>
</div>
{% endblock %}
```

* Flask-Bootstrap's base.html defines a number of blocks to use in derived templates, like `doc`, `html_attribs`, `html`, `head`, `title`, etc.

### Custom Error Pages

```Python
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500
```

### Links

* For dynamic routes it can be difficult to construct the links inside the templates
* Flask provides the `url_for()` helper function that generates URLs from the info stored in teh application's URL map
* Takes the view function name or endpoint name, returns a URL
* Dynamic URLs can be generated with url_for() by passing dynamic parts as keyword args

### Static Files

* References to static files are treated as a special route to `/static/<filename>`
* By default, looks for static files in `/app/static`

### Localization of Dates and Times with Flask-Moment

* Install with `pip install flask-moment`
* Does datetime localization via moment.js


## Chapter 4: Web Forms

## Chapter 5: Databases

### Database Management with Flask-SQLAlchemy

* It's a flask extension that simplifies using SQLAlchemy
* Can handle mysql, postgres, and sqlite
* Gotta feed it a config value for `SQLALCHEMY_DATABASE_URI`
* `SQLALCHEMY_COMMIT_ON_TEARDOWN`, when True, does automatic commits at the end of requests
* Example database config:

```Python
import os
from flask.ext.sqlalchemy import SQLAlchemy

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =\
    'sqlite:///' + os.path.join(basedir, 'data.sqlite')
```

* The `db` object represents the db and gives access to it

### Model Definition

* The db instance gives you a base model class and helper functions
* Example:

```Python
class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)

    def __repr__(self):
        return '<Role %r>' % self.name


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)

    def __repr__(self):
        return '<User %r>' % self.username
```

* Column types in SQLAlchemy:
    * `db.Integer` - regular int
    * `db.SmallInteger` - short int
    * `db.BigInteger` - unlimited precision int
    * `db.Float` - float
    * `db.Numeric` - decimal
    * `db.String`
    * `db.Text`
    * `db.Unicode`
    * `db.UnicodeText`
    * `db.Boolean`
    * `db.Date`
    * `db.Time`
    * `db.DateTime`
    * `db.Interval` - timedelta
    * `db.Enum` - list of string values
    * `db.PickleType` - any python obj, auto serialized
    * `db.LargeBinary` - blob
* Common options to constructors:
    * `primary_key` - bool
    * `unique` - bool
    * `index` - bool
    * `nullable` - bool
    * `default`
* Every table needs a primary key

### Relationships

Example one-to-many:

```Python
class Role(db.Model):
    # ...
    users = db.relationship('User', backref='role')

class User(db.Model):
    # ...
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
```

* Relationship options:
    * `backref` - other model
    * `primaryjoin` - explicit join condition between models
    * `lazy` - how related items are loaded. can be `immediate`, `joined`, `subquery`, `noload`, `dynamic`
    * `uselist` - if False, use a scalar instead of a list
    * `order_by` - specify ordering for items in the relationship
    * `secondary` - specify name of association table in many to many
    * `secondaryjoin` - secondary join condition for many to many

### Database Operations

#### Creating the Tables

* Drop into `python manage.py shell`
* Run `from myapp import db;db.create_all()`
* Other ops: `db.drop_all()`

#### Inserting Rows

* Creating roles and users:

```Python
from app.models import Role, User

admin_role = Role(name='Admin')
mod_role = Role(name='Moderator')
user_role = Role(name='User')

user_john = User(username='john', role=admin_role)
user_susan = User(username='susan', role=user_role)
user_david = User(username='david', role=user_role)

db.session.add(admin_role)
db.session.add(mod_role)
db.session.add(user_role)
db.session.add(user_john)
db.session.add(user_susan)
db.session.add(user_david)

db.session.commit()
```

#### Modifying Rows

```Python
admin_role.name = 'Administrator'
db.session.add(admin_role)
db.session.commit()
```

#### Deleting Rows

```Python
db.session.delete(mod_role)
db.session.commit()
```

#### Querying Rows

* Every model class has a `query` object
* Most basic query returns entire table
* Add filters to narrow the query
* Converting the query object to a string returns the native sql
* Examples:

```Python
Role.query.all()
User.query.all()

user_role = Role.query.filter_by(name='User').first()

User.query.filter_by(role=user_role).all()
```

* Common query filters:
    * `filter()` - adds a filter
    * `filter_by()` - adds an equality filter
    * `limit()`
    * `offset()`
    * `order_by()`
    * `group_by()`
* You chain them, each one returns a new query object
* Once you've got the query you want, call `all()` on it to execute and return as list
* Additional methods of forcing execution:
    * `all()` - all as list
    * `first()` - first or None
    * `first_or_404()`
    * `get()` - row matching given primary key
    * `get_or_404()`
    * `count()` - returns query count
    * `paginate()` - returns a `Pagination` object containing the specified range
* Relationships work similarly to queries
* Relationship results like `users = user_role.users` implicitly call `all()` and can't be refined with filters
* If you specify `lazy='dynamic'` in the relationship definition, you get a query object that hasn't executed yet

### Database Use in View Functions

* Db ops can happen directly in view functions
* Example of a view function using db:

```Python
@app.route('/', methods=['GET', 'POST'])
def index():
    form = NameForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.name.data).first()
        if user is None:
            user = User(username=form.name.data)
            db.session.add(user)
            session['known'] = False
        else:
            session['known'] = True
        session['name'] = form.name.data
        form.name.data = ''
        return redirect(url_for('index'))
    return render_template('index.html', form=form, name=session.get('name'),
                           known=session.get('known', False))
```

Which works off the template index.html:

```
{% extends "base.html" %}
{% import "bootstrap/wtf.html" as wtf %}

{% block title %}Flasky{% endblock %}

{% block page_content %}
<div class="page-header">
    <h1>Hello, {% if name %}{{ name }}{% else %}Stranger{% endif %}!</h1>
    {% if not known %}
    <p>Pleased to meet you!</p>
    {% else %}
    <p>Happy to see you again!</p>
    {% endif %}
</div>
{{ wtf.quickform(form) }}
{% endblock %}
```

### Integration with the Python Shell

* The Flask-Script's shell command can auto import specific objects
* To add objects to the import list the shell command needs to be registered with a `make_context` callback function:

```Python
from flask.ext.script import Shell

def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role)

manager.add_command("shell", Shell(make_context=make_shell_context))
```

### Database Migrations with Flask-Migrate

* Flask implements Alembic via the Flask-Migrate wrapper extension
* It integrates with Flask-Script to provide all operations via commands

#### Creating a Migration Repository

* Install it in the venv with `pip install flask-migrate`
* Initialize via:

```Python
from flask.ext.migrate import Migrate, MigrateCommand

# ...

migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)
```

* Before use you've got to init with `python manage.py db init`
* That creates a `migrations` folder

#### Creating a Migration Script

* Alembic migration scripts have two functions, `upgrade()` and `downgrade()`
* `upgrade()` applies db changes that are part of the migration
* `downgrade()` removes those db changes
* You can create migrations manually or automatically with `revision` and `migrate`
* Manual migrations are created with empty `upgrade()` and `downgrade()`
* Automatic migrations compare model defs to the current db state
* Always review automatic migrations before implementing

#### Upgrading the Database

* Apply migrations with `python manage.py db upgrade`

## Chapter 7: Large Application Structure

* Basic layout of a Flask app according to the book:

```
flasky
|   |- app/
|   |   |- templates/
|   |   |- static/
|   |   |- main/
|   |   |   |- __init__.py
|   |   |   |- errors.py
|   |   |   |- forms.py
|   |   |   |- views.py
|   |   |- __init__.py
|   |   |- email.py
|   |   |- models.py
|   |- migrations/
|   |- tests/
|   |   |- __init__.py
|   |   |- test*.py
|   |- venv/
|   |- requirements.txt
|   |- config.py
|   |- manage.py
```

### Configuration Options

* You can use multiple classes in `config.py` to configure for different envs
* Example:

```Python
import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY', 'some string')
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    FLASKY_MAIL_SUBJECT_PREFIX = '[Flasky]'
    FLASKY_MAIL_SENDER = 'Flasky Admin <flasky@example.com>'
    FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///'+os.path.join(basedir, 'data-dev.sqlite')


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-test.sqlite')


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data.sqlite')


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}
```

* Child classes can define a `init_app()` class method that takes an app instance as an argument, letting you do config specific initialization.
* Diff classes are registered into a `config` dictionary, with a default

### Application Package

#### Using an Application Factory

* Single-file dev is possible, but since the app is global you can't apply dynamic config changes--by the time it's running the app instance has been created, so you can't change its config.
* If you throw app creation into a factory you get time to set up config, and you can create multiple app instances if you need to.
* Example of an app package constructor in `app/__init__.py`:

```Python
from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask.ext.mail import Mail
from flask.ext.moment import Moment
from flask.ext.sqlalchemy import SQLAlchemy
from config import config

bootstrap = Bootstrap()
mail = Mail()
moment = Moment()
db = SQLAlchemy()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    db.init_app(app)

    # attach routes and custom error pages here

    return app
```

#### Implementing Application Functionality in a Blueprint

* In a single script app you can define routes with `@app.route`, but since the app is now created at runtime, `@app.route` only exists _after_ `create_app()` is called, which is too late. Error page handlers have the same problem.
* Flask solves this with 'blueprints'
* a Blueprint is similar to an app in that it can also define routes. Diff is that a blueprint's routes are dormant until the blueprint is registered with an application.
* You can create and use a blueprint as follows:

In `app/main/__init__.py`, put the package constructor to create a blueprint:

```Python
from flask import Blueprint

main = Blueprint('main', __name__)

from . import views, errors
```

In `app/__init__.py` you register the blueprint with the app inside `create_app()`:

```Python
def create_app(config_name):
    # ...

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
```

In `app/main/errors.py` add error handler routes to the blueprint:

```Python
from flask import render_template
from . import main

@main.app_errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@main.app_errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500
```

Note that writing error handlers inside a blueprint with the `errorhandler` decorator means that the handler will only be invoked for errors that originate in the blueprint. To do app wide error handlers, you have to use `app_errorhandler` decorator instead.

App routes updated to be in the blueprint, in `app/main/views.py`:

```Python
from datetime import datetime
from flask import render_template, session, redirect, url_for
from . import main
from .forms import NameForm
from .. import db
from ..models import User

@main.route('/', methods=['GET', 'POST'])
def index():
    form = NameForm()
    if form.validate_on_submit():
        # ...
        return redirect(url_form('.index'))
    return render_template('index.html', form=form, name=session.get('name'),
                           known=session.get('known', False),
                           current_time=datetime.utcnow())
```

* Differences when writing a view function inside a blueprint:
    * You get the route decorator from the blueprint
    * You use the `url_for()` function to map routes to views
* Flask applies a namespace to all the endpoints coming from a blueprint so that multiple blueprints can define view functions with the same endpoint names without collisions.
* You also store the form objects in the blueprint in `app/main/forms.py`

### Launch Script

Contents of `manage.py`:

```Python
#!/usr/bin/env python
import os
from app import create_app, db
from app.models import User, Role
from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)

def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
```

### Requirements file

* You can autogen one with `pip freeze > requirements.txt`
* Make sure to refresh it whenever a package is installed or upgraded

### Unit Tests

Example tests in `tests/test_basics.py`:

```Python
import unittest
from flask import current_app
from app import create_app, db


class BasicsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_app_exists(self):
        self.assertFalse(current_app is None)

    def test_app_is_testing(self):
        self.assertTrue(current_app.config['TESTING'])
```

You can add a testrunner command to `manage.py`:

```Python
@manager.command
def test():
    """Run unit tests"""
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)
```

### Database Setup

* Database url comes from an env var, and defaults to an SQLite db
* If you use Flask-Migrate to track migrations, you can create or upgrade db tables to the latest revision with `python manage.py db upgrade`



## Chapter 8: User Authentication

## Chapter 14: Application Programming Interfaces

### RESTful Web Services with Flask

* The `route()` decorator and its `methods` argument can declare the routes that handle resource URLs
* JSON data included with a request is automatically exposed as `request.json` Python dict
* You can use the `jsonify()` helper function to return json bodies

#### Creating an API Blueprint

An API blueprint constructor in `app/api_1_0/__init__.py`:

```Python
from flask import Blueprint

api = Blueprint('api', __name__)

from . import authentication, posts, users, comments, errors
```

Registration of the API blueprint in `app/__init__.py`:

```Python
def create_app(config_name):
    # ...
    from .api_1_0 import api as api_1_0_blueprint
    app.register_blueprint(api_1_0_blueprint, url_prefix='/api/v1.0')
    # ...
```

#### Error Handling

* To get appropriate responses for all clients you can use content negotiation
* Below is a 404 handler that gives JSON to service clients, HTML to others:

```Python
@main.app_errorhandler(404)
def page_not_found(e):
    if request.accept_mimetypes.accept_json and \
            not request.accept_mimetypes.accept_html:
        response = jsonify({'error': 'not found'})
        response.status_code = 404
        return response
    return render_template('404.html'), 404
```

Error handler for 403 forbidden in `app/api/errors.py`:

```Python
def forbidden(message):
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response
```

#### User Authentication with Flask-HTTPAuth

#### Token-Based Authentication

#### Serializng Resources to and from JSON

* Adding a `to_json()` method to models that returns a python dict helps with serializing
* Also useful to add a `from_json()` static method to model classes

```Python
class User(db.Model):
    # ...

    def to_json(self):
        json_user = {'username': self.username}
        return json_user

from app.exceptions import ValidationError

class Post(db.Model):
    # ...

    @staticmethod
    def from_json(json_post):
        body = json_post.get('body')
        if body is None or body == '':
            raise ValidationError('post does not have a body')
        return Post(body=body)
```

Writing a custom API error handler in `app/api_1_0/errors.py`:

```Python
@api.errorhandler(ValidationError)
def validation_error(e):
    return bad_request(e.args[0])
```

Possible view function after implementing that stuff:

```Python
@api.route('/posts/', methods=['POST'])
def new_post():
    post = Post.from_json(request.json)
    post.author = g.current_user
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_json())
```

#### Implementing Resource Endpoints

GET resource handler for posts:

```Python
@api.route('/posts/')
@auth.login_required
def get_posts():
    posts = Post.query.all()
    return jsonify({'posts': [post.to_json() for post in posts] })

@api.route('/posts/<int:id>')
@auth.login_required
def get_post(id):
    post = Post.query.get_or_404(id)
    return jsonify(post.to_json())
```

POST resource handler for posts:

```Python
@api.route('/posts/', methods=['POST'])
@permission_required(Permission.WRITE_ARTICLES)
def new_post():
    post = Post.from_json(request.json)
    post.author = g.current_user
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_json()), 201, \
        {'Location': url_for('api.get_post', id=post.id, _external=True)}
```

Example of `permission_required` decorator:

```Python
def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not g.current_user.can(permission):
                return forbidden('Insufficient permissions')
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

PUT handler for posts:

```Python
@api.route('/posts/<int:id>', methods=['PUT'])
@permission_required(Permission.WRITE_ARTICLES)
def edit_post(id):
    post = Post.query.get_or_404(id)
    if g.current_user != post.author and \
            not g.current_user.can(Permission.ADMINISTER):
        return forbidden('Insufficient permissions')
    post.body = request.json.get('body', post.body)
    db.session.add(post)
    return jsonify(post.to_json())
```

#### Pagination of Large Resource Collections

```Python
@api.route('/posts/')
def get_posts():
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.paginate(
        page, per_page=current_app.config['FLASKY_POSTS_PER_PAGE'],
        error_out=False)
    posts = pagination.items
    prev = None
    if pagination.has_prev:
        prev = url_for('api.get_posts', page=page-1, _external=True)
    next = None
    if pagination.has_next:
        next = url_for('api.get_posts', page=page+1, _external=True)
    return jsonify({
        'posts': [post.to_json() for post in posts],
        'prev': prev,
        'next': next,
        'count': pagination.total,
    })
```

#### Testing Web Services with HTTPie
