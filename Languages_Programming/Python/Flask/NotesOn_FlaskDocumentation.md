# Notes on Flask Documentation

From https://flask.palletsprojects.com/en/1.1.x/

--------

# Patterns for Flask

## Larger Applications

https://flask.palletsprojects.com/en/1.1.x/patterns/packages/

* Recommends using a package structure
* Use a `setup.py`, something like

    ```Python
    from setuptools import setup

    setup(
        name='yourapp',
        packages=['yourapp'],
        include_package_data=True,
        install_requires=[
            'flask',
            ...
        ],
    )
    ```

* Then use `FLASK_APP=yourapp flask run` or whatever
* You can turn on dev features with `FLASK_ENV=development`
* Checklist for using multiple modules:
    1. Flask app object has to be in `__init__.py` so it can be imported by each module, and so that `__name__` resolves correctly
    1. all view functions have to be imported in `__init__.py`, after the app object is created

        ```Python
        # __init__.py
        from flask import Flask
        app = Flask(__name__)

        import yourapp.views

        # views.py
        from yourapp import app

        @app.route('/')
        def index():
            return "hello, world"
        ```

--------------

## Application Factories



--------------

# Testing Flask Applications

From https://flask.palletsprojects.com/en/1.1.x/testing/

* Flask provides a way to test the app by exposing the Werkzeug test `Client` and handling context locals for you, which you can then use with your testing framework.

## Testing Skeleton

* Add a `tests` directory under the application root
* Create a python file to store tests at `tests/test_flaskr.py`
* Create a pytest fixture called `client()` that configures the app for testing and initializes a new database:

    ```Python
    import os
    import tempfile

    import pytest

    from flask import flaskr

    @pytest.fixture
    def client():
        db_fd, flaskr.app.config['DATABASE'] = tempfile.mkstemp()
        flaskr.app.config['TESTING'] = True

        with flaskr.app.test_client() as client:
            with flaskr.app.app_context():
                flaskr.init_db()
            yield client

        os.close(db_fd)
        os.unlink(flaskr.app.config['DATABASE'])
    ```

# Configuration Handling

From https://flask.palletsprojects.com/en/1.1.x/config/

* Flask usually wants the configuration to be available when the app starts up
* Indpendent of how your config loads, there's a config object available to hold the loaded conf values
* The `config` attribute of the `Flask` app object is where Flask itself puts some config values, and where extensions can put their config values--and you can put your stuff there too

## Configuration Basics

* `config` is a subclass of `dict`, can be modified like a `dict`
* Some config values are forwarded to the `Flask` object, so you can read/write them there
* You can update multiple values at once with `config.update()`

    ```Python
    app = Flask(__name__)
    app.config['TESTING'] = True        # update as dict k/v

    app.testing = True                  # update forwarded value

    app.config.update(                  # multi-value update
        TESTING=True,
        SECRET_KEY=b'asdf'
    )
    ```

## Environment and Debug Features

* `config['ENV']` and `config['DEBUG']` are special values, since they may behave inconsistently if changed after the app has started setting up
* To set the environment and debug mode Flask uses environment variables
* environment is via `FLASK_ENV`, which defaults to `production`
* setting it to `development` enables debug mode, and causes `flask run` to use the interactive debugger and reloader by default
* To control that separately, use `FLASK_DEBUG`
* Do not set `ENV` and `DEBUG` in config or code--they can't be read early by the `flask` command, and some systems or extensions may have already configured themselves based on a previous value

## Builtin Configuration Values (used internally by Flask)

* `ENV`
    * environment the app is running in
    * `config.env` attribute maps to the value
    * Set from `FLASK_ENV` environment variable
    * Defaults to `production`
* `DEBUG`
    * whether debug is enabled, causes `flask run` to start the dev server with an interactive debugger and file reloader
    * `config.debug` maps to this
    * enabled by default if `ENV` is `development`
    * Defaults to `True` if `ENV` is `development`, else `False`
* `TESTING`
    * Enable testing mode
    * Exceptions propagate rather than get handle by app's error handler
    * Extensions may change their behavior as well
    * You should enable in your tests
    * Defaults to `False`
* `PROPAGATE_EXCEPTIONS`
    * Exceptions are re-raised rather than handled by app's error handlers
    * If not set, implicitly `True` if `TESTING` or `DEBUG` are enabled
    * Defaults to `None`
* `PRESERVE_CONTEXT_ON_EXCEPTION`
    * Don't pop the request context when an exception occurs
    * If not set, `True` if `DEBUG` is `True`
    * Allows debuggers to introspect the request data on errors
    * Defaults to `None`
* `TRAP_HTTP_EXCEPTIONS`
    * If there's no handler for an `HTTPException` type exception, re-raise it to get handled by the interactive debugger instead of returning it as a simple error response
    * Defaults to `False`
* `TRAP_BAD_REQUEST_ERRORS`
    * Trying to access a non-existent key from request dicts like `args` and `form` returns a 400 normally
    * Enable this to treat the error as an unhandled exception instead to get the debugger
    * More specific version of `TRAP_HTTP_EXCEPTIONS`
    * If unset, enabled in debug mode, defaults to `None`
* `SECRET_KEY`
    * Signing key for the session cookie, other security stuff
    * Should be a long, random bytestring, a la `python -c 'import os;print(os.urandom(16))'`
    * Defaults to `None`
* `SESSION_COOKIE_NAME`
    * Name of the session cookie, changeable if you already have a cookie with the name
    * Default is `session`
* `SESSION_COOKIE_DOMAIN`
    * domain match rule that the session cookie is valid for
    * If not set, cookie valid for all subdomains of `SERVER_NAME`
    * If `False`, cookie domain is not set
    * Default is `None`
* `SESSION_COOKIE_PATH`
    * Path the session cookie is valid for
    * If not set, cookie valid under `APPLICATION_ROOT` or `/` if app root unset
    * Default is `None`
* `SESSION_COOKIE_HTTPONLY`
    * browsers won't allow JS access to cookies marked http only
    * Default `True`
* `SESSION_COOKIE_SECURE`
    * browsers will only send cookies with requests over HTTPS if the cookie is marked secure
    * App must be served over HTTPS for this to work
    * Default is `False`
* `SESSION_COOKIE_SAMESITE`
    * restrict how cookies are sent with requests from external sites
    * May be `'Lax'` (recommended) or `'Strict'`
    * Default is `None`
* `PERMANENT_SESSION_LIFETIME`
    * If `session.permanent` is true, cookie's expiration is this number of seconds in the future
    * May be a `datetime.timedelta` or an `int`
    * Flask's default cookie implementation validates that the crypto signature isn't older than this value
    * Defaults to `timedelta(days=31)`
* `SESSION_REFRESH_EACH_REQUEST`
    * Control whether cookie is sent with every response when `session.permanent` is true
    * Sending the cookie every time can keep the session from expiring, but increases bandwidth
    * Non-permanent sessions are unaffected
* `USE_X_SENDFILE`
    * When serving files, set the `X-Sendfile` header instead of serving the data with Flask
    * Some webservers recognize this and serve the data more efficiently
    * This only makes a difference with those servers.
    * Default is `False`
* `SEND_FILE_MAX_AGE_DEFAULT`
    * When serving files, set the cache control max age to this number of seconds
    * May be `datetime.timedelta` or `int`
    * Override on a per-file basis with `get_send_file_max_age()` on the app or blueprint
    * Default is `timedelta(hours=12)`
* `SERVER_NAME`
    * Informs the app what host/port it's bound to
    * Required for subdomain route matching support
    * If set, used for the session cookie domain if `SESSION_COOKIE_DOMAIN` is unset
    * Modern web browsers don't allow setting cookies for domains with no dot
    * To use a domain locally, add any names that should route to teh app to your `hosts` file
    * If set, `url_for` can generate external URLs with only an app context instead of a request context
    * Defaults to `None`
* `APPLICATION_ROOT`
    * Inform the app what path it is mounted under by the application / web server
    * Used for generating URLs outside the context of a request (inside a request the dispatcher is responsible for setting `SCRIPT_NAME` instead)
    * Used for the session cookie path if `SESSION_COOKIE_PATH` is unset
    * Defaults to `'/'`
* `PREFERRED_URL_SCHEME`
    * Use for generating external URLs when not in a request context
    * Defaults to `'http'`
* `MAX_CONTENT_LENGTH`
    * Don't read more than this many bytes from incoming request
    * If unset and request does not specify a `CONTENT_LENGTH`, no data is read for security
    * Defaults to `True`
* `JSON_AS_ASCII`
    * Serialize objects to ASCII encoded JSON
    * If disabled, returns JSON as unicode, or as UTF-8 by `jsonify`
    * Should typically remain enabled, defaults to `True`
* `JSON_SORT_KEYS`
    * Sort json keys alphabetically
    * Useful for caching, ensures the same serialization no matter what Python's hash seed is
    * Recommended to leave enabled, defaults to `True`
* `JSONIFY_PRETTYPRINT_REGULAR`
    * `jsonify` responses are prettyprinted, enabled in debug mode, defaults `False`
* `JSONIFY_MIMETYPE`
    * mimetype of `jsonify` responses
    * defaults to `application/json`
* `TEMPLATES_AUTO_RELOAD`
    * reload templates when they are chagned, if not set, enabled in debug mode
    * default `None`
* `EXPLAIN_TEMPLATE_LOADING`
    * Log debug info tracing how a template file was loaded
    * Can be useful to figure out why a template wasn't loaded or the wrong file was loaded
    * Default `False`
* `MAX_COOKIE_SIZE`
    * warn if cookie headers are larger than this many bytes
    * Default `4093`
    * Larger cookies may be silently ignored by browsers
    * Set to `0` to disable the warning

## Configuring from Files

* Ideally you locate the config file outside the application package
* Common pattern:

    ```Python
    app = Flask(__name__)
    app.config.from_object('yourapplication.default_settings')
    app.config.from_envvar('YOURAPPLICATION_SETTINGS')
    ```

* First loads config from the `yourapplication.default_settings` module
* Second overrides those values with contents of the file that the `YOURAPPLICATION_SETTINGS` environment variable points to.
* The config files themselves are Python files, and only uppercase names are stored in the config object dervied from those files, so use uppercase keys:

    ```Python
    # example config
    DEBUG = False
    SECRET_KEY = b'bobobobob'
    ```

* Make sure to load the config very early so that extensions have the ability to access it
* There are other config load methods on the `Config` object

## Configuring from Environment Variables

* Remember that environment variables are strings, and do not automatically deserialize to Python objects
* Config file that uses env vars:

    ```Python
    import os

    _mail_enabled = os.environ.get("MAIL_ENABLED", default="true")
    MAIL_ENABLED = _mail_enabled.lower() in {"1", "t", "true"}

    SECRET_KEY = os.environ.get("SECRET_KEY")

    if not SECRET_KEY:
        raise ValueError("No SECRET_KEY set for Flask app")
    ```

## Configuration Best Practices

1. Create your application in a function and register blueprints on it. Lets you create multiple instances of the app with different configurations attached, which makes unit testing easier. 
1. Don't write code that needs the configuration at import time. If you limit yourself to request only access to the config you can reconfigure the object later on as needed.

## Development / Production

* Easiest way to handle multiple configurations is to use a default config that's always loaded and part of version control, and a separate config that overrides that as necessary.
* Then you just have to add a separate config file and export an env var with a path to it
* An interesting pattern is to use classes and inheritance for config:

    ```Python
    class Config:
        DEBUG = False
        TESTING = False
        DATABASE_URI = 'sqlite:///:memory:'

    class ProductionConfig(Config):
        DATABASE_URI = 'mysql://user@localhost/foo'

    class DevelopmentConfig(Config):
        DEBUG = True

    class TestingConfig(Config):
        TESTING = True
    ```

* Then you enable one with `app.config.from_object('configmodule.ProductionConfig')`
* That doesn't instantiate the object, so if you need to do so you have to do it before calling `from_object()`:

    ```Python
    from configmodule import ProductionConfig
    app.config.from_object(ProductionConfig())
    
    # alternatively, import via string
    from werkzeug.utils import import_string
    cfg = import_string('configmodule.ProductionConfig')()
    app.config.from_object(cfg)
    ```

* Instantiating the config object lets you use `@property` in the config classes

    ```Python
    class Config:
        DEBUG = False
        TESTING = False
        DB_SERVER = '192.168.1.56'

        @property
        def DATABASE_URI(self):
            return 'mysql://user@{}/foo'.format(self.DB_SERVER)

    class ProductionConfig(Config):
        DB_SERVER = '192.168.19.32'

    class DevelopmentConfig(Config):
        DB_SERVER = 'localhost'
        DEBUG = True

    class TestingConfig(Config):
        DB_SERVER = 'localhost'
        DEBUG = True
        DATABASE_URI = 'sqlite:///:memory:'
    ```

* Recommendations about managing configuration:
    * Keep a default config in version control. Either populate the config with the default, or import it into your config files before overriding values.
    * Use an environment variable to switch between configurations.
    * Use a tool like fabric in prod to push code and configurations separately

## Instance Folders

* You could for a long time refer to paths relative to the app's root folder directly via `Flask.root_path`, which is how a lot of people would load configs
* Unfortunately that only works well if apps are not packages, in which case the root path refers to the contents of the package.
* In 0.8 `Flask.instance_path` was added, which refers to a new concept called the 'instance folder'. The instance folder is NOT under version control and is deployment specific, and is where you put things that either change at runtime or are config files.
* You can either explicitly provide the path of the instance folder when creating the flask app or you can let Flask autodetect the instance folder.
* Explicit configuration:

    ```Python
    app = Flask(__name__, instance_path='/path/to/instance/folder')
    ```

* Must be an absolute path
* If no instance path parameter is given, the following default locations are used:
    * Uninstalled module:

        ```
        /myapp.py
        /instance
        ```

    * Uninstalled package:

        ```
        /myapp
            /__init__.py
        /instance
        ```

    * Installed module or package:

        ```
        $PREFIX/lib/python2.X/site-packages/myapp
        $PREFIX/var/myapp-instance
        ```

* For the above, `$PREFIX` is equivalent to `sys.prefix`
* The behavior of relative paths in config files can be flipped between "relative to the application root" (default) and "relative to the instance folder" via the `instance_relative_config` switch to the application constructor 
* Full example of configuring Flask to preload the config from a module and then override the config from a file in the instance folder if it exists:

    ```Python
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('yourapplication.default_settings')
    app.config.from_pyfile('application.cfg', silent=True)
    ```

* Path to the instance folder can be found via `Flask.instance_path`
* You can open a file from the instance folder with `Flask.open_instance_resource()`
* Example:

    ```Python
    filename = os.path.join(app.instance_path, 'application.cfg')
    with open(filename) as f:
        config = f.read()

    # or open via open_instance_resource
    with app.open_instance_resource('application.cfg') as f:
        config = f.read()
    ```

# Modular Applications with Blueprints

* A `Blueprint` object works similarly to a `Flask` application object, but is not actually an application--it's a blueprint of how to construct or extend an application.
* Intended for the following cases:
    * Factor an app into a set of blueprints. Good for larger apps--a project could instantiate an application object, initialize several extensions, and register a collection of blueprints.
    * Register a blueprint on an application at a URL prefix and/or subdomain. Params in teh URL prefix/subdomain become common view arguments across all view functions in the blueprint
    * Register a blueprint multiple times on an app with different URL rules
    * Provide template filters, static files, templates, and other utilities through blueprints. A blueprint doesn't have to implement applications or view functions
    * Register a blueprint on an app for any of these cases when initializing a Flask extension
* A blueprint isn't a pluggable app since it's not really an application--it's a set of operations that can be registered on an application, even multiple times
* You can have multiple application objects, but they'll have separate configs and are managed at the wsgi layer
* Blueprints provide separation at the Flask level, share app config, and can change an app object as necessary with being registered.
* Downside is that you can't unregister a blueprint once an app was created without having to destroy the whole app object

## The concept of Blueprints

* Basic idea is that they record operations to execute when registered on an app.
* Flask associates view functions with blueprints when dispatching requests and generating URLs from one endpoint to another

## My First Blueprint

* Very basic one that does simple rendering of static templates:

    ```Python
    from flask import Blueprint, render_template, abort
    from jinja2 import TemplateNotFound

    simple_page = Blueprint('simple_page', __name__, template_folder='templates')

    @simple_page.route('/', defaults={'page': 'index'})
    @simple_page.route('/<page>')
    def show(page):
        try:
            return render_template('pages/%s.html' % page)
        except TemplateNotFound:
            abort(404)
    ```

* When you bind a function with the `@simple_page.route` decorator the blueprint records the intention of registering the `show` function on the app when it's later registered.
* It will prefix the endpoint of the function with the name of the blueprint which was given to the `Blueprint` constructor. The blueprint's name doesn't modify the URL, just the endpoint.

## Registering Blueprints

* Registering:

    ```Python
    from flask import Flask
    from yourapplication.simple_page import simple_page

    app = Flask(__name__)
    app.register_blueprint(simple_page)
    ```

* Here's what rules are registered on the application:

    ```
    >>> app.url_map
    Map([<Rule '/static/<filename>' (HEAD, OPTIONS, GET) -> static>,
     <Rule '/<page>' (HEAD, OPTIONS, GET) -> simple_page.show>,
     <Rule '/' (HEAD, OPTIONS, GET) -> simple_page.show>])
    ```

* Blueprints can be mounted at different locations:

    ```Python
    app.register_blueprint(simple_page, url_prefix='/pages')
    ```

* Which leads to these generated rules:

    ```
    >>> app.url_map
    Map([<Rule '/static/<filename>' (HEAD, OPTIONS, GET) -> static>,
     <Rule '/pages/<page>' (HEAD, OPTIONS, GET) -> simple_page.show>,
     <Rule '/pages/' (HEAD, OPTIONS, GET) -> simple_page.show>])
    ```

## Blueprint Resources

* Blueprints can provide resources
* You may want to introduce a blueprint only for the resources it provides

### Blueprint Resource Folder

* Blueprints are considered to be contained in a folder.
* Multiple blueprints _can_ originate in the same folder, but it's not recommended.
* The folder is inferred from the second argument to `Blueprint()`, usually `__name__`, which specifies which logical Python module/package corresponds to the blueprint.
* If it points to an actual package, that package is the resource folder
* if it's a module, the containing package is the resource folder
* You can access `Blueprint.root_path` to see what the resource folder is
* To open sources from the folder, you can use `open_resource()`:

    ```Python
    print(simple_page.root_path)

    with simple_page.open_resource('static/style.css') as f:
        code = f.read()
    ```

### Static Files

* A blueprint can expose a folder with static files by providing the path to the folder on the filesystem with the `static_folder` argument. 
* It's either an absolute path or relative to the blueprint's location
* Some more stuff here but I'm skipping it.

### Templates

* If you want the blueprint to expose templates you can do that by providing the `template_folder` parameter to the `Blueprint()` constructor:

    ```Python
    admin = Blueprint('admin', __name__, template_folder='templates')
    ```

* it's added to the template search path, but with a lower priority than the actual app's template folder, which lets you override templates that a blueprint provides
* When multiple blueprints provide the same relative template path, the first blueprint registered takes precedence.

## Building URLs

* If you want to link from one page to another you can use `url_for` as normal, except that you prefix the URL endpoint with the name of the blueprint and a dot:

    ```Python
    url_for('admin.index')
    ```

* If you are in a view function of a blueprint or rendered template and you want to link to another endpoint of the same blueprint, you can use relative redirects by starting the endpoint name with a dot

    ```Pythonn
    url_for('.index')
    ```

## Error Handlers

* Blueprints support the `errorhandler` decorator like the `Flask` application object, so you can make blueprint specific custom error pages

    ```Python
    @simple_page.errorhandler(404)
    def page_not_found(e):
        return render_template('pages/404.html')
    ```

* Most errorhandlers work as expected, but 404 and 405 exceptions are special
* Those are only invoked via an appropriate `raise` statement or a call to `abort` in another of the blueprint's view functions. They aren't invoked by for instance an invalid URL access.
* That's because a blueprint doesn't own a certain URL space, so the app instance has no way of knowing which blueprint error handler it should run if given an invalid URL
