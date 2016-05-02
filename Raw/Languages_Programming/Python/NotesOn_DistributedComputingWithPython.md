# Notes on Distributed Computing with Python

By Francesco Pierfederici, Packt Publishing 2016, ISBN 978-1-78588-704-8

## Chapter 1: An Introduction to Parallel and Distributed Computing

### Parallel Computing

* Definition: Parallel computing is the simultaneous use of more than one processor to solve a problem.
* Python has a problem with threads because of the GIL, so we use subprocesses
* Thread parallelism is 'multithreaded', process parallelism is 'multiprocessing'

### Distributed Computing

* Definition: Distributed computing is the simultaneous use of more than one computer to solve a problem.

### Shared memory vs distributed memory

* Different memory techniques solve different problems.
* You can write middleware to present a process with shared logical memory
* It's generally better to adapt to distributed memory so you can scale horizontally

### Amdahl's Law

* Amdahl's law says your code cannot be faster than the speed of its combined seqential parts on a single processor
* For a partially parallel algorithm, with parallel portion P and serial portion S, where T(n) is the runtime in seconds when using n processors, the following relation holds:

```
                    P * T(1)
T(n) >= S * T(1) + ----------
                       n
```

* Which says something like: "the execution time of the algorithm on n processors is equal and generally greater than the execution time of its serial part on one processor plus the execution time of the parallel part on one processor divided by the number of processors.
* As you increase the number of processors, the second part gets smaller.
* It's pretty rare you can get S to 0, so there's usually a limit to how much of a speed increase you can get out of parallelism.
* Fully parallel algorithms are also called 'embarrassingly parallel' or 'pleasantly parallel'

### The mixed paradigm

* Since most computers now are multi-core, the most common approach to parallelism is a combination of multiprocessor and distributed.

## Chapter 2: Asynchronous Programming

* Asynchronous or nonblocking programming can lead to performance gains over synchronous/blocking.
* Code that handles IO can be significantly more time consuming than code that does not, so you can usually get an increase in speed by making it so that other code isn't waiting on IO driven code.

### Coroutines

* Coroutines are reliant on generators, which are reliant on iterators.
* Objects that can be iterated have `__iter__` and `__next__` magic methods
* A generator is a callable that generates a sequence of results rather than returning a result, via `yield`ing the individual values.
* Examples of both:

```Python
class MyIterator(object):
    def __init__(self, xs):
        self.xs = xs

    def __iter__(self):
        return self

    def __next__(self):
        if self.xs:
            return self.xs.pop(0)
        else:
            raise StopIteration

for i in MyIterator([0,1,2]):
    print(i)


def my_generator(n):
    while n:
        n -= 1
        yield n

for i in my_generator(3):
    print(i)
```

* Calling the generator function does not start the generation, it just returns a generator object, which code can then call `next()` on.
* You cannot create the generated sequence more than once, you have to get a new generator object to do that.
* You can use `yield` on the right side of an assignment to consume values, which allows the creation of coroutines.
* A coroutine is a function that can suspend and resume execution at well defined locations in its code, via `yield` expressions.
* Despite being implemented as enhanced generators, coroutines are NOT themselves generators, as they are not associated with iteration.
* Generators produce values, coroutines consume values.
* Three main constructs in coroutines:
    * `yield()` - suspends execution of the coroutine
    * `send()` - passes data to a coroutine and thereby resumes execution
    * `close()` terminates a coroutine
* Example of a coroutine:

```Python
def complain_about(substring):
    print('Please talk to me!')
    try:
        while True:
            text = (yield)
            if substring in text:
                print('Oh no: I found a %s again!' % (substring,))
    except GeneratorExit:
        print('Ok, quitting.')

c = complain_about('bravo') # Creates coroutine
next(c)                     # Starts coroutine
c.send('foo alpha bar')
c.send('foo bravo bar')     # Triggers complaint
c.send('foo charlie bar')
c.close()                   # Exits coroutine
```

* Most people find calling `next(c)` manually annoying, and use a decorator to avoid having to make it.
* Example:

```Python
def coroutine(fn):
    def wrapper(*args, **kwargs):
        c = fn(*args, **kwargs)
        next(c)
        return c
    return wrapper

@coroutine
def complain_about2(substring):
    ...

c.complain_about('bravo')
c.send('alpha')
c.send('bravo')
c.close()
```

* You can arrange coroutines in hierarchies, with one coroutine sending data to multiple other ones and getting data from multiple sources as well.
* Very useful in network programming and system programming.

### An asynchronous example

```Python
#!/usr/bin/env python3

def coroutine(fn):
    def wrapper(*args, **kwargs):
        c = fn(*args, **kwargs)
        next(c)
        return c
    return wrapper

def cat(f, case_insensitive, child):
    if case_insensitive:
        line_processor = lambda l: l.lower()
    else:
        line_processor = lambda l: l

    for line in f:
        child.send(line_processor(line))

@coroutine
def grep(substring, case_insensitive, child):
    if case_insensitive:
        substring = substring.lower()
    while True:
        text = (yield)
        child.send(text.count(substring))

@coroutine
def count(substring):
    n = 0
    try:
        while True:
            n += (yield)
    except GeneratorExit:
        print(substring, n)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', action='store_true', dest='case_insensitive')
    parser.add_argument('pattern', type=str)
    parser.add_argument('infile', type=argparse.FileType('r'))

    args = parser.parse_args()

    cat(
        args.infile, 
        args.case_insensitive, 
        grep(args.pattern, 
             args.case_insensitive, 
             count(args.pattern)
        )
    )
```

* Comparable in time to `grep -io love data/pg2600.txt | wc -l`
* Breaks the problems into three steps:
    * reading the file line by line via `cat`
    * counting the substring occurrences in each line via `grep`
    * adding up all numbers and printing the total via `count`
* `cat` is the data source, reading the file line by line and sending each line to `grep` via the call to `child.send()`
* `grep` has an infinite loop for receiving data and counting the occurrences of the substring, then sending that to `count` via its own `child.send()`
* `count` keeps a running total from grep, and catches the `GeneratorExit` sent at close of file
* Example of a different graph, where one coroutine broadcasts input to an arbitrary number of child coroutines:

```Python
def coroutine(fn):
	...

def cat(f, case_insensitive, child):
	...

@coroutine
def grep(substring, case_insensitive, child):
	...

@coroutine
def count(substring):
	...

@coroutine
def fanout(children):
    while True:
        data = (yield)
        for child in children:
            child.send(data)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', action='store_true', dest='case_insensitive')
    parser.add_argument('patterns', type=str, nargs='+',)
    parser.add_argument('infile', type=argparse.FileType('r'))

    args = parser.parse_args()

    cat(
        args.infile, 
        args.case_insensitive, 
        fanout([grep(p, 
                     args.case_insensitive,
                     count(p))
                for p in args.patterns]
        )
    )
```

* The `fanout` coroutine takes a list of coroutines as input and sits in a loop waiting for data. Once it gets data it sends it to all registered coroutines. 
* This version allows searching for an arbitrary number of substrings, because it can instantiate and manage an arbitrary number of `grep` coroutines

## Chapter 3: Parallelism in Python

### Multiple Threads

* Python supports multiple threads via the `threading` module
* Threads can only run in parallel on multi-core systems
* Example of a threading based program:

```Python
#!/usr/bin/env python3

from queue import Queue
from threading import Thread
import urllib.request

URL = 'http://finance.yahoo.com/d/quotes.csv?s={}=X&f=p'

def get_rate(pair, outq, url_tmplt=URL):
    with urllib.request.urlopen(url_tmplt.format(pair)) as res:
        body = res.read()

    outq.put((pair, float(body.strip())))


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('pairs', type=str, nargs='+')
    args = parser.parse_args()

    outputq = Queue()
    for pair in args.pairs:
        t = Thread(target=get_rate,
                   kwargs={'pair': pair, 'outq': outputq})
        t.daemon = True
        t.start()

    for _ in args.pairs:
        pair, rate = outputq.get()
        print(pair, rate)
        outputq.task_done()

    outputq.join()
```

* The `get_rate` function takes a currency pair and a thread safe queue, connects to yahoo finance and gets the latest exchange rate for the pair
* Main portion creates a queue to hold the data, spawns a new worker thread for each currency pair.
* Each worker runs the get_rate function with a currency pair and the main outputq as arguments
* The threads are fire and forget, so fine to daemonize. The main execution won't wait for them to finish before existing
* Threads are tricky because they can easily create race conditions
* Thread safe queues have locks for organizing data access
* Since each thread writes to the queue you can monitor it for when data is added, and in this case not exit the program until the queue joins, which happens after all the thread results have been fetched and `task_done()` called
* Executing the threads in parallel in the above example gives performance gains despite the overhead each incurs.
* Example which does NOT create performance gains:

```Python
#!/usr/bin/env python3

from threading import Thread

def fib(n):
    if n <= 2:
        return 1
    elif n == 0:
        return 0
    elif n < 0:
        raise Exception('fib(n) undef for n < 0')

    return fib(n - 1) + fib(n - 2)

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-n', type=int, default=1)
    parser.add_argument('number', type=int, nargs='?', default=34)
    args = parser.parse_args()

    assert args.n >= 1, 'The number of threads has to be > 1'

    for i in range(args.n):
        t = Thread(target=fib, args=(args.number,))
        t.start()
```

* Running with two threads takes twice the time of one thread
* Increasing parallel computations increases execution time linearly, which you wouldn't expect on a multi-core machine.
* Unfortunately the global interpreter lock (GIL) is coming into play here. Consequence of the GIL is that only one thread can be active at a time, despite the fact that python threads are real, os-native threads
* If one task needs the CPU for a long period you're unlikely to see performance gains from multi-threading, because the GIL will make your other threads wait
* Parallel IO tasks can still be quite useful, and GUI apps can benefit from threading as well to do background effects without freezing the interface
* Note that Jython is not subject to the GIL

### Multiple Processes

* Most workarounds to the GIL have been to just use multiple processes
* There are disadvantages to that, mostly around having to launch multiple instances of the python interpreter
* However, there's some benefits too:
    * processes have their own memory space
    * they use a share-nothing architecture
    * allow an easier transition from single-machine to distributed architecture
* Two main process-based parallelism modules: `multiprocessing` and `concurrent.futures`
* `concurrent.futures` is build on `multiprocessing` and `threading`
* Version of the fib program using multiple processes:

```Python
#!/usr/bin/env python3

import concurrent.futures as cf

def fib(n):
    if n <= 2:
        return 1
    elif n == 0:
        return 0
    elif n < 0:
        raise Exception('fib(n) undef for n < 0')

    return fib(n - 1) + fib(n - 2)

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-n', type=int, default=1)
    parser.add_argument('number', type=int, nargs='?', default=34)
    args = parser.parse_args()

    assert args.n >= 1, 'The number of threads has to be > 1'

    with cf.ProcessPoolExecutor(max_workers=args.n) as pool:
        results = pool.map(fib, [args.number] * args.n)
```

* Speeds up when you use up to the number of cores available, degrades after that
* Two main classes in the `concurrent.futures` module:
    * `ProcessPoolExecutor`
    * `ThreadPoolExecutor`
* Both share an API and have three main methods:
    * `submit(f, *args, **kwargs)` - schedules an async call to `f(*args, **kwargs)` and returns a `Future` instance as a result placeholder
    * `map(f, *arglist)` - returns a list of future objects rather than a list of results
    * `shutdown(wait=True)` - frees the resources used by the `Executor` object as soon as all currently schedued functions are done.
* You can use `Executor` objects as context managers via `with`
* a `Future` instance is a placeholder for the result of an async call
* You access the result of a `Future` with `result()`
* Example of doing fib without using a context manager:

```Python
>>> from mpfib import fib
>>> from concurrent.futures import ProcessPoolExecutor
>>> pool = ProcessPoolExecutor(max_workers=1)
>>> fut = pool.submit(fib, 38)
>>> fut
<Future at 0x10f7c6978 state=running>
>>> fut.running()
True
>>> fut.done()
False
>>> fut.done()
True
>>> fut.result(timeout=0)
39088169
>>> fut.result(timeout=None)
39088169
>>> fut.done()
True
>>> fut.running()
False
>>> fut.cancelled()
False
>>> fut.exception()
```

### Multiprocess Queues

* Problem: how to exchange data between workers in multiple processes?
* `multiprocessing` has queues and pipes to do that
* `multiprocessing.Queue` is modeled after `queue.Queue`, with the difference that in the mp queue items need to be pickable
* Example of using queues:

```Python
#!/usr/bin/env python3

import multiprocessing as mp

def fib(n):
    if n <= 2:
        return 1
    elif n == 0:
        return 0
    elif n < 0:
        raise Exception('fib(n) is undef for n < 0')

    return fib(n - 1) + fib(n - 2)

def worker(inq, outq):
    while True:
        data = inq.get()
        if data is None:
            return
        fn, arg = data
        outq.put(fn(arg))


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-n', type=int, default=1)
    parser.add_argument('number', type=int, nargs='?', default=34)
    args = parser.parse_args()

    assert args.n >= 1, 'Number of threads must be > 1'

    tasks = mp.Queue()
    results = mp.Queue()
    for i in range(args.n):
        tasks.put((fib, args.number))

    for i in range(args.n):
        mp.Process(target=worker, args=(tasks, results)).start()

    for i in range(args.n):
        print(results.get())

    for i in range(args.n):
        tasks.put(None)
```

### Closing Thoughts

* Some of the main difficulties in doing parallel apps are:
    * getting data access right
    * avoiding race conditions and data corruption
* Extremely important to have good tests
* Also difficult to know when to stop parallelizing
* Sometimes using an existing parallel implementation is the best choice
* You can offset the diminishing returns of Amdahl's law by increasing the size of the problem as the total performance increases
* That's gustafson's law--as you add work to the system, the costs of overhead in terms of startup, coordination, cleanup are all amortized over more and more units

## Chapter 4: Distributed applications with Celery

* Chapter looks at async programming and distributed computing
* Concentrates on Celery, and a bit on Pyro and Python-RQ

### Establishing a multimachine environment

* Either use the cloud or virtual machines with a hosts file.

### Installing Celery

* Install and set up `virtualenvwrapper`
* Create a virtualenv with python3, activate it with `workon`
* Do `pip install celery`
* Need to install/configure a broker that celery will use to host the task queues and deliver messages to workers
* Set up homebrew
* `brew install rabbitmq`
* Make rabbitmq allow the default guest account over the network, by editing `rabbitmq.config` to have at least `[ {rabbit, [{ loopback_users, [] }] } ]`
* Start rabbitmq up with `sudo rabbitmq-server`
* Additional dependency that's not strictly necessary is a result backend, which is a queue celery workers use to store their output.
* Recommended result store is redis: `brew install redis` and `sudo redis-server`
* Rest of chapter assumes a result backend, which you would need in prod

### Testing the installation

* Start `rabbitmq-server`
* Start `redis-server`
* Example test script:

```Python
import celery

app = celery.Celery('test', 
                    broker='amqp://somehost_a',
                    backend='redis://somehost_b')

@app.task
def echo(message):
    return message
```

* The above does this:
    * Sets up a celery application with a name that echos the filename
    * Configures the app to use the default account message queue on RabbitMQ
    * Uses the default database on Redis
    * Uses the app instance to decorate a function to be made available to a worker instance
* It is usable on some third host via `celery -A test worker --loglevel=info`
* Celery command starts as many workers as there are cores on the machine
* Celery handles a bunch of stuff--if you wanted to use `test.echo` manually you could:

```Python
from test import echo
result = echo('ABC123')
print result
```

* However, if you wanted to ask the workers to run it from the interpreter:

```Python
import time
from test import echo
result = echo.delay('ABC123')
while not res.ready():
    time.sleep(1)
print result.result
```

### A tour of Celery

* Distributed task queues are a master-worker architecture with a middleware layer that uses a set of queues for work requests (task queues) and a queue for the results (the result backend).
* Master process is called the 'client' or 'producer'
* The producer puts work requests/tasks into a task queue, fetches results from the result backend
* Workers subscribe to some or all task queues, do their work, put results to the result backend
* Masters don't need to know how many workers are available or what their state is, just how to manage queues
* Workers don't need to know about the master, just where to get jobs and where to put results.
* Uses third party systems for queues and result backend, for stability
* Recommended broker is RabbitMQ, recommended result backend is Redis or RabbitMQ

### More complex Celery applications

* Four machines in this example:
    * `HOST1` runs rabbitMQ
    * `HOST2` runs Redis
    * `HOST3` runs workers
    * `HOST4` runs the master
* App code for a currency exchange rate application:

```Python
#!/usr/bin/env python3

import celery
import urllib.request

app = celery.Celery('currency',
                    broker='amqp://HOST1',
                    backend='redis://HOST2')

URL = 'http://finance.yahoo.com/d/quotes.csv?s={}=X&f=p'

@app.task
def get_rate(pair, urltmplt=URL):
    with urllib.request.urlopen(url_tmplt.format(pair)) as res:
        body = res.read()
    return (pair, float(body.strip()))

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('pairs', type=str, nargs='+')
    args = parser.parse_args()

    results = [get_rate.delay(pair) for pair in args.pairs]
    for result in results:
        pair, rate = result.get()
        print(pair, rate)
```

* Start up the rabbitmq and redis servers
* On the worker host, put the `celery_currency.py` script and start a pool of workers with `celery -A celery_currency worker --loglevel=info`
* On the master host, put the script and run `python3 celery_currency.py EURUSD CHFUSD GBPUSD CADUSD CADEUR`
* If there were no workers available, the master would just wait.
* Optionally you could call `result.get(timeout=1)` in the script and the master would raise a `TimeoutError` on no worker available
* If you need to clean the queue, you can use `celery purge` to remove all tasks
* Be careful to catch exceptions the workers might throw, or they will propagate to the master
* Failed tasks can be automatically retried via the `retry` parameter on the `task` decorator
* They can also expire via a tasks `apply_async` method
* Sometimes the output of one set of tasks needs to feed the input of a second set of tasks
* Following example is mergesort in celery:

```Python
#!/usr/bin/env python3

import celery

app = celery.Celery('celery_mergesort',
                    broker='amqp://HOST1',
                    backend='redis://HOST2')

@app.task
def sort(xs):
    lenxs = len(xs)
    if lenxs <= 1:
        return xs

    half_lenxs = lenxs // 2
    left = xs[:half_lenxs]
    right = xs[half_lenxs:]
    return(merge(sort(left), sort(right)))

def merge(left, right):
    nleft = len(left)
    nright = len(right)

    merged = []
    i = 0
    j = 0
    while i < nleft and j < nright:
        if left[i] < right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    return merged + left[i:] + right[j:]
```

* That was the initial worker
* The main code:

```Python
#!/usr/bin/env python3
import random
import time
from celery import group
from celery_mergesort import sort, merge

# 1M elements in random order
sequence = list(range(1000000))
random.shuffle(sequence)

t0 = time.time()

# Chunk the sequence, process chunks
n = 4
l = len(sequence) // n
subseqs = [sequence[i * l:(i + 1) * l] for i in range(n - 1)]
subseqs.append(sequence[(n-1) * l:])

partials = group(sort.s(seq) for seq in subseqs)().get()

# Merge individual sorted lists into a result
result = partials[0]
for partial in partials[1:]:
    result = merge(result, partial)

dt = time.time() = t0

print('Distributed mergesort took %.02fs' % (dt))

# Vs the local implementation
t0 = time.time()
truth = sort(sequence)
dt = time.time() - t0
print('Local mergesort took %.02fs' % (dt))

# Sanity checks
assert result == truth
assert result == sorted(sequence)
```

* Celery has a number of primitives for orchestrating task execution
* `group` allows execution of concurrent tasks by bundling them into a virtual task
* Return value is a `GroupResult`, similar to `AsyncResult`
* Note that celery's synchronization primitives are quite expensive, should only be used when absolutely necessary

### Celery in production


## Chapter 5: Python in the Cloud

### Cloud Computing and AWS

* Looks at EC2, EBS, S3, briefly at elastic beanstalk

### Creating an EC2 Instance

* Sets up 64-bit Ubuntu 14.04 LTS, SSD volume type on a t2.micro
* Adds an ssh rule for local IP to the security group
* Puts an EBS volume on there under /dev/xvdf

### Storing data in S3

* Creates a bucket
* Adds a file, permissions the file

### Amazon elastic beanstalk

* Allows application deployment without dealing with EC2/S3, etc.
* Best used from command line via `awsebcli` package, inside a virtualenv
* `eb init` command can create initial deployment configuration
* `eb create` and `eb terminate` do deployment and destruction

### Creating a Private Cloud

* Suggests other tools for maintaining stacks in the cloud, like OpenStack, CloudStack, and Eucalyptus
* Eucalyptus can integrate with AWS
* `boto` is compatible with Eucalyptus

## Chapter 6: Python on an HPC

## Chapter 7: Testing and Debugging Distributed Applications

* Most of the tools and packages that do single process application debugging lose their power when in a distributed environment

### Common Problems - clocks and time

* You may need a coordinated time solution
* NTP is a possibility
* Make sure you're using UTC
* Be careful of having a bunch of replicated crons go off at once across a network
* Add a random interval to the start of timed events, or throttle the application

### Common Problems - software environments

* Environment setup can be a pain
* Self-contained environments are nice, via virtualenv, etc.

### Common Problems - permissions and environments

* Make sure you give `os.environ.get` calls defaults

### Common Problems - availability of hardware resources

* Long running work should checkpoint itself so it can restart
* Applications should have a way to externally save state on `SIGQUIT`, since they may be about to be evicted with `SIGKILL`
* Example of checkpointing:

```Python
#!/usr/bin/env python3

import json
import os
import signal
import sys

STATE_FILE = os.path.join(os.getcwd(), 'checkpoint.json')

class CheckPointer:
    def __init__(self, state_path=STATE_FILE):
        self.state = {}
        self.state_path = state_path
        if os.path.exists(self.state_path):
            with open(self.state_path) as f:
                self.state.update(json.load(f))
        return

    def save(self):
        print('Saving state: {}'.format(self.state))
        with open(self.state_path, 'w') as f:
            json.dump(self.state, f)
        return

    def eviction_handler(self, signum, frame):
        self.save()

        print('Quitting')
        sys.exit(0)
        return

if __name__ == '__main__':
    import time
    print('This is process {}'.format(os.getpid()))

    ckp = CheckPointer()
    print('Initial state: {}'.format(ckp.state))

    signal.signal(signal.SIGQUIT, ckp.eviction_handler)

    i = ckp.state.get('i', 0)
    try:
        while True:
            i += 1
            ckp.state['i'] = i
            print('Updated in-memory state: {}'.format(ckp.state))
            time.sleep(1)
    except KeyboardInterrupt:
        ckp.save()
```

### Challenges - the development environment

* Need to set up at least one test environment in the cloud if you're going to have a deployment in the cloud

### A useful strategy - logging everything

* Use a log aggregator like Sentry
* Make sure you use monitoring
* Celery recommends `flower` for monitoring and control

### A useful strategy - simulating components

* Use mock.
