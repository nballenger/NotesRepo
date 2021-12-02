# Notes on tmux 2

By Brian P. Hogan; Pragmatic Bookshelf, Nov. 2016; ISBN 9781680502213

# Chapter 1: Learning the Basics

* Installs as a package
* Start up with `tmux` to enter a session
* Exit the session with `exit`
* You should create named sessions with `tmux new-session -s somename`
* Alternatively `tmux new -s somename`
* There's a command prefix to issue commands to tmux rather than have the shell interpret them--use `ctrl-b` to set the mode to command tmux
* `ctrl-b t` for instance brings up a large clock
* You can detach and reattach to a running session
* `ctrl-b d` detaches from a running session
* `tmux ls` shows currently running sessions when executed from the shell
* reattach with `tmux attach -t somename`
* Kill a running session with `tmux kill-session -t somename`
* You can run multiple commands in a session via separate 'windows'
* New session with a named initial: `tmux new -s twowindows -n shell`
* `ctrl-b c` creates a new window in the current session
* moving between windows:
    * `ctrl-b n` - next
    * `ctrl-b p` - previous
    * `ctrl-b 0` - go to window 0 (by number)
    * `ctrl-b w` - show visual menu of windows
    * `ctrl-b f` - find window with a string of text
* close a window with `exit` or `ctrl-b &`, which asks for confirmation
* Splitting:
    * `ctrl-b %` - vertical split
    * `ctrl-b "` - horizontal split
    * `ctrl-b o` - cycle through panes
    * `ctrl-b [up|down|left|right] arrow` - move around panes
* You can resize pains, but the normal keybindings kind of suck
* There are default pane layouts:
    * `even-horizontal` - stacks panes horizontally, left to right
    * `even-vertical` - stacks vertically, top to bottom
    * `main-horizontal` makes one big one on top, smaller ones beneath
    * `main-vertical` makes a big one at left, smaller ones at right
    * `tiled` arranges all panes evenly
    * `ctrl-b <SPACE>` cyles layouts
* You can close panes by exiting them, or `ctrl-b x` to confirm kill
* Command Mode lets you execute multiple tmux commands from the command area of the status line. You enter it with `ctrl-b :`
* You can issue a command like `new-window -n console`, which lets you name it at create time, rather than in separate steps
* You can also create a named window that launches a process: `new-window -n processes "top"`
* Note that if you then exit `top` with `q` that window closes as well
* Note that you can get a list of predefined tmux keybinds with `ctrl-b ?`

# Chapter 2: Configuring tmux

* Two conf locations, `/etc/tmux.conf` and `~/.tmux.conf`

## Defining an Easier Prefix


