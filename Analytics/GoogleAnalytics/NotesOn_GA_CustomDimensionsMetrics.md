# Notes on Google Analytics Custom Dimensions and Metrics

## Custom Dimensions and Metrics Feature Reference

From [https://support.google.com/analytics/answer/2709828](https://support.google.com/analytics/answer/2709828)

### Overview

* Custom dimensions and metrics let you combine analytics data with non-analytics data. Examples:
    * If you stored gender in a CRM, you could combine that with your analytics data to see pageviews by gender
    * If you're a game dev, metrics like "level completions" or "high score" may be useful.
* Custom dimensions can appear as primary dimensions in custom reports, and be used as segments and secondary dimensions in standard reports

### Prerequisites

* Only available for properties that have been enabled for Universal Analytics or contain at least one app reporting view.
* Supported by SDKs, analytics.js, and the Measurement Protocol
* Require additional setup in your Analytics account and tracking code

### Limits and Caveats

* 20 indices available for custom dimensions, 20 for custom metrics
* 360 accounts have 200 indices each
* Custom dimensions cannot be deleted, but can be disabled
* Don't try to reuse custom dimensions.
* Editing the name, scope, and value of a custom dimension, both old and new values can be paired with either the old or new dimension name, which conflates data in reports in a way that can't be filtered away.

### Lifecycle of custom dimensions and metrics

* Four stages: Configuration, Collection, Processing, Reporting
* Configuration - define dimensions/metrics with an index, name, and other properties like scope
* Collection - send custom dimension and metric values to Analytics
* Processing - data processed using custom dimension/metric defs and reporting view filters
* Reporting - build new reports using custom dimensions and metrics

### Configuration

* Before you can send values, they have to be defined in a property.
* Defining it means setting values for the following, and getting an index number from which to reference it.
* Dimension config:
    * Name - name as it will appear in reports
    * Scope - which data the custom dimension/metric will apply to
    * Active - whether it will be processed
* Metric config:
    * Name - name as it will appear in reports
    * Type - how the custom metric value will display in reports
    * Min/max value - min and max values to process and display
    * Active - whether it will be processed
* Once you define a custom dimension or metric, don't edit the name or scope.

### Collection

* Dimensions and metrics are sent to GA at collection time as a pair of index and value parameters.
* The index corresponds to the index of the custom dimension/metric as assigned during configuration
* Unlike other data types, custom dimensions and metrics are sent to Analytics as parameters attached to other hits, like pageviews, events, etc.
* They therefore need to be set before a tracking call is made for the value to actually be sent to Analytics
* Example of setting a custom dimension value:

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto');

    // set value for custom dimension at index 1
    ga('set', 'cd1', 'Level 1');

    // send custom dimension with a pageview
    ga('send', 'pageview');
    ```

* Custom metrics with an Integer or Time type should be sent using integers
* Custom metrics with a Currency type should be sent as fixed decimal values appropriate to local currency.

### Processing

* During processing, scope determines to which hits a particular custom dimension value will be applied.
* View filters determine which hits and associated values are ultimately included in Reporting
* Scope and Precedence
    * Four levels of scope:
        * Product - value applied to the product (Enhanced Ecommerce only)
        * Hit - value applied to the single hit for which it is set
        * Session - all hits in a single session
        * User - all hits in current and future sessions, until value changes or custom dimension becomes inactive
    * Product level scope - because multiple products can be sent in a single hit, multiple product-level scoped dimensions can be sent in a single hit
    * Hit-level scope - Value applied ONLY to the hit with which value was set
    * Session-level scope - if two values are set at the same index in a session, the last value gets precedence and is applied to all hits in the session, overwriting any previous value set for that index in that session. Applies retroactively, since these are post-processed on the GA side, so if you change mid-session they all get the last value set.
    * User-level scope - same deal, but for future sessions too
* Filters
    * View filters can interact with custom dimensions/metrics in diff. ways:
        * Custom dim/metric values are each associated with the hit with which they were received, regardless of their scope.
        * If that hit is filtered by a view filter, the custom dimension or metric may also be filtered, depending on scope
            1. Hit-scope - both custom dimensions with hit scope and all custom metrics will be filtered even if the hit they are associated with is also filtered
            1. Session/user scope - dimensions not filtered even if the hit they were attached to is filtered. Values will still be applied to all hits in the current session / future sessions, respectively.

### Reporting

* After data gets through the processing pipeline, it's available in reports
* Custom dimensions/metrics are available in custom reports and available for use with advanced segments
* Custom dimensions can be used as secondary dimensions in standard reports

### Examples

* Shows how dims/metrics can be used by a game dev to measure player behavior
* Hypothetical:
    * Game dev has a new game
    * Current Analytics implementation tracks a screen view each time a user plays a level. Dev already knows how many times each level is played.
    * Want to answer:
        1. How many times are easy levels played versus medium/hard?
        1. How many levels played each day in 3 day trial?
        1. How many levels played in the trial vs paid users?
    * To answer, creates new custom dimensions are used to create new groupings of hits, sessions, and users.

### Hit level scope

* Use to find out how many levels of each difficulty level are played
* Already tracking number of times a level is played by screenview hits
* Report will count screen views by difficulty level
* Use hit level scope because the difficulty level should only be associated with the screenview for the level
* Configuration--create a custom dimension def like:
    * Index: 1
    * Name: Difficulty
    * Scope: Hit
    * Active: true
* Collection:
    * Dev already tracking screen views, just needs to set the dimension value just prior to the screen view hit being sent:

        ```javascript
        ga('create', 'UA-XXXXX-Y', 'auto');
        ga('set', 'cd1', 'easy');
        ga('send', 'screenview', '/level_1/');
        ```

* Processing - Data gets processed and aggregated by screen name and dimension value
* reporting - Assuming three levels and three difficulties, you'd get nine rows of output, with a count of screen views per screen/difficulty combination; could also get a custom report that uses Difficulty as a primary dimension, to get aggregated counts per difficulty

### Session-level scope

* Track how many levels are played per day in a three day trial

