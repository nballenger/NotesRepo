# Notes On Effective Python

By Brett Slatkin, Addison-Wesley Professional, 2015

## Chapter 1: Pythonic Thinking

### Item 1: Know What Version of Python You're Using

* Most of book's syntax is Py 3.4, some in 2.7
* You can get version with ``python --version``
* You can get it programmatically with ``sys.version_info`` and ``sys.version``

### Item 2: Follow the PEP 8 Style Guide

* Summarizes PEP 8
* The Pylint tool is a static source code analyzer, can enforce PEP 8

### Item 3: Know the Differences Between ``bytes``, ``str``, and ``unicode``

* In 3.x, two types represent character sequences: ``bytes`` and ``str``
* In 2.x, it's ``str`` and ``unicode``
* Most common encoding is UTF-8
* ``str`` in 3.x and ``unicode`` in 2.x do not have an associated binary encoding
* To convert unicode to binary you have to use ``encode()`` and ``decode()``
* "When you're writing Python programs, it's important to do encoding and decoding of Unicode at the furthest boundary of your interfaces. The core of your program should use Unicode character types and not assume anything about character encodings."
* You'll want some helper functions to deal with two situations:
    * You want to work on raw 8-bit values that are UTF-8 encoded characters
    * You want to work on unicode characters with no specific encoding
* Python 3 helpers:

```Python
def to_str(bytes_or_str):
    if isinstance(bytes_or_str, bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str
    return value

def to_bytes(bytes_or_str):
    if isinstance(bytes_or_str, str):
        value = bytes_or_str.encode('utf-8')
    else:
        value = bytes_or_str
    return value
```

* Python 2 helpers:

```Python
def to_unicode(unicode_or_str):
    if isinstance(unicode_or_str, str):
        value = unicode_or_str.decode('utf-8')
    else:
        value = unicode_or_str
    return value

def to_str(unicode_or_str):
    if isinstance(unicode_or_str, unicode):
        value = unicode_or_str.encode('utf-8')
    else:
        value = unicode_or_str
    return value
```

* In 2.x, unicode and str instances act the same when the unicode only has 7 bit ascii values in it:
    * You can combine it and a str with +
    * You can compare it and a str with equality tests
    * You can use it for a %s format string
* That means sometimes passing the value will work and sometimes it errors.
* In 3.x, bytes and str instances are never equivalent
* In 3.x, file handle operations default to UTF-8, in 2.x binary encoding
* If you want to read/write binary data to/from file, always open in binary mode

### Item 4: Write Helper Functions Instead of Complex Expressions

* Rather than writing complex conditional behavior, pull it out to a helper

### Item 5: Know How to Slice Sequences

* You can use slice syntax on any class with ``__getitem__`` and ``__setitem__``
* Basic syntax is ``somelist[start:end]``
* Start is inclusive, end is exclusive
* Leaving out start or end goes to that end of iterable
* Negative indices are fine, index out of bounds isn't an issue for slices
* Slice result is a new list; references to objects from original list are maintained; modifying the slice result doesn't modify original
* During assignments, slices replace the specified range

### Item 6: Avoid using ``start``, ``end``, and ``stride`` in a single slice

* You can give stride as ``somelist[start:end:stride]``
* Using start, end, and stride all at once is very confusing
* Be very careful about negative stride, though they're useful

```Python
a = [1,2,3,4,5]
b = a[::-1]         # [5,4,3,2,1]

c = ['a','b','c','d','e','f']
d = c[::2]          # ['a','c','e']
e = c[::-2]         # ['f','d','b']
```

### Item 7: Use List Comprehensions Instead of ``map`` and ``filter``

* Yep. Comprehensions are clearer and simpler.

### Item 8: Avoid More than Two Expressions in List Comprehensions

* You can chain them, but it gets confusing. Stick to two or fewer.

### Item 9: Consider Generator Expressions for Large Comprehensions

* Generators save memory over big static structures.
* You can compose iterators together, and calling ``next()`` on the outer will call it on the inner as well
* Chained generators execute very quickly

```Python
it = (len(x) for x in open('/tmp/my_file.txt'))
roots = ((x, x**0.5) for x in it)

print(next(roots))
```

### Item 10: Prefer ``enumerate`` over ``range``

* If you want to iterate a list and know the loop index, it can be tempting to use range to do it
* The built in ``enumerate()`` wraps any iterator with a lazy generator that yields pairs of the loop index and the next iterator value

```Python
for i, flavor in enumerate(flavor_list):
    print('%d: %s' % (i+1, flavor))

# Same thing without i+1 by starting enumeration at 1:
for i, flavor in enumerate(flavor_list, 1):
    print('%d: %s' % (i, flavor))
```

### item 11: Use ``zip`` to Process Iterators in Parallel

* It's common to have related lists you need to iterate in parallel
* Doing that with a length based for loop (via range) is clunky
* The zip builtin wraps two or more iterators in a lazy generator that yields tuples with the next value of each iterator

```Python
for name, count in zip(names, letters):
    if count > max_letters:
        longest_name = name
        max_letters = count
```

* Note that in 2.x zip doesn't create a generator, so a big usage could eat available memory
* If the iterators being zipped are different lengths, it only yields tuples until the shortest iterator is exhausted
* If you need the opposite behavior, use ``itertools.izip_longest``

### Item 12: Avoid ``else`` blocks after ``for`` and ``while`` loops

* The syntax implies the else block will only run if the body of the loop fails, but it actually runs no matter what at the end of iteration
* Don't use it because it's unclear to novice programmers

### Item 13: Take Advantage of Each Block in ``try``/``except``/``else``/``finally``

* Each of the try, except, else, finally blocks serves a goal in handling exceptions
* ``try``/``finally`` lets you propagate exceptions upward while also running cleanup code
* ``try``/``finally``/``else`` makes it clear which exceptions will be handled by your code and which will propagate upwards
