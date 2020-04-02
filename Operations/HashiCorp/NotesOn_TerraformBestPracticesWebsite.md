# Notes on terraform-best-practices.com

## Key Concepts

* **Resource** - tf resources, `aws_vpc`, `aws_db_instance`, etc. They:
    * Belong to a provider
    * Accept arguments
    * Output attributes
    * Have lifecycles
    * Can be created, retrieved, updated, deleted
* **Resource Module** - collection of connected resources that together perform a common action
* **Infrastructure Module** - collection of resource modules, which
    * May be logically disconnected but in a given situation serve a common purpose
    * Defines configuration for providers to pass to downstream resource modules and resources
    * Normally limited to work in one entity per logical separator (AWS Region)
* **Composition** - collection of infrastructure modules
    * Can span logically connected areas (AWS Regions, AWS accounts)
    * Used to describe complete infrastructure for a whole org or project
* **Data Source** - does RO operations, dependent on provider config, used in a resource module and infrastructure module
    * The `terraform_remote_state` data source acts as glue for higher level modules and compositions
    * The `external` data source lets an external program act as a data source, to expose arbitrary data for use elsewhere in TF
    * The `http` data source makes a GET request to a URL and exports info about the response
* **Remote State** - Shared persistence of module and composition state
* **Provider, provisioner, etc.** - TF objects that are explained elsewhere

### Hierarchy

* Infrastructure Composition
    * Infrastructure Module IM-A
        * Data Source DS-A
        * Data Source DS-B
        * Resource Module RM-A
            * Data Source RM-A-DS-A
            * Data Source RM-A-DS-B
            * Resource RM-A-R-A
            * Resource RM-A-R-B
        * Resource Module RM-B
            * Data Sources...
            * Resources...
    * Infrastructure Module IM-B
        * Data Sources...
        * Resource Modules...

### Why so difficult?

* If resources are atoms, resource modules are molecules.
* A resource module is the smallest versioned and shareable unit, with
    * An exact list of arguments
    * Basic logic for implementing its function
* Resource modules can be used alone, or together in an Infrastructure Module
* Data access across resource and infra modules is done with module outputs and data sources
* Access between compositions is done with remote state

## Code Structure

### How should I structure my TF configurations?

Questions to ask:

* What is the complexity of the project?
    * Number of related resources
    * Number of TF providers
* How often does the infra change? 
    * Once every N period? 
    * Continuously on commit?
* What are the code change initiators?
    * Does a CI server update the repository when a new artifact is built?
    * Only developers can push to the infra repository
    * Anyone can propose changes via PR, including the CI server
* What deployment platform or service?
    * CodeDeploy, Kubernetes, OpenShift all require different approaches
* How are environments grouped?
    * By environment? Region? Project?




