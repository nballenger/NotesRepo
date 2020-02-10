# Notes on C Programming for Scientists and Engineers with Applications

# Chapter 1: Introduction to Computers and Programming

# Chapter 2: Basic Elements of the C Programming Language

## 2.1 Introduction to C

Important features of C are:

1. Data type declarations and definitions that eliminate ambiguities associated with undeclared and undefined variables.  This forces the programmer to think about the use and range of values for each variable at the beginning of the coding process, which reduces the number of errors in the program.
1. Standard control structures that make the program control flow top-down.  This makes the program easier to read and update.
1. Functions to implement the modularity in programs. This makes the program logic simpler and the physical structure of the program easier to understand, read, and update.
1. Derived data types such as arrays, character strings, and structures are available to handle complex data types.
1. Powerful features of the language include pointers, pointer variables, and dynamic storage.

### 2.1.1 Structured Language

* Three basic control structures: sequence, selection, and repeptition
* The function is the fourth control structure in C, and corresponds to an entire flowchart

### 2.1.2 Procedural Language

* Functions are pieces of code that perform a single modular task
* The uppermost level of organization in a program is the 'main' function
* The form of main is:

    ```C
    int main( )
    {
        statement block
        return 0;
    }
    ```

* Every function must be declared and defined.
* Declarations involve writing a prototype of the function interface
* Definitions involve saying what the function will do with input to produce output
* Declarations must happen before function invocation
* Declarations consist of the return type, the name, and a parameter type list:

    ```C
int round(float);
    ```

* Definitions start with a header that is an example of the prototype consisting of return type, function name and formal arguments (parameters) inside parens. Followed by a function body in braces:

    ```C
int round(float x)
{
    int y;
    y = (int) (x + 0.5);
    return(y);
}
    ```

### 2.1.3 Statically Typed Language

* Data types of variables and functions must be declared
* There are built in/basic datatypes: int, float, double, char
* Arrays, strings and structures are derived from the basic types
* Vectors and arrays are homogeneous data aggregates of numeric and char types
* Character strings are homogeneous aggregates of characters
* Structures are nonhomogeneous aggregate of more than one type

## 2.2 Constants and Variables

* Constants are values like literal numbers or character strings
* Variables are named data containers
* Explicit constants can be declared of type const
* A constant or variable is undefined until a value is assigned

### 2.2.1 Character Set

* All upper and lower case alphabetical english characters, numeric digits, arithmetic operators, relational operators, grouping and separation characters, and some special characters.

### 2.2.2 Identifiers

* The symbolic names that represent quantities like function names, variable names, constant names, array names, character string names, structure tag names, etc.
* Identifiers must:
    * Be 1-31 characters with no spaces
    * first character must be alphabetic or an underscore
    * other characters can be alphanumeric or underscore
    * no special characters in identifiers
* Identifiers are case sensitive
* Variables and named constants must appear in declaration statements
* Declaration: allocates storage, associates the name with the storage
* Storage cells will be between 1 and 8 bytes, can be queried with sizeOf()

### 2.2.3 Built-in Data Types

* int: one or more digits, possibly signed, no decimal point
    * storage size can be set to 2 bytes with 'short int'
    * storage size can be set to 4 bytes with 'long int'
    * Sizes are defined in limits.h
    * You can explicitly declare an int to be 'unsigned'
    * Multiple variables can be declared in one line: int a, b, c;
* float: one or more digits, possibly signed, a decimal point or scientific notation
    * Allocated four bytes of storage
    * using E in a number will give exponentiation
* double: eight bytes of storage, holding up to fifteen decimal digits
    * most high precision values are represented in scientific notation
* char: one byte of storage, with one character
    * character constants must be enclosed in single quotes
    * double quotes indicate a string
    * stored in memory as an integer value from ASCII
* special characters:
    * `'\a'`    bell
    * `'\b'`    back space
    * `'\f'`    form feed
    * `'\n'`    new line
    * `'\t'`    tab
    * `'\0'`    null character
    * `'\\'`    backslash
    * `'\''`    single quote

* Variables must be initialized before they are used in calculations or as output

# 2.2.4 Derived Data Types

* Arrays are defined with:

    ```C
int loc[] = {1,2,3};  <-- x/y/z point in space
    ```

* Strings are defined with:

    ```C
char digits[] = {'0','1','2','3','\0'}; <-- characters ending in a null character
    ```

### 2.2.5 Pointer and Pointer Variables

* Tool for manipulating data using the memory address of a variable
* Value of a pointer is the memory address of a variable
* Pointer variable points to the data value at the address stored in the pointer
* The data type of a pointer variable is the same as the data type it refers to
* Asterisks denote pointer variables:

    ```C
float var1 = 460.5;
float *ptrvar1;
    ```

* To store a memory address into a pointer variable post declaration, use the address operator, &:

    ```C
ptrvar1 = &var1;
    ```

* To access the value of a memory address a pointer refers to, use the dereference operator, *:

    ```C
*ptrvar1 = 723.14;
*ptrvar1 = *ptrvar1 + 200;
    ```

## 2.3 Arithmetic Operations and Expressions

* Can be performed on int, float or double types
* Operators are: `+ - * / %`
* Exponentiation is done with: `pow(double, double)` from the math library
* Dividing an integer by an integer produces an integer
* Cast one or both ints to float to avoid the truncation of the decimal part
* In a mixed type operation, both will be converted to the more complex of the two

### 2.3.2 Arithmetic Expressions

* Expressions can be used wherever a value of the same type could be used

### 2.3.3 Assignment Statement

* The equal sign is the assignment operator
* Assigns the value on the right to the variable on the left
* Assignments are carried out in three steps:
    * Evaluate the expression on the right of the equals sign
    * Convert if necessary to the data type of the variable on the left
    * The value from the right is stored in the memory cell associated with the variable or pointer

### 2.3.4 Order of Evaluations

* Operator precedence order is:
    * `()`
    * `+ -` (unary)
    * `pow()`
    * `*` and `/` and `%`, left to right
    * `+` and `-`

### 2.3.5 Use of Parentheses

* Generally necessary when an algebraic expression has fractions or exponents

### 2.3.6 Special Operators

* `+=`  increment
* `-=`  decrement
* `/=`  fractional
* `*=`  product
* `%=`  remainder
* `++`  unary increment (pre or post)
* `--`  unary decrement (pre or post)

* You can use a cast operator to convert a value to another data type without changing it in storage
* Example:

    ```C
int     var1;
float   var2;
(float) var1;   <-- casts the stored int as float
(int)   var2;   <-- casts the stored float as int
    ```

* `sizeof` operator: determines at run time the number of bytes of storage for a variable or data type
* Example:

    ```C
int var, varsize;
varsize = sizeof(int);
-- or --
varsize = sizeof(var);
    ```

### 2.3.7 Accuracy of Computation

* You can lose accuracy due to size limits on stored data.

### 2.3.8 C Libraries and Functions

* Function prototypes are stored in header files
* You include header files (and thereby the functions they describe) with #include
* `#include` is a 'preprocessor directive'

## 2.4 Overview of Implementation

* Basic units of C as a procedural language are functions
* Execution always starts with the main function
* You can either define an implementation before main, or a declaration before main and implementation after

### 2.4.1 Formatting of Statements

* Two types of statement: comment statements and program statements
* Comments are within `/* */`
* Program statements are free format: spaces are non-functional beyond the first one

### 2.4.2 Formatting of a Program

* Sections for documenation, declarations, definitions and program statements
* Data is stored externally in a data file
* The program file and data file need external names known to the OS
* Large programs may have several program files, each with several functions
* The return statement in main indicates the end of the program
* Every C program has the general form:

    ```
documenation describing the entire program
preprocessor directives
defined constants /* optional, explained later */
global variables /* not recommended, explained later */
function prototypes

int main()
{
    declarations of variables and constants
    ...
    executable statements
    ...
    return 0;
}

function implementations
    ```

* The structure of a subordinate function is:

    ```
documenation describing the function
external variables /* not recommended, explained later */
return type     function name(parameter list)
{
    declarations of variables
    ...
    executable statements
    ...
    return;
}
    ```

### 2.4.3 Data Design

* Programs need sufficient data validation to keep them from crashing
* During design, you should design test data that is both normal and contains extreme cases

## 2.5 First Complete Programs

# Chapter 3: Input and Output

## 3.1 Input and Output Functions

* Two groups of functions: those that use a format string and a variable number of arguments, and those that use preformatted data with a fixed number of items in a predetermined order
* Format string functions: `scanf()`, `printf()`, `fscanf()`, `fprintf()`
* Preformatted data functions: `getchar()`, `putchar()`, `getc()`, `fgetc()`, `putc()`, `fputc()`, `gets()`, `fgets()`, `puts()`, `fputs()`
* `stdio.h` includes prototypes for all input output functions in C

### 3.1.1 Formatted Input and Output Functions

* General form:

    ```
function-name("format control string", var1, var2, ..., varN);
    ```

### 3.1.2 Standard Input Function

* Getting data from the keyboard: scanf()
* General form:

    ```
scanf("format string", &var1, &var2, ..., &varN);
    ```

* Format specials: `%d` for int, `%f` for float, `%e` for scientific notation

### 3.1.3 Standard Output Function

* `printf()` outputs to a monitor or printer
* General form:

    ```C
printf("format string", var1, var2, ..., varN);
    ```

## 3.2 File Input and Output

* Three main file modes: r (read), w (write), a (append)

### 3.2.1 Declaration of File Pointers

* Data files have external (operating system) names and internal (program) names
* Internal names are file pointers, which are declared:

    ```C
FILE *fptr;
    ```

* `FILE` is a keyword for the file pointer type
* Associated with an external name via an open statement
* Multiple pointers can be declared:

    ```C
FILE *inptr, *outptr;
    ```

### 3.2.2 open and close Statements

* Data files typically have the extension .dat
* Once a pointer is open, it stays open until closed or the program exits
* A second open of an already open file will return null
* files can be explicitly close with fclose()
* General form of fopen:

    ```C
FILE *fptr;
fptr = fopen("myfile.dat", mode);
    ```

* List of modes:
    * `r`       reads if exists, error if not
    * `w`       writes to file from beginning if exists, creates new file if not exists
    * `a`       appends to file if exists, creates new file if not exists
    * `r+`      opens for reading and writing if exists, error if not
    * `w+`      opens for reading and writing if exists, new file if not
    * `a+`      opens for reading and appending if exists, new file if not
    * `wb`      opens a binary file for writing
    * `r+b`     opens a binary file for reading and writing

* general form of the `fclose()` statement:

    ```C
fclose(file pointer);
    ```

### 3.2.3 Input from a Data File

* Obtained with `fscanf()` in the program
* General form:

    ```
fscanf(file pointer, "format control string", &var1, &var2, ..., &varN);
    ```

* If there is not enough data in the file, fscanf() returns an EOF flag
* Example read:

    ```C
FILE *inptr;
int var1, var2;
float var3;
double var4;

inptr = fopen("myfile1.dat", "r");
fscanf(inptr, "%d %d %f %e", &var1, &var2, &var3, &var4);
    ```

* Amount of data read by an input statement is an 'input record', same for 'output record'
* Every time a record is read or written, the record marker is moved to the beginning of the next record
* Initially it's set to the first record at the beginning of the file
* Example of failsafe input:

    ```C
FILE *inptr;
float var1, var2, var3, var4;
inptr = fopen("myfile2.dat", "r");

if (inptr)
{
    fscanf(inptr, "%f %f", &var1, &var2);
    fscanf(inptr, "%f %f", &var3, &var4);
}
else
{
    printf("file myfile2.dat not available\n");
}
    ```

### 3.2.4 Output to a Data File

* Uses `fprintf()`
* General form:

    ```C
fprintf(file pointer, "format control string", var1, var2, ..., varN);
    ```

* Example of output:

    ```C
int var1, var4,;
float var2, var3;
FILE *outptr;
outptr = fopen("myfile3.dat", "w");
fprintf(outptr, "%d %f %f %d", var1, var2, var3, var4);
    ```

* Building a data file from pairs of numbers entered at the keyboard:

    ```C
#include <stdio.h>
int main()
{
    float x, y;
    FILE *graphptr;

    graphptr = fopen("graph.dat", "w");

    if (graphptr)
    {
        while(scanf("%f %f", &x, &y))
        {
            fprintf(graphptr, "%f %f", x, y);
        }
        fclose(graphptr);
    }
    else
        printf("File <graph.dat> is not available");
    return 0;
}
    ```

* Outputting a data file:

    ```C
#include <stdio.h>
int main()
{
    float x, y;
    FILE *fptr;

    fptr = fopen("myfile.dat", "r");

    if (fptr)
    {
        printf("  x  y\n");
        while ((fscanf(fptr, "%f %f", &x, &y)) != EOF)
            printf("%f %f\n", x, y);
        fclose(fptr);
    }
    else
        printf("File <myfile.dat> not available\n");
    return 0;
}
    ```

## 3.3 Field Width Specification

### 3.3.1 Input Field Width Specification

* General form:
    * `%nd`     integers of n width
    * `%nf`     real numbers of n total digits + decimal point position + sign position

### 3.3.2 Output Field Width Specification

* General form:
    * `%nd`     integers + the sign position + any leading spaces
    * `%n.mf`   n real numbers + decimal point + sign position, m characters to right of decimal

## 3.4 Input and Output of Characters

* Characters are defined as:

    ```C
char ch1, ch2, ch3;
    ```

### 3.4.1 Standard Input and Output

* Standard in is keyboard, standard out is monitor
* Input:

    ```C
scanf("%c%c%c", &ch1, &ch2, &ch3);
    ```

* Output:

    ```C
printf("%c %c %c", ch1, ch2, ch3);  <-- as characters
printf("%d %d %d", ch1, ch2, ch3);  <-- as ascii code integers
    ```

### 3.4.2 File Input and Output

* Input example:

    ```C
FILE *inptr;
inptr = fopen("myfile7.dat", "r");
char ch1, ch2, ch3, ch4;
fscanf(inptr, "%c%c%c%c", &ch1, &ch2, &ch3, &ch4);
    ```

* Output example:

    ```C
char ch1='3', ch2=' ', ch3='X', ch4='Y';
FILE *outptr;
outptr = fopen("myfile8.dat", "w");
fprintf(outptr, "%c%c%c%c", ch1, ch2, ch3, ch4);
    ```

### 3.4.3 Unformatted Input and Output

* `getchar()` and `putchar()` do input and output of characters from stdin/stdout
* `getchar()` takes a single character from the keyboard
* `putchar()` puts a single character in an output buffer, to display when you hit enter
* Example:

    ```C
char ch;
while(( ch = getchar()) != '\n')
    putchar(ch);
    ```

## 3.5 Sample Programs

# Chapter 4: Control Structures

* Three basic structures: sequence, selection, repetition
* Sequence structure: statements are executed in the order they appear
* Selection structure: one, two, or more options to be executed
* Repetition structure: repeats execution of a sequence zero or more times

## 4.1 Relational and Logical Operations

### 4.1.1 Relational Operators and Relational Expressions

* `>`       greater than
* `>=`      greater than or equal to
* `<`       less than
* `<=`      less than or equal to
* `==`      equal to
* `!=`      not equal to

* Good to use approximate equality for comparing real numbers, like:

    ```C
float a;
a = 1.0 / 3.0;
a = 3 * a;
if (fabs(a - 1.0) < 0.0001) /* is approximately equal */
    ```

### 4.1.2 Logical Operators and Logical Expressions

* `&&`      AND
* `||`      OR
* `!`       NOT

## 4.2 Selection Structures

### 4.2.1 Two Way Selection Structures

```C
if (cond1) {
    stmt1;
}
else if (cond2) {
    stmt2;
}
else if (cond3) {
    stmt3;
}
else {
    stmt4;
}


switch (expression) {
    case 1:
        sequence1;
        break;
    case 2:
        sequence2;
        break;
    case 3:
        sequence3;
        break;
    default:
        sequence4;
}
```

* Case codes must be `int` or `char`
* To combine cases:

    ```C
switch (expression) {
    case 1:
        stmt1;
        break;
    case 2:
    case 3:
        printf("case 2 or 3: %d\n" expression);
        break;
    default:
        stmt3;
}
    ```

## 4.3 Repetition Structures

### 4.3.1 Iterative Loops

```C
int i;
for (i = 1; i < 6; i++)
{
    funcall();
    printf("i = %d\n", i);
}
printf("i = %d\n", i);
```

### 4.3.2 Nested Iterative Loops

```C
int i, j;
for (i = 0; i < 3; i++)
{
    for (j = 0; j < 40; j++)
    {
        funcall();
        printf("i = %d  j = %d\n", i, j);
    }
    printf("\n");
}
```

### 4.3.3 Conditional Loops

```C
float r, a;
const float PI = 3.141593;

scanf("%f", &r);
while (r != 0)
{
    a = PI * r * r;
    printf("radius = %f area = %f\n", r, a);
    scanf("%f", &r);
}

/* Flag controlled (EOF) while loop: */
int num;
while ((fscanf(inptr, "%d", &num)) != EOF)
{
    stmt1;
    stmt2;
    stmtN;
}

/* do while loop */
do
{
    stmt1;
    stmt2;
    stmtN;
}
while (condition);
```

## 4.4 Stacking and Nesting of Control Structures

### 4.4.1 Control Structure Stacking

### 4.4.2 Nested Control Structures

## 4.5 Sample Problems

# Chapter 5: Modular Design and Functions

## 5.1 Introduction to Modular Programming

### 5.1.1 Design of Modular Programs

* Top module implements the functional description of the program
* Design can be decomposed into steps that are functional modules

## 5.2 Functions

* Separate unit of a C program tat has a prototype and an implementation containing a header
* Written to perform a specific task
* Execution always starts at the beginning of `main()`

### 5.2.1 Function declaration

* Every function except main must be declared/prototyped
* General form of a prototype:

    ```
return-data-type function-name(list of parameter data-types);
    ```

* Example:

    ```C
int funcsort(int, float, int, double, char);
    ```

* Parameter names can be specified in the prototype, but are optional

    ```C
int funcsort(int input_int, float length_in_ft, double height_in_ft, char site_id);
    ```

### 5.2.2 Function Definition

* General form of a function definition header:

    ```
return-data-type function-name(list of parameters with their data type)
    ```

* Header must match prototype:
    * return data type must match
    * function name must match
    * number, data types and order of parameters must match

* Header is followed by body of function in braces:

    ```C
int funcsort(int var1, float var2, double var3, char var4)
{
    int result;
    result = ...;
    return result;
}
    ```

* Example full C program:

    ```C
#include <stdio.h>
float compute_area(float);

int main()
{
    float r, area;
    area = compute_area(r);
    outputf(area);
    return 0;
}

float compute_area(float radius)
{
    const float PI = 3.141593;
    float area;
    area = PI * radius * radius;
    return area;
}
    ```

### 5.2.3 Scope of Names

* If a name is declared ahead of all function definitions, including main(), it's global
* Otherwise it's local to the block it was declared in
* Functions are local to the scope in which their prototype exists

### 5.2.4 return Statement

* a return statement at the end of a function returns control to the calling function

## 5.3 Computation Functions

### 5.3.1 Passing Arguments by Value

* When arguments are passed by value, the function only has access to locally scoped copies

### 5.3.2 Passing Arguments by Pointer

* if you pass in pointers, you can change the actual values
* Example:

    ```C
int funcsum(int *, int *, int *);

int main()
{
    int var1, var2, var3, sum;
    var1 = 10;
    var2 = 20;
    var3 = 30;
    sum = funcsum(&var1, &var2, &var3);
    printf("var1= %d var2 = %d var3 = %d sum = %d\n", var1, var2, var3, sum);
    return 0;
}

int funcsum(int *varx, int *vary, int *varz)
{
    int sum1;
    sum1 = *varx + *vary + varz;
    return sum1;
}
    ```

## 5.4 Input and Output Functions

### 5.4.1 Input Using Functions

* Example of standard input:

    ```C
void funcinput(int *, int *, float *, float *);
int main()
{
    int var1, var2;
    float var3, var4;

    funcinput(&var1, &var2, &var3, &var4);
    printf("var1 = %d var2 = %d var3 = %f var4 = %f\n", var1, var2, var3, var4);
    return 0;
}

void funcinput(int *varx, int *vary, float *varz, float *varw)
{
    scanf("%d %d %f %f", varx, vary, varz, varw);
    return;
}
    ```

* Example of validating input:

    ```C
int get_pos_nums(int *n, int *m)
{
    int i, j, flag;
    flag = printf("\n enter two positive numbers");
    if (flag)       /* prompt displays successfully */
    {
        flag = scanf("%d %d", &i, &j);
        if (flag)       /* input successfully */
        {
            if (i > 0 && j > 0)
            {
                *n = i;     /* store the numbers */
                *m = j;
            }
            else
                flag = 0;
        }
        else;               /* null else input unsuccessful */
    }
    else;                   /* null else prompt unsuccessful */
    return flag;
}
    ```

### 5.4.2 Output Using Functions

* Example of standard output from a function:

    ```C
void funcoutput(int, int, float, float);

int main()
{
    int var1, var2, var3, var4;
    funcoutput(var1, var2, var3, var4);
    return 0;
}

void funcoutput(int varx, int vary, float varz, float varw)
{
    printf("varx = %d vary = %d varz = %f varw = %f\n", varx, vary, varz, varw);
    return;
}
    ```

* Example of output to a data file declared global:

    ```C
FILE *outptr;
void funcoutput(int, int, float, float);

int main()
{
    int var1, var2;
    float var3, var4;
    outptr = fopen("myfile.dat", "w");
    funcoutput(var1, var2, var3, var4);
    return 0;
}

void funcoutput(int varx, int vary, float varz, float varw)
{
    fprintf(outptr, "%d %d %f %f", varx, vary, varz, varw);
    return;
}
    ```

## 5.5 Recursive Functions

### 5.5.1 Concept of Recursion

* Classic example of recursion is `n!`
* Defined mathematically as:

    ```
      /  1          for n = 1   <-- base condition
n! = |
      \ n(n-1)!     for n > 1   <-- recursive formula
    ```

* Simple implemetation:

    ```C
int fact(int);
int fact(int n)
{
    if (n == 1)
        return 1;
    else
        return (n * fact(n-1));
}
    ```

### 5.5.2 Relationship between Iteration and Recursion

* Most iterative formulas can be programmed using recursive functions.
* Base condition corresponds to the initialization of the repetition
* Recursive formula corresponds to teh repetition

# Chapter 6: Storage Classes

## 6.1 Scope of Variables

* Scope is the part of a program where a variable's name is known and its storage is accessible

### 6.1.1 Block Structure

* All `{}` bounded blocks have local scope.

### 6.1.2 Global Scope and Block Scope

### 6.1.3 Scope of Access

* You can access something outside its local scope if you pass a reference.

## 6.2 Storage Classes in a Single File

* Four basic storage classes: `auto`, `extern`, `static`, `register`
* If you use storage class, it must come before data type in a declaration

### 6.2.1 Storage Class auto

* Default storage class
* Does not require a value on declaration

### 6.2.2 Storage Class extern

* Used to access functions declared and implemented in another source file
* Anything declared as global is an extern storage class variable
* Automatically defined on declaration, default value of 0
* When specifically classed extern, no storage is assigned, no value is assigned
* Lets you put a reference into local scope for an external variable
* Example:

    ```C
int main()
{
    extern int x;   /* Allows you to access the x declared before func1 */
    x = 5;
    func1();
    return 0;       /* x is now 15 */
}

int x;
void func1(void)
{
    x = 15;
}
    ```

### 6.2.3 Storage Class static

* Used for accumulators, counters, summations
* Defined on declaration, automatically initialized to zero unless otherwise set
* Does not cease to exist outside scope, but is inaccessible
* Retains the updated value every time it's changed for entire program duration

### 6.2.3 Storage Class register

* A request for storage inside a register of the cpu--faster than memory
* Compiler decides whether to honor request or not
* Defaults to auto if there's no available register
* Local to functions / local blocks
* Follows same rules as auto variables
* Really only needed for brute force algorithms

## 6.3 Storage Classes in Multiple Files

* Only applicable to extern class variables
* Example of access of an extern variable across files:
* File A:

    ```C
#include <stdio.h>

void func1(void);
void func2(void);

int main()
{
    extern int a;           /* a is made visible */
    func1();
    a = a + 5;
    printf("In main a = %d\n", a);
    func2();
    a = a + 25;
    printf("In main a = %d\n, a);
    return 0;
}

int a;                      /* a is declared and defined */
void func1(void)
{
    a = 15;
    printf("In func1 a = %d\n", a);
    return;
}
    ```

* File B:

    ```C
extern int a;
void func2(void)
{
    a = a + 10;
    printf("In func2 a = %d\n", a);
    return;
}
    ```
