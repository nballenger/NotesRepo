# Notes on Mastering AWS Security

By Albert Anthony, Packt Publishing, October 2017

ISBN 9781788293723

# Overview of Security in AWS

## AWS shared security responsibility model

* AWS is responsible for the security OF the cloud, the customer is responsible for security IN the cloud.
* Three broad categories of AWS service, each with its own security ownership model:
    * Infrastructure services - EC2, EBS, ELB, VPC; Client controls the OS, the firewall rules, identity management systems
    * Container services - Elastic Beanstalk, EMR, RDS; infrastructure at the OS / platform level is abstracted away; client responsible for firewall rules, user / system access via IAM
    * Abstracted services - messaging, email, nosql db, storage; platform / management layer totally abstracted; responsible for IAM

### For Infrastructure services

* EC2, VPC, EBS
* All regional services
* Managed by AWS:
    * AWS endpoints
    * Foundation services:
        * Compute
        * Storage
        * Databases
        * Networking
    * AWS global infrastructure:
        * Regions
        * AZs
        * Edge locations
    * AWS IAM
* Managed by customers:
    * Customer data
    * Platform and application management
    * OS, Network, Firewall
    * Client side data encryption and integrity authentication
    * Server side encryption
    * Network traffic protection
    * Opaque data
    * Customer IAM
* AWS EC2 allows key pair creation for instance access

### For container services

* EMR, RDS, ECS
* Client responsible for creating:
    * high availability (HA)
    * fault tolerance (FT)
    * business continuity and disaster recovery
* Managed by AWS:
    * All parts from AWS chunk of infrastructure services 
    * Operating system and network config
    * Platform and application management
* Managed by customer:
    * Customer data
    * Client side data encryption and data integrity authentication
    * Network traffic protection
    * Firewall config
    * Customer IAM

### For abstracted services

* DynamoDB, SQS, S3
* You are responsible for classifying your data and using service specific tools for configuring permissions at the platform level for individual resources
* IAM gives permissions based on role, user identity, user groups
* S3 can encrypt data at rest, can encapsulate data in transit via HTTPS and signed API requests
* Customer responsible for:
    * Customer content
    * Opaque data in flight / at rest
    * Client side data encryption and data integrity authentication

## AWS Security responsibilities

* Security areas that are always AWS's responsiblity:
    * AWS foundation services: Compute, Storage, Database, Network
    * AWS Global Infrastructure: Region, AZ, Edge Locations
* That includes physical and environmental security
* Storage device decommissioning is secure
* There are geographic regions (just 'regions' in AWS terms) all around the world
* Each region has two or more Availability Zones (AZs) for HA/FT
* AZs are made up of one or more data centers, governed by SLAs
* All foundation services are deployed in N+1 configuration
* Each AZ is an independent failure zone, physically separated within the region
* You may need to design applications to be distributed across multiple regions
* There is a Service Health Dashboard at `https://status.aws.amazon.com`
* You can purchase support plans at basic, dev, business, and enterprise levels
* Those define your level of support interaction
* NACLs are enforced on all managed interfaces; ACL policies are approved by AWS security; ACL management tools help keep them current/strong
* In-/out-bound network traffic is monitored at API endpoints by AWS
* Transit security is by signed API calls and SSL, plus VPC and VPN
* AWS monitors network security thoroughly
* The production network is logically segregated from the Amazon corporate network

## Customer security responsibilities

* As you move from infrastructure services to abstracted services, the customer is responsible for less and less security
* All IaaS services are completely under customer control
* Customer is always responsible for IAM, MFA
* High level classification of security responsibilities for AWS/customer:
    * AWS: Facility ops, physical security, physical infrastructure, network infrastructure, virtualization infrastructure, hardware lifecycle management
    * Customer: choice of guest OS, configuring application options, AWS account management, firewall / security group config, ACL, IAM

## AWS account security features

* The 'root account' is what you create when you first sign up
* It has credentials for logging into the AWS management console
* Has admin access for all AWS services
* Not recommended to use the root account for day to day interactions with AWS
* Create users with specific privileges, possibly use separate AWS accounts for orgs with different business units, etc.
* Scenarios for choosing strategies for AWS account creation:
    * Need: Centralized security management
        * Use one AWS account
        * Centralizes the infosec management, has minimal overhead
    * Need: Separation of prod, dev, test
        * Use three AWS accounts
        * One account per environment
    * Need: Multiple, autonomous departments
        * Use multiple AWS accounts
        * One account per autonomous department
    * Need: Centralized security mgmt with multiple autonomous independent projects
        * Use multiple AWS accounts
        * Create one account for shared project resources like DNS, user database, etc.
        * Create one AWS account for each autonomous project, grant perms on a granular level
* Using multiple accounts decreases blast radius, gives good least privilege
* AWS creds for authentication and authorization:
    * passwords
    * MFA
    * Access keys
    * Key pairs
    * X.509 certs
* The IAM service allows creating/managing individual users in an account
* The IAM users are global to the account
* IAM users can access resources via CLI, SDK, API, or management console
* API endpoints are secured via HTTPS
* Logging is important for auditing, governance, compliance
* AWS CloudTrail logs all events in an account if enabled
* Events can be sent to CloudWatch, other log analysis tool
* AWS Trusted Advisor customer support service gives best practices / checks across:
    * Cost optimization
    * Fault tolerance
    * Security
    * Performance
* Security checks include unrestricted ports, IAM use, MFA on root account
* More available at business or enterprise level support, including
    * security groups with unrestricted access
    * S3 buckets permissions
    * AWS cloudtrail logging
    * Exposed access keys
* AWS Config is a monitoring and assessment service that records changes in the config of AWS resources
* Config rules can run continuous assessment checks on resources to make sure they comply with policies

## AWS Security services

* IAM allows access control for AWS resources and users
* Provides authentication and authorization for accessing resources
* VPC is an IaaS that provides an isolated cloud space
* Key Management System (KMS) helps manage keys for encryption
* AWS Shield protects web apps running on AWS from DDoS
* Web Application Firewall (WAF) is a configurable firewall for web apps, allows traffic filtering; it's a managed service, can be configured by management console or API
* CloudTrail is a logging service for API requests
* CloudWatch is a monitoring service that provides metrics, alarms, dashboards for all AWS service, integrates with other services like AutoScaling, ELB, SNS, Lambda for automating response for crossing a metric threshold
* AWS Config lets you audit / evaluate your AWS resource configs for policy compliance
* AWS Artifact gives you compliance related documents
* You can conduct pen testing for your EC2 and RDS instances, though you must submit a request to AWS first

## AWS Security resources

* AWS has docs, white papers, case studies, a youtube channel, blogs, external partners, a marketplace with various resources for security in each

# AWS Identity and Access Management

* IAM provides control for who can take what actions on what resources in AWS
* IAM manages users (identities) and permissions (access control) for all AWS resources
* Lets you grant, segregate, monitor, and manage access for multiple users
* Integrates with CloudTrail so you can do audit trails

## IAM Features and Tools

* IAM is:
    * Free
    * PCI-DSS compliant
    * Eventually consistent
    * Integrated with AWS services at a very granular level
* IAM follows least permissions by default (new users have no perms)
* IAM allows shared access to a single root account without credential sharing
* IAM has identity federation with Active Directory, Google, etc.
* If you want an entity to access resources temporarily, and you don't want to create or manage creds for them, you can use IAM Roles
* Roles can be assumed by identities, creds for roles are managed by IAM, rotated multiple times a day
* You can access IAM via the management console, CLI, SDKs, or the API

## IAM Authentication

* Includes the following identities:
    * Users
    * Groups
    * Roles
    * Temporary security credentials
    * Account root user
* Identities provide authentication and authorization for people, applications, resources, services, and processes

### IAM user

* A user identity is created to allow management console or CLI / API access
* IAM users can be a person, app, or AWS service
* When you create a user, you provide a name/pw, up to two access keys
* Perms for a user must be added directly or by adding the user to a group
* Group assignment is the best practice
* For every user there are three identification options:
    * There is a name you give on create
    * Every user has an ARN
    * Every user has a unique identifier not visible in the management console, though available through the API / CLI tools
* Users are global entities (not region specific)

### IAM groups

* Groups and users are many to many
* Groups can't nest, can't have security creds, can't access services

### IAM roles

* Recommended over user by AWS
* Not necessarily associated with a single entity, can be assumed by any resource that needs it
* Creds for roles are managed by AWS
* Four types of IAM role:
    * Service role - when another AWS service needs to perform actions on your behalf
    * AWS SAML role - a SAML 2.0 provider, for identity federation
    * Roles for cross-account access - two scenarios: a) enabling access between multiple AWS accounts, b) enabling access to your AWS account by resources in other AWS accounts not owned by you
    * Role for Web Identity Provider - to provide access to resources using web identity providers like Facebook, Amazon, etc. Uses OpenID Connect (OIDC). OIDC authenticated users are assigned an IAM role and temporary creds to access AWS resources
* If you use an identity provider, it must be either OpenID Connect or SAML 2.0 compatible
* AWS recommends that for most scenarios, Amazon Cognito should be used instead of web identity federation
* Via delegation you can grant perms to users in another AWS account for resources in your AWS account
* That involves 'trusted' and 'trusting' accounts, which can be any of:
    * the same account
    * two accounts under your control
    * two accounts under separate control
* To delegate, you create an IAM role with two policies, a permissions policy and a trust policy
    * The permissions policy defines resource access
    * The trust policy defines the trusted account(s)
* Trust policies can't have wildcards (*) as a principal
* A user using a trust policy role temporarily gives up their own permissions and takes on those of the role

### Temporary security credentials

* You can use AWS Security Token Service (STS) to create temp security creds
* Use these instead of persistent ones if possible, since they're more secure
* Similar to access key credentials, except for:
    * their TTL is 15 minutes to 36 hours, default 1 hour
    * Unlike keys, they are not stored with the user; they're dynamically generated, provided to the user on request, following the principle of last minute credential
* Advantages of temporary creds:
    * No distribution or embedding of long term AWS Security credentials in apps
    * Can provide access to AWS resources without creating users
    * Are the basis for roles and identity federation
    * Have a limited lifetime, not reusable after expiration, so no rotation or expiration work is necessary on your part
* STS is a web service for requesting temporary, limited privilege creds for IAM or federated users that you authenticate
* STS is a global service at `https://sts.amazonaws.com`, which is in us-east-1. You can use STS in other regions if you need to
* STS supports CloudTrail
* Activating STS for a region enables the STS endpoints in that region to issue temp creds for users and roles in your account
* STS is free, you are only charged for resource usage by auth'd users

### The account root user

* Root user has complete access to all AWS services for the account
* Do not use the root user for everyday tasks
* Use it to create an IAM user and use that one for all additonal admin tasks
* Root user should be reserved for tasks that require it, like:
    * changing root account information
    * updating payment information
    * updating support plan
    * closing the AWS account

## IAM Authorization

### Permissions

* Permissions grant access to / actions on AWS resources
* Permissions can be assigned to all AWS identities (users, groups, roles)
* Permissions can be:
    * identity-based - specific to AWS identities, can be managed or inline
    * resource-based - assigned to AWS resources, inline only
* Some services let you specify permissions for actions like list, read, write
* Some services support resource based permissions (EC2, VPC, etc)
* There are six IAM permission types that are evaluated for integration with each AWS service:
    * action-level perms - service supports specifying individual actions in a policy's action element; if not supported, policies for the service use the wildcard (*) in the `Action` element
    * resource-level perms - service has 1+ APIs supporting specifying individual resources (by ARN) in the policy's resource elemnt. If not supported, uses * in the `Resource` element
    * resource-based perms - service enables you to attach policies to teh service's resources, in additon to IAM identities. Policies specify who can access that resource by including a `Principal` element
    * tag-based perms - service supports testing resource tags in a condition element
    * temp security creds - service lets users make requests via STS tokens
    * service-linked roles - service requires that you use a unique type of service role linked directly to the service; role is preconfigured and has all perms required to carry out the task

### Policy

* A policy is a JSON doc that lists permissions as statements
* Written according to IAM policy language
* Can have 1+ statements, with each statement describing one set of perms
* Policies can attach to any IAM identities
* Each policy has its own ARN, is an IAM entity
* A policy has three main components:
    * actions - what actions you allow for an AWS service; each service has its own set of actions
    * resources - what resources actions can be performed on; by default no resources are defined in a policy
    * effect - what the effect is when a user is going to request access; can be allow or deny; by default resources are denied
* The policy `Statement` element is the most important, and is required
* `Statement` can include multiple elements, can have nesting; contains an array of individual statements in braces
* The `Effect` element is also required, specifies allow or deny
* `Principal` element defines the user, which can be an IAM user, federated user, role using user, any AWS account, any AWS service, or any other AWS entity 
* `Principal` should not be used when creating policies attached to IAM users or groups, or in an access policy for a role
* You can specify more than one user as `Principal` in a comma delimited list in the json (of ARNs)
* The `Action` element defines an action or multiple actions that are to be allowed or denied
* The statements must include either `Action` or `NotAction` elements, and those should be one of the action the AWS service has, like `"Action": "ec2:Describe"`
* The `Resource` element describes an AWS resource the statement covers, all statements must have a `Resource` or `NotResource` element
* The `Condition` element or block lets you provide conditions for a policy
    * supports boolean operators to match the condition against the request
    * condition values can be stuff like date, time, IP, ARN, etc.
    * on requests, conditions are evaluated, return true or false
* Policies can be categorized into 2 broad categories:
    * Managed Policies - standalone policies that can be attached to IAM identities; cannot be applied to resources; recommended over inline policies; two types of managed policies:
        * AWS managed policies - recommended, cover most use cases
        * customer managed policies - created and managed by you, used to cover cases not supported by AWS managed policies
    * Inline Policies - policies created and managed by you, embedded directly into a principal entity like a user, group, or role; not reusable; if the entity is deleted the policy is also deleted; normally created when there is a 1:1 relation between a policy and an entity
* There is a Policy Simulator tool in the console that helps troubleshoot policy creation and management; can also be simulated in the CLI and API
* There's also a Policy Validator to fix non-compliant IAM policies; only checks the JSON grammar and syntax, does not check ARNs or condition keys
* There's an Access Advisor that tells you what access a user has been using
* You can set a passwords policy

## AWS credentials

* Multiple cred types:
    * email / password - creds for the root user; use to create another user
    * IAM username / password - for users in your AWS account
    * MFA - additonal security layer
    * Access keys (access key id and secret access key) - used to sign requests through SDKs or the API
    * Key pairs - public / private key pairs, used only for EC2 and CloudFront
    * AWS account identifiers - every account has two unique ids: AWS account id and a canonical user id; AWS id is a 12 digit number used in ARN building; canonical user id is a long strong, normally used for cross-account access
    * X.509 certs - security device that carries a public key, binds that key to an identity

## IAM Limitations

* Names of IAM identities and resources can be alphanumeric, plus `+ = , . @ _ -`
* Names of IAM identities must be unique in the account
* account ID aliases must be unique across AWS products in your account, cannot be a twelve digit number
* Limit of 100 groups per AWS account
* Limit of 5000 users in an account, use temp creds
* 500 roles per account
* An IAM user can be in up to 10 groups
* An IAM user can have up to 2 access keys
* 1000 customer managed policies per account
* max 10 managed policies attached to an IAM entity
* max 20 server certs per account
* 100 SAML providers per account
* Policy name capped at 128 chars
* Alias for account id must be 3-63 chars
* username / role name capped at 64 chars
* group name capped at 128 chars

## IAM best practices

* Lock your root account keys, rotate them
* Do not share credentials
* Use managed policies
* Use groups to manage users
* Follow least privilege
* Review IAM perms periodically
* Enforce strong passwords
* Enable MFA
* Use roles for applications
* Use roles for delegation
* Rotate credentials
* Use policy conditions
* Monitor account activity

# Virtual Private Cloud

# Data Security in AWS

## Encryption / decryption fundamentals

* Three required components for encryption:
    * Data to encrypt
    * Algorithm for encryption
    * Encryption keys to be used with data and algorithm
* Two types of encryption:
    * symmetric - uses same secret key to encrypt and decrypt
    * assymetric - public/private key crypto
* AWS uses only assymetric encryption
* AWS uses envelope encryption, which has the following steps:
    1. AWS service doing the encrypting generates a data key
    1. data key is used to encrypt data along with the algorithm
    1. data key is itself encrypted using the key-encrypting key unique to the AWS service used to store the data
    1. encrypted data and encrypted data key are stored in the storage service

## Securing data at rest

* S3 options for protection:
    * bucket level and object level permissions in addition to IAM policies
    * object level versioning to prevent bad object deletion / modification
    * Versioning is disabled by default
    * each object is replicated across all AZs in the region, and has a cross-region replication feature
    * server side encryption
    * client side encryption (where you manage the keys and submit encrypted data to s3)
* EBS (block storage service) options:
    * each volume replicated within its AZ
    * you should replicate at the app level for data recovery
    * has volume snapshots
    * data in EBS volumes can be encrypted by AWS native functions like KMS
* RDS options:
    * Allows encryption of data for EBS volumes and snapshots
    * Has automated backups for instances
* Glacier:
    * AES-256 encryption for each glacier archive
    * by default all data encrypted server side
* DynamoDB options:
    * can be used without additonal protection
    * can impelemtn a data encryption layer over the service
    * to store encrypted data, best to use raw binary fields or Base64 strings
* EMR options:
    * AWS only AMIs, no EBS vols or custom AMIs
    * automatically sets up EC2 firewall settings
    * EMR clusters are launched in a VPC
    * By default do not encrypt data at rest, typically use S3 or Dynamo for persistent data

## Securing data in transit

* Services all use SSL/TLS and IPSec
* IPSec extends the IP stack so that apps on the upper layers can communicate securely; SSL/TLS functions at the session layer

## AWS KMS

* KMS is a managed service to support encryption for data at rest and in transit
* Lets you create and manage keys that are used for encryption
* Low cost, since default keys are stored at no charge--you pay for creating additonal master keys

### KMS components

* There is a Customer Master Key (CMK) that's used to protect your data keys
* For every service that integrates with KMS, AWS has a CMK that is managed by AWS, which is unique to your account and region
* Data keys are used to encrypt your data, and are managed by you. KMS does not store, manage, or track your data keys
* You can set key policies for accessing CMK, though key policies for AWS managed CMKs cannot be edited
* KMS integrates with CloudTrail for an audit trail of key usage
* KMS provides a secure Key Management Infrastructure (KMI), which scales automatically because KMS is a managed service

## AWS CloudHSM

* CloudHSM is a cloud based, dedicated, single-tenant HSM for secure key storage
* It's a hardware device, running in your VPC

## Amazon Macie

* Security service with some AI, uses ML to identify, categorize, and secure sensitive data in S3 buckets
* Uses templated lambda functions to send alerts, revoke unauthorized access, reset password policies
* Lets you discover and classify sensitive data and analyze usage patterns

# Securing Applications in AWS

## AWS Web Application Firewall (WAF)

* Lets you define rules as conditions and ACLs
* Protects against stuff like XSS, DDoS, SQL injection
* WAF lets you perform three behaviors:
    * allowing all requests other than those in ACLs
    * blocking all other than ACLs
    * counting all requests that are allowable via ACLs
* You can use WAF to secure websites hosted outside AWS
* Integrated with CloudWatch and CloudTrail
* Benefits of WAF:
    * protection against web attacks via IP blocking, blocking query strings
    * integration with other AWS services
    * easy to deploy
    * pretty good metrics and dashboards for web traffic
    * cheaper than DIY firewalling

### Working with AWS WAF

* Start by creating conditions that match malicious traffic
* Combine conditions as rules
* Combine rules as ACLs
* Associate rules with AWS resources like load balancers or cloudfront web distributions
* Conditions can be based around:
    * XSS
    * geo match
    * IP addresses
    * size constraints
    * SQL injection
    * string and regex matching
* Rules combine conditions to allow, block, or count requests
* Two types of rules
    * regular rules - made by combining conditions only
    * rate based rules - like regular rules but with a rate limit
* Web ACLs - rules combined forms a web ACL

## Signing AWS API requests

## Amazon Cognito

## Amazon API Gateway

# Monitoring in AWS
