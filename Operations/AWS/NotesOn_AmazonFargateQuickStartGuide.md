# Notes on Amazon Fargate Quick Start Guide

By Deepak Vohra; Packt Publishing, July 2018

ISBN 9781789345018

# Getting Started with Amazon ECS and Amazon Fargate

* ECS is a managed service for docker containers
* Built in support for scaling, load balancing, networking, storage, logging, etc.
* Two launch types: EC2 and Fargate
* Under EC2 type, EC2 instances are started to run docker containers
* Fargate (launched Nov 2017) hosts tasks that encapsulate Docker containers
* Tasks are accessible to the user via an Elastic Network Interface
* The EC2 instances underlying fargate are not exposed to the user

## What Amazon Fargate Is

* New launch type for ECS and EKS (elastic kubernetes service)
* For managed orchestration services for Docker containers
* Infrastructure fully provisioned by Fargate
* Serverless in that no EC2 instances are exposed to the user
* Docker containers are container defs within a task definition
* A service implements the task def to run 1+ tasks
* Each task is associated with an ENI
* Tasks MAY have a public IP, but talk to each other on private IPs

## Benefits of Fargate

* Blah blah, abstracts away infrastructure management of EC2 instances
* CodePipeline supports Fargate as a deployment platform
* Microservices based on container defs in task defs are explicitly linked
* Some autoconfig of cloudwatch logs

## Amazon ECS objects

* ECS objects under Fargate are the same as for the EC2 launch type
* Encapsulation, from outer to inner:
    * Multi-AZ ECS cluster consists of one or more services
    * Services are implementations of task definitions, and run one or more tasks.
    * A task def may have one or more task revisions
    * Task revisions are distinct task defs with a set of tasks and a service associated
    * One Fargate instance is associated with a set of tasks in a service.
    * A task def is zero or more container defs. (Typically 1+)
* A task def is an application template describing 1+ containers
* Most settings / attributes are at container level, some at task level
* A service implements a task def, defines a desired count for tasks to run for a task def
* scaling and load balancing are configured at the service level
* A cluster is a grouping of 1+ container services, cluster names must be unique within an account

## Compute resources in Fargate

* Task size is task memory in GB and task cpu
* Task size is required for fargate launch type
* Docker memory / cpu settings are optional, overruled by task settings
* Only specific combinations of memory and cpu are supported
* You can define a soft limit and a hard limit for memory

## What is new in the fargate launch type

* Networking mode `awsvpc` is the only supported mode
* Host port mappings are not valid under `awsvpc`; host ports on which an app is exposed are the same as the container ports
* `ecsTaskExecutionRole` was added to allow for pulling docker images and sending logs to cloudwatch
* Only the `awslogs` and the `awslogs` log driver are supported for cloudwatch
* Task placement is not supported, because the instances are abstracted
* Only docker images on docker hub and ECR are supported
* Host devices cannot be exposed to the container
* `host` and `sourcePath` params for volumes are not supported

# Networking

* In ECS:
    * A task def defines a group of containers (container defs)
    * A container def defines:
        * a name
        * a docker image
        * port mappings
        * an entry point
        * command (?)
    * Resources are defined at the task and container level
    * A service def consists of:
        * task def
        * launch type
        * load balancers
        * network config
        * deployment config
        * deployments
* Fargate is Infrastructure as a Service
* An ECS cluster can consist of fargate managed tasks in multiple AZs for HA

## Creating an ECS cluster and service

### Configuring a container def

### Configuring a task def

### Configuring a service

### Configuring and creating a cluster

## Running Additional Tasks

## Accessing the Service

## Deleting a cluster

# Using Cloudwatch Logs
