# Notes on Learning Shell Scripting with Zsh

By Gaston Festari; Packt Publishing, January 2014; ISBN 9781783282937

# Chapter 1: Getting Started

## First Run

* You can create an rc file in `~/.zshrc`
* It has lots of options. Option names are case-insensitive and ignores underscores
* Options are like switches that can be on/off
* Easiest way to toggle is via `setopt/unsetopt`
* You can negate an option by prepending `NO`, as in `setopt NO_SOMEOPTION`
* Book convention is to use all caps snake-case for option names
* Comments in rc file start with hash
* There are startup shell options:
    * `-v` turns on verbose mode
    * `-x` turns on xtrace for debugging scripts
* You can set startup flags during shell runtime with `set -v` or similar
* `set +v` turns it off
* Startup files:
    * Looks under `/etc` first, then in `$HOME`
    * Ordering of files is:
        * `zshenv`
        * `zprofile`
        * `zshrc`
        * `zlogin`
    * If `zsh` is not called as an interactive shell, `zprofile` and `zshrc` are not sourced
    * If not called as a login shell, `zlogin` is not sourced
* Total precedence order of startup files is:
    1. `/etc/zshenv`
    1. `~/.zshenv` - only add stuff like PATH that should be used for all shells
    1. `/etc/zprofile`
    1. `~/.zprofile` - any scripts you want executed before `~/.zshrc`
    1. `/etc/zshrc`
    1. `~/.zshrc` - most user settings and shell preferences
    1. `/etc/zlogin`
    1. `~/.zlogin` - scripts to run after main startup
* There are also shutdown files, which run in this order:
    1. `~/.zlogout`
    1. `/etc/zlogout`
* The `RCS` and `GLOBAL_RCS` options can disable loading mechanism of startup files
* You would have to do that in `/etc/zshenv`

## The shell prompt

* The `prompt` utility lets you select a preferred theme
* You have to call `promptinit` before you can use it
* You can set the theme for the current shell with `prompt themename arg1 arg2...`
* You can allow comments on the command line with `setopt INTERACTIVE_COMMENTS`
* You can get help with `prompt -h themename`
* There are five different prompts you can change
    * `$PS1` or `$PROMPT`
    * `$RPS1` is a right hand side prompt
    * `$PS2` gets displayed whenever the shell is waiting for input
    * `$PS3` is used for making choices in a `select` loop
    * `$PS4` is useful for script debugging
* Most escape sequences start with a percent sign
* To make escape sequences work in the prompt you have to do `setopt PROMPT_SUBST`
* That makes `$PROMPT` get treated like any other shell var for substitution
* Shell state options:
    * `%#` - displays `#` if shell is running with elevated privs, else `%`
    * `%?` - shows exit status of last command
    * `%h` or `%!` - shows current history event number
    * `%L` - current value of `$SHLVL`
    * `%j` - number of jobs being executed
* Login info options
    * `%M` - machine hostname
    * `%m` - hostname up to first dot
    * `%n` - same as env var `$USERNAME`
* Directory options
    * `%d` or `%/` - equivalent of `$PWD`
    * `%~` - same as previous but shows tilde if in home
    * `%c` or `%.` - amount of directories trailing `$PWD`
    * `%C` - same as previous, no symbol replacement in dir names
* Date and time options
    * `%D` - yy-mm-dd format
    * `%W` - mm/dd/yy
    * `%w` - day-dd
    * `%T` - curtime, 24 hour
    * `%t` or `%@` - curtime, 12 hour w am/pm
    * `%*` - same as previous, with seconds
* Text formatting options
    * `%Uunderlinedtext%u`
    * `%Bboldtext%b`
    * `%K{red}%k` - sets bg color
    * `%F{red}%f` - sets fg color
    * `%Shighlightedtext%s`
* For a literal percent use `%%`, for a literal close paren use `%)`
* You can do conditional expressions in escape sequences
    * Ternary: `%(X.true-text.false-text)`
* If you want to alter what's shown for a theme's prompts, you go find the `prompt_<theme_name>_setup` naming pattern and change what's in there

# Chapter 2: Alias and History


