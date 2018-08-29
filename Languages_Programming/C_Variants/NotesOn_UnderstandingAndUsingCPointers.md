# Notes on Understanding and Using C Pointers

By Richard Reese; O'Reilly Media 2013; ISBN 9781449344184

# Chapter 1: Introduction

## Pointers and Memory

* A compiled C program works with three types of memory:
    * Static/global - Allocated on start, remain in existence until termination
    * Automatic - Variables declared within a function, created when the function is called. Scope and lifetime are restricted to the function.
    * Dynamic - Memory allocated from the heap, released as necessary, referenced by pointers. Scope limited to the pointer(s) that reference the memory. Exists until released.
* Uses of pointers:
    * Supports dynamic memory allocation
    * Makes expressions compact and succinct
    * Allows pass by reference
    * Protects data passed as a parameter
* Problems with pointers:
    * Accessing arrays or other structures outside their bounds
    * Referencing automatic vars after they are de-scoped
    * Referencing heap memory after it is released
    * Dereferencing a pointer before memory is allocated to it
* Pointer usage is largely defined, but may also be:
    * Implementation-defined - compiler or hardware specific details
    * Unspecified - implementation provided but not documented
    * Undefined - No requirements imposed; anything can happen

### Declaring Pointers

```C
int num;        // declares an integer variable
int *pi;        // declares a pointer to an integer

// The following are all equivalent; whitespace is immaterial:
int* pi;
int * pi;
int *pi;
int*pi;
```

* Until initialized, a declared pointer contains garbage
* Accessing uninitialized pointers will typically halt the program
* There is nothing inherent to a pointer's implementation that type checks
* The compiler may still complain about misuse by type since it is declared

### How to read a declaration

* Read pointer declarations backwards
* Example declaration: <code>const int *pci;</code>
* Reading it backwards:
    1. <code>const int *<b>pci</b>;</code> - pci is a variable
    1. <code>const int <b>*pci</b>;</code> - pci is a pointer variable
    1. <code>const <b>int *pci</b>;</code> - pci is a pointer variable to an integer
    1. <code><B>const int *pci</b>;</code> - pci is a pointer variable to a constant integer

### Address Of Operator

```C
// Declaration
int num;            // declares variable of type int, assigns memory location
int *pi = &num;     // sets the pointer variable to that memory location

// Declaration and initialization
int num = 0;        // initializes memory address 100 to value 0
int *pi = &num;     // initializes pi to the memory address 100

// Casting an integer to a pointer to an integer
pi = (int *)num;    // may terminate as it attempts to dereference the value
                    // at address 0
```
