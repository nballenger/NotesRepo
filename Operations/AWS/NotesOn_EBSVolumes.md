# Notes on EBS Documentation

From [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html)

# Overview Page

* Volumes are block level storage, behave like raw, unformatted block devices
* An instance may have multiple mounted volumes, but each volume may only be mounted to a single instance at a time.
* They are highly available and reliable
* May be attached to any running instance in the same AZ
* Recommended when data must be quickly available and have long term persistence

## Features of EBS

* Volumes are created in a specific AZ, attachable to any instance in the AZ
* To make it available outside the AZ, snapshot it, restore the snapshot to a new volume in another AZ in that Region
* You may copy snapshots to other regions and use them to create new volumes
* Volume types:
    * General purpose SSD (gp2) - base performance of 3 IOPS/GiB, with burst to 3000 IOPS for extended periods. Useful as
        * boot volumes
        * small and medium sized databases
        * development and test environments
    * Provisioned IOPS SSD volumes - up to 64,000 IOPS and 1000 MiB/s of throughput
    * Throughput Optimized HDD - low cost magnetic storage with performance defined by throughput rather than IOPS. Useful for
        * Large, sequential workloads like EMR, ETL, data warehouses, log processing
    * Cold HDD volumes - low cost magnetic storage for throughput. Useful for
        * Large, sequential, cold-data workloads.
        * Inexpensive block storage for infrequently accessed data
* You can create EBS volumes as encrypted
* You can create point in time snapshots of EBS volumes that persist to S3
* Same snapshot can instantiate any number of volumes
* Snapshots may be copied across regions
* Performance metrics available via the console and CloudWatch

# Amazon EBS Volumes

From [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumes.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumes.html)

## Benefits of EBS Volumes

* Data availability
    * An EBS volume within an AZ is automatically replicated in that zone to prevent data loss due to failure of any hardware component
* Data persistence
    * Off-instance storage, persists independently of the instance
    * Can auto detach from the instance with data intact if you uncheck 'Delete on Termination' in their configuration
    * By default root volumes are deleted
* Data encryption
    * You can create encrypted EBS volumes
* Snapshots
    * You can snapshot any EBS volume and write a copy of the data in the volume to S3, where it is stored redundantly across AZs
    * Only the size of the actual data is put into S3
* Flexibility - supports live config changes in production. You can change volume type, size, and IOPS capacity without service interruption

# EBS Volume Types

* Two main types
    * SSD-backed - optimized for transactional workloads with frequent read/write, and small I/O size, where the dominant performance attribute is IOPS
    * HDD-backed - for large streaming workloads, where throughput (MiB/s) is a better performance measure than IOPS

There's a lot more here on IO credit calculating, but I don't want to read it right now.

# Size and Configuration Constraints

* Max size depends on partitioning scheme and filesystem, but the lowest is 2TiB
* Your block size also impacts the max size
* 4KiB blocks are the default

# Restoring from a snapshot

* You must know the ID of the snapshot and have access permissions for it
* There is an initialization time while the data is pulled from S3 to the new volume. You can force the immediate initialization of the entire volume with `dd` or `fio`

