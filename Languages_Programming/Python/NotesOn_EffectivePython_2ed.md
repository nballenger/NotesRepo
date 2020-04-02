# Notes on Effective Python, 2nd Edition

By Brett Slatkin; Addison-Wesley Professional, Nov. 2019

ISBN 9780134854717

# 1. Pythonic Thinking

* Know which version of Python you're using
* `python` typically aliases `python2.7`
* `python3` is variable for which point release it aliases
* At runtime you can inspect version via `sys.version` and `sys.version_info`
* Follow the PEP8 style guide
    * Whitespace
        * Spaces instead of tabs
        * Four spaces for each level
        * lines 79 characters or less
        * Continuations of lines should be indented four additional spaces
        * Functions and classes separated by two blank lines
        * In a class, methods separated by one blank line
        * In a dict, no whitespace between key and colon, single space before value if it fits on the same line
        * One and only one space before/after assignment operators
        * For type annotations, ensure no separation between variable name and the colon, and use a space before the type info
    * Naming
        * functions, variables, attributes - `lowercase_underscore`
        * protected instance attributes - `_leading_underscore`
        * private instance attributes - `__double_leading_underscore`
        * classes - `CapitalizedWord`
        * module level constants - `ALL_CAPS`
        * instance methods in classes should use `self` as first param name
        * class methods should use `cls` as first param name
    * Expressions and statements
        * Use inline negation: `if a is not b` instead of `if not a is b`
        * Don't check for empty containers by comparing length to 0, use `if not somelist` and assume empty values implicitly eval to false. (Note that nested empty containers are not empty at the parent level, so `[[]]` is true
        * Avoid single line `if`, `for`, `while`, and `except` statements
        * If you can't put it on one line, put it in parens and make it easy to read
        * Prefer surrouding multilines with parens over using the slash continuation character
    * Imports
        * `imports` at the top of the file
        * Use absolute module names, not relative ones
        * If you must use relative imports, use dot syntax
        * Three import sections, each in alpha order:
            * Standard library
            * Third party modules
            * Your own modules
* Know the difference between `bytes` and `str`
    * Two types representing character data, `bytes` and `str`
    * Bytes instances have raw, unsigned 8-bit values
    * Str instances have unicode code points
    * Str instances do not have an associated binary encoding
    * Bytes instances do not have an associated text encoding
    * To convert unicode to binary, you must call `str.encode`
    * To convert binary to unicode, you must call `bytes.decode`
    * You can explicitly specify encoding to those methods, or default to UTF-8
    * Do encoding/decoding at the furthest boundary of your interfaces
    * Core program logic should use `str` type, should not assume anything about character encodings
    * Two common situations arise:
        * You want to operate on raw 8-bit sequences containing UTF-8 encoded strings OR
        * You want to operate on Unicode strings that have no specific encoding
    * Common to need two helper functions to convert between those cases, and ensure that the type of input values matches your code's expectations

        ```python
        def to_str(bytes_or_str):
            """ takes bytes or str, always returns str """
            if isinstance(bytes_or_str, bytes):
                value = bytes_or_str.decode('utf-8')
            else:
                value = bytes_or_str
            return value

        def to_bytes(bytes_or_str):
            """ takes bytes or str, always returns bytes """
            if isinstance(bytes_or_str, str):
                value = bytes_or_str.encode('utf-8')
            else:
                value = bytes_or_str
            return value
        ```

    * You can concatenate bytes instances with each other, or str instances with each other, but you can't mix types.
    * You can compare them with binary operators, but not with each other
    * Always evaluates to False, even if they contain the same characters
    * The `%` format operator works with both, but you can't insert a str into a bytes sequence, or vice versa
    * You can pass a bytes instance to a str format string using `%`, but it'll do this:

        ```python
        >>> print('red %s' % b'blue')
        red b'blue'
        ```

    * That uses the `__repr__` method of `bytes` to return a string
    * Operations involving file handles returned by `open` default to requiring unicode strings instead of raw bytes, which can cause surprising failures.
    * To write bytes, you have to use the mode string `wb`, read is `rb`
    * Alternately, you can specify the `encoding` parameter to `open`:

        ```python
        with open('data.bin', 'r', encoding='cp1252') as f:
            data = f.read()
        ```

* Prefer interpolated F-strings over c-style format strings and `str.format`
    * Four problems with C-style format strings in python:
        1. If you change the type or order of data values in the tuple on the right hand side, or the string on the left side, you can get type conversion errors.
        1. They become difficult to read when you need to make small modifications to values before formatting them into a string.
        1. If you want to use the same value multiple times in a format string, you have to repeat it in the right hand tuple, which is error prone.
        1. Using dicts can help with the above, but increases the overall verbosity of your code, since each key must be specified at least twice
    * Python 3 added advanced string formatting via `format` and `str.format`
    * Useful but still leaves code difficult to read when you're making small modifications to the values before formatting them. Also doesn't reduce redundant keys.
    * F-strings are bettah.
        * You prefix teh string with `f`, they then have no right hand side
        * Within them you can reference any name in the current scope
        * All options from the `format` built in mini-language are available
        * You can put a full python expression in a placeholder, which lets you make small modifications to values inside the format string itself:

```python
for i, (item, count) in enumerate(pantry):
    f_string = f'#{i+1}: {item.title():<10s} = {round(count)}'
```

* Write helper functions instead of complex expressions
* Prefer multiple assignment unpacking over indexing
* Prefer `enumerate` over `range`

    ```python
