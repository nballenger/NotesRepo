# Notes on Fundamentals of Computer Graphics, 4th Ed.

# Chapter 1: Introduction

## 1.1 Graphics Areas

* Major areas:
  * **Modeling** - Specifying and storing shape and appearance information
  * **Rendering** - Creation of shaded images from 3D models
  * **Animation** - Creation of the illusion of motion via sequential renders
* Additonal areas include: user interaction, VR, visualization, image processing, 3D scanning, computational photography and CV

## 1.2 Major Applications

* Video games
* Cartoons
* Visual effects
* Animated films
* CAD/CAM
* Simulation
* Medical Imaging
* Info visualization

## 1.3 Graphics APIs

* Collection of functions to perform basic drawing operations
* Needs a graphics API for output, a UI API for input

## 1.4 Graphics Pipeline

* Hardware/software subsystem for effeciently drawing 3D primitives in perspective
* Maps 3D vertex locations to 2D screen positions, shades triangles for correct front to back realism

## 1.5 Numerical Issues

* Most everything uses IEEE floating point standard from 1985
* Special values for real numbers in floats:
  * Infinity - larger than all numbers
  * Minus Infinity - smaller than all numbers
  * Not a Number (NaN) - invalid number representing an operation with undefined consequences like divide by zero
* Also has values for positive zero and negative zero
* Rules for infinite value operations:
  * `+a / +inf = +0`
  * `-a / +inf = -0`
  * `+a / -inf = -0`
  * `-a / -inf = +0`
  * `+inf + +inf = +inf`
  * `+inf - +inf = NaN`
  * `+inf * +inf = +inf`
  * `+inf / +inf = NaN`
  * `+inf / a = +inf`
  * `+inf / 0 = +inf`
  * `0 / 0 = NaN`
* Boolean ops on infinites:
  * All finite valid numbers are less than +inf
  * All finite valid numbers are greater than -inf
  * -inf is less than +inf
* Rules for NaN expressions:
  * Any arithmetic involving NaN results in NaN
  * Any boolean involving NaN is false
* Divide by zero rules:
  * `+a / +0 = +inf`
  * `-a / +0 = -inf`
  
## 1.6 Efficiency

## 1.7 Designing and Coding Graphics Programs

### 1.7.1 Class Design

* Need good classes / routines for geometric entities and operations, and colors and images
* Recommend keeping points and vectors separate because it makes code more readable, lets the compiler catch bugs
* Classes to use:
  * **vector2** - 2D vector with x and y components in a two item array; should have ops for vector addition, vector subtraction, dot product, cross product, scalar multiplication, scalar division
  * **vector3** - 3D vector class
  * **hvector** - homogeneous vector with four components
  * **rgb** - three component color, with arithmetic ops
  * **transform** - 4x4 matrix for transformations, with ops for matrix multiply, member functions to apply to locations, directions, surface normal vectors
  * **image** - 2D array of pixel values
* Other possible classes: intervals, orthonormal bases, coordinate frames, MAYBE unit vectors

### 1.7.2 Float vs. Double

* Use doubles for geometric computation, floats for color computation
* Data that takes a lot of memory, like triangle meshes, use float but convert to double on access through member functions

### 1.7.3 Debugging Graphics Programs

* Normal debuggers help less than you'd hope
* Do your computations with floats until you find that doubles are absolutely necessary for some part
* Strategies:
  * Scientific method
  * Images as coded debugging output
  * Using a debugger with test data and checkpoints
  * Data visualization for debugging
  
# Chapter 2: Miscellaneous Math

## 2.1 Sets and Mappings

* test: a &Element; S