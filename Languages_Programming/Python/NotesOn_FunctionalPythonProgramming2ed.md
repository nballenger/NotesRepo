# Notes on Functional Python Programming, 2nd Ed.

By Steven F. Lott, Packt Publishing 2018

ISBN 9781788627061

# Understanding Functional Programming

## Identifying a Paradigm

* Two paradigms under consideration: functional and imperative programming
* Important distinguishing feature: state
* In imperative languages each statement is a command to change state
* Functional programming replaces state change with function evaluation
* Each function evaluation creates a new object or objects from existing ones
* Tends to be relatively "succinct, expressive, and efficient compared to imperative", but requires careful design to achieve

## Subdividing the Procedural Paradigm

* Focuses on how OO programming is a subset of imperative programming
* Lots of pedantry.
* Various OO and imperative ways of summing a sequence

### Using the Functional Paradigm

* Sum of a sequence via recursion:

        def sumr(seq):
            if len(seq) == 0: return 0
            return seq[0] + sumr(seq[1:])

* Has a base case and a recursive case that devolves to the base case
* Recursive sequence of values:

        def until(n, filter_func, v):
            if v == n: return []
            if filter_func(v): return [v] + until(n, filter_func, v+1)
            else: return until(n, filter_func, v+1)

* Using a lambda as a filter function:

        mult_3_5 = lambda x: x%3==0 or x%5==0

* Combining those:

        until(10, mult_3_5, 0)

* Many functional language compilers can optimize for recursion--Python can't

### Using a Functional Hybrid

* A hybrid version that uses nested generator expressions:

        print(sum(n for n in range(1,10) if n%3==0 or n%5==0))

* `n` is bound to each value, but is more a way of expressing the contents of the set rather than as a carrier of state
* You could extract the `if` clause into a filter function
* Since `n` doesn't exist outside the binding in the generator, it doesn't really define the state of the computation

### Looking at Object Creation

* There may be times it helps to look at intermediate objects as a history of your computation
* Computational history isn't fixed--if functions are commutative or associative, changes to the order of evaluations would produce different intermediate results, with potential performance improvements and the same final result.
* Example of working right to left vs left to right:

        >>> import timeit
        >>> timeit.timeit("((([]+[1])+[2])+[3])+[4]")
        0.437406254999928
        >>> timeit.timeit("[]+([1]+([2]+([3]+[4])))")
        0.44978646300000946

* Important note for functional design is that the `+` op has no side effects

### The Stack of Turtles

* Python 'functional' programming is necessarily a hybrid, not a strictly formal functional language like haskell, erlang, etc.
* CPUs are typically procedural. Anyway, it's a big stack of abstractions.
* That doesn't materially change how you do functional programming in Python
* Our functional Python programs rely on three stacks of abstractions:
    * Applications are functions all the way down, until you hit objects
    * Underlying runtime is objects all the way down until libraries
    * Libraries are a turtle that the language stands on
* Beyond that and maybe not that far, you don't have to give a shit.

## A Classic Example of Functional Programming

* Based on paper 'Why Functional Programming Matters' by John Hughes (1990)
* Looks at the Newton-Raphson algorithm for locating the roots of a function
* In this case looking at the square root
* Many versions of the algorithm rely on state management via loops
* Backbone of the approximation is the calculation of the next approximation from the current one, by halving the difference in values each step
* Using a function called `next_`:

        >>> def next_(n,x):
        ...     return (x+n/x)/2
        ... 
        >>> n = 2
        >>> f = lambda x: next_(n,x)
        >>> a0 = 1.0
        >>> [round(x,4) for x in (a0, f(a0), f(f(a0)), f(f(f(a0))),)]
        [1.0, 1.5, 1.4167, 1.4142]

* `f()` is a lambda that converges on sqrt(2)
* Evaluated using a generator so we could round each value
* We could write a function that in principle generates an infinite sequence of intermediate values converging on the proper root:

        def repeat(f, a):
            yield a
            for v in repeat(f, f(a)):
                yield v

* A python generator function can't be trivially recursive, it must explicitly iterate over recursive results, yielding them individually
* You don't really want the infinite series approaching sqrt(2), so you define some largest error (Epsilon) that you're willing to tolerate
* In python you have to be careful when taking items from an infinite sequence individually, so you use an interface function that wraps a more complex recursion, like:

        def within(epsilon, iterable):
            def head_tail(epsilon, a, iterable):
                b = next(iterable)
                if abs(a-b) <= epsilon: return b
                    return head_tail(epsilon, b, iterable)

* And a square root function composed of the previous functions:

        def sqrt_(a0, eps, n):
            return within(eps, repeat(lambda x: next_(n,x), a0)

## Exploratory Data Analysis

* Book uses EDA as a source of concrete examples of functional programming
* Several widely accepted stages of EDA:
    * Data prep
    * Data exploration
    * Data modeling and machine learning
    * Evaluation and comparison
* Goal of EDA is often to create a model that can be deployed for decision support

# Introducing Essential Functional Concepts

* Most features of functional programming are already first class parts of Python
* Goal in writing functional python is to shift away from imperative (procedural and OO) techniques as much as possible
* Going to look at:
    * First class and higher order functions / pure functions
    * Immutable data
    * Strict and non-strict eval (eager vs lazy)
    * Recursion instead of explicit loops
    * Functional type systems
* In this chapter we include some Python 3 type hints, which can help visualize the essential purpose behind a function definition
* Type hints are analyzed via `mypy` tool

## First Class Functions

* One part of functional programming's succsinct / expressive nature is the use of functions as arguments and return values
* To do that, functions must be first class objects in the runtime, which they are--function objects are returned by `def` statements
* You can also create a function as a callable object or by assigning a `lambda` to a variable

### Pure Functions

* Pure functions don't have side effects
* You need to write local-only code, no `global` statements, and close examination of any `nonlocal` statements
* It's easy to accidentally introduce side effects in Python
* If you're worried about it, you can use the `dis` module to scan a function's `__code__.co_code` compiled code for global references, though that's a complicated thing to do
* A lambda is a pure function, though you wouldn't probably just use them
* Because lambdas can't have assignment statements, they're always pure functions

### Higher-order functions

* Higher order functions accept a function as an argument or return one
* They're how you compose multiple other functions

## Immutable Data

* Since we don't use state variables, we use immutable objects
* Lots of use of `tuples` and `namedtuples` for data structures
* Can be a performance boost from using immutable types
* Avoid class defs almost entirely, since functional programming doesn't need stateful objects
* Reasons for defining `callable` objects include providing namespace for related functions and supporting configurability; also easy to create a cache with a callable objects
* Common design pattern that works well with immutable objects: the `wrapper()` function
* Common means of processing a list of tuples:
    * Using higher order functions (like `max()` with a lambda arg)
    * Using the wrap-process-unwrap pattern, which reads as `unwrap(process(wrap(structure)))` in functional call terms
* Example that transforms each item into a two-tuple with a key followed by the original item, then compares the key values to find a max:

        max(map(lambda yc: (yc[1], yc), year_cheese))[1]

* In the above: 
    * The wrap portion is the map/lambda combo that transforms the list into temporary two part tuples
    * The process part is the `max()` function
    * And the unwrap is the subscript `[1]` that extracts the original tuple from the two value tuple returned by `max()`
* In some languages the pattern is so common that you have functions named `fst` and `snd` to use as function prefixes instead of a suffix like `[1]`
* Mimicking that:

        snd = lambda x: x[1]
        snd(max(map(lambda yc: (yc[1], yc), year_cheese)))

* It just picks the second item of the returned tuple, and makes the overall function call easier to read

## Strict and non-strict evaluation

* The efficiency of functional programming comes in part from being able to defer a computation until it's required. Lazy/non-strict evaluation is helpful for that, and Python sort of has it.
* Python's logical ops `and`, `or`, and `if-then-else` are all non-strict, since they don't need to evaluate all arguments to determine a result
* For instance, `0 and print("right")` just returns 0, because it never gets to the second part of the statement
* Other parts of python are strict--outside the logical ops, expressions are evaluated eagerly from left to right
* Sequences of statement lines are also evaluated strictly in order; literal lists and tuples require eager evaluation
* Generator expressions and functions are lazy--they don't create all possible results immediately
* Showing this via side effects:

        def numbers():
            for i in range(20):
                print(f"= {i}")
                yield i

        x = numbers()
        next(x)

* Function that shows lazy eval (uses type hints):

        def sum_to(n: int) -> int:
            sum: int = 0
            for i in numbers():
                if i == n: break
                sum += i
            return sum

* Important to note that python generators have some problems for functional programming, specifically that they can only be used once

## Recursion instead of an explicit loop state

* FP doesn't rely on loops, and the overhead of tracking loop state; instead uses recursive functions
* Some languages use tail call optimization (TCO) in the compiler to change recursion to loops
* Going to look at prime number testing
* For this, "coprime" means two numbers have one as their only common factor
* If we want to know whether n is prime, we ask is the number n coprime to all prime numbers p such that p^2 &lt; n? Basically, is 2 &le; p^2 &lt; n
* Something like this in python:

        not any(n%p==0 for p in range(2,int(math.sqrt(n))+1))

* Strictly speaking you'd say `all(n%p != 0...`, but that requires full evaluation, where `not any` allows lazy eval if a `True` value is found
* That example has a `for` loop, so it's not really stateless
* If you reframe as a function that works with a collection of values, you can ask whether the number is coprome within any value in the half open interval from 2 to the square root of n plus 1 (values truncated to integers)
* For a recursive function over a simple range of values, the base case can be an empty range, and a non-empty range is handled recursively by processing one value combined with a range that's narrower by one value:

        coprime(n, [a,b)) = { True                                 if a = b
                            { n mod a != 0 and coprime(n, [a+1,b)) if a < b

* Python code that implements it:

		def isprimer(n: int) -> bool:
			def isprime(k: int, coprime: int) -> bool:
				"""Is k relatively prime to the value coprime?"""
				if k < coprime*coprime: return True
				if k % coprime == 0: return False
				return isprime(k, coprime+2)
			if n < 2: return False
			if n == 2: return True
			if n % 2 == 0: return False
			return isprime(n, 3)

* Because the recursion is at the tail, it's 'tail recursion'. Whee.
* Problems that can arise doing recursion in Python:
	* Python has a recursion depth limit (1000 by default)
    * The python compiler doesn't do TCO
* You can manipulate `sys.setrecursionlimit()`, but it can exceed the OS's memory limitations and crash the interpreter
* In Python when you use a generator expression instead of a recursive function, you essentially do TCO manually
* Ex of TCO as a generator expression:

		def isprimei(n: int) -> bool:
			"""Is n prime?

			>>> isprimei(2)
			True
			>>> tuple(isprimei(x) for x in range(3,11))
			(True, False, True, False, True, False, False, False)
			"""
			if n < 2:
				return False
			if n == 2:
				return True
			if n % 2 == 0:
				return False
			for i in range(3, 1+int(math.sqrt(n)), 2):
				if n % i == 0:
					return False
			return True

## Functional type systems

* Since python is dynamic, it doesn't require the complex type matching rules of a Haskell or Scala
* Python3 has type hints, and programs like `mypy` can find potential problems with type mismatches
* Using type hints is better than using tests like `assert isinstance(a, int)`, since an assert is a runtime burden
* Common to run `mypy` and `pylint` along with unit tests

## Familiar Territory

* Most functional programming is already present in Python, and OOP generally
* An API is a very clear example of functional programming

## Learning Some Advanced Concepts

* Identifying them up front, though the hybrid approach of using python doesn't require deep consideration of the topics:
	* Referential transparency - when using lazy eval and the optimizations available in a compiled language, multiple routes to the same object are important; in python it's not as much a concern because there aren't relevant compile time optimizations
	* Currying -- the type systems will employ currying to reduce multi-arg functions to single-arg ones
    * Monads -- purely functional constructs that let you structure a sequential pipeline of processing in a flexible way; can use imperative python, and can use the `PyMonad` library

# Functions, Iterators, and Generators

* Core of FP is using pure functions to map values from an input domain to an output range
* Avoiding side effects can lead to reducing dependence on variable assignment for maintaining computational state
* Chapter covers some python features from an FP viewpoint:
    * Pure functions, free of side effects
    * Functions as first class objects
    * Use of python strings using OO suffix notation and prefix notation
    * Using tuples and named tuples for stateless objects
    * Using iterable collections as a primary FP design tool
* Going to look at generators and generator expressions for working with collections of objects
* Because of the recursion limit and no TCO, you use generators to optimize recursion manually
* Going to write generators that do the following:
    * Conversions
    * Restructuring
    * Complex calculations
* Going to look at built-in collections from an FP perspective

## Writing Pure Functions

* Avoid use of `global`
* To be 'pure', a function should avoid changing the state mutable objects
* Example of a pure function:

        def m(n: int) -> int:
            return 2**n-1

* Any reference to a value in the global namespace can be reworked into a proper parameter
* Lots of internal Python objects are stateful; instances of `file` and file-like objects are typically stateful
* Some of the common stateful objects in python are context managers; some don't completely implement the context manager interface, in which case there's a `close()` method--you can use `contextlib.closing()` to give those objects a proper context manager interface
* You have to find a balance between managing state while exploiting FP principles
* **Always use the `with` statement to encapsulate stateful file objects into a well defined scope**
* Avoid global file objects, database connects, etc. Those files should be parameters to functions, and open files should be nested in a `with` statement to make sure their stateful behavior is contained properly
* Provide a DB connection object as a formal argument to an application's functions

## Functions as first-class objects

* Functions are already first class objects in python
* The callable class definition can be thought of as a higher order function
* Be careful about the `__init__()` of a callable--avoid setting stateful class variables
* common application is to use an `__init__()` method to create objects that fit the Strategy design pattern, which depends on other objects to provide an algoritm or parts of an algorithm
* Callable object with an embedded Strategy object:

		from typing import Callable
		class Mersenne1:
			def __init__(self, algorithm: Callable[[int], int]) -> None:
				self.pow2 = algorithm
			def __call__(self, arg: int) -> int:
				return self.pow2(arg)-1

* Returns a number one less than the output of some algorithm on a number

## Using Strings

* Python strings are immutable, so they're good FP objects
* All string methods produce a new string, and are pure functions
* String methods are postfix, so complex string ops can be hard to read when mingled with convential functions
* You may consider defining your own prefix functions for strings

## Using tuples and named tuples

* Tuples are also immutable, so good for FP
* A basic `tuple` has very few methods, so most things are prefix syntax
* Use cases include list-of-tuple, tuple-of-tuple, and generator-of-tuple constructs
* `namedtuple` adds a name that you can use instead of an index; lets you write pure functions on stateless objects, but keep data bound into object like packages
* Most always use tuples/named tuples in context of collecting values
* If you're using single values or small groups of exactly two values, use named parameters to a function
* Example of using a tuple to represent colors, and breaking it up:

        from typing import Tuple, Callable
        RGB = Tuple[int, int, int]
        red: Callable[[RGB], int] = lambda color: color[0]
        green: Callable[[RGB], int] = lambda color: color[1]
        blue: Callable[[RGB], int] = lambda color: color[2]

* That defines a new type (`RGB`) as a three-tuple, and three functions which are type-hinted to be callables that accept an RGB type and return an integer
* Alternately, using NamedTuple:

        from typing import NamedTuple
        class Color(NamedTuple):
            """An RGB color"""
            red: int
            green: int
            blue: int
            name: str

* Gives names and type hints for each position in the tuple, which lets `mypy` confirm that it's used properly
* Allows you to use `item.red` instead of `red(item)`
* FP application of tuples centers on the iterable-of-tuples pattern

### Using Generator Expressions

* Common to see generator expressions to create `list` or `dict` literals via the comprehension syntax
* Going to focus on the generator expression seperate from the list object
* A collection object and a generator expression have some similar behavior because both are iterables, but they're not equivalent
* Generator expressions are lazy and create objects only as required
* Two important caveats on generator expressions:
    * Generators appear to be sequence-line, with exceptions like using `len()` to tell you the size of the collection
    * Generators can only be used once, after which they appear empty
* Function for examples:

		from typing import Iterator
		import math

		def pfactors1(x: int) -> Iterator[int]:
			if x % 2 == 0:
				yield 2
				if x//2 > 1:
					yield from pfactors1(x//2)
				return
			for i in range(3, int(math.sqrt(x)+.5)+1,2):
				if x % i == 0:
					yield i
					if x//i > 1:
						yield from pfactors1(x//i)
					return
			yield x

* This shows how to do TCO manually. The recursive alls that count from 3 to sqrt(x) are replaced with a loop, and the loop saves us from a deeply recursive call stack.
* You use `yield from` to consume iterable values from the recursive call, and yield them back to the caller
* In recursive generator functions, don't do `return recursive_iter(args)`, which would return a generator object instead of evaluating the function to return generated values. Use `yield from recursive_iter(args)`
* A more purely recursive version:

		from typing import Iterable
		import math

		def pfactorsr(x: int) -> Iterator[int]:
			def factor_n(x: int, n: int) -> Iterator[int]:
				if n*n > x:
					yield x
					return
				if x % n == 0:
					yield n
					if x//n > 1:
						yield from factor_n(x//n, n)
				else:
					yield from factor_n(x, n+2)
			if x % 2 == 0:
				yield 2
				if x//2 > 1:
					yield from pfactorsr(x//2)
				return
			yield from factor_n(x, 3)

* This is simpler than the `for` version, but it can't handle values of n with over 1000 factors because of python's recursion stack limit.

### Exploring the limitations of generators

* Limitations:
    * No `len()` use on a generator
    * You can only use them one time
* Generators in python have a stateful life cycle
* You can try to use `itertools.tee()` to overcome the once-only limitation:

        import itertools
        from typing import Iterable, Any
        def limits(iterable: Iterable[Any]) -> Any:
            max_tee, min_tee = itertools.tee(iterable, 2)
            return max(max_tee), min(min_tee)

* That creates two clones of the parameter generator expression, which leaves the original generator untouched. You consume the clones to get different uses out of the iterable.

### Combining generator expressions

* One way to combine generators is to create a composite function
* Say you have `(f(x) for x in range())`, and you want `g(f(x))`, you can tweak the original generator to be `(g(f(x)) for x in range())`, or you can sub one expression within another expression, like

        g_f_x = (g(y) for y in (f(x) for x in range()))

* You can revise that to emphasize reuse:

        f_x = (f(x) for x in range())
        g_f_x = (g(y) for y in f_x)

* Which leaves the initial expression untouched and assigned to a variable
* `g_f_x` is a generator, and thus lazy, as is `f_x` and `range()`, so one use of `g_f_x` extracts one value from `f_x`, which extracts one value from `range()`

## Cleaning raw data with generator functions

* Typical cleanup involves applying multiple scalar functions to each input to get a usable dataset
* Looking at a dataset that's tab delimited, for instance, we can use `csv.reader()` to iterate the rows with a data iterator like:

        import csv
        from typing import IO, Iterator, List, Text, Union, Iterable
        Row = List[Text]
        def row_iter(source: IO) -> Iterator[Row]:
            return csv.reader(source, delimiter="\t")

        with open("Anscombe.txt") as source:
            print(list(row_iter(source)))

* That works, but includes all rows, even headers that may not be useful data
* You can use a function to excise expected title rows, return an iterator over the remaining rows:

        def head_split_fixed(row_iter: Iterator[Row]) -> Iterator[Row]:
            title = next(row_iter)
            assert(len(title) == 1 and title[0] == "Anscombe's quartet")
            heading = next(row_iter)
            assert(len(heading) == 4 and heading == ['I','II','III','IV'])
            return row_iter

* Since both functions expect an iterator as an argument, they can be combined:

        with open("Anscombe.txt") as source:
            print(list(head_split_fixed(row_iter(source))))

## Using lists, dicts, and sets

* Python sequences are iterables. You can use `list()` or `tuple()` to collect output into an iterable object
* A list comprehension gives you syntax to materialize a generator
* That's very common, but we need to disentangle the idea of a generator expression from a list display that uses a generator expression
* Example that enumerates some cases:

		>>> range(10)
		range(0, 10)
		>>> [range(10)]
		[range(0, 10)]
		>>> [x for x in range(10)]
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		>>> list(range(10))
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

* `range` is a generator function, and doesn't produce values because it's lazy
* Putting it in a list literal by itself just encapsulates the generator
* The list comprehension includes the generator function and returns a list
* The last one just uses the list wrapper to do the same thing
* For data cleaning, you could select pairs of columns with a function like:

        from typing import Tuple, cast

        Pair = Tuple[str,str]
        def series(n: int, row_iter: Iterable[List[Text]]) -> Iterable[Pair]:
            for row in row_iter:
                yield cast(Pair, tuple(row[n*2:n*2+2]))

* that picks two adjacent columns based on a number between 0 and 3, creates a tuple object from them. `cast()` in this case is a hint to mypy that the result will be a two-tuple where both items are strings
* You could create a tuple-of-tuples collection:

        with open("Anscombe.txt") as source:
            data = tuple(head_split_fixed(row_iter(source)))
            sample_I = tuple(series(0, data))
            sample_II = tuple(series(1, data))

* To reduce memory use and increase performance, we use generator expressions and functions as much as possible. They iterate collections in a lazy manner.
* Since you can only use an iterator once, you sometimes have to materialize a collection as a tuple or list object

### Using stateful mappings

* You get stateful maps via dict, and a bunch of stuff in `collections`
* In FP for python, there are two use cases for `mapping`
    * A stateful dictionary that accumulates a mapping
    * A frozen dictionary
* Python doesn't have an easy to use immutable mapping
* Instead of trying to use `collections.Mapping`'s abstract class, which is immutable but shouldn't be used, you can confirm that the variable `ns_map` appears exactly once on the left side of an assignment statement, and never use methods like `ns_map.update()` or `ns_map.pop()`, and don't `del` map items
* Two typical cases for the stateful dictionary:
    * A dictionary built once and never updated, using the hashed keys to boost performance
    * A dictionary built incrementally, to avoid materializing and sorting a list object. Also helpful for memoization.
* First case stems from an app with three phases: gather input, create a dict, process the input based on the mappings in the dictionary

### Using the bisect module to create a mapping

* You can use `bisect` to create a sorted object, which is then searchable
* To be compatible with a dict mapping, you can use `collections.Mapping` as the base class
* dict mappings use a hash, which allocates lots of memory; bisect mappings do a search, which doesn't require as much memory, but is still very fast
* A static mapping class:

		import bisect
		from collections import Mapping
		from typing import Iterable, Tuple, Any

		class StaticMapping(Mapping):
			def __init__(self, iterable: Iterable[Tuple[Any,Any]]) -> None:
				self._data = tuple(iterable)
				self._keys = tuple(sorted(key for key,_ in self._data))
			def __getitem__(self, key):
				ix = bisect.bisect_left(self._keys, key)
				if (ix != len(self._keys) and self._keys[ix] == key_):
					return self._data[ix][1]
				raise ValueError("{0!r} not found".format(key))
			def __iter__(self):
				return iter(self._keys)
			def __len__(self):
				return len(self._keys)

### Using stateful sets

* There are two use cases for a set:
    * A stateful set that accumulates items
    * A frozenset that is used to optimize searches for an item

# Working with Collections

* Python has a lot of functions that process whole collections, and can be applied to sequences, sets, mappings, and iterable results of generators
* Will start by looking at iterables and sequences with recursive functions and for loops, and how to apply a scalar function to a collection of data with a generator
* Will show examples on using:
    * `any()` and `all()`
    * `len()`, `sum()`, and some higher order statistical processing
    * `zip()` and related techniques
    * `reversed()`
    * `enumerate()`
* First four are 'reductions', in that they reduce a collection to a value
* Other three (zip, reversed, enumerate) are mappings, producing a new collection from an existing one

## An Overview of Function Varieties

* Two big types:
    * scalar functions - work on single values, give individual results
    * collection functions - work on iterable collections
* Collection functions subdivide into:
    * Reduction - fold values in a collection together
    * Mapping - applies a scalar function to each item of a collection
    * Filter - rejects some items and passes others to a new collection

## Working with Iterables

* The for loop os a necessary tool in FP for python, despite being stateful
* Assuming that state management is localized to an iterator object created as part of the for statement, we don't get too far from pure FP
* Common application of for is `unwrap(process(wrap(iterable)))`
* Having the unwrap pull the first or second item off process is so common you could code `fst()` and `snd()`, which are built in in some FP languages
* Another common pattern is nested wrappers that build more complex tuples, or build more complex namedtuple instances. Call it the accretion design pattern
* example followed in the rest of the section is for working with a sequence of lat/long values.
    * First step converts a lat/lon pair into pairs of legs, begin,end
    * Each pair in the result is a 2,2 tuple
    * Value of fst(item) is the start, snd(item) is the end
* Next sections focus on creating a generator that will iterate a file, and then process the data

### Parsing an XML file

* Going to use `xml.etree`, which returns an `ElementTree`, whose `findall()` method iterates the available values
* Looking for &lt;Placemark&gt; tags, which are typical for Keyhole Markup Language files with geodata
* XML parsing has two levels: parsing for structure, then looking at data
* Low level processing for structure:

		import xml.etree.ElementTree as XML
		from typing import Text, List, TextIO, Iterable

		def comma_split(text: Text) -> List(Text):
			return text.split(",")

		def for_iter_kml(file_obj: TextIO) -> Iterable[List[Text]]:
			ns_map = {
				"ns0": "http://opengis.net/kml/2.2",
				"ns1": "http://www.google.com/kml/ext/2.2"}
			path_to_points = ("./ns0:Document/ns0:Folder/ns0:Placemark/"
					"ns0:Point/ns0:coordinates")
			doc = XML.parse(file_obj)
			return (comma_split(Text(coordinates.text))
					for coordinates in
					doc.findall(path_to_points, ns_map))

* Returns a generator that uses the sequence of tags located by doc.findall()
* The result is an iterable sequence of rows of data

### Parsing a file at a higher level

* Once you get the data out in a raw form, you have to post process it into a useful data structure
* Aim is to write a small suite of generator functions that transform the parsed data into a form the app can use
* Going to ditch the altitude data (it's a 3 tuple coming out of the above)
* Going to reorder from long,lat to lat,long
* Utility function:

        from typing import Text, List, Iterable

		def pick_lat_lon(lon: Text, lat: Text, alt: Text) -> Tuple[Text,Text]:
			return lat, lon

        Rows = Iterable[List[Text]]
        LL_Text = Tuple[Text, Text]
        def lat_lon_kml(row_iter: Rows) -> Iterable[LL_Text]:
            return (pick_lat_lon(*row) for row in row_iter)

### Pairing up items from a sequence

* Common restructuring is to make start/stop pairs out of points in a sequence
* Basically turn (s0,s1,s2,s3) into ((s0,s1),(s2,s3))
* One version of a function that does it:

        from typing import Iterator, Any
        Item_Iter = Iterator[Any]
        Pairs_Iter = Iterator[Tuple[float, float]]
        def pairs(iterator: Item_Iter) -> Pairs_Iter:
            def pair_from(
                    head: Any,
                    iterable_tail: Item_Iter)-> Pairs_Iter:
                nxt = next(iterable_tail)
                yield head, nxt
                yield from pair_next(nxt, iterable_tail)

            try:
                return pair_from(next(iterator), iterator)
            except StopIteration:
                return iter([])

* Most work done by `pair_from`, which works with the head plus the iterator, eats through it recursively
* Input has to be an iterator that respond to `next()`
* To work with a collection object, the `iter()` function must be used to explicitly create an iterator from the collection
* The outer `pairs` function makes sure the init is done properly, deal with empty iterator creating a `StopIteration` exception
* Recursion in a generator function requires `yield` from a statement to consume teh resulting iterable--use `yield from recursive_iter(args)`, beause trying to return that would just return the generator, not its values
* To do TCO, we replace the recursion with a generator expression, and optimize that into a `for` loop. Ex:

        from typing import Iterator, Any, Iterable, TypeVar
        T_ = TypeVar('T_')
        Pairs_Iter = Iterator[Tuple[T_, T_]]
        def legs(lat_lon_iter: Iterator[T_]) -> Pairs_Iter:
            begin = next(lat_lon_iter)
            for end in lat_lon_iter:
                yield begin, end
                begin = end

* The input type is arbitrary, type hints are purely internal
* The `begin` and `end` vars maintain state in the for loop
* The mutable nature of those vars is encapsulated and hidden from the function consumer

### Using the iter() function explicitly

* Pure FP stance is that all iterables can be processed recursively, with state held in the recursive call stack. However, python iterables often involve evaluation of other for loops.
* When you work with a collection object, the for statement creates an iterator
* For generators, the function itself is an iterator and has internal state
* Mostly those are equivalent, but if you explicitly use `next()` they may not be
* Code to clarify `next()` and `iter()` usage:

        

### Extendig a simple loop

### Applying generator expressions to scalar functions

### Using any() and all() as reductions

### Using len() and sum()

### Using sums and counts for statistics

## Using zip() to structure and flatten sequences
