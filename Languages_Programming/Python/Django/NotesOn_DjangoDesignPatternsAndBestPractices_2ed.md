# Notes on Django Design Patterns and Best Practices, 2nd Ed.

By Arun Ravindran; Packt Publishing, May 2018; ISBN 9781788831345

# Chapter: Django and Patterns

## Why Django?

* Free admin interface
* Documentation is high quality
* Strong security focus around things like CSRF, XSS, etc.

## The story of Django

* Fall of 2003, two people at a newspaper in Kansas were developing a bunch of sites, needed a framework.

### A framework is born

* They wrote a CMS
* Eventually released it as Django in 2005 under BSD license

### Removing the magic

* Lots of the original stuff was specific to the original use case
* Had to be refactored to generalize it, make it more Pythonic
* Released big changes in May 2006, released 0.95

### Django keeps getting better

* Summary of some improvements over time:
    * New form-handling lib, 0.96
    * Decoupling admin from models, 1.0
    * Multiple database supports, 1.2
    * Managing static files better, 1.3
    * Better time zone support, 1.4
    * Customizable user model, 1.5
    * Better transaction handling, 1.6
    * Built-in database migrations, 1.7
    * Multiple template engines, 1.8
    * Simplified URL routing syntax, 2.0

## How does Django work?

```
     +---------+
     | Browser |
     +-------+-+
         ^   |
         |   v
    +----+------+       +----------+
    | Webserver |-----> |Filesystem|
    +----+------+       +----------+
         |   ^
         |   |
+--------|---|--------------------------------------------+
|        |   |                                            |
| +------|---|------------------------------------------+ |
| |      |   |                                          | |
| | +----|---|----------------------------------------+ | |
| | |    |   |                                        | | |
| | |    |   |        +-----------+                   | | |
| | |    |   |        |   Views   |     +---------+   | | |     +--+
| | |    |   +--------|           |---> |Models   |-----------> |DB|
| | |    |            |           |     +---------+   | | |     +--+
| | |    |    +-----> | View1     |                   | | |
| | |    v    |       |   .       |                   | | |
| | | URLconf +-----> | View2     |                   | | |
| | |         |       |   .       |                   | | |
| | |         |       |   .       |                   | | |
| | |         +-----> | ViewN     |     +---------+   | | |
| | |                 |           |---> |Templates|   | | |
| | |                 |           |     +---------+   | | |
| | |                 | Exception |                   | | |
| | |                 +-----------+                   | | |
| | |                                      Django App | | |
| | +-------------------------------------------------+ | |
| |                                          Middleware | |
| +-----------------------------------------------------+ |
|                                             WSGI Server |
+---------------------------------------------------------+
```

Request/Response Cycle:

1. Browser sends a request to the Webserver
1. Webserver hands request to WSGI server or directly serves a file from FS
1. WSGI server (possibly running multiple Python applications) populates a Python dict, `environ`, and optionally passes through middleware layers to hand off to the Django application.
1. The Django app uses the URLconf module to select a view to handle the request, and converts the request into an `HttpRequest` Python object
1. The selected view does one or more of:
    1. Talks to a database via the ORM and model defs
    1. Renders HTML or other formatted response body using templates
    1. Returns a plain text response body
    1. Raises an exception
1. The `HttpResponse` object is serialized as it leaves the Django app
1. Some network stuff that the book glosses over.
1. Web page is rendered in the browser

## What is a pattern?

* Blah blah, 'A Pattern Language'

### Gang of four patterns

* Design Patterns book
* Authors: Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
* 23 design patterns:
    * Creational: Abstract Factory, Builder, Factory, Prototype, Singleton
    * Structural: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
    * Behavioral: Chain-of-Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template, Visitor
* Some patterns viewable in Django:
    * Command: `HttpRequest` encapsulates a request in an object
    * Observer: Django Signals let objects signal state changes to listeners
    * Template: Class-based, generic views

### Is Django MVC?

* Common question, answer is broadly yes and no.
* MVC advocates decoupling presentation from application logic, is very rigid about the responsiblity splits between Models, Views, and Controllers
* Django is designed as a pipeline for request/response processing.
* Refers to itself as "Model-Template-View" architecture:
* Separation of concerns between DB interface classes (models), request-processing classes (views), and a templating language for presentation (templates).
* In MVC terms, models are comparable, Django templates are views, and the controller is the framework itself that processes requests and does routing.
* Django calls the callback functions for handling URLs 'view functions,' which are not related to MVC views.

### Fowler's patterns

* Martin Fowler wrote "Patterns of Enterprise Application Architecture" in 2002
* Described 40 or so patterns of enterprise architecture
* These are at a much higher level of abstraction, are largely programming language agnostic.
* Patterns organized via:
    * Domain Logic: Domain Model, Transaction Script, Service Layer, Table Module
    * Data Source Architecture: Row Data Gateway, Table Data Gateway, Data Mapper, Active Record
    * Object-Relational Behavior: Identity Map, Unit of Work, Lazy Load
    * Object-Relational Structure: Foreign Key Mapping, Mapping, Dependent Mapping, Association Table Mapping, Identity Field, Serialized LOB, Embedded Value, Inheritance Mappers, Single Table Inheritance, Concrete Table Inheritance, Class Table Inheritance
    * Object-Relational Metadata Mapping: Query Object, Metadata Mapping, Repository
    * Web Presentation: Page Controller, Front Controller, Model View Controller, Transform View, Template View, Application Controller, Two-Step View
    * Distribution: Data Transfer Object, Remote Facade
    * Offline Concurrency: Coarse-Grained Lock, Implicit Lock, Optimistic Offline Lock, Pessimistic Offline Lock
    * Session State: Database Session State, Client Session State, Server Session State
    * Base: Mapper, Gateway, Layer Supertype, Registry, Value Object, Separated Interface, Money, Plugin, Special Case, Service Stub, Record Set
* Django implementations of some Fowler patterns:
    * Active Record - Django models--they encapsulate db access and add domain logic
    * Class Table Inheritance - Model inheritance - Each entity in the hierarchy is mapped to a separate table
    * Identity Field - ID Field - Saves a DB ID field in an object to maintain identity
    * Template View - Django Templates - Render into HTML by embedding markers in HTML

### Are there more patterns?

* Lots.
* MVC Variants:
    * Model View Presenter
    * Hierarchical MVC
    * Model View ViewModel (MVVM)
* Books:
    * Pattern-Oriented Software Architecture (Buschmann, et al)
    * Enterprise Integration Patterns (Hohpe and Woolf)
    * The Design of Sites (Duyne, Landay, Hong)

## Patterns in this book

* Looks at Django-specific design and architecture patterns
* Pattern layout includes
    * Pattern name
    * Summary of the problem
    * Summary of the proposed solutions
    * Problem Details
    * Solution Details

### Criticism of patterns

* Most common arguments against:
    * Patterns compensate for missing language features. Peter Norvig found that 16 out of 23 original design patterns are invisible or simpler in dynamic languages like Lisp or Python. Example: Functions are first class objects in Python, so you wouldn't need separate classes to implement strategy patterns.
    * Patterns repeat best practices. Lots of them are just formalizations of best practices and can therefore seem redundant. Ex: separation of concerns.
    * Patterns can lead to over-engineering. Implementing a pattern can be less efficient compared to a simpler solution.

### How to use Patterns

* Patterns are useful for communicating that you are following a known approach.
* If your language has a direct solution, don't use a pattern.
* Don't try to retrofit everything in terms of patterns.
* Use a pattern only when it's the most elegant solution in context.
* Don't be afraid to create new patterns.

### Python Zen and Django's Design Philosophy

* Read the zen of python
* Stuff like Don't Repeat Yourself, Loose coupling, and tight cohesion are good

# Chapter: Application Design

## How to gather requirements?

Key points to remember while gathering requirements:

1. Talk directly to app owners, even if they are non-technical.
1. Make sure you listen to their needs fully and note them.
1. Don't use technical jargon.
1. Set the right expectations--if something is difficult or impossible, say so immediately.
1. Sketch as much as possible, people are visual.
1. Break down process flows like user signup.
1. Work through the features list in the form of user stories or another readable form.
1. Play an active role in prioritizing features.
1. Be very, very conservative in accepting new features.
1. Post-meeting, share your notes with everyone to avoid misinterpretations.

Book takes as a project building a social network for superheroes, 'SuperBook'.

## Are you a storyteller?

* What's the one page writeup that should come out of the requirements gathering process? Simple document that explains how it feels to use the site.
* Should focus on the user experience rather than technical or implementation details.
* Write about a typical user, the problem they're facing, and how the app solves it.

## HTML Mockups

* Create a realistic preview of the site. 
* Should have enough details and polish to feel realistic.
* Use working links and some simple JS interactivity.
* Good mockup can do 80% of customer experience with 10% of the effort.

## Designing the Application

* Stop and think:
    * What are the different ways to implement this?
    * What are the tradeoffs?
    * Which factors are more important in our context?
    * Finally, which approach is best?

### Dividing a Project into Apps

* Django applications are called 'projects'
* A project is made of several 'apps'
* An app is a Python package that provides a set of features for a common purpose such as authentication or thumbnails.
* Ideally each app is reusable and loosely coupled to others.
* A typical Django project has 15-20 apps. Don't be afraid to create new ones.
* Important at this point to decide 3rd party or build from scratch.

### Reuse or Roll Your Own?

* For each app in your project, you have to decide 3rd party or in-house.
* Reasons a 3rd party app may not be suitable:
    * Over-engineered for your needs
    * Too specific
    * Might break other apps, have side effects
    * Python dependencies are stale or weird
    * Non-Python dependencies are unworkable or have high overhead
    * Not reusable, or not easy to reuse
* Reasons a 3rd party app may be preferable:
    * DRY - don't reinvent the wheel
    * Too hard to get right
    * Best / most recommended for specific purpose
    * Missing batteries--things that should have been in the framework
    * Minimal dependencies--fewer apps means fewer unintended interactions
* Recommendation: try a 3rd party app in a sandbox.

#### My app sandbox

* Author usually creates a standalone venv named `sandbox`
* Just for prototyping stuff.
* If it's good enough to keep, create a branch in the project using VCS

### Which packages made it?

* SuperBook breaks down into apps including:
    * Authentication, in `django.auth`, for user signup, login, logout
    * Accounts (custom), for user profile info
    * Posts (custom), for posts and comments functionality

## Best practices before starting a project

* Use a fresh venv via stuff like `virtualenv`, `pipenv`, etc.
* Use version control.
* Use a project template, like Edge or Cookiecutter.
* Nice to have a fast deployment process. Author recommends Fabric or Ansible.

## Superbook

* Project is in Python 3.6, Django 2.0

### Why python 3?

* Duh.

### Which Django version to use

* Django has a release schedule with three kinds of releases:
    * Feature release - every 8 months, has 16 months of support from release. Have numbers like A.B (no minor version)
    * LTS release - every 2 years, has three years of support from release. Numbers like A.2 (every third feature release is an LTS).
    * Patch release - Bug fixes and security patches. Versions like A.B.C 

### Starting the Project

Create a separate virtual environment for each Django project.

```
git clone https://github.com/DjangoPatternsBook/superbook2.git
pip install -U pip
pip install pipenv
cd superbook2
pipenv install --dev
pipenv shell
cd src
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

# Chapter: Models

* If your data model is poorly designed, the volume of data will eventually cause scalability and maintenance issues.
* "Rule of Representation: Fold knowledge into data so program logic can be stupid and robust."
* "It is always harder to understand logic in code compared to data." &larr; I don't know about that.
* Data has greater longevity than code. &larr; that I do believe though

## M is bigger than V and C

* Models are classes that abstract database tables (usually).
* You get an autogenerated API for querying the underlying data.
* You can base a lot of other components on models--admins, forms, lots of generic views. 
* Models are used in more places than you'd expect, because Django can be run in multiple ways. Some of the entry points:
    * Request/response web flow
    * Django interactive shell
    * Management commands
    * Test scripts
    * Async task queues like Celery
* In almost all of those cases model modules get imported via `django.setup()`, so it's best to keep models free of unnecessary dependencies, or import other Django components like views.

## The Model Hunt

* First cut at identifying models for the SuperBook app, in a class diagram:

```
                        +---------+
        liked by      n |         | n
     +------------------+ Like    +----------+
     |                  |         |          |
     |                  +---------+         1|
    1|                                   +---------+
+---------+ 1           posted by      n |         |
|         +------------------------------+ Post    |
| User    |                              |         |
|         +--------------------+         +---------+
+---------+ 1    commented by  |            1|
    1|                         |             |
     |                         |             |
     |                         |         +---+-----+
    1|                         |       n |         |
+---------+                    +---------+ Comment |
|         |                              |         |
| Profile |                              +---------+
|         |
+---------+
```

* Each User has a Profile
* A User can make multiple Comments or several Posts
* A Like can be related to a single User/Post combination
* It's useful to draw a class diagram, even leaving out attributes
* Once you make the entire project in a class diagram, it makes separating apps easier
* Tips for creating this representation:
    * Nouns in your write-up end up as entities
    * Boxes represent entities, which become models
    * Connector lines are bi-directional and represent 1:1, 1:N, and N:N rels
    * The field denoting the 1:N relationship is defined in the model on the ER model, and the N side is where the foreign key is declared
* Mapping the above into Django code (which will be spread across apps):

    ```Python
    class Profile(models.Model):
        user = models.OneToOneField(User)

    class Post(models.Model):
        posted_by = models.ForeignKey(User)

    class Comment(models.Model):
        commented_by = models.ForeignKey(User)
        for_post = models.ForeignKey(Post)

    class Like(models.Model):
        liked_by = models.ForeignKey(User)
        post = models.ForeignKey(Post)
    ```

* Eventually we'll reference `settings.AUTH_USER_MODEL` instead of `User`

### Splitting models.py into multiple files

* A large `models.py` can be split up into multiple files in a package.
* All defs that can be exposed at the package level must be defined in `__init__.py` with global scope
* Example directory structure:

    ```
    models
    ├── __init__.py
    ├── comment.py
    ├── post.py
    └── postable.py
    ```

* Contents of `__init__.py`:

    ```Python
    from postable import Postable
    from post import Post
    from comment import Comment
    ```

* Anything else in `__init__.py` runs when the package is imported, so it's where you put package-level init code.

## Structural patterns

### Patterns -- Normalized Models

* Problem: By design, model instances have duplicated data that causes data inconsistencies.
* Solution: Break down your models into smaller models through normalization. Connect the models with logical relationships.

#### Problem Details

Table data like the following has duplication and inconsistency:

| Name | Message | Posted On |
+---+---+---+
| Alfred | Hello? | 2020-01-01 |
| Barbara | Sup. | 2020-01-01 |
| Al fred | Hello again. | 2020-01-01 |
| Charles | Yoooo | 2020-01-01

#### Solution Details

* Generally you design models to be in fully normalized form, then selectively denormalize for performance reasons.
* In the above, you'd factor out users into their own table.
* 1NF requires a table to have:
    * No attribute with multiple values
    * A primary key as a single column or a composite of columns.
* 2NF must meet 1NF and additionally:
    * All non-primary key columns must be dependent on the entire primary key.
* 3NF must meet 1NF and 2NF and additionally:
    * All non-primary key columns must be directly dependent on the entire primary key and must be independent of each other.
* Looking at a normalized set of tables as Django models
    * Composite keys are not directly supported in Django
    * The solution is to apply the surrogate keys and specify `unique_together` in the `Meta` class

```Python
class Origin(models.Model):
    superhero = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    origin = models.CharField(max_length=100)

    def __str__(self):
        return "{}'s origin: {}".format(self.superhero, self.origin)

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    country = models.CharField(max_length=100)

    def __str__(self):
        return "{}: ({}, {})".format(self.country, self.latitude, self.longitude)

    class Meta:
        unique_together = ("latitude", "longitude")

class Sighting(models.Model):
    superhero = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    power = models.CharField(max_length=100)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    sighted_on = models.DateTimeField()

    def __str__(self):
        return "{}'s power {} sighted at: {} on {}".format(
            self.superhero,
            self.power,
            self.location.country,
            self.sighted_on)

    class Meta:
        unique_together = ("superhero", "power")
```

* Normalization can impact performance--as models increase, joins do as well.
* Design your models to keep data normalized, to maintain data integrity.
* If you face scaling problems, selectively derive data from those models to create denormalized data.
* Example: if counting the sightings in a certain country is very common, then add it as an additional field on `Location`. Then include other queries via the Django ORM.
* You have to update that count every time you add or remove a sighting, which means you have to add that work to the `save` method on `Sighting`, add a signal handler, or even compute using an async job.
* Excessive normalization isn't a good thing, can add extra tables and lookups.

### Pattern -- Model Mixins

* Problem: Distinct models have the same fields and/or methods duplicated.
* Solution: Extract common fields and methods into various reusable model mixins.

#### Problem Details

* Three kinds of inheritance in Django:
    * Concrete - derives from the base class. In Django this means the base class is mapped into a separate table, which has terrible performance.
    * Proxy - Can only hadd new behavior to the parent class, not new fields.
    * Abstract - Uses abstract base classes to share data/behavior between models
* Django abstract base classes aren't the same as ABCs in pure Python
* The fields in Django ABCs aren't created in tables for those classes, but instead added to the tables for classes that inherit from them.
* Most Django projects have some model mixins.

#### Solution Details

* Limitations of Django abstract models:
    * No ForeignKey or many to many fields
    * Cannot be instantiated or saved
    * Cannot be directly used in a query (no manager)
* Example:

    ```Python
    class Postable(models.Model):
        created = models.DateTimeField(auto_now_add=True)
        modified = models.DateTimeField(auto_now=True)
        message = models.TextField(max_length=500)

        class Meta:
            abstract = True

    class Post(Postable):
        ...

    class Comment(Postable):
        ...
    ```

* Mixins are abstract classes that can be added as a parent class of a model
* You can list any number of parent classes for a model
* Mixins should be orthogonal and easily composable. More like composition than inheritance.
* Smaller mixins are better. If it violates single responsibility, consider refactoring into smaller classes.
* Further example:

    ```Python
    class TimeStampedModel(models.Model):
        created = models.DateTimeField(auto_now_add=True)
        modified = models.DateTimeField(auto_now=True)
        
        class Meta:
            abstract = True
        
    class Postable(TimeStampedModel):
        message = models.TextField(max_length=500)
        ...

        class Meta:
            abstract = True

    class Post(Postable):
        ...

    class Comment(Postable):
        ...
    ```

### Pattern -- User Profiles

* Problem: Every website stores a different set of user profile details. Django's built-in user model is meant for auth details.
* Solution: Create a user profile class with a 1:1 relation with the user model.

#### Problem Details

* Basic Django user model has some fields, lets you log in, etc.
* Most real world projects need to record more user info
* From Django 1.5 on, the default user model can be extended/replaced
* Official docs suggest only storing auth data in a custom user model
* Some projects need multiple user types, some with common fields, some distinct

#### Solution Details

* Officially recommended solution is to create a user profile model with 1:1 rel to the user model.

    ```Python
    class Profile(models.Model):
        user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                    on_delete=models.CASCADE,
                                    primary_key=True)
    ```

* Recommended to explicitly set `primary_key=True` to prevent concurrency issues in db backends like Postgres.
* Recommended that all profile detail fields be nullable or have defaults.

### Pattern -- Service Objects

#### Problem Details

#### Solution Details

## Retrieval Patterns

### Pattern -- Property Field

#### Problem Details

#### Solution Details

### Pattern -- Custom Model Managers

#### Problem Details

#### Solution Details

## Migrations
