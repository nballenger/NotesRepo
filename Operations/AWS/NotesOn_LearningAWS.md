# Notes on Learning AWS 

By Aurobindo Sarkar and Amit Shah, Packt Publishing 2015, ISBN 978-1-78439-647-3

## Chapter 1: Cloud 101 - Understanding the Basics

Terms:

* Infrastructure as a Service (IaaS)
* Platform as a Service (PaaS)
* Software as a Service (SaaS)

### What is cloud computing?

* NIST Def: "Cloud computing is a model for enabling convenient, on-demand network access to a shared pool of configurable computing resources (eg, networks, servers, storage, applications, and services) that can be rapidly provisioned and released with minimal management effort or service provider interaction."
* Book def:
    * Users should be able to provision and release resources on-demand
    * The resources can be scaled up or down automatically based on load
    * The provisioned resources should be accessible over a network
    * Cloud providers should enable a pay-as-you-go model, where customers are charged based on resource consumption
* Implications of using cloud resources:
    * Scalable resources reduces need for some advance planning
    * Model promotes resource use scaled by customer need
    * Dev and test environments can be provisioned smaller than prod
    * Staging can be provisioned as true replica of prod
    * Scaling vertically and horizontally is easier
    * All the flexibility encourages experimentation
    
### Public, private, and hybrid clouds

* Public cloud: third party provider controls physical resources
* Private cloud: physical resources managed by the organization or a third party only for the organization
* Hybrid cloud: combination of public/private resources

### Cloud service models - IaaS, PaaS, SaaS

* IaaS:
    * users provision processing, storage, network resources on demand
    * Customers deploy and run their own applications
    * Closest to traditional in-premise model
* PaaS:
    * Provider makes core components like db, queues, etc available as services
    * Customer leverages the components to build their own applications
    * Creates app level dependencies on the service provider
* SaaS:
    * Third party providers provide end user apps to their customers
    * Customer has limited administrative capabilities

### Setting up your AWS account

* Go create an account.

### The AWS management console

* Gives access to the various services.

## Chapter 2: Designing Cloud Applications - An Architect's Perspective

### Multi-tier architecture
