# Notes on Geometric Tools for Computer Graphics

# Chapter 13: Computational Geometry Topics

## 13.1 Binary Space-Partitioning Trees in 2D

* Origins for BSP tree in Fuchs, Kedem, Naylor '79, '80
* In a 2D plane, imagine a line L with a normal vector off of it, n. L splits the plane into two half-planes. We call the half plane that n lies in the positive side of L and the other side the negative side.
* Any point in the plane can be thought of as negative, positive, or zero (on the line) WRT L.
* Another line inside one of the half planes will divide that half plane, and the resulting positive and negative regions can be further subdivided.
* You can represent the partitioning of the plane with a binary tree, where each node represents one splitting line.
* LEFT CHILD nodes are the positive side of the splitting line
* RIGHT CHILD nodes are the negative side
* LEAF nodes represent convex regions created by the partitioning

### 13.1.1 BSP Tree Representation of a Polygon

* Simplest way to make one is so that the nodes each represent a splitting line that contains an edge of the polygon

Pseudocode for constructing a tree that converts a polygon into a BSP tree:

```
ConstructBSPTree(EdgeList L)
    T = new BspTree

    // use an edge to determine the splitting line for this node
    T.splitting_line = GetLineFromEdge(L.first)

    positive = new EdgeList
    negative = new EdgeList  

    for each edge E of L:
```
