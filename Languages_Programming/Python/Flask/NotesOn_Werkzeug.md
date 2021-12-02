# Notes on Werkzeug

https://werkzeug.palletsprojects.com/en/1.0.x/

* Comprehensive WSGI web app library
* Unicode aware, doesn't enforce any dependencies
* Up to developer to choose a template engine, db adapter, figure out how to handle requests

# Getting Started

* Has no direct dependencies, has optional dependencies
* Optional dependencies:
    * SimpleJSON, preferred if installed over `json`
    * Click provides request log highlighting when using the dev server
    * Watchdog is a more efficient reloader for the dev server

# Werkzeug Tutorial

* Tutorial project is a TinyURL clone that stores URLs in a redis instance
* Uses Jinja2 for templates, redis for db, Werkzeug for WSGI layer
* Keep in mind Werkzeug is not a framework, it's a library of utilities to create your own framework or application

## Step 0: Basic WSGI Introduction

* Werkzeug is a utility library for WSGI; WSGI is a protocol/convention that ensures your webapp can talk to the web server, and that web apps play nicely together
* Basic hello world in WSGI with no Werkzeug:

    ```Python
    def application(environ, start_response):
        start_response('200 OK', [('Content-Type', 'text/plain')])
        return ['Hello World!']
    ```

* A WSGI app is a callable that takes an environ dict and a `start_response` callable as arguments
* The environ contains all incoming information
* `start_response` can be used to indicate the start of the response
* Werkzeug abstracts that stuff, lets you work with request/response objects
* Request data takes the environ object and lets you access it neatly
* Response object is a WSGI appliction, provides a nicer way to create responses
* Writing the same thing with response objects:

    ```Python
    from werkzeug.wrappers import Response

    def application(environ, start_response):
        response = Response('Hello World!', mimetype='text/plain')
        return response(environ, start_response)
    ```

* Expanded version that looks at the query string in the URL:

    ```Python
    from werkzeug.wrappers import Request, Response

    def application(environ, start_response):
        request = Request(environ)
        text = 'Hello %s!' % request.args.get('name', 'World')
        response = Response(text, mimetype='text/plain')
        return response(environ, start_response)
    ```

## Step 1: Creating the folders

* Project structure:

    ```
    /shortly        <-- not a python package, but holds main module
        /static     <-- static files
        /templates  <-- jinja2 templates
    ```

## Step 2: The Base Structure

```Python
# shortly/shortly.py

import os
import redis
import urlparse

from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound
from werkzeug.middleware.shared_data import SharedDataMiddleware
from werkzeug.utils import redirect
from jinja2 import Environment, FileSystemLoader

class Shortly:
    def __init__(self, config):
        self.redis = redis.Redis(config['redis_host'], config['redis_port'])

    def dispatch_request(self, request):
        return Response('Hello World!')

    def wsgi_app(self, environ, start_response):
        request = Request(environ)
        response = self.dispatch_request(request)
        return response(environ, start_response)

    def __call__(self, environ, start_response):
        return self.wsgi_app(environ, start_response)

def create_app(redis_host='localhost', redis_port=6379, with_static=True):
    app = Shortly({
        'redis_host': redis_host,
        'redis_port': redis_port,
    })
    if with_static:
        app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
            '/static': os.path.join(os.path.dirname(__file__), 'static')
        })
    return app

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    app = create_app()
    run_simple('127.0.0.1', 5000, app, use_debugger=True, use_reloader=True)
```

* Basic idea is that the `Shortly` class is a WSGI application
* The `__call__` method directly dispatches to the `wsgi_app` method, which is done so `wsgi_app` can be wrapped to apply middlewares, as is done in `create_app`
* The `wsgi_app` method then creates a `Request` object and calls `dispatch_request`, which then has to return a `Response` object that's evaluated s a WSGI appliction again
* Both the `Shortly` class and any request object in Werkzeug implement the WSGI interface--you could even return another WSGI appliction from `dispatch_request`
* The `create_app` factory function can be used to create a new instance of the application.

## Intermezzo: Running the Application

* Should be executably with `python shortly.py`

## Step 3: The Environment

* With an app class established, we can make the constructor do something useful
* Need to be able to render templates and connect to redis
* Extending the `Shortly` class:

    ```Python
    def __init__(self, config):
    ```
