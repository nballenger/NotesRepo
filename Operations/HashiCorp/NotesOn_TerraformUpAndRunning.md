# Notes on Terraform: Up and Running

By Yevgeniy Brikman; O'Reilly Media, March 2017; ISBN 9781491977088

# Chapter 1: Why Terraform

* 'Software Delivery' - all work necessary to make code available to a customer

## The Rise of DevOps

* Move to cloud infra means that both ops and dev teams spend most of their time on code
* 'DevOps' as the author defines it: 'The goal of DevOps is to make software delivery vastly more efficient.'
* It's fundamentally a set of processes, ideas, and techniques.
* Aim is to create resilient, self-healing systems, and use monitoring and alerting to catch those problems that can't be resolved automatically.
* Core values of DevOps:
    * Culture
    * Automation
    * Measurement
    * Sharing
* Book focuses solely on Automation
* Goal is to automate as much of the software delivery process as possible.

## What is Infrastructure as Code?

* Idea of IAC is that you write and execute code to define, deploy, and update infrastructure.
* Four broad categories of IAC tools:
    * Ad hoc scripts
    * Configuration management tools
    * Server templating tools
    * Server provisioning tools

### Ad Hoc Scripts

* It's a one-off script in some language that defines a set of steps in code that you can execute on a target machine.
* You install dependencies, pull from repos, run setup scripts, and start one or more processes
* The downside of ad hoc scripts is how messy and general purpose they tend to be.
* Tools purpose built for IAC give you APIs for complex, domain-specific tasks

### Configuration Management Tools

* This is Chef, Puppet, Ansible, SaltStack, etc.
* Designed to install and manage software on existing servers.
* Advantages of a tool like Ansible:
    * Enforced coding conventions and structure
    * Idempotent runs (not guaranteed with scripts)
    * Distributed runs are part of the tool, so multi-host is easier

### Server Templating Tools

* This is Docker, Packer, Vagrant, etc.
* They create a server image that has a snapshot of the target system
* Then you can use an IAC tool to distribute and run that image
* Broad categories of tools for working with images:
    * Virtual Machines - emulates the entire OS via a hypervisor. Isolates from the host, but has a lot of overhead cost for CPU, memory, startup time, etc.
    * Containers - Emulates the user space of an operating system on top of a container engine. Images are portable to any system capable of running the container engine. Isolation is less secure than with VMs, and if you run multiple containers on a host you need to be careful about shared resource usage. It's very fast though.
* Different server templating tools have different purposes:
    * Packer - used to create images you run directly on top of prod servers, like an AMI that you run in AWS EC2.
    * Vagrant - creates images that run under something like VirtualBox on local machines
    * Docker usually builds images of individual applications
* Server templating is key to immutable infrastructure. The idea there is that once you deploy a server, you never make changes to it. If you need to update something, you create a new image from your server template and deploy it.

### Server Provisioning Tools

* This is Terraform, CloudFormation, OpenStack Heat, etc.
* Responsible for creating the servers themselves, along with pretty much any other infrastructure component

## Benefits of Infrastructure as Code

* You can adopt some really useful software practices:
    * Self-service - teams that own a service or application can manage their own deployments
    * Speed and safety - Automated deployments are very fast, and safer than any manual process will tend to be.
    * Documentation - the state of infrastructure is represented in versioned files
    * Version control - since you can store IAC files in version control, your infrastructure history is in the commit log. You can do rollbacks and debug issues much, much more easily.
    * Validation - for all changes you can do a code review, run automated tests, and use static analyzers, all of which reduce the chance of defects
    * Reuse - if you can package your infra as reusable modules, you can start new projects much more easily, and with more confidence.
    * Happiness - manual deployment and infrastructure management is tedious and repetitive, and you only get feedback on it when there's a problem. Automation makes things a lot better.

## How Terraform Works

* High level, somewhat simplified view
* It's an open source tool from HashiCorp, written in Go
* The Go compiles to a single binary, `terraform`
* You can use that binary to deploy infrastructure from a laptop or a build server
* The binary makes calls on your behalf to one or more providers, like AWS, Google Cloud, etc.
* You create Terraform configurations, which are text files stating what infrastructure you want to create. 
* Sample config:

    ```
    resource "aws_instance" "example" {
        ami           = "ami-40d28157"
        instance_type = "t2.micro"
    }

    resource "dnsimple_record" "example" {
        domain = "example.com"
        name   = "test"
        value  = "${aws_instance.example.public_ip}"
        type   = "A"
    }
    ```

* The entire infrastructure can be defined in Terraform configuration files
* Then you run commands like `terraform apply` to deploy the infrastructure
* Terraform parses your code, translates it to provider specific instructions, runs it
* Process for changes:
    * Make changes to the Terraform config files
    * Validate the changes via automated tests and code reviews
    * Commit updated code to version control
    * Run `terraform apply` to deploy the changes

## How Terraform Compares to Other Infrastructure as Code Tools

* Tradeoffs to consider when choosing an IAC tool:
    * Configuration management versus provisioning
        * Chef, Puppet, Ansible are config management tools, CloudFormation, Terraform, OpenStack Heat are provisioning tools.
        * If you use server templating tools like Docker or Packer, the vast majority of your configuration management is probably taken care of, so a server provisioning tool is a good choice.
    * Mutable infrastructure versus immutable infrastructure
        * Chef, Puppet, Ansible, SaltStack typically default to mutable model
        * If you use Terraform to deploy machine images / containers, most changes are actually new deployments.
        * You can do immutable deploy with the above tools, but it's not their primary paradigm
    * Procedural language versus declarative language
        * Chef and Ansible encourage procedural code, where you achieve a desired state by taking multiple steps in sequence.
        * Terraform, CloudFormation, SaltStack, Puppet, OpenStack Heat use a declarative style, where you define your desired end state and the tool is responsible for getting there.
        * Two major problems with procedural IAC tools:
            1. Procedural code does NOT fully capture the state of the infrastructure. The order of templates can change, which means the overall operation isn't actually idempotent.
            1. Procedural code limits reusability. For procedural code to work, you must always be aware of the current state of the infrastructure. If that state changes, your infrastructure code may become outdated. In general this means procedural IAC codebases tend to become large and complex over time.
        * Using a declarative approach means the code always represents the latest state of your infrastructure.
        * The downside of a declaritive, domain-specific language is that your ability to express yourself may be limited, since you don't have access to a full programming language. Since you can't do very much 'logic', it can be harder to create reusable and/or generic code.
        * Terraform does give you some powerful primitives, like input variables, output variables, modules, etc. Those make it possible to create configurable, modular code even in a declarative language.
    * Master versus masterless
        * Chef, Puppet, and SaltStack all require running a master server to record your infrastructure state.
        * When you want to change something, you use a client program to issue commands to the master server, and the master pushes or makes available for pull the changes you want.
        * Advantages of a master server:
            * Single, central place to see and manage the state of your infrastructure
            * Some master servers can run continuously in the background, enforcing config to prevent configuration drift via manual change.
        * Drawbacks of a master server:
            * Extra infrastructure
            * Maintenance of the master server
            * Security of a host that has access to all other hosts
        * Chef, Puppet, and SaltStack have some support for masterless modes, but don't address provisioning servers and installing agent software on them in the first place.
        * Ansible, CloudFormation, Heat, and Terraform are all masterless by default.
    * Agent versus agentless
        * Chef, Puppet, and SaltStack all require that you run agent software on all hosts
        * Drawbacks of a background agent:
            * Bootstrapping--how do you provision servers and get the agent there to start?
            * Maintenance - you have to update the agent periodically, and keep it in sync with the master server if there is one.
            * Security - you have to open outbound ports on every server if the agent gets changes by pull, and open inbound if they get pushed to from a master. Either way, you have to handle agent authentication, and increase your attack surface area.
            * The extra moving parts of using an agent introduces a bunch of new failure modes in your infrastructure.
        * Ansible, CloudFormation, Heat, and Terraform don't require any agents beyond what your cloud provider already uses (API servers for accessing AWS, eg.)
        * For Ansible, the servers must be running SSH, which Terraform doesn't require
    * Large community versus small community
        * Hard to do apples to apples comparison across communities
        * Terraform has a decent enough community.
    * Mature versus cutting-edge (versions are from book publication time)
        * Puppet 4.8.1, started in 2005
        * Chef 12.17.44, started in 2009
        * CloudFormation, started in 2011
        * SaltStack 2016.11.1, started in 2011
        * Ansible 2.1.3.0-1, started in 2012
        * Heat 7.0.1, started in 2012
        * Terraform 0.8.2 (now at 0.11, I think), started in 2014

# Chapter 2: Getting Started with Terraform

* To do the examples here, you need an AWS account with an IAM user that has:
    * `AmazonEC2FullAccess`
    * `AmazonS3FullAccess`
    * `AmazonDynamoDBFullAccess`
    * `AmazonRDSFullAccess`
    * `CloudWatchFullAccess`
    * `IAMFullAccess`
* All the book examples use the default VPC, so you have to have one, or you have to include a `vpc_id` explicitly in all example code.
* Install terraform and make sure it runs

## Deploy a Single Server

* Terraform code is in HashiCorp Configuration Language (HCL)
* Those files have the `.tf` extension
* First step is typically to configure the provider(s) you want to use, in `main.tf`:

    ```
    provider "aws" {
        region = "us-east-1"
    }
    ```

* For each provider type there are a bunch of resources you can create.
* To create a single server:

    ```
    resource "aws_instance" "example" {
        ami           = "ami-40d28157"
        instance_type = "t2.micro"
    }
    ```

* General resource syntax:

    ```
    resource "PROVIDER_TYPE" "NAME" {
        [CONFIG ... ]
    }
    ```

* `PROVIDER` is the provider name
* `TYPE` is the resource type for that provider
* `NAME` is an identifier to use in the terraform code
* `CONFIG` is one or more conf parameters specific to that resource
* `terraform plan` will show you what will happen based on the .tf file, `terraform apply` runs it

## Deploy a Single Web Server

* Want to run a web server on the instance
* Simplest server that'll respond:

    ```
    #!/bin/bash
    echo "Hello!" > index.html
    nohup busybox httpd -f -p 8080 &
    ```

* Normally you'd create an AMI with packer or a container with docker to run this
* However, you can use a terraform heredoc to do it inline:

    ```
    resource "aws_instance" "example" {
        ami           = "ami-40d28157"
        instance_type = "t2.micro"

        user_data = <<-EOF
                    #!/bin/bash
                    echo "Hello!" > index.html
                    nohup busybox httpd -f -p 8080 &
                    EOF

        tags {
            Name = "terraform-example"
        }
    }
    ```

* AWS doesn't allow instance traffic without a security group, so you have to do:

    ```
    resource "aws_security_group" "instance" {
        name = "terraform-example-instance"

        ingress {
            from_port = 8080
            to_port = 8080
            protocol = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }
    }
    ```

* Then you have to tell the EC2 instance to use that security group, by passing the ID of the security group into the `vpc_security_group_ids` parameter of the `aws_instance` resource.
* That uses interpolation syntax, which is `"${thing_to_interpolate}"`
* Every resource in terraform exposes attributes you can reference in interpolated text
* Generalized syntax is `"${TYPE.NAME.ATTRIBUTE}"`
* So the id of the security group is: `"${aws_security_group.instance.id}"`
* And you use it like so:

    ```
    resource "aws_instance" "example" {
        ami           = "ami-40d28157"
        instance_type = "t2.micro"
        vpc_security_group_ids = ["${aws_security_group.instance.id}"]

        user_data = <<-EOF
                    #!/bin/bash
                    echo "Hello!" > index.html
                    nohup busybox httpd -f -p 8080 &
                    EOF

        tags {
            Name = "terraform-example"
        }
    }
    ```

* Once you use interpolation like that, you create an implicit dependency
* Terraform parses your dependencies and creates the dependency graph
* `terraform graph` will show you the dependency graph in DOT, which is a graph visualization language
* While walking the dependency tree, terraform creates as many resources in parallel as possible
* Most changes to an EC2 instance in Terraform actually create a new instance, which can create downtime. You should be careful about doing zero downtime replacements.

## Deploy a Configurable Web Server

* 8080 is repeated in both the server config and the security group, which can create errors
* You can instead define an input variable in terraform, which has this syntax:

    ```
    variable "NAME" {
        [CONFIG ...]
    }
    ```

* The body of the variable declaration can have three parameters, all optional:
    * `description` - documents how the param is used
    * `default` - you can supply values for input variables in a couple of ways:
        * `-var` on the command line
        * in a file, via `-var-file`
        * in an env var with `TF_VAR_<some_name>` as the name
    * `type` - must be `string`, `list`, or `map`. If not specified, tries to guess from the default value given. If no default, assumes a string.
* Example variables:

    ```
    variable "list_example" {
        description = "An example list."
        type        = "list"
        default     = [1, 2, 3]
    }

    variable "map_example" {
        description = "An example map."
        type        = "map"
        default     = {
            key1 = "value1"
            key2 = "value2"
            key3 = "value3"
        }
    }
    ```

* Numbers are automatically coerced to strings, so you can omit type for the port:

    ```
    variable "server_port" {
        description = "The port the server uses for HTTP requests."
        default = 8080
    }
    ```

* Going back to the security group and instance declarations:

    ```
    resource "aws_security_group" "instance" {
        name = "terraform-example-instance"

        ingress = {
            from_port = "${var.server_port}"
            to_port   = "${var.server_port}"
            protocol  = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }
    }


    resource "aws_instance" "example" {
        ami           = "ami-40d28157"
        instance_type = "t2.micro"
        vpc_security_group_ids = ["${aws_security_group.instance.id}"]

        user_data = <<-EOF
                    #!/bin/bash
                    echo "Hello!" > index.html
                    nohup busybox httpd -f -p "${var.server_port}" &
                    EOF

        tags {
            Name = "terraform-example"
        }
    }
    ```

* You can create output variables with a similar syntax:

    ```
    output "NAME" {
        value = VALUE
    }
    ```

* For instance, to get the public IP of your server:

    ```
    output "public_ip" {
        value = "${aws_instance.example.public_ip}"
    }
    ```

* The output is shown at the end of your `terraform apply` output

## Deploy a Cluster of Web Servers

* In AWS, you can create an auto scaling group, which requires creating a 'launch configuration' that specifies how to configure each instance in the ASG:

    ```
    resource "aws_launch_configuration" "example" {
        image_id = "ami-40d28157"
        instance_type = "t2.micro"
        security_groups = ["${aws_security_group.instance.id}"]

        user_data = <<-EOF
                    #!/bin/bash
                    nohup busybox httpd -f -p "${var.server_port}" &
                    EOF

        lifecycle {
            create_before_destroy = true
        }
    }
    ```

* `lifecycle` is a metaparameter, which exists on almost every kind of terraform resource
* If `create_before_destroy` is true, terraform always makes a replacement before destroying the original
