# Notes on AWS ECS Documentation

From https://docs.aws.amazon.com/ecs/index.html

# What is Amazon Elastic Container Service?

From https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html

* Containers defined in a task definition
* Task definition used to run individual tasks or tasks in a service
* A service is a configuration that lets you run and maintain a number of tasks in a cluster
* You can run on serverless infra manage by Fargate, or on EC2 instances you manage

## Features of Amazon ECS

* Regional service that simplifies running containers across multiple AZs in a Region
* Can create clusters in new or existing VPC
* After a cluster is up, you can create task defs to run tasks/create services
* Container images stores in ECR or other repository host
* Images typically built from a Dockerfile, stored in a registry
* Apps have to have a task definition to run (JSON file)
* Task defs describe between 1 and 10 containers that form an application
* A 'task' is the instantiation of a task def in a cluster
* ECS task scheduler is responsible for placing tasks in a cluster
* A cluster is a logical grouping of tasks or services
* You can register 1+ EC2 instances ('container instances') in your cluster to run tasks on them, or use Fargate
* When you set up ECS, you get a default cluster, and you create separate ones to keep your resources separate
* Every instance has to run the container agent, which communicates with ECS and allows management
* Pricing based on Fargate vs EC2

# Setting Up

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/get-set-up-for-amazon-ecs.html

* Create an IAM user named `Administrator`
* Create a group `Administrators`
* Grant the group the `AdministratorAccess` policy
* Add the user to the group
* Sign in as the new user to verify
* A key pair is required to launch EC2 instances, so create that if you use EC2
* Create a VPC to put container instances in
* ECS console creates a VPC on first run
* You need to create a security group with inbound/outbound policies
* Create a least-privileges security group linked to the VPC
* Probably want to add SSH, HTTP, HTTPS, restrict SSH to your IP or your range
* Install the AWS CLI
* Configure it and whatnot

# Getting Started

# Docker basics for Amazon ECS

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html



