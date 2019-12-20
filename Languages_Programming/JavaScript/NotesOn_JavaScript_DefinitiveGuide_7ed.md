# Notes on JavaScript: The Definitive Guide, 7th Ed.

By David Flanagan; O'Reilly Media, Inc, July 2020; ISBN 9781491952108

# Chapter 8: Asynchronous JavaScript

* Promises - objects that represent the not yet available result of an async op
* `async` and `await` keywords provide syntax that lets you structure Promise based code as if it were synchronous
* Async iterators and `for`/`await` let you work with streams of async events as if they were synchronous loops
* No core language features are async. To demonstrate features, have to look at client-side and server-side JS to explain the async features of each environment

## 8.1 Asynchronous Programming with Callbacks

* A callback is a function object passed to another function, which executes it when some event occurs or a condition is met. The callback notifies you of the condition or event.

### 8.1.1 Timers

* Simple asynchrony is running code after X time elapses:

    ```
    setTimeout(checkForUpdates, 60000);
    ```

* First arg is a function, second is interval in ms
* `setTimeout()` runs the callback once
* `setInterval()` runs repeatedly

    ```
    let updateIntervalId = setInterval(checkForUpdates, 60000);

    // call this to clear it
    function stopCheckingForUpdates() {
        clearInterval(updateIntervalId);
    }
    ```

### 8.1.2 Events

* Client side JS is event driven
* You register callbacks for specific event types in specific contexts, as 'event handlers' or 'event listeners'

    ```
    okay = document.querySelector('#confirmUpdateDialog button.okay');

    okay.addEventListener('click', applyUpdate);
    ```

### 8.1.3 Network Events

* JS in the browser can fetch data via something like:

    ```JavaScript
    function getCurrentVersionNumber(versionCallback) {
        request = new XMLHttpRequest();
        request.open('GET', 'http://www.example.com/api/version');
        request.send();

        // register callback to invoke when response arrives
        request.onload = function() {
            if (request.status === 200) {
                current_version = parseFloat(request.responseText);
                versionCallback(null, current_version);
            } else {
                versionCallback(response.statusText, null);
            }
        };

        // register second callback for network errors
        request.onerror = request.ontimeout = function(e) {
            versionCallback(e.type, null);
        }
    }
    ```

* Because the above makes an async request, it can't synchronously return the value the caller is interested in, thus the callback function.

### 8.1.4 Callbacks and Events in Node

* Node server-side is deeply asynchronous, has a bunch of APIs with events/callbacks
* Default file api is async, invokes a callback when the file contents are read:

    ```JavaScript
    const fs = require('fs');
    let options = {
        /// default options for program
    };

    // read config file, then call callback
    fs.readFile('config.json', 'utf-8', (err,text) => {
        if (err) {
            console.warn('Could not read conf file:', err);
        } else {
            Object.assign(options, JSON.parse(text));
        }

        startProgram(options);
    });
    ```

* `fs.readFile()` takes a two parameter callback as the last arg
* Reads the file asynchronously, invokes the callback
* Node also defines multiple event-based APIs
* Following shows an HTTP request for the contents of a URL
* Two layers of async code handled by event listeners, registered with `on()`

    ```JavaScript
    const https = require('https');

    function getText(url, callback) {
        request = https.get(url);

        request.on('response', response => {
            // body not yet rec'd, only headers
            let httpStatus = response.statusCode;
            // register more handlers for the body's arrival
            response.setEncoding('utf-8');
            let body = "";
            
            // this is called when a chunk is ready
            response.on('data', chunk => { body += chunk });
        
            // called when response is complete
            response.on('end', () => {
                if (httpStatus === 200) {
                    callback(null, body);
                } else {
                    callback(httpStatus, null);
                }
            });
        });

        // event handler for errors
        request.on('error', (err) => {
            callback(err, null);
        });
    }
    ```

## 8.2 Promises

* Core language feature for simplifying async programming
* A `Promise` is an object that represents the result of an async computation
* You can't get the value of a Promise synchronously, by design--you can only ask it to execute a callback when the value is ready
* At the simplest level Promises are just a different way of working with callbacks
* One drawback to callback based async programming is ending up with deeply nested callbacks that get difficult to parse
* Promises let you express that as a more linear 'promise chain'
* Callbacks can also make error handling difficult
* If an async function (or async invoked callback) throws an exception, there's no way for that exception to propagate back to the initiator of the async operation. That's basic to async programming--breaks exception handling.
* Alternative is to track and propagate errors with callback args and return values, but it's tedious and difficult
* Promises give a standardized way to handle errors, and provide a way for errors to propagate correctly through a chain of promises
* Promises represent the future results of single async computations
* They can't be used to represent _repeated_ async computations
* You can use a Promise based alternative to `setTimeout()`, but NOT `setInterval()`
* You could use a Promise instead of the `load` event handler to `XMLHttpRequest`, since that callback is only called once, but you couldn't use it in place of a click handler to an HTML button, since you normally want a button to be clickable multiple times
* Following subsections:
    * explain Promise terminology and show basic usage
    * show how to chain promises
    * demonstrate how to create Promise-based APIs
* Promises seem simple, but can become very confusing beyond simplest use cases. They're powerful but have to be used correctly and confidently

### 8.2.1 Using Promises

* Hypothetical: a variant on `getText()` from above, `getJSON()`, which parases the body of an HTTP response as JSON and returns a Promise instead of accepting a callback argument.
* Usage of such a function:

    ```JavaScript
    getJSON(url).then(jsonData => {
        // callback fn, asynchronously invoked with parsed JSON 
        // when that becomes available
    });
    ```

* The actual `getJSON` function starts an async HTTP request for a given URL, and returns a Promise object while the request is still pending.
* The Promise object defines a `then()` instance method, which we pass our callback to (instead of passing directly to getJSON)
* Think of `then()` as a callback registration method like `addEventListener()`
* If you call `then()` multiple times, each of the functions you specify will be called when the promised computation is complete.
* Unlike some event listeners though, a Promise represents a single computation, and each function registered via `then()` will be invoked only once
* Note that the fn you pass to `then()` is invoked asynchronously even if the async computation is already complete when you call `then()`
* At a syntactical level, `then` is the distinctive feature of Promises
* It's idiomatic to append `.then()` to the function invocation that returns the Promise, without assigning the Promise object to a variable.
* Also idiomatic to name functions that return Promises and functions that use the results of Promises with verbs, for code readability:

    ```JavaScript
    function displayUserProfile(profile) { /* ... */ }

    // using that function with a Promise
    getJSON('/api/user/profile').then(displayUserProfile);
    ```

#### Handling Errors with Promises

* Async ops can fail in a bunch of ways
* You have to write code to handle the errors that'll come up
* For promises, you can pass a second function to `then()`

    ```JavaScript
    getJSON('/api/user/profile').then(displayUserProfile, handleProfileErr);
    ```

* Because promises can't return synchronously, they can't throw an exception that'll be caught by the original caller
* When a Promise-based async computation succeeds, it passes its result to the callback passed as the first argument to `then()`
* On exception, it passes the exception (typically an `Error` object of some sort) to the second callback passed to `then()`
* In practice it's rare to see two functions passed to `then()`, because there's a more idiomatic way to deal with errors arising in Promises
* Consider the case where
    * `getJSON()` executes normally, and thus passes to `displayUserProfile`
    * an exception occurs within `displayUserProfile()`
* `displayUserProfile()` is also invoked asynchronously, so can't meaningfully return its exception to the caller (getJSON)
* The idiomatic solution is a `catch()` method:

    ```JavaScript
    getJSON('/api/user/profile')
      .then(displayUserProfile)
      .catch(handleProfileErr);
    ```

* A normal result is passed to the callback supplied to `then`, but any error in EITHER `getJSON` or `displayUserProfile` will propagate to the error handling function via the `catch()`
* `catch()` is equivalent to `.then(null, errHandlerFn)`

#### Promise Terminolgy

* Fulfilled - a Promise is fulfilled if and when the first callback is called
* Rejected - if and when the second callback is called
* Pending - neither fulfilled or rejected
* Note that 'fulfilled' and 'rejected' are terminal states--you can only go from 'pending' to either of those, not switch back and forth once decided
* Important to remember that a Promise is an object representing the result of an async operation, not just an abstract way of registering callbacks
* If a Promise is fulfilled, the object becomes the return value of the code
* If a Promise is rejected, the object becomes the Error object (or whatever the error handler returns)
* Any settled Promise has a value, which will not change.
* There is also a 'resolved' state, discussed later

### 8.2.2 Chaining Promises

* One of the biggest benefits is the ability to express a sequence of async operations as a linear chain of `then()` invocations
* Example:

    ```JavaScript
    wait(2000)
        .then( () => wifi.stopAP() )
        .then( () => wait(5000) )
        .then( () => wifi.defineNetwork(ssid, password) )
        .then( () => waitForWifi(20, 3000) )
        .then( () => runNextStageAndExit() )
        .catch( () => {
            console.error("Failed to bring up wifi in handle Connect()");
        }
    );
    ```

* XMLHttpRequest has largely been replaced by the Fetch API, which is Promise based
* In simplest form, the API is just `fetch(some_url)`, which returns a Promise
* The promise is fulfilled when the HTTP response starts to arrive, and the HTTP status and headers are available. So for example:

    ```JavaScript
    fetch('/api/user/profile').then(response => {
        // on resolve, we have status and headers
        let ctype = 'application/json';
        if (response.ok && response.headers.get('Content-Type') === ctype) {
            // can't do much here without the body, which may not be available
        }
    });
    ```

* The Response object you get on fulfillment gives you access to status and headers, and methods `text()` and `json()`, for accessing the body
* Those methods themselves return Promises for when the body arrives
* Naive way of using `fetch()` and `Response.json()` to get the body:

    ```JavaScript
    fetch('/api/user/profile').then(response => {
        response.json().then(profile => {
            // when the body arrives, it will be parsed as json
            // the resulting object is passed to this function
        });
    });
    ```

* That's a nested way of doing it, which is bad
* The preferred idiom is using Promises in a sequential chain:

    ```JavaScript
    fetch('/api/user/profile')
        // invoke a callback on the Promise returned by fetch()
        .then(response => {
            // return the Promise returned by json()
            return response.json();
        })
        .then(profile => {
            // act on the Promise returned by json()
            displayUserProfile(profile);
        });
    ```

* Some method chaining (like in jQuery) has each step in the chain return the object itself to the next step in the chain. That's not how Promises work.
* A chain of `.then()` calls is passing new Promise objects at each step
* Abstracted, simplified example with line numbers:

    ```JavaScript
    1: fetch(someURL)          // task 1, returns Promise 1
    2:     .then(callback1)    // task 2, returns Promise 2
    3:     .then(callback2);   // task 3, returns Promise 3
    ```

* What it's doing:
    1. `fetch` is task 1 (line 1), and
        1. initiates a GET
        1. returns a Promise (Promise 1)
    1. `then(callback1)` (line 2)
        1. is being invoked on Promise 1
        1. passes `callback1` to invoke when Promise 1 is fulfilled
        1. stores `callback1` somewhere
        1. returns a new Promise (Promise 2)
        1. when `callback1` is invoked, 'task 2' begins
    1. `then(callback2)` (line 3)
        1. is being invoked on Promise 2
        1. passes `callback2` to invoke when Promise 2 is fulfilled
        1. returns a new Promise (Promise 3)
        1. when `callback2` is invoked, 'task 3' begins
    1. All above steps happen synchronously during the first expression's execution
    1. Now there is an async pause while the HTTP request in task 1 goes out
    1. The HTTP response starts to arrive, and the async part of `fetch()` wraps the HTTP status and headers in a `Response` object and fulfills Promise 1 with that Response object as the value
    1. When Promise 1 is fulfilled, its value (the Response object) is passed to `callback1()`, and task 2 begins
    1. Task 2's job is to take the Response object as input, and get the response _body_ as a JSON object
    1. If task 2 completes normally and can parse the body of the HTTP response into a JSON object, that object fulfills Promise 2
    1. That JSON object (as Promise 2) becomes the input to task 3 when passed to `callback2()`
    1. Task 3 now displays the data to the user in some way. 
    1. When task 3 is complete, Promise 3 is fulfilled.
    1. Nothing happens when Promise 3 settles, and the chain of async ops ends.

### 8.2.3 Resolving Promises

* In the above there's actually a fourth Promise object
* `fetch()` returns a Promise object that passes a Response object on fulfillment
* That object has `.text()`, `.json()`, etc. to request the HTTP body
* Since the body may not have arrived, those methods must pass Promises
* In the above, task 2 calls `.json()` and returns its value
* That value is the fourth Promise object, and is the return from `callback1()`
* Code rewritten in a verbose, non-idiomatic way to make the callbacks and promises explicit:

    ```JavaScript
    function c1(response) {              // callback 1
        let p4 = response.json();
        return p4;
    }

    function c2(profile) {               // callback 2
        displayUserProfile(profile);
    }

    let p1 = fetch('/api/user/profile'); // promise 1, task 1
    let p2 = p1.then(c1);                // promise 2, task 2
    let p3 = p2.then(c2);                // promise 3, task 3
    ```

* When you pass a callback, `c`, to the `then()` method, it returns a Promise, `p` and arranges to asynchronously invoke `c` at some later time.
* The callback performs some computation, and returns a value `v`
* When the callback returns, `p` is 'resolved' with the value `v`
* *When a Promise is resolved with a value that is not itself a Promise, it is immediately fulfilled with that value.*
* If `v` is itself a Promise, then `p` is 'resolved but not yet fulfilled'
* In that case, `p` cannot settle until `v` setttles
* If `v` is fulfilled, then `p` will be fulfilled to the same value.
* If `v` is rejected, then `p` will also be rejected
* This is the previously mentioned 'resolved' state of a Promise--unclear whether it will be fulfilled or rejected, but the callback `c` no longer has any control over that. 

### 8.2.4 More on Promises and Errors

* While you _can_ pass two callbacks to `then()`, where the second is an error handler, it's more common to add a `catch()` to the Promise chain
* Author wants to stress the importance of error handling code in async code

#### The catch and finally methods

* Given any promise `p` and a callback `c`, these are equivalent:

    ```JavaScript
    p.then(null, c)
    p.catch(c)
    ```

* Better to use `catch` because it's easier to read
* In sync code, an exception bubbles up the call stack
* In async code with Promise chains, the error sort of trickles down the chain until it encounters a `catch` call
* In ECMAScript 2018, Promise objects also have `finally()`
* Purpose of `finally()` is similar to that in `try/catch/finally` statement
* Adding `.finally(callbackFinal)` means that `callbackFinal` is invoked when the Promise you called it on settles.
* It's invoked whether the Promise fulfills or rejects, and it is not passed any arguments, so you can't actually have it know the status of the Promise
* It's there for cleanup, like closing file handles, network connections, etc.
* Version of the code that has error handling:

    ```JavaScript
    fetch('/api/user/profile')
        .then(response => {
            if (!response.ok) {
                return null;
            }

            let type = response.headers.get('content-type');
            if (type !== 'application/json') {
                throw new TypeError(`Expected JSON, got ${type}`);
            }

            return response.json();
        })
        .then(profile => {  // called with parsed response body or null
            if (profile) {
                displayUserProfile(profile);
            } else {
                displayLoggedOutProfilePage();
            }
        })
        .catch(e => {
            if (e instanceof NetworkError) {
                displayErrorMessage('Check internet connection');
            }
            else if (e instanceof TypeError) {
                displayErrorMessage('Something wrong with server');
            } else {
                console.error(e);
            }
        });
    ```

* It's idiomatic to end every promise chain with a `.catch()` to clean up / log any errors that occurred in the chain
* You can also use it anywhere else in the chain
* If one of the stages in the chain can fail with a recoverable error, you can insert a catch call in the chain, something like:

    ```JavaScript
    startAsyncOperation()
        .then(doStageTwo)
        .catch(recoverFromStageTwoError)
        .then(doStageThree)
        .then(doStageFour)
        .catch(logStageThreeAndFourErrors);
    ```

* The catch callback is ONLY invoked if an error gets to that stage
* Otherwise skipped, and the return of the previous callback becomes the input the next `then()` callback
* Once an error is passed to a `.catch()` callback, it stops propagating down the promise chain
* A `catch()` can throw a _new_ error, but if it returns normally then that return value is used to resolve and/or fulfill the associated promise and the error stops propagating
* It may be the case that transient network failures come up some percent of the time in async promise chains. May be worth it to put in a single retry:

    ```JavaScript
    // go from this
    queryDatabase()
        .then(displayTable)
        .catch(displayDatabaseError);

    // to this
    queryDatabase()
        .catch(e => wait(500).then(queryDatabase)) // on fail, wait then retry
        .then(displayTable)
        .catch(displayDatabaseError);
    ```

#### Returning from a Promise Callback

* Back on the example above with `c1` callback
* Three ways for `c1` to terminate:
    * return normally with the Promise returned by `.json()`, which causes `p2` to be resolved, though whether `p2` is fulfilled/rejected depends on what happens with the returned Promise
    * can return normally with `null` which causes `p2` to be fulfilled immediately
    * can terminate by throwing an error, causing `p2` to be rejected
* Those are the three possible outcomes for a Promise
* In a Promise chain, the value returned/thrown at one stage of the chain becomes the input to the next stage
* Forgetting to return a value from a callback is a common source of Promise related bugs, and that's exacerbated by the fat arrow shortcut syntax
* Consider: `.catch(e => wait(500).then(queryDatabase))`
* Shortcuts used/allowed there:
    * one argument, so you omit the parens
    * fn body is a single expression, so omit the curly braces
    * consequently, value of the single expression becomes the return value
* However: `.catch(e => { wait(500).then(queryDatabase) })`
* Adding braces means you no longer get the automatic return from the single statement, so now the function returns `undefined` instead of a Promise, so the next stage is invoked with `undefined` as input

### 8.2.5 Promises in Parallel

* Sometimes you just want to run a bunch of async ops in parallel
* `Promise.all()` can do that
* It takes an array of Promise objects as input, and returns a Promise
* The returned Promise will be rejected if ANY of the input Promises are
* Otherwise it is fulfilled with an array of the fulfillment values of each input promise
* Example of fetching text content of multiple URLs:

    ```JavaScript
    const urls = [ /* zero or more urls */ ];

    promises = urls.map(url => fetch(url).then(r => r.text()));

    Promise.all(promises)
        .then(bodies => { /* do something with array of strings */ })
        .catch(e => console.error(e));
    ```

* The input array can contain both Promise and non-Promise values
* If an element is NOT a Promise, it's treated as if it's the value of an already fulfilled Promise, and is simply copied unchanged into the output array.
* Sometimes you want to run a number of Promises in parallel, but may only care about the value of the first to fulfill. For that use `Promise.race()`
* That reutnrs a Promise that is fulfilled or rejected when the first of the Promises in the input array is fulfilled or rejected. If there are any non-Promise values in the input, it just returns the first of those.

### 8.2.6 Making Promises

* The code above has relied on `fetch()` because it's one of the few functions in a browser environent that returns a Promise
* Also relied on hypothetical functions like `getJSON()` and `wait()`
* Functions written to return Promises are useful, this section covers how to write Promise-based APIs

#### Promises based on other promises

* Easy to write a function that returns a Promise if you have some other Promise-returning function to start with.
* Given a Promise, you can always create and return a new one by calling `.then()`
* If you use `fetch()`, you can write `getJSON()` as:

    ```JavaScript
    function getJSON(url) {
        return fetch(url).then(response => response.json());
    }
    ```

* Just allows the `json()` method to reject the promise it returns with a SyntaxError if the response body can't be parsed as JSON
* Now another Promise-returning function, with `getJSON()` as the source of the initial Promise:

    ```JavaScript
    function getHighScore() {
        return getJSON('/api/user/profile').then(profile => profile.highScore);
    }
    ```

#### Promises based on synchronous values

* Sometimes you need to implement a Promise based API and need to return a Promise from a function even though the computation to be performed does not actually require any async operations.
* For that, use `Promise.resolve()` and `Promise.reject()`
* `.resolve()` takes a value as its one arg, returns a Promise that immediately (though still asynchronously) is fulfilled to that value.
* `.reject()` takes a single argument and returns a Promise that will be rejected with that value as the reason.
* Note that they are not _already_ fulfilled/rejected, but immediately become that after the current synchronous chunk finishes running.
* It's possible but unusual to write a Promise-based function where the value is computed synchronously and return asynchronously via `Promise.resolve()`
* However it's pretty common to have synchronous special cases within an async function, and you can handle those special cases with `Promise.resolve()` and `Promise.reject()`
* Particularly, if you detect error conditions like bad args before starting an async operation, you can report that by returning a Promise created with `Promise.reject()`
* Sometimes `Promise.resolve()` is used to create the initial Promise in a chain

#### Promises from scratch

* If you can't use an existing promise returning function to start off, you get your initial promise via the `Promise()` constructor
* You invoke the constructor, with a function as its only argument
* The function should expect two parameters which, by convention, are `resolve` and `reject`
* The constructor synchronously calls your function with args for those params
* The constructor then returns the newly created Promise
* That Promise is under the control of the function you passed to the constructor
* It should perform some async operation and then call the `resolve` function to resolve or fulfill the returned Promise, or call the `reject` function to reject the returned Promise
* The function you pass to the constructor does not have to be asynchronous--it can call `resolve` or `reject` synchronously, but the Promise will still be resolved, fulfilled, or rejected asynchronously
* Can be hard to understand the functions passed to a function passed to a constructor by just reading about
* Example of how to write the `wait()` function cited previously:

    ```JavaScript
    function wait(duration) {
        // create and return a new Promise
        return new Promise( (resolve, reject) => {
            // argument validation
            if (duration < 0) {
                reject(new Error('negative duration not allowed'));
            }

            // otherwise wait asynchronously, then resolve the promise
            // setTimeout invokes resolve() with no args, which means
            // that the Promise will fulfill with the undefined value
            setTimeout(resolve, duration);
        });
    }
    ``` 

* Another example of using the Promise() constructor, which implements `getJSON` in Node, where you don't have the `fetch()` API built in:

    ```JavaScript
    const http = require('http');

    function getJSON(url) {
        return new Promise( (resolve, reject) => {
            request = http.get(url, response => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP status ${response.statusCode}`));
                    response.resume(); // don't leak memory
                }
                else if (response.headers['content-type'] !== 'application/json') {
                    reject(new Error('Invalid content-type'));
                    response.resume();
                }
                else {
                    let body = '';
                    response.setEncoding('utf-8');
                    response.on('data', chunk => { body += chunk; });
                    response.on('end', () => {
                        // when body is complete, attempt parsing
                        try {
                            let parsed = JSON.parse(body);
                            resolve(parsed);
                        }
                        catch(e) {
                            reject(e);
                        }
                    });
                }
            });
            // also reject if the request fails before a response is rec'd
            request.on('error', error => {
                reject(error);
            });
        });
    }
    ```

### 8.2.7 Promises in Sequence

* `Promise.all()` makes it easy to run n Promises in parallel
* Promise chains make it easy to run a fixed sequence of promises
* Difficulty is running an arbitrary number of Promises in sequence
* Hypothetical problem: an array of URLs to fetch, in sequence
* If the array is arbitrarily long, you can't write a promise chain in advance, so you have to build one dynamically:

    ```JavaScript
    function fetchSequentially(urls) {
        const bodies = [];

        function fetchOne(url) {
            return fetch(url) {
                .then(response => response.text())
                .then(body => {
                    bodies.push(body);
                });
    }

    // start with an already fulfilled promise, with value undef
    let p = Promise.resolve(undefined);

    // loop over urls, building a Promise chain of arbitrary length, 
    // fetching one URL at each stage of the chain
    for (url of urls) {
        p = p.then( () => fetchOne(url) );
    }

    // when the last promise in the chain is fulfilled, the bodies
    // array is ready, so return a promise for that array.
    // Not including any error handlers--errors propagate to the caller
    return p.then( () => bodies );
    ```

* Usage:

    ```JavaScript
    fetchSequentially(urls)
        .then(bodies => { /* do something with array of strings */ })
        .catch(e => console.error(e));
    ```

* There's a different, possibly more elegant approach to the problem
* Instead of creating the Promises in advance, you can have the callback for each Promise create and return the next Promise
* Our code returns the first/outermost Promise, knowing it will eventually fulfill or reject to the same value that the last/innermost Promise does
* Here's a `promiseSequence()` generic function:

    ```JavaScript
    // takes an array of input values and a "promiseMaker" function
    // for any input x, promiseMaker(x) should return a Promise
    // that will fulfill to an output value
    // Overall this function returns a Promise that fulfills to an
    // array of the computed output values.
    //
    // Note that this creates and runs the Promises one by one,
    // and does not call promiseMaker() for an input until the previous
    // Promise has been fulfilled.

    function promiseSequence(inputs, promiseMaker) {
        // copy the array to modify
        inputs = inputs.slice();

        // pseudo-recursive fn to use as a Promise callback
        function handleNextInput(outputs) {
            if (inputs.length == 0) {
                return outputs;
            } else {
                nextInput = inputs.shift();
                return promiseMaker(nextInput)
                    .then(output => outputs.concat(output))
                    .then(handleNextInput);
            }
        }
        
        // start with a promise that fulfills to an empty array,
        // use the handleNextInput fn as its callback
        return Promise.resolve([]).then(handleNextInput);
    }
    ```

* Usage:

    ```JavaScript
    // given a URL, return a Promise that fulfills to the body text
    function fetchBody(url) { return fetch(url).then( r => r.text() ); }

    // use it to sequentially fetch URL bodies
    promiseSequence(urls, fetchBody)
        .then(bodies => { /* do something with array of strings */ })
        .catch(console.error);

    ```

## 8.3 async and await

* ECMAScript 2017 introduced `async` and `await`
* They simplify the use of promises, let you write promise-based async code that reads more like synchronous code that blocks while waiting for async events
* Lots of the complexity of Promises vanishes when you use them with async/await

### 8.3.1 await Expressions

* `await` takes a Promise and turns it back into a return value or a thrown expression
* Given a Promise `p`, `await p` waits until `p` settles
* If `p` fulfills, the value of the fulfillment is the value of the await statement
* If `p` rejects, `await p` is the value of the rejection
* Typically you don't use it with a variable that holds a Promise, you use it before the invocation of a function that returns a Promise:

    ```JavaScript
    let response = await fetch('/api/user/profile');
    let profile = await response.json();
    ```

* Note that the code remains asynchronous--it isn't blocking until it returns.

### 8.3.2 async Functions

* Any code that uses `await` is itself asynchronous, which means there is one critical rule: *you can only use `await` inside functions that have been declared with the `async` keyword.*
* Example:

    ```JavaScript
    async function getHighScore() {
        let response = await fetch('/api/user/profile');
        let profile = await response.json();
        return profile.highScore;
    }
    ``` 

* Declaring an `async` function means that the return value of the function will be a Promise even if no Promise-related code appears in the body of the function
* If an async fn looks like it returns normally, what is actually happening is that the Promise object that's the _real_ return value just resolves to that return value.
* Similarly, if an async fn looks like it throws an exception, then the Promise object that's really returned is rejected with that exception.
* Because the above function is async, it returns a Promise, and therefore you can use the await keyword with it:

    ```JavaScript
    displayHighScore( await getHighScore() );
    ```

* But that only works if _that_ call is inside another async function!
* If you're _not_ in an async function, you have to treat the return of an async function as a regular Promise:

    ```JavaScript
    getHighScore().then(displayHighScore).catch(console.error);
    ```

* You can use `async` with any kind of function:
    * with the `function` keyword
    * with expressions
    * with arrow functions
    * with method shortcut form in classes / object literals

### 8.3.3 Awaiting Multiple Promises

* Say you wrote the `getJSON()` fn with `async`, and wanted to fetch two JSON values with it:

    ```JavaScript
    async function getJSON(url) {
        let response = await fetch(url);
        let body = await response.json();
        return body;
    }

    let value1 = await getJSON(url1);
    let value2 = await getJSON(url2);
    ```

* The above is unnecessarily sequential--fetch of the second URL waits for the first fetch to complete. If you can do it in parallel you probably should
* You can use `Promise.all()` to await a set of concurrently executing async functions:

    ```JavaScript
    let [ value1, value2 ] = await Promise.all( [getJSON(url1), getJSON(url2) ]);
    ```

### 8.3.4 Implementation Details

* Helps to understand async fn to know what's going on under the hood
* You can think of these as equivalent:

    ```JavaScript
    async function f(x) { /* body */ }

    // is really like a Promise returning function wrapped around the
    // body of the original function:

    function g(x) {
        return new Promise( function (resolve, reject) {
            try {
                resolve( (function(x) { /* body */ })(x) );
            }
            catch(e) {
                reject(e);
            }
        });
    }
    ```

* Think of await in terms of a syntax transformation, like the above--but think of it as a marker that breaks a function body up into separate, asynchronous chunks.

## 8.4 Asynchronous Iteration

* Promises are useful for single-shot async computations, but not for use with sources of repetitive async events like `setInterval()` or click events in a browser, or the `data` event on a Node stream
* Since single Promises don't work for sequences of async events, you also can't use regular async functions and the await statements for those things.
* ECMAScript 2018 has a solution--async iterators that are Promise based

### 8.4.1 the for/await loop

* Node 10 readable streams are asynchronously iterable, so you can read successive chunks of data from a stream with a `for/await` loop:

    ```JavaScript
    const fs = require('fs');

    async function parseFile(filename) {
        let stream = fs.createReadStream(filename, { encoding: 'utf-8' });

        for await(let chunk of stream) {
            parseChunk(chunk);  // assume this fn exists
        }
    }
    ```

* Like a regular await expression, the for/await loop is Promise based
* In general terms:
    * the async iterator produces a Promise
    * the for/await loop waits for that Promise to fulfill
    * the loop assigns the fulfillment value to the loop variable
    * the loop runs the body of the loop
    * then it starts over, getting another Promise from the iterator
* If you have an array of URLs, you can use fetch and Promise.all() to wait for them all to be fulfilled. However, if you want the results of the first fetch as soon as its available, you have to use a different method:

    ```JavaScript
    const urls = [url1, url2, url3];

    const promises = urls.map( url => fetch(url) );

    // you _could_ use a regular loop, since promises is an array:
    //
    // for (const promise of promises) {
    //     response = await promise;
    //     handle(response);
    // }

    // however since the iterator returns promises, you can use for/await:

    for await(const response of promises) {
        handle(response);
    }
    ```

* In the `for/await` version of the loop, it builds the `await` call into the loop, but otherwise does exactly the same thing as the normal for loop
* Note that in this case, we're using `for/await` with a regular iterator--the following covers async iterators

### 8.4.2 Asynchronous Iterators

* An 'iterable' object is one that can be used with `for/of`
* It defines a method with the name `Symbol.iterator`, which returns an iterator object
* Iterator objects have a `next()` method that can be called repeatedly, and which returns `iteration result` objects, which have a `value` property, and/or a `done` property
* Async iterators are similar, with two important differences:
    * the iterable object implements a method with the symbolic name `Symbol.asyncIterator` instead of `Symbol.iterator`
    * it returns a Promise that resolves to an iterator result object, instead of returning an iterator result object directly

### 8.4.3 Asynchronous Generators

* The easiest way to implement an iterator is often to use a generator
* You can do it for async iterators by implementing a generator fn declared async
* You can use `await` against an async generator, and `yield` inside it
* However, yielded values are automatically wrapped in Promises
* The syntax for async generators is a combination of
    * `async function`
    * `function *`
* into `async function *`
* Example that shows how to use an async generator and a for/await loop to repetitively run code at fixed intervals, using loop syntax instead of `setInterval`

    ```JavaScript
    // promise-based wrapper around setTimeout that allows await
    // returns a Promise that fulfills in specified ms
    function elapsedTime(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // async generator fn that increments a counter, yields it
    // a certain number of times (or infinitely) at an interval
    async function* clock(interval, max=Infinity) {
        for (let count = 1; count <= max; count++) {
            await elapsedTime(interval);
            yield count;
        }
    }

    // test fn using the async generator
    async function test() {
        for await (let tick of clock(300,100)) { // loop 100x per 300ms
            console.log(tick);
        }
    }
    ```

### 8.4.4 Implementing Asynchronous Iterators

* You can implement async iterators without async generators if you define an object with a `Symbol.asyncIterator()` method that returns an object with a `next()` method that returns a Promise that resolves to an iterator result object.

    ```JavaScript
    function clock(interval, max=Infinity) {
        function until(time) {
            return new Promise( resolve => setTimeout(resolve, time - Date.now()));
        }

        // return an async iterable object
        return {
            startTime: Date.now(),
            count: 1,
            async next() {
                if (this.count > max) {
                    return { done: true };
                }

                let targetTime = this.startTime + this.count * interval;
                
                await until(targetTime);

                return { value: this.count++ };
            },

            // this method means this iterator object is also an iterable
            [ Symbol.asyncIterator ]() { return this; }
        };
    }
    ```

## 8.5 Summary
