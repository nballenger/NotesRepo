# Notes on AWS AMI Documentation

## Amazon Machine Images (AMI)

From [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)

* Provides the info required to launch an instance.
* Includes the following:
    * One or more EBS snapshots OR, for instance-store-backed AMIs, a template for the root volume of the instance
    * Launch permissions that control which AWS accounts can use the AMI to launch instances
    * A block device mapping that specifies the volumes to attach to the instance on launch

### Using an AMI

* AMI lifecycle: Create, Register, Launch/Copy/Deregister

### Creating Your Own AMI

* You can create an AMI from an instance of another AMI
* How you do that depends on the type of root storage for the instance: EBS volume or instance store volume

## AMI Types

* You can select an AMI based on the following:
    * Region
    * OS
    * Architecture (32 or 64 bit)
    * Launch permissions
    * Storage for the root device
* Launch permissions
    * The owner of an AMI determines its availability via launch permissions
    * Categories of launch permissions:
        * public - owner grants launch permissions to all AWS accounts
        * explicit - owner grants launch permissions to specific AWS accounts
        * implicit - owner has implicit launch permissions for an AMI
* Storage for the root device
    * All AMIs are backed by EBS or backed by instance store
    * EBS store root devices are EBS volumes created from EBS snapshots
    * Instance stores are an instance store volume created from a template in S3
    * Overall you probably want to go with EBS backed
    * By default, EBS-backed instance root volumes have `DeleteOnTermination` set to true.

## Virtualization Types

* Linux AMIs use one of two types of virtualization
    * Paravirtual (PV)
    * Hardware virtual machine (HVM)
* Recommendation is to use current generation instance types and HVM AMIs
* HVM AMIs
    * Presented with a fully virtualized set of hardware
    * Boot by executing the master boot record of the root block device
    * Lets you run an OS directly on top of a virtual machine with no modification, as if running on the bare metal hardware
    * HVM guests can take advantage of hardware extensions that provide fast access to the underlying hardware of the host system.

## Creating an Amazon EBS-Backed Linux AMI
