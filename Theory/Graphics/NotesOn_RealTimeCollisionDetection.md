# Notes on Real Time Collision Detection

# Chapter 7: Spatial Partitioning

* Spatial partitioning divides space up into regions and tests if objects overlap the same region of space, before testing for pairwise collisions between objects.
* Chapter looks at grids, trees, and spatial sorting.

## 7.1 Uniform Grids

* Overlay a uniform grid onto space; only objects very close in the grid are likely to overlap.

### 7.1.1 Cell Size Issues

* Four issues related to cell size that can hurt performance:
    1. _Grid is too fine._ - forces updating a large number of cells with associativity information for objects. Particularly bad for moving objects.
    1. _Grid is too coarse WRT object size._ - too many objects in each cell, forces too many pairwise comparisons
    1. _Grid is too coarse WRT object complexity._ - object complexity make the pre-comparison the grid enables not worth it. Break the objects into smaller pieces and make the grid cells smaller.
    1. _Grid is both too fine and too coarse._ - problem when objects are of greatly varying sizes, may require hierarchical grids
* Cell size is generally going to be large enough (but not much larger) than can fit the largest object at any rotation. NOTE: This makes it a poor choice for SketchUp because object size can't be predetermined.

## 7.2 Hierarchical Grids

* This is also a poor choice for SketchUp because it is best suited for moving objects, though it does deal better with radically different sizes of object.

## 7.3 Trees

* Section covers two tree types: <i>k</i>-d trees and octrees.

### 7.3.1 Octrees (and Quadtrees)

* An octree is an axis-aligned hierarchical partitioning of a volume of 3D world space
* Each parent node has 8 children--think of a 2x2 rubik's cube.
* Each node also has a finite volume associated with it.
* The root node is the smallest cube that can hold all of world space.
* Child nodes are recursively subdivided, to a max depth or when cube size is less than some minimum
* Though you can pass down the position and extent information as you descend, more commonly you store position and extent with the nodes. You MUST do this if non-centered splitting is allowed.
* Example octree data structure:

```
struct OctreeNode {
    Point center;           // center point, not strictly necessary
    float halfWidth;        // half width of node, not strictly necessary
    Node *pChild[8];        // pointers to children
    Object *pObjList;       // list of linked objects contained at node
}
```

* In two dimensions you get a quadtree.
* Quad- and octrees can be represented in a flat array with no pointers, though it must be stored as a complete tree. For a tree stored in the zero based array node[N], then for some parent node <b>node[i]</b> the quadtree children are at <b>node[4*i+1]</b> through <b>node[4*i+4]</b>, and octree children at <b>node[8*i+1]</b> through <b>node[8*i+8]</b>.
* A complete binary tree has 2<sup>n</sup>-1 nodes; a complete <i>d</i>-ary tree of n levels has (<i>d</i><sup><i>n</i></sup> - 1) / (<i>d</i> - 1) nodes.
* Since you have to preallocate the array, that's best for static scenes / octrees.
* If you have to constantly update the octree, you want a pointer based representation.

### 7.3.2 Octree Object Assignment


