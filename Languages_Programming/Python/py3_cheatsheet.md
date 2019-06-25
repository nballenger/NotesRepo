lines

* _logical lines_ are made of one or more _physical lines_
* a physical line may end with a comment
* any # outside a string literal starts a comment
* physical lines are not explicitly terminated
* physical lines may be joined by ending with a backslash
* lines broken inside a paren, bracket, or brace are automatically joined
* triple quoted string literals may span physical lines

blocks

* blocks are indentation delimited
* block is a contiguous sequence of logical lines indented the same amount
* first statement in a file must have no indentation
* standard style is four space tabs per indentation level
* never mix spaces and tabs

charsets

* v3 source files can use any unicode char, encoded as utf-8
* you may specify the encoding for a file by commenting on the first line
* like this: # coding: iso-8859-1
* called a _coding directive_ or _encoding declaration_

tokens

* _tokens_ are elementary lexical components
* logical lines are decomposed into tokens
* token types are identifiers, keywords, operators, delimiters, literals
* tokens are whitespace separated
* Identifier tokens:
    * name for a var, func, class, module, or object
    * starts with a letter or underscore, followed by 0 or more letters, underscores, digits, or unicode digits/combining marks
    * punctuation chars not allowed
    * style is to start class names with ucase, all other with lcase
    * convention is single leading underscore means private
    * two leading underscores means strongly private
    * starting and ending with double underscores means language-def special name
    * the single underscore identifier binds in REPL to the last expression
* Keyword tokens:
    * 33 keywords in v3
    * keywords contain only lcase letters
    * keywords may not be used as identifiers
* Operator tokens:
    * non-alphanumeric characters and character combinations
* Delimiter tokens:
    * parens, brackets, braces
    * comma, colon, period, backtick, equals, semicolon, at
    * plus-equals, minus-equals, times-equals, div-equals, etc.
    * quote and double quote surround string literals
    * hash starts a comment, backslash at line end joins physical lines
* Literal tokens:
    * direct denotation of a data value (num, string, container)
    * combining number and strong literals with delimiters gives containers

statements

* a _simple statement_ contains no other statements, and is entirely in one logical line
* simple statements may be combined on a single line with semi-colons
* any expression can stand as a simple statement
* expression statements call functions/callables that have side effects
* an _assignment_ is a simple statement that assigns values to variables
* a _compound statement_ contains one or more other statements and controls their execution
* compounds have one or more clauses, a header starting with a keyword and ending with a colon, followed by a body
* a body is a sequence of one or more statements
* multi-statement bodies are indented and multi-line

data types

* data values are _objects_, objects have a _type_
* type determines the operations that object supports, what attributes and items it has, and whether it can be altered (mutable/immutable)
* you can pass an object to `type()` to get its type string
* you can use `isinstance(obj, type)` to test for type and inheritance

numbers

* number type builtins are integers, floats, and complex
* decimal floating point numbers available from `decimal` in stdlib
* fractions come from `fractions` in stdlib
* numbers are all immutable
* number literals do not contain a sign symbol
* Integer numbers:
    * integers can be decimal, binary, octal, or hex
    * binary prefix: `0b`
    * octal prefix: `0o`
    * hex prefix: `0x`
    * v3 uses `int` as type for all integers
* Float numbers
    * floats contain a decimal point, an exponent suffix, or both
    * leading char of a float literal cannot be `e` or `E`
    * leading char may be a digit or period
    * Python floats are equivalent to C `double`
* Complex numbers
    * two floating point values, one for the real and imaginary parts
    * access the parts of obj `z` as read-only attributes `z.real` and `z.imag`
    * You can specify an imaginary literal as a float or decimal literal followed by `j` or `J`
* For readability in 3.6 onward, you may use underscores anywhere between digits or after a base specifier in numberic literals

sequences

* Ordered container of items, indexed by integers
* types are strings, tuples, and lists
* You can create other types, and library modules provide others

iterables

* All sequences are iterable
* All sequences are bounded
* Iterables may be unbounded, but caution should be used when using them

strings

* A built in strong object is a sequence of characters
* strings are immutable
* string literals can be quoted or trible quoted
* triple quotes allow internal line breaks without escape characters
* single and double quote chars are the same, just allow escaping differently
* You can start a triple quoted string literal with a backslash immediately followed by a newline, to avoid having the first line of the literal at a different indentation level
* The only character that cannot be part of a triple quoted string is an unescaped backslash
* a quoted string cannot contain unescaped backslashes, line ends, or the quote character that encloses it
* backslash starts an escape sequence
* a _raw string_ is a variant type of string literal
* raw strings are immediately preceded by `r` or `R`
* escape sequences in raw strings are not interpreted
* 3.6 allows _formatted string literals_
* formatted strings allow injection of expressions, which means they are eval'd at runtime rather than being reduced to constants
* multiple string literals can be adjacent, with optional whitespace between
* compiler will auto-concat adjacent string literals

tuples

* immutable ordered sequence of items
* items are arbitrary objects, may be different types
* mutable objects may be in a tuple, though not best practice
* if every item in a tuple declaration (inside parens, comma separated) is a literal, you produce a _tuple literal_
* you can also call `tuple(iterable)` to create a tuple

lists

* Lists are mutable, ordered sequences
* Items are arbitrary, may be differently typed
* List literals are comma separated literal values, in brackets
* An empty list is an empty bracket pair
* `list()` creates one

sets

* two set types: `set` and `frozenset`
* arbitrarily ordered collections of unique items
* items may be of different types, but must be hashable via `hash`
* `set` instances are mutable, `frozenset` ones are immutable and hashable
* create via `set()` or `frozenset()`
* non-frozen, non-empty set can be created as a series of expressions, comma separated, inside braces

dictionaries

* arbitrary collection of objects indexed by nearly arbitrary values called keys
* mutable, unordered
* keys must be hashable; values are arbitrary objects, may be of any type
* 'item' is a k/v pair
* colon separated pairs of expressions, comma separated, in braces
* can be created with `dict()`

None

* `None` denotes a null object
* no attributes or methods; useful as a placeholder
* funcs return it unless they have a specific `return` statement

callables

* any type that supports the function call operation
* some builtins, user defined funcs via `def`, and generators
* types are also callable (`dict()`, `list()`, `set()`, etc.)
* class objects are callable
* calling a type typically creates and returns a new instance of that type
* other callable are methods (functions bound to class attributes) and instances that supply the `__call__` method

boolean values

* any data value is true or false
* true: nonzero number, nonempty container
* false: 0 value of a numeric type, `None`, empty containers
* `bool` is a subclass of `int`
* values for `bool` are `True` and `False`, which have both string and int representations (1 and 0)

variables and other reference

* a reference is a name that refers to a value (object)
* references are variables, attributes, and items
* references have no intrinsic type
* a reference may change what it refers to over the course of a program

variables

* variables are not declared, they are created at binding
* you can bind, rebind, or unbind a reference (with `del`)
* references have no effect on their referred object, EXCEPT that a completely unreferenced object will be garbage collected

object attributes and items

* main diff between object attributes and object items is how you access them
* attributes are gotten to via the period operator, via `obj_ref.attr_name`
* an item is accessed via the brackets operator, via `obj_ref[item_name]`
* attributes that are callable are methods
* there is no strong distinction between callable and noncallable objects

accessing nonexistent references

* attempting to access a nonexistant variable, attribute, or item is a runtime error and raises an exception

assignment statements

* plain assignment is via `=`
* augmented assignmentis via `+=`, `-=`, etc.
* augmented assignment cannot create new references

plain assignment

* simplest form is `target = expression`
* target is the lefthand side (LHS), expression the RHS
* on execution, python evaluates the RHS, then binds the value to the LHS
* because there is no distinction between callable and noncallable, python functions are first class objects and may be assigned to variables
* Details of the binding do depend on the kind of target:
    * identifier - is a variable name; assigning to an identifier binds the variable with this name
    * an attribute reference - asks some object to bind to a named attribute
    * an indexing - asks container obj to bind to a specific item
    * a slicing - asks container obj to bind or unbind some of its items
* When the target is an identifier, the assignment statement binds a variable. This always happens when requested.
* Otherwise, the assignment is a request to an object to bind one or more of its attributes or items, which the object may refuse.
* Plain assignments can use multiple targets, as `a = b = c = 0`
* For a chain like that, the RHS evaluates just once, and then each target, left to right, is bound to the single object returned by the RHS expression
* The target in a plain assignment can list two or more references separated by commas, optionally in parens or brackets, as `a, b, c = x`, which requires `x` to be an iterable with exactly three items
* You can swap references via `a,b = b,a`
* In v3 exactly one of multiple targets may be preceded by a star, to indicate it gets the overflow at that point

augmented assignment

* same as plain assignment as far as LHS and RHS
* RHS expression is evaluated, and then the output of that is passed to the target object's appropriate method as an argument
* Ex: `a += 1 + 2`, RHS is eval'd to 3, then `a.__add__(3)` is called

del statements

* `del` unbinds a references, it doesn't delete objects
* you can unbind multiple references via `del a,b,c`
* if the target is an identifier already bound, the unbinding happens
* otherwise it's a call to the target object's `__delattr__` or `__delitem__`
* containers can have `del` cause side effects--for instance `del c[2]` on a list will shift all elements to the right of key 2 to the left by one

expressions and operators

* an expression is a phrase of code that python evals to get a value
* simplest ones are literals and identifiers
* others are built from subexpressions via operators and delimiters
* there's a precedence chart but fuck me if I'm learning it
* you can chain comparisons: `a < b < c` is the same as `a < b and b < c`
* `and` and `or` will short circuit evaluation
* python's ternary also short circuits, and is `whentrue if condition else whenfalse`

numeric operations

* numbers are immutable, so all operations produce new objects
* sign operators are not part of a number, and are evaluated in precedence order

numeric conversions

* you can do operations and comparisons between any two numbers of built in types
* if the types differ, coercion applies
* the 'smaller' type is converted to the 'larger' type
* order from smallest to largest is ints, floats, and complex
* you can explicitly convert by passing a numeric object to a built in type
* you can also pass a string to one of those

arithmetic operations

* obvious except for division and exponentiation
* if RHS of /, //, or % is 0, you get a runtime exception
* The // op does truncating divisin and returns an int
* in v3 / will perform true division, in v2 will truncate if both args are int
* for back compatible behavior use `from __future__ import division`
* If you explicitly want quotient and remainder parts, use `divmod()`
* Exponentiation is `a**b`
* You can get an exception in v2 if `a` is less than zero and `b` is a float with a nonzero fractional part--in v3 it returns the appropriate complex number.
* You can also use `pow(a,b)`, and `pow(a,b,c)` is the equivalent of `(a**b)%c` but faster
* All objects can be compared for equality
* Ordering comparisons can be used between two numbers unless either operand is complex
* All these ops return boolean values
* Don't compare floats for equality

sequence operations

* some operations apply to all sequences (strings, lists, tuples, iterables, generators, containers, files, etc.) and some apply to only some
* `len`, `min`, `max`, work on any sequence
* There's no explicit conversion between sequence types except byte strings to unicode in v2
* You can call the type with an arg to convert stuff explicitly
* sequences can be concatenated with the `+` operator, multiplied by an int with `someseq * someint`
* test for membership with `x in S` and `x not in S`
* to index, use
    * `S[n]` for a single item
    * `S[-1]` for the last item
    * `S[a:b]` for a through b-1
    * `S[a:]` for a through the end
    * `S[:b]` for the beginning up to b
    * `S[a:b:c]` for a through b-1, striding by c
    * `S[::c]` for all items on stride c
    * `S[::-c]` for all items on stride c in reverse order
* strings are immutable, can't be rebound by slice
* tuples are immutable, can't be rebound by slice
* lists are mutable, you can rebind or delete items and slices
* slices of a list are lists
* to modify a list item, assign to its index
* assigning to slices can modify or delete the slice contents
* you can do some inplace ops on a list via `+=` and `*=`
* list methods come in both mutating and non-mutating (count and index) varieties
* A list's `sort` method causes the list to sort in place in a stable way (items that compare equal are not exchanged)

set operations

* `k in S` and `k not in S` check for membership
* sets have mutating and nonmutating methods

dictionary operations

* `k in D` checks whether k is a key in D
* dicts have mutating and nonmutating methods
* Never modify a dict's set of keys while iterating on it

control flow statements

```Python
if expression:
    statement(s)
elif expression:
    statement(s)
else:
    statement(s)


while expression:
    statement(s)


for target in iterable:
    statement(s)
```

iterators

* An object i such that you can call `next(i)`
* `next(i)` returns the next item of iterator i, or raises `StopIteration`
* `next(i, default)` returns default if i is ended
* Any class can be an iterator if you allow `__next__` to be defined

range and xrange


++++++++++++++++++++++++++++++++++++++++


# Chapter 4: Object Oriented Python

## Classes and Instances

* a class is an object with several characteristics:
    * it's a callable, which returns an instance of the class
    * it has arbitrarily named attributes you can bind and reference
    * values of attributes can be descriptors or normal data objects
    * attributes bound to functions are methods
    * double underscore methods are special, and supplant operators
    * it can inherit from other classes
* a class can be passed as an argument
* functions can return a class object
* the `class` statement creates a class object

```Python
class classname(base-classes):
    statement(s)
```
