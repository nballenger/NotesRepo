# Notes on Learn CloudFormation

By Agus Kurniawan; Packt Publishing, July 2018; ISBN 9781789134322

# Introducing AWS CloudFormation

* In general, this is the flowchart for infrastructure as code:
    1. Write and deploy scripts
    1. Create a CloudFormation Stack
    1. Provision the stack
* IaC scripts in CF are JSON, YAML, or text
* IaC scripting with source control:
    1. Write scripts
    1. Push to VCS
        1. Automated testing
    1. Save locally or push to s3
    1. Create a CF stack
    1. Provision the stack
* All the resources you want to build are defined in a template
* You put the template into a stack, which is a collection of resources managed as a unit
* Stacks may be nested
* Multi-region deployments involve StackSets
* A StackSet is supposed to let you create CF stacks in AWS accounts across regions using a single CF template
* 
