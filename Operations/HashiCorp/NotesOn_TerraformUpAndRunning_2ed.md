# Notes on Terraform: Up & Running, 2nd Edition

By Yevgeniy Brikman; O'Reilly Media, August 2019; ISBN 9781492046905

# Introduction

## How Terraform Works

* Written in Go, compiled down to a single binary, `terraform`
* Makes API calls on your behalf to one or more 'providers'
* You create terraform configurations, which are text files written in HCL
* The terraform binary parses the configs, and applies state to the providers

# Chapter 2: Getting Started with Terraform

* Set up an AWS account, get your user, get your creds, etc.
* To run the examples, your user account needs these policies:
    * `AmazonEC2FullAccess`
    * `AmazonS3FullAccess`
    * `AmazonDynamoDBFullAccess`
    * `AmazonRDSFullAccess`
    * `CloudWatchFullAccess`
    * `IAMFullAccess`
* Install terraform
* Configure the `aws` provider in a main.tf
* Add a t2.micro `aws_instance` based on `ami-0c55b159cbfafe1f0`
* General syntax for a TF resource:

    ```
    resource "<PROVIDER>_<TYPE>" "<NAME>" {
        [CONFIG...]
    }
    ```

* Run `terraform init`
* Run `terraform plan`
* Run `terraform apply`
* Add tags to the instance resource, rerun `apply`
* Version control your stuff
* gitignore:
    * `.terraform`
    * `*.tfstate`
    * `*.tfstate.backup`
* Push to origin

## Deploy a single web server on the instance

* Use a hello world script like

    ```bash
    #!/bin/bash
    echo "Hello, World" > index.html
    nohup busybox httpd -f -p 8080 &
    ```

* By explicitly adding it to the instance:

    ```
    resource "aws_instance" "example" {
        ami = "ami-0c55b159cbfafe1f0"
        instance_type = "t2.micro"

        user_data = <<-EOF
                    #!/bin/bash
                    echo "Hello, World" > index.html
                    nohup busybox httpd -f -p 8080 &
                    EOF

        tags = { Name = "terraform-example" }
    }
    ```

* The `<<-EOF` syntax is a terraform heredoc
* Since you normally get no ingress/egress from a blank ec2 instance, you have to let it receive traffic with a security group:

    ```
    resource "aws_security_group" "instance" {
        name = "terraform-example-instance"

        ingress {
            from_port   = 8080
            to_port     = 8080
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }
    }
    ```

* Add this to the instance resource: 

    ```
    vpc_security_group_ids = [aws_security_group.instance.id]
    ```

* Now if you run `terraform graph` you'll get the dependency graph DOT
* All the book examples use the default VPC and default subnets

## Deploy a configurable web server

* You can use terraform input variables
* Syntax:

    ```
    variable "NAME" {
        [CONFIG ...]
    }
    ```

* Can have `description`, `default`, and `type`
* Type is a constraint on passed in values
* You can combine constraints, like `list(number)` or `map(string)`
* You can create composite structural types, using `object` and `tuple` types:

    ```
    variable "object_example" {
        description = "Example of a structural type"
        type        = object({
            name   = string
            age    = number
            tags   = list(string)
            enabled = bool
        })

        default = {
            name  = "bob"
            age   = 42
            tags  = ["a","b","c"]
            enabled = true
        }
    }
    ```

* You can define output variables with this syntax:

    ```
    output "<NAME>" {
        value = <VALUE>
        [ CONFIG ... ]
    }
    ```

* Can also take `description` and `sensitive`
* If you set `sensitive = true`, the output is not logged as part of apply
* You get a list of non-sensitive outputs at the end of the apply
* You can use `terraform output` to list outputs without applying changes
* And `terraform output <NAME>` for a specific one
* Example usage would be a script that
    * runs `terraform apply` to deploy the web server
    * uses `terraform output public_ip` to get the IP
    * runs `curl` on the IP to smoke test the deployment

## Deploy a cluster of Web Servers

* Going to be multiple ec2 instances under an ASG
* You need a `aws_launch_configuration` resource to specify the config for each EC2 instance
* And an ASG via `aws_autoscaling_group`

    ```
    resource "aws_launch_configuration" "example" {
        image_id        = "ami-12345"
        instance_type   = "t2.micro"
        security_groups = [aws_security_group.instance.id]

        user_data = <<-EOF
                    #!/bin/bash
                    echo "Hello, World" > index.html
                    nohup busybox httpd -f -p ${var.server_port} &
                    EOF
    }

    resource "aws_autoscaling_group" "example" {
        launch_configuration = aws_launch_configuration.example.name

        min_size = 2
        max_size = 10
        tag {
            key                 = "Name"
            value               = "terraform-asg-example"
            propagate_at_launch = true
        }
    }
    ```

* You also need to specify `subnet_ids` in the ASG resource
* Can use a data source to get that as read-only info fetched from the provider
* Data sources don't create anything, they just are a way to query providers for data and make it available across the rest of the TF configs
* Syntax for a data source:

    ```
    data "<PROVIDER>_<TYPE>" "<NAME>" {
        [ CONFIG ... ]
    }
    ```

* With data sources, the arguments you pass are typically search filters that tell the data source what info you're looking for
* Access is via `data.<PROVIDER>_<TYPE>.<NAME>.<ATTRIBUTE>`
* So to get subnet ids for the default VPC:

    ```
    data "aws_vpc" "default" {
        default = true
    }

    data "aws_subnet_ids" "default" {
        vpc_id = data.aws_vpc.default.id
    }

    resource "aws_autoscaling_group" "example" {
        ...
        vpc_zone_identifier = data.aws_subnet_ids.default.ids
        ...
    }
    ```

## Deploy a load balancer

* Going to use an ALB
* Consists of several parts
    * listener, which binds to a specific port
    * listener rule, which takes requests and does path matching
    * target groups, each one or more servers that get requests from the LB and does health checks on the servers (so as to only send to healthy nodes)
* Create it all:

    ```
    resource "aws_security_group" "instance" {
        name = "terraform-example-instance"

        ingress {
            from_port   = 8080
            to_port     = 8080
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }
    }

    resource "aws_launch_configuration" "example" {
        image_id        = "ami-12345"
        instance_type   = "t2.micro"
        security_groups = [aws_security_group.instance.id]

        user_data = <<-EOF
                    #!/bin/bash
                    echo "Hello, World" > index.html
                    nohup busybox httpd -f -p ${var.server_port} &
                    EOF
    }

    data "aws_subnet_ids" "default" {
        vpc_id = data.aws_vpc.default.id
    }

    resource "aws_security_group" "alb" {
        name = "terraform-example-alb"

        ingress {
            from_port   = 80
            to_port     = 80
            protocol    = "tcp"
            cidr_blocks = [ "0.0.0.0/0" ]
        }

        egress {
            from_port   = 0
            to_port     = 0
            protocol    = "-1"
            cidr_blocks = [ "0.0.0.0/0" ]
        }
    }

    resource "aws_lb" "example" {
        name                = "terraform-asg-example"
        load_balancer_type  = "application"
        subnets             = data.aws_subnet_ids.default.ids
        security_groups     = [aws_security_group.alb.id]
    }

    resource "aws_lb_listener" "http" {
        load_balancer_arn   = aws_lb.example.arn
        port                = 80
        protocol            = "HTTP"

        default_action {
            type = "fixed-response"

            fixed_response {
                content_type = "text/plain"
                message_body = "404: page not found"
                status_code  = 404
            }
        }
    }

    resource "aws_autoscaling_group" "example" {
        launch_configuration = aws_launch_configuration.example.name
        vpc_zone_identifier  = data.aws_subnet_ids.default.ids

        target_group_arns = [ aws_lb_target_group.asg.arn ]
        health_check_type = "ELB"

        min_size = 2
        max_size = 10

        tag {
            key                 = "Name"
            value               = "terraform-asg-example"
            propagate_at_launch = true
        }
    }

    resource "aws_lb_listener_rule" "asg" {
        listener_arn    = aws_lb_listener.http.arn
        priority        = 100

        condition {
            field   = "path-pattern"
            values  = [ "*" ]
        }

        action  {
            type                = "forward"
            target_group_arn    = aws_lb_target_group.asg.arn
        }
    }

    output "alb_dns_name" {
        value       = aws_lb.example.dns_name
        description = "Domain name of the load balancer"
    }
    ```

# Chapter 3: How to manage Terraform State

* If it's not just you, you need a shared backend with mutex locking.
* You also need some secrets management.

## Isolating State Files

* Temptation early on is to store everything in a single .tf file, or set of files in one folder. Now you're in a place where a mistake in one tf file can break things across multiple deployments, or corrupt your state files.
* If you're managing all environments from a single set of .tf configurations, you're breaking environment isolation.
* You need to split by environment in one of two ways:
    * isolate via workspaces--useful for quick, isolated tests on the same config
    * isolate via file layout - for production use cases where you need strong separation by environment

### Isolation via workspaces

* Workspaces let you store your tf state in multiple, separate, named workspaces
* Starts with a single workspace named 'default'
* To work with them use the `terraform workspace` commands
* If you create an instance in the default space, then create a new workspace and run `terraform plan`, it's going to want to create a new instance because it doesn't know about the state from the other workspace.
* This is useful when you already have a TF module deployed, and you want to do some experiments with it but you don't want to chance affecting the state of deployed infrastructure.
* "Terraform workspaces allow you to run `terraform workspace new` and deploy a new copy of the exact same infrastructure, but storing the state in a separate file."
* You can change behavior based on the workspace you're in by reading the workspace name via `terraform.workspace`:

    ```
    resource "aws_instance" "example" {
        ami = "ami-12345"
        instance_type = terraform_workspace == "default" ? "t2.medium" : "t2.micro"
    }
    ```

* Benefits of workspaces:
    * fast spin up and teardown for experimental versions
* Drawbacks:
    * state files for all workspaces are stored in the same backend, so the same auth mechanism controls all workspaces (which means your prod is open to devs)
    * workspaces aren't visible in code or on the terminal unless you run `terraform workspace` commands. Makes maintenance harder, hard to have a good picture of the infra.
    * Those two together mean workspaces can be fairly error prone. Lack of visibility makes it easy to forget what workspace you're in and accidentally make changes in the wrong environment. Since you use teh same auth mechanism against all workspaces, you've got no defense from such errors.
* to get real isolation you want to use file layout.

### Isolation via file layout

* To get full isolation you need to:
    * Put the tf config files for each environment in a separate folder
    * configure a different backend for each environment, using different auth mechanisms and access controls for each--each env could be in a separate AWS account, with a separate S3 bucket backend
* You may want to isolate below the level of environment, down to components, which are coherent sets of resources you typically deploy together.
* File layout for the author's project:
    
    ```
    stage
        vpc
        services
            frontend-app
            backend-app
                var.tf
                outputs.tf
                main.tf
        data-storage
            mysql
            redis
    prod
        vpc
        services
            frontend-app
            backend-app
        data-storage
            mysql
            redis
    mgmt
        vpc
        services
            bastion-host
            jenkins
    global
        iam
        s3
    ```

* Typical environments
    * `stage` - nonprod workloads, like QA
    * `prod` - production
    * `mgmt` - env for devops tooling
    * `global` - resources used across all environments
* In each one there are per-component folders. Typical ones:
    * `vpc` - network topology for environment
    * `services` - apps or services to run in the env, may have their own folders
    * `data-storage` - data stores to run the env
* This file layout has a lot of duplication. Next chapter refactors for reuse.

## The terraform_remote_state data source

* Fetches the TF state file stored by another set of configs, read-only
* Example: web server cluster needs to talk to a mysql database. You want to put that into RDS. You may not want to define the db in the same set of configs as the web server cluster, since you'll be deploying updates to the web server cluster far more frequently and don't want to risk breaking the database.
* So you create a folder `stage/data-stores/mysql` and put `main.tf`, `variables.tf`, `outputs.tf` in it
* Then create the db resources in the main.tf there
* That's going to include passing a master password for the db in the block for an "aws_db_instance" resource, which you shouldn't do directly. 
* You can read secrets from a secret store, via something like `data "aws_secretsmanager_secret_version"`
* Some store/datasource combos to investigate:
    * AWS Secrets Manager + `aws_secretsmanager_secret_version` data source
    * AWS Systems Manager Parameter Store + `aws_ssm_parameter`
    * AWS KMS + `aws_kms_secrets`
    * Vault and the `vault_generic_secret` data source
* You can also do external secrets managers and use env vars to set values
* Note that secrets are always stored in TF state, so carefully control your state files

# Chapter 4: How to create reusable infrastructure with Terraform Modules

* You typically need multiple environments, but you want to avoid duplicating code between environments.
* TF modules are reusable by reference from other TF files
* Topics in this chapter:
    * Module basics
    * Module inputs
    * Module locals
    * Module outputs
    * Module gotchas
    * Module versioning

## Module Basics

* Any set of TF config files in a folder is a module.
* The power is in calling a module from another config file.
* Modules shouldn't have a `provider` block--that should be set by the user
* Syntax for using a module:

    ```
    module "<NAME>" {
        source = "<SOURCE>"

        [CONFIG ...]
    }
    ```

* For that:
    * `NAME` is an identifier for use throughout Terraform
    * `SOURCE` is the path where the module code can be found
    * `CONFIG` is one or more arguments specific to the module
* Example usage:

    ```
    provider "aws" {
        region = "us-east-1"
    }

    module "webserver_cluster" {
        source = "../../../modules/services/webserver-cluster"
    }
    ```

* Whenever you add a module to your TF configs, or modify the `source` parameter of a module, you have to run `terraform init` before you can run `plan` or `apply`, to initialize your modules.
* There's a problem with the example code (from chapter 3), which is that inside the module the names of resources are all hard coded, so if you use the module more than once you get name conflicts.
* To fix that, you need to add configurable inputs to the module

## Module inputs

* Example of input variables from a `variables.tf` in a module:

    ```
    variable "cluster_name" {
        description = "Name to use for all the cluster resources"
        type        = string
    }

    variable "db_remote_state_bucket" {
        description = "The name of the S3 bucket for db remote state"
        type        = string
    }

    variable "db_remote_state_key" {
        description = "The path for the db remote state in S3"
        type        = string
    }
    ```

* Then you would replace your hardcoded names, like so:

    ```
    resource "aws_security_group" "alb" {
        name = "${var.cluster_name}-alb"

        ingress {
            from_port   = 80
            to_port     = 80
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }

        egress {
            from_port   = 0
            to_port     = 0
            protocol    = "-1"
            cidr_blocks = ["0.0.0.0/0"]
        }
    }
    ```

* In usage, you would set the input variables in the module call:

    ```
    module "webserver_cluster" {
        source = "../../../modules/services/webserver-cluster"

        cluster_name            = "webservers-stage"
        db_remote_state_bucket  = "{YOUR BUCKET NAME}"
        db_remote_state_key     = "stage/data-stores/mysql/terraform.tfstate"
    }
    ```

* Input variables for a module use the same syntax as arguments for a resource


## Module Locals

* Locals let you do intermediate calculations without exposing extra variables as configurable input
* Example usage, for things that should be the same in all usages, but not actually user configurable:

    ```
    locals {
        http_port       = 80
        any_port        = 0
        any_protocol    = "-1"
        tcp_protocol    = "tcp"
        all_ips         = ["0.0.0.0/0"]
    }

    resource "aws_lb_listener" "http" {
        ...
        port    = local.http_port
        ...
    }
    ```

## Module Outputs

* Example: You want to configure an ASG to increase or decrease capacity in response to load. One way is to use a auto scaling schedule, which can change the cluster size at specific times of day.
* If you define the schedule in the module, it would apply to both staging and production. So you define it in the environment specific code, as in a file like `prod/services/webserver-cluster/main.tf`:

    ```
    resource "aws_autoscaling_schedule" "scale_out_during_business_hours" {
        scheduled_action_name   = "scale-out-during-business-hours"
        min_size                = 2
        max_size                = 10
        desired_capacity        = 10
        recurrence              = "0 9 * * *"
    }

    resource "aws_autoscaling_schedule" "scale_in_at_night" {
        scheduled_action_name   = "scale-in-at-night"
        min_size                = 2
        max_size                = 10
        desired_capacity        = 2
        recurrence              = "0 17 * * *"
    }
    ```

* But those are missing `autoscaling_group_name`, which is for a resource in the module code, which means the module needs an output:

    ```
    output "asg_name" {
        value       = aws_autoscaling_group.example.name
        description = "Name of the auto scaling group"
    }
    ```

* Module output vars can be accessed with `module.<MODULE_NAME>.<OUTPUT_NAME>`
* So you'd amend your schedules:

    ```
    resource "aws_autoscaling_schedule" "scale_out_during_business_hours" {
        [...]

        autoscaling_group_name = module.webserver_cluster.asg_name
    }
    ```

* You can pass through values from the module as outputs of the main config, by adding an output like:

    ```
    output "alb_dns_name" {
        value       = module.webserver_cluster.alb_dns_name
        description = "Domain name of the load balancer"
    }
    ```

## Module Gotchas

### File Paths

* A file path has to be relative
* By default, the path is relative to the current working directory
* That's fine using the `file` function in a TF file in the same directory as where you run `apply`, but won't work when using `file` in a module defined in a separate folder.
* Solution is to use a path reference expression
* Those are of the form `path.<TYPE>`, where type is one of:
    * `path.module` - fs path of the module where the expression is defined
    * `path.root` - fs path of the root module
    * `path.cwd` - fs path of the current working directory
* In normal use `path.root` and `path.cwd` are the same, but some advanced uses run TF from a directory other than the root module.
* Example using the `user_data` script, for a path relative to the module itself:

    ```
    data "template_file" "user_data" {
        template = file("${path.module}/user-data.sh")

        vars = {
            server_port = var.server_port
            db_address  = data.terraform_remote_state.db.outputs.address
            db_port     = data.terraform_remote_state.db.outputs.port
        }
    }
    ```

### Inline Blocks

* Some resources have configuration that can be defined as either a separate, linked resource, or an inline block.
* In module code, always prefer using a separate resource.
* As an example, the `aws_security_group` resource has separate `ingress` and `egress` sub-blocks. In module code, you should define them separately:

    ```
    resource "aws_security_group" "alb" {
        name = "${var.cluster_name}-alb"
    }

    resource "aws_security_group_rule" "allow_http_inbound" {
        type                = "ingress"
        security_group_id   = aws_security_group.alb.id

        from_port   = local.http_port
        to_port     = local.http_port
        protocol    = local.tcp_protocol
        cidr_blocks = local.all_ips
    }

    resource "aws_security_group_rule" "allow_all_outbound" {
        type                = "egress"
        security_group_id   = aws_security_group.alb.id

        from_port   = local.any_port
        to_port     = local.any_port
        protocol    = local.any_protocol
        cidr_blocks = local.all_ips
    }
    ```

* If you make it modular like that, you can do things like expose an extra port in a specific environment's config. You would first put an output into the module:

    ```
    output "alb_security_group_id" {
        value       = aws_security_group.alb.id
        description = "ID of the security group attached to the load balancer"
    }
    ```

* Then in the environment config, you could add another `aws_security_group_rule` resource attached to the ALB SG:

    ```
    resource "aws_security_group_rule" "allow_testing_inbound" {
        type                = "ingress"
        security_group_id   = module.webserver_cluster.alb_security_group_id

        from_port   = 12345
        to_port     = 12345
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ```

## Module Versioning

* If you use the same module in staging and prod, and you change the module, both environments will change on the next `apply`
* To test changes before that, you can use versioned modules, such that your environments only switch to a new module config when it's been tested
* Example folder structure:

    ```
    stage/
        services/
            webserver-cluster/
                main.tf --> v0.0.2/
        data-stores/
            mysql/
                main.tf
                etc
    prod/
        services/
            webserver-cluster/
                main.tf --> v0.0.1/
    global/
        s3/
            main.tf
            etc
    modules/
        services/
            webserver-cluster/
                main.tf
                etc
    ```

* All the above uses a local file path source, but TF supports other module sources like Git URLs, Mercurial URLs, and arbitrary HTTP URLs.
* Easiest way to create a versioned module is to put the code for the module in a separate Git repo and set the `source` parameter to that repository's URL.
* So in this example we've got two repos:
    * `modules` - reusable modules, blueprints for infra parts
    * `live` - live infra for each environment--houses built from blueprints
* If you add tags to the modules repo you can use them as version numbers:

    ```
    cd modules
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin "<URL OF REMOTE>"
    git push origin master
    git tag -a "v0.0.1" -m "First release"
    git push --follow-tags
    ```

* In your calling code:

    ```
    module "webserver_cluster" {
        source = "github.com/foo/modules/webserver-cluster?ref=v0.0.1"

        [...]
    }
    ```

* Once you've done that, you have to rerun `terraform init` to initialize the module from a remote source.
* To use a private git repo, you need to give TF a way to auth to the repo
* Easiest to use SSH auth so you don't have to have hard coded creds for your repo in the code itself. That means:
    * source url format: `git::git@github.com:<OWNER>/<REPO>.git//<PATH>?ref=<V>`

# Chapter 5: Terraform Tips and Tricks: Loops, If-statements, Deployment, and Gotchas

* TF is declarative, which makes some things hard: iteration and conditionals, or inherently procedural ideas like a zero downtime deployment
* TF has a few primitives like `count`, `for_each`, `for`, etc., which let you do some limited looping.
* Chapter topics:
    * loops
    * conditionals
    * zero downtime deployment
    * terraform gotchas

## Loops

* Constructs:
    * `count` - loop over resources
    * `for_each` - loop over inline blocks within a resource
    * `for` expressions - loop over lists and maps
    * `for STRING` directive - loop over lists/maps in a string

### Loops with the count parameter

* Problem to solve in TF: creating multiple IAM users from a list
* TF does not have for loops or other traditional procedural logic built in
* It has a meta-parameter you can use called `count`, which defines how many copies of a resource to create. This creates three IAM users:

    ```
    resource "aws_iam_user" "example" {
        count = 3
        name  = "neo"
    }
    ```

* That would create three IAM users with the same name (which would error)
* To do it correctly, you can use `count.index`:

    ```
    resource "aws_iam_user" "example" {
        count = 3
        name = "neo.${count.index}"
    }
    ```

* That creates `neo.0`, `neo.1`, `neo.2`
* Really you want to do an array lookup:

    ```
    variable "user_names" {
        description = "Create IAM users with these names"
        type        = list(string)
        default     = ["neo", "bravo", "charlie"]
    }

    resource "aws_iam_user" "example" {
        count   = length(var.user_names)
        name    = var.user_names[count.index]
    }
    ```

* Since `aws_iam_user.example` is a list of users, instead of using the standard syntax you have to specify which user resource by index in the list: `<PROVIDER>_<TYPE>.<NAME>[INDEX].ATTRIBUTE`
* To output a single name:

    ```
    output "neo_arn"
        value       = aws_aim_user.example[0].arn
        description = "ARN for user neo"
    }
    ```

* To output all names:

    ```
    output "all_arns" {
        value       = aws_iam_user.example[*].arn
        description = "ARNs for all users"
    }
    ```

* Users by default have no permissions, which means they need policies
* A policy is a JSON doc, also representable with the data resource `aws_aim_policy_document` and the resource `aws_iam_policy`, and attached to a user with `aws_iam_user_policy_attachment`:

    ```
    data "aws_iam_policy_document" "ec2_read_only" {
        statement {
            effect      = "Allow"
            actions     = ["ec2:Describe*"]
            resources   = ["*"]
        }
    }

    resource "aws_iam_policy" "ec2_read_only" {
        name    = "ec2-read-only"
        policy  = data.aws_iam_policy_document.ec2_read_only.json
    }

    resource "aws_iam_user_policy_attachment" "ec2_access" {
        count       = length(var.user_names)
        user        = element(aws_iam_user.example[*].name, count.index)
        policy_arn  = aws_iam_policy.ec2_read_only.arn
    }
    ```

* The above uses `element(<LIST>, <INDEX>)` to get the username from each loop
* You could also do `aws_iam_user.example[count.index].name`, but it won't handle array out of bound exceptions, and `element()` will

### Loops with for_each expressions

* `count` lets you loop an entire resource
* If you want to loop an inline block in a resource, it won't work
* For example, tags on the `aws_autoscaling_group` resource have to be inline blocks
* If you wanted to let users pass in custom tags, you could add a new map input variable, `custom_tags`, in modules/services/web-server-cluster/variables.tf:

    ```
    variable "custom_tags" {
        description = "Custom tags to set on the instances in the ASG"
        type        = map(string)
        default     = {}
    }
    ```

* Then in `live/prod/services/webserver-cluster/main.tf`:

    ```
    module "webserver_cluster" {
        [...]
        custom_tags = {
            Owner       = "team-foo"
            DeployedBy  = "terraform"
        }
    }
    ```

* Having specified the tags, you still have to set them on the ASG resource, which requires a for loop over `var.custom_tags`--in this case a `for_each` expression, which has this syntax:

    ```
    dynamic "<VAR_NAME>" {
        for_each = <COLLECTION>

        content {
            [CONFIG...]
        }
    }
    ```

* Which might look like:

    ```
    resource "aws_autoscaling_group" "example" {
        launch_configuration    = aws_launch_configuration.example.name
        vpc_zone_identifier     = data.aws_subnet_ids.default.ids
        target_group_arns       = [aws_lb_target_group.asg.arn]
        health_check_type       = "ELB"

        min_size = var.min_size
        max_size = var.max_size

        tag {
            key                 = "Name"
            value               = var.cluster_name
            propagate_at_launch = true
        }

        dynamic "tag" {
            for_each = var.custom_tags

            content {
                key                 = tag.key
                value               = tag.value
                propagate_at_launch = true
            }
        }
    }   
    ```

### Loops with for expressions

* Problem: you need a loop to generate a single value
* TF "for expressions" are similar to Python list comprehensions
* Generic syntax: `[for <ITEM> in <LIST> : <OUTPUT>]`
* Where
    * `LIST` is a list to loop over
    * `ITEM` is the local variable name to assign each item in LIST to
    * `OUTPUT` is an expression to transform `ITEM` somehow
* TF code to convert a list of names to upper case:

    ```
    variable "names" {
        description = "A list of names"
        type        = list(string)
        default     = ["neo", "trinity", "morpheus"]
    }

    output "upper_names" {
        value = [for name in var.names : upper(name)]
    }
    ```

* Filtering by condition:

    ```
    output "short_upper_names" {
        value = [for name in var.names : upper(name) if length(name) < 5]
    }
    ```

* You can also loop a map with `[for <KEY>,<VALUE> in <MAP> : <OUTPUT>]`
* Example:

    ```
    variable "hero_thousand_faces" {
        description = "map"
        type        = map(string)
        default     = {
            neo      = "hero"
            trinity  = "love interest"
            morpheus = "mentor"
        }
    }

    output "bios" {
        value = [for name, role in var.hero_thousand_faces : "${name} is ${role}"]
    }
    ```

* Generic syntax:

    ```
    # To output a LIST
    {for <ITEM> in <MAP> : <OUTPUT_KEY> => <OUTPUT_VALUE>}

    # To output a MAP
    {for <KEY>,<VALUE> in <MAP> : <OUTPUT_KEY> => <OUTPUT_VALUE>}
    ```

* Transforming a map to make all the keys and values uppercase:

    ```
    output "upper_roles" {
        value = {for name, role in var.hero_thousand_faces : upper(name) => upper(role)}
    }
    ```

### Loops with the for string directive

* String interpolation: `"Hello, ${var.name}"`
* String directives let you use control statements in strings using a syntax similar to interpolation, but using `%{...}`
* Two types: for loops and conditionals
* For string directive: `%{for <ITEM> in <COLLECTION>}<BODY>%{endfor}`
* Example:

    ```
    variable "names" {
        type    = list(string)
        default = ["neo", "trinity", "morpheus"]
    }

    output "for_directive" {
        value = <<EOF
    %{ for name in var.names }
        ${name}
    %{ endfor }
    EOF
    }
    ```

* That'll output a bunch of whitespace--you can use tilde as a 'strip marker' to consume all whitespace either before the string directive or after it, like `%{~ for name in var.names }` and `%{~ endfor }`

## Conditionals

* Several ways to do conditionals
    * `count` - conditional resources
    * `for_each` and `for` expressions - conditional inline blocks
    * `if` string directive - conditionals in a string

### Conditionals with count

#### If statements with count

* Question: Is there a way you could define the `aws_autoscaling_schedule` resources in the `webserver-cluster` module and conditionally create them for some users of the module and not others?
* Important to know:
    1. If you set `count` to 1 on a resource, you get one copy of that resource; if you set it to 0, the resource is not created at all
    1. TF supports conditional expressions of the format `<CONDITION> ? <TRUE_VAL> : <FALSE_VAL>` (ternary)
* Combining those two things:

    ```
    # Module Code
    variable "enable_autoscaling" {
        description = "If true, enable auto scaling"
        type        = bool
    }

    resource "aws_autoscaling_schedule" "scale_out_during_business_hours" {
        count = var.enable_autoscaling ? 1 : 0

        [...]
    }

    # Environment Code
    module "webserver_cluster" {
        [...]
        enable_autoscaling = false
    }
    ```

* Works for an explicit boolean, but what if you want the output of a complex expression, like string equality? This shows how to create a metric alarm for spiking CPU over a 5 minute period:

    ```
    resource "aws_cloudwatch_metric_alarm" "high_cpu_utilization" {
        alarm_name  = "${var.cluster_name}-high-cpu-utilization"
        namespace   = "AWS/EC2"
        metric_name = "CPUUtilization"

        dimensions = {
            AutoScalingGroupName = aws_autoscaling_group.example.name
        }

        comparison_operator = "GreaterThanThreshold"
        evaluation_periods  = 1
        period              = 300
        statistic           = "Average"
        threshold           = 90
        unit                = "Percent"
    }
    ```

* Here's one which deals with CPU credits, which means it has to conditionally exist only for `tXXX` instances, since bigger instances don't use credits:

    ```
    resource "aws_cloudwatch_metric_alarm" "low_cpu_credit_balance" {
        count = format("%.ls", var.instance_type) == "t" ? 1 : 0

        [...]
    }
    ```

#### If-else statements with count

* Use the count param and a conditional expression on 


# Chapter 6: Production-grade Terraform Code

* Topics:
    1. Why it takes so long to build prod grade infrastructure
    1. The prod-grade infra checklist
    1. Prod grade infra modules:
        1. Small modules
        1. composable modules
        1. Testable modules
        1. Releasable modules
        1. Beyond Terraform modules

## Why it takes so long to build prod-grade infrastructure

* DevOps is in its infancy
* The field is hugely susceptible to yak shaving (all the tiny tasks you have to do before you can get to the thing you need to do)
* Those things are 'accidental complexity'--there's also the 'essential complexity' of the problem area, which is that there's a genuinely long checklist to properly prepare infrastructure for production

### The production grade infastructure checklist

1. **Install** - install software binaries and all dependencies
1. **Configure** - Configure software at runtime, including network settings, TLS certs, service discovery, replication, etc.
1. **Provision** - Provision infrastructure, including servers, load balancers, network config, firewall settings, IAM permissions, etc.
1. **Deploy** - deploy service on top of the infrastructure, with no down time--includes blue-green, rolling, and canary deployments
1. **High availability** - Withstand outages of individual components
1. **Scalability** - scale up and down in response to load, horizontally and vertically
1. **Performance** - Optimize CPU, memory, disk, network, and GPU usage. Includes query tuning, benchmarking, load testing, and profiling
1. **Networking** - Configure static and dynamic IPs, ports, service discovery, firewalls, DNS, SSH access, VPN access
1. **Security** - Encryption in transit and at rest, authentication, authorization, secrets management, server hardening
1. **Metrics** - Availability metrics, business metrics, app metrics, server metrics, events, observability, tracing, alerting
1. **Logs** - rotate logs on disk, aggregate log data centrally
1. **Backup and Restore** - Make backups of DBs, caches, other data on a schedule, replicate to separate region/account
1. **Cost Optimization** - Pick proper instance types, use spot and reserved instances, use auto scaling, nuke unused resources
1. **Documentation** - Document code, architecture, practices, create playbooks for incident response
1. **Tests** - Write automated tests for infrastructure code, run tests after every commit and nightly

## Production-grade infrastructure modules

### Small modules

* New TF devs often define all their infra for all environments in a single file or module. Bad idea.
* "Large modules--modules that contain more than a few hundred lines of code or that deploy more than a few closely related pieces of architecture--should be considered harmful."
* Downsides of large modules:
    * They're slow to produce a plan or apply
    * They're insecure, because everybody involved needs lots of permissions
    * They're risky, because they increase blast area of failures
    * They're hard to understand
    * They're hard to review
    * They're hard to test
* You should build small modules that each do one thing.
* At this point in the book there's a `webserver-cluster` module that does three somewhat unrelated things:
    * Deploys an ASG for a zero-downtime, rolling deployment
    * Deploys an ALB
    * Deploys a hello, world app
* Could be refactored into 3 smaller modules:
    * `modules/cluster/asg-rolling-deploy`
    * `modules/networking/alb`
    * `modules/networking/hello-world-app`

### Composable Modules

* How to build modules that are reusable and composable?
* In most languages you use function composition
* Functions are most composable when they have no side effects
* You can reduce side effects by
    * avoiding reading state from outside the function
    * don't write state to the outside
    * return the result of computations via output
* You can't avoid side effects when working with infrastructure code, but you can follow good principles:
    * Pass everything in via input variables
    * Return everything via output variables
    * Build more complicated modules by combining simpler modules
* Common pattern with TF to have at least two types of modules:
    * Generic modules - reusable across a wide variety of cases
    * Use-case specific modules - those that compose other modules to serve a specific use case

### Testable Modules

* It's useful to include an `examples` folder in a module, with examples that will actually deploy something using the module.
* You could add something like the following, at `examples/asg/main.tf`:

    ```
    provider "aws" {
        region = "us-east-1"
    }

    module "asg" {
        source = "../../modules/cluster/asg-rolling-deploy"

        cluster_name    = var.cluster_name
        ami             = "ami-12345"
        instance_type   = "t2.micro"

        min_size            = 1
        max_size            = 1
        enable_autoscaling  = false

        subnet_ids          = data.aws_subnet_ids.default.ids
    }

    data "aws_vpc" "default" {
        default = true
    }

    data "aws_subnet_ids" "default" {
        vpc_id = data.aws_vpc.default.id
    }
    ```

* That provides:
    1. A manual test harness that you can use with `apply`/`destroy` to test
    1. An automated test harness (covered in chapter 7)
    1. Executable documentation
* Every module in your `modules` folder should have a matching folder in `examples`, and every example in the `examples` folder should have a corresponding test in the `test` folder.
* Folder structure for a typical modules repo:

    ```
    modules/
        examples/
            alb/
            asg-rolling-deploy/
                one-instance/
                auto-scaling/
                with-load-balancer/
                custom-tags/
            hello-world-app/
            mysql/
        modules/
            alb/
            asg-rolling-deploy/
            hello-world-app/
            mysql/
        test/
            alb/
            asg-rolling-deploy/
            hello-world-app/
            mysql/
    ```

* Good practice is to write the example code first
* Also good to pin TF modules to a specific version of terraform using the `required_version` argument
* Each major release of terraform is backwards incompatible, so don't do it by accident
* For production grade code, pin to an _exact_ version, not a range--even patch bumps can cause problems.
* Also pin all your provider versions. Typically a major version is ok, like `version = "~> 2.0"`

### Releaseable modules

* Once they're written and tested, you can release them with git tags
* Or you can put them in the Terraform Registry
* Requirements for that:
    * Must live in a public GH repo
    * Repo must be named `terraform-<PROVIDER>-<NAME>`
    * Module must follow a specific file structure
    * Repo must use git tags with semver for releases
* TF supports a special syntax for consuming modules from the Terraform Registry. You can use a registry URL in the source argument of the module, and specify a separate version argument.

### Beyond Terraform Modules

* To build out your entire production-grade infrastructure, you'll need other tools like Docker, Packer, Chef, Puppet, etc.
* Most of that code can live in the modules folder with your TF code
* Occasionally you need to run some non-TF code (a script) directly from a TF module. Sometimes this integrates TF with another system, other times it works around a TF limitation
* Couple of escape hatches in TF make that possible:
    1. Provisioners
    1. Provisioners with `null_resource`
    1. External data source

#### Provisioners

* TF provisioner are used to execute scripts either on the local machine or a remote machine when you run TF, typically for bootstrapping, config management, or cleanup
* There are several kinds: `local-exec`, `remote-exec`, `file`
* You add them to a resource with a `provisioner` block
* Using `local-exec` to execute a local script:

    ```
    resource "aws_instance" "example" {
        ami             = "ami-12345"
        instance_type   = "t2.micro"

        provisioner "local-exec" {
            command = "echo \"Hello, World from $(uname -smp)\""
        }
    }
    ```

* When you run `apply` on it, it runs the command locally
* `remote-exec` is more complicated--your TF client must be able to:
    1. Talk to the remote host over the network
    1. Authenticate to the remote host
* Example using an AWS instance:

    ```
    resource "aws_security_group" "instance" {
        ingress {
            from_port       = 22
            to_port         = 22
            protocol        = "tcp"
            cidr_blocks     = ["0.0.0.0/0"] # SUPER INSECURE, NO NO
        }
    }

    # you should actually manage keys outside terraform
    resource "tls_private_key" "example" {
        algorithm = "RSA"
        rsa_bits  = 4096
    }

    resource "aws_key_pair" "generated_key" {
        public_key = tls_private_key.example.public_key_openssh
    }

    resource "aws_instance" "example" {
        ami                     = "ami-12345"
        instance_type           = "t2.micro"
        vpc_security_group_ids  = [aws_security_group.instance.id]
        key_name                = aws_key_pair.generated_key.key_name

        provisioner "remote-exec" {
            inline = ["echo \"Hello, World from $(uname -smp)\""
        }

        connection {
            type        = "ssh"
            host        = self.public_ip
            user        = "ubuntu"
            private_key = tls_private_key.example.private_key_pem
        }
    }
    ```

* By default provisioners are create time provisioners
* If you set `when = "destroy"` it becomes a destroy-time provisioner
* Multiple provisioners can be set on a resource, and will run in order
* You can use `on_failure` to tell TF how to handle errors from a provisioner
* If you set `on_failure = "continue"` it ignores errors
* If you set `on_failure = "abort"` it quits the creation/destruction

#### Provisioners with null_resource

* Provisioners can only be defined in a resource block
* Sometimes you want to run one without tying it to a specific block
* You can do this will `null_resource`, which acts like a normal resource but doesn't create anything.
* If you define provisioners on `null_resource` you can run scripts as part of the TF lifecycle, separate from any 'real' resource

    ```
    resource "null_resource" "example" {
        provisioner "local-exec" {
            command = "echo \"Hello, World from $(uname -smp)\""
        }
    }
    ```

* It has an argument, `triggers`, that takes in a map of keys and values
* When the values change, the `null_resource` is recreated, forcing its provisioners to run.
* For example, to execute a provisioner within a `null_resource` every single time you run `apply`, you could use the `uuid()` function, which returns a new, random UUID each time its called:

    ```
    resource "null_resource" "example" {
        triggers = {
            uuid = uuid()
        }

        provisioner "local-exec" {
            command = "echo \"Hello, World from $(uname -smp)\""
        }
    }
    ```

### External Data Source

* Sometimes you need a script to fetch some data and make that data available inside the TF code.
* You can use the `external` data source, which allows an external command that implements a specific protocol to act as a data source
* Protocol:
    * You can pass data from TF to the external program using the `query` argument of the `external` data source. The external program can read in these arguments as JSON from stdin.
    * The external program can pass data back to TF by writing JSON to stdout. The rest of the TF code can then pull data out of this JSON using the `result` output attribute of the external data source.
* Example:

    ```
    data "external" "echo" {
        program = ["bash", "-c", "cat /dev/stdin"]
        query = {
            foo = "bar"
        }
    }

    output "echo" {
        value = data.external.echo.result
    }

    output "echo_foo" {
        value = data.external.echo.result.foo
    }
    ```

# Chapter 7: How to test Terraform Code

Topics:

* Manual tests
    * basics
    * post-test cleanup
* Automated tests
    * unit
    * integration
    * end to end
    * other testing approaches

## Manual tests

* What's the TF equivalent to manually testing a web app?
* You can't deploy cloud resources locally.
* Testing takeaway 1: when testing TF code, there is no localhost. The only practical way to manually test it is to deploy it to a real environment. The apply/destroy cycle is how you do manual testing
* Easiest manual test is to use examples folder content, then look for the correct outputs
* Author recommends that every team set up an isolated sandbox environment where you can bring up and tear down any infrastructure without worrying about affecting others. Gold standard is that each dev gets their own isolated sandbox environment.

### Cleaning up after tests

* If you aren't careful you can end up with infrastructure all over the place, wasting money
* Key testing takeaway 2: regularly clean up your sandbox environments
* At a minimum, all devs should regularly use `destroy` to bring down whatever they put up. 
* Also potentially worth running an automatic cleaning tool
    * `cloud-nuke` - open source tool that can delete all resources in a cloud environment
    * Janitor Monkey - open source tool for cleaning up AWS resources on a schedule
    * `aws-nuke` - deletes everything in an AWS account

## Automated Tests

### Unit tests

* What is a unit test in TF? First step is to identify what a TF 'unit' is.
* Closest equivalent to a single function or class in TF is a single, generic module (as defined in Composable Modules)

