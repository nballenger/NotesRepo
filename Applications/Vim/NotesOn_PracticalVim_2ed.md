# Notes on Practical Vim, 2nd Edition

by Drew Neil; Pragmatic Bookshelf, Oct. 2015; ISBN 9781680501278

# Read the Forgotten Manual

* To get help, use `:h` or `:help`
* You can look at the vimtutor with `:h vimtutor`
* If you want to use factory settings, start with `vim -u NONE -N`
* `-u NONE` tells it not to source `~/.vimrc`
* `-N` sets `nocompatible` with tells it not to load a `vi` compatible mode
* Some examples use built-in features that are implemented with Vim script, so you have to have plugins enabled. Absolute minimum config for that is:

    ```
    set nocompatible
    filetype plugin on
    ```

* Source it with `vim -U code/essential.vim` (or whatever you name the above snippet)
* Vim script lets you add new functionality or change existing functionality
* It's not really covered in this book but has a bit for some everyday tasks
* To check the features enabled at compile time, check the output of `:version`

# 1. The Vim Way

* Vim is optimized for repetition, and tracks recent actions
* That's not powerful unless you learn to craft your actions to do a useful unit of work while being replayed.
* The dot command is the starting point for that functionality

## Tip 1: Meet the Dot Command

* `.` in normal mode lets you repeat the last change
* The last change can be things like 
    * `x` to remove a single character
    * `dd` to remove the current line
    * `>G` to indent from current line to EOF
* You also create a changeset every time you go into insert mode
* Vim records every keystroke from the time you go into Insert mode to the time you return to Normal mode, and the dot command will replay those keystrokes
* Think of the dot commands as a sort of 'micro macro', since it replays a unit of work (a macro being a designed unit of work)

## Tip 2: Don't Repeat Yourself

* Example of needing to add a semicolon to the end of several lines
* You could navigate to the line end with `$`, then do `a;<Esc>` to make the change, then do that again for each line
* Easier would be to use `j$.` two times, to go down a line with `j`, to the end with `$`, and replay the append with `.`
* You could also use `A` to go to line end and enter insert mode, which squashes the `$a` keystrokes into one compound

### Two for the Price of One

* Vim has compound commands:
    * `C` &rarr; `c$` - clear from cursor to EOL, enter insert
    * `s` &rarr; `cl` - clear next character, enter insert
    * `S` &rarr; `ctrl-C` - clear entire line, enter insert
    * `I` &rarr; `ctrl-i` - go into insert at start of current line
    * `A` &rarr; `&a` - go into insert at end of current line
    * `o` &rarr; `A<CR>` - go to end of current line, into insert, add carriage return
    * `O` &rarr; `ko` - go up one line, to the line end, enter insert, append CR

### Tip 3: Take One Step Back, Then Three Forward

```
# You want to change this:
var foo = "methodname("+arg1+","+arg2+")";

# to this:
var foo = "methodname(" + arg1 + "," + arg2 + ");
```

* Idiomatic vim solution:
    1. _Start at beginning of line_
    1. `f+` to move forward to first `+` character
    1. `s + <Esc>` to replace `+` with `<Space>+<Space>` and return to Normal mode
    1. `;` to repeat last `f|t|F|T` and go to next `+`
    1. `.` to repeat the `s` command
    1. `;.;.` to move and repeat twice
* `s` deletes the character under the cursor and enters insert mode

### Tip 4: Act, Repeat, Reverse

* For repetitive editing, you can work optimally by making both the motion and the change repeatable. Vim does this by remembering our actions and keeping the most common ones easily replayable.

| Intent | Act | Repeat | Reverse |
|-----|-----|-----|-----|
| Make a change | `{edit}` | `.` | `u` |
| Forward search line for `{char}, place cursor before it | `t{char}` | `;` | `,` |
| Forward search line for `{char}`, place cursor on it | `f{char}` | `;` | `,` |
| Reverse search line for `{char}`, place cursor after it | `T{char}` | `;` | `,` |
| Reverse search line for `{char}`, place cursor on it | `F{char}` | `;` | `,` |
| Scan forward in document for match | `/pattern<CR>` | `n` | `N` |
| Scan backward in document for match | `?pattern<CR>` | `n` | `N` |
| Perform substitution | `:s/target/replacement` | `&` | `u` |
| Execute sequence of changes | `qx{changes}q` | `@x` | `u` |

## Tip 5: Find and Replace by Hand

* You can do a global substitution, but this changes the first occurrence manually then does find and replace for the others one by one. 
* Example is a file where the word `content` appears multiple times, and we want to change the occurrences to `copy`
* Could do `%s/content/copy/g`, but that may well create grammatically incorrect usages
* Uses the ` * ` command, which searches the document for the word under the cursor
* Sequence:
    1. `/content` - go to first occurrence
    1. ` * ` - go to next occurrence
    1. `cwcopy<Esc>` - do replacement
    1. `n` - go to next occurrence
    1. `.` - repeat replacement
* The `cw` command deletes to end of current word, drops to Insert mode, so if you are at the start of `content` it'll ditch it and let you type in the replacement.

## Tip 6: Meet the Dot Formula

* This identifies a common pattern in the previous tips, which forms an optimal editing strategy the author calls the Dot Forumla
* The ideal is one keystroke to move, one keystroke to execute the change
* Each of the previous examples does that, but you have to think in those terms, of making the movement _and_ the change repeatable on their own.

# Part 1: Modes

# 2. Normal Mode

* Vim's natural resting state. Short chapter because most of the book is about Normal mode.
* Lots of commands in Normal mode can be executed with a count, which causes them to run multiple times
* Sometimes it's not worth the time to figure out what the count would be--just repeat your actions till you're done.

## Tip 7: Pause with Your Brush Off the Page

* Think of all the stuff a painter does that is _not_ putting paint to canvas. They don't rest their brush on the canvas during those times, they remove it entirely.
* That's the equivalent to Normal made. It's the default state, you move to Insert mode for specific reasons, then return to Normal mode.

## Tip 8: Chunk Your Undos

* In Vim you can control the granularity of the undo command.
* `u` reverts the most recent change
* A change is anything that modifies text in the document
* Includes commands triggered from Normal, Visual, and Command-Line modes
* Also includes changes in Insert mode
* In a non-modal editor, undo could undo the last character, last word, or some other unit of change
* By default, everything from the moment you enter Insert mode to when you return to Normal mode counts as one change for the purposes of `u`, `.`, and `ctrl-r`
* You can make the undo command work on words, sentences, paragraphs, by moderating use of `<Esc>`
* How often to leave Insert mode (to chunk the undo)? Author likes to make one "undoable chunk" correspond to a thought.
* Each pause in your writing makes a natural breakpoint--return to Normal mode.
* Consider using `<Esc>o` to start a new line instead of just hitting Enter in Insert mode, as it breaks up the chunk.
* Important detail: Moving around in insert mode will reset the change. Using the arrow keys to move around in insert mode makes a new undo chunk. This has implications for using the dot command.

## Tip 9: Compose Repeatable Changes

* Be mindful of how you compose changes, to optimize for repetition
* You can delete backwards. Say you're on the last character of a word and want to remove that word. Use `db` to remove from cursor to start of word (does not remove character under cursor), then `x` to remove last character.
* You can delete forwards, with `dw`, which removes the entire word
* You can delete an entire word with `daw`, no matter where the cursor is in that word
* Techniques:
    * `dbx` - remove from current position to start of word, remove final character
    * `bdw` - move to beginning of word, delete word
    * `daw` - delete entire word cursor is on
* `daw` invests most power in the dot command, will ditch entire word cursor is on

## Tip 10: Use Counts to Do Simple Arithmetic

* `ctrl-a` and `ctrl-x` do addition and subtraction on numbers
* If run without a count they increment by one, with a count by that number
* `10ctrl-a` would increment the number by 10
* It works on the number at or after the cursor, on the same line
* It'll move to the end of the number and increment/decrement
* Say you have a line with a number, and you need to copy and decrement/increment it 10 times
* Note on number formats
    * Numbers with a leading zero is assumed to be octal
    * If you don't use octal, add `set nrformats-=octal` to `.vimrc`
    * Octal excluded by default in versions 8+

## Tip 11: Don't Count If You Can Repeat

## Tip 12: Combine and Conquer

* A lot of the power of vim is from how operators and motions can combine
* Operator commands:
    * `c` - change
    * `d` - delete
    * `y` - yank to register
    * `g~` - swap case
    * `gu` - make lowercase
    * `gU` - make uppercase
    * `>` - shift right
    * `<` - shift left
    * `=` - autoindent
    * `!` - filter `{motion}` lines through external program
* The combination of operators with motions forms a kind of grammar
* First rule: an action is composed of an operator followed by a motion
* For instance
    * you can delete a word with the `d` operator and `aw` motion: `daw`
    * you can uppercase with the operator `gU`
    * therefore you can uppercase a word with `gU` + `aw` = `gUaw`
* Or you can use the `ap` motion (paragraph) to do `gUap`
* Second rule: when an operator command is invoked in duplicate, it acts on the current line
* So `dd` deletes the current line, `>>` indents the current line, etc.
* `gUgU` would uppercase the current line, as would `gUU`
* You can expand Vim's default operators and motions with custom ones
* Tim Pope's `commentary.vim` plugin adds a command for commenting/uncommenting lines of code
* To learn about creating custom operators, read `:map-operator`
* For custom motions, Kana Natsuno's `textobj-entire` plugin is a good example
    * adds `ie` and `ae` that work on the entire file
    * auto indenting entire file (from cursor down) using existing motions is `gg=G`
    * with the plugin, it's `=ae`, no matter your cursor location
* Learn about custom motions in `:omap-info`
* Operator-Pending Mode
    * There are other modes outside Normal, Insert, and Visual
    * Operator-Pending mode usually lasts a fraction of a second
    * It's invoked when you start a command like `dw`, and lasts from the time you hit `d` till you hit `w`
    * If Vim is a finite state machine, OP mode is a state that only accepts motion commands
    * While in OP mode, you can return to normal mode via `<Esc>`
    * Multi-keystroke commands do NOT entire OP mode until they complete--the first keystroke is a namespace that narrows what the next keystroke can do. Only full operator commands initiate OP mode.
    * Why have this mode? Because we can create custom mappings that initiate or target OP mode, which allows you to create custom operators and motions.

# 3. Insert Mode

* Most commands are triggered in other modes, but some functionality is available in Insert mode

## Tip 13: Make Corrections Instantly from Insert Mode

* Say you make a mistake typing, you have some options for correcting it
    * backspace and retype in Insert mode
    * enter Normal mode, navigate, fix, use `A` to return to EOL
    * use Insert mode shortcuts
* Insert mode shortcuts:
    * `<ctrl-h>` - delete one character (like backspace)
    * `<ctrl-w>` - delete back one word
    * `<ctrl-u>` - delete back to start of line
* You can use those in Vim's command line, and the bash shell

## Tip 14: Get Back to Normal Mode

* This tip reduces friction of mode switching
* Ways to get back to normal mode:
    * `<Esc>` - switch to Normal mode
    * `<ctrl-[>` - switch to Normal mode
    * `<ctrl-o>` - switch to Insert Normal mode
* Insert Normal mode is a variant on Normal where you get to issue one command and then are returned to Insert
* Say the current line is at the top or bottom of the screen, and you'd like to use `zz` to redraw with the line in the middle. Use `<ctrl-o>zz`, which will drop to Insert Normal, redraw, then go back to Insert
* Remap the Caps Lock key
    * It can substantially change the meaning of keystrokes
        * `j` and `k` move the cursor around
        * `J` joins current and next line
        * `K` looks up the manpage for the word under the cursor
    * A lot of vim users remap caps lock to make it act like a different modifier key
    * author prefers to remap it to be `<ctrl>`
    * simplest way to do it is at the system level

## Tip 15: Paste from a Register without Leaving Insert Mode

* Yank and put are usually used in Normal mode, but you may want to paste inside Insert mode
* Example text:
    
    ```
    Practical Vim, by Drew Neil
    Read Drew Neil's
    ```

* want to copy 'Practical Vim' off the first line and stick it on the end of the second
    1. Cursor starts at position 0,0
    1. `yt,` - yank to first `,`
    1. `jA<space>` - go down a line, go to EOL and enter Insert, type a space
    1. `<ctrl-r>0` - paste contents of buffer zero, remaining in Insert
    1. `.<Esc>` - type a period, go back to Normal mode
* General format is `<ctrl-r>{register}`
* It's useful for pasting a few words, but it inserts the text as if the characters are being typed one at a time, so you end up with a delay on large blocks of text, and it can play badly with `textwidth` and `autoindent`
* Instead, `<ctrl-r><ctrl-p>{register}` will insert text literally, though it may be easier to just drop to Normal and use a put command

## Tip 16: Do Back of the Envelope Calculations in Place

* The expression register lets you do calculations and insert the result into the document
* Most registers in Vim contain text as a string or as entire lines
* Delete and yank let you set the contents of a register
* Put lets you get the contents of a register and insert it
* The expression register evaluates Vim script and returns the result
* It's addressed via `=`
* From Insert mode you can use it via `<ctrl-r>=`, which opens a prompt at the bottom of the screen
* You then give it a `<CR>` and it'll insert the result at the cursor position
* So to add a total:
    * type `6 x 35 = `
    * `<ctrl-r>=` - opens expression register
    * `6*35<CR>` - inserts `210` at cursor

## Tip 17: Insert Unusual Characters by Character Code



# 4. Visual Mode

# 5. Command-Line Mode

# Part 2: Files

# 6. Manage Multiple Files

## Tip 37: Track Open Files with the Buffer List

* You can have multiple files available for editing at one time
* When you're working, you're not editing a 'file' but instead a 'buffer', which is an in-memory representation of a file that diverges as you edit, and then you dump those contents to the file on disk when you write it
* Most commands operate on buffers, but some operate on files:
    * `:write`
    * `:update`
    * `:saveas`
* You can open multiple files with shell globs or by listing them out as args
* Example: `touch a.txt b.txt;vim *.txt`
* You'll enter the first file's buffer, but you can see the other buffer(s) with `:ls`, which displays

    ```
    :ls
      1 %a   "a.txt"                        line 1                       
      2      "b.txt"                        line 0
    Press ENTER or type command to continue
    ```

* `%` indicates currently visible buffer
* If you issue `:bnext` you'll be moved to the next buffer, and `:ls` shows:

    ```
    :ls
      1 #    "a.txt"                        line 1                       
      2 %a   "b.txt"                        line 1
    Press ENTER or type command to continue
    ```

* `#` represents the alternate file
* You can switch between current and alternate with `<ctrl-^>` (doesn't work for me, but `b#` does)
* You can traverse the buffer list with
    * `bnext`
    * `bprev`
    * `bfirst`
    * `blast`
* Author suggest's Tim Pope's `unimpaired.vim` plugin, which does

    ```Vim
    nnoremap <silent> [b :bprevious<CR>
    nnoremap <silent> ]b :bnext<CR>
    nnoremap <silent> [B :bfirst<CR>
    nnoremap <silent> ]B :blast<CR>
    ```

* Each buffer is assigned a number on creation
* You can jump to a buffer with `:buffer N`
* You can also move with `:buffer {bufname}` with a unique prefix of the filepath in the buffer
* The `:bufdo` command lets you execute an Ex command in all buffers listed by `:ls`
* In practice the author prefers `:argdo` instead
* Every time you open a new file, Vim creates a new buffer
* If you want to delete a buffer, you can do either of
    * `:bdelete N1 N2 N3`
    * `N,M bdelete`
* Deleting a buffer has no effect on the associated file, it just removes the in memory buffer
* Note that `:5,10bd` would delete five through 10 inclusive, skipping one would require `:bd 5 6 7 9 10`
* Unless you have a good reason to delete a buffer, probably just don't
* Don't attempt to organize the buffer list, it's cumbersome. Use splits, tab pages, or the arg list.

## Tip 38: Group Buffers into a Collection with the Argument List

* You can use the arg list, which is easy to manage, to group files for easy navigation
* You can also run an Ex command on all files in a group with `:argdo`
* The argument list is visible with `:args`
* It represents the argument list passed to the `vim` executable, and includes the expansion of shell globs
* The active file in the list is bracketed
* It was a feature of `vi` before `vim`, whereas the buffer list is `vim` only
* You can change the argument list contents at any time, so the value of `:args` doesn't necesarily reflect what was originally passed
* When you run `:args` without arguments, it prints its contents--you can set it with `:args {arglist}`, which can include filenames, wildcards, or output of a shell command
* You can specify by glob, like `:args **/*.js **/*.css`
* You could also have a list of filenames in a text file, and do ``:args `cat .chapters` ``
* The buffer list can be messy, the argument list can be cleared and recreated quickly and easily.
* You can traverse the arglist with `:next` and `:prev`
* You can use `:argdo` to do something to every buffer in the arglist set

## Tip 39: Manage Hidden Files

* When a buffer is modified, it's treated specially so you don't quit without saving
* This lets you hide a modified buffer and handle hidden buffers on quit
* In the `:ls` list, a modified buffer is annotated with a `+`
* Switching to the next buffer from a modified buffer will show 'No write since last change'
* Adding a bang to the command like `:bnext!` overrides and forces the change
* The output of `:ls` now annotates the modified buffer with `h` for 'hidden'
* You can move around while a buffer is hidden, but vim will error on quit
* It will load the first hidden buffer with modifications into the current window
* Using `:write` or `:w` will write changes to disk
* Using `:edit!` will reread the file from disk and discard the buffer contents
* If you want to quit without examining hidden buffers, use `:qall!`
* To write all buffers, use `:wall`
* Summary:
    * `:w[rite]` - write buffer contents to disk
    * `:e[dit]!` - read file from disk into buffer (revert changes)
    * `qa[ll]!` - close all windows, discard changes without warning
    * `wa[ll]` - write all modified buffers to disk
* By default Vim prevents leaving a modified buffer with `:next`, `:bnext` etc.
* That's useful but occasionally annoying, if you're using `:argdo`, `:bufdo`, `:cfdo`
* Since `:argdo {cmd}` essentially does `:first<CR>:{cmd}<CR>:next<CR>...`, if `cmd` modifies the first buffer then the implicit `:next` will fail with a warning because vim won't let you leave the modified first buffer until you save.
* If you enable the `hidden` setting, you can use the navigation commands without a trailing bang character

## Tip 40: Divide Your Workspace into Split Windows



# 7. Open Files and Save Them to Disk

# Part 3: Getting Around Faster

# 8. Navigate Inside Files with Motions

# 9. Navigate Between Files with Jumps

# Part 4: Registers

# 10. Copy and Paste

# 11. Macros

# Part 5: Patterns

# 12. Matching Patterns and Literals

# 13. Search

# 14. Substitution

# 15. Global Commands

# Part 6: Tools

# 16. Index and Navigate Source Code with ctags

# 17. Compile Code and Navigate Errors with the Quickfix List

# 18. Search Project-wide with grep, vimgrep, and Others

# 19. Dial X for Autocompletion

# 20. Find and Fix Typos with Vim's Spell Checker
