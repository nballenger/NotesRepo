# Notes on Hashicorp's Vault

From [https://www.vaultproject.io/docs/](https://www.vaultproject.io/docs/)

## Installation

* Comes as a precompiled binary, or you can build it from source
* Compilation requires Go and git

    ```bash
    mkdir -p $GOPATH/src/github.com/hashicorp && cd $_
    git clone https://github.com/hashicorp/vault.git
    cd vault
    make bootstrap
    make dev
    vault -h
    ```

## Internals

### Architecture

* Glossary
    * **storage backend** - Durable storage for encrypted data. Provides only durability, not security.
    * **barrier** - crypto between vault and the storage backend
    * **secrets engine** - manages secrets. Some manage kv secrets, some support policies to dynamically generate a secret per query, which allows for fine grained revocation and policy updates.
    * **audit device** - responsible for managing audit logs. Every request/response with vault goes through the configured audit devices.
    * **auth method** - auth for users/applications connecting to vault. Once authenticated, the auth method returns the list of policies to apply. Vault returns a client token for future requests.
    * **client token** - also 'vault token', used for future request auth via HTTP headers
    * **secret** - anything returned by vault containing confidential or cryptographic material. Secrets always have an associated lease, and cannot be used indefinitely.
    * **server** - long running instance that provides the vault API, and manages interaction between all the secrets engines, ACL enforcement, and secret least revocation.

### High Level Overview

* HTTP/S API sits on the world facing side
* Storage backend sits behind Vault
* In between, inside the Barrier, are:
    * the Token Store
    * the Rollback Manager
    * the Policy Store
    * The Expiration Manager
    * An Audit Broker, which talks to one or more Audit Devices
    * the Vault Core, which handles app logic and Path Routing to
        * System Backends
        * Secret Engines
        * Auth Methods
* On start, the server must have knowledge of the backend storage, and be reachable on its API endpoints
* On start, Vault is in a 'sealed' state, and must be unsealed before any operation can be performed on it.
* Unsealing requires the unseal keys.
* When the vault is initialized, it generates an encryption key, which is protected by a master key. 
* The master key is protected by Shamir's secret sharing algorithm, which splits the master key into 5 shares, any 3 of which are required to reconstruct the master key.
* You can specify number of shares, min threshold for reconstruction
* You can also disalbe Shamir's technique, and use the master key directly for unsealing
* Once Vault retrieves the encryption key it can decrypt stuff from the storage backend and enter the unsealed state
* Once unsealed, Vault loads configured audit devices, auth methods, and secrets engines
* Config for those three things has to be stored in Vault since they're security sensitive. Only uses with correct perms should be able to edit, so they can't be stored outside the barrier.
* Once unsealed, requests can get from the HTTP API to the Core
* The Core manages request flow, enforces ACLS, and ensures audit logging happens
* When a client connects, it has to authenticate
* Auth can be configured to be multiple methods, some human friendly, some machine oriented.
* An auth request returns a list of policies associated with the authenticated user
* Policies are named ACL rules
* Vault operates only in whitelist mode, so unless access is explicitly granted by a policy, the action is not allowed.
* An action is allowed if any policy relevant to the auth'd user grants it
* Policies are stored/managed by an internal store.
* Once auth happens and an auth method provides applicable policies, a new client token is generated and managed by the token store, then sent back to the client.
* The client token is used to authenticate future requests. It may have a lease associated with it depending on the auth method configuration, so it may have to be periodically renewed.
* After auth, requests are made using the client token. The token verifies the user and loads the relevant policies, which then are used to authorize the client request.
* The request is then routed to the secrets engine, which processes the request according to type.
* If the secrets engine returns a secret, the core registers it with the expiration manager, and attaches a lease ID that can be used by clients to renew/revoke their secret. If a client allows the lease to expire, the expiration manager automatically revokes the secret.
* The core handles request/response logging via the audit broker, which fans the request out to all the configured audit devices.

### High Availability

* Primary goal for HA Vault was minimizing downtime, not providing horizontal scalability
* Typically it gets bound by the IO limits of the storage backend, not the compute requirements.
* Some storage backends (like Consul) provide additional coordination to allow Vault to run in an HA configuration. When supported, Vault automatically runs in HA mode without additional config.
* When running in HA, Vault servers have two additional states:
    * standby
    * active
* For multiple vault servers sharing a storage backend, only a single instance is in active mode--the others are hot standbys
* The active server operates normally
* The standby servers do not process request, and redirect to the active Vault
* If the active server is sealed, fails, or loses network, one of the standbys takes over
* Note that only the unsealed servers act as standby.
* Enterprise supports Performance Standby nodes, which can support read-only requests in addition to being hot standbys

### Security Model

* Overall goals
    * confidentiality
    * integrity
    * availability
    * accountability
    * authentication

#### Threat Model

* Parts of the Vault threat model:
    * Eavesdropping on any vault communication. Client comms with vault should be secure from eavesdropping, as should comms between Vault and the storage back end.
    * Tampering with data at rest or in transit. Tampering should be detectable and cause Vault to abort processing the transaction.
    * Access to data or controls without authentication/authorization.
    * Access to data or controls without accountability.
    * Confidentiality of stored secrets.
    * Availability of secret material in the face of failure.
* Not parts of the threat model:
    * Protecting against arbitrary control of the storage backend.
    * Protecting against the leakage of the existence of secret material.
    * Protecting against memory analysis of a running Vault.

### Telemetry

* Vault server process collects runtime metrics, which are aggregated on a ten second interval, and retained for one minute.
* To view the raw data you send a signal to the Vault process. On Unix this is `USR1`
* On receipt, Vault dumps the current telemetry to the process's `stderr`
* Can be used for debugging or other investigation
* Telemetry can also be streamed directly from vault to telemetry metrics aggregation solutions.

### Token Authentication

* `token` auth method is built in, and at the core of client auth
* Other methods may be used for authentication, but all eventually result in the generation of a client token
* Every token has these properties:
    * `ID` - primary id, randomly generated value
    * `Display Name` - optional, human readable name
    * `Metadata` - for audit logging
    * `Number of Uses` - optional, restricted use count
    * `Parent ID` - optional, parent token that created the child token
    * `Policies` - associated list of ACL policies
    * `Source Path` - path at which the token was generated
* Token properties are immutable once created, except number of uses, which is decremented per use
* The source path allows source based revocation. For instance, to revoke all tokens generated via `auth/github/login`
* If a token is created by another auth method, it does not have a parent token. However, any tokens created by `auth/token/create` API have a parent token, which is the token used to make the initial request.
* Allows for revocation of entire token trees, or dropping of privileges
* A token with a use count of one is a one time token

### Key Rotation

* Vault has multiple encryption keys
* The keys support rotation
* To support key rotation, its necessary to support changing the unseal keys, master key, and the backend encryption key.
* There are two separate operations:
    * `rekey` - generates a new master key, requires the current threshold number of unseal keys
    * `rotate` - used to change the encryption key used to protect data written to the storage backend

### Plugins

* All Vault auth and secret backends are plugins.
* Built-in plugins ship with Vault
* Plugins are completely separate, standalone apps that Vault executes and communicates with over RPC, so they share no memory space with Vault.
* Vault creates mutually authenticated TLS connections for communications with the plugin's RPC server.
* There is a catalog of approved plugins

## Concepts

### 'Dev' Server

* Start vault as a server in dev mode: `vault server -dev`
* Requires no further setup, and your local `vault` cli is authenticated to it
* Makes it easy to experiment with, but never run it in prod.
* Properties of the dev server:
    * Initialized and unsealed, no need to use `vault operator unseal`
    * In-memory storage, no file permissions required
    * Bound to local address without TLS, listens on `127.0.0.1:8200`
    * Automatically authenticated
    * Single unseal key

### Seal/Unseal

* While sealed, Vault knows where and how to access physical storage, but can't decrypt anything.
* Unsealing is the process of constructing a master key needed to decrypt data
* The only operations on a sealed Vault are to unseal, or check the seal status
* Unseal is accomplished with `vault operator unseal` or via the API
* Once a vault is unsealed it stays unsealed until either
    * It is resealed via the API
    * the server is restarted
* Sealing the vault will throw away the amster key and require another unseal process to restore it. Sealing only requires a single operator with root privileges.
* Auto Unseal reduces the operational complexity of keeping the master key secure. It delegates the security of the master key from users to a trusted device or service.
* The seal can be migrated from Shamir keys to Auto Unseal and vice versa
* To do so, take the cluster offline and update the seal configuration, then when you bring the server back up, run the unseal process with the `-migrate` flag. Once the threshold number of unseal keys are entered, the unseal keys will be migrated to recovery keys.

### Lease, Renew, and Revoke

## Configuration

* Config file format is HCL or JSON
* Example:

    ```
    storage "consul" {
        address = "127.0.0.1:8500"
        path    = "vault"
    }

    listener "tcp" {
        address = "127.0.0.1:8200"
        tls_disable = 1
    }

    telemetry {
        statsite_address = "127.0.0.1:8125"
        disable_hostname = true
    }
    ```

* Use the `-config` option to `vault server` to specify the location

#### Parameters

* `storage` - configures the storage backend where Vault data is stored. 
* `ha_storage` - storage backend where HA coordination will take place
* `listener` - how vault is listening for API requests
* `seal` - configures seal type to use for auto-unsealing
* `cluster_name` - identifier for the Vault cluster, auto-generated if omitted
* `cache_size` - size of the read cache used by the phyiscal storage subsystem. Value is in number of entries, default 32000
* `disable_cache` - disables all caches, including the read cache. Very significantly impacts performance
* `disable_mlock` - disables the server from executing the `mlock` syscall, which prevents memory being swapped to disk. Not recommended in prod.
* `plugin_directory` - path for loading plugins, Vault must have read perms
* `telemetry` - specifies telemetry reporting system
* `log_level` - log level to use, can be overridden by CLI and env var params. On SIGHUP Vault will update the log level to the log value in the config file.
* `default_lease_ttl` - default `768h`. Cannot be larger than `max_lease_ttl`
* `max_lease_ttl` - default `768h`. Max possible lease for tokens/secrets
* `default_max_request_duration` - default `90s`. Max request duration before Vault cancels the request. May be overridden per listener via `max_request_duration`
* `raw_storage_endpoint` - boolean, default false, enables the `sys/raw` endpoint allowing the decryption / encryption of raw data into and out of the security barrier. Highly privileged endpoint.
* `ui` - bool, false, enables built in web UI, which is available on all listeners at the `/ui` path. Can also be provided with `VAULT_UI` env var
* `pid_file` - string, empty, path to the file that stores the Vault process PID

#### HA Parameters

* `api_addr` - full URL to advertise to other Vault servers in the cluster for client redirection
* `cluster_addr` - address to advertise to other Vault servers in the cluster for request forwarding
* `disable_clustering` - whether clustering features like request forwarding are enabled.

### Listener config stanza

* Configures addresses and ports on which Vault will respond to requests. As of now only one listener, `TCP`
* Example:

    ```
    listener "tcp" {
        address = "127.0.0.1:8200"
    }
    ```

* The stanza may be specified multiple times to make vault listen on multiple interfaces. If you configure multiple listeners, you must also specify `api_addr` and `cluster_addr` so Vault will advertise the correct address to other nodes
* `tcp` listener parameters:
    * `address` - string, default `127.0.0.1:8200` - address to bind to
    * `cluster_address

Note: To give Vault on Linux the ability to use `mlock` syscall without running the Vault process as root, run 

```bash
sudo setcap cap_ipc_lock=+ep $(readlink -f $(which vault))
```
