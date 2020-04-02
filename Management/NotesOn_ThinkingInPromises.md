# Notes on Thinking in Promises

By Mark Burgess; O'Reilly Media, June 2015; ISBN 9781491917879

# Chapter 1: Promises and Impositions

* Promise Theory goal: "to reveal the behavior of a whole from the sum of its parts, taking the viewpoint of the parts rather than the whole. In other words, it is a bottom-up constructionist view of the world."

## Promise Engineering

* Use as an engineering concept from 2004, was looking for a model of distributed computing to describe CFEngine.
* Promise - "a kind of atom for intent that, when combined, could represent a maintainable policy."
* Promise Theory isn't a manifesto, political statement, philosophical agenda; just a method of analysis and engineering for picking systems apart and putting them back together. During that, you find a "method of representing and questioning the viability of our intended outcomes."
* "The purpose of this book is to ask what can an understanding in terms of promises tell us about cooperation in human-machine systems, organizations, and technology, and how can we apply that understanding to the real-life challenges of working together?"

## From Commands to Promises

* We tend to think in terms of stories, which leads to planning outcomes in terms of intended steps/commands to get there, and then demand milestones and deliverables.
* Stories are hard to assess--did they succeed or fail?
* If instead you focus away from the journey to the destination, assessment and success take on a new meaning.
* Thought exercise: cleaning a bathroom.
    * Instruction based: Wash floor, brush bowls, refill towels, refill soap, repeat hourly
    * Promise formulation: I promise that after every hourly check:
        * Floor will be clean and dry
        * Bowls will be clean and empty
        * Towel dispensers will be full
        * Soap dispensers will be full
* In reformulating, you notice that some agent has to make the promise (which tells you who the active agent is), and that the agent is accepting responsibility for that promise.
* You *also* notice a lack of motivation to make the promise, in counterparts like "I promise to pay you if this is done."

## Why is a Promise better than a Command?

* Why promise instead of obligation, command, or requirement?
* Those are 'impositions', because they impose intentions onto others without an invitation.
* "Promises expose information that is relevant to an expected outcome more directly than impositions because they always focus on the point of causation: the agent that makes the promise and is responsible for keeping it."
* Impositions fail us two ways:
    * They tell something how to behave instead of what we want (documenting process instead of outcome)
    * Force you to follow a recipe of steps before you can know what the intention was
* A promise expresses intent about the ultimate outcome, instead of indicating what to do at the starting point. Commands are only briefly relevant at the point of execution.
* Commands fan out into unpredictable outcomes from definite beginnings; promises converge toward a definite outcome from unpredictable beginnings.
* Promises apply to the 'self' of the agent making them, which is all that an autonomous agent has direct control over.
* "Promises represent ongoing, persistent states, where commands cannot."

## Autonomy Leads to Greater Clarity

* A promise is an expression of 'voluntary behavior'
* Voluntary could also be said as 'autonomous'
* "An agent is autonomous if it controls its own destiny"--outcomes are a result of its own directives and no one else's.
* When a change happens, you know it happens within an autonomous region; couldn't happen from outside without explicitly promising to subordinate itself to an outside influence.
* Behaviors don't have to be explicitly intended to be intentional, only has to be something that could be intended or have the appearance of intent.

## The Observer is Always Right

* One intent of a promise is to communicate to someone that they will be able to verify some intended outcome.
* You can make a promise about a future outcome/state, or an existing outcome/state that has yet to be verified.
* "Every possible observer, privy to relevant information, always gets to make an independent assessment of whether a promise was kept or not."
* Each autonomous agent has its own independent view, and thus agents form expectations independently as well. Consequently they can make judgments without waiting to verify outcomes.
* "Each observer is entitled to his own viewpoint. A useful side effect of promises is that they lead to a process of documenting the conditions under which agents make decisions for later use."

## Culture and Psychology

* Without a promise, you can't assess an algorithm. With a promise you're clear about the desired end state, and you can discuss alternative ways to bring it about.
* What about the running and maintenance of keeping a promise over time?
* In IT, design translates to "development" and maintenance to "operations"
* Promises fit naturally with the idea of services.
* 'Promise proposal' - simple expression of intent

## Nonlocality of Obligations

* Impositions don't reduce uncertainty, and may increase it.
* "Obligations quickly lead to conflicts because they span a region of our world about which we certainly have incomplete information."
* "Obligations actually increase our uncertainty about how [one] will behave towards another agent."
* "The solution is to invoke the autonomy of all agents."

## Isn't that Quasi-Science?

* Scientists get weird about introducing squishy human stuff, but you need it.
* You can do it without talking about feelings, morality, etc. though
* Has to do with physics: "promises are local, obligations are distributed"
* "The goal of Promise Theory is to take change (dynamics) and intent (semantics) and combine these into a simple engineering methodology that recognizes the limitations of working with incomplete information."
* Dynamics - aspects of a system that can be measured, like sizes, speeds, rates, etc. Can be characterized numerically, and those numbers exist independent of any interpretation.
* Semantics are about how you interpret something: what does it mean, what is its function, what significance is attached to it? They're subjective, so one agent might assess a promise as kept while another assesses it as unkept, based on the same dynamical data.

## Is Promise Theory Really a Theory?


