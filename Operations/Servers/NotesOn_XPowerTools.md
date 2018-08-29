# Notes on X Power Tools

by Chris Tyler, O'Reilly Media, 2007

## Chapter 1: Introduction to the X Window System

### The X Window System

* X is a portable, network-based display system
* Programs can display anywhere on the network
* X is not a GUI, but provides a foundation for building one

### The History of X

* Came from MIT in '84, loosely based on W Window System from Stanford
* Version 11 released under MIT license in '87
* X Consortium formed to manage development
* X.org established by The Open Group in '99 to manage X
* Development moved to the XFree86 fork
* X.org Foundation formed in 2003-04

### The Renaissance: New X Versus Old X

* X from the early 90's was very different than now
* Two eras: '84-'96 and 2000-present (2007 is book pub date)
* **Fonts**
    * Old: bitmapped and scalable fonts, no anti-aliasing, rendered by server
    * New: scalable with full anti-aliasing, managed on client side
* **Desktop environments**
    * Old: No standard desktop environments
    * New: KDE and Gnome, plus a bunch of others
* **Toolkits and configuration**
    * Old: lots of Xt-based toolkits, all configured through 'resources'
    * New: Qt and GTK+ are biggest toolkits
* **Display hardware**
    * Old: Mostly 800x600, 256 color
    * New: 24-bit, 3D capabilities, hardware acceleration
* **Client appearance**
    * Old: Low resolution, high contrast
    * New: visual effects and lots of things to tweak

### X by Any Other Name

* Official names are X, X Window System, X Version 11, X Window System, Version 11, X11
* Sometimes called Xorg or X dot org

### Seven Layers of an X-based GUI

#### Two lower layers

* Network Transport layer: TCP/IP
* X Window Server: software managing the display, runs on computer connected to the display hardware

#### Five 'client' layers

* Display manager: allows graphical login
* Session manager: tracks application state across login sessions
* Window and compositing manager: manages window placement and decorations
* Desktop environment: one or more programs that create a desktop paradigm
* Application clients: programs that do user oriented work

#### Toolkits (not a layer per se)

* Toolkits are libraries like GTK, Qt, Motif that support writing client layers

### Where is the Server?

* In X terminology, the computer the user is sitting at runs the server, and the client programs are located on the remote host.
* Think in terms of the resource being served: a display server is located at the display hardware, like a file server is located where the files are.

### Why Windows Look and Act Differently

* Historically X was intended to allow building a GUI, but not restrict that process
* Look and feel was often up to app developers
* Toolkit developers have largely standardized look and feel options

### Toolkits and Desktop Environments

* Three main toolkits: GTK+ (C), Qt (C++), and Motif/OpenMotif (C, closed source)
* Gnome and Xfce are based on GTK+, KDE is based on Qt
* Running one does not preclude you running another

### The Role of Freedesktop.org

* Lots of other stuff to a desktop: sound, filesystem browsing, hardware discovery, etc.
* freedesktop.org was/is(?) a place for building consensus around desktop-oriented technologies

### Display Hardware

* Generally has zero or more pointing devices, zero or more keyboards, and one or more video cards connected to one or more monitors.

### Displays, Screens, and Xinerama

* 'display': in X, it's the user interface for one person
* A single display can actually have multiple video cards and monitors
* All of them can be combined to act like a giant monitor--this is called Xinerama, lets windows span monitors
* Alternately video cards and monitors can each be separate 'screens'
* A screen is individually addressable
* Each display, regardless of the number of screens involved, is managed by exactly one X server process.

### Display Specifications

* Displays can be anywhere on the network
* Addressing is in format ``host:display[.screen]``
* ``host`` is the DNS name or IP address of a host, blank or 'unix' for a local connection
* ``display`` is the display number, greater than or equal to zero
* ``screen`` is an optional screen number within the display, starting at zero
* Examples:
    * ``:0`` &mdash; display zero on local computer
    * ``localhost:3`` &mdash; display 3 on local computer, over TCP/IP
    * ``stealth.oreilly.net:2`` &mdash; display 2 on remote host
* You can pass a displayspec to clients as an option value: ``xclock -display localhost:3``
* You can set a default in the ``DISPLAY`` environment variable

### TCP/IP Ports

* Each X display uses a separate port
* All screens managed by one display are accessed through one port
* Standard port is 6000+display-number
* Since they're over 1024, you can open the ports as a non-root user

### Local Connection Mechanisms

* TCP/IP is overkill for localhost connections
* There are multiple other local connection schemes: Unix domain sockets, named pipes, Streams pipes
* Open source OS's use Unix domain sockets
* A displayspec with a blank host field will automatically detect the default local connection scheme
* Unix domain sockets for X are created in /tmp/.X11-unix

### Server Extensions

* X11 is enhanced via extensions to X
* Clients can query the server for available extensions
* Extensions can be compiled in or loaded as modules
* Key extensions in widespread use:
    * MIT-BIG-REQUESTS: allows requests over 256Kb
    * MIT-SHM: shared local memory
    * Composite: allows off screen rendering of windows, which are composited together into the final screen image
    * DAMAGE: informs a client when one part of the display has been updated
    * DPMS: allows power consumption reduction
    * GLX: OpenGL
    * LBX: low bandwidth X
    * MIT-SCREEN-SAVER: informs screensavers when to start/stop
    * RANDR: rotate and resize displays
    * RECORD: record X events
    * RENDER: digital image composition model
    * SECURITY: divides clients into 'trusted' and 'untrusted'
    * SHAPE: allows non rectangular windows like ``xeyes``
    * SYNC: lets you sync the X display with external events
    * XInputExtension: support for specialized input devices
    * XKEYBOARD: enables keyboard mapping/configuration
    * XTEST: performance benchmarking
    * XINERAMA: single-screen, multi-monitor support
    * XVideo: video streams
    * XVideo-MotionCompensation: hardware support for video decompression

### Where to Draw the Line: Kernel Versus User-Space Drivers

* OS kernel manages system hardware, user space programs access hardware only through the OS
* Except it's hard to make a user space program interface directly with the video card
* Most kernel/X server combinations let X have free reign over the video card
* May change in the future

## Chapter 2: Starting a Local X Server

### One Size Doesn't Fit All

* Common scenarios the chapter looks at:
    * Presenting a graphical login
    * Configuring a home system with two graphical logins so more than one person can use it
    * Starting X on a server only when needed to conserve resources
    * Starting an X server displayed within another X server
* Also looks at virtual terminals, mouse simulation, and terminating X

### Virtual Terminals

* A bunch of *nix kernels support virtual terminals/virtual consoles
* They virtualize multiple, independent video cards
* Lets there be multiple X and non-graphical sessions at once
* Switching virtual terminals in Linux is Ctrl-Alt-F1 through Ctrl-Alt-F12
* Non-X sessions can do next/previous with Alt-Left and Alt-Right
* By default linux distros boot with VT1-6 active and X on VT7

### Starting a Raw X Server Manually

* Executable for simplest startup is just ``X``
* Typically a symlink to either ``Xorg`` or ``XFree86``
* If X is running on display :0 you get an error because the network port is in use
* Starting X on a different display number: ``X :1``
* Requesting a specific VT: ``X :1 vt10``
* Specific config and layout: ``X :1 -config foo.conf -layout layoutName``
* If you start X that way, no clients are started, so you get a blank screen and mouse pointer
* Starting a client along with the server: ``X :1 -terminate & sleep 2; DISPLAY=:1 xterm``
* ``-terminate`` flag causes X to exit when last client disconnects, sleep makes sure it has boot time before client starts
* This won't start a window manager or desktop environment, so you won't be able to move/resize xterm, set keyboard focus, or start additional programs graphically

### Using a Display Manager to Start the X Server

* Display manager is graphical login program, configured to start one or more X servers and display login dialog
* After authenticating the display manager starts some clients like a session manager (which starts a window manager and desktop environment)
* Three main display managers are: GDM (GNOME, built on GTK), KDM (KDE, built on Qt), XDM (X Display Manager, built on Xt)

### Enabling or Disabling the Display Manager at Boot Time

* Edit ``/etc/inittab`` to set default run level
* If you boot to runlevel 5, display manager will start automatically
* To temporarily change when using GRUB, go into the boot menu, append ``3`` to end of kernel args
* Under LILO, access the ``LILO:`` prompt, type name of boot configuration to use, append 3 at the end
* On a booted system, you can change with ``init 3`` or ``telinit 3``
* If you boot into a non-X runlevel, you can start the display manager by name, like ``gdm``

### What Started the Display Manager?

* Some distros like Fedora have ``init`` start the display manager directly from ``/etc/inittab``
* It's something similar to ``x:5:respawn:/etc/X11/ prefdm -nodaemon``, which will start a display manager depending on what is in ``/etc/sysconfig/desktop``, or the first display manager in alphabetical order
* To load and test changes, kill the display manager and it will respawn.
* Specific commands to kill:
    * XDM or KDM: ``killall xdm``
    * GDM: ``killall gdm-binary`` or ``gdm-restart`` or ``gdm-safe-restart``
* In FreeBSD the display manager is configured from ``/etc/ttys``
* Some distros use startup scripts. SUSE uses ``/etc/rc.d/rc5.d/S17xdm``, which won't respawn when killed
* Restarting in that case requires ``/etc/X11/xdm restart`` or ``rcxdm restart`` (SUSE only)

### Starting Multiple X Servers Using a Display Manager

#### Starting Multiple X Servers Using XDM (or early versions of KDM)

* XDM and old KDM use ``/etc/X11/xdm/Xservers`` and ``/opt/kde3/share/config/kdm/Xservers`` to configure, respectively
* That file might have ``:0 local /usr/bin/X`` in it
* Adding additional X servers means adding lines to the bottom of that file, like ``:1 local /usr/bin/X :1 vt8``

#### Starting Multiple X Servers using KDM (KDE 3.4+)

* Config is in ``kdmrc``, at ``/etc/X11/xdm/kdmrc`` or ``/opt/kde3/share/config/kdm/kdmrc``
* You specify local displays by adding a ``StaticServers`` key like ``StaticServers=:0,:1,:2``

#### Starting Multiple X Servers Using GDM

* Two config files: one for defaults, one for local values
* Defaults: ``/etc/gdm/gdm.conf`` (Ubuntu), ``/usr/share/gdm/defaults.conf`` (Fedora)
* Local: ``/etc/gdm/gdm-custom.conf`` (Ubuntu), ``/etc/gdm/custom.conf`` (Fedora)
* Modify the local config file to start additional servers

### Starting Additional X Servers on Demand Using a Display Manager

* GDM: The utility ``gdmflexiserver`` talks to a running gdm process, tells it to spawn a new X server
* You have to have ``flexible=true`` in at least one GDM server conf file
* It can also start a nested X server (using Xnest) with the ``-n`` flag
* KDM: You need to edit the ``kdmrc`` file to specify 'ReserveServers'

### Starting an X Server with Clients Only When Needed

* Network servers mostly boot to runlevel 3
* The ``startx`` wrapper to ``xinit`` lets you spawn a new X server
* A double dash separates the client args from the X server options
* Ex: ``startx /usr/bin/xterm -bg yellow -geometry 180x50 -- :1 -config /etc/testconfig``
* Normally you use ``startx`` with no args, and it starts the clients in ``~/.xinitrc`` or ``/etc/X11/xinit/xinitrc``

### Switching VTs from the Shell Prompt

* Commands are ``switchto`` and ``chvt``

### Starting X Within X

* Xnest is an X server that does not drive a video card, instead displaying output in a window on another X server's display
* Starting it: ``Xnest :1``
* With a particular client, via startx: ``startx /usr/bin/startkde -- /usr/bin/Xnest :1``
* Since it doesn't interact with real hardware, you can set the screen size to an arbitrary value with ``-geometry``, or test multi-screen with ``-scrns``
* Starting with two 600x400 screens: ``Xnest -scrns 2 -geometry 600x400 :1``

### No Mouse!

* If you need to move the mouse cursor but you don't have a connected pointer device, you can use mouse keys
* Toggle is Shift-NumLock, which makes the keypad buttons perform mouse actions:
    * ``/`` &mdash; left mouse button
    * ``*`` &mdash; middle mouse button
    * ``-`` &mdash; right mouse button
    * ``5`` &mdash; button click
    * ``+`` &mdash; double click
    * ``0`` &mdash; hold button
    * ``.`` &mdash; release button
    * ``1,2,3,4,6,7,8,9`` &mdash; cardinal directions

### Bailing Out: Zapping X

* Bailing out uses Ctrl-Alt-Backspace, which immediately terminates the X server
* That will close client connections and most clients will subsequently self-terminate

### Terminating X Automatically

* When you start X with ``X -terminate`` it will terminate when the last client connection goes down.


## Chapter 3: Basic X.org Configuration

### What Is There to Configure?

* Conf files can manage keyboards, pointing devices, video cards, and monitors
* Most distros generate a basic config file that's pretty reasonable

### Why Only root Can Configure the X Server

* Because X has direct hardware access.
* Because you can seriously lock the system by screwing up X.

### Places Your Configuration Could Hide

* Conf file is probably called wither ``xorg.conf`` or ``XF86Config``
* Can be in any of 13 places:
    * ``/etc/X11/``
    * ``/usr/X11R6/etc/X11/``
    * ``/etc/X11/$XORGCONFIG``
    * ``/usr/X11R6/etc/X11/$XORGCONFIG``
    * ``/etc/X11/xorg.conf-4``
    * ``/etc/X11/xorg.conf``
    * ``/etc/xorg.conf``
    * ``/usr/X11R6/etc/X11/xorg.conf.hostname``
    * ``/usr/X11R6/etc/X11/xorg.conf-4``
    * ``/usr/X11R6/etc/X11/xorg.conf``
    * ``/usr/X11R6/lib/X11/xorg.conf.hostname``
    * ``/usr/X11R6/lib/X11/xorg.conf-4``
    * ``/usr/X11R6/lib/X11/xorg.conf``
* Standard for most systems is ``/etc/X11/xorg.conf``
* For XFree86:
    * CLI conf is ``-xf86config``
    * env var is ``$XF86CONFIG``
    * standard config is in ``/etc/X11/XF86Config``

### Let the X Server Configure Itself

* Calling ``X -configure`` will generate a basic config file
* You can specify a display number there if there's already an instance running on :0
* You can test a config file with ``X -config /path/to/config``

### The xorg.conf Configuration File

* Five basic sections, eight optional sections
* Basic ones:
    * ``ServerLayout`` &mdash; defines how screens/input devices are combined to form a display configuration
    * ``Screen`` &mdash; combines a video card (a ``Device``) and one ``Monitor`` to form a screen, defines color depth/resolution
    * ``Monitor`` &mdash; describes the monitor's capabilities
    * ``Device`` &mdash; configures the video card
    * ``InputDevice`` &mdash; config info for an input device
* Sample config file:

```
Section "ServerLayout"
    Identifier      "Default Layout"
    Screen      0   "Screen0"   0 0
    InputDevice     "Mouse0"    "CorePointer"
    InputDevice     "Keyboard0" "CoreKeyboard"
EndSection

Section "Screen"
    Identifier      "Screen0"
    Device          "Videocard0"
    Monitor         "Monitor0"
    DefaultDepth    24
    SubSection      "Display"
        Depth       8
        Modes       "1280x1024" "1024x768"  "800x600"
    EndSubSection
    SubSection      "Display"
        Depth       24
        Modes       "1280x1024" "1024x768"  "800x600"
    EndSubSection
EndSection

Section "Monitor"
    Identifier      "Monitor0"
EndSection

Section "Device"
    Identifier      "Videocard0"
    Driver          "nv"
EndSection

Section "InputDevice"
    Identifier      "Keyboard0"
    Driver          "keyboard"
EndSection

Section "InputDevice"
    Identifier      "Mouse0"
    Driver"         "mouse"
    Option "Device" "/dev/input/mice"
EndSection
```

### Optional Sections in the xorg.conf Configuration File

* Eight optional sections:
    * ``Extensions`` &mdash; options to enable/disable individual server extensions
    * ``Files`` &mdash; list of filenames and paths for the server to use. Most comman are ``FontPath`` and ``RGBPath``
    * ``ServerFlags`` &mdash; flags controlling overall server operation
    * ``Module`` &mdash; modules to load in addition to any device drivers
    * ``Mode`` or ``ModeLine`` &mdash; describes video modes in terms of scan rate, start/stop positions, and signal options
    * ``DRI`` &mdash; config for the 'Direct Render Interface' that shares 3D hardware access with applications.
    * ``VideoAdaptor`` &mash; configures video streams for the Xv extension
    * ``Vendor`` &mdash; vendor specific config info, rarely used

### Configuring the Pointer Device

* All USB mice are merged together under ``/dev/input/mice``
* A single USB mouse is ``/dev/input/mouse N`` starting at N=0

### Configuring a Two-Button Mouse

* In the InputDevice config section, add ``Option    "Emulate3Buttons" "On"``
* Lets you push both buttons to do a middle click.

### Configuring a Mouse with a Scrollwheel

* You have to configure X to translate scroll wheel motion into button clicks on mouse buttons 4 and 5
* Done with ``Option "ZAxisMapping" "4 5"``

### Configuring Video Card Driver Options

* There's a bunch of options. Yay.

### LightSteelBlue and Other Color Names

* The ``RGBPath`` entry in ``Files`` points to a file mapping color names to RGB triplets
* To access color names through X, use ``showrgb``

### Reading Server Log Files

* Typically in ``/var/log/Xorg.displaynumber.log``
* The level of log detail can be changed with ``-logverbose N`` where N is 0-9, default 3

### Configuring the Default Depth of a Screen

* Value is set with ``DefaultDepth`` in the ``Screen`` section
* Values are typically one of 4, 8, 16, 24, 48 (requires specialized equipment)

### Configuring the Resolution of a Screen

* You can have one ``Display`` section per color depth
* The ``Modes`` in those sections will let users change between them using hotkeys
* If you choose a lower than largest listed resolution, you get a virtual resolution and viewport, with mouse scrolling at the edges
* You can alternately specify a specific virtual screen size:

```
SubSection "Display"
    Depth 24
    Modes       "1280x1024" "800x600"
    Virtual     2048    1536
    Viewport    0       0
EndSubSection
```

* ``Viewport`` specifies the starting point of the upper-left corner of the physical screen within the virtual screen. Default is the center.

## Chapter 4: Advanced X.org Configuration

* Nothing here I need to know any time soon.

## Chapter 5: Using the X Server

### Interacting with the X Server

* Some keystrokes are recognized by the X server itself, though most of your interaction is with client programs

### Changing Resolution On the Fly

* Forward: Ctrl-Alt-Plus (keypad)
* Backward: Ctrl-Alt-Minus (keypad)
* You can disable this with ``Option "DontZoom"`` in the ``ServerLayout`` entry

### Changing the Resolution and the Screen Size Dynamically

* The Rotate and Resize (RANDR) extension lets you change the screen resolution and virtual screen size dynamically
* Clients can use RANDR to request notification of changes in screen geometry
* You need a special client to signal the server to change resolution
* CLI client is ``xrandr``, call it with no args to see available resolutions
* To change, use ``-s`` with a size code from the first column of output
* To change orientation use ``-o orientation``, which is one of normal, left, inverted, right
* To change refresh rate use ``-r``
* KDE has the ``krandr`` applet that lets you do this stuff from the menu bar, Gnome has ``gnome-display-properties``

### Using the Middle Mouse Button

* Blah blah, use the middle mouse button to do stuff.

### Using the Clipboard

* Ctrl-C, Ctrl-X, Ctrl-V
* Data is kept by the client that performed the cut or copy operation
* Clipboard contents are advertised to other clients through the X server
* Additional programs can request it from the first client through X
* Available clipboard managers: ``xclipboard``, Klipper (KDE), Gnome-clipboard-manager

### Keyboard Focus

* Window manager can choose between click to focus and focus follows pointer.
* Focus follows pointer is the default when no window manager is active.

### Keyboard and Mouse Grabs

* Instead of using focus to get data from the keyboard, application can grab the keyboard and get all keystrokes typed
* Can also be done with the mouse
* Used for menus--you click, the menu grabs mouse focus so nothing else can be clicked, you click outside the menu and it releases focus so your next click works anywhere.
* You can deactivate grabs in the server config

## Chapter 6: X Utility Programs

### The Unused Toolbox

* Standard X distro has a bunch of CLI utilities
* Utilities from X.org include:
    * ``xev`` &mdash; tests input events
    * ``xkbsetmap`` &mdash; sets the keymap
    * ``xlsfonts``, ``xfontsel``, ``mkfontdir``, ``mkfontscale`` &mdash; dealing with old style fonts
    * ``x11perf``, ``x11perfcomp``, ``xmark`` &mdash; benchmarking and testing
    * ``xsm`` &mdash; session management
    * ``glxinfo``, ``xtrapinfo``, ``xvinfo`` &mdash; get info about extensions

### Determine the Display Configuration

* ``xdpyinfo`` is an X client that gets info about the display, prints to stdout
* must be run from a terminal program or have output redirected

### Getting Window Information

* ``xwininfo`` without args will let you select a window and get info about it
* ``xwininfo -root`` tells you about the root window of a screen
* ``xwininfo -children`` gives info about child windows, ``-tree`` recursively displays children and descendants
* ``xwininfo -root -tree`` gives info about all windows on the screen

### Viewing Server Settings

* ``xset`` lets you view and change server settings
* ``xset q`` runs a query, returns current settings
* The stuff that ``xset`` shows you can be changed, the stuff ``xdpyinfo`` shows is immutable

### Control that Bell!

* Set the bell: ``xset b volume pitch duration`` where volume is 0-100, pitch is in hz, duration is in ms
* Turn it off: ``xset b off``

### Adjusting the Keyboard Repeat Rate

* ``xset r off`` turns repeat off
* ``xset r 65`` turns it on for just the spacebar
* ``xset r rate 1000 10`` sets it to repeat keys at the rate of 10 characters/second, starting 1s after a key is held down
* ``xset r rate`` resets to defaults

### Adjusting the Mouse Acceleration

* ``xset m 5 4`` sets acceleration of 5 and threshold of 4
* ``xset m`` resets to defaults

### Playing with the Lights

* In the input device section for the keyboard you have to list the leds you want to control with ``Options "Xleds" "1 2 3"``
* In modern xorg you can only control 3, which is scroll lock
* ``xset led`` turns them all on
* ``xset -led`` turns them all off
* ``xset led 3`` turns on led 3 (ScrollLock)
* ``xset -led 3`` turns off led 3

### Killing a Rogue Client

* ``xkill`` lets you kill an X client by clicking on it
* It doesn't kill the client per se, it kills the connection between client and server

### Examining Part of the Display In Detail

* ``xmag`` magnifies part of the display, displays the color code of selected pixels

### Script a Screen Dump

* ``xwd`` is x window dump
* Doing ``xwd>file`` and clicking a window will screenshot it to file
* You can get the whole screen with ``xwd -root > file``
* You can specify a window by id, which you can get from ``xwininfo``: ``xwd -idIDNumber > file``
* It outputs to a unique format. To see the captures, you have to use ``xwud`` (x window un-dump): ``xwud < file``
* The xwd image format can also be opened by Gimp, ImageMagick, and NetPBM
* Example of a script to periodically dump the screen:

```Shell
#!/bin/bash
# Produce a screen dump periodically, save as jpg

DELAY=5
DIR=/tmp/screen
I=0

mkdir -p ${DIR}

while sleep $DELAY
do
    xwd -root | xwdtopnm | cjpeg > ${DIR}/screendump.${I}.jpg
    ((I++))
done
```

### Preventing the Screen from Blanking During Presentations

* You can turn DPMS on and off: ``xset +dpms`` and ``xset -dpms``
* Or force it to go into ``on``, ``standby``, ``suspend``, or ``off``: ``xset dpms force standby``
* You can set it to come on after periods of inactivity: ``xset dpms 600 900 1200``, goes from on to standby, then suspend, then off at 10, 15, and 20 minutes.

### Eye Candy: xscreensaver

* Made up of four programs:
    * ``xscreensaver`` &mdash; server process, runs in bg until inactivity threshold is reached
    * ``xscreensaver-command`` &mdash; command oriented client for the server
    * ``xscreensaver-demo`` &mdash; interactive client for the server, to preview
    * graphics demos / hacks &mdash; interesting visual effects, live in ``/usr/share/xscreensaver``
* To use, turn on the server in the background: ``xscreensaver &``
* Config lives in ``~/.xscreensaver``
* You can control it with commands: ``xscreensaver-command -exit`` terminates server, ``-restart`` restarts it, ``-activate`` and ``-deactivate`` immediately enable and disable, and ``-watch`` prints screensaver events to the screen as they happen, which lets you (for instance) revert a kiosk to an initial state after inactivity

### Redrawing the Screen

* Use ``xrefresh``
* Has no effect on composited displays.

## Chapter 7: Running X Clients

### Running X Clients

* Chapter covers:
    * running clients in the background
    * requesting a certain window size and position
    * running nongraphical programs on an x display
    * stuff about displayspecs

### Background Operation

* Most X apps don't need to interact over STDIN and STDOUT, so you can start them with an ampersand to background them
* Backgrounded children of a window will be closed if the window closes, unless you use the ``nohup`` command: ``nohup kcalc &``

### Geometry

* Geometry in X is the size and position of windows
* Clients can request a geometry when placing a new window, though display manager can override
* Units vary by application. Term windows are text rows and cols, lots of things are in pixels, some are arbitrary units
* ``xwininfo`` gives info about a window's current geometry
* Geometric specifications are in the format ``WIDTHxHEIGHT XPOSITION YPOSITION``
* WIDTH and HEIGHT are in the increments used by the application
* XPOSITION and YPOSITION are the coordinates of the upper left corner of the window frame. If positive, it's relative to the upper left of the screen, if negative its relative to the lower right.
* You can get the unit of measure for size with ``xwininfo -size``

### Split Personality: Running Nongraphical Applications

* Lots of apps are purely text based, but some (like Pine) take over the entire terminal screen and send sequences of control characters to position text and control display attributes
* That's done via a ``curses`` library that abstracts on top of a bunch of different termtypes
* Full screen ('character') applications also control the serial line, which is whether characters typed are echoed back to the display or not. Those attributes are controlled via the OS's termios interface
* X server doesn't have a termios interface, and can't understand the control codes from curses
* To make character programs work with X, you have to use a two sided application that presents termios on one side and is an X client on the other side. it translates incoming X events (turning keypresses into ASCII sequences, etc) and must also emulate termios operations like echo management and translate curses code sequences into X protocol commands.
* Applications that do that are called "terminal emulators"
* ``xterm`` is the oldest, has been distributed with X11 since first release
* There's a number of other terminal emulators, and the desktop environments each have their own.
* Most of the terminal emulators in *nix understand the same codes as ``xterm``, so normally the ``TERM`` environment variable is set to ``xterm``
* Terminal emulators can be controlled by feeding them control character sequences. Setting the title of a window: ``echo -e "\033]0;My Window\007\c"``
* General format is ``ESC ] 0 ; text BEL``

## Chapter 8: Session Managers, Desktop Environments, and Window Managers

## Chapter 13: Remote Access

### Network Transparency

* Convention in the chapter is to call the computer on which the X server is running 'blue', and the computer on which the remote client is running 'red', with the machine name embedded into the shell prompt in the examples: ``blue$`` and ``red$``

### Displaying on a Remote Server

* To make an X client display on a remote server, use the displayspec to point to the desired server when starting the client
* Assuming the display :0 on blue and the client you want to run on red is ``xclock``, you would do turn off access control on blue with ``blue$ xhost +``, and start the client on red with ``red$ xclock -display blue:0``
