# Notes on Practical Statistics for Data Scientists

By Andrew Bruce, Peter Bruce; O'Reilly Media, May 2017

ISBN 9781491952962

# Chapter 1: Exploratory Data Analysis

* For a long time statistics was mostly concerned with inference. Tukey 1977 established 'Exploratory Data Analysis' as a thing.

## Elements of Structured Data

* Terminology
    * Continuous data - data that can take on any value in an interval; interval, float, numeric
    * Discrete - data that can take on only integer values, like counts; integer, count
    * Categorical - data that can take on only a specific set of values representing categories
    * Binary - bi-valued data
    * Ordinal - categorical data with explicit ordering
* Two basic types of structured data: numeric and categorical
* Benefits of identifying data as categorical (as distinct from text):
    * signals to software which statistical procedures can be done on it
    * storage and indexing can be optimized
    * possible values a variable can take can be enforced in software

## Rectangular Data

* Typical frame of reference for an analysis in data science is a 'rectangular data' object, like a spreadsheet or db table
* Terminology for rectangular data:
    * Data frame - basic data structure (rectangular data) for statistical and ML models
    * Feature - column in a table / frame
    * Outcome - dependent variable, response, target, output
    * Records - rows in a data frame
* Data frames are essentially 2d matrices
* Data doesn't always start in that form, must be manipulated to get there

### Data Frames and Indexes

* In `pandas` the basic rectangular structure is a `DataFrame` object
* By default those have an automatic integer index based on row order
* You can also set multilevel/hierarchical indexes to improve efficiency
* In R, the basic object is `data.frame`, whcih also has an implicit row index
* You can create custom keys via `row.names`, but `data.frame` doesn't support user created or multi-level indexes.
* You can use the `data.table` and `dplyr` packages to do multilevel indexing.

### Nonrectangular data structures

* There's other stuff out there (spatial, time series, etc), but the book is focused on rectangular.

## Estimates of Location

* Variables with measured or count data can have thousands of distinct values. 
* Good to get typical values for each feature/variable to determine the central tendency of that variable
* Terms for estimates of location
    * Mean - average, sum of all divided by the number of values
    * Weighted mean - sum of all times a weight divided by sum of the weights
    * Median - value such that one half the data is above, one half below
    * Weighted median - value such that one half the sum of the weights is above, half below
    * Trimmed mean - average of all values after dropping a fixed number of extreme values
    * Robust - not sensitive to extreme values
    * Outlier - data value very different from most of the other data

