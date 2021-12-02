# Notes on Pytest Documentation

## pytest fixtures: explicit, modular, scalar

From https://docs.pytest.org/en/stable/fixture.html#fixtures

### built in fixtures

* `capfd` - capture as text output to file descriptors 1 and 2
* `capfdbinary` - same, as bytes
* `caplog` - control logging and access log entries
* `capsys` - capture as text output to `sys.stdout` and `sys.stderr`
* `capsysbinary`
* `cache` - store and retrieve values across runs
* `doctest_namespace` - provide a dict injected into doctests namespace
* `monkeypatch` - temporarily modify classes, functions, etc.
* `pytestconfig` - access to conf values, pluginmanager, plugin hooks
* `record_property` - add extra properties to the test
* `record_testsuite_property` - add extra properties to the test suite
* `recwarn` - record warnings emitted by test functions
* `request` - provide info on the executing test function
* `testdir` - provide temporary test dir to aid in running, testing, pytest plugins
* `tmp_path_factory` - make session scoped temp directories, return `pathlib.Path` objects

### What Fixtures are

* First, what's a test? Looks at result of a behavior, confirms alignment with an exepected result.
* Behavior - how a system acts in response to a situation / stimuli
* Test breaks down into four steps
    1. Arrange - preparing for the test. Prepping objects, starting/killing services, entering records into a database, defining configs, etc.
    1. Act - Singular, state-changing action that kicks off the behavior you want to test. Typically a function or method call.
    1. Assert - look at the resulting state after Act, compare to an expectation
    1. Cleanup - where the test picks up after itself, to avoid side effects or tampering with other tests.

#### Back to fixtures

* Fixtures are each of the arrange steps and data. Everything a test needs to do what it does.
* Test functions request fixtures by declaring them as arguments.
* Pytest fixtures are functions, and are useful in both the Arrange and Act steps.
* A fixture is decorated with `@pytest.fixture`:

    ```Python
    import pytest

    class Fruit:
        def __init__(self, name):
            self.name = name

        def __eq__(self, other):
            return self.name == other.name

    @pytest.fixture
    def my_fruit():
        return Fruit('apple')

    @pytest.fixture
    def fruit_basket(my_fruit):
        return [Fruit('banana'), my_fruit]

    def test_my_fruit_in_basket(my_fruit, fruit_basket):
        assert my_fruit in fruit_basket
    ```

* Tests may depend on an unlimited number of fixtures.

### "Requesting" fixtures

* Test functions request fixtures by declaring them as parameters in the test function's signature
* When pytest goes to run a test, it looks at the parameters in the test function's signature, then searches for fixtures that have the same names as those parameters
* Once it finds them, it runs the fixture functions, captures their return values, and passes those as objects into the test function, via the named arguments
* Fixtures can request other fixtures:

    ```Python
    import pytest

    # Arrange
    @pytest.fixture
    def first_entry():
        return "a"

    # Arrange
    @pytest.fixture
    def order(first_entry):
        return [first_entry]

    def test_string(order):
        order.append("b")           # Act
        assert order == ["a", "b"]  # Assert
    ```

* Since fixtures are functions, they request other fixtures exactly the same way that test functions do.
* Fixtures are reusable, multiple test functions can use the same fixture, and each will get its own result, which helps with test isolation
* Example:

    ```Python
    import pytest

    @pytest.fixture
    def first_entry():
        return "a"

    @pytest.fixture
    def order(first_entry):
        return [first_entry]

    def test_string(order):
        order.append("b")
        assert order == ["a", "b"]

    def test_int(order):
        order.append(2)
        assert order == ["a", 2]
    ```

* A test/fixture may request more than one fixture at a time:

    ```Python
    import pytest

    @pytest.fixture
    def first_entry():
        return "a"

    @pytest.fixture
    def second_entry():
        return 2

    @pytest.fixture
    def order(first_entry, second_entry):
        return [first_entry, second_entry]

    @pytest.fixture
    def expected_list():
        return ["a", 2, 3.0]

    def test_string(order, expected_list):
        order.append(3.0)
        assert order == expected_list
    ```

* Fixtures can be requested more than once per test, with return values cached. Pytest won't execute the same fixture multiple times for a single test, so you can request fixtures in multiple fixtures that depend on them without any single fixture running more than once.

    ```Python
    import pytest

    @pytest.fixture
    def first_entry():
        return "a"

    @pytest.fixture
    def order():
        return []

    @pytest.fixture
    def append_first(order, first_entry):
        return order.append(first_entry)

    def test_string_only(append_first, order, first_entry):
        assert order == [first_entry]
    ```

* There are autouse fixtures that you can make all tests automatically request
* To do that, pass in `autouse=True` to the fixture decorator:

    ```Python
    import pytest

    @pytest.fixture
    def first_entry():
        return "a"

    @pytest.fixture
    def order(first_entry):
        return []

    @pytest.fixture(autouse=True)
    def append_first(order, first_entry):
        return order.append(first_entry)

    def test_string_only(order, first_entry):
        assert order == [first_entry]

    def test_string_and_int(order, first_entry):
        order.append(2)
        assert order == [first_entry, 2]
    ```

* The above is slightly deceptive. You can depend on what happens in an autouse fixture, but you cannot call it by name within a test function or other fixture unless you explicitly request it.
* Additionally, if a fixture returns a mutable type like a list you can have a subsequent fixture alter it, but if it returns an immutable type like a string you cannot.

### Scope: sharing fixtures across classes, modules, packages or session

* Fixtures that need network access are usually expensive to create
* If you pass `scope=module` to the fixture decorator, it will only be invoked once per test module (default is once per function)
* This makes each test in a module get the same instance of that fixture's return value
* Values you can invoke are:
    * `function` - fixture destroyed at end of test
    * `class` - during teardown of last test in class
    * `module` - during teardown of last test in module
    * `package` - during teardown of last test in package
    * `session` - at the end of the test session
* This example puts the fixture function into a separate `conftest.py` file, so that tests from multiple test modules in the directory can access the fixture:

    ```Python
    # conftest.py
    import pytest
    import smtplib

    @pytest.fixture(scope="module")
    def smtp_connection():
        return smtplib.SMTP("smtp.gmail.com", 587, timeout=5)
    ```

* Then it can be used from another file:

    ```Python
    # test_module.py
    def test_ehlo(smtp_connection):
        response, msg = smtp_connection.ehlo()
        assert response == 250
        assert b"smtp.gmail.com" in msg
        assert 0

    def test_noop(smtp_connection):
        response, msg = smtp_connection.noop()
        assert response == 250
        assert 0
    ```

* That glosses over `conftest.py` being a special name. Annoying.
* In 5.2 plus there's dynamic fixture scope, which lets you pass a callable to the `scope` argument
* The callable has to return a string with a valid scope, and is executed once during fixture definition. Called with two args, `fixture_name` (string) and `config` (configuration object)
* Useful when dealing with fixtures that need time for setup, like spawning a docker container. Example of using the command line to spawn containers for different environments:

    ```Python
    def determine_scope(fixture_name, config):
        if config.getoption("--keep-containers", None):
            return "session"
        return "function"

    @pytest.fixture(scope=determine_scope)
    def docker_container():
        yield spawn_container()
    ```

### Fixture errors

* Pytest tries to put all fixtures for a given test in linear order so it can see which one executes first, second, etc.
* If an earlier fixture raises an exception, pytest stops executing fixtures for the test and marks the test as Erroring
* Error means a test couldn't be attempted (neither passed nor failed)
* It's good to cut out as many unnecessary dependencies as possible for a given test, so a problem in something unrelated doesn't cause you to get incomplete test results

### Teardown/cleanup (fixture finalization)

* You can define the specific steps for each fixture to clean up after itself
* Two ways to do it:
    1. `yield` fixtures (recommended)
    1. Adding finalizers directly

#### yield fixtures

* Using `yield` in a fixture lets you pass an object back, just like `return`, except teardown code is placed after the yield statement
* Pytest runs fixtures up to their yield, then the next fixture in the list
* Once a test finishes, pytest goes back up the list of fixtures in reverse order, and takes each one that yielded, running the code after the yield to do cleanup
* Example:

    ```Python
    import pytest

    from emaillib import Email, MailAdminClient

    @pytest.fixture
    def mail_admin():
        return MailAdminClient()

    @pytest.fixture
    def sending_user(mail_admin):
        user = mail_admin.create_user()
        yield user
        admin_client.delete_user(user)

    @pytest.fixture
    def receiving_user(mail_admin):
        user = mail_admin.create_user()
        yield user
        admin_client.delete_user(user)

    def test_email_received(receiving_user, sending_user):
        email = Email(subject="hi", body="hello")
        sending_user.send_email(email, receiving_user)
        assert email in receiving_user.inbox
    ```

* If a fixture raises an exception before yielding, pytest won't try to run the teardown code, though for every successful fixture that already ran for the test, pytest will still attempt to tear them down normally.

### Safe teardowns

* If you're not careful an error in a fixture can leave artifacts behind
* Safest and simplest fixture structure requires limiting fixtures to only making one state changing action each, then bundling them with their teardown code

### Fixture availability

* Availability is determined from the perspective of the test
* Only available for request if the test is in the scope that the fixture is defined in
* If a fixture is inside a class, it can only be requested within that class
* Also, a test can also only be affected by an autouse fixture if that test is in hte scope that autouse fixture is defined in.
* A fixture can request any other fixture, no matter where it's defined, as long as the test requesting them can see all fixtures involved. This is kind of weird.

### conftest.py - sharing fixtures across multiple files

* Special file name, provides fixtures to its entire directory
* Fixtures in that file don't need to be imported, because pytest autodiscovers them
* Each directory in a nested structure can have a separate conftest.py file
* Tests may search upward for fixtures, but cannot go downwards in the hierarchy
* The first fixture matching the name that's found is used, so fixtures may be overridden
* You can also use conftest.py to implement local, per-directory plugins

### Fixtures from third-party plugins

* As long as the plugin is installed, the fixtures they provide can be requested from anywhere in your test suite
* Because they're provided outside the structure of your test suite, third party plugins don't really provide a scope like conftest.py files, etc.
* Fixtures defined in plugins are searched by name last of all fixtures
