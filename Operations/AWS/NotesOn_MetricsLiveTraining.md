# Metrics Live Training, 2018-12-10

* End to end monitoring
    * Compute - numeric, simple, OS-based metrics
    * Network - numeric, simple, latency, requests, etc.
    * Storage - simple, IOPS, disk usage, RW latency
    * Database - queries/s, table index size, cache hit %
    * Application - complex, fn calls, page loads, dependency availability, workflow distribution ratios
    * Logs - complex, geolocation, fraud detection, intent analysis, recommendations
* Important to be able to monitor from the end user perspective.
* External monitoring happens outside AWS--has to be actually from the perspective of a customer.
* Basic AWS tools:
    * CloudWatch
    * Macie
    * GuardDuty
    * CloudTrail
    * AWS Config
    * Trusted Advisor
    * Systems Manager

For access loggng:
    S3 requires a bucket ACL
    CloudFront requires a buket ACL
    ELB requires a bucket pplicy
    API gateway requires an IAM role

Kinesis managed lambda using a firehose to push logs, for transforming logs to a certain format.

Kinesis

* Log Aggregation
* Actions
* Rules and filters
* Two parts: firehose and analytics

Setting up a Kinesis firehose delivery to S3

* Needs CloudWatch Logs, Kinesis, S3


