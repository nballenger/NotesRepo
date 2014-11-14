# Notes on <u>User Story Mapping</u>

By Jeff Patton; Peter Economy, O'Reilly Media, Inc, 2014

## Executive Summary

Story mapping is a technique for helping groups of people:

* Create shared understanding of problems they are trying to solve and solutions they might work on together.
* Turn that shared understanding into software products and features _without making the development process more important than solving problems in the lives of real people._

### The Problems Story Mapping Addresses

Developers are exceptionally sensitive to management bullshit. That's good a lot of the time, since a huge amount of management technology exists purely to justify creating and keeping management jobs. It's bad when it makes developers ditch the baby with the bathwater on topics like "making sure we know who is going to use this thing," "seeing business mistakes before they bite us in the ass," and "am I going down a rat-hole that's going to derail the group?"

Story mapping is structured to help devs (and managers, assorted hangers-on, etc)

The big problem that no management tech can really address is "how do we keep process from making itself the goal of what we're doing?" 

### The Story Mapping Process

**Materials**: White board, index cards or sticky notes, painters tape, markers.

**Procedure**:

1. Write the story a step at a time.
    * Visualize a routine a user might go through using your part of the product.
    * Write each task they'd do on a note.
1. Organize the story into a narrative.
    * Organize the notes left to right as a flow through time.
    * Vertically stack events that happen at or around the same time.
    * Fill in holes in the story as you identify them.
1. Explore Alternative Stories
    * Think of alternative possibilities in the flow.
    * Ask questions like, "What if section X was down?" and "What if they were in a hurry?"
    * Write alternative task cards and arrange vertically at the appropriate point.
    * It may be necessary to reorganize the overall flow.
1. Distill the current map to make a Backbone.
    * Grouping / summarizing tasks that are near each other in the flow, create activity cards.
    * In naming the activities, use the names your users might use.
    * Place the backbone activities above the flow of tasks at the appropriate points.
1. Slice out tasks that help reach a specific outcome.
    * Separate the map into horizontal slices.
    * Put a note to the left of each one with the desired outcome for that slice.
    * Put the minimum set of tasks into that slice to make that outcome possible.

## Chapter Summaries

### Preface

* Originally supposed to be short book about 'story mapping'
* Basic process of a story map:
    * Telling the story of a product, writing each big step the user takes on sticky notes, left to right
    * Go back and talk about steps, write the details of each on stickies vertically under the step
    * Turn that into part of the agile backlog
    
#### Why Me?

* Blah blah, story maps are a good idea.

#### This Book is for you if you're struggling with stories

* Lots of traps about processes and stories:
    * easy to lose sight of the big picture by drilling down with very specific stories
    * stories are about conversations, and people use that idea to avoid writing things down
    * you can write acceptance criteria without having a shared understanding of what needs to be built
    * good stories are supposed to be from the user's perspective, and people will argue that they don't work for parts that aren't end-user facing
    
#### Who Should Read this Book?

* Product managers and UX practitioners in commercial product companies
* Product owners, business analysts, and project managers in IT organizations
* Agile and Lean process coaches
* Everyone else.

### Read This First

* Book has no intro, starts here, don't skip.
* Two big points of the book:
    * **The goal of using stories isn't to write better stories.**
    * **The goal of product development isn't to make products.**

#### The Telephone Game

* "Shared documents aren't shared understanding."
* Shared understanding &mdash; we both understand what the other person is imagining, and why.

#### Building Shared Understanding is Disruptively Simple

* Externalizing each person's understanding (in writing, conversation, drawings) is crucial to creating a shared understanding.

#### Stop Trying to Write Perfect Documents

* "The real goal of using stories is shared understanding."
* Write _something_, but only in service of creating shared understanding, not a perfect document.

#### Good Documents are Like Vacation Photos

* Documents should be touchstones for shared understanding created in a variety of contexts.

#### Document to Help Remember

* "To help remember, photograph and shoot short videos of the results of your conversations."

#### Talking About the Right Thing

* Blah blah, "The truth is, your job is to change the world."
* In small ways, probably. For the people who use your product.

#### Now and Later

* Mental model of the author:
    * Start by looking at the world as it is now
    * Notice people who are unhappy, mad, confused, or frustrated--with a focus on people who might use the software you're going to create.
    * Look at what they're doing and the tools they're using
    * Generate ideas for:
        * New products to build
        * New features to build
        * Enhancements to existing products
    * Communicate the details of your ideas to others (as 'requirements' or otherwise)
    * Go through a process that results in a delivery
    * Some software lands in the world at a later date.
    * Some people will be happy with it, some will still be unhappy, some will be unhappy for new reasons.
    * Do it again.

#### Software Isn't the Point

* Output is not what's important, _outcome_ is.
* You can't measure outcome until something comes out and interacts with users.
* You measure it by looking at what people actually do differently to reach their goals as a consequence of what you've built, and whether you've made their lives better.
* "Good story conversations are about who and why, not just what."

#### Ok, It's Not Just About People

* Businesses have to make money by shipping products, _but_
* "Your company can't get what it wants unless your customers and users get something they want."
* "Impact" is longer term stuff that happens as a result of good outcomes: company health over time, etc.

#### Build Less

* "There's always more to build than we have time or resources to build&mdash;always."
* **"Minimize output, maximize outcome and impact."**
* Pay close attention to the people whose problems you're trying to solve.
* You can't make everybody happy all the time.

#### More on the Dreaded "R" Word

* 'Requirements' is the R word.
* Lots of people use 'requirements' to mean 'shut up and do this'.
* Always ask, "Who is this for?" and "What problems does it solve for them?"

#### That's All There is To It

* Remember these things:
    * "Stories aren't a written form of requirements; telling stories through collaboration with words and pictures is a mechanism that builds shared understanding."
    * "Stories aren't the requirements; they're discusssions about solving problems for our organization, our customers, and our users that lead to agreements on what to build."
    * "Your job isn't to build more software faster: it's to maximize the outcome and impact you get from what you choose to build."

### Chapter 1: The Big Picture

* Going to go directly to talking about how story maps solve a big problem in Agile development.

#### The "A" Word

* Not going to talk about the agile manifesto.
* In 2000, author worked with Kent Beck (created Extreme Programming, described user stories originally) as a consultant; Beck knew requirements were kind of a broken way of thinking about the process of development, wanted to get together and tell stories to build shared understanding.

#### Telling Stories, Not Writing Stories

* "Stories get their name from how they should be _used_, not what should be written."
* Constructions like sizing and velocity shouldn't get in the way of story telling for shared understanding.

#### Telling the Whole Story

* From 2001 to 2007, author played around with ideas behind 'story mapping', didn't coin the term till 2007.
* "Story mapping is a pattern." Reading the book will save time, but you probably would have gotten to it on your own.
* "Story maps are for breaking down big stories as you tell them."

#### Gary and the Tragedy of the Flat Backlog

* Author met Gary Levitt, businessperson launching a product called 'Mad Mimi', supposed to be for music industry marketing.
* Wanted to create an application to allow collaboration between musicians, and allow a band manager and musician to collaborate on managing/promoting bands.
* Gary worked with a dev doing Agile, who asked for everything he wanted, prioritized, and then the dev turned that into a backlog.
* It was going slower than Gary wanted, and he was losing money on development.
* Author got asked to talk to Gary about his ideas, and organizing them.

#### Talk and Doc

* Author talked to Gary, wrote cards with key points from what he said.
* Externalizing ideas onto cards means you won't lose them, and can refer to them in a meeting visually as 'this' or 'that'.
* Aside about "Think - Write - Explain - Place":
    * Any story discussion should have a simple visualization to support it.
    * Don't let your ideas vaporize, write them down/draw them out.
    * Get in the habit of writing down a little _before_ explaining your idea:
        1. Write down a few words immediately after having an idea.
        2. Explain your idea to others as you point to the card. Tell stories.
        3. Place the card into a shared workspace where everybody can see/manipulate it.

#### Frame Your Idea

* Go back to the "now and then later" model, ask "Why are you building this?"
* "How does this benefit the people it's for?"
* Use the spatial relationship between cards to model priorities and relationships between ideas.

#### Describe Your Customers and Users

* Write down the kinds of people you think will use the product.
* Write down the types of activities people would use the product for.
* Goal is to minimize the amount we build.
* Interesting question: **"Of all the different users and the things they want to do, if we were to focus on thrilling just one of them, who would it be?"**

#### Tell Your Users' Stories

* Imagine the future where the product is live.
* Talk about a day in the life of someone using it--tell that story, left to right.
* Consider doing this by reorganizing cards together.
* Note that what you're doing in this instance is building shared understanding.
* Use the story map to find holes in your thinking.
* As you describe details in the weeds, put them on cards and put them subordinate to features or actions.
* Do your best to focus on the breadth of the story before diving into the depth.

#### Explore Details and Options

* At each step in a user's story, stop and ask:
    * What are the specific things they'd do here?
    * What are alternative things they could do?
    * What would make it really cool?
    * What about when things go wrong?

### Chapter 2: Plan to Build Less

* Always more than you have time or resources to do.
* Chapter story is about Globo.com, media compnay in Brazil
* It's good at doing less.

#### Mapping Helps Big Groups Build Shared Understanding

* Description of a time Globo was going to fall into a 'flat backlog trap':
    * Individual teams had their own prioritized backlogs
    * Author asked them to look at the big picture of the entire content management system
    * Reminded them they have to release together, have dependencies on each other across teams.
    * Asked them to visualize all dependencies, so they built a story map of the big picture CMS.
* Lesson: **"Map for a product release across multiple teams to visualize dependencies."**
* Sidebar: Anatomy of a Big Map:
    * At the top is the 'backbone', which may have several levels
        * The backbone starts with the basic story flow
        * Add summary levels when it gets really long
        * Backbone parts are big activities users engage in
    * Below the backbone are details of each feature or action, vertically.
    * You need to create maps reflective of entire deliverables--all connected parts.
    * You want to map in a narrative flow across users and across systems
        * "When you read the backbone from left to right, it tells a story about all the people who use the system and what they do in order to create and manage sites and content. The left-to-right order is what I call a 'narrative flow'--the order of the story."
        * The backbone narrative flow has to cut through many different users and systems stories
        * Put stickies representing users above the backbone to see who is being talked about at various times in the story.

#### Mapping Helps You Spot Holes in Your Story

* After you envision the entire product or feature, start asking questions starting with "What about..." to find edge cases and holes.
* You end up with a lot of information, but that would exist anyway--it's just that normally you wouldn't find out about it until it shipped, or until you had terrible scope creep.
* "Scope doesn't creep; understanding grows."

#### There's Always Too Much

* You'll always have too much to do with a full story.
* Shift to thinking about outcomes instead of of output.
* "Focus on what you hope will happen outside the system to make decisions about what's inside the system."
* That should help you pare down to a development list that can work in your timeline.

#### Slice out a Minimum Viable Product Release

* Take tape, make horizontal lines through the details below the backbone, to create several sections
* Move cards up and down above and below the horizontal lines to designate which things go into the slice representing the first release.
* "Focus on outcomes&mdash;what users need to do and see when the system comes out&mdash;and slice out releases that will get you those outcomes."

#### Slice out a Release Roadmap

* Treat the horizontals as viable releases
* Put a sticky to the side of each horizontal marking it as a release slice
* Move cards up and down into the appropriate slices
* Take what you've created and turn it into a release roadmap
* Note that the list is NOT a list of features, it's a list of real-world benefits to users.
* "Focusing on specific target outcomes is the secret to prioritizing development work."

#### Don't Prioritize Features&mdash;Prioritize Outcomes

* Break down your output in terms of the outcomes it represents.
* Focus on specific users and their needs.

#### This is Magic&mdash;Really, It Is

* Put out all your ideas about creating the product.
* Step back and think about the specific people who will use it, and what they'll need to accomplish to be successful.
* Carve away everything you don't need.
* Boom, magic.
* Sidebar on finding a smaller viable release
    * Stakeholders in example guided through a prioritization model:
        * "Differentiator" &mdash; feature that sets you apart from the competition
        * "Spoiler" &mdash; feature moving in on someone else's differentiator
        * "Cost reducer" &mdash; feature that reduces organization costs
        * "Table stakes" &mdash; feature necessary to compete in the marketplace
    * Types indicated with sticky note colors
    * Stakeholders will probably classify things differently. You'll need to talk about that.
    * After labeling, they used a voting system to help converge the different stakeholder visions

#### Why We Argue So Much About MVP

* Lots of disagreement on meaning of 'minimum viable product'
* MVP is not the crappiest product you could possibly release
* It is not the product your users could use with a high tolerance for pain.
* **"The minimum viable product is the smallest product release that successfully achieves its desired outcomes."**
* "Minimum" is subjective, and the one defining it is the user, not the developer.
* Author prefers term "minimum viable solution"

#### The New MVP Isn't a Product at All!

* Some of the most important topics to discuss during story/story map conversations:
    * "What are our biggest, riskiest assumptions? Where is the uncertainty?"
    * "What could I do to lear something that would replace risks or assumptions with real information?"
* Eric Ries defined MVP in The Lean Startup as "A minimum viable product is also the smallest thing you could do to prove or disprove an assumption."

### Chapter 3: Plan to Learn Faster

#### Start by Discussing Your Opportunity

* You start with a big idea, not a list of stories or requirements.
* Questions to ask:
    * What is the big idea?
    * Who are the customers?
    * Who are the users?
    * Why would they want it?
    * Why are we building it / how does building it help us?
* "Your first story discussion is for framing the opportunity."

#### Validate the Problem

* The big idea is a hypothesis you intend to test.
* First, validate that the problems you're solving actually exist.
* If you can, partner with potential customers to understand their needs.

#### Prototype to Learn

* The product owner moves from the big idea to making some simple narrative stories (user scenarios)
* Do some wireframes and sketching, higher fidelity prototyping to help envision a solution.
* Eventually you want to bring those things to users and get feedback.

#### Watch Out for What People Say They Want

* Recall that users are also just guessing about what they need and want.
* The only real proof of your hypothesis is actual post-launch adoption.

#### Build to Learn

* First goal is not to build an MVP, it's to build a product just big enough that potential usrs could do something useful with it.
* Initial thing won't impress most people, no users would actually use it.
* Show it to some potential users, get feedback.
* Your top release slice should be bigger than the rest, because it's the most developed storyline.

#### Iterate Until Viable

* When potential users would recommend the product to a friend, you've got a product that's both minimum _and_ viable.

#### How to Do It the Wrong Way

* Bad way to iterate a car: one wheel, two wheels, two wheels and body, full car.
* That's useless until the last step.
* Better way: skateboard, scooter, bike, motorcycle, car
* Users are happier at every stage, always have something that does some part of what they need.
* "Treat every release as an experiement and be mindful of what you want to learn."

#### Validated Learning

* Validated learning loop: Build &rarr; MVP Experiment &rarr; Measure with Users and Customers &rarr; Subjective and Objective Data &rarr; Learn &rarr; Better Ideas &rarr; Build
* Author likes to call this "product discovery"
* Goal is to learn as fast as possible whether you're building the right thing.

#### Really Minimize Your Experiments

* Minimize what you build since the goal is learning, not production quality software.
* Try to get around slow dependencies in experiments (like db change review processes)

### Chapter 4: Plan to Finish on Time

* Don't feel like you have to map your whole application to talk about it--"map only what you need to support your conversation."

#### Tell it to the Team

* If you do product discovery with a small group, you still need to build shared understanding with your team
* You can do that with a more refined map that tells the feature's story step by step, from the user's perspective
* You should be able to answer questions about your map, and when you don't know the answer engage the group you're talking with in figuring out questions to look into or solutions to use.

#### The Secret to Good Estimation

* "The best estimates come from developers who really understand what they're estimating."

#### Plan to Build Piece by Piece

* Once you've identified the things you actually have to build, and you can't cut more, you have to create a development plan.
* Make a slice that cuts all the way through the functionality so you can see it end to end.
* Layer on slices to build up the functionality.
* You'll learn some stuff you didn't expect, may have to refine your map.
* Basic setup of the map:
    * Slice 1: all the way through, 'functional walking skeleton'
    * Slice 2: Make it better
    * Slice 3: Make it releasable
    * Slice 4: Nice to have, but may not be possible in time.

#### Don't Release Each Slice

* They're team milestones, not mini-releases.
* They've got different learning goals, bucket them into sprints or whatever you use.

#### The Other Secret to Good Estimation

* "The more frequently you measure, the better you get at predicting."
* Product owner treats early estimates as a 'delivery budget'

#### Manage Your Budget

* You want to roughly track how you're doing against the time you budgeted.
* If you get behind, you can borrow from other areas, manage expectations with the client, change the feature some.
* You probably want to tackle the things that could blow your budget first, since they're the riskiest.
* You may want to add 'risk stories' if you're slipping, or just because:
    * Increase the frequency and fidelity of the story map to identify more risks
    * Mark risks as you identify them
    * Consider using a risk burn-down chart in addition to a normal burn down chart

#### Iterative AND Incremental

* "Use iterative thinking to evaluate and make changes to what you've already made."
* "Use incremental thinking to make additions."
* Sketch: simple version of your functionality without extras
* Add functionality to the sketch
* Over time it builds to be a finished version

#### Opening-, Mid-, and Endgame Strategy

* Author prefers to slice release backlog into three groups:
    * "Opening game" &mdash; focus on essential features / user steps through entire product; focus on risky/challenging bits; skip optional bits, skip sophisticated business rules
    * "Midgame" &mdash; Add stuff supporting additional user steps, implement business rules, start testing for performance, scalability, usability.
    * "Endgame" &mdash; Refine the release, make it better and more efficient, test with real data, test at scale. Get feedback from users and apply it.

#### Slice Out Your Development Strategy in a Map

* Engage the team in slicing the public release into opening, mid, and end game stories.

#### It's All About Risk

* Slicing releases allows you to mitigate risk of identifying / building the wrong product, since you can get something in front of users
* Risk stories and higher map fidelity let you identify technical risk, and tackling risk stories first lets you mitigate that risk.

### Chapter 5: You Already Know How

#### 1. Write Out Your Story a Step at a Time

* Visualize your morning routine. Write each task on a sticky.
* Most of them will start with verbs. Verb phrases are typically 'tasks' that help you realize a goal.
* Most story map stickies are about what people do using your software, and are short verb phrases.
* "User tasks are the basic building blocks of a story map."
* Everybody has different goals, and your goals are what inform the tasks you take on. Same for software users.
* Big tasks are usually able to be decomposed into lots of small tasks by increasing detail.
* Alistair Cockburn has a concept of 'goal level' from the book Writing Effective Use Cases: an altitude metaphor with sea level in the middle and everything else is above or below sea level.
* Sea level task is one we'd expect to complete before intentionally stopping to do something else, like taking a shower. You don't quit in the middle and come back to it later.
* Tasks like showering are made of lots of little tasks, which are "below sea level"
* Summary-level or above sea level tasks are rollups of sea level tasks.

#### 2. Organize Your Story

* Organize your stickies in a left to right flow through time
* Tell a story by stepping through the stickies--using the narrative flow
* Stack items that happen around or at the same time.
* Fill in the holes as you find them.

#### 3. Explore Alternative Stories

* Think about other mornings that were different from the day you based your stickies on
* What were alternative possibilities in the flow? Stack variations, alternatives, and details below the options they relate to.
* Ask questions like, "what would have happened if the hot water was broken?"
* You may have to reorganize your narrative flow.
* You can tell multiple stories now--good day, bad day, great day, etc.

#### 4. Distill Your Map to Make a Backbone

* Map is by now probably wide and deep.
* If you group stories that are near each other in the flow, you can create the activities of the backbone--put them above the regular flow.
* When you name these activities, use the names your users would or do use.

#### 5. Slice Out Tasks that Help You Reach a Specific Outcome

* Separate the map into horizontal stripes, put a desired outcome sticky to the left of each one
* Put the minimum set of tasks into that slice necessary to make the outcome possible.
* Goals might be something like "have a luxurious morning"
* "Use slices to identify all the tasks and details relevant to a specific outcome."

#### That's it! You've Learned All the Important Concepts

* Stuff in summary:
    * Tasks are short verb phrases that describe what people do
    * Tasks have different goal levels
    * Tasks in a map have a left to right narrative flow
    * The depth of a map contains variations and alternative tasks
    * Tasks are organized by activities along the top of the map.
    * Activities form the backbone of the map.
    * You can slice the map to identify tasks you need to reach a specific outcome.

#### Do Try This at Home, or Work

* Try teaching the mapping concepts with the exercise from this chapter.

#### It's a Now Map, Not a Later Map

* The maps from earlier chapters imagine how users will use their products in the future, after the product is delivered.
* This chapter's map describes the way you do things now.
* You can build now maps to better understand how people work currently
* Now maps can identify:
    * Pains
    * Joys / rewards
    * Questions
    * Ideas
* These are sometimes called 'journey maps'

#### Try This for Real

* Talks about a specific experience working with domain experts to map their understanding of a sales process.

#### With Software It's Harder

* Sidebar: Six Simple Steps to Story Mapping
    1. Frame the problem. Who is it for, and why are we building it?
    1. Map the big picture. Focus on breadth, not depth; map the world as it is today to identify pains and joys users have.
    1. Explore. Talk about types of users and people, how they might do things, what might go wrong. Sketch, prototype, test, and refine solution ideas.
    1. Slice out a release strategy. There's always too much to build, slice away to identify minimum viable solutions.
    1. Slice out a learning strategy. Remember that your solution is a hypothesis until proven out. Run product experiments to test subsets of your hypothesis.
    1. Slice out a development strategy. Once you have a minimum viable solution, slice it into the parts you'd like to build earlier and later. Build technical risks first.

#### The Map is Just the Beginning

* Use storytelling with words and pictures to build shared understanding.
* Don't just talk about what to build, talk about who will use it and why; minimize output and maximize outcome.

### Chapter 6: The Real Story about Stories

* Underneath story mapping is the concept of Agile stories.

#### Kent's Disruptively Simple Idea

* Kent Beck noticed that requirements don't imply shared understanding, or even necessarily facilitate it.
* He proposed that the best solutions come from collaboration between the people with problems to solve and the people who can solve them.
* He decided that writing collaborative stories was the best way to do that.

#### Simple Isn't Easy

* "If you're not getting together to have rich discussions about your stories, then you're not really using stories."

#### Ron Jeffries and the 3 Cs 

* Jeffries wrote Extreme Programming Installed, described story process as
    * Card &mdash; write what you'd like to see in the software on a bunch of cards
    * Conversation &mdash; get together and have a rich conversation about what software to build
    * Confirmation &mdash; together agree on how you'll confirm that the software is done

#### Words and Pictures

* Conversation goes best with lots of sketches, diagrams, etc.
* Record your agreements as acceptance criteria.

### Chapter 7: Telling Better Stories

#### Connextra's Cool Template

* Connextra was an early adopter of XP
* Most of the story writers were from sales and marketing, and they'd just write down the feature they needed.
* The dev would have to go find them and have a conversation about what it was supposed to do.
* They came up with a template for story cards.
* The template was:

```
As a [type of user]
I want to [do something]
So that I can [get some benefit]
```

* That would help write the description of their stories.
* They were used to start the conversation about whatever user need.

#### Template Zombies and the Snowplow

* Template zombie (from the book "Adrenaline Junkies and Template Zombies"): "The project team allows its work to be driven by templates instead of by the thought process necessary to deliver products."
* The real value of stories is not what's written on the card, it's in telling the story and having the conversation.
* Author's preferred template:

```
Short, Simple Title
Who:
What:
Why:
```

#### A Checklist of What to Really Talk About

* Really talk about who
    * Say which user you mean, not just 'the user'
    * Talk about different types of user, talk about customers, talk about stakeholders.
* Really talk about what
    * It's ok to talk about a service like it has needs--when you get into deep back end stuff, trying to talk about end users gets silly
* Really talk about why
    * Talk about why the specific user cares
    * Dig deeply into the whys
    * Talk about why other users care, why stakeholders care
* Talk about what's going on outside the software
    * Talk about where people using your product are when they use it, when they'd use it, how often, who else is around when they do
* Talk about what goes wrong
* Talk about questions and assumptions
* Talk about better solutions
    * Don't be afraid to discard existing assumptions during the course of a conversation
* Talk about how
    * It's important to talk about why, but don't discount talking about how, since you have to optimize for implementation as well as the user.
* Talk about how long
    * Ultimately you have to make decisions about what to build
    * Having an idea of cost is pretty crucial to that, so do some estimating

#### Create Vacation Photos

* Make sure to record things you and others can refer to when you need to remember what you talked about and decided.

### Chapter 8: It's Not All on the Card

#### Different People, Different Conversations

* Lots of stakeholders in a typical organization: product owner/manager, business analyst, UX designer, devs, testers, project managers.
* Conversations they have are going to be predicated on their needs and expertise.
* "There are many different kinds of conversations with different people for every story."

#### We're Gonna Need a Bigger Card


