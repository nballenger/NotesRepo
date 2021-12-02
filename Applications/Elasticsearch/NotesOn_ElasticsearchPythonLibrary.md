# Notes on Elasticsearch Python Libraries

# Elasticsearch Client

## Main Page

From https://elasticsearch-py.readthedocs.io/en/6.8.2/

* Your major library version has to match your major ES version
* Example usage:

    ```Python
    from datetime import datetime
    from elasticsearch import Elasticsearch
    es = Elasticsearch()

    doc = {'author': 'kimchy', 'text': 'ES is cool', 'timestamp': datetime.now()}
    res = es.index(index="test-index", doc_type="tweet", id=1, body=doc)
    print(res['result'])

    res = es.get(index="test-index", doc_type="tweet", id=1)
    print(res['_source'])

    es.indices.refresh(index='test-index')

    res = es.search(index="test-index", body={"query": {"match_all": {}}})
    print("Got %d Hits:" % res['hits']['total'])
    for hit in res['hits']['hits']:
        print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])
    ```

### Features

* Thin wrapper around the ES REST API
* Not opinionated, some of the APIs are cumbersome to use from Python
* There's some helpers to make that easier, and also the `elasticsearch-dsl` package

#### Persistent Connections

* Uses persistent connections in individual connection pools, one per configured or sniffed node.
* Two out of the box `http` protocol implementations
* Transport layer creates an instance of the selected connection class per node, tracks health of individual nodes.
* You can customize connection pool timeouts and round robin strategy via the Connection Layer API

#### Automatic Retries

* If a connection to a node fails, it raises `ConnectionError`, and the connection is in a faulty state
* It's placed on hold for `dead_timeout` seconds, request is retried on another node
* If a connection fails multiple times the timeout gets progressively longer
* If no live connection is available, the connection with the smallest timeout is used
* By default retries aren't triggered by `ConnectionTimeout`. If you want to change that, set `retry_on_timeout=True`

#### Sniffing

* Client can be configured to inspect cluster state, to get a list of nodes on startup, periodically, and on failure.
* Example configs:

    ```Python
    from elasticsearch import Elasticsearch

    es = Elasticsearch()    # by default no sniffing, ever

    # sniff on startup to inspect cluster, load balance across all nodes
    es = Elasticsearch(["seed1", "seed2"], sniff_on_start=True)

    # sniff periodically and after failure
    es = Elasticsearch(["seed1", "seed2"], sniff_on_start=True,
        sniff_on_connection_fail=True, sniffer_timeout=60)
    ```

#### Thread Safety

* Client is thread safe, can be used in a multi-threaded environment.
* Best practice is to create a single, global instance of the client, use it throughout your application.
* If the app is long-running, maybe turn on sniffing to make sure the client is up to date on the cluster location.
* By default `urllib3` is allowed to open up to 10 connections per node
* If your app uses more parallelism, use `maxsize` parameter of the `Elasticsearch` constructor to up the limit

#### SSL and Authentication

* Client can be configured to use SSL to connect to the cluster.
* Doesn't ship with default set of root certs, you have to set it up.

#### Logging

* Uses standard logging library
* Defines two loggers
    * `elasticsearch` - log's standard activity
    * `elasticsearch.trace` - logs requests to the server as curl commands, using pretty printed json
* Trace logger is set to `propagate=False` by default, so must be activated separately

### Environment Considerations

* When using an HTTP load balancer you can't use the sniffing functionality, because the cluster would supply the client with IP addresses to directly connect to the cluster, circumventing the load balancer.
* In some environments like Google App Engine, your HTTP requests might be restricted so GET requests won't accept a body. If true, use `send_get_body_as` parameter of `Transport` to send all bodies via POST:

    ```Python
    from elasticsearch import Elasticsearch
    es = Elasticsearch(send_get_body_as='POST')
    ```

#### Compression

* If you've got low throughput, enable compression with `http_compress=True` in the constructor params

#### Running on AWS with IAM

* If you want to use the client with IAM based auth on AWS, you can use `requests-aws4auth` package

    ```Python
    from elasticsearch import Elasticsearch, RequestsHttpConnection
    from requests_aws4auth import AWS4Auth

    host = 'YOURHOST.us-east-1.es.amazonaws.com'
    awsauth = AWS4Auth(YOUR_ACCESS_KEY, YOUR_SECRET_KEY, REGION, 'es')

    es = Elasticsearch(
        hosts=[{"host": host, "port": 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )
    print(es.info())
    ```

### Customization

#### Custom Serializers

* By default JSONSerializer is used to encode outgoing requests, but you can implement your own custom serializer:

    ```Python
    from elasticsearch.serializer import JSONSerializer

    class SetEncoder(JSONSerializer):
        def default(self, obj):
            if isinstance(obj, set):
                return list(obj):
            if isinstance(obj, Something):
                return 'CustomSomethingRepresentation'
            return JSONSerializer.default(self, obj)

    es = Elasticsearch(serializer=SetEncoder())
    ```

## API Documentation

* All API calls map the REST api as closely as possible, including required/optional args
* That means the code makes a distinction between positional and keyword args
* However, you should use keyword args for all calls for consistency and safety.

### Global Options

* Parameters added by the client itself, can be used in all API calls
* Ignore
    * If es returns a 2XX, an API call is considered successful
    * If not, an instance of `TransportError` is raised
    * If you don't want an exception raised, you can pass `ignore` with either a single status code to ignore, or a list of them

        ```Python
        from elasticsearch import Elasticsearch
        es = Elasticsearch()

        # ignore 400 caused by IndexAlreadyExistsException
        es.indices.create(index='test-index', ignore=400)

        # ignore 404 and 400
        es.indices.delete(index='test-index', ignore=[400, 404])
        ```

* Timeout
    * Global timeout can be set when constructing the client or on a per-request basis
    * Global uses `timeout` param, per-request uses `request_timeout`, which gets passed to the `perform_request` method of the connection class.
* Response filtering - `filter_path` param reduces the response returned
    
    ```Python
    # only return _id and _type
    es.search(index='test-index', filter_path=['hits.hits._id', 'hits.hits._type'])

    # wildcard usage
    es.search(index='test-index', filter_path=['hits.hits._*'])
    ```

        
