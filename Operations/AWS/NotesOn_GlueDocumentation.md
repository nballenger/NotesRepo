# Notes on AWS Glue documentation

From [https://docs.aws.amazon.com/glue/index.html](https://docs.aws.amazon.com/glue/index.html)

# What is AWS Glue?

* Managed ETL service
* Consists of
    * Central metadata repository: AWS Glue Data Catalog
    * ETL engine that auto-generates Python or Scala
    * Scheduler for dependency resolution, job monitoring, retries
* When to use:
    * To build a data warehouse to organize, clean, validate, format data
    * Simplifies:
        * discovery and cataloging of metadata
        * populating the catalog with table defs from scheduled crawlers
        * Generating ETL scripts to transform, flatten, enrich
        * Detecting schema changes
        * Triggering ETL jobs based on a schedule or event
        * Gathering runtime metrics
        * Handling errors and retries automatically
        * Scaling resources as necessary
    * Can catalog S3 data, to make it available to Athena and Redshift Spectrum
    * Can create event driven ETL pipelines

# How it works

* Uses other AWS services to orchestrate ETL jobs
* Create jobs using table defs in your data catalog
* Jobs are scripts that contain transform logic
* Triggers are scheduled or event driven
* Glue generates code to transform data from source to target
* Runs ETL jobs in Apache Spark serverless env
* Designed to:
    * Segregate customer data
    * Protect customer data in transit and at rest
    * Access data only as needed in response to requests, using temporary, scoped down credentials, or with a customer's consent to IAM roles in their account
* For each tuple of customer account + IAM role + subnet id + security group, Glue creates a new, isolated Spark environment
* Creates ENIs in your subnet on private IPs, jobs use those to access data sources and targets

## Concepts

* Architecture:
    * Data Stores feed crawlers, which feed into the Data Catalog
    * You control the Data Catalog from the console
    * The Data Catalog can have jobs
    * Jobs are transform scripts that trigger on schedule or event
    * Jobs transform from a Data Source to a Data Target
* Typical actions you perform:
    * Define a crawler to populate the data catalog with metadata table defs
    * Glue can generate a script or you provide one
    * You run your job on demand
* Note: Tables and databases in Glue are objects in the Data Catalog, and contain metadata, but NOT the data itself.
* Text based data must be UTF-8 encoded for successful processing.

## Components

* Data Catalog is a drop-in replacement for Apache Hive Metastore
* Glue Console lets you manage ETL workflow and data catalog
* Glue Data Catalog
    * Persistent metadata store, same as Apache Hive metastore
    * Each AWS account has one Glue Data Catalog
    * Use IAM policies to control access to the data sources managed by the data catalog
    * Other services and projects can use the data catalog:
        * Athena
        * Redshift Spectrum
        * Amazon EMR
        * Glue Data Catalog Client for Apache Hive Metastore
* Glue crawlers and classifiers
    * Crawlers can scan data in all kinds of repositories, classify it, extract schema info from it, and store metadata into the data catalog to guide ETL operations
* Glue ETL operations
    * Using the metadata in the data catalog, Glue can autogenerate Scala or PySpark (Python API to Apache Spark) scripts with Glue extensions
* Glue Jobs System
    * Mangaged infrastructure to orchestrate ETL workflow
    * Jobs can be scheduled and chained
    * Jobs can be event triggered

## Converting semi-structured schemas to relational schemas

* Common task is conversion of semi-structured data to relational data
* Conceptual operation is to flatten a hierarchical schema to a relational one
* Glue can do this on the fly
* Glue uses crawlers to infer the schema of semi-structured data, then transforms it using ETL jobs to a relational schema

# Getting Started

## Setting up IAM permissions for Glue

1. Create an IAM service policy for Glue
1. Create an IAM role for glue with the service policy attached, and a policy for the S3 resources that are used by Glue
1. Attach a policy to IAM users that access Glue
1. Create an IAM policy for Notebooks
1. Create an IAM role for Notebooks
1. Create an IAM policy for SageMaker notebooks on development endpoints
1. Create an IAM role for SageMaker notebooks

## Setting up DNS in your VPC

* Make sure that DNS hostnames and DNS resolution are both enabled in the VPC
* If you use R53, confirm that your config does not override the DNS network attributes

## Setting up your environment to access data stores

* To run ETL jobs glue has to be able to access data stores
* If a job does NOT have to run in a VPC (as in S3 to S3 transforms) then you don't have to do any additional config
* If a job has to run in a VPC subnet, as when transforming data from a JDBC datastore in a private subnet, Glue sets up ENIs that enable jobs to connect to other resources securely in the VPC
* All JDBC datastores accessed by the job must be available from the VPC subnet
* To access S3 from inside a VPC, you need a VPC endpoint
* If a job needs access to both VPC resources and the public internet, the VPC has to have a NAT gateway
* A job or dev endpoint can only access one VPC and subnet at a time
* To access data stores in different VPCs, options are:
    * Use VPC peering
    * Use an S3 bucket as an intermediate storage location, and split the work into two jobs with that in the middle
* For JDBC datastores, you create a connection in Glue with the necessary properties to connect to teh data stores

### VPC Endpoints for S3

* A VPC endpoint for S3 lets Glue use private IPs to access S3 with no exposure to the public internet
* Glue doesn't need public IPs, you don't need an IG or NAT, or a VPN to the VPC
* You use endpoint policies to control access, and traffic never leaves AWS
* When you create a VPC endpoint for S3, any requests to an S3 endpoint within the region are routed to a private S3 endpoint in the AWS network
* You don't have to modify anything, the endpoint name stays the same, but the route is entirely internal

## Setting up your environment for development endpoints

* To run ETL scripts with Glue, you sometimes develop and test scripts with a development endpoint.
* When you set one up, you have to tell it VPC, subnet, and security groups
* Setting up the network for a dev endpoint
    * To allow glue to access resources, add a row in the subnet route table to associate a prefix list for S3 to the VPC endpoint
    * A prefix list id is required for creating an outbound security group rule to allow traffic from a VPC to access an AWS service through a VPC endpoint
    * To make connecting to a notebook server from a local machine easier, add a row to the route table to add an IG id
    * Subnet routes table should be similar to

        ```
        Destination                 Target
        10.0.0.0/16                 local
        pl-id for S3                vpce-id
        0.0.0.0/0                   igw-xxxx
        ```

    * To allow Glue to communicate between its components, specify a security group with a self-referencing inbound rule for all TCP ports
    * Creating a self-referencing rule restricts the source to the same security group in the VPC, and is not open to all networks
    * Details for this here, not reproducing
* Setting up EC2 for a notebook server
    * With a dev endpoint you can create a notebook server to test your ETL scripts with Zeppelin notebooks
    * To allow communication to your notebook, set up a security group with inblund rules for 443 and 22, and make sure the rule's source is `0.0.0.0/0` or the OP of the machine connecting to the notebook

## Setting up Encryption in Glue

* Workflow here that has the highlights on configuring encryption with KMS keys

## Console Workflow Overview

1. Populate the Data Catalog with table definitions
    * Add a crawler
    * Choose data stores for the crawler to access
    * Optionally provide a custom classifier to infer the schema of hte data
    * Crawler reads the stores and creates data definitions in the DC
    * You can also create metadata tables manually
    * Typically better to let crawlers do it to avoid errors
1. Define an ETL job to take data from source to target, typically making these choices:
    * Pick a table to be the job data source. Job uses this table def to access the data store and interpret the data's format
    * Pick a table or location from the DC to be the job target
    * Tell Glue to generate a PySpark script to transform data from source to target
1. Run the job to transform the data
1. Monitor schedule crawlers and triggered jobs
