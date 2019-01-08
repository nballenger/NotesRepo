# Notes on Geospatial Data and Analysis

By Bill Day, Jon Bruner, Aurelia Moser; O'Reilly Media, Inc, Feb. 2017

ISBN 9781491940556

# 1. An overview of geospatial analytics

* Has contextual roots in print cartography, contemporary development in defense applications, as the DoD has been the biggest consumer of geodata analytics.
* Additional driver has been telecom development. Esri is related to Ericsson in Sweden, and mobile devices yield a large amount of spatial data.
* Lots of other interest areas and drivers: fleet management, disaster recovery, climate change
* "The bottom line here is most often about control systems. Some 'thing' needs to be automated, and that automation process needs to be optimized. If that thing moves within the world, it generates geodata and must leverage spatial analytics."
* Whatever tool chain you use, geospatial work requires atypical data types, numerous layers of detail to process and visualize, and specialized algorithms.
* Sample of complexities in geospatial analysis:
    * Tiling rectangles for raster data
    * Overlays of vector graphics
    * Data sources may require statistical smoothing or interpolation
    * Some data sources have needle-in-haystack problems requiring sophisticated algorithms to identify points of interest, or locations that change drastically over time.
    * Other data sources give metadata for maps, but may provide conflicting info.
    * Data source formatting is a crazy jungle.
    * Data licensing is a pain.
    * Once you solve all that, you still have to have design, data visualization, interpretation, and storytelling skills.
* Historically SQL has been a bad tool for geo analysis, given the prevalence of extremely expensive operations like intersections of regions.
* Purpose built tools have cropped up, like PostGIS
* Even those have a hard time with geospatial big data
* What this report covers:
    * Low-scale commercial desktop GIS tools
    * Medium scale options like PostGIS and Lucene
    * Big data solutions like Hadoop
    * Open data from governments, NGOs, and private enterprises
    * How some of the largest consumers make use of geospatial data

# 2. Core Concepts: Key Issues and Extreme Overgeneralizations


