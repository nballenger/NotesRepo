# Notes on Beginning PyQT: A Hands-on Approach to GUI Programming

By Joshua M. Willman; Apress, May 2020; ISBN 9781484258576

# Chapter 1: Charting the Course

# Chapter 2: Getting Started with PyQt

## Project 2.1 - User Profile GUI

For the project, you will:

1. Create an empty window in PyQt and find out
    1. About the basic classes and modules to set up a GUI
    1. How to modify window size and title
1. Learn about creating widgets
    1. Specifically `QLabel` to add text and images
    1. How to organize widgets in a window with `move()`

UI for the project has two parts:

1. Background image and profile image at top
1. User's name and info on the bottom (additional text can be broken down further)

### Create an Empty Window

* GUI app usually consists of a main window and optionally 1+ dialog boxes
* Main window can include menu bar, status bar, other widgets
* Dialogs made of buttons, communicates to users and prompts for input
* Code to create an empty GUI window:

# Chapter 3: Adding More Functionality to Interfaces

* GUIs are event driven
* Once `exec_()` is called, the app starts listening for events until it is closed
* PyQt does event handling with signals and slots
* Signal - event that occurs when a widget's state changes
* Slot - method executed in response to a signal
* Example: `button.clicked.connect(self.buttonClicked)` 
    * On button click, a `clicked()` signal is emitted
    * To use it, you have to `connect()` to a callable (here `buttonClicked()`, the slot)
* Many widgets have predefined signals and slots
