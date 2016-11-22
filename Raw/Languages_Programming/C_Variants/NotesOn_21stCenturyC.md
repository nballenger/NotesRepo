# Notes on 21st Century C, 2nd Ed

By Ben Klemens; O'Reilly Media 2014; ISBN 9781491903896

## Chapter 1: Set yourself up for easy compilation

* Use a package manager, and install:
    * <code>gcc</code> and/or <code>clang</code>
    * GDB debugger
    * Valgrind for memory usage errors
    * <code>gprof</code> profiler
    * <code>make</code>
    * <code>pkg-config</code> for finding libraries
    * Doxygen for doc generation
    * text editor
    * Autotools: Autoconf, Automake, libtool
    * git
    * C libs:
        * libcURL
        * libGLib
        * libGSL
        * libSQLite3
        * libXML2
* Start with the compiler command line, to end with three ish steps:
    1. Set a variable listing the compiler flags
    1. Set a variable listing libs to link to - sometimes one, sometimes two vars
    1. Set up a system to use those variables to orchestrate compilation

Example program that does a bit of math:

<pre>
#include <math.h>       // gives erf, sqrt
#include <stdio.h>      // gives print

int main() {
    printf("The integral of a Normal(0,1) distribution "
           "between -1.96 and 1.96 is: %g\n", erf(1.96*sqrt(1/2.)));
}
</pre>

Things about the above program:

* The include lines put in the declarations for math and stdio, which allow the compiler to determine whether the usage is correct.
* The compiler then produces an object file with a note saying "here, go find the erf function, and replace this note with its return value"
* The linker then reconciles the note by actually finding the erf function
* To use the math functions you have to tell the linker about it with a <code>-lm</code> flag
* The full call to the compiler: <code>gcc myfile.c -o myfile -lm -g -Wall -O3 -std=gnull</code>
* Those flags:
    * <code>-g</code> - adds symbols for debugging, allowing the debugger to give variable or function names
    * <code>-std=gnull</code> - specific to <code>clang</code> and <code>gcc</code>, should allow code conforming to C11 and POSIX standards. <code>clang</code> defaults to C99, and <code>gcc</code> defaults to C89. POSIX requires that <code>c99</code> be present.
    * <code>-O3</code> - optimization level three, attempts to build faster code. If during debugging there are too many things optimized away to understand, switch to <code>-O0</code>. 
    * <code>-Wall</code> - adds compiler warnings.

### Paths

* Typically there are at least three locations where library files may be installed
    * OS vendor defined standard directory
    * Local sysadmin defined standard directory for packages not to be overwritten on OS upgrade
    * User home directories
* If libraries are elsewhere, you have to tell the compiler where to look for them
* To add a path to the include search path, use the <code>-I /path/to/directory</code> flag
* To add to the library search path, use <code>-L</code>
* Order matters--for mycode.o that depends on libbroad that depends on libgeneral, you would need <code>gcc mycode.o -lbroad -lgeneral</code>
* Linker looks at the first item, notes unresolved names, then goes to next item, searches for missing items while adding more unresolved names, then looks in the last place for the unresolved names. If there are unresolved names at the end of the chain, there's a problem.
* The <code>pkg-config</code> tool helps search for packages by maintaining a repo of flags and locations that packages self-report as being necessary for compilation. 

### Using Makefiles

* Basically an organized set of variables and sequences of one line shell scripts
* Smallest practicable makefile:

<pre>
P=program_name
OBJECTS=
CFLAGS = -g -Wall -O3
LDLIBS=
CC=c99

$(P): $(OBJECTS)
</pre>

* Several ways to tell make about a variable:
    * Set the variable from the shell before calling make, and export the variable so it is visible to child processes
    * If you did <code>export P=program_name</code> from the command line instead of in the makefile, it'd be a session var
    * Put the exports into a startup script, like .bashrc
    * Export for a single command by prepending it
    * make lets you set variables on the command line, as in <code>make CFLAGS="-g -Wall"</code>
    * Child programs called by make WILL know new env vars, but WILL NOT know makefile variables
* In C code, get environmnet vars with <code>getenv</code>
* Example:

<pre>
#include <stdlib.h> // getenv, atoi
#include <stdio.h> // printf

int main() {
    char *repstext = getenv("reps");
    int reps = repstext ? atoi(repstext) : 10;

    char *msg = getenv("msg");
    if (!msg) msg = "Hello.";

    for (int i=0; i<reps; i++)
        printf("%s\n", msg);
}
</pre>

* Make also has some built in variables:
    * <code>$@</code> - full target filename (file to be built as with a .o file compiled from a .c file)
    * <code>$*</code> - target file with the suffix cut off
    * <code>$<</code> - name of the file that caused this target to get triggered and made

#### Rules for makefile execution

* Segments of the makefile have the form: <code><i>target: dependencies<br>&nbsp;&nbsp;&nbsp;&nbsp;script</i></code>
* If the target is called via <code>make <i>target</i></code>, then the dependencies are checked. 
* Remember that all whitespace at the head of lines in a makefile MUST be tabs, not spaces
* Example where <code>all</code> calls three targets in sequence as dependencies:

<pre>
all: html doc publish

doc:
    pdflatex $(f).tex

html:
    latex -interaction batchmode $(f)
    latex2html $(f).tex

publish:
    scp $(f).pdf $(Blogserver)
</pre>

* In the above, <code>f</code> is set from the command line as an env var
* POXIS standard make's recipe for compiling to a .o object from a .c file: <code>$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $*.c</code>
* GNU make's default recipe: <code>$(CC) $(LDFLAGS) first.o second.o $(LDLIBS)</code>
* To see the default rules for your version of make, do <code>make -p > default_rules</code>
* Basic idea is to find the right variables and set them in your makefile. Basically find the right ones for your system and hardcode them into a makefile so you don't have to look the up anymore.
* <code>CFLAGS</code> and <code>LDLIBS</code> vars are where all the compiler flags for identifying libraries go--put any backticked calls to <code>pkg-config</code> here
* After adding a lib and its locations to those, there's rarely any reason to change it

#### Using libraries from source

* Example package is GNU scientific library, GSL
* It's packaged via Autotools, which prep a lib for use on any machine
* To get the GSL source and set it up:

<pre>
wget ftp://ftp.gnu.org/gnu/gsl-1.16.tar.gz
tar xvzf gsl-*gz
cd gsl-1.16
./configure
make
sudo make install
</pre>

* Program for using some GSL functions, try to link and run:

<pre>
#include <gsl/gsl_cdf.h>
#include <stdio.h>

int main() {
    double bottom_tail = gsl_cdf_gaussian_P(-1.96, 1);
    printf("Area between [-1.96, 1.96]: %g\n", 1-2*bottom_tail);
}
</pre>

* Probable env var: <code>LDLIBS=`pkg-config --libs gsl`</code>
* If it didn't install to a standard location and pkg-config isn't there, you need to add paths to heads of CFLAGS and LDLIBS, like <code>CFLAGS=-I/usr/local/include LDLIBS=-L/usr/local/lib -WL,-R/usr/local/lib</code>

#### Using libs from source even if your sysadmin doesn't want you to

<pre>
mkdir ~/root
PATH=~/root/bin:$PATH
LDLIBS=-L$(HOME)/root/lib -lgsl -lm
CFLAGS=-I$(HOME)/root/include -g -Wall -O3

# Get some source

./configure --prefix=$(HOME)/root && make && make install
</pre>

#### Compiling C programs via Here Document

* Basic compilation pattern:
    1. Set a variable expressing compiler flags
    1. Set a variable expressing linker flags, including a -l flag for every lib you use
    1. Use <code>make</code> to convert the vars into full compile and link commands
* Rest of this uses only the shell to do all that
* Steps:
    1. Include header files from command line: <code>gcc -include stdio.h</code>
    1. Write code as a one line file: <code></code>


## Chapter 2: Debug, Test, Document

* Debugging in C means both checking logic with GDB and checking memory management with Valgrind
* Docs in this chapter are via both Doxygen and CWEB

### Using a Debugger

* You need to have human readable symbols compiled into the program, which happens with <code>-g</code>
* May also be easier to debug by turning optimization off with <code>-O0</code>
* Chapter covers both GDB and LLVM
* For gdb you can define some macros in <code>.gdbinit</code>
* Stack of frames:
    * Execution begins with the <code>main</code> function
    * The computer generates a "frame" into which info about the function is placed, like inputs and variables
    * If during execution <code>main</code> calls another function <code>get_something</code>, the execution of main halts and a new frame is generated for get_something, holding its inputs, vars, etc.
    * If <code>get_something</code> then calls <code>do_a_thing</code>, another frame is created
    * As the nested functions return their frames are popped off the stack
    * "Where am I" in a debug session is both code line number and the frame stack trace

#### Debugging Detective Story

* There is a program in the samples called <code>stddev_bugged.c</code>
* It has a bug inserted
* To use it, compile with <code>-g</code>, then start the debugger with either
    * <code>gdb stddev_bugged</code>
    * <code>lldb stddev_bugged</code>
* That opens the debugger prompt

#### Common Debugger Commands

<table>
<thead>
<tr><th>Group</th><th>Command</th><th>Meaning</th></tr>
</thead>
<tbody>
<tr>
    <td>Go</td>
    <td><code>run</code></td>
    <td>Run program from the start</td>
</tr>
<tr>
    <td>Go</td>
    <td><code>run <i>args</i></code></td>
    <td>Run program from the start with given CLI args</td>
</tr>
<tr>
    <td>Stop</td>
    <td><code>b <i>get_rss</i></code></td>
    <td>Pause at a certain function</td>
</tr>
<tr>
    <td>Stop</td>
    <td><code>b <i>program_name.c:105</i></code></td>
    <td>Pause just before a specific line</td>
</tr>
<tr>
    <td>Stop</td>
    <td><code>break <i>105</i></code></td>
    <td>Same as <code>b <i>program_name.c:105</i></code> if you are already stopped in the program</td>
</tr>
<tr>
    <td>Stop</td>
    <td><code>info break</code> (GDB) / <code>break list</code> (LLDB)</td>
    <td>List breakpoints</td>
</tr>
<tr>
    <td>Stop</td>
    <td><code>watch <i>curl</i></code> (GDB) / <code>watch set var <i>curl</i></code> (LLDB)</td>
    <td>Break if the value of the given var changes</td>
</tr>
<tr>
    <td>Stop</td>
    <td>
        <code>dis <i>3</i></code> /
        <code>ena <i>3</i></code> /
        <code>del <i>3</i></code> (GDB)
    </td>
    <td>Disable / reenable / delete breakpoint 3</td>
</tr>
<tr>
    <td>Stop</td>
    <td>
        <code>break dis <i>3</i></code> /
        <code>break ena <i>3</i></code> /
        <code>break del <i>3</i></code> (LLDB)
    </td>
    <td>Disable / reenable / delete breakpoint 3</td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>p <i>url</i></code></td>
    <td>Print value of variable / expression / function call</td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>p <i>*an_array@10</i></code> (GDB)</td>
    <td>Print first 10 elements. Next 10 are <code>p <i>*(an_array+10)@10</i></code></td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>mem read -t<i>double</i> -c<i>10</i> <i>an_array</i></code></td>
    <td>Read a count of 10 items of type double from an_array. Next 10 are <code>mem read -t<i>double</i> -c<i>10</i> <i>an_array+10</i></code></td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>info args</code> / <code>info vars</code> (GDB)</td>
    <td>Get values of all args to the function or all local vars</td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>frame var</code> (LLDB)</td>
    <td>Get values of all args to the function and all local vars</td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>disp <i>url</i></code></td>
    <td>Display value of <i>url</i> every time program stops</td>
</tr>
<tr>
    <td>Inspect vars</td>
    <td><code>undisp <i>3</i></code></td>
    <td>Stop the display of item 3</td>
</tr>
<tr>
    <td>Threads</td>
    <td><code>info thread</code> (GDB) or <code>thread list</code> (LLDB)</td>
    <td>List active threads</td>
</tr>
<tr>
    <td>Threads</td>
    <td><code>thread <i>2</i></code> (GDB) or <code>thread select <i>2</i></code> (LLDB)</td>
    <td>Switch focus to thread 2</td>
</tr>
<tr>
    <td>Frames</td>
    <td><code>bt</code></td>
    <td>List the stack of frames</td>
</tr>
<tr>
    <td>Frames</td>
    <td><code>f <i>3</i></code></td>
    <td>Look at frame 3</td>
</tr>
<tr>
    <td>Frames</td>
    <td><code>up</code> / <code>down</code></td>
    <td>Go numerically up or down 1 in stack of frames</td>
</tr>
<tr>
    <td>Step</td>
    <td><code>s</code></td>
    <td>Step one line, even if that means entering another function</td>
</tr>
<tr>
    <td>Step</td>
    <td><code>n</code></td>
    <td>Next line, but do not enter subfunctions, possibly back up to head of loop</td>
</tr>
<tr>
    <td>Step</td>
    <Td><code>u</code></td>
    <td>Until next line forward from current line (let a loop run through until forward progress)</td>
</tr>
<tr>
    <td>Step</td>
    <Td><code>c</code></td>
    <td>Continue until next breakpoint or end of program</td>
</tr>
<tr>
    <td>Step</td>
    <td><code>ret</code> or <code>ret <i>3</i></code> (GDB)</td>
    <td>Return from current function immediately with the given return value if any</td>
</tr>
<tr>
    <td>Step</td>
    <td><code>j <i>105</i></code></td>
    <td>Jump to a specific line</td>
</tr>
<tr>
    <td>Look at code</td>
    <td><code>l</code></td>
    <td><code>list</code> prints the 10 lines around the line you are currently on</td>
</tr>
<tr>
    <td>Repeat</td>
    <td><code>[Enter]</code></td>
    <td>Repeats last command</td>
</tr>
<tr>
    <td>Compile</td>
    <td><code>make</code> (GDB)</td>
    <td>Run make without existing GDB. Can also specify a target like <code>make <i>myprogram</i></code></td>
</tr>
<tr>
    <td>Get help</td>
    <td><code>help</code></td>
    <td>Explore other debugger functionality</td>
</tr>
</tbody>
</table>

#### GDB Variables

For the program:

<pre>
int main() {
    int x[20] = {};
    x[0] = 3;
}
</pre>

You could inspect an element within a hierarchy like the following. In GDB:

<pre>
(gdb) set $vd = my_model->dataset->vector->data
(gdb) p *$vd@10
</pre>

Or in LLDB:

<pre>
(lldb) p double *$vd = my_model->dataset->vector->data
(lldb) mem read -tdouble -c10 $vd
</pre>

* A dollar sign starts a debugger var. Use <code>set</code> on variable's first use.
* Note that these are real variables, which can be modified
* GDB uses a single dollar sign to alias the last output--if you get a hex address instead of data, then print <code>*$</code> to get the value at that address.
* You can define GDB functions to do processing for things like pretty printing structs
* You could put the following into your .gdbinit file, which would print an XML tree

<pre>
define pxml
    p xmlElemDump(stdout, $arg0, xmlDocGetRootElement($arg0))
end
document pxml
Print the tree of an already opened XML document (i.e., an xmlDocPtr) to the screen.
E.g., given: xmlDocPtr doc = xmlParseFile(infile);
use: pxml doc
end
</pre>

### Using Valgrind to check for errors

* Valgrind is a memory management error checker
* It runs a VM that keeps tabs on memory usage
* Once you compile a program (including debugging symbols), run <code>valgrind <i>your_program</i></code>
* If there's an error, you get two backtraces
    * First is where the misuse was first detected
    * Second is valgrind's best guess as to what line the misuse clashed with
* Errors are typically subtle, but getting a starting point is better than nothing
* YOu can check for memory leaks with <code>valgrind --leak-check=full <i>your_program</i></code>

### Unit Testing

* A test harness should:
    * Allow testing failures--if program should exit or abort, that should be testable
    * Keep tests separate from each other
    * Allow setup of complex, reusable test data and structures
* An example test of a dictionary:

<pre>
#include <glib.h>
#include "dict.h"

typedef struct {
    dictionary *dd;
} dfixture;

void dict_setup(dfixture *df, gconstpointer test_data) {
    df->dd = dictionary_new();
    dictionary_add(df->dd, "key1", "val1");
    dictionary_add(df->dd, "key2", NULL);
}

void dict_teardown(dfixture *df, gconstpointer test_data) {
    dictionary_free(df->dd);
}

void check_keys(dictionary const *d) {
    char *got_it = dictionary_find(d, "xx");
    g_assert(got_it == dictionary_not_found);
    got_it = dictionary_find(d, "key1");
    g_assert_cmpstr(got_it, ==, "val1");
    got_it = dictionary_find(d, "key2");
    g_assert_cmpstr(got_it, ==, NULL);
}

void test_new(dfixture *df, gconstpointer ignored) {
    check_keys(df->dd);
}

void test_copy(dfixture *df, gconstpointer ignored) {
    dictionary *cp = dictionary_copy(df->dd);
    check_keys(cp);
    dictionary_free(cp);
}

void test_failure() {
    if (g_test_trap_fork(0, G_TEST_TRAP_SILENCE_STDOUT | G_TEST_TRAP_SILENCE_STDERR)) {
        dictionary *dd = dictionary_new();
        dictionary_add(dd, NULL, "blank");
    }
    g_test_trap_assert_failed();
    g_test_trap_assert_stderr("NULL is not a valid key.\n");
}

int main(int argc, char **argv) {
    g_test_init(&argc, &argv, NULL);
    g_test_add("/set1/new test", dfixture, NULL, dict_setup, test_new, dict_teardown);
    g_test_add("/set1/copy test", dfixutre, NULL, dict_setup, test_copy, dict_teardown);
    g_test_add_func("/set2/fail test", test_failure);
    return g_test_run();
}
</pre>

A mechanism for optionally running tests by defining a main function, if a library file is run as a program to test it:

<pre>
int operation_one(){
    ...
}

int operation_two() {
    ...
}

#ifdef Test_operations
    void optest() {
        ...
    }

    int main(int argc, char **argv) {
        g_test_init(&argc, &argv, NULL);
        g_test_add_func("/set/a test", test_failure);
    }
#endif
</pre>

Which would require you to compile with <code>CFLAG=-DTest_operations</code> to execute.

#### Coverage

* There is a companion to <code>gcc</code>, <code>gcov</code>, which counts how many times each program line is touched.
* Procedure:
    * Add <code>-fprofile-arcs -ftest-coverage</code> to your gcc CFLAGS, and set <code>-O0</code>
    * When the program runs, each source file will produce one or two .gcda/.gcno data files
    * Running <code>gcov yourcode.gcda</code> will write to stdout the percentage of runnable code that the program hit, and produces yourcode.c.cov
    * First column of that output shows how often each line is hit, marks the lines not hit with #####
* A shell script to compile for coverage testing, run the tests, and check for lines of code not yet tested

<pre>
cat > makefile << '------'
P=dict_test
objects= keyval.o dict.o
CFLAGS = `pkg-config --cflags glib-2.0` -g -Wall -std=gnu99 -O0 -fprofile-arcs -ftest-coverage
LDLIBS = `pkg-config --libs glib-2.0`
CC=gcc

$(P):$(objects)
------
</pre>

Running it:

<pre>
make
./dict_test
for i in *gcda; do gcov $i; done;
grep -C3 '#####' *.c.gcov
</pre>


#### Error Checking

* You should handle errors your functions send.
* How and when to return errors? A couple of error type subcases:
    * What is the user going to do with the error message?
    * Is the receiver a human or a function?
    * How can the error be communicated to the user?

### Documenting

#### Doxygen

* Lets you write inline docs that can be extracted
* Syntax:
    * If a comment block starts with two stars, Doxygen parses the comment: <code>/** like this */</code>
    * If you want it to parse a file, you need a <code>/** \file */</code> comment at the head of the file.
    * Put comments about a function right before the function, or whatever it is.
    * Function descriptions should include <code>\param</code> segments describing inputs, and a <code>\return</code> line listing the expected return value.
    * Use <code>\ref</code> for cross references to other documented elements
    * Use an @ anywhere a backslash is used in the above
* To run it you need a config file, which you can generate with <code>doxygen -g</code>
* If you have Graphviz installed, it can generate call graphs


## Chapter 3: Packaging your project

## Chapter 6: Your Pal the Pointer

### Automatic, Static, and Manual Memory

* C has three basic models of memory management
    * Automatic - You declare a var on first use, and it is removed when it goes out of scope. Without the <code>static</code> keyword, any variable inside a function is automatic. Typical programming languages only have this type of data.
    * Static - Static variables exist in teh same place throughout the life of the program. Array sizes are fixed at startup (though values can change). Data is initialized before main starts, so any initializations have to be done with constants requiring no calculations. Variables declared outside functions and inside functions with the <code>static</code> keyword are static. If you forget to initialize a static var, it is set to all zeros or NULL.
    * Manual - involves <code>malloc</code> and <code>free</code>. Very error prone. Only type of memory where arrays can be resized after declaration.

## Chapter 7: Inessential C Syntax that Textbooks spend a lot of time covering

* You don't need an explicit return value from your main function.
* The C89 standard required all declarations to be at the head of a block. You don't have to do that anymore--just declare them on first use.
* You can set the size of arrays at runtime, based on calculations that happen before the declarations.
* You used to have to explictly cast anything you got out of <code>malloc</code>--you don't have to do that anymore, because <code>malloc</code> now returns a void pointer, which the compiler can autocast to any pointer type. The easiest way to do the cast is to declare a new variable with the right type.
* Enums kind of suck. Consider using chars instead.
* It's ok to use <code>goto</code> for jumping within a single function, or breaking out of a function early. Really the only current use is for cleaning up in case of different kinds of error, when you want to always jump to a single cleanup block for your function.
* Don't use switch--it's way too easy to have a fall-through condition that's an error.
* Use double instead of float. For intermediate values in calculations, use long double.
* If you think there's even a remote chance of a variable's value going up into the billions, use a long int instead of an int. Or even a long long int. That's to avoid overflow/wraparound problems.
* In most comparisons between signed and unsigned types, C will force the signed type to unsigned, which seems wrong to humans. Don't use unsigned types unless you have a very good reason to.
* Avoid using atoi and atof for string/number conversions. Use strtol and strtod instead. They have some built in error checking capacity.

## Chapter 8: Important C Syntax that Textbooks often do not cover

### Cultivate robust and flourishing macros

* There are two types of macro to discuss: one expands to an expression, and the other type is a block of instructions that might appear after an if or in a while loop.
* Here are some rules:
    * Use lots of parentheses to make OOP very explicit, since you're doing text substitution
    * Avoid double usage
