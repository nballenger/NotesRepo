# Notes on AWS Athena Documentation

From [https://docs.aws.amazon.com/athena/index.html](https://docs.aws.amazon.com/athena/index.html)

# What is Amazon Athena

* Interactive query service that analyzes data in S3 using standard SQL
* When should I use Athena?
    * Helps analyze unstructured, semi-structured, and structured S3 data
    * Can run ad-hoc queries using ANSI SQL without the need to aggregate or load the data into Athena
    * Integrates with Amazon QuickSight for data visualization
    * Use Athena to generate reports or explore data
    * Integrates with Glue Data Catalog to let you create tables and query data in Athena based on the metadata there.
* Accessing Athena
    * Console, JDBC/ODBC, API, or the Athena CLI via `aws athena`
* Understanding tables, databases, and the glue data catalog
    * Athena tables and databases are containers for the metadata definitions that define a schema for the underlying source data.
    * For each dataset, a table needs to exist in Athena
    * The metadata in that table tells Athena where the data is in S3, the structure of the data, and the name of the table.
    * Databases are logical groupings of tables, and also have only metadata and schema info for a dataset
    * For every dataset you want to query, Athena has to have an underlying table to use for obtaining and returning query results
    * Before querying, you register a table in Athena
    * Registration happens when you create tables automatically or manually
    * Table creation registers the dataset with Athena
    * Registration happens either in the Glue Data Catalog or the internal Athena data catalog
    * To auto-create a table, use a Glue crawler from within Athena
    * To manually create a table, do one of:
        * Use the console's Create Table Wizard
        * Use the console to write Hive DDL statements in the query editor
        * Use the API or CLI to execute an SQL query with the DDL
        * Use the Athena JDBC or ODBC driver
    * When you create tables and databases manually, Athena uses the HiveQL DDL statements to create tables and databases in the Glue data catalog
    * When you query an existing table, Athena uses Presto under the hood, which is a distributed query engine
* AWS service integrations with Athena let you query data from other AWS services in Athema
    * CloudTrail - query log data
    * CloudFront - query log data
    * Elastic Load Balancing - query log data
    * VPC - query flow logs
    * CloudFormation - See AWS::Athena::NamedQuery in CF
    * Glue DC - integration with Glue
    * QuickSight - connects to Athena with ODBC/JDBC
    * IAM - actions for Athena

# Setting Up

* Attach managed IAM policies for Athena to your user
    * `AmazonAthenaFullAccess`
    * `AWSQuicksightAthenaAccess`
    * Any additional permissions to access the underlying S3 data

# Getting Started

1. Create a database: `CREATE DATABASE mydatabase`
1. Create a table
    * Select the database and do New Query
    * Use a create table like this:

        ```
        CREATE EXTERNAL TABLE IF NOT EXISTS cloudfront_logs (
            `Date` DATE,
            Time STRING,
            Location STRING,
            Bytes INT,
            RequestIP STRING,
            Method STRING,
            Host STRING,
            Uri STRING,
            Status INT,
            Referrer STRING,
            os STRING,
            Browser STRING,
            BrowserVersion STRING
        ) ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'
        WITH SERDEPROPERTIES (
              "input.regex" = "^(?!#)([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+([^ ]+)\\s+[^\(]+[\(]([^\;]+).*\%20([^\/]+)[\/](.*)$"
        ) LOCATION 's3://athena-examples-myregion/cloudfront/plaintext/';
        ```

1. Query data

    ```
    SELECT os, COUNT(*) count
    FROM cloudfront_logs
    WHERE date BETWEEN date '2014-07-05' AND date '2014-08-05'
    GROUP BY os;
    ```

# Integration with Glue

* When you create a table in Athena, you can choose to create using a Glue crawler

## Best practices when using Athena with Glue

* You can use Glue to create databases and tables (schema) to be queried in Athena, or you can use Athena to create schema and then use them in Glue, etc.
* Athena uses Presto to execute DML statements, and Hive to execute DDL statements to create and modify the schema

### Database, Table, and Column Names

* When creating schema, consider
    * DB name cannot exceed 252 chars
    * Table name cannot exceed 255 chars
    * Column name cannot exceed 128 chars
    * Only acceptable characters for names are `[a-z0-9_]`
* You can use the Glue Catalog Manager to rename columns, but table names and db names cannot be changed. To correct a name you have to create a new db an copy the metadata tables to it

### Using Glue Crawlers

* Scheduling a crawler to keep the DC and S3 in sync
    * If you have data that arrives for a partitioned table at a fixed time, you can set up a crawler to run on schedule to update
