# Lexical Structure

## Structure of Source Files

* Python **source files** end in `.py` and may use any unicode characters (3.x onward).
    * A source file may specify a non-standard encoding with a **coding directive** on its first line.
    * Coding directives have the format `# coding: iso-8859-1`.
* Source files are sequences of **logical lines**.
* A logical line is a sequence of one or more **physical lines**.
    * Physical lines may end with a comment preceded by a `#`; AND
    * May be blank for readability (ignored by interpreter); AND
    * Are joined to the following physical line if:
        * It terminates in a backslash; OR
        * Its end is inside an open paren, bracket, or brace; OR
        * Its end is inside a triple quoted string.
* Logical lines at the same level of indentation comprise **blocks**.
    * Four spaces per indent level is standard, though not enforced.
* Logical lines are decomposed by the interpreter into **lexical tokens**.
    * Decomposition splitting ignores all whitespace within a line beyond the first space character.
* Lexical tokens divide into five types: **identifiers**, **keywords**, **operators**, **delimiters**, and **literals**.
* Identifier tokens reference one of four types of object: **variables**, **functions**, **classes**, and **modules**.
    * Identifier names are case sensitive and patterned `^[_\s][_\d\s]*$`
    * By convention:
        * Class names are ucfirst, all else lcfirst.
        * CamelCase and snake_case are equally acceptable.
        * `_foo` means 'private'; `__bar` means 'strongly private'
        * `__baz__` indicates a language defined special name
* Keyword tokens are language specific reserved words.
    * The 3.x reserved words are: `False None True and as assert break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield`

* Operator tokens are nonalphanumeric characters and character combinations, such as `+`, `=`, and `!=`.
* Delimiter tokens are: `( ) [ ] { }`, ``, : . ` ; @``, `+= -= *= /= //= %=`, and `&= |= ^= >>= <<= **=`
* Literal tokens are direct denotations of a data value and may be **numbers**, **strings**, or **containers**.
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

## Logical Program Structure

* Programs are sequences of **statements**.
* Statements are imperative instructions (they **do** something) composed of **expressions**.
* Expressions are declarative instructions (they **say** something) composed of **atoms**.
* An atom is a single unit of meaning that may be an identifier, literal, or **enclosure**.
* Enclosures are multi-token atoms that are one of: 
    * A **parenthesized form** - an expression list in parentheses yielding a tuple or a single expression
    * A list, dict, or set **display** - an enclosure in brackets or braces yielding a literal list, dictionary, or set
    * A **generator expression** - a parenthetical that yields a generator object
    * or a **yield atom** - a `yield` or `yield from`
* Example expressions:

        42                      # numeric literal
        'hello'                 # string literal
        somevar                 # variable identifier
        someobj.someattr        # attribute identifier
        (1,2,3)                 # parenthesized tuple literal
        (1 + 2)                 # parenthesized expression
        ['a','b','c']           # list display, returns list literal
        (n for n in range(5))   # generator expression

* Statements may be **simple** or **compound**.
* Simple statements contain no other statements and exist entirely within one logical line.
    * Multiple simple statements separated by semi-colons may occur in a single physical line.
    * Simple statements may be one of:
        * an expression; OR
        * an assignment, augmented assignment, or annotated assignment; OR
        * the no-op `pass`; OR
        * a `del` operation; OR
        * a `yield` or `return`; OR
        * a `raise`, `break`, or `continue`; OR
        * an `import`, or `global` or `nonlocal` declaration
* Example simple statements:

        a: int = 0              # annotated assignment
        a = 10                  # assignment
        a += 1                  # augmented assignment
        a < 12                  # expression
        pass                    # no-op
        del a                   # reference destruction
        import somemodule       # import statement

* Compound statements contain one or more simple statements and may control their execution.
* A compound statement has one or more **clauses** at the same indent level.
* A clause is composed of a **header** and a **body**.
* A header starts with a keyword and ends with a colon.
* A body is a sequence of one or more statements.
    * A body with multiple statements is a block.
    * A body with a single, simple statement may follow the header on a single line.
* Compound statement clauses may be one of:
    * `if [... elif [... else]]` conditional
    * `while`, `for` loop (normal or async)
    * `try [... except]`
    * `with`
    * a function or class definition
    * async function definition
* Example compound statements:

        if a == 10:         # header if clause
            a += 1          # statement body block
            a /= 2
        else:               # else clause at same indent as 'if'
            a += 4          # additonal statement body

        if a > 100: a = 10  # single line compound statement


