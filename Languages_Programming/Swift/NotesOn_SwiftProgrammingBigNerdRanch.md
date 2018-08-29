# Notes on Swift Programming: The Big Nerd Ranch Guide

By John Gallagher, Matthew Mathias; Big Nerd Ranch Guides 2016; ISBN 9780134610733

# Chapter 2: Types, Constants, and Variables

Variables, constants, type declaration:

```Swift
var some_str = "Hello, world"
some_str += '!'

var some_number: Int = 4
some_number += 2

let some_constant: Int = 4

var some_declared_number: Int
some_declared_number = 10
```

String interpolation:

```Swift
import Cocoa

let townName: String = "Myville"
let townDesc = "\(townName) is a town."
```

# Chapter 3: Conditionals

If/else:

```Swift
var population: Int = 10
var message: String

if population == 0 {
    print("Oh no.")
}

if population < 20 {
    message = "\(population) is small"
} else if population > 1000 {
    message = "huge"
} else {
    message = "\(population) is big"
}

// Ternary
message = population < 20 ? "small" : "big"
```

* Basic comparison operators: &lt; &lt;= &gt; &gt;= == !=
* Note that === and !== are reference equality comparators.
* Logical operators: &amp;&amp; || !

# Chapter 4: Numbers

* Two basic types: integers and floats
* Ints are mostly 64 bit signed, except on old ios devices where they're 32
* There's explicit integer size types: Int8, Int16, Int32
* There are also unsigned types: UInt, UInt8, UInt16, UInt32
* Style is to prefer Int for all cases not explicitly requiring a sized type
* Integer operations: + - *
* Integer division truncates the decimal part
* % is the remainder operator, NOT modulo, so -11 % 3 is -2
* The operators have assignment shortcuts like +=
* Overflows hit a trap and stop program execution (try to add 10 to an Int8 value of 120)
* There are overflow operators that handle gracefully by wrapping around: &amp;+
* Literals will be floats

```Swift
// Int types
let numberOfPages: Int = 10         // Explicit declaration
let numberOfChapters = 3            // Implicit declaration

// Float types
let d1 = 1.1                        // Implicitly Double
let d2: Double = 1.1                // Explicitly Double
let f1: Float = 100.3
```

# Chapter 5: Switch

```Swift
switch aValue {
    case someValue:
        // do something
    case otherValue:
        // do something
    default:
        // do when no match
}
```
