# Notes on HashiCorp Packer Documentation

From [https://www.packer.io/docs/index.html](https://www.packer.io/docs/index.html)

## Terminology

* **Artifacts** - results of a single build; usually a set of IDs or files to represent a machine image. Every builder produces a single artifact.
* **Builds** - A single task that eventually produces an image for a single platform. Multiple builds run in parallel.
* **Builders** - Component that can create a machine image for a single platform. They read configuration and use that to run and generate a machine image. Invoked as part of a build.
* **Commands** - Subcommands to `packer` executable that perform some function.
* **Post-processors** - Component that take the result of a builder or another post-processor and process that to create a new artifacts. Compression, uploading, etc.
* **Provisioners** - Component that installs and configures software within a running machine prior to that machine getting converted to a static image. 
* **Templates** - JSON files that define one or more builds by configuring Packer components.

## CLI Commands

* Run any command with `-h` to get the help
* Output is human readable by default, but Packer supports a fully machine readable output setting for automation
* The machine readable output is pipeline friendly
* To enable it, use the `-machine-readable` flag to any command. Output remains on STDOUT, logging if enabled goes to STDERR
* The flag is mutually exclusive with `-debug`
* Machine readable format is line oriented, comma-delimited text
* Format is: `timestamp,target,type,data...`
* Components of that:
    * `timestamp` - unix timestamp in UTC
    * `target` - can be empty or individual build names, normally empty when builds are in progress, and the build name when artifacts of particular builds are referred to
    * `type` - type of message, most commonly `ui` and `artifact`
    * `data` - zero or more comma separated values associated with the prior type. If it contains a comma, that's replaced with `%!(PACKER_COMMA)`. Newlines are replaced with their respective standard escape sequence. Newlines translate to literal `\n`, carriage returns to `\r`
* List of some types you may see in machine-readable output of `packer build`:
    * `ui` - data is a human readable string that would be sent to stdout in normal output mode. Data subtypes of the `ui` type:
        * `say` - would be bolded, normally for announcements about beginning new steps in the build process
        * `message` - most common, used for basic updates during build
        * `error` - errors
    * `artifact-count` - how many artifacts a build produced
    * `artifact` - info about what was created during build
* Data types from running `packer version`:
    * `version` - version of packer you're running
    * `version-prerelease` - `dev` if prerelease, blank otherwise
    * `version-commit` - git hash for the commit the branch of packer is currently on, mostly used by Packer developers
* The `packer` command has opt-in subcommand autocomplete
* To enable it, use `packer -autocomplete-install`

### build Command

* Takes a template and runs all builds in it to generate artifacts
* Builds are executed in parallel unless otherwise specified
* Artifacts are outputted at the end of the build
* Options
    * `-color=false` - disable color output
    * `-debug` - disable parallel builds, enable debug mode. Debug flags the builders to output debug info, with exact implementation left to the specific builder. In general, builders generally stop between each step and wait for keyboard input, allowing state inspection.
    * `-except=foo,bar,baz` - Run all builds and post-processors except those with the given names. Names are by default the type of the build or post-processor, unless a specific `name` attribute is given.
    * `-force` - forces a builder to run when artifacts from a previous build prevent a build from running. Exact behavior left to the builder. In general this will remove artifacts from the previous build.
    * `-on-error=[cleanup|abort|ask]` - what to do when the build fails
    * `-only=foo,bar,baz` - only run the builds with the given names
    * `-parallel=false` - deprecated, use `-parallel-builds=1` instead
    * `-parallel-builds=N` - limit number to run in parallel, 0 means no limit, which is the default
    * `-timestamp-ui` - enable prefixing of each ui output with a timestamp
    * `-var` - set a variable in the packer template, may be used multiple times
    * `-var-file` - set template variables from a file

### console Command

* Lets you experiment with Packer variable interpolations
* You can access vars in the config you called the console with, or provide them when you call `console` with `-var` or `-var-file`
* REPL commands:
    * `help`
    * `exit`
    * `variables` - prints a list of all vars read into the console
* Usage:

    ```json
    "variables": { "myvar": "asdfasdf" }
    ```

    ```
    $ packer console example_template.json
    > {{user `myvar`}}
    > asdfasdf
    > {{user `myvar`}}-{{timestamp}}
    > asdfasdf-1559854396
    > exit
    $ echo {{timestamp}} | packer console
    1559855090
    ```

### fix Command

* Takes a template, finds backward incompatible parts of it, brings it up to date for the latest Packer version
* After updating Packer, run this to make sure your templates work
* Outputs the changed template, so do `packer fix old.json > new.json`
* If fixing doesn't work, it returns a non-zero status and errors on STDERR
* Full list of fixes it performs is in `packer fix -h`
* You can pass `-validate=false` to disable validation of the fixed template

### inspect Command

* Takes a template, outputs the various components a template defines.
* Lets you learn about a template without reading the JSON
* Very useful with machine readable output
* Doesn't validate the configuration of hte components, but will validate the syntax of the template.
* Usage:

    ```
    $ packer inspect template.json
    Variables and their defaults:

        aws_access_key = 
        aws_secret_key = 

    Builders:

        amazon-ebs
        amazon-instance
        virtualbox-iso

    Provisioners:

        shell
    ```

### validate Command

* Validates syntax and configuration of a template.
* `packer validate template_name.json`
* Options:
    * `-syntax-only` - no configuration validation
    * `-except=foo,bar,baz` - builds all builds and post-processors except those with the given names
    * `-only=foo,bar,baz`
    * `-var`
    * `-var-file`

## Templates

* JSON files that configure Packer components to create one or more machine images
* Portable, static, readable and writable by machine or human
* Passed to commands like `packer build`
* Template structure:
    * Overall it's a JSON object
    * The available keys are:
        * `builders` (required) - array of 1+ objects that defines the builders to use in creating the machine images for the template, and the configuration for those builders.
        * `description` (optional) - string with description, used as output only in the `inspect` command
        * `min_packer_version` (optional) - string with min version
        * `post-processors` (optional) - array of 1+ objects defining post-processing steps to take with built images
        * `provisioners` (optional) - array of 1+ objects with provisioners used to install and configure software for the machines created by the builders
        * `variables` (optional) - object of 1+ kv strings that define user variables in the template.
* Comments:
    * JSON has no native comments
    * You can prefix a root level key with an underscore

        ```
        {
            "_comment": "This is a comment",
            "builders": [
                {}
            ]
        }
        ``` 

    * Only root level keys may be underscore prefixed.

### Template Builders

* Builders are responsible for creating machines and generating images from them for various platforms.
* Specific configuration options differ by builder
* A single builder definition maps to exactly one build
* A builder definition is a JSON object requiring at least a `type` key
* The `type` is the name of the builder that will be used
* Each build has a name, by default just the name of the builder being used. If you want to specify a custom name, use the `name` key in the builder definition.
* Every build is associated with a single 'communicator.' Communicators establish a connection for provisioning a remote machine like an AWS instance or a local virtual machine.

### Template Communicators

* Mechanism by which Packer uploads files, executes scripts, etc with the machine being created.
* Configured in the template's `builder` section
* Currently there are three types:
    * `none` - none used, disallows most provisioners
    * `ssh` - SSH to the machine, typical default
    * `winrm` - WinRM connection
* Some builders have custom communicators, like docker
* To specify a communicator, set the `communicator` key in a builder object. You can then specify other config options for that communicator.
* SSH communicator options:
    * `ssh_agent_auth` (boolean) - if true, local SSH agent is used to auth
    * `ssh_bastion_agent_auth` (boolean) - if true, local ssh agent used to auth with the bastion host
    * `ssh_bastion_host` (string) - bastion host to connect to
    * `ssh_bastion_password` (string)
    * `ssh_bastion_port` (number)
    * `ssh_bastion_private_key_file` (string) - path to a PEM encoded private key file to auth to the bastion host with
    * `ssh_bastion_username` (string)
    * `ssh_clear_authorized_keys` (boolean) - if true, Packer attempts to remove its temp key from `~/.ssh/authorized_keys` and `/root/.ssh/authorized_keys`
    * `ssh_disable_agent_forwarding`
    * `ssh_file_transfer_method` (`scp` or `sftp`)
    * `ssh_handshake_attempts` (number)
    * `ssh_host` (string)
    * `ssh_keep_alive_interval` (string)
    * `ssh_password` (string)
    * `ssh_port` (number)
    * `ssh_private_key_file` (string)
    * `ssh_proxy_host`
    * `ssh_proxy_password`
    * `ssh_proxy_port`
    * `ssh_proxy_username`
    * `ssh_pty` (boolean) - if true, a PTY is requested for the SSH conn
    * `ssh_read_write_timeout`
    * `ssh_timeout`
    * `ssh_username`
* SSH Communicator details
    * Packer only uses one auth method, either `publickey` or password
    * Doesn't work if sshd is configured with more than one auth method
* Pausing before connecting
    * Recommend that you enable SSH or WinRM as the very last step in your guest's bootstrap script
    * If you have a race condition and need packer to wait before attempting to connect to the guest, you can use the template option `pause_before_connecting`:

        ```
        {
            "communicator": "ssh',
            "ssh_username": "myuser",
            "pause_before_connecting": "10m"
        }
        ```

### Template Engine

* All strings in templates are processed by a common templating engine, where variables and functions can be used to modify the value of a parameter at runtime.
* Syntax conventions:
    * Anything template related happens in double braces `{{ }}`
    * Functions are specified directly in braces `{{timestamp}}`
    * Template vars are prefixed with period and capitalized `{{.Variable}}`
* Functions perform operations on and within strings
* List of available functions:
    * `build_name` - name of build being run
    * `build_type` - type of builder in use
    * `env` - environment variables
    * `isotime [FORMAT]` - UTC time with format string
    * `lower` - lowercase the string
    * `pwd` - working directory while executing packer
    * `sed` - use a golang implementation of sed to parse input string
    * `split` - split an input string on a separator
    * `template_dir` - directory to template for the build
    * `timestamp` - current unix timestamp in UTC
    * `uuid` - random uuid
    * `upper` - uppercase the string
    * `user` - a user variable
    * `packer_version`
    * `clean_resource_name` - image names can only have certain characters and have a max length. This converts uppercases to lower and replaces illegal characters with a dash
* Template variables
    * Special vars automatically set at build time.
    * Some builders, provisioners, and other components have template variables only available for that component.
    * Prefixed by a period, start with uppercase: `{{ .Name }}`
    * Example of using the `shell` builder's template vars:

        ```
        {
            "provisioners": [
                {
                    "type": "shell",
                    "execute_command": "{{.Vars}} sudo -E -S bash '{{.Path}}'",
                    "scripts": [
                        "scripts/bootstrap.sh"
                    ]
                }
            ]
        }
        ```

* There are some specifics here for isotime, split, and sed. Not going to reproduce them.

### Template Post-processors

* For each post-processor definition, Packer takes the result of each of the defined builders and sends it through the postprocessors.
* Example: you have one post-processor and two builders defined in a template, so the postprocessor runs twice (once per builder) by default.
* Post-processor definition
    * A simple definition is just the name of the processor:

        ```
        {
            "post-processors": ["compress"]
        }
        ```

    * A detailed definition is a json object, with a type field and other keys

        ```
        {
            "post-processors": [
                {
                    "type": "compress",
                    "format": "tar.gz"
                }
            ]
        }
        ```

    * A sequence definition is a json array of other simple or detailed defs
    * The post-processors defined in the array are run in order, with the artifact of each feeding into the next
    * A sequence def may not contain another sequence def
    * Example of compress then upload:

        ```
        {
            "post-processors": [
                [
                    "compress",
                    { "type": "upload", "endpoint": "http://example.com" }
                ]
            ]
        }
        ```

* Input artifacts
    * When using post-processors, the input artifact from another builder or another post-processor, is discarded by default after the post-processor runs. Generallly you don't want the intermediate artifacts
    * If you do want to keep them:

        ```
        { 
            "post-processors": [
                {
                    "type": "compress",
                    "keep_input_artifact": true
                }
            ]
        }
        ```

* Run on specific builds
    * You can use `only` or `except` to run a post-processor only with specific builds:

        ```
        {
            "post-processors": [
                [
                    {
                        // can be skipped under 'packer build -except vbox'
                        "name": "vbox",
                        "type": "vagrant",
                        "only": ["virtualbox-iso"]
                    },
                    {
                        "type": "compress" // only executed when vbox is
                    }
                ],
                [
                    "compress", // runs even if vbox is skipped
                    {
                        "type": "upload",
                        "endpoint": "http://example.com"
                    }
                ]
            ]
        }
        ```

    * The values in `only` or `except` are build names, not builder types

### Template Provisioners

* In a template, the provisioners section has an array of all the provisioners Packer should use to install and configure software within running machines prior to converting them to machine images
* Provisioners are optional, though typically used.
* Provisioner defs are json objects with at least a `type`
* Example:

    ```
    {
        "type": "shell",
        "script": "script.sh"
    }
    ```

* Run on specific builds using `only` and `except`

    ```
    {
        "type": "shell",
        "script": "script.sh",
        "only": ["virtualbox-iso"]
    }
    ```

* Values passed to only/except are build names, not builder types.
* Values in except can also be post-processor names.
* Build-specific overrides
    * Goal of packer is to create identical machine images, but sometimes there are periods where the machines are different before converging to be identical
    * For that, different provisioner configurations may be required depending on the build, which can be done with build-specific overrides
    * Example: Building an EC2 AMI and a VMWare machine. The AMI may setup a user with admin privs by default, where the VMWare machine doesn't have the privs. In that case, the shell script may need to execute differently. 
    * The hope is that the shell script converges the images to be identical, but they may initially need to be run differently

        ```
        {
            "type": "shell",
            "script": "script.sh",
            "override": {
                "vmware-iso": {
                    "execute_command": "echo 'password' | sudo -S bash {{.Path}}"
                }
            }
        }
        ```

    * The name is a builder definition, the value is a json object containing the privisioner configuration, which is merged into the default config
* Pausing before running

    ```
    {
        "type": "shell",
        "script": "script.sh",
        "pause_before": "10s"
    }
    ```

* Timeout - every provisioner def can take a `timeout` config, which is the amount of time to wait before considering it to have failed. Has no effect in debug mode.

    ```
    {
        "type": "shell",
        "script": "script.sh",
        "timeout": "5m"
    }
    ```

### Template User Variables

* Let you modify templates with variables from the command line, env vars, Vault, or files
* To use one, you have to define it either in `variables` in the template, or via `-var` or `-var-file` flags
* Best to explicitly define it, even if you want a var to default to an empty string
* `variables` section is a KV map:

    ```
    {
        "variables": {
            "aws_secret_key": "",
            "aws_access_key": ""
        },

        "builders": [ {
            "type": "amazon-ebs",
            "access_key": "{{user `aws_access_key`}}",
            "secret_key": "{{user `aws_secret_key`}}",
            // ...
        }]
    }
    ```

* If the default is `null`, the value will be required for template validation
* Called with ``{{user `variable_name`}}``
* Can be used in any value but `type` in a template, anywhere outside the `variables` section
* Environment Variables
    * Can be used in a template via user variables
    * The `env` function is only available within the default value of a user variable, which lets you default to whatever is in the env, but give actual user input higher precedence

        ```
        { "variables": { "my_secret": "{{env `MY_SECRET_`}}" } }
        ```

    * You can't use `~` for a home var, because that's managed by shell expansion, not Packer
* Consul Keys
    * Consul keys can be used using the `consul_key` function
    * It's only available in the default of a user var

        ```
        { "variables": { "soft_versions": "{{consul_key `my_img/soft_versions/next` }}" } }
        ```

* Vault variables
    * You can use vault vars via `vault`, in default values of user vars
    * If you stored a secret with `kv put secret/hello foo=world`, you'd access it with

        ```
        { "variables": { "my_secret": "{{ vault_secret `/secret/data/hello` `foo`}}" } }
        ```

    * To use Vault you must set env vars `VAULT_TOKEN` and `VAULT_ADDR`
    * Full list of available env vars:
        * `VAULT_ADDR`
        * `VAULT_AGENT_ADDR`
        * `VAULT_CACERT`
        * `VAULT_CAPATH`
        * `VAULT_CLIENT_CERT`
        * `VAULT_CLIENT_KEY`
        * `VAULT_CLIENT_TIMEOUT`
        * `VAULT_SKIP_VERIFY`
        * `VAULT_NAMESPACE`
        * `VAULT_TLS_SERVER_NAME`
        * `VAULT_WRAP_TTL`
        * `VAULT_MAX_RETRIES`
        * `VAULT_TOKEN`
        * `VAULT_MFA`
        * `VAULT_RATE_LIMIT`
* You can use template vars for array values:

    ```
    {
        "variables": {
            "destination_regions": "us-west-1,us-west-2"
        },
        "builders": [
            {
                "ami_name": "packer-qs-{{timestamp}}",
                "instance_type": "t2.micro",
                "region": "us-east-1",
                "source_ami_filter": {
                    "filters": {
                        "name": "*ubuntu-xenial-16.04-amd64-server-*",
                        "root-device-type": "ebs",
                        "virtualization-type": "hvm"
                    },
                    "most_recent": true,
                    "owners": [
                        "099720109477"
                    ]
                },
                "ami_regions": "{{user `destination_regions`}}",
                "ssh_username": "ubuntu",
                "type": "amazon-ebs"
            }
        ]
    }
    ```

* Setting variables
    * via CLI: `packer build -var 'aws_access_key=foo' template.json`
    * via var file: `packer build -var-file=vars.json template.json`
    * You can mix `-var` and `-var-file` flags. Later assignments take precedence.
* Sensitive variables can be unlogged by adding them to the `sensitive_variables` list in the template, which is an array of var names.

## Builders

### Amazon AMI Builder

* Has multiple builders depending on the strategy you want to use. Supported builders:
    * `amazon-ebs` - Create EBS-backed AMIs by launching a source AMI and repackaging it into a new AMI after provisioning. Easiest to get started with.
    * `amazon-instance` - Create instance-store AMIs by launching and provisioning a source instance, then rebundling it and uploading to S3
    * `amazon-chroot` - Create EBS backed AMIs from an existing EC2 instance by mounting the root device and using a Chroot environment to provision it. Advanced, should not be used by newcomers, but also fastest.
    * `amazon-ebssurrogate` - 

### Docker Builder

* Builds images using Docker. Starts a docker container, runs provisioners within it, then exports the container for reuse or commits the image.
* Builds docker containers without using dockerfiles, which lets it provision containers that are not tied to docker in any way. You provision containers the same way you provision a normal virtualized or dedicated server.
* Must run on a machine with Docker Engine. Does not support running on a Docker remote host.
* Basic example: Exporting / repackaging an image:
    
    ```
    {
        "type": "docker",
        "image": "ubuntu",
        "export_path": "image.tar"
    }
    ```

* Basic example: Commit. Instead of exporting, commits the container to an image

    ```
    {
        "type": "docker",
        "image": "ubuntu",
        "commit": true
    }
    ```

* Basic example: changes to metadata. Uses the `changes` argument of the builder. Lets the source image's metadata be changed when committed back into the docker environment. Derived from `docker commit --change` CLI option

    ```
    {
        "type": "docker",
        "image": "ubuntu",
        "commit": true,
        "changes": [
            "USER www-data",
            "WORKDIR /var/www",
            "ENV HOSTNAME www.example.com",
            "VOLUME /test1 /test2",
            "EXPOSE 80 443",
            "LABEL version=1.0",
            "ONBUILD RUN date",
            "CMD [\"nginx\", \"-g\", \"daemon off;\"]",
            "ENTRYPOINT /var/www/start.sh"
        ]
    }
    ```


