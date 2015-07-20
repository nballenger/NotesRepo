# Notes on Swift Essentials

By: Dr Alex Blewitt; Publisher: Packt Publishing; Pub. Date: December 26, 2014

## Chapter 1: Exploring Swift

* Covers:
    * Using the Swift REPL
    * Types of Swift literals
    * Iterating arrays, dictionaries, sequences
    * Functions, function args
    * Compiling/running from the command line
    
### Getting started with Swift

* Interpreter is ``swift``, can be launched with ``xcrun``: ``xcrun swift``

#### Numeric Literals

* Can be signed or unsigned
* Sizes 8, 16, 32, 64 bits for integers
* Can also be signed 32 or 64 bit floats
* Underscores can be included for readability
* Other bases possible with prefixes:
    * binary: ``0b`` - ``0b1010011``
    * octal: ``0o`` - ``0o123``
    * hex: ``0x`` - ``0x7b``
    
#### Floating point literals

* Three float types: ``Double`` (64 bit), ``Float`` (32 bit), and ``Float80`` (80 bit)
* ``Double`` is the default
* Exponentiation is done with ``e``: ``5e2`` is five times ten squared

#### String literals

* Strings can contain escaped chars, unicode, and interpolated expressions
* Escapes: ``\\ \0 \' \" \t \n \r \u{NNN}``
* Interpolated strings: ``"3 + 4 is \(3+4)"``

#### Variables and Constants

* Variables can be modified after assignment, constants can't
* Identifier naming rules:
    * Starts with underscore or letter
    * Continues with underscore or alphanumeric character
    * After that any unicode character point can be used, except box lines/arrows
* Variables declared with ``var`` keyword
* Constants defined with ``let`` keyword
* If types are not specified they are inferred automatically
* Type conversion happens with type initializer or assignment to a new variable
* Conversion will error if it over or under flows
* Declaration, assignment, explicit typing, type conversion:

```Swift
let pi = 3.141
var i = 0
++i

let e:Float = 2.718
let ff:UInt8 = 255

let ooff = UInt16(ff)
UInt8(255)
```

#### Collection Types

* Two types: array and dictionary
* Both strongly typed and generic
* Array and dict literals are both enclosed in brackets
* Array items are comma separated, dict items are k:v, comma separated
* Collections defined with ``var`` are mutable, with ``let`` are not
* You can index into either with subscript operators
* Declaration, definition, use:

```Swift
var shopping = [ "Milk", "Eggs", "Coffee", ]
var costs = [ "Milk": 1, "Eggs": 2, "Coffee": 3, ]

shopping[0]
costs["Milk"]

shopping.count
shopping += ["Tea"]
```

#### Optional Types

* Optional types are regular type names suffixed with a question mark
* They allow for the possibility that the value may be ``nil``
* Collections report that their type is optional, since a missing value would be ``nil``
* You can explicitly create an optional type with the ``Optional`` constructor

#### Nil coalescing operator

* Provides ability to specify a default if an expression is ``nil``: ``nil ?? "was nil"``

### Conditional Logic

* Two key conditionals in Swift: ``if`` and ``switch``

#### If statements

* Conditionally unpacking an optional value, avoiding double evaluation:

```Swift
var shopping = ["Milk", "Eggs", "Coffee", "Tea", ]
var costs = [ "Milk": 1, "Eggs": 2, "Coffee": 3, "Tea": 4, ]
var cost = 0

if let cm = costs["Milk"] {
    cost += cm
}
```

* Using else blocks:

```Swift
if let cb = costs["Bread"] {
    cost += cb
} else {
    println("Cannot find any Bread")
}
```

* Equality operators for testing value comparisons: ``== != < <= > >=``
* Identity operators for testing reference comparisons: ``=== !==``
* Testing for type: ``is``
* Pattern match operator (testing patterns against literals): ``~=``
* Ternary: ``expression ? if-true : if-false``
* Range operators: inclusive: ``1...10``, exclusive: ``1..<10``

#### Switch statements

* NOTE: Case statements in swift do NOT fall through by default.
* Value of case statements can be expressions instead of values
* At the end of the case, evaluation jumps to the end of switch unless the ``fallthrough`` keyword is used
* If no case matches, the ``default`` executes

```Swift
var position = 21

switch position {
    case 1: println("First")
    case 2: println("Second")
    case 3: println("Third")
    case 4...20: println("\(position)th")
    case position where (position % 10) == 1:
        println("\(position)st")
    case let p where (p % 10) == 2:
        println("\(p)nd")
    case let p where (p % 10) == 3:
        println("\(p)rd")
    default: println("\(position)th")
}
```

### Iteration

* Using a range to iterate, and using ``_`` as throwaway var

```Swift
for i in 1...12 {
    println("i is \(i)")
}

for _ in 1...12 {
    println("Looping...")
}
```

* Using ``for...in``

```Swift
var shopping = [ "Milk", "Eggs", "Coffee", "Tea", ]
var costs = [ "Milk": 1, "Eggs": 2, "Coffee": 3, "Tea": 4, ]
var cost = 0

for item in shopping {
    if let itemCost = costs[item] {
        cost += itemCost
    }
}
```

* It isn't performant to convert dictionary values to an array for iteration
* The underlying values are ``MapCollectionView`` type, which gives an iterable nternal view of the data structure

#### Iterating over keys and values in a dictionary

* To print the keys in a dictionary, use ``for...in``
* To iterate keys and values, iterate in pairwise tuples

```Swift
for item in costs.keys {
    println(item)
}

for (item, cost) in costs {
    println("The \(item) costs \(cost)")
}
```

#### Iteration with for loops

* You can use a more traditional for loop
* You can use a comma separated expression list to use multiple values
* Apple recommends prefix use of the auto increment/decrement operators

```Swift
var sum = 0

for var i = 0; i <= 10; ++i {
    sum += i
}

for var i = 0,j = 10; i <= 10 && j >= 0; ++i, --j {
    println("\(i), \(j)"
}
```

#### Break and continue

* ``break`` leaves the innermost loop early
* ``continue`` takes execution to the top of the innermost loop / the next item
* You can use labels to break/continue specific loops.
* Labels in Swift can ONLY be applied to a loop statement

```Swift
var dec = [1...13, 1...13, 1...13, 1...13]
suits: for suit in deck {
    for card in suit {
        if card == 3 {
            continue // go to next card in same suit
        }
        if card == 5 {
            continue suits // go to next suit
        }
        if card == 7 {
            break // leave card loop
        }
        if card == 13 {
            break suits // leave suit loop
        }
    }
}
```

### Functions

* Created with the ``func`` keyword, with arg set and invokeable body
* ``return`` statement leaves a function body
* Return type of the function specified with ``->`` after args

```Swift
var shopping = [ "Milk", "Eggs", "Coffee", "Tea", ]
var costs = [ "Milk": 1, "Eggs": 2, "Coffee": 3, "Tea": 4, ]

func costOf(items:[String], costs[String:Int]) -> Int {
    var cost = 0
    for item in items {
        if let cm = costs[item] {
            cost += cm
        }
    }
    return cost
}

costOf(shopping, costs)
```

#### Named arguments

* Named args can use the name of the variable or be defined with an external parameter name
* Using ``basket`` and ``prices`` as arg names:

```Swift
func costOf(basket items:[String], prices costs:[String:Int]) -> Int {
    // ...
}

costOf(basket:shopping, prices:costs)
```

* If you prefix an arg name with hash, it is automatically used as a parameter:

```Swift
func costOf(#items:[String], #costs:[String:Int]) -> Int {
    // ...
}

costOf(items:shopping, costs:costs)
```

#### Optional arguments and default values

* Specifying a default makes the argument optional
* Default arguments are implicitly named, so don't prefix with a hash
* Refactoring to not have to pass costs dict every time:

```Swift
func costOf(#items:[String], costs:[String:Int] = costs) -> Int {
    // ...
}

costOf(items:shopping)
```

#### Anonymous arguments

* Args with defaults must be named, same with args to initializers for classes
* If that isn't helpful/necessary, you can disable naming it with ``_``

```Swift
func costOf(items:[String], _ costs:[String:Int] = costs) -> Int {
    // ...
}

costOf(shopping)
costOf(shopping, costs)
```

#### Multiple return values and arguments

* Tuples can return multiple value types; the type of a tuple is the type of its constituent parts, like ``(Int, String)``
* You can call a function with an array of values, but you can also use 'variadic' functions to allow calling with multiple arguments
* The last arg in a function signature can be variadic, which means it has ellipses after the type, and the value can be used as an array in the function
* Using both features to create a function returning both min and max from a list of integers:

```Swift
func minmax(numbers:Int...) -> (Int,Int) {
    var min = Int.max
    var max = Int.min
    for number in numbers {
        if number < min {
            min = number
        }
        if number > max {
            max = number
        }
    }
    return (min,max)
}

minmax(1,2,3,4)
```

#### Returning structured values

* Tuples are ordered, but not labeled, so can be confusing
* Structures are like tuples with named values
* Defined with the keyword ``struct``
* Defining a structure type and using it as the return value:

```Swift
struct MinMax {
    var min:Int
    var max:Int
}

func minmax(numbers:Int...) -> MinMax? {
    var minmax = MinMax(min:Int.max, max:Int.min)
    if numbers.count == 0 {
        return nil
    } else {
        for number in numbers {
            if number < minmax.min {
                minmax.min = number
            }
            if number > minmax.max {
                minmax.max = number
            }
        }
        return minmax
    }
}
```

### Command-line Swift

* If you set the hashbang to ``swift`` you can execute the script
* You can also compile them to a native executable
