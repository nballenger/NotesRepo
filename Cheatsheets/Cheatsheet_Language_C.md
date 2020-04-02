# Language Cheatsheet: C

## Hello, World

Source (`hello_world.c`):

```C
#include <stdio.h>

int main() {
    printf("Hello, world.\n");
    return 0;
}
```

Compilation:

```zsh
% c99 -o hello_world hello_world.c 
```

Execution:

```zsh
% ./hello_world 
Hello, world.
```

## Program Lifecycle

1. Write source file(s).
    

## Syntax

### Directives

* Preprocessor Directives
    * `#include <some_header_file.h>` or `#include "other_header_file.h"` - Causes the declarations in the named header file to be included in your program. The angle bracket format causes the preprocessor to search the dev. environment path for standard includes by that name. The quote mark format will also search first in some user-defined locations for the named file, then fall back to the standard includes path(s).
    * `#define` - Defines values or macros used by the preprocessor to manipulate program source code prior to compilation. May make errors difficult to trace, since preprocessor defs are substituted before the compiler acts on the source. In modern C `#define` is mostly used to handle compiler and platform differences, like the appropriate error code for a system call.
    * `#undef` - Undefines a macro. The identifier need not have been previously defined.
    * `#if`, `#else`, `#elif`, `#endif` - `#if` checks whether a controlling expression evaluates to zero or nonzero, and excludes or includes a block of code based on that. The conditional may contain any C operator except for assignment, increment/decrement, address-of, or sizeof.

        ```C
        #if 1
            /* Will be included */
        #endif
        #if 0
            /* Will be excluded */
        #endif
        ```

    * `#ifdef`, `#ifndef` - Similar to `#if`, but checks to see whether a macro name is defined, like `#ifdef SOMENAME` or `#ifndef SOMENAME`.
    * `#line` - Sets the file name and the line number of the line following the directive to new values. Used to set `__FILE__` and `__LINE__` macros.
* Compiler Directives
    * `#pragma sometoken(s)` - Requests special behavior from the compiler.
    * `#error` - Halts compilation. When encountered, the compiler should emit a diagnostic containing the remaining tokens in the directive. Mostly used for debugging.
    * `#warning` - When encountered, the compiler emits a diagnostic containing the remaining tokens in the directive.

### Macros

* Preprocessor Macros
    * `__FILE__` - Name of the current file as a string literal.
    * `__LINE__` - Current line of the source file as a numeric literal.
    * `__DATE__` - Current system date as a string.
    * `__TIME__` - Current system time as a string.
    * `__TIMESTAMP__` - Date and time (non-standard).
    * `__cplusplus` - Undef when C code is being compiled by a C compiler, `199711L` when your C code is being compiled by a C++ compiler compliant with 1998 C++ standard.
    * `__func__` - Current function name of the source file as a string.
    * `__PRETTY_FUNCTION__` - Decorated current function name of the source file as a string. (In GCC, non-standard).

### Keywords

### Reserved Identifiers

### Functions

* Every function must be both declared and defined.
    * Declarations include a prototype of the function's interface.
    * Definitions include a body which transforms input to output.
    * Example:

        ```C
        int round(float);       /* Declaration */
        
        int round(float x)      /* Definition  */
        {
            int y;
            y = (int) (x + 0.5);
            return(y);
        }
        ```

## Standard Libraries

### C90 Standard Headers

* `<assert.h>` - Defines `assert()`
    * `assert(a != 1)` - Macro that implements a runtime assertion.
    * If the assertion is false (equal to 0), `assert()` writes info about the call on `STDERR` and then calls `abort()`.
    * Only fires if debugging is enabled. If the `NDEBUG` macro is enabled before the inclusion of `<assert.h>`, will not fire.
* `<ctype.h>` - Defines character classification tests/lookups like `isdigit()`
    * `isalnum()` - Is alphanumeric?
    * `isalpha()` - Is alphabetic?
    * `islower()` / `isupper()` - Is upper/lower case?
    * `isdigit()` - Is digit?
    * `isxdigit()` - Is hex digit?
    * `iscntrl()` - Is control character?
    * `isgraph()` - Is graphical character?
    * `isspace()` - Is space?
    * `isblank()` - Is blank space character?
    * `isprint()` - Is printable character?
    * `ispunct()` - Is punctuation?
    * `tolower()` / `toupper()` - Convert case.
* `<errno.h>` - Defines macros for reporting and retrieving error conditions using the symbol `errno`
    * `errno` acts like an integer variable, at startup is `0`
    * A value is stored in `errno` by some library functions on error
    * The `errno` macro expands to an `lvalue` of type `int`, sometimes with `extern` and/or `volatile` type specifiers.
    * The header file also defines macros that expand to integer constants representing error codes. There are a number of them, but the C standard library only requires that three be defined:
        * `EDOM` - parameter outside a function's domain (`sqrt(-1)`)
        * `ERANGE` - Result outside a function's range (`strtol("0xfffffffff",NULL,0)` on systems with 32 bit wide `long`)
        * `EILSEQ` - Illegal byte sequence (`mbstowcs(buf,"xff",1)` on systems using UTF-8)
* `<float.h>` - Defines macros for floating point types:
    * `[FLT|DBL|LDBL]_MIN` - Minimum normalized positive value of float, double, long double.
    * `[FLT|DBL|LDBL]_TRUE_MIN` - Minimum positive value of float, double, long double.
    * `[FLT|DBL|LDBL]_MAX` - Maximum finite value of float, double, long double.
    * `FLT_ROUNDS` - Rounding mode for float operations.
    * `FLT_EVAL_METHOD` - Evaluation method of expressions involving different floating point types.
    * `FLT_RADIX` - Radix of the exponent in float types
    * `[FLT|DBL|LDBL]_DIG` - Number of decimal digits that can be represented without losing precision in float, double, long double.
    * `[FLT|DBL|LDBL]_EPSILON` - Difference between 1.0 and the next representable value in floating-point significands for float, double, long double.
    * `[FLT|DBL|LDBL]_MANT_DIG` - Number of `FLT_RADIX`-base digits in the floating point significand for float, double, long double.
    * `[FLT|DBL|LDBL]_MIN_EXP` - Minimum negative integer such that `FLT_RADIX` raised to a power one less than that number is a normalized float, double, long double.
    * `[FLT|DBL|LDBL]_10_EXP` - Minimum negative integer such that 10 raised to that power is a normalized float, double, long double.
    * `[FLT|DBL|LDBL]_EXP` - Maximum positive integer such that `FLT_RADIX` raised to a power one less than that number is a normalized float, double, long double.
    * `[FLT|DBL|LDBL]_10_EXP` - Maximum positive integer such that 10 raised to that power is a normalized float, double, long double.
    * `DECIMAL_DIG` - Minimum number of decimal digits such that any number of the widest supported floating-point type can be represented in decimal with a precision of `DECIMAL_DIG` digits and read back in the original floating-point type without changing its value. Always at least 10.
* `<limits.h>` Defines macros for integer types:
    * `CHAR_BIT` - Size of the char type in bits (always at least 8).
    * `[SCHAR|SHRT|INT|LONG|LLONG]_MIN` - Minimum possible value of signed integer types.
    * `[UCHAR|USHRT|UINT|ULONG|ULLONG]_MAX` - Maximum possible value of unsigned integer types.
    * `CHAR_MIN` - Minimum possible value of char.
    * `CHAR_MAX` - Maximum possible value of char.
    * `MB_LEN_MAX` - Maximum number of bytes in a multibyte character.
* `<locale.h>` - Defines localization functions:
    * `setlocale()` - Sets and gets the current C locale
    * `localeconv()` - Returns numeric and monetary formatting details of the current locale.
* `<math.h>` - Defines a number of mathematical functions. Note that functions which operate on integers (`abs`, `labs`, `div`, `ldiv`) are instead defined in `<stdlib.h>`.
    * Any functions which operate on angles do so in radians.
    * Functions:
        * `fabs` - Absolute value of a float
        * `fmod` - Remainder of the floating point division operation
        * `remainder` - Signed remainder of the division operation
        * `remquo` - Signed remainder and last three bits of the division operation
        * `fma` - Fused multiply-add operation
        * `fmax` - Larger of two float values
        * `fmin` - Smaller of two float values
        * `fdim` - Positive difference of two floats
        * `nan`, `nanf`, `nanl` - Returns NaN
    * Exponential functions:
        * `exp` - `e` raised to given power
        * `exp2` - 2 raised to given power
        * `expm1` - `e` raised to given power, minus 1
        * `log` - Natural log (base `e`)
        * `log2` - Binary log (base 2)
        * `log10` - Common log (base 10)
        * `log1p` - Natural log (base `e`) of 1 plus given number
        * `ilogb` - Extracts exponent of the number
    * Power functions:
        * `sqrt` - Square root
        * `cbrt` - Cube root
        * `hypot` - Computes square root of the sum of the squares of two given numbers
        * `pow` - Raises a number to a given power
    * Trig functions:
        * `sin`, `cos`, `tan`
        * `asin`, `acos`, `atan`, `atan2`
    * Hyperbolic functions:
        * `sinh`, `cosh`, `tanh`
        * `asinh`, `acosh`, `atanh`
    * Error and Gamma functions:
        * `erf` - Computes error function
        * `erfc` - Computes complementary error function
        * `lgamma` - Computes natural log of the absolute value of the gamma function
        * `tgamma` - Computes gamma function
    * Nearest integer and float functions:
        * `ceil`, `floor`, `round`, `lround`, `llround`, `trunc`
        * `nearbyint` - Nearest int using current rounding mode
        * `rint`, `lrint`, `llrint`
    * Floating point manipulation functions:
        * `frexp` - Decomposes number into significand and power of 2
        * `ldexp` - Multiples a number by 2 raised to a power
        * `modf` - Decomposes number into integer and fractional parts
        * `scalbn`, `scalbln` - Multiplies a number by `FLT_RADIX` raised to a power
        * `nextafter`, `nexttoward` - Returns next representable floating point value towards the given value
        * `copysign` - Copies the sign of a floating point value
    * Classification functions:
        * `fpclassify` - Categorizes a floating point value
        * `isfinite`, `isinf`
        * `isnan`
        * `isnormal`
        * `signbit` - Check if a number is negative
* `<setjmp.h>` - Provides non-local jumps, control flow that deviates from the normal subroutine call and return sequence.
    * Functions:
        * `int setjmp(jmpbuf env)` - Sets up the local `jmp_buf` buffer and initializes it for the jump. Saves the program's calling environment in the environment buffer for later use by `longjmp`.
        * `void longjmp(jmp_buf env, int value)` - Restores the context of the environment buffer `env` saved by invocation of `setjmp`
* `<signal.h>` - Defines how a program handles signals during execution
    * Signals can report both exceptional behavior (divide by zero) or asynchronous events outside the program, like keystrokes.
    * Standard signals:
        * `SIGABRT` - abort, abnormal termination
        * `SIGFPE` - floating point exception
        * `SIGILL` - Illegal, invalid instruction
        * `SIGINT` - Interrupt, interactive attention request sent to program
        * `SIGSEGV` - Segmentation violation, invalid memory access
        * `SIGTERM` - Terminate, termination request sent to program
    * Signals may be generated by `raise()` or `kill()` system calls
    * `raise()` - Sends a signal to the current process
    * `kill()` - Sends a signal to a specific process
    * Signal handlers are functions called by the target environment when a specific signal occurs. The target environment suspends execution until the signal handler returns or calls `longjmp()`.
    * Signal handlers can be set with `signal()` or `sigaction()`
* `<stdarg.h>` - Allows functions to accept an indefinite number of args
    * Typically used in variadic functions (functions that can take a variable number of args, declared with an ellipsis in place of last param)
    * Declaration and definition of variadic functions:

        ```C
        int check(int a, double b, ...);

        int check(int a, double b, ...) { /* ... */ }
        ```

* `<stddef.h>`
* `<stdio.h>`
* `<stdlib.h>`
    * Type conversion functions:
        * `atof` - String to double (NOT float)
        * `atoi` - String to integer
        * `atol` - String to long
        * `strtod` - String to double
        * `strtol` - String to long int
        * `strtoul` - String to unsigned long int
        * `strtoll` - String to long long int
        * `strtoull` - String to unsigned long long int
    * Pseudo-random sequence generation functions:
        * `int rand(void)` - Generates pseudo-random number
        * `int random(void)` - (Same, but non-standard, provided by POSIX)
        * `void srand(unsigned int seed)` - Set the `rand()` pseudo-random generator seed (common convention uses `time()` to seed)
        * `void srandom(unsigned int seed)` - Same, non-standard, POSIX
    * Memory allocation and deallocation functions:
        * `malloc`, `calloc`, `realloc` - Allocate memory from heap
        * `free` - Release memory back to heap
    * Process control functions:
        * `/abort/` - Terminate execution abnormally
        * `atexit` - Register a callback function for program exit
        * `exit` - Terminate program execution
        * `getenv` - Retrieve environment variable
        * `system` - Execute an external command
    * Sorting, searching, comparison functions:
        * `bsearch` - Binary search an array
        * `qsort` - Sort an array
    * Mathematics functions:
        * `int abs(int)` - Absolute value of an integer
        * `long int abs(long int)` - Absolute value of a long integer
        * `div` - Integer division (returns quotient and remainder)
        * `ldiv` - Long integer division (returns quotient and remainder)
    * Multibyte / wide character functions:
        * `mblen` - Size of multibyte char
        * `mbtowc`, `wctomb`, `mbstowcs`, `wcstombs` - Multibyte and wide character conversion
* `<string.h>`
* `<time.h>`

### Post-C90 Headers

* `<complex.h>`
* `<fenv.h>`
* `<inttypes.h>`
* `<iso646.h>`
* `<stdbool.h>`
* `<stdint.h>`
* `<tgmath.h>`
* `<wchar.h>`
* `<wctype.h>`
