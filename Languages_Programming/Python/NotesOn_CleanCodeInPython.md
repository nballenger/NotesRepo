# Notes on Clean Code in Python

By Mariano Anaya; Packt Publishing, August 2018; ISBN 9781788835831

* Benefits of a code style standard like PEP8
    * Easier to search code (difference between 'varname =' and 'varname='
    * Reading uniformly laid out code is easier
    * Readable code makes it easier to debug and maintain
* Documenting code:
    * Avoid comments
    * Use docstrings
    * Annotate and use type hinting
* Type hinting with Mypy
    * Does optional static type checking
    * Analyzes files, reports on type inconsistencies
    * Ignore false positives with `# type: ignore` after a declaration line it complains about
* Pylint
    * Fairly complete and strict
    * configs from `pylintrc`
* Automatic checks
    * Use makefiles to define them
    * Something like

            typehint:
              mypy src/ tests/

            test:
              pytest tests/

            lint:
              pylint src/ tests/

            checklist:
              lint typehint test

            .PHONY: typehint test lint checklist

    * Suggests using Black to auto format code
    * "If the code always respects the same structure, changes in the code will only show up in pull requests with the actual changes that were made, and no extra cosmetic modifications"

# Chapter: Pythonic Code

* Goals:
    * understand indices and slices, correctly implement objects that can be indexed
    * implement sequences and other iterables
    * learn good use cases for context managers
    * implement more idiomatic code through magic methods
    * avoid common mistakes that lead to side-effects
* Indexes and slices
    * Always use slice syntax rather than random roll-your-own indexing
* Creating your own sequences
    * If you want to implement `__getitem__` on a custom class:
        * In wrapper code, delegate it to the underlying class implementation
        * In a real custom sequence with no base sequence object:
            * When indexing by a range, the result should be an instance of the same type as the class
            * In the range provided by `slice`, respect the semantics python uses, excluding the last element
* Context managers
    * Exist to enable a pattern where you have an action with setup and teardown steps
    * Context managers use `__enter__` and `__exit__`
    * `with` calls `__enter__`, then the code enters a new context
    * After the last statement of the nested context, `__exit__` is called
    * If the block raises an exception, `__exit__` is still called, and actually receives the exception if you want to manage it
    * If you write an `__exit__` method, don't accidentally have it return `True`--that means the exception passed to `__exit__` should not propagate, which shouldn't be the behavior unless you explicitly want it to be
* Implementing context managers
    * Any class that implements `__enter__` and `__exit__` can act as a context manager
    * There are more ways to do it via the `contextlib` standard library module
    * Example using a decorator:

            import contextlib

            @contextlib.contextmanager
            def db_handler():
                stop_database()
                yield
                start_database()

            with db_handler():
                db_backup()  # db must be stopped to run this

    * Example using a mixin base class:

            class dbhandler_decorator(contextlib.ContextDecorator):
                def __enter__(self):
                    stop_database()

                def __exit__(self, ex_type, ex_value, ex_traceback):
                    start_database()

            @dbhandler_decorator()
            def offline_backup():
                run("pg_dump_database")

    * Example of a util package that enters a context manager where, if one of the provided exceptions is raised, does not fail:

            import contextlib

            with contextlib.suppress(DataConversionException):
                parse_data(input_json_or_dict)

* Properties, attributes, and different types of methods for objects
    * No real way to have actual private methods, though preceding underscores are convention
    * Underscores in Python
        * Everything not strictly part of an object's interface should be underscore prefixed
        * If you use a double preceding underscore, it DOES NOT actually create a private attribute; for those variables name mangling occurs, and an attribute with name `_<class-name>__<attr-name>` is created
        * The double underscore was created as a means to override different methods of a class that is going to be extended several times, without the risk of method name collisions
        * Don't use double underscores, they're not Pythonic.
    * Properties
        * If you need to hold values, regular attributes are fine
        * If you need object state, properties are a good choice
        * Don't write `get_` and `set_` methods for all attributes, just computed ones
        * Use the `@property` and `@<propety-name>.setter` decorators
* Iterable objects
    * Any object that has `__next__` or `__iter__` can be an iterator
    * Sequences that have `__len__` and `__getitem__` can be iterators
* Creating Iterable Objects
    * When you iterate an object, python calls `iter()` on it
    * That checks for `__iter__` on the object, and executes it if present
    * Reusing iterators doesn't work, because they become empty
    * An iterable constructs an iterator, and that is what gets iterated over
    * If you have your `__iter__` call use a generator (with `yield`), you can have it created every time you loop over it:

            class DateRangeContainerIterable:
                def __init__(self, start_date, end_date):
                    self.start_date = start_date
                    self.end_date = end_date

                def __iter__(self):
                    current_day = self.start_date
                    while current_day < self.end_date:
                        yield current_day
                        current_day += timedelta(days=1)

            r1 = DateRangeContainerIterable(date(2018,1,1), date(2018,1,5))
            ", ".join(map(str, r1))
            max(r1)         # <-- without generator would fail as empty

    * The above is a 'container iterable'. Good to use when using generators.


# Chapter: General Traits of Good Code

## Design by contract

* "The idea behind DbC is that instead of implicitly placing in the code what every party is expecting, both parties agree on a contract that, if violated, will raise an exception, clearly stating why it cannot continue."
* Parts of a contract:
    * Preconditions - the checks the code will perform before running
    * Postconditions - validations done after the call is returned; run to validate what the caller is expecting from this component
    * Invariants - document in the docstring; the things that are kept constant while the code of the function is running, as an expression of the logic of the function that is correct
    * Side effects - any side effects should go in the docstring

### Preconditions

* All guarantees that a function/method requires to work correctly
* Book prefers a demanding approach (validation is on the function side, not the client side, bad data is rejected), because it is the safest and most common practice
* Keep it non-redundant; only do the validation in one place

### Postconditions

* Part of the contract responsible for enforcing the state after the method or function has returned
* If the function is called correctly (preconditions are met), postconditions ensure that certain properties are preserved
* Check and validate for everything that a client might need
* "If the method executed properly, and the postcondition validations pass, then any client calling that code should be able to work with the returned object without problems, as the contract has been fulfilled."

### Pythonic Contracts

* PEP316, "Programming by Contract for Python" got deferred
* Best way to enforce is by adding control mechanisms to methods, functions, and classes, and if they fail raise `RuntimeError` or `ValueError`
* Keep the code as isolated as possible; code for preconditions in one part, postconditions in another, and core function logic in a third
* Sometimes you use smaller functions for that, sometimes decorators

### Design by Contract - conclusions

* it takes more work but results in better code and easier to diagnose failures

## Defensive Programming

* Instead of failing if conditions are unmet, defensive programming is about making all parts of the code (objects, functions, methods) able to protect themselves against invalid inputs
* Main ideas:
    * How to handle errors for scenarios we might expect to occur (use error handling)
    * How to deal with errors that should never occur (use assertions)

### Error Handling

* Gracefully respond to expected errors in an attempt to continue program operation, or deciding to fail if the error is insurmountable
* Approaches covered here:
    * Value substitution
    * Error logging
    * Exception handling

#### Value substitutions

* If you get a bad value and can replace it with a good value, do so
* Use default values when you can; use fallbacks when safe to do so

#### Exception Handling

* If the error is outside the control of the function, it should make that clear
* The purpose of exceptions: "clearly announcing an exceptional situation, not altering the flow of the program for business logic"
* It is harder to read a program that uses exception handling for biz logic
* "Raise exceptions when there is actually something wrong with the code that callers need to be aware of"
* If a function raises too many exceptions, it could be that the function has too many responsibilities and should be broken up into smaller functions
* Handle exceptions at the right level of abstraction
    * Don't catch them deep in the call stack when they relate to an outer layer
* Do not expose tracebacks
* Avoid empty except blocks
    * Two alternatives:
        * Catch a more specific exception
        * Do actual error handling in the except block
    * Best is both of those simultaneously
    * If you raise a different exception, include the original exception
* Include the original exception
    * Use the construct `raise <e> from <original_exception>`
    * Embeds the original traceback into the new exception, original exception gets set to the `__cause__` attribute of the resulting one
    * Example of wrapping default exceptions with custom ones:

        ```python
        class InternalDataError(Exception):
            """ An exception with the data of our domain problem """

        def process(data_dict, record_id):
            try:
                return data_dict[record_id]
            except KeyError as e:
                raise InternalDataError("Record not present") from e
        ```

### Using assertions in Python

* Assertions should be used for situations that should never happen
* `assert something` should be where `something` is an impossible condition
* If this is the case, there is no chance of continuing the program
* You use them to prevent the program causing further damage if the condition persists
* Assertions should never be mixed with business logic or used as control flow
* Include descriptive messages in assertions, log the errors
* Don't assert function calls--function calls can have side effects that are hard to reproduce

## Separation of concerns

* Each concern should not have to know anything about others
* Concerns are enforced by contract
* The idea can be applied to any software component

### Cohesion and coupling

* Cohesion - objects should have a small, well-defined purpose, do as little as possible
* The more cohesive things are the more reusable they are
* Coupling - how two or more objects depend on each other
* If code is tightly coupled, it has consequences:
    * Code becomes difficult to reuse
    * Ripple effects propagate around
    * There is a low level of abstraction presented by tightly coupled components

## Acronyms to live by

### DRY/OAOO

* DRY - Don't Repeat Yourself
* OAOO - Once and Only Once
* Code duplication has consequences:
    * It's error prone
    * It's expensive in development terms
    * It's unreliable

### YAGNI

* YAGNI - You Ain't Gonna Need It
* Don't over-engineer, don't add requirements before you actually need them

### KIS

* KIS - Keep It Simple

### EAFP/LBYL

* EAFP - Easier to Ask Forgiveness than Permission
* LBYL - Look Before You Leap
* EAFP: Write your code so it performs actions directly, then take care of the consequences of failure later
* LBYL: Check for file existence before opening a filehandle. Not pythonic--just try to open it and handle the failure state

## Composition and Inheritance

* Dangers of using inheritance:
    * every time you extend a class, you're creating a tightly coupled component
* Don't force inheritance into your design just to make code reuse easier

### When inheritance is a good decision

* When you subclass you get all the parent code for free, but your sub may not need it all
* Think about whether the sub needs all the parent functionality--if not, ask:
    * Is the superclass vaguely designed? Does it have too much responsibility?
    * Is the subclass a proper specialization of hte superclass it extends?
* Good cases for inheritance:
    * When the base class defines some behavior and the subs truly extend / augment it
    * When the base defines no code, just the interface, and the subs implement it
    * Exceptions--very easy to have custom exceptions that inherit from `Exception`

### Anti-patterns for inheritance

* Correct use for inheritance is specialization
* Common Python anti-pattern: there's a domain problem to represent, and a suitable data structure is devised to represent it, but instead of creating an object that uses that data structure, the object _becomes_ the data structure itself
* Example: you want to represent a customer's insurance policy, and you want to get it via `policy[customer_id]`. Then you subclass `collections.UserDict` just because that access method looks like a dictionary, and end up with a ton of unneeded behavior in that object.
* The problem is the mixing of implementation objects with domain objects. A dict is an implementation object, and a policy is a domain object that might _use_ a dict, but is not itself an instance of one.

### Multiple inheritance in Python

* Using it wrong leads to real complicated problems.
* Mixins are probably the best use of it

#### Method Resolution Order

* You can ask a class for its resolution order: `[cls.__name__ for cls in SomeClass.mro()]`

#### Mixins

* Mixin - base class that encapsulates some behavior that should be reusable
* Not useful alone (typically), extending it alone doesn't work
* Use mixins alongside other classes in a multiple inheritance

## Arguments in functions and methods

### How function arguments work in Python

#### How arguments are copied to functions

* Arguments in Python are always passed by value.
* When passing a value to a function, it will be assigned to the variable on the signature defintion of hte function that matches it.
* If you pass a mutable object, the function can change it as a side effect.

#### Variable number of arguments

* You can use the `*args` syntax for full or partial unpacking of the arg list
* Example of using unpacking to a tuple to iterate via named variables:

    ```python
    return [ User(user_id, first_name, last_name)
             for (user_id, first_name, last_name) in data_rows ]
    ```

### The number of arguments in functions

* Functions/methods that take too many arguments are generally a bad sign
* Alternative 1: reification (creating a new object for the arguments being passed, passing the object)
* Alternative 2: use python-specific features (`*args` and `**kwargs` unpacking) to make use of variable positional and keyword arguments
* Have to be careful with option 2, as you can make something so dynamic it's hard to maintain or test
* If the function is doing too many things, break it down

#### Function arguments and coupling

* The more arguments a function signature has, the more likely it is to be tightly coupled with the caller function
* Posit that you have two functions, f1 and f2
    * f2 takes five arguments, and is therefore hard to call because it is difficult to marshall that many pieces of info at once
    * f1 can call f2 successfully
    * f2 is therefore probably a leaky abstraction, since f1 knows everything f2 requires, and can probably do it without f2's help
    * seems like f2 is really only useful to f1, so it's hard to reuse

#### Compact function signatures that take too many arguments

* Strategies for compacting signatures:
    * If you are passing multiple attributes of an object, pass the object instead
    * If you have related parameters, consider grouping them into an object and passing the object
    * Always try to pass immutable objects, be careful of side effects when passing mutables
    * As a last resort, change the signature of the function to take a variable number of arguments

## Final remarks on good practices for software design

### Orthogonality in software

* Orthogonality in math means two elements are independent--not related at all
* Parts of software should be orthogonal--changing a module, class, or function should have no impacton the outside world
* That's not always possible, but good design tries to minimize the impact via:
    * separation of concerns
    * non-cohesion
    * isolation of components
* At runtime, orthogonality means changes / side-effects are localized. Calling a method on an object should not alter the internal state of other, unrelated objects

### Structuring the code


# Chapter: The SOLID Principles

## Single responsibility principle

### A class with too many responsibilities

### Distributing responsibilities

## The open/closed principle

### Example of maintainability perils for not following open/closed

### Refactoring the events system for extensibility

### Extending the events system

### Final thoughts about the OCP

## Liskov's substitution principle

### Detecting LSP issues with tools

#### Detecting incorrect datatypes in method signatures with mypy

#### Detecting incompatible signatures with Pylint

### More subtle cases of LSP violations

### Remarks on the LSP

## Interface Segregation

### An interface that provides too much

### The smaller the interface, the better

### How small should an interface be?

## Dependency inversion

### A case of rigid dependencies

### Inverting the dependencies

# Chapter: Using Decorators to improve our code

## What are decorators in Python

* Set out in PEP-318
* Supposed to simplify how functions/methods are defined when they have to be modified after their original defintiion
* Previously you'd have to do something like

    ```python
    def original():
        pass

    def modifier(fn):
        return fn

    original = modifier(original)
    ```

* Decorators are just syntactical sugar for calling whatever is after the first decorator as a first parameter of the decorator itself, with the result being whatever the decorator returns
* Original for functions/methods, but the syntax actually lets you decorate any kind of object

### Decorate functions

* Use decorators on functions to, for instance, validate parameters, check preconditions, change behavior, modify signature, cache results, etc.
* Example of a decorator that implements a retry mechanism, controlling for a domain level exception and retrying some number of times

    ```python
    class ControlledException(Exception):
        pass

    def retry(operation):
        @wraps(operation)
        def wrapped(*args, **kwargs):
            last_raised = None
            RETRIES_LIMIT = 3
            for _ in range(RETRIES_LIMIT):
                try:
                    return operation(*args, **kwargs)
                except ControlledException as e:
                    logger.info("retrying %s", operation.__qualname__)
                    last_raised = e
            raise last_raised
        return wrapped

    @retry
    def run_operation(task):
        return task.run()
    ```

### Decorate Classes

* Class decorators come from PEP-3129
* Same syntax as functions
* When you write a class decorator, you have to take a class as parameter, not a function
* Benefits of class decorators:
    * code reuse / DRY principle--valid case would be to enforce that multiple classes conform to an interface or some other criteria
    * can create smaller/simpler classes to be enhanced by decorators
    * transformation logic to apply to a class is easier to maintain in a decorator than in something like metaclasses
* Example for an event system for a monitoring platform, where you need to transform the data for each event and send to an external system, but each event may have its own requirements for sending data.
* INEFFICIENT EXAMPLE, using separate class to do serialization:

    ```python
    class LoginEventSerializer:
        def __init__(self, event):
            self.event = event

        def serialize(self) -> dict:
            return {
                "username": self.event.username,
                "password": "something",
                "ip": self.event.ip,
                "timestamp": self.event.timestamp.strftime("%Y-%m-%d %H:%M"),
            }

    class LoginEvent:
        SERIALIZER = LoginEventSerializer

        def __init__(self, username, password, ip, timestamp):
            self.username = username
            self.password = password
            self.ip = ip
            self.timestamp = timestamp

        def serialize(self) -> dict:
            return self.SERIALIZER(self).serialize()
    ```

* Problems with the above:
    * Too many classes--one serializer per event type is a lot
    * Solution isn't flexible
    * Creates a bunch of boilerplate code--you can extract into a mixin, but meh
* Alternative is to dynamically construct an object that, given a set of filters/transforms and an event instance, is able to serialize it by applying the filters to its fields

    ```python
    def hide_field(field) -> str:
        return "**redacted**"

    def format_time(field_timestamp: datetime) -> str:
        return field_timestamp.strftime("%Y-%m-%d %H:%M")

    def show_original(event_field):
        return event_field

    class EventSerializer:
        def __init__(self, serialization_fields: dict) -> None:
            self.serialization_fields = serialization_fields

        def serialize(self, event) -> dict:
            return {
                field: transformation(getattr(event, field))
                for field, transformation in
                self.serialization_fields.items()
            }

    class Serialization:
        def __init__(self, **transformations):
            self.serializer = EventSerializer(transformations)

        def __call__(self, event_class):
            def serialize_method(event_instance):
                return self.serializer.serialize(event_instance)
            event_class.serialize = serialize_method
            return event_class

    @Serialization(
        username=show_original,
        password=hide_field,
        ip=show_original,
        timestamp=format_time,
    )
    class LoginEvent:
        def __init__(self, username, password, ip, timestamp):
            self.username = username
            self.password = password
            self.ip = ip
            self.timestamp = timestamp
    ```

### Other types of decorator



### Passing arguments to decorators

#### Decorators with nested functions

#### Decorator objects

### Good uses for Decorators

#### Transforming parameters

#### Tracing Code

## Effective decorators - avoiding common mistakes

### Preserving data about the original wrapped object

### Dealing with side-effects in decorators

#### Incorrect handling of side-effects in decorators

#### Requiring decorators with side-effects

### Creating decorators that will always work

## The DRY principle with decorators

## Decorators and separation of concerns

## Analyizing good decorators


# Chapter: Getting more out of our objects with descriptors

* Goals:
    * Understand what descriptors are, how they work, how to implement effectively
    * Analyze the two types of descriptors (data and non-data)
    * Reuse code via descriptors
    * Analyze examples of good descriptor use

## A first look at descriptors

### The machinery behind descriptors

* To implement them, you need at least two classes
* For this example, the book uses:
    * `descriptor` class - implements the descriptor logic
    * `client` class - uses the functionality from `descriptor`
* Simplest form is an object that implements the descriptor protocol
* Must have an interface with at least one of:
    * `__get__`
    * `__set__`
    * `__delete__`
    * `__set_name__`
* Names in this example:
    * `ClientClass` - domain level abstraction that uses the descriptor, contains an attribute `descriptor` that is an instance of `DescriptorClass`
    * `DescriptorClass` - implements the descriptor protocol
    * `client` - instance of `ClientClass`
    * `descriptor` - instance of `DescriptorClass`, as attribute of `client`
* Always make the descriptor object a class attribute--instance attribute won't work.
* Normally if you access a class's attributes, you get the objects and their properties as they are defined:

    ```python
    class Attribute:
        value = 42

    class Client:
        attribute = Attribute()

    Client().attribute          # returns <__main__.Attribute object at 0x...>
    Client().attribute.value    # returns 42
    ```

* With descriptors, the `__get__` method is called on attribute access:

    ```python
    class DescriptorClass:
        def __get__(self, instance, owner):
            if instance is None:
                return self
            logger.info("Call: %s.__get__(%r, %r)", 
                self.__class__.__name__, instance, owner)
            return instance

    class ClientClass:
        descriptor = DescriptorClass()

    client = ClientClass()
    client.descriptor       # calls DescriptorClass.__get__(<ClientClass obj>)
    client.descriptor is client     # returns True
    ```

* Allows you to abstract logic behind the `__get__` method
* Allows the `descriptor` to transparently run transformations without client knowing

### Exploring each method of the descriptor protocol

* `__get__(self, instance, owner)`
    * `self` is the descriptor object
    * `instance` is the object from which `descriptor` is being called
    * `owner` is a reference to the class of `instance`
    * You get the class directly because if `descriptor` is called from the class (`ClientClass`) and not an instance of that class, `instance` will be `None`, so you wouldn't be able to get the class from the instance via `instance.__class__`
    * Call styles:
        * `ClientClass.descriptor` - call from the class
        * `ClientClass().descriptor` - call from an instance
    * Typical idiom is to return the descriptor itself when `instance` is `None`
* `__set__(self, instance, value)`
    * Called when you try to assign something to a descriptor, like `client.descriptor = "some value"`
    * If the descriptor class doesn't implement `__set__`, that assignment overwrites the descriptor itself
    * Most common use of this method is to store data in an object
    * You could create generic validation objects with it
    * Validation example:

        ```python
        class Validation:
            def __init__(self, validation_function, error_message: str):
                self.validation_function = validation_function
                self.error_msg = error_msg

            def __call__(self, value):
                if not self.validation_function(value):
                    raise ValueError(f"{value!r} {self.error_msg}")

        class Field:
            def __init__(self, *validations):
                self._name = None
                self.validations = validations

            def __set_name__(self, owner, name):
                self._name = name

            def __get__(self, instance, owner):
                if instance is None:
                    return self
                return instance.__dict__[self._name]

            def validate(self, value):
                for validation in self.validations:
                    validation(value)

            def __set__(self, instance, value):
                self.validate(value)
                instance.__dict__[self._name] = value

        class ClientClass:
            descriptor = Field(
                Validation(lambda x: isinstance(x, (int, float)), "is not a number"),
                Validation(lambda x: x >= 0, "is not >= 0"),
            )

        client = ClientClass()
        client.descriptor = 42      # sets fine
        client.descriptor = -42     # raises ValueError for not >= 0
        ```

    * Allows you to abstract away into the descriptor something that would normally be put into a property and reused multiple times
    * `__set__` is doing what `@property.setter` would do
* `__delete__(self, instance)`
    * Called via `del client.descriptor`
    * Example of a descriptor that won't let you remove attributes without privileges:

        ```python
        class ProtectedAttribute:
            def __init__(self, requires_role=None) -> None:
                self.permission_required = requires_role
                self._name = None

            def __set_name__(self, owner, name):
                self._name = name

            def __set__(self, user, value):
                if value is None:
                    raise ValueError(f"{self._name} can't be set to None")
                user.__dict__[self._name] = value

            def __delete__(self, user):
                if self.permission_required in user.permissions:
                    user.__dict__[self._name] = None
                else:
                    raise ValueError(
                        f"User {user!s} doesn't have {self.permission_required}"
                    )

        class User:
            """ Only users with admin privs can remove email address """

            email = ProtectedAttribute(requires_role="admin")

            def __init__(self, username: str, email: str, permission_list: list = None) -> None:
                self.username = username
                self.email = email
                self.permissions = permission_list or []

            def __str__(self):
                return self.username

        admin = User("root", "root@example.com", ["admin"])
        user = User("user", "user@example.com", ["email", "helpdesk"])
        del admin.email     # allowed
        del user.email      # raises ValueError
        ```

* `__set_name__(self, owner, name)`
    * Typically the descriptor needs to know the name of the attribute it will handle
    * The attribute name is what you use to read/write `__dict__` entries in `__get__`/`__set__`
    * Before 3.6 you had to pass the name explicitily to the `__init__` for the descriptor
    * In 3.6 `__set_name__` was added, and it receives the class where the descriptor is being created, and the name that is being given to the descriptor
    * Most common idiom is to use this method so it can store the required name
    * For backwards compatibility it's a good idea to keep a default value in `__init__`
    * Example:

        ```python
        class DescriptorWithName:
            def __init__(self, name=None):
                self.name = name

            def __set_name__(self, owner, name):
                self.name = name
        ```

## Types of descriptors

* If it implements `__set__` or `__delete__`, it's a data descriptor
* If it only implements `__get__` it's a non-data descriptor
* During attribute resolution, a data descriptor will always take precedence over the object's `__dict__`, while a non-data descriptor will not
* So for a non-data descriptor, if a key in the `__dict__` matches the name, it will be used and the descriptor will never run.

### Non-data descriptors

```python
class NonDataDescriptor:
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return 42

class ClientClass:
    descriptor = NonDataDescriptor()

client = ClientClass()
client.descriptor           # returns 42
client.descriptor = 43      # assigns to client.__dict__["descriptor"]
client.descriptor           # returns 43, ClientClass.descriptor doesn't fire
del client.descriptor       # removes entry in client.__dict__
client.descriptor           # ClientClass.descriptor re-exposed, returns 42
client.descriptor = 99      # assigns to client.__dict__["descriptor"]
client.descriptor           # returns 42
vars(client)                # returns {'descriptor': 99}
client.__dict__["descriptor"]   # returns 99
del client.descriptor       # raises AttributeError: __delete__
```

### Data descriptors

```python
class DataDescriptor:
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return 42

    def __set__(self, instance, value):
        logger.debug("setting %s.descriptor to %s", instance, value)
        instance.__dict__["descriptor"] = value

class ClientClass:
    descriptor = DataDescriptor()

client = ClientClass()
client.descriptor           # returns 42
```

* Worth noting that `__set__` writes to `instance.__dict__` directly instead of calling `setattr` on it--this is because `setattr` will end up calling `__set__` itself again, and you get a recursive loop.
* Never use `setattr` or the assignment expression directly on the descriptor inside the `__set__` method, or you trigger that loop.
* You don't add references from the descriptor to the client object--the client has a reference to the descriptor already, and you don't want to create a circular dependency or you get memory leaks
* If you need to do it for some reason, use the `weakref` module and create a weak reference key dictionary

## Descriptors in action

### An application of descriptors

#### A first attempt without using descriptors

* Problem to solve:
    * we have a regular class with some attributes
    * we want to track all the different values an attribute has over time
    * you could do this in a property, and every time a value is changed, add it to an internal list
* Example of a class representing a traveler who has a current city, and you want to track cities visited throughout the program:

```python
class Traveller:
    def __init__(self, name, current_city):
        self.name = name
        self._current_city = current_city
        self._cities_visited = [current_city]

    @property
    def current_city(self):
        return self._current_city

    @current_city.setter
    def current_city(self, new_city):
        if new_city != self._current_city:
            self._cities_visited.append(new_city)
        self._current_city = new_city

    @property
    def cities_visited(self):
        return self._cities_visited
```

* This works fine, but if you need the same pattern elsewhere in code, you have to repeat the logic for each attribute and in different classes.

#### The idiomatic implementation

* Addressing the same problem using a descriptor generic enough to be applied in any class
* This isn't actually necessary inasmuch as the program doesn't require such reusability
* Don't implement a descriptor unless you have actual repetition problems to address

```python
class HistoryTracedAttribute:
    def __init__(self, trace_attribute_name) -> None:
        self.trace_attribute_name = trace_attribute_name
        self._name = None

    def __set_name__(self, owner, name):
        self._name = name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__[self._name]

    def __set__(self, instance, value):
        self._track_change_in_value_for_instance(instance, value)
        instance.__dict__[self._name] = value

    def _track_change_in_value_for_instance(self, instance, value):
        self._set_default(instance)
        if self._needs_to_track_change(instance, value):
            instance.__dict__[self.trace_attribute_name].append(value)

    def _needs_to_track_change(self, instance, value) -> bool:
        try:
            current_value = instance.__dict__[self._name]
        except KeyError:
            return True
        return value != current_value

    def _set_default(self, instance):
        instance.__dict__.setdefault(self.trace_attribute_name, [])

class Traveller:
    current_city = HistoryTracedAttribute("cities_visited")

    def __init__(self, name, current_city):
        self.name = name
        self.current_city = current_city
```

### Different forms of implementing descriptors

#### The issue of global shared state

* Descriptors have to be class attributes to work, which requires some warnings
* Class attributes are shared across all instances of the class
* If you try to keep data in a descriptor object directly, all instance have it
* Always keep data in the client object's `__dict__`

#### Accessing the dictionary of the object

* Always store and return data from the `__dict__` attribute of the instance.

#### Using weak references

* If you don't want to use `__dict__`, you can make the descriptor object keep track of the values for each instance itself, in an internal mapping
* That mapping CANNOT be a normal dictionary, or you will create memory leaks via circular (un-garbage collectable) references
* You have to use a weak key dictionary via the `weakref` module

```python
from weakref import WeakKeyDictionary

class DescriptorClass:
    def __init__(self, initial_value):
        self.value = initial_value
        self.mapping = WeakKeyDictionary()

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return self.mapping.get(instance, self.value)

    def __set__(self, instance, value):
        self.mapping[instance] = value
```

* Addresses the problems, but comes with caveats:
    * The objects don't hold their attributes, the descriptor does; if you forget that and try to use `vars(client)` or similar, the data isn't there
    * The objects must be hashable to serve as dict keys
* Overall better to use `instance.__dict__`, this variant shown for completeness

### More considerations about descriptors

#### Reusing code

* Best way to use descriptors is to identify cases where you would use a property, but you'd have to repeat some logic multiple times across many properties
* For decorators and descriptors, if it doesn't get used at least three times, don't do it
* Keep in mind that you should use descriptors for places where you want to define an internal API that client code will consume. This is more for libraries and frameworks than one-time solutions
* Avoid putting business logic in descriptors if possible. They are for implementational code rather than business code--they're more like a data structure or other generic tool.

#### Avoiding class decorators



## Analysis of descriptors

### How python uses descriptors internally

# Chapter: Using Generators

# Chapter: Unit Testing and Refactoring

* Goals--gain insight into:
    * Why automated tests are critical for agile projects
    * How unit tests work as a heuristic for code quality
    * What frameworks and tools are available for automated testing and 'quality gates'
    * Taking advantage of unit tests to understand the domain problem better and document code
    * Concepts related to unit testing, such as TDD

## Design principles and unit testing

* "A unit test is a piece of code that imports parts of the code with the business logic, and exercises its logic, asserting several scenarios with the idea to guarantee certain conditions."
* Traits unit tests must have:
    * Isolation - each test should be completely independent from any external agent, and should focus only on the business logic. They do not connect to a database, do not make HTTP requests, etc. The must be able to run in any order, and depend on no previous state.
    * Performance - unit tests should run quickly, and be able to run multiple times quickly
    * Self-validating - the execution of a test must determine its result--no additonal step should be necessary to interpret the result of a unit test

### A note about other forms of automated testing

* To test things like classes, you want a test suite, which is a grouped set of tests that exercise different parts of the class functionality
* Integration tests test multiple components at once, attempt to validate that they work together
* Acceptance tests attempt to validate the system from the perspective of a user

### Unit testing and software design

* Good software is testable.
* Unit tests should have a direct influence on how code is written
* The ultimate expression of that is TDD

### Defining the boundaries of what to test

* Scope your testing to the boundaries of your own code

## Frameworks and tools for testing

### Frameworks and libraries for unit testing

* `unittest` is pretty good, but go ahead and use `pytest`

## Refactoring

## More about unit testing

# Chapter: Common Design Patterns

# Chapter: Clean Architecture
