# Notes on Geometric Folding Algorithms

By Eric D. Demaine, Joseph O'Rourke; Cambridge UP 2007

# 0 Introduction

## 0.1 Design Problems

### 0.1.1 I: Kempe Universality

* A planar _linkage_ is a collection of fixed-length, 1D segments lying in a plane, joined at their endpoints to form a connected graph.
* The joints permit full 360deg rotation
* The rigid segments may pass through one another freely
* With one or more joints pinned to the plane, the motion of any particular free joint J is constrained by the structure of the linkage
* Specific question: **Let S be an arbitrary algebraic curve in the plane. Is there some linkage so that the motion of some free joint J traces out precisely S?**
* The answer is yes, even if the curve includes cusps and multiple pieces.

### 0.1.2 II: Origami Design

* **Given a 3D shape (an origami final folded state), find a crease pattern and sequence of folds to create the origami (if possible) from a given square of paper.**
* As a general question that is unsolved.
* In practice origami shapes are a subset of all possible 3D shapes
* They are made in two steps:
    * Making an origami base
    * Creasing and adjusting the remaining paper to achieve the final result
* An origami base can be considered a _metric tree_: a tree with lengths assigned to its edges.
* Robert Lang developed an algorithm to construct a crease pattern to achieve any 'uniaxial base'
* Algorithm described in Chapter 16

### 0.1.3 III: Unfolding to Net

* Question: **Can the surface of every convex polyhedron be cut along edges and unfolded to a net?**
* Target is not a specific shape, but any planar shape that avoids overlap

## 0.2 Foldability Questions

### 0.2.1 I: Ruler Folding

* A polygonal _chain_ is a linkage whose graph is just a path (like a carpenter's ruler)
* Seeking to fold it up into as compact a package as possible is the 'ruler folding problem': **Given a polygonal chain with specific given (integer) lengths for its n links, and an integer L, can it be folded flat (each joint angle either 0 or 180) so that its total length is lte L?**
* Sometimes yes, sometimes no, depending on the link lengths and L, but what's interesting is the computational complexity. It's an NP-complete problem.

### 0.2.2 II: Map Folding

* A flat folding of a piece of paper is a folding by creases into a multilayered but planar shape.
* Question: **Given a (rectangular) piece of paper marked with creases, with each subsegment marked as either a mountain or valley crease, does it have a flat folded state?**
* Proved to be NP-hard in 1996
* Interesting variant: **Given a (rectangular) piece of paper marked by a regular grid of unit-separated creases, with each subsegment marked as either a mountin or a valley crease, can it be folded into a single 1x1 square?**

### 0.2.3 III: Polygon Folding

* The inverse of unfolding a convex polyhedron to a net is folding a polygon to a convex polyhedron.
* Question: **Given a polygon of n vertices, can it fold to some convex polyhedron?**
* Assume that the folded polygon covers the surface of the polyhedron precisely once, no gaps or overlaps.
* Need not be an edge unfolding of the polyhedron, the cuts to produce it are arbitrary.

# Part 1: Linkages

# 1: Problem Classification and Examples

* Definitions:
    * **linkage** - collection of fixed-length, 1D segments joined at their endpoints to fimr a graph
    * **links**, **bars** - segments (graph edges)
    * **joints**, **vertices** - shared endpoints (graph nodes)
    * **pinned joint** - joint fixed in place
    * **mechanism** - any collection of rigid bodies connected by joints, hinges, sliders, etc

## 1.1 Classification

* There are six features / parameters that classify most of the material here
    * Those classifying linkages
        * graph structure of the linkage
            * general graph
            * tree
            * single cycle (a polygon)
            * simple path (polygonal chain, chain, arc, robot arm, arm)
        * dimension of the linkage
            * 2D (planar)
            * 3D, 4D
            * kD
        * intersection conditions of the linkage
            * No constraints or obstacles
            * Pass freely through itself but not obstacles
            * No obstacles, but no self-intersections ('simple' linkage)
    * Those classifying the problems studied
        * the geometric issue
            * **reconfiguration** - changing from one set of vertex locations to a different set, respecting teh lengths and intersection rules of the linkage: **Given an initial configuration A and a final configuration B, can the linkage be continuously reconfigured from A to B, keeping all links rigid, staying within the ambient space, without violating any imposed intersection conditions?**
            * **reachability** - whether a particular point of a linkage can reach a given point of the ambient space
            * **locking** - are every two legal configurations of a linkage connected in the configuration space, or might a linkage be locked / stuck in one component of the space and thereby isolated from configurations in another component?
        * the answer desired
            * **decision problems** - Yes/No answers - can the arm reach this point?
            * **path planning problems** - an explicit path through the configuration space that achieves the reconfiguration
        * the type of complexity bound sought
            * O(n^p)
            * Omega(n^q)
            * NP-complete
            * NP-hard
            * PSPACE-complete
            * PSPACE-hard
            * etc.

## 1.2 Applications

### 1.2.1 Robotics

* Useful to be able to explore movement within a space and around obstacles
* _inverse kinematics_ - given a desired tool position, compute joint angles which achieve that position

### 1.2.2 Mechanisms

* A pantograph is a useful linkage

### 1.2.3 Bending Machines

* Three manufacturing processes lead to interesting folding questions:
    * sheet metal bending
    * pipe bending
    * box folding

### 1.2.4 Protein Folding

### 1.2.5 Mathematical Aesthetics

* Research the book reports on is not primarily applications driven
* Biggest drivers of their work is curiosity and math aesthetics


# Chapter 2: Upper and Lower Bounds

## 2.1 General Algorithms and Upper Bounds

### 2.1.1 Configuration Space Approach

* Algorithm by Schwartz and Sharir that can solve any 'motion planning' problem
* Explicitly construct a representation of the free space for the mechanism, then answer all questions with this representation
* Original algorithm was doubly exponential, has since been decreased to singly exponential
* This algorithm won't be used explicitly, but is an important foundation
* Parameters:
    * _k_ - the number of degrees of freedom of the mechanism; number of parameters to fully specify the configuration of the mechanism
    * _m_ - the number of 'constraint surfaces', each recording some distance or non-penetration constraint, each represented by a collection of polynomial equalities and inequalities
    * _d_ - the maximum algebraic (polynomial) degree of the constraint surfaces
    * _n_ - the number of links in a linkage
* Original algorithm used 'cylindrical algebraic decomposition'
* Subsequent improvements use the 'roadmap algorithm'

### Box 2.1: Cylindrical Algebraic Decomposition

* There is a collection, F, of polynomial equations and inequalities
* F is 'semialgebraic', and is a subset of R^k
* A cylindrical algebraic decomposition for F:
    * decomposes R^k into finitely many cells
    * the cells have the property that each polynomial in F evaluates to the same sign (-, 0, +) for every point in the cell
* With cell adjacency in a connectivity graph, a motion planning problem can be solved by searching for a collision free path through the graph, between the cells containing the initial and final configurations of the mechanism

### Box 2.2: Roadmap Algorithm

* Canny's algorithm builds a network of piecewise algebraic curves--the 'roadmap'
* The roadmap preserves the connectivity of the free space F in that every component of F:
    * contains a connected roadmap component and
    * is reachable from any configuration
