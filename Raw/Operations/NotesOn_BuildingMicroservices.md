# Notes on Building Microservices

By Sam Newman, O'Reilly Media 2015, ISBN 978-1-4919-5035-7

## Chapter 1: Microservices

* Talks about Domain Driven Design by Eric Evans, on representing the real world in code and models.
* Makes some of the core pre-conditions these:
    * Domain-driven design
    * Continuous delivery
    * On-demand virtualization
    * Infrastructure automation
    * Small, autonomous teams
    * Systems at scale
* Says microservices emerge from the world that produced the above

### What are microservices?

* "Small, autonomous services that work together."
* Service boundaries are focused on business boundaries
* By keeping to explicit boundaries, individual components are growth limited
* Size to shoot for: small enough and no smaller.
* If the codebase is too big for a small team, break it down.
* Services get their own resources, and are boxed off from other services
* Inter-service communication is over the network, via APIs

### Key Benefits

* Technology heterogeneity: each service can use whatever stack is best for it
* Resilience: a single component failing doesn't take down the whole thing
* Scaling: components can scale individually
* Ease of deployment: deploying parts of an application is less risky, so can happen more frequently
* Organizational alignment: aligns projects to teams better
* Composability: components can use other components at will
* Optimizing for replaceability: easier to swap out a delineated part

### What about Service-Oriented Architecture?

* Lack of consensus on how to do SOA well
* SOA doesn't really help with splitting big things into small things
* Microservices are a specific approach to SOA

### Other Decompositional Techniques

* Shared libraries make tech heterogeneity difficult, deployment difficult
* Modules are hampered by language dependent lifecycles

## Chapter 2: The Evolutionary Architect

* Should really redefine what architect means in this context
* One analogy the author likes: town planners instead of architects
* Less prescriptive, though still needs insight into places where people are really deviating from a plan
* Sets direction in broad strokes
* Architects shouldn't worry about what happens inside services, but between them
