# Notes on Nginx Cookbook

By Derek DeJonghe; O'Reilly Media Inc., Oct. 2020

# Chapter 1. Basics

Skipping installation and verification.

## 1.3 Installing Nginx Plus

* Get it from `https://cs.nginx.com/repo_setup`
* You'll have to install a cert to auth to the repo

## 1.5 Key Files, Directories, and Commands

* Files and directories
    * `/etc/nginx/` - default config root for Nginx
    * `/etc/nginx/nginx.conf` - default config entry point
    * `/etc/nginx/conf.d/` - directory with default HTTP server config file
        * files here ending in `.conf` are included in the top level `http` block from within `/etc/nginx/nginx.conf`
        * best practice to use `include` statements and keep individual files concise
        * sometimes named `sites-enabled`, with config files linked from a folder named `sites-available`, but that convention is deprecated
    * `/var/log/nginx/` - default log directory for nginx, with
        * `access.log` - entry per request served
        * `error.log` - entry for error events, and debug info if `debug` module is installed
* Commands
    * `nginx -h` - show help
    * `nginx -v` - show version
    * `nginx -V` - show version, build info, config args
    * `nginx -t` - test config
    * `nginx -T` - test config and print validated config to screen
    * `nginx -s signal` - sends a signal to the master process, like
        * `stop` - stops nginx process immediately
        * `quit` - stops after draining requests
        * `reload` - reloads config
        * `reopen` - reopens logfiles

## 1.6 Serving Static Content

* Example config:

    ```
    server {
        listen 80 default_server;
        server_name www.example.com;

        location / {
            root /usr/share/nginx/html;
            # alias /usr/share/nginx/html;
            index index.html index.htm;
        }
    }
    ```

* Serves static files on 80 from a specific directory
* First line defines a new `server` block, which creates a new context for Nginx to listen for
* The `default_server` param tells Nginx to use this as the default server on 80
* `listen` can take a range of ports
* `server_name` defines the hostname or names of which requests should be directed to this server
* `location` block defines a config based on the path portion of the URL
* For incoming requests, Nginx uses the best patch of the path/URI to a location block
* `root` directive tells Nginx where to look for static files when serving content for the given context
* The URI (path) of the request is appended to the value of `root` when looking for a requested file. If there was a URI prefix to the `location` directive, that would be included in the appended path unless you used `alias` rather than `root`

## 1.7 Graceful Reload

* Use `nginx -s reload` to do a graceful reload.

# Chapter 2: High Performance Load Balancing

## 2.0 Introduction

## 2.1 HTTP Load Balancing

* Problem: distributing load between two or more HTTP servers
* Solution: Use the `HTTP` module to load balance over servers using the `upstream` block
* Example config:

    ```
    upstream backend {
        server 10.10.12.45:80      weight=1;
        server app.example.com:80  weight=2;
        server spare.example.com:80  backup;
    }
    server {
        location / {
            proxy_pass http://backend;
        }
    }
    ```

* Balances across two HTTP servers on 80, defines one as a backup to use when the two primaries are unavailable
* The `weight` param tells Nginx to pass twice as many requests to the second server
* The `upstream` module controls load balancing for HTTP
* Defines a pool of destinations, which is any combination of
    * unix sockets
    * ip addresses
    * dns records
* Also defines how any particular request is assigned to a server upstream
* Each upstream destination is defined in the pool by the `server` directive
* You give `server` a socket, IP, or FQDN, and some optional parameters that control some routing behavior

## 2.2 TCP Load Balancing

* Problem: distributing load between two or more TCP servers
* Solution: use the `stream` module to load balance over TCP servers using the `upstream` block
* Example config

    ```
    stream {
        upstream mysql_read {
            server read1.example.com:3306  weight=5;
            server read2.example.com:3306;
            server 10.10.12.34:3306  backup;
        }

        server {
            listen 3306;
            proxy_pass mysql_read;
        }
    }
    ```

* The `server` block tells nginx to listen on 3306 and balance between 2 mysql read replicas, with another as backup
* Don't add this to the `conf.d` folder, since that's included in an `http` block
* Instead create `stream.conf.d/` and open the `stream` block in the `nginx.conf` file, including the new folder for stream configurations:

    ```
    user nginx;
    worker_processes auto;
    pid /run/nginx.pid;

    stream {
        include /etc/nginx/stream.conf.d/*.conf;
    }
    ```

* And put the first config chunk above into `/etc/nginx/stream.conf.d/mysql_reads.conf`

### Discussion

* Main difference between `http` and `stream` contexts is that they operate at different layers of the OSI model
    * `http` is on layer 7 (application)
    * `stream` is on layer 4 (transport)
* You could make `stream` application aware, but `http` is specifically designed to understand the HTTP protocol, whereas `stream` just routes and load balances packets
* There's a bunch of config options for `stream`, like SSL/TLS validation limitations, timeouts, keepalives, etc.
* The upstream for TCP load balancing is mostly like the upstream for HTTP
    * defines upstream resources as servers
    * configures those with socket/IP/FQDN, weight, max connections, dns resolvers, connection ramp up periods, and if the server is active, down, or in backup mode

## 2.3 UDP Load Balancing

* Also uses `stream`

## 2.4 Load-Balancing Methods

* Problem: round robin LB doesn't work for you, since you have hetergeneous workloads or server pools
* Solution: Use some LB methods like least connections, least time, generic hash, random, IP hash
* Example config

    ```
    upstream backend {
        least_conn;
        server backend.example.com;
        server backend1.example.com;
    }
    ```

* Sets the LB algorithm for the backend pool to be least connections
* All the LB algos except generic hash, random, least-time, are standalone directives like the above example

### Discussion

* Not all requests/packets carry equal weight, so round robin or even weighted round robin won't work for all applications or traffic flows.
* These are the LB methods for upstream HTTP, TCP, and UDP pools:
    * Round robin - default, distributes in order of the list of servers. May also take weights into consideration, to match the relative capacity of each upstream. Algo behind weight is the statistical probability of a weighted average.
    * Least connctions - proxies current request to the upstream with the least number of open connections. May take weights into consideration.
    * Least time - Only in NGINX Plus. Like least connections, but favors servers with the lowest average response times.
    * Generic hash - Admin defines a hash with given text, variables of the request/runtime, or both. Nginx distributes load by producing a hash for the current request and placing it against the upstream servers. Useful when you need more control over where requests are sent, or for determining which upstream server most likely has the data cached.
    * Random - selects a random server, taking weights into consideration
    * IP hash - only for HTTP. Uses the client IP address as the hash. Uses the first three octets of an IPv4 address, or an entire IPv6 address. Makes clients proxy to the same upstream server as long as that server is available.

## 2.5 - 2.8 involve Nginx Plus, skipping

## 2.9 Passive Health Checks

* Problem: passively checking health of upstream servers
* Solution: use nginx health checks with load balancing so only healthy upstreams are proxied to
* Example:
    
    ```
    upstream backend {
        server backend1.example.com:1234 max_fails=3 fail_timeout=3s;
        server backend2.example.com:1234 max_fails=3 fail_timeout=3s;
    }
    ```

* Passively monitors upstream responses

## 2.10 Active Health Checks with Nginx Plus

## 2.11 Slow Start with Nginx plus

# Chapter 3: Traffic Management

## 3.0 Introduction

* Nginx is also a web traffic controller, can be used to intelligently route traffic and control flow based on many attributes

## 3.1 A/B Testing

* Problem: need to split clients between two or more versions of a file or app
* Solution: Use `split_clients` module to direct a percentage of clients to a different upstream pool
* Example config

    ```
    split_clients "${remote_addr}AAA" $variant {
        20.0%   "backendv2";
        *       "backendv1";
    }
    ```

* Hashes the string provided as the first parameter, divides the hash by the percentages provided to map the value of a variable provided as the second param
* Adding `AAA` to the first param demonstrates that this is a concatenated string that can have many variables, as in the generic hash LB algorithm
* Third param is an object with KV pairs, where the key is the percentage weight and the value is the value to be assigned.
* Key can be a percentage or an asterisk.
* In the above, the value of `$variant` will be `backendv2` for 20% of requests, and `backendv1` for the remainder.
* In the above, both `backendv1` and `backendv2` represent upstream server pools, and can be used with the `proxy_pass` directive:

    ```
    location / {
        proxy_pass http://$variant
    }
    ```

* That splits the traffic to `/` between the pools
* Example that splits between two versions of a static site:

    ```
    http {
        split_clients "${remote_addr}" $site_root_folder {
            33.3%   "/var/www/sitev2/";
            *       "/var/www/sitev1/";
        }
        server {
            listen 80 _;
            root $site_root_folder;
            location / {
                index index.html;
            }
        }
    }
    ```

## 3.2 Using the GeoIP Module and Database

* Problem: you need to install the GeoIP db and enable its embedded variables in Nginx to use physical client locations
* Solution: Official Nginx open source package repo provides a package `nginx-module-geoip`, which installs the dynamic version of the GeoIP module.
* Install your distro's package of the same name
* Download the GeoIP country and city databases and unzip them

    ```
    mkdir /etc/nginx/geoip
    cd /etc/nginx/geoip
    wget "http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz"
    gunzip GeoIP.dat.gz
    wget "http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz"
    gunzip GeoLiteCity.dat.gz
    ```

* Once you've got the db files, you can tell the Nginx geoip module to use them, to expose embedded variables based on the client IP address

    ```
    load_module "/usr/lib64/nginx/modules/ngx_http_geoip_module.so";

    http {
        geoip_country /etc/nginx/geoip/GeoIP.dat;
        geoip_city /etc/nginx/geoip/GeoLiteCity.dat;
        # ...
    }
    ```

### Discussion

* The `geoip_country` and `geoip_city` directives expose a number of embedded vars, including
    * `$geoip_country_code`
    * `$geoip_country_code3`
    * `$geoip_country_name`
    * `$geoip_city_country_code`
    * `$geoip_city_country_code3`
    * `$geoip_city_country_name`
    * `$geoip_city`
    * `$geoip_latitude`
    * `$geoip_longitude`
    * `$geoip_city_continent_code`
    * `$geoip_postal_code`
    * `$geoip_region`
    * `$geoip_region_name`
    * `$geoip_area_code` (US only)

## 3.3 Restricting Access Based on Country

* Example of mapping country codes to block or allow to a variable:

    ```
    load_module "/usr/lib64/nginx/modules/ngx_http_geoip_module.so";

    http {
        map $geoip_country_code $country_access {
            "US"    0;
            "RU"    0;
            default 1;
        }
        # ...
    }
    ```

* Sets `$country_access` to a 1 or 0
* If the client address originates in US/RU, it's 0, else 1
* In the server block you can use an if to deny access to anyone not in US/RU

    ```
    server {
        if ($country_access = '1') {
            return 403;
        }
        # ...
    }
    ```

## 3.4 Finding the Original Client

* Problem: need to find the original client IP because there are proxies in front of the Nginx server
* Solution: Use `geoip_proxy` to define your proxy IP address range and `geoip_proxy_recursive` to look for the original IP

    ```
    load_module "/usr/lib64/nginx/modules/ngx_http_geoip_module.so";

    http {
        geoip_country /etc/nginx/geoip/GeoIP.dat;
        geoip_city /etc/nginx/geoip/GeoLiteCity.dat;
        geoip_proxy 10.0.16.0/26;
        geoip_proxy_recursive on;
        # ...
    }
    ```

* `geoip_proxy` directive defines a CIDR range for the proxy servers, tells Nginx to use `X-Forwarded-For` to find the client IP address
* `geoip_proxy_recursive` tells Nginx to look recursively through the `X-Forwarded-For` header for the last client IP known

## 3.5 Limiting Connections

* Need to limit connections based on a predefined key like a client IP
* Construct a shared memory zone to hold connection metrics, and use `limit_conn` directive to limit open connections

    ```
    http {
        limit_conn_zone $binary_remote_addr zone=limitbyaddr:10m;
        limit_conn_status 429;
        # ...
        server {
            # ...
            limit_conn limitbyaddr 40;
            # ...
        }
    }
    ```

* Creates a shared memory zone named `limitbyaddr`
* Key used is the client IP in binary form
* Size of the shared memory zone is 10mb
* `limit_conn` takes two params:
    * `limit_conn_zone` name
    * number of connections allowed
* `limit_conn_status` sets the response when connections are limited to a status of 429, too many requests
* `limit_conn` and `limit_conn_status` are valid in HTTP, server, and location contexts

## 3.6 Limiting Rate

* Use the rate-limiting module

    ```
    http {
        limit_req_zone $binary_remote_addr zone=limitbyaddr:10m rate=3r/s;
        limit_req_status 429;
        # ...
        server {
            # ...
            limit_req zone=limitbyaddr;
            # ...
        }
    }
    ```

* You can use optional keywords to `limit_req` to enable two stage rate limiting:

    ```
    server {
        location / {
            limit_req zone=limitbyaddr burst=12 delay=9;
        }
    }
    ```

* `burst` lets a client exceed its rate limit without having requests rejected, but for the requests over limit there is a delay in processing that matches the rate limit up to the value configured.
* A set of keyword args alter the behavior
    * `nodelay` - does not take a value, allows the client to consume the burstable value all at once, then rejects all requests until enough time passes to satisfy the rate limit. In the above using `nodelay` a client could consume 12 requests in the first second, but then would have to wait four seconds to make another request.
    * `delay` - defines how many requests can be made up front wihtout throttling. In the above, a client can make nine requests up front with no delay, then next three are throttled, and any more in a 4 second period are rejected

## 3.7 Limiting Bandwidth

* Use `limit_rate` and `limit_rate_after` to limit bandwidth of response to a client

    ```
    location /download/ {
        limit_rate_after 10m;
        limit_rate 1m;
    }
    ```

* Says that for URIs prefixed with `/download/`, the response rate will be limit to 1mb/s after the first 10mb.
* Limit is per connection, may want to set a connection limit as well

# Chapter 4: Massively Scalable Content Caching

## 4.0 Introduction

* Caching features are only available in the `http` context

## 4.1 Caching Zones

* Problem: need to cache content and define where the cache is stored
* Solution: use `proxy_cache_path` to define shared memory-cache zones and a location for the content

    ```
    proxy_cache_path /var/nginx/cache
                     keys_zone=CACHE:60m
                     levels=1:2
                     inactive=3h
                     max_size=20g;
    proxy_cache CACHE;
    ```

* Creates a directory for cached responses on the filesystem
* Creates a shared memory space named CACHE with 60mb memory
* Sets the directory structure levels, defines release of cached responses after they haven't been requested in 3 hours, limits to total cache size to 20G
* The `proxy_cache` directive informs a particular context to use the cache zone
* `proxy_cache_path` only valid in the HTTP context
* `proxy_cache` valid in HTTP, server, and location contexts

## 4.2 Cache Locking

* Problem: you don't want to proxy requests to upstream that are currently being written to cache
* Solution: use `proxy_cache_lock` directive to ensure only one request is able to write to the cache at one time, with subsequent requests waiting for the cache write to end

    ```
    proxy_cache_lock on;
    proxy_cache_lock_age 10s;
    proxy_cache_lock_timeout 3s;
    ```

* `proxy_cache_lock` tells Nginx to hold requests for a cached element being written
* `proxy_cache_lock_age` limits the amount of time that the current writer has before another proxied request will try and write to the cache
* `proxy_cache_lock_timeout` allows requests to be proxied (but not populate the cache) if the cache write takes longer than the setting

## 4.3 Caching Hash Keys

* Problem: You need to control how content is cached and retrieved
* Solution: Use `proxy_cache_key` with variables to define what makes a cache hit or miss

    ```
    proxy_cache_key "$host$request_uri $cookie_user";
    ```

* Default value is `"$scheme$proxy_host$request_uri"`

## 4.4 Cache Bypass

* Use `proxy_cache_bypass` directive with a nonempty or nonzero value
* One way is to set a variable in location blocks that you do not want cached to 1

    ```
    proxy_cache_bypass $http_cache_bypass;
    ```

* Tells Nginx to bypass the cache if the HTTP request header `cache_bypass` is set to any value other than 0
* You can also turn the proxy cache off entirely for a given context like a location block with `proxy_cache off;`

## 4.5 Cache Performance

* Problem: you want to increase performance by caching client side
* Solution: use client-side cache-control headers

    ```
    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
    ```

* Specifies that the client can cache CSS and JS files for up to a year
* the `add_header` directive adds the response header `Cache-Control` with a value of "public", allowing any caching server along the way to cache the resource

## 4.6 Cache Purging with Nginx Plus

## 4.7 Cache Slicing

* Problem: need to increase cache efficiency by segmenting a file into fragments
* Solution: use the `slice` directive and embedded vars to divide a cache result

    ```
    proxy_cache_path /tmp/mycache keys_zone=mycache:10m;

    server {
        # ...
        proxy_cache mycache;
        slice 1m;
        proxy_cache_key $host$uri$is_args$args$slice_range;
        proxy_set_header Range $slice_range;
        proxy_http_version 1.1;
        proxy_cache_valid 200 206 1h;

        location / {
            proxy_pass http://origin:80;
        }
    }
    ```

* Defines a cache zone, enables it for the server
* `slice` is used to slice the response into 1mb file segments
* Cache files are stored via `proxy_cache_key`
* Uses embedded variable `slice_range`
* That's also used as a header when making the request to the origin, and the HTTP version is upgraded to 1.1 since 1.0 didn't support byte-range requests
* Cache validity is for response codes 200 and 206, for an hour
* Developed for delivery of HTML5 video
* Module isn't built by default, has to be added via `--with-http_slice_module` config option when you build nginx

# Chapter 5: Programmability and Automation

# Chapter 6: Authentication

# Chapter 7: Security Controls

## 7.0 Introduction

## 7.1 Access Based on IP Address

* Problem: Need to control access based on the IP of the client
* Solution: Use the `HTTP` or `stream` access module to control access to protected resources:

    ```
    location /admin/ {
        deny    10.0.0.1;
        allow   10.0.0.0/20;
        allow   2001:0db8::/32;
        deny    all;
    }
    ```

* Allows access from any IPv4 in 10.0.0.0/20 except 10.0.0.1
* Allows access from any IPv6 in `2001:0db8::/32` subnet
* Returns 403 for requests originating from any other address
* `allow` and `deny` are valid in HTTP, server, and location contexts, and in stream and server context for TCP and UDP. 
* Rules are checked in sequence, first match used

## 7.2 Allowing Cross-Origin Resource Sharing

* Problem: you're serving resources from another domain and need to allow cross-origin resource sharing (CORS) to enable browsers to use those resources
* Solution: Alter headers based on the `request` method to enable CORS

    ```
    map $request_method $cors_method {
        OPTIONS 11;
        GET 1;
        POST 1;
        default 0;
    }
    server {
        # ...
        location / {
            if ($cors_method ~ '1') {
                add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS';
                add_header 'Access-Control-Allow-Origin' '*.example.com';
                add_header 'Access-Control-Allow-Headers'
                           'DNT,
                            Keep-Alive,
                            User-Agent,
                            X-Requested-With,
                            If-Modified-Since,
                            Cache-Control,
                            Content-Type';
            }
            if ($cors_method = '11') {
                add_header 'Access-Control-Max_Age' 1728000;
                add_header 'Content-Type' 'text/plain; charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }
        }
    }
