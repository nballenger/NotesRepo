# Notes on Google Analytics Measurement Protocol

From [https://developers.google.com/analytics/devguides/collection/protocol/v1/reference](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)

# Measurement Protocol Reference

* Two parts to sending data to GA using the Measurement Protocol:
    * transport - where and how you send data
    * payload - data sent

## Transport

* You send data via HTTP requests to `https://www.google-analytics.com/collect`
* All data should be sent via HTTPS
* May be sent by GET or POST

### Using POST

* POST allows for a larger payload
* Issue a request like

    ```
    User-Agent: user_agent_string
    POST https://www.google-analytics.com/collect
    payload_data
    ```

* Where
    * `user_agent_string` is a formatted UA string used to compute browser, platform, and mobile capabilities
    * `payload_data` - request body. Must include exactly 1 URI encoded payload, may not exceed 8192 bytes
    * IP Address - implicitly sent in the HTTP request, used for computing geo/network dimensions

### Using GET

* If you cannot send POST, you can send GET to the same endpoint

    ```
    GET /collect?payload_data HTTP/1.1
    Host: https://www.google-analytics.com
    User-Agent: user_agent_string
    ```

* Payload sent as URI escaped query parameters, length of entire encoded URL not to exceed 8000b

### Cache Busting

* If a request is cached, subsequent requests for the same URI may be retrieved from cache and not sent to GA. To bust the cache, use the `z` parameter with a random number.
* Add it as the last parameter of the payload.

### Response Codes

* Protocol returns a `2xx` code if the HTTP request was received
* Does not return errors on malformed payload, or if the payload was incorrect or not processed by GA
* If you do not get a `2xx` code, do not retry the request--stop and correct errors in the request.

### Payload Data

* All data collecting using the MP is sent as a payload
* Payload resembles a query string where each param is a kv pair, `=` separated, `&` delimited
* Each payload has rules for:
    * required values
    * URI encoding
    * parameters that can be sent togetehr
    * parameter length
* Each parameter has a specific type that requires a particular format.
* Required values for all hits, must be in every payload:
    * Protocol Version, `v=1`
    * Tracking id, `tid=UA-XXXXX-Y`
    * Client id, `cid=xxxxx` (id unique to a specific user)
    * Hit type, `t=pageview` (type of interaction collected for user)
* URL Encoding Values
    * All values must be UTF-8 and URL encoded
    * Incorrectly encoded characters are replaced with `xFFFD` replacement char
* Required values for certain hit types
    * Some params have their own requirements
* Maximum length
    * Some text values have max lengths
    * If anything exceeds it, it's truncated

### Supported Data Types

* Each data field in the MP belongs to a type, with its own validation rules
* If any value doesn't validate, it's ignored
* If a required param is malformed, the entire payload is not processed
* Supported data types:
    * Text
    * Currency
    * Boolean
    * Integer
    * Number
* Text
    * represents strings
    * All leading and trailing whitespace is trimmed
    * internal runs of 2+ whitespace characters are truncated to 1
    * transform applied before any truncation of the whole thing
* Currency
    * represents total value of a currency
    * decimal delimited for whole/fractional breakpoint
    * precision is up to 6 places
    * Once the value is sent, all text is removed up to the first digit, the `-` character, or the `.` character, so `$-55.00` becomes `-55.00`
* Boolean
    * Valid values are `1` (True) and `0` (False)
* Integer - stored as a signed int64
* Number - an integer or a floating point number

# Measurement Protocol Parameter Reference

* List of all parameters for MP

## General

* Protocol version, required for all hit types, should be `v=1`
* Tracking id / web property id, required for all hit types: `tid=UA-XXXXX-Y`
* Anonymize IP, optional, anonymizes IP of sender: `aip=`, `aip=0`, `aip=1` all trigger it
* Data source, optional, data source of hit, `ds=[web|app|custom]`
    * `web` = analytics.js
    * `app` = mobile sdk
    * custom can be whatever URI encoded string
* Queue time, optional, time delta in ms between the hit being reported and when the hit was sent
* Cache buster, optional, `z=sometext`, use integers to bust cache, report it last

## User

* Client ID (text) - `cid`
    * Optional, required if `uid` is not specified in the request
    * Anonymously identifies a user, device, or browser instance
    * Generally stored as first party cookie with 2 year expiry
    * Example: `cid=<UUID_STRING>`
    * No default, no max length, supported for all hit types
* User ID (text) - `uid`
    * Optional, required if `cid` not specified
    * Intended to be a known identifier for a user, provided by site owner
    * Must not be PII itself
    * Should never be persisted in GA cookies or other analytics provided storage
    * No default, no max length, supported for all hit types

## Session

* Session Control (text) - `sc`
    * Controls session duration
    * Value of `start` forces a new session to start with this hit
    * `end` forces current session to end with this hit
    * No other allowed values, no default or max length, supported for all hit types
* IP Override (text) - `uip`
    * IP address of the user in IPv4 or IPv6 format
    * Always anonymized as though `aip` had been used
    * No default, no max length, supported for all hit types
* User Agent Override (text) - `ua`
    * User agent of the browser
    * GA has libraries to identify real user agents, making one up can break at any time
    * No default, no max length, supported for all hit types
* Geographic Override (text) - `geoid`
    * Geolocation of user
    * Should be a two letter country code or a criteria id representing a city or region
    * Takes precedent over any location derived from IP, including IP override
    * Invalid code results in geo dimensions not set
    * No default, no max length, supported for all hit types

## Traffic Sources

* Document Referrer (text) - `dr`
    * Optional, specifies which referral source brought traffic to the site
    * Used to compute the traffic source
    * Value should be a URL, URI encoded
    * No default, max 2048b, supported for all hit types
* Campaign Name (text) - `cn`
    * Optional, specifies campaign name
    * No default, 100b max, supported for all hit types
* Campaign Source (text) `cs`
    * Optional, specifies campaign source
    * No default, 100b max, supported for all hit types
* Campaign Medium (text) - `cm`
    * Optional, specifies campaign medium
    * No default, 50b max, supported for all hit types
* Campaign Keyword (text) - `ck`
    * Optional, specifies campaign keyword
    * No default, 500b max, supported for all hit types
* Campaign Content (text) - `cc`
    * Optional, specifies campaign content
    * No default, 500b max, supported for all hit types
* Campaign ID (text) - `ci`
    * Optional, specifies campaign id
    * No default, 100b max, supported for all hit types
* Google Ads Id (text) - `gclid`
    * Optional, specifies google ads id
    * No default, no max length, supported for all hit types
* Google Display Ads Id (text) - `dclid`
    * Optional, specifies google display ads id
    * No default, no max length, supported for all hit types

## System Info

* Screen Resolution (text) - `sr`
    * Optional, specifies screen resolution
    * No default, 20b max, supported for all hit types
    * Example: `sr=800x600`
* Viewport Size (text) - `vp`
    * Optional, specifies viewable area of browser/device
    * No default, 20b max, supported for all hit types
    * Example: `vp=123x456`
* Document Encodign (text) - `de`
    * Optional, specifies character set of encoded page/document
    * Default `UTF-8`, 20b max, supported for all hit types
* Screen Colors (text) - `sd`
    * Optional, specifies screen color depth
    * No default, 20b max, supported for all hit types
    * Example: `sd=24-bits`
* User Language (text) - `ul`
    * Optional, specifies the language
    * No default, 20b max, supported for all hit types
* Java Enabled (boolean) - `je`
    * Optional, specifies whether java was enabled
    * No default, no max length, supported for all hit types
* Flash Version (text) - `fl`
    * Optional, specifies flash version
    * No default, 20b max, supported for all hit types

## Hit

* Hit Type (text) - `t`
    * Required for all hit types
    * Must be one of
        * `pageview`
        * `screenview`
        * `event`
        * `transaction`
        * `item`
        * `social`
        * `exception`
        * `timing`
    * No default, no max length, supported for all hit types
* Non-interaction Hit (boolean) - `ni`
    * Optional, specifies that hit be considered non-interactive
    * No default, no max length, supported for all hit types

## Content Information

* Document Location URL (text) - `dl`
    * Optional, used to send full URL of the page on which content resides
    * Can use `dh` and `dp` params to override hostname and path+query portions
    * JS clients determine the parameter using concat of `document.location.origin` + `document.location.pathname` + `document.location.search` browser params
    * Remove any user auth or other private info from URL if present
    * For `pageview` hits, either `dl` or both `dh` and `dp` have to be specified for the hit to be valid
    * No default, 2048b max, supported for all hit types
* Document Host Name (text) - `dh`
    * Optional, specifies hostname from which content was hosted
    * No default, 100b max, supported for all hit types
* Document Path (text) - `dp`
    * Optional, path portion of page URL
    * Should begin with `/`
    * For `pageview` hits, either `dl` or both of `dh` and `dp` must be specified
    * No default, 2048b max, supported for all hit types
* Document Title (text) - `dt`
    * Optional, title of page/document
    * No default, 1500b max, supported for all hit types
* Screen Name (text) - `cd`
    * Required for `screenview` hit type
    * Optional on web properties, required on mobile properties for screenview hits
    * Used for the Screen Name of the screenview hit
    * On web, defaults to unique URL of the page by either using `dl` as is, or assembling from `dh` and `dp`
    * No default, 2048b max, supported for `screenview`
* Content Group (text) - `cg<groupIndex`
    * Optional
    * You can have up to 5 content groupings, index 1-5
    * Each content grouping can have up to 100 content groups
    * Value of a content group is hierarchical text, `/` delimited
    * Leading and trailing slashes removed, repeated slashes truncated
    * No default, 100b max, supported for all hit types
* Link ID (text) - `linkid`
    * Optional, id of clicked DOM element, used to disambiguate multiple links to the same URL in in-page analytics reports when Enhanced Link Attribution is enabled for the property
    * No default, no max length, supported for all hit types

## App Tracking

* Application Name (text) - `an`
    * Optional, specifies application name
    * Required for any hit with app related data (app version, id, app installer id)
    * Optional for hits to web properties
    * No default, 100b max, supported for all hit types
* Application ID (text) - `aid`
    * Optional, application identifier
    * No default, 150b max, supported for all hit types
* Application Version (text) - `av`
    * Optional, specifies application version
    * No default, 100b max, supported for all hit types
* Application Installer ID (text) - `aiid`
    * Optional, app installer identifier
    * No default, 150b max, supported for all hit types

## Event Tracking
