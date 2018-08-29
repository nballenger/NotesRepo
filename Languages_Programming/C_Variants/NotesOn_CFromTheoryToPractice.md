# Notes on C: From Theory to Practice

By Nikolaos Tselikas, George Tselikis; CRC Press 2014; ISBN 9781498760317

## Chapter 1: Introduction to C

* Advantages of C
    * Flexible
    * Very fast
    * Small language
    * Portable
    * Supports structural programming
    * Very close to the hardware
    * C standard lib
    * Lots of different compilers
    * Scales up into the OO languages C++, etc.
* Disadvantages of C
    * Error prone, bugs can bypass compiler
    * Can be hard to understand and parse
    * Not OO
* Life cycle of a C program
    1. Write the source code
    1. Compile the source code
    1. Link the compiled code to lib functions
    1. Execute the program
* Hello, world:

<pre>
#include <stdio.h>

int main() {
    printf("foo\n");
    return 0;
}
</pre>

## Chapter 2: Data Types, Variables, and Data Output

* A variable is a storage location with a given name
* Value of a variable is the content of its memory location

### Rules for naming variables

1. Start with letter or underscore
1. Can contain a-z A-Z 0-9 _
1. Names are case sensitive
1. List of reserved words:
    * <code>auto break case char const continue default do double else</code>
    * <code>enum extern for float goto if int long register return short</code>
    * <code>signed sizeof static struct switch typedef union</code>

* Conventions
    * use descriptive variable names
    * snake case long names
    * use lowercase letters for variables
    * use uppercase letters for macros and constants

### Variable declaration

* Syntax for var declaration is <code>data_type name_of_variable;</code>
* Pre-existing data types:
    * <code>char</code> - 1 byte, range -128...127
    * <code>short</code> - 2 bytes, range -32,768 ... 32,767
    * <code>int</code> - 4 bytes, range -2,147,483,648 ... 2,147,483,647
    * <code>long</code> - 4 bytes, range -2,147,483,648 ... 2,147,483,647
    * <code>float</code> - 4 bytes, 1.17e-38 ... 3.4e38
    * <code>double</code> - 8 bytes, 2.2e-308 ... 1.8e308
    * <code>long double</code> - 8, 10, 12, 16 bytes
    * <code>unsigned char</code> - 1 byte, 0 ... 255
    * <code>unsigned short</code> - 2 bytes, 0 ... 65,535
    * <code>unsigned int</code> - 4 bytes, 0 ... 4,294,967,295
    * <code>unsigned long</code> - 4 bytes, 0 ... 4,294,967,295
* Declaration may be singular or multiple: <code>int a,b,c;</code>
* If precision is not critical use float, which typically reserves fewer bytes than double

### Assigning values to variables

<pre>
int a;
a = 100;

int b = 100;

int c = 100, d = 200, e = 300;

int f = 100, g = f+100, h = g+100;
</pre>

### Constants

<pre>
const int a = 10;
</pre>

### #define directive

* #define defines a macro, a name typically representing a numerical value
* Syntax is <code>#define name_of_macro value</code>
* Values are interpolated into the program during compilation
* Typically defined before <code>main</code> and typically named in allcaps

### Long bit here about printf()

### Type casting

* Syntax for converting to another type is <code>(data_type) expression</code>

## Chapter 3: Getting input with scanf()

## Chapter 4: Operators

* Assignment:
    * Syntax is <code>varname = value</code>
    * May be chained: <code>a = b = c = 10</code>
* Arithmetic
    * Normal: + - * /
    * If both operands are ints, division removes decimal part
    * % finds the remainder of integer division
    * ++ and -- can be pre and post fix
* Relational
    * Basics are <code>> >= < <= != ==</code>
* Logical
    * AND: <code>&&</code>
    * OR: <code>||</code>
* Comma
    * Comma can merge several expressions into a single expression
    * Comma is left associative, so subexpressions are evaluated LTR
    * result is the result of the last expression evaluated
* sizeof
    * determines the number of bytes required to store a specific type

### enum Type

* Defines an enumeration type, which is a set of named integer constant values
* simplest case: <code>enum tag { enumeration_list };</code>
* Where tag is an optional label identifying the enumeration list
* Example: <code>enum seasons {AUTUMN, WINTER, SPRING, SUMMER};</code>
* By default they're zero indexed
* You can set them to specific values: <code>enum seasons {AUTUMN=10, WINTER=20, SPRING=30, SUMMER=40};</code>
* If not assigned a number, a constant is set to previous number plus one
* You can also declare enumeration variables like <code>enum seasons s1, s2;</code>
* You can also combine defintiion and declaration: <code>enum seasons {A, W, SP, SU} s1, s2;</code>

### Bitwise operators

* Bitwise AND: <code>&</code>
* Bitwise OR: <code>|</code>
* Bitwise XOR: <code>^</code>
* Bitwise NOT: <code>~</code>
* Right shift: <code>>></code>
* Left shift: <code><<</code>

## Chapter 5: Program Control

### if statement

<pre>
if (condition) {
    /* block of statements */
}
else {
    /* block of statements */
}
</pre>

### Ternary op

* Syntax: <code>exp1 ? exp2 : exp3;</code>

### switch statement

<pre>
switch (expression) {
    case constant_1:
        /* block of statements */
        break;
    case constant_2:
        /* block of statements */
        break;
    default:
        /* block of statements */
        break;
}
</pre>

## Chapter 6: Loops
