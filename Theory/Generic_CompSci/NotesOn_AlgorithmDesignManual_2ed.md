# Notes on The Algorithm Design Manual, 2nd Ed.

By Steven Skiena; Springer Press 2008; ISBN 978-1-84800-069-8

# Preface

* Designing correct, efficient, and implementable algorithms for real-world problems requires access to two distinct bodies of knowledge:
    * Techniques, including data structures, dynamic programming, depth-first search, backtracking, and heuristics. Most important design technique is 'modeling', which abstracts a real world problem into something an algorithm can work on.
    * Resources: use existing implementations, don't reinvent the wheel.
* Book divided into techniques and resources

## To the reader

* Three parts of the book's first edition were well received, expanded in the second edition:
    1. Catalog of algorithmic problems
    1. War stories
    1. Electronic component of the book
* Of note is that the book does not stress the mathematical analysis of algorithms.

# 1. Introduction to Algorithm Design

* Algorithm - procedure to accomplish a specific task.
* Interesting algorithms solve a general, well-specified problem.
* Problems are specified by describing the complete set of instances it must work on, and its output after running on an instance.
* Important distinction, between a problem and an instance of a problem.
* An algorithmic problem (sorting) might be described by:
    * Problem: Sorting
    * Input: A sequence of <i>n</i> keys <i>a<sub>1</sub></i>, ..., <i>a<sub>n</sub></i>
    * Output: The permutation of the input sequence such that <i>a'<sub>1</sub></i> &le; <i>a'<sub>2</sub></i> &le; ... &le; <i>a'<sub>n-1</sub></i> &le; <i>a'<sub>n</sub></i> 
* An instance of that problem might be sorting an array of names, or numbers.
* An algorithm takes any of the possible input instances, and transforms it to the desired form of output.
* Three desirable properties of a good algorithm:
    * Correct
    * Efficient
    * Easy to implement
* This chapter focuses on correctness, chapter 2 on efficiency
* Correct algorithms usually come with a proof of correctness

## 1.1 Robot Tour Optimization

* Problem: you have a robot arm with a soldering arm. You need to program it to solder contact points on a circuit board, minimizing the time required to do so. If the arm moves with fixed speed, you can use distance as a proxy for speed, which gives you the following algorithmic problem:
    * Problem: Robot Tour Optimization
    * Input: A set <i>S</i> of <i>n</i> points in the plane.
    * Output: What is the shortest cycle tour that visits each point in the set <i>S</i>?
* Possible solution: Nearest-neighbor heuristic
    * Starting at <i>p<sub>0</sub></i>, walk to nearest neighbor <i>p<sub>1</sub></i>
    * From <i>p<sub>1</sub></i>, walk to nearest unvisited neighbor, excluding only <i>p<sub>0</sub></i> as a candidate point.
    * Repeat until all points are visited, then return to <i>p<sub>0</sub></i>
* Pseudo-code representation:

    ```
    NearestNeighbor(P)
        Pick and visit an initial point p0 from P
        p = p0
        i = 0
        While there are unvisited points
            i = i + 1
            Select pi to be the closest unvisited point to pi-1
            Visit pi
        Return to p0 from pn-1
    ```

* Good points about this approach:
    * Simple to understand and implement
    * Reasonably efficient for the given example (points in a circle)
    * Looks at each pair of points (pi, pj) at most twice
* Bad point: It's completely wrong.
* It always finds a tour, but doesn't necessarily find the shortest possible tour.
* Points on a line, starting from the center, will zig-zag back and forth, recrossing the center every time.
* No matter what, nearest-neighbor will work badly on some point sets.
* Different approach: repeatedly connect the closest pair of endpoints whose connection will not create a problem, such as premature cycle termination
* Each vertex starts as its own single vertex chain. After merging everything together, we end up with a single chain containing all the points in it. Connecting the last points gives you the cycle.
* At any step in the 'closest-pair' heuristic, you have a set of single vertices and vertex-disjoint chains available to merge.
* Pseudocode:

    ```
    ClosestPair(P)
        Let n be the number of points in set P
        For i = 1 to n - 1 do
            d = inf
            For each pair of endpoints (s,t) from distinct vertex chains
                if dist(s,t) <= d then sm = s, tm = t, and d = dist(s,t)
            Connect (sm,tm) by an edge
        Connect the two endpoints by an edge
    ```

* Somewhat more complicated, somewhat less efficient, but gives the right answer in the linear example.
* But not all examples! Does poorly for points on a rectangle, as it jumps the last two points across the rectangle rather than simply following the edge around.
* Both of those heuristics can end up with bad tours based on input differences.
* What's correct? Could try enumerating all possible orderings of the set of points, and selecting to minimize total length.
* That's correct, but extremely slow.
* The problem is generalized as the Traveling Salesman Problem (TSP)

## 1.2 Selecting the Right Jobs

* Hypothetical problem: you're an actor, asked to star in <i>n</i> different movie projects. Each has a start and end date that you have to commit to being available within. You want to take as many jobs as possible, but can't take overlappign jobs. How do you find the largest possible set of job intervals such that none conflict?
* Algorithmic scheduling problem:
    * Problem: Movie Scheduling Problem
    * Input: A set <i>I</i> of <i>n</i> intervals on the line
    * Output: What is the largest subset of mutually non-overlapping intervals which can be selected from <i>I</i>?
* One method: Earliest Job First, where you take the earliest starting job overlapping no previously scheduled job, and repeat until no more jobs remain.
* Problems include a long initial job
* Another method: Shortest Job First, where you take the shortest possible job from the set, then remove any interval intersecting that job, then repeat.
* Does poorly against two long jobs both impacted by one short one, but not mutually exclusive.
* Exhaustive approach would be to test all sets of intervals for disjointness
* That's limited by enumerating 2<sup><i>n</i></sup> subsets of <i>n</i> things, though that's much better than doing <i>n</i>! things.
* That's only true for low <i>n</i> though
