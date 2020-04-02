# Notes on High Performance Python, 2nd Edition

By Ian Ozsvald, Micha Gorelick; O'Reilly Media, Aug. 2020

ISBN 9781492055020

# Chapter 1: Understanding Performant Python

* High performance programming can be thought of as the act of minimizing the time cost of data movement and transforms by either:
    * Reducing the overhead (writing more efficient code), or
    * Changing the way we perform the small operations to make each one more meaningful (finding better algorithms)
* Focus on reducing the overhead in code to get more insight into hardware
* Python works to abstract the hardware interactions, but by understanding "both the best way that bits can be moved in the real hardware and the ways that Python's abstractions force your bits to move, you can make progress toward writing high performance programs in Python."

## The Fundamental Computer System

* Three basic parts to a computer: processor, memory, bus
* Each unit has different properties for understanding them:
    * processor - computations per second
    * memory - size, speed of IO
    * bus - speed of moving data around
* Can be used to talk about a standard machine at multiple levels
    * CPU, RAM, bus
    * CPU itself has memory units inside it: L1, L2, sometimes L3, L4 caches
    * CPU talks to L caches over the 'backside bus'
    * Network connection is essentially a very slow bus

### Computing Units

* Transforms bits into other bits, or changes the state of the current process
* CPUs are typical, GPUs are also useful for numerical applications and intrinsically parallel tasks
* All computing units do basic arithmetic on integers and real numbers, and bitwise operations on binary numbers, but some also do specialized ops like "fused multiply add" that takes numbers A,B,C and returns `A * B + C`
* Main properties of a computing unit are ops / cycle and cycles / second
* Ops/cycle measured in Instructions Per Cycle, IPC
* Cycles/second measured by clock speed
* Increasing clock speed speeds up all programs running on the unit, but a higher IPC can also change the level of 'vectorization' possible
* Vectorization - when a CPU is given multiple pieces of data at once and can operate on all of them at once. That's a SIMD instruction (Single Instruction, Multiple Data)
* Clock speeds and IPC have both been stalling because of physical limitations in manufacturing smaller transistors
* Workarounds to increase speed have been things like simultaneous multi-threading, out of order execution tricks, and multicore architectures.
* Hyperthreading presents a virtual second CPU to the host OS
* Out of order execution lets a compiler spot that some parts of a linear program sequence don't depend on the results of a previous piece of work, so both pieces of work could potentially occur in any order or at the same time.
* Multi-core architectures are the most important change for higher level programmers. They put multiple CPUs on the same unit, to increase total capability.
* Increases the potential number of operations per second, but can make coding more difficult.
* Adding more cores to a CPU doesn't always speed up program's execution time, due to Amdahl's Law: if a program designed to run on multiple cores has some subroutines that must run on one core, that's the limitation on max speed increase possible by allocating more cores.
* Major hurdle with multi-core in Python is the Global Interpreter Lock (GIL), which makes sure that a Python process can only run one instruction at a time, regardless of the number of cores it is using.
* There are standard library tools like `multiprocessing`, stuff like `numpy` or `numexpr`, Cython, or distributed computing models that help.
* 3.2 saw a major rewrite of the GIL, that made the system much more nimble. It still locks Python to one instruction at a time, but it does a better job at switching between instructions with lower overhead.

### Memory Units

* They store bits. Abstraction of 'memory unit' covers registers in the motherboard, RAM, HDD, etc.
* Major differences between types is speed of read/write
* IO speed is heavily dependent on how data is being read
* Most memory units perform better when reading one big chunk of data rather than many small chunks (sequential read vs random read)
* Memory units also have latency, which is the seek time to find data
* Types:
    * Spinning disk - long term, slow IO because of physical movement, degraded performance on random seek, but very large overall capacity.
    * Solid state hard drive - faster IO and seek, smaller overall capacity
    * RAM - fast read/write, performs random seek well, limited in capacity
    * L1/L2 cache - Extremely fast, data going to CPU must go through it, very very small capacity (Megabytes)
* So read/write speed and capacity are inversely proportional

### Communications Layers

* All of the comms channels are variants on a bus
* Frontside bus - connection between RAM and L1/L2 cache. Moves data ready to be transformed by the processor into the staging ground for calcuation, moves finished calculations out.
* External bus - main route from hardware devices like disks to CPU and system memory. Slower than frontside.
* Many of the drawbacks to using a GPU have to do with the bus it's connected on. Since it's peripheral, it uses the PCI bus, which is much slower than the frontside bus.
* Network is another communication block. Much more pliable--can be connected to a memory device like NAS, or another computing block. Overall much slower than other types of comms.
* Main bus property is its speed.

## Putting the Fundamental Elements Together

* Section explores some toy problems, showing how ideal solutions work, and how Python approaches them.
* This seems bleak--most of this section seems to say Python is natively incapable of dealing with performance issues. Untrue for two reasons:
    1. What native Python lacks in performance it makes up for in development speed
    1. Modules and philosophies can mitigate a lot of these problems pretty easily

### Idealized Computing Versus the Python Virtual Machine

Example code block for checking primality:

```Python
import math

def check_prime(number):
    sqrt_number = math.sqrt(number)
    for i in range(2, int(sqrt_number) + 1):
        if (number / i).is_integer():
            return False
    return True

print(f"check_prime(10000000) = {check_prime(10000000)}") # false
print(f"check_prime(10000019) = {check_prime(10000019)}") # true
```

* Going to analyze using abstract computation model, then draw comparisons to what happens when Python runs the code.
* Generally a good exercise to perform before solving a problem: Think about the general components of the algorithm and what would be the best way for the computing components to come together in order to find a solution.

### Idealized Computing

* On start, we have value of `number` stored in RAM
* To calculate `sqrt_number` and `number_float`, we need to send value of `number` to the CPU. Ideally we could send it once to get stored in L1/L2, CPU would do the calculating, send values back to RAM for storage.
* That minimizes number of reads from RAM, opting for faster reads from L1/L2
* Also minimizes data transfers through the frontside bus, using backside bus
* For the loop, rather than sending one value of `i` at a time to the CPU, we would like to send `number_float` and several values of `i` to check at once. That's possible because the CPU vectorizes ops with no additional time cost.
* For each of the `number_float`/`i` pairs, we divide them and check whether the result is a whole number. If yes, end function, if no, repeat.
* Consequently we only need to send back one value for many values of `i`
* CPU vectorization illustration:

    ```Python
    import math

    def check_prime(number):
        sqrt_number = math.sqrt(number)
        numbers = range(2, int(sqrt_number)+1)
        for i in range(0, len(numbers), 5):
            # following line is not valid Python
            result = (number / numbers[i:(i+5)]).is_integer()
            if any(result):
                return False
        return True
    ```

* Does five values of `i` per check. If the CPU is properly vectorized it can do that line in one step rather than separately calculating for each `i`
* Ideally the `any` check would also happen on the CPU without a transfer back to RAM.

### Python's Virtual Machine

* The Python interpreter does a lot to abstract away the underlying computer
* You don't have to worry about memory allocation, or what sequence things are sent to the CPU in.
* Speeds up development, has a big performance cost.
* At its core, Python runs a set of very optimized instructions--the trick is getting Python to do them in the right sequence to get better performance.
* For example, in the following `search_fast` runs faster than `search_slow` because it skips unnecessary computations. However, stuff gets hard to anticipate if you're dealing with derived types, special python methods, or third party modules.

    ```Python
    def search_fast(haystack, needle):
        for item in haystack:
            if item == needle:
                return True
        return False

    def search_slow(haystack, needle):
        return_value = False
        for item in haystack:
            if item == needle:
                return_value = True
        return return_value

    def search_unknown1(haystack, needle):
        return any((item == needle for item in haystack))

    def search_unknown2(haystack, needle):
        return any([item == needle for item in haystack])
    ```

* One impact of the abstraction is that vectorization isn't immediately achievable. External libs like `numpy` help since they add the ability to do vectorized math operations.
* Python's abstraction hurts any optimizations that rely on keeping the L1/L2 cache filled with relevant data for upcoming calculations. Comes from multiple factors, like:
    * Python objects aren't laid out optimally in memory, due to Python's GC--memory is automatically allocated and freed as necessary, which can create memory fragmentation that hurts transfers to the CPU caches.
    * You can't change the layout of a data structure directly in memory, so one transfer on the bus may not have all relevant info for a calculation even if it would fit.
* Second, more fundamental problem from dynamic types and Python being non-compiled. You lose the benefit of compiler optimizations, and since Python has dynamic types it's difficult to infer possible optimizations algorithmically (since code functionality can change at runtime).
* Lots of ways to mitigate that, foremost being Cython, that lets Python code be compiled, and lets the user send compiler hints
* Also the GIL can hurt if you're trying to parallelize code. You can mitigate by using multiple processes (via `multiprocessing`), or by using Cython or foreign functions

## So Why Use Python?

* It's highly expressive and easy to learn
* Many libs wrap tools in other languages to make it easy to call other systems, which means Python code using them can be comparably as fast as the C code underlying it.
* Has a ton of important stuff in the standard lib:
    * `unicode` and `bytes`
    * `array` - memory efficient arrays
    * `math` - basic math, some simple stats
    * `sqlite3`
    * `collections` - wide variety of objects
* Lots of good third party libs, like:
    * `numpy`
    * `scipy`
    * `pandas`
    * `scikit-learn`
    * `tornado`
    * Lots of db bindings
    * Web dev frameworks
    * `OpenCV`
    * API bindings for major services
* Big selection of managed environments and shells:
    * Standard distribution
    * `pipenv`, `pyenv`, `virtualenv`
    * Docker
    * Anaconda
    * Sage - matlab like env with an IDE
    * IPython - interactive Python shell
    * IPython notebook, browser based frontend to IPython

## How to be a Highly Performant Programmer

* Overall team velocity is far more important than speed-ups and complicated solutions.
* Key factors to that:
    * Good structure
    * Documentation
    * Debuggability
    * Shared standards
* General approach that works well:
    * Make it work - Build a good enough solution as a prototype.
    * Make it right - Add a strong test suite backed by documentation and reproducibility instructions so another team member can work on it.
    * Make it fast - Focus on profiling and compiling or parallelization, and using the existing test suite to confirm improvements didn't break it.

### Good Working Practices

* Must haves: documentation, good structure, testing
* Project level documentation helps you stick to a clean structure, and helps you and others in the future.
* Explain the purpose of the project, what's in the different folders, where the data comes from, which files are critical, and how to run it all including how to run tests.
* Use Docker to demonstrate a working version
* Add a `tests/` folder and some unit tests. Authors prefer `pytest` as a mondern test runner. Start with a few tests, build them up.
* Progress to using `coverage` to report test coverage
* If you're inheriting legacy code lacking tests, add some tests up front. Integration tests that check the overall flow of the project and confirm that with input data helps track modifications.
* Every time something in the code bites you, add a test.
* Add docstrings in your code for each function, class, and module.
* Aim to describe what's achieved by the function, and where possible include a short example of expected output.
* Docstrings in numpy and scikit-learn are good inspiration.
* If code becomes too long, get comfortable refactoring for readability. Shorter code is easier to test and support.
* Always use source control, use lots of small commits.
* Keep to PEP8, or use `black` on a pre-commit source control hook to rewrite code. Use `flake8` to lint code.
* Isolate your dev environment.
* Readability is more important than cleverness.

### Some Thoughs on Good Notebook Practice

* If you write long functions in notebooks, get comfortable extracting them to Python modules and adding tests.
* Consider prototyping in IPython or the QTConsole
* Liberally spread `assert` statements throughout a notebook to check that your functions are behaving as expected. This is a very basic level of validation, and should be subsequently supported by unit tests.
* Don't use `assert` statements to check data in code. Instead check expected data state and raise an Exception if it fails, like a `ValueError`
* The Bulwark library is a testing framework focused on Pandas for checking that data meets specified constraints.

### Getting the joy back into your work

* Life is complicated and affects work.
* Remember to keep looking for joy in new activities.
* Keep a log of things worth celebrating.

# Chapter 2: Profiling to find Bottlenecks

## Profiling Efficiently

* First aim is to test a representative system to identify what's slow / using too many resources
* Profiling adds an overhead--10x to 100x slowdowns are reasonable
* Extract a test case and isolate the piece of the system you need to test--preferably it's already in its own set of modules.
* Overview of the chapter:
    * First look at `%timeit` in IPython, `time.time()`, and a timing decorator, which lets you understand the behavior of statements and functions.
    * Then looks at `cProfile` to find which functions take longest to run, giving a high level view of the problem
    * Then `line_profiler`, which profiles chosen functions on a line by line basis
    * From there, you move on to using a compiler
    * Then learn how to use `perf stat` to understand the number of instructions ultimately executed on a CPU, and how efficiently the CPU's caches are utilized
    * After `line_profiler` you'll be interested in `dowser`, which lets you introspect live objects, and `py-spy` to look at live processes
    * For high RAM usage, looks at `memory_profiler`
    * Finally gives an intro to the Python bytecode in CPython
    * Looks at how to integrate unit tests while profiling to preserve correctness during optimizations
    * Finishes with discussion of profiling strategies
    * To walk through all those, need an easy to analyze function--going to use the Julia set, which is CPU-bound function that's a bit RAM-hungry, and exhibits non-linear behavior, so it has to be profiled at runtime.

## Introducing the Julia Set

* Fractal sequence that generates a complex output image
* Has a CPU-bound component and very explicit set of inputs, which lets us profile both CPU usage and RAM usage
* Implementation is deliberately suboptimal
* Will analyze a block of code that produces a false grayscale plot and a pure grayscale version, at the complex point `c=-0.62772-0.42193j`
* A Julia set is created by calculating each pixel in isolation, no shared data between points.
* If you choose a different `c` you get a different image. The chosen location has regions that are quick to calculate and regions that are slow, which is useful for our analysis.
* In the output image, coordinates that calculate quickly (fewer iterations of a loop that determines whether they escape towards infinity or are held by an attractor) are darkly colored, slower ones are colored white
* Defines a set of z-coordinates that we'll test. The function that we calculate squares the complex number `z` and adds `c`:

    ```
    f(z) = z**2 + c
    ```

* We iterate on that function while testing to see if the escape condition holds using `abs`. If the escape function is false, we break out of the loop and record the iterations for that coordinate. If it's never false, we drop after some `maxiter` value. The count becomes the pixel value.
* Psuedocode:

    ```
    for z in coordinates:
        for iteration in range(maxiter):    # iteration limit
            if abs(z) < 2.0:                # escape condition
                z = z*z + c
            else:
                break
        # store the iteration count for each z and draw later
    ```

## Calculating the Full Julia Set

```Python
"""Julia set generator without optional PIL-based image drawing."""
import time


# Area of complex space to investigate
x1, x2, y1, y2 = -1.8, 1.8, -1.8, 1.8
c_real, c_imag = -0.62772, -0.42193

def calc_pure_python(desired_width, max_iterations):
    """Create a list of complex coordinates (zs) and complex params (cs)."""
    x_step = (x2 - x1) / desired_width
    y_step = (y1 - y2) / desired_width
    x = []
    y = []

    ycoord = y2
    while ycoord > y1:
        y.append(ycoord)
        ycoord += y_step

    xcoord = x1
    while xcoord < x2:
        x.append(xcoord)
        xcoord += x_step

    # Build a list of coordinates and the initial condition for each cell.
    # Note that the initial condition is a constant and could be removed.
    # We use it to simulate a real-world scenario with several inputs.
    zs = []
    cs = []
    for ycoord in y:
        for xcoord in x:
            zs.append(complex(xcoord, ycoord))
            cs.append(complex(c_real, c_imag))

    print("Length of x:", len(x))
    print("Total elements:", len(zs))

    start_time = time.time()
    output = calculate_z_serial_purepython(max_iterations, zs, cs)
    end_time = time.time()
    secs = end_time - start_time
    print(calculate_z_serial_purepython.__name__ + " took", secs, "seconds")

    # This sum is expected for a 1000**2 grid with 300 iterations.
    # It ensures that our code evolves exactly as we'd intended.
    assert sum(output) == 33219980

def calculate_z_serial_purepython(maxiter, zs, cs):
    """Calculate output list using Julia update rule"""
    output = [0] * len(zs)
    for i in range(len(zs)):
        n = 0
        z = zs[i]
        c = cs[i]
        while abs(z) < 2 and n < maxiter:
            z = z * z + c
            n += 1
        output[i] = n
    return output

if __name__ == "__main__":
    # Calculate the Julia set using a pure Python solution with
    # reasonable defaults for a laptop.
    calc_pure_python(desired_width=1000, max_iterations=300)
```

## Simple Approaches to Timing--print and a Decorator

* You have to observe normal variation in your timings, or you may incorrectly attribute an improvement to a random variable in execution time.
* `print` statements are the simplest way to measure execution time inside a function. Useful for short investigations, quickly becomes unmanageable.
* Cleaner approach is to use a decorator
* Example of a timing decorator:

    ```Python
    from functools import wraps

    def timefn(fn):
        @wraps(fn)
        def measure_time(*args, **kwargs):
            t1 = time.time()
            result = fn(*args, **kwargs)
            t2 = time.time()
            print(f"@timefn: {fn.__name__} took {t2 - t1} seconds")
            return result
        return measure_time

    @timefn
    def calculate_z_serial_purepython(maxiter, zs, cs):
        ...
    ```

* You can also use the `timeit` module to get a coarse measurement of the execution speed of the CPU bound function.
* More typically you would use that when timing different types of simple expressions.
* Note that `timeit` temporarily disables the garbage collector.
* Running `timeit` from the command line:

    ```
    python -m timeit -n 5 -r 1 -s "import juliaset" "juliaset.calc_pure_python(desired_width=1000, max_iterations=300)"
    ```

* That specifies 5 tests (`-n 5`) and 1 repetition (`-r 1`)
* Results are averaged over the number of tests, and the best repetition time is given as the result.
* Within IPython / Jupyter, you can use

    ```
    import juliaset
    %timeit juliaset.calc_pure_python(desired_width=1000, max_iterations=300)
    ```

* Always remember that your machine is doing other stuff--watch system monitor to make sure there aren't really anomolous spikes during your execution.

## Simple Timing using the Unix time Command

* Gives real, user, and sys time for any command
* Executes as `/usr/bin/time -p python juliaset.py`
* Use `--verbose` to get even more output

## Using the cProfile Module

* Built in profiling tool in the standard library
* Hooks into the CPython virtual machine to measure time taken to run every function it sees.
* One of two profilers in stdlib, alongside `profile`, which is slower and pure python
* Good practice when profiling: generate a hypothesis about the speed of parts of your code before you profile it.
* Hypothesis: `calculate_z_serial_purepython` is the slowest part of the code. It does a lot of dereferencing and makes lots of calls to basic arithmetic operators and `abs`, which will probably show up as consumers of CPU resources.
* Using `cProfile` to run a variant of the code:

    ```
    % python -m cProfile -s cumulative juliaset/__init__.py
    Length of x: 1000
    Total elements: 1000000
    @timefn: calculate_z_serial_purepython took 12.329874992370605 seconds
    calculate_z_serial_purepython took 12.329946994781494 seconds
             36222017 function calls in 13.209 seconds

       Ordered by: cumulative time

       ncalls  tottime  percall  cumtime  percall filename:lineno(function)
            1    0.000    0.000   13.209   13.209 {built-in method builtins.exec}
            1    0.032    0.032   13.209   13.209 __init__.py:1(<module>)
            1    0.687    0.687   13.177   13.177 __init__.py:21(calc_pure_python)
            1    0.000    0.000   12.330   12.330 __init__.py:7(measure_time)
            1    9.793    9.793   12.330   12.330 __init__.py:61(calculate_z_serial_purepython)
     34219980    2.536    0.000    2.536    0.000 {built-in method builtins.abs}
      2002000    0.153    0.000    0.153    0.000 {method 'append' of 'list' objects}
            1    0.007    0.007    0.007    0.007 {built-in method builtins.sum}
            4    0.000    0.000    0.000    0.000 {built-in method builtins.print}
            1    0.000    0.000    0.000    0.000 __init__.py:6(timefn)
            1    0.000    0.000    0.000    0.000 functools.py:37(update_wrapper)
            1    0.000    0.000    0.000    0.000 <frozen importlib._bootstrap>:1009(_handle_fromlist)
            4    0.000    0.000    0.000    0.000 {built-in method builtins.len}
            7    0.000    0.000    0.000    0.000 {built-in method builtins.getattr}
            1    0.000    0.000    0.000    0.000 {built-in method builtins.hasattr}
            1    0.000    0.000    0.000    0.000 functools.py:67(wraps)
            1    0.000    0.000    0.000    0.000 {method 'update' of 'dict' objects}
            5    0.000    0.000    0.000    0.000 {built-in method builtins.setattr}
            4    0.000    0.000    0.000    0.000 {built-in method time.time}
            1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
    ```

* `-s cumulative` tells it to sort by cumulative time spent in each function
* Output shows where majority of execution time was spent. Note that we went from ~8 seconds to ~12 seconds--adds a 50% overhead to profile this way.
* In this output, note that 9.793 seconds were spent in the one call to `calculate_z_serial_purepython`
* That function made ~34M calls to `abs`, taking 2.536 seconds
* The function is nondeterministic in the number of calls it will make to `abs`, but based on the function definition it will be between a minimum of 1,000,000 (1,000^2) and 300,000,000, so ~34M is about 10% of the worst case.
* There were also 2,002,000 calls to `list.append`, which is the list constructions occurring in `calc_pure_python`
* Note that the output is not ordered by parent function--it is very hard to tell what is happening line by line with `cProfile`, because it only gives you profile info for the function calls themselves, not the lines in the functions.
* To get a bit more control over results, you can write a stats outfile:

    ```
    % python -m cProfile -o profile.stats juliaset/__init__.py
    ```

* You can load that into Python and look at it:

    ```
    >>> import pstats
    >>> p = pstats.Stats("profile.stats")
    >>> p.sort_stats("cumulative")
    <pstats.Stats object at 0x104776320>
    >>> p.print_stats()
    Fri Feb  7 10:47:22 2020    profile.stats

             36222017 function calls in 13.200 seconds

       Ordered by: cumulative time

       ncalls  tottime  percall  cumtime  percall filename:lineno(function)
            1    0.000    0.000   13.200   13.200 {built-in method builtins.exec}
            ...
    ```

* You can print caller information into the output with `p.print_callers()`
* In that you can see that `calculate_z_serial_purepython` is the most expensive function, and it is called from one parent. If it was called from multiple places that would be useful to know in tracing the most expensive parents.
* You can also use `p.print_callees()` to show which functions call other functions
* The module is overall pretty verbose, but it's a convenient built in for quickly identifying bottlenecks.

## Visualizing cProfile Output with SnakeViz

* `snakeviz` is a visualizer that draws the output of `cProfile` as a diagram
* Larger boxes are areas of code that take longer to run.
* Use it to get a high level understanding of a stats file
* `snakeviz profile.stats` starts a webserver on 8080
* Worth using to communicate output to others who aren't as comfortable reading CLI output tables

## Using line_profiler for Line by Line Measurements

* `line_profiler` is one of the strongest tools for identifying the cause of CPU-bound problems in Python code
* Profiles individual functions on a line by line basis, so start with `cProfile` to guide you to which functions to profile with `line_profiler`
* It's worth it to print and annotate versions of the output as you modify code, so you have a record of the effects of your changes.
* Install with `pip install line_profiler`
* You use the `@profile` decorator to mark a function for profiling
* `kernprof` is used to execute the code, and the CPU time and other stats for the chosen function are recorded.
* Note that having to modify source code by adding a decorator may break unit tests unless you make a dummy decorator.
* Args are `-l` for line-by-line profiling and `-v` for verbose output
* Sample run with `@profile` decorator on `calculate_z_serial_purepython`

    ```
    % kernprof -l -v julia1_lineprofiler.py
    Length of x: 1000
    Total elements: 1000000
    @timefn: calculate_z_serial_purepython took 105.98484492301941 seconds
    calculate_z_serial_purepython took 105.9848997592926 seconds
    Wrote profile results to julia1_lineprofiler.py.lprof
    Timer unit: 1e-06 s

    Total time: 60.6457 s
    File: julia1_lineprofiler.py
    Function: calculate_z_serial_purepython at line 61

    Line #      Hits         Time  Per Hit   % Time  Line Contents
    ==============================================================
        61                                           @timefn
        62                                           @profile
        63                                           def calculate_z_serial_purepython(maxiter, zs, cs):
        64                                               """Calculate output list using Julia update rule"""
        65         1       4172.0   4172.0      0.0      output = [0] * len(zs)
        66   1000001     476450.0      0.5      0.8      for i in range(len(zs)):
        67   1000000     450537.0      0.5      0.7          n = 0
        68   1000000     529487.0      0.5      0.9          z = zs[i]
        69   1000000     502661.0      0.5      0.8          c = cs[i]
        70  34219980   22851294.0      0.7     37.7          while abs(z) < 2 and n < maxiter:
        71  33219980   18616067.0      0.6     30.7              z = z * z + c
        72  33219980   16706594.0      0.5     27.5              n += 1
        73   1000000     508484.0      0.5      0.8          output[i] = n
        74         1          1.0      1.0      0.0      return output
    ```

* Using `kernprof` adds a lot of overhead--took 105 seconds in that run
* The `% Time` column is most helpful--37.7% of the time is in `while` tests
* Unclear whether `abs(z) < 2` is more expensive than `n < maxiter`
* Update to `z` is also fairly expensive (as is `n += 1`
* Python is doing dynamic lookups in every loop, even though you're using the same types for each variable in each loop. Compilation and type specialization would help here.
* Creation of the `output` list is comparatively cheap
* Think about what happens in the `n += 1` operation:
    * Python has to check that `n` has `__add__`--if it doesn't, has to walk the class hierarchy to see if anything provides it
    * Passes the other object (`1`) to `__add__` so it can decide how to handle it since it might be a float or other object
* Best way to further analyze the `while` statement is to break it up. This increases the runtime of the function, but might help us understand the costs incurred in this part of the code.
* Output of a run with that broken down:

    ```
    % kernprof -l -v julia1_lineprofiler2.py
    Length of x: 1000
    Total elements: 1000000
    @timefn: calculate_z_serial_purepython took 160.1820981502533 seconds
    calculate_z_serial_purepython took 160.18215417861938 seconds
    Wrote profile results to julia1_lineprofiler2.py.lprof
    Timer unit: 1e-06 s

    Total time: 87.625 s
    File: julia1_lineprofiler2.py
    Function: calculate_z_serial_purepython at line 61

    Line #      Hits         Time  Per Hit   % Time  Line Contents
    ==============================================================
        61                                           @timefn
        62                                           @profile
        63                                           def calculate_z_serial_purepython(maxiter, zs, cs):
        64                                               """Calculate output list using Julia update rule"""
        65         1       3546.0   3546.0      0.0      output = [0] * len(zs)
        66   1000001     451919.0      0.5      0.5      for i in range(len(zs)):
        67   1000000     425641.0      0.4      0.5          n = 0
        68   1000000     505102.0      0.5      0.6          z = zs[i]
        69   1000000     470898.0      0.5      0.5          c = cs[i]
        70   1000000     428652.0      0.4      0.5          while True:
        71  34219980   19563969.0      0.6     22.3              not_yet_escaped = abs(z) < 2
        72  34219980   16173563.0      0.5     18.5              iterations_left = n < maxiter
        73  34219980   15310435.0      0.4     17.5              if not_yet_escaped and iterations_left:
        74  33219980   17743955.0      0.5     20.2                  z = z * z + c
        75  33219980   15615856.0      0.5     17.8                  n += 1
        76                                                       else:
        77   1000000     443524.0      0.4      0.5                  break
        78   1000000     487975.0      0.5      0.6          output[i] = n
        79         1          1.0      1.0      0.0      return output
    ```

* Adding additional statements that have to get executed 34M times in the loop slows everything down. I'm not sure what they're trying to say this shows you, the text is confusing.
* Makes sense to use `timeit` in IPython to test the cost of individual expressions. Maybe they were saying that line by line profiling doesn't give you a good view of the cost of those expressions as isolated units?

    ```
    % ipython
    Python 3.7.3 (v3.7.3:ef4ec6ed12, Mar 25 2019, 16:52:21)
    Type 'copyright', 'credits' or 'license' for more information
    IPython 7.12.0 -- An enhanced Interactive Python. Type '?' for help.

    In [1]: z = 0+0j

    In [2]: %timeit abs(z) < 2
    122 ns ± 0.576 ns per loop (mean ± std. dev. of 7 runs, 10000000 loops each)

    In [3]: n = 1

    In [4]: maxiter = 300

    In [5]: %timeit n < maxiter
    59.4 ns ± 0.492 ns per loop (mean ± std. dev. of 7 runs, 10000000 loops each)
    ```

* Looks like `abs(z) < 2` takes about twice as much time as `n < maxiter`
* Because Python's testing is LTR and opportunistic, makes sense to put the cheaper operation on the left.
* Switching to `while m < maxiter and abs(z) < 2` gives a noticeable improvement, though the time percentages stay roughly stable:

    ```
    % kernprof -l -v julia1_lineprofiler3.py
    Length of x: 1000
    Total elements: 1000000
    @timefn: calculate_z_serial_purepython took 91.97695899009705 seconds
    calculate_z_serial_purepython took 91.97701907157898 seconds
    Wrote profile results to julia1_lineprofiler3.py.lprof
    Timer unit: 1e-06 s

    Total time: 52.8043 s
    File: julia1_lineprofiler3.py
    Function: calculate_z_serial_purepython at line 61

    Line #      Hits         Time  Per Hit   % Time  Line Contents
    ==============================================================
        61                                           @timefn
        62                                           @profile
        63                                           def calculate_z_serial_purepython(maxiter, zs, cs):
        64                                               """Calculate output list using Julia update rule"""
        65         1       3452.0   3452.0      0.0      output = [0] * len(zs)
        66   1000001     417164.0      0.4      0.8      for i in range(len(zs)):
        67   1000000     393301.0      0.4      0.7          n = 0
        68   1000000     457767.0      0.5      0.9          z = zs[i]
        69   1000000     431290.0      0.4      0.8          c = cs[i]
        70  34219980   19730376.0      0.6     37.4          while n < maxiter and abs(z) < 2:
        71  33219980   16285706.0      0.5     30.8              z = z * z + c
        72  33219980   14644961.0      0.4     27.7              n += 1
        73   1000000     440255.0      0.4      0.8          output[i] = n
        74         1          0.0      0.0      0.0      return output
    ```

* Improvement is relatively minor--swapping to CPython or PyPy may give better results
* Confidence in results comes from:
    * Stated a testable hypothesis
    * Changed code so that only the hypothesis would be tested
    * Gathered enough evidence to support our conclusion

## Using memory_profiler to Diagnose Memory Usage

* `memory_profiler` measures memory usage on a line by line basis
* Understanding your memory usage lets you ask two questions:
    * Could we use less RAM by rewriting the function more efficiently?
    * Could we use more RAM and save CPU cycles by caching?
* Operates similarly to `line_profiler` but much more slowly.
* May be 10x to 100x slower.
* Install with `pip install memory_profiler`, and optionally `pip install psutil`
* Probably good to use quick and reasonable iterations to diagnose problems and come up with hypotheses, you may have to use overnight runs for validation.
* Also uses a `@profile` decorator
* Memory allocation is not as clear cut as CPU usage
    * Generally more efficient to overallocate memory to a process into a local pool that can be used at leisure, since the actual allocation operations are relatively expensive.
    * GC is not instant, so objects may be unavailable but still in the GC pool for some time.
* Outcome is that it's hard to understand what's happening with memory usage/release inside a Python program, since a line of code may not allocate a deterministic amount of memory as observed from outside the process.
* More useful to observe a gross trend over a set of lines.
* Output of a scaled down version (100 wide, 30 maxiter):

    ```
    % python -m memory_profiler julia1_memoryprofiler.py 
    Length of x: 100
    Total elements: 10000
    @timefn: calculate_z_serial_purepython took 7.803012132644653 seconds
    calculate_z_serial_purepython took 7.803066968917847 seconds
    Filename: julia1_memoryprofiler.py

    Line #    Mem usage    Increment   Line Contents
    ================================================
        61   36.363 MiB   36.363 MiB   @timefn
        62                             @profile
        63                             def calculate_z_serial_purepython(maxiter, zs, cs):
        64                                 """Calculate output list using Julia update rule"""
        65   36.445 MiB    0.082 MiB       output = [0] * len(zs)
        66   36.453 MiB    0.000 MiB       for i in range(len(zs)):
        67   36.453 MiB    0.000 MiB           n = 0
        68   36.453 MiB    0.000 MiB           z = zs[i]
        69   36.453 MiB    0.000 MiB           c = cs[i]
        70   36.453 MiB    0.004 MiB           while abs(z) < 2 and n < maxiter:
        71   36.453 MiB    0.000 MiB               z = z * z + c
        72   36.453 MiB    0.000 MiB               n += 1
        73   36.453 MiB    0.004 MiB           output[i] = n
        74   36.453 MiB    0.000 MiB       return output
    ```

* Takes 0.082 MiB to allocate the `output` list
* Memory profile of the parent function:

    ```
    % vim julia1_memoryprofiler.py 
    (juliaset) nick@slagathor juliaset % python -m memory_profiler julia1_memoryprofiler.py
    Length of x: 100
    Total elements: 10000
    @timefn: calculate_z_serial_purepython took 0.21825504302978516 seconds
    calculate_z_serial_purepython took 0.21860575675964355 seconds
    Filename: julia1_memoryprofiler.py

    Line #    Mem usage    Increment   Line Contents
    ================================================
        21   35.348 MiB   35.348 MiB   @profile
        22                             def calc_pure_python(desired_width, max_iterations):
        23                                 """Create a list of complex coordinates (zs) and complex params (cs)."""
        24   35.348 MiB    0.000 MiB       x_step = (x2 - x1) / desired_width
        25   35.348 MiB    0.000 MiB       y_step = (y1 - y2) / desired_width
        26   35.348 MiB    0.000 MiB       x = []
        27   35.348 MiB    0.000 MiB       y = []
        28                             
        29   35.348 MiB    0.000 MiB       ycoord = y2
        30   35.348 MiB    0.000 MiB       while ycoord > y1:
        31   35.348 MiB    0.000 MiB           y.append(ycoord)
        32   35.348 MiB    0.000 MiB           ycoord += y_step
        33                             
        34   35.348 MiB    0.000 MiB       xcoord = x1
        35   35.352 MiB    0.000 MiB       while xcoord < x2:
        36   35.352 MiB    0.004 MiB           x.append(xcoord)
        37   35.352 MiB    0.000 MiB           xcoord += x_step
        38                             
        39                                 # Build a list of coordinates and the initial condition for each cell.
        40                                 # Note that the initial condition is a constant and could be removed.
        41                                 # We use it to simulate a real-world scenario with several inputs.
        42   35.352 MiB    0.000 MiB       zs = []
        43   35.352 MiB    0.000 MiB       cs = []
        44   36.367 MiB    0.000 MiB       for ycoord in y:
        45   36.367 MiB    0.000 MiB           for xcoord in x:
        46   36.367 MiB    0.074 MiB               zs.append(complex(xcoord, ycoord))
        47   36.367 MiB    0.074 MiB               cs.append(complex(c_real, c_imag))
        48                             
        49   36.371 MiB    0.004 MiB       print("Length of x:", len(x))
        50   36.371 MiB    0.000 MiB       print("Total elements:", len(zs))
        51                             
        52   36.371 MiB    0.000 MiB       start_time = time.time()
        53   36.461 MiB    0.090 MiB       output = calculate_z_serial_purepython(max_iterations, zs, cs)
        54   36.461 MiB    0.000 MiB       end_time = time.time()
        55   36.461 MiB    0.000 MiB       secs = end_time - start_time
        56   36.461 MiB    0.000 MiB       print(calculate_z_serial_purepython.__name__ + " took", secs, "seconds")
    ```

* Note that building `zs` and `cs` takes 0.074 MiB each
* You can also visualize change in memory by plotting a sample over time
* `memory_profiler` has a utility `mprof`, used once to sample and again to visualize
* Samples by time and not line, so barely impacts overall runtime
* You have to have `matplotlib` installed to use the plotter
* To create a plot

    ```
    mprof run julia1_memoryprofiler.py
    mprof plot
    ```

* In addition to looking at behavior of functions, we can add labels with a context manager
* Example:

    ```Python
    @profile
    def calculate_z_serial_purepython(maxiter, zs, cs):
        """Calculate output list using Julia update rule"""
        with profile.timestamp("create_output_list")
            output = [0] * len(zs)
        time.sleep(1)
        with profile.timestamp("calculate_output"):
            for i in range(len(zs)):
                n = 0
                z = zs[i]
                c = cs[i]
                while n < maxiter and abs(z) < 2:
                    z = z * z + c
                    n += 1
                output[i] = n
            return output
    ```

* That adds some bracketed labeling to the output plot
* Question: what happens if you simplify the code 

TODO: Finish chapter 2

# Chapter 3: Lists and Tuples

* Questions you should be able to answer after this chapter:
    * What are lists and tuples good for?
    * What is the complexity of a lookup in a list/tuple?
    * How is that complexity achieved?
    * What are the differences between lists and tuples?
    * How does appending to a list work?
    * When should I use lists and tuples?
* "One of the most important things in writing efficient programs is understanding the guarantees of the data structures you use. In fact, a large part of performant programming is understanding what questions you are trying to ask of your data and picking a data structure that can answer those questions."
* Lists and tuples are array data structures
* An array is a flat list of data with some intrinsic ordering
* The ordering is as important as the items
* The ordering also lets you perform retrieval of a specific item in O(1)
* There are lots of ways to implement arrays, each with different features/guarantees
* In python we have
    * Lists - dynamic arrays that let you modify and resize the data
    * Tuples - static arrays whose contents are fixed and immutable
* System memory can be thought of as a series of numbered buckets that can each hold a number.
* Python stores data in those buckets by reference, so the number itself just points to the data we actually care about.
* Consequently, the buckets can store any kind of data we want
* To create an array we have to allocate a block of system memory, where every section of the block will be used as an integer-sized pointer to actual data.
* To do that, you go to the system kernel and request the use of N consecutive buckets
* Python lists store their size, so to store n items you need n+1 buckets
* What if you get an array with an unknown order and you want a particular element? You have to do a search operation.
* Simplest approach is linear search, iterating over each item and checking it
* Linear search has worst-case of O(n), which occurs when you search for something that isn't in the array.
* This is the algorithm that `list.index()` uses.
* Only way to increase speed is via some other understanding of how the data is placed in memory, or the arrangement of the memory buckets.
* Hash tables solve this in O(1) by adding extra overhead to insert/retrieve and enforcing a strict sorting.
* If your data is stored in a way where each item is bigger/smaller than its left/right neighbor, you can get lookup down to O(log n)

## A More Efficient Search
