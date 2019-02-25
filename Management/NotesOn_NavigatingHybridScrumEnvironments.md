# Notes on Navigating Hybrid Scrum Environments: Understanding the Essentials, Avoiding the Pitfalls

By Frederik M. Fowler; Apress, Dec. 2018; ISBN 9781484241646

# Chapter 1: What is Scrum?

* "Truths" the author feels are now self-evident to him:
    * "That software is always created by technicians to fill the real-world needs of less-technical people."
    * "That software producers and users must work together on a daily basis to produce valuable results."
    * "That both technical and nontechnical people must interact in an atmosphere of mutual respect and trust."
    * "That the best way for these people to interact is by examining actual functionality that has been produced, and by continuously refining that functionality as both the technical and nontechnical people learn more about the problems they are solving."
* Those are some of the values and principles from the Manifesto for Agile Software Development, from 2001
* Goal of that was to identify and document common findings among 17 software devs, who were looking at (then) new approaches to lightweight software development.
* Two of those 17, Jeff Sutherland and Ken Schwaber, created the Scrum Framework
* Definition of that can be found in The Scrum Guide, which they wrote
* Comparing 'agile' and 'scrum' makes no sense:
    * 'Agile' is an abstract set of values and principles
    * 'Scrum' is a concrete framework for organizing the creation of products
* It's common to see organizations try to implement the Scrum Framework without understanding what it is
* Scrum is:
    * Lightweight
    * Easy to understand
    * Difficult to master
* Difficult because:
    * Requires using measurements to understand software development realities
    * The truth revealed by measurement usually conflicts with "common sense"
    * Mastering scrum involves confronting false ideas, and unlearning false lessons

## The Definition of Scrum

* From the Scrum Guide: "Scrum: A framework within which people can address complex adaptive problems, while productively and creatively delivering products of the highestpossible values."
* Three parts to note from that:
    * Purpose is to maximize value through the delivery of valuable products
    * Specifically good for complex adaptive problems, not necessarily for other things
    * It's a framework, not a methodology, not a set of procedures. There are procedures within it, but if the nonprocedural parts are left out it turns bad quickly.

## Methodologies and Frameworks

* Procedure - step by step plan for producing a result
* Method - procedural way of producing some desired result(s)
* Methodology - family of methods
* Framework - a tool to arrange and organize things according to a set of desired relationships. It identifies the relationships between its components and, as such, it controls the ways in which its components interact.
* Scrum Framework's primary function is to organize people and their relationships into an effective structure. After they're organized, the framework gives them tools and procedures to use to measure and manage their work.

## Complex Problems

* 'Complex adaptive' problems - challenges with many aspects that are as yet not understood or known; solutions are discovered rather than implemented
* A 'complicated' problem does not contain unknown factors. Everything to solve is known at hte outset, even if it's complicated.

## Software Development is a Complex Problem

* Software development almost always runs into problems that the people working on it have never solved before.
* Once you build a piece of softare, there is rarely a chance to build it 'again.' It's not repetitive, like building houses.

# Chapter 2: Scrum Theory

* Scrum's organizational aspects are based on the work of Hirotaka Takeuchi and Ikujiro Nonaka, who studied teamwork at Toyota and published in 1986
* They were the first to use 'scrum' to describe team behavior
* Scrum's artifacts and events are based on the theory of Empirical Process Control
* EPC holds that decisions should be made based on measurements of actual facts instead of predictions of future results. 
* Three core principles of EPC:
    * Transparency - every aspect of a product and the work developing it should be visible and accessible to everyone who is involved. No secrets from any stakeholders.
    * Inspection - If there is transparency, the stakeholders have a duty to examine that on a regular basis--the product and the work being done on it need to be inspected formally on a regular schedule.
    * Adaptation - If there is transparency and inspection, there should be lessons learned as a result. Adaptation turns formal inspection of transparency into a feedback loop.
* Scrum Framework uses this approach to deal with the unknowns of complex adaptive problems:
    * large problems are broken down into smaller pieces
    * a few high-priority pieces are implemented
    * the entire problem is reevaluated based on lessons learned
* Work in the scrum framework is divided into sprints:
    * That are time-limited (2-4 weeks, typically)
    * That have their own scope, or set of functionality to produce
* Argument for sprints is to have some real results to measure

# Chapter 3: Scrum and Waterfall

* Scrum Framework was developed as a reaction to limitations in the traditional framework laid out in the PMBOK, commonly called the System Development Life Cycle (SDLC) or 'waterfall.'
* SDLC thinks of development as a series of 'projects', each with a beginning, middle, and end. 
* Each SDLC project is a discrete activity with its own:
    * scope
    * goals
    * budget
    * schedule
* Projects are all independent, and have nothing necessarily in common with any other, other than the fact that several project may enhance the same product.
* Projects start with a proposal that is reviewed by some authority.
* Approvers give consent based on business considerations, set aside money, and assign a due date ('Gate 0' in SDLC talk)
* Then they do a detailed analysis and design, and create a 'work breakdown schedule' (WBS)
* WBS is created by leads and architects, and is a set of tasks to do in a sequence
* Tasks are plotted on a Gantt chart, longest chains are 'critical paths'

## What Could Possibly Go Wrong

* SDLC is designed to solve complicated problems, not complex problems.
* List of tasks is usually wrong, duration of tasks is guesswork, total list of tasks also a guess, goal is a guess
* Waterfall projects are successful 11-14% of the time
* Even those projects that complete can be obsolete by the time they're delivered
* Deming et al propose that any process that produces a product can be analyzed as a system
* Systems can be analyzed based on inputs and outputs
* Software development consumes money and time, and produces software functionality at a certain level of quality
* Waterfall leads to failure or hidden technical debt.

## Summary

* The only approach that makes sense in software development is an 'adaptive' one:
    1. Identify the goal to be achieved (x functionality produced for y dollars in z time)
    1. Determine the first step
    1. Plan that step
    1. Take that step
    1. Evaluate the results
    1. Plan and take the next steps, iteratively
    1. Repeat until the goal is achieved or it makes no sense to continue

# Chapter 4: The Scrum Team

* Scrum Framework is a way of organizing a product development effort to solve complex, adaptive problems
* Scrum realigns authority, responsibility, and accountability in ways that are effective but tend to fly in the face of conventional wisdom.
* Scrum rejects a military / hierarchical model in favor of one that aligns accountability and responsibility with capability. 
* "Those people who should be held accountable for a certain result are the ones who are capable of bringing it about. If they are accountable for a result, they must be given the authority to decide for themselves how to accomplish that result."
* Tends to concentrate decision making and responsibility at the bottom of the pyramid
* Upper levels identify goals, front line people who work to achieve those goals are given authority to self-organize to get them done.
* The rest of the framework provides tools for peole to use when they are organized along scrum lines.
* Scrum tools DO NOT WORK in a command and control structure. They ONLY work when used by people empowered to make their own decisions.

## Products, Not Projects

* Fundamental organizational unit is the Scrum Team
* Scrum Team - group who together create, maintain, and enhance a particular product. Formed when the product is first created, exists for the life of the product.
* "A Scrum team's job is to engage in an ongoing process of improving the value of the product for which the team members are accountable."
* Original framework was designed for products that could be created and maintained by a group of up to 11 people.
* For truly huge projects, Scrum is extended with the Nexus exoskeleton that lets 3 to 9 teams work together to accept responsibility for a product

## Cross-functionality

* Every Scrum Team must have two vital characteristics:
    * Cross-functionality
        * Team must contain every skill set needed to create the product
        * Not every person has to have every skill, they just all have to be present
        * Benefits of cross-functionality:
            * Eliminates delays resulting from dependencies
            * Allows the team to accept responsibility for the product
    * Self-organization
        * Team must be self organizing or it can't take responsibility for the product
        * There is no PM--the team manages itself
        * In waterfall, most responsibility lies with the PM, so developers have very little
        * That misaligns accountability and capability
* Having developers work in cross-functional, self-organizing teams is the only way they can accept responsibility for creating the product. That requires that they are:
    1. given all the skills needed
    1. given permission to organize the work themselves

# Chapter 5: Scrum Team Roles

* SF organizes people by defining three distinct sets of responsibilities
* Each of those sets is a 'role'
* Individuals play different roles when participating in scrum teams
* Roles do not necessarily correspond to individuals, people can play more than one
* The roles address the fact that "products always have both business and technical dimensions"
* Three roles:
    * Product Owner - takes responsibility for all the business decisions to make
    * Development Team - responsibility for all the technical decisions
    * Scrum Master - responsibility for making sure the other team members understand and live up to their responsibilities

## The Product Owner

* This role guides the team so the value of the product delivered id the highest possible
* Maximizes the business value of the product
* This is a non-technical role, and does not take responsibility for technical decisions
* Success of this role is measured by how well the product does in the marketplace
* One Product Owner can own many products, but each product must have one and only one Product Owner.

### Product Owner Characteristics

* Helps to be trusted by the org's management team
* Takes on a lot of responsibility, judged on a profit/loss basis
* Need to be able to quickly, efficiently make decisions that stay made

### Common Product Ownership Dysfunctions

* Product Owner as PM
    * Temptation is to organize the team
    * If you organize the team, team members avoid accountability
* Product Owner "Committee"
    * When you have a Product Owner who can't make independent decisions
    * Being a Product Owner requires constant negotiation
    * You can't negotiate if you're not a decision maker
    * "A Product Owner is one person who is personally accountable for the value of the product. They must provide a single, clear voice, and identify opportunities and priorities for the team to pursue."
* Product Owner without a Product
    * If a Scrum Team is aligned to a component instead of a product, the Product Owner then sets the priorities for the team and controls the growth and development of the component.
    * It's really difficult to measure the business value of a component.
    * If you can't do that, you can't clarify value, which makes everything else fall apart
    * Recognize the delineation of the 'product', and have one owner. That can involve multiple teams, but they must all have the same product owner.

### Product Owner Commitments

* They can be busy, but they must be part of the team and work with them enough to establish and maintain mututal respect and trust.
* Product Owners must be available on a daily basis to be part of the team.
* Product Owners should be placed highly in the company, but MUST be willing to commit to being part of the Scrum Team

# Chapter 6: The Scrum Development Team
