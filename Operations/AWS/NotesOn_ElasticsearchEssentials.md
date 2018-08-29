# Notes on Elasticsearch Essentials

By Bharvi Dixit, Packt Publishing 2016, ISBN 978-1-78439-101-0

## Chapter 1: Getting Started with Elasticsearch

### Introducing Elasticsearch

#### The primary features of Elasticsearch

* Elasticsearch is built on top of Lucene, giving it an HTTP/JSON API
* Has these main features:
    * Distributed, scales horizontally
    * High Availability, can automatically create data redundancy
    * REST-based, for both CRUD and cluster monitoring
    * Powerful query DSL, JSON interface
    * Schemaless

#### Elasticsearch common terms

* Node - single instance of elasticsearch
* Cluster - multiple connected instances
* Document - json object containing data in KV pairs
* Index - logical namespace for data storage
* Doc types - class of similar documents
* Shard - Containers that can be stored on a single node or multiple nodes; index is divided into one or more shards; Shards can be primary or secondary, primary has data change operations, secondary duplicates
* Replica - dupe of the data in a shard for HA

#### Understanding Elasticsearch structure with respect to relational databases

* Can be used as a NoSQL db
* An index is similar to a db consisting of multiple types
* A row is a document, and columns are fields
* No referential integrity constraints
* Does have some relationships among documents
* Requirements to install and run:
    * Oracle Java 1.7u55 and above
    * 2G memory
    * Root perms
* Most common error is incompatible java version
* Make sure the correct one is set to `JAVA_HOME`

### Installing and Configuring Elasticsearch

* Book uses version 2.0.0

#### Installing on Ubuntu via Debian

```
wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-2.0.0.deb
sudo dpkg -i elasticsearch-2.0.0.deb
sudo update-rc.d elasticsearch defaults 95 10
```

#### On CentOS via RPM

```
wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-2.0.0.rpm
sudo rpm -i elasticsearch-2.0.0.rpm
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch.service
```

#### Installation directory layout

* On Ubuntu:
    * home: `/usr/share/elasticsearch`
    * jar files: `/usr/share/elasticsearch/lib`
    * contains plugins: `/usr/share/elasticsearch/plugins`
    * binary scripts to start an ES node and download plugins: `/usr/share/elasticsearch/bin`
    * configuration files: `/etc/elasticsearch`
    * data files of the index/shard on the node: `/var/lib/elasticsearch/data`
    * startup script with env vars: `/etc/init.d/elasticsearch`
    * log files: `/var/log/elasticsearch`
* RHEL/CentOS:
    * home: `/usr/share/elasticsearch`
    * jar files: `/usr/share/elasticsearch/lib`
    * contains plugins: `/usr/share/elasticsearch/plugins`
    * binary scripts: `/usr/share/elasticsearch/bin`
    * config files: `/etc/elasticsearch`
    * data files: `/var/lib/elasticsearch/data`
    * startup script: `/etc/sysconfig/elasticsearch` or `/etc/init.d/elasticsearch`
    * log files: `/var/log/elasticsearch`
* User and group named `elasticsearch` created during install
* Does not auto start after install
* You should change the cluster name before running it for the first time

#### Configuring Basic Parameters

* Edit `/etc/elasticsearch/elasticsearch.yml`:
    * `cluster.name` - name of your cluster
    * `node.name` - name of the node
    * `path.data` - path for the data
    * `path.logs`, `path.plugins` - logs/plugins
* If you use a non-standard data path, `chown` it to `elasticsearch`
* Start it up: `sudo service elasticsearch start`
* Starts on two ports:
    * 9200 - HTTP connections
    * 9300 - TCP connection through a java client, node interconnections
* Check startup: `sudo service elasticsearch status`
* Possible issues:
    * java problem
    * formatting problem in config file
    * insufficient memory
    * incompatibly owned data dir
    * ports not free

#### Adding another node to the cluster

* Follow above steps on a different node
* Make sure `cluster.name` is the same on both
* Both systems should be reachable by each other on the same network
* There is no firewall rule set to block Elasticsearch ports
* Elasticsearch and Java versions are the same on both nodes
* Optionally set `network.host` to the IP you want ES bound to

#### Installing Elasticsearch Plugins

* Two main types of plugins:
    * site plugins - plugins with a web app in them, and no java content; after install they're moved to the site directory and can be accessed with `es_ip:port/_plugin/plugin_name`
    * Java plugins - mostly `.jar` files, extend ES functionality
* Ships with a plugin script in `/usr/share/elasticsearch/bin`
* Plugins installed with `bin/plugin --install plugin_url`
* You must restart the node to activate a plugin
* To check for installed plugins, look at the startup log output, or use `curl -X GET 'localhost:9200/_nodes/plugins'?pretty`
* Or via browser at `http://localhost:9200/_nodes/plugins`
* Installing the Head plugin:
    * It's a web front end for the cluster
    * Installed with `sudo /usr/share/elasticsearch/bin/plugin -install mobz/elasticsearch-head; sudo service elasticsearch restart`
* Installing Sense:
    * great query tool, can be added as a browser extension locally

### Basic Operations with Elasticsearch

* By default ES creates five shards and one replica for each shard (five primary and five replica shards)
* That's settable in config via `index.number_of_shards` and `index.number_of_replicas`, or at index creation time
* Once an index is created, shards cannot be increased or decreased, though replicas can.

#### Creating an index

* To create an index with five shards and one replica: `curl -XPUT 'localhost:9200/books`
* Note that index names cannot have white space or UC letters

#### Indexing a document

* Every doc has a unique `_id`
* You can provide it or it will be generated for you
* Example document create: `curl -X PUT localhost:9200/books/elasticsearch/1 -d '{"json":"document"
