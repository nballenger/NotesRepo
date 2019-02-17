# Notes on Rediscovering JavaScript

By Venkat Subramaniam; Pragmatic Bookshelf, June 2018

ISBN 9781680505467

# Introduction

## How to run modern JavaScript

* Run in Node.js
* Run using the REPL
* Run in the browser console
* Run inside a browser using Babel transpiler

# Chapter 1: JavaScript Gotchas

## Be careful where you break lines

* Need to understand JS's automatic semicolon insertion (ASI) rules
* A valid program ends with a semicolon. If a script does not end with one, JS inserts it.
* As tokens are parsed from left to right, if an unexpected token is encountered and a line break separates it from the previous token, a semicolon is inserted before the encountered token.
* If a candidate token is `break`, `continue`, `return`, `throw`, or `yield`, and a line break appears between the candidate token and the next token, JS automatically inserts a semicolon after the candidate token.
* Use a code linter to help with bugs arising from this stuff.

## Use === instead of ==

* Double equals is the type-coercion non-strict equality operator
* It performs type coercion if the things being compared are not of the same type
* If the operands are both string, number, or boolean, a direct equality check happens
* If you actively want type coercion before comparison, use `==`
* Example of that is when you want to determine if a variable is null or undefined
* In most cases use the strict equality check with no type coercion.

## Declare before use

* It's easy to accidentally set a global by using without declaration
* Always declare.

## Stay one step ahead

* Use the `'use strict;'` directive at the head of source files or inside functions
* In strict mode the runtime will not tolerate use of undeclared variables
* Note that it's a string, so older engines ignore it and newer ones pick it up.
* Lint your code with JSLint, JSHint, or ESLint
* Globally installing ESLint: `npm install -g eslint`
* Creating a conf file: `eslint --init`

# Chapter 2: Variables and Constants

* Traditionally JS used `var` for defining variables
* Don't use it anymore, use `const` and `let`

## Out with var

* `var` in use prior to ES6
* `var` does two things poorly:
    * Does not prevent a variable from being redefined in a scope
    * Does not have block scope
* Variables defined with `var` have function scope. Sometimes you want to limit the scope to a smaller one than the entire function, particularly for branches and loops.

## In with let

* `let` is the replacement for `var` and can be used interchangeably
* It does not permit a variable in a scope to be redefined. 
    * If a variable is already defined, using `let` to redefine it results in an error
* Variables declared with `let` have block scope
    * Their use and visibility is limited to the block of code enclosed by the braces they're defined within.
    * Variables set with `let` are only available after their declaration line--no variable hoisting.

## Perils of Mutability

* You can't redefine variables set with `let` but you can change them
* Be careful with mutable values.

## const

* The `const` keyword defines a variable whose value shouldn't change
* Only primitive values like `number` and object references are protected
* If the object the reference points at changes, that won't be stopped
* You can prevent changes to an object using `Object.freeze()`
* Example:

    ```JavaScript
    'use strict;'

    const sam = Object.freeze({first: 'Sam', age: 2})

    sam.age = 3;        # throws an error due to use strict
    console.log(sam.age);   # would log 2
    ```

* Note the caveat to `freeze()`--it's shallow, so it only affects the top level properties of an object.

## Safer code with let and const

* Scope in older JS was protected by anonymous functions and closures
* Because `let` and `const` have block scope, you don't have to do that as much
* Modules also have some encapsulation

## Prefer const over let

* Don't use `var`
* Use `const` whenever possible
* Use `let` only when you need mutability

# Chapter 3: Working with Function Arguments

## The powers and perils of arguments

* You can pass as many arguments to a JS function as you want
* If you pass fewer than the number of named params, the rest show up as `undefined`
* If you pass more, they are ignored
* Previously passing a variable number of parameters was handled through `arguments`
* Issues with `arguments`:
    * method signatures do not convey intent, and can be misleading
    * it's not an actual Array
    * the code is messy
* Don't use `arguments`, use the rest parameter

## Using the rest parameter

* The rest param is defined using the ellipsis `...`
* That param stands for all remaining arguments passed and is an Array
* Example:

    ```JavaScript
    const max = function(...values) {
        console.log(values instanceof Array);

        let large = values[0];

        for (let i=0; i<values.length; i++) {
            if (values[i] > large) {
                large = values[i];
            }
        }
        return large;
    };

    console.log(max(2,1,4,7));
    ```

* Rules for the rest parameter:
    * Must be the last formal parameter
    * Can be at most one per function signature
    * Only contains values not given an explicit name

## The spread operator

* Also uses the ellipsis, but appears on the calling side of functions
* Intention of the operator is the opposite of the rest parameter--it breaks a collection into discrete values
* Example:

    ```JavaScript
    const greet = function(...names) { # rest parameter usage
        console.log('hello '+names.join(', '));
    };

    const jack = 'Jack';
    const jill = 'Jill';
    greet(jack, jill);      # discrete variables works fine, gets consolidated

    const tj = ['Tom', 'Jerry'];
    greet(tj[0], tj[1]);            # awkward usage

    greet(...tj);                   # better with spread operator
    ```

* Can be used with any iterable
* It expands the iterable into discrete values
* Retires the `apply()` function
* Spread isn't limited to the calling side of the rest parameter
* You can use it to spread an array to discrete parameters anywhere
