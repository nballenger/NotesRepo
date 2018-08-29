# Notes on Parallel Programming with Python

By Jan Palach, Packt Publishing, 2014

## Chapter 1: Contextualizing Parallel, Concurrent, and Distributed Programming

* "Parallel programming" -- "model that aims to create programs [...] compatible with environments [that] execute code instructions simultaneously"
* Timeline of processing methodologies:
    * Single thread, uninterrupted (one arithmetic logic unit)
    * Single thread, time slicing (Intel 80386)
    * Pipelining / substages of execution (Intel 80486)
    * Ran into heat and power consumption limitations
    * Creation of processors with 'cores', each with ALU and L2, L3 caches
    * Multi-core chip with slower clock speed can be more efficient
    
### Why use parallel programming?

* It's more better.

### Exploring common forms of parallelization

* "Concurrent" programming is an abstraction from parallel programming, where the CPU scheduler is raking sequential tasks so fast it appears parallelized.
* Parallel programming happens when program data creates workers to run simultaneous tasks in a multicore environment, with no need for single CPU concurrency.
* Distributed programming shares processing load across machines (nodes), and can be fault tolerant, horizontally scalable, and occur in the cloud.

### Communicating in parallel programming

* It is common to need coordination between worker processes, which requires communication and data exchange.
* Two main forms of communication: shared state and message passing.

#### Understanding shared state

* Pitfall: invalid operation by one worker on shared resource can affect all worker processes
* Makes distribution difficult if not impossible.
* Mutex is one of a number of means of making resource locking possible

#### Understanding message passing

* Consists of a mechanism for message exchange between running processes
* Extremely common in distributed architecture
* May have higher memory use than shared state, but benefits include:
    * absence of data access concurrence
    * distributed or local implementations both possible
    * scales better, easier to maintain

### Identifying parallel programming problems

#### Deadlock

* Occurs when two or more workers keep indefinitely waiting for the freeing of a resource, which is blocked by another worker for some reason.

#### Starvation

* Caused by unfair raking of one or more processes that take much more time to run a task. Process A, with higher load and priority, starves process B of processing resources.

#### Race conditions

* When a process is broken due to a lack of synchronizing mechanisms in a coordinated set of processes.
* Two workers vie for the same resource, and there's no predictable way to determine who gets to it first (and excludes the other).

### Discovering Python's parallel programming tools

#### The Python threading module

* Gives abstraction layer to the low level module ``_thread``
* Lets programmer develop parallel systems based on threads.

#### The Python multiprocessing module

* Provides an API for the use of parallelism based on processes.
* Very popular within the Python user community

#### The parallel Python module

* External, offers rich API for the creation of parallel/distributed systems using processes
* Some features:
    * auto detection of optimal configuration
    * A number of worker processes can be changed during runtime
    * Dynamic load balancing
    * Fault tolerance
    * Auto discovery of computation resources

#### Celery - a distributed task queue

* Has at least three different approaches for concurrent tasks: multiprocessing, Eventlet, and Gevent
* Concentrates efforts on the use of the multiprocessing approach

### Taking care of Python GIL

* "GIL is a mechanism that is used in implementing standard Python, known as CPython, to avoid bytecodes that are executed simultaneously by different threads."
* The CPython interpreter doesn't have synchronization for concurrent access by threads, and GIL is meant to protect the internal memory of that interpreter.
* GIL can result in a CPU bound environment in thread based applications
* If you need threaded applications, consider writing that part in C.

## Chapter 2: Designing Parallel Algorithms

* Covers:
    * Divide and conquer
    * Data decomposition
    * Decomposing tasks with pipeline
    * Processing and mapping

### The divide and conquer technique

* "In general, the parallelizable parts in a solution are in pieces that can be divided and distributed for them to be processed by different workers."
* You typically split the domain recursively until you get to an indivisable unit of the complete issue.

### Using data decomposition

* Solve little parts of the problem, recombine.
* Granularity of decomposition may affect performance of your solution.

### Decomposing tasks with pipeline

* Pipeline breaks large tasks into smaller, independent tasks to parallelize
* Each stage of the pipeline is isolated, has its own workers

### Processing and Mapping

* Question to ask when decomposing data/tasks: how do we divide the processing load among workers to get good performance?
* Two important steps in process mapping: identifying independent tasks, identifying tasks requiring data exchange.
* You can distributed independent tasks, may want to group constant communication tasks into a single worker to improve performance.
* You're balancing between distribution, granularity of communication, idle computing power

## Chapter 3: Identifying a Parallelizable Problem

* Covers: Fibonacci, crawling the web

### Obtaining the highest Fibonacci value for multiple inputs

* Fibonacci sequence:

```
       |       0, if n = 0
F(n) = |       1, if n = 1
       | F(n-1) + F(n-2) if n > 1;
```

Python implementation:

```Python
def fibonacci(input):
    a, b = 0, 1
    foritem in range(input):
        a, b = b, a + b
    return a
```

* Hypothetical problem: website lets user give array of values as input to Fibonacci; 1M concurrent users
* Using the above code, you could parallelize by having each worker take one item from the array
* Improvement: use central cache to avoid recalculating

### Crawling the Web

* Problem: a sequential crawler is fed a variable number of URLs, must search all links within each URL
* One possible plan for parallelism:
    1. Group all input URLs in a data structure
    1. Associate data URLs with tasks that will execute the crawling
    1. Dispatch tasks for execution in parallel workers
    1. Result from previous stage must be passed to next stage, to improve collected data and relate to original URLs
* Combination of methods:
    * Data decomposition - dividing and associating URLs to tasks
    * Task decomposition with pipeline - 3 stage pipeline of chaining receiving, collecting, organizing results

## Chapter 4: Using the threading and concurrent.futures Modules

### Defining threads

* Threads are different execution lines in a process
* Metaphor: program is a hive with a collection process for pollen; worker bees are threads, work in parallel using shared resources, acting within a process.

#### Advantages and disadvantages of using threads

* Advantages:
    * Communiction cross-thread within a process is fast
    * Creation of threads is cheaper than process creation
    * You can optimize for data locality by optimizing memory access through the processor cache memory
* Disadvantages:
    * Data sharing can introduce tough to pinpoint bugs
    * Data sharing limits the flexibility of the solution, may limit scalability of algorithms
    * Python specific problem: use of CPU-bound threads can harm performance due to GIL.

#### Understanding different kinds of threads

* Two kinds of threads, kernel and user
* Kernel threads:
    * created and managed by the OS, including context, scheduling, and concluding
    * Advantages:
        * One kernel thread is reference to one process; if a kernel thread blocks, others can still run
        * Kernel threads can run on different CPUs
    * Disadvantages:
        * Creation and synchronization routines are too expensive
        * Implementation is platform dependent
* User threads:
    * controlled by the developer
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` from `threading`
    1. 
    * Advantages:
        * Low cost for creation and synchronization
        * Platform independent
    * Disadvantages:
        * All threads inside a process are related to a single kernel thread; if one user thread blocks, all user threads can't run
        * User threads cannot run on different CPUs

#### Defining the states of a thread

* Five possible states in a thread's life span:
    * Creation - main process that creates a thread, after creation sent to a line of threads
    * Execution - thread begins to use the CPU
    * Ready - thread is in a line of threads ready to be executed
    * Blocked - thread blocked to wait for I/O
    * Concluded - free resources are to be used in an execution to end the thread

#### Choosing between threading and _thread

* Two modules available: `threading` and `_thread`
* `threading` offers a friendlier interface to `_thread`, which is lower level
* Use `threading` unless you know you want to use `_thread` to work more directly with threads

### Using threading to obtain the Fibonacci series term with multiple inputs

* Task: parallelize the execution of the Fibonacci sequence with multiple input values
* Algorithm outline:
    1. Store the four values to calculate in a structure that allows for synchronized access by threads
    1. Tell the threads to process the values using `Condition` sync object from `threading`
    1. Store thread results in a dictionary
* Example code:

```Python
#coding: utf-8

import logging
import threading

from Queue import Queue

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(message)s')

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

fibo_dict = {}
shared_queue = Queue()
input_list = [3, 10, 5, 7]

queue_condition = threading.Condition()

def fibonacci_task(condition):
    with condition:
        while shared_queue.empty():
            logger.info("[%s] - waiting for elements in queue" % 
                        threading.current_thread().name)
            condition.wait()
        else:
            value = shared_queue.get()
            a, b = 0, 1
            for item in range(value):
                a, b = b, a + b
                fibo_dict[value] = a
        shared_queue.task_done()
        logger.debug("[%s] fibonacci of key [%d] with result [%d]" %
                     (threading.current_thread().name, value, fibo_dict[value]))

def queue_task(condition):
    logging.debug('Starting queue_task')
    with condition:
        for item in input_list:
            shared_queue.put(item)
        logging.debug("Notifying fibonacci_task threads that the queue is ready to consume")
        condition.notifyAll()

threads = [threading.Thread(target=fibonacci_task, args=(queue_condition,)) for i in range(4)]

[thread.setDaemon(True) for thread in threads]
[thread.start() for thread in threads]

prod = threading.Thread(name='queue_task_thread', target=queue_task, args=(queue_condition,))
prod.setDaemon(True)
prod.start()

[thread.join() for thread in threads]
```

### Crawling the web using concurrent.futures

* Uses `ThreadPoolExecutor` from `concurrent.futures`
* Larger programs make manual thread management very difficult
* Code example hard to follow due to incomplete

## Chapter 5: Using Multiprocessing and ProcessPoolExecutor

## Chapter 7: Distributing Tasks with Celery

### Understanding Celery

* Tasks are a key concept for celery--any job to distribute has to be encapsulated in a task beforehand
* Positive points of celery:
    * distribution of tasks among workers is transparent, over the internet or locally
    * Changes the concurrence of workers through setup, with processes, threads, Gevent, and Eventlet
    * Support sync, async, periodic, and scheduled tasks
    * Re-executes tasks in case of errors

### Understanding Celery's architecture

* Based on pluggable components and a message transport broker
* Architecture looks like this:

```
     +--------+              +---------------------------+              +---------+
     | Client |              | Message Transport (Broker)|              | Workers |
+->  |   A    +----------->  |                           +----------->  |    A    +--+
|    +--------+              |    +--------------+       |              +---------+  |
|                 Sending    |    | Task Queue X |       |   Getting                 |
|                 messages   |    +--------------+       |   tasks to                |
|    +--------+    (tasks)   |                           |   perform    +---------+  |
|    | Client |              |    +--------------+       |              | Workers |  |
|    |   B    +----------->  |    | Task Queue Y |       +---------->   |    B    |  |
|    +--------+              |    +--------------+       |              +----+----+  |
|                            |           .               |                   |       |
|           ^                |           .               |                   |       |
| Read task |                |           .               |                   |       |
|  results  |                |    +--------------+       |                   |       |
|           |                |    | Task Queue N |       |                   |       |
|           |                |    +--------------+       |                   |       |
|           |                +---------------------------+                   |       |
|           |                                                                |       |
|           |                                                                |       |
|           |                                                                |       |
|           |                                                                |       |
|           |                        +---------+                             |       |
|           +------------------------+\         \                            |       |
|                                    | +---------+  <------------------------+       |
|                                    | | Backend |                                   |
|                                    | | Results |     Store task                    |
+------------------------------------+ |         |       results                     |
                                     + |         |                                   |
                                      \|         |  <--------------------------------+
                                       +---------+
```

#### Working with tasks


