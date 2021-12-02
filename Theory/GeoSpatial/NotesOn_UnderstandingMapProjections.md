# Notes on Understanding Map Projections

By ESRI, 2000

# Chapter 1: Geographic Coordinate Systems

* A Geographic Coordinate System (GCS) uses a 3D spherical surface to define locations, and includes:
    * An angular unit of measure
    * A prime meridian
    * A datum, based on a spheroid
* Points are referenced by longitude and latitude, which are angles measured from the earth's center to a point on the surface.
* Horizontal, east-west lines are parallels of equal latitude
* Vertical, north-south lines, are lines of equal longitude
* Longitude lines are also called 'meridians'
* The grid of longitude and latitude forms a gridded network called a graticule
* The line of latitude midway between the poles is the equator, and is 0 degrees latitude
* The line of zero longitude is the prime meridian
* Latitude and longitude are measure in either
    * decimal degrees
    * degrees-minutes-seconds (DMS)
* Latitude values range from -90 at the south pole to +90 at the north pole
* Longitude values range from -180 when traveling west of the prime merdian to +180 going east
* Longitude and latitude are not uniform units of measure
* Only at the equator is 1 degree of latitude equal to 1 degree of longitude in terms of distance, because the equator is the only parallel as large as a meridian (the only parallel that is a great circle)
* As the meridians converge on the poles, the distance represented by 1 degree of longitude decreases to zero
* Because degrees of latitude and longitude don't have a standard length, you can't measure distances or areas accurately or display the data easily on a flat surface.

## Spheroids and Spheres

* The earth is an oblate spheroid (slightly fatter around the equator)
* For small scale maps, less than 1:5M, you can treat the earth as a sphere
* For maps of 1:1M or larger, you need a spheroid
* A sphere is the rotation of a circle; a spheroid is the rotation of an ellipse
* An ellipse has a major axis and a minor axis
* the radii of those axes are called the semimajor axis and semiminor axis
* Rotation about the semiminor axis creates a spheroid / 'oblate ellipsoid of revolution'
* A spheroid is defined by either the semimajor axis `a` and the semiminor axis `b`, or by `a` and the `flattening`, which is the difference in length between `a` and `b` as a fraction/decimal
* Flattening is `f = (a - b) / a`
* It's a small value, so usually it's expressed as `1/f` instead
* The World Geodetic System of 1984 (WGS 1984 or WGS84) are
    * `a = 6378137.0 meters`
    * `1/f = 298.257223563`
* Flattening ranges from zero to one; flattening of zero means the two axes are equal, giving a sphere
* The earth's flattening is ~0.003353
* A spheroid is also described by the square of the eccentricity, `e^2`
* `e^2 = (a^2 - b^2) / a^2`

### Defining Different Spheroids for Accurate Mapping

* Different spheroids may fit different regions
* Because of gravitational and surface feature variations, the earth is neither a perfect sphere nor a perfect spheroid
* The new standard spheroid for NA is the Geodetic Reference System of 1980 (GRS 1980)
* Because changing a coordinate system's spheroid changes all previously measured values, it can be a chore to change spheroids

## Datums

* A spheroid approximates the shape of the earth
* A datum:
    * defines the position of the spheroid relative to the center of the earth
    * Provides a frame of reference for measuring locations on the surface
    * Defines the origin and orientation of latitude and longitude lines
* If you change the datum / GCS, the coordinate values of your data change
* An earth-centered / geocentric datum uses the earth's center of mass as the origin
* A local datum aligns its spheroid to closely fit the earth's surface in a particular area
    * A point on the spheroid surface is matched to a particular position on the surface of the earth, which is the datum origin
    * The datum origin is fixed, and all other points are calculated from that
    * The center of the spheroid of a local datum is offset from the earth's center
* NAD 1927 and European Datum 1950 (ED 1950) are local
* NAD 1927 is designed to fit NA reasonably well, ED 1950 is for Europe
* Because a local datum aligns its spheroid so closely to a particular area on the earth's surface, it isn't suitable for use outside that area

## North American Datums

* In NA, the two horizontal datums used most are NAD 1927 and NAD 1983
* NAD 1927
    * Uses the Clarke 1866 spheroid
    * Origin is a point known as Meades Ranch, in Kansas
    * Measurements and calculations where done manually in the 1800s, some errors exist
* NAD 1983
    * New tech revealed weaknesses in the existing network of control points
    * Particularly noticeable when linking new surveys into existing control
    * New datum allowed for consistent coverage of NA via a single datum
    * Based on the GRS 1980 spheroid
    * Origin is the earth's center of mass
    * GRS 1980 spheroid is almost identical to WRS 1984 spheroid
* HARN or HPGN
    * Ongoing effort at the state level to readjust NAD 1983 data to higher accuracy
    * that's known as the High Accuracy Reference Network (HARN)
    * Alternatively known as High Precision Geodetic Network (HPGN)
* There are some other datums for the US, for Alaska, Hawaii, Puerto Rick and the Virgin Islands, and some Alaskan Islands

# Chapter 2: Projected Coordinate Systems

* A projected coordinate system is defined on a flat, 2D surface
* Unlike a GCS, a projected coordinate system has
    * constant lengths
    * constant angles
    * constant areas
* A projected coordinate system is always based on a GCS that is based on a sphere/spheroid
* Locations in a projected coordinate system are identified by x/y coordinates on a grid, whose origin is at the center, `0, 0`

## What is a Map Projection?

* Imagine a light source at the earth's center
* Wrap the earth's surface in a graticule
* The light projects the graticule onto a piece of paper wrapped around the earth, then you flatten the paper
* Different relations of paper to the spheroid result in different projections
* All projections have distortion; different projections cause / maximize / minimize different kinds of distortion
* Most projections are designed to minimize one or a few kinds of distortion
* Conformal projections
    * Preserve local shape
    * To preserve individual angles that describe spatial relationships, a conformal projection has to show perpendicular graticule lines intersecting at 90 degree angles
* Equal area projections
    * Preserve the area of displayed features
    * Other properties like shape, angle, and scale are distorted
    * Meridians and parallels may not intersect at right angles
    * For small areas, shapes are not obviously distorted
* Equidistant projections
    * Preserve the distances between certain points
    * Scale is not maintained correctly throughout an entire map, but in most cases one or more lines on a map exist along which scale is maintained correctly
    * Most equidistant projections have 1+ 'true' lines, where distance is the same (at scale) as it is on the earth's surface
    * In the Sinusoidal projection the equator and all parallels are true lengths
    * No projection is equidistant to and from all points on a map
* True-direction projections
    * The shortest distance between points on a curved surface is a great circle route
    * True-direction / azimuthal projections maintain some of the great circle arcs, giving the directions / azimuths of all points on the map correctly WRT the center

## Projection Types

* Since maps are flat, some of the simplest projections are made onto geometric shapes that can be flattened without stretching their surfaces
* These are called 'developable surfaces', and include cones, cylinders, and planes
* A map projection systematically projects locations from the surface of a spheroid to representative positions on a flat surface
* The first step in projecting from one surface to another is creating one or more points of contact
* Each contact is a point or line of tangency
    * A planar projection is tangential to the globe at one point
    * A cone or cylinder touches the globe along a line
    * If the projection surface intersects the globe the projection is a secant
* Whether tangent or secant, the contact points/lines are significant because they define locations of zero distortion
* Lines of true scale are often called 'standard lines'
* In general distortion increases with the distance from the point of contact
* Lots of projections are classified according to the projection surface used
