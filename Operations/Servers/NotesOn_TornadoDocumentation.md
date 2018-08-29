# Notes on Tornado Documentation

From http://www.tornadoweb.org/en/stable/guide.html

## User's Guide

### Introduction

* Scales by doing non-blocking network IO
* Good for long polling, WebSockets, etc.
* Four major components:
    * Web framework, including ``RequestHandler``, subclassed to create webapps
    * Client and server side HTTP implementations: ``HTTPServer`` and ``AsyncHTTPClient``
    * Async networking library: ``IOLoop`` and ``IOStream``
    * Coroutine library (``tornado.gen``) for async code that easier to write than chained callbacks
* All together makes a full stack alternative to WSGI
* "to take full advantage of Tornado you will need to use the Tornado's web framework and HTTP server together"

### Asynchronous and non-Blocking I/O

* Tornado uses a single-threaded event loop
* All app code should be async/non-blocking
* Most blocking in re: tornado is network I/O, not CPU, memory
* Types of asynchronous interfaces:
    * Callback argument
    * Return a placeholder (``Future``, ``Promise``, ``Deferred``)
    * Deliver to a queue
    * Callback registry (like POSIX signals)
* Comparison of synchronous and async versions of a function:

```Python
from tornado.httpclient import HTTPClient

def synchronous_fetch(url):
    http_client = HTTPClient()
    response = http_client.fetch(url)
    return response.body


from tornado.httpclient import AsyncHTTPClient

def asynchronous_fetch(url, callback):
    http_client = AsyncHTTPClient()
    def handle_response(response):
        callback(response.body)
    http_client.fetch(url, callback=handle_response)

# Using Future instead of a callback

from tornado.concurrent import Future

def async_fetch_future(url):
    http_client = AsyncHTTPClient()
    my_future = Future()
    fetch_future = http_client.fetch(url)
    fetch_future.add_done_callback(
        lambda f: my_future.set_result(f.result())
    )
    return my_future
```

* ``Futures`` are recommended practice. Advantages:
    * Error handling is more consistent since ``Future.result`` can raise an exception
    * ``Futures`` go well with coroutines
* Coroutine version of the sample function:

```Python
from tornado import gen

@gen.coroutine
def fetch_coroutine(url):
    http_client = AsyncHTTPClient()
    response = yield http_client.fetch(url)
    return response.body
```

### Coroutines

* Use ``yield`` to suspend and resume execution
* Almost as simple as synchronous code, but without using a thread
* Make it easier to think about concurrency by reducing the number of places a context switch can happen

```Python
from tornado import gen

@gen.coroutine
def fetch_coroutine(url):
    http_client = AsyncHTTPClient()
    response = yield http_client.fetch(url)
    # Prior to py 3.3 you can't return a value
    # from a generator, so you have to use
    #   raise gen.Return(response.body)

    # 2.7 version:
    raise gen.Return(response.body)

    # 3.3+ version:
    return response.body
```

* Any function using yield is a generator, generators are all async bc they return a generator object instead of running to completion
* ``@gen.coroutine`` decorator talks to generator via the ``yield`` expressions, and with the caller by returning a ``Future``
* Simplified inner loop of the decorator:

```Python
# simplified version of tornado.gen.Runner
def run(self):
    # send(x) makes current yield return x
    # returns when next yield is reached
    future = self.gen.send(self.next)
    def callback(f):
        self.next = f.result()
        self.run()
    future.add_done_callback(callback)
```

* The decorator gets a ``Future`` from the generator, waits without blocking for that to complete, then unwraps the ``Future`` and sends the result back into the generator as the result of the ``yield``

#### Coroutine patterns

* Interaction with callbacks - to interact with code that uses callbacks instead of ``Future``, wrap the call in a ``Task``. That adds the callback argument for you and returns a ``Future`` you can yield:

```Python
@gen.coroutine
def call_task():
    yield gen.Task(some_function, other_args)
```

* Calling blocking functions - Call a blocking function via a ``ThreadPoolExecutor``, that returns ``Futures`` compatible with coroutines:

```Python
thread_pool = ThreadPoolExecutor(4)

@gen.coroutine
def call_blocking():
    yield thread_pool.submit(blocking_func, args)
```

* Parallelism - the decorator recognizes lists and dicts whose values are ``Futures``, waits for all of those ``Futures`` in parallel:

```Python
@gen.coroutine
def parallel_fetch(url1, url2):
    resp1, resp2 = yield [http_client.fetch(url1), http_client.fetch(url2)]

@gen.coroutine
def parallel_fetch_many(urls):
    responses = yield [http_client.fetch(url) for url in urls]

@gen.coroutine
def parallel_fetch_dict(urls):
    responses = yield {url: http_client.fetch(url) for url in urls}
```

* Interleaving - Sometimes you want to save a ``Future`` instead of yielding it immediately, so you can start another op before waiting:

```Python
@gen.coroutine
def get(self):
    fetch_future = self.fetch_next_chunk()
    while True:
        chunk = yield fetch_future
        if chunk is None: break
        self.write(chunk)
        fetch_future = self.fetch_next_chunk()
        yield self.flush()
```

* Looping - hard because there's no way to yield on every iteration of a loop, so you have to separate the loop condition from accessing the results:

```Python
import motor
db = motor.MotorClient().test

@gen.coroutine
def loop_example(collection):
    cursor = db.collection.find()
    while (yield cursor.fetch_next):
        doc = cursor.next_object()
```

## Structure of a Tornado web application

* Usually made of one or more ``RequestHandler`` subclasses, an ``Application`` object that routes requests to handlers, and a ``main()`` function to start the server.
* Hello world:

```Python
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url


class HelloHandler(RequestHandler):
    def get(self):
        self.write("Hello, world")


def make_app():
    return Application([ url(r"/", HelloHandler), ])


def main():
    app = make_app()
    app.listen(8888)
    IOLoop.current().start()
```

### The ``Application`` object

* Does global config, including routing table mapping requests to handlers
* Routing table is a list of ``URLSpec`` objects or tuples, which are a regex and a handler class
* First matched rule wins
* Capturing groups in the regex are path args passed to the handler's HTTP method
* A dict passed as third element of ``URLSpec`` gives the init args passed to RequestHandler.initialize, and you can give the ``URLSpec`` a name that lets it get used in ``RequestHandler.reverse_url``
* This maps ``/`` to ``MainHandler``, ``/story/\d+`` to ``StoryHandler``:

```Python
class MainHandler(RequestHandler):
    def get(self):
        self.write('<a href="%s">link to story 1</a>' % 
                   self.reverse_url("story", "1"))


class StoryHandler(RequestHandler):
    def initialize(self, db):
        self.db = db

    def get(self, story_id):
        self.write("this is story %s" % story_id)


app = Application([
    url(r"/", MainHandler),
    url(r"/story/([0-9]+)", StoryHandler, dict(db=db), name="story")
])
```

### Subclassing ``RequestHandler``

* Handlers can define HTTP methods like ``get()``, ``post()``
* Within handlers, call ``RequestHandler.render`` or ``RequestHandler.write`` to produce a response
* render() loads a ``Template`` by name, renders with args
* write() is used for non-template output, accepts strings/bytes/dicts (which go out as json)
* Common to create a ``BaseHandler`` class that overrides methods out of ``RequestHandler``

### Handling request input

* Handler can get the request object via ``self.request``, which is an ``HTTPServerRequest`` object
* Form data is preparsed, available in methods like ``get_query_argument`` and ``get_body_argument``:

```Python
class MyFormHandler(RequestHandler):
    def get(self):
        self.write('<html><body><form action="/myform" method="POST">'
                   '<input type="text" name="message">'
                   '<input type="submit" value="Submit">'
                   '</form></body></html>')

    def post(self):
        self.set_header("Content-Type", "text/plain")
        self.write("You wrote " + self.get_body_argument("message"))
```

* Tornado does not parse JSON request bodies
* To do that you override ``prepare``:

```Python
def prepare(self):
    if self.request.headers["Content-Type"].startswith("application/json"):
        self.json_args = json.loads(self.request.body)
    else:
        self.json_args = None
```

### Overriding RequestHandler methods

* Sequence of calls during each request:
    1. A new ``RequestHandler`` object is created
    1. ``initialize()`` is called with the init args from the ``Application`` configuration. ``initialize`` should typically save the args passed into member variables, may not produce any output or call methods like ``send_error``
    1. ``prepare()`` is called. Most useful in a base class shared by all handler subclasses, as ``prepare`` is called no matter which HTTP method is used. May produce output, if it calls ``finish`` or ``redirect`` (or others), then processing stops at this point.
    1. One of the HTTP methods is called (get/post/put) etc. If the URL regex has capturing groups they get passed as args to that.
    1. When the request is finished, ``on_finish()`` is called. For synchronous handlers this is immediately after the HTTP method, for async after the call to ``finish()``
* Common methods in ``RequestHandler`` to override:
    * ``write_error`` - outputs html for error pages
    * ``on_connection_close`` - called on client disconnect, apps can detect the case and halt processing
    * ``get_current_user`` 
    * ``get_user_locale``
    * ``set_default_headers`` - sets additional headers on response

### Error Handling

* If a handler raises an exception, ``RequestHandler.write_error`` gets called to create an error page, and ``tornado.web.HTTPError`` can generate a status code (500 is used by default)
* Default page gives a stack trace
* Custom page can be made via ``write_error``
* You can also gen an error page from regular handler methods by ``set_status``, writing a response, and returning

### Redirection

* Two ways: ``RequestHandler.redirect`` and ``RedirectHandler``
* Any handler descended from ``RequestHandler`` can call self.redirect()
* ``RedirectHandler`` lets you configure redirects in your ``Application`` routing table
* Example redirects:

```Python
# Single static redirect
app = tornado.web.Application([
    url(r"/app", tornado.web.RedirectHandler,
        dict(url="http://itunes.apple.com/my-app-id")),
    ])


# Regex substitution redirect
app = tornado.web.Application([
    url(r"/photos/(.*)", MyPhotoHandler),
    url(r"/pictures/(.*)", tornado.web.RedirectHandler,
        dict(url=r"/photos/\1")),
    ])
```

* ``RedirectHandler`` uses permanent redirects by default

### Async handlers

* Handlers are synchronous by default--when get/post methods return, the request is finished and response is sent
* Any long running handler should be made asynchronous
* Simplest way to do it is to use the ``coroutine`` decorator
* To do callback oriented style, use ``tornado.web.asynchronous`` decorator
* That won't send a response until a callback calls ``RequestHandler.finish``
* Example of using a FriendFeed API with ``AsyncHTTPClient``

```Python
class MainHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        http = tornado.httpclient.AsyncHTTPClient()
        http.fetch("http://friendfeed-api.com/v2/feed/bret",
                   callback=self.on_response)

    def on_response(self, response):
        if response.error: raise tornado.web.HTTPError(500)
        json = tornado.escape.json_decode(response.body)
        self.write("Fetched " + str(len(json["entries"])) + " entries " +
                   "from the friendfeed api")
        self.finish()
```

* Same thing with a coroutine:

```Python
class MainHandler(tornado.web.RequestHandler):
    @tornado.gen.coroutine
    def get(self):
        http = tornado.httpclient.AsyncHTTPClient()
        response = yield http.fetch("http://friendfeed-api.com/v2/feed/bret")
        json = tornado.escape.json_decode(response.body)
        self.write("Fetched " + str(len(json["entries"])) + " entries " +
                   "from the friendfeed api")
```


## Templates and UI

## Authentication and Security

## Running and Deploying
