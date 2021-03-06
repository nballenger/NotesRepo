# Notes on Cloud Architecture Patterns

By: Bill Wilder; Publisher: O'Reilly Media, Inc.; Pub. Date: September 28, 2012

Print ISBN-13: 978-1-4493-1977-9

## Preface

* Book is focused on cloud-native apps, for scalability, efficiency, stability
* None of the patterns are cloud specific, just cloud relevant
* Author got very into Azure, became a consultant.
* Focused on when and why to employ patterns, not so much how
* Building Page of Photos on Windows Azure
    * Demo app called Page of Photos (PoP) is used throughout book
    * App lets anyone create an account and add photos to that account
    * Each account gets it own url, at a folder name
    * Features added in the Example section of each chapter

## Chapter 1: Scalability Primer

* Two primary approaches: vertical and horizontal
* Vertical is simpler, horizontal goes further
* This chapter assumes scaling a distributed, multi-tier web app.

### Scalability Defined

* 'scalability': number of concurrent users an app can support
* 'nodes' are broken down into 'compute nodes' and 'data nodes'
* 'Node' can mean a physical server, a virt, or a cluster--underlying resource
doesn't typically matter much, since you should be decoupled from it.
* Vertical scaling increases resources per node, horizontal adds nodes
* Vertically Scaling Up
    * Limited by the utilizable capacity of available hardware.
    * Sufficiently capable hardware may not exist.
    * Hardware changes often mean downtime.
* Horizontally Scaling Out
    * Added nodes typically have the same capacity
    * Requires more coordination and architecture
    * Nodes are generally allocated to a specific function
    * Nodes within a function are typically homogeneous
    * Autonomy between nodes is important to efficient functioning
    * Horizontal scaling is limited by the efficiency of added nodes.
* Describing Scalability
    * "Scales to X users" is not granular enough
    * Need to look at concurrent users and response time.
    * May need to look at those metrics by use case or feature
* The Scale Unit
    * The combination of resources that need to be scaled together comprises
      a 'scale unit'--per 100 concurrent users, you need 2 web server nodes,
      one application service node, and 100M of disk space, for example.

### Resource Contention Limits Scalability

* "Scalability problems are resource contention problems."
* Easing Resource Contention
    * Two ways to ease contention: don't use resources so fast, or add more
    * Application and communication changes are 'algorithmic improvements'
    * Adding capacity is 'hardware improvements'

### Scalability is a Business Concern

* Network latency (real or perceived) is a big deal to end users.

### The Cloud-Native Application

* Cloud Platform Defined - Following characteristics of a cloud platform make cloud-native possible:
    * Enabled by (the illusion of) infinite resources, limited by the max
        capacity of individual virts, cloud scaling is horizontal
    * Enabled by a short-term resource rental model, releases resources as
        easily as it adds them
    * Enabled by a metered, pay-for-use model, you only pay for what you use
    * Enabled by self-service, on-demand, programmatic provisioning and
        releasing of resources, so it can be automated
    * Enabled and constrained by multitenant services running on commodity
        hardware, cloud apps are optimized for cost, not reliability
    * Enabled by a rich ecosystem of managed platform services such as for
       virtual machines, data storage, messaging, and networking. Makes
       app development simpler overall.
* Cloud-Native Application Defined - Assumed to have the following properties, as applicable:
    * Leverages cloud platform for reliable, scalable infrastructure.
    * Uses non-blocking, asynchronous communication, in a loosely coupled arch
    * Scales horizontally, adding / subtracting resources with demand
    * Cost-optimizes to run efficiently, not wasting resources
    * Handles scaling events without downtime or user experience degradation
    * Handles transient failures without user experience degradation
    * Handles node failures without downtime
    * Uses geographical distribution to minimize network latency
    * Upgrades without downtime.
    * Scales automatically using proactive and reactive actions
    * Monitors and manages application logs even as nodes come and go.
    * Two terms: Platform-as-a-Service (PaaS), Infrastructure-as-a-Service (IaaS)
    * "It is the application architecture that makes an application cloud-native,
      not the choice of platform."

## Chapter 2: Horizontally Scaling Compute Pattern
  
* "The key to efficiently utilizing resources is stateless autonomous compute nodes. Stateless nodes do not imply a stateless application."

### Context

* This pattern deals with the following challenges:
    * Cost-efficient scaling of compute nodes is required (web or service tier)
    * App capacity requirements exceed capacity of a single compute node
    * App capacity requirements vary over time; are subject to spikes
    * App compute nodes require minimal downtime
* Typically used in combination with Node Termination and Auto Scaling patterns

### Impact
  
* Availability, Cost Optimization, Scalability, User Experience

### Mechanics
  
* As requirements change you add or release nodes.
* You have to be careful about managing user session state, and maintaining
    operational efficiency.
* Cloud Scaling is Reversible
    * If you buy machines you can't send them back--virts can be turned off.
* Managing Session State
    * Session State Varies by Application Tier
        * Terms:
            * 'web tier': runs web servers, accessible to end users, serves content
            * 'load balancer': traffic cop for web tier connections
            * 'web service': functionality provided via HTTP/S, with REST or SOAP
            * 'service tier': tier hosting application/business logic that is 
              accessible to the web tier, but not from outside sources directly
            * 'data tier': business data stored in persistent structures
    * Sticky Sessions in the Web Tier
        * Some web apps assign a user to a web node the first time they visit, and
        that node serves all requests from that user. The load balancer points
        the user at the node, and the web node stores session state.
        * If that happens, that node is no longer stateless.
        * "Cloud-native applications do not need sticky session support."
    * Stateful node challenges
        * If a stateful node goes down, user state goes with it.
        * Sessions may be unevenly distributed between nodes over time.
    * Session state without stateful nodes
        * Avoid storing user state locally
        * Small amounts of state data can be stored in a cookie
        * If that's inefficient, the cookie can hold a session identifier that can
        be used to retrieve and reinflate state from the server on each request
        * A distributed cache service can be used for session state
    * Stateless service nodes in the service tier
        * Service tier nodes don't have public endpoints, do not rely on session
            info to provide services--they're stateless
* Managing Many Nodes
    * Efficient management enables horizontal scaling
        * You need a node image for each node type, with the application code
        * With IaaS you build a virtual machine image, with PaaS you build a
        web application (or cloud service)
        * Make sure to keep nodes as homogeneous as possible.
    * Capacity planning for large scale
        * If you offload infrastructure to the cloud, and plan wrong, changing
            the amount of capacity you have access to is easy (if you can make
            those calls in a fairly agile fashion)
    * Sizing virtual machines
        * Make sure the virt you choose is sized for your app.
        * Often the optimal size is the smallest one that works well, which you
            can really only establish by testing.
        * Sizing is done independently for each compute node type.
    * Failure is partial
        * Losing a node should never be problematic; no single points of failure
    * Operational data collection
        * Logging data has to be collected and aggregated.
        * Logging in a horizontally scaled environment can be expensive/complex


## Chapter 3: Queue-Centric Workflow Pattern

* Pattern for loose coupling, focused on async delivery of command requests
sent from the UI to a back end service for processing
* This pattern is a subset of the CQRS pattern
* Lets interactive users make updates through the web tier without slowing
down the web server. Useful for updates that are resource/time intensive
* Used in response to an update request from an interactive user.
* Logic flow:
    * UI/web tier code creates a message describing work to do for an update
    * message goes into a queue
    * at some future time, a service on another node (service tier) takes it off
* Sender does not wait for response--none is directly available.

### Context

* Effective for the following challenges:
    * App is decoupled across tiers, though the tiers need to collaborate
    * App needs to guarantee at-least-once processing of messages across tiers
    * A consistently responsive UI is expected in web tier, even with processing
      happening in other tiers
    * Consistently responsive UI expected, even though third party services
      are involved during processing
* Cloud Significance
    * Infrastructure for this pattern in the cloud is pretty straightforward.
    * Storage of intermediate data is simplified by cloud services.

### Impact

* Availability, Reliability, Scalability, User Experience

### Mechanics

* Decouples communication between web tier and service tier
* If you don't do this, UI code will often talk directly to services, but that
involves severe complications if the service tier is slow or overworked
* Doing async communication solves the responsiveness problem
* Queues are Reliable
    * Reliability comes from two things: durability of data, and high throughput
* Programming Model for Receiver
    * Model for a reliable queue service to ensure at least once processing
        1. Get the next available message from the queue
        2. Process the message
        3. Delete the message from the queue
    * Invisibility Window and at-least-once processing
        * If there's a processing failure, you need the message to be back in 
            the queue
        * There's a window after dequeueing in which the message is invisible 
            to other receivers, and if not deleted will reappear in the queue
        * Code keeps trying until a successful processing occurs, or some other
            failure state is reached
    * Idempotent processing for repeat messages
        * Make your message processing idempotent.
        * In the case of long running processing, update the message on the queue
            in steps until completion occurs, to keep it invisible.
    * Poison messages handling for excessive repeats
        * A message that cannot be processed is 'poison'
        * Cloud queueing services tell you a dequeue count for each message, and if
            that rises above a certain threshold you can either kill the message or
            enter a different kind of processing state.
* User Experience Implications
    * Problem: need to make users understand that even though you've acknowledged
      receipt of their message, the state change it implies may not have happened
    * Options for dealing with this include emailing on completion (your order
      has shipped), letting them wait while polling for completion either
      repeatedly or with a long polling response time from the server
    * Long polling is also known as 'Comet') Socket.IO is one
    * Queue Centric Workflow (QCW) is a stepping stone to the Command Query
      Responsibility Segregation (CQRS) pattern
    * CQRS has two distinct models: write and read (command and query). A command
      is a request to make an update via the write model, a query is a request
      for information from the read model.
    * Serving commands and queries are distinct activities (responsibility
      segregation), and they surface different data models.
    * QCW focuses on flow of commands to the write model, doesn't fully 
      articulate the read model.
    * A full CQRS treatment would include event sourcing and Domain Driven
      Design (DDD). Event sourcing means issuing change events on actual update,
      and recording those change events such that you can replay them as a
      write log. DDD is a technology agnostic methodology for understanding
      business context.
* Scaling Tiers Independently
    * Queue length and time messages spend in the queue are good metrics for
      auto-scaling. Specific signals may indicate only one tier needs scaling, 
      or multiple tiers.
    * At very high scale, the queue can become a bottleneck.


## Chapter 4: Auto-Scaling Pattern

* Automatically scaling can do a better job of cost optimization than manual
* Goals of auto-scaling are to optimize resources used and minimize human
    intervention.

### Context

* Pattern is effective in dealing with these challenges:
    * Cost-efficient scaling of computational resources
    * Continuous monitoring of fluctuating resources is needed to maximize
      cost savings, avoid delays
    * Frequent scaling requirements involve cloud resources such as compute
      nodes, data storage, queues, or other elastic components.
* Cloud Significance
    * Cloud platforms have rich tools for automation of devops tasks.

### Impact

* Cost Optimization, Scalability
* Doesn't impact application scalability, just infrastructure scaling

### Mechanics

* Compute nodes are the most common resource to scale.
* Auto-scaling requires you to schedule known events and create rules that
  react to environmental signals like surges or drops in usage.
* Automation Based on Rules and Signals
    * Auto-scaling has costs of its own: probing for environmental signals,
      using a SaaS to process those and perform the scaling, etc.
    * Common rules involve scaling around hours of peak usage, queue size,
      length of time messages are spending in the queue, resource usage
    * Scaling solution must support rule prioritization, and might support
      rules based on cost and budget
* Separate Concerns
    * You should be able to independently scale the concerns in your architecture
* Be Responsive to Horizontally Scaling Out
    * Consider the time it will take to actually perform scaling, and plan
      accordingly--go to N+1 instead of N, for instance.
* Don't Be Too Responsive to Horizontally Scaling In
    * Billing may be per hour, so don't scale in till just before the end of
      the billing period.
    * Recognize that if you scale to a single node, you create a single point
      of failure, and the cloud is built on commodity hardware.
* Set Limits, Overriding as Needed
    * Have upper and lower scaling boundaries to limit permitted autoscaling
    * For tricky things that require human intervention, have auto-scaling alert
    * Note that the uptime SLAs for cloud providers typically want you to have
      at least two nodes of a given type running before they can guarantee uptime
* Take Note of Platform-Enforced Scaling Limits
    * New accounts typically have default scaling limits to keep you from scaling
      out to a huge number of nodes by accident.
    * You can ask for limits to be lifted if you know what you're doing 

## Chapter 5: Eventual Consistency Primer

* This section covers CAP theorem.

### CAP Theorem and Eventual Consistency
  
* Guarantees for data involve tradeoffs between:
    * Consistency
    * Availability
    * Partition tolerance
* Relational ACID and NoSQL BASE
    * ACID is:
        * Atomicity
        * Consistency
        * Isolation
        * Durability
    * BASE is:
        * Basically Available
        * Soft state
        * Eventually consistent
* Impact of Eventual Consistency on Application Logic
    * You get to be responsible for data quality! Yay!

## Chapter 6: MapReduce Pattern

* Pattern with two functions, mapper and reducer
* Each can be run in multiple, parallel instances
* Output of mapper goes to input of reducer
* Mapper is data local, reducer is aggregated

## Chapter 7: Database Sharding Pattern

* Horizontally scaling data through sharding
* Start with a single database, divvy up data across two or more databases
* Most data is distributed so each row appears in exactly one shard
  
### Context

* Effective at dealing with:
    * App database query volume exceeds query capability of a single db node
    * App db update volume exceeds transactional capabilty of a single node
    * App db network bandwidth exceeds that available to a single db node
    * App db storage requirements exceed capacity of a single db node

### Impact
  
* Scalability, User Experience

### Mechanics

* Many approaches. Examples:
    * Distributing query load to slaves
    * Splitting databases by type of data
    * Vertical scaling of the database server
* Cloud-native option is sharding
* Shards should be autonomous, implement a 'shared nothing' architecture
* Cross-shard transactions are not supported; shards don't reference others
* Shard Identification
    * A db column designated the shard key determines which shard stores any
      particular database row, and you need the shard key to get the data
    * Some sort of hashing system does the distribution to shards.
* Shard Distribution
    * Sharding for performance, make all shards have equal amounts of data
    * For scalability or query performance, add shards before nodes are slow
    * Important that a single shard can satisfy most common database ops
* When Not to Shard
    * Schemas designed for cloud-native applications will support sharding,
      but don't assume a particular solution will do so.
    * Optimization, indexing, query tuning, caching are all important
* Not All Tables Are Sharded
    * Some tables aren't sharded, but replicated into each shard.
    * Basically lookup tables.
    * Sharded tables are usually those with the most data and traffic
* Cloud Database Instances
    * Don't assume timestamps will be congruent across systems
    * Could databases run on UTC, not local time, so application code must
      translate from UTC to local time to display timestamps.

## Chapter 8: Multitenancy and Commodity Hardware Primer

### Multitenancy

* Means there are multiple tenants on a system. Duh.
* Makes sense since most db servers (for example) actually run under-
    utilized in a single tenant scenario.
* Security
    * Individual tenants are sandboxed.
* Performance Management
    * Applications in multitenant environments compete for system resources.
    * The cloud platform should do fair resource allocation.
* Impact of Multitenancy on Application Logic
    * Bursts of traffic/computation may require the cloud platform to rebalance
      how tenants are distributed. During that process there may be transient
      failures.

### Commodity Hardware

* Hardware with best value-to-cost ratio.
* Shift in Emphasis from MTBF to MTTR
    * MTBF: mean time between failures
    * MTTR: mean time to recovery
    * "Hardware failure is inevitable, but not frequent."
* Impact of Commodity Hardware on Application Logic
    * Plan for the possibility of transient physical failures.
    * Use a message queue to avoid transit losses, use redundant nodes and AZs
      to avoid geographic outages
* Homogeneous Hardware
    * You don't really have to care about it, because it's the cloud provider's
      problem to solve.

## Chapter 9: Busy Signal Pattern
  
* Focuses on how an app should react when a cloud service responds to a request
    with a busy signal rather than success.
* Typical reason for busy signal is the service node is over capacity

### Context

* Effective at dealing with:
    * App uses cloud services not guaranteed to respond successfully every time.
* Cloud Significance
    * Cloud apps will experience transient failures. Plan for it.

### Impact
  
* Availability, Scalability, User Experience

### Mechanics

