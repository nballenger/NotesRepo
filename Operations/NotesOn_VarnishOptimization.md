# Notes on Varnish Optimization

Options to `varnishd` that relate:

* `-h` - hash algorithm
    * `simple_list` - doubly linked list, not recommended for prod
    * `classic[,buckets]` - standard hash table, default, buckets param sets number of entries in the hash table, default is 16383
    * `critbit` - self scaling tree structure
* `-l shmlogsize` - size of shmlog file, don't specify less tham 8mb
* `-p param=value` - set run time parameter
* `-s [name=]type[,options]` - storage backend, may be given multiple times to specify multiple storage files. You can name different backends, varnish will then reference that backend with the given name in logs, stats, etc.
* `-t ttl` - hard min ttl for cached documents, shortcut to specifying default_ttl run time param
* `-w min[,max[,timeout]]` - start at least min but no more than max worker threads with specified idle timeout. If one number is given, min/max are set to that number and timeout has no effect

Storage types:

* `malloc[,size]`
