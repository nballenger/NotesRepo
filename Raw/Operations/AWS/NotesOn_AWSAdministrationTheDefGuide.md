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

* Different from traditional networking, in that most cloud providers only allow unicast datagrams on their networks
* If applications require broadcast capabilities over a network for service discovery, that may not necessarily fit on a public cloud.
* Each instance in EC2 gets two unique IP addresses, a private and a public
* When you launch an instance AWS gies it a private IP via internal DHCP
* Instances in the same network can use their private IPs to communicate
* You cannot use the private IP with the outside world
* You also get an internal DNS hostname for your instance
* AWS maps the public IP to the private IP using simple NAT
* You can control the instance's IP address depending on whether it's a standard EC2 instance or inside a VPC
* A VPC allows you to control subnets that can be private or public
* You can also give instances more than one private and public IP via VPC
* Instances in a VPC do not release their private IP back to the general pool when stopped

#### Determining an instance's IP addresses

* Get it from the console or
* run `curl http://169.254.169.254/latest/meta-data/local-ipv4` from inside the instance, which hits a link-local address used by ec2 to distribute metadata
* To get the public IP, hit `/latest/meta-data/public-ipv4`

#### Working with Elastic IP addresses

* if you need an IP to be associated with an instance even when it is powered off, you need to use an elastic IP address (EIP)
* EIPs are public IPs allocated to an account, not instances
* You get up to 5 by default
* Can be reassigned to a different running instance dynamically and when needed

### Understanding EBS volumes

* EBS volumes are block level storage devices that can be attached to EC2 instances
* Persist independent of instances
* Features/benefits:
    * high availability - automatically replicated within their AZ
    * one EBS volume cannot be attached to multiple instances at once
    * can be encrypted
    * State can be snapshotted at any point, and those are stored in S3

#### EBS Volume types

* General purpose (SSD) - standard 3 IOPS per GB of storage. Usable for instance root volumes, data disks for dev and test envs, database storage, etc.
* Provisioned IOPS volumes (SSD) - specialized set of SSDs that can consistently provide a minimum of 100 IOPS, burstable to 20k IOPS. Useful for apps that are IO intensive like databases, parallel computing workloads, etc.
* Magnetic volumes - infrequent data access, so log storage, data backup, etc.

#### Getting started with EBS volumes

* Create one, wait for it to be available, attach it to an instance
* You can determine the device name, though `/dev/sda1` is reserved for the root device volume
* You can list devices on your instance with `sudo df -h`
* `sudo fdisk -l` will list partitions
* Once you verify the name of the added device, you can format it with something like `sudo mkfs -t ext4 /dev/xvdf`
* Mount the volume to a directory: `sudo mkdir /my-dir;sudo mount /dev/xvdf /my-dir`
* Edit the `fstab` file and add the volume's mount info there
* To detach, use `sudo umount /dev/sdf`

#### Managing EBS volumes with the aws cli

```
aws ec2 create-volume \
--size 5 --region us-west-2 \
--availability-zone us-west-2a \
--volume-type gp2
```

* `--volume-type` takes one of three values: `gp2` for general purpose, `io1` for provisioned iops, `standard` for magnetic
* Once it's available:

```
aws ec2 attach-volume \
--volume-id vol-123456789 \
--instance-id i-DEADBEEF \
--device /dev/sdg
```

* Do some stuff with the volume
* Unmount the volume with `unmount /dev/sdg` on the instance
* Detach from your workstation:

```
aws ec2 detach-volume \
--volume-id vol-123456789

aws ec2 delete-volume \
--volume-id vol-123456789
```

#### Backing up volumes using EBS snapshots

* Snapshots can be used to:
    * create new volumes based on existing ones
    * expand existing volumes
    * share volumes
    * backup and disaster recovery

### Planning your next steps

* After creating an AMI, try launching a new instance from it
* Once the instance launches, check that it has the right root partition name and size as allocated
* Try copying the AMI to a different region
* Try that with an EBS volume
* Read about EBS-optimized instances, which are specially created instances with dedicated throughput and IOPS for performance-intensive applications
* Read the EBS performance tips provided by AWS
* Look into free public datasets that AWS hosts free of charge
* That's here: http://aws.amazon.com/public-data-sets/

### Recommendations and Best Practices

* Create and use IAM policies and allow only a particular set of users to access EBS volumes
* Create and take periodic snapshots of your volumes
* Provide suitable names and descriptions for snapshots for identifying later
* Take snapshots at times of low application load
* Clean up old or unused snapshots to save money
* Encrypt EBS volumes that have sensitive data
* Select and use the correct type of EBS volume for your application's needs

## Chapter 5: Building Your Own Private Clouds using Amazon VPC

### An overview of Amazon VPC

* VPC is a logically isolated part of the AWS cloud that enables you to build and use your own logical subnets and networks
* You get to build your own network topology and spin up instances in it
* You can create multiple private subnets within a single VPC
* They have Network access control lists (ACLs) in addition to standard use of security groups
* Also allow for Virtual Private Gateway to connect an on-premise datacenter to the cloud

#### VPC concepts and terminologies

* **Subnets**
    * Just a range of valid IP addresses you specify
    * Gives you two subnet creation options: public and private
    * When you create a VPC you provide it with a set of addresses in the form of a CIDR, something like `10.0.0.0/16`, which gives you 65k addresses (2^(32-16)), which ranges from `10.0.0.0` to `10.0.255.255`
    * Once the VPC's CIDR is created, you can carve out individual subnets within it, such as `10.0.1.0/24` for web servers, `10.0.5.0/24` for db servers, etc.
    * A `/24` block has 256 ip addresses
    * CIDR is "classless inter-domain routing"
    * By default AWS will create a VPC for you in your region when you first sign up
    * Called the "default VPC", and is preconfigured with:
        * a CIDR of `/16`
        * A default subnet in each AZ of your region
        * An internet gateway so instances have internet connectivity
        * Some necessary route tables, security groups, ACLs
* **Security groups and network ACLs**
    * Security groups are sets of firewall rules
    * Max of 100 security groups for a single VPC
    * Each security group can have up to 50 rules
    * Remember that a security group does not permit ingress by default
    * Network ACLs are an additional security measure over security groups
    * Network ACLs are subnet specific rather than instance specific
    * ACL rules can allow and restrict inbound and outbound traffic
    * Each ACL rule is evaluated by AWS based on a number, which can be from 100 to 32,766. Rules are evaluated in sequence from smallest to largest.
    * You should include a rule number `*` in any ACL list, to drop packets matching no rule
* **Routing Tables**
    * Simple rules/routes to direct network traffic from a subnet
    * Each subnet in a VPC has to be associated with a single route table at any given time
    * Multiple subnets can be attached to a single route table
    * A default route table is created when an account is created
    * It's called the "main route table" and generally has only one route that allows traffic to flow within the VPC
    * Subnets not assigned to any route table are automatically associated with the main route table
    * You can add and edit routes in the main route table, but you cannot modify the local route rule
* **VPC endpoints**
    * Allow you to securely connect a VPC with other AWS services
    * Scaled and managed by AWS itself
    * Create a VPC endpoint and the instances in that VPC can securely talk to other AWS services
    * Currently only supported for S3
    * When you create an endpoint, you need to select either of the VPC's route tables
    * Also allow you to create endpoint policies, which are just IAM based resource policies that are provided when an endpoint is created. 
* **Internet Gateways**
    * Gives internet connectivity to VPC instances
    * Create and add an internet gateway device to a VPC and then add a route entry in the public subnet's route table to point to it
    * Default VPC has an internet gateway already deployed in it
    * Any instance in the default VPC will have internet access
* **NAT Instances**
    * Internet Gateways NAT the IP addresses of instances in the public subnet so that they can communicate with the internet, but that doesn't cover those in private subnets
    * Those need internet connectivity without having direct access via the gateway
    * A NAT instance is created inside a public subnet that NATs outbound traffic from instances in a private subnet to the internet
    * The NAT instance will only forward outbound traffic, and will not allow any traffic from the internet to reach private subnets
    * NAT instances can be created from any AMI, though AWS provides some standard linux AMIs suited to it
    * Listed in the community amis page, under `amzn-ami-vpc-nat*`
    * Essential to correctly populate the security group of a NAT instance
* **DNS and DHCP option sets**
    * DHCP option sets let you set and customize DNS and DHCP for your instances
    * Default VPC comes with a default DHCP options set used to provide instances with dynamic private IP addresses and a resolvable hostname
    * You can list up to four DNS servers here. The amazon DNS server is provided in your VPC and runs on a reserved IP
    * The Amazon DNS server is `169.254.169.253` or `AmazonProvidedDNS`
    * Values added to that are automatically added to `/etc/resolv.conf`
    * You can provide your own domain name or the default that AWS gives
    * Default names can be provided only if you have selected `AmazonProvidedDNS` as your DNS server
    * NTP servers - can list up to four, but only IPs, not FQDNs
    * NetBIOS name server - up to four
    * NetBIOS node type - can be 1, 2, 4, or 8. AWS advises 2 as broadcast

#### VPC limits and costs

* VPC is free of cost, though you do have to pay for the EC2 resources
* YOu can have a max of five VPCs per region
* Each VPC can have only one internet gateway and one virtual private gateway
* Each VPC has a limit of 200 subnets

### Working with VPCs

#### VPC deployment scenarios

* There are four scenarios:
    * VPC with a single public subnet - simplest, has a single public subnet with a default internet gateway attached. Ideal for small scaled web applications or simple websites not requiring separate app or subnet tiers
    * VPC with public and private subnets (NAT) - most common, gives you a public and a private subnet, public connected to an IG, private with no access to the outside world. Also provisioins a single NAT instance inside the public subnet for private instances to connect to the outside world. Ideal for large scale web applications with public and non-public server types.
    * VPC with public and private subnets and hardware VPN access - adds a Virtual Private Gateway to connect on-premise networking gateway to the cloud
    * VPC with a private subnet only and hardware VPN access - basically a cloud extension of a private data center
    
### Best practices and recommendations

* Plan and design the VPC before implementing it
* Choose the network block allocation wisely--don't go with `/16` if you can get away with `/18` or `/20`
* Always plan and have a set of spare IP address capacity
* Recall you cannot edit a network block's size once it is created for a VPC
* Use different security groups to secure and manage traffic flows from your instances--for instance, an SG for web servers and a different one for database servers
* Leverage multiple AZs to distribute your subnets across geographies. Ideally yyou'd divide your VPC's network block and create subnets in each of your region's AZs
* Leverage IAM to secure your VPC at the user level; create dedicated users with restricted access to the VPC and resources
* Create and stick with a standard naming convention so that your VPC's resources can be identified and tagged.
