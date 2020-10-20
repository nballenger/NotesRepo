# Notes on Practical Statistics for Data Scientists, 2nd Edition

By Peter Bruce, Andrew Bruce, Peter Gedeck; O'Reilly Media, May 2020

ISBN 9781492072942

# 1. Exploratory Data Analysis

## Elements of Structured Data

* Types of structured data:
    * Numeric
        * Continuous - float or decimal, values have full variability within the precision given for the data storage, represent things like wind speed, time duration, etc.
        * Discrete - integer, values represent things like counts.
    * Categorical
        * Binary - 0/1, yes/no, true/false
        * Ordinal - ordered

## Rectangular Data

* General term for 2D matrix
* Rows are records/cases
* Columns are features/variables
* Nonrectangular data may be things like
    * time series data
    * spatial data in object or field representation
    * graph data

## Estimates of Location

* Basic step in data exploration is to get representative values for variables
* Representative measures:
    * mean - sum of all values divided by count of values
    * weighted mean - sum of all values times a weight, divided by sum of weights
    * median - value such that half is above, half below
    * percentile - value such that P percent of the data is below
    * Weighted median - value such that one half the sum of the weights is above and below the sorted data
    * Trimmed mean - average of all values after dropping a fixed number of extreme values
* Other terms
    * Robust - not sensitive to extreme values
    * Outlier - data value very different from the rest of the data

## Estimates of Variability

* Location is one dimension of summarizing a feature, second dimension is 'variability' or 'dispersion'
* Measures whether values are tightly clustered or spread out
* Terms:
    * Deviations - difference between observed values and estimate of location
    * Variance - sum of squared deviations from the mean divided by n-1
    * Standard deviation - square root of the variance
    * Mean absolute deviation - mean of absolute values of the deviations from the mean
    * Median absolute deviation from the median - median of absolute values of the deviations from the median
    * Range - difference of largest and smallest values in a data set
    * Order statistics - metrics based on data values sorted from smallest to biggest
    * Percentile - value such that P percent of the values take on thsi value or less, and 100-P percent take on this value or more
    * Interquartile range - difference between 75th percentile and 25th percentile

## Exploring the Data Distribution

## Exploring Binary and Categorical Data

## Correlation

## Exploring Two or More Variables

# 2. Data and Sampling Distributions

## Random Sampling and Sample Bias

## Selection Bias

## Sampling Distribution of a Statistic

## The Bootstrap

## Confidence Intervals

## Normal Distribution

## Long-Tailed Distributions

## Student's t-Distribution

## Binomial Distribution

## Chi-Square Distribution

## F-Distribution

## Poisson and Related Distributions

# 3. Statistical Experiments and Significance Testing

## A/B Testing

## Hypothesis Tests

## Resampling

## Statistical Significance and p-Values

## t-Tests

## Multiple Testing

## Degrees of Freedom

## ANOVA

## Chi-Square Test

## Multi-Arm Bandit Algorithm

## Power and Sample Size

# 4. Regression and Prediction

## Simple Linear Regression

## Multiple Linear Regression

## Prediction Using Regression

## Factor Variables in Regression

## Interpreting the Regression Equation

## Regression Diagnostics

## Polynomial and Spline Regression

# 5. Classification

## Naive Bayes

## Discriminant Analysis

## Logistic Regression

## Evaluating Classification Models

## Strategies for Imbalanced Data

# 6. Statistical Machine Learning

## K-Nearest Neighbors

## Tree Models

## Bagging and Random Forest

## Boosting

# 7. Unsupervised Learning

## Principal Components Analysis

## K-Means Clustering

## Hierarchical Clustering

## Model-Based Clustering

## Scaling and Categorical Variables
