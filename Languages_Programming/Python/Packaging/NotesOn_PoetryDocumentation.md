# Notes on Documentation for Poetry

From https://python-poetry.org/docs/

## Basic Usage

From https://python-poetry.org/docs/basic-usage/

* Project setup: `poetry new poetry-demo`
* Initializing a pre-existing project: `cd whatever;poetry init`
* By default it creates a virtual env in `{cache-dir}/virtualenvs`

## Commands

* Global options
    * `--verbose (-v|vv|vvv)`
    * `--help (-h)`
    * `--quiet (-q)`
    * `--ansi` / `--no-ansi` - enforce / disable ansi output
    * `--version (-V)`
* `new` - set up a new directory with a project template
    * pass `--src` to use a src directory
* `init` - create a pyproject.toml file
    * `--name` - name of package
    * `--description`
    * `--author`
    * `--python` - compatible python versions
    * `--dependency` - package to require with a version constraint, `foo:1.0.0`
    * `--dev-dependency`
* `install` - reads `pyproject.toml`, resolves depedencies and installs
    * if a `poetry.lock` file is present, uses that, otherwise creates one
    * use `--no-dev` for no dev dependencies
    * use `--remove-untracked` to remove old dependencies not in the lock file
    * specify extras with `--extras foo`
    * by default poetry installs your project's package every time you run `install`
    * avoid that with `--no-root`
* `update` - get the latest dependency versions and update `poetry.lock`
    * name packages to just update those: `poetry update requests`
    * note that it won't upgrade outside version specifiers in `pyproject.toml`
    * `--dry-run` shows you changes but doesn't do them
    * `--no-dev` doesn't install dev deps
    * `--lock` - don't install, just update the lockfile
* `add` - adds required packages to `pyproject.toml` and installs them
    * you can specify constraints: `poetry add "pendulum>=2.0.5"`
    * adding a package already present gives an error unless a constraint is specified
    * to get the latest version of a present dep, use `poetry add foo@latest`
    * you can add git deps: `poetry add git+https://github.com/whatever/foo.git`
    * you can use a branch, tag, or rev name
    * `poetry add git+ssh://git@github.com/foo/bar.git#3.0.5`
    * or local `poetry add ./my-package/`
    * `poetry add ../my-package/dist/my-package.1.2.3.tar.gz`
    * to install in editable mode, specify in `pyproject.toml`:

        ```
        [tool.poetry.dependencies]
        my-package = {path = "../my/path", develop = true}
        ```

    * Specifying extras:

        ```
        poetry add requests[security,socks]
        poetry add "requests[security,socks]~=2.22.0"
        poetry add "git+https://github.com/pallets/flask.git@1.1.1[dotenv,dev]"
        ```

    * options
        * `--dev (-D)` - add package as dev dependency
        * `--path` - path to a dependency
        * `--optional` - add as optional dependency
        * `--dry-run` - output operations, don't execute
        * `--lock` - don't install, update lockfile
* `remove` - remove a package from current list of installed packages
    * `--dev (-D)` - remove from dev deps
    * `--dry-run`
* `show` - list all available packages
    * pass a package name to just see that one
    * `--no-dev` - don't list dev deps
    * `--tree` - show dependency tree
    * `--latest (-l)` - show latest version
    * `--outdated (-o)` - show latest version only for outdated packages
* `build` - build source and wheels
    * only pure python wheels are supported
    * `--format (-f) [wheel|sdist]` - limit to one or the other
* `publish` - publish the package to the remote repo
    * automatically registers the package before uploading if this is the first submit
    * pass `--build` to build first
    * `--repository (-r)` - repo to register to, default `pypi`
    * `--username (-u)` - username for repo
    * `--password (-p)` - password for repo
    * `--dry-run`
* `config` - edit config settings and repos
    * `poetry config --list`
    * usage: `poetry config [options] [setting-key] [setting-value1] [setting-valN]`
    * `--unset` removes the config element
    * `--list` shows all current config values
* `run` - executes a given command in the project's venv, or a script defined in pyproject.toml, as in `poetry run my-script` for the following

    ```
    [tool.poetry.scripts]
    my-script = "my_module:main"
    ```

* `shell` - spawn a shell within the venv
* `check` - validate the `pyproject.toml` file
* `search` - search for packages on a remote index
* `lock` - lock without install the dependencies in `pyproject.toml`
* `version` - show the project version, or bump the version and write the new one back to `pyproject.toml` if a valid bump rule is provided
* `export` - export lock file to other formats (only requirements.txt supported)
* `env` - regroups sub commands to interact with the virtualenvs associated with a specific project
* `cache` - regroups sub commands to interact with Poetry's cache
* `cache list` - lists Poetry's available caches

# Configuration

From https://python-poetry.org/docs/configuration/

* Default config file on mac is `~/Library/Application Support/pypoetry`
* On nix, it's `~/.config/pypoetry`
* You can have project specific settings by passing `--local` to `config`: `poetry config virtualenvs.create false --local`
* You can use env vars and not poetry config vars by prefixing an env var name with `POETRY_`
* Env var names translate to config names by uppercasing them and replacing dots and dashes with underscore:

    ```
    export POETRY_VIRTUALENVS_PATH=/path/to/venv/dir
    export POETRY_HTTP_BASIC_MY_REPOSITORY_PASSWORD=secret
    ```

## Available Settings

* `cache-dir` - string, path to the poetry cache dir
    * defaults to `~/Library/Caches/pypoetry` on mac
    * to `~/.cache/pypoetry` on nix
* `virtualenvs.create` - bool, default true, create a new venv is one doesn't exist
* `virtualenvs.in-project` - bool, default None, create venv in project root
* `virtualenvs.path` - string, dir where venvs will be created
    * defaults to `{cache-dir}/virtualenvs`
* `repositories.<name>` - string, set a new alternative repo
