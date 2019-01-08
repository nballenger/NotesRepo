# Notes on Designing AWS Environments

By Wayde Gilchrist, Mitesh Soni; Packt Publishing, Sept. 2018; ISBN 9781789535549

# Chapter: Networking on AWS

* Main topics:
    * CIDR notation
    * Private, public, and elastic IP addresses
    * Subnets
    * Route Tables

## CIDR

* CIDR - "Classless Inter-Domain Routing"

### IPv4

* IPv4 addresses are 32 bits, in four dot separated bytes
* CIDR lets you specify a range of IP addresses by appending a slash and a number of fixed bits, 0 to 32, after the address
* For a single IP, you need all 32 bits, so you would use `xxx.xxx.xxx.xxx/32`
* A range has a number of fixed bits, so `111.222.333.000/24` means the first three bytes are fixed, so it refers to any ip where the first three bytes are `111.222.333`
* A /24 gives you 256 addresses
* A /16 gives you 65,536

### Valid private IP address ranges

* For a VPC you need to specify private IP blocks
* IANA reserves specific IP ranges for private IPs:
    * `10.0.0.0` to `10.255.255.255`, equivalent to `10.0.0.0/8`
    * `172.16.0.0` to `172.31.255.255`, 
    * `192.168.0.0` to `192.168.255.255`, equivalent to `192.168.0.0/16`
* Every VPC needs at least one subnet
* Every subnet in AWS reserves 5 addresses for AWS use, first four and last one:
    * `10.0.0.0` - network address
    * `10.0.0.1` - vpc router
    * `10.0.0.2` - reserved by AWS
    * `10.0.0.3` - reserved by AWS for future use
    * `10.0.0.255` - network broadcast address

### EC2 IP addressing

* Private IP addresses
    * Every instance in a VPC must be inside a subnet
    * A random IP from the private range is assigned to the instance automatically
    * If you want an instance to be reachable from the internet you need a publicly routable IP assigned to the instance's Elastic Network Interface
* Public IP addresses
    * You can choose to have an instance use an actual public IP
    * If you do so and then shut your instance down, you lose that IP and get a new one on restart
* Elastic IP addresses
    * An elastic IP is independent of the instance life cycle
    * An EIP is a resource in the account, not a sub-resource of an instance
    * You are charged per hour if you keep EIPs and are not using them
* Elastic Network Interface (ENI)
    * Every instance has one or more ENIs attached
    * IP addresses are actually assigned to those
    * They're virtual network cards
    * Each instance has an ENI designated `eth0`, attached by default, which is hte primary ENI
    * IPs at launch are assigned to the primary ENI
    * The primary ENI cannot be detached from the instance
    * You can create additional ENIs and attach them to the instance
    * Only one Elastic IP per instance is free
    * Security groups are associated with an ENI, and not an instance
    * Each ENI has a unique MAC address
    * ENIs have a 'source destination check flag', which blocks network traffic not destined for the associated instance. Disable thta if you want the instance to do NAT work, routing, or be a firewall

## Subnets and Route Tables

* Components that are important in an amazon VPC:
    * VPC
    * VPC subnet
    * route table
    * elastic IP
    * internet gateway

### What are subnets?

* Separate portions of a VPC
* EC2 instances must launch into a subnet, so every VPC must have at least one subnet
* To create a subnet you have to define a CIDR block for it, which is a subset of the VPC CIDR

### Route tables

* For instances to communicate, there has to be a route for network traffic to take
* A route is a destination (a CIDR block) and a target, which defines the path to take
* A route that allows communications to all instances in the local network of the VPC:
    
        10.0.0.0/16         local

* To talk to instances in another VPC, you could define a VPC peer connection, and give the peer connection ID as the target
* To access the internet, you could define an internet gateway as a target
* Every VPC will have a default route table with a single local route for internal comms
* You cannot remove the default route table, but you can add routes to it
* You can create additional route tables and associate them with your subnets, to create public and private subnets
* Each subnet may have one and only one route table; multiple subnets can use a single route table

### Difference between public and private subnets

* A public subnet is used for instances that need a public IP to be internet accessible
* The way you make it a public subnet is to associate a custom route table and add a route to the internet, by making an internet gateway the target
* The internet is defined `0.0.0.0/0` in CIDR
* Private subnets are for instances that don't need to be publicly reachable
* Even though private instances don't need to be reachable, they probably need a way to send outbound traffic
* For that you configure an instance in a public subnet to do network address translation (NAT)

### NAT instance

* A NAT instance will forward outbound requests for private instances to the internet, and route the responses back to the originating instance
* So in a setup like this, you have:
    * An internet gateway
    * A VPC, which contains
        * A public subnet, which contains
            * Public instances
            * A NAT gateway
        * A private subnet, which contains
            * Private instances
* And route tables like:
    * Public
        * `10.0.0.0/24 --> local`
        * `0.0.0.0/0 --> internet gateway`
    * Private
        * `10.0.0.0/24 --> local`
        * `0.0.0.0/0 --> NAT gateway`
