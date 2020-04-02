# Notes on How to Cheat at Unit Tests with Pytest and Black

From https://simonwillison.net/2020/Feb/11/cheating-at-unit-tests-pytest-black/

* First thing he's built using Pytest from the start rather than using the Django test runner
* Good opportunity to try out `pytest-django`
* "It maintains my favorite things about Django's test framework--smart usage of database transactions to reset the database and a handy test client object for sending fake HTTP requests--and adds all of that pytest magic I've grown to love."

## Cheating at Unit Tests

* Pure TDD says you write tests first, don't write code till you see tests fail
* Hard to prototype things that way, so he cheats. Once he's happy with an implementation he writes tests to match it. Once he's got those tests he can switch to using new tests to drive development.
* Likes using a rough initial implementation to help generate the tests in the first place.
