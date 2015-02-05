# Notes On Testing Python: Applying Unit Testing, TDD, BDD and Acceptance Testing

By David Sale, John Wiley & Sons, 2014

## Chapter 1: A History of Testing

### Fundamentals and Best Practices

* Book focuses on Python 2.7
* Install Pip, Virtualenv, Virtualenvwrapper, git
* Recommends PyCharm IDE

## Chapter 2: Writing Unit Tests

### What is Unit Testing?

* Testing fundamental units of functionality in isolation
* If your test is very complex, consider refactoring the unit
* Test all basic units
* Every time you find a bug requiring a code change to fix, test for that
* Includes a small unit test of a calculator's add method
* Uses ``unittest.TestCase`` and ``assertEqual()``
* Runs ``unittest.main()`` from the main execution thread
* Writes another test to cover exceptions with ``assertRaises``
* Summarizes PEP-8, suggests you follow it

### Unit Test Structure

* Put unit tests under ``test/unit`` at the top level of a project
* All folders in the code should be mirrored by test folders
* All unit test files should mirror the name of the file they test
* Use ``setUp()`` to instantiate shared test objects
* Lists all the unit test assertion methods

## Chapter 3: Utilizing Unit Tests

## Chapter 4: Writing Testable Documentation

## Chapter 5: Driving Your Development with Tests

## Chapter 6: Writing Acceptance Tests

## Chapter 7: Utilizing Acceptance Test Tools

## Chapter 8: Maximizing Your Code's Performance

## Chapter 9: Looking After Your Lint

## Chapter 10: Automating Your Processes

## Chapter 11: Deploying Your Application

## Chapter 12: The Future of Testing Python
