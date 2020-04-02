# Notes on Modern C

By Jens Gustedt; Manning Publications, Dec. 2019; ISBN 9781617295812

# Level 0: Encounter

# Chapter 1: Getting Started

* C programs are imperative.
* First program:

    ```C
    /* This may look like nonsense, but really is -*- mode: C -*- */
    #include <stdlib.h>
    #include <stdio.h>

    int main(void) {
        // Declarations
        double A[5] = {
            [0] = 9.0,
            [1] = 2.9,
            [4] = 3.E+25,
            [3] = .00007,
        };

        // Doing some work
        for (size_t i = 0; i < 5; ++i) {
            printf("element %zu is %g, \tits square is %g\n",
                   i,
                   A[i],
                   A[i] * A[i]);
        }

        return EXIT_SUCCESS;
    }
    ```

## 1.1 Imperative Programming


