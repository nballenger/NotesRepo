# Notes on Introducing GitHub, 2nd Edition

By Brent Beer; O'Reilly Media, Jan. 2018; ISBN 9781491981818

# Chapter 2: Viewing

* Projects have boards with cards that can be linked to notes, issues, and PRs
* The insights tab has a bunch of stuff that lets you view the history of a repo over a long period of time.
    * Pulse - recent activity on a project, for a selected time range
        * Number of PRs merged and added
        * Issues closed and opened
        * Summary of recent changes
        * Bar chart showing commits by contributor
        * List of 'unresolved conversations', a list of issues and PRs with activity but no resolution
    * Contributors Graph
        * Shows contributions to the repo in a time period
        * Also shows graphs by contributor
        * Only shows merged contributions to a branch
    * Community Profile
        * Insight into how the repo presents itself to new contributors
        * Basically a checklist against community standards
    * Commits Graph
        * Shows number of commits per week over the past year
        * Shows cyclical or long term trends
        * Also shows average commits per day of the week
    * Code Frequency Graph
        * Shows the number of lines added to / removed from the repo
        * Helpful for identifying large changes to the code base
    * Dependency Graph
        * Shows an overview of what other components your repo depends on
        * Private repos have to opt in and choose to contribute 
        * Dependents tab of the dependency graph page is useful to find out where your repo is being used, what packages may depend on it.
    * Network Graph
        * Shows number of branches and commits on those branches
        * Also shows any forks created
        * Useful for seeing how far ahead one branch may be
    * Forks List
        * Lists who has forked the repo
    * Traffic Graph
        * Only available to owners and collaborators on a project
        * Shows Git clones, cloners, views, and visitors over time
        * Lists sites linked from, highlights most popular content

# Chapter 3: Creating and Editing

# Chapter 4: Collaboration

* Documents how to contribute by forking and submitting a PR
* Forks are too cumbersome for internal changes, really only for accepting outside submissions
* Commits by merging a branch are more common internally
* Recommends that PRs be merged by the person who created them

## Best practices for Pull Requests

* Create pull requests for everything
* Make the titles descriptive
* Take the time to comment
* Use @mentions for key people
* Run the tests, make sure somebody else does too
* Have a clear policy for how PRs get approved

# Chapter 5: Project Management

* Issues are a lightweight tool for managing outstanding work
* You can manage both features and bugs
* Milestones can be used to assign issues to a particular sprint or deadline
* Labels are super useful for sorting issues and other items
* If you want to reference an issue in a commit, use `#123` where 123 is the issue number. If you prefix the issue number with `closes`, `fixes`, or `resolves`, the issue will auto close when the commit is merged to your default branch.

## Best practices for issues

* Create descriptive labels, like 'feature', 'blocker', 'docs'
* Use milestones if they fit your workflow
* Don't be afraid to reassign issues or add more assignees
* Make extensive use of labels

## Github projects

* Lets you bucket work
