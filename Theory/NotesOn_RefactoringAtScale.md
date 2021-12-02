# Notes on Refactoring at Scale

By Maude Lemaire; O'Reilly Media, Inc, Dec. 2020; ISBN 9781492075530

# Chapter 1: Refactoring

## What is refactoring?

* Restructuring existing code without changing its external behavior
* Book uses a dry cleaning business as an example

## What is refactoring at scale?

* One that impacts a substantial surface area of your your systems
* Usually involves a large (1M+ lines of code) codebase, lots of users
* What makes refactoring large systems different from small ones?
    * Hard to reason about the effect of a change applied uniformly across a large, complex system
    * Largely unable to automate human reasoning about how to restructure large apps in codebases growing at a fast pace
    * One argument is that you can make small, iterative changes, which helps but is likely to peter out once the low hanging fruit is gone and changes get harder to introduce.
* At scale, it's about identifying a systemic problem in the codebase, coming up with a better solution, and executing on it in a strategic, disciplined way

## Why should you care about refactoring?

## Benefits of Refactoring


