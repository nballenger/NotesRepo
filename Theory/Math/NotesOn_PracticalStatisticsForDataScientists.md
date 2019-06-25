# Notes on Practical Statistics for Data Scientists

By Andrew Bruce, Peter Bruce; O'Reilly Media, May 2017; ISBN 9781491952962

# Chapter 1: Exploratory Data Analysis

* EDA is a relatively new domain in stats
* In 1962, John Tukey published 'The Future of Data Analysis' and proposed a new discipline, 'data analysis', of which statistical inferenec was only one part.
* In 1977, Tukey published 'Exploratory Data Analysis', which sort of defined the field

## Elements of Structured Data

* Types:
    * continuous - any value in an interval
    * discrete - integer values
    * categorical - set values
    * binary - two values
    * ordinal - categorical with an ordering function
* Key ideas:
    * Data in software is usually classified by type
    * Data typing in software acts as a signal on which processing functions apply to that data

## Rectangular Data

* Rectangular data objects are things like spreadsheets or database tables/relations
* Key terms
    * data frame - rectangular data object
    * feature - column in a data frame
    * outcome - prediction created during a project
    * records - rows in a data frame

### Data Frames and Indexes

* Each piece of software uses its own indexing scheme

### Nonrectangular data structures

* Other types of data:
    * time series data - successive measurements of the same variable(s)
    * spatial data structures
        * object representation - focus is an object and its spatial coordinates
        * field view - focus on units of space and the value of a metric (pixel brightness, eg)
    * graph data structures - represent relationships
* Each data structure has a specialized set of methodologies
* Focus of the book is on rectangular data for predictive modeling

## Estimates of Location

* Key terms:
    * mean - sum of all values divided by number of values
    * weighted mean - sum of all values times a weight divided by sum of the weights
    * median - data point such that half the points are above in value, half below
    * weighted median - value such that one half the sum of the weights is above, half below, in sorted data
    * trimmed mean - average of all values, having dropped a fixed number of outliers
    * robust - not sensitive to extreme values
    * outlier - data value very different from most of the data
