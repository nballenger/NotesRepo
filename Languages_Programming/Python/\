# Notes on pdb, the python debugger

From [https://docs.python.org/3/library/pdb.html](https://docs.python.org/3/library/pdb.html)

* pdb supports:
    * setting conditional breakpoints
    * single stepping at the source line level
    * inspection of stack frames
    * source code listing
    * evaluation of arbitrary Python code in the context of any stack frame
* It's extensible, and is defined as the class `Pdb`
* Typical usage:

    ```Python
    >>> import pdb
    >>> import mymodule
    >>> pdb.run('mymodule.test()')
    ```

* Can be invoked as a script to debug other scripts: `python3 -m pdb myscript.py`
* Automatically enters post-mortem debugging if the program being debugged exits abnormally
* After that (or normal exit), pdb restarts the program
* Auto restart preserves pdb's state (like breakpoints) and in most cases is more useful than quitting the debugger on exit.
* Typical usage to break into the debugger from a running program is to insert

    ```Python
    import pdb; pdb.set_trace()
    ```

* That should go at the place you want to break into the debugger
* From there you can step through the code following the statement, and continue running without the debugger using `continue`
* Usage to inspect a crashed program:

    ```Python
    >>> import pdb
    >>> import mymodule
    >>> mymodule.test()
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "./mymodule.py", line 4, in test
        test2()
      File "./mymodule.py", line 3, in test2
        print(spam)
    NameError: spam
    >>> pdb.pm()
    > ./mymodule.py(3)test2()
    -> print(spam)
    (Pdb)
    ```

## Functions the module defines

Each of these enter the debugger in a slightly different way:

* `pdb.run(statement, globals=None, locals=None)`
    * Executes the statement (string or code object) under debugger control.
    * Prompt appears before any code is executed, you can set breakpoints and type `continue` or you can step through the statement using `step` or `next`
    * `globals` and `locals` specify the environment in which the code is executed
    * By default the dict of the module `__main__` is used.
* `pdb.runeval(expression, globals=None, locals=None)`
    * Evaluate expression under debugger control
    * When this returns, it returns the value of the expression
    * Otherwise similar to `run()`
* `pdb.runcall(function, *args, **kwds)`
    * Call the function with the given arguments.
    * When it returns, returns the value of the function call
    * Debugger prompt appears as soon as the function is entered.
* `pdb.set_trace(*, header=None)`
    * Enter the debugger at the calling stack frame.
    * Useful for hard coding a break point at a given point in a program.
    * If header is given, prints to the console just before debugging starts
* `pdb.post_mortem(traceback=None)`
    * Enter post-mortem debugging of the given traceback object.
    * If no traceback is given, uses the one of the exception currently being handled
* `pdb.pm()`
    * Enter post-mortem debugging of the traceback in `sys.last_traceback`

The `run*` and `set_trace` functions are aliases for instantiating `Pdb` and calling the method of the same name on that object.

## The Pdb Class

* `class pdb.Pdb(completekey='tab', stdin=None, stdout=None, skip=None, nosigint=False, readrc=True)`
* 
