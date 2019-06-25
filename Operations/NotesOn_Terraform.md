# Notes on Terraform documentation

## Introduction to Terraform

From [https://www.terraform.io/intro/index.html](https://www.terraform.io/intro/index.html)

### What is Terraform

* Multi-provider manager for infrastructure resources
* Config files describe components, Terraform generates an execution plan to reach a desired state, then executes it to build the desired infrastructure.
* Key features:
    * Infrastructure as code - declarative resource state, of arbitrary complexity
    * Execution plans - describe what will happen to reach resource state
    * Resource graph - builds a graph of all resources, parallelizes creation / modification of non-dependent resources
    * Change automation - directly applies complex changesets, with minimal human action

### Use Cases

#### Heroku App Setup

* Heroku is a PaaS for hosting web apps
* Terraform can codify the setup for a Heroku app, configure DNSimple to set a CNAME, set up Cloudflare as CDN for the app

#### Multi-Tier Applications

* Examples of multi-tier:
    * 2 tier: web server tier and database tier
    * Multi: API servers, caching servers, routing meshes, etc.
* Tiers can scale independently
* Terraform can manage those infrastructures, manage dependencies between them, and scale them

#### Self-Service Clusters

* Codifies configurations so that non-ops teams can manage their own infrstructure

#### Software Demos

* Lets you demo in an actual cloud environment

#### Disposable Environments

* Codify your prod, then share that with dev
* Lets you spin up a dev quickly, dispose of it quickly

#### Software Defined Networking

#### Resource Schedulers

#### Multi-cloud Deployment

### Terraform vs. Other Software

* Gives you a flexible abstraction of resources and providers
* Can represent physical hardware, virtual machines, containers, email and DNS providers
* Can solve a bunch of different problems
* Terraform is not mutually exclusive with other systems

#### Vs. Chef, Puppet, Etc.

* Config management tools manage software on pre-existing hosts
* Terraform is not a config management tool
* Terraform lets config management tools focus on setting up a resource that has been created

#### Vs. CloudFormation, Heat, Etc.

* CF, Heat, etc., let you put infrastructure details into a config file
* Those let you elastically manage your infrastructure; Terraform solves the same problems
* Terraform goes further by being cloud-agnostic, and enabling you to combine / compose multiple providers
* Terraform separates the planning phase from the execution phase, by using the concept of an execution plan.
* On `terraform plan`, the current state is refreshed and the config is consulted to generate an action plan. 
* The plan includes all actions to be taken, and can be inspected by operators.
* `terraform graph` can visualize a plan to show dependencies
* Other tools combine planning and execution, which means operators have to reason about what will happen during actual execution, which does not scale.

#### Vs. Boto, Fog, Etc.

* Libraries only give you low level access, not high level orchestration.
* Terraform is declarative, not functional.

#### Custom Solutions

# The Core Terraform Workflow

From [https://www.terraform.io/guides/core-workflow.html](https://www.terraform.io/guides/core-workflow.html)

* Three steps:
    1. Write infrastructure as code
    1. Generate an execution plan and review it
    1. Apply the generated execution plan to produce infrastructure

## Working as an Individual Practitioner

### Write

* Configuration files are plain text, best stored in a versioned repo
* You'll iteratively move between writing config and reviewing generated plans

### Plan

* Once the feedback loop yields a changeset that makes sense, you commit your config and review a final plan
* `terraform apply` will display a plan for confirmation before making real changes, so you can use it for final review

### Apply

* You can continue through `terraform apply` to provision actual infrastructure
* You'll want to make sure you push your config changes to the remote repo

## Working as a Team

### Write

* Save changes to VCS branches to avoid collisions
* Resolve infra conflicts via the normal merge workflow
* The more your infra grows, the more sensitive data points are required to run a plan, in teh way of certs, creds, etc.
* Avoiding the security risk of all team members having all sensitive data, you may want to migrate to a model where Terraform ops are executed in a CI environment
* It creates a longer iteration cycle to do it that way, so you tend to use speculative plans as less of a feedback loop when you work under this model.

### Plan

* The plan output lets team members review each other's work
* Natural place to do that is alongside pull requests in version control
* You need a way to produce the speculative output plan for review, alongside the PR
* You can have the CI system to post speculative plan output to pull requests

### Apply

* Once a PR is approved and merged, the team has to review the final, concrete plan that will be run against the shared team branch and the lastest version of the state file.
* The plan may be different at that point, if the infra state has changed between merge and application

## Core Workflow Enhanced by Terraform Enterprise

* Enterprise tries to streamline some of the collaboration points

### Write

* Enterprise gives you a centralized and secure location for storing input variables and state
* Config interacts with Enterprise through the "remote" backend
* Once you're wired up, all you need is an API key for Enterprise to edit config and run speculative plans against the latest state file

### Plan

* Once a PR is ready, Enterprise can integrate with Github to put the plan alongside the PR

# Terraform Recommended Practices

From [https://www.terraform.io/docs/enterprise/guides/recommended-practices/index.html](https://www.terraform.io/docs/enterprise/guides/recommended-practices/index.html)

## Introduction

* "We believe the best approach to provisioning is collaborative infrastructure as code, using Terraform as the core workflow"
* There are other, foundational pieces you have to adopt to make this work, like version control, preventing manual changes, etc.
* Parts of this guide:
    1. Overview of recommended workflow
    1. Evaluating current provisioning practices
    1. Evolving provisioning practices
        1. Move from manual changes to semi-automation
        1. Move from semi-automation to infrastructure as code
        1. Move from infrastructure as code to collaborative infrastructure as code
        1. Advanced improvements to collaborative infrastructure as code

## Part 1: Overview of Recommended Workflow

* "Terraform's purpose is to provide one workflow to provision any infrastructure."
* The practices here are what they call "collaborative infrastructure as code"

### Fundamental Challenges in Provisioning

* Two major challenges in improving provisioning practices
    * technical complexity
    * organizational complexity
* **Technical Complexity**
    * The specifics of each infra provider's set of interfaces impose costs on operations
    * The more infra providers you add, the bigger the costs
    * Terraform deals with the complexity by separating the provisioning workload
    * Uses a single core engine to read infra-as-code config and determine resource relationships, then uses many provider plugins to manage resources on different stacks
    * The abstraction is at the workflow level, not the resource level
* **Organizational Complexity**
    * The more infrastructure, the more you need people to maintain it
    * To effectively collaborate, you need to delegate ownership of infrastructure across teams, and empower people to work in parallel without conflict
    * Delegating a large app typically involves splitting out microservices, each with an API
    * If the APIs don't change, work can be done in parallel
    * Infra code can be split into smaller Terraform configurations, with limited scope
    * The independent configs use output variables to publish info, and remote state resources to access output data from other workspaces
    * Terraform workspaces connect via remote state
    * With loosely coupled Terraform configurations, you can delegate development and maintenance to different teams. To do that, you need to control access to that code, and who can run it against real environments.
    * Enterprise solves the organizational complexity by giving you a centralized run environment for Terraform, that supports / enforces access control across workspaces.

### Personas, Responsibilities, and Desired User Experiences

* Four main personas for managing infra at scale
* **Central IT** - team that defines infra practices, enforces policies across teams, maintains shared services.
* **Organization Architect** - defines how global infra is divided and delegated, enables connectivity between workspaces by defining the APIs, sets org-wide policy and variables
* **Workspace Owner** - somebody who owns a set of workspaces that build a given Terraform config across environments.
* **Workspace Contributor** - people who submit changes to workspaces

### The Recommended Terraform Workspace Structure

* Enterprise's main unit of organization is a workspace
* Workspace = collection of everything Terraform needs to run:
    * a Terraform config
    * values for that config's variables
    * state data to keep track of operations between runs
* In open source Terraform, a workspace is just an independent state file on the local disk.
* You want 1 workspace per environment per terraform configuration
* Structure of your workspaces should match the org's permissions structure
* Best approach is to use one workspace for each environment of a given infra component
* Configurations times environments equals workspaces
* You don't use a single workspace to manage an entire environment, you make smaller workspaces that are easier to delegate.
* Name workspaces with component and environment
* Example of an internal billing app and a networking infra:
    * `billing-app-dev`
    * `billing-app-stage`
    * `billing-app-prod`
    * `networking-dev`
    * `networking-stage`
    * `networking-prod`
* To delegate workspaces, use per-workspace access controls
* For example:
    * teams that help manage a component can start terraform runs and edit vars in dev/staging
    * owners / senior contributors to a component can start prod runs, after reviewing other contributors' work
    * Central IT / architects can admin permissions on all workspaces
    * Teams with no role managing a component don't have access to its workspaces
* Future versions will allow you to create automatic promotion pipelines across workspaces
* Currently, to manually promote configurations from one workspace to another, either:
    * Use the VCS to move code between branches or repos, OR
    * Use the runs API to do promotion (advanced method)

## Part 2: Evaluating Your Current Provisioning Practices

### Four levels of operational maturity

1. Manual
    * Infra provisioned through UI or CLI
    * Config changes don't leave a traceable history, aren't always visible
    * Limited or no naming standards
1. Semi-automated
    * Infra provisioned through combination of UI/CLI, infra-as-code, and scripts or config management
    * Traceability limited, since different record-keeping methods are used across the org
    * Rollbacks are hard to achieve due to differing record-keeping methods
1. Infra as code
    * Infra provisioned using terraform OSS
    * Provisioning and deployment methods are automated
    * Infra config is consistent, with all necessary details fully documented
    * Source files are stored in VCS to record history, enable rollbacks
    * Some terraform code split into modules, to promote consistent reuse
1. Collaborative infra-as-code
    * Users across the org can safely provision infra with terraform, without conflicts and with clear understanding of access permissions
    * Expert users can produce standardized infra templates, beginner users can consume those to follow infra best practices
    * Per-workspace access control helps committers and approvers on workspaces protect prod
    * Functional groups that don't write terraform code have visibility into infra status and changes (if you use Terraform Enterprise)

### Your Current Config and Provisioning Practices

## Part 3: Evolving Your Provisioning Practices

# Running Terraform in Automation

From [https://learn.hashicorp.com/terraform/development/running-terraform-in-automation](https://learn.hashicorp.com/terraform/development/running-terraform-in-automation)
