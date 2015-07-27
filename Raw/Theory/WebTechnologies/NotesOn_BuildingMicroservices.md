# Notes on Building Microservices

By Sam Newman, O'Reilly, 2015

## Chapter 1: Microservices

* Book is about how to build, manage, evolve microservices
* Supposedly they give flexibility, freedom to change

### What are Microservices?

* "Small, autonomous services that work together."
* Focused on doing one thing well.
* Monolithic systems will tend to evolve abstractions or modules to fight replication of common code, create cohesion
* Robert C. Martin's 'Single Responsiblity Principle': "Gather together those things that change for the same reason, and separate those things that change for different reasons."
* Focus service boundaries on business boundaries, makes finding things easier, keeps code from creeping in scope
* Make them "small enough and no smaller"
* If the codebase is too big to be managed by a small team, it might need to be broken down.
* Microservices should be autonomous
* All communication between services is through network calls
* Need to be able to change independently, without requiring consumers to change
* Each service has an API
* Golden rule of decoupling: Can you make a change to a service and deploy it by itself without changing everything else?

### Key Benefits

* Each service can use the most appropriate technology
* Failures don't tend to cascade
* Scaling can happen on a per-service basis
* Deployment is typically much simpler
* Small codebases mean small teams, makes the organization easier to manage
* Functionality is much more composable/remixable
* Services are much more pluggable / replaceable than big chunks of a single app

### What about Service-Oriented Architecture?

* Lack of consensus on how to do SOA well
* Many problems associated with SOA are actually problems with things like communications protocols (SOAP, eg), vendor middleware, lack of guidance about service granularity, or wrong guidance on picking places to split your system.
* Think of microservices as a specific approach to SOA

### Other decompositional techniques

* Shared libraries
    * you lose technology heterogeneity
    * deployment becomes constrained by library deployment
    * lack of separations where you could implement safety measures for resiliency
* Modules
    * Can be good, but support is extremely varied across languages
    * In practice, modules tend to become tightly coupled with other code

### No Silver Bullet

* Solving software problems is still hard.


## Chapter 2: The Evolutionary Architect

### Inaccurate Comparisons

* "Architect" isn't really an appropriate term for what people do with software
* It's borrowed from other professions and invites inaccurate comparisons
* Quote: 

> Perhaps the term architect has done the most harm. The idea of someone who draws up detailed plans for others to interpret, and expects this to be carried out. The balance of part artist, part engineer, overseeing the creation of what is normally a singular vision, with all other viewpoints being subservient, except for the occasional objection from the structural engineer regarding the laws of physics. In our industry, this view of the architect leads to some terrible practices. Diagram after diagram, page after page of documentation, created with a view to inform the construction of the perfect system, without taking into account the fundamentally unknowable future. Utterly devoid of any understanding as to how hard it will be to implement, or whether or not it will actually work, let alone having any ability to change as we learn more.

### An Evolutionary Vision for the Architect

* Architects need to shift away from creating a perfect end product, and focus on helping create a framework in which the right systems can emerge, and continue to grow as we learn more.
* One analogy the author likes to the role of an IT architect, from Erik Doernenburg: "Think of our role more as town planners than architects for the built environment."
* "Look at a multitude of sources of information, and then attempt to optimize the layout of a city to best suit the needs of the citizens today, taking into account future use."
* "The town planner does his best to anticipate [...] changes, but accepts that trying to exert direct control over all aspects of what happens is futile."
* Frank Bushchmann: "architects have a duty to ensure that the system his _habitable_ for developers [in addition to users]"

### Zoning

* If we're town planners, what are the zones? Service boundaries, or coarse grained groups of services.
* Architects worry less about what happens inside a zone than what happens between zones--think about how services talk to each other, monitor overall health of the system.
* There's some oversight to exert within zones--you may need to restrict technological choice somewhat to make it easier to move people across teams, for instance.
* For the most part though the between-zones connections are what needs the most management: data interchange formats, api documentation, etc.
* Guideline: "be worried about what happens between the boxes, and be liberal in what happens inside."

### A Principled Approach

* Good way to frame decision making is around a set of principles and practices, based on goals we're trying to achieve.
* Strategic goals
    * Speak to where the company is going
    * High level goals, may not include technology at all
* Principles
    * Rules made to align to some larger goal, may be subject to change
    * Ex: goal of expanding into international markets, principle of enforcing internationalization support across all services.
    * Fewer than 10 principles is a good number. Small enough to remember.
* Practices
    * Detailed, practical guidance for performing tasks
    * Often technology specific, low level enough for developers to use
    * Ex: coding guidelines, standard network protocol, etc.
    * Sometimes reflect constraints within the organization.
* Combining principles and practices
    * Distinction may be hazy, which is ok
    * Key point is having overarching ideas that guide how the system evolves, but also enough detail so people know how to implement those ideas.
    * The bigger the team/org, the more likely principles and practices will be / should be separated

### Real world example

```
       Strategic goals                         Architectural Principles          Design / Delivery Practices    
                                                                                                                
+---------------------------------+   +--------------------------------------+   +-----------------------------+
|                                 |   |                                      |   |                             |
|  Enable scalable business       |   | Reduce Inertia                       |   | Standard REST/HTTP          |
|  ------------------------       |   | ------------------                   |   |                             |
|  More customers/transactions    |   | Make changes that favor rapid        |   | Encapsulate legacy          |
|  Self-service for customers     |   | feedback and change, with            |   |                             |
|                                 |   | reduced dependencies across          |   | Eliminate integration dbs   |
|                                 |   | teams                                |   |                             |
|  Support entry into new mkts    |   |                                      |   | Consolidate / cleanse data  |
|  ---------------------------    |   | Eliminate Accidental                 |   |                             |
|  Flexible operational processes |   | Complexity                           |   | Published integration model |
|  New products and operational   |   | --------+------------                |   |                             |
|  processes                      |   | Aggressively retire and replace      |   | Small independent services  |
|                                 |   | unnecessarily complex processes,     |   |                             |
|  Support innovation in          |   | systems, and integrations so that    |   | Continuous deployment       |
|  existing markets               |   | we can focus on the essential        |   |                             |
|  ----------------------------   |   | complexity                           |   | Minimial customization of   |
|  Flexible operational processes |   |                                      |   | COTS/SAAS                   |
|  New products / operational     |   | Consistent UI/Data Flows             |   |                             |
|  processes                      |   | ------------------------             |   |                             |
|                                 |   | Eliminate duplication of data and    |   |                             |
|                                 |   | create clear systems of record, with |   |                             |
|                                 |   | consistent integration interfaces    |   |                             |
|                                 |   |                                      |   |                             |
|                                 |   | No silver bullets                    |   |                             |
|                                 |   | ------ ------------------            |   |                             |
|                                 |   | Off the shelf solutions deliver      |   |                             |
|                                 |   | early value but create inertia       |   |                             |
|                                 |   | and accidental complexity            |   |                             |
|                                 |   |                                      |   |                             |
|                                 |   |                                      |   |                             |
+---------------------------------+   +--------------------------------------+   +-----------------------------+
```

### The Required Standard

* One way to figure out what should be constant from service to service is to ask, "What is a good citizen service in this system?"
* Defining clear attributes that each service should have is a way of being clear about the balance between autonomy and citizenship
* Monitoring
    * Cross-service system health is crucial, and metrics are the bedrock of that
    * Everybody needs to contribute metrics, preferably in the same way
    * Health metrics definitely need to emit in the same way across all services
* Interfaces
    * Pick a small number of interface technologies (one standard is good, two is ok)
    * Define how you'll use it--if you use HTTP/REST, do you use verbs or nouns? How is pagination done?
* Architectural safety
    * Services should shield themselves from downstream failures
    * Services not handling downstream failures makes the system fragile
    * Play by the rules on response codes--common agreement on how HTTP codes are used

### Governance through code

* Make it easy to do the right thing
* Two good techniques: exemplars and service templates
* Exemplars
    * If you have standards and best practices, provide runnable examples
    * Make copy/paste from exemplars a reasonably safe practice
    * Use real world examples, not perfect-world examples
* Tailured Service Template
    * Make working reference services that are easy to clone
    * Make sure they reflect your development practices
    * At least one for each technology stack
    * Don't let creating the service template be something a central team does
    * Defining shared practices should be a collective activity
    * Ideally, the use of a template should be optional and not forced.
    * Don't couple services to the template!

### Technical Debt

* Tech debt is a reality of all systems, and largely isn't a result of bad actors or mistakes
* Architects should have some view as to the level of debt that exists
* Have teams decide how to track and pay down the debt if possible

### Exception Handling

* What happens when the system deviates from principles and practices?
* May want to keep a log of those instances
* If enough exceptions are found, might be time to change the principle or practice

### Governance and Leading from the Center

* Part of what architects need to handle is 'governance'
* Control Objectives for Information and Related Technology (COBIT) definition of governance:

> Governance ensures that enterprise objectives are achieved by evaluating stakeholder needs, conditions and options; setting direction through prioritization and decision making; and monitoring performance, combliance and progress against agreed-on direction and objectives.

* Governance is a group activity, whether it's higly structured or not
* "[The] group needs to be led by a technologist, and to consist predominantly of people who are executing the work being governed. This group should also be responsible for tracking and managing technical risks."
* Model the author prefers: architect chairs the group, but bulk of the group is technologists from each delivery team. Architect is responsible for leading the group, group is responsible for governance.
* In disagreements, consider taking the group's decision when possible, even if you disagree. Doing so empower people, and there's wisdom in a group that you may have missed.

### Building a Team

* Help the people around you with their career growth
* Make sure you're having people take ownership of their services


## Chapter 3: How to Model Services

### Introducing MusicCorp

* Fictional domain that appears throughout the book
* MC was recently brick and mortar, recently turned attention to online sales
* Has a website, but now wants to get heavily into the online world
* Wants to be able to make changes as easily as possible.

### What Makes a Good Service?

* Loose Coupling
    * Changes to one service should not require changes to another
    * Loosely coupled service knows as little as it needs to about the services it collaborates with
    * Limit the number of different types of inter-service calls: "chatty communication can lead to tight coupling"
* High Cohesion
    * Related behavior gotes together, unrelated behavior goes elsewhere
* "So we want to find boundaries within our problem domain that help ensure that related behavior is in one place, adn that communicate with other boundaries as loosely as possible."

### The Bounded Context

* Idea from Eric Evans's book Domain-Driven Design
* "Bounded context" -- "[A]ny given domain consists of multiple bounded contexts, and residing within each are things that do not need to be communicated outside as well as things that are shared externally with other bounded contexts. Each bounded context has an explicit interface, where it decides what models to share with other contexts."
* Additional definition: "a specific responsibility enforced by explicit boundaries"
* Using a bounded context means communicating with its explicit boundary using models
* Some models will be published to the outside world, and some will be entirely internal to the context, depending on need to know.
* Not sharing the internal models of a service (or context) helps avoid tight coupling--if you don't know about the internal representations of data, you can't write an outside service that acts on those assumptions.
* "In general, microservices should cleanly align to bounded contexts."
* "If our service boundaries align to the bounded contexts in our domain, and our microservices represent those bounded contexts, we are off to an excellent start in ensuring that our microservices are loosely coupled and strongly cohesive."
* Be cautious about prematurely decomposing your domain into contexts/services. It can be easy to have a model-based approach stray from the use cases that will inform the contexts, so do your best to stay true to actual use cases.

### Business Capabilities

* To think about bounded contexts of your org, think about the capabilities those context provide the rest of the domain, rather than the data they share.
* Ask first what the context _does_, then ask what data it needs to do that well.

### Turtles All the Way Down

* Coarse grained bounded contexts (which you'll identify early) probably contain more refined bounded contexts.
* When you're considering boundaries, first do big, coarse grained contexts, then subdivide nested contexts when you need the benefits of doing so.
* Consider allowing nested contexts to remain hidden outside the coarse grained context.
* Whether you choose to use nested contexts or all top level contexts should be based on your organizational structure. If a service has a team devoted to it, it's probably a top-level service.
* Note that using coarse contexts with nested subcontexts can simplify testing, since exterior consumers only have to stub the coarse service, not its subcomponents.

### Communication in Terms of Business Concepts

* If our systems are decomposed along bounded contexts, it's more likely that requested ehanges will be contained to a small number of contexts, which allows faster, safer iteration.
* "Think of the communication between [...] microservices in terms of [...] business concepts. The modeling of your software after your business domain shouldn't stop at the idea of bounded contexts. The same terms and ideas that are shared between parts of your organization should be reflected in your interfaces."

### The Technical Boundary

* Example of incorrectly modeled services, and accompanying problems
* Small system grew, picked up features and users, company wanted to add capacity to the team by offshoring. They split the app into a stateless front end making calls to an RPC based back end over a data store.
* Changes had to be made frequently to both services. RPC was brittle, the interconnection was too verbose which dragged down performance. Both contributed to adding additional layers of RPC-batching, etc.
* "Rather than taking a vertical, business-focused slice through the stack, the team picked what was previously an in-process API and made a horizontal slice."
* It _can_ make sense to split on technical seams when, for instance, performance is paramount. However, look at splitting there _after_ you look at splitting for business reasons.

## Chapter 4: Integration

* "Getting integration right is the single most important aspect of the technology associated with microservices in my opinion. Do it well, and your microservices retain their autonomy, allowing you to change and release them independent of the whole."

### Looking for Ideal Integration Technology

* Thinking about what we want out of the tech we pick (from SOAP, XML-RPC, REST, protocol buffers, etc).
* **Avoid Breaking Changes** - pick tech that makes breaking changes as rare as possible. Ex: a service adds fields to an object description, integration tech shouldn't freak out about it
* **Keep your APIs Technology-Agnostic** - Avoid integration technology that dictates the tech stacks inside the microservices
* **Make Your Service Simple for Consumers** - Be careful about how far you go in providing client libraries, because that encourages tight coupling.
* **Hide Internal Implementation Detail** - The less you expose of the internals of a service, the less consumers can couple to accidentally or on purpose.

### Interfacing with Customers

* Example used here is going to be different ways of working with customers in the example company (MusicCorp). Focus will be selecting integration tech.

### The Shared Database

* Very common form of integration. Fast to start with, which probably explains popularity as a choice.
* Issues:
    * Allows external parties to view and bind to internal implementation details (by giving them read/write to the same tables your service uses).
    * DB becomes a very large, shared API that's incredibly brittle.
    * Consumers become tied to a specific technology choice
    * Cohesion suffers as multiple services/apps become responsible for changing the same data, so a sweeping change has to be implemented in all those places.
* **Avoid this integration method at all costs.**

### Synchronous vs. Asynchronous

* Question: should communication be synchronous or asynchronous?
* Easier to think through synchronous communication
* Async is great for long running jobs, low latency, preventing blocking network IO
* Async takes more thought and work to get right.
* Synchronous encourages request/response based collaboration between services
* Async encourages event-based collaboration
* Event-based pattern: "Instead of a client initiating requests asking for things to be done, it instead says _this thing happened_ and expects other parties to know what to do. [...] Event-based systems by their nature are asynchronous."
* In addition to other questions that might inform the sync/async choice, a big question is "how do we handle processes that span service boundaries and may be long running?"

### Orchestration versus Choreography

* As you model more complex logic, you have to deal with service-spanning business processes. Microservices makes that more necessary, given how granular the services are.
* Two architectural styles: use a central authority to define how the process will work, or inform each part of its job and let it work out the details.
