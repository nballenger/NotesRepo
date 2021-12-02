# Notes on PDB debugger

From https://docs.python.org/3/library/pdb.html#debugger-commands

## Debugger Commands

* Entering a blank line repeats the last command entered. If the last command was `list`, the next 11 lines are listed.
* Commands the debugger doesn't recognize are assumed to be Python statements, and are executed in the context being debugged.
* Python statements can also be prefixed with `!`
* Debugger supports aliases, and aliases can have parameters allowing you to adapt the context being examined
* Multiple commands can be put on one line, separated by `;;`
* If `~/.pdbrc` or `./.pdbrc` exists, it's read and executed as though it had been typed at the debugger prompt, which is good for setting up aliases.
* If both files exist, home dir one is read first, local can override

### Commands

* `h(elp) [command]` - print help
* `w(here)` - print a stack trace, most recent frame at the bottom. Arrow indicates the current frame, which determines context for most commands.
* `d(own) [count]` - move the current frame count N levels down in the stack trace to a newer frame
* `u(p) [count]` - move the current frame N levels up in the stack trace to an older frame
* `b(reak) [([filename:]lineno | function) [, condition]]`
    * with `lineno`, set a break there in the current file
    * with `function` arg, set a break at the first executable statement within that function
    * line number can be prefixed with filename and colon to set a break in another file, which will be searched on `sys.path`
    * Every breakpoint is assigned a number to which all other breakpoint commands refer
    * If a second arg is present it is an expression which must eval to true before the breakpoint is honored
    * Without args, lists all breakpoints, including for each breakpoint the number of times that breakpoint has been hit, the current ignore count, and the associated condition if any.
* `tbreak [([filename:]lineno | function) [, condition]]`
    * temporary breakpoint, removed automatically when first hit
    * args otherwise same as for `break`
* `cl(ear) [filename:lineno | bpnumber...]`
    * with a `filename:lineno` arg, clear all breakpoints at that line
    * with space separated list of breakpoint numbers, clear those
    * with no args, clear all breaks after confirmation
* `disable [bpnumber...]`
    * disable breakpoints given as space separated list
    * disabling a breakpoint means it can't stop execution, but remains in the list of breakpoints and can be re-enabled
* `enable [bpnumber...]` - enable specified breakpoints
* `ignore bpnumber [count]`
    * set the ignore count for a given active breakpoint
    * if count is omitted, ignore count set to 0
    * breakpoint is active when the ignore count is zero
    * when non-zero, count is decremented each time the breakpoint is reached and the breakpoint is not disabled, and any associated condition evaluates to true
* `condition bpnumber [condition]`
    * set a new condition for a breakpoint
    * if no condition given, any existing condition is removed
* `commands [bpnumber]`
    * specify a list of commands for breakpoint N
    * commands are entered on following lines
    * terminate with a line containing just `end`
    * Example:
        
        ```
        (Pdb) commands 1
        (com) p some_variable
        (com) end
        (Pdb)
        ```

    * To remove all commands from a breakpoint, type `commands` and follow it immediately with `end`
    * With no `bpnumber` arg, refers to the last breakpoint set
    * You can use breakpoint commands to start your program again, by using `continue` or `step`, or another command that resumes execution
    * Specifying a command that resumes execution (`continue`, `step`, `next`, `return`, `jump`, `quit`) terminates the command list, since any time you resume execution you may encounter another breakpoint, which could have its own command list.
    * If you use the `silent` command in the command list, the usual message about stopping at a breakpoint is not printed. May be desirable for breakpoints whose purpose is to print a message and continue. If none of the other commands print anything, you don't see any sign that the breakpoint was reached.
* `s(tep)` - execute current line, stop at first possible occasion, in a function called or on the next line of the current function
* `n(ext)`
    * continue execution till next line in current function is reached, or it returns.
    * different from `step` because that stops inside a called function, while `next` executes called functions and only stops at the next line of the current function
* `unt(il) [lineno]`
    * with no arg, continue execution until the line with a greater number than the current one is reached
    * with a line number, continue until a line with a number greater or equal to that is reached
    * In both cases also stop when current frame returns
* `r(eturn)` - continue execution until current function returns
* `c(ont(inue))` - continue execution, only stop when a breakpoint is encountered
* `j(ump) lineno`
    * set next line that will be executed
    * only available in the bottom-most frame
