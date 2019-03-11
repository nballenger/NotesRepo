# Notes on Nginx HTTP Server - Fourth Edition

By Clement Nedelcu, Martin Fjordvald; Packt Publishing, Feb. 2018

ISBN 9781788623551

# Ch 1. Downloading and Installing Nginx

## Via Package Managers

Debian:

```bash
apt-cache search nginx
apt-cache show PACKAGE_NAME
apt-get install PACKAGE_NAME
```

RHEL:

```bash
yum install epel-release
yum search nginx
yum info PACKAGE_NAME
yum install PACKAGE_NAME
```

## Nginx Provided Packages

Debian:

```bash
wget http://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
```

Then add ths to `/etc/apt/sources.list`:

```
deb http://nginx.org/packages/ubuntu/ UBUNTU_CODENAME nginx
deb-src http://nginx.org/packages/ubuntu/ UBUNTU_CODENAME nginx
```

Then:

```
apt-get update && apt-get install -y nginx
```

## Compiling from Source

```bash
apt-get install build-essentials
apt-get install libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev
mkdir src && cd src
wget http://nginx.org/download/nginx-1.13.8.tar.gz
tar -zxf nginx-1.13.8.tar.gz
cd nginx-1.13.8
./configure
make
make install
```

Then do whatever, I guess?

## Features

Mainf eatures of web branch:

* Serve static and index files
* Auto indexing
* Open file descriptor cache
* Accelerated reverse proxying with caching
* Load balancing and fault tolerance
* Accelerated support with caching of FastCGI, uWSGI, SCGI, memcached
* Filters include:
    * gzipping
    * byte ranges
    * chunked responses
    * XSLT
    * SSL
    * image transformation
* Multiple SSI inclusions in a single page can be done in parallel if handled by proxies or FastCGI/uWSGI/SCGI servers
* SSL and TLS SNI support

## Config options for compilation

* `--prefix=/path` - base folder Nginx installs to; default is `/usr/local/nginx`. Other switches using relative paths will be relative to this base path.
* `--sbin-path=some/path` - Path where the binary will install. Default is `<prefix>/sbin/nginx`
* `--conf-path=some/path` - Path of main config file. Default is `<prefix>/conf/nginx.conf`
* `--error-log-path=some/path` - Error log location. Default is `<prefix>/logs/error.log`
* `--pid-path` - path to PID file. Default is `<prefix>/logs/nginx.pid`
* `--lock-path` - location of lock file, default is `<prefix>/logs/nginx.lock`
* `--with-perl_modules_path=some/path` - Path to perl modules, must be defined to include additional perl modules. No default.
* `--with-perl=/path/to/perl` - path to perl binary, no default
* `--http-log-path=some/path` - location of access logs, default `<prefix>/logs/access.log`
* `--http-client-body-temp-path=some/path` - stores temp files generated by client requests, default `<prefix>/client_body_temp`
* `--http-proxy-temp-path=some/path` - location of temp files used by proxy, default `<prefix>/proxy_temp`
* `--http-fastcgi-temp-path=some/path` - temp files for fastcgi, default `<prefix>/fastcgi_temp`
* `--http-uwsgi-temp-path=some/path` - temp files for uwsgi, default `<prefix>/uwsgi_temp`
* `--http-scgi-temp-path=some/path` - temp files for scgi, default `<prefix>/scgi_temp`
* `--build-dir=/path` - location of application build, no default

## Prerequisite options

Compiler options:

* `--with-cc=...` - alternate location for C compiler
* `--with-ccp=...` - alternate location for C preprocessor
* `--with-cc-opt=...` - additional options to pass to the C compiler
* `--with-ld-opt=...` - additional options to pass to the C linker
* `--with-cpu-opt=...` - specifies different target processor architecture
* `--with-compat` - enables dynamic module compatibility

PCRE options:

* `--without-pcre` - disables usage of PCRE library, not recommended
* `--with-pcre` - forces usage of PCRE
* `--with-pcre=...` - path to PCRE library source code
* `--with-pcre-opt=...` - additional options for building the PCRE library
* `--with-pcre-jit=...` - build PCRE with JIT compilation support

ZLIB options:

* `--with-zlib=...` - path to zlib library sources
* `--with-zlib-opt=...` - options for building the zlib library
* `--with-zlib-asm=...` - uses assembler optimizations for `pentium`, `pentiumpro`

OpenSSL options:

* `--with-openssl=...` - path to OpenSSL library sources
* `--with-openssl-opt=...` - additional options for building openssl

Libatomic options:

* `--with-libatomic=...` - forces usage of `libatomic_ops` library on systems other than x86, amd64, and sparc. Lets Nginx do atomic operations directly instead of using lock files.
* `--with-libatomic=...` - path to Libatomic library sources

## Module options

Modules need to be selected before compiling. Some are enabled by default, some need to be enabled manually.

Modules enabled by default:

* `--without-http_charset_module` - disable charset module for re-encoding webpages
* `--without-http_gzip_module` - disables gzip compression module
* `--without-http_ssi_module` - disables server side include
* `--without-http_userid_module` - disables user ID module that does user ident via cookies
* `--without-http_access_module` - disables access module allowing access config for IP address ranges
* `--without-http_auth_basic_module` - disables basic auth module
* `--without-mirror` - disables mirror module, used for creating mirror requests to alt backends
* `--without-http_autoindex_module` - disables automatic index module
* `--witout-http_geo_module` - disables geo module allowing you to define variables depending on IP address ranges
* `--without-http_map_module` - disables map module that allows you to declare map blocks
* `--without-http_split_clients_module` - disables split clients module that can be used for A/B
* `--without-http_referer_module` - disables referer control module
* `--without-http_rewrite_module` - disables rewrite
* `--without-http_proxy_module` - disables proxy module for transfering requests to other servers
* `--without-http_fastcgi_module`
* `--without-http_uwsgi_module`
* `--without-http_scgi_module`
* `--without-http_memcached_module` - disables memcached module for interacting with memcached
* `--without-http_limit_conn_module` - disables limit connections module for restricting resource usage according to defined zones
* `--without-http_limit_req_module` - disables limit requests module allowing you to limit the amount of requests per user
* `--without-http_empty_gif_module` - disables empty gif module that serves a blank GIF image from memory
* `--without-http_browser_module` - disables browser module that interprets user agent string
* `--without-http_upstream_hash_module` - disables upstream has module providing the hash directive in upstream blocks
* `--without-http_upstream_ip_hash_module` - disables upstream IP hash module that provides the `ip_hash` directive in upstream blocks
* `--without-http_upstream_least_conn_module` - disables upstream least conn module that provides `least_conn` directive in upstream blocks
* `--without-http_upstream_keepalive_module` - disables upstream keepalive module
* `--without-http_upstream_zone_module` - disables upstream shared memory zone module

Modules disabled by default:

* `--with-http_ssl_module` - enables SSL module
* `--with-http_v2` - enables support for HTTP/2
* `--with-http_realip_module` - enables realip module, for reading real IP address from request headers
* `--with-http_addition_module` - enables addition module that lets you append or prepend data to the response body
* `--with-http_xslt_module` - enables xslt module for applying XSL transforms to xml docs. Requires `libxml2` and `libxslt` libraries. You can pass this setting to the dynamic flag to compile as a dynamic module.
* `--with-http_image_filter_module` - enables image filter module, that lets you apply modifications to images. You need `libgd` library to compile this module. You can pass it the dynamic flag to compile as the dynamic module.
* `--with-http_geoip_module` - enables geoip module for achieving geographic localization using MaxMind's GeoIP binary database. Need to have `libgeoip` library to use.
* `--with-http_sub_module` - enables substitution module for replacing text in webpages
* `--with-http_dav_module` - enables WebDAV (distributed authoring and versioning)
* `--with-http_flv_module` - enables FLV module for handling flash video files
* `--with-http_gzip_static_module` - enables gzip static module for sending precompressed files
* `--with-http_auth_request_module` - enables `auth_request` module. Lets you delegate HTTP authentication to a back end server via a subrequest. 
* `--with-http_random_index_module` - enables the random index module for picking a random file as the directory index
* `--with-http_secure_link_module` - enables secure link module to check the presence of a keyword in the URL
* `--with-http_stub_status_module` - enables stub status module, which generates a server statistics and information page
* `--with-google_perftools_module` - enables google performance tools module
* `--with-http_degradation_module` - enables degradation module, which controls behavior of the server based on current resource usage
* `--with-http_perl_module` - enables perl module that lets you insert perl code directly into nginx config files, and to make perl calls from SSI
* `--with-http_gunzip_module` - enables gunzip module, which offers to decompress a gzip-encoded response from a back-end server before forwarding to the client

## Miscellaneous options

Other options to go into the configuration script.

Streaming server options:

* `--with-stream` - enables stream module for proxying data streams over TCP/UDP
* `--with-mail_ssl_module` - enables SSL support for the mail server proxy
* `--without-mail_pop3_module` - disables POP3 module for mail server proxy
* `--without-mail_imap_module` - disables imap for mail server proxy
* `--without-mail_smtp_module` - disables SMTP for mail server proxy

Mail server options:

* `--with-mail` - enables the mail server proxy module
* `--with-mail_ssl_module` - enables SSL for the mail server proxy
* `--without-mail_pop3_module` - disables POP3 module for the mail server proxy
* `--without-mail_imap_module`
* `--without-mail_smtp_module`

Event management options (lets you select an event notification system for the nginx sequencer, advanced users only):

* `--with-rtsig_module` - enables the rtsig module so you can use `rtsig` as the event notification mechanism
* `--with-select_module` - enables select module to use select as the event notification system. By default this is enabled unless a better method is found on the system: `kqueue`, `epoll`, `rtsig`, or `poll`
* `--without-select_module` - dsiables select module
* `--with-poll-module` - enables you to use poll as the event notification mechanism. Enabled if available unless a better method is found: `kqueue`, `epoll`, or `rtsig`
* `--without-poll-module` - disables poll module

User and group options:

* `--user=...` - Default user account for starting the nginx worker processes. Used only if you omit the user directive in the config file.
* `--group=...` - Default user group for starting workers. Used only if you omit group in config.
* `--without-http` - disables the HTTP server
* `--without-http-cache` - disables http caching features
* `--add-module=PATH` - adds a third party module to the compile process by specifying its path.
* `--with-debug` - enables additional debugging info to be logged
* `--with-file-aio` - enables support for async IO
* `--build=name` - optionally set a name for this compile of Nginx

## Configuration Examples

* Note that `--prefix` changes the base for lots of other directives, and cannot be changed once the binaries have been compiled.
* The default prefix does not include a version number. If you upgrade Nginx and do not specify a different prefix, the new install files will overwrite the previous ones.
* Use a different prefix for each version you want to use:

    ```bash
    ./configure --prefix=/usr/local/nginx-1.13.8
    ```

* Then symlink `/usr/local/nginx` to point to your version directory

### Regular HTTP and HTTPS servers

Most important HTTP/S features are enabled, mail related stuff disabled:

```
./configure --user=www-data --group=www-data --with-http_ssl_module --with-http_realip_module
```

### All modules enabled

```
./configure --user=www-data --group=www-data --with-http_ssl_module \
    --with-http_realip_module --with-http_addition_module --with-http_xslt_module \
    --with-http_image_filter_module --with-http_geoip_module --with-http_sub_module \
    --with-http_dav_module --with-http_flv_module --with-http_mp4_module \
    --with-http_gzip_static_module --with-http_random_index_module \
    --with-http_secure_link_module --with-http_stub_status_module \
    --with-http_perl_module --with-http_degradation_module --with-http_gunzip_module \
    --with-http_auth_request_module
```

### Mail server proxy

```
./configure --user=www-data --group=www-data --with-mail --with-mail_ssl_module
```

## Controlling the Nginx service

* Nginx is a daemon
* Important to understand the process architecture, particularly the user and group it runs under
* Very common source of problems with Nginx is file access permissions due to user or group misconfiguration
* Two levels of processes with possibly different permission sets
    * Nginx master process - should be started as root. Setting user/group by directive will not affect what the master process runs as.
    * Nginx worker processes - automatically spawned by the master process under the account specified in the configuration file with the user directive. If unspecified either by config file or compile time directive, user/group will be `nobody`

## Nginx command-line switches

### Starting and stopping the daemon

* `nginx -s stop` - stops immediately (SIGTERM)
* `nginx -s quit` - stops gracefully (SIGQUIT)
* `nginx -s reopen` - reopens log files
* `nginx -s reload` - reloads configuration
* The config file is parsed and verified for every start/stop/reopen/reload
* If the config is invalid, any command will fail, even quit
* If you have to terminate in an alternate method, use `kill` or `killall nginx` as root

### Testing the configuration