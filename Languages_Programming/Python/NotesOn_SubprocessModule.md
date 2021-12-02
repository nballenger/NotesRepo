# Notes on the Python `subprocess` module

From https://docs.python.org/3/library/subprocess.html

Subprocess module lets you:

* Spawn new processes
* connect to their input/output/error pipes
* get back their return codoes

## Using the `subprocess` module

* Recommended approach is to use `subprocess.run()` for all cases it can handle, and the underlying `Popen` for things it can't.

### `subprocess.run`

* Signature:

    ```Python
    subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None,
                   capture_output=False, shell=False, cwd=None, timeout=None,
                   check=False, encoding=None, errors=None, text=None,
                   env=None, universal_newlines=None, **other_popen_kwargs)
    ```

* Runs the command described by `args`, waits for it to complete, returns a `CompletedProcess` instance
* Args above are most common, full signature is mostly the same as `Popen` constructor
* `timeout`, `input`, `check`, and `capture_output` are not passed through to `Popen`
* Parameters:
    * `capture_output` - if true, stdout and stderr are captured, and the internal `Popen` object is automatically created with `stdout=PIPE` and `stderr=PIPE`
    * You can't use `stdout` and `stderr` args at the same time as `capture_output`
    * If you want to capture and combine both streams into one, use `stdout=PIPE` adn `stderr=STDOUT` instead of using `capture_output`
    * `timeout` - passed to `Popen.communicate()`. If the timeout expires, the child process is killed and waited for. `TimeoutExpired` exception is re-raised after the child process is terminated.
    * `input` - passed to `Popen.communicate()` and to the subprocess's stdin. If used, must be a byte sequence, or a string if `encoding` or `errors` is specified, or `text` is true. When used, internal `Popen` object is created with `stdin=PIPE`, and `stdin` arg may not be used as well.
    * `check` - if true and hte process exits with a non-zero exit code, a `CalledProcessError` exception is raised. Attributes on that exception object hold the args, exit code, and stdout/stderr if they were captured
    * If `encoding` or `errors` are specified, or `text` is true, file objects for stdin, stdout, and stderr are opened in text mode using the specified `encoding` and `errors` or the `io.TextIOWrapper` default.
    * `universal_newlines` is equivalent to `text` and exists for backwards compatibility. By default file objects are opened in binary mode.
    * `env` - if not `None`, must be a mapping that defines the env vars for the new process, which are used instead of the default behavior of inheriting the current process's environment. Passed directly to `Popen`

### `subprocess.CompletedProcess`

* Return value of `run()`, represents a process that's finished
* Attributes of an instance:
    * `args` - args used to launch the process, list or string
    * `returncode` - exit status of the chold process. Negative value indicates child was terminated by signal, where `-N` is "terminated by signal `N`"
    * `stdout` - captured stdout from the child process, byte sequence or string if `run()` was called with an encoding, errors, or `text=True`, `None` if stdout was not captured
    * `stderr` - captured stderr, byte sequence or string if called with args, `None` if stderr was not captured
    * `check_returncode()` - if `returncode` is non-zero, raise `CalledProcessError`

### Constants

* `subprocess.DEVNULL` - can be used as `stdin`, `stdout`, `stderr` args
* `subprocess.PIPE` - can be used as `stdin`, `stdout`, `stderr`, indicates pipe to standard stream should be opened. Most useful with `Popen.communicate()`
* `subprocess.STDOUT` - can be used as arg to `stderr`, incidates stderr should go to same handle as stdout

### Exceptions

* `subprocess.SubprocessError` - base class
* `subprocess.TimeoutExpired` - raised when timeout expires waiting on child process
    * `cmd` - command used to spawn the child
    * `timeout` - in seconds
    * `output` - output of child process if captured by `run()` or `check_output()`, else `None`
    * `stdout` - alias for `output`
    * `stderr` - stderr output of child if captured by `run()`, else `None`
* `subprocess.CalledProcessError` - raised when a process run by `check_call()` or `check_output()` returns non-zero
    * `returncode` - exit status of child
    * `cmd` - cmd used to spawn
    * `output` - output if captured
    * `stdout` - alias for `output`
    * `stderr` - stderr output if captured

## Frequently Used Arguments

* `Popen` constructor and convenience functions accept a large number of optional arguments
* Most commonly needed args are:
    * `args`
        * requrired for all calls
        * should be a string or a sequence of program arguments
        * sequence is preferred since it lets the module deal with escaping and quoting args
        * if passing a string, either `shell` must be `True` or the string must simply name the program to execute
    * `stdin`, `stdout`, `stderr`
        * specify executed program's standard input, standard output, standard error file handles
        * Valid values are `PIPE`, `DEVNULL`, a file descriptor, file object, and `None`
        * `PIPE` indicates a new pipe to the child should be created
        * if `None`, no redirection occurs, child's file handles are inherited from parent
        * `stderr` can be `STDOUT` to push err to the same handle as out
        * if `encoding` or `errors` are specified or `text` is true, the file objects `stdin`, `stdout`, and `stderr` are opened in text mode using the `encoding` and `errors` specified in the call or the defaults for `io.TextIOWrapper`
        * For `stdin` line ending characters `'\n'` in the input are converted to the default line separator `os.linesep`
        * For `stdout` and `stderr` all line endings are converted to `'\n'`
        * If text mode is not used, handles opened as binary streams, and no encoding or line ending conversion is performed
    * `shell`
        * if true, command executed through the shell
        * Can be useful if you are using Python mostly for enhanced flow control over system shells, and you still want shell features like pipes, file globbing, env var expansion, etc.

## Popen Constructor

* Signature:

    ```Python
    subprocess.Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None,
                     stderr=None, preexec_fn=None, close_fds=True, shell=False,
                     cwd=None, env=None, universal_newlines=None, startupinfo=None,
                     creationflags=0, restore_signals=True, start_new_session=False,
                     pass_fds=(), *, group=None, extra_groups=None, user=None,
                     umask=-1, encoding=None, errors=None, text=None)
    ```

* Executes a child program in a new process.
* On POSIX uses `os.execvp()` like behavior to execute the child program
* Arguments:
    * `args`
        * sequence of program args or single string or path-like object
        * example: 

        
