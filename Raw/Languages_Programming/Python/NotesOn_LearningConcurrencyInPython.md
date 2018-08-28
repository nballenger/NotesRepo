# Notes on Learning Concurrency in Python

by Elliot Forbes; Packt Publishing, August 2017

ISBN 9781787285378

# Speed It Up!

* Concurrent techniques give a perceived speed boost, but at the cost of increase program complexity.

## History of Concurrency

## Threads and multithreading

### What is a thread?

* Thread - 'an ordered stream of instructions that can be scheduled to run as such by operating systems.'
* Threads typically live within processes
* Threads consist of:
    * a program counter
    * a stack
    * a set of registers
    * an identifier
* Threads are the smallest unit of execution to which a processor can allocate time
* Threads can interact with shared resources
* Cross thread communication is possible
* Threads can share memory and read/write different memory addresses
* When threads share memory you can get race conditions
* Two distinct types in a typical operating system
    * user level threads - threads we can create, run, kill
    * kernel level threads - low level threads acting on behalf of the OS
* Python is user level, so all python threads are user level threads

### What is multithreading?

* Usually means a processor that can run multiple threads simultaneously, by using a single core that can context switch between threads really fast
* The threads don't run in parallel, but the switches are so fast it seems they do
* Advantages of threading:
    * multiple threads reduce IO bound conditions
    * lightweight in terms of memory compared to another process
    * share resources, so communication is easier
* Disadvantages:
    * CPython threads are limited by the global interpreter lock
    * cross thread comms are great, race conditions suck
    * context switching is computationally expensive, may degrade program performance

## Processes

* Processes can do everything threads can, but are not bound to a single CPU core
* Can work on multiple things at one time
* Processes have a primary thread, but can spawn subthreads, each with their own registers and a stack
* All processes provide every resource the computer needs to execute a program
* Can improve speed where programs are CPU bound
* Run into issues with cross process communication

### Properties of Processes

* *nix processes typically contain:
    * PID, process group id, user id, group id
    * environment
    * working directory
    * program instructions
    * registers
    * stack
    * heap
    * file descriptors
    * signal actions
    * shared libraries
    * interprocess communication tools like message queues, pipes, semaphores, shared memory
* Advantages of processes:
    * make better use of multi-core
    * better than multiple threads at CPU heavy tasks
    * sidestep the global interpreter lock
    * crashing processes don't kill the entire program
* Disadvantages:
    * No shared resources between processes
    * require more memory

## Multiprocessing

* With the multiprocessing module you can use the full number of cores and CPUs, addressing CPU bound problems
* You can get the cpu count with `multiprocessing.cpu_count()`

### Event-driven programming

* There are event emitters that fire events
* Those are picked up by an event loop, where they may match and trigger a matching event handler

### Turtle

* Graphics module in python, for kids
* also good for demonstrating event driven programs, since it has handlers and listeners
* Has a sample program that does some calls to turtle's `turtle.Screen().onkey()` method for registering event handlers

## Reactive programming

* Similar to event driven, but focuses on streams of data, and reacts to changes in those streams

### ReactiveX - RxPy

* RxPy is the python equivalent of ReactiveX framework
* Framework is a 'conglomeration of the observer pattern, the iterator pattern, and functional programming'
* You subscribe to different streams of incoming data, and then create observers that listen for specific events being triggered
* Example usage: data center that needs to keep racks cool. Set up lots of thermometers, have them stream to a central computer. On that machine, set up an RxPy program to observe the incoming streams, have observers watch it for conditionally preset patterns.

## GPU Programming

* GPUs are typically good at doing the same task in parallel, very fast
* Not good for running an OS or doing general purpose computing
* To use the GPU, you need libs like PyCUDA, OpenCL, Theano
* Abstracts away a bunch of stuff that makes it easier to use the many, many cores in a GPU

### PyCUDA

* Lets you use Nvidia's CUDA parallel computation API
* Main limitation is that it's Nvidia specific, so if you don't have an Nvidia card you can't use it.

### OpenCL

* Has a wider range of conformant implementations (including Nvidia)
* Allows using CPUs, GPUs, digital signal processors, field programmable gate arrays, other kinds of processors and hardware accelerators

### Theano

* Another library for using the GPU, but very different stylistically

## The limitations of Python

* The global interpreter lock (GIL) is 'essentially a mutual exclusion lock which prevents multiple threads from executing python code in parallel.'
* The lock can only be held by one thread at any one time, and threads must acquire the lock before executing code.
* Lock acquisition is random round-robin, and there's no guarantee on which thread acquires the lock first.
* Was implemented to combat non-thread safe python memory management
* Can prevent taking advantage of multiprocessor systems
* There have been attempts to get rid of the GIL, but the extra locking necessary for thread-safety slowed down applications too much
* There are libraries like numpy that don't have to interact with the GIL
* Working purely outside the GIL is covered in the book
* There are other implementations, like Jython and IronPython that have no GIL

### Jython

* A python implementation that works with Java
* Can be used with Java as a scripting language, may outperform CPython (the standard implementation) when working with some large datasets
* Mostly CPython outperforms JPython
* Advantage to it is mostly the java integration

### IronPython

* The .NET equivalent of Jython, works on top of .NET framework

### Why should we use python?

* It's a good language for getting work done
* Has large adoption by data scientists and mathematicians
* Lots of libraries for science and math stuff

## Concurrent Image Download

* One example of beneficial multithreading is using multiple threads to download multiple images or files
* One of the best use cases, due to blocking nature of IO
* Going to retrieve 10 different images from an API that serves images at `http://lorempixel.com/400/200/sports`

### Sequential Download

* Baseline for establishing performance gains is a sequential downloader, like:

		import urllib.request

		def downloadImage(imagePath, fileName):
			print("Downloading image from ", imagePath)
			urllib.request.urlretrieve(imagePath, fileName)

		def main():
			sport_img_url = "http://lorempixel.com/400/200/sports"
			for i in range(10):
				imageName = "temp/image-" + str(i) + ".jpg"
				downloadImage(sport_img_url, imageName)

		if __name__ == "__main__":
			main()

### Concurrent Download

* Concurrent version using threads:

		import threading
		import urllib.request
		import time

		def downloadImage(imagePath, fileName):
			print("Downloading image from", imagePath)
			urllib.request.urlretrieve(imagePath, fileName)
			print("Completed download")

		def executeThread(i):
			sport_img_url = "http://lorempixel.com/400/200/sports"
			imageName = "temp/image-" + str(i) + ".jpg"
			downloadImage(sport_img_url, imageName)

		def main():
			t0 = time.time()

			# array that stores a ref to all threads
			threads = []

			# create 10 threads, append to array, start them
			for i in range(10):
				thread = threading.Thread(target=executeThread, args=(i,))
				threads.append(thread)
				thread.start()

			# ensure all threads in array have completed before logging time
			for i in threads:
				i.join()
			
			# calculate total execution time
			t1 = time.time()
			totalTime = t1 - t0
			print("Total execution time {}".format(totalTime))

		if __name__ == '__main__':
			main()

## Improving number crunching with multiprocessing

* How to improve the performance of numeric processing?
* Example is to find the prime factors of 10k random numbers between 20k and 100M.
* Not worried about order of execution, and no shared memory between threads.

### Sequential prime factorization

		import time
		import random

		def calcPrimeFactors(n):
			primfac = []
			d = 2
			while d*d <= n:
				while(n % d) == 0:
					primfac.append(d)
					n //= d
				d += 1
			if n > 1:
				primfac.append(n)
			return primfac

		def main():
			print("Starting")
			t0 = time.time()

			for i in range(10000):
				rand = random.randint(20000, 100_000_000)
				print(str(rand) + ': ' + str(calcPrimeFactors(rand)))

			t1 = time.time()
			totalTime = t1 - t0
			print("Execution time: {}".format(totalTime))

		if __name__ == '__main__':
			main()

### Concurrent prime factorization

* To split the workload, define an `executeProc` function that generates 1000 random numbers, then create 10 processes and execute the function 10 times

		import time
		import random
		from multiprocessing import Process

		def calcPrimeFactors(n):
			primfac = []
			d = 2
			while d*d <= n:
				while(n % d) == 0:
					primfac.append(d)
					n //= d
				d += 1
			if n > 1:
				primfac.append(n)
			return primfac

		def executeProc():
			for i in range(1000):
				rand = random.randint(20000, 100_000_000)
				print(str(rand) + ': ' + str(calcPrimeFactors(rand)))

		def main():
			print("Starting")
			t0 = time.time()

			procs = []
			for i in range(10):
				proc = Process(target=executeProc, args=())
				procs.append(proc)
				proc.start()

			# join all to wait for them to finish
			for proc in procs:
				proc.join()

			t1 = time.time()
			totalTime = t1 - t0
			print("Execution time: {}".format(totalTime))

		if __name__ == '__main__':
			main()

# Parallelize It

* Concurrency and parallelism get confused, but they're real different
* Designing for one when you need the other is costly in performance

## Understanding Concurrency

* Concurrency - 'doing multiple things at the same time, but not, specifically, in parallel'
* Metaphor: one person working on multiple tasks and quickly switching between them
* Concurrency and parallelism address bottlenecks differently

### Properties of Concurrent Systems

* Multiple actors - different processes and threads all trying to make progress on their own tasks
* Shared resources - memory, disk, other resources the actors need to do their work
* Rules - strict rules that all concurrent systems have to follow, defining which actors can and can't acquire locks, access memory, modify state, etc.

## IO Bottlenecks

* When you're spending more time waiting on IO than processing data
* Typical in IO heavy applications
* A web browser for instance spends a ton of time on network requests compared to the time it takes to render page data

## Understanding Parallelism

* Parallelism - executing two or more actions simultaneously
* For true parallelism you need multiple processors
* Example: queue to buy a soda from a machine. One machine allows one customer at a time, increase number of machines, increase parallel sales

### CPU Bound Bottlenecks

* CPU bottlenecks are typically the inverse of an IO bottleneck, where a computationally expensive task slows the whole thing, while data acquisition and marshaling don't take as long
* Increasing CPU power fights this type of bottleneck
* You can also parallelize to fight it

## How do they work on a CPU?

### Single core CPUs

* Single core processors only ever execute one thread at any one time
* They rapidly context switch between execution threads
* Lets you make concurrent progress on many things
* Context switches are computationally expensive, though the OS does its best to minimize the pain of them
* Advantages of single core CPUs:
    * don't require complex communication protocols between cores
    * require less power, so good for small / embedded devices
* Disadvantages:
    * limited in speed, bog down with big applications
    * heat management places a hard limit on their speed

### Clock rate

* Key limitation of a single core application is the CPU clock speed
* CPUs have gotten much, much faster, but that's going to slow down as we approach the physical limits of putting transistors on silicon

### Martelli model of scalability

* Alex Martelli wrote the Python Cookbook, and came up with a model for scalability
* Model has three types of problems and programs:
    * 1 core - single threaded and single process programs
    * 2-8 cores - multithreaded and multiprocessing programs
    * 9+ cores - distributed computing
* The usefulness of 2-8 core machines is getting to be less as single core speeds go up, and the availability of distributed computing increases
* If you really need to solve problems with a ton of speed and power, you should pretty much just go with a distributed system and do real parallel work.

### Time-sharing - the task scheduler

* The OS has a task scheduler responsible for getting tasks to run to completion
* The specifics of when and where a task will execute are non-deterministic; giving the scheduler two tasks in order does not guarantee that the first task will execute ahead of the second
* Example code that demonstrates the behavior:

		import threading
		import time
		import random

		counter = 1

		def workerA():
			global counter
			while counter < 1000:
				counter += 1
				print("worker A incrementing counter to {}".format(counter))
				sleepTime = random.randint(0,1)
				time.sleep(sleepTime)

		def workerB():
			global counter
			while counter < 1000:
				counter -= 1
				print("worker B decrementing counter to {}.".format(counter))
				sleepTime = random.randint(0,1)
				time.sleep(sleepTime)

		def main():
			t0 = time.time()
			thread1 = threading.Thread(target=workerA)
			thread2 = threading.Thread(target=workerB)
			thread1.start()
			thread2.start()
			thread1.join()
			thread2.join()
			t1 = time.time()
			print("Execution time {}".format(t1-t0))

		if __name__ == '__main__':
			main()

* That code may complete and may not, as A and B fight to change the value of the global counter object as they get access to the process via the task scheduler.
* Demonstrates a danger of threads accessing shared resources without synchronization--no way to tell what will happen to the counter, so the program is unreliable.

### Multi-core processors

* Each core follows its own cycle:
    * Fetch - get instructions from program memory; dictated by a program counter that identifies the location of the next step to execute
    * Decode - convert the fetched instruction into signals that trigger the CPU
    * Execute - run the instruction that's been fetched and decoded; store the results in a CPU register
* Multi-core allows multiple fetch-decode-execute cycles
* Advantages of multi-core processors:
    * no longer bound by single processor limitations
    * apps that can take advantage of multi-core will run faster if well designed
* Disadvantages:
    * Require more power
    * Cross-core communication is difficult, lots of different ways to do it

## System architecture styles

* Many different memory architecture styles, good for different things:
    * SISD - single instruction stream, single data stream
    * SIMD - single instruction stream, multiple data stream
    * MISD - multiple instruction stream, single data stream
    * MIMD - multiple instruction stream, multiple data stream

### SISD

* Typically these are single processor systems
* Classical Von Neumann type machines, home computers until multi-core became widespread
* Can't do instruction or data parallelism; graphics processing very difficult
* Example chip: Pentium 4

### SIMD

* Best for systems that process a lot of multimedia
* Good for 3D graphics because of how they manipulate vectors
* Vector addition is a single op, on scalar architecture it's n ops, where n is vector length
* GPU typically uses this style
* OpenGL has Vertex Array Objects (VAOs) that contain Vertex Buffer Objects to describe any given 3D object in a program
* Recalculation across all Vertex Buffers for all Vertex Array Objects happens very fast
* By passing all elements into distinct VAOs, you can then perform the same action very fast on every element
* Advantages:
    * Can perform the same operation on multiple elements with one instruction
    * As cores increase, throughput of the card increases

### MISD

* Not really used, no examples to speak of.

### MIMD

* Most diverse taxonomy, encapsulates all modern day multi-core processors
* Each core is capable of running independently and in parallel
* Can run a number of distinct ops on multiple datasets in parallel
* Normal multiprocessors use MIMD

## Computer Memory Architecture Styles

* Once you get into concurrency/parallelism, you have other challenges that crop up
* One of the biggest is the speed of data access
* If you can't access it fast enough, you get a bottleneck
* One improvement is that designers have provided a single physical address space that all the cores in a processor can access
* There are multiple architectures, but the main two are:
    * Uniform Memory Access
    * Non-uniform Memory Access

### UMA

* Has a shared memory space that can be used in a uniform fashion by any number of cores
* Wherever the core resides, it can access a memory location in the same time no matter how close the memory is
* Also known as Symmetric Shared-Memory Multiprocessors (SMP)
* Each processor interfaces with a bus, which performs all memory access
* Each additonal processor increases the strain on the bus bandwidth, so scaling is an issue
* Advantages:
    * All RAM access takes the same amount of time
    * Cache is coherent and consistent
    * Hardware design is simpler
* Disadvantages:
    * Has one memory bus from which all systems access memory, so scaling problems

### NUMA

* Some memory access may be faster than others depending on which processor requests it
* Each processor has its own cache, access to main memory, and independent IO
* Each is connected to the interconnection network
* One major advantage:
    * NUMA machines are more scalable than UMA
* Disadvantages:
    * Non-deterministic memory access times across local/non-local memory locations
    * Processors must observe changes made by other processors, that observation time increases as number of processors increases

# Life of a Thread

* Chapter covers:
    * thread states
    * types of threads - windows and POSIX
    * best practices for starting threads
    * how to work with lots of threads
    * how to end threads, various multithreading models

## Threads in Python

* Important to know what we'll be instantiating in real terms
* Have to look at the python `Thread` class def in `threading`
* `Thread`'s constructor signature is:

        def __init__(self, group=None, target=None, name=None,
                args=(), kwargs=None, verbose=None):

* The args are:
    * `group` - reserved for future extension
    * `target` - callable object to be invoked by `run()`
    * `name` - thread name
    * `args` - arg tuple for target invocation
    * `kwargs` - keyword arg dict to invoke the base class constructor

### Thread State

* A created thread that has no resources allocated is technically in no state, and can only be started or stopped
* Threads can be in five states:
    * new thread - not started, not allocated resources
    * runnable - waiting to run, has all resources, waiting on the task scheduler
    * running - executing whatever task it's assigned, has been chosen by the task scheduler. Can go from here to dead (if we kill it) or a not-running state.
    * not-running - paused in some way. could be waiting for IO, or deliberately blocked until another thread has completed
    * dead - can die of natural causes or be killed

### State flow chart

        |                          running 
        |                             |
        |                           yield
        |                             |
        |                             v
        |  new thread -- start --> runnable <------> not runnable
        |                             |
        |                             | (run method terminates)
        |                             v
        |                            dead

* A python example of thread state:

		import threading
		import time

		# Simple method for a thread to execute
		def threadWorker():
			# when the thread starts executing it goes from runnable to running
			print("My thread has entered 'running' state")
			# if we sleep the thread it goes into not-runnable
			time.sleep(10)
			# complete task and terminate
			print("my thread is terminating")
			
		def main():
			# starts in no state, with no resources allocated
			myThread = threading.Thread(target=threadWorker)

			# Moving to starting and runnable
			myThread.start()

			# join the thread, and thread goes into dead state
			myThread.join()
			print("thread entered dead state")

		if __name__ == '__main__':
			main()

### Different types of threads

* Python abstracts most of the lower level threading APIs
* It's portable across windows and POSIX threads
* A POSIX thread is impelemented to follow IEEE POSIX 1003.1c, runs on unix
* Called POSIX threads or PThreads
* Windows threads are the standard msft uses to impelement their low level threads

### The ways to start a thread

* If the task is simple, you can define a single function
* example that multithreads a simple function:

		import threading
        import time
        import random

        def executeThread(i):
            print("Thread {} started".format(i))
            sleepTime = random.randint(1,10)
            time.sleep(sleepTime)
            print("Thread {} finished executing".format(i))
        
        for i in range(10):
            thread = threading.Thread(target=executeThread, args=(i,))
            thread.start()
            print("Active Threads:", threading.enumerate())

* For more code than can be wrapped in one function, you can define a class that inherits directly from the native thread class
* If you do this, you then have to manage your thread within the class
* To subclass `Thread`, you must at least:
    * pass in the thread class to the class def
    * class `Thread.__init__(self)` in the constructor
    * define a `run()` function to call when the thread starts
* Example:

        from threading import Thread

        class myWorkerThread(Thread):
            def __init__(self):
                print("Hello world")
                Thread.__init__(self)
            def run(self):
                print("Thread now running")

        myThread = myWorkerThread()
        print("Created my thread object")
        myThread.start()
        print("started my thread")
        myThread.join()
        print("my thread finished")

### Forking

* Forking a process creates an exact replica
* You effectively clone the process and run it as a child of the original
* The new process gets its own address space and a copy of the parent's data and code
* The new one also gets its own PID
* Ideal for protecting some processes from others that may hang or crash
* Example:

		import os

		def child():
			print("In the child with PID= {}".format(os.getpid()))

		def parent():
			print("In the parent with PID= {}".format(os.getpid()))
			newRef = os.fork()

			if newRef==0:
				child()
			else:
				print("In the parent, child has PID= {}".format(newRef))

		if __name__ == '__main__':
			parent()

### Daemonizing a thread

* Daemon threads are essentially threads with no defined endpoint--they run until the program quits.
* Example:

		import threading
		import time

		def standardThread():
			print("Starting a standard thread")
			time.sleep(20)
			print("ending standard thread")

		def daemonThread():
			while True:
				print("sending heartbeat")
				time.sleep(2)

		if __name__ == '__main__':
			stdThread = threading.Thread(target=standardThread)
			dmnThread = threading.Thread(target=daemonThread)
			dmnThread.setDaemon(True)
			dmnThread.start()

			stdThread.start()

* The heartbeat lasts until the standard thread completes, and the program exits.
* Setting `dmnThread.setDaemon(True)` sets the thread object's daemon flag, is only really used for reference

## Handling threads in Python

### Starting loads of threads

* Going to look at starting multiple threads at once
* Example basically just creates a function, then threads it for i in range(10)

### Slowing down programs using threads

* Threads have overhead. Starting too many can kill performance.
* Uses the example of speeding up prime factorization from chapter 1, but threads it instead of starting multiple processes
* That reduces the overall program performance

### Getting the total number of active threads

* If you want the number of active threads, you can use `threading.active_count()`

### Getting the current thread

* You can call `threading.current_thread()` to get a reference to the current thread's object
* Example:

		import threading, time

		def threadTarget():
			print("Current thread: {}".format(threading.current_thread()))

		threads = []

		for i in range(10):
			thread = threading.Thread(target=threadTarget)
			thread.start()
			threads.append(thread)

		for thread in threads:
			thread.join()

### Main thread

* All python programs have at least one thread, main
* You can call `threading.main_thread()` to get a reference to the main thread

### Enumerating all threads

		import threading, time, random

		def myThread(i):
			print("Thread {}: started".format(i))
			time.sleep(random.randint(1,5))
			print("Thread {}: finished".format(i))

		if __name__ == '__main__':
			for i in range(4):
				thread = threading.Thread(target=myThread, args=(i,))
				thread.start()

			print("Enumerating: {}".format(threading.enumerate()))

### Identifying threads

* Can be good in large systems to segregate threads into groups if they perform different tasks
* Naming conventions can be used for that
* Example:

		import threading, time

		def myThread():
			name = threading.currentThread().getName()
			print("thread {} starting".format(name))
			time.sleep(10)
			print("thread {} ending".format(name))

		if __name__ == '__main__':
			for i in range(4):
				threadName = "Thread-" + str(i)
				thread = threading.Thread(name=threadName, target=myThread)
				thread.start()

			print("{}".format(threading.enumerate()))

### Ending a thread

* It is bad practice to end a thread.
* There's no native threading function to kill other threads
* Terminating a thread can leave resources in a bad state
* Killing a parent thread without killing its child threads can create orphan threads
* Threads don't have a native termination function, but processes do
* Terminating the process can be cleaner
* Example:

		from multiprocessing import Process
		import time

		def myWorker():
			t1 = time.time()
			print("process started at: {}".format(t1))
			time.sleep(20)

		if __name__ == '__main__':
			myProcess = Process(target=myWorker)
			print("Process {}".format(myProcess))
			myProcess.start()
			print("Terminating process...")
			myProcess.terminate()
			myProcess.join()
			print("Process terminated: {}".format(myProcess))


### Orphan processes

* These are threads with no alive parent process
* They take up system resources and have no benefit, and the only way to kill them is to enumerate live threads and kill them

## How does the operating system handle threads

### Creating processes versus threads

* A process can do more CPU bound tasks better than a standard thread, since they each have their own GIL instance
* They are also more resource intensive.
* Example comparing thread overhead to process overhead:

		import threading, time, os
		from multiprocessing import Process

		def myTask():
			print("starting")
			time.sleep(2)

		if __name__ == '__main__':
			t0 = time.time()
			threads = []

			for i in range(10):
				thread = threading.Thread(target=myTask)
				thread.start()
				threads.append(thread)

			t1 = time.time()
			print("total time creating 10 threads: {}s".format(t1-t0))

			for thread in threads:
				thread.join()

			t2 = time.time()
			procs = []
			for i in range(10):
				process = Process(target=myTask)
				process.start()
				procs.append(process)
			t3 = time.time()
			print("total time for creating 10 processes: {}s".format(t3-t2))

			for proc in procs:
				proc.join()

* One way to combat the startup overhead is to start your threads/processes at the start of your program and keep them in a pool

## Multithreading models

* There are two kinds of threads on a machine: user and kernel
* They can be mapped together in 1:1, 1:many, and many:many
* With python we typically go with one user thread to one kernel thread
* So every thread you create takes up a non-trivial amount of resources
* There are modules that let you do multiple python threads on a single system thread, like `asyncio`

### One-to-one thread mapping

* One user level thread maps to one kernel level thread
* Expensive in terms of creating / managing kernel threads
* Advantages include the user level threads not having the same amount of blocking as threads in a many to one

### Many-to-one

* Many user level threads map to one kernel level thread
* Lets you manage user level threads efficiently, but if one of the user level threads is blocked, the other threads mapped to its kernel thread are also blocked

### Many-to-many

* Many user level threads map to many kernel level threads
* Overcomes problems of the other two models
* Individual user level threads can be mapped to either a single kernel thread or multiple kernel threads
* Lets the programmer choose which user level threads map to kernel level threads, and gives a lot of choice in a multithreaded environment

# Synchronization between threads

* Chapter looks at:
	* how to sync data between threads
	* race conditions
    * deadlock
    * overview of synchronization primitives in Python

## Synchronization between threads

* How to implement multithreading in a safe way?
* Before covering sync primitives, going to look at deadlock
* uses the dining philosophers problem as a deadlock example

### The dining philosophers

* Introduced by Edsger Dijkstra, officially formulated by Tony Hoare
* Five famous philosophers at a round table, eating bowls of spaghetti
* Between each of the bowls are distributed five forks
* Each philosopher decides they require two forks to eat
* Each philosopher can be in two states: thinking and eating
* To enter eating state, they must get both their respective left and right forks
* Once they take a fork, they have to wait until they've eaten to give it up
* Imagine a case where each of them picks up their left hand fork at the same time
* They can't give up the fork, and none of them can get the right fork to enter eating state, so they're deadlocked
* Example using RLocks:

		import threading
		import time
		import random

		def sleepsome():
			time.sleep(random.randint(1, 5))

		class Philosopher(threading.Thread):
			def __init__(self, name, left_fork, right_fork):
				print("{} Has Sat Down At the Table".format(name))
				threading.Thread.__init__(self, name=name)
				self.left_fork = left_fork
				self.right_fork = right_fork

			def run(self):
				pname = threading.currentThread().getName()
				print("{} has started thinking".format(pname))
				while True:
					sleepsome()
					print("{} has finished thinking".format(pname))
					self.left_fork.acquire()
					sleepsome()

					try:
						print("{} has acquired the left fork".format(pname))
						self.right_fork.acquire()

						try:
							print("{} has both forks, eating".format(pname))
						finally:
							self.right_fork.release()
							print("{} released right fork".format(pname))
					finally:
						self.left_fork.release()
						print("{} has released the left fork".format(pname))

		if __name__ == '__main__':
			FORKS = [threading.RLock() for i in range(5)]
			NAMES = ["Kant", "Aristotle", "Spinoza", "Marx", "Russell"]
			PHILS = []

			for i in range(5):
				print(NAMES[i])
				lf = FORKS[i]
				rf = FORKS[(0 if i % (len(FORKS)-1) == 0 else i+1)]
				PHILS.append(Philosopher(NAMES[i], lf, rf))

			for i in range(5):
				PHILS[i].start()

			for i in range(5):
				PHILS[i].join()

### Race conditions

* Standard definition of a race condition: "A race condition or race hazard is the behavior of an electronic, software, or other system where the output is dependent on the sequence or timing of other uncontrollable events."
* To address them, you need to make non-deterministic code deterministic.

### Critical sections

* Critical sections of code are any parts that modify or access a shared resource.
* They cannot under any circumstance be executed by more than one process at any one time.
* If they execute simultaneously you get errors.
* You can have race conditions in the filesystem--two processes try to modify a file, etc.
* The Therac-25 radiation machines that killed people were bad due to race conditions.

## Shared resources and data races

* If you want to create thread safe code you need to understand synchronization.

### The join method

* The python thread object gives you some control over execution order via `join()`
* `join()` blocks the parent thread from progressing until that thread has confirmed that it has terminated.
* Example

		import threading
		import time

		def our_thread(i):
			print("Thread {} started".format(i))
			time.sleep(i*2)
			print("Thread {} finished".format(i))

		def main():
			thread1 = threading.Thread(target=our_thread, args=(1,))
			thread1.start()
			print("Is thread1 finished?")
			thread2 = threading.Thread(target=our_thread, args=(2,))
			thread2.start()
			thread2.join()
			print("Thread 2 definitely finished")

		if __name__ == '__main__':
			main()

### Locks

* A lock in python is a synchronization primitive that can be locked or unlocked
* A lock can only be acquired when it is unlocked
* This code will create an initial race to acquire the lock, and then one worker will execute until it reaches its goal, releasing the lock to the other.

		import threading, time, random

		COUNTER = 1
		LOCK = threading.Lock()

		def worker_a():
			global COUNTER
			LOCK.acquire()

			try:
				while COUNTER < 1000:
					COUNTER += 1
					print("A incrementing COUNTER to {}".format(COUNTER))
					time.sleep(random.randint(0, 1))
			finally:
				LOCK.release()

		def worker_b():
			global COUNTER
			LOCK.acquire()

			try:
				while COUNTER > -1000:
					COUNTER -= 1
					print("B decrementing COUNTER to {}".format(COUNTER))
					time.sleep(random.randint(0, 1))
			finally:
				LOCK.release()

		def main():
			t0 = time.time()
			thread1 = threading.Thread(target=worker_a)
			thread2 = threading.Thread(target=worker_b)
			thread1.start()
			thread2.start()
			thread1.join()
			thread2.join()
			t1 = time.time()
			print("Execution time: {}".format(t1-t0))

		if __name__ == '__main__':
			main()

### RLocks

* RLocks are 'reentrant locks', another synchronization primitive
* An RLock can be acquired by a thread multiple times if that thread already owns it
* if thread A acquires an RLock multiple times, a counter in the lock is incremented each time
* Thread B can't get the RLock until each acquisition by A has been released

		import threading, time

		class MyWorker():
			def __init__(self):
				self.a = 1
				self.b = 2
				self.rlock = threading.RLock()

			def modify_a(self):
				with self.rlock:
					print("Modifying A: RLock acquired: {}"
						  .format(self.rlock._is_owned()))
					print("{}".format(self.rlock))
					self.a = self.a + 1
					time.sleep(2)

			def modify_b(self):
				with self.rlock:
					print("Modifying B: RLock acquired: {}"
						  .format(self.rlock._is_owned()))
					print("{}".format(self.rlock))
					self.b = self.b - 1
					time.sleep(2)

			def modify_both(self):
				with self.rlock:
					print("Rlock acquired, modifying a and b")
					print("{}".format(self.rlock))
					self.modify_a()
					self.modify_b()
				print("{}".format(self.rlock))

		if __name__ == '__main__':
			worker_a = MyWorker()
			worker_a.modify_both()

### Rlocks vs regular locks

* If you try the previous with a regular lock, it never gets to `modify_a()`, because a deadlock is formed
* RLocks give you some recursive thread safety without a bunch of complex acquire/release logic in your code

### Condition

* A condition is a synchronization primitive that waits on a signal from another thread
* In the native library, a `condition` object is a factory function that returns a new condition variable object that lets one or more threads wait until they are notified by another thread
* Most common scenario is producer/consumer
* Could have a producer that publishes to a queue and notifies consumers that there are now messages in the queue
* Example creates classes that inherit from `Thread` to be publisher and subscriber classes
* Publisher publishes new integers to an array, notifies the subscribers there's an item to be consumed

		import threading, time, random

		class Publisher(threading.Thread):
			def __init__(self, integers, condition):
				self.condition = condition
				self.integers = integers
				threading.Thread.__init__(self)

			def run(self):
				while True:
					integer = random.randint(0,1000)
					self.condition.acquire()
					print("Condition acquired by publisher: {}".format(self.name))
					self.integers.append(integer)
					self.condition.notify()
					print("Condition released by publisher: {}".format(self.name))
					self.condition.release()
					time.sleep(1)

		class Subscriber(threading.Thread):
			def __init__(self, integers, condition):
				self.integers = integers
				self.condition = condition
				threading.Thread.__init__(self)

			def run(self):
				while True:
					self.condition.acquire()
					print("Condition acquired by consumer: {}".format(self.name))
					while True:
						if self.integers:
							integer = self.integers.pop()
							print("{} popped from list by consumer: "
									.format(integer, self.name))
							break
						print("Condition wait by {}".format(self.name))
						self.condition.wait()
					print("Consumer {} releasing condition".format(self.name))
					self.condition.release()

		def main():
			integers = []
			condition = threading.Condition()
			pub1 = Publisher(integers, condition)
			pub1.start()
			sub1 = Subscriber(integers, condition)
			sub2 = Subscriber(integers, condition)
			sub1.start()
			sub2.start()
			pub1.join()
			sub1.join()
			sub2.join()

		if __name__ == '__main__':
			main()

### Semaphores

* Dijkstra took the idea of semaphores from railway systems and translated them into something you could use with concurrent software
* Semaphores have an internal counter that goes up/down with acquire/release calls
* On init it's set to 1 unless otherwise set
* The semaphore cannot be acquired if the counter will fall to a negative integer value
* Example app has a semaphore initially set to 2, a thread acquires it (value goes to 1), another acquires it (value drops to 0), then any additonal requests are denied until one of the first two release
* The init for the `Semaphore` class looks like

		class _Semaphore(_Verbose):
			def __init__(self, value=1, verbose=None):
                if value < 0:
                    raise ValueError("semaphore initial must be >= 0")
                _Verbose.__init__(self, verbose)
                self.__cond = Condition(Lock())
                self.__value = value

* The `acquire()` method blocks if necessary until the counter is appropriately set
* Example is a ticket selling program that features four distinct threads that each try to sell as many tickets of the entire allocation as possible before the tickets sell out

		import threading, time, random

		TICKETS_AVAILABLE = 100
		SEMAPHORE = threading.Semaphore()

		class TicketSeller(threading.Thread):
			tickets_sold = 0
			def __init__(self, semaphore):
				threading.Thread.__init__(self)
				self.sem = semaphore
				print("Ticket seller started work")

			def run(self):
				global TICKETS_AVAILABLE
				running = True
				while running:
					self.random_delay()

					self.sem.acquire()
					if(TICKETS_AVAILABLE <= 0):
						running = False
					else:
						self.tickets_sold = self.tickets_sold + 1
						TICKETS_AVAILABLE = TICKETS_AVAILABLE - 1
						print("{} sold one ({} left)"
								.format(self.getName(), TICKETS_AVAILABLE))
					self.sem.release()
				print("Ticket seller {} sold {} tickets in total"
						.format(self.getName(), self.tickets_sold))

			def random_delay(self):
				time.sleep(random.randint(0,1))

		def main():
			sellers = []
			for i in range(4):
				seller = TicketSeller(SEMAPHORE)
				seller.start()
				sellers.append(seller)

			for seller in sellers:
				seller.join()

		if __name__ == '__main__':
			main()

* Note that in this example, if you remove the simulated blocking in `random_delay()`, whatever thread acquires the semaphore first will probably sell all the tickets. The thread that wins the semaphore is in a prime position to reacquire the lock before any other thread can do so.

### Bounded Semaphores

* Like normal semaphores, except: "a bounded semaphore checks to make sure its current value doesn't exceed its initial value. If it does, ValueError is raised."
* You use it to guard resources with limited capacity.
* If the semaphore is being released too many times, it's probably a bug
* Typically you can find them in web server or db implementations to guard against resource exhaustion in the event of too many people trying to connect at once
* Generally better practice to use bounded semaphores than regular ones

### Events

* Useful but simple form of communication between concurrent threads
* An event signals that something has occurred, while other threads listen for that signal
* They're objects with an internal boolean flag. In threads you poll that value, then act if its state changes
* You can't easily kill threads, but you could use events to have threads run only as long as an event has not happened, so you could do a graceful shutdown
* Events have four public functions:
	* `isSet()` - checks to see if it is set
	* `set()` - sets it
	* `clear()` - resets it
	* `wait()` blocks until the internal flag is true
* Example:

		import threading, time

		def my_thread(my_event):
			while not my_event.is_set():
				print("waiting for event to be set")
				time.sleep(1)
			print("my_event has been set")

		def main():
			e = threading.Event()
			thread1 = threading.Thread(target=my_thread, args=(e,))
			thread1.start()
			time.sleep(4)
			e.set()

		if __name__ == '__main__':
			main()

### Barriers

* Barriers are another sync primitive for python 3, address a problem that could previously only be solved with a mixture of conditions and semaphores
* Barriers are control points that ensure that progress is only made by a group of threads after the point at which all participating threads reach the same point

		import threading, time, random

		class MyThread(threading.Thread):
			def __init__(self, barrier):
				threading.Thread.__init__(self)
				self.barrier = barrier

			def run(self):
				print("Thread {} working on something"
						.format(threading.current_thread()))
				time.sleep(random.randint(1,4))
				print("Thread {} is joining {} waiting on barrier"
						.format(threading.current_thread(), self.barrier.n_waiting))
				self.barrier.wait()

				print("Barrier lifted, continuing with work")

		def main():
			BARRIER = threading.Barrier(4)
			threads = []
			for i in range(4):
				thread = MyThread(BARRIER)
				thread.start()
				threads.append(thread)

			for t in threads:
				t.join()

		if __name__ == '__main__':
			main()


# Communication between threads

* Without proper communication, concurrent systems can't usually work properly
* Chapter looks at:
    * standard data structures and their thread safe use
    * thread safe comms using queues
    * double ended queues
    * using all the new concepts to build a multithreaded web crawler

## Standard data structures

* Some data structures are thread safe, but mostly you have to use locking of some sort

### Sets

* One good solution is to extend the set class, adding locking around the actions you want to perform
* 

### Decorator

### Class decorator

### Lists

### Queues

#### FIFO queues

#### LIFO queues

#### Priority queue

### Queue objects

#### Full/empty queues

#### The join() function

### Deque objects

### Appending elements

### Popping elements

### Inserting elements

### Rotation

## Defining your own thread-safe communication structures

### A web crawler example

# Debug and benchmark

# Executors and pools

# Multiprocessing

# Event-driven programming

# Reactive programming

# Using the GPU

# Choosing a Solution


