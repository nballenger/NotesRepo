# Notes on Fluent Python, 2nd Edition

By Luciano Ramalho; O'Reilly Media, Inc, March 2022

# Chapter 1: The Python Data Model

* "Think of the data model as a description of Python as a framework. It formalizes the interfaces of the building blocks of the language itself, such as sequences, functions, iterators, coroutines, classes, context managers, and so on."
* We use special methods (double underscore) when we want objects to support and interact with fundamental language constructs like:
    * Collections
    * Attribute access
    * Iteration (incl. async iteration with `async for`)
    * Operator overloading
    * Function and method invocation
    * String representation and formatting
    * Async programming using `await`
    * Object creation and destruction
    * Managed contexts via `with` and `async with`

## Changes in 2nd ed of this chapter

* Special methods for async and other new features added to overview of special methods
* Figure showing use of special methods in Collection API
* Use f-string syntax from 3.6+ rather than `str.format()` and `%`

## A Pythonic Card Deck

Demonstration of using special methods `__getitem__` and `__len__`:

```Python
import collections

Card = collections.namedtuple('Card', ['rank', 'suit'])

class FrenchDeck:
    ranks = [str(n) for n in range(2, 11)] + list('JQKA')
    suits = 'spades diamonds clubs hearts'.split()

    def __init__(self):
        self._cards = [Card(rank, suit) for suit in self.suits
                                        for rank in self.ranks]

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, position):
        return self._cards[position]
```

* Using `namedtuple` lets you build classes of objects that are just bundles of attributes with no custom methods, like a db record.
