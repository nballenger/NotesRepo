# bash scripting cheatsheet

## Path expansion wildcards

* ``?`` - single character
* ``*`` - string of characters
* ``[set]`` - any character in ``set``
* ``[!set]`` - any character not in set
* ``[a-c]`` - any character in range

## Brace expansion

* ``preamble{string1,string2}postscript`` - returns one line for each item in braces
* ``a{1..5}b`` or ``a{b-e}z`` - produces one for each item in range

## Standard I/O

* Standard: ``STDIN STDOUT STDERR`` channels
* Popular data filters:
    * ``cat`` - copy input to output
    * ``grep`` - pattern match on input
    * ``sort`` - sort input lines
    * ``cut`` - extract columns from input
    * ``sed`` - edit input lines
    * ``tr`` - translate characters in input
* IO redirection:
    * ``program < input`` - input from file
    * ``program > output`` - output to file
    * ``program1 | program2`` - output of program1 to input of program2

## Background / Foreground Jobs

* ``program &`` - background a command
* ``jobs`` - check for running background jobs
* Backgrounded jobs don't use standard IO channels
* Typically you redirect to / from files for these
* ``long_running_job.sh a.dat b.dat > output.dat &`` - backgrounding with output
* You can set job priority with ``nice``

## Special characters

* ``~`` - alias for home dir
* `` `command` `` - command substitution
* ``#`` - comment
* ``$`` - variable expression
* ``&`` -  background job
* ``*`` - string wildcard
* ``( ... )`` - invoke subshell
* `` \ `` - quote next char
* ``|`` - pipeline
* ``[ ... ]`` - string charset
* ``{ ... }`` - command block
* ``;`` - command separator
* `` 'string' `` - strong quote
* `` "string" `` - weak quote
* ``<`` - input redirect
* ``>`` - output redirect
* ``/`` - pathname separator
* ``?`` - single char wildcard
* ``!`` - pipeline logical NOT

## Quoting

* Single quoted strings do no interpolation or translation
* Double quoted strings treat _some_ characters as special
* Outside a string you can de-special a single character with a backslash
* Continue lines with forward slash at the end, or within a quoted string

## Control keys

* Use ``stty all`` to see current control-key settings
* ``ctrl-c`` - stop current command with SIGINT
* ``ctrl-d`` - signal end of input
* ``ctrl-\`` - stop current command more forcefully
* ``ctrl-s`` - stop output to screen
* ``ctrl-q`` - restart output to screen
* ``del`` or ``ctrl-?`` - erase last character
* ``ctrl-u`` - kill current line
* ``ctrl-z`` - suspend current command

## Help

* ``help command`` - help for builtins
* ``help patternglob`` - help for multiple commands

## Command line editing

* Bash starts in emacs-mode
* You can enter a different editing mode with ``set -o emacs`` and ``set -o vi``
* Both of those set a ``readline`` variable in ``.inputrc``
* On shell exit, history is saved to ``HISTFILE``
* emacs editing mode:
    * Editing current line:
        * ``ctrl-b`` - back a char without deleting
        * ``ctrl-f`` - forward a char
        * ``del`` - delete one backward
        * ``ctrl-d`` - delete one forward
        * ``esc-b`` - one word back
        * ``esc-f`` - one word forward
        * ``esc-del`` - kill one word backward
        * ``esc-ctrl-h`` - kill one word backward
        * ``esc-d`` - kill one word forward
        * ``ctrl-y`` - yank/retrieve last item killed
        * ``ctrl-a`` - go to line start
        * ``ctrl-e`` - go to line end
        * ``ctrl-k`` - kill to end of line
    * History navigation:
        * ``ctrl-p`` - move to previous line in history
        * ``ctrl-n`` - move to next line in history
        * ``ctrl-r`` - search backward
        * ``esc-<`` - move to first line of history
        * ``esc->`` - move to last line of history
    * Completions:
        * ``esc-?`` - show all possible current tab expansions
        * ``TAB`` - attempt general completion
        * ``esc-/`` - attempt filename completion
        * ``ctrl-x /`` - list possible filename completions
        * ``esc-~`` - attempt username completion
        * ``ctrl-x ~`` - list possible username completions
        * ``esc-$`` - attempt variable completion
        * ``ctrl-x $`` - list possible variable completions
        * ``esc-@`` - attempt hostname completion
        * ``ctrl-x @`` - list possible hostname completions
        * ``esc-!`` - attempt command completion
        * ``ctrl-x !`` - list possible command completions
        * ``esc-TAB`` - attempt completion from previous commands in history
    * Misc:
        * ``ctrl-j`` - same as RETURN
        * ``ctrl-l`` - clear screen
        * ``ctrl-m`` - same as RETURN
        * ``ctrl-o`` - same as RETURN, then display next line in history
        * ``ctrl-t`` - transpose characters on either side of point, go forward
        * ``ctrl-u`` - kill line
        * ``ctrl-v`` - quoted insert
        * ``ctrl-[`` - same as ESC
        * ``esc-c`` - change word after point to allcaps
        * ``esc-l`` - change word after point to all lc
        * ``esc-.`` - insert last word in previous command line after point
        * ``esc-_`` - same as ``esc-.``
* vi editing mode:
    * Actually sort of unwieldy for single line editing
* the ``fc`` command:
    * gives a superset of the C shell history mechanism
* History expansion:
    * You use 'event designators' to recall commands:
        * ``!`` - start a history substitution
        * ``!!`` - refers to the last command
        * ``!n`` - refers to command line n
        * ``!-n`` - current line minus n
        * ``!string`` - most recent line starting with string
        * ``!?string`` - most recent line containing string
        * ``^string1^string2`` - repeat last command replacing string1 with 2
* The command line editing interface is actually a program called ``readline``
* That program's startup file is ``.inputrc``
* Uses the env var ``INPUTRC``
* You can change key bindings, etc. for readline.

## Customizing the bash environment

* Special files:
    * ``.bash_profile`` - read and executed in login shells
    * ``.bash_login`` - synonym for .bash_profile
    * ``.profile`` - synonym for .bash_profile
    * ``.bashrc`` - read by subshells and non-login shells on start
    * ``.bash_logout`` - executed on shell exit
* Aliases:
    * ``alias name=command`` - alias a command sequence
    * aliases are textually substituted before execution
    * aliases can recurse
    * If the value of an alias ends in a blank space, bash tries to do alias substitution on the next word on the command line, which allows you to alias strings to substitute into commands, like: ``alias mydir=foo/bar/baz;alias cd='cd '``, which will cause ``cd anim`` to search for an alias to expand for the second argument.
    * Typing ``alias somename`` with no equal sign, it prints the value
    * Typing ``alias`` prints all current aliases
    * ``unalias`` removes an alias definition
* Shell options:
    * Basic commands for options are ``set-o optname`` and ``set +o optname``
    * You can do multiple set args in a single line
    * ``-`` turns the named option on, ``+`` turns it off
    * Many options to ``set -o`` also have single letter flags
    * Typing ``set -o`` alone lists all options/settings
    * Basic options:
        * ``emacs`` - enters emacs editing mode
        * ``ignoreeof`` - you have to use ``exit`` to log out, instead of ``ctrl-d``
        * ``noclobber`` - no output redirection to overwrite existing files
        * ``noglob`` - no wildcard expansion
        * ``nounset`` - indicates an error when using undef variable
        * ``vi`` - enters vi editing mode
    * Bash 2.0 introduced ``shopt``:
        * Lets you do option config instead of env/set
        * ``shopt -o`` functional duplicates parts of ``set -o``
        * Basic format is ``shopt options option-names``
        * Options:
            * ``-p`` - display list of settable options/values
            * ``-s`` - sets each option name
            * ``-u`` - unsets each option name
            * ``-q`` - suppresses normal output
            * ``-o`` - back compatible for ``set``
        * Most useful Option names:
            * ``cdable_vars`` - arg to ``cd`` to tell it to do variable sub if it doesn't recognize the string given
            * ``checkhash`` - checks for a command in hash table before execution, executes from searchpath if not
            * ``cmdhist`` - attempts to save multi-line commands in history
            * ``dotglob`` - includes dotfiles in pathname expansion
            * ``execfail`` - non-interactive shells won't exit if they can't execute the file as specified as an argument to ``exec``
            * ``histappend`` - history appended to HISTFILE on exit, rather than overwriting
            * ``lithist`` - with ``cmdhist``, saves multiline commands with embedded newlines instead of semicolons
            * ``mailwarn`` - shows 'mail in mailfile has been read' if mail file has been accessed since last time
* Shell Variables
    * Key value pairs the shell keeps track of
    * Builtins are all caps
    * Syntax is ``varname=value`` - no spaces either side of the equals
    * Use ``echo $varname`` to print current value
    * Dollar sign survives inside double quotes to do interpolation
    * Double quotes keep the shell from splitting a string arg by default
    * Editing mode variables:
        * ``HISTCMD`` - history number of current command
        * ``HISTCONTROL`` - list of colon separated patterns, like ``ignorespace``, ``erasedups``, etc
        * ``HISTIGNORE`` - list of colon separated patterns for things not to put in history
        * ``HISTFILE`` - path to history file
        * ``HISTFILESIZE`` - max lines in history file
        * ``HISTTIMEFORMAT`` - format string for ``strftime`` to print timestamps in history
        * ``FCEDIT`` - path editor for ``fc``
    * Mail variables:
        * ``MAIL`` - name of file to check for new mail
        * ``MAILCHECK`` - how often in seconds to check
        * ``MAILPATH`` - colon separated paths to check for mail
    * Prompting vars:
        * ``PS1`` - primary prompt string
        * ``PS2`` - secondary prompt string, used for incomplete lines after RETURN
        * ``PS3`` and ``PS4`` - for shell programming and debugging
    * Command search path
        * ``PATH`` - colon separated string of paths to search for executables
    * Command hashing
        * Bash has a hash table for storing command executables
        * View current contents with ``hash``
        * ``hash commandname`` - forces ``hash`` to store the command in the search path
    * Directory search path and vars
        * ``CDPATH`` - list of directories, augments ``cd`` by giving it prefixes to search under
    * Misc vars
        * ``HOME`` - path to home dir
        * ``SECONDS`` - seconds since shell was invoked
        * ``BASH`` - pathname of this instance of the shell
        * ``BASH_VERSION`` - version string for current shell
        * ``BASH_VERSINFO`` - array of version info for current shell
        * ``PWD`` - current dir
        * ``OLDPWD`` - previous dir
* Customization and Subprocesses











------------------

## Chapter 4: Basic Shell Programming

### Shell Scripts and Functions

* Scripts can be run with ``source scriptname``
* You can run them from the command prompt if they're executable and in your PATH, or explicitly specified
* Running via ``source`` makes the commands run as through part of your session
* Calling by name runs a subshell to execute the commands
* Subshells understand exported env vars like ``TERM``, ``EDITOR``, etc, but not shell variables

#### Functions

* Functions are stored in the shell's memory, so are faster to execute
* Definition syntax:

```Shell
# Syntax one:
function function_name
    {
    shell commands
    }


# Syntax two:
function_name
()
{
    shell commands
}
```

* You can remove a function with ``unset -f function_name``
* You can see defined functions with ``declare -f``
* You can see just function names with ``declare -F``
* Differences between functions and scripts:
    * Functions don't run in a separate process
    * If a function name copies a script or executable name, the function takes precedence
* Precedence of command sources:
    1. Aliases
    1. Keywords like ``function``, ``if``, ``for``
    1. Functions
    1. Built-ins like ``cd`` and ``type``
    1. Scripts and executables in the PATH
* You can change the precedence order with ``command``, ``builtin``, ``enable``
* ``type -all commandname`` will give you lots of details of the commandname

### Shell Variables


