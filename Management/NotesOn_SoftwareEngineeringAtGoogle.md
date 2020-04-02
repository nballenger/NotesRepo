# Notes on Software Engineering at Google

By Hyrum Wright, Tom Manschreck, Titus Winters; O'Reilly Media, March 2020

ISBN 9781492082798

# Preface

* 'Software engineering' includes all tools and processes to build and maintain code over time.
* Can be thought of as 'programming integrated over time'
* Three fundamental principles orgs should keep in mind about code:
    * Time and Change - how code will need to adapt over its lifetime
    * Scale and Growth - How an org needs to adapt as it evolves
    * Trade-offs and Costs - how to make decisions based on the above
* Three main aspects of Google's software engineering landscape in teh book:
    * Culture
    * Processes
    * Tools
* Book doesn't cover software design. Some examples, but more about language neutral principles.

# Part 1: Thesis

# Chapter 1: What is Software Engineering?

* Three critical differences between programming and software engineering:
    * Time
    * Scale
    * Trade-offs at play
* At the project level, time and change are important; at the org level scale and efficiency
* Programming integrated over time. "The addition of time adds an important new dimension to programming. Cubes aren't squares, distance isn't velocity. Software engineering isn't programming."
* "Your project is sustainable if, for the expected life span of your software, you are capable of reacting to whatever valuable change comes along, for either technical or business reasons."
* Early attempt to define software engineering provided interesting point: "The multiperson development of multiversion programs."
* "In this book, we aim to present what we've found that works for us in the construction and maintenance of software that we expect to last for decades, with tens of thousands of engineers, and world-spanning compute resources. Most of the practices that we find are necessary at that scale will also work well for smaller endeavors."

## Time and Change

* Some projects have a short lifespan (and therefore little maintenance involvement), some have a practically unlimited lifespan (Linux kernel, e.g.)
* Eventually long-lived projects start to feel very different.
* For instance, at some amount of longevity, the importance of dependency upgrades takes on a much higher value.
* The transition: "a project must begin to react to changing externalities."
* For a project that didn't plan for upgrades from the start, that transition is likely painful for three interconnected reasons:
    * "You're performing a task that hasn't yet been done for this project; more hidden assumptions have been baked in."
    * "The engineers trying to do the upgrade are less likely to have experience in this sort of task."
    * "The size of the upgrade is often larger than usual, doing several years' worth of upgrades at once instead of a more incremental upgrade."
* Some places will have a painful upgrade and decide "never again"
* More responsible thing is to make it easier to do the upgrades.
* "Over time, we need to be much more aware of the difference between 'happens to work' and 'is maintainable.'"

### Hyrum's Law

* Hyrum's law is about 'it works' vs 'it is maintainable':

    > With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.

* You cannot assume perfect adherence to published contracts or best practices.
* Given enough time and enough users, even the simplest change will break something. You have to analyze the value of a change in terms of the difficulty of investigating, identifying, and resolving those breakages.
* Example: hash ordering
    * Lots of hash implementations have some repeatability of ordering, even though conceptually you shouldn't be able to count on that.
    * People eventually write code to capitalize on it.
    * You have to decide what the potential costs of breaking changes are in that arena, even though it's a non-documented 'feature' (which in fact explicitly should not be relied on).
* Nice quote:
    
    > It's _programming_ if 'clever' is a compliment, but it's _software engineering_ if 'clever' is an accusation.

* Is change actually necessary? It depends.
* Eventually, over a long enough time period, everything external will change.
* Every piece of tech you rely on has the potential for security holes, which require patching.
* Efficiency improvements also complicate things. Eventually you'll be doing a ton of work to maintain an old, inefficient system for your code to live inside.
* Those things impose real risks on projects that don't plan for sustainability.

## Scale and Efficiency

* Recall that 'sustainable' means you are able to change all the things you ought to change, safely, for the lifetime of your codebase.
* That hides some cost discussions--if changes have an inordinate cost, they're likely to be deferred. 
* "If costs grow superlinearly over time, the operation clearly is not scalable."
* Costs of finite resources can include human time, compute, memory, storage, bandwidth, but also development, in terms of human time and compute resources devoted to the development workflow.
* The codebase itself also needs to scale. 
* Questions such as the following often aren't tracked, and change slowly:
    * How long to do a full build?
    * How long to pull a fresh copy of the repository?
    * How much would it cost to upgrade a language version?
* "Only with an organization-wide awareness and commitment to scaling are you likely to keep on top of these issues."
* Everything an org does repeatedly should be scalable in terms of human effort.

### Policies that Don't Scale

* Easy test: consider the work imposed on a single engineer by a policy, then imagine the org scaling 10x or 100x. At org scaled 10x, does that add 10x the work to each engineer to comply with the policy?
* If yes, can you automate or optimize? If not, there's a problem.
* Hypothetical issue: deprecating a Widget
    * You could say, "X ends on Y date, upgrade or GTFO"
    * That fails as the depth/breadth of the dependency graph increases
    * Need to change the way you deprecate: instead of pushing migration work to customers, teams can internalize it themselves.
    * Google tried in 2012 a 'Churn Rule,' which said infra teams must do the work to move their internal users themselves, or do the update in place, in backward compatible fashion.
    * That scales better, because dependent projects don't struggle to keep up.
    * Having a dedicated group of experts do the change works better as well.
* Using dev branches also tends to have scaling problems.
    * Org could notice that merging large features to trunk destabilizes the product and decide to merge less frequently, with more controls.
    * That eventually leads to every team/feature having separate dev branches.
    * Then any branch on "completion" has to be tested and merged to trunk, which can then have enormous impacts on other teams working on _their_ dev branches.
    * As the org size grows, it becomes apparent that overhead is too expensive.

### Policies that Scale Well

* What sorts of policies can provide superlinear value as the org grows?
* Favorite internal policy of the authors:

    > If a product experiences outages or other problems as a result of infrastructure changes, but the issue wasn't surfaced by tests in the CI system, it is not the fault of the infrastructure change.

* Paraphrased as "If you liked it you should have put a CI test on it." (the Beyonce rule)
* Without that rule, an infra engineer might have to track down every team with affected code and ask how to run their non-CI tests.
* "We've found that expertise and shared communication forums offer great value as an organization scales. As engineers discuss and answer questions in shared forums, knowledge tends to spread."
* Example of Google upgrading compilers in 2006
    * It was super painful
    * No Beyonce rule, so not easy to assess the impact of the change ahead of time, or know you won't be blamed for regressions.
    * Not unusual in that it was painful, what was unusual was that they realized it was a pain point and started making changes to ease that in future.
    * Turned scale to their advantage via
        * automation (so one person can do more)
        * consolidation/consistency (so low-level changes have a limited problems scope)
        * expertise (so a few people can do more)
* The more frequently you change your infra, the easier it is to do.
* Code that has gone through refactoring for dependency upgrades tends to be less brittle and easier to upgrade in the future.
* After several upgrades, the code stops depending on nuances of the underlying implementation and depends on the actual abstraction guaranteed by the language or the OS.
* Expect the first upgrade for a codebase to be significantly more expensive than later ones.
* Factors they've discovered that affect the flexibility of a codebase:
    * Expertise - Do we already know how to do X?
    * Stability - Adopting dependency changes regularly means the delta between changesets is smaller.
    * Conformity - How much code has already been through an upgrade?
    * Familiarity - If you do the upgrades frequently you can spot redundancies.
    * Policy - The policies and processes around upgrades affect how easy it is.
* Finding problems earlier in the developer workflow usually reduces costs.
* Left to right process continuum for development looks like
    * Concept &rarr;
    * Design &rarr;
    * Development &rarr;
    * Testing &rarr;
    * Commit &rarr;
    * Integration &rarr;
    * Production
* The further to the left a problem (and fix) is, the cheaper it is.
* Bugs caught by static analysis and code review are cheaper than bugs that make it to production.

## Trade-offs and Costs

* At google they don't like 'because I said so'
* Important for there to be a decider for any topic, and clear escalation paths when decisions seem to be wrong, but the goal is consensus
* "Whenever it is efficient to do so, we should be able to explain our work when deciding between the general costs for two engineering options."
* Cost roughly translates to effort. Factors include:
    * Financial costs
    * Resource costs (CPU time, etc.)
    * Personnel costs (engineering effort)
    * Transaction costs (what does it cost to take action)
    * Opportunity costs
    * Societal costs (what impact does this have on society at large)
* In addition to costs there are biases, like status quo bias and loss aversion
* In software, financial cost isn't usually the limiting factor, personnel costs are. Efficiency gains from keeping engineers happy, focused, and engaged can easily dominate other factors.
* Example of dry erase markers:
    * At many companies they're hoarded and in short supply
    * They're cheap. It's stupid to waste the time of people (who are expensive) to save on cheap markers.
    * Google decided to just have open supply closets full of whatever.
* Google is 'data driven', but even when there isn't data there may still be evidence, precedent, and argument.
* Decisions in an engineering group should come down to very few things:
    * We are doing this because we must (legal reqs, customer reqs)
    * We are doing this because it is the best option (as determined by some appropriate decider) that we can see at the time, based on current evidence.

### Inputs to Decision Making

* When weighing data, authors find two common scenarios:
    * All quantities involved are measurable or can be estimated. Usually means you're looking at tradeoffs like CPU vs network, dollars vs RAM, etc.
    * Some quantities are subtle, or we don't know how to measure them.
* No good reason not to be strong on the first type of decision.
* The second type rarely has an easy answer.
* You rely on experience, leadership, and precedent to negotiate those.
* Broad suggestion: Be aware that not everything is measurable or predictable. Attempt to treat those decisions with the same priority and greater care.

### Revisiting Decisions, Making Mistakes

* One of the benefits of committing to a data-driven culture is the ability and necessity of admitting to mistakes.
* Decisions are made (hopefully) based on good data and only a few assumptions, but are implicitly based on currently available data.
* As new data comes in, contexts change, or assumptions are dispelled, it may become clear that a decision was in error, or no longer makes sense.
* Since those changes are inherent, some decisions may need to be revisited.
* "Be evidence driven, but also realize that things that can't be measured may still have value."

## Software Engineering versus Programming

* "Programming is the immediate act of producing code."
* "Software engineering is the set of policies, practices, and tools that are necessary to make that code useful for as long as it needs to be used and allowing collaboration across a team."

## TL;DRs

* There's a factor of at least 100,000 times between short and long term code lifespans.
* Every task your org has to do repeatedly should be scalable (linear or better) in terms of human input. Policies are a good tool for shaping this.

# Part 2: Culture

# Chapter 2: How to Work Well on Teams

* "The critical idea in this chapter is that software development is a team endeavor. And to succeed on an engineering team--or in any other creative collaboration--you need to reorganize your behaviors around the core principles of humility, respect, and trust."

## Help Me Hide My Code

* Authors built a project hosting tool
* People eventually started asking how to hide things in it
* Authors say this is due to insecurity--people are afraid of being judged on their work in progress.
* Insecurity in software development is a symptom of a larger problem.

## The Genius Myth

* People often want to find and worship idols.
* Most of what those idols (Linus Torvalds, Guido Van Rossum, etc) did is be willing to put themselves out there.
* "The Genius Myth is the tendency that we as humans need to ascribe the success of a team to a single person/leader."
* "Deep down, many engineers secretly wish to be seen as geniuses."
* Fantasy:
    * You're struck by a new concept
    * You disappear for weeks or months and craft the perfect implementation
    * You unleash your software on the world, shocking everyone with your genius
    * Your peers are astonished
    * People want to pay to use your stuff
    * You get famous and rich!
* Most people aren't geniuses.
* Geniuses still make mistakes.
* Solving technical problems but ignoring human ones is highly problematic.
* The Genius Myth is a manifestation of insecurity--people are afraid to share their work because it means peers will see their mistakes and know they're not a genius.
* That tendency is harmful and bad for software.

## Hiding Considered Harmful

* Working alone increases your chances of failure, decreases opportunities to grow.
* Software development is intellectual and creative, and does require concentration and focus. However, you have to balance that against the need for collaboration and review.
* Lessons from the dangers of working in isolation:
    * Easy to make a fundamental design mistake early on / reinvent wheels
    * "Fail early, fail fast, fail often"
    * Lowers your 'bus factor'--number of people who can disappear and have your project still survive
    * Need good documentation and at least a primary and secondary owner for each area of responsibility
    * Better to be one part of a successful project than the critical part of a failed project.
    * Working alone is slow.
    * Software engineering works best with tight feedback loops, at the code level and at the whole-project level.
