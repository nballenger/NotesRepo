# Notes on Hashicorp Consul

From [https://www.consul.io/docs/](https://www.consul.io/docs/)

## Install

* Use a binary or compile from source
* Compilation requires Go and git

    ```bash
    mkdir -p $GOPATH/src/github.com/hashicorp && cd $_
    git clone https://github.com/hashicorp/consul.git
    cd consul
    make tools
    make dev
    consul -v
    ```

### Required Ports

* Consul requires up to six different ports to work properly
* Ensure the following bind ports are accessible:
    * DNS server (TCP and UDP): 8600
    * HTTP API (TCP): 8500
    * HTTPS API (TCP): 8501
    * gRPC API: 8502
    * LAN Serf (TCP and UDP): 8301
    * Wan Serf (TCP and UDP): 8302
    * Server RPC adress (TCP): 8300
    * Sidecar Proxy min (inclusive min port number to use for automatically assigned sidecar service registrations): 21000
    * Sidecar Proxy max: 21255

#### Port Information

* DNS interface resolves DNS queries
* HTTP API is used by clients over HTTP
* HTTPS API is off by default, but 8501 is the conventional port
* gRPC API is off by default, only used to expose the xDS API to Envoy proxies
* Serf LAN - handles LAN gossip, required by all agents
* Serf WAN - gossip over the WAN, to other servers.
* Server RPC - used by servers to handle incoming requests from other agents

### Bootstrapping a Datacenter

* A agent can run in client or server mode.
* Server nodes are responsible for the consensus protocol, storing cluster state.
* Client nodes are mostly stateless, rely heavily on the server nodes.
* Before a consul cluster can begin to service requests, a server node must be elected leader. Bootstrapping is the process of joining the initial server nodes into a cluster.
* Recommended to have 3-5 servers per datacenter.
* Single server deployment is highly discouraged, as data loss is inevitable in a failure scenario.

#### Bootstrapping the Servers

## Internals

### Glossary

* **Agent** - long running daemon on every member of the cluster. Started with `consul agent`. May run in `server` or `client` modes. Since all nodes must be running an agent, it is simpler to refer to them as 'client' or 'server,' but they're all actually instances of the agent. All agents can run the DNS or HTTP interfaces, and are responsible for running checks and keeping services in sync.
* **Client** - agent that forwards all RPCs to a server. Basically stateless, only background activity is taking part in the LAN gossip pool.
* **Server** - agent with expanded responsibilities
* **Datacenter** - networking environment that is private, low latency, and high bandwidth. Excludes communication that would traverse the public internet, but multiple AZs in a single EC2 region would be one data center
* **Consensus** - agreement upon the elected leader, and agreement on the ordering of transactions.
* **Gossip** - Consul is built on Serf, which provides a gossip protocol used for numerous things.
* **LAN Gossip** - gossip pool of all nodes on the same LAN or datacenter
* **WAN Gossip** - WAN pool containing only servers, primarily in different datacenters
* **RPC** - remote procedure call

### 10,000 Foot View

* In datacenter one, six agent nodes, three client and three server
* Each participates in LAN gossip on 8301 TPC/UDP
* One server node is elected leader, and replicates to the other server nodes on TCP 8300
* The non-leader server nodes forward to the leader
* The client nodes talk to the server nodes over RPC on TCP 8300
* The non-leader server nodes talk over WAN gossip on TCP/UDP 8302 to the follower server nodes in datacenter two

