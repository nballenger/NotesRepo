# Notes on GCP Documentation

From [https://cloud.google.com/docs/](https://cloud.google.com/docs/)

# Platform Overview

From [https://cloud.google.com/docs/overview/](https://cloud.google.com/docs/overview/)

## GCP Resources

* GCP is a combination of physical and virtual assets in Google data centers
* Each data center location is in a 'region' (Central US, Western EU, etc.)
* Each region is a collection of separate (resource isolated) 'zones'
* Zones identified by naming convention `<region>-<lc_letter>`, such as `asia-east1-a` (zone `a` in East Asia region)

## Accessing Resources through Services

* GCP 'services' provide access to underlying resources

## Global, Regional, and Zonal Resources

* 'Global resources' are accessible from any other resources in any region/zone, and include:
    * Disk images
    * Disk snapshots
    * Networks
* 'Regional resources' are accessible within a region, and include
    * Static external IP addresses
* 'Zonal resources' are accessible within a zone, and include
    * VM instances
    * VM instance types
    * VM disks
* An operation's scope varies depending on the types of resources you work with
* Important to understand regions/zones during app optimization

## Projects

* A 'project' is an overall organizing entity for grouping related resources
* Any resource you allocate must belong to a project
* A project is made up of:
    * Settings
    * Permissions
    * Other metadata
* Resources within a project can work together easily (subject to regions/zones rules)
* Resources can only connect to another project's resources via an external network connection.
* Each project has:
    * A name
    * A project ID
    * A project number (provided by GCP)
* Name/ID are human readable, number is just numeric
* Project IDs are unique across GCP, and IDs are single use only, even after deletion
* Each project is associated with one billing account, and multiple projects may bill resource usage to the same account.
* A project is a resource namespace--resources within a project must have a locally unique name, but you can reuse internal resource names in separate projects.

## Ways to interact with the services

### Google Cloud Console

* Web based GUI for managing projects and resources

### Command-line interface

* Google Cloud SDK provides `gcloud` CLI tool
* Can be used to manage both dev workflow and GCP resources
* Also provides 'Cloud Shell', a browser-based shell environment for GCP. Provides:
    * Temporary Compute Engine VM instance
    * CLI access via browser
    * Built in code editor
    * 5GB of persistent disk
    * Pre-installed GC SDK and other tools
    * Language support for Java, Go, Python, Node.js, PHP, Ruby, .NET
    * Web previews
    * Built-in auth for access to GCP Console projects/resources

### Client Libraries

* Cloud SDK has client libs that expose APIs for two main purposes:
    * App APIs provide access to services
    * Admin APIs offer resource management functionality

-----------------
# CI/CD on Google Cloud

From [https://cloud.google.com/docs/ci-cd/](https://cloud.google.com/docs/ci-cd/)

## Quickstart for Docker

From [https://cloud.google.com/cloud-build/docs/quickstart-docker](https://cloud.google.com/cloud-build/docs/quickstart-docker)

* Explains how to use Cloud Build to build a docker image and push it to Container Registry

### Before you Begin

1. In the console, select or create a GC project
1. Make sure billing is enabled for the project (go to the project in the console, click "billing" in the left hand nav, if it's disabled you'll get a popup)
1. Enable the Cloud Build API (not sure how to do that from the console)
1. [Install and initialize the Cloud SDK](https://cloud.google.com/sdk/docs/)
1. Install the latest Google Cloud Client Libraries

------------------

# Node.js Bookshelf App

From [https://cloud.google.com/nodejs/getting-started/tutorial-app](https://cloud.google.com/nodejs/getting-started/tutorial-app)

* Shows how to use some GCP products:
    * App engine standard environment
    * Datastore
    * Cloud storage
    * Pub/Sub
* App stores a collection of book titles
* Anyone with access can modify
* Lets users
    * View list of books
    * Add to the list
    * Remove from the list
    * Edit book details
    * Upload cover images for books
* Objectives
    * Clone/download the sample app
    * Build and run it locally
    * Deploy to App Engine
    * Walk through the sample code
    * Learn how the app stores structured data
    * Learn how the app stores binary data in Cloud Storage
* Uses billable components

# Using Datastore with Node.js

* Installing dependencies
