# POSIX Scripting Cheatsheet

## Shell Commands

* `echo` - print args, separated by single spaces, followed by a newline
    * POSIX standard for `echo` says it should not support options
* `printf` - takes a format operand and any number of optional arguments
* `set` - three commands in one
    * with no args, prints names and values of all shell vars, incl. functions
    * With 1+ args, makes those the value of the `argv` shell var
    * With some specific options, changes shell behavior
    * options to `set` used in the book:
        * `-v` - print shell input lines as they are read
        * `-x` - print commands and their arguments as they are executed
        * `-f` - disable file name generation (globbing)
* `shift` - leading positional parameters are removed, remaining params moved up
    * Use an integer arg to shift off more than one param: `shift 3`
    * Mostly useful in scripts to iterate through CLI args
* `type` - indicates how each arg would be interpreted if used as a command name
    * If it's an executable file, prints path to file
    * Otherwise prints type of command: function, alias, shell builtin
    * Output is not standard across shells, can't be used reliably.
* `getopts` - parses positional params according to a string of acceptable options
    * If an option is followed by a colon, an arg is expected
    * Example of script accepting `-a`, `-b`, `-c`, with `-b` expecting an arg:

        ```shell
        while getopts ab:c opt
        do
            case $opt in
                a) echo "Option -a found" ;;
                b) echo "Option -b found with arg $OPTARG" ;;
                c) echo "Option -c found" ;;
                *) echo "Invalid option: $opt"; exit 5;;
            esac
        done
        ```

* `case` - branching construct, good for pattern matching in scripts
    * Format:

        ```shell
        case STRING in
            PATTERN [| PATTERN ...]) [list] ;;
            [PATTERN [| PATTERN ...]) [list] ;; ...]
        esac
        ```

    * `PATTERN` is a pathname expansion pattern, not a regex
    * `list` is a list of commands
* `eval` - evaluate rest of line and execute result
    * `eval "echo \${$#}"` - first pass generates `echo ${4}` (assuming 4 positional params)
    * Then it prints the value of the last positional param `$4`
* `local` - used in functions, takes 1+ vars as args, makes those local to the function and its children.
    * Not part of the POSIX standard, but in lots of shells
    * Almost entirely used in bash for setting `$IFS` without having to restore it later

# The POSIX Shell

From https://www.grymoire.com/Unix/Sh.html

* The `SHELL` env var tells you your default shell, but not what you're currently using
* To run a POSIX shell script, use `#!/bin/sh` as your shebang and make it executable
* The shell reads a script line by line, and
    1. Meta-characters are handled
    1. The name of the executable is found
    1. The arguments are passed to that program
    1. File redirection is set up
    1. The program is executed
* For each line, special meta-characters are read and filename expansion is performed
* Shell globbing control characters:
    * `*` - any number of any character
    * `?` - any single character
    * `[abcdef]` - any single character from the set in brackets
    * `[a-f]` - any single character in the range
    * `[a-fA-Z0-9]` - any single character in any of the ranges
* Filename expansion never expands to match a slash (the filesystem separator)
* Examples of directory globbing
    * `*` - all files not prefixed by a single dot
    * `abc/*` - all files in directory `abc` not prefixed by a single dot
    * `abc/.*` - all files in `abc` prefixed by a dot
    * `*/*` - all files in all subdirectories of the current directory not dot prefixed
    * `*/.*` - all dot prefixed files in all subdirectories of the current directory
* Finding the executable relies on the contents of `PATH`
* You can execute programs with long names without typing the name, via globbing, IF the executable file is in the specified directory and the expansion is unique

## Quoting with the Shell

* There is 'strong' and 'weak' quoting
* Strong quoting is inside single quote marks, and prevents characters having special meanings.
* Weak quoting allows meta-characters to have a special meaning, and is in double quotes
* Special characters inside a double quoted string
    * `\` - escapes the following character
    * `$` - indicates a variable
    * the backtick - does command substitution, like

        ```shell
        echo 'CWD is `pwd`'     # outputs: CWD is `pwd`
        echo 'CWD is \`pwd\`'   # outputs: CWD is \`pwd\`
        echo "CWD is `pwd`"     # outputs: CWD is /cwd/path/value
        echo "CWD is \`pwd\`"   # outputs: CWD is `pwd` 
        ```

* Mostly backtick usage is substituted with `$(command)`
* Strings can extend across several lines
* You can mix quote styles if you keep track of metacharacter usage
* Most languages use special characters at the start and end of a string, with an escape to insert special characters in the middle of the string. Shell quotes DO NOT DEFINE A STRING.
* Shell quotes DISABLE or ENABLE interpretation of meta-characters.
* The following are all equivalent:

    ```shell
    echo abcd
    echo 'abcd'
    echo ab'c'd
    echo a"b"cd
    echo 'a'"b"'c'"d"
    ```

* Variable interpolation is related to strong and weak quoting
* Interpolate by making sure variables are inside double quotes

## Variables

* Syntax is `variable=value`
* Variable names are limited to alphanumeric and underscore, no initial number
* Whitespace terminates a value, so quote anything with a space
* You can do multiple assignments on a line: `A=1 B=2 C=3 D=4`
* Never put space on either side of the equals sign, though `a=` will set `a` to the empty string (though `a=''` is more explicit)
* You can see all current variables with `set`
* Environment variables exist to pass info to all processes created by a parent process
* Your shell gets some env vars at startup
* Every process you start gets those variables as read-only
* Using `export` on a variable marks it as an env var to be passed to child processes
* You can change env vars in the shell, but without `export` the updated values are not persisted into child processes.
* Note that `export` marks a value, it does NOT copy the current value into a safe place, so a variable can be marked for export prior to being set.

### Special Environment Variables

* `PATH` - search path for executables.
    * An empty string in the `PATH` corresponds to the current working directory
    * DON'T ADD CWD to `PATH`
    * If you have to do it, make sure it is last
* `HOME` - your user's home directory
* `CDPATH`
    * when you execute `cd` and specify a directory, the shell searches for that directory inside the current working directory.
    * You can add to the locations it searches for relative paths by adding to `CDPATH`
* `IFS` - internal field separator
    * lists the characters that terminate a word, whitespace by default (space, tab, newline)
* `PS1` - normal prompt
* `PS2` - secondary prompt, like inside a quoted string
* `MAIL` - where your mailbox is located

### Shell variable stuff

* Wrap your interpolated names in curly braces: `echo ${SOMEVAR}_foo`
* Not doing so would cause it to look for `$SOMEVAR_foo` since underscores are legal
* Curly brances have variations:
    * `${variable?error message}` - complain if undefined
    * `${variable-default}` - use default value if undefined
    * `${variable+word}` - use new value if defined
    * `${variable=word}` - use new value if undefined, and redefine
* To undefine a variable, use `unset varname`
* If you need to look at undef or null
    * `${variable:?error message}`
    * `${variable:-word}`
    * `${variable:+word}`
    * `${variable:=word}`
* Examples:

    ```shell
    # a is undefined
    b=""
    c="Z"
    echo a=${a-1}, b=${b-2}, c=${c-3}       # output: a=1, b=, c=Z
    echo a=${a:-1}, b=${b:-2}, c=${c:-3}    # output: a=1, b=2, c=Z
    ```

* Note that the bit that follows `-`, `+`, `=` executes lazily, so isn't guaranteed to run if the proceeding var name is defined / not null

### Special Variables in the Shell

* Positional params: `$1`, `$2`, ..., `$9`
* Shell can have any number of params, but you only get 9 positional params
* Use `shift` to work it down
* `$0` is the name of the script
* `$*` is all positional parameters
* `$@` is all positional parameters with spaces
    * For both `$*` and `$@` you get all positional params separated by spaces
    * Only `$@` retains spaces inside the variables
* `$#` is the number of arguments passed to the script
* `$$` is the current process id
* `$!` is the id of the background job
* `$?` is the return value of the previous command
* `$-` relates to internal shell variables

### $- Set variables

* `set` shows all variables regardless of `export` status
* `env` shows only variables marked for export
* `set` with arguments sets the value of the parameter array
* This is the only array the shell has, and you can put anything in it but you lose the previous contents.
* Keeping them:

    ```shell
    old=$@
    set a b c   # $1 is now "a", $2 is "b", $3 is "c"
    set $old    # $1, $2, $3 set back to original values
    ```

* That gets screwed up if any of the arguments have internal spaces
* Probably better to do `one=$1;two=$2;three=$3`

### Special Options

* If a dollar sign is followed by a letter, it's a variable
* If followed by an integer, it's a param
* If it's one of the specials, `$*`, `$@`, etc, it's that specific thing
* There are other things, "options" or "flags" that are not read--you don't use them in strings, tests, filenames, etc. They're booleans, and internal to the shell. You cannot assign arbitrary values to them with `=`
* You can set them and clean them, but you cannot read them by name.
* You read them by looking at the contents of `$-` which shows you which are set
* Flags:
    * `x` - echo every command, with external commands with `+` prepended
    * `v` - verbose flag, echoes the line as it is read (where x echoes as executes)
    * `u` - report an error for any unset variable
    * `n` - read and parse a script, but don't execute
    * `e` - if any error occurs, immediately exit
    * `t` - execute one more line then exit
    * `a` - all variables modified or created are automatically exported
    * `k` - all assignments on the same line as the command become export vars, not just those before the command
    * `c` - execute the command that's the argument to the flag
    * `s` - force the shell to read from stdin even if it has other args
        * if you execute the shell with no args it reads from stdin: `echo "a" | sh`
        * this ignores STDIN: `echo "a" | sh somescript`
        * this ignores `somescript`: `echo "a" | sh -s somescript`
    * `i` - do not ignore TERMINATE and INTERRUPT signals
    * `p` - does not change effective user and group to real user and group

## Simple Flow Control

* `command1 && command2` - execute `command2` if `command1` exits 0
* `command1 || command2` - execute `command2` if `command1` exits non-zero
* `cmd1 ; cmd2 ; cmd3; cmd4` - execute sequentially
* `cmd1 & cmd2 & cmd3 & cmd4` - launch detached, order non-sequential
* `cmd1 && cmd2 && cmd3 && cmd4` - execute sequentially if each succeeds
* `cmd1 || cmd2 || cmd3 || cmd4` - cmd4 executes if the first three fail
* Operator precedence, low to high: `; & < && || < |`
* So this: `a | b && c ; d || e | f;`
* Evaluates to `(a | (b && c)) ; ((d || e) | f);`
* Simple if-then-else: `cmd1 && {cmd2;exit0;} || cmd3` - keeps cmd3 from running if 1 succeeds and 2 fails
* You can change precedence with parens or curly braces
* Parens make the shell execute a new process
* Curly braces require semicolons after each command inside, and a space after `{`

## Shell Flow Control Commands: If, While, and Until

* Ways of grouping commands:
    * Simple command - collection of words separated by spaces
    * Pipeline - group of commands separated by pipes
    * List - series of pipelines separated by `&`, `;`, `&&`, or `||` and terminated by a semicolon, ampersand, or newline
* A command can be simple or complex
* Complex commands:
    * `if <list> then <list> fi`
    * `if <list> then <list> else <list> fi`
    * `if <list> then <list> elif <list> then <list> fi`
    * `if <list> then <list> elif <list> then <list> elif <list> then </list> fi`
    * whatever, you can stick an else in there too
    * `while <list> do <list> done`
    * `until <list> do <list> done`
* The following words MUST be the first word on a line:
    * `if then else elif fi case esac for while until do done { }`
* The line can start after a semicolon or ampersand
* Syntax of `while`:

    ```
    while mytest
    do
        echo mytest is still true
    done;
    ```

## `expr` - Shell Expression Evaluator

* `expr` does four types of operations
    * arithmetic
    * logical
    * relational
    * string
* Operators:
    * arithmetic: `+ - * / %`
    * relational: `= > >= < <= !=`
    * boolean: `| &`
    * string: `:` - match or substitute
* Must be spaces between operators and expressions

# Tests

https://pubs.opengroup.org/onlinepubs/9699919799/utilities/test.html



## References

* Book: Shell Scripting Recipes: A Problem-Solution Approach, 2nd Ed.; Apress, Oct. 2015; ISBN 9781484202203
* Website: https://www.grymoire.com/Unix/Sh.html
* Website: https://pubs.opengroup.org/onlinepubs/9699919799/utilities/test.html
