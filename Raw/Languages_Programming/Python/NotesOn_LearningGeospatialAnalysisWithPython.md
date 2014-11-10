# Notes on Learning Geospatial Analysis with Python, by Joel Lawhead, 2013

## Chapter Summaries

### Chapter 1: Learning Geospatial Analysis with Python

#### Geospatial analysis and our world

* Blah blah, Nate Silver in 2012

#### History of geospatial analysis

* Old maps!
* GIS!
* Remote sensing!
* Digital Elevation Models!
* CAD!

#### Geospatial analysis and computer programming

* Programming is good for having control at all layers of the stack, automating repetitive tasks, sharing logical operations, and learning geospatial analysis more deeply.
* Geospatial analysis is well suited to OO programming, because it's got so many object-like analogues.

#### Importance of geospatial analysis

* There's a lot of people on earth, and a bunch of land. So duh, we need geospatial analysis.

#### Geographic Information System concepts

* **Thematic maps:**
    * Provides geographic context for information around a central idea or theme.
    * Uses minimal geographic features to avoid distracting the reader from the theme.
    * Often uses large scale political features (state boundaries, eg) to aggregate data.
* **Spatial databases:**
    * A database with support for spatial types and operations.
* **Spatial indexing:**
    * Organizing vector data for faster retrieval.
* **Metadata:**
    * For geo data, typically provides source and history info for the dataset, and summary technical details.
    * ISO 19115-1 is a standard for geographic metadata.
* **Map projections:**
    * Projections are methods for converting three dimensional data into x/y two dimensional data&mdash;flattening a view of the earth to make a map.
    * Projections are typically represented as a set of over 40 parameters as either XML or a text format called Well-Known Text or WKT, used to define the transformation algorithm.
    * Without information on the projection used in storing a dataset, you can end up with spatial data with no usable reference markers.
    * There are now global basemaps that allow common projections like Google Mercator.
    * Datasets are now better consolidated and standardized than they were even 10 years ago.
* **Rendering:**
    * There's a lot of data, and storing it is different from displaying it&mdash;you create renders of specific views or analyses based on your stored datasets.

#### Raster data concepts

* **Images as data:**
    * Raster data is stored as square tiles, which means storing a two dimensional array.
    * Multi-spectral data will have multiple arrays ("bands"), each geospatially referenced together to form a single view.
    * For remote sensing data, each pixel corresponds to a space with a real ground size.
    * Pixels as numeric array values can be manipulated with matrix operations.
    * Transformations on sensing data can give new analyses.
* **Remote sensing and color:**
    * Remote sensing devices can detect wavelengths outside the visible light spectrum, which are then converted into pixel data that can be displayed as RGB values.

#### Common vector GIS concepts

* This is a non-exhaustive list of GIS processes.
* **Data structures:**
    * Vector data uses x/y(/z) coordinates, tagged with additional data points like timestamp, etc.
    * Coordinates can form points, lines, and polygons that model real world objects.
    * A GIS feature can be made up of one or more points, lines, and shapes.
    * Vector data typically represents topographic features better than raster data.
    * Important terms: bounding box (smallest rectangle containing all points in a data set) and convex hull (polygon containing all points in a data set).
* **Buffer:**
    * Buffers establish an area around a point, line, or polygon, defined as all space within a given distance of an edge of that point, line, or polygon.
* **Dissolve:**
    * Creates a single polygon out of adjacent polygons.
* **Generalize:**
    * Reducing the number of points in a polygon to create an approximation of a complex shape.
    * Useful in web mapping, to get polygons to a resolution of 72dpi or lower.
* **Intersection:**
    * Attempts to find the area of overlap between two features.
* **Merge:**
    * Combines two or more non-overlapping shapes into a single, multishape object.
* **Point in polygon:**
    * Query building block, a test for whether a point is inside a given polygon.
    * Most common/efficient algorithm for this is 'Ray Casting':
        1. Test whether the point is on the polygon boundary.
        1. Draw a line from the point in a single direction.
        1. Count the number of times the line crosses the polygon boundary, until reaching the bounding box of the polygon.
        1. If the number is odd, the point is inside the polygon.
* **Union:**
    * Combines two or more overlapping polygons intoa single shape.
    * Similar to dissolve, but dissolve only combines adjacent polygons, not overlapping ones.
* **Join:**
    * Combining two or more database tables via some equivalency condition.
* **Geospatial rules about polygons:**
    * Rules of thumb for geospatial polygons, which are different from mathematical polygons:
        * Polygons must have at least four points.
        * A polygon boundary should not overlap itself.
        * Polygons within a layer shouldn't overlap.
        * A polygon within a layer inside another polygon is considered a hole in the underlying polygon.
    * Different software handles exceptions to the rules differently.
    * Best is to have your polygons obey the rules.
    * Polygons must also be closed shapes&mdash;some software will error on an open polygon, some will close it automatically.

#### Common Raster Data Concepts

* **Band math:**
    * Multidimensional array mathematics.
* **Change detection:**
    * Taking two images of the same location at different times, highlighting the changes.
* **Histogram:**
    * Bar chart of the statistical distribtion of values in a data set.
* **Feature extraction:**
    * Manual or automatic digitization of features in an image to points, lines, and polygons.
    * Example: extracting a coastline from a satellite imate, saving it as vector data.
* **Supervised classification:**
    * Building classifications of light wavelengths for an area to the ground features they may represent (concrete, grass, trees, etc).
* **Unsupervised classification:**
    * Having the computer group pixels with similar reflectance values.

#### Creating the simplest possible Python GIS

* **Getting started with Python:**
    * Make sure you've got Python 2.7 with Tkinter.
    * Test with: ``python -m turtle``
* **Building SimpleGIS:**
    * Code is in two parts: data model and map renderer.
    * Data model is just python lists, renderer is the Python Turtle graphics engine.
    * Turtle uses a canvas with an origin of 0,0 in the center.
    * Simple gis program:

```
#!/usr/bin/env python

import turtle as t

NAME = 0
POINTS = 1
POP = 2

# Dataset:
state = ["COLORADO", [[-109,37],[-109,41],[-102,41],[-102,37]], 5187582]
cities = []
cities.append(["DENVER", [-104.98, 39.74], 634265])
cities.append(["BOULDER", [-105.27,40.02], 98889])
cities.append(["DURANGO", [-107.88,37.28], 17069])

# Viewport options:
map_width = 400
map_height = 300
minx = 180
maxx = -180
miny = 90
maxy = -90

# Adjust the bounding box for the state:
for x,y in state[POINTS]:
  if x < minx: minx = x
  elif x > maxx: maxx = x
  if y < miny: miny = y
  elif y > maxy: maxy = y

# Get scaling factors for drawing
dist_x = maxx - minx
dist_y = maxy - miny
x_ratio = map_width / dist_x
y_ratio = map_height / dist_y

# Convert a point according to the scaling factors
def convert(point):
    lon = point[0]
    lat = point[1]
    x = map_width - ((maxx - lon) * x_ratio)
    y = map_height - ((maxy - lat) * y_ratio)
    # starts in center, so offset points so they're centered
    x = x - (map_width/2)
    y = y - (map_height/2)
    return [x,y]

# Draw the state object
t.up()
first_pixel = None
for point in state[POINTS]:
  pixel = convert(point)
  if not first_pixel:
    first_pixel = pixel
  t.goto(pixel)
  t.down()

t.goto(first_pixel)
t.up()
t.goto([0,0])
t.write(state[NAME], align="center", font=("Arial", 16, "bold"))

# Draw the cities
for city in cities:
  pixel = convert(city[POINTS])
  t.up()
  t.goto(pixel)
  t.dot(10)
  t.write(city[NAME] + ", Pop.: " + str(city[POP]), align="left")
  t.up()

# Perform some queries against the data
biggest_city = max(cities, key=lambda city:city[POP])
t.goto(0,-200)
t.write("The biggest city is: " + biggest_city[NAME])

western_city = min(cities, key=lambda city:city[POINTS])
t.goto(0,-220)
t.write("The western-most city is: " + western_city[NAME])

# Hide the cursor and keep the window from closing
t.pen(shown=False)
t.done()
```

### Chapter 2: Geospatial Data
* Lots of possible data types, including: CSV, geotagged photos, vector data, remote sensing data, elevation data, XML files, JSON files, databases (servers and files)
* You've got to preprocess data to make it usable, typically.
* Data providers have tended in recent years to settle on data distribution in the Mercator projection.
* Google standardized on the WGS 84 datum, which defines a specific spherical model of the earth (a "geoid") that defines the normal sea level. This is the same datum that GPS uses, which makes Google maps compatible with raw GPS data.
* Google uses a very slightly modified Mercator projection called Google Mercator.
* The European Petroleum Survey Group (EPSG) maintains numeric codes for projections. Google self assigned EPSG:900913 as the code for Google Mercator.
* Two primary kinds of geodata: vector (points, lines, polygons) and raster (grids of numeric values).

#### Data structures

* The structure of a data format is typically defined by its intended use.
* Many popular formats are actually quite simple, to facilitate interchange.
* **Common traits:**
    * Geo-location: a method for referencing a real spot on earth from a data point.
    * Subject information: database and data dictionary for the data points.
    * Spatial indexing: indexes constructed for spatial querying against a dataset.
    * Indexing Algorithms:
        * Quad-Tree index: Each node in a Quad-Tree has four children, and the child nodes are typically squares or rectangles. When a node contains a specified number of features, it splits when additional features are added. Dividing the space into nested squares referenced from a tree speeds up lookups.
        * R-Tree index: More sophisticated than Quad-Trees. Can handle 3D data, does better with storage space and memory. Nearby objects are grouped together using any of a variety of spatial algorithms, with all objects in a group bounded by a minimum rectangle. The rectangles are aggregated into hierarchical nodes that are balanced at each level. Bounding boxes may overlap across nodes.
    * Grids: Spatial indexes often use an integer grid, where the actual coordinates (which are floats) are mapped to a nearest integer. That lets the search be done using integer math to eliminate most possibilities, then the final steps can be done with higher precision.
    * Overviews: Most common in raster formats, they're resampled, lower resolution versions of raster data sets that give thumbnails or faster views of images at different scales.
* Metadata: Any data describing the associated data set.
* File structure: The most frequently used storage formats for common geodata elements:

<table class="table table-bordered">
<thead>
  <tr>
    <th colspan="5">Storage formats for geospatial data elements</th>
  </tr>
  <tr>
    <th>Geo-location</th>
    <th>Subject Info.</th>
    <th>Spatial Indices</th>
    <th>Metadata</th>
    <th>Overviews</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Binary File header</td>
    <td>Binary file-based db</td>
    <td>Binary index file</td>
    <td>Text file</td>
    <td>Binary File header</td>
  </tr>
  <tr>
    <td>XML</td>
    <td>XML</td>
    <td>Footprint Index Vector Data (for Raster data)</td>
    <td>XML</td>
    <td>Binary file</td>
  </tr>
  <tr>
    <td>DB Table</td>
    <td>DB Table</td>
    <td>DB Table</td>
    <td>DB Table</td>
    <td>DB Table (blob)</td>
  </tr>
  <tr>
    <td>CSV</td>
    <td>CSV</td>
    <td colspan="3" rowspan=3">&nbsp;</td>
  </tr>
  <tr>
    <td>Text File</td>
    <td>Text File</td>
  </tr>
  <tr>
    <td>Binary File</td>
    <td>Binary File</td>
  </tr>
</tbody>
</table>


