# Notes on Why Are Geospatial Databases So Hard to Build?

From [http://www.jandrewrogers.com/2015/03/02/geospatial-databases-are-hard/?h](http://www.jandrewrogers.com/2015/03/02/geospatial-databases-are-hard/)

* "Geospatial databases, at a basic computer science and implementation level, are unrelated to more conventional databases."
* Think of this article as a checklist for "is my geospatial database going to fail me at an inconvenient moment."

## Computer Science Does Not Understand Interval Data Types

* CS algorithms typically leverage properties unique to one dimensional scalar data models--data types you can abstractly represent as an integer.
* If your data model is inherently non-scalar, you're going to be short on algorithms
* Paths, vectors, polygons, and other aggregations of scalar coordinates are non-scalar data types, and their computational relationships are topographical rather than graph-like.
* Most spatial data types are 'interval data types.'
* An interval data type cannot be represented with less than two scalar values of arbitrary dimensionality, like the boundary of a hyper-rectangle.
* Two main differences from scalar types:
    * Sets have no meaningful linearization
    * Intersection relationships are not equivalent to equality relationships
* Points:
    * **There are no dynamic sharding algorithms that produce uniform distributions of interval data.** No general partitioning function exists that uniformly distributes n-dimensional interval data in n-dimensional space.
    * **Interval indexing algorithms in literature are either not scalable or not general.** R-Tree cannot scale even theoretically. Quad-Tree is 'pathological' for interval data; R-Tree was created to replace it. Grid indexing / tiling can scale for static interval data, but fail for dynamic data.
    * **Interval data sets have no exploitable order.** Much of CS assumes inherent sortability, so many design patterns are simply off the table.

## Database Engines Cannot Handle Real-Time Geospatial

* Most geospatial DBs were built for making maps--data models that can be rendered as image tiles or paper products.
* Those evolved around small, largely static datasets, with long lead times to product completion.
* Modern applications want real time analysis and contextualization of large volumes of data. This is a different problem from making maps, and not one covered in existing DB literature.
* DB engines for this must be built from first principles, which is high-skill work.
* Points:
    * **Many spatial data sources continuously generated at extremely high rates.** You need to parse, index, and store complex spatial data at high volume, and make that concurrent with low-latency queries against incoming and historical data that cannot be summarized.
    * **Traditional storage, execution, and I/O scheduler designs assume a simple ordered log or tree structure.** That's typical for scalar models. Complex multi-dimensional data traversals appear irregular and semi-random to traditional database engines, so those give suboptimal throughput.
    * **Geospatial workloads tend to be highly skewed and constantly shifting over the data model in unpredictable ways.** Traditional skew and hotspot strategies based on assumptions about workload distribution that can be hard coded into software (like for time-series data) are largely useless for geospatial. "Adaptive mitigation of severe and unpredictable hotspotting is a novel architectural requirement."

## Correct, Fast Computational Geometry is Really Hard

* Geospatial operators are inherently built around computational geometry primitives.
* "Implementation designed for cartographic and GIS use cases typically lack the performance and precision required for analytics."
* Points:
    * **The physical world is non-Euclidean.** "The curvature of Earth's gravity field is approximately 8cm per km. This produces horizon effects even within a single large building. The simplest geometric surface that still applies to most calculations is a geodetic ellipsoid. The computationally simpler approximations most platforms use for making maps aren't good for analytics.
    * **Geospatial analytics requires the ability to do polygon intersections quickly.** Polygon intersections are quadratic in nature. Naive implementations of this can mimic a denial of service attack, because they scale so badly.
    * **Computational geometry has to be precise if you care about analysis.** At scale you run into edge cases about how CPUs guarantee or lose precision, and most programmers don't know how to account for that.

## Difficult but not impossible

* They're not unsolvable problems, but good implementations or even reference architectures don't exist (in 2015)
