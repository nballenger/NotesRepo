# Notes on Geospatial Analysis, 6th Edition

By Smith, Goodchild, and Longley

Source: [http://www.spatialanalysisonline.com/HTML/](http://www.spatialanalysisonline.com/HTML/)

# 1. Introduction and Terminology

* Sections:
    * ch2: spatial literacy / spatial thinking
    * ch3: methodological background to GIS analysis
    * ch4: building blocks of spatial analysis
    * ch5: statistical methods
    * ch6: surface and field analysis
    * ch7: network and location analysis
    * ch8: geocomputation
    * ch9: big data issues

## 1.1 Spatial analysis, GIS and software tools

* Questions important to selecting software:
    * What is meant by geospatial analysis techniques?
    * What should we consider to be GIS software?
* "For our purposes we focus principally on products that claim to provide geographic information systems capabilities, supporting at least 2D mapping (display and output) of raster and/or vector data, with a minimum of basic map manipulation facilities."
* Geospatial analysis: the subset of techniques that are applicable when, as a minimum, data can be referenced on a two-dimensional frame and relate to terrestrial activities. The results of GA will change if the location or extent of the frame changes, or if objects are repositioned within it: if they do not, then "everywhere is nowhere", location is unimportant, and it is simpler and more appropriate to use conventional, aspatial, techniques.
* For vector base GIS, GA means operations like:
    * map overlay (combining layers according to rules)
    * simple buffering
    * other basic operations
* For raster:
    * range of actions applied to grid cells of one or more maps/images
* Limiting GA to 2D is too restrictive
* Other areas to consider:
    * surface analysis for things like gradient, aspect, visibility
    * analyzing surface-like data fields
    * network analysis to understand networks and flows
    * locational analysis
* Visualization / geovisualization is another important area
* That's the subject of research by the International Cartographic Association's Commission on Visual Analytics

## 1.4 Terminology and Abbreviations

* Adjacency - sharing of a common side or boundary by 2+ polygons
* Arc - straight line segment connecting polygon/polyline vertices
* Artifact - result that shows a deceptive data point derived from process errors
* Aspect - direction in which slope is maximized for a selected point on a surface
* Attribute - data item associated with an object in a spatial database
* Azimuth - horizontal direction of a vector, measured clockwise in degrees of rotation from +Y
* Azimuthal projection - map projection constructed as if a plane were placed tangent to the earth's surface and the area to be mapped were projected onto the plane. All points retain compass bearings
* (Spatial) Autocorrelation - degree of relation that exists between 2+ spatial variables
* Cartogram - map in which some variable (population size, GNP) is substituted for land area, and the geometry or space of the map is distorted to convey information about the variable
* Chloropleth - thematic map showing properties of a surface using area symbols (color, shading)
* Conflation - combining / merging information from two data sources, reconciling disparities where possible
* Contiguity - topological identification of adjacent polygons by recording the left and right polygons of each arc. Not concerned with exact polygon locations, only relative positions.
* Curve - 1D geometric object stored as a series of points, with the subtype of curve defining the interpolation between points.
* Datum - singular of data, but in GIS usually relates to a reference level (surface) applying on a national or international basis from which elevation is to be calculated.
* DEM - digital elevation model, subtype of DTM
* DTM - digital terrain model
* EDM - electronic distance measurement
* EDA, ESDA - exploratory (spatial) data analysis
* Ellipsoid / Spheroid - ellipse rotated about its minor axis determines a spheroid, also known as an ellipsoid of revolution
* Feature - point/line/polyline/polygon, potentially also text annotation objects
* Geoid - imaginary shape for the Earth defined by mean sea level and its imagined continuation under the continents at the same level of gravitational potential
* Geodemographics - analysis of peole by where they live, type of neighborhood, etc.
* Geospatial - location relative to Earth's surface
* Geostatistics - statistical methods specifically for geographic data
* Geovisualization - techniques for visualizing spatial and spatio-temporal datasets
* GIS-T - GIS for transportation problems
* GPS / DGPS - global positioning system, differential global positioning system
* Gradient - used in spatial analysis WRT surfaces (scalar fields). Gradient is a vector field comprised of the aspect (direction of maximum slope) and slope computed in this direction at each point in the surface. The magnitude of the gradient (slope / inclination) is sometimes itself referred to as the gradient.
* Graph - collection of vertices and edges
* Heuristic - procedures for finding solutions to problems that may be difficult or impossible to solve by direct means. 
* iid - independently and identically distributed
* Invariance - properties of features that remain unchanged under one or more spatial transforms
* Kernel - in GA, refers to methods that involve calculations using a well-defined local neighborhood (block of cells, radially symmetric function)
* Layer - collection of geographic entities of the same type
* Map algebra - range of actions applied to the grid cells of one or more maps / images, often involving filtering and/or algebraic operations
* Mashup - website or interface using data from multiple sources
* MBR / MER - minimum bounding rectangle / minimum enclosing rectangle
* Planar / non-planar / planar enforced - lying entirely within a plane surface
* Planar graph - if a graph can be drawn in the plane in such a way as to ensure edges only intersect at points that are vertices, then the graph is planar.
* Pixel / image
* Polygon - closed figure in the plane, typically comprised of ordered sets of connected vertices
* Polyhedral surface - contiguous collection of polygons sharing common boundary segments
* Polyline - ordered set of connected vertices
* Raster / grid
* Resampling - procedures for automatically adjusting one or more raster datasets to ensure that the grid resolutions of all sets match when carrying out combination operations; process of reducing image dataset size by quantizing pixels; selecting a subset of statistical data in search of independent samples
* Rubber sheeting - procedure to adjust coordinates of all the points in a dataset to allow a more accurate match between known locations and a few data points within the dataset. Preserves the interconnectivity / topology between points and objects by stretching, shrinking, or re-orienting their innterconnected lines.
* Slope - amount of rise of a surface divided over the distance of that rise
* Spatial econometrics - econometric methods concerned with spatial aspects present in cross-sectional and space-time observations
* Spheroid - oblate form of a sphere or ellipse of revolution
* SQL
* Surface - 2D geometric object. A simple surface is a single 'patch' associated with one exterior boundary and 0 or more interior boundaries. Simple surfaces in 3D are isomorphic to planar surfaces
* Tesseral / Tessellation - gridded representation of a plane surface into disjoint polygons
* TIN - Triangulated irregular network
* Topology - relative location of geographic phenomena independent of their exact position
* Transformation, Map - computational process of converting an image or map from one coordinate system to another. Typically involves rotation and scaling of grid cells, and therefore resampling.
* Transformation, Affine - conversion from XY coordinates in a digitizer to XY pairs on a real world coordinate system. Basic property of affine transforms is that parallel lines remain parallel. Principle affine transforms are contraction, expansion, dilation, reflection, rotation, share, and translation
* Transformation, Data - mathematical procedure on a dataset that produces some new dataset
* Transformation, Back - If a set of sampled values xi has been transformed by a 1:1 mapping function f() into the set f(xi), and f() has a 1:1 inverse mapping function f^-1(), then computing f^-1(f(xi))=xi is known as back transformation
* Vector - data comprised of lines or arcs with beginning and end points, that meet at nodes.
* Viewshed - regions of visibility observable from one or more points
* WGS84 - World Geodetic System, 1984 version. Model of the earth as a spheroid with specific attributes.

## 1.5 Common Measures and Notation

### 1.5.1 Notation and Symbology

* `[a,b]` - closed interval of the Real line
* `(a,b)` - open interval of the Real line
* `(i,j)` - in graph theory context, pairwise notation for the edge connecting i and j
* `(x,y)` - spatial data pair in a cartesian (or otherwise) system
* `(x,y,z)` - spatial data triple
* <pre>{x<sub>i</sub>}</pre> - set of n values, typically continuous ratio-scaled variables in the range -inf to inf, or 0 to inf
* <pre>{X<sub>i</sub>}</pre> - ordered set of n values X<sub>i</sub> lte X<sub>i+1</sub> for all i
* <bold>X,x</bold> - bold UC is matrices, lc is vectors
* <pre>{f<sub>i</sub>}</pre> - set of k frequencies derived from a dataset {x<sub>i</sub>}
* Etc.

### 1.5.2 Statistical measures and related formulas


# Chapter 2: Conceptual Frameworks for Spatial Analysis

* "Ultimately, geospatial analysis concerns _what_ happens _where_, and makes use of geographic information that links features and phenomena on the Earth's surface to their locations."

## 2.1 Basic Primitives

### 2.1.1 Place

* Places often have names, official and unofficial. A list of officially sanctioned names is a gazetteer.
* Places change continually. For some purposes you can treat them as static, but be aware they do change constantly.
* Large amounts of information are associated with places. One role of places and their names is to link together what is known in useful ways.
* The basis of rigorous and precise definitions of place is a coordinate systems.

### 2.1.2 Attributes

* Attribute - any recorded characteristic or property of a place
* Within GIS it usually refers to records in a data table associated with specific features
* Types of attributes useful for SA:
    * Nominal - distinguishing between locations, but with no ranking or mathematical value
    * Ordinal - implies a ranking, but not placement on a delineated scale
    * Interval - quantitative data where difference is a meaningful operation
    * Ratio - when an attribute allows you to divide one measurement by another. Weight is ratio data, temperature is not (20 deg C is not two times 10 deg C)
    * Cyclic - scalar data where two or more points on the scale can be equal, as with 0 degrees rotation and 360 degrees rotation
* Another important distinction is whether an attribute is:
    * spatially extensive - measures for a place as a whole (total population)
    * spatially intensive - pop density, average income, 
* Keep extensive and intensive attribute separate, because they respond to data merges and splits very differently.

### 2.1.3 Objects

* Points, lines, and areas are most often represented in standard forms:
    * Points as pairs of coordinates in a standardized system
    * Lines as ordered sequences of points connected by straight lines
    * Areas as ordered rings of points

### 2.1.4 Maps

* Placement of features into geographic context in a readable way.

### 2.1.5 Multiple properties of places

* You store them in layers.

### 2.1.6 Fields

* In some data sets things are represented as discrete objects
* In other kinds of data, there are contiguous fields representing different categories

### 2.1.7 Networks

* Networks are 1D structures embedded in 2 or 3 dimensions
* Point objects may be distributed on a network, as can line objects
* Networks form graph structures

### 2.1.8 Density estimation

* There are specific geographic techniques for density estimation

### 2.1.9 Detail, resolution, and scale

* Spatial resolution - threshold distance below which an analyst has decided that detail is unnecessary or irrelevant 
* Maps have a scale or representative fraction, which is the ratio of distances on the map to distances in the real world.
* "When digital map data are displayed decisions have to be made, manually and/or automatically, as to how much detail should be displayed, and how feature data should be generalized in order to produce a visually acceptable and meaningful result."
* Summary of major generalization operators from an ESRI whitepaper in 1996:
    * Preselection - what features to include / exclude
    * Elimination - removal of features below some threshold
    * Simplification - smoothing and straightening linear or polygon boundaries while retaining their basic form
    * Aggregation - combining distinct features into a larger composite object
    * Collapse - reduction of feature dimensionality, as for example when a town is represented by apoint or a river by a line
    * Typification - reduction of the level of detail by replacing multiple objects by a smaller number of the same objects occupying broadly the same locations
    * Exaggeration - emphasizing important features that might otherwise be removed
    * Classification and symbolization - grouping similar features and using different symbology to represent the new arrangement
    * Conflict resolution (displacement): identifying and resolving feature conflicts (overlaps, labeling)
    * Refinement - altering feature geometry and alignment to improve aesthetics

### 2.1.10 Topology

* In math, a property is topological if it survives stretching and distorting of space
* Many properties of importance to SA are topological, including:
    * Dimensionality - distinction between point, line, area, and volume
    * Adjacency - including touching of land parcels, counties, nation-states
    * Connectivity - junctions between streets, roads, railroads, rivers
    * Containment - when a point lies inside rather than outside an area

## 2.2 Spatial Relationships

### 2.2.1 Co-location

* Many interesting things come from looking at the attributes of co-located places
* Also good to look at co-location in point datasets
* Done through superimposition / layering
* Overlay may require area on area, line on area, point on area, line on line, or point on line, depending on the data objects involved

### 2.2.2 Distance, direction and spatial weights matrices

* Distance between points can be straight line or network (driving) distance
* Distance/direction between lines or areas are often calculated using representative points, but that can be misleading.
* You can use the nearest points in the two objects, or the average distance and direction between all pairs of points (though averaging direction is difficult).
* Lots of analysis types require you to calculate a table or matrix expressing the relative proximity of pairs of places, typically denoted **W** (a spatial weights matrix)
* Software packages commonly give several ways of determining the elements of W, including:
    * 1 if the places share a common boundary, else 0
    * length of any common boundary between places, else 0
    * a decreasing function of the distance between the places, or between their representative points, or their kth nearest neighbors
* When running an analysis like this, W captures the spatial aspects of the problem, and the actual coordinates become irrelevant once the matrix is calculated
* Under Euclidean measure W is invariant WRT displacement (translation), rotation, and mirror imaging (reflection

### 2.2.3 Multidimensional Scaling

* MDS is the general term given to the problem of reconstructing locations from knowledge of proximities. 
* Example would be inferring the locations of surrounding settlements from trade interactions with a single settlement of known location.
* Scaling techniques can create maps that, for instance, depict travel time as distance rather than 1:1 distance measures

### 2.2.4 Spatial context

* You can get a lot from comparing the attributes of objects in close proximity

### 2.2.5 Neighborhood

* Neighborhoods are often thought of as partitioning urban space
* They exist in people's minds and experiences
* Individual perceptions of neighborhood very rarely have hard, definite boundaries
* In GA applications, neighborhood refers to the set of zones or cells immediately adjacent to a selected zone or cell.
* The set of 8 cells around each cell in a square grid are it's 'Moore' neighborhood or 'Queen's Move' neighborhood
* The subset that is just NSEW neighbors is the von Neumann or 'Rook's Move' neighborhood
* You can also describe irregular lattices in this way.

### 2.2.6 Spatial heterogeneity

* Earth is really varied.
* Nowhere is an 'average place'
* Any analysis over a limited area can be expected to change as that area is relocated, and to be different from the same analysis over the Earth as a whole.
* Some techniques consider spatial heterogeneity to be a universally observed property of the Earth's surface
* Techniques that are specific to an area are 'place-based' or 'local'

### 2.2.7 Spatial Dependence

* Conditions tend to persist locally, and it is possible to divide areas into regions that exhibit substantial internal similarity.
* The general term for that is 'spatial dependence'
* Captured by Tobler's First Law of Geography: "All things are related, but nearby things are more related than distant things."
* Spatial autocorrelation decreases as distance increases
* Once correlation reaches zero, this is the 'range' of an effect

### 2.2.8 Spatial sampling

* One of the implications of spatial dependence is that it is possible to capture a reasonably accurate description of Earth's surface with a few well placed samples.
* Numerous approaches to spatial sampling exist

### 2.2.9 Spatial interpolation

* If sampling is valid, there must be a way to fill in the unknown variation between sample points
* Spatial interpolation tries to do that by giving a method of estimating the value of a field anywhere from a limited number of sample points.
* Arguably the most rigorous approach to interpolation is Kriging, a family of techniques from geostatistics.

### 2.2.10 Smoothing and sharpening

* Earth's surface is highly dynamic, particularly around social information
* "The pervasiveness of Tobler's First Law suggests that processes that leave a smooth pattern on the Earth's surface are generally more prevalent than those that cause sharp discontinuities, but spatial analysts have developed many ideas in both categories."
* Many processes involve convolution, when the outcome at a point is determined by the conditions in some immediate neighborhood.
* Mathematically a convolution is a weighted average of a point's neighborhood, the weights decreasing with distance from the point, and bears a strong technical relationship to density estimaion. As long as the weights are positive, teh resulting pattern will be smoother than the inputs.

### 2.2.11 First and second order processes

* Context: analysis of point patterns
* First order process: one that produces a variation in point density in response to some causal variable: density of cases of malaria echos density of particular species of mosquito
* Second order process: results from interactions, when the presence of one point makes others more likely in teh immediate vicinity. Contagious disease patterns are second-order processes, as carriers pass the disease on.
* "Competition for space provides a familiar example of a form of second-order process that results in an exception to Tobler's first law. The presence of a shopping center in an area generally discourages other shopping centers from locating nearby, particularly when the focus is on convenience goods and services." <-- this is actually wrong

## 2.3 Spatial Statistics

### 2.3.1 Spatial probability

* One form of spatial probability is to assign probabilities of specific events to general areas based on patterns of known causes.
* However that kind of map only considers an isolated event
* The probability that two points a short distance apart would both be subject to landslide is very different than saying for each single point whether it is likely to be in a landslide.
* If the probability of landslide at point A is .5 and at point B a short distance away it is also .5, the probability of A+B is greater than .25, possibly as much as .5 again.
* The marginal probabilities of isolated events may not be as useful as the joint probabilities of related events. Joint probabilities are very hard to show on a map.

### 2.3.2 Probability density

* Imagine a measurement like GPS that has an error of known magnitude but not known value in any given measurement.
* The distribution of probability for that measurement on the NS axis would form a bell curve, and a separate one on the EW axis
* Those two together form a surface of probability density
* The probability that the point lines within any defined area is equal to the volume of hte bell's surface over that area. The volume of the entire bell is 1.

### 2.3.3 Uncertainty

* Uncertainty is always present because geographic datasets are only representations of reality.
* Uncertainty in data will propagate into uncertainty about conclusions.
* It can be due to the inaccuracy or limitations of measuring instruments
* It can be due to vagueness in definitions

### 2.3.4 Statistical inference

* Statistical inference is the general process of inferring information about populations from samples of that population.
* Spatial analysts don't typically design participatory experiments, so they have to rely on natural experiements, in which the variation among samples is the result of outside factors.
* In that context, two of the fundamental principles of statistical inference raise important questions:
    * Were the members of the sample selected randomly and independently from a larger population, or did Tobler's First Law virtually ensure lack of independence, and/or did the basic heterogeneity of the Earth's surface virtually ensure that samples drawn in another location would be different?
    * What universe is represented by the samples?
    * Is it possible to reason from the results of the analysis to conclusions about the universe?

## 2.4 Spatial Data Infrastructure

### 2.4.1 Geoportals

* A geoportal is a web site forming a single point of access to spatial data
* May include public domain or commercial data

### 2.4.2 Metadata

* A geoportal must have metadata to make the data useful

### 2.4.3 Interoperability

* Development of an effective spatial data infrastructure has required lots of efforts at interoperability for data use and exchange. 
* Standards to make that possible are very important.

# Chapter 3: Methodological Context

* GA is not just a collection of techniques--it's part of a larger process
* This section focuses on a number of analytical methodologies, with a focus on the authors' version of a methodology called PPDAC: Problem, Plan, Data, Analysis, and Conclusions.

## 3.1 Analytical Methodologies

* Common questions that help frame analytical tasks:
    * How well defined is the problem I'm trying to address?
    * How much in terms of resources am I able to apply to the problem?
    * What research has previously been done on problems of this type?
    * What are the strengths and weaknesses shown by previous research?
    * Who will be the recipient of the results?
    * What are the expectations/requirements of the recipients?
    * What caveats on the results are implied by the project requirements?
    * How will I deal with data inadequacies?
    * How will I deal with limitations and errors in my toolchain?
    * What are the implications of producing wrong or misleading results?
    * Are there independent, verifiable means for validating my results?
* Analytical process from Mitchell, 2005:
    1. Frame the question
    1. Understand your data
    1. Choose a method
    1. Calculate the statistic
    1. Interpret the statistic
    1. Test the significance of the statistic
    1. Question the results
* Recommend that readers study the "Framework for theory" section of Steinitz 93
* Also recommend Stratton 2006, "Guidance on spatial wildfire analysis"
* From the Idrisi GIS package: "In developing a cartographic model we find it most useful to begin with the final product and proceed backwards in a step by step manner towards the existing data. This process guards against the tendency to let the available data shape the final product."
* Mackay and Oldford (2000) looked at the role of statistical analysis within the broader framework of scientific research methods. "They conclude that statistical analysis is defined in large measure by its methodology, in particular its focus on seeking an understanding of a population from sample data. In a similar way spatial analysis and GIS analysis are defined by the methods they adopt, focusing on the investigation of spatial patterns and relationships as a guide to a broader understanding of spatial processes. As such spatial analysis is defined by both its material (spatial datasets) and its methods."
* PPDAC comes from Mackay and Oldford
* Summary of a revised PPDAC approach, with the understanding that these stages are cyclical (returning to the problem stage), and that each stage may and often will feed back to the previous stage.
    1. Problem
    1. Plan
    1. Data
    1. Analysis
    1. Conclusions

## 3.2 Spatial analysis as a process

* Typical iterative stages of SA:
    * Problem forumlation
    * Planning
    * Data gathering
    * Exploratory analysis
    * Hypothesis formulation
    * Modeling and testing
    * Consultation and review
    * Final reporting / implementation of findings

## 3.3 Spatial analysis and the PPDAC model

* Approach is intended to "provide a strong framework for undertaking projects that have a significant geospatial component."
* Can also be applied to "problems in which the collection and analysis of particular datasets is the central task, as may be the case with primary environmental, socio-economic or epidemiological research."
* Reasons for treating spatial problems as 'special':
    * SA work has a spatial component, and spatial correlations are common in it
    * Many problems must be looked at in a spatio-temporal context
    * Statistics theory is often better for experimental data than observational
    * SA often involves building models by undertsanding processes
    * Spatial patterns are rarely univariate in cause; SA is the start of a big process
    * Spatial datasets and their metadata typically come from third parties, and that introduces specific problems and challenges.

### 3.3.1 Problem: Framing the Question

* Breaking problems down into key components, and simplifying problems to focus on their essential and most important/relevant components, are often very effective first steps.
* For large / complex problems, have to think about interactions between parts of the problem definition.
* Important to be aware of general problems with grouped data, and spatial data in particular
* Issues needing special attention for spatial problems:
    * Spatial scale factors - what's the study region? What are the implications of changing this for some or all datasets? Do the same scale factors apply for all areas of interest?
    * Statistical scale factors - at what levels of grouping are data to be analyzed and reported?
    * Does the problem formulation required data of types, sizes, or quality standards that may not be available? What compromises does that imply?
    * Are conclusions regarding spatially grouped data being sought that imply the grouping (county level, farm level, etc) is truly representative of all the components in the group? If so, the grouped regions must be entirely or largely homogeneous in order to avoid the so called ecological fallacy--ascribing characteristics to members of a group when only the overall group characteristics are known.
    * Are conclusions regarding spatially grouped data being sought based on the measured characteristics of sampled individuals? If so the sample must be entirely or highly representative of the grouping in order to avoid the so called atomistic fallacy--ascribing characteristics to members of a group based on a potentially unrepresentative sample of members.
* Note that in many instances it will be difficult if not impossible to compute the timescale and budget required to address a particular problem without a preliminary study or project.

### 3.3.2 Plan: Formulating the approach

* Output of the PLAN stage is often formulated as a detailed project plan, with allocation of tasks, resources, timescales, analysis of critical paths and activities, and estimated costs of data, equipment, software tools, manpower, services, etc.
* Issues to consider include:
    * Nature of the problem and project
    * Does it require commercial costings and or cost benefit analysis?
    * Are particular decision-support tools / procedures needed?
    * What level of public involvement/awareness is needed?
    * What particular operational needs/conditions are associated?
    * What time is available to conduct the research?
    * Are there any critical deadlines?
    * What funds and other resources are available?
    * Is the project technically feasible?
    * What assessable risk is there of failure? How is that affected by problem complexity?
    * What are the client expectations?
    * How does the research relate to other studies on the same/similar problems?
    * What data components are needed? How will they be obtained?
    * Are the data to be studied to be selected from the target population, or will the sample be distinct in some way and applied to the population subsequently?

### 3.3.3 Data: Data acquisition

* Major issue to consider is data compatibility
* All datasets contain errors, have missing values, have a finite resolution, include distortions due to modeling mismatch, incorporate measurement errors / uncertainties, and may have deliberate or designed adjustment of positional and or attribute data (for privacy reasons, for aggregation, etc.)
* SA tools may or may not handle these factors
* Issues GIS tools exist to cover:
    * boundary definition and density estimation
    * coding schemes that provide for missing data and for making out invalid regions and/or data items
    * modeling procedures that automatically adjust faulty topologies and poorly matched datasets, or datasets of varying resolutions and/or projections
    * wide range of procedures for classification issues
    * lack of continuity in field data can be handled through breaklines and similar methods
    * range of techniques for modeling data problems and generating error bounds, confidence envelopes, alternative realizations

### 3.3.4 Analysis: Analytical methods and tools

* "Frequently the objective of analysis is described as being the identification and description of spatial patterns, leading on to attempts to understand and model the processes that have given rise to the observed patterns."
* "Observed spatial arrangements are frequently of indirect or mapped data rather than direct observations--the process of data capture and storage has already imposed a model unpon the source dataset and to an extent pre-determined aspects of the observable arrangements."
* "Identification of spatial pattern is thus closely associated with a number of assumptions or preconditions:"
    1. "the definition of what constitutes not a pattern for the purposes of the investigation"
    1. "the definition of hte dataset being studied (events/observations) and the spatial (and temporal) extent or scale of the observations"
    1. "the way in which the observations are made, modeled and recorded"

### 3.3.5 Conclusions: Delivering the results

* Reaching conclusions and communicating them is distinct from implementation of findings.
* Mackay and Oldford: "The purpose of the Conclusion stage is to report the results of the study in the language of the Problem. Concise numerical summaries and presentation graphics [tabulations, maps, geovisualizations] should be used to clarify the discussion. Statistical jargon should be avoided. As well, the Conclusion provides an opportunity to discuss the strengths and weaknesses of the Plan, Data and Analaysis especially in regards to possible errors that may have arisen."

## 3.4 Geospatial analysis and model building

* Construction of models tends to be "build-fit-criticize"
* 'Model' in GIS has a bunch of meanings, unfortunately.
* Typically you see INPUT -> PROCESS -> OUTPUT
* That may be simple or complex.
* One way to have static models do more work is to add some stochastic element, such that repeated runs don't produce the exact same results, and then look at results over multiple runs.

# Chapter 4: Building blocks of spatial analysis

## 4.1 Spatial and spatio-temporal data models and methods

### Spatial data models and methods

Longley, et al. 2015 provide a summary of spatial data models in GIS:

| Data Model | Example application |
| ---------- | ------------------- |
| CAD | Automated engineering design and drafting |
| Graphical (non-topological) | Simple mapping |
| Image | Image processing, grid analysis |
| Raster / grid | Spatial analysis and modeling, esp. environmental/natural |
| Vector / Georelational topological | cartography, socioeconomic and resource, modeling |
| Network | Network analysis for transport, hydrology, utilities |
| Triangulated irregular network | Surface / terrain visualization |
| Object | Many operations on all types of entities in all types of apps |

OGC's OpenGIS Simple Features Specification, Principal methods for spatial relations:

| Method | Description |
| ------ | ----------- |
| Equals | spatially equal to |
| Disjoint | spatially disjoint |
| Intersects | spatially intersects |
| Touches | spatially touches (N/A for point to point) |
| Crosses | spatially crosses |
| Within | spatially within |
| Contains | spatially contains |
| Overlaps | spatially overlaps |
| Relate | spatially relates, tested by checking for intersections between the interior, boundary, and exterior of the two components |


OGC's OpenGIS Simple Features Specification, Principal methods for spatial analysis:

| Method | Description |
| ------ | ----------- |
| Distance | shortest distance between any two points in two geometries |
| Buffer | all points whose distance from the geometry is lte some value |
| Convex Hull | convex hull of the geometry |
| Intersection | point set intersection of the current geometry with another |
| Union | point set union of the current geometry with another |
| Difference | point set difference of the current geometry with another |
| Symmetric difference | XOR point set difference |

### Spatio-temporal data models and methods

* Most software has historically dealt with spatial data, and not spatio-temporal
* Examples of spatio-temporal data, and representation/analysis:
    * Complete spatial fields recorded at distinct points in time, viewed as a set of time slices. Sometimes referred to as a T-mode data model. Analysis has tended to focus on the difference between slices.
    * Complete spatial fields recorded at distinct points in time, viewed as a set of point locations or pixels, each of which has a temporal profile. Similar to multi-spectral datasets. Known as S-mode analysis.
    * Incomplete spatial fields recorded at regular, distinct points in space and time (often very frequently). Typical of environmental monitoring.
    * Mobile objects (points) tracked in space-time. Also called "track data."
    * Network-based data
    * Patterns of points (events) over time. Common in epidemiology
    * patterns of regions / zones over time.

## 4.2 Geometric and Related Operations

### 4.2.1 Length and area for vector data

* Since most GIS datasets are in projected plane coordinates, distances and associated operations are done with Euclidean geometry
* Polygon areas are calculated using integration by the trapezoidal or Simpson's rule.

### 4.2.2 Length and area for raster datasets

* Distance is pretty simple, basically euclidean distance modified by grid sizing
* Areas and perimeters are a little harder
* Can use membership functions to determine boundaries
* The gridding itself imposes a certain distortion on the data
* Distortions primarily fall into three categories:
    * Orientation - Allocation of source data values to cells (and thus length and area calculations) will alter if the grid is rotated. It's common to rotate them when using two or more data sources, to get the orientations to align.
    * Metrics - to compute distances it is common to add up the number of cells comprising a line or boundary and multiplying this number by the cell edge length. That's for a "rook's move" calculation that zigzags on the grid, though it may be adjusted by allowing diagonal or "bishop's move" movements, where diagonal lengths are considered to be edge-length * sqrt(2)
    * Resolution
        * Finer resolution grids provide more detailed representations of points, lines, and areas, and a finer breakdown of attribute data
        * As you get finer resolution though your processing cost increases
        * Question of whether an attribute value for a cell applies throughout that cell or not

### 4.2.3 Projected surfaces

* Most GIS software reports planar area, not surface area
* Surface area computations are always gte planar area
* The ratio of surface area to planar area gives a crude index of "roughness"
* For surfaces in TIN form, the surface area is the sum of the areas of teh triangles
* If the surface representation is a grid or DEM, surface area can be computed by TIN like methods. You can remap the centers of adjacent squares to make triangles, and work from there.

#### Terrestrial (unprojected) surface area

* For rectangular regions with sides greater than several hundred KM, surface areas are noticeably affected by the curvature of the earth.
* The area of a spherical rectangular region defined by fixed lat/lon coordinates is greater than the area bounded by lines of constant latitude, which are not great circles
* Packages can account for this by using different measurement calculations, but it's good to be aware of it and explicitly account for it.

### 4.2.4 Line Smoothing and Point-weeding

* Polylines and polygons with large numbers of segments may be over complex, bad representations of the original features, or unsuitable for display at all map scales.
* Point weeding is largely from Douglas and Peuker 1973.
    * Connect point 1 (the anchor) to point N (call it 10) with a temporary line
    * That creates an initial segment
    * Identify the point between 1 and 10 that deviates from the line segment by the greatest distance (and more than some tolerance level)
    * Call that point 8--then point 10 would be directly connected to 8, and 9 would be dropped
    * Now a new temp line is drawn between 1 and 8 (the new floating point) and the process repeats
* Simple smoothing uses a family of procedures in which the set of points is replaced by a smooth line consisting of a set of curves and straight line segments, closely following but not necessarily passing through the nodes of the original polyline.
* Spline smoothing replaces the original polyline with a curve passing through the nodes of the polyline, though it may not align with it anywhere else.

### 4.2.5 Centroids and Centers

* Centroids are often defined as the nominal center of gravity for an object or collection of objects
* Lots of other definitions are used in GIS
* Often 'center' is more appropriate than 'centroid'

#### Polygon centroids and centers

* Different ways of finding them
    * Mean Center, or M1, is the mean of all vertices
    * Mean Center Weighted, M1\*, is a weighted average of hte vertices
    * RMS variation of the point set about the mean center is the 'standard distance'
    * Centroid is 'center of gravity', if the polygon were an infinitely thin shape of constant density
    * That point is called M2
* For triangles, M2 is at the mean of the vertices
* For general polygons there are M2 formulae
* It arises as the weighted average of the centroids of triangles in a standard triangularization of the polygon, where the weights correspond to the triangle areas
* M3 is the center of the Minimum Bounding Rectangle
* The MBR center is fastest to compute, but not invariant under rotation, and is the most subject to outliers.
* With polygons of complex shape, M2 may lie outside hte boundary
* Alternative to MBR is to find the smallest circle that completely encloses the polygon, taking the center of the polygon as the polygon center, call that M4
* Another alternative is to find the center of the largest inscribed circle, M5

#### Point sets

* M1 mean center is just the average of coordinate values
* You can use weighted average if it makes more sense

#### Lines

* Center is the point equidistant from the ends
* Polyline center is in the plane, not necessarily on the line
* No accepted formula for collections of lines.

### 4.2.6 Point (object) in polygon (PIP)

* Line in polygon and polygon in polygon are related problems
* Standard algorithm for PIP in vectors (the semi-line algorithm) is to extend a line vertically upwards (or horizontally) and then count the number of times this line crosses the polygon boundary. If it crosses an odd number, it's inside the polygon.
* Special cases are points on the boundary or at a vertex, or directly below a vertical segment of the boundary.
* Second PIP algorithm that requires trig (and is therefore more processor intensive) is the winding number method
    * A line is extended to each vertex of the polygon from the sample point in turn (traversing counterclockwise). If the sum of the angles from the point to the vertices, vi, is 0 the point lies outside the polygon, otherwise inside.

### 4.2.7 Polygon decomposition

* Lots of ways to do it, lots of reasons to do it.
* Most GIS packages support some decomp procedures, through overlay of template or cookie cutter polygons, and/or through the explicit decom procedures
* Complex polygons with convoluted boundaries may be divided up into a series of non-overlapping convex polygons

### 4.2.8 Shape

* In practice defining some form of shape measure that provides an adequate description is difficult and many indices and procedures have been proposed."
* Shape measures can be applied to polygon forms or grid patches
* Comment from 5.3.4 about Landscape metrics, that also applies to vector/polygonal: "The most common measuresof shape complexity are based on the relative amount of perimeter per unit area, usually indexed in terms of a perimeter-to-area ratio, or as a fractal dimension, and often standardized to a simple Euclidean shape (e.g., circle or square). The interpretation varies among the various shape metrics, but in general, higher values mean greater shape complexity or greater departure from simple Euclidean geometry."
* Most GIS software packages don't provide shape index measures directly, so you have to roll your own.
* Example measures:
    * Perimeter / Area Ratio (P1A) - perimeter length / area
    * Perimeter^2 / Area Ratio (P2A) - perimeter length squared / area
    * Shape Index or Compactness Ratio (C)
    * Related bounding figure (RBF) - 1 - (area / area of bounding figure)

### 4.2.9 Overlay and combination operations

* Involve putting a map A on top of some other map B to create a layer C that is some combination of A and B. C is normally a new layer, but may be a modification of B.
* Typically A i spoints, lines, and/or polygons, B is polygons
* Assumption is that all objects are planar enforced
* Functions include:
    * Intersection
    * Union
    * Not
    * Exclusive OR (XOR)
    * Contained
    * Containing
    * Boundary
    * Touching
    * Neighboring
    * Split
    * Append / Merge
    * Integrate

### 4.2.10 Areal interpolation

* Problem in polygon on polygon overlays: how should attributes be assigned from input polygons to newly created polygons whose size and shape differ from the original set?
* Lots of related techniques:
    * Kernel density estimation
    * Proportional assignment
    * Weighted assignment based on distance decay function 

### 4.2.11 Districting and Re-districting

* Common analysis problem involves the combination of many small zones (typically stored as polygons) into a smaller number of merged larger zones or districts.
* The merge process is usually subject to spatial and attribute related constraints
    * Spatial constraints might be:
        * Districts must be comprised of adjacent (coterminous) regions
        * Districts must be sensible shapes (e.g., reasonably compact)
    * Attribute constraints might be:
        * No district may have less than 100 people
        * All districts must have a similar number of people
* This is a common, generalized problem
* For non-trivial numbers of regions, there are usually only heuristics
* "Districting and re-districting are generally processes of agglomeration or construction. The initial set of regions is reduced to a smaller set, according to selected rules. Automating this process involves a series of initial allocations, comparison of hte results with the constraints and targets, and then re-allocation of selected smaller regions until the targets are met as closely as possible."
* Additional problem types:
    * Scale effects (grouping or statistical) - Proportional makeup of areas may be similar but combining them creates odd effects because their absolute numbers scale the proportional effect in an odd way.
    * Zoning (arrangement) effects - the districting may have a bias at creation for some particular effect (electing a specific party, for instance)
* Automated zoning based on a 7 step approach, called AZP:
    1. Start by generating a random zoning system of N small zones into M regions, M lt N
    1. Make a list of the M regions
    1. Select and remove any region K at random from the list
    1. Identify a set of zones bordering on members of region K that could be moved into K without destroying the internal contiguity of the donor region(s)
    1. Randomly select zones from this list until either there is a local improvement in the current value of the objective function or a move that is equivalently as good as the current best. Then make the move, update the list of candidate zones, and return to step 4 or else repeat step 5 until the list is exhausted.
    1. When the list for region K is exhausted return to step 3, select another region, and repeat steps 4 to 6
    1. Repeat steps 2 to 6 until no further improving moves are made

### 4.2.12 Classification and Clustering

* Harvey, 1969: "Classification is, perhaps, _the_ basic procedure by which we impose some sort of order and cohereence upon the vast inflow of information from the real world."
* For the basics of classification within a GIS context, see Mitchell 1999 and Longley et al 2015
* "Classification needs to be seen in terms of purpose as well as method."

#### Univariate classification schemes

* In GIS software, univariate classification facilities are tools to:
    * aid in the production of chloropleth or thematic maps
    * explore untransformed or transformed datasets
    * Analyze (classify and reclassify) image data
    * display continuous field data
* Most classification is on discrete, distinct items that can belong to one class at a time
* There are other schemes for classifying objects with uncertain class membership
* Also things which require classification on multiple attributes
* Fundamental decisions include
    * what classification scheme(s) to use
    * what breakpoints to employ
* Some univariate classification schemes:
    * Unique values - each value is treated separately, mapped to a different color
    * Manual classification - analyst specifics the boundaries between classes required as a list, or specifies a lower bound and interval or lower and upper bound plus number of intervals
    * Equal interval, slice - attribute values are divided into n classes with each interval having the same width (range / n). Called 'slice' for raster maps.
    * Defined interval - variant of manual and equal interval, user defines each interval
    * Exponential interval - intervals are selected so that the number of observations in each successive interval increases or decreases exponentially
    * Equal count or quartile - Intervals selected so that the number of observations in each interval is the same. If each contains 25% of the total, it's quartile classification.
    * Percentile - variant of equal count or quantile. Equal percentages are included in each class (1-10%, 11-20%, etc)
    * Natural breaks / Jenks - forms of variance minimization classification. Breaks are uneven, and are selected to separate values where large changes in value occur.
    * Standard deviation - mean and std dev of the attribute values are calculated, and values are classified according to the deviation from the mean
    * Box - variant of quartile designed to highlight outliers. Typically six classes are created, which is 4 quartiles plus two further based on outliers. Outliers are data items whose value is more than 1.5 times the inter-quartile range from the median.
* The Jenks Natural Breaks algorithm:
    1. User selects an attribute x to be classified and specifies the number of classes, k
    1. A set of k-1 random or uniform values are generated in the range [min{x},max{x}]. These are used as initial class boundaries.
    1. The mean values for each initial class are computed and the sum of squared deviations of class members from the mean values is computed. The tottal sum of squared deviations (TSSD) is recorded
    1. Individual values in each class are then systematically assigned to adjacent classes by adjusting the class boundaries to see if the TSSD can be reduced. This is an iterative process, which ends when improvement in TSSD falls below a threshold level, i.e., when the within class variance is as small as possible and between class variance is as large as possible. True optimization is not assured. The entire process can optionally be repeated from tep 1 or 2 and TSSD values compared.

#### Multivariate classification and clustering

* Harvey, 1969, describes the key steps of multivariate classification:
    * quantitative analysis of the inter-relationships among the attributes or among the objects
    * transformation or reductino of the correlations to a geometric structure with known properties (usually Euclidean)
    * grouping or clustering of the objects or attributes on the basis of the distance measured in this transformed space, and once the classes have been firmly identified
    * the development of rules for assigning phenomena to classes
* Most statistical and mathematical libraries give you tools for classification and assignment outside a spatial context, including:
    * facilities used to reduce complexity / dimensionality of the source datasets, like factor analysis, principal components analysis, and multidimensional scaling
    * facilities to identify clusters within the dataset, either on a single level for a fixed number of clusters (K-means) or on a hierarchical basis
    * facilities for optimally assigning new observations to existing classes (linear discriminant analysis)
* K-means clustering attempts to partition a multivariate dataset into K distinct clusters such that points within a cluster are as close as possible in multi-dimensional space, and as far away as possible from points in other clusters.
* The cluster procedure is:
    * Start with a set of K initial cluster centers. These may be assigned as:
        * random locations in n-space within the observed data ranges
        * K uniformly sited locations within the observed data ranges
        * a user defined set of K locations
        * by selecting K datapoints at random from the observed set
        * a set of K locations obtained by clustering a small subset of the data using random or uniform allocation. 
    * A minimum separation distance for starting points may be specified
    * The distance between every point and each of the K means is computed, based on some predefined metric (typically Minkowski / city block distance)
    * Points are assigned to the nearest center. Any entirely empty clusters may be discarded, and optionally a new start point included.
    * The location of the center of each cluster is then recomputed based on the set of points allocated to that center, and the previous step is repeated.
    * This is repeated until 
        * no further reassignments occur
        * or a preset number of iterations is reached
        * or no cluster center is moved by more than a pre-specified amount
    * The total distance (DSUM) of all points to their K centers is calculated
    * Each point is re-examined in turn and checked to see if DSUM is reduced if the point is assigned to another cluster. If DSUM is reduced the point is reassigned to the cluster that results in the maximum overall reduction.
    * Stopping criteria may be determined by setting a limit to the number of iterations of the process, or the level of change in DSUM, or the number or percentage of data points that continue to be reallocated, or some combination of those criteria.
    * Special consideration may be given to the re-allocation of data items where the cluster membership is very small (lt 1% of all data). Option to remove low membership clusters and reallocate their members is quite common.
    * Entire process may then be repeated with a different choice of starting points. 
    * Generic clustering algorithms (like K means) may result in many spatially isolated pixels or zones, which may be members of a well-represented class (gt 1%). In some instances a smoothing filter can consolidate such occurrences with their surrounding zones, but must be applied with care since the resultant classification will knowingly contain mixtures.
    * It is often done to assign different weights to clusters when finalizing the classes, in accordance with a priori interpretation of the resulting outcomes. The benefits of doing that should be set out in a clear and transparent manner to aid interpretation.
* Linear Discriminant Analysis (LDA) is done in Idrisi
* LDA assumes you have P classes and P linear discriminant functions
* The functions are like linear regression equations, and are computed by analysis of training site data comprised of m image bands.
* Once you have the weights for each linear function, a set of P weighted sums is then calculated for each pixel in the target image and the sum that has the highest value/score is take as the class to which the pixel is to be assigned.

#### Multi-band image classification

TODO: RETURN HERE 

# Chapter 5: Data Exploration and Spatial Statistics

## 5.1 Statistical Methods and Spatial Data

* R Spatial is an R package with facilities for:
    * point pattern analysis
    * geostatistics
    * disease mapping and analysis
    * spatial regression
    * ecological analysis
* "The nature of these [R] extensions is different from the ways in which multivariate statistics are dervied from their univariate counterparts because of the ways in which they depend upon the fundamental organizing concepts of distance, direction, contiguity, and scale."
* Crossey (1993) gave a taxonomy of spatial statistics based on the underlying data model being considered. Three main topics he identified:
    * point pattern analysis - corresponding to a location-specific view of the data
    * lattice or regional analysis - corresponding to zonal models of space, notably planar enforced sets of regions
    * geostatistical modeling - applying to a continuous field view of the underlying dataset
* Anselin (2002) revises and furthers Crossey's taxonomy.
* Implications of data models after Anselin 2002:

    |   | Object | Field |
    |---|--------|-------|
    | GIS | vector | raster |
    | Spatial Data | points, lines, polygons | surfaces |
    | Location | discrete | continuous |
    | Observations | process realization | sample |
    | Spatial Arrangement | spatial weights | distance function |
    | Statistical Analysis | lattice | geostatistics |
    | Prediction | extrapolation | interpolation |
    | Models | lag and error | error |
    | Asymptotics | expanding domain | infill |

* Perry et al 2002 gives an excellent review of spatial pattern analysis and statistical methods

### 5.1.1 Descriptive Statistics

* Almost all GIS packages have univariate statistical measures for tabular attribute data associated with vector objects.
* Often tools are provided for frequency histograms, with or without data transformation
* For image or grid datasets, many packages have both spatial and non-spatial statistical methods
* Purely non-spatial stuff treats grid cell values as attribute values
* Some tools include facilities for data reduction and modeling / regression
* Much of what is commonly called 'spatial statistics' deals with vector datasets, and many of the tools and techniques apply directly or indirectly to point rather than line/area based data.
* Increasingly you see integrated tools like GeoDa, PySal, and SAM for direct exploration, analysis, and modeling of zone-based data and small area (local) patterns.

### 5.1.2 Spatial sampling

* This section focuses on 2D sampling, but similar concepts apply to 1D (transect) and 3D (volumetric) sampling.
* When analyzing spatial samples, you have to consider factors like:
    * sample size
    * how representative the sample is
    * whether the sample might be biased in any way
    * whether temporal factors are important
    * to what extent edge effects might influence the sample and analysis
    * whether sampled data has been aggregated
    * how the original measurements were conducted
    * whether sampling order or arrangement is important
    * to what extent can the measured data samples be regarded as being from a population
* Basically the classical set of sampling concerns plus some spatial issues
* Some of the most common sampling schemes are those based on point sampling within a regular grid framework:
    * A. Regular point based sampling: grid the 2D space, sample the center of each grid square
    * B. Random point based sampling: randomly sample n points in the space
    * C. Random offset from regular: within each grid square, randomly sample one point
    * D. Regular with random start of sequence (y offset): instead of sampling each grid square center, sample at regular x and y intervals with a randomized initial y offset, so that you might sample at (0.5,0.24), then at (0.5, 0.74), etc.
* A and D suffer from two major problems:
    1. the sampling interval may coincide with some periodicity of the data under study
    1. the set of distances sampled is effectively fixed, so important distance related effects like dispersal, contagion, etc may be missed entirely.
* Purely random sampling (B) can be useful but almost inevitably forms clusters and voids
* C attempts to short-cut some of these issues by randomizing the offset from regularly spaced intervals in the study space
* There are also adaptive schemes (as opposed to the fixed ones above) that can offer improvements in terms of estimating mean values and reducing uncertainty / variances
* Typically adaptive schemes have four steps:
    1. apply a coarse resolution fixed scheme (as in C above)
    1. Record data at each sampled location
    1. Compute decision criteria for continued sampling
    1. Extend sampling in the neighborhood of locations that meet the decision criteria

#### Sampling Frameworks

* Most commonly 'sampling' and 'resampling' in GIS tools refer to the frequency with which an existing dataset is sampled for simple display or processing purposes (overlay, computing surface transects)
* Those ops are not related to statistical sampling
* Two aspects of statistical sampling are explicitly supported in several GIS packages:
    1. selection (sampling) of specific point or grid cell locations in an existing dataset
    1. removal of spatial bias from collected datasets via 'declustering'
* Different packages have different tools for assisting in sample selection
* ENVI - takes a raster image file as input, gives three sampling types:    
    * stratified random sampling, proportionate or disproportionate
    * equalized random sampling, which selects an equal number of observations at random from each class or region of interest (ROI)
    * random sampling that ignores ROIs and classes
* Idrisi - similar to ENVI via its SAMPLE function, which gives random, systematic, or stratified random point sampling from an input image / grid
* GRASS - gives random sampling that may be combined with masking to create forms of stratified random samples. Also gives a tool for generating random sets of cells at least D units apart
* TNTMips - range of point sampling facilities to be used within vector polygons
* Random points in the plane may be used as sampling points in connection with modeling, as in a Monte Carlo simulation of a probability distribution
* 'Quadrat sampling' - schemes in which information on all static point data (eg trees, bird nests, etc) is collected using an overlay of regular form (square or hexagonal grid). Collected data are aggregated at the level of the quadrat.
* Alternatively you can randomly drop quadrats onto the study space. They can be any size or shape, though circular forms are invariant under rotation. You can get repeat sampling this way if you're not careful.

#### Declustering


