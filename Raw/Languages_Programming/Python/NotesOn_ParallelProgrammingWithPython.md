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

## Chapter 2: Designing Paralle Algorithms

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


