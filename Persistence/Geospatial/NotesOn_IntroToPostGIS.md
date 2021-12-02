# Notes on Introduction to PostGIS

From https://postgis.net/workshops/postgis-intro/

# 2: Introduction

## 2.1: What is a Spatial Database?

* "Spatial databases store and manipulate spatial objects like any other object in the database."
* Three aspects that associate spatial data with a database:
    * Spatial data types
    * Spatial indexing
    * Spatial functions for querying spatial properties and relationships

### 2.1.1 In the Beginning

* First gen GIS systems store spatial data in flat files, GIS software necessary to interpret
* Second gen stores some data in relational database (typically attribute data, not spatial)
* True spatial databases came about when spatial features became first class db objects

### 2.1.2 Spatial Data Types

* Spatial types exist to represent geographic features
* They abstract/encapsulate spatial structures like boundary and dimension
* Organized in a type hierarchy:
    * Geometry
        * Spatial Reference System
        * Point
        * Curve
            * Linestring
        * Surface
            * Polygon
        * Geometry Collection
            * MultiSurface
                * Multipolygon
            * MultiCurve
                * MultiLineString
            * MultiPoint

### 2.1.3 Spatial Indexes and Bounding Boxes

* Indexes for non-spatial data are typically B-Tree
* Those rely on rational sort orders, which overlapping polygons, etc. don't naturally have
* Spatial indexes are more interested in "which objects are within this bounding box?"
* Bounding box - smallest rectangle, parallel to the coordinate axes, capable of containing a given feature
* Used because "is A inside B" is expensive for polygons, cheap for rectangles
* Spatial indexes provide approximate results
* Most common spatial index is R-Tree (used in PostGIS), also Quadtrees, grid-based indexes

### 2.1.4 Spatial Functions

Major categories of spatial functions:

* Conversion - convert between geometries and data formats
* Management - manage info about spatial tables and PostGIS administration
* Retrieval - retrieve properties and measurements of a Geometry
* Comparison - compare two geometries WRT their spatial relation
* Generation - generate new geometries from existing ones

## 2.2 What is PostGIS?

* Extension that adds support for spatial types, indexes and functions to PostgreSQL

### 2.2.1 But what is PostgreSQL

* Object-relational database management system
* Designed from the start with type extension in mind

#### 2.2.1.1 Why choose PostgreSQL?

PG has:

* ACID transactional reliability by default
* Strong adherance to SQL92 standards
* Pluggable type extension / function extension
* Community oriented development model
* No limit on column sizes, to support big GIS objects
* Generic index structure (GiST) to allow R-Tree index
* Easy to add custom functions

### 2.2.2 Why not Shapefiles?

* Disadvantage of flat file formats like shapefile:
    * Requires special software to read and write
    * Concurrent users can cause corruption
    * Complicated questions require complicated software to answer

### 2.2.3 A brief history of PostGIS

* 0.1 was from May of 2001, had objects, indexes, a few functions. Storage and retrieval, not analysis
* As number of functions increased, need for some organizing principle came up. Simple Features for SQL (SFSQL) spec from Open Geospatial Consortium gave such structure with guidelines for function naming and requirements
* Lots of the most interesting functions were really hard to code
* Geometry Engine, Open Source (GEOS) library came along, provided the algorithms for implementing the SFSQL spec.
* Geometry storage/representation was inefficient, so there was a more lightweigh metadata setup in 1.0

# 3 Installation

# 4 Creating a Spatial Database

## 4.1 pgAdmin

* Use pgAdmin or `psql`

## 4.2 Creating a Database

Create it, connect to it, then

```
CREATE EXTENSION postgis;
SELECT postgis_full_version();
```
# 9. Geometries

## 9.1 Introduction

```SQL
CREATE TABLE geometries (name varchar, geom geometry);

INSERT INTO geometries VALUES
  ('Point', 'POINT(0 0)'),
  ('Linestring', 'LINESTRING(0 0, 1 1, 2 1, 2 2)'),
  ('Polygon', 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'),
  ('PolygonWithHole', 'POLYGON((0 0, 10 0, 10 10, 0 10, 0 0),(1 1, 1 2, 2 2, 2 1, 1 1))'),
  ('Collection', 'GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))');

SELECT name, ST_AsText(geom) FROM geometries;
```

## 9.2 Metadata Tables

* PostGIS has two tables that track/report geometry types available in a database
    * `spatial_ref_sys` - defines all spatial reference systems known to the db
    * `geometry_columns` - listing of all features (object with geometric attributes) and basic details of them
        * `f_table_catalog`, `f_table_schema`, `f_table_name` - fully qualified name of the feature table
        * `f_geometry_column` - name of the column
        * `coord_dimension`, `srid` - define dimension of the geometry and the Spatial Reference system identifier
        * `type` - defines the type of geometry

## 9.3 Representing Real World Objects

* Some functions that read geometry metadata:
    * `ST_GeometryType(geometry)` - returns type
    * `ST_NDims(geometry)` - number of dimensions
    * `ST_SRID(geometry)` - spatial reference identifier number

### 9.3.1 Points

* Represented by 2-, 3-, or 4-dimensions
* Spatial functions for points:
    * `ST_X(geometry)` - returns x coord
    * `ST_Y(geometry)` - returns y coord

### 9.3.2 Linestrings

* Path between locations
* Ordered series of 2+ points
* Simple linestring - does not cross or touch itself (except at endpoints if closed)
* Functions for linestrings:
    * `ST_Length(geometry)` - length of the linestring
    * `ST_StartPoint(geometry)` - first coordinate as a point
    * `ST_EndPoint(geometry)`
    * `ST_NPoints(geometry)` - number of coordinates in the string

### 9.3.3 Polygons

* Represents an area
* Outer boundary is a ring made from a closed, simple linestring
* Holes in the polygon are also rings
* Functions for polygons
    * `ST_Area(geometry)` - area of the polygons
    * `ST_NRings(geometry)` - number of rings
    * `ST_ExteriorRing(geometry)` - outer ring as a line string
    * `ST_InteriorRing(geometry, n)` - specific inner ring as line string
    * `ST_Perimeter(geometry)` - length of all rings

### 9.3.4 Collections

* Four collection types that group multiple simple geometries into sets
    * MultiPoint - collection of points
    * MultiLineString - collection of linestrings
    * MultiPolygon - collection of polygons
    * GeometryCollection - heterogeneous collection of any geometry, including other collections
* Functions:
    * `ST_NumGeometries(geometry)` - number of parts in collection
    * `ST_GeometryN(geometry, n)` - specific part
    * `ST_Area(geometry)` - total area
    * `ST_Length(geometry)` - total length of all linear parts

## 9.4 Geometry Input and Output

* In the db geometries are stored in a PostGIS specific format
* For external programs to insert/retrieve geometries they need to be cast to a format
* Formats and functions:
    * Well-known text (WKT)
        * `ST_GeomFromText(text, srid)` - returns `geometry`
        * `ST_AsText(geometry)` - returns `text`
        * `ST_AsEWKT(geometry)` - returns `text`
    * Well-known binary (WKB)
        * `ST_GeomFromWKB(bytea)` - returns `geometry`
        * `ST_AsBinary(geometry)` - returns `bytea`
        * `ST_AsEWKB(geometry)` - returns `bytea`
    * Geographic Markup Language (GML)
        * `ST_GeomFromGML(text)` - returns `geometry`
        * `ST_AsGML(geometry)` - returns `text`
    * Keyhole Markup Language (KML)
        * `ST_GeomFromKML(text)` - returns `geometry`
        * `ST_AsKML(geometry)` - returns `text`
    * GeoJSON
        * `ST_AsGeoJSON(geometry)` - returns `text`
    * SVG
        * `ST_AsSVG(geometry)` - returns `text`

## 9.5 Casting from Text

* The PostgreSQL short form syntax for casts is `olddata::newtype`
* Converting WKT string to geometry: `SELECT 'POINT(0 0)'::geometry;`
* Note that unless you specify the SRID, you get a geometry with an unknown SRID
* You can do it with the extended WKT form: `SELECT 'SRID=4326;POINT(0 0)'::geometry;`

# 11. Spatial Relationships

## 11.1 `ST_Equals`

* `ST_Equals(geometry_a, geometry_b)` tests spatial equality of two geometries
* Returns true if two geometrys of the same type have identical coordinates

## 11.2 `ST_Intersects`, `ST_Disjoint`, `ST_Crosses`, `ST_Overlaps`

* Test whether the interiors of geometries intersect
* `ST_Intersects(geom_a, geom_b)` - TRUE if two shapes have any space in common--if their boundaries or interiors intersect
* `ST_Disjoint(geom_a, geom_b)` - TRUE if two shapes do NOT intersect
* `ST_Crosses(geom_a, geom_b)` - TRUE if the intersection results in a geometry whose dimension is one less than the max dimension of the two source geometries and the intersection set is interior to both source geometries
* `ST_Overlpas(geom_a, geom_b)` - TRUE if the intersection set results in a geometry different from either, but of the same dimension.

## 11.3 `ST_Touches`

* `ST_Touches(geom_a, geom_b)` is TRUE if either of the geometries boundaries intersect or if only one of the geometry's interiors intersects the others boundary 

## 11.4 `ST_Within`, `ST_Contains`

* Test whether one geometry is entirely inside another
* `ST_Within(geom_a, geom_b)` - TRUE if `geom_a` is completely within `geom_b`
* `ST_Contains(geom_a, geom_b)` - TRUE if `geom_b` is completely within `geom_a`

## 11.5 `ST_Distance` and `ST_DWithin`

* `ST_Distance(geom_a, geom_b)` - returns shortest distance between two geometries as a float

    ```SQL
    SELECT ST_Distance(
        ST_GeometryFromText('Point(0 5)'),
        ST_GeometryFromText('LINESTRING(-2 2, 2 2)')
    );
    ```

* `ST_DWithin` does an index accelerated true/false test for whether two objects are within a distance of each other

# 13. Spatial Joins

* "Any function that provides a true/false relationship between two tables can be used to drive a spatial join, but the most commonly used are `ST_Intersects`, `ST_Contains`, and `ST_DWithin`"

## 13.1 Join and Summarize

* Example of a `JOIN` and `GROUP BY` to answer "What is the population and racial make up of the neighborhoods of Manhattan?"

    ```SQL
    SELECT
        neighborhoods.name AS neighborhood_name,
        Sum(census.popn_total) AS population,
        100.0 * Sum(census.popn_white) / Sum(census.popn_total) AS white_pct,
        100.0 * Sum(census.popn_black) / Sum(census.popn_total) AS black_pct,
    FROM nyc_neighborhoods AS neighborhoods
    JOIN nyc_census_blocks AS census
      ON (ST_Intersects(neighborhoods.geom, census.geom)
    WHERE neighborhoods.boroname = 'Manhattan'
    GROUP BY neighborhoods.name
    ORDER BY white_pct DESC;
    ```

* Summary:
    1. `JOIN` clause creates a virtual table with columns from neighborhoods and census tables
    1. `WHERE` filters to just rows in Manhattan
    1. Remaining rows grouped by neighborhood name, pop values are aggregated by Sum
    1. `GROUP BY` and `ORDER BY` do formatting

## 13.2 Advanced Join

```SQL
SELECT
    lines.route,
    100.0 * Sum(census.popn_white) / Sum(census.popn_total) AS white_pct,
    100.0 * Sum(census.popn_black) / Sum(census.popn_total) AS black_pct,
    Sum(popn_total) AS popn_total
FROM nyc_census_blocks AS census
JOIN nyc_subway_stations AS subways
  ON (ST_DWithin(census.geom, subways.geom, 200)
JOIN subway_lines AS lines
  ON strpos(subways.routes, lines.route) > 0
GROUP BY lines.route
ORDER BY black_pct DESC;
```

# 15 Spatial Indexing

## 15.1 How Spatial Indexes Work

* R-Trees break up data into rectangles and sub-rectangles, recursively

## 15.2 Index-Only Queries

* Most common functions in PostGIS like `ST_Contains`, `ST_Intersects`, `ST_DWithin` include an index filter automatically
* Some things like `ST_Relate` do not
* Do do a bounding box search using the index and no filtering, use the `&&` operator
* For geometries, `&&` means "bounding boxes overlap or touch"
* Example that sums every block whose bounding box intersects the neighborhood's bounding box

    ```SQL
    SELECT Sum(popn_total)
    FROM nyc_neighborhoods AS neighborhoods
    JOIN nyc_census_blocks AS blocks
      ON (neighborhoods.geom && blocks.geom)
    WHERE neighborhoods.name = 'West Village';
    ```

* Example that sums only those blocks that intersect the neighborhood itself, and therefore returns a lower count:

    ```SQL
    SELECT Sum(popn_total)
    FROM nyc_neighborhoods AS neighborhoods
    JOIN nyc_census_blocks AS blocks
      ON ST_Intersects(neighborhoods.geom, blocks.geom)
    WHERE neighborhoods.name = 'West Village';
    ```

## 15.3 Analyzing

* Use `ANALYZE` to get the query plan

## 15.4 Vacuuming

* Just creating an index isn't enough to get PG to use it effectively
* You have to do VACUUMing whenever a new index is created or after a large number of UPDATEs, INSERTs, DELETEs

# 16. Projecting Data

* If you need to transform and re-project data, you can use `ST_Transform(geometry, srid)`
* For managing SRIDs, you can use `ST_SRID(geometry)` and `ST_SetSRID(geom, srid)`

## 16.1 Comparing Data

* A coordinate and an SRID define a location on the globe
* Without the SRID a coordinate is just an abstract notion
* Comparison operators require that both geometries be in the same SRID
* Be careful doing `ST_Transform` on the fly, as it can cause a query not to use indexes

## 16.2 Transforming Data

* To convert from one SRID to another, you have to verify that your geometry has a valid SRID
* Then you need the SRID to transform into
* Most common SRID is 4326, which is longitude/latitude on WGS84 Spheroid
* If you load data or create a new geometry without an SRID, the SRID is 0
* To see a table's SRID assignment, query `geometry_columns`:

    ```SQL
    SELECT f_table_name AS name, srid FROM geometry_columns;
    ```

* If you know what the SRID of the coordinates is supposed to be you can set it with `ST_SetSRID` and then transform into another system:

    ```SQL
    SELECT ST_AsText(ST_Transform(ST_SetSRID(geom, 26918), 4326)) FROM geometries;
    ```

# 18. Geography

* Coordinates in Mercator, UTM, or Stateplane are Cartesian
* Geographic coordinates are NOT Cartesian
* They are spherical coordinates describing angular coordinates on a globe
* A point is specified by rotational angle from a reference meridian (longitude) and the angle from the equator (latitude)
* You can treat geographic coordinates as approximate Cartesian coordinates and do spatial calculations, but measurements of distance, length, and area will be nonsensical. Also the approximate results from indexes and true/false tests like intersects and contains can become terribly wrong
* Distance between points gets larger as problem areas like the poles or international dateline are approached
* Example coordinates for Los Angeles and Paris:
    * LA: `POINT(-118.4079 33.9434)`
    * Paris: `POINT(2.3490 48.8433)`
* Calculation of distance between the two using `ST_Distance(geom_a, geom_b)` using SRID 4326:

    ```SQL
    SELECT ST_Distance(
        ST_GeometryFromText('POINT(-118.4079 33.9434)', 4326),
        ST_GeometryFromText('POINT(2.5559 49.0083)', 4326)
    );
    ```

* Which returns `121.898285970107`
* The units for SRID 4327 are degrees, so the answer is 122 degrees, but what does that mean?
* On a sphere the size of a degree square is quite variable, getting smaller as you move away from the equator, so a distance of 122 degrees doesn't mean anything.
* To get a meaningful distance, you have to treat geographic coordinates not as approximate Cartesian coordinates but actual spherical coordinates, so you have to look at great circle distances.
* That functionality is available through the `geography` type
* Using `geography` instead of `geometry`, measure the distance:

    ```SQL
    SELECT ST_Distance(
        ST_GeographyFromText('POINT(-118.4079 33.9434)'),
        ST_GeographyFromText('POINT(2.5559 49.0083)')
    );
    ```

* Which returns `9124665.26917268`
* All return values for `geography` calculations are in meters

## 18.1 Using Geography

* To load geometry data into a geography table, the geometry needs to be projected into EPSG:4326, which is longitude/latitude, then needs to be changed into geography
* `ST_Transform(geometry, srid)` converts coordinates into geographics
* `Geography(geometry)` casts them to `geography`
* Creating a table and index:

    ```SQL
    CREATE TABLE nyc_subway_stations_geog AS
    SELECT
        Geography(ST_Transform(geom, 4326)) AS geog,
        name,
        routes
    FROM nyc_subway_stations;

    CREATE INDEX nyc_subway_stations_geog_gix
    ON nyc_subway_stations_geog USING GIST (geog);
    ```

* There are a limited number of functions for the geography type:
    * `ST_AsText(geography)` - returns `text`
    * `ST_GeographyFromText(text)` - returns `geography`
    * `ST_AsBinary(geography)` - returns `bytea`
    * `ST_GeogFromWKB(bytea)` - returns `geography`
    * `ST_AsSVG(geography)` - returns `text`
    * `ST_AsGML(geography)` - returns `text`
    * `ST_AsKML(geography)` - returns `text`
    * `ST_AsGeoJson(geography)` - returns `text`
    * `ST_Distance(geography, geography)` - returns `double`
    * `ST_DWithin(geography, geography, float8)` - returns `boolean`
    * `ST_Area(geography)` - returns `double`
    * `ST_Length(geography)` - returns `double`
    * `ST_Covers(geography, geography)` - returns `boolean`
    * `ST_CoveredBy(geography, geography)` - returns `boolean`
    * `ST_Intersects(geography, geography)` - returns `boolean`
    * `ST_Buffer(geography, float8)` - returns `geography`
    * `ST_Intersection(geography, geography)` - returns `geography`

## 18.2 Creating a Geography Table

* Similar to creating a geometry table
* Geography includes the ability to specify the object type directly at the time of table create

    ```SQL
    CREATE TABLE airports (
        code VARCHAR(3),
        geog GEOGRAPHY(Point)
    );

    INSERT INTO airports VALUES ('LAX', 'POINT(-118.4079 33.9434)');
    ```

## 18.3 Casting to Geometry

* If you need functionality you can only get from `geometry` you can convert objects back and forth
* Reading an X coordinate from a geography:

    ```SQL
    SELECT code, ST_X(geog::geometry) AS longitude FROM airports;
    ```

* You can do whatever with a cast object, but the coordinates are interpreted as Cartesian, not spherical

## 18.4 Why (Not) Use Geography

* Why not use geography everywhere?
    * There are fewer functions available that support the type
    * The calculations on a sphere are computationally more expensive than Cartesian coordinates
* Conclusions:
    * If your data is geographically compact (contained within a state, county, or city), use the geometry type with a Cartesian projection that makes sense for your data.
    * If you need to measure distance with a dataset that is geographically dispersed across the world, use the geography type.
