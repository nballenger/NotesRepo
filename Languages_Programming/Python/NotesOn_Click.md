# Notes on Click

From [https://click.palletsprojects.com/en/7.x/](https://click.palletsprojects.com/en/7.x/)

## Setuptools integration

`yourscript.py`: 

```python
import click

@click.command()
def cli():
    click.echo("Hello, world")
```

`setup.py`:

```python
from setuptools import setup

setup(name="yourscript",
      version="0.1",
      py_modules=["yourscript"],
      install_requires=["Click",],
      entry_points={ "console_scripts": ["yourscript=yourscript:cli"], })
```

## Parameters

* Two types: options and arguments
* Options are optional, arguments are not
* Option-only features:
    * auto prompting for missing input
    * act as flags
    * option values can be pulled from env vars (args cannot)
    * options are fully documented in the help
* Arguments can accept an arbitrary number of args

### Parameter types

* `str` / `click.STRING`
* `int` / `click.INT`
* `float` / `click.FLOAT`
* `bool` / `click.BOOL`
* `click.UUID`
* `class click.File(mode="r", encoding=None, errors="strict", lazy=None, atomic=False)`
    * declares a param to be a file for reading or writing
* `class click.Path(exists=False, file_okay=True, dir_okay=True, writable=False, readable=True, resolve_path=False, allow_dash=False, path_type=None)`
    * path is similar to File but does different checks
* `class click.Choice(choices, case_sensitive=True)`
    * lets you check against a fixed set of values (all strings)
    * only pass a list or tuple of choices, no other iterables
* `class click.IntRange(min=None, max=None, clamp=False)`
    * similar to `click.INT` but restricts to a range
* `class click.FloatRange(min=None, max=None, clamp=False)`
* `class click.DateTime(formats=None)`
    * converts date strings into datetime objects

### Parameter Names

* Both param types accept a number of positional args that are passed to the command function as parameters. Each string with a single dash is a short arg, each double dash is a long one.
* If a string is added with no dashes, it becomes the internal param name (and var name)
* If all names for a param include dashes, the internal name is generated automatically by taking the longest arg and converting dashes to underscores
* The internal name is converted to lowercase

### Implementing custom types

* You subclass `ParamType`
* You can invoke types with or without context and parameter object
* Example of an integer type that accepts hex and octal numbers:

    ```python
    import click

    class BasedIntParamType(click.ParamType):
        name = 'integer'

        def convert(self, value, param, ctx):
            try:
                if value[:2].lower() == '0x':
                    return int(value[2:], 16)
                elif value[:1] == '0':
                    return int(value, 8)
                return int(value,10)
            except ValueError:
                self.fail('%s is not a valid integer' % value, param, ctx)

    BASED_INT = BasedIntParamType()
    ```

## Options

* Use the `option()` decorator to add an option to a command

### Name your Options

* Refer to them implicitly via the longest option name converted to underscores/lowercase
* Or explicitly by giving one non-dash-prefixed argument

    ```python
    import click

    @click.command()
    @click.option("-s", "--string-to-echo")
    def echo(string_to_echo):
        click.echo(string_to_echo)

    @click.command()
    @click.option("-s", "--string-to-echo", "string")
    def echo_string(string):
        click.echo(string)
    ```

### Basic Value Options

* Most basic option is a "value option"
* These accept one arg which is a value
* If no type is provided, the type of the default value is used
* If no default, assumes STRING
* To make required, pass `required=True` to the decorator
* To show the default values when showing help, pass `show_default=True`

### Multi Value Options

* Options that take more than one argument
* For options, only a fixed number of args is supported, configurable by `nargs`

    ```python
    @click.command()
    @click.option("--pos", nargs=2, type=float)
    def findme(pos):
        click.echo("%s / %s" % pos)

    # cli usage: findme --pos 2.0 3.0
    # returns:   2.0 / 3.0
    ```

### Tuples as Multi Value Options

* If you use `nargs` set to a number, each item in the result tuple is the same type
* If you want mixed types, you specify a tuple as the type:

    ```python
    @click.command()
    @click.option("--item", type=(str, int))
    def putitem(item):
        click.echo("name=%s id=%d" % item)
    ```

### Multiple Options

* If you want to provide the param multiple times and have all values recorded, use the `multiple` flag

    ```python
    @click.command()
    @click.option("--message", "-m", multiple=True)
    def commit(message):
        click.echo("\n".join(message))

    # usage: commit -m foo -m bar
    ```

### Counting

* If you want to get a count of repeated flags (like `-vvv`)

    ```python
    @click.command()
    @click.option("-v", "--verbose", count=True)
    def log(verbose):
        click.echo("Verbosity: %s" % verbose)
    ```

### Boolean Flags

* If a slash is in an option string, click knows its a boolean flag and wants an enable and disable flag to be in there

    ```python
    import sys
    import click

    @click.command()
    @click.option("--shout/--no-shout", default=False)
    def info(shout):
        rv = sys.platform
        if shout:
            rv = rv.upper() + "!!!"
        click.echo(rv)

    # for no off switch, use @click.option("--shout", is_flag=True)
    ```

### Feature Switches

* Implemented by setting multiple options to the same parameter name and defining a flag value

    ```python
    import sys
    import click

    @click.command()
    @click.option("--upper", "transformation", flag_value="upper", default=True)
    @click.option("--lower", "transformation", flag_value="lower")
    def info(transformation):
        click.echo(getattr(sys.platform, transformation)())
    ```

### Choice Options

* If you want a param to be a choice from a list of values
* Can be instantiated with a list of valid choices

    ```python
    @click.command()
    @click.option("--hash-type", type=click.Choice(["md5", "sha1"])
    def digetst(hash_type):
        click.echo(hash_type)
    ```

### Prompting

* If you want params that can be given from the command line, but if not provided you ask for input

    ```python
    @click.command()
    @click.option("--name", prompt=True)
    def hello(name):
        click.echo("Hello, %s" % name)

    # for a custom prompt, use @click.option("--name", prompt="What is your name?")
    ```

### Password Prompts

```python
@click.command()
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
def encrypt(password):
    click.echo("Encrypting pw to %s" % password.encode("rot13"))
```

Since this is common, you can also just use `@click.password_option()`

### Dynamic Defaults for Prompts

* `auto_envvar_prefix` and `default_map` options for the context allow the program to read option values from the environment or a config file
* That will override the prompting mechanism
* If you want to let the user configure the default value, but still be prompted if the option isn't specified on the command line, you supply a callable as the default value

    ```python
    @click.command()
    @click.option("--username", prompt=True, default=lambda: os.environ.get("USER", ""))
    def hello(username):
        print("Hello,", username)

    # to describe the default in help text, pass `show_default="current_user"`
    ```

### Callbacks and Eager Options

* Sometimes you want a parameter to change the execution flow
* Like using `--version` to print version and exit
* For this you need two concepts:
    * eager parameters - parameter that is handed before others
    * a callback - what executes after the parameter is handled
* A callback is invoked with two parameters:
    * the current Context
    * the value
* The context gives features like quitting the app, and access to other processed params
* Example for a `--version` flag

    ```python
    def print_version(ctx, param, value):
        if not value or ctx.resilient_parsing:
            return
        click.echo("Version 1.0")
        ctx.exit()

    @click.command()
    @click.option("--version", is_flag=True, callback=print_version,
                  expose_value=False, is_eager=True)
    def hello():
        click.echo("Hello")
    ```

### Yes Parameters

* If you want to use a `-y` or `--yes` flag

    ```python
    def abort_if_false(ctx, param, value):
        if not value:
            ctx.abort()

    @click.command()
    @click.option("--yes", is_flag=True, callback=abort_if_false, expose_value=False,
                  prompt="Are you sure you want to drop the db?")
    def dropdb():
        click.echo("Dropped all tables")
    ```

* This is common, so you can use this:

    ```python
    @click.command()
    @click.confirmation_option(prompt="Are you sure?")
    def dropdb():
        print("dropped them")
    ```

### Values from Environment Variables

### Callbacks for Validation

```python
def validate_rolls(ctx, param, value):
    try:
        rolls, dice = map(int, value.split("d", 2))
        return (dice, rolls)
    except ValueError:
        raise click.Badparameter("rolls need to be in format NdM")

@click.command
@click.option("--rolls", callback=validate_rolls, default="1d6")
def roll(rolls):
    click.echo("Rolling a %d sided dice %d times" % rolls)
```

## Arguments

* Similar to options but positional
* Not auto documented

### Basic Arguments

* Most basic is a simple string argument of one value
* type is either passed, the type of the default, or STRING

```python
@click.command()
@click.argument("filename")
def touch(filename):
    click.echo(filename)
```

### Variadic Arguments

* Where a specific or unlimited number of args is accepted
* Can be controlled with `nargs`--if set to `-1`, unlimited args accepted
* Captured value is passed as a tuple
* Only one arg can be set to `-1`

```python
@click.command()
@click.argument("src", nargs=-1)
@click.argument("dst", nargs=1)
def copy(src, dst):
    for fn in src:
        click.echo("move %s to folder %s" % (fn, dst))
```

### File Arguments

```python
@click.command()
@click.argument("input", type=click.File("rb"))
@click.argument("output", type=click.File("wb"))
def input(input, output):
    while True:
        chunk = input.read(1024)
        if not chunk:
            break
        output.write(chunk)
```

## Commands and Groups

### Callback Invocation

* For a regular command, the callback is executed whenever the command runs
* If the script is the only command, it will always fire unless a parameter callback prevents it, as with `--help`
* It's different with groups and multi commands
* With these, the callback fires whenever a subcommand fires
* So an outer command runs when an inner command runs:

    ```python
    @click.group()
    @click.option("--debug/--no-debug", default=False)
    def cli(debug):
        click.echo("Debug mode is %s" % ("on" if debug else "off"))

    @cli.command()
    def sync():
        click.echo("Syncing")
    ```

* The usage for that would be `tool.py --debug sync`

### Passing Parameters

* Params are strictly separated between commands and subcommands
* Options and args for a specific command must be specified after that command and before any subcommand

### Nested Handling and Contexts

* In the above, the basic command group accepts a debug argument that is passed to its callback (the `cli` function), but not to the `sync` command, which only accepts its own arguments
* For one command to talk to another, it has to use the `Context`
* When a command is invoked, a new context is created and linked with the parent context
* Contexts are passed to parameter callbacks together with the value, automatically
* Commands can ask for the context to be passed by marking themselves with `@click.pass_context()`, and the context will be passed as the first argument
* The context can also carry a program specified object that can be used for the program's own purposes

    ```python
    @click.group()
    @click.option("--debug/--no-debug", default=False)
    @click.pass_context
    def cli(ctx, debug):
        # Ensure that ctx.obj exists and is a dict, in case cli() is called
        # by means other than the if block below
        ctx.ensure_object(dict)
        ctx.obj["DEBUG"] = debug

    @cli.command()
    @click.pass_context
    def sync(ctx):
        click.echo("Debug is %s" % (ctx.obj["DEBUG"] and "on" or "off"))
    ```

* If the object is provided, each context will pass the object onwards to its children, but at any level a context's object can be overridden
* To reach a parent, use `context.parent`

### Decorating Commands

* A decorator can change has a command is invoked
* What happens behind the scenes is that callbacks are always invoked through `Context.invoke()`, which automatically invokes a command correctly (by passing the context or not)
* This is useful if you need to write custom decorators
* Common pattern would be to configure an object representing state and store it on the context, and then to use a custom decorator to find the most recent object of this sort and pass it as the first argument

    ```python
    from functools import update_wrapper

    def pass_obj(f):
        @click.pass_context
        def new_func(ctx, *args, **kwargs):
            return ctx.invoke(f, ctx.obj, *args, **kwargs)
        return update_wrapper(new_func, f)
    ```

### Group Invocation without Command

* By default a group or multi is not invoked unless a subcommand is passed
* If you don't provide a command it automatically passes --help
* That can be changed by passing `invoke_without_command=True`
* In that case the callback always fires
* The context object also includes information about whether or not the invocation would go to a subcommand

```python
@click.group(invoke_without_subcommand=True)
@click.pass_context
def cli(ctx):
    if ctx.invoked_subcommand is None:
        click.echo("Invoked without subcommand")
    else:
        click.echo("About to invoke %s" % ctx.invoked_subcommand)

@cli.command()
def sync():
    click.echo("the subcommand")
```

### Custom multi commands

* IN addition to `click.group()` you can build custom multi commands
* Useful when you want to support commands being loaded lazily from plugins
* Just needs to implement a list and load method:

    ```python
    import click
    import os

    plugin_folder = os.path.join(os.path.dirname(__file__), "commands")

    class MyCLI(click.MultiCommand):
        def list_commands(self, ctx):
            rv = []
            for filename in os.listdir(plugin_folder):
                if filename.endswith(".py"):
                    rv.append(filename[:-3])
            rv.sort()
            return rv

        def get_command(self, ctx, name):
            ns = {}
            fn = os.path.join(plugin_folder, name + ".py")
            with open(fn) as f:
                code = compile(f.read(), fn, "exec")
                eval(code, ns, ns)
            return ns["cli"]

    cli = MyCLI(help="This tool's subcommands loaded dynamically.")

    if __name__ == "__main__":
        cli()
    ```

* You can also use these custom classes with decorators:

    ```python
    @click.command(cls=MyCLI)
    def cli():
        pass
    ```

### Merging Multi Commands

* You can merge multiple custom multi commands into one script
* Default implementation is the `CommandCollection` class
* It accepts a list of other multi commands and makes the commands available on the same level

    ```python
    import click

    @click.group()
    def cli1():
        pass

    @cli1.command()
    def cmd1():
        """ command on cli1 """

    @click.group()
    def cli2():
        pass

    @cli2.command()
    def cmd2():
        """ command on cli2 """

    cli = click.CommandCollection(sources=[cli1, cli2])

    if __name__ == "__main__":
        cli()
    ```

### Multi command chaining

* If you want to invoke more than one subcommand in a single run
* Example would be when you call `setup.py sdist bdist_wheel upload`, which runs those in sequence
* Passing `chain=True` to your multicommand will do this

    ```python
    @click.group(chain=True)
    def cli():
        pass

    @cli.command("sdist")
    def sdist():
        click.echo("sdist called")

    @cli.command("bdist_wheel")
    def bdist_wheel():
        click.echo("bdist_wheel called")
    ```

### Multi command pipelines

* Common usecase of multi command chaining is to have one command process the result of the previous command
* Most obvious way to do it would be to store a value on the context object and process it from function to function
* Another way is to setup pipelines by returning processing functions
* When a subcommand gets invoked it processes all its parameters and comes up with a plan of how to do its processing; then it returns a processing function
* The returned function is passed around via the chained multicommand and `MultiCommand.resultcallback()`

    ```python
    @click.group(chain=True, invoke_without_command=True)
    @click.option("-i", "--input", type=click.File("r"))
    def cli(input):
        pass

    @cli.resultcallback()
    def process_pipeline(processors, input):
        iterator = (x.rstrip("\r\n") for x in input)
        for processor in processors:
            iterator = processor(iterator)
        for item in iterator:
            click.echo(item)

    @cli.command("uppercase")
    def make_uppercase():
        def processor
    ```
