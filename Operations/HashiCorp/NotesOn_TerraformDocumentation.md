# Notes on Terraform documentation

## Input Variables

From [https://learn.hashicorp.com/terraform/getting-started/variables](https://learn.hashicorp.com/terraform/getting-started/variables)

* Create a file, `variables.tf`
* Example:

    ```
    variable "region" {
        default = "us-east-1"
    }
    ```

* Use with `var.region`
* Assigning from the command line: `terraform apply -v 'region=us-east-2'`
* In a file with `.tfvars` extension:

    ```
    region = "us-east-2"
    ```

* Use with `terraform apply -var-file=myvars.tfvars`
* terraform will merge env var values like `TF_VAR_region`
* Only string type vars work that way
* If you execute `terraform apply` with undefined vars, it asks for them interactively
* Defaults can be given in the definition block
* Types:

    ```
    # string type
    variable "region" { default = "us-east-1" }

    # list type
    variable "cidrs" { type = list, default = [ "10.0.0.0/16", "10.1.0.0/16"] }

    # map type - access is `var.amis[var.region]`
    variable "amis" {
        type = "map"
        default = {
            "us-east-1" = "ami-12345"
            "us-east-2" = "ami-54321"
        }
    }
    ```

* Maps can be set with `-var 'amis={us-east-1 = "foo", us-west-2 = "bar"}'`

## Output Variables

From [https://learn.hashicorp.com/terraform/getting-started/outputs](https://learn.hashicorp.com/terraform/getting-started/outputs)

* Output vars are a way to organize data to be easily queried and shown back to the terraform user
* TF stores a lot of values during builds, but you're probably only interested in some of them
* 
