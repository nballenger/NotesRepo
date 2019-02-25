# Summary of Various Documents about Info. Architecture

## Data Lake Architecture, by Bill Inmon

By Bill Inmon; Technics Publications, April 2016; ISBN 9781634621175

### Executive Summary

There are many poorly structured and inefficient Big Data implementations whose primary fault is that they are not rigorous about what data they ingest or how they structure and manage that data. Throwing all datasets into a common pool creates a 'data lake,' which is difficult for anyone but data scientists to make use of. Inmon suggests a 'data pond' architecture as an alternative, in which datasets enter a 'raw pond' initially, then are moved to more structured ponds by a process of well-documented and rigorous transformation and integration. These additional ponds (analog, application, and textual) have strong data models (for analog and application data) and taxonomies / ontologies (for textual data), and are built to support analyses relating to specific business targets. Data which is no longer analytically useful is periodically moved to an 'archival pond,' to keep the other ponds from becoming inefficient due to high signal-to-noise ratios.

### Extended Summary

* "Big Data" was done clumsily by many large entities, and they essentially formed 'data lakes': large collections of datasets that are poorly integrated, may have questionable or inaccessible metadata, and whose transformation status and audit trails may be unavailable. These lakes fail to support analysis well, and are usable only by well trained data scientists, and even then are not structured for efficient analytical access.
* Inmon suggests that instead of a 'lake,' data be sectioned into 'ponds.' His ponds include:
    * A 'raw' pond that hold ingested but untransformed datasets
    * Three or four post-transform ponds specific to data categories:
        * An 'analog' pond that holds machine-generated or time series data
        * An 'application' pond to hold record based app data
        * A 'textual' pond for natural language document data
        * Optionally a 'miscellaneous' pond for ad hoc analysis of raw data
    * An 'archival' pond for data which is worth keeping, but which is minimally useful for routine analytical work
* When moving data from the raw pond to any of the post-transform ponds, the process looks roughly like:
    * Determine data classification: is it analog, application, or textual?
    * Generate and attach relevant metadata, metaprocess, and contextual information
    * For application and analog data, restructure and integrate the dataset to meet the data model criteria of the pond they are entering; for textual data restructure and make uniform according to specific taxonomies and ontologies.
* Inmon suggests a generic structure for data ponds and their attendant data, including these common features:
    * Pond descriptor - description of contents and data origins, possibly including:
        * Frequency of update / refreshment - how often data is ingested / worked on
        * Source description - lineage of the data in the pond
        * Volume of data - general description of how much data is there
        * Selection criteria - criteria used to select data for inclusion
        * Summarization criteria - description of summary algorithms
        * Organization criteria - description of data organization
        * Data relationships - description of relations between data in the pond
    * Pond target - describes the relationship between business needs and data in the pond. Often a formal or informal data model that shapes the pond data.
    * Pond data - the actual data storage itself
    * Pond metadata - description of the pond data
    * Pond metaprocess - info on transforms applied to pond data, possibly including information like:
		* Data sources
		* Record and source selection criteria
		* Frequency of update
    * Pond transform criteria - documentation of how transforms should occur, so things like excision thresholds, quantization brackets, relevant taxonomies, etc.
* Analog data is typically machine-captured time-series data, for which:
	* Total dataset size tends to be very large; remarkable or interesting data points therefore appear sparsely.
    * It is common (and problematic) that descriptor data (regarding how and why the data was originally collected) is lost or never captured by the data ingestion process.
	* Techniques for conditioning and 'data reduction' may include:
        * Excision via deduplication, thresholding, smoothing (removal of outliers), and clustering / quantization
        * Data compression, both at the storage level and via encoding / tokenization of data values, as well as rounding (compression by removal of unnecessary digits of precision)
        * Interpolating data points, either directly or by quantization
* Application data is largely shaped by the 'infrastructure of the operational system.' That is to say that how and why it was recorded and ingested at initial capture by the source application has a high degree of relevancy to what the data means. In working with app data, consider:
    * Operational processing concerns that may be relevant to the data include:
        * The granularity of measurements
        * Overall organization of the data
        * The specific content of individual records
        * Which business events are noteworthy
        * The timing and sequence of business events
    * Application data is often stored (by the source app) in a record-based, relational format. That format may be retained or transformed during ingestion into the data pool, to more clearly serve analytic and business targets.
    * Application data storage requires an integrated data model, to allow transformation to include a realistic integration step that can match data across related or intersected applications.
    * Data model changes must be tracked over time, to allow comparative analysis between old and new data
* Textual data requires disambiguation, which involves standardization and contextualization. Textual work involves:
    * Because a 'data model' does not ingest textual data well, you must use taxonomies (classification systems for related terms) and ontologies (groupings of related taxonomies) during disambiguation.
    * Standardization of textual data is typically some form of tokenization, while contextualization involves the production of metadata and indices to aid search and aggregation.
    * Typical tools for natural language processing include:
        * Inline contextualization and proximity analysis
        * Alternate spelling and homographic / acronym resolution
        * Custom pattern / variable recognition (e.g., phone numbers are X digits in these patterns)
        * Taxonomy resolution
        * Datetime standardization
    * Textual data should always retain a metadata linkage to its original source document.
* When working with formed data ponds, consider:
    * They have a large number of structural commonalities. All data ponds:
        * ingest raw data
        * transform and condition that data
        * produce a uniform and integrated set of data products
        * support some form of business analysis
        * have a supporting infrastructure of data and process documentation
    * Their dissimilarities include:
        * The class of data ingested is quite different
        * The transformation process is in many cases very different
        * The type of analysis done is very different
    * Most analytical work is done within a single pond. Cross-pond analyses should:
        * be supported by well-integrated metadata across ponds, to avoid apples-to-oranges problems
        * not directly move data between ponds, as you risk losing connection between the moved data and any supporting infrastructure in terms of data model and documentation
    * If you require a miscellaneous data pond to support ad-hoc analytical work on data in the raw pond, maintain high standards for that pond in terms of metadata and metaprocess. 
* Analyses (on a data pond architecture or otherwise), typically:
    * Fall into two major conceptual categories:
        * Finding a specific, small dataset within the entire corpus (e.g., last purchase by John Smith)
        * Aggregating over a large vista of data (average purchase total this year by people named John)
    * May be impeded by:
        * inability to distinguish signal from noise in a large body of records
        * inability to gain results with high confidence due to a possible lack of upstream rigor
        * having unclear criteria for finding data (weak metadata and/or business case integration)
        * having data that requires large amounts of post-search transformation
* Inmon arguest that pond data analysis should be more efficient and stronger because it is:
    * filtered to reduce signal to noise
    * converted and integrated to ensure uniformity and connectedness
    * structured to support specific business targets
    * rigorous and documented enough to allow high confidence results

