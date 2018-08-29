# Notes on <u>Learning Python Design Patterns</u>

By Gennadiy Zlobin, pub. Packt Publishing, 2013; Print ISBN-13: 978-1-78328-337-8

## Chapter Summaries

### Chapter 1: Model-View-Controller

* Python examples: web2py, Pyramid, Django, Giotto, Kiss
* "We need smart models, thin controllers, and dumb views."
* Benefits:
    * Loose coupling from decomposition
    * Allows devs to have limited areas of responsibility

### Chapter 2: Creating Only One Object with the Singleton Pattern
* Good for:
    * controlling concurrent access to a shared resource
    * being a global point of access for a resource
* Use cases:
    * logging
    * print spooler
    * db connection
    * file manager
  
#### Module-Level Singleton

* Quickly makes a singleton because Python won't reimport (and therefore re-init) a module:

```Python
# singleton.py:
only_one_var = "I'm only one var"

# module1.py:
import singleton
print singleton.only_one_var
singleton.only_one_var += " after modification"
import module2

# module2.py:
import singleton
print singleton.only_one_var # gets the changed from from 1
```

#### Classic Singleton

* Dedicated singleton class:

```Python
class Singleton(object):
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Singleton, cls).__new__(cls)
        return cls.instance
```

* Better, but if you subclass it it won't be an instance of Singleton, so you get no shared state.

#### The borg Singleton
    
* Also called 'monostate' singleton due to shared state of all instances
* Shared state maintained in an attribute:

```Python
class Borg(object):
    _shared_state = {}

    def __new__(cls, *args, **kwargs):
        obj = super(Borg, cls).__new__(cls, *args, **kwargs)
        obj.__dict__ = cls._shared_state
        return obj
```

### Chapter 3: Building Factories to Create Objects

* A factory is a class for creating other objects
* Gives you loose coupling, with creation separate from implementation
* A class using the created object doesn't need to know the class of that object, only that it has a predictable interface.
* The Factory class can reuse existing objects instead of having to create new

* Simple example:

```Python
class SimpleFactor(object):
    @staticmethod
    def build_connection(protocol):
        if protocol == 'http':
            return HTTPConnection()
        elif protocol == 'ftp':
            return FTPConnection()
        else:
            raise RuntimeError('Unknown protocol')

if __name__ == '__main__':
    protocol = raw_input('Which to use, http or ftp?: ')
    protocol = SimpleFactor.build_connection(protocol)
    protocol.connect()
    print protocol.get_response()
```

#### Abstract Factory
