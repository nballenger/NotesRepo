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
