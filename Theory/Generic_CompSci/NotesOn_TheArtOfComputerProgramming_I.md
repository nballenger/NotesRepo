# Notes on The Art of Computer Programming: Volume 1 Fundamental Algorithms, 3rd ed.

By Donald E. Knuth; Addison-Wesley Professional, 1997

## Preface

* Reader should possess:
    1. Some idea of how a stored-program digital computer works (execution of instructions).
    1. An ability to put the solutions to problems into explicit enough terms that a computer can understand them.
    1. Some knowledge of elementary computing techniques like looping, subroutines, and indexed variables.
    1. A little knowledge of computer jargon like "memory," "registers," "bits," etc.
* Books intended for people more than just casually interested in computers.
* Subject of the series might be called "nonnumerical analysis": using the computer's decision making powers to solve non-numeric problems.
* That's not a great term&mdash;author prefers to call it "analysis of algorithms."
* Series is not intended to teach you how to use someone else's software, but to write better software yourself.
* Material has been written so that people with no more than high-school algebra can read it.
* Author needed to choose a language to communicate about, and chose a machine-oriented language because:
    1. Understanding a machine oriented language makes you efficiency focused.
    1. The example programs are all short enough to understand even in a machine-oriented language.
    1. High level languages aren't good for talking about things like coroutine linkage, random number generation, multi-precision arithmetic, and a bunch of stuff about efficient memory usage.
    1. If you want to know about computers, you should know about them as machines.
    1. You'd have to do some machine language anyway as output of the examples.
    1. Algebraic languages come and go, machine languages are more timeless.
* To avoid being tied to a language at a specific date, author created an 'ideal' machine whose rules can be learned in ~1 hour.

## Preface to the Third Edition

* Got to reformat the book in TeX and METAFONT.
* There's still probably mistakes and erratta.

## Procedure for Reading This Set of Books

* It's a procedure for reading, sort of joking, sort of serious. Not reproducing it here.

## Notes on the Exercises

* Exercises are rated on logarithmic scale:
    * 00 &mdash; easy, do it in your head
    * 10 &mdash; ~1 minute, pencil and paper
    * 20 &mdash; 15-20 minutes
    * 30 &mdash; 2+ hours to solve satisfactorily
    * 40 &mdash; Solution is non-trivial, equivalent to a final class project.
    * 50 &mdash; Currently unsolved research problem.
* If an exercise is marked `M` it is mathematically oriented.
* If an exercise is marked `HM` it requires higher maths.
* Exercises preceded by arrowheads are especially instructive.

## Chapter One: Basic Concepts

### 1.1 Algorithms

* Etymology of the word algorithm, eventually settled in the '50's on something like Euclid's algorithm.
* Euclid's algorithm (Algorithm E):

<pre>
Given two positive integers m and n, find their greatest common divisor, which
is the largest positive integer that evenly divides both m and n.

E1. [Find remainder.] Divide m by n and let r be the remainder.
    (We will have 0 &le; r &lt; n.)
E2. [Is it zero?] If r = 0, the algorithm terminates and n is the answer.
E3. [Reduce.] Set m &larr; n, n &larr; r, GOTO E1.
</pre>

* Each algorithm in the text is given a letter, substeps are E1, etc.
* Chapters are divided into numbered sections, so full address of an algorithm is, eg, 1.1E.
* Each step starts with a summary phrase in brackets, which is also the label in flowcharts.
* The &larr; arrow is a 'replacement operation' (or 'assignment' or 'substitution').
* Algorithm starts at lowest numbered steps, goes in sequence unless specified.
* Indexed variables will appear as <code>a[i,j]</code> rather than <code>a<sub>ij</sub></code>.
* An algorithm has five important features:
    1. **Finiteness** &mdash; Must terminate after a finite number of steps.
    1. **Definiteness** &mdash; Each step must be precisely and unambiguously defined.
    1. **Input** &mdash; An algorithm has zero or more inputs.
    1. **Output** &mdash; An algorithm has one or more outputs.
    1. **Effectiveness** &mdash; Each operation must be sufficiently basic that they could in principle be done exactly and in a finite length of time by someone with pen and paper.
* A method not meeting those criteria might be a 'computational method' instead of an algorithm.
* In practice we want algorithms that are not only finite/definite/effective, but _good_ by some criteria: length of time to execute, adaptability to different hardware, simplicity/elegance, etc.
* 'Analysis of algorithms' is the term the author uses to describe comparing disparate algorithms.
* Method for grounding an algorithm's definition in set theory:

<pre>
A computational method is a quadruple (<i>Q</i>, <i>I</i>, <i>&Omega;</i>, <i>f</i>),
in which <i>Q</i> is a set containing subsets <i>I</i> and <i>&Omega;</i>, and <i>f</i>
is a function from <i>Q</i> into itself.

<i>f</i> should leave &Omega; pointwise fixed; <i>f</i>(<i>q</i>) should equal <i>q</i> 
for all elements <i>q</i> of &Omega;.
</pre>
