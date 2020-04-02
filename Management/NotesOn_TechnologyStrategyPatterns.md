# Notes on Technology Strategy Patterns

By Eben Hewitt; O'Reilly Media, Oct. 2018; ISBN 9781492040873

# Introduction

## This is Water

* It's easy to lock yourself into mental models that preclude seeing things that
preclude seeing things that don't fit the model.

## Discovering Strategy

* "The roles that are ultimately valued at an organization tend to be the people who do what the boss did."
* To get heard, make an effort to empathize with people, and use the tools, techniques, and language they respond to.
* Being asked to craft strategy can be exciting but also nerve wracking, particularly if you don't know what that means--which your boss may not either.
* "Once you've devised a strategy, it languishes on the shelf if you can't make people excited to hear it, understand it, care about it, approve it, and execute it."
* "Any technology strategy is, in a sense, a request to spend millions of dollars of someone else's money."

## Driving Strategy with Patterns

* Patterns in the book are divided into logical concept architectures:
    * Analysis - tools for critical thinking that underpin the others
    * Creation - patterns for creating tech strategy
    * Communication - organize strategy components to get your colleagues and execs understanding, excited about, and supporting your strategy

# Part 1. Context: Architecture and Strategy

## The Origins of Patterns

* Christopher Alexander was at UC Berkeley in the 70's
* Wanted to catalog common practices in architecture
* Ended up writing _A Pattern Language_

## Applying the Patterns

Simplified outline:

1. Establish context
    1. Analyze trends happening in the world outside
    1. Analyze forces at work across your industry, org, department.
    1. Gain a view on your stakeholders
1. Understand your competition, the market, the tech landscape.
1. Identify strategic options in products, services, and tech roadmap.
1. Evaluate those options.
1. Make a compelling recommendation with a coherent, cohesive, comprehensive strategy to gain approval and resources to execute your plans.

# Chapter 1: Architect and Strategist

* Chapter gives an overview of three different business strategy examples
* Then looks at role of architect and role of strategist in modern business

## Business Strategies

* Biz strategies reveal how companies allocate resources toward aims.
* Examples are Michelin, Oracle, and Xerox and Canon

### Marketing at Michelin

* The Michelin Guide is 120 years old, gold standard for fine dining reviews
* Michelin itself is a tire company. How did it get into the review biz?
* In 1900 cars were scarce, expensive, and fringe, so car tires were a problematic business sector.
* How to create more demand? 
    1. Sell more cars that need tires
    1. Find a way to make existing car owners drive more and need more tires
* Created the Michelin Guide and gave it away to inspire drivers to go out more and further. Made money on tires, then on the guide itself.
* They seem to be a real asset, but at this point the paper guides lose Michelin ~19M euro per year. Probably needs a new strategy to become profitable again.

### Acquisition and Integration at Oracle

* In 2007, Oracle came up with a strategy: have its software be number 1 or 2 in every product category, or buy the market leader.
* Spent $45B acquiring companies between 2004 and 2014
* Thomas Kurian took leadership of product teams for Oracle Fusion Middleware in 2008, decided that all products at Oracle would use the Middleware stack, and must be modified to interoperate with it.
* That strategy turned out to be a mixed bag
    * Good example of a tech architecture strategy decision being made to support the business strategy of aggressive acquisitions
    * Also took a ton of time over multiple years for refactoring the internals of various products to comply with the architecture, which put Oracle years behind in cloud and ML work.

### Differentiation at Xerox and Canon

* In the 70's, Xerox had 95% of the global copier market
* Mission of the sales team was to build close, long-term customer relationships with Fortune 500 companies, for high-volume copiers at high pricepoints.
* Reliability was key, so they built sturdy machines but also had 24 hour customer service, which took a big capital investment to create and maintain.
* In 5 years, Xerox's market share went from 95% to 14%.
* What happened: Canon entered the market
* Canon developed smaller copiers, designed for high reliability.
* They also made the primary assembly, of toner, copier drum, charger, and cleaner, to be disposable, so that customers could remove and replace the assembly.
* That meant Canon didn't need to spend nearly as heavily on a service network, which kept costs down.
* Also Canon designed the copiers around manufacturing, so they could be made by robots, to reduce production costs.
* They were able to redefine the market, with lower pricepoints letting them sell to individuals and small businesses.
* Xerox couldn't compete, and lost most of its large business accounts, since those companies could have lots of Canon copiers for the cost of one Xerox.

## The Architect's Role

* Offering an overview of the author's perspective on the field of architecture, not how to do architecture per se.
* Tech systems are difficult--they grow in accidental complexity and complication over time.
* A lot of our roles are borrowed from other industries as metaphors.
* "Architect" wasn't a software job role till the late 90's
* Initially ridiculed, at least in part because it isn't clear what the deliverables are for that role as named.
* Subsequently divided into enterprise architect, solution architect, data architect, etc.
* Consequence is that practice and art of tech architect varies dramatically from one company to the next, and even within companies.
* Need to define te role of the architect to proceed from common ground

### Vitruvius and the Priciples of Architecture

* "Architecture begins when someone has a nontrivial problem to be solved."
* Product management provides the 'what', architect describes the 'how'
* Vitruvius is the first architect on record, was a civil engineer in Rome in the first century BC.
* He wrote 'de Architectura', or 'Ten Books on Architecture', which influenced all sorts of artists like Michaelangelo and da Vinci
* His three requirements that any architecture must demonstrate:
    1. Firmatis - must be solid, firm
    1. Utilitas - must be useful, have utility
    1. Venustas - must be beautiful, delightful, inspiring love
* Software systems must run (solidity) and be fit for purpose (utility)
* For Vitruvius beauty isn't subjective, it's about harmony of proportion
* "One suggestion we can deduce from this for our current purposes is that we must rightsize our architecture and strategy work for the task at hand."
* Vitruvius argues that an architect should be educated in:
    * Skill and theory in manual labor
    * Proclivity and desire for continuous learning
    * Dexterity with tools
    * Understand of optics--how the light gets in
    * History, to empathize and not misinterpret cultural significance
    * Philosophy, to practice abstract thinking, honesty, courtesy
    * Physics, to help make things sturdy
    * The arts, to help make things beautiful and suited to human purposes
    * Math
    * Medicine
    * Astronomy
    * Politics
* "Realizing these broad dicta into an architecture means, I think, finding the concentrations of power, and determining how to best support and ultimately inspire the human factor in the forms we create."

### Three Concerns of the Architect

* Architects are concerned with how tech can fulfill business goals given a long term outlook across multiple interrelated systems and teams.
* Typically not concerned with low-level code details as much as the system interaction level, where data-center or system component boundaries are crossed.
* Author's definition of an architect's work:

    > It comprises the set of strategic and technical models that create a context for position (capabilities), velocity (directedness, ability to adjust), and potential (relations) to harmonize strategic business and technology goals.

* Author posits three primary concerns of the architect:
    * Contain entropy
    * Specify the nonfunctional requirements
    * Determine trade-offs
* Primary struggle author has seen for architects is when they are not focused on a deliverable, a blueprint. 
* "Without that focus, they tend to weigh in at product meetings or make declarations informally that can't be remembered or followed. To stay pertinent to the project, and to help guide it in a way that others may not have the purview to do, drawing a line at these boundaries seems to work out pretty well."

#### Contain Entropy

* Systems over time degrade into an increasingly entropic state, and the amount of energy available in the system for work is diminshed.
* Architects define standards, conventions, and toolsets for teams to use.
* Those are common practices, but typically idiosyncratic to each organization.
* Standardizing and streamlining those things is a means of containing entropy.
* Architects aren't really in the business of making software--they're in the business of building a business.
* "The architect who is containing entropy is stating a vision around which to rally; showing a path in a roadmap; garnering support for that vision through communication of guidelines and stanards; and creating clarity to ensure efficiency of execution and that you're doing the right things and doing things right."
* You can't succeed just thinking of what to do but not how to get it done in an organization, which means you have to know why it matters to someone who isn't a technologist.

#### Specify Nonfunctional Requirements

* "Knowing what you're on the hook for, letting others know it, and making sure that it's a concrete deliverable will all go a long way to ensuring your vision is understood and realized."
* Product creates functional requirements, communicates them via user stories, epics, whatever.
* Nonfunctional requirements: properties of the system that do not necessarily appear directly to the user. Author focuses on:
    * Scalability
    * Availability
    * Maintainability
    * Manageability
    * Monitorability
    * Extensibility
    * Iteroperability
    * Portability
    * Security
    * Performance
* The architect is responsible for specifying how the system will realize both functional and nonfunctional requirements, and communicating this via some form of specification, an 'architecture definition.'
* Should be structured to include perspectives on/for
    * business
    * application
    * data
    * infrastructure
* Expressed with clarity and decisiveness, using primarily testable statements as valid propositions, and math.
* You need to make those expressions concrete and executable: add nonfunctional requirements to user stories as acceptance criteria.

#### Determine Trade-Offs


