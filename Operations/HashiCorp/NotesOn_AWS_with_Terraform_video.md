# Notes on VPC Solutions with EC2 for Production: AWS With Terraform

By Niyazi Erdogan

* Course implements:
    * VPC
    * subnets
    * security groups
    * route tables
    * internet and nat gateways
    * auto scaling groups
    * other stuff

Terraform Refresher

* infrastructre as code
* scripting format is "templates"
* uses plugin "providers" to cover different cloud platforms
* run `terraform init` to initialize provider plugins based on current .tf files
* `terraform plan` can be run alone, or with `-var-file="path"` to pass in a var file, or `-var="somevar=somevalue"` for single values
* Output of the plan command is a summary of state changes
* `terraform apply` can be run alone, or with `-var-file` or `-var`
* `terraform destroy` destroys all resources known to the state file
* Other commands:
    * `console` - interactive console for tf syntax
    * `env` - managing terraform workspaces ("environments")
    * `fmt` - find and rewrite config files in canonical format
    * `get` - download and install modules
    * `graph` - create a visual graph of tf resources
    * `import` - import an existing infrastructure to TF
    * `output` - read outputs from a state file
    * `providers` - print a tree of tf providers
    * `push` - upload this module to Atlas to run
    * `refresh` - update local state file against real resources
    * `show` - inspect state or plan
    * `taint` - manually mark a resource for recreation
    * `untaint` - manually unmark
    * `validate` - validate resources in tf files
    * `workspace` - workspace management for tf environments
    * `debug` - manage outputs for debugging
    * `force-unlock` - manually unlock tf state
    * `state` - advanced state management
* Defining variables

    ```
    variable "ec2_instance_name" {
        default     = "My-Instance"             # optional
        description = "Name of the instance"    # optional
        type        = "string"                  # optional
    }

    variable "private_subnets" {
        description = "List of private subnets"
        type        = "list"
    }
    ```

* Referencing variables uses an interpolation syntax of `"${var.name_of_var}"`:

    ```
    resource "aws_instance" "my_ec2_instance" {
        ami             = "ami-12345"
        instance_type   = "t2.micro"
        key_name        = "myKeyPair"
        tags {
            Name = "${var.ec2_instance_name}"
        }
    }
    ```

* Setting and passing variables
    * If you want to pass values, use `-var` or `-var-file`
    * If you don't pass values, tf will ask you for values interactively
* Dependencies are referenced with a similar syntax: `"${resource_type.resource_name.id}"`:

    ```
    resource "aws_instance" "my_ec2_instance" {
        ami             = "ami-12345"
        instance_type   = "t2.micro"
        key_name        = "myEC2KeyPair"
    }

    resource "aws_eip" "ec2_elastic_ip" {
        instance = "${aws_instance.my_ec2_instance.id}"
    }
    ```

* Explicit resource dependencies can be given via `depends_on`, which takes a list in `["resource_type.resource_name", ...]` format:

    ```
    resource "aws_instance" "my_ec2_instance" {
        ami             = "ami-12345"
        instance_type   = "t2.micro"
        key_name        = "myEC2KeyPair"
    }

    resource "aws_eip" "ec2_elastic_ip" {
        instance    = "${aws_instance.my_ec2_instance.id}"
        depends_on  = ["aws_instance.my_ec2_instance"]
    ```

* States
    * Everything recorded in state files, `terraform.tfstate`
    * State storage can be local or remote
    * You can pass `-backend-config="key=value"` for things like `s3_bucket_name`, `remote_states`, etc.

## Create a keypair

* Keypairs need to be created manually in AWS, not via terraform

## Remote state

* Need an s3 bucket, shouldn't create it with terraform (since it could get destroyed)

## Creating the project

```
mkdir -p terraform_projects/vpc_and_ec2
cd terraform_projects/vpc_and_ec2
touch main.tf variables.tf
```
