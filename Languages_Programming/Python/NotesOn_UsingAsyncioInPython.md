# Notes on Using Asyncio in Python

By Caleb Hattingh; O'Reilly Media, Inc., Feb. 2020; ISBN 9781492075332

# Chapter 1. Introducing Asyncio

* Central focus of Asyncio is how best to perform multiple tasks at the same times, specifically tasks that involve waiting periods.
* Key insight for this style of programming: while you wait for one task to complete, work on other tasks can proceed.

## The Restaurant of ThreadBots

* You have a restaurant. All the employees are robots from Threading Inc, "Threadbots"
* Guests want food, to sit at tables, to wait an appropriate amount of time for meals, pay at the end, and optionally tip.
* You hire robots:
    * Greetbot to work the front desk
    * Waitbot to wait tables and take orders
    * Chefbot to do the cooking
    * Winebot to manage the bar
* What they do:
    * Diners arraive and are welcomed by Greetbot, then directed to a table
    * Once seated, Waitbot takes their order, and takes it to Chefbot
    * Chefbot begins preparing the food
    * Waitbot periodically checks in on the food, and when it is ready takes it to the table
    * When the guests leave they return to Greetbot to get their bill and make payment
* Problems crop up over time:
    * Waitbot may grab a prepared dish before Chefbot has let go of it
    * Waitbot may grab a drink before Winebot has let go of it
    * Greetbot may seat new diners at a table at the same time Waitbot decides to clean that table
* As the number of diners increase, these collisions are more frequent
* You add another Greetbot and two more Waitbots for busy days (though you have to employ them for the whole week)
* You're paying for them all week, but also have to coordinate them and give them space
* As you add more robots, the collisions get worse
* The system may experience lockups where all the bots are waiting on each other
* Even at full capacity, the most hardworking bot may be idle a lot of the time
* Then you try programming a single bot to do all the tasks
* Every time it waits, even for a second, it switches to the next task anywhere in the restaurant instead of waiting.
* You call it Loopbot because it loops over all jobs. It is more difficult to program.
* Loopbot jumps back and forth very fast, and it is much more utilizied. It can't collide since it is doing all the work itself.
* Problem: A guest has come who is very chatty, and is monopolizing Loopbot by talking to it, and it cannot dash off to perform other tasks. A dish burns.
* Loopbot can only be effective if every task is short, or takes a short amount of time.
* It's difficult to know in advance which tasks may take a long time.
* You stick with a single Loopbot despite the issues

## Epilogue

* Each robot worker represents a single thread.
* Key observation is that a lot of the work involves waiting, like when `requests.get()` waits for a server to respond
* CPUs spend a lot of time idle, waiting for network IO
* Programs can be written to explicitly direct the CPU to move between work tasks as necessary.
* You get a small improvement in economy by using fewer CPUs, but the real advantage is the elimination of race conditions.
* There are drawbacks as well, not least of which is having to think about programming differently.

## What Problem is Asyncio Trying to Solve?

* For IO bound workloads, there are two reasons to use async-based concurrency over thread-based concurrency:
    * Asyncio is a safer alternative to preemptive multitasking (threading), avoiding the bugs, race conditions, nondeterministic dangers in non-trivial threaded applications.
    * Asyncio offers a simple way to support many thousands of simultaneous socket connections, including being able to handle many long lived connections for things like WebSockets
* Threading is best suited to computational tasks that are best executed with multiple CPUs and shared memory for cross-thread communication.
* Network programming is NOT one of those domains, because it involves so much waiting. Because of that, you don't need the OS to efficiently distribute tasks over multiple CPUs, and you don't need the risks of threading like race conditions in shared memory.
* Things that are not true:
    * Asyncio will make code extremely fast - Threading solutions are slightly faster. If the extent of concurrency itself is a performance metric, asyncio does make it easier to create very large numbers of concurrent socket connections. Speed's not really the benefit of Asyncio in Python.
    * Asyncio makes threading redundant. - No, threading's still great for multi-CPU problems.
    * Asyncio removes the problems with the GIL. - Asyncio isn't affected by the GIL, but it can't benefit from multiple CPU cores either.
    * Asyncio prevents all race conditions - You can always have them with any concurrent program.
    * Asyncio makes concurrent programming easy. - No, concurrency is always complex.

# Chapter 2: The Truth about Threads

* Threads are a feature from an OS, available to software devs so they can indicate to the OS which parts of their program may run in parallel. The OS decides how to share CPU resources with each of those parts.
* Even when using Asyncio you still probably have to deal with threads and processes, so it's worth knowing about them.
* Note that this discussion is about concurrency in *network* programming, and doesn't necessarily hold in other domains.

## Benefits of Threading

* Main benefits:
    * Ease of reading code - code can be run concurrently, but written in a simple, top-down linear sequence of commands. You can potentially pretend within function bodies, that no concurrency is happening.
    * Parallelism with shared memory - Your code can use multiple CPUs while having threads share memory, which is good for some workloads where moving data between memory spaces is expensive.
    * Know-how and existing code - There's lots of knowledge and best practices for writing threaded applications, and a lot of existing blocking code that depends on multithreading for concurrency.
* In python parallelism isn't so great because of the GIL, which protects the internal state of the interpreter to prevent race conditions between threads.
* Side effect of the GIL is that all threads are pegged to a single CPU, which negates parallelism performance benefits unless you use something like Cython or Numba to get around it.
* Threading in Python *feels* exceptionally simple though, which is worthwhile if you can keep your code simple and safe.
* General best practice for using threads is to use `concurrent.futures.ThreadPoolExecutor`, passing all required data in through `submit()`
* Example:

    ```Python
    from concurrent.futures import ThreadPoolExecutor as Executor

    def worker(data):
        ... # process the data
    
    with Executor(max_workers=10) as exe:
        future = exe.submit(worker, data)
    ```

* You can convert the pool of threads to a pool of subprocesses with `ProcessPoolExecutor`, which has the same API
* It's good for those tasks to be short-lived, so when the program needs to shutdown you can call `Executor.shutdown(wait=True)` and wait a second or two for the executor to complete.
* MOST IMPORTANT: if at all possible, prevent threaded code (the `worker()` function, above) from accessing or writing to ANY global variables.
* Watch Raymond Hettinger's PyCon/PyBay talks on safe threaded code.

## Drawbacks of Threading

* It's difficult. Threading bugs and race conditions in threaded programs are really really hard.
* Threads are resource intensive. They require preallocated stack space in virtual memory typically, and it gets big fast.
* Threading can affect throughput - with high concurrency you can have an impact on throughput due to context switching costs.
* Threading is inflexible - OS continually shares CPU time with all threads regardless of whether it's ready to work or not.
* Summary of things from various OS documentations:
    * Threading makes code hard to reason about
    * Threading is an inefficient model for large scale concurrency (thousands of concurrent tasks)

## Case Study: Robots and Cutlery

* Example that demonstrates why threading is unsafe:

    ```Python
    import threading
    from queue import Queue

    class ThreadBot(threading.Thread):                               # 1.
        def __init__(self):
            super().__init__(target=self.manage_table)               # 2.
            self.cutlery = Cutlery(knives=0, forks=0)                # 3.
            self.tasks = Queue()                                     # 4.

        def manage_table(self):
            while True:                                              # 5.
                task = self.tasks.get()
                if task == 'prepare table':
                    kitchen.give(to=self.cultery, knives=4, forks=4) # 6.
                elif task == 'clear table':
                    self.cutlery.give(to=kitchen, knives=4, forks=4)
                elif task == 'shutdown':
                    return
    ```

* Points about this code:
    1. A `ThreadBot` is a subclass of a thread
    2. The target function of the thread is `manage_table()`
    3. The bot keeps track of the cutlery it takes from the kitchen
    4. The bot will be assigned tasks, added to this queue, performed during main processing
    5. Primary routine is this infinite loop
    6. Only three tasks defined for the bot
* Definition of the `Cutlery` object used above:

    ```Python
    from attr import attrs, attrib

    @attrs                                                  # 1.
    class Cutlery:
        knives = attrib(default=0)                          # 2.
        forks = attrib(default=0)

        def give(self, to: 'Cutlery', knives=0, forks=0):   # 3.
            self.change(-knives, -forks)
            to.change(knives, forks)

        def change(self, knives, forks):                    # 4.
            self.knives += knives
            self.forks += forks

    kitchen = Cutlery(knives=100, forks=100)                # 5.
    bots = [ThreadBot() for i in range(10)]                 # 6.

    import sys
    for bot in bots:
        for i in range(int(sys.argv[1])):                   # 7.
            bot.tasks.put('prepare table')
            bot.tasks.put('clear table')
        bot.tasks.put('shutdown')                           # 8.

    print('Kitchen inventory before service:', kitchen)
    for bot in bots:
        bot.start()

    for bot in bots:
        bot.join()
    print('Kitchen inventory after service:', kitchen)
    ```

* Points about that code:
    1. `attrs` is an open source lib that makes class creation easier. The decorator makes sure the class automagically gets all the boilerplate stuff like `__init__`
    2. `attrib()` gives you an easy way to create attributes and defaults to `__init__`
    3. `give()` transfers forks/knives from one `Cutlery` to another
    4. `change()` is a utility for altering the inventory data in the object instance
    5. `kitchen` is the identifier for the kitchen inventory of cutlery, which bots draw from
    6. the script is executed when testing
    7. the number of tables is a CLI param, and we base the number of tasks for prep/clean on that
    8. `shutdown` task makes the bots stop, and `bot.join()` return
* If you run the above code once or twice you probably have all cutlery return to the kitchen. Eventually though you don't get it all back.
* The problem is worse when you add more bots or the restaurant is busier
* The errors are non-deterministic.
* Summary of the situation:
    * the code is simple and easy to read; the logic is fine
    * you have a working test with 100 tables that reproducibly passes
    * you have a longer test with 10000 tables that reproducibly fails
    * the longer test fails in different, nonreproducible ways
* That's typical of a race condition bug.
* The issue is in the `change` method, where the `+=` inline summation is implemented as several separate steps:
    1. Read the current value, `self.knives` into a temporary location
    2. Add the new value `knives` to the value in the temp location
    3. Copy the new total from the temp location back to the original location
* The problem is that any thread busy with those steps can be interrupted at any time, and a different thread can be given the opportunity to work through the same steps
* Suppose:
    * Bot A does step 1
    * The OS scheduler pauses A and switches to Bot B
    * B _also_ reads the current value of `self.knives`
    * Execution returns to Bot A
    * A increments its total and writes it back
    * B continues from where it was paused after step 1
    * B increments and writes back _its_ new total, erasing the change made by Bot A
* You can fix this by putting a lock around the modification of the shared state
* Imagine a `threading.Lock` added to the `Cutlery` class:

    ```Python
    def change(self, knives, forks):
        with self.lock:
            self.knives += knives
            self.forks += forks
    ```

* To do that, you have to know all places where state will be shared between threads
* Viable when you control all source code, but difficult with third party libraries involved

# Chapter 3: Asyncio Walk-Through

* `asyncio` is complex because it solves different problems for different groups of people
* Not much guidance on what group you belong to
* Two main audiences for async features in Python:
    * End-user developers - people who want to make applications using `asyncio` (probably you)
    * Framework developers - make frameworks and libs that end user devs can use
* The official docs are more suitable for framework devs than end user devs
* Author wants to give only the basic understanding of the building blocks of Asyncio so you can use it, but aren't overwhelmed by it.

## Quickstart

* Features of the API you probably need to care about:
    * Starting the `asyncio` event loop
    * Calling `async`/`await` functions
    * Creating a task to be run on the loop
    * Waiting for multiple tasks to complete
    * Closing the loop after all concurrent tasks have completed
* Hello world for asyncio:

    ```Python
    import asyncio, time

    async def main():
        print(f'{time.ctime()} Hello!')
        await asyncio.sleep(1.0)
        print(f'{time.ctime()} Goodbye!')

    asyncio.run(main())
    ```
