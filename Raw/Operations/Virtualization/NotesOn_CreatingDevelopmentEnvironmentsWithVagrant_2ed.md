# Notes on Creating Development Environments with Vagrant, 2nd ed.

By Michael Peacock, Packt Publishing 2015, ISBN 978-1-78439-163-8

## Chapter 1: Getting Started with Vagrant

* Install VirtualBox and Vagrant.

## Chapter 2: Managing Vagrant Boxes and Projects

### Creating our first Vagrant project

* ``vagrant init`` - creates a bare bones Vagrantfile in pwd
* You can give some box options on the command line at init.
* ``vagrant up`` - attempts to start box, provision it

### Managing Vagrant-controlled guest machines

* Sequence at power-up with ``vagrant up``
    1. Checks for existing environment, revives if suspended
    1. Checks for base box image, downloads if necessary
    1. Copy the base box
    1. Create a new vm with relevant provider
    1. Forward 22 on vm to 2222 on host
    1. Forward additional configured ports
    1. Boot the vm
    1. Configure and enable networking
    1. Map shared folders between host and guest
    1. Run provisioning, if any, defined in Vagrantfile
* Commands:
    * ``vagrant suspend`` - saves state to disk, stops vm
    * ``vagrant resume`` - bring up suspended vm
    * ``vagrant halt`` - shuts down vm completely, saves state
    * ``vagrant destroy`` - erases vm, no saved state
    * ``vagrant reload`` - applies any changes to Vagrantfile since ``up`` (runs a shut down / start up cycle)
    * ``vagrant ssh`` - shell into the vm on 2222:22

### Managing integration between host and guest machines

* Port forwarding example: ``config.vm.network :forwarded_port, guest: 80, host: 8888``
* Adding ``, auto_correct: true`` will allow multiple vms to run with the same port config (by trying a different port if the one selected is in use)
* Folder syncing: ``config.vm.synced_folder "/path/on/host" "/path/on/guest"``
* Setting ``, type: "nfs"`` may have performance gains on Linux/OS X
* Networking outside host/guest: ``config.vm.network "private_network", ip: "10.11.100.200"``
* Alternately, giving an IP via local DHCP server: ``config.vm.network "private_network", type: "dhcp"``

### Autorunning commands

* Multiple provisioners available: Shell, Puppet, Ansible, Chef, Salt, Docker, CFEngine
* Running an inline command from the Vagrantfile: ``config.vm.provision "shell", inline: "sudo apt-get update"``
* Running a local script: ``config.vm.provision "shell", path: "provision.sh"``

### Managing Vagrant Boxes

* ``vagrant box`` - manage local boxes
* Subcommands:
    * ``add`` - add new box
    * ``list`` - list all boxes
    * ``outdated`` - check for updates
    * ``remove`` - remove a box from host
    * ``repackage`` - converts a Vagrant environment to a box
    * ``update`` - updates the box used by the current Vagrant env
 
### Too many Vagrants

* ``vagrant global-status`` - lists all local environments
* You can manipulate boxes via their id from that list.

## Chapter 3: Provisioning with Puppet

* Skipping.

## Chapter 4: Using Ansible

* Config files are in YAML
* Config hierarchy: playbooks have many plays, which have many tasks.
* Inventory files list hosts, alias them, group them.

### Creating ansible Playbooks

* Create a YAML file with hosts and tasks
* Run it with ``ansible-playbook test-playbook.yml -i test-inventory-file``
* Tasks run in the order defined in the playbook, excepting handler calls
* It has a bunch of modules for stuff like apt, git, service, copy, etc.
* Skipping some simple stuff about installing packages and creating files
* Example cron module task: 

```YAML
- name: Run some cron
  cron: name="web_cron" hour="1-4" minute="0,30"
        job="/usr/bin/php /vagrant/cron.php"
```

## Chapter 5: Using Chef

* Skipping.

## Chapter 6: Provisioning Vagrant Machines with Puppet, Ansible, and Chef

* Ansible is controlled on the host, so there's no install on the guest for ansible to run (unlike chef/puppet)
* Skipping the bits on Chef and Puppet

### Provisioning with Ansible on Vagrant

* Got to tell Vagrant where the playbook and inventory files are:

```Ruby
config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provision/ansible/playbook.yml"
end
```

* If you omit the inventory file, Vagrant generates one for all vms managed in the current project.
