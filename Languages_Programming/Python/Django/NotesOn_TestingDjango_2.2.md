# Notes on Testing in Django (2.2)

From https://docs.djangoproject.com/en/2.2/topics/testing/

* Preferred way to write tests in Django is using `unittest` module
* You can also use any other Python test framework, Django has an API/tools for integrating with them

# Writing and running tests

From https://docs.djangoproject.com/en/2.2/topics/testing/overview/

## Writing Tests

* Django's unit tests rely on `unittest`, which uses class based tests
* When you run tests, the default behavior of the test util is to find all test cases (subclasses of `unittest.TestCase`) in any file starting with `test`, automatically build a suite out of those cases, and run the suite
* If you rely on database access in tests, make sure you subclass `django.test.TestCase` instead of `unittest.TestCase`, which doesn't run tests in transactions / flush the database.

## Running Tests

* Run with `manage.py test`
* Test discovery based on `unittest`, finds all `test*.py` files under curdir
* You can pass in Python dotted paths to packages, modules, subclasses, or methods, or a directory path for discovery
* You can specify a custom filename pattern with `-p/--pattern`
* You can interrupt with `ctrl-c` which will wait for current test to complete, and exit gracefully
* You can pass `--failfast` to have it exit after first failure
* Good to test with warnings enabled, via `python -Wa manage.py test`

### The test database

* Blank database is created for tests, destroyed on completion
* Prevent destruction with `--keepdb`
* Auto-destroy with `test --noinput` (suppresses the prompt about the db being pre-existing)
* Default test db names are `test_<NAME>` for `NAME` in `DATABASES`
* For PG, `USER` needs access to the `postgres` database
* Other than separate db, runner uses all the same settings in your settings file for `ENGINE`, `HOST`, `USER`, etc.

### Order in which tests are executed

* To guarantee all `TestCase` code starts with a clean db, Django test runner reorders tests as follows:
    * All `TestCase` subclasses are run first
    * All other Django-based tests (based on `SimpleTestCase`, `TransactionTestCase`, etc.) are run with no particular ordering guaranteed/enforced
    * Any other `unittest.TestCase` tests (including doctests) that may alter the database without restoring it are run
* You can reverse the execution order inside groups with `--reverse`, which can help for ensuring tests are independent of each other

### Rollback emulation

* Any initial data loaded in migrations will only be available in `TestCase` tests, not in `TransactionTestCase` tests, and only on backends that support transactions
* Django can reload that data on a per-testcase basis by setting `serialized_rollback=True` in the body of `TestCase` or `TransactionTestCase`, but that incurs a slowdown of 3x or so.
* In general you don't need that setting.
* If you want to exclude some apps from initial serialization for speed, you can add those apps to `TEST_NON_SERIALIZED_APPS`
* To prevent serialized data running twice, setting `serialized_rollback=True` disables the `post_migrate` signal when flushing the test db

### Other test conditions

* Regardless of `DEBUG` setting in config, all Django tests run with it False, to ensure the observed output of your code matches what is seen in a prod setting.
* Caches are not cleared after each test, and a separate test cache is not used, so be wary of testing in production as you may inadvertantly add test entries to the prod cache.

### Understanding the test output

* Django first creates the test database, then runs tests
* Gives you normal `unittest` output
* Return code for the script runner is 1 for any number of fails / errors
* Return code is 0 for all pass

### Speeding up the tests

* If your tests are properly isolated, you can parallelize them with `--parallel`
* Default password hasher is slow by design--if authenticating many users in test, consider a custom settings file with a `PASSWORD_HASHERS` like

    ```Python
    PASSWORD_HASHERS = [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ]
    ```

# Testing Tools

From https://docs.djangoproject.com/en/2.2/topics/testing/tools/

## The test client

* Python class that acts as a headless browser, for view testing and interacting programmatically with the app
* Some stuff you can do with it
    * simulate GET/POST to a URL
    * see chain of redirects, check URL/status at each step
    * test that a given request is rendered by a given template
* Not intended as a replacement for, e.g., Selenium
* Breakdown of focus areas:
    * Use test client to establish:
        * right template is rendered
        * correct context data passed to template
    * Use in-browser stuff like Selenium to:
        * Test rendered HTML
        * Test behavior of webpages via JS
* You can also use things like Django's `LiveServerTestCase` for that

### Overview and example

```Python
from django.test import Client
c = Client()
response = c.post('/login/', {'username': 'john', 'password': 'smith'})
assert response.status_code == 200
response = c.get('/customer/details/')
assert response.content.startswith('<!DOCTYPE')
```

* Important things to note:
    * Test client doesn't require test server to be running
    * Specify the path of a URL, not the entire domain
    * Test client uses whatever URLconf is in `ROOT_URLCONF`
    * Test client functionality is only available while tests are running
    * By default it disables any CSRF checks done by the site

### Making requests


