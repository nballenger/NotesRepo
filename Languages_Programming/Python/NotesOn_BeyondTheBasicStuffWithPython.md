# Notes on Beyond the Basic Stuff with Python

By Al Sweigart; No Starch Press, Dec. 2020; ISBN 9781593279660

# Part 1: Getting Started

# Chapter 1: Dealing with Errors and Asking for Help

## How to Understand Python Error Messages

### Examining Tracebacks

Sample program:

```Python
def a():
    print('start of a')
    b()

def b():
    print('start of b')
    c()

def c():
    print('start of c')
    42 / 0  # triggers zero division err

a()
```

Traceback you get trying to run it:

```
start of a
start of b
start of c
Traceback (most recent call last):
  File "/tmp/error.py", line 15, in <module>
    a()
  File "/tmp/error.py", line 3, in a
    b()
  File "/tmp/error.py", line 7, in b
    c()
  File "/tmp/error.py", line 11, in c
    42 / 0  # triggers zero division err
ZeroDivisionError: division by zero
```

* This is a 'frame summary', which shows the info inside a frame object. When functions are called, the local variable data and where in code to return to on function return are stored in a frame object:

    ```
    File "/tmp/error.py", line 15, in <module>
      a()
    ```

* Frame objects are created when a function is called, destroyed when that function returns.
* Tracebacks show a frame summary for each frame leading up to a crash
* `<module>` shows you the line is in the global scope
* The final frame summary in a traceback shows the line that caused the unhandled exception, the name of the exception, and the exception message
* The line number given by the traceback is where Python detected an error, not necessarily the actual source of the bug.

## Preventing Errors with Linters

# Chapter 2: Environment Setup and the Command Line

## The Filesystem

### Paths in Python

* Don't use OS specific path separators, use `pathlib` and the `/` operator
* `Path` objects can be passed to any function in stdlib that expects a filename

### The Home Directory

* You can get a reference to the executing user's home directory with `Path.home()`

### The Current Working Directory

* You can get the cwd as a `Path` with `Path.cwd()`, change it with `os.chdir()`

### Absolute vs Relative Paths

### Programs and processes

* Program - any software application you can run
* Process - a running instance of a program, separate from other processes

## The Command Line

* You can run one-off commands with `python -c "print('hello, world')"`
* You can run shell commands from within a python program with subprocess:

    ```Python
    import subprocess, locale
    procObj = subprocess.run('ls', '-al'], stdout=subprocess.PIPE)
    outputStr = procObj.stdout.decode(locale.getdefaultlocale()[1])
    print(outputStr)
    ```

## Environment Variables and PATH

# Part 2: Best Practices, Tools, and Techniques

# Chapter 3: Code Formatting with Black

* To keep black from changing a chunk of code:

    ```Python
    # set up constants, retaining horizontal spacing for readability
    # fmt: off
    SECONDS_PER_MINUTE = 60
    SECONDS_PER_HOUR   = 60 * SECONDS_PER_MINUTE
    SECONDS_PER_DAY    = 24 * SECONDS_PER_HOUR
    SECONDS_PER_WEEK   = 7  * SECONDS_PER_DAY
    # fmt: on
    ```

# Chapter 4: Choosing Understandable Names

# Chapter 5: Finding Code Smells

# Chapter 6: Writing Pythonic Code

## Commonly Misused Syntax

* Use `enumerate()` instead of `range()`

    ```Python
    # DO NOT DO
    animals = ['cat', 'dog', 'moose']
    for i in range(len(animals)):
        print(i, animals[i])

    # DO INSTEAD
    for i, animal in enumerate(animals):
        print(i, animal)

    # OR, WITHOUT INDEX NUMBERS
    for animal in animals:
        print(animal)
    ```

* Use `with` instead of `open()` and `close()`
* Use `is` for None and boolean comparison instead of `==`

## Formatting Strings

* Use raw strings if your string has a bunch of backslashes
* Use f strings for formatting

## Make shallow copies of lists

```Python
# Unclear way to copy a list:
alpha = ['a', 'b', 'c']
bravo = alpha[:]
assert id(alpha) != id(bravo)  # we've copied the list

# clearer way:
import copy
charlie = copy.copy(alpha)
assert id(alpha) != id(charlie)  # also copies, more explicitly
```

## Pythonic Ways to Use Dictionaries

* Use `get()` and `setdefault()`

    ```Python
    number_of_pets = {'dogs': 2}

    # DON'T DO THIS FOR AVOIDING KeyError
    if 'cats' in number_of_pets:
        print('I have', number_of_pets['cats'], 'cats.')
    else:
        print('I have 0 cats.')

    # DO THIS INSTEAD:
    print('I have', numberOfPets.get('cats', 0), 'cats.')

    # DON'T DO THIS FOR SETTING A DEFAULT:
    if 'cats' not in number_of_pets:
        number_of_pets['cats'] = 0

    # DO THIS INSTEAD
    number_of_pets.setdefault('cats', 0)  # does nothing if 'cats' exists
    ```

* Use `collections.defaultdict` for default values

    ```Python
    import collections
    scores = collections.defaultdict(int)  # pass int fn as default setter
    scores['alpha'] += 1    # no need to set up scores['alpha'] first
    ```

* Use dictionaries instead of a switch statement (which python doesn't have)

    ```Python
    # Don't do this for fake switch:
    if season == 'winter':
        holiday = "new years"
    elif season == 'spring':
        holiday = "may day"
    elif season == 'summer':
        holiday = "juneteenth"
    elif season == 'fall':
        holiday = "halloween"
    else:
        holiday = "personal day off"

    # Instead do
    holiday = {"winter": "new years",
               "spring": "may day",
               "summer": "juneteenth",
               "fall": "halloween"}.get(season, "personal day off")
    ```

* Use the ternary statement, `x = a if somebool else b`

## Working with Variable Values

* chain comparison operators when doing multiple comparisons:

    ```Python
    # don't do
    if 42 < spam and spam < 99:
        ...

    # do this
    if 42 < spam < 99:
        ...
    ```

* Chain the `=` assignment operator and `==` comparison operator

    ```Python
    a = b = c = 'somevalue'
    a == b == c == 'somevalue'
    ```

* Check for a range of values with set membership: `a in ('a', 'b', 'c')`

# Chapter 7: Programming Jargon
