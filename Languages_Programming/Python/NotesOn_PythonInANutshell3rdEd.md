# Notes on Python in a Nutshell, 3rd Ed.

By Anna Ravenscroft; Alex Martelli; Steve Holden, O'Reilly 2017

# Chapter 3: The Python Language

## Lexical Structure

* A program is a sequence of logical lines; logical lines are made of physical lines
* A physical line:
    * May end with a # comment
    * May be blank (which is ignored)
    * Is joined to the line following if:
        * The first line ends in a backslash
        * You are inside a paren, bracket, or brace
        * You are inside a triple quoted string
* Block structure is expressed by indentation; indent type and distance is not specified but must be internally consistent; four spaces and no tabs is preferred
* v3 may use any unicode character in source files
* You can specify a non-standard encoding in the first source line via a `coding` directive:

        # coding: iso-8859-1

* Logical lines are broken into elementary lexical tokens
* Token types:
    * identifiers
    * keywords
    * operators
    * delimiters
    * literals
* Whitespace within a line, beyond the first space, is arbitrary
* Identifiers specify a:
    * variable
    * function
    * class
    * module
    * other object
* Identifier naming rules:
    * starts with a unicode letter or an underscore
    * followed by zero or more letters, underscores, and digits
* Identifier case is significant
* Conventions:
    * Start class names with UC letter
    * All others start with lc letter
    * Leading underscore means private (by convention)
    * Double leading underscore means strongly private
    * Double leading and trailing underscore is a language defined special name
* A single underscore in the interpreter binds to the result of the last expression statement evaluated interactively
* Operators are nonalphanumeric characters and character combinations
* The python delimiters are:
    * `( ) [ ] { }`
    * ``, : . ` = ; @``
    * `+= -= *= /= //= %=`
    * `&= |= ^= >>= <<= **=`
* Single quote, double quote, hash, and backslash have special meaning as part of other tokens. Quotes surround literals, hash starts a line end comment, backslash joins physical lines.
* Literals are direct denotations of a data balue (number, string, container)
* Example literals:

        42                      # int
        3.14                    # float
        1.0j                    # imaginary
        'hello'                 # string
        "world"                 # string
        """Good                 # triple quoted strong
        Night"""

        [42, 3.14, 'hello']     # list
        []                      # empty list
        100, 200, 300           # tuple
        ()                      # empty tuple
        {'x':42, 'y':3.14}      # dict
        {}                      # empty dict
        {1, 2, 4, 8, 'string'}  # set -- empty set requires set()

* Source files are sequences of simple and compound statements
* Simple statements contain no other statements, and exist entirely within a logical line
* Multiple single statements may appear on a physical line when separated by semi-colons
* Any 'expression' can be considered a simple statement
* All assignments are sinmple statements
* Compound statements contain one or more simple statements, may control their execution
* Compound statements have one or more clauses at the same indent level
* Each clause has a header starting with a keyword and ending with a colon, followed by a body, which is a sequence of one or more statements
* A body with multiple statements is a block
* A body with a single simple statement may follow the colon on the same line

## Data Types

* All data values in python are objects; all objects have a type
* Type determines:
    * What operations the object supports
    * What attributes it has, if any
    * What items it has, if any
* Objects may be mutable or immutable, by type
* The builtin `type(obj)` returns the type object that is the type for `obj`
* `isinstance(obj, type)` is a boolean test for type and sub-class of type
* There are built-in types for fundamental types of data
* Numeric types: `int`, `float`, `decimal` (by module), fractions (by module)
* Numeric literals are unsigned
* Integer literals can be decimal, binary, octal, or hex:

        1, 23, 3493             # decimal
        0b010101, ob110010      # binary
        0o1, 0o27, 0o6645       # octal
        0x1, 0x17, 0xDA5        # hex

* Floats include a decimal, an exponent suffix, or both: 

        0.
        0.0
        .0
        1.
        1.0
        1e0
        1.e0
        1.0e0

* Complex numbers are made of two floating point values, one for the real and one for the imaginary parts:

        0j
        0.j
        0.0j
        .0j
        1j
        1.j
        1.0j
        1e0j
        1.e0j
        1.0e0j

* You may (as of v3) use underscores in numeric literals for readability
* Sequences are ordered containers, integer indexed
* The concept of 'iterables' generalizes sequences
    * All sequences are iterable
    * Most iterables are 'bounded iterables'--it eventually stops yielding items
    * All sequences are bounded
    * Iterables may be unbounded in some circumstances
* Strings are sequences of byte or unicode characters
    * Strings are immutable
    * May be quoted or triple quoted
    * Internal quotes are backslash escaped
    * There are embeddable special characters for double quoted strings
    * Triple quoted strings may contain literal newlines
    * A string whose quotes are immediately preceded by `r` or `R` is a raw string, in which escape sequences are not interpreted, and may include raw backslashes
    * Formatted string literals allow interpolation of expressions
    * Multiple, whitespace separated strings inside parens will be concatenated
* Tuples are immutable, ordered sequences
    * Items may be arbitrarily typed
    * Mutable objects may be nested in a tuple
    * Tuple literals are a series of expressions separated by commas
    * If every item in a tuple declaration is literal, it is a 'tuple literal'
    * You may optionally use a trailing comma for the list
    * A tuple with two items is a 'pair'
    * A single item tuple is declared by a single item followed by a comma
    * You may also generate a tuple via `tuple()`
    * Calling `tuple()` on a string produces a tuple of letters
* Lists are mutable, ordered sequences
    * Items are arbitrarily typed
    * List literals are a series of expressions, comma separated, in brackets
    * If all items are literals, it's a list literal
    * An empty list is a pair of brackets
    * You can use the `list()` constructor
    * If you wrap an iterable in `list()` it creates and returns a new list whose items are the same as that wrapped
* Sets are arbitrarily ordered collections of unique items
    * The `set` type is mutable
    * The `frozenset` type is immutable
    * To create them, call `set()` (optionally wrapping an iterable)
    * Set members can be arbitrarily typed, but must be hashable
    * You can't have a set whose items are sets, but you can nest frozensets
    * A set literal is comma separated, in braces
* Dictionaries are mutable, unordered collections of arbitrary objects indexed by nearly arbitrary values called keys
    * The only built in mapping type is `dict`
    * Dictionary literals are comma separated key value pairs, where each pair is colon separated, all in braces
    * You can call `dict()` to create a dictionary, but must use the syntax `dict(k1=v1, k2=v2[, ..., kn=vn])`
    * You can create a keyed dict with a default value for all keys by using `dict.fromkeys()`
* The `None` type is a null object
    * None is returned by all functions with no explicit return statement
* Callable types are those whose instances support the function call operator (parens)
    * Functions are callable
    * Generators are callable
    * Types are callable
    * Other callables are methods, which are functions bound to class attributes, and instances of classes that supply the `__call__` method
* Boolean values are `True` and `False`, and the bare strings are used for those
    * All objects can be used as boolean values
    * True values:
        * Nonzero numbers
        * Nonempty containers
    * False values:
        * Literal `0`
        * `None`
        * Empty containers
    * The `bool` value is a subclass of `int`
    * Literal booleans have values of 1 and 0
    * You can use `bool(x)` to count the true items in a sequence, as with: `sum(bool(x) for x in seq)`

## Variables and Other References

* Data values are accessed by reference
* References are:
    * Variables
    * Attributes
    * Items
* A reference has no intrinsic type, though the object to which it is bound does
* Variables
    * Are created by a binding statement
    * Are removed by unbinding with `del`
    * May be rebound
    * Rebinding a reference has no effect on the object to which it was bound, unless that object's reference count is reduced to zero, in which case GC will get it
    * Variables may be named with any identifier except a reserved word
    * Variables can be global or local:
        * global vars are attributes of a module object
        * local vars are within a function's namespace
    * Distinction between attributes and items is their access syntax
        * Attributes are referenced via `objname.attrname`
        * Items are referenced by `seqname[index_or_key]`
    * Attributes that are callables are methods
    * There is no strong distinction between callable and noncallable attributes
    * If you attempt to access a reference that does not exist, or no longer exists, a runtime exception will be raised
* Assignment statements
    * Assignment statements can be plain (just `=`) or augmented (`+=`, etc)
    * Plain assignments have a left hand side (the target) and a right hand side (the expression)
    * The target may be
        * an identifier
        * an attribute reference
        * an indexing
        * a slicing
    * Details of the binding depend on the kind of target:
        * identifier - binds the variable with this name
        * attribute ref - asks the object to bind the attribute
        * indexing - asks the container to bind the item
        * slicing - asks the container to bind/unbind some items
    * A plain assignment may have multiple targets: `a = b = c = 0`
        * Each time the statement executes, the right hand expression evaluates once, no matter how many targets are part of the statement
        * Each target, left to right, is bound to the single object returned by the expression
    * A plain assignment may use multiple values drawn from an iterable: `a, b, c = x` (where `x` is an iterable)
    * You may use 'unpacking assignments' of the form `a,b = b,a` to switch variable assignments
    * In an unpacking assignment, one target may be preceded by `*` to receive a binding to a list of all other items
    * Augmented assignment operators are `+= -= *= /= //= %= **= |= >>= <<= &= ^= @=`
    * For augmented assignment, the right hand side is evaluated, then a method is called for the in-place version of the operator that augments the assignment op, with the evaluated RHS as its argument
    * The `del` statement unbinds references, but does not delete objects--GC does that
    * If targeting a variable identifier, the unbinding always takes place
    * When targeting an attribute or item, `del` requests that the object unbind the attribute or item
    * You can override the behavior with `__delattr__` and `__delitem__`
    * Containers can also have side effects using `del`, such as list shifting

## Expressions and Operators

Operator precedence table:

| operator | desrcription | associativity |
| --- | --- | --- |
| `{key: expr}` | dict creation | NA |
| `{expr,}` | set creation | NA |
| `[expr,]` | list creation | NA |
| `(expr,)` | tuple creation or parenthetical | NA |
| `f(expr,)` | function call | L |
| `x[i:j]` | slicing | L |
| `x[i]` | indexing | L |
| `x.attr` | attribute reference | L |
| `x**y` | exponentiation | R |
| `~x` | bitwise NOT | NA |
| `+x, -x` | unary plus/minus | NA |
| `x*y, x/y, x//y, x%y` | mult, div, mod | L |
| `x+y, x-y` | add, sub | L |
| `x<<y, x>>y` | bit shift | L |
| `x & y` | bitwise AND | L |
| `x ^ y` | bitwise XOR | L |
| `x \| y` | bitwise OR | L |
| `x<y, x<=y, x>y, x>=y, x!=y, x==y` | comparisons | NA |
| `x is y, x is not y` | identity tests | NA |
| `x in y, x not in y` | membership tests | NA |
| `not x` | boolean NOT | NA |
| `x and y` | boolean AND | L |
| `x or y` | boolean OR | L |
| `x if expr else y` | ternary | NA |
| `lambda arg,...: expr` | lambda | NA |

* Comparison ops may be chained: `a < b < c < d` is equivalent to `a < b and b < c and c < d`
* The `and` and `or` ops are non-strict--they stop evaluation once they get an answer
* The ternary op is also non-strit: `whentrue if condition else whenfalse` evaluates condition first, and only one of the subexpressions evaluates

## Numeric Operations

* There are type coercion rules when performing operations on multiple numeric types:
    * The operand with the 'smaller' type is converted to the 'larger' type
    * Types smallest to largest are: `int`, `float`, `complex`
    * Explicit conversion can be done by calling the built in type, as `int(9.8)`
    * You cannot convert a complex number to another type.
* You can call the builtin type with a string argument
* You can supply a radix arg to `int()` to specify the base for the conversion: `int('101',2)` returns 5, the value of 101 in base 2
* Arithmetic ops are obvious, except division
    * `//` does truncating division, so always returns an integer result
    * In v3, the `/` op can return a float result from the division of two ints
* Always use `//` to do truncating division
* If you want quotient and remainder, you can use `divmod` to get a paired result: `divmod(10,3)` returns `(3,1)`
* All objects may be compared for equality and inequality
* Ordering comparisons may be used between numbers (except complex)
* All equality and ordering comparisons return boolean values
* You can do bitwise ops on integers

## Sequence Operations

* Sequence ops in python can apply to containers (including sets and dicts, which are not sequences because they are unordered) and iterables, which includes a number of things which are not sequences.
* Sequences in a limited sense are:
    * ordered containers
    * accessible by indexing and by slicing
* Usable on all sequences:
    * `len(seq)` - runs on any container
    * `min(iter)` and `max(iter)` - run on any non-empty iterable
    * `sum(numeric_iter)` - runs on numeric valued iterators
* Conversions
    * No implicit sequence type conversion
    * You can call `tuple()` and `list()` with an iterable arg to get a new instance
* Concatenation and repetition
    * Concatenate sequences with `seq1 + seq2`
    * Multiply a sequence by an integer with `seq * n`
* Membership tests
    * `x in seq` and `x not in seq`
    * for dicts, tests for key membership
    * for strings, `x in s` tests for substring membership
* Indexing:
    * zero based integer indexes
    * negative indexes count back from the end
    * index out of bounds raises an exception
* Slicing:
    * Slice syntax is `seq[inclusive_start : exclusive_end : stride]`
    * Omitting start or end takes from the begining or to the end, respectively
    * A negative stride value walks in reverse
    * For a negative stride, start must be larger than end
    * A 0 stride length raises an exception
    * Examples:

            s = [1, 2, 3, 4]
            s[1:]               # [2, 3, 4]
            s[:2]               # [1, 2]
            s[-2:]              # [3, 4]
            s[::2]              # [1, 3]
            s[3:0:-2]           # [4, 2]

* Strings:
    * Are immutable, so items and slices can't be rebound or deleted
    * Items in a string are strings of length one--no char type
    * All slices of a string are strings of the same kind
* Tuples
    * Immutable, no rebind or delete of items or slices
    * Tuple items may be mutable, but shouldn't be by best practive
    * No normal methods other than `count` and `index`
* Lists
    * mutable, slice and dice away
    * Modify an item by assigning to an index
    * assigning to a slice replaces that slice with the RHS
    * remove a target slice by assigning an empty list to it
    * targeting an empty slice inserts to that spot: `L[i:i] = [1,2]` puts 1 and 2 in before the item at index i
    * Targeting a slice that's the entire list (`L[:]`) replaces all contents
    * You can delete a list item, the list shrinks
    * Lists do in place changes via `+=` and `*=`
    * Lists have both mutating and nonmutating methods

            # non mutating
            L.count(x)              # number of items equal to x
            L.index(x)              # index of first occurence of x

            # mutating
            L.append(x)             # appends x to end of list
            L.extend(iter)          # appends iterable items to list
            L.insert(i, x)          # inserts x at index i
            L.remove(x)             # removes first occurrence of x
            L.pop(i=-1)             # returns L[i] and removes it
            L.pop()                 # returns L[-1] and removes it
            L.reverse()             # reverses in place

            # sort() sorts in place, key arg is a comp function
            L.sort(key=None, reverse=False)    

    * Sorting with `sort()` is fast, but `sorted(list)` returns a new list and is easy
    * note that `sorted()` works on any iterable

## Set Operations

* `len(S)`
* `min(S)` and `max(S)`
* `k in S` and `k not in S`
* Has mutating and nonmutating. Mutating methods return new sets, can be used on `frozenset` objects

        # nonmutating
        S.copy()                    # shallow copy
        S.difference(S1)
        S.intersection(S1)
        S.issubset(S1)
        S.issuperset(S1)
        S.symmetric_difference(S1)
        S.union(S1)

        # mutating
        S.add(x)
        S.clear()
        S.discard(x)
        S.pop()
        s.remove(x)

        # note you can use pop() for destructive iteration:
        while S:
            s_item = S.pop()

        # You can use operator syntax for some of the nonmutating methods:
        S - S2      # difference
        S & S2      # intersection
        S ^ S2      # symmetric difference
        S | S2      # union

## Dictionary Operations

* `len(dict)` returns number of k/v pairs
* any function that takes an iterable will work on a dict, but it iterates keys
* `k in D` and `k not in D` check for key membership
* Indexing is by key value
* Assignment and deletion work, deleting a nonexistant key raises an exception
* Has both nonmutating and mutating methods:

        # nonmutating
        D.copy                  # shallow copy
        D.get(k[, x])           # returns D[k] or x (or None if no x)
        D.items()               # returns an interable dict_items instance
        D.keys()                # returns an iterable dict_keys instance
        D.values                # returns an iterable dict_values instance

        # mutating
        D.clear()
        D.pop(k[, x])
        D.popitem()             # returns arbitrary k/v pair
        D.setdefault(k[, x])    # returns D[k] if k in D, else sets D[k] to x
        D.update(D1)            # for all k in D1, sets D[k] to D1[k]

* Never modify a dict's keys while iterating on it
* All the `dict_...` types are iterable
* `popitem()` can do destructive iteration

## Control Flow Statements

* Control flow statements are one of conditionals, loops, and function calls
* The if statement:

        if expression:
            statement(s)
        elif expression:
            statement(s)
        elif expression:
            statement(s)
        ...
        else:
            statement(s)

* There is no switch statement, use if/elif/else for all conditionals
* The while statement:

        while expression:
            statement(s)    # may include break and continue
        else:
            statement(s)    # evaluates when loop terminates naturally

* The for statement:

        for target in iterable:
            statement(s)    # may include break and continue
        else:
            statement(s)    # evaluates when the loop terminates naturally

* To iterate a dict's items:

        for k, v in d.items():
            if k and v:
                print(k, v)

* Iterators
    * An iterator is an object i such that `next(i)` is allowed
    * falling off the end raises `StopIteration`
    * `next(i, default)` returns safely
    * Class instances are iterators if they define `__next__`
    * Most iterators are constructed by explicit or implicit call to `iter()`
    * A for loop does this:

            for x in c:
                statement(s)

            # is equivalent to:

            _temp_iterator = iter(c)
            while True:
                try: x = next(_temp_iterator)
                except StopIteration: break
                statement(s)

    * Lots of ways to built and use iterators in the `itertools` module
* List comprehensions return a list, have the syntax: `[expression for target in iterable lc-clauses]`
* If you just need to loop on values instead of needing an actual list, use a generator
* List comprehensions have their own scope
* Example comprehensions for lists, sets, dicts:

        mylist = [x for x in some_seq if x > 5]

        myset = { n//2 for n in range(10) }

        mydict = {n:n//2 for n in range(5) }

* `pass` is the python no-op
* If you need an empty def or class block, use docstrings, not pass. No efficiency reason, just a style thing.

## Functions

* A function is a group of statements that execute on request
* A request to execute is a 'function call'
* Functions in a class def are methods
* Functions are first class objects
* The `def` statement is the most common way to define a function
* It's a single-clause compound statement:

        def function_name(parameters):
            statement(s)

* When defining a parameter list, positional params are required, named params are optional and have defaults
* Don't use mutable defaults
* At the end of a parameter list you can use `*args` and `*kwargs`, which are a list and dict respectively of all additonal arguments passed in
* A function's signature is its name plus its parameter list
* V3 has parameters that must correspond to named arguments if they are present
* They're called 'keyword-only parameters'
* If you use them, they come after `*args` and before `**kwargs`
* Each keyword only param can be specified as a simple identifier (mandatory) or in `indentifier=default` form, making it optional. If you use it though, you MUST pass it as a named argument to the function call
* Example:

        def f(a, *, b, c=56):   # b and c are keyword only
            return a, b, c

        f(12, b=34)     # returns (12,34,56)
        f(12)           # raises TypeError, missing a required keyword only arg
* Function objects have built in attributes, like `__doc__` for the docstring
* They can also have arbitrary attributes, if you bind a value to an attribute reference on the function name, though this is not common usage
* Functions have annotations and type hints in v3
* `return` can only exist in a function body, and can be followed by an expression
* Functions with no return statement return `None`
* A function call happens via the function call operator, the parens: `funcname(args)`
* All argument passing is by value (really by object reference, or 'by sharing')
* Basically python takes the reference you give it, dereferences to the actual object your reference points at, and passes that object, bound to the parameter name inside the function call namespace.
* A function has its own local namespace, and its variables are in that scope
* Variables outside that scope are 'global', and are attributes of the module object
* You can explicitly say you're using an outside variable using the `global` keyword
* Don't do that.
* Nested functions have nested scope.
* Code in a nested function body may access, but not rebind, local variables of an outer function.
* Better to pass the value explicitly in the arguments of the inner function
* A nested function that accesses values from outer local variables is a 'closure'
* Closure example:

        def make_adder(augend):
            def add(addend):
                return addend+augend
            return add

* If you need to construct callable objects with some parameters fixed at object construction time, closures may be the way to do that.
* In v3, you can use `nonlocal` similarly to `global`, but referring to names in the namespace of a lexically surrounding function
* Example:

        def make_counter():
            count = 0
            def counter():
                nonlocal count
                return count
            return counter

        c1 = make_counter()
        c2 = make_counter()

        print(c1(), c1(), c1())     # prints 1 2 3
        print(c2(), c2())           # prints 1 2
        print(c1(), c2(), c1())     # prints 4 3 5

* That lets each closure keep its own state.
* A function body that is a single return statement can be replaced with a lambda
* Syntax is `lambda parameters: expression`
* It's a short, anonymous function, often used as an argument or return value
* Example:

        a_list = list(range(1,10))
        low = 3
        high = 7
        filter(lambda x: low<=x<high, a_list)   # returns [3, 4, 5, 6]

* Generators are functions that use the keyword `yield`
* When you call them, the function body doesn't execute, it returns a generator object that responds to `next()`
* When you call `next()` on it, it executes up to the next `yield` it hits
* They save state between calls
* Often a handy way to build an iterator
