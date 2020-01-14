# Async JavaScript Cheatsheet

Based on chapter 8 of _JavaScript: The Definitive Guide, 7th ed._

## Overview

JavaScript up to a couple years ago had two main ways to execute code asynchronously: timers and events. Timers were managed via functions like `setTimeout(callback, ms)` (for a single invocation) and `setInterval(callback, ms)` (for repeating invocations). Events (user initiated or otherwise) were linked to event handlers, which were callback functions that would fire when the event was emitted.

Timers and events are still around, but in new, fancy JS, async operations are primarily based around 'Promises.' A Promise is a specific kind of JS object whose purpose is to represent the end state (good or bad) of an asynchronous computation.

In essence Promises are simply a different means of working with callback functions. They address however one of the unfortunate parts of callback-based asynchronous code, which is that callbacks tend to get progressively more nested, and thus more difficult to read and understand.

Promises are an improved way of managing callbacks primarily due to what are called "promise chains," which allow you to linearly register a series of callback functions. Those functions then execute in sequence, each operating on the output of the previous one. For example:

```JavaScript
// start with a function which returns a Promise object
someAsyncTask()                 // runs async task 1, returns Promise 1
    .then(taskTwoCallback)      // runs task 2 on Promise 1 value, returns Promise 2
    .then(taskThreeCallback)    // runs task 3 on Promise 2 value, returns Promise 3
    .catch(errorHandler)        // catches errors from any previous stage
    .finally(cleanupFunction);  // runs cleanup code only, no access to Promises
```

Promises may be processed sequentially or in parallel, as standalone code blocks or in batches. Additionally you can write Promise-based code dynamically, to allow asynchronous construction and processing of arbitrarily long callback sequences.

Two additional language keywords were introduced in ECMAScript 2017, to simplify Promise usage, and make asynchronous code read more like synchronous code:

* `async` - designates a function as asynchronous, causing its return value to be a Promise _even if no Promise-related code appears in the function body_
* `await` - within (and *only* within) an async function, converts a Promise into its eventual return value or thrown error

Declaring a function with the `async` keyword can be seen as equivalent to wrapping a Promise returning decorator around your function's body, something like:

```JavaScript
// using the async keyword:

async function f(x) { /* function body */ }

// can be viewed functionally as:

function g(x) {
    return new Promise( function(resolve, reject) {
        try {
            resolve( (function(x) { /* function body */ })(x) );
        }
        catch(e) {
            reject(e);
        }
    });
}
```

Building on Promises, `await`, and `async`, several other pieces of async JavaScript are worth noting:

* Asynchronous iteration via the `for`/`await` loop:

    ```JavaScript
    const fs = require('fs');

    async function parseFile(filename) {
        let stream = fs.createReadStream(filename, { encoding: 'utf-8' });

        for await(let chunk of stream) {
            parseChunk(chunk);
        }
    }
    ```

* Asynchronous iterators and iterables, which are those able to be used with the `for`/`await` loop construct
* Asynchronous generators, which can implement async iterators/iterables

## Details

### Promises

* *Basics*
    * A Promise is an object whose purpose is to represent the future result of an asynchronous computation.
    * By design, you cannot get the value of a Promise synchronously.
    * Promise values can _only_ be accessed by a callback invoked by the Promise object when the Promise resolves.
    * A Promise cannot be used to represented repeated asynchronous computations--one Promise will resolve to one result.


### async and await

### 
