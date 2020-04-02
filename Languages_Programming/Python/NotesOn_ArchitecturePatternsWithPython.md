# Notes on Architecture Patterns with Python

By Bob Gregory, Harry Percival; O'Reilly Median, April 2020

ISBN 9781492052203

# Preface

## Managing Complexity, Solving Business Problems

* Authors work for MADE.com, a European e-commerce co that sells furniture
* Company needs good shipping logistics and predictive modeling, to avoid stock sitting idle

## Why Python?

* Why does the python community need a book like this?
* Python is very popular, but only just starting to tackle the kinds of problems normally solved in C# and Java
* As projects get bigger, it gets harder to apply "there should be one obvious way to do it" from the zen of python
* None of the techniques and patterns are new, some are new to Python
* Doesn't replace things like
    * Domain Driven Design, by Eric Evans
    * Patterns of Enterprise Application Architecture, by Martin Fowler
* All the classic code examples tend to be non-python, which is annoying

## TDD, DDD and Event-Driven Architecture

* "In order of notoriety, we know of three tools for managing complexity:"
    1. Test-driven development (TDD) - helps build correct code, aids refactoring and feature addition without fear of regression. Can be hard to get the best out of tests: How to make sure they run as fast as possible? How to get as much coverage and feedback from fast, dependency-free unit tests, and have the minimum number of slower E2E tests?
    1. Domain-driven design (DDD) - wants to build a good model of the business domain. How do you make sure your models aren't encumbered with infrastructure concerns that may be hard to change?
    1. Loosely coupled (micro-)services integrated via messaging - Not always obvious how to make them fit with the established tools of Python, like Flask, Django, Celery, etc.
* Aim is to introduce some classic architectural patterns, and show how they support TDD, DDD, and event-driven microservices.

## Who should read this book

* Know Python, know managing complexity is rough, don't necessarily know DDD, etc.
* Book structured around an example app
* Tends to show listings of tests, followed by implementation
* Uses some specific Py3 frameworks and tech, like Flask, SQLAlchemy, and Pytest, and Docker and Redis

## Brief Overview of What You'll Learn

* Two major parts
* Part 1: Building an Architecture to Support Domain Modeling
    * Domain modeling and DDD, chapters 1 and 7
    * Repository, Service Layer and Unit of Work Patterns, ch 2, 4, 5
    * Some thoughts on Testing and Abstractions, ch 3 and 6
* Part 2: Event-Driven Architecture
    * Event driven architecture, ch 8 through 11
    * CQRS (command-query responsibility segregation), ch 12
    * Dependency Injection, ch 13

# Introduction: Why do our Designs go Wrong?

* Scientific view of order and chaos:
    * Chaos characterized by homogeneity (sameness)
    * Order by complexity (difference)
* Software systems tend toward chaos:

    > Chaotic software systems are characterized by a sameness of function: API handlers that have domain knowledge, and send emails and perform logging; "business logic" classes that perform no calculations but do perform IO; and everything coupled to everything else so that changing any part of the system becomes fraught with danger.

* Anti-pattern name for it is "Big Ball of Mud" (BBOM)

    > Big ball of mud is the natural state of software in the same way that wilderness is the natural state of your garden. It takes energy and direction to prevent the collapse.

## Encapsulation and Abstractions

* "The term _encapsulation_ covers two closely related ideas: simplifying behavior and hiding data. In this discussion we're using the first sense. We encapsulate behavior by identifying a task that needs to be done in our code, and giving that task to a well defined object or function; we call that an abstraction."
* Uses example code with `urllib` vs `requests` to demonstrate encapsulating the direct connection to a URL (in the simpler `requests` code).
* You can take it a step further by identifying and naming the task we want the code to perform, and using an even higher level abstraction to make that explicit:

    ```Python
# Do a search with the duckduckgo module
import duckduckgo
for r in duckduckgo.query('Sausages').results:
    print(r.url + ' - ' + r.text)
    ```

* In OO, one way to look at this is via "responsibility-driven design," which talks about 'roles' and 'responsibilities' rather than tasks. Think about code in terms of behavior rather than data or algorithms.

## Layering

* Need to pay attention to interactions between the functions and objects that provide encapsulation / abstraction.
* Those interactions form your dependency graph. In a BBOM, dependencies get out of control and make changing nodes in the graph difficult.
* Layered architectures can help tackle that: you divide code into discrete categories or roles and introduce rules about which categories of code can call each other.
* Common pattern is a 3 layer system
    1. Presentation layer
    1. Business logic
    1. Database layer
* Book systematically turns that inside out via Dependency Inversion Principle

## The Dependency Inversion Principle

* Dependency Inversion Principle (DIP) is the D in [SOLID](https://en.wikipedia.org/wiki/SOLID), which is:
    * Single responsibility principle - a class should have only a single responsibility, which means only changes to one part of the software's specification should be able to affect the specification of the class.
    * Open-closed principle - software entities should be open for extension, closed for modification
    * Liskov substitution principle - "Objects in a program should be replaceable with instances of their subtypes without altering the correctness of that program."
    * Interface segregation principle - "Many client-specific interfaces are better than one general purpose interface."
    * Dependency inversion principle - One should depend on abstractions, not concretions.
* Formal definition of DIP:
    1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
    1. Abstractions should not depend on details. Details should depend on abstractions.
* "High-level modules" are those that deal with the real world concepts in your domain.
* "Low-level modules" are the code your org doesn't really care about, like IO, SMTP, whatever.
* "Depends" in this case isn't so much 'imports' or 'calls' but more 'knows about' or 'needs'. High level stuff shouldn't really know or care about the specific implementation of low level stuff.
* So both sides need to use abstractions. High level modules should be easy to change in response to business needs, low levels are often harder to change, and you don't want business logic changes slowed down via tight coupling to low level details.
* You need to be able to change your low level stuff though without having to change the business layer code. Adding an abstraction between them lets you do that more easily.
* Ch. 4 will deal concretely with how "abstractions should not depend on details" might work.

## A place for all our business logic: the domain model

* Very common reason that designs go wrong is that "business logic becomes spread out throughout the layers of our application, making it hard to identify, understand, and change."

# Part 1. Building an Architecture to Support Domain Modelling

* Lots of developers know their architectures could be better. Common response to needing to design a new system is to start building a new data model, with the object model treated as an afterthought.
* That's wrong. "Behavior should come first, and drive storage requirements."
* Chapter 1 looks at building a rich object model via TDD, then how to keep that model decoupled from technical concerns.
* Looks at 4 key design patterns:
    * Repository pattern - abstraction over the idea of persistent storage
    * Service layer - clearly defines where use-cases begin and end
    * Unit of Work pattern - provide atomic operations
    * Aggregate pattern - enforces the integrity of data
* Also talk some about coupling and abstractions
* Some appendices are extensions of content in Part 1:
    * Appendix B is the infra for the example code
    * Appendix C shows how to swap out entire infrastructure for a totally different IO model
    * Appendix D shows patterns in Django instead of Flask+SQLAlchemy

# Chapter 1: Domain Modelling

* Visual placeholder for the Domain Model:
    * Rhombus leads to
    * Square leads to
    * Circle

## What is a Domain Model?

* Replacement for the "business logic layer" in the intro's 3 layer design
* "Domain" - the problem you're trying to solve
* "Model" - map of a process or phenomenon that captures some useful property
* Domain-driven design (DDD) provides the concept of domain modeling
* Lots of the architecture patterns in the book come from DDD, like
    * Entity, Aggregate, and Value Objects
    * Repository pattern
* "In a nutshell, DDD says that the most important thing about software is that it provides a useful model of some problem. If we get that model right, then our software delivers value and makes new things possible."
* Recommended books:
    * Domain-Driven Design, Eric Evans
    * Implementing Domain-Driven Design, Vaughn Vernon
* The domain model is a mental map of the business, tends towards jargon
* Book uses a real world domain model around furniture retail

