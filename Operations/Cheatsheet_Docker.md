# Docker Cheatsheet

## Notes

* A container is at the bottom of the hierarchy. Above that is a service, which defines how containers behave in production. At the top is the stack, defining the interactions of all the services
* If you need, say, a python runtime, you grab an image and your build will include your code, its dependencies, and the runtime, all defined by a Dockerfile.
* You create a Dockerfile, build against it to get an image, then run that image or ship it around
* "A registry is a collection of repositories, and a repository is a collection of images."
* In a distributed app, different pieces are 'services'. Services are really just 'containers in production.'
* A service only runs one image, but it codifies the way that image runs, what ports it should use, how many replicas of the container should run so the service has the capacity it needs, and so on.
* You write a docker-compose.yml file to define, run, and scale services in docker
* A single container running in a service is a 'task'
* Tasks have unique, incremented IDs, up to the number of replicas you defined in the compose file
* A swarm is a group of machines that are running docker and joined into a cluster.
* You continue to use the docker commands, but they are executed on a cluster by a 'swarm manager'
* Machines in a swarm can be physical or virtual
* Machines in a swarm are 'nodes'
* Swarm managers can use different strategies to run containers, like emptiest-node, which fills the least utilized machines, or global, which ensures each machine gets exactly one instance of the specified container
* Swarm managers are the only machines in a cluster that can execute your commands or authorize new nodes as workers
* Docker has a 'swarm mode' that enables the use of swarms.
* Turning swarm mode on instantly makes the machine a swarm manager
* If you run `docker swarm init` it enables swarm mode
* If you run `docker swarm join` on other machines you can have them join as workers
* A stack is a group of interrelated services that share dependencies, and can be orchestrated and scaled together
* A single stack can define and coordinate the functionality of an entire application
* 

## Glossary

container
network
swarm
manager
checkpoint
node
plugin
registry
secret
service
task
stack
orchestrator

## CLI Options

| Option | Definition |
| ------ | ---------- |
| `--config string` | Location of client config files, default `~/.docker` |
| `-D`, `--debug` | Enable debug mode |
| `-H`, `--host list` | Daemon socket(s) to connect to |
| `-l`, `--log-level string` | Set logging level (debug | info | warn | error | fatal), default info |
| `--tls` | Use TLS, implied by `--tlsverify` |
| `--tlscacert string` | Trust certs from this CA (default `~/.docker/ca.pem`) |
| `--tlscert string` | Path to TLS cert file (default `~/.docker/cert.pem`) |
| `--tlskey string` | Path to TLS key file (default `~/.docker/key.pem`) |
| `--tlsverify` | Use TLS and verify the remote |
| `-v`, `--version` | Version string and quit |

## Commands

### `attach` - Attach local STDIN/OUT/ERR to a running container

Usage: `docker attach [OPTIONS] CONTAINER`

| Option | Definition |
| ------ | ---------- |
| `--detach-keys string` | Override the key sequence for detaching a container |
| `--no-stdin` | Do not attach STDIN |
| `--sig-proxy` | Proxy all received signals to the process (default true) |

### `build` - Build an image from a dockerfile

Usage: `docker build [OPTIONS] PATH | URL | -`

### `commit`

### `cp`

### `create`

### `deploy`

### `diff`

### `events`

### `exec`

### `export`

### `history`

### `images`

### `import`

### `info`

### `inspect`

### `kill`

### `load`

### `login`

### `logout`

### `logs`

### `pause`

### `port`

### `ps`

### `pull`

### `push`

### `rename`

### `restart`

### `rm`

### `rmi`

### `run`

### `save`

### `search`

### `start`

### `stats`

### `stop`

### `tag`

### `top`

### `unpause`

### `update`

### `version`

### `wait`


## Management Commands

### `checkpoint` - Manage checkpoints

| Command | Definition |
| ------- | ---------- |
| `create` | Create a checkpoint from the running container |
| `ls` | List checkpoints for a container |
| `rm` | Remove a checkpoint 

### `config` - Manage docker configs

| Command | Definition |
| ------- | ---------- |
| `create` | Create a config from a file or STDIN |
| `inspect` | Display detailed info on one or more configs |
| `ls` | List configs |
| `rm` | Remove one or more configs |

### `container` - Manage containers

| Command | Definition |
| ------- | ---------- |
| `attach` | Attach local standard input, output, and error streams to a running container |
| `commit` | Create a new image from a container's changes |
| `cp` | Copy files/folders between a container and the local filesystem |
| `create` | Create a new container |
| `diff` | Inspect changes to files or directories on a container's filesystem |
| `exec` | Run a command in a running container |
| `export` | Export a container's filesystem as a tar archive |
| `inspect` | Display detailed information on one or more containers |
| `kill` | Kill one or more running containers |
| `logs` | Fetch the logs of a container |
| `ls` | List containers |
| `pause` | Pause all processes within one or more containers |
| `port` | List port mappings or a specific mapping for the container |
| `prune` | Remove all stopped containers |
| `rename` | Rename a container |
| `restart` | Restart one or more containers |
| `rm` | Remove one or more containers |
| `run` | Run a command in a new container |
| `start` | Start one or more stopped containers |
| `stats` | Display a live stream of container(s) resource usage statistics |
| `stop` | Stop one or more running containers |
| `top` | Display the running processes of a container |
| `unpause` | Unpause all processes within one or more containers |
| `update` | Update configuration of one or more containers |
| `wait` | Block until one or more containers stop, then print their exit codes |

### `image` - Manage images

| Command | Definition |
| ------- | ---------- |
| `build` | Build an image from a Dockerfile |
| `history` | Show the history of an image |
| `import` | Import the contents of a tarball to create a filesystem image |
| `inspect` | Display detailed info on one or more images |
| `load` | Load an image from a tar archive or STDIN |
| `ls` | List images |
| `prune` | Remove unused images |
| `pull` | Pull an image or a repo from a registry |
| `push` | Push an image or a repo to a registry |
| `rm` | Remove one or more images |
| `save` | Save one or more images to a tar archive (streamed to STDOUT by default) |
| `tag` | Create a tag TARGET\_IMAGE that refers to SOURCE\_IMAGE |

### `network` - Manage networks

| Command | Definition |
| ------- | ---------- |
| `connect` | Connect a container to a network |
| `create` | Create a network |
| `disconnect` | Disconnect a container from a network |
| `inspect` | Display detailed info on one or more networks |
| `ls` | List networks |
| `prune` | Remove all unused networks |
| `rm` | Remove one or more networks |

### `node` - Manage swarm nodes

| Command | Definition |
| ------- | ---------- |
| `demote` | Demote one or more nodes from manager in the swarm |
| `inspect` | Display detailed info on one or more nodes |
| `ls` | List nodes in the swarm |
| `promote` | Promote one or more nodes to manager in the swarm |
| `ps` | List tasks running on one or more nodes, defaults to current node |
| `rm` | Remove one or more nodes from the swarm |
| `update` | Update a node |

### `plugin` - Manage plugins

| Command | Definition |
| ------- | ---------- |
| `create` | Create a plugin from a rootfs and a configuration. Plugin data directory must contain config.json and rootfs directory. |
| `disable` | Disable a plugin |
| `enable` | Enable a plugin |
| `inspect` | Display detailed info on one or more plugins |
| `install` | Install a plugin |
| `ls` | List plugins |
| `push` | Push a plugin to a registry |
| `rm` | Remove one or more plugins |
| `set` | Change settings for a plugin |
| `upgrade` | Upgrade an existing plugin |

### `secret` - Manage docker secrets

| Command | Definition |
| ------- | ---------- |
| `create` | Create a secret from a file or STDIN as content |
| `inspect` | Display detailed info on one or more secrets |
| `ls` | List secrets |
| `rm` | Remove one or more secrets |

### `service` - Manage services

| Command | Definition |
| ------- | ---------- |
| `create` | Create a new service |
| `inspect` | Display detailed info on one or more services |
| `logs` | Fetch logs for a service or task |
| `ls` | List services |
| `ps` | List the tasks of one or more services |
| `rm` | Remove one or more services |
| `rollback` | Revert changes to a service's configuration |
| `scale` | Scale one or multiple replicated services |
| `update` | Update a service |

### `stack` - Manage stacks

Options:

| Option | Definition |
| ---- | --- |
| `--orchestrator string` | Orchestrator to use (swarm | kubernetes | all) |

Subcommands:

| Command | Definition |
| ------- | ---------- |
| `deploy` | Deploy a new stack or update an existing stack |
| `ls` | List stacks |
| `ps` | List the tasks in the stack |
| `rm` | Remove one or more stacks |
| `services` | List the services in the stack |

### `swarm` - Manages a swarm

| Command | Definition |
| ------- | ---------- |
| `ca` | Display and rotate the root CA |
| `init` | Initialize a swarm |
| `join` | Join a swarm as a node and/or manager |
| `join-token` | Manage join tokens |
| `leave` | Leave the swarm |
| `unlock` | Manage the unlock key |
| `update` | Update the swarm |

### `system` - Manages docker

| Command | Definition |
| ------- | ---------- |
| `df` | Show docker disk usage |
| `events` | Get real time events from the server |
| `info` | Display system-wide info |
| `prune` | Remove unused data |

### `trust` - Manage trust on docker images

Management subcommands:

| Command | Definition |
| ------- | ---------- |
| `key` | Manage keys for signing docker images |
| `signer` | Manage entities who can sign docker images |

Subcommands:

| Command | Definition |
| ------- | ---------- |
| `inspect` | Return low level info about keys and signatures |
| `revoke` | Remove trust for an image |
| `sign` | Sign an image |

### `volume` - Manage volumes

| Command | Definition |
| ------- | ---------- |
| `create` | Create a volume |
| `inspect` | Display detailed info on one or more volumes |
| `ls` | List volumes |
| `prune` | Remove all unused local volumes |
| `rm` | Remove one or more volumes |
