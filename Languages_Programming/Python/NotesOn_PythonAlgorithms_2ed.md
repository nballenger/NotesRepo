# Notes on Python Algorithms: Mastering Basic Algorithms in the Python Language, 2nd Ed.

By Magnus Lie Hetland, Apress 2015, ISBN 978-1-4842-0056-8

## Chapter 1: Introduction

* Book covers:
    * Algorithm analysis, focus on asymptotic run time
    * Algorithm design principles
    * Common data structures in Python
    * Well-known algorithms in Python
* Only sort of covers:
    * Algorithms directly available in Python
    * Real formal algorithm stuff
* Not covered:
    * Numerical or number-theory algorithms
    * Parallel algorithms and multicore

## Chapter 2: The Basics

* Uses a random-access model rather than turing machines
* Limits of random-access model's capabilities:
    * No access to concurrent execution
    * Arithmetic, comparisons, memory access are constant time
    * No other basic operations (sort, etc)
    * One computer word (size of a value you can work with in constant time) is not unlimited, but is large enough to address all memory locations used to represent the problem, plus some percentage for variables.
* Goes into a bunch of big-oh notation stuff. Skipped.

### Implementing Graphs and Trees

* Nomenclature:
    * Graph G = (V,E), is a set of nodes V and edges E
    * If edges have direction, it's a directed graph
    * Nodes connected by an edge are adjacent
    * Edges connected to a node are incident to it
    * Nodes adjacent to another are its neighbors
    * The degree of a node is the number of edges incident to it
    * A subgraph G = (V,E) is a subset of V and a subset of E
    * A path in G is a subgraph where the edges connected nodes in sequence with no revisitation of any nodes
    * A cycle is a path whose last node connects to the first
    * If edges have weight, it is a weighted graph
    * The length of a path or cycle is the sum of its edge weights or the number of edges for an unweighted graph
    * A forest is a cycle-free graph
    * A connected forest is a tree (a forest is one or more trees)
* You need a way of implementing nodes and edges in the program
* Focus on two well-known representations: adjacency lists and matrices
* Note that hashing into dicts is taken for granted in Python

#### Adjacency Lists and the Like

* For each node, you can access a list (or other iterable) of neighbors
* Each neighbor list is just a list of node numbers
* Ordering is arbitrary, so they're really sets
* Examples:

```Python
# Adjacency list of sets:

a, b, c, d, e, f, g, h = range(8)
N = [
    {b, c, d, e, f},    # a
    {c, e},             # b
    {d},                # c
    {e},                # d
    {f},                # e
    {c, g, h},          # f
    {f, h},             # g
    {f, g},             # h
]

# Neighborhood membership:
b in N[a]

# Degree:
len(N[f])
```

* Best graph representation is often dependent on what you need the graph to do
* If you used dicts instead of sets you could easily add weight to edges:

```Python
a, b, c, d, e, f, g, h = range(8)
N = [
    {b:2, c:1, d:3, e:9, f:4},  # a
    {c:4, e:3},                 # b
    
    ...

    {f:9, g:8},                 # h
]

# Neighborhood membership:
b in N[a]

# Degree
len(N[f])

# Edge weight for (a,b)
N[a][b]
```

* Could also use a dict as the main structure, where nodes are represented by keys and values are sets of adjacent nodes

#### Adjacency Matrices

* Instead of listing all neighbors for each node, you have a row with one position for each possible neighbor, and a value stored at that location to indicate adjacency
* Example adjacency matrix with nested lists:

```Python
a, b, c, d, e, f, g, h = range(8)

N = [[0,1,1,1,1,1,0,0], # a
     [0,0,1,0,1,0,0,0], # b

     ...

     [0,0,0,0,0,1,1,0]] # h

# Neighborhood membership:
N[a][b]

# Degree
sum(N[f])
```

* Properties of adjacency matrices:
    * As long as self-loops are disallowed, the diagonal is all false
    * You can impliment undirected graphs by adding edges in both directions, which makes the matrix symmetric
    * Adding edge weights is easy--store the weight instead of a boolean
    * Give nonexistant edges infinite weight to keep them out of shortest paths
    * You still use 0 on the diagonal to represent no self-loops
    * You have to do membership checking, degree finding, and iteration differently because you have to take the infinite value into account:

```Python
a, b, c, d, e, f, g, h = range(8)
inf = float('inf')

W = [[  0,   2,   1,   3,   9,   4, inf, inf], # a
     [inf,   0,   4, inf,   3, inf, inf, inf], # b

     ...

     [inf, inf, inf, inf, inf,   9,   8,   0]] # h

# Neighborhood membership:
W[a][b] < inf
W[c][e] < inf

# Degree
sum(1 for w in W[a] if w < inf) - 1
```

* Numpy has a bunch of stuff for multidimensional arrays
* For instance:

```Python
# Pure python to get a zeroed 2d array:
N = [[0]*10 for i in range(10)]

# Using numpy:
import numpy as np
N = np.zeros([10,10])

# Access:
N[u,v]

# Neighbors:
N[u]
```

* You can also use `scipy.sparse` for sparse matrices

#### Implementing Trees

* Any graph structure can represent a tree
* There are specialized structures optimized for trees
* Easiest special tree is a rooted one, where all edges point downward away from the root
* Simple nested list representation of a tree:

```
T = [["A","B"], ["C"], ["D", ["E","F"]]]
T[0][1]         # node B
T[2][1][0]      # Node E
```

* Example of a binary tree class with handedness:

```Python
class Tree(object):
    def __init__(self, left, right):
        self.left = left
        self.right = right

t = Tree(Tree("A","B"), Tree("C","D"))
t.right.left        # "C"
```

* Common technique from languages with no native list type is "first child, next sibling":
    * Each node has two pointers
    * First pointer is to the first child
    * Second pointer is to the next sibling
    * So each node refers to a linked list of siblings
* Example of a multiway tree class:

```Python
class Tree(object):
    def __init__(self, kids, next=None):
        self.kids = self.val = kids
        self.next = next

t = Tree(Tree("A", Tree("B", Tree("C", Tree("D")))))
```

#### A Multitude of Representations

* Jeremy P. Spinrad, in _Efficient Graph Representations_, has a bunch of interesting graph representations
* Graph libraries:
    * NetworkX
    * python-graph
    * Graphine
    * Graph-tool

## Chapter 3: Counting 101

### The Skinny on Sums

* Problem: sum(1..n)
* Python representation: `x*sum(S) == sum(x*y for y in S)`
* Mathematically, the sum of some number x times the sum of a set S is equal to the sum of x times each item in S
* Introduces Sigma notation for summation:
    * To the right of the Sigma are the values to sum
    * Below the Sigma is a description of what to iterate over
    * A limit is placed above the Sigma
* Three way breakdown of a summation:
   
```
# Python (a):
sum(f(i) for i in range(m, n+1))

# Python (b):
s = 0
for i in range(m, n+1):
    s += f(i)

# Textual:
The sum of the function f(i), where i is each number from m to n.

# Sigma:

 n
 ∑ f(i)
i=m
```

#### Working with sums

* Manipulation rules for sums:
    * Multiplicative constants can be moved in or out of sums
    * Instead of adding two sums, you can sum their added contents

### A Tale of Two Tournaments

* Two tournament types:
    * single round-robin: each contestant meets each of the others in turn
    * knockout: contestants arranged in pairs, loser is out, winner advances
* Question for single round-robin: how many matches for n contestants?
* Questions for knockout: how many rounds for n contestants? How many matches will there be in total?

#### Shaking Hands

* If you have n people and they all shake hands, how many handshakes happen?
* Rephrased: How many edges in a complete graph with n nodes? Complete meaning "all nodes connect to all other nodes".
* Answer is quadratic, but not n^2, because no self-loops and (A,B) == (B,A)
* To solve for both, use n(n-1) for eliminating self-loops and divide by two to reduce mirror image matchups: `n(n-1) / 2`

#### The Hare and the Tortoise

* For a knockout system you're looking at a system with n/2 matches in the first round, n/4 in the second, etc.
* Also you need n-1 matches, since everybody loses but the winner
* Can be represented by a binary tree with n leaf nodes and n-1 internal nodes
* Height (h) of the tree is the number of rounds, which is 2^h = n
