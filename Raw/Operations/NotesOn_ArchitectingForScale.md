# Notes on Architecting for Scale

## Chapter 1: What is Availability?

* Availability vs reliability:
    * Reliability - ability of a system to perform its intended operations without making a mistake
    * Availability - ability of a system to be around when needed to perform those operations
* Some sources of poor availability:
    * Resource exhaustion
    * Unplanned load-based changes
    * Increased number of moving parts
    * Tech debt

## Chapter 2: Five Focuses of Availability

### The Five Focuses

1. Build systems keeping availability in mind
1. Always think about scaling
1. Mitigate risk
1. Monitor availability
1. Respond to availability issues in a predictable and defined way

### Focus 1: Build systems keeping availability in mind

* Areas of concern:
    * Design - what design decisions impact availability?
    * Dependencies - what do you do when a component fails?
    * Customers - what happens when a component behaves poorly in terms of load, garbage data, DoS?
    * Limiting scope - if a dependency fails, can you provide partial service?

### Focus 2: Always think about scaling

* Build for tomorrow's traffic
* Areas to consider:
    * Ability to increase size and capacity of databases
    * What happens when your storage layer tops out?
    * Build so you can add additional application servers easily, so be careful about where and how state is stored.
    * What can be cached? What can't, and why not?
    * Use offline providers like CDNs for all static traffic.
    * Always consider whether dynamic content can be generated statically.
    
### Focus 3: Mitigate risk

* Some areas of risk:
    * Hardware failure
    * Database corruption
    * Programming or logical errors
    * Network failure or latency
    * Deployment instability
* Keeping a large system highly available is not about removing risk, because at a certain point you simply can't do that. It's about managing how much risk is acceptable and what can be done to mitigate it.
* To do mitigation well, you have to think about what can go wrong and plan for that contingency.

### Focus 4: Monitor availability

* You can't know there's a problem without visibility into it.
* Proper instrumentation is crucial.
* Track performance over time.
* Establish internal, private SLAs for service-to-service communications.

### Focus 5: Respond to availability issues in a predictable and defined way

* Make sure that you are alerted when problems arise
* Have prepared processes for responding to common failure modes
* Make service owners the front line for alerts
* A good escalation plan is also very important.

## Chapter 3: What is Risk Management?

* Risk management involves:
    1. Determining where the risk is within your system
    1. Determining which risk items must be removed, which are acceptable
    1. Mitigating remaining risk to reduce likelihood and severity
* Steps of risk management:
    1. Identify risks: make a list (a 'risk matrix') of all known risks, and prioritize that list
    1. Remove the worst offenders
    1. For major risks that cannot be removed, put together a mitigation plan to reduce the severity or likelihood of the risk occurring.
    1. Review the risk matrix regularly

## Chapter 4: Likelihood vs Severity

* Risks have two components:
    * Severity - cost if the risk occurs
    * Likelihood - chance of the risk happening
* The significance of a risk is the combination of those two factors.
* Risks can be put on a punnet square for severity vs. likelihood
* They are talked about as "low/low", "low/high", "high/low", "high/high"

## Chapter 5: The Risk Matrix

* Risk matrix is a spreadsheet with a view of all known system risks
* For each item, record:
    * Risk id - some unique identifier
    * System - name of the system, subsystem, or module that contains it
    * Owner - name of a person or team
    * Description - summary of the risk
    * Date identified
    * Likelihood - value identifying the likelihood
    * Severity - value identifying the severity
    * Mitigation plan - description of any mitigations that can be used
    * Status - something like "active", "mitigated", "fixed", etc.
    * ETA - when is the final resolution planned, if known?
    * Monitoring - is there monitoring in place for this risk?
    * Triggered plan - if the risk happens, what's the plan at a management level?
    * Comment 
    * Tracking id - link to bug tracking issues
* Scope of the risk matrix:
    * Possible to have them at the company level, team level, service level
    * Author prefers team level because it meshes well with work prioritization
* Brainstorm for the risk matrix:
    * Meet with the dev team
    * Look at support volume
    * Consider known threat vectors and system vulnerabilities
    * Look through the feature backlog for health critical features
    * Consider known performance issues in the system
    * Talk to internal users, dependent teams, QA, etc.
    * Consider any known technical debt
* Using the risk matrix:
    * refer to it when doing planning at the org or team level
* Maintaining the risk matrix by performing periodic reviews:
    1. Look for new risks
    1. Remove old/stale risks
    1. Update likelihood and severity as applicable
    1. Review the top risks
    1. Review less critical risks
* Make sure to share the risk matrix with product teams and other stakeholders

## Chapter 6: Using Microservices

* Service - distinct, enclosed system that provides functionality in support of building one or more larger products
* Services meet these criteria:
    1. They have their own code base
    1. They encapsulate their own data (if they maintain state)
    1. It provides its capabilities to consumer services via an API
    1. It uses other services' APIs
    1. It has a single owner (individual or team)
* Guidelines for determining service boundaries:
    1. Are there specific business requirements (accounting, security, regulatory) that determine where a boundary should fall?
    1. Is the team that owns the functionality distinct and separable?
    1. Is the data a service manages naturally separable? Does siloing the data overburden other aspects of the system?
    1. Does it provide shared capabilities that may require shared data?

## Chapter 7: Two Mistakes High

* "Two mistakes high" is a model airplane thing, meaning that you should keep your plane high enough that you can recover from two independent mistakes before hitting the ground.
* Applying this to HA systems: 
    * Walk through the ramifications of failure scenarios and their recovery plans
    * Make sure the recovery plans don't have mistakes built into them
    * Make sure the recovery plans actually work.

### Example: Losing a Node

* Building a service designed to handle 1k req/sec
* A single node can handle 300 req/sec
* How many nodes are necessary for that load?

```
                  number of requests
necessary nodes = ------------------
                  requests per node

                    1000 req/sec
necessary nodes = ------------------ = 3.3 = 4 nodes
                    300 req/sec
```

* That puts each node at 250 req/sec, but during a node failure that jumps to 334 req/sec, which is over capacity.
* Implies you need 5 nodes to survive a node failure, or 6 for a multi-node failure, or a node failure during maintenance of a different node.

### Example: Data center resiliency

* Service is at 10k req/sec, nodes still at 300
* Needs 34 nodes with no consideration of redundancy/resiliency
* Bump it to 40 nodes for extra capacity
* Split those across 4 data centers to do redundancy
* You're good for node level redundancy, but not if a data center drops
* How many servers do we need to survive a data center loss?

```
                        min number of servers
nodes per data center = ----------------------
                        number of data centers

                         34
nodes per data center = ----- = 11.333 = 12 servers/data center
                         4-1

12 nodes per DC * 4 DC = 48 nodes total
```

* The more data centers you have, the fewer total nodes are necessary to survive a data center loss
* There may be shared failure types that are hidden by some abstraction. For instance, a rack of servers may share a power supply. You have some number of healthy nodes, the PS dies, all your nodes go dark in that DC or rack.
* There can be failure loops, where a problem causes the system to fail in a way that makes it hard or impossible to fix without causing a worse problem to happen. Make sure your plans can be executed even _while the risk is occurring_.
* Don't ignore problems. They don't go away and can screw with your plans.
* "If it touches production, it _is_ production."

## Chapter 8: Service Ownership

### Single Team Owned Service Architecture (STOSA)

* To meet this definition of STOSA:
    * Have an app constructed using a service based architecture
    * Have multiple development teams
    * All services must be assigned to a dev team
    * No service is assigned to more than one dev team
    * Individual teams may own more than one service
    * Teams are responsible for all aspects of managing the service, from architecture, to development, testing, deployment, monitoring, and incident resolution.
    * Services have strong boundaries between them, including well documented APIs
* Teams are generally between 3 and 8 people.

### What does it mean to be a service owner?

* Ultimately the owning team is responsible for:
    * API Design - design, implementation, testing, and version management of all APIs, internal and external, that the service exposes.
    * Service Development - design, implementation, and testing of the service's business logic and business responsibilities.
    * Data - management of all data that the service owns and persists, its representation and schema, access patterns, and lifecycle.
    * Deployments - process of determining when and if a service update is required, and the deployment of new software to the service, including verification and rollback of all service nodes and the availability of the service during the deployment.
    * Deployment windows - when it is safe and when it is not safe to deploy. Includes enforcing company/product wide blackouts as well as service specific windows.
    * Production changes - all prod changes needed by the service, like load balancer settings, system tuning, etc.
    * Environments - managing the production environment, along with all dev, staging, and pre-production deployment environments for the service.
    * Service SLAs - negotiating, setting, and monitoring service-level SLAs, along with teh responsibility of keeping the service operating within those SLAs.
    * Monitoring - making sure monitoring is setup and managed for all appropriate aspects of the service. Reviewing the monitoring on a regular and consistent basis.
    * Oncall / incident response - Making sure pager events are generated when the system begins to function out-of-specification. Providing oncall rotation and pager management to make sure someone from the team is available to handle incidents. Handling incidents within prescribed SLA boundaries for incident responsiveness.
    * Reporting - internal reporting to other teams (consumers and dependencies) as well as management reporting on the operational health of the service.
* Often some items are owned by a shared infrastructure, tools, or operations team:
    * Servers/hardware - hardware and infrastructure needed to run prod and all supporting environments
    * Tooling - may include deployment tools, monitoring tools, oncall and IR tools, reporting tools
    * Databases - hardware and db applications
* Service owning teams are ultimately responsible for all aspects of the services they own operating as required.
* With strong ownership of results comes strong ownership of decision making impacting your service.
