# Notes on Crafting Test-Driven Software with Python

By Allesandro Molina; Packt Publishing, Feb. 2021; ISBN  9781838642655

# Getting Started with Software Testing

* Originally software QA involved manual execution of a test plan
* A test plan is made of multiple test cases
* Each test case specifies:
    * Preconditions - what's necessary to verify the case
    * Steps - actions that have to succeed when executed in order
    * Postconditions - desired system state at the end of the steps
* Automating tests is/was the only way to scale
* Automated test cases contain all instructions for setting up the target software, running the tests, verifying the results, and resetting the state of the target software
* Automatic tests need a program to gather, execute, and track them, which is the 'test runner'
* Test functions can be grouped into classes and/or modules
* Modules can be grouped in a tests directory
* Tests tend to follow Arrange, Act, Assert pattern
    * Prepare any state you need to perform the action under test
    * Perform the action
    * Verify the consequences via assertions
* What's the unit of work under test?

    > In practice, a unit is the smallest testable entity that participates in your software.

* Example of arithmetic code:

    ```Python
    def main():
        import sys
        n1, n2 = sys.argv[1:]
        n1, n2 = int(n1), int(n2)
        print(multiply(n1, n2))

    def multiply(n1, n2):
        total = 0
        for _ in range(n2):
            total = addition(total, n1)
        return total

    def addition(*args):
        total = 0
        for a in args:
            total += a
        return total
    ```

* In the above
    * `addition` and `multiply` are units of the software
    * `addition` may be tested in isolation, but `multiply` relies on `addition` to execute; therefore `addition` is a 'solitary unit' while `multiply` is a 'sociable unit'
* Sociable unit tests are also referred to as 'component tests'

## Integration and Functional Tests

* Testing with solitary units doesn't guarantee the software is doing what is expected from the user's perspective
* Integration tests might integrate two modules or tens of them
* It's more effective but also more expensive, so testing all combinations isn't really worth the benefit
* You should be able to run your integration tests independently from your unit tests, since you'll want to run your unit tests continuously during development
* Unit tests run frequently, integration tests when you reach a stable point (and the unit tests are all passing)
* Subsets of integration tests, with different goals and purposes:
    * Functional tests - verify that we are exposing to users the features we actually intend. They don't care about intermediate results or side effects, they just verify that the end result for the user is the one the specs describe.
    * End to End (E2E) tests - functional tests that vertically integrate components. Often involve something like Selenium to access a real app instance via a browser.
    * System tests - Similar to functional tests, but instead of testing a single feature they usually test a whole journey of the user across the system, simulating real usage patterns
    * Acceptance tests - functional tests meant to confirm that the implementation of a feature behaves as expected. Usually express the primary usage flow of the feature ("happy path")
* Main distinction between integration and functional tests is that unit and integration tests aim to test the implementation, functional tests aim to test behavior

## Understanding the testing pyramid and trophy

* There are cost tradeoffs to different test types
    * E2E tests are very realistic, but slow and prone to failure due to external problems like network latency
    * Integration tests do a good job of guaranteeing behavior, but can be slow, and when something fails diagnosis can mean digging through lots of layers
    * Unit tests can be fast and give pinpointed info, but can't guarantee that the software as a whole does what it is supposed to do. Also can make changing implementation details expensive since you have to rewrite your tests.
* Two primary models for getting a balance of test types:
    * testing pyramid
    * testing trophy

### The testing pyramid

* From Mike Cohn's book Succeeding with Agile
* Two rules of thumb:
    * Write tests with different granularities (unit, integration, E2E, etc.)
    * The more high level, the less you test (lots of unit, some integration, a few E2E)
* This is probably the most widespread practice, usually works well for TDD

### The testing trophy

* Comes from Guillermo Rauch, author of Socket.io and other JS stuff
* Said: "Write tests. Not too many. Mostly integration."
* Distribution:

    ```
            E2E        ###
    Integration    ###########
           Unit        ###
         Static      #######
    ```

* Relies heavily on static checks (linters, type checks, etc.)

## Testing distribution and coverage

* Testing getters/setters, private methods, etc. usually has little return
* Sweet spot is maybe 80% coverage, though in Python maybe more like 90%
* Some things you want 100% coverage, like porting python 2 to 3

-------------

# Test Doubles with a Chat Application

* Test doubles break dependencies between components, let you simulate behaviors you want
* You can do TDD either bottom up (unit first) or top down (acceptance first)
* Its probably better to start with acceptance, but how to write tests that depend on the whole software existing when you haven't yet written the software? Key is test doubles - objects that can replace missing, incomplete, or expensive parts of the code for the purpose of testing.
* As you move up through layers of tests, you should use fewer and fewer doubles, up to E2E tests with no doubles at all

# Introduction to PyTest
