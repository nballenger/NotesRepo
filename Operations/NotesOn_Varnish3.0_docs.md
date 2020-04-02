# Varnish HTTP Cache

* Startup
    * `varnishd -f /path/to/config.vcl -s malloc,1G -T 127.0.0.1:6082 -a 0.0.0.0:6081`
    * `-s` - sets storage type and options
    * `-T` - interface and port to run the telnet admin interface on
    * `-a` - interface and port to run the HTTP listener on
* Logging
    * Varnish logs to a shared memory segment, not a file. When it reaches the segment end it starts over, overwriting the old data.
    * If you want to persist log data you have to have something write the logs to file.
    * There are multiple logging clients--`varnishlog` gives you the raw logs, everything being logged.
    * You will consistently see ping/PONG between the master process and the caching process
    * Actual activity logging looks something like:

        ```
        11 SessionOpen  c 127.0.0.1 58912 0.0.0.0:8080
        11 ReqStart     c 127.0.0.1 58912 595005213
        11 RxRequest    c GET
        11 RxURL        c /
        11 RxProtocol   c HTTP/1.1
        11 RxHeader     c Host: localhost:8080
        11 RxHeader     c Connection: keep-alive
        ```

    * First column is an arbitrary integer to group lines by request
    * Second column is the log message tag, indicating what sort of activity they're logging for
    * Tags ending in Rx indicate Varnish is receiving data
    * Tags ending in Tx indicate Varnish is sending data
    * third column tells you whether data coming/going to the client (c) or to/from the backend (b)
    * Fourth column is the data being logged
    * You can pass flags to `varnishlog`:
        * `-b` - only show log lines from traffic between Varnish and backends--useful for optimizing cache hit rates
        * `-c` - only show client side traffic
        * `-m tag:regex` - only list transactions matching the regex
* Sizing the cache
    * Questions to answer when sizing:
        * How big is the hot data set?
        * How expensive is object generation?
    * Use the `n_lru_nuked` counter in `varnishstat`--if you have a lot of LRU activity then your cache is evicting objects due to space constraints, and you should increase cache size
    * Keep in mind that every object stored carries overhead kept outside the actual storage area, which may actually double the memory footprint of your allocation. Overhead is about 1k per object, so if you have a lot of little objects your overhead will be very high.

## Varnish Configuration Language - VCL

* VCL is a domain specific language that Varnish compiles and executes
* VCL files are divided into subroutines
* Different subroutines execute at different times--one when a request is received, another when files are fetched from a backend
* At some point in a subroutine you call an 'action' that Varnish performs
* If you don't, varnish uses a default action
* 99% of changes you need to make will be in `vcl_recv` or `vcl_fetch`
* `vcl_recv`:
    * called at the start of a request, after the complete request is received and parsed
    * Decides whether or not to serve the request, how to do it, and if applicable which backend to use
    * You can alter the request by altering cookies and adding/removing request headers
    * In vcl_recv only the request object, `req` is available
* `vcl_fetch`
    * called after a document has been retrieved from the backend
    * normal tasks are things like:
        * altering response headers
        * triggering ESI processing
        * trying alternate backends if the request failed
    * You have the `req` request object, and a backend response object named `beresp`, which contains the HTTP headers from the backend
* Actions (most common)
    * `pass` - request and subsequent response are passed to/from the backend server. Not cached. Can be returned from vcl_recv
    * `hit_for_pass` - like pass, accessible from vcl_fetch.
        * Creates a hitforpass object in the cache, which has the side effect of caching the decision not to cache, which allows would-be uncacheable requests to be passed to the backend at the same time.
    * `lookup` - may be returned from vcl_recv, tells varnish to deliver content from cache even if the request otherwise indicates that the request should be passed.
    * `pipe` - may be returned from vcl_recv, short circuits the client and the backend connections, and Varnish simply sits and shuffles bytes back and forth. Does not look at data being passed (so logs are incomplete). 
        * HTTP 1.1 allows a client to send multiple request on the same connection, so in this case you'd want to tell Varnish to add a "Connection:close" header before returning pipe
    * `deliver` - deliver the cached object to the client, usually returned from vcl_fetch

## Requests, responses, and objects

* Three main data structures:
    * `req` - request object
    * `beresp` - backend response object
    * `obj` - the cached object, mostly a read only object in memory. obj.ttl is writable, all the rest is read only
* Operators available in VCL:
    * `=` - assignment
    * `==` - comparison
    * `~` - match, with regex or ACLs
    * `!` - negation
    * `&&` - logical and
    * `||` - logical or

## Examples

### Manipulating headers

* To remove the cookie for all objects in the /images directory of the web server:

    ```
    sub vcl_recv {
        if (req.url ~ "^/images") {
            unset req.http.cookie;
        }
    }
    ```

* When the request is handed to the backend there will be no cookie header, if the regex is satisifed

### Manipulating beresp

* Override the TTL of an object coming from the backend if it matches criteria:

    ```
    sub vcl_fetch {
        if (req.url ~ "\.(png|gif|jpg)$") {
            unset beresp.http.set-cookie;
            set beresp.ttl = 1h;
        }
    }
    ```

### ACLs

* Create a named access control list with the `acl` keyword
* Match the IP of hte client against an ACL with the match operator:

    ```
    # Who is allowed to purge
    acl local {
        "localhost";
        "192.168.1.0/24";
        ! "192.168.1.23";
    }

    sub vcl_recv {
        if (req.request == "PURGE") {
            if (client.ip ~ local) {
                return(lookup);
            }
        }
    }

    sub vcl_hit {
        if (req.request == "PURGE") {
            set obj.ttl = 0s;
            error 200 "Purged.";
        }
    }

    sub vcl_miss {
        if (req.request == "PURGE") {
            error 404 "Not in cache.";
        }
    }
    ```

## Statistics

* Couple of tools to use for looking at varnish at runtime:
    * `varnishtop` - reads the shared memory logs, presents a continuously updated list of the most commonly occurring log entries
        * Filter with the `-l`, `-i`, `-X`, `-x` options
        * `varnishtop -i rxurl` shows you what URLS are being asked for by the client
        * `varnishtop -i txurl` shows what your backend is being asked for the most
        * `varnishtop -i RxHeader -I Accept-Encoding` shows most popular Accept-Encoding header the client is sending
    * `varnishhist` - reads shared memory logs, presents continuously updated histogram showing distribution of the last N requests by processing. Hits are marked with a pipe, misses with a hash. Horizontal scale is logarithmic, value of N and vertical scale displays in top left
    * `varnishsizes` - same as `varnishhist` but shows the size of the objects and not the time to complete the request
    * `varnishstat` - there are lots of counters (misses, hits, storage info, threads created, deleted objects, etc.) This dumps those counters.

## Achieving a high hitrate

* You'll probably need to make some changes to your app's config or architecture to get a high cache hit rate.
* Varnish will not cache unless it's sure it's absolutely safe to
* This looks at how Varnish decides to cache a page
* You'll need to be able to see the HTTP headers going between your client and the web server. On the varnish server you can use `varnishlog` and `varnishtop`
* Commands:
    * `varnishtop -i txurl` - what URLs hit the backend the most
    * `varnishlog -c -m 'RxURL:^/foo/bar` - requests from the client matching a path prefix
* You can also use `lwp-request`, which is a perl tool
* You can use a live headers browser plugin
* Varnish uses headers to determine if caching is appropriate, and how long it can keep the content
* Important headers
    * `Cache-Control`
        * Instructs caches how to handle content
        * Varnish cares about the `max-age` parameter, uses it for TTL
        * `Cache-Control: nocache` is ignored but can be supported
        * Make sure to issue a Cache-Control header with a max-age header
        * Ex: `Cache-Control: public, max-age=600`
    * `Age` - Varnish adds an Age header to indicate how long the object has been kept in varnish. You can get it from the log with `varnishlog -i TxHeader -I ^Age`
    * `Authorization` - if Varnish sees this it will pass the request
* Overriding TTL
    * If the backend is acting strangely you may want to override the ttl in varnish rather than fix whatever it is.
    * You use VCL to identify the objects you want, then set the `beresp.ttl` to whatever you want:

        ```
        sub vcl_fetch {
            if (req.url ~ "^/legacy_broken_cms/") {
                set beresp.ttl = 5d;
            }
        }
        ```

* Normalizing your namespace
    * Sites may have multiple hostnames
    * By default Varnish won't know they're different, and will cache versions of the same object for each hostname
    * You can mitigate in VCL by

        ```
        if (req.http.host ~ "(?i)^(www.)?varnish-?software.com") {
            set req.http.host = "varnish-software.com";
        }
        ```

## Purging and Banning

* One of the best ways to increase hit rate is to increase TTL
* That comes at the cost of serving outdated content occasionally
* Solution is to notify Varnish when there is new content
* Three mechanisms:
    * HTTP purging
    * banning
    * forced cache misses

### HTTP Purges

* A purge is when you pick a cache object and discard it and all variants
* Usually invoked over HTTP with the PURGE method
* To support purging, you need the following VCL:

    ```
    acl purge {
        "localhost";
        "192.168.55.0"/24;
    }

    sub vcl_recv {
        # allow PURGE from localhost and 192.168.55.*
        if (req.request == "PURGE") {
            if (!client.ip ~ purge) {
                error 405 "Not allowed.";
            }
            return (lookup);
        }
    }

    sub vcl_hit {
        if (req.request == "PURGE") {
            purge;
            error 200 "Purged.";
        }
    }

    sub vcl_miss {
        if (req.request == "PURGE") {
            purge;
            error 200 "Purged.";
        }
    }
    ```
