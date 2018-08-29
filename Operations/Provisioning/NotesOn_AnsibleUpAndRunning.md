# Notes on "Ansible: Up and Running"

By Lorin Hochstein, O'Reilly Media, 2015

## Executive Summary

## Chapter Summaries

### Chapter 1: Introduction

#### A note about versions

* At writing, Ansible is at 1.8, 1.9 in active dev.
* Name is from Le Guin's FTL communication system, also in Ender's Game

#### Ansible, what is it good for?

* Configuration management tool, same category as chef, puppet, salt
* Can also be used for deployment, like capistrano and fabric
* Ansible is also good at orchestrating multiple remote servers during deployment
* And can do provisioning locally and in most cloud environments

#### How Ansible works

* Example of an ansible script called ``webservers.yml``
* Scripts are called 'playbooks' in Ansible terms
* A playbook describes which remote servers to configure, and a list of tasks for those hosts
* Tasks might be stuff like:
    * install nginx
    * generate nginx config file
    * copy over ssl cert
    * start nginx service
* Playbook executed with ``$ ansible-playbook webservers.yml``
* Ansible makes parallel ssh connections to all remote hosts, executes first task on all hosts simultaneously
* Process is: generate python script to do work, copy to hosts, run, wait for completion on all hosts, move to next task
* Important:
    * tasks are run in parallel across all hosts
    * it waits for all tasks to complete before moving on
    * runs tasks in the order specified

#### What's so great about Ansible

* **Easy-to-read syntax** &mdash; It's YAML, which author calls 'executable documentation'
* **Nothing to install on remote hosts** &mdash; server only needs ssh and Python 2.5+, or Python 2.4 with ``simplejson`` lib. Control machine needs Python 2.6+
* **Push-based** &mdash; You change a playbook, run it, and ansible does all server connections. Nodes never have to check in, there's no timers running.
* **Ansible scales down** &mdash; doing one node is comparable to many nodes
* **Built-in modules** &mdash; Ships with modules for common tasks like installing packages, managing services, etc. Modules are declarative, you use them to describe the state you want to reach. They're also idempotent.
* **Very thin layer of abstraction** &mdash; Doesn't do a master 'pkg' module with abstraction over yum vs. apt. You have to do that stuff explicitly.

#### Is Ansible too simple?

* Not just a loop over shell scripts, can do idempotence, templating, scoped variables.
* Uses ssh multiplexing to optimize performance, can run thousands of nodes.

#### What do I need to know?

* At least one linux distro
* Skillz:
    * ssh to a remote
    * command line IO
    * installing packages
    * using ``sudo``
    * manage file permissions
    * manage services
    * work with environment vars
    * write scripts in some language
* Might have to learn YAML and Jinja2 (templating languages)

#### What isn't covered

* Non-exhaustive coverage, just an up and running guide
* Doesn't cover all official modules in detail
* Only covers basic features of Jinja2 templating
* Doesn't cover Windows support
* Doesn't cover Ansible Tower, a web gui for managing Ansible
* Doesn't cover stuff specific to older versions of linux

#### Installing Ansible

* Consider homebrew for os x, or just ``sudo pip install ansible``
* You can do it in a virtualenv
* You can clone the project source if you want the dev version

#### Setting up a server for testing

* Make a vagrant box
* Get the connection details with ``vagrant ssh-config``
* Create a file, ``inventory``, with the following:

```
testserver ansible_ssh_host=127.0.0.1 ansible_ssh_port=2222
ansible_ssh_user=vagrant
ansible_ssh_private_key_file=/path/to/keyfile
```

* Test the connection with ``$ ansible testserver -i inventory -m ping``
* Create an ``ansible.cfg`` file:

```
[defaults]
hostfile = inventory
remote_user = vagrant
private_key_file = /path/to/keyfile
```

* Checking uptime of server after making config: ``ansible testserver -m command -a uptime``
* Using -s to force it to sudo: ``ansible testserver -s -a "tail /var/log/syslog"``
* Installing nginx: ``ansible testserver -s -m apt -a name=nginx``
* Restarting nginx service: ``ansible testserver -s -m service -a "name=nginx state=restarted"``

### Chapter 2: Playbooks, a beginning

#### Some preliminaries

* Need to expose 80 and 443 before running the playbook in this chapter
* Modify Vagrantfile to include the following, and run ``vagrant reload``

```
config.vm.network "forwarded_port", guest: 80, host: 8080
config.vm.network "forwarded_port", guest: 443, host: 8443
```

* Generate a self-signed cert in ``playbook/files``:

```
mkdir files
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout files/nginx.key -out files/nginx.crt
```

* In interactive part, tell it the FQDN is ``locahost``

#### A very simple playbook

* Configures a host to run an Nginx web server, sans SSL
* ``web-nossl.yml``:

<pre>
- name: Configure webserver with nginx
  hosts: webservers
  sudo: True
  tasks:
    - name: install nginx
      apt: name=nginx update_cache=yes
    - name: copy nginx config file
      copy: src=files/nginx.conf dest=/etc/nginx/sites-available/default
    - name: enable configuration
      file: >
        dest=/etc/nginx/sites-enabled/default
        src=/etc/nginx/sites-available/default
        state=link
    - name: copy index.html
      copy: src=files/index.html dest=/usr/share/nginx/html/index.html mode=0644
    - name: restart nginx
      service: name=nginx state=restarted
</pre>

* Note about YAML truthy values:
    * Truthy: ``true True TRUE yes Yes YES on On ON y Y``
    * Falsey: ``false False FALSE no No NO off Off OFF n N``
* Module args have different truthy values:
    * Truthy: ``yes on 1 true``
    * Falsey: ``no off 0 false``
* Giving an Nginx config file in ``playbooks/files/nginx.conf``

```
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html;
    index index.html index.htm;

    server_name localhost;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

* Creating a custom homepage, via ``playbooks/files/index.html``

```
<html>
  <head>
    <title>Ansible Nginx</title>
  </head>
  <body>
    <h1>It worked.</h1>
  </body>
</html>
```

* Creating a webservers group in the inventory file:

```
[webservers]
testserver ansible_ssh_host=127.0.0.1 ansible_ssh_port=2222
```

* Running a ping against the group: ``$ ansible webservers -m ping``

#### Running the playbook

* ``ansible-playbook playbook-name.yml`` executes playbooks
* If it runs with no errors, you should be able to hit 8080 on localhost

#### Playbooks are YAML

* YAML files start with ``---``
* Comments start with a hash mark
* Strings may be quoted but don't have to be
* Boolean truth values referenced above
* YAML lists (technically 'sequences') are like arrays, are delimited with hyphens
* Inline lists are in brackets, comma delimited
* YAML dictionaries ('mappings') are ``key: value``
* Inline dictionaries are in braces, comma delimited
* Multiple line statements are broken with ``>``
* Returns from multi-line when indent stops:

```
somekey: >
    value line one
    value line two
    value line three
someotherkey: value
```

#### Anatomy of a playbook

* A playbook is a list of dictionaries, or 'plays'
* Every play must have a set of hosts to configure, and a set of tasks to execute
* Optionally a play may have a name, boolean sudo arg, and a list of vars
* Tasks must be at least a key with the name of the module, and a value with the module arguments
* Tasks can optionally have a name
* If you want to do multi-line module arguments, you have to use folding syntax:

```
- name: install nginx
  apt: >
      name=nginx
      update_cache=yes
```

* Modules are: scripts packaged with ansible that perform an action on a host
* Summary:
    * A Playbook has one or more plays
    * A Play associates an unordered set of hosts with an ordered list of tasks
    * Each Task is associated with exactly one module

### Did anything change? Tracking host state

* All tasks can potentially change host state
* Prior to running a task, Ansible checks to see if the host needs state change
* State change detection can be used to trigger actions via handlers

### Getting Fancier: SSL support

* Adding: variables, templates, handlers
* Playbook ``web-ssl.yml``

```
#!/usr/bin/env ansible-playbook
---
- name: Configure webserver with nginx and ssl
  hosts: webservers
  sudo: True
  vars:
    key_file: /etc/nginx/ssl/nginx.key
    cert_file: /etc/nginx/ssl/nginx.crt
    conf_file: /etc/nginx/sites-available/default
    server_name: localhost
  tasks:
    - name: Install nginx
      apt: name=nginx update_cache=yes cache_valid_time=3600
    - name: create directories for ssl certficates
      file: path=/etc/nginx/ssl state=directory
    - name: copy SSL key
      copy: src=files/nginx.key dest={{ key_file }} owner=root mode=0600
      notify: restart nginx
    - name: copy SSL certificate
      copy: src=files/nginx.crt dest={{ cert_file }}
      notify: restart nginx
    - name: copy nginx config file
      template: src=templates/nginx.conf.j2 dest={{ conf_file }}
      notify: restart nginx
    - name: enable configuration
      file: dest=/etc/nginx/sites-enabled/default src={{ conf_file }} state=link
      notify: restart nginx
    - name: copy index.html
      copy: src=files/index.html dest=/usr/share/nginx/html/index.html mode=0644
  handlers:
    - name: restart nginx
      service: name=nginx state=restarted
```

* Variables declared in vars section, referenced with ``{{ varname }}``
* You must quote a variable reference if it appears as the first thing after a module declaration, or ansible will interpret it as the start of an inline dictionary.
* Files are templated with Jinja2 template engine
* Example, in ``templates/nginx.conf.j2``

```
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    listen 443 ssl;

    root /usr/share/nginx/html;
    index index.html index.htm;

    server_name {{ server_name }};
    ssl_certificate {{ cert_file }};
    ssl_certificate_key {{ key_file }};

    location / {
        try_files $uri $uri/ =404;
    }
}
```

* Variables used are those defined in the playbook
* You can use all Jinja2 features in your templates
* Handlers are declared in the handlers section
* Tasks can contain a ``notify`` key with a handler name
* A task will fire the notification if ansible recognizes the task has triggered a state change on the host
* In this case ansible will restart nginx if anything notifies that handler
* Handlers only run after all tasks are run
* Handlers only run once, even with multiple notifications
* Handlers run in the order they appear in the play, not notification order
* Author has only used them for restarting services
* Potential failure case:
    * run a playbook, task A notifies handler Z
    * task B fails, ansible never runs handlers
    * on re-run, task A doesn't trigger a state change, doesn't notify
    * handler never runs period, because triggered handler ever got to execute
* You can work around that with ``--force-handlers`` flag to ``ansible-playbook`` on rerun of the playbook


### Chapter 3: Inventory: describing your servers

#### The inventory file

* Hosts are described in inventory files, which are plain text
* Simplest inventory might just be a list of hostnames
* Localhost is always added by default, even with a blank inventory file

#### Preliminaries: Multiple Vagrant VMs

* Need multiple hosts to talk about inventory
* Configuring Vagrant to bring up three hosts:

```
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "vagrant1" do |vagrant1|
    vagrant1.vm.box = "ubuntu/trusty64"
    vagrant1.vm.network "forwarded_port", guest: 80, host: 8080
    vagrant1.vm.network "forwarded_port", guest: 443, host: 8443
  end
  config.vm.define "vagrant2" do |vagrant2|
    vagrant2.vm.box = "ubuntu/trusty64"
    vagrant2.vm.network "forwarded_port", guest: 80, host: 8080
    vagrant2.vm.network "forwarded_port", guest: 443, host: 8443
  end
  config.vm.define "vagrant3" do |vagrant3|
    vagrant3.vm.box = "ubuntu/trusty64"
    vagrant3.vm.network "forwarded_port", guest: 80, host: 8080
    vagrant3.vm.network "forwarded_port", guest: 443, host: 8443
  end
end
```

* Creating an inventory file for these three machines means getting the port number for each one with ``vagrant ssh-config``
* Then creating a file like:

```
Host vagrant1
    HostName 127.0.0.1
    User vagrant
    Port 2222
    UserKnownHostsFile /dev/null
    StrictHostKeyChecking no
    PasswordAuthentication no
    IdentityFile /path/to/identity/file
    IdentitiesOnly yes
    LogLevel FATAL

Host vagrant2
    HostName 127.0.0.1
    User vagrant
    Port 2200
    [...]

Host vagrant3
    HostName 127.0.0.1
    User vagrant
    Port 2201
    [...]
```

* And modifying the inventory file:

```
vagrant1 ansible_ssh_host=127.0.0.1 ansible_ssh_port=2222
vagrant2 ansible_ssh_host=127.0.0.1 ansible_ssh_port=2200
vagrant3 ansible_ssh_host=127.0.0.1 ansible_ssh_port=2201
```

#### Behavioral inventory parameters

* To override behavioral defaults for a host, you can use 'behavioral inventory parameters':
    * ``ansible_ssh_host`` - name of host to ssh to
    * ``ansible_ssh_port`` - defaults to 22
    * ``ansible_ssh_user`` - defaults to root
    * ``ansible_ssh_pass`` - no default
    * ``ansible_connection`` - defaults to smart choice
    * ``ansible_ssh_private_key_file`` - no default, path to key file
    * ``ansible_shell_type`` - defaults to ``sh``
    * ``ansible_python_interpreter`` - defaults to /usr/bin/python
    * ``ansible_*_interpreter`` - for other languages
* You can change the behavioral parameter default values in the ``[defaults]`` section of ``ansible.cfg``

#### Groups and groups and groups

* Generally want to perform commands on groups of hosts
* Auto defined group called 'all' or '*' that's all hosts in inventory
* Check for clock syncronization: ``ansible all -a "date"`` or ``ansible '*' -a "date"``
* You can define groups in the inventory file, which uses .ini syntax
* List all hosts at the top, with options
* List groups in brackets followed by hostnames one per line
* Groups of groups are given with ``[groupname:children]``
* You can also use alphanumeric ranges with ``web[1:20].example.com``

```
alpha.example.com ansible_ssh_port=2222
bravo.example.com
charlie.example.com
delta.example.com
echo.example.com
foxtrot.example.com
web1.example.com
web2.example.com
web03.example.com
web04.example.com
web-a.example.com
web-b.example.com

[apps]
alpha.example.com
charlie.example.com

[data]
bravo.example.com
foxtrot.example.com

[servers:children]
apps
data

[web]
web[1-2].example.com
web[03-04].example.com
web-[a-b].example.com
```

#### Hosts and group variables, inside the inventory

* You can pass arbitrary variable key/value pairs, which can then be used in a playbook
* You can also associate variables with groups with ``[groupname:vars]``

```
newhampshire.example.com color=red foo=bar

[production:vars]
db_primary_host=rhodeisland.example.com
color=green
```

#### Host and group variables, in their own files

* Ansible variables can hold booleans, strings, lists, and dictionaries
* You can only specify booleans and strings, though you can use YAML dictionaries
* You can create YAML files for each host and each group, for variables
* Host variable files will be in ``host_vars/``
* Group variables will be in ``group_vars/``
* The files will be named for the host they are for
* You can also define, for instance, ``group_vars/production/`` as a directory instead of a file

#### Adding entries at runtime with add_host and group_by

* You can add hosts and groups to the inventory during the execution of a playbook
* The ``add_host`` module adds a host to the inventory
* Invocation is ``add_host: name=hostname groups=foo,bar,baz myvar=myval``
* ``group_by`` creates ad-hoc groups

```YAML
- name: Provision a vagrant machine
  hosts: localhost
  vars:
    box: trusty64
  tasks:
    - name: create a Vagrantfile
      command: vagrant init {{ box }} creates=Vagrantfile
    - name: Bring up a vagrant server
      command: vagrant up
    - name: add the Vagrant hosts to the inventory
      add_host: >
            name=vagrant
            ansible_ssh_host=127.0.0.1
            ansible_ssh_port=2222
            ansible_ssh_user=vagrant
            ansible_ssh_private_key_file=/path/to/keyfile

- name: Do something to the vagrant machine
  hosts: vagrant
  sudo: yes
  tasks:
    # list of tasks here

- name: group hosts by distribution
  hosts: myhosts
  gather_facts: True
  tasks:
    - name: create groups based on distro
      group_by: key={{ ansible_distribution }}

- name: do something to Ubuntu hosts
  hosts: Ubuntu
  tasks:
    - name: install htop
      apt: name=htop

- name: do something else to CentOS hosts
  hosts: CentOS
  tasks:
    - name: install htop
      yum: name=htop
```

### Dynamic inventory

* If you have an external system tracking hosts (like ec2), you can get host info out
* If an inventory file is executable, Ansible assumes it's a dynamic inventory script
* Dynamic inventory scripts need to be able to list all groups, and details of hosts
* Ansible will call script with ``--list``
* Output should be signle JSON object where names are group names, values are arrays of host names
* To get details of the individual host, Ansible will call script with ``--host=vagrant2``
* Output should be any host specific vars and behavioral params as key value JSON object
* Example script:

```Python
#!/usr/bin/env python

import argparse
import json
import paramiko
import subprocess
import sys


def parse_args():
    parser = argparse.ArgumentParser(description="Vagrant inventory script")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--list', action='store_true')
    group.add_argument('--host')
    return parser.parse_args()

def list_running_hosts():
    cmd = "vagrant status --machine-readable"
    status = subprocess.check_output(cmd.split()).rstrip()
    hosts = []
    for line in status.split('\n'):
        (_, host, key, value) = line.split(',')
        if key == 'state' and value == 'running':
            hosts.append(host)
    return hosts

def get_host_details(host):
    cmd = "vagrant ssh-config {}".format(host)
    p = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
    config = paramiko.SSHConfig()
    config.parse(p.stdout)
    c = config.lookup(host)
    return {'ansible_ssh_host': c['hostname'],
            'ansible_ssh_port': c['port'],
            'ansible_ssh_user': c['user'],
            'ansible_ssh_private_key_file': c['identityfile'][0]}


def main():
    args = parse_args()
    if args.list:
        hosts = list_running_hosts()
        json.dump({'vagrant': hosts}, sys.stdout)
    else:
        details = get_host_details(args.host)
        json.dump(details, sys.stdout)

if __name__ == '__main__':
    main()
```

### Breaking out the inventory into multiple files

* Put all your inventory files (dynamic and static) in a directory
* Configure Ansible to use that directory as the inventory
* If you had ``inventory/hosts`` and ``inventory/vagrant.py``, your ``ansible.cfg`` would have:

```
[defaults]
hostfile = inventory
```


## Chapter 4: Introducing Mezzanine, our test application

* Chapter works through a complete example
* Example is deploying a CMS built on Django

### Why deploying to production is complicated

* Everything you need to run the app in dev mode:

```
pip install mezzanine
mezzanine-project myproject
cd myproject
python manage.py createdb
python manage.py runserver
```


## Chapter 5: Deploying Mezzanine with Ansible

* Chapter walks through a playbook that deploys mezzanine to a server
