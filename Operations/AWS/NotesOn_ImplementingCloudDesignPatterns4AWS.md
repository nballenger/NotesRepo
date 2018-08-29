# Notes on Implementing Cloud Design Patterns for AWS

By Marcus Young, Packt Publishing 2015, ISBN 978-1-78217-735-7

## Chapter 1: Introduction

## Chapter 2: Basic Patterns

* Most rudimentary set of patterns for cloud infrastructure
* Not AWS specific, though the rest of the book is
* Chapter uses the AMI "Amazon Linux AMI"
* AWS's backup service for drives is snapshotting

### Introducing Vagrant

* Install vagrant, then do `vagrant plugin install vagrant-aws`
* You have to create a dummy box for it to use an AMI that's not accessible locally
* Do `vagrant box add dummy`
* Contents of the Vagrantfile:

### Snapshot pattern

* Create a snapshot of an EBS.

### Stamp pattern

* Package your own base AMI by changing an existing AMI and creating an image based on it.

### Scale up pattern

* Change the type of a running instance to scale vertically.

### Scale out pattern

* Create an ELB
* Create a launch configuration for a new instance
* Create an ASG with alarms and scaling policies

### On-demand disk pattern

* Resize a volume by detaching and changing its parameters, then reattach.

## Chapter 3: Patterns for High Availability

### Multi-server pattern

* Use a load balancer to front for servers that are scaling horizontally.
