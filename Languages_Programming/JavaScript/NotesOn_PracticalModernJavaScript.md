# Notes on Practical Modern JavaScript

By Nicholas Bevacqua, 2017, O'Reilly Media Inc

ISBN 978-1-491-94353-3

## Chapter 1: ECMAScript and the Future of JavaScript

### 1.1 A Brief History of JavaScript Standards

* Brendan Eich created it in '95 at Netscape
* Based on some stuff from Scheme and Self
* Started being standardized under name ECMAScript in '96
* Early implementations weren't really standardized well
* 1st ECMAScript in '97
* Refined in '98 to be second ed
* End of '99, third ed standardized regular expressions, `switch`, `do/while`, `try/catch`, `Object#hasOwnProperty`
* Early '00s had continuing standardization problems
* 2005, Brendan worked on restarting standardization
* 2007, committee was split on incremental vs wholesale change
* 3.1 was the foundation for 4.0
* 5th ed in 2009, added extensions for common browser specific stuff, `get`, `set`, improvements to `Array`, reflection and introspection, native JSON parsing, strict mode
* 2001, spec reviewed and edited into 5.1
* Version 6 was 2015, biggest update, subject of this book
* Inflection point to make ECMAScript a rolling standard

### 1.2 ECMAScript as a Rolling Standard

* This section outlines how the rolling process works
* Stages for proposals:
    1. Strawman / Stage 0 - discussion or proposal not yet submitted
    1. Stage 1 - formalized, expected to address cross-cutting concerns; should identify a discrete problem, offer a concrete solution; often has a high-level API description, usage examples
    1. Stage 2 - Initial draft of spec; some experimentation in runtimes
    1. Stage 3 - Candidate recommendations
    1. Stage 4 - Two independent implementations need to pass acceptance tests

### 1.3 Browser Support and Complementary Tooling

* Stage 3 props are considered safe to use in real-world applications, through experimental engine implementations, polyfills, or via compiler
* For proposals not widely adopted, you can use a 'transpiler' to get output in a format that'll work
* Transpilers can work at runtime

####1.3.1 Introduction to the Bable Transpiler

* Babel can compile modern JS code with ES6 features into ES5
* Produces human readable code
* Has an online REPL
* Babel doesn't transpile new built-ins like `Symbol`, `Proxy`, `WeakMap`
* If you want to support a runtime that doesn't have those, you have to use the `babel-polyfill` package
* Be careful with transpiled code effecting older runtimes

