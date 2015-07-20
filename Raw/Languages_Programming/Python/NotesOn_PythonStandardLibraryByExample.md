# Notes on The Python Standard Library By Example

## Chapter 1: Text

* ``string`` has lots of stuff. ``string.Template`` is of note because it lets you parameterize strings beyond what ``string`` or ``unicode`` can do.
* ``textwrap`` has tools for formatting tools take from paragraphs by limiting width, adding indentation, inserting line breaks.
* ``re`` is a regex lib in C
* ``difflib`` computes actual differences between sequences of text

### 1.1 ``string`` - Text Constants and Templates

**Purpose**: Contains constants and classes for working with text

#### 1.1.1 Functions

* ``capwords()`` - capitalizes all words in a string
* ``maketrans()`` creates translation tables that can be used with the ``translate()`` method to change one set of characters to another more efficiently than repeated ``replace()`` calls.

```Python
import string

s = 'The quick brown fox jumped over the lazy dog.'

print string.capwords(s)

leet = string.maketrans('abegiloprstz', '462611092572')

print s.translate(leet)
```

#### 1.1.2 Templates

* Templates are an alternative to built in interpolation syntax.
* Values interpolated are auto-converted to strings
* You cannot, for instance, control number of digits in a float representation
* If you use the ``safe_substitute()`` method, you can avoid exceptions if some values are omitted

```Python
import string

values = { 'var': 'foo' }

t = string.Template("""
Variable            : $var
Escape              : $$
Variable in text    : ${var}iable
""")

try:
    print 'substitute():', t.substitute(values)
except KeyError, err:
    print 'ERROR:' str(err)

print 'safe_substitute():', t.safe_substitute(values)
```

#### 1.1.3 Advanced Templates

* You can adjust the regex patterns ``Template`` uses to find variable names in a template body by changing the ``delimiter`` and ``idpattern`` class attributes
* For more complex changes, override the ``pattern`` attribute and define a new regex.

```Python
import string

class MyTemplate(string.Template):
    delimiter = '%'
    idpattern = '[a-z]+_[a-z]+'


class MyOtherTemplate(string.Template):
    delimiter = '{{'
    pattern = r'''
    \{\{(?:
    (?P<escaped>\{\{)|
    (?P<named>[_a-z][_a-z0-9*)\}\}|
    (?P<braced>[_a-z][_a-z0-9]*)\}\}|
    (?P<invalid>)
    )
    '''
```

### 1.2 ``textwrap`` - Formatting Text Paragraphs

**Purpose**: Formatting text by adjusting where line breaks occur in a paragraph.

* ``fill("a string", width=50)`` - spreads text to a given width, infilling spaces from the margins
* ``dedent("a string")`` - removes common indent from beginning of all lines
* Combination of the two: ``textwrap.fill(textwrap.dedent(text, width=40))``
* ``fill(initial_indent='', subsequent_indent=' '*4)`` sets first and later line indents separately.

### 1.3 ``re`` - Regular Expressions

**Purpose**: Regular expressions, duh.

* ``search(pattern, text)`` returns a ``Match`` object
* ``Match`` objects have the original input, the regex used, and the location of pattern matches in the string.
* ``pattern.search(text, position)`` constrains start point
* Frequently used patterns can be compiled: ``cp = re.compile(pattern)``
* ``findall(pattern, text)`` returns all matching substrings that don't overlap
* ``finditer()`` returns an iterator that produces ``Match`` instances

#### 1.3.4 Pattern Syntax

* Repetition metacharacters:
    * ``*`` previous pattern zero or more times
    * ``+`` previous pattern at least once
    * ``?`` zero or one time
    * ``{m}`` exactly m times
    * ``{m,}`` at least m times
    * ``{m,n}`` between m and n times, inclusive
* Greedy match can be turned off by following a repetition instruction with a question mark: ``r'x*?'``
* Character sets:
    * ``[ab]`` a or b
    * ``a[ab]+`` a followed by one or more a or b
    * ``a[ab]+?`` non-greedy form of previous
    * ``[^ab]`` NOT a or b
    * ``[a-z]`` range from a to z lowercase
    * ``[a-zA-Z]`` range of a to z upper and lower
    * ``.`` Any single character
* Escapes for character classes:
    * ``\d`` a digit
    * ``\D`` a nondigit
    * ``\s`` whitespace
    * ``\S`` non-whitespace
    * ``\w`` alphanumeric
    * ``\W`` non-alphanumeric
* Prefixing a single quoted string with ``r`` makes it a raw string, which will let you use character class escapes without double escaping their preceeding backslashes.
* Anchors:
    * ``^`` start of string or line
    * ``$`` end of string or line
    * ``\A`` start of string
    * ``\Z`` end of string
    * ``\b`` empty string at beginning or end of word
    * ``\B`` empty string not at beginning or end of word
* Groups:
    * ``a(ab)`` a followed by literal ab
    * All repetition modifiers may be applied to a group
    * All complete regexes can be converted to a group and inserted in another regex
    * Use ``Match.groups()`` to access backreferences to matched groups
    * Get a single match with ``group(n)``; 0 gives entire match
    * Python extends normal group syntax to include named groups, which use the syntax ``(?P<name>pattern)``
    * ``Match.groupdict()`` will give you group matches mapped to their names
    * ``(ab|ba)`` matches literal ab or literal ba
    * You can create 'noncapturing' groups by defining a group with a subpattern, when the subpattern is not part of what you want to extract. Noncapturing groups have the syntax ``(?:pattern)``
    * Ex: ``r'a((?:a+)|(?:b+))'``, which will match a followed by 1 or more a or b, but leave the following a or b sequence out of the extracted group
* Search Options
    * ``re.compile(pattern, re.IGNORECASE)``
    * ``re.compile(pattern, re.MULTILINE)``
    * ``re.compile(pattern, re.DOTALL)`` makes ``.`` match newlines
    * ``re.compile(pattern, re.UNICODE)``
* Verbose regex syntax is a regex inside triple quotes, which allows whitespace and comments.
* You can flag a pattern in cases where you can't compile an option in:
    * ``r'(?i)pattern'`` turns on case insensitive
    * ``(?m)`` turns on multiline
    * ``(?s)`` turns on dotall
    * ``(?u)`` turns on unicode
    * ``(?x)`` turns on verbose
    * Flags can be combined: ``(?imu)``
* Lookahead and lookbehind assertions:
    * ``(?=pattern)`` is lookahead syntax
    * ``(?!pattern)`` is a negative lookahead
    * ``(?<=pattern)`` is lookbehind
    * ``(?<!pattern)`` is negative lookbehind
* Email address verbose pattern that uses lookahead to match paired angle brackets:

```Python
address = re.compile(
    '''
    # A name is letters, may include period
    ((?P<name>
        ([\w.,]+\s+)*[\w.,]+
     )
     \s+
    ) # name is no longer optional

    # LOOKAHEAD
    # Angle brackets allowed only when paired
    (?= (<.*>$)         # remainder wrapped in angle brackets
        |
        ([^<].*[^>]$)   # remainder *not* wrapped in angle brackets
    )

    <? # optional opening angle bracket

    # The address itself: username#domain.tld
    (?P<email>
        [\w\d.+-]+      # username
        @
        ([\w\d.]+\.)+   # domain name prefix
        (com|org|edu)   # limited allowed tlds
    )

    >? # optional closing angle bracket
    ''',
    re.UNICODE | re.VERBOSE)
```

* Lookaheads are expressed as groups, but are noncapturing, and only effect whether the pattern as a whole matches or not
* A negative lookahead says the pattern does not match the text following the current point
* Lookbehinds must use a fixed length pattern. They can use repetition, but only a fixed number, no wildcards or ranges.


* Self-referencing expressions
    * Matched values can be used in later parts of an expression*
