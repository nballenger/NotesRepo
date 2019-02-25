# Notes on Hands-On Geospatial Analysis with R and QGIS

By Shammunul Islam, Packt Publishing, Nov. 2018

ISBN 9781788991674

# Setting up R and QGIS Environments for Geospatial Tasks

## Basic Data Types and Data Structures in R

### Basic Data Types in R

* Three main types:
    * Numerics - any numbers with decimal values, and integers
    * Logical / Boolean - `TRUE` and `FALSE`
    * Character - text values, inside double quotes

### Variable

* Variable is a container that holds values of different types or the same type
* Variable assignment can be `x <- 2` or `x = 2`
* R community prefers the assignment arrow

### Data Structures in R

#### Vectors

* Store single or multiple values of similar data types in a variable
* One dimensional arrays
* To assign multiple values into a vector, use `c()`: `x = c(1,2,3,4,5)`
* You can mix data types in a vector, but they all get cast to the same thing
* R attempts to cast all data types in a vector to the same type
* You can check the class of a variable with `class(varname)`
* You can give labels to different values in a vector: `temp = c(morning = 20, before_noon = 23, after_noon = 25, evening = 20)`

##### Basic operations with vector

```R
jan_price = c(10, 20, 30)
increase = c(1, 2, 3)
mar_price = jan_price + increase
```

* Vector ops that do element-wise computation: `+`, `-`, `*`, `/`
* Boolean ops will test a value against each element, like `mar_price > 15`
* Indexing into a vector is 1-based
* Negative indexing doesn't work like you'd think--it gives you all but that element

#### Matrix

* Matrix is a 2D array with a certain number of rows and columns
* Matrices can also only contain one type of element
* When creating a matrix the default behavior is to turn vectors into columns
* To have a row-wise matrix made, use `byrow=TRUE`
* Creating a matrix:

    ```R
    alpha = c(1,2,3)
    bravo = c(4,5,6)
    charlie = c(7,8,9)
    A = matrix(c(alpha,bravo,charlie), nrow=3)
    B = matrix(c(alpha,bravo,charlie), nrow=3, byrow=TRUE)
    ```

#### Array

* Arrays are like matrices but with more dimensions
* The following produces an array, `combined`, which has two matrices of 3x3

```R
> jan_18 = c(10,11,20)
> mar_18 = c(20,22,25)
> jun_18 = c(30,33,33)
> jan_17 = c(10,10,17)
> mar_17 = c(18,23,21)
> jun_17 = c(25,31,35)
> combined = array(c(jan_18, mar_18, jun_18, jan_17, mar_17, jun_17), dim=c(3,3,2))
> combined
, , 1

     [,1] [,2] [,3]
[1,]   10   20   30
[2,]   11   22   33
[3,]   20   25   33

, , 2

     [,1] [,2] [,3]
[1,]   10   18   25
[2,]   10   23   31
[3,]   17   21   35
```

#### Data frames

* Like matrices, but allows a mix of different element types
* Access to items in a data frame is via either `[[]]` or `$`
* Add a row using `rbind()`

```R
> alpha = c("one","two","three")
> bravo = c(1,2,3)
> charlie = c(TRUE,FALSE,TRUE)
> my_frame = data.frame(alpha, bravo, charlie)
> my_frame
  alpha bravo charlie
1   one     1    TRUE
2   two     2   FALSE
3 three     3    TRUE
> my_frame$bravo
[1] 1 2 3
> my_frame[["alpha"]]
[1] one   two   three
Levels: one three two
> my_frame[2,3]
[1] FALSE
```

#### Lists

#### Factor

## Looping, functions, and apply family in R

### Looping in R

### Functions in R

### Apply family - lapply, sapply, apply, tapply

#### apply

#### lapply

#### sapply

#### tapply

## Plotting in R

