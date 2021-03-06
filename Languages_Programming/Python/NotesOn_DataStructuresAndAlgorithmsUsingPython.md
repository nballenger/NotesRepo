# Notes on <u>Data Structures and Algorithms Using Python</u>

By Rance D. Necaise, pub. John Wiley & Sons, 2010; Print ISBN: 978-0-470-61829-5

## Chapter Summaries

### Chapter 1: Abstract Data Types

### Chapter 2: Arrays

### Chapter 3: Sets and Maps

### Chapter 4: Algorithm Analysis

### Chapter 5: Searching and Sorting

### Chapter 6: Linked Structures

### Chapter 7: Stacks

### Chapter 8: Queues

### Chapter 9: Advanced Linked Lists

### Chapter 10: Recursion

### Chapter 11: Hash Tables

#### Introduction 

#### Hashing
* Hashing is storing values in an array, the 'hash table', indexed by keys generated from a 'hash function,' which converts values to indices.
* Simple hash function might be: ``h(key) = key % sizeOfArray``
* Hash functions typically have collisions. On collisions, you have to find another location to store the collided value. 
* Linear probing is, on collision, walking the array and inserting at the next open spot.
* Searching is similar to insertion--hash the key, find the slot, walk if necessary.
* Deletions don't mean setting value to None--you must set it to a value indicating deletion, so walking on collision doesn't misfire.
* As hashed values collide, primary clusters appear, which are clusters of values in an otherwise sparse hash table. The bigger your clusters, the longer search operations take.
* The 'probe sequence' is what happens when you must linearly probe for an open spot on collision
* You can make the probe sequence happen according to a function:

```Python
slot = (originalHashedPosition + numberOfProbeInSequence) % sizeOfArray
```

* Adding a step size:

```Python
slot = (originalHashedPosition + 
    numberOfProbeInSequence * 
    someNumber) % sizeOfArray
```

* Linear probing with constant factor > 1 spreads values out, but can still cluster. Quadratic probing may be better at reducing primary clustering:

```Python
slot = (originalHashedPosition + 
    numberOfProbeInSequence^2) % sizeOfArray
```

* Quadratic probing eliminates primary clustering by increasing the distance between each probe in the sequence. It can introduce 'secondary clustering', which is when two keys map to the same table entry and have the same probe sequence. Also quadratic probing may not visit every cell in the table, though tables with prime numbers of slots will have at least half their slots visited by quadratic probing.
* Reducing secondary clustering can be better done by basing the probe sequence on the key value itself, which you can do with 'double hashing'. That involves hashing on a second function when a collision occurs, with the result used as the constant factor in the linear probe:

```Python
slot = (originalHashedPosition + 
    numberOfProbeInSequence * 
    hp(key)) % sizeOfArray
```

* Where hp(key) might be something like:

```Python
hp(key) = 1 + key % someConstantLessThanArraySize
```

* If the table size is prime, double hashing will visit every slot.
* If you need to resize the hash table, you have to rehash the entire table by inserting each key to the new array as if it were a new key.
* Hashing works best when the table is no more than 3/4 full, so if you're going to expand the table, do it before it gets to that point.
* 'Load factor' is the ratio between number of keys in the hash table and the size of the table.
* "In practice, a hash table should be expanded before the load factor reaches 80%."
* On increase, you should at least double the size, but go to a prime, so the smallest prime greater than twice the original size, often 2m+1

#### Separate Chaining
    * Allowing multiple keys to occupy the same position by making each position the head of a linked list is called 'separate chaining.'
    * New keys are prepended to the list because the list nodes are in no particular order.
    * Table size becomes less important, since you're not probing for open slots, though the table size being prime will still give better key distribution. If the table is too small, you get long chains, which aren't as efficient to search linearly.
    * Drawback to separate chaining is the need for additional storage outside the original array.
    * Benefit is that if the load factor is less than 2 (twice the number of keys than table entries) the hash ops take only O(1) time in the average case.

#### Hash Functions
* Guidelines for designing/choosing a hash function:
    * Computation should be simple and quick.
    * Resulting index cannot be random--application to the same key must produce the same value.
    * If keys are multipart, each part should contribute to the hash result.
    * Table size should be prime, particularly when using the modulus operator.
* Integer keys are easiest to hash, but it's common to deal with non integer keys.
* Most common approach for non integer keys is to convert the key to an integer and then use an integer based hash function.
* Integer hash functions:
    * Division: modulo division will always produce a result in the legal range ``h(key) = key % sizeOfTable``

    * Truncation: taking certain digits of a number to form an integer in the legal range.
    * Folding: splitting the key into multiple parts, then combining into a single integer value by adding or multiplying the parts.
    * Hashing strings: convert the string to an integer, use division or truncation to generate an index value in the legal range. Simplest way is to sum the ascii values of the individual characters. Note that large hash tables and short strings will not fill correctly, so you might use a polynomial like

```Python
s[0] * someConstant^n-1 + s[1] * someConstant^n-2, ...
```

#### The HashMap ADT

#### Application: Histograms

#### Exercises

### Chapter 12: Advanced Sorting

### Chapter 13: Binary Trees

### Chapter 14: Search Trees
