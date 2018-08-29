# Notes on The Practice of Cloud System Administration: Designing and Operating Large Distributed Systems, Volume 2

By Thomas A. Limoncelli; Strata R. Chalup; Christina J. Hogan

ISBN: 978-0-321-94318-7; Addison-Wesley Professional, 2014

## Chapter Summaries

### Introduction

* End result of creating an ideal environment:
    * Business objectives are met
    * Is built on a solid architecture:
        * Meets current objectives
        * Clear path for future growth
        * All subsystems are services with APIs
        * Geometry of infrastructure is described in code
* Authors' 'ideal release process':
    1. Code check-ins automatically trigger basic testing
    1. If tests pass, a build is run automatically
    1. If packages are created, a test env is created automatically
    1. The test env runs more automated tests
    1. On test completion, new packages rolled out to prod automatically
    1. A portion of systems are upgraded first, tracking problems
    1. If no failures occur, the rest of the systems are gradually upgraded
* Authors' 'ideal operations':
    * Software and infrastructure are instrumented for monitoring
    * Measurements can detect internal problems before they're noticeable to users
    * Problems identified are automatically sent to someone on-call
    * There's a playbook of instructions for all known alerts
    * All failures have countermeasures, whether automatic or manual
    * Infrequently activated countermeasures are periodically and automatically tested
    * Environment auto-scales
    * Dashboards indicated when reworking a solution may be better than adding resources
    * Each feature of the service can be individually enabled/disabled
    * Revisions to features don't eliminate old functionality; new feature can be turned off and you get the old feature
    * There is excellent operational hygiene:
        * documentation is maintained
        * over-active alerts are fine-tuned, not ignored
        * open bug counts are kept low
        * outages have postmortem review and report
        * 'quick fixes' are followed by analysis and long-term fixes
        * Devs and ops people don't think of themselves as two different teams
        * Everybody shares responsibility for high uptime, everybody is in the rotation

### Chapter 1. Designing in a Distributed World

* Chapter is an overview of designing distributed computing-based services
* Terminology:
    * **Server** - software that provides an API (not a hardware term)
    * **Service** - user-visible system or product composed of many servers
    * **Machine** - physical or virtual
    * **QPS** - Queries per second, usually of an API or page
    * **Traffic** - queries, API calls, other requests to server
    * **Performant** - performance meets or exceeds design requirements
    * **API** - protocol for inter-server communication
* Speed is crucial; users want replies in less than 200ms, most of which is network latency
* Hardware failure at scale is totally normal
* Ops has to be automated to work at scale

#### 1.1 Visibility at Scale

* **Introspection** - ability to examine internal state, required to operate, debug, tune, repair large systems
* System breadth is too large for any single person to know everything; distributed systems must generate copious logs and metrics to detail system operations and performance.
* Components should give health reports so that load balancers and autoscaling can work

#### 1.2 The Importance of Simplicity

* Designs should be the simplest thing that meets objectives
* The more complex a system is, the harder it is to come up to speed on it and visualize it
* Kernighan and Plauger, 1978: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."

#### 1.3 Composition

* Distributed systems are composed of smaller components
* Section looks at 3 composition patterns

##### 1.3.1 Load Balancer with Multiple Backend Replicas

* Requests go to a load balancer server
* LB selects a backend, forwards the request to it
* Response is relayed to client through LB
* Backends are replicas / clones of each other
* LB must determine health status of all backends via health checks
* Multiple ways of choosing which backend to send to:
    * round-robin - loops through available hosts
    * least-loaded - LB tracks load for each backend, selects least loaded one
    * slow-start - least-loaded, but never sending more than N requests in a row to one backend
* Naive least-loaded schemes can be very bad:
    * may be based on the wrong metric
    * system load may not reflect approaching failure / overload

##### 1.3.2 Server with Multiple Backends

* Server receives a request, queries many backend servers, composes reply by combining responses
* Backends can be replicated and loadbalanced
* You get advantage of parallel work, and a failed service won't kill the reply
* You can manage latency well: after N ms, compose and send page despite slow response(s) from servers
* "fan out" - one query to frontend fans out into multiple backend queries
* "fan in" - multiple backend responses combined into a single reply to client
* Any fan-in situation is at risk for becoming network / IO bound. Mitigating practices:
    * Network hardware may dynamically provision buffer space to handle traffic surges
    * Backends can rate-limit themselves to avoid sending upstream too fast
    * Frontends can rate-limit their queries of backends in various ways

##### 1.3.3 Server Tree

* A number of servers work cooperatively with one as the root
* Typical for sharding a large dataset / corpus
* Query against the entire dataset will get split and forwarded down the tree
* Parent nodes combine, sort, pass results upward
* Lets you prioritize speed vs. accuracy for results, by having parent nodes not wait for slow leaf node responses to complete
* Variations:
    * redundant, load-balanced servers parallelize work and avoid outages
    * expanding the number of leaf servers can give each leaf node less work, increases accuracy
    * expnading number of parent nodes increases capacity for ranking and sorting
    * Additional tree levels provide for a wider fan-out
    * parent nodes may provide caching to lower load on leaf nodes

#### 1.4 Distributed State

* Large systems have a lot of state data to process and store
* All distributed ways of dealing with state involve replication and sharding
* Replication/sharding force you to make CAP tradeoffs
* Typically state is stored by storing fractions or shards of the whole state on individual machiens
* Each shard is also stored on multiple machines to avoid data loss due to hardware failure
* State updates (writes to state storage) require all replicas be updated, which can cause out of date reads

#### 1.5 The CAP Principle

* Consistency, Availability, Partition tolerance
* Can't have completeness in all three simultaneously
* You have to make trade-offs consciously
* Talks about ACID and BASE, not going to repeat those here.

#### 1.6 Loosely Coupled Systems

* Distributed systems use abstraction to enable loose coupling, so that high-availability, resilient services can do continuous (or nearly so) deployment
* "The system is loosely coupled if each component has little or no knowledge of the internals of the other components."

#### 1.7 Speed

* Anything faster than 200ms is 'instant'
* General strategy for designing a performant system:
    * Design one or more systems using best estimates of how quickly it will process a request
    * Build prototypes to test those assumptions
    * Iterate if necessary, remeasuring and adjusting the design
* The fastest design may be more complex or expensive than a 'good-enough' design
* Two of the biggest consumers of time: disk access and network latency
* "You can often estimate how long a transaction will take if you simply know the distance from the user to the datacenter and the number of disk seeks required."

### Chapter 2: Designing for Operations

* Chapter covers most common ops tasks, and how to design for them
* "The best strategy for providing a highly available service is to build features into the software that enhance one's ability to perform and automate operational tasks."

#### 2.1 Operational Requirements

* Designing for operations means adding the infrastructure life cycle to your requirements
* Includes but not limited to:
    * Config, startup, shutdown
    * Queue draining
    * Software upgrades, backups, restores
    * Redundancy and replication
    * Hot swaps
    * Toggles for individual features
    * Graceful degradation
    * Access control and rate limits
    * Data import controls
    * Monitoring and auditing
    * Debugging instrumentation and exception collection

##### 2.1.1 Configuration

* System must be configurable by automation, both initial config and ongoing changes
* Must be possible to:
    * Backup and restore a configuration
    * View a diff of config versions
    * Archive the running config without taking the system down
* "From an operational perspective, the ideal is for the configuration to consist of one or more plain text files that can be easily examined, archived, and compared."

##### 2.1.2 Startup and Shutdown

* Service should restart automatically on boot, shut down during system shutdown
* On crash, next restart should perform necessary validations and repairs
* Startup and shutdown time should be documented for aid in recovery planning
* Testing for how a system reacts to all systems losing power concurrently is important, as it simulates a datacenter outage
* Candea and Fox, 2003, recommend that a HA service not have orderly startup and shutdown procedures, instead shutting down by crashing and starting up by performing crash recovery.

##### 2.1.3 Queue Draining

* Services should be able to be told to 'drain', which means to stop accepting new requests and complete existing ones.
* Important part of working in a load balanced system with rolling releases/upgrades
* Good to be able to start in drained mode, so ops can test it without it coming under traffic

##### 2.1.4 Software Upgrades

* Upgrades should ideally be done by taking machines out of rotationg gracefully, upgrading, and returning to rotation.

##### 2.1.5 Backups and Restores

* Must be possible to back up and restore data while the system is running
* You can take live backups of data off a read-only replica of the db
* Live restores can happen via an API for inserting data during a restoration
* Systems should be designed to restore a single user's account without restoring all  accounts, and should be able to do this live, without effecting the user

##### 2.1.6 Redundancy

* Services should be designed so that they can run on multiple redundant replicas

##### 2.1.7 Replicated Databases

* Most common db scaling pattern is multiple read-only replicas
* The master does all transactions that change data, updates are shipped out to read-only replicas
* Software should use two connections, one to master and one to a RO slave, using them each as appropriate

##### 2.1.8 Hot Swaps

* Service components should be hot swappable without taking down the service
* Same for hardware, preferably.

##### 2.1.9 Toggles for Individual Features

* Each new feature should be controllable by a feature flag
* Feature flags may be used to A/B, to do gradual rollouts, etc.

##### 2.1.10 Graceful Degradation

* Create a 'lightweight mode' for interfaces, to enable use in high latency periods
* Services may need to become read-only if the database stops accepting writes
* Use caching to serve partial results rather than have a full outage

##### 2.1.11 Access Controls and Rate Limits

* Each API should include an Access Control List (ACL) that defines users, permissions, and their rate limits

##### 2.1.12 Data Import Controls

* For services that import data, operations staff should be able to control which data is accepted, rejected, or replaced.
* Similar to user-based ACLs, you use whitelist/blacklist for data rather than users.
* You can impose a 'change limit'--if process X is going to change more than Y percent of records, alert and require permission.

##### 2.1.13 Monitoring

* Metrics should provide visibility into availability, performance, etc.

##### 2.1.14 Auditing

* You use logging, permissions, and role accounts to allow security auditing
* Check with appropriate source of authority for specifics

##### 2.1.15 Debug Instrumentation

* Logs should be human readable and machine parseable
* Debug logging should be able to be enabled on individual modules
* "Every developer should feel empowered to add a debug logging statement for any information he or she sees fit. The documentation on how to consume such information is the source code itself, which should be available to operations personnel."

##### 2.1.16 Exception Collection

* Exceptions should be centrally collected
* Main benefits of exception collection:
    * automatic restarts can hide breaking exceptions repeatedly
    * exceptions over time can be a system health indicator
    * history of exceptions can be parsed for trends

##### 2.1.17 Documentation for Operations

* Devs and ops should work together to create a playbook of procedures for services
* Playbooks are lists of ops steps to create/restore system state during failure
* Must be collaborative between dev and ops people.
* "Documentation is a stepping stone to automation."

#### 2.2 Implementing Design for Operations

* Features for ops need to be explicitly built into software
* Four main ways to get them there:
    * Build them in from the beginning
    * Request features as they are identified
    * Write the features yourself
    * Work with a third-party vendor

##### 2.2.1 Build Features in from the Beginning

* Ops works with devs, everybody's happy.
* Make sure the business team is aware ops needs are real and important.

##### 2.2.2 Request Features as They Are Identified

* File feature requests for every missing ops feature.
* List risks and impacts on business needs so your requests can be prioritized.
* For prioritization, "select the item that will have the biggest impact for the smallest amount of effort."
* However, don't get caught up in lots of low hanging fruit--stick to high-impact items, whether or not they're easy.

##### 2.2.3 Write the Features Yourself

* Ops staff probably shouldn't swoop in and write their own features.
* It may create bad blood between dev and ops, and sets a bad precedent where ops is responsible for part of the software.
* If ops are going to submit code, consider small changes to make sure the dev and ops relationship is solid.
* Ideally, ops staff are embedded with devs so they know testing and release cycles.

##### 2.2.4 Work with a third-party vendor

* Like working with an internal team
* Additional caveats:
    * Be constructive with criticism to avoid defensiveness about vendor's product
    * Write postmortem reports to include with feature requests for context an outsider may lack
    * If the vendor is unresponsive to requests, consider building a wrapper layer around the problematic portions of their product.

#### 2.3 Improving the Model

* "When possible, strive to create systems that embed knowledge or capability into the process, replacing the need for operational intervention. The job of the operations staff then changes from performing repetitive operational tasks to building, maintaining, and improving the automation that handles those tasks."


### Chapter 3: Selecting a Service Platform

* Chapter gives an overview of the platform types in cloud computing
* Specific terms:
    * **Infrastructure as a Service (IaaS)** - computer and network hardware, real or virtual, ready for use
    * **Platform as a Service (PaaS)** - your software running in a vendor-provided framework or stack
    * **Software as a Service (SaaS)** - an application provided as a website
* Typically, operators use IaaS, devs use PaaS, users use SaaS.
* Platforms can be described on these axes:
    * Level of service abstraction: IaaS, PaaS, SaaS
    * Type of machine: physical, virtual, process container
    * Level of resource sharing: shared or private

#### 3.1 Level of Service Abstraction

* The closer to the machine you are, the more control you have.
* The more abstracted, the less you have to worry about infrastructure details.

##### 3.1.1 Infrastructure as a Service

* Gives you bare machines, networked and ready for OS and software install
* Terminology:
    * **Server** - software providing a function or API
    * **Service** - user visible system composed of servers
    * **Machine** - physical or virtual machine
    * **Oversubscribed** - system with capacity X is used where capacity Y is needed, where X lt Y
    * **Undersubscribed** - opposite of oversubscribed
* Fair amount of work exists to coordinate various pieces, even if the base layer of the infrastructure is provided to you by the vendor.
* When comparing providers, comare benchmarks on local storage, remote storage, CPU, and network performance. Repeat tests at different times of day.
* IaaS will be segmented into partitions or reliability zones by geography, and you should be able to stagger systems over zones to provide service even during a zone outage.
* You can also use zones to manage network latency of your service, by routing people to local resources when possible.

##### 3.1.2 Platform as a Service

* You run your apps out of a vendor provided framework
* Lots of the scaling is done for you
* Downside is you're restricted to their framework

##### 3.1.3 Software as a Service

* It's a web-accessible application.
* If you're providing one, you need to design it to obscure upgrades and operational details.
* Devs shouldn't design features reliant on client software or browser plugins
* Make it easy for users to get started.
* Make it easy to leave via self-service means
* Consider providing two release tracks, so users can experience the stable and upcoming feature sets as they choose, for purposes of training and familiarization.
* "Your privacy policy will need to be a superset of all your customers' privacy policies. You may need to provide heightened security for certain customers, possibly segmenting them from other customers."

#### 3.2 Type of Machine

##### 3.2.1 Physical Machines

* Has relatively predictable performance because it's a non-shared resource.

##### 3.2.2 Virtual Machines

* Multiple virtual machines on a machine are likely to be more efficient than running multiple processes on the underlying physical machine.
* VMs allow running different OS and software versions, and upgrades are VM specific
* IO in a virtual environment:
    * **Hardware virtual machine (HVM)** - does IO emulation at the chip level, so the guest OS doesn't need to know it's on a VM
    * **Paravirtualization (PV)** - does IO emulation at the device level, so the guest OS must be modified to make IO calls to the Virtual Machine Monitor (VMM)
* VMs can be problematic in terms of resource contention, which can often be monitored via the VMM.

##### 3.2.3 Containers

* It's a group of processes running isolated from other groups of processes.
* "Each container has an environment with its own process name space, network configuration, and other resources. The file system to which the processes have access consists of a subdirectory on the host machine. The processes in a particular container see that subdirectory as their root directory, and cannot access files outside that subdirectory without accommodation from the host machine."
* Usually the underlying tech for PaaS.
* May be much more efficient way to do shared resources than VMs
* Systems like Docker create standardized software containers, that can be distributed individually. That means software can ship with all its requirements.

#### 3.3 Level of Resource Sharing

* "Choice between private or public use of a platform is a business decision based on four factors: compliance, privacy, cost, and control."

##### 3.3.1 Compliance

* Depends on legal requirements of the company / region.

##### 3.3.2 Privacy

* Maintaining your privacy agreements may mean using or not using specific providers.
* That can include questions like "what happens if law enforcement requests data?"
* Other people's bugs can expose your data, so think carefully about instances where you are not writing the software underlying data exposure.

##### 3.3.3 Cost

* Varies.

##### 3.3.4 Control

* Private cloud gives more control in terms of hardware, network topology, etc.
* Key questions for a potential provider during contract negotiations:
    1. On exit, will you be able to take all your data with you?
    1. For physical machines, will you have an option to purchase if you leave?
    1. What happens to servers and data if the vendor goes bankrupt?
    1. Do they provide bandwidth, or do you? Who is the ISP and how much oversubscription is done? What's the hardware and peering transit redundancy?
    1. Are backups done? What's the frequency and retention policy? Can you access backups on request? How are restores tested?
    1. How is the SLA for capacity and bandwidth guaranteed? Are refunds possible if there's an SLA violation?

#### 3.4 Colocation

* It's when a datacenter owner rents space to tenants to house their hardware.
* It's good when you need a small to medium amount of datacenter space, or if you need many small spaces.

#### 3.5 Selection Strategies

* **Default to virtual** - use containers or VMs wherever possible, using physical machines when performance goals can't be met any other way. 
* **Make a cost-based decision** - public cloud is probably cheaper for everything but a multi-year project.
* **Leverage provider expertise** - let your employees focus on the application
* **Get started quickly** - get up and running as fast as possible to avoid lost opportunities
* **Implement ephemeral computing** - set up infrastructure only for the life of the project / scale during spikes
* **Use the cloud for overflow capacity** - build your baseline capacity in-house, but be ready to expand to the cloud for bursts
* **Leverage superior infrastructure** - having great infrastructure can be a competitive advantage
* **Develop an in-house service provider** - if you're a large company, you may be able to benefit from some of the economies of scale that make public cloud providers profitable while staying cheap
* **Contract for an on-premises, externally run service** - there are companies that will build and maintan an in-house cloud for you
* **Maximize hardware output** - at very large scale, using physical machines rather than virtual ones can gain you efficiency advantages if services can be tightly packed onto physical machines.
* **Implement a bare metal cloud** - treat physical machine infrastructure like a virtual machine cloud. Manage your physical hardware as a pool of identical machines, and provide an API for allocating machines, wiping and reinstalling, rebooting them, and controlling access to them.

### Chapter 4: Application Architectures

* Chapter looks at the building blocks for applications and services. First looks at a single web server, scales to multi-machine, then up to a global service pattern.
* Examples assume the service is web-based, HTTP using, served to a web browser

#### 4.1 Single-Machine Web Server

* Single machine providing a web service, speaks HTTP, processes requests.
* Web pages built from static content, dynamic content, and db-driven dynamic content
* Limited in terms of concurrent users by CPU, memory, IO capacity
* Reliability is down to how reliable one machine can be.
* As traffic grows, the web server may get overloaded, will hit a limit of how much you can expand capacity vertically with RAM, disk, CPU upgrades.
* May encounter dueling buffers in disk caches if web server and db server are both consumers of the same resources.

#### 4.2 Three-Tier Web Service

* Layers are a load balancer that proxies to multiple web servers, who all rely on a common backend database server.
* Users talk to the LB like a webserver; it isn't apparent they're not talking directly to the web server.

##### 4.2.1 Load Balancer Types

* Three main categories: DNS round robin, layer 3 and 4, layer 7
    * **DNS Round Robin** - List the IP addresses of all replicas in the DNS entry for the server, browsers randomly pick one to try first. Rarely used--doesn't work well, hard to control, not very responsive.
    * **Layer 3 and 4 Load Balancers** - LB gets each TCP session, redirects it to a replica. All packets in session go through LB, reply packets go from replica back through LB to the client. All traffic from one source goes to the same replica.
    * **Layer 7 Load Balancer** - similar to L3/L4, but make decisions based on the actual application layer of the protocol stack. Make decisions based on looking inside HTTP (cookies, headers, URLs, etc). Richer mix of features than round robin or L3/L4.

##### 4.2.2 Load Balancing Methods

* Multiple algorithms for choosing which backend to send to:
    * **Round Robin** - machines rotated in a simple loop, down machines skipped
    * **Weighted Round Robin** - rotation, but with more queries going to the machines with more capacity, allowing differently provisioned backends.
    * **Least Loaded** - picks the currently lowest loaded backend
    * **Least Loaded with Slow Start** - backends in least loaded scheme are ramped up as they come on, not immediately flooded
    * **Utilization Limit** - backends estimate their QPS, tells the LB
    * **Latency** - LB stops forwarding requests to a backend if latency grows beyond a threshold value
    * **Cascade** - replicas fill to capacity, in order
    
##### 4.2.3 Load Balancing with Shared State

* Problem: how to maintain state across HTTP requests to different replicas?
* Several strategies:
    * **Sticky connections** - first request sets the replica to hit, subsequent requests go to the same replica. If the backend dies, state (login, etc) is lost.
    * **Shared State** - state info is stored in a way accessible to all replicas
    * **Hybrid** - combination of sticky connections and shared state
* Shared state methods: db server available to all backends, memcached or redis in-memory db. Do not use an NFS server.

##### 4.2.4 User Identity

* It's cookies and sessions! Whee.

##### 4.2.5 Scaling

* Three-tier system can scale horizontally pretty well
* Variations on the three-tier pattern:
    * **Replica groups** - LB can serve many groups of replicas, not just one
    * **Dual load balancers** - gives failover protection at LB level
    * **Multiple data stores** - spreading the data out spreads the work out

#### 4.3 Four-Tier Web Service

* Used when there are many individual apps with a common frontend infrastructure
* Layers:
    1. Load balancer, which picks a
    1. Frontend web server, that talks to the appropriate
    1. Application server, which has access to shared or private
    1. Data server(s)

##### 4.3.1 Frontends

* Responsible for tasks common to all apps:
    * cookie processing
    * session pipelining
    * compression and encryption
    * user login/logout, security
* Important to centralize encryption and certificate management in a single layer, so that one team can manage the entire security infrastructure, and the lowest number of people can be given keys, etc.
* By having a consolidated frontend, you reduce attack surface area

##### 4.3.2 Application Servers

* If the frontends are handling all HTTP, frees the frontend to app server connection choices up to be HTTP or something else depending on your needs.
* Having separate app servers means apps don't come into resource contention or crash each other.

##### 4.3.3 Configuration Options

* Splitting into frontend, app server, data server layers lets you pick different hardware for each layer, since they likely have different requirements.

#### 4.4 Reverse Proxy Service

* Reverse proxy service lets one web server provide content from another web server transparently, so the user experiences multiple applications as a single site.
* Example: ``company.com/``, ``company.com/weather``, ``company.com/news`` each go to different services, but should be seen as a single website.
* Request goes to reverse proxy, which interprets the URL and collects the required pages from the right server or service.
* Reverse proxies are simpler than a four-tier frontend, usually just connects a browser to a particular HTTP server.

#### 4.5 Cloud-Scale Service

* Globally distributed, usually by having multiple instances of a four-tier infrastructure replicated in different locations around the world.
* Global load balancer directs traffic to the nearest location.

##### 4.5.1 Global Load Balancer (GLB)

* GLB is a DNS server that directs traffic to the nearest data-center
* Looks at IP of request, attempts geolocation to find nearest data-center

##### 4.5.1 Global Load Balancing Methods

* GLB maintains a list of replicas and their locations/IPs
* Different techniques:
    * **Nearest** - strictly picks the nearest datacenter
    * **Nearest with limits** - picks the nearest datacenter that has capacity
    * **Nearest by other metric** - picks a datacenter based on something else, like latency or cost

##### 4.5.3 Global Load Balancing with User-Specific Data

* What happens when a user's data is at a different location than their nearest DC?
* GLB works at the DNS level, so it has no concept of specific users
* To resolve this, you need your frontend servers to be able to find the right datacetner and app server to pull the user's data from
* Consequently all datacenters must be able to talk to each other.

##### 4.5.4 Internal Backbone

* Internal backbone is the private WAN connecting your datacenters
* **POP** - point of presence, small remote facility for connecting to local ISPs
* POPs are usually a rack in a conveniently located colo
* **satellite** - POP plus small number of computers used for frontend and CDN
* You can split up the resource requests for creating a page via lazy-loading, such that small requests (interface files) go over the fastest connection regardless of cost, while lazy-loaded, large resources go over the cheaper but slower connection.

#### 4.6 Message Bus Architectures

* "A message bus is a many-to-many communication mechanism between servers."
* Servers send messages to channels, other servers listen on those channels.
* **Publisher** - sending server
* **Subscriber** - listening / receiving server
* Message content is totally arbitrary (though possibly subject to underlying tech)
* Examples are SQS, MCollective, RabbitMQ

##### 4.6.1 Message Bus Designs

* Message bus master takes network topology into account, routes via shortest paths
* Multicast used on a subnet, unicast between subnets
* Single master systems can get bottlenecked, may be better to have more than one message master
* Channels can be open or subject to arbitrarily complex ACLs

##### 4.6.2 Message Bus Reliability

* Most message bus systems guarantee every message will be received, usually by forcing a receiver to acknowledge before the message is deleted from the queue.
* Systems vary on how they deal with long outages of receivers--some dump messages, some save for an amount of time
* Order of send may not be order of receipt--bus doesn't guarantee ordered delivery.
* Since messages could be lost or missed, it is good for services to have a separate way of catching up on missed data in case of outage, like a digest message or data dump.


#### 4.7 Service-Oriented Architecture

* "Each subsystem is a self-contained service providing its functionality as a consumable service via an API. The various services communicate with one another by making API calls."
* Services should be loosely coupled.

##### 4.7.1 Flexibility

* You don't need to get permission to integrate new systems with existing systems.
* Subsystems can be managed discretely, which is easier for everybody
* APIs hide implementation details, so implementations can change.

##### 4.7.2 Support

* Easier to manage a small team working on a discrete service.
* You can split teams if they grow beyond manageability

##### 4.7.3 Best Practices

* Use the same underlying RPC protocol for all APIs
* Have a consistent monitoring mechanism
* As much as possible, use the same techniques (load balancing, management, coding standards) on all services, to facilitate people moving across teams, or services moving across teams.
* Adopt some form of API governance to create and maintain standards. Standards represent institutional memory.

### Chapter 5: Design Patterns for Scaling

* Typical measurements of workload is transactions per second, amount of data, or number of users
* Important to build distributed systems as scalable from the beginning.
* Chapter covers techniques that allow distributed systems to grow to extreme size.

#### 5.1 General Strategy

* Initial requirements should include approximations of desired scale
* Once the system is up you'll start finding performance limits and adapting to them.
* Don't prematurely optimize, you'll waste time and resources.

##### 5.1.1 Identify Bottlenecks

* **Bottleneck** - point in the system where congestion occurs, and/or is resource starved
* Even if a system is working well, find the bottlenecks to predict / prevent problems.
* "Optimizations done to the process upstream of the bottleneck simply make the backlog grow faster. Optimizations made downstream of the bottleneck may improve the efficiency of that part but do not improve the total throughput of the system."

##### 5.1.2 Reengineer Components

* Some problems can be fixed by adding resources to the current system, some require rework.
* "Sometimes reengineering is difficult because of earlier design decisions [...] It is often best to first replace such code with code that is functionally equivalent but has an internal organization that makes other reengineering efforts easier to accomplish."

##### 5.1.3 Measure Results

* You should work from actual evidence, so you need data collected from real systems.
* Measure, change, measure again.

##### 5.1.4 Be Proactive

* "The best time to fix a bottleneck is before it becomes a problem."
* "Every system has a bottleneck or constraint. [...] The constraint becomes a problem only if it actually hampers the system's ability to achieve its goal."
* "The best strategy for scaling a running system, then, is to predict problems far enough in advance that there is enough time to engineer a proper solution. This means one should always be collecting enough measurements to be aware of where the bottlenecks are. Those measurements should be analyzed so that the point at which the bottleneck will become a problem can be predicted."

#### 5.2 Scaling Up

* Vertical scaling is limited--you can only add so much RAM, and incremental additions get stupid expensive at high levels.

#### 5.3 The AKF Scaling Cube

* Three basic methodologies for massive scaling:
    * **Horizontal duplication** - replicate the entire system
    * **Functional / service splitting** - break the system into individual functions
    * **Lookup / formulaic splitting** - break the system into chunks via hashing, trees, etc.
* AKF Scaling Cube, from Abbott, Keeven, and Fisher (2009) is a cube with:
    * X axis == horizontal duplication
    * Y axis == functional / service splitting
    * Z axis == lookup / formulaic splitting

##### 5.3.1 x: Horizontal Duplication

* Replicates a service by scaling out horizontally, as with multiple servers behind an LB
* "Does not scale well with increases in data or with complex transactions that require special handling. If each transaction can be completed independently on all replicas, then the performance improvement can be proportional to the number of replicas."
* If replicas have to communicate, scaling is less efficient.
* Related techniques:
    * Adding machines or replicas
    * Adding disks
    * Adding network connections

##### 5.3.2 y: Functional or Service Splits

* Lets you allocate resources to a specific function separate from other functions.
* Requires services be loosely coupled.
* In addition to splitting on service boundaries, may involve splitting workflows or transaction types: if a specific type of transaction is expensive/complex, consider splitting it out to another group of machines.
* You can also mark special customers for special treatment (send a VIP to a dedicated pool)
* Related techniques:
    * Splitting by function, with each function on its own machine
    * Splitting by function, with each function on its own pool of machines
    * Splitting by transaction type
    * Splitting by type of user

##### 5.3.3 z: Lookup-Oriented Split

* Splits data into identifiable segments, each given its own resources. Divides data instead of processing.
* Means of segmenting:
    * By geography
    * By date
    * By hash prefix
    * By customer functionality
    * By utilization
    * By organizational division
    * Hierarchically
    * By arbitrary grouping

##### 5.3.4 Combinations

* Combining multiple axes of the AKF cube:
    * **Segment plus replicas** - segments accessed more frequently are replicated more
    * **Dynamic replicas** - replicas added/removed dynamically
    * **Architectural change** - replicas moved to faster or slower hardware as needed

#### 5.4 Caching

* Caching is an optimization on the z-axis of the AKF cube (lookup oriented splitting)
* **Cache hit** - cached result used
* **Cache miss** - cached result not used/present, real lookup happens, stores to cache

##### 5.4.1 Cache Effectiveness

* Measured by **cache hit ration / cache hit rate**, which is ``hits / lookups``
* "A cache is a net benefit in performance if the time saved during cache hits exceeds the time lost from the additional overhead."
* Formula for estimating that via weighted averages:

```
L <- typical time for a regular lookup
H <- a cache hit
M <- a cache miss
R <- cache hit ratio

Cache is more effective if:

  H x R + M x (1 - R) < L
```

* "A cache is cost effective only if the benefit from the cache is greater than the cost of implementing the cache. Recall that accessing RAM is faster than accessing disk, but much more expensive."
* Ex: system without caching == 20 replicas, with caching == 15. If cache cost is less than cost of 5 replicas, it's worth it.

##### 5.4.2 Cache Placement

* Caches can be in multiple places:
    * Local to client - software does its own caching
    * Between client and server - cache is between the server and external resources
    * Local to server - server may respond with cached result if available

##### 5.4.3 Cache Persistence

* On start, a cache is cold (empty) and has a bad hit ratio
* Stays cold until warmed by repeated querying
* Disk based caches can survive restarts, RAM caches can't, because duh.

##### 5.4.4 Cache Replacement Algorithms

* In a full cache you have to get rid of an entry to create a new one.
* Different replacement algorithms work best for different data access patterns.
* **Least Recently Used (LRU)** - discards least recently used entry. Good when queries are repeated often within a small time period.
* **Least Frequently Used (LFU)** - discards least active entry. Good when more popular data is accessed the most.
* **Adaptive Replacement Cache (ARC)** - puts newly cached data in a probationary state. If data is accessed again it gets out of probation, and the probationary cache is occasionally flushed.

##### 5.4.5 Cache Entry Invalidation

* If data in primary storage changes, the cached version is invalidated.
* Choices for dealing with that:
    * Ignore the problem.
    * Invalidate the entire cache. Ok if the cache warms quickly.
    * Main storage communicates to cache about invalid entries
    * Age out data by timestamp
    * Age out data based on server-provided TTL value
    * Poll the server to see if a local cache should be invalidated

##### 5.4.6 Cache Size

* Too small, performance suffers. Too large, you waste money.
* Caches are usually a fixed size.
* Approaches to selecting a cache size:
    * Most accurate: take measurements of running system
    * Run the system with a variety of cache sizes and measure performance
    * Give it more space than it needs, with fast expiration. See if it stabilizes at a specific size.
    * Estimate the cache hit ratio by collecting logs of data and counting duplicate requests.
    * Use a cache simulator if your system is not running yet.

#### 5.5 Data Sharding

* Segmentation on the z axis that is flexible, scalable, and resilient. Imposes divisions based on the hash value of database keys.
* Process for sharding a database in 2 segments:
    1. Generate a hash for each key
    1. Put entries with even hash values in one database, odd in the other
* For n shards, split on hash value modulo n
* That's a **distributed hash table**, has even distribution across shards
* Shards can be replicated to multiple machines for performance and stability.
* If shards outgrow their hosts, split to n*2 shards, distributed to between n+1 and n * 2 machines, with multiple shards per machine if necessary.
* Shards often used for distributing a read-only corpus of data

#### 5.6 Threading

* "Threads are subsets of processes; it's typically faster to switch operations among threads than among processes. We use threading to get a fine granularity of control over processing for use in complex algorithms."
* Disadvantages of single threaded applications:
    * Single big request blocks subsequent requests until completion
    * In a flood of requests, some will be dropped by the kernel limiting waiting threads
    * In a multi-core machine, a single threaded process will leave all but one core idle.
* Pattern for multithreading:
    * Main thread receives requests
    * Worker threads spawned by main thread to work on requests and generate replies

#### 5.7 Queueing

* It's a basic FIFO structure, local or remote.
* There's a master thread and worker threads, the master polls the queue and assigns workers.

##### 5.7.1 Benefits

* Less likely than threading to overload the machine; you only pull from the queue what you can handle, so the backlog is on the queue, not waiting for the processor.
* Easier to implement a priority scheme than via threading.

##### 5.7.2 Variations

* Growing or shrinking the number of workers as load fluctuates
* Threads respawn themselves periodically to be 'fresh', mitigate (though also hide) problems
* Common practice to use processes instead of threads. Processes are expensive to spawn, but having a fixed number of worker processes eating a queue means the overhead of process creation is up front. 

#### 5.8 Content Delivery Networks

* **content delivery network (CDN)** - service that delivers content more efficiently on behalf of your service by caching content resources globally and serving them to local users.
* Cache servers are often in ISP datacenters, so there's less ISP to ISP traffic, lowering costs.
* "Best practice is to use a flag or software switch to determine whether native URLs or CDN URLs are output as your system generates web pages." Avoids CDN outage issues, enables testing.

### Chapter 6: Design Patterns for Resiliency

* "Resiliency is a system's ability to constructively deal with failures. A resilient system detects failure and routes around it."
* Chapter documents most common techniques for building resilient software.
* A couple strategies:
    * Graceful degradation - reduce functionality under load rather than fail
    * Defense in depth - all layers of design detect and respond to failures
    * Use best in class products - expensive, but reduces failure chances at all levels
* Terminology:
    * **Outage** - user-visible lack of service
    * **Failure / Malfunction** - system, subsystem, or component stops working
    * **Server** - software providing an API
    * **Service** - user visible system or product composed of servers
    * **Machine** - virtual or physical machine
    * **QPS** - queries per second
    * **MTBF** - mean time between failures, manufacturer provided numbers about hardware failure rates

#### 6.1 Software Resiliency Beats Hardware Resiliency

* Software solutions are cheaper than hardware solutions
* Software is easier to fix, upgrade, and replace than hardware
* Software ages more gracefully than hardware

#### 6.2 Everything Malfunctions Eventually

* Malfunctions happen at all scale levels, from typos to datacenter outages.

##### 6.2.1 MTBF in Distributed Systems

* Big systems magnify small problems; a 1:1000 chance becomes a certainty when spread over 1000 machines.
* Failures tend to cluster. For example:
    * rack full of servers spin up after an outage and expose insufficient power supplies
    * components from the same manufacturer have similar mortality curves, fail in batches

##### 6.2.2 The Traditional Approach

* Old paradigm: software can think the world is perfect and free of malfunctions!
* You have to fake infallibility using things like RAID, so the software doesn't have to worry about disk failure, etc.
* Trying to emulate a failure free world is expensive and ultimately fruitless.

##### 6.2.3 The Distributed Computing Approach

* New paradigm: assume stuff will break, write software accordingly.
* You want the _user_ to assume nothing has broken, not the software.
* Bonus: if you write resilient software, you can use cheaper (more failure-prone) hardware.

#### 6.3 Resiliency through Spare Capacity

* General strategy for resilience: have redundant units of capacity that can fail independently of each other. Requires you to build spare capacity in from the start, so you can take systems out of rotation as they fail.
* **N + M redundancy** - system requiring N units to function and having M units extra
* **N + 1 redundancy** - enough spare capacity for one failure
* **Oversubscribed** - system is at N - O capacity

##### 6.3.1 How Much Spare Capacity

* It's pretty situation dependent.
* **MTTR** - mean time to repair a component or system
* Factors to consider:
    * How quickly can you add capacity?
    * How likely is an additional failure during the spin up time for additional capacity?
* MTTR / MTBF x 100 = likelihood of second failure during repair window
* Consider N + 1 a minimum, N + 2 is needed if a second outage is likely in repair window

##### 6.3.2 Load Sharing versus Hot Spares

* As an alternative to having all capacity units actively serving under the load balancer, you can keep some out of rotation but running, to swap into the LB as needed.

#### 6.4 Failure Domains

* **Failure domain** - "bounded area beyond which failure has no impact"
* Ex: stalled car does not cause a multi-lane road to become unusable
* Failure domains may be part of requirements or design planning--you may need to ensure that certain systems cannot effect each other in the event one fails.

#### 6.5 Software Failures

* Software has to be resilient, on account of it has failures too.

##### 6.5.1 Software Crashes

* Two categories of crash:
    * regular crash - software does something prohibited by the OS, OS kills the process
    * panic - software detects itself doing something wrong, exits prematurely
* "The easiest way to deal with a software crash is to restart the software."
* Automate your restarts if you intend to work at scale.
* The process watcher system needs to be able to detect recurring failures, so it doesn't get stuck in a restart-crash loop.
* "Every crash should be logged."
* Automate the collection and storage of crash reports, then data mine 'em.

##### 6.5.2 Software Hangs

* Software can get stuck in a bad state, but not actually crash.
* You can check occasionally to see if a server is still processing requests.
* Lightweight requests that ping a server are **heartbeat requests**
* Can also set a **watchdog timer**, which is a counter that increments steadily over time, but is reset to 0 with every successful operation of the server. If it reaches a threshold value, the server gets restarted. Usually watchdog timers are in the OS kernel or an embedded system.

##### 6.5.3 Query of Death

* **Query of death** - an API call or query that hits an untested code path resulting in a hang, delay, or crash.
* You have to fix the bug that causes the crash, but between discovery and fixing, you can implement one of a couple options:
    * **banned query list** - needs to talk to all frontends, and cause them to reject anything on the list
    * **canary requests** - send a query to one or two leaf servers (out of many), send to the rest of the leaf servers only if the replies to the first requests come back in a reasonable amount of time. If not, flag the query as potentially hazardous, don't send to other leaf servers.

#### 6.6 Physical Failures

* "You need a strategy for providing resiliency against hardware failures without adding excessive cost."

##### 6.6.1 Parts and Components

* For RAM the main tradeoff is whether it has parity / error-correcting bits. They make it somewhat self-correcting, but require more writes (therefore decreasing MTBF) and are more expensive.
* You can save money by not using parity bits or ECC, but then your software has to do it. Spend the money on ECC instead, doing it in-house isn't worth it.
* Spinning disks have mechanical failures, SSDs fail because each sector is only rated for a finite number of writes.
* Common disk solution is to use RAID level 1 or higher to get N + 1 (or better) redundancy, or by using a file system that does its own redundancy like ZFS, BTFS, Hadoop HDFS, etc.
* Power supplies die. You can get redundant ones to give you N + 1 or N + 2 configurations.
* Network interfaces die, but there are "too many [standards for dealing with it] to detail here."

##### 6.6.2 Machines

* If a machine dies, it's usually from a component going bad.
* Power cycling can bring a lot of machines back to life. If it doesn't, you gots ta' fix it.
* If you've got your own bare metal, you should reboot them occasionally (singly and in groups) to make sure they survive the reboot process.

##### 6.6.3 Load Balancers

* Load balancers can be used for both scaling and resiliency, but you need to specifically think about which you're using it for--they're not a magic bullet.
* For resiliency: an LB shipping traffic to two machines, each at 40% utilization. Either could die and spike to 80% without trouble.
* For scale: same example, but both at 80% load. If one dies, the remaining one will get oversubscribed.
* "A load balancer provides scale when we use it to keep up with capacity, and resiliency when we use it to exceed capacity. If utilization increases and we have not added additional replicas, we run the risk of no longer being able to claim resiliency."
* A single LB is a single point of failure. You typically want a primary and a failover, with the secondary heartbeating to the primary so it can take over if necessary.

##### 6.6.4 Racks

* Rack-wide failures are common, from a single power source or network uplink going bad.
* "A rack is usually a failure domain. In fact, intentionally designing each rack to be its own failure domain turns out to be a good, manageable size for most distributed systems."
* If you break a service into many replicas spread over many racks (with other services), your system will withstand a rack outage much better.
* Think carefully about rack locality, in terms of bandwidth between related machines.

##### 6.6.5 Datacenters

* Can also be failure domains since an entire DC can go down.
* Consider datacenter diversity in the same way you consider rack diversity.

#### 6.7 Overload Failures

* Got to be able to deal with traffic spikes, intentional attacks, and automated systems querying your service.

##### 6.7.1 Traffic Surges

* Primary strategy for maintaining availability during traffic surges is graceful degradation.
* Another strategy is to add capacity dynamically, by having the system detect an overloaded service and allocate resources to it.
* You can also use 'load shedding', which turns away some users so other users can continue to have a good user experience.
* Version of load shedding is to temporarily disable some back end processing that can happen asynchronously, like db batch jobs, nightly bulk file transfers, etc.
* If you delay activity in the interest of load shedding, there must

### Chapter 7: Operations in a Distributed World

#### 7.1 Distributed Systems Operations

##### 7.1.1 SRE vs Traditional Enterprise IT

* IT depts tend to have very broad responsibilities, SREs have a narrow band of responsibility regarding keeping a service or set of services running.
* SREs manage for extremely high uptime, so focus on prevention
* SREs maintain systems that are undergoing constant scaling

##### 7.1.2 Change vs Stability

* Dev priorities center on change, ops center on stability
* Need to be mechanisms to balance those needs
* One strategy is to prioritize work for stability over work for features--bug fixes are higher priority than feature additions
* Align the goals of developers and operational staff, by having both parties responsible for SLA compliance and system change velocity
* The premise of devops is that development and operations are integrated to function smoothly together.

##### 7.1.3 Defining SRE

* in 2014, Benjamin Treynor Sloss, VP of SRE at google, gave site reliability practices as:
    1. Hire only coders
    1. Have an SLA for your service
    1. Measure and report performance against the SLA
    1. Use Error Budgets and gate launches on them
    1. Have a common staffing pool for SRE and Developers
    1. Have excess Ops work overflow to the Dev team
    1. Cap SRE operational load at 50 percent
    1. Share 5 percent of Ops work with the Dev team
    1. Oncall teams should have at least 8 people at one location, or six people at each of multiple locations
    1. Aim for a maximum of two events per oncall shift
    1. Do a postmortem for every event
    1. Postmortems are blameless and focus on process and technology, not people
* Each team is allocated both SRE and Dev members, who should be able to function somewhat interchangeably.
* Having work overflow onto devs discourages them from using costly shortcuts

##### 7.1.4 Operations at Scale

* Manual operations do not scale.
* You must have automation.
* There are three categories of things that are not automated:
    * Things that are not yet, but should be. These can be encapsulated in playbooks until they can be automated.
    * Things not worth automating. Edge cases where ROI of automating doesn't make sense.
    * Things that cannot be automated. These can be streamlined:
        * Better documentation can eliminate interactions with stakeholders.
        * Making things self-service can also do that.
        * Standardize and automate the evaluation of new tech, because it's time consuming but can be worthwhile.
        * Automating oncall scheduling and/or making it self-service will help with team process.
        * Online systems can facilitate communication and status/process tracking.
        * "The best process optimization is elimination."

#### 7.2 Service Life Cycle

* Stages:
    * Service launch
    * Emergency tasks, handling exceptional or unexpected events
    * Nonemergency tasks - manual work as part of the normally functioning systme
    * Upgrades - deploying new releases and platforms
    * Decommissioning - turning off a service, opposite of launch
    * Project work - doing tasks large enough to require allocation of dedicated resources and planning. 

##### 7.2.1 Service Launches

* Maintain a launch checklist or checklists.
* Try to communicate the costs and time allocation of launch to other teams.
* Beyond a checklist is using a Launch Readiness Review
* Sample LRR survey:
    * General: name, date, soft/hard launch
    * Architecture: system architecture docs, failover plan, scaling plans
    * Capacity: initial expected volume, plans for 2x, 5x, etc.; expected bandwidth requirements, and network and storage requirements at 1,3,12 months
    * Dependencies: show dependencies and data flows with other systems; explain any limits on those dependencies and what will happen if they are exceeded, positively show acknowledgement of new service depending on existing services
    * Monitoring: are all subsystems monitored? dashboards? how many false alarm alerts are there? How many real alerts?
    * Documentation: playbooks for operational tasks and alerts? number of documentation related bugs?
    * Oncall: is the oncall schedule complete for n months? How many alerts is each shift likely to get?
    * Disaster preparedness: what if first day is 10x greater than expected? Do backups work? restores tested?
    * Operational hygiene: alert tuning, bugs filed quickly, means of keeping open bugs low
    * Approvals: has everything been approved by necessary people?

##### 7.2.2 Service Decommissioning

* Three major phases:
    * removal of users
    * deallocation of resources
    * disposal of resources

#### 7.3 Organizing Strategy for Operational Teams

* Sources of work:
    * life cycle management
    * interacting with stakeholders
    * process improvement and automation
* Categories of work:
    * Emergency issues
    * Normal requests
    * Project work
* Recommended principle: "people should always be working on projects, with exceptions made to assure that emergency issues receive immediate attention and non-project customer requests are triaged and worked in a timely manner."
* Make one person at any time the lead for emergencies, one lead for normal requests, and everybody else does project work.
* Don't be tempted to silo into subteams along work type lines--the person who should be improving processes is the person using them.
* Project work is best done in small teams. 
* "Solo projects can damage a team by making members feel disconnected or by permitting individuals to work without constructive feedback."
* There is also "meta-work" in the form of meetings, etc.

##### 7.3.1 Team Member Day Types

* Project focused days
    * Mostly spent developing software that automates or optimizes aspects of the team's responsiblities
* Oncall days
    * Working on projects until an alert is received, then working that until it is resolved
* Ticket duty days
    * Working on requests from customers

##### 7.3.2 Other Strategies

* Focus or Theme
    * Picking a category of issues to focus on for a month or two, changing themes periodically or when complete
* Toil reduction
    * ratio of toil to project work should be very low
    * can consider setting a threshold such that if it goes above, the team pauses new features and works to decrease the toil
* Fix-it days
    * days set aside for reducing technical debt

#### 7.4 Virtual Office

* Remotes should communicate their status periodically
* Everyone should be responsible for making sure remotes don't feel isolated

##### 7.4.1 Communication Mechanisms

* Use group chat, voice and video chat, screen sharing applications

##### 7.4.2 Communication Policies

* Make norms for which channels to use in what situations.

### Chapter 8: DevOps Culture

* Basic practice of devops is not having siloed developers and operations people--they work as a team with responsibility for a service or site.
* Arguably devops is the result of needing to be efficient in a cloud environment.
* "If hardware and software are sufficiently fault tolerant, the remaining problems are human."
* From the 2003 paper "Why Do Internet Services Fail, and What Can Be Done about It?" by Oppenheimer, et al.: 
    * "We find that (1) operator error is the largest single cause of failures in two of the three services, (2) operator errors often take a long time to repair, (3) configuration errors are the largest category of operator errors, (4) failures in custom-written front-end software are significant, and (5) more extensive online testing and more thoroughly exposing and detecting component failures would reduce failure rates in at least one service."
* Recommends "The Phoenix Project" book, by Kim, Behr, and Spafford 2013 as novelization of principles behind quality management.

#### 8.1 What is DevOps?

##### 8.1.1 The Traditional Approach

* Waterfall methodology, where information flows downward
* "Unidirectional information flows are the antithesis of DevOps"
* Operational requirements are not considered until late in the process.

##### 8.1.2 The DevOps Approach

* Traditional software development practices don't work real well for high availability.
* Needed to more tightly couple operational concerns and development.
* Web based software introduces features much more rapidly than packaged software.
* Developers and operations people share responsibility for uptime.
* "Team members are largely generalists with deep specialties."

#### 8.2 The Three Ways of DevOps

* Borrows from "lean manufacturing", popularized in "The Phoenix Project"

##### 8.2.1 The First Way: Workflow

* Looks at getting the process correct from beginning to end, and improving the speed of the process.
* The process is thought of as a 'value stream', and speed is 'flow rate' or 'flow'.
* To put an emphasis on getting the process correct from start to end:
    * Ensure each step is done in a repeatable way.
    * Never pass defects to the next step.
    * Ensure no local optimizations degrade global performance.
    * Increase the flow of work by analyzing and improving the repeatable process.

##### 8.2.2 The Second Way: Improve Feedback

* Feedback loops are created when information is communicated upstream or downstream.
* Amplifying feedback loops means making sure that what goes one way is also communicated in the other direction, and feedback is made visible rather than hidden.
* To put an emphasis on amplifying feedback loops:
    * Understand and respond to all customers, internal and external
    * Shorten feedback loops
    * Amplify all feedback
    * Embed knowledge where it is needed

##### 8.2.3 The Third Way: Continual Experimentation and Learning

* You must create a culture where everyone is encouraged to try new things.
* Everybody understands two things:
    * We learn from the failures that happen when we experiment
    * To master a skill requires repetition and practice.
* Within software development this can mean:
    * Rituals are created that reward risk taking.
    * Management allocates time for projects that improve the system
    * Faults are introduced into the system to increase resilience
    * You try crazy or audacious things

##### 8.2.4 Small Batches are Better

* Doing a lot of small releases with a few features rather than a small number of large releases with numerous features.
* Small batches equals high velocity (how many times you ship) and low latency (how long it takes a change to get from dev to production).
* There's a tendency to avoid this because releases feel risky, and we try to avoid risky behavior. You have to do it a lot to practice though.

##### 8.2.5 Adopting the Strategies

* First identify your value streams, the processes done for the business or requested by the business.
* Go through each process from beginning to end several times, ensuring repeatability.
* Once a process is defined, amplify the feedback loops--each step should have a way to raise the visibility of problems so they are worked on, not ignored.
* Find the steps that are the most error prone or slow and replace or rework them.
* Every process has a bottleneck, find it and improve it.

#### 8.3 History of DevOps

* Coined by Patrick Debois in 2008
* Evolved via Agile, pair programming, developers getting access to deployment tools directly via stuff like AWS
* Google started opening up about their SRE stuff

#### 8.4 DevOps Values and Principles

##### 8.4.1 Relationships

* Gives more weight to relationships between teams and various roles in the organization than to the tools and scripts of operations.
* "People over process over tools." Get the right people doing the right process, in order to create the right tool to automate the function.

##### 8.4.2 Integration

* Make sure processes are integrated across teams.
* Operational duties become end-to-end processes that combine tools, data, and people processes.

##### 8.4.3 Automation

* Strive for simplicity and repeatability via automation.
* Treat configurations and scripts as source code, and under version control.
* Building and management of code are automated to the greatest degree possible.

##### 8.4.4 Continuous Improvement

* Goal of any process is to make it dependably repeatable and more functional.
* Look for root causes rather than make local optimizations that degrade global performance.

##### 8.4.5 Common Nontechnical DevOps Practices

* People processes that may be useful:
    * Early collaboration and involvement--bring ops staff into development planning, and make sure developers have access to all ops monitoring.
    * New features review--ops staff help guide development toward best practices for operability
    * Shared oncall responsibilities--pager, but also review of oncall trends. Everyone fully empowered to research any issues that come up.
    * Postmortem process--thorough postmortem or failure analysis for every outage
    * Game day exercises or fire drills--trigger disruptions and failures to actually test the failover and redundancy of the system
    * Error budgets--you need a mechanism for balancing innovation and stability. Until your error budget is exhausted, you can do as many releases as you want. After it is exhausted you may only do emergency security patches.

##### 8.4.6 Common Technical DevOps Practices


