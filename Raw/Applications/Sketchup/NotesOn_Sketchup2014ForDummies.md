# Notes on Sketchup 2014 For Dummies

By Aidan Chopra; For Dummies 2014; ISBN 9781118822661

# Chapter 1: Meeting Sketchup

* Sketchup is a surface modeler, so everything is a hollow shell
* Surface modelers are primarily visualization oriented
* The real distinction is actually between polygonal modelers and NURBS modelers
    * polygonal modelers use straight lines and flat surfaces
    * NURBS modelers use true curves to define lines and surfaces--more computationally expensive
* It can do a bunch of things.
* Some stuff it doesn't do:
    * photorealistic rendering
    * animation

# Chapter 2: Establishing the Modeling Mind-set

## All about Edges and Faces

* All entities are made of edges and faces
* Collectively they make up your geometry
* Edges are always straight
* Edges have no thickness
* Edges may be hidden, but are always present
* Faces only exist by virtue of 3+ coplanar edges which form a loop
* Faces are always flat
* Faces also have zero thickness
* Concepts about edges and faces in sketchup:
    * If sketchup can make a face, it will
    * You can't keep it from creating a face, but you can erase them
    * Deleting an edge that bounds a face will delete the face
    * Retracing an edge recreates a missing face
    * Drawing an edge that bisects a face creates two faces
    * Drawing an edge crossing another edge automatically splits both edges
* The drawing space has three axes
    * red and green make the ground plane
    * blue makes the z dimension
* There are numerous inferences via the inference engine
* There are point and linear inferences
* Point inferences, visualized as colored circles and squares:
    * Endpoint (green circle)
    * Midpoint (cyan circle)
    * Intersection (red X)
    * On Edge (red square)
    * Center (dark blue)
    * On Face (dark blue square)
* Linear inferences are helper lines:
    * On axis - line turns color of its parallel axis
    * From Point - a colored, dotted line that indicates the cursor is lined up with a point at the other end of that dotted line
    * Perpendicular - magenta line
    * Parallel - magenta line
    * Tangent at vertex - on an arc that starts at the endpoint of another arc, if your new arc is tangent to the first, it turns cyan.
* You use inferences largely by locking and encouraging them
* Locking inferences by holding shift when one of the first four types of linear inference appear will lock that inference until you release shift
* If an inference doesn't show up on its own, you need to encourage it by touching the thing you want to infer from and moving slowly toward your target
* Core tool competencies: orbit, zoom pan
* Discusses drawing and erasing edges
* Discusses using the measurements box to set exact dimensions
* It's possible to use the measuring tape to resize the entire model based on a single measurement: measure something, then type a dimension--a dialog will appear asking if you want to resize your entire model.
* Selection:
    * Shift click for multi-selection
    * Double clicking a face selects the face and all its bounding edges
    * Triple clicking an edge or face selects all connected
    * Drawing a box from left to right creates a selection box, and only selects things that are entirely in the box
    * Drawing from right to left selects anything your selection box touches or surrounds
* The Move tool
    * Move plus ctrl or option copies
    * Click, move, click again--don't click and drag
    * Click a point that will let you position what you move exactly
    * Escape cancels a move operation
    * Use inferences and measurements strategically
    * Normally sketchup won't let you create a fold via Move--hold command to tell sketchup to auto-fold and create new edges/vertices
    * To make multiple copies, start a move, press option, then type n/, where n is the number of copies to evenly space between start and end
* The Rotate tool
    * Best to preselect what you intend to rotate
    * Option can also create a copy with this tool
    * You can type degrees to rotate
    * Create multiple copies with nx, where n is the number of copies
    * Typically you click once and then again to establish an axis of rotation, but you can't easily do that without an existing set of elements in the plane you want to rotate in
    * To do a rotation in an axis where you have no pre-existing selection points:
        1. Select everything to rotate
        1. Activate the rotate tool
        1. Click once to establish an axis of rotation, then drag the cursor until the axis of rotation is where you want it
        1. Release the mouse button to set the axis of rotation
        1. Click (don't drag) the point at which you want to grab what you're rotating
        1. Click again to drop the thing you're rotating
* The Tape Measure tool
    * Creates guides / "construction geometry" annotations
    * Three basic kinds: parallel line, linear, and guide points
    * Clicking anywhere on an edge (except end or midpoints) will create a guide parallel to that line
    * Clicking on an edge (other than at an endpoint) then again on that edge will create a linear guide on that edge
    * Click an edge endpoint, then click anywhere else to create a guide point
    * Tool has two modes
        * If you see a + next to the cursor, the tool can make guides
        * Without a + it cannot
        * Use option to toggle the mode
    * You can position guides with the measurements box
    * You can erase single guide lines, or all at once
    * You can also hide them individually or all at once
    * They can be selected, moved, copied, rotated like other entities
* Paint bucket tool
    * Choose a material, click to paint a face with it
    * Holding cmd switches to the sample tool
    * Holding shift paints all similar faces

# Chapter 3: Getting a running start

* Basic quickstart.

# Chapter 4: Building Buildings

* When using pushpull, option click to pull a copy of the face
* Intersect Faces:
    * Three modes:
        * Intersect faces with model - creates edges where selected faces intersect with other faces in the model, whether those are selected or not
        * Intersect faces with selection - only creates edges where selected faces intersect other selected faces
        * Intersect faces with context - creates edges where faces within the same group or component intersect; only available when editing a group or component
    * Only available from context click and Edit menu
