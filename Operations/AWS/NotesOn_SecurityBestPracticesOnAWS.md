# Notes on Security Best Practices on AWS

By Albert Anthony; Packt Publishing, March 2018

ISBN 9781789134513

# 1. AWS Virtual Private Cloud

* VPC is an isolated/secure virtual network where you provision your AWS infrastructure.
* By default resources inside a VPC are not accessible from the internet unless you allow it through firewalls.
* Getting the VPC right is critical for having a "secure, fault-tolerant, and scalable architecture."
* A VPC spans AWS regions.
* Regions have two or more availability zones (AZs). 

## VPC Components

* **Subnets**
    * Cannot span AZs.
    * Can be public or private.
    * Are used to separate resources within an AZ.
* **Elastic Network Interfaces (ENI)**
    * Available for EC2 instances in a VPC.
    * Can have IP and MAC addresses, security groups, etc.
    * By default, every VPC has a network interface for every instance on eth0 (primary network interface).
    * The primary network interface can't be detached from its instance, but you can attach additional ENIs to an instance.
* **Route Tables**
    * Has rules/routes defined for flow of traffic into/out of the VPC
    * Every VPC has a default (main) route table
    * Each subnet is associated with only one route table, though one route table can be attached to multiple subnets.
* **Internet Gateway**
    * Allows communication between resources inside the VPC and out on the internet
    * A VPC does not need more than one internet gateway
    * Serves as target for the route table for all traffic going out of the VPC to the internet
    * Does network address translation for all instances with public IP addresses
* **Elastic IP Addresses**
    * Static, public IPv4 address that can be associated with any one instance or one network interface at a time.
* **VPC Endpoints**
    * Secure way to communicate with other AWS services without using the internet, Direct Connect, VPN, or a NAT device
    * Endpoints only supported for S3 at present
* **Network Address Translation (NAT)**
    * For resources in private subnets that need occasional access to the internet or other AWS services
* **VPC Peering**
    * VPCs in the same region can be connected by peering
    * Allows communications over private IP addresses as though the instances are in the same network

## VPC Features and Benefits

* **Multiple Connectivity Options**
* **Secure**
    * Security groups act as instance-level firewalls
    * Network ACLS act as subnet-level firewalls
    * VPC endpoints keep S3 buckets internal to your VPC
* **Simple**

## VPC Use Cases

* Hosting a Public Facing Website
    * Create a public subnet with the VPC wizard
    * Select `VPC with a single public subnet only` option
    * Secured with instance-level firewalls (security groups)
    * Allow inbound traffic, restrict outbound traffic
* Hosting Multi-Tier Web Application
    * One public subnet with web server and app server, since they need inbound and outbound internet traffic
    * One private subnet for DB servers and background jobs
    * Public subnet has one NAT instance for routing traffic for the db instance in the private subnet
    * Select `VPC with Public and Private Subnets` option
* Creating Branch Office and Business Unit Networks
    * When branch offices need their own interconnected networks
    * Create separate subnet for each branch office
    * Use SGs to limit communication across subnets
* Hosting Web Applications in the AWS Cloud connected to a data center
    * When instances in one subnet have inbound/outbound internet access, and another subnet talks exclusively to a corporate datacenter
    * You create an IPsec hardware VPN connection
    * Select `VPC with Public and Private Subnets and Hardware VPN access`
* Extending Corporate Network in AWS Cloud
* Disaster Recovery

## VPC Security

* **Security Groups**
    * An SG is a virtual firewall at the instance level
    * Each VPC has its own default SG, can have up to 5 SGs
    * New SGs by default allow no inbound, all outbound
    * An ENI can be associated with up to 5 SGs
* Network Access Control List
    * The NACL is another virtual firewall at the subnet level
    * For creating guardrails in your org, since it's not granular
    * Every VPC has a default NACL that allows all traffic
    * Have both allow and deny rules
    * A subnet can be attached to only one NACL
    * One NACL may be attached to multiple subnets
    * Make rule numbers in increments of 100
* VPC Flow Logs
    * Need to monitor inbound / outbound traffic
    * You can monitor at the VPC or subnet level
* VPC Access Control
    * You need to define access control for the VPC
    * Users, applications, other AWS services need permissions

## Creating VPC

* Going to create a custom VPC using IPv4 classless inter-domain routing (CIDR)
* Has one public subnet and one public facing instance; one private subnet, one instance in the private subnet
* Has SGs, NACL to allow inbound/outbound traffic and routes to support the following scenario:
    1. Create VPC with a /16 IPv4 CIDR block `10.0.0.0/16`
    1. Create an internet gateway and attach to the VPC
    1. Create a public subnet with /24 block `10.0.0.0/24`
    1. Create a private subnet with /24 block `10.0.1.0/24`
    1. Create a route table, route for all traffic to the internet through the internet gateway; add to public subnet
    1. Create a NAT gateway, attach to public subnet; Allocate elastic IP, associate with the NAT
    1. Create a route for traffic to the internet to go through the NAT; associate with the private subnet
    1. Create NACL for each subnet; create rules to define inbound/outbound traffic access for the subnets, associate with the subnets
    1. Create SGs for instances to put in the public and private subnets, assign with instances
    1. Create one instance per subnet, assign SG to each; Instance in the public should have a public IP or EIP address
    1. Verify that the public instance can access the internet and private instances can access the internet through the NAT

## VPC Limits

| Resource | Default Limit |
| ---- | ---- |
| VPCs / region | 5 |
| Subnets / VPC | 200 |
| Elastic IPs / region | 5 |
| Flow logs / resource in a region | 2 |
| Customer gateways / region | 50 |
| Internet gateways / region | 5 |
| NAT gateways / AZ | 5 |
| Virtual private gateways / region | 5 |
| NACLs / VPC | 200 |
| Rules / NACL | 20 |
| Network interfaces / region | 350 |
| Route tables / VPC | 200 |
| Routes / route table | 50 |
| SGs / VPC per region | 500 |
| Rules / SG | 50 |
| SGs / network interface | 5 |
| Active VPC peering connections / VPC | 50 |
| VPC endpoints / region | 20 |
| VPN connections / region | 50 |
| VPN connections / VPC per virtual private gateway | 10 |

## VPC Best Practices

* **Plan a VPC before creating it**
    * Create an objective for the VPC
    * Spec out all subnets
    * Determine availability / fault tolerance requirements
    * Determine connectivity options
* **Choose the highest CIDR block**
    * Once created with a CIDR block, a VPC can't change it
    * Can have a block ranging from /16 to /28
    * Always choose the highest CIDR block available
* **Unique IP address range**
    * You need non-overlapping IP ranges
    * Take note of all needs before assigning ranges
* **Leave the default VPC alone**
    * Start with a custom VPC, ignoring the default per region
    * If a subnet is not associated with a route table or NACL, it is associated with the main route table and default NACL, which have no restrictions on traffic.
    * Don't modify the main route table either. Create a custom one.
* **Design for region expansion**
    * Reserve some IP addresses for future expansion
    * Note that AWS reserves five IPs in each subnet for internal use
* **Tier your subnets**
    * Subnets should reflect architecture tiers (db tier, app tier, business tier, etc) based on their routing needs
    * Make multiple subnets in as many AZs as possible to improve fault tolerance
    * Each AZ should have identically sized subnets, each subnet should use a routing table designed for them depending on their routing need
* **Follow least privilege principle**
* **Keep most resources in the private subnet**
    * If you have instances that need to communicate with the internet, you should add an elastic load balancer in the public subnet and add all instances behind the ELB in the private subnet
    * Use NAT devices to access public networks from your private subnet. NAT gateway is preferred over a NAT instance.
* **Creating VPCs for different use cases**
    * Ideally you want one VPC each for dev, test, and prod
* **Favor security groups over NACLs**
    * NACLs are guiderails, SGs are more granular
    * NACLs should be used sparingly, not changed often
* **IAM your VPC**
    * Use IAM roles for instances, to provide granular access
    * Assign management permissions for the VPC following least privileges
    * Use the access advisor function in IAM to find out whether perms are being used as expected
    * Create an IAM VPC admin group to manage the VPC and its resources
* **Using VPC peering**
    * Use peering whenever possible
* **Using Elastic IP instead of Public IP**
    * Always use EIP instead of public IP for resources that need to connect to the internet
    * EIPs are associated with an AWS account instead of an instance, and can be assigned to an instance in any state, and persists without an instance
    * An EIP can be reassigned and move to Elastic Network Interface
* **Tagging in VPC**
    * Always tag resources in a VPC
    * Make tagging strategy part of your planning phase
    * Tag resources immediately after creating them
    * Common tags are things like version, owner, team, project code, cost center, etc.
* **Monitoring a VPC**
    * Enable CloudTrail and VPC flow logs
    * Connect logs and rules with CloudWatch to notify you of unexpected behavior

