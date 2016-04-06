# Notes on AWS Administration - The Definitive Guide

By Yohan Wadia, Packt Publishing 2016, ISBN 978-1-78217-375-5

## Chapter 1: Introducing Amazon Web Services

### AWS architecture and components

#### Regions and Availability Zones

* AWS has about 10 regions globally
* Each region has multiple data centers
* No replication across regions automatically
* Each region is split into availability zones, or AZs
* AZs are connected via low-latency links
* Naming is something like `us-east-1b`, where `us-east-1` is the region and `b` is the AZ

#### AWS Platform Overview

* Three major classes of service:
    * Foundation - compute, storage, network, databases
    * Application - distributed computing, messaging, media transcoding, etc.
    * Administration - IAM, monitoring, deployments, automation
* Compute: EC2, EC2 container service, VPC
* Storage: S3, Elastic Block Storage (EBS), Glacier, Elastic File System
* Databases: RDS, Dynamo, Redshift
* Networking: ELB, Route53
* Distributed Computing: EMR, Redshift
* Content delivery: CloudFront
* Workflow/messaging: SNS, SES
* Monitoring: CloudWatch

## Chapter 2: Security and Access Management

### Identity and Access Management

* IAM features:
    * Shared access to a single account
    * Multi-factor auth
    * Integration across most of AWS
    * Identity federation
    * Global reach
    * Access mechansims include CLI tools, various SDK, https api
* Business use case scenario:
    * Org admin is Jason, dev is Dave, testing is Chen
* Getting started with the IAM console
    * Has you create users and groups to represent those

#### Understanding Permissions and Policies

* Two main classes of permissions:
    * User-based - attached to users or groups allowing them to perform actions.
        * Inline policies: created and managed by me
        * Managed policies: created/managed by AWS
    * Resource-based - attaches to a resource, ONLY inline based
* Example of a policy:

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeImages"
            ],
            "Resource": "arn:aws:iam::012345678910:user/Chen"
        }
    ]
}
```

* Policy elements:
    * `Version` - policy language version
    * `Statement` - required, a list of individual statement objects:
        * `Effect` - required, can be `Allow` or `Deny`, default `Deny`
        * `Action` - what actions are allowed/denied, service specific
        * `Resource` - required, specify the object or service covered by ARN
* There are numerous other policy elements possible.

### Managing access and security using the AWS CLI

* Use `aws configure` to write config files
* Use `aws configure --profile abcd` to set up a profile
* Use `aws iam list-users --profile abcd` to use that profile to list users
* Multiple other commands.

### Recommendations and Best Practices

* Get rid of the Root accout and use IAM
* Create a separate IAM user for every person, never share keys
* Create separate administrators for every AWS service you use
* Use roles and groups to assign users permissions
* Use MFA
* Rotate passwords and keys
* Maintain logs and history of account and services, with CloudTrail
* Use temporary credentials (IAM roles) rather than sharing account details
* Use the AWS key management service to encrypt data and keys

## Chapter 3: Images and Instances

* Images are the base machine setups that instances are based on
* Images are AMIs (Amazon Machine Images)
* AMIs are static
* Two main AMI categories based on storage:
    * EBS-backed - root device is on an Elastic Block Store volume; has snapshots, data persistence, portability
    * Instance-store backed - images are stored in S3; not portable, no data persistence, deployment is slower
* There are five families of instance:
    * General purpose - t2, m3, m4
    * Compute optimized - c3, c4
    * Memory optimized - r3
    * Storage optimized - i2, d2
    * GPU instances - g2
* Instance pricing options
    * On-demand - created when required, you pay by the hour
    * Reserved - guarantees instances with resource capacity reservations, some upfront cost
    * Spot instances - you bid for compute capacity

### Launching instances with the CLI

1. Create a key pair
    * You can use existing key pairs if you want
    * To create one, use `aws ec2 create-key-pair --key-name SomeKey --output text > SomeKey.pem`
1. Create a security group
    * `aws ec2 create-security-group --group-name SomeGroup --description "foo"`
1. Add rules to the security group
    * `aws ec2 authorize-security-group-ingress --group-name SomeGroup --protocol tcp --port 22 --cidr 0.0.0.0/0`
1. Launch the instance
    * `aws ec2 run-instances --image-id ami-abc12345 --count 1 --instance-type t2.micro --security-groups SomeGroup --key-name SomeKey`
    * `aws ec2 describe-instances --instance-ids <Instance_id>`

### Recommendations and best practices

* Create and use separate IAM users for working with EC2
* Use IAM roles to delegate access to EC2 temporarily
* Use a standard and frequently deployed set of AMIs
* Make sure you understand the difference between ebs- and store-backed
* Don't create too many firewall rules on a single security group
* Stop instances when not in use
* Use tags to identify instances
* Save key pairs in safe locations
* Monitor instances at all times

## Chapter 4: Security, Storage, Networking, and Lots More

### An overview of security groups

* Can be used to filter ingress and egress traffic on an instance
* Default SG allows egress on all port/protocol combinations, no ingress
* You can create up to 100 SGs in a VPC
* Each SG can have up to 50 firewall rules

### Understanding EC2 networking
