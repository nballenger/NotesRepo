# Notes on Elasticsearch 6.7 documentation

From https://www.elastic.co/guide/en/elasticsearch/reference/6.7/index.html

# Getting Started

## Basic Concepts

* Near Realtime (NRT)
    * slight latency, ~1s, from time you index till it's searchable
* Cluster
    * collection of 1+ server nodes
    * holds all data, provides federated indexing and search
    * every cluster has a unique name, default 'elasticsearch'
    * node can only be part of a cluster if set up to join by name
    * don't use the same name in different environments
    * totally fine to have a cluster with one node
* Node
    * single server that's part of a cluster
    * identified by name, by default a UUID assigned at startup
    * node can be configured to join a cluster by name
    * no limit on nodes per cluster
    * starting a single node automatically starts a single-node cluster
* Index
    * Collection of documents with somewhat similar characteristics
    * Identified by an all lowercase name
    * name used when indexing, searching, updating, deleting against docs
    * no limit on indexes per cluster
* Document
    * Basic unit of info that can be indexed
    * expressed in JSON
    * within an index, can store as many docs as you want
* Shards & Replicas
    * if an index exceeds hardware limits it may be sharded
    * you can define number of shards on creation
    * each shard is fully functional and independent
    * important for two reasons:    
        * lets you horizontally split/scale your content volume
        * allows you to distribute / parallelize operations across shards
    * replica shards are for failover
    * replication important because:
        * gives you HA in case a shard/node fails
        * lets you scale your search volume/throughput
    * each index can be split into multiple shards
    * can also be replicated zero or more times
    * once replicated, an index has primary shards (originals) and replicas
    * by default each index is allocated 5 primary shards and 1 replica

## Exploring Your Cluster

* some stuff you can do with the REST API
    * check cluster, node, index health, status, statistics
    * admin cluster, node, and index data/metadata
    * do CRUD operations and search ops
    * execute advanced search ops like paging, sorting, filtering, scripting

## Cluster Health

* Uses the `_cat` API

    ```
    ❯ curl 'localhost:9200/_cat/health?v'
    epoch      timestamp cluster       status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
    1632237611 15:20:11  elasticsearch yellow          1         1      5   5    0    0        5             0                  -                 50.0%
    ```

* Cluster health can be:
    * green - fully functional
    * yellow - all data available, some replicas not yet allocated (fully functional)
    * red - some data not available, partially functional
* When cluster is red it continues to serve search requests from available shards, but needs attention ASAP.
* You can get a list of nodes in your cluster from `GET /_cat/nodex?v`

    ```
    ❯ curl 'localhost:9200/_cat/nodes?v'
    ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
    127.0.0.1           18          38   3    0.05    0.05     0.01 mdi       *      setkO6V
    ```

## List All Indices

```
❯ curl 'localhost:9200/_cat/indices?v'
health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   circulation-works-v4 sCvatC9UTB218IEC381sPA   5   1       2815            0      2.5mb          2.5mb
```

## Create an Index

```
❯ curl -X PUT 'localhost:9200/customer?pretty'
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "customer"
}
❯ curl 'localhost:9200/_cat/indices?v'
health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   customer             4AFnjrcjT0iaU_3zkralIQ   5   1          0            0      1.1kb          1.1kb
yellow open   circulation-works-v4 sCvatC9UTB218IEC381sPA   5   1       2815            0      2.5mb          2.5mb
```

* Tells you you've got an index with 5 primary shards and 1 replica, with 0 documents
* By default it's yellow because ES created one replica. Since we only have one node running, the replica can't be allocated for HA until another node joins hte cluster. Once the replica is on a separate node, the health goes to green.

## Index and Query a Document

```
❯ curl -X PUT -H "Content-Type: application/json" -d '{"name": "John Doe"}' 'localhost:9200/customer/_doc/1?pretty'
{
  "_index" : "customer",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

* Creates a doc inside the `customer` index, using id specified at create time.
* You don't have to create an index first, you can just add a document.
* Retrieval:

    ```
    ❯ curl 'localhost:9200/customer/_doc/1?pretty'
    {
      "_index" : "customer",
      "_type" : "_doc",
      "_id" : "1",
      "_version" : 1,
      "_seq_no" : 0,
      "_primary_term" : 1,
      "found" : true,
      "_source" : {
        "name" : "John Doe"
      }
    }
    ```

* Two important fields:
    * `found` - found a doc with requested ID
    * `_source` - full json of found document

## Delete an Index

```
❯ curl -X DELETE 'localhost:9200/customer?pretty'
{
  "acknowledged" : true
}
```

* API commands so far:

    ```
    PUT /customer
    PUT /customer/_doc/1 {"name": "John Doe"}
    GET /customer/_doc/1
    DELETE /customer
    ```

* Pattern of how you access data in ES: `<HTTP Verb> /<Index>/<Type>/<ID>`
* Very pervasive REST pattern there

## Modifying Your Data

### Indexing/Replacing Documents

* Creating a document, then replacing its contents by doing a PUT to the same ID:

    ```
    ❯ curl -X PUT -H "Content-Type: application/json" -d '{"name": "John Doe"}' 'localhost:9200/customer/_doc/1?pretty'
    {
      "_index" : "customer",
      "_type" : "_doc",
      "_id" : "1",
      "_version" : 1,
      "result" : "created",
      "_shards" : {
        "total" : 2,
        "successful" : 1,
        "failed" : 0
      },
      "_seq_no" : 0,
      "_primary_term" : 1
    }
    ❯ curl -X PUT -H "Content-Type: application/json" -d '{"name": "Jane Doe"}' 'localhost:9200/customer/_doc/1?pretty'
    {
      "_index" : "customer",
      "_type" : "_doc",
      "_id" : "1",
      "_version" : 2,
      "result" : "updated",
      "_shards" : {
        "total" : 2,
        "successful" : 1,
        "failed" : 0
      },
      "_seq_no" : 1,
      "_primary_term" : 1
    }
    ```

* If you use a different ID, it creates a new document
* The ID part is optional, so you could do `POST /customer/_doc?pretty`
* You use POST instead of PUT if not specifying an ID

## Updating Documents

* ES doesn't do in-place updates under the hood. For updates it deletes the old doc and indexes a new doc with the update applied.

    ```
    ❯ curl -X POST -H "Content-Type: application/json" \
    -d '{"doc": {"name": "Jane Doe", "age": 20}}' \
    'localhost:9200/customer/_doc/1/_update?pretty'
    {
      "_index" : "customer",
      "_type" : "_doc",
      "_id" : "1",
      "_version" : 2,
      "result" : "noop",
      "_shards" : {
        "total" : 0,
        "successful" : 0,
        "failed" : 0
      }
    }
    ```

* Updates can also be done by scripts. Incrementing the age by 5:

    ```
    ❯ curl -X POST -H "Content-Type: application/json" \
    -d '{"script": "ctx._source.age += 5"}' \
    'localhost:9200/customer/_doc/1/_update?pretty'
    {
      "_index" : "customer",
      "_type" : "_doc",
      "_id" : "1",
      "_version" : 4,
      "result" : "updated",
      "_shards" : {
        "total" : 2,
        "successful" : 1,
        "failed" : 0
      },
      "_seq_no" : 3,
      "_primary_term" : 1
    }
    ```

* You can also update multiple docs given a query condition.
* See the [`docs-update-by-query` API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-update-by-query.html)

## Deleting Documents

* You call `curl -X DELETE 'localhost:9200/customer/_doc/2?pretty`
* You can delete all docs matching a query with the [`_delete_by_query` API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete-by-query.html)
* It's much more efficient to delete a whole index instead of deleting all documents with delete by query API.

## Batch Processing

* You can do stuff in batches with the [`_bulk` API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-bulk.html)
* Efficient because it does as few network trips as possible.
* Deleting two docs in one bulk operation:

    ```
    ❯ curl -X POST -H "Content-Type: application/json" \
    -d '{"index":{"_id":"1"}}
    {"name": "John Doe"}
    {"index":{"_id":"2"}}
    {"name": "Jane Doe"}
    quote> ' 'localhost:9200/customer/_doc/_bulk?pretty'
    {
      "took" : 61,
      "errors" : false,
      "items" : [
        {
          "index" : {
            "_index" : "customer",
            "_type" : "_doc",
            "_id" : "1",
            "_version" : 5,
            "result" : "updated",
            "_shards" : {
              "total" : 2,
              "successful" : 1,
              "failed" : 0
            },
            "_seq_no" : 4,
            "_primary_term" : 1,
            "status" : 200
          }
        },
        {
          "index" : {
            "_index" : "customer",
            "_type" : "_doc",
            "_id" : "2",
            "_version" : 1,
            "result" : "created",
            "_shards" : {
              "total" : 2,
              "successful" : 1,
              "failed" : 0
            },
            "_seq_no" : 0,
            "_primary_term" : 1,
            "status" : 201
          }
        }
      ]
    }
    ```

* Updating the first document and deleting the second document in one bulk operation:

    ```
    POST /customer/_doc/_bulk?pretty
    {"update":{"_id":"1"}}
    {"doc": {"name": "John Doe becomes Jane Doe"}}
    {"delete":{"_id":"2"}
    ```

* Bulk API doesn't fail if one of its actions fails. Processes actions after it.
* When it returns, gives you a status for each action in the same order sent in.

## Exploring Your Data

* Example doc showing structure:

    ```
    {
        "account_number": 0,
        "balance": 16623,
        "firstname": "Bradshaw",
        "lastname": "Mckenzie",
        "age": 29,
        "gender": "F",
        "address": "244 Columbus Place",
        "employer": "Euron",
        "email": "bradshawmckenzie@euron.com",
        "city": "Hobucken",
        "state": "CO"
    }
    ```

* Assuming you have a file of these called `accounts.json`, load and view with:

    ```
    curl -H "Content-Type: application/json" \
      -XPOST "localhost:9200/bank/_doc/_bulk?pretty&refresh" \
      --data-binary "@accounts.json"
    curl "localhost:9200/_cat/indices?v"
    ```

* Actual file is here: [`accounts.json`](https://raw.githubusercontent.com/elastic/elasticsearch/6.7/docs/src/test/resources/accounts.json)
* Once loaded you get 1k documents in that index

## The Search API

* Two basic ways to run searches:
    * send search params via [REST request URI](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/search-uri-request.html)
    * Send them via [REST request body](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/search-request-body.html)
* Request body method lets you be more expressive and define searches in JSON format
* Example of using the URI method (all subsequent examples use request body):

    ```
    ❯ curl -s 'localhost:9200/bank/_search?q=*&sort=account_number:asc&pretty' | head -n 20
    {
      "took" : 5,
      "timed_out" : false,
      "_shards" : {
        "total" : 5,
        "successful" : 5,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : 1000,
        "max_score" : null,
        "hits" : [
          {
            "_index" : "bank",
            "_type" : "_doc",
            "_id" : "0",
            "_score" : null,
            "_source" : {
              "account_number" : 0,
    ```

* Things it returns:
    * `took` - time in ms to execute search
    * `timed_out` - whether it timed out or not
    * `_shards` - how many shards searched, count of successful / failed searched shards
    * `hits` - search results
    * `hits.total` - total docs matching criteria
    * `hits.hits` - actual array of results, defaults to first 10 docs
    * `hits.sort` - sort value of the sort key for each result, missing if sorted by score
    * `hits._score` and `max_score` - ignore for now
* Same search using request body method:

    ```
    ❯ curl -X GET -H "Content-Type: application/json" -H "Accept: application/json" \
    > -d '{"query": {"match_all": {}}, "sort": [{"account_number": "asc"}]}' \
    > 'localhost:9200/bank/_search'
    ```

* Once you get your results, ES is completely done with the request, maintains no server side state or cursors.

## Introducing the Query Language

* ES has a [JSON-style DSL](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/query-dsl.html) for executing queries.
* Parameters to a body query:
    * `query` - tells you the query definition
    * `sort` - list of sort params
    * `size` - like a limit, number of docs to return
    * `from` - zero-based offset; this would get you docs 10-19 inclusive: `"from": 10, "size": 10`

## Executing Searches

* By default the full JSON doc is returned as part of all searches, in `_source`
* You can scope to fields in the source:

    ```
    ❯ curl -X GET -H "Content-Type: application/json" -H "Accept: application/json" \
    -d '{"query": {"match_all": {}}, "_source": ["account_number", "balance"], "size": 2}' \
    'localhost:9200/bank/_search?pretty'
    {
      "took" : 2,
      "timed_out" : false,
      "_shards" : {
        "total" : 5,
        "successful" : 5,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : 1000,
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "bank",
            "_type" : "_doc",
            "_id" : "25",
            "_score" : 1.0,
            "_source" : {
              "account_number" : 25,
              "balance" : 40540
            }
          },
          {
            "_index" : "bank",
            "_type" : "_doc",
            "_id" : "44",
            "_score" : 1.0,
            "_source" : {
              "account_number" : 44,
              "balance" : 34487
            }
          }
        ]
      }
    }
    ```

* `match_all` gets all docs
* `match` query is a basic fielded search query, search does against a field or fields
* Examples:

    ```
    # get account numbered 20
    GET /bank/_search {"query": {"match": {"account_number": 20}}

    # all accounts with mill in address
    GET /bank/_search {"query": {"match": {"address": "mill"}}

    # all with mill or lane in address
    GET /bank/_search {"query": {"match": {"address": "mill lane"}}

    # phrase match, all with 'mill lane' in address
    GET /bank/_search {"query": {"match_phrase": {"address": "mill lane"}}
    ```

* `bool` query lets you compose smaller queries into bigger ones
* Composing two `match` queries, returns all accounts where both are true:

    ```
    GET /bank/_search
    {"query": "bool": {"must": ["match": {"address": "mill"}}, "match": {"address": "lane"}}]}}
    ```

* `must` says all queries must be true to make a match (AND)
* `should` says at least one should be true (OR)

    ```
    GET /bank/_search
    {"query": "bool": {"should": ["match": {"address": "mill"}}, "match": {"address": "lane"}}]}}
    ```

* `must_not` is like NOR:

    ```
    GET /bank/_search
    {"query": "bool": {"must_not": ["match": {"address": "mill"}}, "match": {"address": "lane"}}]}}
    ```

* Combining `must`, `should`, `must_not` inside a `bool`:

    ```
    GET /bank/_search
    {"query": {"bool": {"must": [{"match": {"age": "40"}}],
                        "must_not": [{"match": {"state": "ID"}}]}}}
    ```

## Executing Filters

* Previously skipped over `_score` in search results
* `_score` is a numeric value that is a relative measure of how well the doc matches the search query
* Higher scores are more relevant
* Queries don't always produce scores, particularly if they're only used to filter the document set
* ES detects that and optimizes query execution to avoid computing useless scores.
* The `bool` query also supports `filter` clauses that let you use a query to restrict docs matched by other clauses, without changing how scores are computed.
* Example of the `range` query that lets you filter by a range of values. Returns all accounts with balances between 20000 and 30000, inclusive:

    ```
    GET /bank/_search
    {
        "query": {
            "bool": {
                "must": {"match_all": {}},
                "filter": {"range": {"balance": {"gte": 20000, "lte": 30000}}}
            }
        }
    }
    ```

## Executing Aggregations

* Let you group and extract stats from data. Like `GROUP BY` and aggregate functions.
* You can do searches returning hits and also aggregated results separate from the hits.
* Example grouping all accounts by state, returns top 10 (default) states sorted by count desc.

    ```
    GET /bank/_search
    {"size": 0, "aggs": {"group_by_state": {"terms": {"field": "state.keyword"}}}}
    ```

* Equivalent to:

    ```
    SELECT state, COUNT(*) FROM bank GROUP BY state ORDER BY COUNT(*) DESC LIMIT 10;
    ```

* Setting `size` to 0 lets you get only the aggregations, not the hits.
* Calculating average account balance by state for top 10 states by count desc:

    ```
    GET /bank/_search
    {
        "size": 0,
        "aggs": {
            "group_by_state": {
                "terms": {"field": "state.keyword"},
                "aggs": {"average_balance": {"avg": {"field": "balance"}}}
            }
        }
    }
    ```

* `average_balance` aggregation nested inside `group_by_state`
* common pattern for aggregations is arbitrary nesting to do pivoted summarizations
* Sorting on average balance in descending order:

    ```
    GET /bank/_search
    {
        "size": 0,
        "aggs": {
            "group_by_state": {
                "terms": {"field": "state.keyword", "order": {"average_balance": "desc"}},
                "aggs": {"average_balance": {"avg": {"field": "balance"}}}
            }
        }
    }
    ```

* Grouping by age brackets, then gender, then average account balance per bracket per gender:

    ```
    GET /bank/_search
    {
        "size": 0,
        "aggs": {
            "group_by_age": {
                "range": {
                    "field": "age",
                    "ranges": [
                        {"from": 20, "to": 30},
                        {"from": 30, "to": 40},
                        {"from": 40, "to": 50}
                    ]
                },
                "aggs": {
                    "group_by_gender": {
                        "terms": {"field": "gender.keyword"},
                        "aggs": {"average_balance": {"avg": {"field": "balance"}}}
                    }
                }
            }
        }
    }
    ```


# Set up Elasticsearch

From https://www.elastic.co/guide/en/elasticsearch/reference/6.7/setup.html

TODO: Read this.

# API Conventions

From https://www.elastic.co/guide/en/elasticsearch/reference/6.7/api-conventions.html

## Multiple Indices

* Most APIs that refer to an `index` parameter support execution across multiple indices.
* Notation is `index1,index2,index3`, or `_all`
* May also use wildcards, like `test*`, `te*st`, etc.
* Can exclude indices: `test*,-test3`
* All multi indices APIs support these query string params:
    * `ignore_unavailable` - controls whether to ignore if any specified indices are unavailable.
    * `allow_no_indices` - whether to fail if a wildcard indices expression results in no concrete indices
    * `expand_wildcards` - controls what kind of concrete indices that wildcard expressions can expand to
        * `closed` - only expand to closed indices
        * `open` - only expand to open indices
        * `open,closed` - expand to all indices
        * `none` - wildcard expansion disabled
        * `all` - equivalent to `open,closed`
* Defaults for those settings depend on the API in use.

## Date math support in index names

* Date math index name resolution lets you search a range of time-series indices rather than searching all time-series indices and filtering the results, or maintaining aliases.
* Ex: searching for errors in daily logs, use a date math name template to restrict search to past two days
* Almost all APIs with an `index` parameter support date math in that value.
* Date math index name format:

    ```
    <static_name{date_math_expr{date_format|time_zone}}>
    ```

* Parts:
    * `static_name` - static text part of the name
    * `date_math_expr` - dynamic date math expression
    * `date_format` - optional format, defaults to `YYYY.MM.dd`
    * `time_zone` - optional tz, defaults to `utc`
* Date math expressions resolved locale-independent. Only uses gregorian calendar.
* Must enclose date math index name expressions in angle brackets
* All special characters must be URL encoded
* Example:

    ```
    # GET /<logstash-{now/d}>/_search
    GET /%3Clogstash-%7Bnow%2Fd%7D%3E/_search
    {"query": {"match": {"test": "data"}}}
    ```

* Examples of expressions and resolutions, given a current time of `2024-03-22T12:00:00+00:00`
    
    ```
    <logstash-{now/d}>                      ->  logstash-2024.03.22
    <logstash-{now/M}>                      ->  logstash-2024.03.01
    <logstash-{now/M{YYYY.MM}}>             ->  logstash-2024.03
    <logstash-{now/M-1M{YYYY.MM}}>          ->  logstash-2024.02
    <logstash-{now/d{YYYY.MM.dd|+12:00}}>   ->  logstash-2024.03.23
    ```

* To use `{` and `}` in the static part of an index name, escape with backslash

    ```
    <elastic\{ON\}-{now/M}>     ->  elastic{ON}-2024.03.01
    ```

## Common Options

* `?pretty=true` makes JSON formatted
* `?format=yaml` makes it return YAML
* `?human=true` returns stats as things like `1h` for time, or `1kb` for size
* Most parameters which accept a formatted date value, like `gt` and `lt` in range queries and `to` and `from` in daterange aggregations, understand date math.
* Expressions start with an anchor date, either `now` or a date string ending with `||`
* Optionally followed by one or more math expressions:
    * `+1h` - add one hour
    * `-1d` - subtract one day
    * `/d` - round down to nearest day
* Supported units are different from time units for durations:
    * `y` - years
    * `M` - months
    * `w` - weeks
    * `d` - days
    * `h` - hours
    * `H` - hours
    * `m` - minutes
    * `s` - seconds
* Examples:
    * `now+1h`
    * `now-1h`
    * `now-1h/d`
    * `2001.02.01\|\|+1M/d`
* All REST APIs take a `filter_path` parameter that can reduce the response
* Takes a comma separated list of filters expressed with dot notations

    ```
    GET /_search?q=elasticsearch&filter_path=took,hits.hits,hits._id,hits.hits._score
    
    # response:

    {"took": 3, "hits": {"hits": [{"id": "0", "_score": 1.6342432}]}}
    ```

* Supports the wildcard star to match any field or part of a field's name

    ```
    GET /_cluster/state?filter_path=metadata.indices.*.stat*
    ```

* Double star can include fields without knowing exact path of the field. Lucene version of every segment:

    ```
    GET /_cluster/state?filter_path=routing_table.indices.**.state
    ```

* Exclude fields by prefixing with `-`

    ```
    GET /_count?filter_path=-_shards
    ```

* Can use both inclusive and exclusive filters in one expression
* Sometimes the raw value of a field is returned, like `_source`
* If you want to filter `_source` fields, consider combining already existing `_source` parameter with the `filter_path` parameter:

    ```
    POST /library/book?refresh
    {"title": "Book #1", "rating": 200.1}
    POST /library/book?refresh
    {"title": "Book #2", "rating": 1.7}
    POST /library/book?refresh
    {"title": "Book #3", "rating": 0.1}

    GET /_search?filter_path=hits.hits._source&_source=title&sort=rating:desc

    # response:

    {"hits": {"hits": [{"title": "Book #1"},
                       {"title": "Book #2"},
                       {"title": "Book #3"}]}
    }
    ```

* The `flat_settings` flag affects rendering of the lists of settings. When true, settings are returned in a flat format. When false, settings returned in a more human readable format, as nested json rather than dot separated keys with values.
* All REST params use underscore casing
* All boolean params can use `false` and `"false"`, `true` and `"true"` interchangeably
* You can give numbers as strings.
* Durations must specify units:
    * `d` - days
    * `h` - hours
    * `m` - minutes
    * `s` - seconds
    * `ms` - milliseconds
    * `micros` - microseconds
    * `nanos` - nanoseconds
* Byte sizes use powers of 1024, so `1kb` is 1024 bytes
    * `b` - bytes
    * `kb` - kilobytes
    * `mb`
    * `gb`
    * `tb`
    * `pb`
* Unit-less quantities can be human readable shortened with suffixes
    * `k` - kilo
    * `m` - mega
    * `g` - giga
    * `t` - tera
    * `p` - peta
* Distance units
    * `mi` or `miles`
    * `yd` or `yards`
    * `ft` or `feet`
    * `in` or `inch`
    * `km` or `kilometers`
    * `m` or `meters`
    * `cm` or `centimeters`
    * `mm` or `millimeters`
    * `NM`, `nmi` or `nauticalmiles`
* Some queries allow fuzzy matching, using the `fuzziness` parameter.
    * For `text` or `keyword` fields, `fuzziness` is a Levenshtein Edit Distance--number of one character changes that need to be made to one string to make it the same as another.
    * Can be specified as an integer `0..2`, which is the max number of Levenshtein Edits
    * Can also be `AUTO`, to generate an edit distance based on the length of the term.
    * You can also give low and high distance args as `AUTO:[low],[high]`
    * If not specified, defaults to `AUTO:3,6`, which means
        * `0..2` - must match exactly
        * `3..5` - one edit allowed
        * `>5` - two edits allowed
* Stack traces aren't enabled by default, but you can set `error_trace=true`
* If you're using a lib that won't accept a request body for non-POST requests, you can pass the request body as the `source` query string parameter. If you do so, pass `source_content_type` with a media type value indicating the format of hte source.
* The content type in a request body has to be specified using the content-type header
* Value must map to one of the supported formats. Most APIs support:
    * JSON
    * YAML
    * CBOR
    * SMILE
* Bulk and multi-search APIs support
    * NDJSON
    * JSON
    * SMILE
* When using the `source` query string param, have to specify `source_content_type`

## URL-Based access control

* For users using a proxy with URL-based access control, multi-search, multi-get, and bulk requests can be tricky. They let you specify an index in the URL and on each individual request in the request body.
* To prevent the user from overriding the index specified in the URL, add this setting to the `elasticsearch.yml` file:

    ```
    rest.action.multi.allow_explicit_index: false
    ```

* default is true, when false ES will reject requests with an explicit index in the body

# Document APIs

From https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs.html

## Reading and Writing Documents

### Introduction

* Each index is in shards, each shard can have many copies
* Copies form a replication group, have to be kept in sync when stuff is added or removed
* ES data replication model is based on 'primary-backup' model
* Has a single copy from a replication group that's the primary shard, with others being replica shards
* Primary is the main entry point for all indexing operations, and validates for correctness
* Once an index op is accepted by the primary, the primary is also responsible for replicating it out

### Basic write model

* Every indexing op is first resolved to a replication group via routing, typically based on document id
* Once the replication group is determined, the op is forwarded internally to the current primary shard of that group.
* Since shards can be off-line, ES maintains a list of shard copies that should receive replications
* This is the `in-sync copies` list, maintained by the master node.
* Those are the good shard copies, guaranteed to have processed all index and delete ops that have been acknowledged to the user.
* The primary is responsible for maintaining this, and has to replicate all ops to each copy in the set
* Primary shard follows this basic flow:
    1. Validate incoming operation, reject if structurally invalid
    1. Exection operation locally by indexing or deleting relevant document. This also validates the content of fields and rejects if necessary.
    1. Forward the operation to each replica in the current in-sync copies set. If there are multiple replicas this happens in parallel.
    1. Once all replicas have successfully performed the operation and responded to the primary, the primary acknowledges the successful completion of the request to the client.

### Failure Handling

* Stuff can go wrong during indexing, and the primary has to respond to that.
* If the primary itself fails, the node hosting the primary sends a message to the master about it.
* Indexing ops will wait up to 1 minute by default for the master to promote a replica to be the new primary
* Ops are then forwarded to the new primary.
* Master also monitors health of ndoex, may proactively demote a primary. Typically happens if the node with the primary is partitioned from the cluster due to networking issues.

### Basic Read Model

* Reads can be lightweight ID lookups or heavy search queries
* A single in-sync copy is sufficient to serve read requests
* When a node gets a read request it forwards it to the relevant shards, collates responses, and responds to the client.
* That node is the 'coordinating node' for the request
* Basic flow:
    1. Resolve read requests to relevant shards
    1. Select an active copy of each relevant shard from the shard replication group
    1. Send shard level read requests to the selected copies
    1. Combine results and respond (skipped for ID lookups)

### Shard Failures

* If a shard fails to respond to a read request, the coordinating node sends the request to another shard copy in the same replication group.
* These APIs respond with partial results if 1+ shards fail:
    * search
    * multi search
    * bulk
    * multi get
* Responses with partial results still give 200 OK, but failures are indicated by `timed_out` and `_shards` fields

### A Few Simple Implications

* Read and write requests can be concurrent, which implies:
    * reads are efficient--each read op is performed once for each relevant replication group; only in failure conditions do multiple copies of the same shard execute the same search
    * read unacknowledged - since the primary first indexes locally then replicates the request, it's possible for a concurrent read to see a change before that change is acknowledged
    * two copies by default - model can be fault tolerant with only two copies of the data, which is different from a quorum based system where min copies is 3

### Failures

* Failures can make these possible:
    * single shard slows down indexing, because the primary waits for all in-sync copies set during each operation
    * dirty reads - isolated primary can expose writes that will not be acknowledged

## Index API

* Adds or updates a typed JSON doc in a specific index
* `_shards` portion of response gives info about replication of the index op:
    * `total` - how many shard copies index op should execute on
    * `successful` - number of shard copies it succeeded on
    * `failed` - array of replication errors in case an index op failed on a replica shard

### Automatic Index Creation

* Automatically creates an index if it doesn't already exist, applies an index templates that are configured
* Also creates a dynamic type mapping for the specified type if one doesn't exist

### Operation Type


