# Notes on Functional Python Programming, by Steven Lott

Packt Publishing; 2015; ISBN: 978-1-78439-699-2

## Chapter 1: Introducing Functional Programming

* Functional programming:
    * Defines computation via expressions and evaluations, via functions
    * De-emphasizes or avoids state change and mutable objects
* Python is not a purely functional language, though it has functional features
* Book looks at the problem domain of Exploratory Data Analysis

### Identifying a Paradigm

* Distinguishes between functional and imperative programming
* Takes state as point of differentiation between them
* Imperative: 
    * state reflected by the values of variables in available namespaces
    * Statements change state by changing variable values
    * Each statement is a state change command
    * Python changes state by assignment, and modifies context / variable interpretation via statements like ``global nonlocal def class import try except if elif else for while``
* Functional:
    * State is replaced with the idea of evaluating functions
    * Each function eval creates a new object or objects out of existing ones
    * Programs are compositions of functions, so you design lots of lower level functions that are each easy to understand
    * Higher level compositions can be easier to understand than complex sequences of statements

### Subdividing the procedural paradigm

* Looks at imperative vs object oriented--OO is a subset of imperative
* Procedural and OO versions of a numeric summation:

```Python
# Procedural:
s = 0
for n in range(1,10):
    if n % 3 == 0 or n % 5 == 0:
        s += n
print(s)


# OO built-ins:
m = list()
for n in range(1,10):
    if n % 3 == 0 or n % 5 == 0:
        m.append(n)
print(sum(m))


# Custom OO:
class SummableList(list):
    def sum(self):
        s = 0
        for v in self.__iter__():
            s += v
        return s
```

### Using the functional paradigm

* Functionally, sum of multiples of 3 and 5 can be defined in two parts:
    * sum of a sequence of numbers
    * sequence of values that pass a test condition
* Sum of a sequence has a simple, recursive definition, as does a sequence of values:

```Python
# Sum of a sequence:
def sum(seq):
    if len(seq) == 0: return 0      # Base case
    return seq[0] + sum(seq[1:])    # Recursive case


# Sequence of values:
def until(n, filter_func, v):
    if v == n: return []
    if filter_func(v):
        return [v] + until(n, filter_func, v+1)
    else: return until(n, filter_func, v+1)

mult_3_5 = lambda x: x%3 == 0 or x%5 == 0

answer = sum(until(10, mult_3_5, 0))
```

* Important to note that purely functional compilers can usually optimize these kinds of recursive functions, while Python cannot.

### Using a functional hybrid

* A hybrid version using nested generators:

```Python
print( sum(n for n in range(1,10) if n%3==0 or n%5==0) )
```

* Note that ``n`` is not re-assigned a value, as it goes in and out of scope.
* "As we work with generator expressions, we'll see that the bound variable is at the blurry edge of defining the state of the computation."

### Looking at object creation

* "What's important is that the history of a computation is not fixed. When functions are commutative or associative, then changes to the order of evaluation might lead to different objects being created. This might have performance improvements with no changes to the correctness of results."
* Ex: ``1+2+3+4`` vs. ``((1+2)+3)+4`` produces the same result, but may have different internal representations within the language you use.
* "What's important for functional design is the idea that the ``+`` operator or ``add()`` function can be used in any order to produce the same results. The ``+`` operator has no hidden side effects that restrict the way this operator can be used."

### The stack of turtles

* Python for functional programming will always be a hybrid approach because the langauge and processor are not functional. 
* CPUs are generally procedural.
* The book's functional python programs will rely on these three stacks of abstractions:
    * Our applications will be functions--all the way down--until we hit the objects
    * The underlying Python runtime environment that supports our functional programming is objects--all the way down--until we hit the turtles
    * The libraries that support Python are a turtle on which Python stands

### A classic example of functional programming

* Based on the paper 'Why Functional Programming Matters' by John Hughes (1990)
* Looking at one example from paper, the Newton-Raphson algorithm for finding the roots of a function (in this case the function is the square root)
* Backbone is the approximation of the nxt value from the current value
* Example of having ``next_()`` take an approximation of the current root and return a next value bracketing the real root:

```Python
def next_(n,x):
    return (x+n/x)/2

n = 2
f = lambda x: next_(n, x)
a0 = 1.0

# Using it to converge on sqrt(2):
[round(x,4) for x in (a0, f(a0), f(f(a0)), f(f(f(a0))),)]
```

* You could write a function to generate an infinite sequence of values converging on the proper square root (``repeat()``)
* If you use a return in there you return a generator instead of a sequence
* So you can either use a for loop or a yield from. Book emphasizes ``yield from``
* You have to be careful about taking items from an infinite sequence one at a time in Python
* Example below uses an interface function (``within()``) to wrap a slightly more complex recursion:

```Python
def repeat(f,a):
    yield a
    for v in repeat(f, f(a)):
        yield v

# epsilon is allowable margin of error
def within(epsilon, iterable)
    def head_tail(epsilon, a, iterable):
        b = next(iterable)
        if abs(a-b) <= epsilon: return b
        return head_tail(epsilon, b, iterable)
    return head_tail(epsilon, next(iterable), iterable)


# Using the functions to create a square root function:
def sqrt(a0, epsilon, n):
    return within(epsilon, repeat(lambda x: next_(n,x), a0))
```

* ``repeat()`` generates a potentially infinite sequence of values based on ``next_(n,x)``, but ``within()`` will stop generating values when the difference between current and next is less than epsilon

### Exploratory Data Analysis

* Several widely accepted stages of EDA, including:
    * Data preparation
    * Data exploration
    * Data modeling and machine learning
    * Evaluation and comparison of models
* Goal is often to create a model for decision support

## Chapter 2: Introducing Some Functional Features

### First-class Functions

* For functional programming to work, functions must be first class citizens
* Python creates objects via the ``def`` statement and ``lambda``

#### Pure Functions

* Functions should have no side effects, to be conceptually simpler and allow for composition into different higher order functions
* Pure in python terms means local-only code, so no ``global`` statements, and very careful use (if any) of ``nonlocal``
* Lambdas are pure functions, if very short

#### Higher-order functions

* Higher order functions accept a function as an argument, or return one
* Lots of higher-order functions in Python, covered in Chapter 5

### Immutable Data

* Using ``tuples`` and ``namedtuples`` gives you immutable data structures
* You avoid class definitions almost entirely--functional programming doesn't need stateful objects.
* You might define callable objects to create namespaces for related functions
* Common design pattern that goes well with immutable objects is the ``wrapper()`` function
* Two very common ways to process a list of tuples:
    * Using higher order functions in combination function args
    * Using the ``unwrap(process(wrap(structure)))`` pattern

### Strict and non-strict evaluation

* Non-strict evaluation is deferring a computation until required
* In python, ``and or if-then-else`` are all non-strict / short-circuit
* Class definitions, ``Literal`` lists and tuples, and sequences of statements are all strictly evaluated, and class members are retained in order
* Generator expressions and functions are lazy

### Recursion instead of an explicit loop state

* Functional programs don't do loops because loops require state (counters, etc)
* Define the base case(s) and the recursive case(s), decompose it if necessary
* Tail call recursion doesn't require the frame stack to stay open--the summation / grouping function is passed down the stack and out the last frame
* Two problems with recursion in Python:
    * There's a recursion limit that detects functions with improper base cases
    * Python has no tail call optimization in the compiler
* Default recursion limit is 1000, though settable in ``sys.setrecursionlimit()``
* If you use a generator instead of a recursive function, you essentially do tail call optimization manually
* TCO as a generator expression, for prime finding:

```Python
def isprime(p):
    if p < 2: return False
    if p == 2: return True
    if p % 2 == 0: return False
    return not any(p==0 for p in range(3, int(math.sqrt(n))+1, 2))
```

### Functional type systems

* Python doesn't declare types for functions and arguments
* Mostly that's fine, occasionally you'll use ``isinstance(a, tuple)`` to detect if an argument is a tuple or a single value

### Familiar Territory

* Most functional programming needs are already present in Python
* Haivn a good API is a clear example of functional programming
* Making a class with ``return self()`` in each method function means you can chain commands, like ``someobj.foo().bar().baz()``
* Alternatively, you could call related functions as ``baz(bar(foo(someobj)))``

### Saving some advanced concepts

* This stuff will be covered later, but is worth mentioning now:
    * Referential transparency - should have multiple routes to the same object, though in python this isn't a big deal because there aren't relevant compile-time optimizations
    * Currying - type systems will use it to reduce multi-arg functions down to single arg functions
    * Monads - purely functional constructs that letyou structure a sequential pipe of processing in a flexible way
    

## Chapter 3: Functions, Iterators, and Generators

* "The core of functional programming is the use of pure functions to map values from the input domain to the output range."
* Chapter covers:
    * pure functions, free of side effects
    * functions as first class objects
    * use of strings using OO suffix and prefix notation
    * using tuples/namedtuples to enable stateless objects
    * using iterable collections as a primary design tool
    * generators and generator expressions
    * optimizing recursion manually with generator expressions
    * generator expressions for:
        * conversions
        * restructuring
        * complex calculations
    * survey of built-in Python collections

### Writing pure functions

* Pure functions have no side effects (no global variable changes)
* Don't allow functions to change the state of mutable objects
* Many internal Python objects are stateful, like ``file`` instances
* "We observe that the most commonly used stateful objects in Python generally behave as context managers."
* Can't easily eliminate stateful Python objects except from small programs
* Have to manage state, as in using ``with`` to encapsulate file objects into a well defined scope

### Functions as first-class objects
