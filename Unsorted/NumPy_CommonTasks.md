# Common Tasks in NumPy

## Creating Arrays and Matrices

```Python
import numpy as np

# 1 dimension
a = np.array([1, 2, 3])

# 2 dimensions
b = np.array( [ [1, 2, 3], [4, 5, 6] ] )    # list of lists
c = np.array( ( (1, 2, 3), (4, 5, 6) ) )    # tuple of tuples
d = np.array( [ (1, 2, 3), [4, 5, 6] ] )    # mixed
```

## Introspecting Arrays and Matrices

```Python
import numpy as np

a = np.array([1,2,3])
print("Datatype: ", a.dtype)
print("Number of dimensions: ", a.ndim)
print("Number of elements: ", a.size)
print("Shape: ", a.shape)
print("Byte length of each item: ", a.itemsize)
print("Memory location: ", a.data)
```

# Reference

## Array Objects

* `ndarray` type describes an N-dimensional collection of homogeneous items
* Dimensions defined by a `shape` tuple of N non-negative integers
* Item type defined in a separate `dtype` object associated with the `ndarray`
* Contents accessible via indexing or slicing, and methods/attributes
* Different `ndarray` objects can share the same data (one can be a view to another)
* May also be views to memory owned by strings or objects implementing the buffer or array interfaces.
* Low level constructor: `ndarray(shape[, dtype, buffer, offset, ...])`

### Attributes of Array Objects

* Memory Layout Attributes
    * `ndarray.flags` - info about memory layout of array
    * `ndarray.shape` - tuple of array dimensions
    * `ndarray.strides` - tuple of bytes to step in each direction during traversal
    * `ndarray.ndim` - number of array dimensions
    * `ndarray.data` - python buffer object of array data
    * `ndarray.size` - number of elements
    * `ndarray.itemsize` - length of one array element in bytes
    * `ndarray.nbytes` - total bytes consumed by elements in array
    * `ndarray.base` - base object if memory is from some other object
* Data type attributes
    * `ndarray.dtype` - data type of array elements
* Other attributes
    * `ndarray.T` - transposed array
    * `ndarray.real` - real part of the array
    * `ndarray.imag` - imaginary part of the array
    * `ndarray.flat` - 1D iterator over the array
    * `ndarray.ctypes` - object to simplify interaction with `ctypes` module

### Methods of Array Objects

* Array Conversion Methods
    * `ndarray.item(*args)` - return a scalar copy of an element
    * `ndarray.tolist()` - return array as `a.ndim` levels deep nested list of scalars
    * `ndarray.itemset(*args)` - insert scalar into an array (cast to dtype)
    * `ndarray.tostring([order])` - return string of raw data bytes
    * `ndarray.tobytes([order])` - return string of raw data bytes
    * `ndarray.tofile(fid[, sep, format])` - write to file as text or binary
    * `ndarray.dump(file)` - dump pickle of array to file
    * `ndarray.dumps()` - return pickle as string
    * `ndarray.astype(dtype[, order, casting, ...])` - copy of the array, cast to type
    * `ndarray.byteswap([inplace])` - swap bytes of the array elements
    * `ndarray.copy([order])` - return copy of array
    * `ndarray.view([dtype, type])` - new view of array with same data
    * `ndarray.getfield(dtype[, offset])` - return field of given array as type
    * `ndarray.setflags([write, align, uic])` - set array flags WRITEABLE, ALIGNED, (WRITEBACKIFCOPY and UPDATEIFCOPY)
    * `ndarray.fill(value)` - fill with a scalar value
* Shape Manipulation Methods
    * `ndarray.reshape(shape[, order])` - return array with same data in new shape
    * `ndarray.resize(new_shape[, refcheck])` - change shape/size in place
    * `ndarray.transpose(*axes)` - return view with axes transposed
    * `ndarray.swapaxes(axis1, axis2)` - return view with a1 and a2 interchanged
    * `ndarray.flatten([order])` - return copy collapsed to 1D
    * `ndarray.ravel([order])` - return flattened array
    * `ndarray.squeeze([axis])` - remove single-dimensional entries from the shape
* Item Selection and Manipulation Methods
    * `ndarray.take(indices[, axis, out, model])` - return an array formed from elements of `a` at the given indices
    * `ndarray.put(indices, values[, model])` - set `a.flat[n] = values[n]` for all `n` in indices
    * `ndarray.repeat(repeats[, axis])` - repeat elements of an array
    * `ndarray.choose(choices[, out, model])` - use an index array to construct a new array from a set of choices
    * `ndarray.sort([axis, kind, order])` - sort in place
    * `ndarray.argsort([axis, kind, order])` - return indices that would sort the array
    * `ndarray.partition(kth[, axis, kind, order])` - rearrange elements in array so that value of the element in kth position is in the position it would be in a sorted version of the array
    * `ndarray.argpartition(kth[, axis, kind, order])` - return indices that would partition this array
    * `ndarray.searchsorted(v[, side, sorter])` - find indices where elements of `v` should be inserted in `a` to maintain order
    * `ndarray.nonzero()` - return indices of non-zero elements
    * `ndarray.compress(condition[, axis, out])` - return selected slices along given axis
    * `ndarray.diagonal([offset, axis1, axis2])` - return specified diagonals
* Calculation Methods
    * Many of these take an `axis` argument. For those that do:
        * If `axis` is `None` (default), array is treated as a 1D array, operation is performed over the entire array.
        * If `axis` is an integer, the operation is done on the given axis
    * The `dtype` param specifies the type over which a reduction operation (like summing) should take place. Default reduce data type is the same as the datatype of `self`. To avoid overflow, can be useful to perform the reduction using a larger type.
    * The `out` param can be provided, results will be placed into that output array. The `out` array must be an `ndarray` with the same number of elements.
    * `ndarray.max([axis, out, keepdims, initial, ...])` - return max on axis
    * `ndarray.argmax([axis, out])` - return indices of max values on axis
    * `ndarray.min([axis, out, keepdims, initial, ...])` - return min on axis
    * `ndarray.argmin([axis, out])` - return indices of min values on axis
    * `ndarray.ptp([axis, out, keepdims])` - peak to peak (max / min) value along axis
    * `ndarray.clip([min, max, out])` - return array limited to `[min,max]`
    * `ndarray.conj()` - complex-conjugate all elements
    * `ndarray.round([decimals, out])` - return `a` with each element rounded
    * `ndarray.trace([offset, axis1, axis2, dtype, out])` - return sum along diagonals
    * `ndarray.sum([axis, dtype, out, keepdims, ...])` - sum of elements on axis
    * `ndarray.cumsum([axis, dtype, out])` - cumulative sum of elements on axis
    * `ndarray.mean([axis, dtype, out, keepdims])` - return average on axis
    * `ndarray.var([axis, dtype, out, ddof, keepdims])` - return variance of elements on axis
    * `ndarray.std([axis, dtype, out, ddof, keepdims])` - return standard deviation of elements on axis
    * `ndarray.prod([axis, dtype, out, keepdims, ...])` - return product of elements on axis
    * `ndarray.cumprod([axis, dtype, out])` - return cumulative product of elements on axis
    * `ndarray.all([axis, out, keepdims])` - return True if all elements eval to True
    * `ndarray.any([axis, out, keepdims])` - return True if any elements eval to True
* Arithmetic, Matrix Multiplication, Comparison Operations
    * Arithmetic and comparison are element-wise, generally yield `ndarray` objects
    * Each arithmetic operation and comparison is equivalent to the corresponding universal function (`ufunc`)
    * Supported operations and comparisons:
        * `+ - * / // % divmod() ** pow() << >> & ^ | ~`
        * `== < > <= >= !=`
        * `+= -= *= /= //= %= **= <<= >>= &= |= ^=`
* Special Methods
    * `ndarray.__copy__()` - used if `copy.copy` is called on array
    * `ndarray.__deepcopy__()` - used if `copy.deepcopy` is called on array
    * `ndarray.__reduce__()` - for pickling
    * `ndarray.__setstate__(state,/)` - for unpickling
    * `ndarray.__new__(*args, **kwargs)` - create and return new object
    * `ndarray.__array__()` - returns either new ref to self if no dtype given or a new array of provided type if dtype is different from current
    * `ndarray.__array_wrap__()`
    * `ndarray.__len__(self, /)` - return len(self)
    * `ndarray.__getitem__(self,key, /)` - return self[key]
    * `ndarray.__setitem(self, key, value, /)` - set self[key] to value
    * `ndarray.__contains__(self, key, /)` - return key in self
    * `ndarray.__int__(self)` - conversion
    * `ndarray.__float__(self)` - conversion
    * `ndarray.__complex__(self)` - conversion
    * `ndarray.__str__(self, /)` - return str(self)
    * `ndarray.__repr__(self, /)` - return repr(self)

## Supported Datatypes

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
