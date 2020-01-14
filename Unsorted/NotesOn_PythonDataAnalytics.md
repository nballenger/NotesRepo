# Notes on Python Data Analytics: With Pandas, NumPy, and Matplotlib

By Fabio Nelli; Apress, Sept. 2018; ISBN 9781484239131

# 1. An Introduction to Data Analysis

## Data Analysis

* 'data analysis' - extracting information from raw data
* 'models' - translation of a system under study into a mathematical form
* 'predictive power' - overall quality/value of a model; aim of data analysis
* phases of data analysis:
    * search
    * extraction
    * preparation
    * analysis and visualization
    * deployment

## Knowledge Domains of the Data Analyst

* Computer science
    * necessary for efficient management / usage of toolsets
    * both calcuation software and programming languages
    * database formats and structures
    * web scraping
* Mathematics and statistics
    * conceptual framework comes from stats
    * good to understand
        * Bayesian methods
        * Regression
        * Clustering
* ML and AI
* Professional fields of application
* Domain knowledge about the data under study

## Understanding the Nature of the Data

* Data &rarr; Information &rarr; Knowledge
* Types of data:
    * Categorical (nominal, ordinal)
    * Numerical (discrete, continuous)

## The Data Analysis Process

* Schematized as a process chain along this sequence:
    1. Problem definition
        * focus on the system to study
        * define a problem to be solved
        * create documentation of deliverables
        * project / process planning
    1. Data extraction
        * choose data for building a predictive model
        * identify and vet data sources
        * make sure data is representative
    1. Data preparation: cleaning
    1. Data preparation: transformation
        * deal with invalid, ambiguous, missing, duplicate, out-of-range data
        * prep data into formats that will work with the process
    1. Data exploration and visualization
        * Look for patterns, connections, relationships
        * activities include summarizing, grouping, regression, classification
        * 'summarization' - data reduced to interpretation
        * 'clustering' - finding groups united by common attributes
        * 'identification' - finding relationships, trends, anomalies
    1. Predictive modeling
        * developing mathematical models that encode relationships in the data
        * 'regression models' - make predictions about data values produced by teh system under study
        * 'classification models' / 'clustering models' - classify new data products
        * division of models by result type:
            * classification - result obtained is categorical
            * regression - result is numeric
            * clustering - result is descriptive
        * techniques:
            * linear regression
            * logistic regression
            * classification and regression trees
            * k-nearest neighbors
    1. Model validation / test
        * validate the model built on the basis of starting data
        * 'training set' - data used to build the model
        * 'validation set' - data used to validate the model
        * Model error obtained by comparing performance on training/validation
        * Multiple techniques for that, most famous is cross-validation
        * cross-validation divides training set into parts, uses each part in turn as validation and training set, iteratively improves the model.
    1. Deploy: Visualization and interpretation of results
        * analysis translated into some benefit for the client
    1. Deploy: Deployment of solution
        * Most deployment consists of writing a report
        * In that document, you cover
            * Analysis results
            * Decision deployment
            * Risk analysis
            * Measurement of business impact

## Quantitative and Qualitative Data Analysis

* 'quantitative analysis' - when the analyzed data have a strictly numerical or categorical structure
* 'qualitative analysis' - when the values are expressed in natural language
* Quantitative analysis leads to quantitative predictions
* Qualitative analys leads to qualitative predictions, which may include subjective interpretations, but can explore more complex systems and derive non-mathematical conclusions

## Open Data

* Lots of data sources available now
    * DataHub
    * World Health Organization
    * Data.gov
    * EU Open Data Portal
    * AWS public data sets
    * Facebook graph
    * Healthdata.gov
    * Google Trends
    * Google Finance
    * Google Books Ngrams
    * Machine Learning Repository

## Python and Data Analysis

* It's useful.

# 2: Introduction to the Python World

# 3: The NumPy Library

## NumPy: A Little History

* 'Numeric' lib was created in 1995 by Jim Hugunin
* Followed by 'Numarray'
* Both specialized in calculations on arrays
* Ambiguities of usage led to idea of unifying the packages
* Travis Oliphant started workon NumPy, v1.0 in 2006
* Currently most widely used package for calculations on multidimensional arrays and large arrays
* Open source, under BSD license

## The NumPy Installation

## Ndarray: The Heart of the Library

* Lib is based on one main object, `ndarray` (N-dimensional array)
* Multi-dimensional, homogeneous array with a predetermined number of items
* Data type specified by a `dtype` object, each ndarray associated with only one dtype
* Number of dimensions and items is defined by an array's 'shape'
* Shape is a tuple of N positive integers specifying the size of each dimension
* 'axes' - syn. for dimensions
* 'rank' - number of axes
* Note that sizes are fixed, unlike normal Python arrays
* Easiest way to define a new ndarray is `array(<list_literal>)` function

    ```
>>> a = np.array([1,2,3])
>>> a
array([1, 2, 3])
>>> type(a)
<class 'numpy.ndarray'>
>>> a.dtype
dtype('int64')
>>> a.ndim
1
>>> a.size
3
>>> a.shape
(3,)
    ```

* The above is a 1 dimensional array
* Defining a 2x2:

    ```
>>> b = np.array([ [1.3, 2.4], [0.3, 4.1] ])
>>> b.dtype
dtype('float64')
>>> b.ndim
2
>>> b.size
4
>>> b.shape
(2, 2)
>>> b.itemsize
8
>>> b.data
<memory at 0x112e12120>
    ```

* `itemsize` is the size in bytes of each item in the array
* `data` is the buffer with the actual elements of the array
* Mostly you just index into the data
* Several ways to create ndarrays
    * pass list or list of lists to `array()`
    * pass tuples, sequence of tuples to `array()`
    * pass sequences of tuples and interconnected lists
* Examples

    ```
>>> c = np.array([ [1,2,3], [4,5,6] ])
>>> c
array([[1, 2, 3],
       [4, 5, 6]])
>>> d = np.array( ( (1,2,3), (4,5,6) ) )
>>> d
array([[1, 2, 3],
       [4, 5, 6]])
>>> e = np.array( [ (1,2,3), [4,5,6], (7,8,9) ] )
>>> e
array([[1, 2, 3],
       [4, 5, 6],
       [7, 8, 9]])
    ```

* NumPy arrays can contain a wide variety of data types
* String example:

    ```
>>> g = np.array( [ ['a','b'], ['c','d'] ] )
>>> g
array([['a', 'b'],
       ['c', 'd']], dtype='<U1')
>>> g.dtype
dtype('<U1')
>>> g.dtype.name
'str32'
    ```

* Data types supported in NumPy:
    * `bool_` - boolean, stored as a byte
    * `int_` - default integer, equiv to C long, typically int64 or int32
    * `intc` - identical to C int
    * `intp` - integer used for indexing, same as C `size_t`
    * `int8` - Byte (-128 to 127)
    * `int16` - Integer (-32768 to 32767)
    * `int32` - Integer (-2,147,483,648 to 2,147,483,647)
    * `int64` - Integer (negative lots to positive lots)
    * `uint8`, `uint16`, `uint32`, `uint64`
    * `float_` - shorthand for `float64`
    * `float16`, `float32`, `float64`
    * `complex_` - shorthand for `complex128`
    * `complex64` - complex, two 32-bit floats
    * `complex128` - two 64-bit floats
* The `array()` function can impute the most suitable dtype
* You can also explicitly define the dtype:

    ```
>>> f = np.array( [ [1,2,3], [4,5,6] ], dtype=complex)
>>> f
array([[1.+0.j, 2.+0.j, 3.+0.j],
       [4.+0.j, 5.+0.j, 6.+0.j]])
    ```

* The lib has lots of functions that implicitly create ndarrays with initial context
* `zeros()` creates a full array of zeros
* `ones()` does the same for ones

    ```
>>> np.zeros((3,3))
array([[0., 0., 0.],
       [0., 0., 0.],
       [0., 0., 0.]])
>>> np.ones((3,3))
array([[1., 1., 1.],
       [1., 1., 1.],
       [1., 1., 1.]])
    ```

* Those default to `float64` dtypes
* The `arange()` function creates np arrays with numerical sequences that correspond to particular rules depending on the passed arguments.
* Examples:

    ```
>>> np.arange(0,10) # generate sequence of values, 0 to 10
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
>>>
>>> np.arange(4,10) # generate sequence from 4 to 10
array([4, 5, 6, 7, 8, 9])
>>>
>>> np.arange(0,12,3) # generate sequence 0 to 12, by 3's
array([0, 3, 6, 9])
>>> np.arange(0, 6, 0.6) # 0 to 6, by .6
array([0. , 0.6, 1.2, 1.8, 2.4, 3. , 3.6, 4.2, 4.8, 5.4])
    ```

* Those are all 1D arrays, but you can use `arange()` with `reshape()` for nD:

    ```
>>> np.arange(0,12).reshape(3,4)
array([[ 0,  1,  2,  3],
       [ 4,  5,  6,  7],
       [ 8,  9, 10, 11]])

    ```

* `linspace()` takes start and end params, but the third arg is the number of elements to split the interval into:

    ```
>>> np.linspace(0,10,5)
array([ 0. ,  2.5,  5. ,  7.5, 10. ])
    ```

* You can fill an array with random values with `random()`:

    ```
>>> np.random.random(3)
array([0.45295707, 0.47459244, 0.36984018])
    ```

* To create an nD array, pass the size of the array as an arg:

    ```
>>> np.random.random((3,3))
array([[0.79074201, 0.44795311, 0.04949445],
       [0.2514501 , 0.66171761, 0.20187195],
       [0.32915933, 0.81794014, 0.86900402]])
    ```

## Basic Operations

* Arithmetic operators
    * Adding and multiplying an array by a scalar:

        ```
>>> a = np.arange(4)
>>> a
array([0, 1, 2, 3])
>>> a + 4
array([4, 5, 6, 7])
>>> a * 2
array([0, 2, 4, 6])
        ```

    * Using them between arrays in element-wise operations:

        ```
>>> b = np.arange(4,8)
>>> b
array([4, 5, 6, 7])
>>> a + b
array([ 4,  6,  8, 10])
>>> a - b
array([-4, -4, -4, -4])
>>> a * b
array([ 0,  5, 12, 21])
        ```

    * The operators also work on functions that return numpy arrays
    * Example that multiplies the array by the sine or sqrt of the elements of b:

        ```
>>> a * np.sin(b)
array([-0.        , -0.95892427, -0.558831  ,  1.9709598 ])
>>> a * np.sqrt(b)
array([0.        , 2.23606798, 4.89897949, 7.93725393])
        ```

    * In the multi-dimensional case, they perform element-wise:

        ```
>>> A = np.arange(0,9).reshape(3,3)
>>> A
array([[0, 1, 2],
       [3, 4, 5],
       [6, 7, 8]])
>>> B = np.ones((3,3))
>>> B
array([[1., 1., 1.],
       [1., 1., 1.],
       [1., 1., 1.]])
>>> A * B
array([[0., 1., 2.],
       [3., 4., 5.],
       [6., 7., 8.]])
        ```

    * In most tools, the `*` operator is the matrix product when applied to two matrices. In numpy, you get that via `dot()`, which is not element-wise:

        ```
>>> np.dot(A,B)
array([[ 3.,  3.,  3.],
       [12., 12., 12.],
       [21., 21., 21.]])
>>> A.dot(B)
array([[ 3.,  3.,  3.],
       [12., 12., 12.],
       [21., 21., 21.]])
        ```

    * Result at each position is the sum of the products of each element of the corresponding row of the first matrix with the corresponding element of the corresponding column of the second matrix.
    * Remember that dot product is not commutative, so `(A*B)` != `(B*A)`
* Increment and decrement operators
    * You have to use `-=` and `+=` (no autoinc/autodec in Python)
    * Instead of creating a new array with results, they reassign results in place, performing element-wise ops on each element:

        ```
>>> a = np.arange(4); a
array([0, 1, 2, 3])
>>> a += 1; a
array([2, 3, 4, 5])
>>> a -= 1; a
array([1, 2, 3, 4])
        ```

    * You can also use `*=` and `//=`, but not `/=`:

        ```
>>> a = np.arange(4); a
array([0, 1, 2, 3])
>>> a *= 2; a
array([0, 2, 4, 6])
>>> a //= 2; a
array([0, 1, 2, 3])
>>>
>>> a /= 2; a
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: No loop matching the specified signature and casting was found for ufunc true_divide
        ```

* Universal functions (ufunc):
    * A universal function, usually called `ufunc`, is a function that operates on an array in an element by element fashion to produce a new output array.
    * Lots of functions meet the definition, like `sqrt()`, `log()`, `sin()`, etc.

        ```
>>> a = np.arange(1,5); a
array([1, 2, 3, 4])
>>> np.sqrt(a)
array([1.        , 1.41421356, 1.73205081, 2.        ])
>>> np.log(a)
array([0.        , 0.69314718, 1.09861229, 1.38629436])
>>> np.sin(a)
array([ 0.84147098,  0.90929743,  0.14112001, -0.7568025 ])
        ```

* Aggregate functions
    * These perform an operation on a set of values and produce a single result:

        ```
>>> a = np.array([3.3, 4.5, 1.2, 5.7, 0.3])
>>> a.sum()
15.0
>>> a.min()
0.3
>>> a.max()
5.7
>>> a.mean()
3.0
>>> a.std()
2.0079840636817816
        ```

## Indexing, Slicing, and Iterating

* Indexing is via `[ ]`
* Negative indices are accepted

    ```
>>> a = np.arange(10,16); a
array([10, 11, 12, 13, 14, 15])
>>> a[4]
14
>>> a[-1]
15
    ```

* Select multiple items at once by passing an array of indices:

    ```
>>> a[ [1,3,4] ]
array([11, 13, 14])
    ```

* In the 2D case, the array has two axes, with axis 0 being the rows and axis 1 being the columns.
* Indexing for that is represented as a pair of values, first the row index and then the column index
* To access elements:

    ```
>>> A = np.arange(10, 19).reshape((3,3)); A
array([[10, 11, 12],
       [13, 14, 15],
       [16, 17, 18]])
>>> A[1,2]
15
    ```

* In raw Python, slicing arrays produces copies, but NumPy returns views of the underlying buffer
* Depending on the portion of the array you want to extract/view, you use a sequence of colon separated indices in brackets
* Syntax is `arrayname[<start>:<end>:<jump_by>]`:

    ```
>>> a = np.arange(10,16); a
array([10, 11, 12, 13, 14, 15])
>>> a[1:5]
array([11, 12, 13, 14])
>>> a[1:5:2]
array([11, 13])
>>> a[::2]
array([10, 12, 14])
>>> a[:5:2]
array([10, 12, 14])
>>> a[:5:]
array([10, 11, 12, 13, 14])
    ```

* For a 2D array, the slicing syntax applies but is separately defined for the rows and columns:

    ```
>>> A
array([[10, 11, 12],
       [13, 14, 15],
       [16, 17, 18]])
>>> A[0,:]     # extract the first row
array([10, 11, 12])
>>> A[:,0]     # extract the first column
array([10, 13, 16])
>>> A[0:2,0:2] # extract a smaller matrix
array([[10, 11],
       [13, 14]])
>>> A[ [0,2], 0:2 ] # extract non-contiguous items
array([[10, 11],
       [16, 17]])
    ```

* Iterating an array
    * In raw python you just use `for i in x`
    * A `for` loop applied to a matrix (`for row in A`) works
    * Element by element uses `for item in A.flat`
    * There's a better solution native to NumPy
    * Usually you need to apply an iteration to apply a function on the rows or columns, or on an individual item. To launch an aggregate function that returns a value calculated for every single column or on every single row, NumPy offers `apply_along_axis()`
    * Takes three args:
        * aggregate function
        * axis on which to apply the iteration
        * the array to apply to
    * For `axis=0`, iterates the elements column by column
    * For `axis=1`, iterates elements row by row
    * Example of average values by column, then by row:

        ```
>>> A
array([[10, 11, 12],
       [13, 14, 15],
       [16, 17, 18]])
>>> np.apply_along_axis(np.mean, axis=0, arr=A)
array([13., 14., 15.])
>>> np.apply_along_axis(np.mean, axis=1, arr=A)
array([11., 14., 17.])
        ```

    * Using a custom aggregation function:

        ```
>>> def foo(x):
...     return x/2
... 
>>> A = np.arange(10, 19).reshape((3, 3))
>>> np.apply_along_axis(foo, axis=1, arr=A)
array([[5. , 5.5, 6. ],
       [6.5, 7. , 7.5],
       [8. , 8.5, 9. ]])
>>> np.apply_along_axis(foo, axis=0, arr=A)
array([[5. , 5.5, 6. ],
       [6.5, 7. , 7.5],
       [8. , 8.5, 9. ]])
        ```

* Conditions and Boolean Arrays
    * Previous methods of indexing/slicing use numeric indices
    * Alternatively, you can selectively extract elements using conditions and boolean operators
    * Selecting all values less than 0.5 in a 4x4 matrix of random numbers, 0 to 1:

        ```
>>> A = np.random.random((4,4))
>>> A
array([[0.11095042, 0.45610843, 0.71270219, 0.11566473],
       [0.0926572 , 0.31811865, 0.64358481, 0.65274131],
       [0.32189311, 0.00284351, 0.3764614 , 0.4000418 ],
       [0.54012505, 0.68069606, 0.93447276, 0.88875673]])
>>> A < 0.5
array([[ True,  True, False,  True],
       [ True,  True, False, False],
       [ True,  True,  True,  True],
       [False, False, False, False]])
>>> A[A < 0.5]
array([0.11095042, 0.45610843, 0.11566473, 0.0926572 , 0.31811865,
       0.32189311, 0.00284351, 0.3764614 , 0.4000418 ])
        ```

* Shape Manipulation
    * You can convert a 1D array into a matrix with `reshape()`
    * `reshape()` returns a new array and can therefore create new objects
    * If you want to modify the object by modifying the shape, you have to assign a tuple containing the new dimensions directly to its `shape` attribute:

        ```
>>> a = np.random.random(12)
>>> a
array([0.00275948, 0.19798779, 0.49805816, 0.89672316, 0.27925186,
       0.06014288, 0.83370063, 0.99723086, 0.57296471, 0.74087588,
       0.07180802, 0.96624079])
>>> A = a.reshape(3,4)
>>> A
array([[0.00275948, 0.19798779, 0.49805816, 0.89672316],
       [0.27925186, 0.06014288, 0.83370063, 0.99723086],
       [0.57296471, 0.74087588, 0.07180802, 0.96624079]])
>>> a
array([0.00275948, 0.19798779, 0.49805816, 0.89672316, 0.27925186,
       0.06014288, 0.83370063, 0.99723086, 0.57296471, 0.74087588,
       0.07180802, 0.96624079])
>>> a.shape = (3,4)
>>> a
array([[0.00275948, 0.19798779, 0.49805816, 0.89672316],
       [0.27925186, 0.06014288, 0.83370063, 0.99723086],
       [0.57296471, 0.74087588, 0.07180802, 0.96624079]])
        ```

    * You can also do the inverse (2D array to 1D) using `ravel()`, or by manipulating the `shape` attribute:

        ```
>>> a.ravel()
array([0.00275948, 0.19798779, 0.49805816, 0.89672316, 0.27925186,
       0.06014288, 0.83370063, 0.99723086, 0.57296471, 0.74087588,
       0.07180802, 0.96624079])
>>> a.shape = (12)
>>> a
array([0.00275948, 0.19798779, 0.49805816, 0.89672316, 0.27925186,
       0.06014288, 0.83370063, 0.99723086, 0.57296471, 0.74087588,
       0.07180802, 0.96624079])
        ```

    * You can also transpose a matrix (inverting the columns and rows), with `transpose()`:

        ```
>>> A
array([[0.00275948, 0.19798779, 0.49805816, 0.89672316],
       [0.27925186, 0.06014288, 0.83370063, 0.99723086],
       [0.57296471, 0.74087588, 0.07180802, 0.96624079]])
>>> A.transpose()
array([[0.00275948, 0.27925186, 0.57296471],
       [0.19798779, 0.06014288, 0.74087588],
       [0.49805816, 0.83370063, 0.07180802],
       [0.89672316, 0.99723086, 0.96624079]])
        ```

* Array Manipulation
    * Often you need to create an array from already created arrays
    * You can merge multiple arrays to form a new one, which NumPy does via 'stacking'
    * Vertical stacking is done with `vstack()`, which combines the second array as new rows of the first array
    * Horizontal stacking is done with `hstack()`, which adds the second array as additional columns of the first array

        ```
>>> A = np.ones((3,3))
>>> B = np.zeros((3,3))
>>> np.vstack((A,B))
array([[1., 1., 1.],
       [1., 1., 1.],
       [1., 1., 1.],
       [0., 0., 0.],
       [0., 0., 0.],
       [0., 0., 0.]])
>>> np.hstack((A,B))
array([[1., 1., 1., 0., 0., 0.],
       [1., 1., 1., 0., 0., 0.],
       [1., 1., 1., 0., 0., 0.]])
       ```

    * `column_stack()` and `row_stack()` also perform array stacking, but work differently than `vstack()` and `hstack()`
    * They are mostly used with 1D arrays, which are stacked as columns or rows to form a new 2D array:

        ```
>>> a = np.array([0,1,2])
>>> b = np.array([3,4,5])
>>> c = np.array([6,7,8])
>>> np.column_stack((a,b,c))
array([[0, 3, 6],
       [1, 4, 7],
       [2, 5, 8]])
>>> np.row_stack((a,b,c))
array([[0, 1, 2],
       [3, 4, 5],
       [6, 7, 8]])
        ```

    * You can also split arrays with `hsplit()` and `vsplit()`:

        ```
>>> A = np.arange(16).reshape((4,4))
>>> A
array([[ 0,  1,  2,  3],
       [ 4,  5,  6,  7],
       [ 8,  9, 10, 11],
       [12, 13, 14, 15]])
>>> [B,C] = np.hsplit(A, 2)
>>> B
array([[ 0,  1],
       [ 4,  5],
       [ 8,  9],
       [12, 13]])
>>> C
array([[ 2,  3],
       [ 6,  7],
       [10, 11],
       [14, 15]])
>>> [D,E] = np.vsplit(A, 2)
>>> D
array([[0, 1, 2, 3],
       [4, 5, 6, 7]])
>>> E
array([[ 8,  9, 10, 11],
       [12, 13, 14, 15]])
        ```

    * There is also `split()`, which lets you split into non-symmetrical parts
    * You pass the array, and must specify the indices of the parts to divide
    * If you use `axis = 1`, the indices are column indices
    * If you use `axis = 0`, the indices are row indices
    * Example, dividing a matrix into 3 parts
        * first includes the first column
        * second includes the second and third column
        * third includes the last column
    * Code:

        ```
>>> [A1,A2,A3] = np.split(A, [1,3], axis=1)
>>> A1
array([[ 0],
       [ 4],
       [ 8],
       [12]])
>>> A2
array([[ 1,  2],
       [ 5,  6],
       [ 9, 10],
       [13, 14]])
>>> A3
array([[ 3],
       [ 7],
       [11],
       [15]])
>>> [A1,A2,A3] = np.split(A, [1,3], axis=0)
>>> A1
array([[0, 1, 2, 3]])
>>> A2
array([[ 4,  5,  6,  7],
       [ 8,  9, 10, 11]])
>>> A3
array([[12, 13, 14, 15]])
        ```

* General Concepts
    * Looking at copies/views and broadcasting
    * Copies or Views of Objects
        * You can manipulate an array to return a copy or a view
        * None of the NumPy assignments produce copies of arrays, or any element contained in them
        * Example:

            ```
>>> a = np.array([1,2,3,4])
>>> b = a
>>> b
array([1, 2, 3, 4])
>>> a[2] = 0
>>> b
array([1, 2, 0, 4])
            ```

        * When you copy an array it's by reference
        * When you slice an array, it returns a view

            ```
>>> c = a[0:2]
>>> c
array([1, 2])
>>> a[0] = 0
>>> c
array([0, 2])
            ```

        * If you want to return a complete and distinct array, use `copy()`

            ```
>>> a = np.array([1,2,3,4])
>>> c = a.copy()
>>> c
array([1, 2, 3, 4])
>>> a[0] = 0
>>> c
array([1, 2, 3, 4])
            ```

    * Vectorization
        * Vectorization and broadcasting are the basis of the internal numpy implementation.
        * 'vectorization' - absence of an explicit loop during the developing of the code. The loops can't actually be omitted, but are implemented internally and thne replaced by other constructs in the code.
        * Example is being able to do matrix multiplication with `A * B` instead of nested for loops. It's internal to the library, but your code ends up reading as Pythonic.
    * Broadcasting
        * 'broadcasting' - lets an operator or function act on two or more arrays, even if those arrays do not have the same shape
        * Not all dimensions can be subjected to broadcasting, they have to meet certain rules
        * In numpy you can classify multidimensional arrays through a shape that is a tuple representing the length of the elements of each dimension
        * Two arrays can be subjected to broadcasting when all their dimensions are compatible--the length of each dimension must be equal, or one of them must be equal to 1. If neither condition is met, you get an exception.

            ```
>>> A = np.arange(16).reshape(4,4)
>>> b = np.arange(4)
>>> A
array([[ 0,  1,  2,  3],
       [ 4,  5,  6,  7],
       [ 8,  9, 10, 11],
       [12, 13, 14, 15]])
>>> b
array([0, 1, 2, 3])
>>> A + b
array([[ 0,  2,  4,  6],
       [ 4,  6,  8, 10],
       [ 8, 10, 12, 14],
       [12, 14, 16, 18]])
            ```
