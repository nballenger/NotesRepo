# Notes on JavaScript: The Definitive Guide, 7th Ed.

By David Flanagan; O'Reilly Media, Inc, July 2020; ISBN 9781491952108

# Chapter 1: Lexical Structure

## 1.1 Text of a JavaScript Program

* Case sensitive language
* Spaces between tokens are ignored
* Mostly line breaks are ignored
* In addition to the space character `\0020`, JS recognizes tabs, some ASCII control characters, and various Unicode space characters as whitespace.
* Recognized line terminators: newlines, carriage returns, CRLF

## 1.2 Comments

```JavaScript
// single line
/* 
    multi-line
*/
```

## 1.3 Literals

```JavaScript
12          // number
1.2         // number
"hello"     // string
'hi'        // string
true        // boolean
false       // boolean
null        // absence of an object
```

## 1.4 Identifiers and Reserved Words

* Must begin with letter, underscore, or dollar sign
* Other characters can be letters, numbers, underscores, dollar signs
* Reserved words:

    ```
as      const       export      get         null    target  void
async   continue    extends     if          of      this    while
await   debugger    false       import      return  throw   with
break   default     finally     in          set     true    yield
case    delete      for         instanceof  static  try
catch   do          from        let         super   typeof
class   else        function    new         switch  var
    ```

## 1.5 Unicode

* JS programs written in the Unicode character set
* Common to use only ASCII in identifiers
* You can write unicode directly or by escape

    ```JavaScript
let café = 1;   // unicode accented character in identifier
console.log(caf\u00e9);     // escaped usage
console.log(caf\u{E9});     // escaped usage
    ```

* If you use non-ASCII characters in source code, make sure you're aware that there can be multiple ways of encoding the same Unicode character.
* Different identifiers that look the same in an editor:
    * `caf\u{e9}` - accented e character
    * `cafe\u{301}` - e with acute accent combining mark

## 1.6 Optional Semicolons

* Semicolons are a statement separator
* You can usually omit the semicolon for statements on separate lines
* Also at the end of a program, or if the next token in `}`
* Not every line break is treated as a semicolon
* It treats line breaks as semicolons only if it can't parse the code without the semicolons.
* Formal rule (with two exceptions) is that *JavaScript treats a line break as a semicolon if the next nonspace character cannot be interpreted as a continuation of the current statement.*
* Example:

    ```JavaScript
// this:
let a
a
=
3
console.log(a)

// will be interpreted as
let a; a = 3; console.log(a);
    ```

* Problematic example:

    ```JavaScript
let y = x + f
(a+b).toString()

// is interpreted as
let y = x + f(a+b).toString();
    ```

* General rule: *If a statement starts with `(`, `[`, `/`, `+`, or `-`, there is a chance it could be interpreted as a continuation of the statement before.*
* Exceptions to the general rule of line breaks = semicolons if unable to parse the next line as a continuation:
    * If a line break appears after any of `return`, `throw`, `yield`, `break`, or `continue`, it is treated as a semicolon
    * If you want to use either autodecrement or autoincrement as postfix operators, they MUST appear on the same line as the expression they belong to.
    * For arrow functions, `=>` MUST appear on the same line as the parameter list

# Chapter 2: Types, Values, and Variables

## 2.0 Introduction

* Two main categories: primitive types and object types
* Primitive types include numbers, strings, and booleans, `null`, and `undefined`
* `null` and `undefined` are singletons
* ECMAScript 6 adds `Symbol` as a special purpose type that enables the definition of language extensions without harming back compatibility
* Anything outside number, strong, boolean, null, undefined is an object
* An object is a collection of properties
* A property has a name and a value
* The "global object" is special
* An ordinary object is an unordered collection of named values
* There are also array objects, which are ordered collections of numbered values
* Other pre-defined object types:
    * Set - set of values
    * Map - mapping from keys to values
    * typed array types - good for binary and bytestring ops
    * RegExp - regex objects
    * Date
    * Error
* Functions and classes are not just syntactical, they're first class values that can be manipulated as objects.
* The interpreter performs automatic GC for memory management
* If a value has no more references in scope it's collected
* Language is object-oriented, so functions typically are defined as methods of objects
* Only objects have methods in a technical sense, but numbers, strings, booleans, and symbols behave as if they do--only `null` and `undefined` are unable to have methods invoked
* Object types are mutable
* Primitive types are immutable, including strings, though they can be accessed like arrays (which are mutable)
* JS autoconverts values between types according to specific rules
* Type conversion has implications for equality testing, `==` vs `===`
* Constants and variables are untyped, declarations don't specify type

## 2.1 Numbers

* Number is the primary numeric type
* Represents integers, approximates real numbers
* They're 64-bit floats per IEEE 754
* You can exactly represent numbers between `-2^53` and `2^53`
* Integers outside that range may lose precision
* Some operations like array indexing and bitwise ops use 32-bit integers
* A number in a JS program is a numeric literal, which may be signed

### 2.1.1 Integer Literals

```JavaScript
// base 10
0
3
10000000

// hex
0xff
0xBADCAFE

// binary (ES6+)
0b10101

// octal (ES6+)
0o377
```

### 2.1.2 Floating-point Literals

* Syntax: `[digits][.digits][(E|e)[(+|-)]digits]`
* Examples:

    ```JavaScript
3.14
2345.6789
.333333333333333333
6.02e23
1.4738223E-32
    ```

* You can use underscores in numeric literals for readability

### 2.1.3 Arithmetic in JavaScript

* Operators: `+ - * / %`
* Exponentiation operator `**` added in ES6
* More complex operations happen via methods on `Math`:

    ```JavaScript
Math.pow(2,53);
Math.round(.6);
Math.ceil(.6);
Math.floor(.6);
Math.abs(-5);
Math.max(x,y,z);
Math.min(x,y,z);
Math.random();
Math.PI;
Math.E;
Math.sqrt(25);
Math.pow(3,1/3);
Math.sin(0);
Math.log(10);               // natural log of 10
Math.log(100)/Math.LN10;    // base 10 log of 100
Math.log(512)/Math.LN2;     // base 2 log of 512
Math.exp(3);                // Math.E**3

// ES6+ functions
Math.cbrt(27);              // cube root
Math.hypot(3,4);            // sqrt of sum of squares of all args
Math.log10(100);            // base 10 log
Math.log2(1024);            // base 2 log
Math.log1p(x);              // natural log of (1+x), accurate for small x
Math.expm1(x);              // inverse of Math.log1p(x)
Math.sign(x);               // -1, 0, or 1 for args lt, eq, gt 0
Math.imul(2,3);             // optimized 32 bit multiplication
Math.clz32(0xf);            // number of leading 0 bits in 32b int
Math.trunc(3.9);            // convert to integer by truncating fractional part
Math.fround(x);             // round to nearest 32bit float
Math.sinh(x);               // hyperbolic sine
Math.cosh(x);               // hyperbolic cosine
Math.tanh(x);               // hyperbolic tangent
Math.asinh(x);              // hyperbolic arcsine
Math.acosh(x);              // hyperbolic arccosine
Math.atanh(x);              // hyperbolic arctangent
    ```

* No errors raised for overflow, underflow, divide by zero
* If the result of an op is larger than the largest representable number, the result is `Infinity`, a special value
* Same for `-Infinity`
* In cases of underflow (result is closer to 0 than smallest number), returns 0
* If underflow happens on a negative number, returns "negative zero"
* Div by zero returns infinity or negative infinity, with one exception: `0/0` has no defined values, and results in the special `NaN` value
* `Infinity` and `NaN` are available as properties on `Number`
* `MAX_VALUE` and `MIN_VALUE` are also `Number` properties
* Examples

    ```JavaScript
Infinity
Number.POSITIVE_INFINITY
-Infinity
Number.NEGATIVE_INFINITY
Number.MAX_VALUE
Number.MIN_VALUE
NaN
Number.NaN

// ES6+ methods
Number.parseInt()
Number.parseFloat()
Number.isNaN(x)
Number.isFinite(x)
Number.isInteger(x)
Number.isSafeInteger(x)     // in expressible range
Number.MIN_SAFE_INTEGER
Number.MAX_SAFE_INTEGER
Number.EPSILON              // 2**-52, smallest diff between numbers
    ```

* Note that `NaN` equals no other value, including itself, so you have to use `Number.isNaN(x)` instead of `x === NaN`
* Negative zero compares equal to positive zero

### 2.1.4 Binary floating-point and rounding errors

* Any number outside the exact representation bounds is an approximation
* JS uses IEEE-754 floats, which are binary
* They can exactly represent fractions like `1/2`, `1/8`, `1/1024`
* They cannot represent exact decimal fractions, so floats cannot exactly represent numbers as simple as `0.1`
* Example where this is an issue:

    ```JavaScript
let x = .3 - .2;
let y = .2 - .1;

x === y             // false, not the same bc of rounding error
x === .1            // false
y === .1            // true
    ```

* If floats are problematic, consider scaled integers

### 2.1.5 Arbitrary Precision Integers with BigInt

* BigInt is getting close to standardization, allows 64bit integers
* Not suitable for crypto, do not attempt to prevent timing attacks
* BigInt literals are `1234n`
* By default in base 10, but you can prefix for binary, octal, hex
* `BigInt(n)` will convert numbers or strings to BigInt values
* Arithmetic on it works normally, except division drops any remainder and rounds towards zero.
* You may not mix BigInt and non-BigInt operands in arithmetic ops
* Comparison ops between mixed numeric types

### 2.1.6 Dates and Times

* The `Date` class represents and has methods for manipulating dates and times

## 2.2 Text

* Type is 'string'
* Immutable ordered sequence of 16bit values, each typically a unicode char
* Length is number of values it contains
* Zero indexed
* Empty string has length zero
* No special type (like char) to represennt a single element of a string
* JS uses UTF 16 encoding
* JS strings are sequences of unsigned 16bit values
* Most common characters ("basic multilingual plane") have codepoints that fit in 16 bits, and can be represented by a single element in a string
* Characters with codepoints bigger than 16 bits are encoded by UTF 16 rules as a sequence / "surrogate pair" of two 16bit values, so a string with length 2 may represent only a single rendered character
* Most string manipulation methods in JS operate on 16bit values, NOT on characters, and do not treat surrogate pairs specially, do no string normalization, and do not even ensure a string is well formed UTF 16
* ES6 strings are iterable; if you use `for/of` loop or `...` with a string it will iterate the actual characters, not the 16bit values

### 2.3.1 String Literals

* Double or single quotes
* Escape sequences inside double quotes
* In ES6 you can delimit strings with backticks, which allows for embedded JS expressions

### 2.3.2 Escape Sequences in String Literals

* Backslash char starts an escape sequence
* Sequences:
    * `\0` - NUL character (`\u0000`)
    * `\b` - backspace (`\u0008`)
    * `\t` - horizontal tab (`\u0009`)
    * `\n` - newline (`\u000A`)
    * `\v` - vertical tab (`\u000B`)
    * `\f` - form feed (`\u000C`)
    * `\r` - carriage return (`\u000D`)
    * `\"` - double quote (`\u0022`)
    * `\'` - single quote (`\u0027`)
    * `\\` - backslash (`\u005C`)
    * `\xnn` - latin-1 character of the two hex digits `nn`
    * `\unnnn` - unicode character of four hex digits `nnnn`
    * `\u{n}` - unicode character at codepoint `n`, where `n` is 1-6 hex digits

### 2.3.3 Working with Strings

* Plus is the concat operator, appends second string to the first
* Equality ops are `===` and `!==`, plus `<`, `<=`, `>`, `>=`
* String comparison done via the 16bit values
* Length of a string is `s.length`
* String API:

    ```JavaScript
let s = "Hello, world";

s.substring(1,4)
s.slice(1,4)
s.slice(-3)
s.split(", ")
s.indexOf("l")
s.indexOf("l",3)
s.indexOf("zz")
s.lastIndexOf("l")

s.startsWith("H")
s.endsWith("!")
s.includes("or")

s.replace("llo", "ya")
s.toLowerCase()
s.toUpperCase()
s.normalize()           // unicode NFC normalization
s.normalize("NFD")      // NFD normalization

s.charAt(0)
s.charAt(s.length-1)
s.charCodeAt(0)
s.codePointAt(0)

"x".padStart(3)
"x".padEnd(3)
"x".padStart(3, "*")
"x".padEnd(3, "-")

" test ".trim()
" test ".trimStart()
" test ".trimEnd()

s.concat("!")
"<>".repeat(5)
    ```

* JS strings are immutable, you're returning new strings

### 2.3.4 Template Literals

* Backtick delimited strings are template literals
* Can include arbitrary JS expressions, values are interpolated
* Everything inside `${ }` in a template literal is interpreted
* Can include any number of expressions
* Can use any normal escape sequences
* Can span multiple lines, no escaping required
* Example:

    ```JavaScript
let errorMessage = `\
\u2718 Test Failure at ${filename}:${linenumber}:${exception.message}
Stack trace:
${exception.stack}
`;
    ```

* The initial slash escapes the newline, so the message starts with the `\u2718` char
* Tagged template literals
    * If a function name ("tag") comes right before the opening backtick, the text and values in the template literal are passed to the function, and the value of the complete "tagged template literal" is the return value of the function.
    * There's one built in tag function in ES6, `String.raw()`
    * It returns the text within backticks raw, without processing backslash sequences
* Example: ``String.raw`\n`;``
* No parentheses used in the function call, just the backticks.

### Pattern Matching

* Text in a pair of slashes is a regex literal
* Second slash can be followed by one or more characters that modify the pattern
* Lots of useful methods on a `RegExp` object

## 2.3 Boolean Values

* Boolean literals are `true` and `false`
* Any value can be converted to a boolean
* Falsy values: `undefined`, `null`, `0`, `-0`, `NaN`, `""` (empty string)
* All other values are truthy
* Boolean values have a `toString()` method, no other useful methods
* `&&` is boolean and, `||` is boolean or, `!` is unary not

## 2.4 null and undefined

* `null` is a language keyword, special value that indicates an absence
* `undefined` is a deeper absence:
    * value of variables not yet initialized
    * the value you get when you query the value of an object property or array element that does not exist
    * return value of functions with no explicit return
    * value of function parameters for which no arg was passed
* `undefined` is a predefined global constant, not a keyword
* `null` and `undefined` may be used interchangeably
* `==` sees them as equal, `===` does not (type diff)
* They have no properties or methods.
* Author considers:
    * `undefined` - system level, unexpected, or error-like absence of value
    * `null` - program level, normal, or expected absence of value

## 2.5 Symbols

* Special type in ES6
* Serves as non-string property names
* Property names prior to ES6 were strings
* In ES6+, symbols can also serve:

    ```JavaScript
let strname = "string name";
let symname = Symbol("propname");

typeof strname                      // string
typeof symname                      // symbol

let o = {};
o[strname] = 1;
o[symname] = 2;
    ```

* Symbols are obtained with the `Symbol()` function
* `Symbol()` never returns the same value twice, even with the same input
* If you use a symbol as a new property name, it will not clash with an existing property name
* If you use symbolic property names and don't share the symbols, you can be confident that other modules won't overwrite your props
* In practice they're a language extension mechanism
* Sometimes you want to keep a symbol private, but if you want to share it you would use the global Symbol registry via `Symbol.for()`

    ```JavaScript
let a1 = Symbol("alpha");
let a2 = Symbol("alpha");
a1 === a2                       // false
a1 == a2                        // false

let b1 = Symbol.for("bravo");
let b2 = Symbol.for("bravo");
b1 === b2                       // true
b1 == b2                        // true
    ```

## 2.6 The Global Object

* The global object supplies the globally defined symbols available to a JS program
* Any JS interpreter creates a global object and gives it initial properties for:
    * global constants (`undefined`, `Infinity`, `NaN`)
    * global functions (`isNan()`, `parseInt()`, `eval()`)
    * constructor functions (`Date()`, `RegExp()`, `Object()`)
    * global objects (`Math`, `JSON`)
* Initial properties aren't reserved words, but should be treated as such
* In Node, the global object is named `global`
* In client side JS, `window` is the global object

## 2.7 Immutable Primitive Values and Mutable object References

* Primitives are immutable and compared by value
* Objects are mutable and compared by reference
* Two objects are the same IFF they refer to the same underlying object

    ```JavaScript
let a = [];
let b = a;
b[0] = 1;
a[0]            // 1
a === b         // true
    ```

* Assigning an object to a variable assigns the reference, it doesn't create a new copy. If you want a copy of an object or array, you have to explicitly copy the object or elements.
* If you want to compare distinct objects or arrays, you must compare their properties or elements

## 2.8 Type Conversions

| Value | to String | to Number | to Boolean |
|-------|-----------|-----------|------------|
| `undefined` | `"undefined"` | `NaN` | `false` |
| `null` | `"null"` | `0` | `false` |
| `true` | `"true"` | `1` |  |
| `false` | `"false"` | `0` |   |
| `""` |  | `0` | `false` |
| `"1.2"` |  | `1.2` | `true` |
| `"one"` |  | `NaN` | `true` |
| `0` | `"0"` |  | `false` |
| `-0` | `"0"` |  | `false` |
| `NaN` | `"NaN"` |  | `false` |
| `Infinity` | `"Infinity"` | | `true` |
| `-Infinity` | `"-Infinity"` | | `true` |
| `1` | `"1"` | | `true` |
| `{}` | * | * | `true` |
| `[]` | `""` | `0` | `true` |
| `[9]` | `"9"` | `9` | `true` |
| `['a']` | _use join()_ | `NaN` | `true` |
| `function() {}` | * | `NaN` | `true` |

_Object to primitive conversion is covered in 2.9.3._

### 2.9.1 Conversions and Equality

* `==` is flexible and does type conversion, `===` does type equality
* Examples:

    ```JavaScript
null == undefined       // true
"0" == 0                // true, string converts to number pre-compare
0 == false              // true, bool converts to number pre-compare
"0" == false            // true, both convert to 0 pre-compare
    ```

* Note that the convertibility of one value to another does not imply actual equality of those values: If `undefined` is used where a bool is expected it will convert to `false`, but it isn't actually equivalent to `false`.
* The `if` statement converts `undefined` to `false`, but the `==` operator never attempts to convert operands to booleans.

### 2.9.2 Explicit Conversions

* Simplest manual conversions are via `Boolean()`, `Number()`, `String()`
* Any value other than `null` and `undefined` has `.toString()`
* `Boolean()`, `Number()`, `String()` can be used with `new` as constructors
* Those give you a wrapper object that behaves like a primitive, no good reason to use them, they're a historical holdover.
* Some operators do implicit type conversions
    * `+` - if one operand is a string, converts the other to a string
    * `+` - unary plus, converts to a number
    * `!` - unary not, converts to a boolean and negates it
* Examples

    ```JavaScript
x + ""  // -> String(x)
+x      // -> Number(x)
x-0     // -> Number(x)
!!x     // -> Boolean(x)
    ```

* For number formatting and parsing you should use special purpose methods
* `.toString()` on Number objects accepts a radix/base arg for conversion
* `.toFixed()` on Number converts to a string with specified digits of precision, does not use exponentiation notation
* `.toExponential()` converts to string using exponential notation
* `.toPrecision()` converts to a string with n significant digits, uses exponential notation if the number of significant digits is not large enough to display the entire integer portion

    ```JavaScript
let n = 17;
let binary = "0b" + n.toString(2);
let octal = "0o" + n.toString(8);
let hex = "0x" + n.toString(16);

let m = 123456.789;
m.toFixed(0)        // 123457
m.toFixed(2)        // 123456.79
m.toFixed(5)        // 123456.78900
m.toExponential(1)  // 1.2e+5
m.toExponential(3)  // 1.235e+5
m.toPrecision(4)    // 1.235e+5
m.toPrecision(7)    // 123456.8
m.toPrecision(10)   // 123456.7890
    ```

* If you pass a string to `Number()` it tries to parse it as an int or float
* The `parseInt()` and `parseFloat()` global functions are more flexible, can handle more edge cases in terms of hex, whitespace, etc.
* `parseInt()` accepts a second radix arg

### 2.9.3 Object to Primitive Conversions

* Some objects have more than one primitive representation, like Date being able to be a string or numeric timestamp.
* Consequently object to primitive conversions are more complex
* There are three fundamental algorithms for converting objects to primitives:
    * 'prefer-string' - returns a primitive, preferably a string if possible
    * 'prefer-number' - same for number
    * 'no-preference' - no preference about what what type of primitive is returned, classes can define their own conversions
* All built in types except Date use prefer-number, date uses prefer-string

#### Object to Boolean Conversions

* All objects convert to `true`, even `new Boolean(false)`

#### Object to String Conversions

* To convert an object to a string, JS first converts to a primitive using the prefer-string algorithm, then converts that primitive value to a string if necessary.
* This happens if you pass an object to a built in function that expects a string, if you call `String()` as a conversion function, and during interpolation of objects into template literals.

#### Object to Number Conversions

* Converts to a numeric primitive using prefer-number, then converts that to a number if necessary
* Most operators and built ins that expect a number do it this way

#### Special Case Operator Conversions

* There are special case operators that don't use the basic object-to-string and object-to-number conversions
* `+` does numeric addition and string concat; if either operand is an object, converts to primitives using no-preference, then checks types, if either arg is a string converts the other to a string and concatenates, otherwise converts both to numbers and adds
* `==` and `!=`
    * if one operand is an object and the other is a primitive, convert the object using no-preference and then compare the two primitive values
* `<`, `<=`, `>`, `>=`
    * compare the order of operands
    * if either operand is an object, converted via prefer-number
    * primitives returned by that are NOT converted to number objects
    * for Date objects, still uses prefer-number, since numeric dates are comparable but string dates are not

#### The toString and valueOf Methods

* All objects inherit these two conversion methods used in object-to-primitive conversions
* `toString()` should return a string representation of an object
* By default tends to return `"[object Object]"` which isn't that useful
* Lots of classes define more specific `toString()` behavior
* `valueOf()` is supposed to convert an object to a primitive value that represents the object if any such value exists.
* Most objects can't be represented that way since they're compound, so it typically returns the object itself rather than a primitive
* Wrapper classes just return the wrapped primitive
* Arrays, functions, regex, etc. inherit the default method
* Date returns the date in the internal epoch representation

#### Object to Primitive Conversion Algorithms

* Prefer-string
    * tries `toString()`, if that's defined and returns a primitive, uses it
    * otherwise tries `valueOf()`, if defined and returns a primitive, uses that
    * else raises TypeError
* Prefer-number
    * works like above, just flips `toString()` and `valueOf()`
* No-preference
    * depends on the class of object being converted
    * if Date, uses prefer-string
    * else uses prefer-number
* Those are all true for built-in types, and default for custom classes
* Prefer-number explains why empty arrays convert to 0, single element arrays can also convert to numbers
    * first converts to primitive via prefer-number, then to number
    * that tries `valueOf()` and then `toString()`
    * Array inherits default `valueOf()` method that doesn't return a primitive
    * So you end up calling `toString()`
    * Empty arrays convert to an empty string, which converts to 0
    * Arrays with one element convert to the string of that element
    * If an array contains a single number, the number is converted to a string and then back to a number

## 2.9 Variable Declaration and Assignment

* Before you can use a variable or constant in JS you have to declare it
* In ES6+, you do that with `let` and `const`; `var` in previous editions

### 2.9.1 Declarations with let and const

* You can declare one or more variables with `let`
* Good practice to assign on declaration, but not required
* If not assigned, value is `undefined` until assignment
* Use `const` to declare a constant
* Works the same as `let` except you MUST initialize a value into it
* Convention to use capital letters for constants
* When to use `const`
    * Two schools of thought:
        * use it only for values that are fundamentally unchanging like physical constants
        * use it for things that don't change within the program's scope
    * In the second, use `const` everywhere and then change to `let` as appropriate, for values that should be mutable

#### Variable and Constant Scope

* Variables with `let` and `const` are block scoped
* Blocks are:
    * class and function defs
    * bodies of `if/else`, `while`, `for`, etc.
    * basically anything inside curly braces
* Anything declared at the top level is a global
* In Node, global scope is the file it's defined in
* In client side JS, global scope is the HTML doc it's defined in

#### Repeated Declarations

* Using the same name with more than one `let` or `const` is a syntax error
* It's legal though not recommended to re-declare a variable inside a nested scope

#### Declarations and Types

* JS doesn't type variables.

### 2.9.2 Variable Declarations with var

* Prior to ES6, all declarations were via `var`
* `var` has the same syntax as `let`
* Differences between `var` and `let`:
    * `var` doesn't use block scope--scope is the body of the containing function, no matter how deeply nested inside that function
    * `var` outside a function body declares a global
    * globals declared with `var` are implemented as properties of the global object (`let` doesn't do that)
    * It's legal to redeclare the same thing with `var` multiple times
    * `var` declarations support hoisting, where no matter where the declaration happens it's hoisted to the top of the enclosing function, so you can refer to it anywhere in the function. Initialization remains where you put it, but declaration is hoisted.
* In strict mode if you try to refer to an undeclared variable, you get a reference error at runtime.
* Outside strict mode, if you assign to a name not declared with `let`, `const`, or `var`, you end up creating a new global variable

### 2.9.3 Destructuring Assignment

* ES6 adds destructured assignment
* Makes it easier to work with functions that return arrays

    ```JavaScript
let [x,y] = [1,2];
[x,y] = [x+1,y+1];
[x,y] = [y,x];      // swap in place

function toPolar(x,y) {
    return [Math.sqrt(x*x + y*y), Math.atan2(y,x)];
}

function toCartesian(r, theta) {
    return [r*Math.cos(theta), r*Math.sin(theta)];
}

let [r,theta] = toPolar(1.0,1.0);
let [x,y] = toCartesian(r,theta);
    ```

* Also useful for `for` loops:

    ```JavaScript
let o = { x: 1, y: 2 };

for (const [name,value] of Object.entries(o)) {
    console.log(name,value);
}
    ```

* Number of vars on the left doesn't have to match number on the right
* Extra variables on the left are `undefined`
* Extra values on the right are ignored
* If you want to collect all unused into a single variable, use `...`

    ```JavaScript
let [x, ...y] = [1,2,3,4];  // y == [2,3,4]
    ```

* Can be used with nested arrays

    ```JavaScript
let [a, [b, c]] = [1, [2, 2.5], 3]; // a is 1, b is 2, c is 2.5
    ```

* You can use any iterable object as the right hand side of an assignment

    ```JavaScript
let [first, ...rest] = "Hello"; // first = "H", rest = ["e","l","l","o"]
    ```

* Right hand side can also be an object value

    ```JavaScript
let transparent = { r:0.0, g:0.0, b:0.0, a:1.0 };
let {r, g, b} = transparent;    // var names match prop names

// taking object props off a global
let {sin, cos, tan} = Math;
    ```

* Not required to have the left hand side names match object props
* Mapping destructuring syntax:

    ```JavaScript
let { cos: cosine, tan: tangent } = Math;
    ```

* It's legal but confusing to do it with a nested object

# Chapter 3: Expressions and Operators

* "expression" - phrase of JS that can be evaluated to produce a value
* Complex expressions are built from simple expressions
* Most common way to build a complex expression from simple ones is with an operator
* Operators combine the value of operands and evaluate to a new value.

## 3.1 Primary Expressions

* Primary expressions do not include any simpler expressions.
* These are constant or literal values, some language keywords, and variable references
* Keywords that are primary expressions are
    * `true` and `false`
    * `null` and `undefined`
    * `this`

## 3.2 Object and Array Initializers

* These are expressions whose value is a new object or array
* Sometimes called object literals or array literals
* They're not primary expressions like real literals, since they include subexpressions to specify property and element values
* Array initializers are in brackets, comma separated: `[]`, `[1,2,3]`
* Can be nested: `[ [1,2], [3,4] ]`
* Undefined elements can be included by ommitting a value: `[1,,,,5]`
* A trailing single comma is allowed, does not create an undefined element
* Array accesses of out of bounds elements are undefined
* Object initializers are in curly braces, pair prop names and values
* Object initializers can be nested
* Property names in object literals may be strings rather than identifiers, if you need to use a string that is not a legal identifier

    ```JavaScript
let p = { x: 2.3, y: -1.2 };
let q = {};
q.x = 2.3;
q.y = -1.2;

let rect = {
    upperLeft: { x: 2, y: 2},
    lowerRight: { x: 4, y: 5}
};

let side = 1;
let square = {
    "upper-left": { x: p.x, y: p.y },
    'lower-right': { x: p.x + side, y: p.y + side }
};
    ```

## 3.3 Function Definition Expressions

* Defines a JS function
* Value of the expression is the newly defined function
* Function defs are kind of "function literals" similar to "object literals"
* Syntax:
    * keyword `function`
    * comma separated list of zero or more identifiers (parameter names) in parentheses
    * block of code (function body) in curly braces
* Example:

    ```JavaScript
let square = function(x) { return x * x; };
    ```

* May also include a name for the function
* Can be defined using a function statement rather than an expression
* In ES6+ can use the arrow function syntax

## 3.4 Property Access Expressions

* Evaluates to the value of an object property or array element
* Can use dot or bracket syntax: `x.y` or `x[y]`
* In either case, the expression before the operator is evaluated
    * if null or undef, throws a TypeError
* In dot syntax, the value of the property named by the identifier following the dot is looked up and becomes the entire expression value
* In bracket syntax, the second expression is evaluated and converted to a string. That is then used to get the value of the property named by the string, which is the ultimate value of the expression.
* If the named property does not exist, the expression evaluates to undefined
* Dot syntax is simpler, but can only be used when the property you want to access has a name that is a legal identifier--otherwise you must use brackets.

## 3.5 Invocation Expressions

* Calling syntax for functions and methods
* Starts with a function expression that identifies the function to call
* Followed by an open parenthesis, a comma separated list of zero+ params, close parenthesis
* When evaluated, the function expression is evaluated first, and then the argument expressions are evaluated to produce a list of argument values
* If the value of the function expression is not a function, TypeError
* Then the argument values are assigned to the parameter names specified in the function definition
* Then the function body is executed
* If it has a `return` statement it can return a value, otherwise undefined
* If the expression before the parens is a property access, it's a method call rather than a function call
* In method invocations the object or array that is the subject of the property access becomes the value of `this` in the body of the function
* Invocation expressions that are NOT method invocations typically use the global object as the value of `this`

## 3.6 Object Creation Expressions

* Creates a new object, invokes a constructor function to initialize the properties of the new object
* They're like invocation expressions except they're prefixed with `new`
* Ex: `new Object()`, `new Point(2,3)`
* On evaluation, JS:
    * creates a new object that is initialized to inherit properties and methods from a prototype object
    * invokes the specified constructor function with the specified args, passing the newly created object as teh value of `this`
    * constructor can use `this` to init properties on the new object
* Constructor functions do not return a value
* The value of the object creation expression is the newly created and initialized object
* If a constructor does return an object value, that value becomes the value of the object creation expression, and the newly created object is discarded.

## 3.7 Operator Overview

* Arithmetic
    * `++`, `--`, `-`, `+`
    * `**` (exponentiate)
    * `*`, `/`, `%`
* Assignment
    * `=`
    * `**=`, `*=`, `/=`, `%=`
    * `+=`, `-=`, `&=`, `^=`, `|=`
    * `<<=`, `>>=`, `>>>=`
* Bitwise:
    * `~` (invert bits)
    * `<<`, `>>` (shifts)
    * `>>>` shift right with zero extension
    * `&` AND
    * `^` XOR
    * `|` OR
* Boolean:
    * `!` (not)
    * `&&` AND
    * `||` OR
* Comparison:
    * `<`, `<=`, `>`, `>=`
    * `==`, `!=`
    * `===`, `!==`
* Other:
    * `delete` - property removal
    * `typeof` - determine operand type
    * `void` - return `undefined`
    * `instanceof` - test object class
    * `in` - property existence test
    * `?:` - ternary
    * `,` - discard first operand, return second

### 3.7.1 Number of Operands

* Most ops are binary, some are unary, one is ternary

### 3.7.2 Operand and Result Type

* Most operators expect particular operand types
* Most return / eval to a specific type
* Ops usually convert types as required
* Some operators behave differently based on operand types

### 3.7.3 Lvalues

* Operands of the `lval` type are references to a historical term (lvalue)
* These mean "an expression that can legally appear on the left side of an assignment expression."
* Lvalues are variables, object properties, and array elements

### 3.7.4 Operator Side Effects

* Simple expression evaluation will not effect program state
* Some expressions do have side effects that can effect future calculations
* Assignment operators are the most obvious, also autoinc/autodec
* `delete` has side effects
* No other operators have side effects, but function invocation and object creation expressions will have side effects if any of the operators used have them.

### 3.7.5 Operator Precedence

* Follows the table.
* Use parens to modify order of operations

### 3.7.6 Operator Associativity

* Follows the table for LtR and RtL
* Specifies order in which ops of the same precedence are executed

### 3.7.7 Order of Evaluation

* Precedence and associativity affect order in a complex expression
* They don't specify the order in which subexpressions are evaluated
* JS evaluates expressions in strictly left to right order
* Adding parens can change the relative order of operator execution, but not the LtR order of evaluation of subexpressions
* It only really matters if any expressions under eval have side effects

## 3.8 Arithmetic Expressions

## 3.9 Relational Expressions

* Test for a relationship, equals, less than, property of, etc.
* Return booleans

## 3.10 Logical Expressions

* Boolean algebra ops with `&&`, `||`, `!`

## 3.11 Assignment Expressions

## 3.12 Evaluation Expressions

* There's a global `eval()` function
* It can interpret strings as JS code
* Powerful feature, very rarely necessary.

## 3.13 Miscellaneous Operators

* Ternary ("Conditional Operator")
* `typeof` unary operator, returns string of operand type
* `delete` property removal unary operator
* `await`
* `void` - unary op, appears before a single operand of any type. Evaluates the operand, discards the value, returns `undefined`. Not used much--only makes sense if the operand has side effects.
* `,` (comma operator) - binary operator, any type of operands, evaluates left, then right, returns the value of the right. Only common usage is in a for loop with multiple loop vars:

    ```JavaScript
for (let i=0,j=0; i<j; i++,j--) {
    console.log(i+j);
}
    ```

# Chapter 4: Statements

* Expressions are phrases, statements are sentences/commands
* Terminated with semicolons
* Expressions are evaluated; statements are executed to do something
* Programs are sequences of statements to execute.
* By default, the interpreter executes the statements one after another, in the order written. You can alter this default order via control statements:
    * conditionals
    * loops 
    * jumps (`break`, `return`, `throw`)

## 4.1 Expression Statements

* Simplest statements are expressions that have side effects
* Assignments are a major category
* Also autoinc/autodec
* `delete` has side effects
* Function calls are another major category of expression statements

## 4.2 Compound and Empty Statements

* A statement block combines multiple statements into a compound statement
* You can enclose arbitrary statements inside curly braces to make a block
* The block itself does not end in a semicolon, just the primitive statements inside it
* JS has no block scope, vars in the statement block are not private to the block (not actually true with `let` and `const`)
* The empty statement just has a semicolon
* Occasionally useful if you need to create a loop with an empty body:

    ```JavaScript
    for(let i = 0; i < a.length; a[i++] = 0) ;
    ```

## 4.3 Conditionals

```JavaScript
if (n === 1) {
    // block 1
}
else if (n === 2) {
    // block 2
}
else {
    // block 3
}


switch(n) {
case 1:         // if n === 1
    // block 1
    break;
case 2:         // if n === 2
    // block 2
    break;
default:
    // block 3
    break;
}
```

## 4.4 Loops

```JavaScript
let count = 0;
while(count < 10) {
    console.log(count);
    count++;
}

let x = 0;
do {
    console.log(x);
} while (++x < 10);


for(let count = 0; count < 10; count++) {
    console.log(count);
}

let i, j, sum = 0;
for(i = 0, j = 10; i < 10; i++, j--) {
    sum += i * j;
}

// traversing a linked list
// returns the last object (first obj w/o next property)
function tail(o) {
    for(; o.next; o = o.next) /* empty */ ;
    return o;
}

// for/of
let data = [1,2,3,4,5,6,7,8,9], sum = 0;
for (let element of data) {
    sum += element;
}

// for/of with an object
let o = { x:1, y:2, z:3 };
let keys = "";
for (let k of Object.keys(o)) {
    keys += k;
}

// for/of with a string
let frequency = {};
for (let letter of "mississippi") {
    if (frequency[letter]) {
        frequency[letter]++;
    } else {
        frequency[letter] = 1;
    }
}

// for/of with set
let text = "Na na na na na na Batman!";
let wordSet = newSet(text.split(" "));
let unique = [];
for (let word of wordSet) {
    unique.push(word);
}

// for/of with map--iterates kv pairs
let m = new Map([[1,"one"]]);
for(let pair of m) {
    let k = pair[0];
    let v = pair[1];
}

// with destructuring
for(let [k,v] of new Map([[1,2]])) { ... }

// for/in loop
// works on any object
for (let p in o) {
    console.log(o[p]);
}
```

## 4.5 Jumps

* `break` - jump to the end of a loop or other statement
* `continue` - skip the rest of the loop body, jump to next iteration
* You can label statements and refer to those labels with `break` and `continue`
* `return` jumps from a function invocation to the code that invoked it, and supplies the value to the invocation
* `throw` raises an exception, works with `try/catch/finally`
* Labels are `identifier: statement`

    ```JavaScript
mainloop: while(token !== null) {
    // some stuff
    continue mainloop;
    // some other stuff
}
    ```
* `yield` is like `return`, but used only in generator functions
* Throwing an error:

    ```JavaScript
function factorial(x) {
    if (x < 0) throw new Error("x cannot be negative");
    let f;
    for (f = 1; x > 1; f *= x, x--) /* empty */ ;
    return f;
}

try {
    let n = Number(prompt("Enter an int", ""));
    let f = factorial(n);
    alert(n + "! = " + f);
}
catch (ex) {
    alert(ex);
}
finally {
    // cleanup code
}
    ```

## 4.6 Miscellaneous Statements

* `with` runs a code block as if the properties of an object were variables in scope for that block of code

    ```JavaScript
with(document.forms[0]) {
    name.value = "";
    address.value = "";
    email.value = "";
}
    ```

* `debugger` doesn't do anything unless a debugger is available and running, when it can act as a breakpoint
* `"use strict"` is a directive from ES5
* Directives aren't statements, though very similar
* Difference between `"use strict"` and regular statements:
    * does not include any language keywords
    * JS interpreters that don't implement ES5 see a string, do nothing
    * Can appear only at the start of a script or start of a function body
    * may be followed or preceded by other string literal directives, but no statements can appear above it and have it be used
* Effects of turning strict mode on:
    * `with` statement not allowed
    * all vars must be declared
    * functions invoked as functions (not as methods) have `this` set to `undefined`
    * `this` in functions invoked by `call()` or `apply()` is exactly the value passed as the first arg to `call()` or `apply()`
    * assignments to nonwritable properties, attempts to create new props on nonextensible objects throw a TypeError instead of failing silently
    * Code passed to `eval()` cannot declare vars or define functions in the caller's scope--eval gets its own scope that is discarded on return
    * The `arguments` object in a function has a static copy of the values passed to the function.
    * A SyntaxError is thrown if `delete` is followed by an unqualified identifier (instead of doing nothing)
    * An attempt to delete a nonconfigurable property throws a TypeError
    * It's a syntax error for an object literal to define two or more properties of the same name
    * Syntax error for a function declaration to have two or more parameters with the same name
    * Octal int literals are not allowed
    * The identifiers `eval` and `arguments` are treated as keywords, and are immutable
    * The ability to examine the call stack is restricted. `arguments.caller` and `arguments.callee` throw a TypeError

## 4.7 Declarations

* Keywords `const`, `let`, `var`, `function`, `class`, `import`, `export` are not statements, but look much like them and act much like them.
* They're actually declarations, which serve to define new values and give them names by which they can be referenced
* Expressions are evaluated, statements are executed, declarations are processed, and used to define constants, variables, functions, and classes, and for importing and exporting values between modules.
* Declarations define:
    * constants
    * variables
    * functions
    * classes
    * import/export between modules

### 4.7.1 const, let, and var

* `const` declares constants with block scope
* `let` declares variables with block scope
* `var` declares variables with function scope
* Don't use `var`, use `let`.

### 4.7.2 function

* Declares/defines functions:

    ```JavaScript
function area(radius) {
    return Math.PI * radius * radius;
}
    ```

* Function declarations in a block are processed before the code runs, and function names are bound to function objects throughout the block. Therefore they are 'hoisted' the same way as var declarations.

### 4.7.3 class

* Creates a new class, gives it a name/reference
* Simple declaration:

    ```JavaScript
class Circle {
    constructor(radius) { this.r = radius; }
    area() { return Math.PI * this.r * this.r; }
    circumfrence() { return 2 * Math.PI * this.r; }
}
    ```

* Class declarations are not hoisted, may not be used before declaration

### 4.7.4 import and export

* Used to make values defined in one module available in another
* `import` directives import one or more values from another file of JS code, give them names in the current module.
* Come in several forms. Examples:

    ```JavaScript
import Circle from './geometry/circle.js';
import { PI, TAU } from './geometry/constants.js';
import { magnitude as hypotenuse } from './vectors/utils.js';
    ```

* Values in a module are private, can not be imported into other modules unless they have been explicitly exported.
* `export` directive declares that one or more values in the current module are exported, and therefore available for import by other modules.
* `export` has more variants than `import`. Examples:

    ```JavaScript
// geometry/constants.js
const PI = Math.PI;
const TAU = 2 * PI;
export { PI, TAU };
    ```

* Sometimes `export` is a modifier on other declarations, which is a compound declaration that defines a constant/variable/function/class and exports it at the same time.
* When a module exports only a single value, typically done with `export default`:

    ```JavaScript
export const TAU = 2 * Math.PI;
export function magnitude(x,y) { return Math.sqrt(x*x + y*y); }
export default class Circle { /* class def */ }
    ```

# Chapter 5: Objects

## 5.1 Introduction to Objects

* An object is a composite value, aggregating multiple primitives and/or other objects, allowing you to store and retrieve those values by name.
* It's an unordered collection of properties, which are name/value pairs
* Property names are strings, mapped to values in a hash
* In addition to its own properties, JS objects inherit properties of a prototype object
* JS objects are dynamic, you can add/delete properties
* They can be used to simulate static objects / structs, or used to represent sets of strings (if you ignore values in the string-value mapping)
* Any value that is not: a string, a number, `true`, `false`, `null`, or `undefined` is an object. Strings, numbers, and booleans can behave like immutable objects, even as primitivs.
* Objects are mutable, manipulated by reference.
* Most common things to do with objects:
    * create them
    * set, query, delete, test and enumerate properties
* A property name can be any string, including the empty string
* No object may have two properties with the same name
* Values may be any JS value, or a getter or setter function
* Sometimes important to be able to distinguish between an object's own properties and those defined on a prototype
* Each property has three property attributes:
    * "writable" attribute specfies whether the property value can be set
    * "enumerable" attribute specifies whether the prop name is returned by a `for/in` loop
    * "configurable" attribute specifies whether the pro can be deleted, and whether its attributes can be altered
* By default, app user-created object properties are writable, enumerable, and configurable.

## 5.2 Creating Objects

* Can be created with object literals, `new`, or `Object.create()`

### 5.2.1 Object Literals

* Comma separated list of colon separated name/value pairs, in `{}`
* Property names are JS identifiers or string literals
* Property values are any JS expression, value of expression becomes value of property

    ```JavaScript
let empty = {};
let point = { x: 0, y: 0 };
let p2 = { x: point.x, y: point.y+1 };
let book = { 
    "main title": "JavaScript",
    "sub-title": "The Definitive Guide",
    for: "all audiences",
    author: {
        firstname: "David",
        surname: "Flanagan"
    }
};
    ```

* A trailing comma after the last property is legal
* An object literal is an expression that creates and initializes a new and distinct object each time it is evaluated.
* The value of each property is evaluated each time the literal is evaluated, so a single object literal can create multiple new objects if it appears in teh body of a loop, and the property values of those objects can differ.

### 5.2.2 Creating Objects with new

* `new` creates an initializes a new object
* Must be followed by a function invocation
* Functions used this way are constructors

### 5.2.3 Prototypes

* Every JS object has a second JS object (or `null`) associated with it as its "prototype"
* The first object inherits properties from the prototype
* All objects created with object literals have the same prototype, `Object.prototype`
* Objects created with `new` use the value of the `prototype` property of the constructor as their prototype, so:
    * `new Object()` inherits from `Object.prototype`
    * `new Array()` inherits from `Array.prototype`
    * `new Date()` inherits from `Date.prototype`
    * and so on
* `Object.prototype` itself has no prototype
* Other prototype objects are normal objects that do have prototypes
* The linkages form the "prototype chain"

### 5.2.4 Object.create()

* `Object.create()` creates a new object, using its first argument as hte prototype of that object
* Also takes an optional second arg describing props of the new object
* `Object.create()` is a static function, not a method invoked on objects
* Example:

    ```JavaScript
let o1 = Object.create({x: 1, y: 2});
o1.x + o1.y;
    ```

* You can pass `null` to create a new object that does not have a prototype, but the new object will not inherit anything, even stuff like `toString()`
* If you want an ordinary empty object, pass `Object.prototype`:

    ```JavaScript
let o2 = Object.create(null);       // inherits nothing at all
let o3 = Object.create(Object.prototype); // like new Object()
    ```

* One use for `Object.create()` is guarding against unintended but non-malicious modification of an object by a library function you don't control
* Instead of passing the object directly to the function, pass an object that inherits from it. Reads will go to the parent (prototype), writes to the child.

## 5.3 Querying and Setting Properties

* Obtain property values with `.` or `[]` operators
* Dot operator works with identifier names, brackets with identifiers/strings
* To create or set a property, use property access ops but as the left hand side of an assignment

### 5.3.1 Objects as Associative Arrays

* Both `object.property` and `object["property"]` have equivalent values
* Bracket access is associative array access
* In strongly typed languages (C, C++, Java), objects can have only a fixed number of properties, and the property names must be defined in advance.
* JS is loosely typed, and allows you to create and manage properties dynamically
* When you use the dot operator to access a property, the name of the property is expressed as an identifier. Identifiers must be hard-coded into the program, they aren't runtime strings.
* Using brackets, the name of the property is a string. Strings are JS datatypes, and can be manipulated at runtime.
* Example:

    ```JavaScript
let addr = "";
for (let i = 0; i < 4; i++) {
    addr += customer["address"+i] + "\n";
}
    ```

* Using `for/in` with objects as associative arrays:

    ```JavaScript
function computeValue(portfolio) {
    let total = 0.0;
    for (let stock in portfolio) {
        let shares = portfolio[stock];
        let price = getQuote(stock);
        total += shares * price;
    }
    return total;
}
    ```

### 5.3.2 Inheritance

* JS objects have "own properties" and props inherited from a prototype
* Examples here use `Object.create()` to specify prototypes
* Hypothetical:
    * You query `x` property on object `o`
    * If `o` has no own property `x`, `o.prototype.x` is queried
    * If the prototype does not have an own property `x`, but has its own prototype, the query happens again on that prototype
    * Continue until `x` is found or until an object with a `null` prototype is reached.
* Hypothetical 2:
    * You assign to `o.x`
    * If `o` already has an own property `x`, assignment happens to that
    * Otherwise, it creates a new prop `x` on `o`
    * If `o` has an inherited `x`, that is now hidden
* Assignment to a property only examines the prototype chain to determine whether the assignment is allowed.
* If `o` inherits a read-only `x`, the the assignment is not allowed
* If it _is_ allowed, it always creates or sets a property in the original object, and never modifies objects in the prototype chain.

    ```JavaScript
let unitcircle = { r: 1 };
let c = Object.create(unitcircle);
c.x = 1; c.y = 1;                   // defines own props
c.r = 2;                            // overrides inherited prop
unitcircle.r                        // => 1, prototype unaffected
    ```

* One exception to the rule that a prop assignment either fails or creates/sets on the original object: If `o` inherits `x`, and that property is an accessor property with a setter method, then the setter method is called rather than creating a new property on `o`. However, the setter is called on `o`, NOT on the prototype that defines it, so if the setter defines any properties they are on `o`, and the prototype chain is unmodified.

### 5.3.3 Property Access Errors

* Access expressions don't always return or set a value
* Things can go wrong with querying / setting a property
* It isn't an error to query a property that does not exist
* If `x` is not found as an own or inherited prop, `o.x` evals to `undefined`
* It IS an error to query a property of an object that doesn't exist
* That can include querying sub-props on non-existent property objects:

    ```JavaScript
let book = {
    "main title": "JavaScript",
    "sub-title": "The Definitive Guide"
};

let len = book.subtitle.length; // TypeError: undefined doesn't have length
    ```

* Property access expressions fail if the left hand side is undefined or null
* Guards against this kind of problem:

    ```JavaScript
// verbose and explicit
let surname = undefined;
if (book) {
    if (book.author) {
        surname = book.author.surname;
    }
}

// concise and idiomatic, uses short-circuit of &&
surname = book && book.author && book.author.surname;
    ```

* Setting a property on null or undefined also causes a TypeError
* Attempts to set read-only properties fail
* Attempts to add properties to objects that disallow it fail
* Usually fails silently, unless you turn on strict mode
* Rules that specify when a property assignment succeeds/fails are intuitive but difficult to express concisely. Setting `o.p` fails when:
    * `o` has an own property `p` that is read-only (you can't set a read-only property)
    * `o` has an inherited property `p` that is read-only (you can't hide a read-only property with a prop of the same name)
    * `o` does not have an own property `p`, does not inherit a `p` with a setter method, and `o` has its extensible attribute set to `false`. If `p` does not already exist on `o`, and there is no setter to call, then `p` must be added to `o`--but if `o` is not extensible, it can't have new properties.

## 5.4 Deleting Properties

* `delete` removes a property from an object
* Single operand should be a property access expression
* It doesn't operate on the value, but on the property itself
* Only removes own properties, not inherited
* To delete an inherited property, you must delete it from the prototype
* `delete` expressions evaluate to `true` if the delete succeeds or had no effect (or with an expression that isn't a property access)
* Does not remove properties that have a configurable attribute of `false`
* Some props of built in objects are nonconfigurable, as are props of the global object created by variable declaration and function declaration
* When deleting configurable properties of the global object in non-strict mode, you can omit the reference to the global object, and just follow `delete` with the property name:

    ```JavaScript
this.x = 1;     // configurable global prop, no var/let
delete x;       // delete it
    ```

## 5.5 Testing Properties

* JS objects are sets of properties, useful to test for membership
* Can do it with `in`, `hasOwnProperty()`, and `propertyIsEnumer
* `in` expects a property name on the left and an object on the right, returns `true` if object has own or inherited property by that name
* `hasOwnProperty()` tests whether the object has that name as own property
* `propertyIsEnumerable()` refines `hasOwnProperty()` test, which returns `true` only if the named property is an own property AND its enumerable attribute is `true`

    ```JavaScript
let o = { x: 1 };
"x" in o                        // true
"y" in o                        // false
"toString" in o                 // true

o.hasOwnProperty("x");          // true
o.hasOwnProperty("y");          // false
o.hasOwnProperty("toString");   // false

o.propertyIsEnumerable("x");    // true
o.propertyIsEnumerable("toString"); // false, not own prop
Object.prototype.propertyIsEnumerable("toString"); // false: not enumerable
    ```

* Often sufficient to query the property and use `!==` to test for undefined:

    ```JavaScript
let o = { x: 1 };
o.x !== undefined               // true: o.x exists
o.y !== undefined               // false: o.y does not
o.toString !== undefined        // true: o.toString inherited
    ```

* One thing `in` can do that the above cannot: can distinguish between properties that don't exist and properties that exist but have been set to undefined:

    ```JavaScript
let o = { x: undefined };
o.x !== undefined               // false
o.y !== undefined               // false
"x" in o                        // true!
"y" in o                        // false
delete o.x;
"x" in o                        // false
    ```

* Another wrinkle around `!==` vs `!=`:

    ```JavaScript
// if o has a prop x whose value is not null or undef, double it
if (o.x != null) o.x *= 2;

// if o has a prop x whose value does not convert to false, double it
// if x is undef, null, false, "", 0, or NaN, leave it alone
if (o.x) o.x *= 2;
    ```

## 5.6 Enumerating Properties

* `for/in` runs the body of the loop once for each enumerable property, own or inherited, of the specified object, assigning the name of the property to the loop variable
* Built in methods that objects inherit are not enumerable, but user created properties are enumerable by default
* If you want to avoid enumerating inhereited properties, add a check:

    ```JavaScript
for (let p in o) {
    if (!o.hasOwnProperty(p)) continue; // skip inherited props
}

for (let p in o) {
    if (typeof o[p] === "function") continue; // skip methods
}
    ```

* Often easier to get an array of property names and loop with `for/of`
* You can get property names with
    * `Object.keys(myObj)` - returns array of names of enumerable own props
    * `Object.getOwnPropertyNames()` - array of names of non-enumerable own properties as well, as long as their names are strings
    * `Object.getOwnPropertySymbols()` returns own props whose names are Symbols
    * `Reflect.ownKeys()` - returns all property names, enumerable or not, both string and Symbol

### 5.6.1 Property Enumeration Order

* ES6 defines the order for property enumeration, used by the following methods and their related methods:
    * `Object.keys()`
    * `Object.getOwnPropertyNames()`
    * `Object.getOwnPropertySymbols()`
    * `Reflet.ownKeys()`
    * related methods like `JSON.stringify()`
* Ordering:
    1. String properties whose names are non-negative integers, smallest to largest. Means arrays and array-like objects have props enumerated in order.
    1. After all props that look like array indices, all remaining properties with string names, including those that look like negative numbers or floats. Listed in the order in which they were added to the object.
    1. Properties whose names are Symbols, in the order added

## 5.7 Extending Objects

* Common operation is copying properties of one object to another, like

    ```JavaScript
let target = { x: 1 }, source = { y: 2, z: 3 };
for (let key of Object.keys(source)) {
    target[key] = source[key];
}
    ```

* It's a common operation, so ES6 added `Object.assign()`
* `Object.assign(targetObj, sourceObj1[, sourceObjN])` takes two or more objects as args, modifies and returns the first arg, doesn't alter the other args.
* For each source object, it copies the enumerable own properties of that object (including Symbol named ones) into the target object.
* The source objects are processed in order, so that props in the first source object override props by the same name in the target, props in the second source object override those of the same name in the first, etc.
* `Object.assign()` copies props with ordinary property get and set ops, so if a source object has a getter method or the target has a setter, they are invoked during the copy but not themselves copied.
* One reason to use it is to assign properties from an object that defines default values into another object, if a property of the default name doesn't exist.
* `Object.assign()` by itself won't do that, so you have to create a new object, copy the defaults into it, then override the defaults with the properties from the target:

    ```JavaScript
o = Object.assign({}, defaults, o);
    ```

* Can also be expressed with the spread operator as `o = {...defaults, ...o};`

## 5.8 Serializing Objects

* Serialization is converting object state to a string that it can be restored from at some later point.
* `JSON.stringify()` and `JSON.parse()` do serde work
* JSON cannot represent all JS values
* Can represent:
    * Objects
    * Arrays
    * Strings
    * Finite numbers
    * `true`, `false`, `null`
* `NaN`, `Infinity`, and `-Infinity` serialize to `null`
* Date objects serialize to ISO formatted datestrings, which `JSON.parse()` leaves as strings and will not restore to Date objects
* Function, RegExp, and Error objects, and `undefined`, cannot be serialized or restored.
* `JSON.stringify()` only serializes the enumerable own properties of an object
* If a property value cannot be serialized, the property is omitted from output
* Both `stringify()` and `parse()` accept second args that can customize the serialization / restoration process

## 5.9 Object Methods

* All JS objects inherit from `Object.prototype` (except those created with `Object.create(null)`)
* The inherited properties are mostly methods, and therefore pretty universally available
* This section focuses on universal object methods that are intended to be overridden by more specialized implementations

### 5.9.1 The toString() Method

* Takes no arguments, returns a string representing the value of the object it was invoked on
* JS invokes the method during conversion to a string
* Default `toString()` isn't very informative, though it can be helpful in determining the class of an object
* Lots of classes define their own `toString()`

    ```JavaScript
let point = {
    x: 1,
    y: 2,
    toString: function() { return `(${this.x}, ${this.y})`; }
};
String(point)       // => "(1, 2)"
    ```

### 5.9.2 The toLocaleString() method

* Objects have `toLocaleString()`, which returns a localized obj representation
* Default `Object.toLocaleString()` doesn't do any localization itself, just calls `toString()` and returns that
* You can add `toLocaleString()` overrides

### 5.9.3 The valueOf() method

* Called on conversion to (typically) a Number
* Automatically called when a conversion to primitive is required
* Default method doesn't do anything interesting
* Some built ins define their own valueOf
* Date objects can be compared with `>` and `<` via `valueOf()` conversions

### 5.9.4 The toJSON() method

* There's no `Object.prototype.toJSON()`
* `JSON.stringify()` looks for `toJSON()` on any object it is asked to serialize

## 5.10 Extended Object Literal Syntax

### 5.10.1 Shorthand Properties

* If you have values in `x` and `y` variables, and you want to create an object with properties named `x` and `y` that hold those values, you can do it succinctly:

    ```JavaScript
let x = 1, y = 2;
let o = { x, y };
    ```

### 5.10.2 Computed Property Names

* If a property name can't be known at compile time, you can't use an object literal to define it. Instead you create an object and add properties as an extra step:

    ```JavaScript
const PROPERTY_NAME = "p1";
function computePropertyName() { return "p" + 2; }

let o = {};
o[PROPERTY_NAME] = 1;
o[computePropertyName()] = 2;
    ```

* ES6 has a "computed properties" feature that lets you use the syntax above in an object literal:

    ```JavaScript
const PROPERTY_NAME = "p1";
function computePropertyName() { return "p" + 2; }

let p = {
    [PROPERTY_NAME]: 1,
    [computePropertyName()]: 2
};
    ```

* Reasonable use case is when you have a JS lib that expects to be passed objects with a particular set of properties, and the names of those properties are defined as constants in that library.

### 5.10.3 Symbols as Property Names

* Computed property syntax also enables another object literal feature, where property names can be symbols assigned with the computed property syntax:

    ```JavaScript
const extension = Symbol("my extension symbol");
let o = {
    [extension]: { /* extension data in this object */ }
};
o[extension].x = 0; // won't conflict with other props on o
    ```

* 

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
