# Notes on Mastering Algorithms with C

By Kyle Loudon, O'Reilly Media 1999

# Chapter 1: Introduction

## An Introduction to Data Structures

* Three reasons for using data structures
    * Efficiency - hash table, binary tree, etc. speed up search; matching data structure to algorithm speeds up computation
    * Abstraction - provide mental structure to problem solving
    * Reusability - modular and context-free, applicable to multiple situations
* **Abstract datatype** - data structure along with its basic operations
* **Public interface** - collected operations of an ADT

## An introduction to algorithms

* Three reasons for using formal algorithms
    * Efficiency - best practices are embodied in repeatable algorithms
    * Abstraction - allows seeing complex problems as simpler ones
    * Reusability - generalizations of problem solving allow reuse

### General Approaches in Algorithm Design

* Randomized algorithms - Rather than finding exactly the median in quicksort, we choose a random point and treat it as the median, which on average is faster than being right.
* Divide and conquer algorithms - Three steps: divide, conquer, combine. Divide breaks the data into more manageable pieces, conquer processes each division by doing an operation on it, combine recombines the processed divisions.
* Dynamic-programming solutions - In divide and conquer the subproblems are independent, in dynamic programming subproblems are not independent and may share subproblems. DP lets you share solved subproblems to avoid rework.
* Greedy algorithms - Make the decision that looks best at the given moment--make sub-optimal decisions quickly to lead to globally optimal solutions.
* Approximation algorithms - Compute "good enough" solutions in cases where the optimal solution is computationally expensive. A 'heuristic' is a less than optimal strategy to use when an optimal strategy is not feasible.

# Chapter 2: Pointer Manipulation

## Pointer Fundamentals

* A pointer is a variable that stores the address where data lives in memory.
* Pointers may also be set to NULL
* Pointers may be set to invalid addresses--"dangling pointers"

## Storage Allocation

* On declaration of a pointer, C allocates space for it
* Typical size for a pointer is one machine word, though never assume a pointer has a specific size.
* On declaration, note that space is ONLY allocated for the pointer itself.
* Data storage is allocated by declaring a variable or allocating dynamic storage at runtime with malloc/realloc.
* Automatic variables have storage allocated and deallocated automatically when entering and leaving a block or function. A pointer to an automatic variable can easily become a dangling pointer 
* One model of a consistent approach to memory management is via data structures, where the user is expected to manage the storage for the actual data stored in the structure--the structure itself only holds pointers and any internal structure required. Freeing storage is the responsibility of a callback function provided to the structure.

## Aggregates and Pointer Arithmetic

### Structures

* Structures - sequences of usually heterogeneous elements grouped to be treated as a single coherent datatype.
* Pointers allow linking structures together in memory, to organize them for solving problems.
* Structures are not able to contain instances of themselves, but can contain pointers to instances of themselves. Allows, eg, linked lists.

### Arrays

* Arrays - sequences of homogeneous elements arranged consecutively in memory.
* C arrays are related to pointers--when an array identifier is used, C converts the array transparently into an unmodifiable pointer to the array's first element.
* Access to the <i>i</i>th element in an array <i>a</i> is via <code>a[i]</code>, because C treats <i>a</i> as a pointer to the first element of <i>a</i>. This makes the entire expression equivalent to <code>*(a + i)</code>, which is evaluated according to pointer arithmetic.
* Pointer arithmetic:
    * When we add an integer <i>i</i> to a pointer, the result is the address, plus <i>i</i> times the number of bytes in the datatype the pointer references.
    * This is part of why arrays are zero indexed--first element is at <i>a</i> plus zero offset.

## Pointers as Parameters to Functions

### Call by reference parameter passing

* Pointers allow C to do call by reference parameter passing
* Call by value only allows changes to persist within a function body, because changes are being made to a private copy of the passed value
* By passing a pointer, the function gets a private copy of a pointer to each parameter, which can still be used to mutate the referenced value
* You can pass an array as a pointer, because it is treated as an unmodifiable pointer anyway
* When passing a multidimensional array, you must specify the size of all but the first dimension, because otherwise C cannot compute the offset for subsequent row accesses

### Pointers to Pointers as Parameters

* If a function must modify a pointer passed into it, it must be passed a pointer to the pointer.
* Example of an operation signature for an op that removes an element from a linked list, where <i>data</i> points to the data to remove from the list: <code>int list_rem_next(List *list, ListElmt *element, void **data)</code>
* That signature passes the address of the pointer <i>data</i> as the last param

## Generic Pointers and Casts

* Pointer vars have types, so that the compiler knows the type of data being pointed to when you dereference the pointer
* If you don't care about the type of data a pointer references, you can use a generic pointer, which bypasses the type system

### Generic Pointers

* Typical assignment is only between pointers of the same type, but generic pointers can be set to pointers of any type
* To make a C pointer generic, declare it as void
* Void pointers allow you to write code that's agnostic about what it's accessing, like a memory copy function
* Particularly useful for data structures because they let you store/retrieve any type of data
* Casting is typically necessary to deal with a pointer to a void pointer

### Casts

* To cast a variable <i>t</i> of some type <i>T</i> to another type <i>S</i>, precede <i>t</i> with <i>S</i> in parens
* Example assignment of an integer pointer to a floating point pointer, by casting the integer pointer to a floating point pointer and then making the assignment: <code>fptr = (float *)iptr;</code>
* After assignment, both pointers contain the same address, but how the data is interpreted depends on which pointer you use to access it
* Generic pointers cannot be dereferenced without casting them to some other type, because without a cast the compiler has no idea how many bytes the data comprises

## Function Pointers

* A function pointer points to executable code, or to blocks of info needed to invoke executable code
* A declaration for a function pointer looks like a function declaration, except an asterisk precedes the function name, and the asterisk and name are in parens for reasons of associativity
* Example in which <i>match</i> is declared as a pointer to a function that accepts two void pointers and returns an integer: <code>int (*match)(void *key1, void *key2);</code>
* That declaration lets you set <i>match</i> to point to any function with that signature.
* To execute a function referenced by a function pointer, you use the function pointer wherever you would use the function name
* Function pointers allow you to encapsulate functions into data structures
