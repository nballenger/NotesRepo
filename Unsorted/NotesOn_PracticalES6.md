# Notes on Practical ES6

By Wright, Fischer, Cox, et al; SitePoint, May 2018; ISBN 9780648331513

# Chapter 1: New Keywords: let and const

* `let` allows block scope enforcement
* `const` creates immutable scalar vars, immutable object/array references

# Chapter 2: Using Map, Set, WeakMap, WeakSet

* Four new data structures
* ES5 objects could simulate hashes, but there are/were downsides to that
    * Keys must be strings in ES5
    * Objects not inherently iterable
    * Challenges with built-in method collisions on stuff like `constructor`, `toString`, `valueOf`

## ES6 Map Collections

* Maps are k/v collections of any type
* Creating a map and using common methods

    ```JavaScript
    const map = new Map();
    map.set('hobby', 'cycling');    // sets kv pair

    const foods = { dinner: 'Curry', lunch: 'Sandwich', breakfast: 'Eggs' }
    const normalfoods = {};

    map.set(normalfoods, foods);    // sets objects as kv pair

    for (const [k,v] of map) {
        console.log(`${key} = ${value}`);
    }

    map.forEach((value,key) => {
        console.log(`${key} = ${value}`);
    }, map);

    map.clear();    // clears kv pairs
    console.log(map.size === 0);        // true
    ```

### Using the Set collection

* Sets are ordered lists of unique values
* Accessed by keys, not indexes
* Crucial Set methods:

    ```JavaScript
    const planetsOrderFromSun = new Set();
    planetsOrderFromSun.add('Mercury');
    planetsOrderFromSun.add('Venus').add('Earth').add('Mars');
    console.log(planetsOrderFromSun.has('Earth'));

    planetsOrderFromSun.delete('Mars');

    for (const x of planetsOrderFromSun) { console.log(x); }
    console.log(planetsOrderFromSun.size);

    planetsOrderFromSun.add('Venus');   // fails silently
    planetsOrderFromSun.clear();
    ```

### Weak Collections, Memory, and GC

* GC in javascript removes objects that are no longer referenced
* Map and Set references are strongly held, do not allow for GC
* That can get expensive, which is why there are WeakMap and WeakSet

### WeakMap

* Similar to Maps, but with fewer methods and can be garbage collected
* Can be used to keep an object's data private, or track DOM nodes/objects
* Private data:

    ```JavaScript
    var Person = (function() {
        var privateData = new WeakMap();

        function Person(name) {
            privateData.set(this, { name: name });
        }

        Person.prototype.getName = function() {
            return privateData.get(this).name;
        };

        return Person;
    }());
    ```

### WeakSet

* Sets that can be garbage collected
* Don't allow iteration
* Limited use cases at time of writing
* Can be used to tag objects without mutating them

### Records vs ES6 collections

* MDN questions to determine when to use an object or a keyed collection:
    * Are keys unknown until runtime? Do you need to dynamically look them up?
    * Do all values have the same type? Can the values be used interchangeably?
    * Do you need non-string keys?
    * Are kv pairs often added or removed?
    * Do you have an arbitrary (easily changing) amount of kv pairs?
    * Is the collection iterated?

# Chapter 3: New Array. and Array.prototype. methods

* Below, class methods are `Array.whatever()`, instance methods are `Array.prototype.whatever()`

## Array.from()

* Creates a new Array instance from an array-like or iterable object
* Syntax: `Array.from(arrayLike[, mapFn[, thisArg]])`
* Params in that syntax
    * `arrayLike` - array like or iterable object
    * `mapFn` - fn to call on every element
    * `thisArg` - value to use as the `this` context of `mapFn` function
* Example that creates a function to accept variable number of args, returns an array with the elements doubled:

    ```JavaScript
    function double(arr) {
        return Array.from(arguments, function(elem) { return elem * 2; });
    }

    const result = double(1,2,3,4);

    console.log(result);
    ```

## Array.prototype.find()

* Syntax: `Array.prototype.find(callback[, thisArg]);
* Callback function gets three params:
    * `element` - current element
    * `index` - index of current element
    * `array` - array used to invoke the method
* Method returns a value in the array if it satisfies the callback, or `undefined`
* Callback executed once for every value until it finds the first truthy value
* Example:

    ```JavaScript
    const arr = [1, 2, 3, 4];
    const result = arr.find(function(elem) { return elem > 2; });
    console.log(result);    // prints 3
    ```

## Array.prototype.findIndex()

* Returns an index or -1 on failure
* Example:

    ```JavaScript
    const arr = [1, 2, 3, 4];
    const result = arr.findIndex(function(elem) { return elem > 2; });
    console.log(result);    // prints 2, index of value '3'
    ```

## Array.prototype.keys() and .values()

* Returns a new `Array Iterator` containing the keys of the array's values
* Example:

    ```JavaScript
    const arr = [1, 2, 3, 4];
    const iterator = arr.keys();

    let index = iterator.next();
    while(!index.done) {
        console.log(index.value);
        index = iterator.next();
    }

    const iterator2 = arr.values();
    let index2 = iterator2.next();
    while(!index2.done) {
        console.log(index2.value);
        index2 = iterator2.next();
    }
    ```

## Array.prototype.fill()

* Fills an array with a value from a start index to an end index (excluded)
* Syntax: `Array.prototype.fill(value[, start[, end]])`

# Chapter 4: New String Methods - String.prototype.

## String.prototype.startsWith()

* Syntax: `String.prototype.startsWith(searchString[, position])`
* Second argument is the position to start the search, default 0
* Method is case sensitive
* Example:

    ```JavaScript
    const str = 'hello!';
    let result = str.startsWith('he');
    console.log(result);                // true

    result = str.startsWith('ll', 2);   // start search at 3rd char
    console.log(result);                // true
    ```

## String.prototype.endsWith()

* Similar, but the position arg lets you search the string end as if it were that many characters long.
* Example:

    ```JavaScript
    const str = 'hello!';
    let result = str.endsWith('lo!');
    console.log(result);                // true

    result = str.endsWith('lo!', 5);    // searches 'hello'
    console.log(result);                // false
    ```

## String.prototype.includes()

* Returns true if a substring is contained in a string anywhere, else false
* Syntax: `String.prototype.includes(searchString[, position])`
* Position param is like `startsWith`
* Example:

    ```JavaScript
    const str = 'Hello everybody, my name is Bob.';
    let result = str.includes('Bob');

    console.log(result);                // true
    
    result = str.includes('Hello', 10);
    console.log(result);                // false
    ```

## String.prototype.repeat()

* Syntax: `String.prototype.repeat(times)`
* Passing zero returns empty string
* Passing negative or infinity raises `RangeError`

## String.raw()

* Tag function of template strings
* Compiles a string and replaces every placeholder with a provided value
* Syntax: ``String.raw`templateString` ``
* Example:

    ```JavaScript
    const name = 'Bob Bobson';
    const result = String.raw`Hello, my name is ${name}`;
    console.log(result);    // prints interpolated string
    ```

# Chapter 5: New Number Methods

## Boolean methods:

* `Number.isInteger(n)`
* `Number.isNaN(n)`
* `Number.isFinite(n)`
* `Number.isSafeInteger(n)`
    * new addition in ES6
    * A 'safe' integer satisfies:
        * Can be represented exactly as an IEEE-754 double precision number
        * That representation can't be the result of rounding
    * Safe range is `-(2^53 -1) to 2^53 - 1`, inclusive
    * There are also two related values:
        * `Number.MAX_SAFE_INTEGER`
        * `Number.MIN_SAFE_INTEGER`
* `Number.parseInt(string, radix)`
* `Number.parseFloat(string)`

# Chapter 6: ES6 Arrow Functions: Fat and Concise Syntax

* New syntax for functions, meant to save time and simplify function scope
* Came over from CoffeeScript
* Use the `=>` token
* Creates anonymous functions, change how `this` binds in functions
* They're similar to python lambadas
* Let you skip the `function` and `return` keywords, and braces

## Using Arrow Functions

```JavaScript
// basic syntax with multiple params
// (param1, param2, paramN) => expression

// ES5
var multiplyES5 = function(x,y) { return x * y; };

// ES6
const multiplyES6 = (x, y) => { return x * y; };

// in single expression form
const multiplyES6_shorter = (x, y) => x * y;


// basic syntax with one parameter
// ES5
var phraseSplitterES5 = function phraseSplitter(phrase) {
    return phrase.split(' ');
};

// ES6
const phraseSplitterES6 = phrase => phrase.split(" ");
console.log(phraseSplitterES6("ES6 funtime"));  // ["ES6", "funtime"]


// syntax with no parameters
// ES5
var docLogEs5 = function docLog() { console.log(document); }

// ES6
var docLogEs6 = () => { console.log(document); };
```

* Can be used to return an object literal expression
* To do so the body must be wrapped in parens, to distinguish between a block and an object, both of which use braces

    ```JavaScript
    // ES5
    var setNameIdsEs5 = function setNameIds(id, name) {
        return { id: id, name: name };
    };

    // ES6
    var setNameIdsEs6 = (id, name) => ({ id: id, name: name });
    ```

## Use Cases for Arrow Functions

* Common to use for array manipulation, like map or reduce on an array

```JavaScript
const smartPhones = [
    { name: 'iphone', price: 649 },
    { name: 'Galaxy S6', price: 576 },
    { name: 'Galaxy Note 5', price: 489 }
];

// Want to create an array of objects with just names or prices
// ES5
var prices = smartPhones.map(function(smartPhone) {
    return smartPhone.price;
});

// ES6
const prices = smartPhones.map(smartPhone => smartPhone.price);


// Array filtering
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// ES5
var divisibleByThreeES5 = array.filter(function (v) {
    return v % 3 === 0;
});

// ES6
const divisibleByThreeES6 = array.filter(v => v % 3 === 0);
```

## Promises and Callbacks

* Code with async callbacks or promises often uses `function` and `return` statements a bunch. When using promises, the function expressions are used for chaining.
* Example:

    ```JavaScript
    // ES5
    aAsync().then(function() {
        returnbAsync();
    }).then(function() {
        returncAsync();
    }).done(function() {
        finish();
    });

    // ES6
    aAsync().then(() => bAsync()).then(() => cAsync()).done(() => finish);
    ```

* Other benefit of arrow functions with promises and callbacks is to reduce confusion around what `this` refers to
* In ES5, you have to use `.bind`, or make a closure like `var self = this;`
* Since arrow functions let you retain the scope of the caller inside the function, you can skip all that.

    ```JavaScript
    // ES5
    API.prototype.get = function(resource) {
        var self = this;
        return new Promise(function(resolve, reject) {
            http.get(self.uri + resource, function(data) {
                resolve(data);
            });
        });
    };

    // ES6
    API.prototype.get = function(resource) {
        return new Promise((resolve, reject) => {
            http.get(this.uri + resource, function(data) {
                resolve(data);
            });
        });
    };
    ```

* Use function expressions if you need a dynamic `this`
* Use arrow functions for a lexical `this`

## Gotchas and Pitfalls of Arrow functions

* `call()`, `apply()`, and `bind()` will not change the value of `this` in arrow functions.
* Arrow functions cannot be used as constructors like other functions
* Don't attempt to use `new` with an arrow function
* Like built-in functions (methods), they do not have a prototype property or other internal methods. Use ES6 classes to create class-like objects
* Arrow functions cannot be used as generators, and `yield` causes them to error
* They don't have the local variable `arguments` like other functions

## How much use for arrow functions?

* Lars Schoning's team's decision on where to use them
    * Use `function` in the global scope and for `Object.prototype` properties
    * Use `class` for object constructors
    * Use `=>` everywhere else

# Chapter 7: Symbols and their uses

* New primitive type, for a unique token guaranteed to never clash with another symbol
* Think of them as a kind of UUID

## Creating new symbols

* You call the `Symbol` function, which is a standard function (not a constructor)
* Using it with `new` throws a `TypeError`
* Calling with no params guarantees you get back a unique identifier
* You can pass a label in as a param, which doesn't affect the symbol label, but is useful for debugging via the symbol's `toString()` method
* You can create multiple symbols with the same label, but there's no advantage to doing so
* Example:

    ```JavaScript
    let foo = Symbol();
    let bar = Symbol('baz');
    ```

## What can I do with symbols?

* Decent replacement for strings or integers as class/module constants
* Also useful as object property keys
* Symbol based keys will never clash (like string keys)
* They aren't enumerated in `for ... in` loops
* They're ignored by things like `Object.keys()`
* So they're ideal for properties you don't want to include when serializing
* Using symbols as keys doesn't guarantee privacy
* There are new tools to let you access symbol based property keys
    * `Object.getOwnPropertySymbols()` returns an array of symbol based keys
    * `Reflect.ownKeys()` returns an array of all keys including symbols

## Well-known symbols

* Symbol-keyed properties are effectively invisible to pre-ES6 code
* Useful for adding new functionality to existing JS types without breaking backwards compatibility
* The 'well-known' symbols are predefined properties of the `Symbol` function used to customize the behavior of certain language features, and to implement new functionality like iterators
* `Symbol.iterator` is used to assign a special method to objects that allows them to be iterated over:

    ```JavaScript
    const band = ['Freddy', 'Brian', 'John', 'Roger'];
    const iterator = band[Symbol.iterator]();

    iterator.next().value;  // Freddy
    ```

* Built in types `String`, `Array`, `TypedArray`, `Map`, and `Set` all have a default `Symbol.iterator` method called when an instance is used in a `for ... of` loop or with the spread operator

## The Global Registry

* There's a runtime wide symbol registry, so you can store and retrieve them across execution contexts, like a document and an embedded iframe or service worker
* `Symbol.for(key)` retrieves the symbol for a given key from the registry
* If a symbol doesn't exist for the key it returns a new one

## Use Cases

* Adding hidden properties to objects, not included in serialization
* Could also use symbols to safely augment client objects without worrying about overriding existing keys, or having their own keys overridden

# Chapter 8: How to Use Proxies

* ES6 proxies sit between your code and an object, and let you do metaprogramming operations like intercepting a call to inspect or change an object's properties
* Terminology for ES6 proxies:
    * target - original object the proxy will virtualize
    * handler - object that implements the proxy's behavior, using
    * traps - functions defined in the handler which provide access to the target when specific properties or methods are called
* Example:

    ```JavaScript
    const target = { a: 1, b: 2, c: 3 };

    const handler = {
        get: function(target, name) {
            return ( name in target ? target[name] : 42 );
        }
    };

    const proxy = new Proxy(target, handler);

    console.log(proxy.a);   // 1
    console.log(proxy.b);   // 2
    console.log(proxy.c);   // 3
    console.log(proxy.foo); // 42
    ```

* Example that permits only single-character properties from a-z to be set

    ```JavaScript
    const handler = {
        get: function(target, name) {
            return (name in target ? target[name] : 42);
        },
        set: function(target, prop, value) {
            if (prop.length == 1 && prop >= 'a' && prop <= 'z') {
                target[prop] = value;
                return true;
            }
            else {
                throw new ReferenceError(prop + ' cannot be set');
                return false;
            }
        }
    };

    const proxy = new Proxy(target, handler);

    proxy.a = 10;
    proxy.b = 20;
    proxy.ABC = 30;     // throws ReferenceError
    ```

## Proxy Trap Types

* `construct(target, arglist)` - traps creation of new object with `new`
* `get(target, property)` - traps `Object.get()`, must return prop value
* `set(target, property, value)` - traps `Object.set()`, must set prop value, return true on success
* `deleteProperty(target, property)` - traps a `delete` op, must return boolean
* `apply(target, thisArg, argList)` - tarps object function calls
* `has(target, property)` - traps `in` operators, must return boolean
* `ownKeys(target)` - traps `Object.getOwnPropertyNames()`, must return an enumerable object
* `getPrototypeOf(target)` - traps `Object.getPrototypeOf()`, must return prototype object or null
* `setPrototypeOf(target, prototype)` - traps `Object.setPrototypeOf()` to set the prototype object. No return value.
* `isExtensible(target)` - traps `Object.isExtensible()`, must return boolean
* `preventExtensions(target)` - traps `Object.preventExtensions()`, must return boolean
* `getOwnPropertyDescriptor(target, property)` - traps `Object.getOwnPropertyDescriptor()`, which returns undefined or a property descriptor object with attributes for `value`, `writable`, `get`, `set`, `configurable`, and `enumerable`
* `defineProperty(target, property, descriptor)` - traps `Object.defineProperty()` with defines or modifies an object property. Must return true if successfully defined, else false

## Proxy Example 1: Profiling

* Proxies let you create generic wrappers for any object without having to change the code in the target objects
* This example creates a profiling proxy that counts the number of times a property is accessed.

    ```JavaScript
    // create a factory function
    function makeProfiler(target) {
        const count = {}, handler = {
            get: function(target, name) {
                if (name in target) {
                    count[name] = (count[name] || 0) + 1;
                    return target[name];
                }
            }
        };

        return {
            proxy: new Proxy(target, handler),
            count: count
        }
    };

    // Apply it to an object
    const myObject = { h: 'Hello', w: 'World' };

    const pObj = makeProfiler(myObject);

    console.log(pObj.proxy.h);  // Hello
    console.log(pObj.proxy.h);  // Hello
    console.log(pObj.proxy.w);  // World
    console.log(pObj.count.h);  // 2
    console.log(pObj.count.w);  // 1
    ```

## Proxy Example 2: Two way data binding

* Data binding syncs objects
* Used in JS MVC libs to update an internal object when the DOM changes, and vice versa
* Assume an input field: `<input type="text" id="inputname" value="" />`
* And a JS object named `myUser` with an `id` property that references the input
* This updates `myUser.name` when a user changes the input value:

    ```JavaScript
    // internal state for #inputname field
    const myUser = { id: 'inputname', name: '' };

    function inputChange(myObject) {
        if (!myObject || !myObject.id) return;

        const input = document.getElementById(myObject.id);
        input.addEventListener('onchange', function(e) {
            myObject.name = input.value;
        });
    }

    inputChange(myUser);

    // Now need to update the input field
    // proxy handler
    const inputHandler = {
        set: function(target, prop, newValue) {
            if (prop == 'name' && target.id) {
                // update object property
                target[prop] = newValue;

                // update input field value
                document.getElementById(target.id).value = newValue;
                return true;
            }
            else return false;
        }
    };

    // create the proxy
    const myUserProxy = new Proxy(myUser, inputHandler);

    // set a new name
    myUserProxy.name = 'Craig';
    console.log(myUserProxy.name); // Craig
    console.log(document.getElementById('inputname').value); // Craig
    ```

# Chapter 9: Destructuring Assignment

```JavaScript
// Array Destructuring
var myArray = ['a', 'b', 'c'];

// ES5
var one = myArray[0],
    two = myArray[1],
    three = myArray[2];

// ES6
const [one, two, three] = myArray;

// ignoring values
const [uno, , tres] = myArray;

// extract remaining elements with rest op
const [first, ...theRest] = myArray;


// Object Destructuring
var myObj = { one: 'a', two: 'b', three: 'c' };

// ES5
var one = myObject.one,
    two = myObject.two,
    three = myObject.three;

// ES6
const {one, two, three} = myObject;

// aliasing to var names different from property names
const {one: first, two: second, three: third} = myObject;

// Referencing nested objects:
const meta = {
    title: 'Destructuring Assignment',
    authors: [ { firstname: 'Craig', lastname: 'Buckler' } ],
    publisher: { name: 'SitePoint', url: 'http://www.sitepoint.com/' }
};

const { title: doc,
        authors: [{ firstname: name }],
        publisher: { url: web }
} = meta;
```

* Things to remember:
    * Left hand side is the destructuring target, where vars are assigned
    * Right hand side is destructuring source, where data comes from
* Caveats:
    * You can't start a statement with a brace
    * Be cautious mixing declared and undeclared variables

## Easier Declaration

```JavaScript
// ES5
var a = 'one', b = 'two', c = 'three';

// ES6
const [a, b, c] = ['one', 'two', 'three'];
```

## Variable value swapping

```JavaScript
var a = 1, b = 2;

// ES5
var temp = a;
a = b;
b = temp;

// ES6
[a, b] = [b, a];
```

## Default Function Parameters

```JavaScript
// ES6

function prettyPrint(param = {}) { ...
```

## Returning multiple values from a function

```JavaScript
function f() { return [1, 2, 3]; }

const [a, b, c] = f();
```

## For-of iteration

```JavaScript
for (const b of books) {
    console.log(b.title + ' by ' + b.author);
}

// or this:
for (const {title, author, url} of books) {
    console.log(title + ' by ' + author);
}
```

# Chapter 10: ES6 Generators and Iterators

## Iterators

```JavaScript
// ES5
for (var i = 0; i < foo.length; i++) {
    // do something with i
}

// ES6
for (const i of foo) {
    // do something with i
}
```

## Generators

* New type of function that creates specific iterations
* Asterisk after function keyword means you're defining a generator
* Yield keyword is like python yield

```Javascript
function* getNextPrime() {
    let nextNumber = 2;

    while (true) {
        if (isPrime(nextNumber)) {
            yield nextNumber;
        }
        nextNumber++;
    }
}
```

# Chapter 11: OO JavaScript, ES6 classes

* Make code safer by guaranteeing that an init function will be called
* Make it easier to define a fixed set of functions that operate on that data and maintain valid state

```JavaScript
class SimpleDate {
    constructor(year, month, day) {
        // validation goes here

        this._year = year;
        this._month = month;
        this._day = day;
    }

    addDays(nDays) { 
        // increase this date by n days
    }

    getDay() {
        return this._day;
    }
}
```

* `constructor` method is special, is called automatically
* Private data is prefixed with an underscore by convention
* It's not enforced
* You can create real private data via closures, but then you have to define everything in your constructor, including methods
* You can fake private data with symbols
* If you use unique symbol object keys, and capture those in a closure--except they leak via `Object.getOwnPropertySymbols`
* You can use weak maps to store private object data:

    ```JavaScript
    const SimpleDate = (function() {
        const _years = new WeakMap();
        const _months = new WeakMap();
        const _days = new WeakMap();

        class SimpleDate {
            constructor(year, month, day) {
                // validation here
                _years.set(this, year);
                _months.set(this, month);
                _days.set(this, day);
            }

            addDays(nDays) {
                // increase this date by n days
            }

            getDay() { return _days.get(this); }
        }
    
        return SimpleDate;
    }());
    ```

## Static Properties and Methods

* You can define data and functions that are part of the class but not part of any instance of that class with the static keyword

## Subclasses

## Inheritance

```JavaScript
class Manager extends Employee {
    constructor (...) { 
        super(...);
        this._something = 1;
    }

    doThing(n) { ... }
}
```

# Chapter 13: An Overview of JS Promises

* A `Promise` object represents a value that may not be available yet, but will be resolved at some point in the future.
* An example would be to use the promise API to make an async call to a remote service, and creating a `Promise` object to represent the data that will be returned by that service.
* You can attach callbacks to it, which will be called once it has real data

## The API

* Basic usage:

    ```JavaScript
    const promise = new Promise((resolve, reject) => {
        // async code here
    });
    ```

* Instantiate a promise object and pass it a callback
* The callback takes two args, resolve and reject, both functions
* If all is successful, the promise is fulfilled by `resolve()`
* Otherwise `reject()` is called with an `Error` object, indicating promise rejected
* Example that makes an async request to a service:

    ```JavaScript
    const promise = new Promose((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open('GET', 'https://api.icndb.com/jokes/random');
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);  // got data, resolve the promise
            } else {
                reject(Error(request.statusText));
            }
        };

        request.onerror = () => {
            reject(Error('Error fetching data.'));
        };

        request.send();
    });

    console.log('async request made');

    promise.then((data) => {
        console.log('Got data! Promise fulfilled.');
        document.body.textContent = JSON.parse(data).value.joke;
    }, (error) => {
        console.log('Promise rejected.');
        console.log(error.message);
    });
    ```
