# Notes on AWS CloudFormation

From [https://docs.aws.amazon.com/cloudformation/index.html#lang/en_us](https://docs.aws.amazon.com/cloudformation/index.html#lang/en_us)

## Best Practices

From [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html)

### Planning and Organizing

* Organize stacks by lifecycle and ownership
    * Group resources with common lifecycles and ownership
    * That lets resource owners change at their own pace
    * Example:
        * Team of devs and engineers who own a website
        * Website is hosted on autoscaling instances behind a load balancer
        * The website has its own lifecycle, maintained by website team
        * So the website and its resources can be a stack
        * The back-end databases can be in a separate stack owned by db admins
    * Two common frameworks for organizing stacks
        * Multi-layered architecture
        * Service-oriented architecture
    * Layered architecture
        * Stacks are in horizontal layers that build on one another
        * Each layer has a dependency on the one directly below it
        * One or more stacks can be in each layer
        * Inside a layer stacks should still be segmented by lifecycle/ownership
    * Service Oriented architecture
        * Organize business problems into manageable parts
        * Each part is a service that is self-contained
        * Services can map to stacks, where each stack has its own lifecycle/owners
        * All services can be wired together to interact
* Use Cross-Stack references to export shared resources
    * You may want to use resources in a separate stack
    * Using hard-coded values or input params is possible, but messy
    * Cross-stack references export resources from a stack so other stacks can use them
    * Example:
        * Network stack has VPC, security group, subnet
        * You want all public web apps to use those resources
        * If you export them, all stacks with public webapps can use them
* Use IAM to control access
    * IAM lets you control things like:
        * viewing stack templates
        * creating stacks
        * deleting stacks
    * Anyone managing stacks requires permissions to access resources in them
    * To separate permissions between a user and CloudFormation, use a service role
* Verify Quotas for all resource types
    * Before you launch a stack, make sure you can create all the resources in it
    * If you hit a limit, CF won't create the stack until you get more resources
* Reuse templates to replicate stacks in multiple environments
    * Use parameters, mappings, and conditions to make templates reusable
* Use nested stacks to reuse common template patterns
    * If you have repeating patterns, factor them out into their own templates
    * Using `AWS::CloudFormation::Stack` as a resource in a template lets you nest them
    * Example: 
        * You have an LB config you use for most stacks
        * Create a dedicated template for the LB
        * Use the `Stack` resource in other templates to pull it in
* Do not embed credentials in your templates
    * Use input parameters to pass in information
    * Use the `NoEcho` property to obfuscate the parameter
* Use AWS-specific parameter types
    * If you need inputs to use AWS specific, existing values, you can use AWS-specific parameter types.
* Use parameter constraints
    * You can constrain allowed input values
* Use AWS::CloudFormation::Init to deploy software apps on EC2 instances
* Use the latest helper scripts
    * Include the following command in the `UserData` property of your template: `yum install -y aws-cfn-bootstrap`
    * That will make sure launched instances get the latest helper scripts
* Validate templates before using them
    * CF can validate templates without launching a stack
* Manage all stack resources through CF
* Create change sets before updating stacks
    * CF won't implement changes before you execute the change set
    * If you generate a change set, it will tell you, for instance, that you're about to lose a database due to your proposed changes.
* Use stack policies
    * Describes what update actions can be done to what resources
* Use CloudTrail to log CF calls
    * Make sure you enable logging and specify a bucket for the logs
* Use code reviews and revision controls to manage templates
* Update your EC2 linux instances regularly via `yum update`

# CloudFormation Template Anatomy

## Major Sections

* Required
    * Resources
* Optional
    * Format version
    * Description
    * Metadata
    * Parameters - values to pass to the template at stack runtime
    * Mappings - K/V mappings to specify conditional parameter values, like a lookup table
    * Conditions - conditions that control whether certain resources are created or whether certain resource properties are assigned a value during stack create/update
    * Transform - in serverless apps, this gives the version of the SAM to use
    * Outputs - values returned when you view your stack's properties

### Format Version

* Latest and only value is `2010-09-09`
* Looks like `"AWSTemplateFormatVersion": "2010-09-09"`

### Description

* Must follow the `AWSTemplateFormatVersion` section
* Must be a literal string between 0 and 1024 bytes
* Cannot be specified from a parameter or function

### Metadata

* Allows you to include arbitrary objects that give details about the template
* You can't update only metadata during a stack update
* Example:

    ```json
    "Metadata": {
        "Instances": {"Description": "Info about instances"},
        "Databases": {"Description": "Info about databases"}
    }
    ```

* Metadata specific keys:
    * `AWS::CloudFormation::Init` - defines config tasks for the `cfn-init` helper script, useful on EC2 instances
    * `AWS::CloudFormation::Interface` - defines grouping and ordering of input parameters when displayed in the console. By default the console sorts alphabetically by logical id.
    * `AWS::CloudFormation::Designer` - describes how resources are laid out in the visual designer.

### Parameters

* Lets you input custom values on stack create/update
* Example parameter declaration
    
    ```json
    "Parameters": {
        "InstanceTypeParameter": {
            "Type": "String",
            "Default": "t2.micro",
            "AllowedValues": ["t2.micro", "m1.small", "m1.large"],
            "Description": "Enter a value."
        }
    }
    ```

* Example parameter reference from elsewhere in the template:

    ```json
    "Ec2Instance": {
        "Type": "AWS::EC2::Instance",
        "Properties": {
            "InstanceType": { "Ref": "InstanceTypeParameter" },
            "ImageId": "ami-12345"
        }
    }
    ```

* General parameter requirements
    * Max of 60 params per template
    * Each param must have an alphanumeric, unique logical name
    * Each param must have a type supported by CF
    * Each param must be assigned a value at runtime (or have a default)
    * Params must be declared and referenced from within the same template
    * Params may be referenced from `Resources` and `Outputs`
* Generalized format:

    ```json
    "Parameters": {
        "ParameterLogicalId": {
            "Type": "DataType",
            "ParameterProperty": "value"
        }
    }
    ```

* Properties you can include in a parameter
    * `AllowedPattern` - regex to allow for string types
    * `AllowedValues` - array of values
    * `ConstraintDescription` - string that explains a constraint
    * `Default` - default value to use
    * `Description` - string up to 4k characters
    * `MaxLength` - int, for string types
    * `MaxValue` - numeric, for numeric types
    * `MinLength` - int, for string types
    * `MinValue` - numeric, for numeric types
    * `NoEcho` - whether to mask the param in stack description calls, can be `true`
    * `Type` - datatype for parameter (`DataType`)
        * `String`
        * `Number` - int or float
        * `List<Number>` - array of ints or floats, comma separated
        * `CommaDelimitedList` - strings
        * AWS-Specific Param Types
        * SSM param types (correspond to params in Parameter Store)
* AWS Specific Parameter Types
    * Helpful in catching invalid values on create/update
    * To use, template user must enter existing AWS values
    * If you want to allow template users to enter values from different AWS accounts, don't use AWS specific types, just use String or comma delimited list
* Supported aws specific parameter types
    * `AWS::EC2::AvailabilityZone::Name`
    * `AWS::EC2::Image::Id`
    * `AWS::EC2::Instance::Id`
    * `AWS::EC2::KeyPair::KeyName`
    * `AWS::EC2::SecurityGroup::GroupName`
    * `AWS::EC2::SecurityGroup::Id`
    * `AWS::EC2::Subnet::Id`
    * `AWS::EC2::Volume::Id`
    * `AWS::EC2::VPC::Id`
    * `AWS::Route53::HostedZone::Id`
    * `List<AWS::EC2::AvailabilityZone::Name>`
    * `List<AWS::EC2::Image::Id>`
    * `List<AWS::EC2::Instance::Id>`
    * `List<AWS::EC2::SecurityGroup::GroupName>`
    * `List<AWS::EC2::SecurityGroup::Id>`
    * `List<AWS::EC2::Subnet::Id>`
    * `List<AWS::EC2::Volume::Id>`
    * `List<AWS::EC2::VPC::Id>`
    * `List<AWS::Route53::HostedZone::Id>`
* SSM Parameter Types
    * Correspond to existing SSM params
    * Specify the key and AWS fetches it
    * You can also use `ssm` or `ssm-secure` patterns to specify values to use in the template
    * For stack updates, "Use existing value" in the console and `UsePreviousValue` in the `update-stack` call tell CF to use the existing SSM parameter key, not its value. 
    * If you use `ssm` or `ssm-secure` dynamic parameter patterns, you must specify a version of hte Systems Manager parameter for CF to use
    * CF can do validation on Systems Manager parameter keys, but not on their values. Do validation for parameter values in parameter store.
* Supported SSM Parameter Types
    * `AWS::SSM::Parameter::Name` - name of a parameter key
    * `AWS::SSM::Parameter::Value<String>` - param whose value is a string
    * `AWS::SSM::Parameter::Value<List<String>>` or 
    * `AWS::SSM::Parameter::Value<CommaDelimitedList>`
    * `AWS::SSM::Parameter::Value<AWS-Specific param type>`
    * `AWS::SSM::Parameter::Value<List<AWS-specific>>`
* Unsupported
    * Lists of SSM parameter types
    * You can't define template params as `SecureString` parameter types, but you can specify secure strings as parameter values for certain resources using dynamic parameter patterns.

## Using Dynamic References to Specify Template Values

* Dynamic references let you specify external values that are stored and managed in other services
* CF gets the value of the reference during stack and change set operations
* CF supports three dynamic reference patterns:
    * `ssm`
    * `ssm-secure`
    * `secretsmanager`
* You can use up to 60 dynamic references in a template
* For transforms, CF does not resolve dynamic references prior to invoking any transforms, instead passing the string literal to the transform.
* Dynamic references for secure values are not supported in custom resources.

### Specifying dynamic references in templates

* All adhere to this pattern:

    ```
    {{resolve:service-name:reference-key}}
    ```

* In that, these are the parts:
    * `service-name`: `ssm`, `ssm-secure`, or `secretsmanager`
    * `reference-key`: depends on the type
* For SSM params:
    * Pattern: `{{resolve:ssm:parameter-name:version}}`
    * Must meet: `{{resolve:ssm:[a-zA-Z0-9_.-/]+:\\d+}}`
    * `parameter-name` part is the name in Parameter Store. Case sensitive.
    * `version` - integer specifying the parameter version
    * You must have access to `GetParameters` for that param
    * Additional considerations:
        * CF does not support cross-account SSM access
        * For custom resources, CF resolves ssm dynamic references prior to sending the request to the custom resource.
        * A parameter label is a user-defined alias for managing versions. You can label a version inside systems manager.
        * A public parameter is one provided by an AWS service for use with that service, and stored in Parameter Store.
* For SSM Secure String params:
    * Pattern: `{{resolve:ssm-secure:parameter-name:version}}`
    * Must meet: `{{resolve:ssm-secure:[a-zA-Z0-9_.-/]+:\\d+}}`
    * Usage is as above.
    * Additional considerations:
        * CF does not return the parameter value for secure strings, but instead the dynamic reference
        * CF does store the literal dynamic reference
        * Etc.

## Mappings

* Matches a key to a set of named values
* So if you want to set values based on a region, you create a mapping that ties the region name as a key to the values you want to specify for each region.
* Use `Fn::FindInMap` to retrieve map values

### Syntax

* Keys must be literal strings
* Values can be `String` or `List`
* Example:

    ```json
    "Mappings": {
        "Mapping01": {
            "Key01": {
                "Name": "Value01"
            }
        }
    }
    ```

* Basic mapping:

    ```json
    "Mappings": {
        "RegionMap": {
            "us-east-1": { "HVM64": "ami-12345" },
            "us-west-1": { "HVM64": "ami-5566324" }
        }
    }
    ```

* Usage:
    
    ```json
    "Resources": {
        "myEC2Instance": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "ImageId": { "Fn::FindInMap": [ "RegionMap", {"Ref": "AWS::Region" }, "HVM64"]},
                "InstanceType": "m1.small"
            }
        }
    }
    ```

* Using an input parameter to `Fn::FindInMap` to refer to a specific value

    ```json
    {
        "Parameters": {
            "EnvironmentType": {
                "Description": "Env type",
                "Type": "String",
                "Default": "test",
                "AllowedValues": ["prod", "test"],
                "ConstraintDescription": "must be prod or test"
            }
        },
        "Mappings": {
            "RegionAndInstanceTypeToAMIID": {
                "us-east-1": {
                    "test": "ami-1",
                    "prod": "ami-2"
                },
                "us-west-1": {
                    "test": "ami-3",
                    "prod": "ami-4"
                }
            }
        },
        "Resources": { ... },
        "Outputs": {
            "TestOutput": {
                "Description": "Return name of AMI ID matching region/env",
                "Value": { "Fn::FindInMap": [ 
                    "RegionAndInstanceTypeToAMIID", 
                    { "Ref": "AWS::Region" },
                    { "Ref": "EnvironmentType" }
                ]}
            }
        }
    }
    ```

## Conditions

* Contains statements defining circumstances under which entities are created or configured
* Evaluated based on predefined pseudo parameters or input parameter values
* After you define all your conditions, you can associate them with resources and resource properties in `Resources` and `Outputs`
* On stack create/update, CF evaluates all conditions in your template before creating any resources. Resources associated with a true condition are created, otherwise ignored.
* Re-evaluates conditions at each stack update before updating any resources. Resources still associated with a true condition are updated, those with a false condition are deleted.
* During a stack update, you cannot update conditions by themselves, you can only do it when you include changes that change resources.

### How to use conditions overview

* Depending on the entity you want to create or configure, conditions go in tehse sections:
    * `Parameters`
        * Define the inputs you want your conditions to evaluate
    * `Conditions`
        * Define conditions using intrinsic conditions functions
    * `Resources` and `Outputs`
        * Associate conditions with the resources or outputs you want to conditionally create or update.

### Syntax

* Each condition declaration contains a logical id and intrinsic functions evaluated when you create or update a stack
* Example of syntax:

    ```json
    "Conditions": {
        "Logical Id": { IntrinsicFunction }
    }
    ```

* Intrinsic functions:
    * `Fn::And`
    * `Fn::Equals`
    * `Fn::If`  - only supported in the metadata attribute, update policy attribute, and property values in the `Resources` and `Outputs` sections
    * `Fn::Not`
    * `Fn::Or`
* Example following, with these elements:
    * Includes an `EnvType` input param
    * For `prod`, CF creates an instance and attaches a volume
    * For `test`, CF creates only the instance
    * `CreateProdResources` evaluates to `true` if the `EnvType` is `prod`
    * `NewVolume` and `MountPoint` resources are associated with `CreateProdResources`, so they only happen if that is true.
* Example template:

    ```json
    {
        "AWSTemplateFormatVersion": "2010-09-09",
        "Mappings": {
            "RegionMap": {
                "us-east-1": { "AMI": "ami-12345", "TestAz": "us-east-1a" },
                ...
            }
        },
        "Parameters": {
            "EnvType": {
                "Description": "Environment type.",
                "Default": "test",
                "Type": "String",
                "AllowedValues": ["prod", "test"],
                "ConstraintDescription": "must be prod or test"
            }
        },
        "Conditions": {
            "CreateProdResources": {"Fn::Equals": [{"Ref": "EnvType"}, "prod"]}
        },
        "Resources": {
            "EC2Instance": {
                "Type": "AWS::EC2::Instance",
                "Properties": {
                    "ImageId": { "Fn::FindInMap": [
                        "RegionMap",
                        { "Ref": "AWS::Region" },
                        "AMI"
                    ]}
                }
            },

            "MountPoint": {
                "Type": "AWS::EC2::VolumeAttachment",
                "Condition": "CreateProdResources",
                "Properties": {
                    "InstanceId": {"Ref": "EC2Instance"},
                    "VolumeId": {"Ref": "NewVolume"},
                    "Device": "/dev/sdh"
                }
            },

            "NewVolume": {
                "Type": "AWS::EC2::Volume",
                "Condition": "CreateProdResources",
                "Properties": {
                    "Size": "100",
                    "AvailabilityZone": { "Fn::GetAtt": [ "EC2Instance", "AvailabilityZone"]}
                }
            }
        },

        "Outputs": {
            "VolumeId": {
                "Value": { "Ref": "NewVolume" },
                "Condition": "CreateProdResources"
            }
        }
    }
    ```

## Transform

* Specifies one or more macros that CF uses to process the template
* Macros are executed in order of declaration
* When you create a change set, CF generates a change set including the processed template content, which you can then review before execution.
* Also supports `AWS::Serverless` and `AWS::Include` transforms
    * `Serverless` - specifies the version of SAM to use
    * `Include` works with template snippets that are stored separately from the main CF template
* To declare multiple macros, use a list format
* Example that evaluates a custom macro and then serverless macro

    ```json
    {
        "AWSTemplateFormatVersion": "2010-09-09",
        "Transform": [ "MyMacro", "AWS::Serverless" ],
        "Resources": {
            "WaitCondition": {
                "Type": "AWS::CloudFormation::WaitCondition"
            },
            "MyBucket": {
                "Type": "AWS::S3::Bucket",
                "Properties": {
                    "BucketName": "MyBucket",
                    "Tags": [{"key": "value"}],
                    "CorsConfiguration": []
                }
            },
            "MyEc2Instance": {
                "Type": "AWS::EC2::Instance",
                "Properties": {
                    "ImageId": "ami-123"
                }
            }
        }
    }
    ```

### AWS::Include Transform

* Lets you create a reference to a template snippet in an S3 bucket
* No special permissions required to use it
* You can use the include transform anywhere in a template except in the parameters section or the version field
* Syntax at the top level of a template:

    ```json
    {
        "Transform": {
            "Name": "AWS::Include",
            "Parameters": {
                "Location": "s3://my_bucket_name/my_file.json"
            }
        }
    }
    ```

* Syntax when the transform is embedded in a section of a template

    ```json
    {
        "Fn::Transform": {
            "Name": "AWS::Include",
            "Parameters": {
                "Location": "s3://my_bucket_name/my_file.json"
            }
        }
    }
    ```

* When using, keep the following in mind:
    * Currently supports S3 URI format, but no other S3 format
    * Anyone with access to the S3 URL can include the snippet
    * Must be valid YAML or JSON file
    * Must be valid k/v objects, like `"KeyName": "keyValue"`
    * If the snippets change, the stack doesn't auto-update, so you have to update teh stack explicitly
    * Check the change set before update to verify your changes
    * You can mix YAML and JSON via includes
    * No current support for shorthand notations for YAML snippets
    * You can give a cross-region repllication S3 URI with include

## Resources

* Declares the AWS resources you want in the stack
* Pseudo-template:

    ```json
    "Resources": {
        "Logical Id": {
            "Type": "Resource type",
            "Properties": {
                set of properties
            }
        }
    }
    ```

### Fields

* Logical id must be unique in the template, and alphanumeric
* Reference the resource by logical name elsewhere in the template
* Some resources also have a physical id, which is the actual assigned name for that resource like an instance id or bucket name
* Use the physical id to identify resources outside of CF templates, but only after they have been created
* Resource type is a string that identifies resource type, duh
* Resources have different property types

## Outputs

* Outputs declares values you can:
    * import into other stacks (to create cross-stack references)
    * retun in response, to describe stack calls
    * or view in the console
* Syntax:

    ```json
    "Outputs": {
        "Logical id": {
            "Description": "some string",
            "Value": "value to return",
            "Export": {
                "Name": "value to export"
            }
        }
    }
    ```

### Fields

* Outputs section can include the following fields
    * Logical id (required) - identifier for current output
    * Description (optional)
    * Value (required)
    * Export (optional)
* The following restrictions apply to cross-stack references
    * for each AWS account, export names must be regionally unique
    * you can't do cross-region, cross-stack references
    * for outputs, the value of the `Name` property of an export can't use `Ref` or `GetAtt` functions that depend on a resource
    * `ImportValue` can't include `Ref` or `GetAtt` functions that depend on a resource
    * You can't delete a stack if another stack references one of its outputs
    * You can't modify or remove an output value referenced by another stack
* You can use functions to modify the Name value of an export:

    ```json
    "Export": {
        "Name": {
            "Fn::Join": [ ":", [ {"Ref": "AWS::StackName"}, "AccountVPC" ] ]
        }
    }
    ```
