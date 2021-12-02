# Notes on OPDS Documentation

From https://opds.io/learn.html

* Three building blocks of OPDS:
    * Catalog - a way to browse, search, and acquire content from a collection
    * Shelf - a place to find content you've bought, borrowed, or subscribed to
    * Callback - message shared between content provider and OPDS client, that does work like downloading content, sharing metadata, providing a catalog, etc.

## Catalog

From https://opds.io/catalog.html

* Designed to be uniquely curated by their creators
* Provides deep navigation via links and faceted browsing
* 1. Navigation:
    * each item is a link to another place in the catalog
    * content providers can design the navigation however they want
* 2. Acquisition:
    * Acquisition collections list metadata about content items, provide links to them
    * Required metadata includes title, author, description, and acquisition link
* Additional Features:
    * OPDS catalogs are also structured around links, either at a collection or item level
    * Links in a content item provide additional exploration navigation
    * Links in a collection can provide either related collections or ways to filter an acquisition collection

## Callback

From https://opds.io/callback.html

* A message between the content provider and an OPDS client
* Not much info here.

# Specifications

* v1.x is based on Atom and Dublin Core
* 2.x is based on JSON-LD and schema.org

## Catalog 1.2

From https://specs.opds.io/opds-1.2

Published 2018-11-11, edited by Hadrien Gardeur (Feedbooks) and Leonard Richardson (NYPL)

### 1. Overview

#### 1.1 Introduction

* Stands for Open Publication Distribution System
* Catalog format is for syndication of electronic publications based on Atom and HTTP
* OPDS Catalogs enable discovery (search, browse) and acquisition (direct download, loan, vending)
* A Catalog is a set of 1+ Atom Feeds, which are listings of Atom Entries
* The feeds come in two types:
    * Navigation - creates a browsing hierarchy
    * Acquisition - lists available electronic publications
* Each Atom Entry in an Acquisition Feed has metadata and acquisition info
* The included entries can be minimal subserts of the complete metadata that link to more extensive URIs
* "OPDS Catalogs may be aggregated and combined into larger OPDS Catalogs."

#### 1.2 Terminology

* Acquisition Feed - atom feed whose entries are exclusively OPDS Catalog Entries
* Acquisition Link - `atom:link` element with a rel starting with `http://opds-spec.org/acquisition`, refers to the Resource which holds the content of the described Publication, or the Resource through which it may be acquired for any OPDS Catalog Entry
* Complete Catalog Entry - a catalog entry including all known metadata, referenced by a Partial Catalog Entry
* Facet - subset or alternate order for an Acquisition Feed. In an OPDS Catalog, a Facet is represented as an `atom:link` in an Acquisition Feed
* IRI - internationalized resource identifier
* Navigation Feed - atom feed whose entries are NOT Catalog Entries, but instead links to other Navigation Feeds, Acquisition Feeds, or other Resources to establish a hierarchical, browsable catalog presentation
* OPDS Catalog - all the Atom Feeds (Acquisition and Navigation) and Entries (Partial and Complete) following this specification published together to describe a consolidated group of available Publications
* OPDS Catalog Entry - atom entry that provides a representation of an available Publication, and includes an Acquisition Link. Serilaized as OPDS Catalog Entry Documents
* OPDS Catalog Entry Document - formal name for the xml docs that are a refinement of `atom:entry`
* OPDS Catalog Feed Document - formal name for the xml docs that are a refinement of `atom:feed`
* OPDS Catalog Root - atom feed that represents either the complete OPDS catalog (single Acquisition Feed) or the atom feed that starts a set of Navigation Feeds
* Partial Catalog Entry - entry that includes required metadata, links to the complete catalog entry
* Publication - an electronic document, typically available as a single file
* relation - refers to `rel` attribute of an `atom:link`
* Representation - an entity included with a request or response, per RFC2616
* Resource - network accessible data object or service identified by an IRI
* URI - uniform resource identifier

#### 1.3 Conformance Statements

* Following keywords are to be interpreterd per RFC2119: MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL

### 2. OPDS Catalog Feed Documents

* OPDS Feeds are Atom Feeds
* They serve two purposes:
    * Naviagation Feeds - create a browsable hierarchy of Feed Documents / other Resources
    * Acquisition Feeds - collect a set of OPDS Catalog Entries
* While nav feeds provide a suggested hierarchy, Feed Documents MAY contain other relations that allow for other methods of consumption and display
* Every Catalog Feed Document MUST be an Acquisition or Navigation Feed.
* An Acquisition Feed can be identified by the presence of Acquisition Links in each Atom Entry

#### 2.1 OPDS Catalog Root

* The Catalog Root is the top level Catalog Feed document
* It's either a single Acquisition Feed or a set of Navigation Feeds
* Every Catalog MUST have one-and-only-one Catalog Root
* External links to the OPDS Catalog Resource SHOULD use the IRI of the Catalog Root
* Each Feed Document SHOULD contain an `atom:link` element with a rel of `start` that reference the root

#### 2.2 Navigation Feeds

* Nav feeds have entries that create a suggested hierarchy for presentation and browsing
* MUST NOT contain Catalog Entries
* Contains Atom Entries that link to other Navigation or Acquisition Feeds / other Resources
* Links to nav feeds MUST use the `type` attribute `application/atom+xml;profile=opds-catalog;kind=navigation`
* catalog providers SHOULD choose the best relation for each nav feed based on the relations in the section OPDS Catalog Relations
* The rel `subsection` SHOULD be used if no other relation is more appropriate
* Example skeleton structure:

    ```XML
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
        <id>urn:uuid:whatever</id>
        <link rel="self" href="/opds-catalogs/root.xml" type="type-string[...];kind=navigation"/>
        <link rel="start" href="/opds-catalogs/root.xml" type="type-string[...];kind=navigation"/>
        <title>OPDS Catalog Root</title>
        <updated>2010-01-10T10:03:10Z</updated>
        <author>
            <name>Spec Writer</name>
            <uri>http://opds-spec.org</uri>
        </author>

        <entry>
            <title>Popular Publications</title>
            <link rel="http://opds-spec.org/sort/popular"
                  href="/opds-catalogs/popular.xml"
                  type="type-string[...];kind=acquisition"/>
            <updated>2010-01-10T10:03:10Z</updated>
            <id>urn:uuid:whatever</id>
            <content type="text">Popular publications from this catalog.</content>
        </entry>
        <entry>
            <title>New Publications</title>
            <link rel="http://opds-spec.org/sort/popular"
                  href="/opds-catalogs/new.xml"
                  type="type-string[...];kind=acquisition"/>
            <updated>2010-01-10T10:03:10Z</updated>
            <id>urn:uuid:whatever</id>
            <content type="text">Recent publications from this catalog.</content>
        </entry>
    </feed>
    ```

#### 2.3 Acquisition Feeds

* An Acquisition Feed is an OPDS Catalog Feed Document that collects Catalog Entries into a single, ordered set
* Simplest complete catalog would be a single Acquisition Feed listing all of the available OPDS Catalog Entries
* In more complex catalogs Acquisition Feeds are used to present/organize sets of related entries for browsing/discovery by clients and aggregators
* Links to Acquisition Feeds MUST use the `type` `application/atom+xml;profile=opds-catalog;kind=acquisition`
* Example structure:

    ```XML
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom"
          xmlns:dc="http://purl.org/dc/terms/"
          xmlns:opds="http://opds-spec.org/2010/catalog">
        <id>urn:uuid:whatever</id>

        <link rel="related"
              href="/opds-catalogs/vampire.farming.xml"
              type="type-string[...];kind=acquisition"/>
        <link rel="self"
              href="/opds-catalogs/unpopular.xml"
              type="type-string[...];kind=acquisition"/>
        <link rel="start"
              href="/opds-catalogs/root.xml"
              type="type-string[...];kind=acquisition"/>
        <link rel="up"
              href="/opds-catalogs/root.xml"
              type="type-string[...];kind=acquisition"/>

        <title>Unpopular Publications</title>
        <updated>2010-01-10T10:03:10Z</updated>
        <author>
            <name>Spec Writer</name>
            <uri>http://opds-spec.org</uri>
        </author>

        <entry>
            [...]
        </entry>
    </feed>
    ```

### 2.4 Listing Acquisition Feeds

* OPDS Catalog Feed Documents (esp. acquisition feeds) can have lots of Entries
* A client might get overwhelmed by a giant feed doc
* So servers MAY respond to GET requests for a feed with a paginated response
* That's a partial list of entries with a link to the next partial feed if it exists
* Catalog providers SHOULD use partial catalog entries in all Acquisition Feeds except Complete Acquisition Feeds
* Complete feeds are intended for crawling, and are referenced with the rel `http://opds-spec.org/crawlable`
* Client MUST NOT assume that a catalog entry returned in an acquisition feed is a full representation of the entry's resource

### 2.5 Complete Acquisition Feeds

* A provider MAY provide a single, consolidated Acquisition Feed with the complete representation of every unique Entry Document, to facilitate crawling and aggregation
* Complete feeds SHOULD NOT be paginated unless they are extremely large
* Each entry MUST be ordered by `atom:updated`, with most recent updates coming first
* If available, each Feed Document in the Catalog SHOULD contain an `atom:link` element with a relation of `http://opds-spec.org/crawlable` that references the Complete Acquisition Feed Resource
* A complete acquisition feed MUST include a `fh:complete` element from RFC5005, unless pagination is required
* Providers SHOULD use a compressed Content-Encoding when transmitting complete feeds over HTTP
* Provider MUST include Complete Catalog Entries in a Complete Acquisition Feed

### 2.6 Element Definitions

* The `atom:feed` element is the document/top level element of a catalog feed document
* It's a container for metadata, hierarchy, and Publications associated with the catalog
* Its element children are metadata, followed by zero or more `atom:entry` children
* Following child elements are refined by this spec:
    * Catalog Feed Documents SHOULD contain one `atom:link` element with a `rel` of `self
    * That's the preferred URI for retrieving the `atom:feed` representing the Catalog Feed Document

## 3 Search

* An OPDS Catalog MAY provide a search facility through an OpenSearch description document
* Links to those description documents MUST use the `search` relation value
* also MUST use the `application/opensearchdescription+xml` media type

    ```XML
    <link rel="search" href="search.xml" type="application/opensearchdescription+xml"/>
    ```

* In the description document, the search interface MUST use the media type associated with OPDS catalogs:

    ```XML
    <Url type="application/atom+xml;profile=opds-catalog;kind=acquisition"
         template="http://example.com/search?q={searchTerms}" />
    ```

* An OPDS catalog MAY also provide more advanced possibilities for its search endpoint
* That will use 1+ fully qualified parameters from the Atom namespace, such as
    * `atom:author`
    * `atom:contributor`
    * `atom:title`
* Feed Documents MAY include elements from the OpenSearch namespace such as `opensearch:totalResults` or `opensearch:itemsPerPage` in OpenSearch responses
* To provide a search endpoint that supports both basic / keyword and advanced search, a catalog could provide the following template in its OpenSearch Description document:

    ```XML
    <Url type="application/atom+xml;profile=opds-catalog"
         xmlns:atom="http://www.w3.org/2005/Atom"
         template="http://example.com/search?q={searchTerms}&amp;author={atom:author}&amp;contributor={atom:contributor}&amp;title={atom:title}" />
    ```

* That template would let an OPDS client support queries like
    * `http://example.com/search?q=gardening`
    * `http://example.com/search?q=gardening&author=smith`
    * `http://example.com/search?author=drucker`
    * `http://example.com/search?author=ferriss&title=four`

## 4 Facets

* An acquisition feed MAY offer multiple links to reorder the publications listed in the feed, or limit them to a subset
* There is one new relation defined in this spec, to identify such links as Facets
* If the rel is `http://opds-spec.org/facet`, it's an acquisition feed with a subset or alternative order
* Links using this rel MUST only appear in acquisition feeds
* Example:

    ```XML
    <link rel="http://opds-spec.org/facet"
          href="sci-fi"
          title="Science-Fiction"
          opds:facetGroup="Categories"
          opds:activeFacet="true" />

    <link rel="http://opds-spec.org/facet"
          href="/romance"
          title="Romance"
          opds:facetGroup="Categories"
          thr:count="600" />

    <link rel="http://opds-spec.org/facet"
          href="/thrillers"
          title="Thrillers"
          opds:facetGroup="Categories"
          thr:count="1200" />

    <link rel="http://opds-spec.org/facet"
          href="/sci-fi/english"
          title="English"
          opds:facetGroup="Language"
          opds:activeFacet="true" />

    <link rel="http://opds-spec.org/facet"
          href="/sci-fi/french"
          title="French"
          opds:facetGroup="Language"
          thr:count="40" />
    ```

* The `opds:facetGroup` attribute
    * Facets MAY be grouped together by the provider using an `opds:facetGroup` attribute
    * The value is the name of the group
    * A facet MUST NOT appear in more than a single group
* The `opds:activeFacet` attribute
    * A Facet is active if the attribute associated to the Facet is already being used to filter Publications in the current Acquisition Feed
    * The OPDS Catalog provider SHOULD indicate that a Facet is active using the `opds:activeFacet` set to `true`
    * If the facet is not active, don't include the attribute
    * In a group of Facets, a provider MUST NOT mark more than one facet as active
* The `thr:count` attribute
    * provider MAY give an additional hint about the number of items expected in the acquisition feed, if an opds client follows a link
    * provider MAY use `thr:count` to provide that

## 5. OPDS Catalog Entry Documents

* Entry docs are Atom Entry documents
* Provide a complete representation of the metadata/data for a Publication
* Each Catalog Entry Document MUST include at least one Acquisition Link

### 5.1 Metadata

#### 5.1.1 Relationship between Atom and Dublin Core Metadata

* Providers are encouraged to include metadata from the DCMI metadata terms whenever appropriate
* Some elements defined in DCTERMS overlap in meaning with similar elements in Atom
* In general OPDS Catalog Entries prefer the Atom elements over the DCTERMS elements
* Rules to use for providers when choosing elements:
    * Entries MUST be identified by an `atom:id`
    * 1+ `dc:identifier` elements SHOULD be used if appropriate metadata is available, but MUST NOT identify the OPDS Catalog Entry
    * Entries MUST include an `atom:updated` element
    * A `dc:issued` element SHOULD be used to indicate first publication date, and MUST NOT represent any date related to the OPDS Catalog Entry
    * Entries MUST include an `atom:title` element, and MUST NOT use `dc:title`
    * Entries SHOULD use `atom:author` and SHOULD NOT use `dc:creator`
    * Entries SHOULD use `atom:category` for category, keywords, key phrases, classification codes; SHOULD NOT use `dc:subject`
    * Entries SHOULD use `atom:rights` and SHOULD NOT use `dc:rights`
    * Entries SHOULD use `atom:summary` and or `atom:content` and SHOULD NOT use `dc:description` or `dc:abstract`
    * Entries MAY use `atom:contributor` to represent contributors other than the creators
    * Entries MAY use `atom:published` to indicate when the entry was first accessible
* All metadata elements required by Atom are required in Entries/Feeds
* Following Atom 4.2.6, the content of an `atom:id` MUST NOT change when the entry is "relocated, migrated, syndicated, republished, exported, or imported" and MUST "be created in a way that assures uniqueness"

#### 5.1.2 Partial and Complete Catalog Entries

* Partial entries include only critical metadata elements to reduce document size
* A partial entry MUST include an `alternate` link relation referencing the complete resource
* That `atom:link` MUST use `type=application/atom+xml;type=entry;profile=opds-catalog`
* Partial entries SHOULD include, if available:
    * `atom:category`
    * `atom:contributor`
    * `atom:rights`
    * `opds:price`

#### 5.1.3 Summary and Content

* Entries use `atom:content` and `atom:summary` to describe a Publication
* That's distinct from Atom which uses `atom:content` for the content of the entry
* Catalog Entries reference a document with the publication's content via acquisition links
* OPDS Catalog Entries SHOULD include either `atom:summary` or `atom:content`, or both, to provide a description, summary, abstract, or excerpt of hte Publication
* An `atom:summary` element in a catalog entry MUST use a `type` of `text`
* The content MUST NOT contain child eleemnts
* Content of `atom:summary` SHOULD NOT duplicate content of `atom:title` or `atom:content`
* An `atom:content` element in a Catalog Entry either contains or links to a description, summary, abstract, or excerpt of the publication.
* If an Entry includes both, the `atom:content` SHOULD NOT be included in the partial version of the Entry
* Both elements SHOULD be in the complete version

### 5.2 Catalog Entry Relations

* Entry docs SHOULD include links to related resources
* This spec defines new rels for linking to entry documents
* providers are encouraged to use rels from RFC5988 inside OPDS entry documents where appropriate

#### 5.2.1 Acquisition Relations

* Acquisition relations describe the extent of the content referred to by an Acquisition Link or the manner in which that Resource may be acquired.
* Defines 6 rels, all starting with `http://opds-spec.org/acquisition`
    * `http://opds-spec.org/acquisition` - generic relation, indicating that the complete representation of the resource may be retrieved
    * `http://opds-spec.org/acquisition/open-access` - indicates that the complete representation of the resource can be retrieved without any requirement such as payment, registration, etc.
    * `http://opds-spec.org/acquisition/borrow` - indicates the complete representation may be retrieved via lending
    * `http://opds-spec.org/acquisition/buy` - indicates the complete representation may be purchased
    * `http://opds-spec.org/acquisition/sample` or `/preview` - indicates a subset of the content may be retrieved
    * `http://opds-spec.org/acquisition/subscribe` - indicates the complete representation may be retrieved via subscription

#### 5.2.2 Artwork Relations

* Catalog Entries MAY include `atom:link` elements to images that visually represent a Publication
* For many pubs, these will be the publication's artwork
* Spec defines two Artwork Relations, starting with `http://opds-spec.org/image`
    * `http://opds-spec.org/image` - graphical resource associated with the catalog entry
    * `http://opds-spec.org/image/thumbnail` - reduced-size version of a graphical resource
* Resource with the thumbnail rel should be suitable for presentation at small size
* The `atom:link` elements with these rels SHOULD include at least one link with a type of `image/gif`, `image/jpeg`, or `image/png`, and the resources MUST be gif/jpeg/png
* Additional `atom:link` elements MAY include resource using a vector-based format
* While either image Resource is optional, catalog providers are encouraged to provide both when possible
* Some providers MAY choose to provide thumbnail image resources with the `data` url scheme

#### 5.2.3 Grouping Relations

* A catalog Entry MAY include 1+ `atom:link` elements to Nav Feeds and Acquisition Feeds which contain it, either directly or indirectly
* This spec uses the IANA standard link relation `collection` for this purpose
* An OPDS client MAY choose to group together all entries in an OPDS feed whose `collection` link points to a given target

### 5.3 Acquiring Publications

* Goal of OPDS Catalogs is to make publications discoverable and straightforward to acquire on a range of devices and platforms
* To support that, spec tries to provide a framework for describing how to get a publication, while trying not to constrain that complex topic
* All acquisition links MUST have a `type` attribute that advises clients on the media type of the representation that's expected to be returned when the `href` value is dereferenced
* The value of the type attribute MUST have the syntax of a MIME type
* Publications in a format with DRM SHOULD use a different value for for the type attribute of the Acquisition Link than the same format without DRM
* Catalog clients may only support a subset of all possible Publication media types
* OPDS Catalogs may only provide certain publications through an Indirect Acquisition, either through a container or a different Acquisition workflow. In those cases, it's up to the clients to filter the publications on both `opds:indirectAcquisition` and `atom:link` type attributes

Examples:

A Publication available in one format:

```XML
<link rel="http://opds-spec.org/acquisition"
      type="video/mp4v-es"
      href="/content/free/4561.mp4"/>
```

Same publication in multiple formats as unique resources:

```XML
<link rel="http://opds-spec.org/acquisition/borrow"
      href="/content/borrow/4561.mobi"
      type="application/x-mobipocket-ebook" />

<link rel="http://opds-spec.org/acquisition/borrow"
      href="/content/borrow/4561.epub"
      type="application/epub+zip"/>
```

Publication requiring payment, with at least one `opds:price` element required:

```XML
<link rel="http://opds-spec.org/acquisition/buy"
      href="/product/song1.mp3"
      type="audio/mpeg">
    <opds:price currencycode="USD">1.99</opds:price>
</link>
```

Same publication, requires payment through an HTML page, needs `opds:indirectAcquisition` element

```XML
<link rel="http://opds-spec.org/acquisition/buy"
      href="/product/1"
      type="text/html">
    <opds:price currencycode="USD">1.99</opds:price>
    <opds:indirectAcquisition type="audio/mpeg" />
</link>
```

Multiple `opds:indirectAcquisition` elements can be children of an Acquisition Link or another `opds:indirectAcquisition` when necessary (a bundle being a good example)

```XML
<link type="text/html"
      rel="http://opds-spec.org/acquisition/buy"
      href="/item/1111/buy/">
    <opds:price currencycode="EUR">10.99</opds:price>
    <opds:indirectAcquisition type="application/zip">
        <opds:indirectAcquisition type="application/epub+zip" />
        <opds:indirectAcquisition type="application/pdf" />
        <opds:indirectAcquisition type="application/x-mobipocket-ebook" />
    </opds:indirectAcquisition>
</link>
```

### 5.4 Element Definitions

* `atom:entry`
    * document / top level element of a Catalog Entry Document
    * MUST contain at least one Acquisition Link, an `atom:link` element with a rel starting with `http://opds-spec.org/acquisition`
* `atom:link`
    * defines a reference from an Entry or Feed to a Resource
    * child elements defined by this spec:
        * `atom:link` elements with `rel` of `/acquisition/buy` MUST have at least one `opds:price` element
        * `atom:link` elements with `rel` of `/acquisition/borrow`, `/acquisition/subscribe`, or `/acquisition/sample` MAY contain one or more `opds:price` elements
* `opds:price`
    * represents acquisition price in a particular currency of an individual Publication in a specific format, from a specific provider
    * can be a child of the `atom:link` element
    * content is a text describing a currency value
    * currency sign MUST NOT be included
    * value of `currencycode` attribute MUST be an active code from ISO4217
* `opds:indirectAcquisition` element
    * In some cases the OPDS catalog provider MAY require the client to acquire an intermediate Resource before acquiring the final Publication.
    * Can be the case with containers (archive formats, multimedia containers for various formats) or when a payment is required (need to go through a series of HTML pages to handle the transaction)
    * The `opds:indirectAcquisition` element represents these secondary media types that the client can expect to acquire if they follow the acquisition link
    * These elements MAY be arbitrarily nested to represent several levels of indirection

## 6. Additional Link Relations

* Feed documents SHOULD include links to other available acquisition and navigations feeds and other related resources, to encourage independent navigation
* These rels MAY be used by clients to provide additional or alternative navigation, both in a nav or acq feed
* Following relations are derived from RFC5988 with some clarification:
    * `start` - the OPDS Catalog Root
    * `subsection` - an OPDS Feed not better described by a more specific relation
* When creating a Catalog with nav/acq feeds, providers are encouraged to use the relations defined in this spec and RFC5988
* If no appropriate rel is found, the Feeds SHOULD use a descriptive `atom:title` element and `atom:link` elements SHOULD use a descriptive `title` attribute

### 6.1 Relations for Previously Acquired Content

* A catalog MAY track content that was previously acquired by the user
* Spec defines two new rels to identify Acquisition Feeds listing such resources:
    * `http://opds-spec.org/shelf` - Resource that includes a user's existing set of Acquired Content, which MAY be represented as an OPDS Catalog
    * `http://opds-spec.org/subscriptions` - Resource that includes a user's set of subscriptions, which MAY be represented as an OPDS Catalog
* A client MAY use those links to automatically sync content to the user's local shelf or check for periodical content updates

### 6.2 Sorting Relations

* Spec defines two new rels, starting with `http://opds-spec.org/sort`
* They describe how an Acquisition Feed is sorted
* These rels SHOULD be used when creating Nav Feeds and the Catalog Root, if applicable:
    * `http://opds-spec.org/sort/new` - feed with newly released Entries; typically contain a subset of the Entries in a full Catalog, based on the publication date of the Publication
    * `http://opds-spec.org/sort/popular` - feed with popular Entries, typically contain a subset, based on a numeric ranking criteria
* Feeds using the `/sort/new` rel SHOULD be ordered with most recent items first
* Feeds using the `/sort/popular` rel SHOULD be ordered with most popular items first

### 6.3 Featured Relation

* Spec defines a rel to describe an Acquisition Feed of featured items
* Rel SHOULD be used when creating nav feeds and the catalog root, if applicable:
    * `http://opds-spec.org/featured` - acquisition feed with featured Entries; typically contain a subset based on those pubs selected for promotion by the provider. No order is implied.

### 6.4 Recommendations

* Spec defines a rel to describe an acquisition feed of recommended items
* Since recommendations can be customized per user, such feed may require prior authentication
* Rel SHOULD be used when creating nav feeds and the catalog root, if applicable
    * `http://opds-spec.org/recommended` - feed of recommended Entries; typically have a subset of Entries that have been selected specifically for the user
* Feeds using this rel SHOULD be ordered with most recommended items first

## 7. Other Considerations

### 7.1 Discovering OPDS Catalogs

* Catalogs may be referenced in HTML/XHTML pages, HTTP headers, or by other techniques
* These links may reference both Catalog Entries or Feeds
* Links to Entry Document Resources MUST use a type of `application/atom+xml;type=entry;profile=opds-catalog`
* Links to Catalog Feed Document Resources MUST use a type of `application/atom+xml;profile=opds-catalog`
* Most common mechanism for encouraging auto-discovery of Catalogs is to link from an HTML document to the OPDS Catalog Root Resource, using the autodiscovery pattern from syndicated feeds
* Multiple links to OPDS Catalog Resources MAY be expressed in a single HTML document
* Example of two links in an HTML page about the same Publication:

    ```HTML
    <link rel="related"
          href="/opds-catalogs/root"
          type="application/atom+xml;profile=opds-catalog"
          title="Example OPDS Catalog" />

    <link rel="alternate"
          href="/entry/1"
          type="application/atom+xml;type=entry;profile=opds-catalog"
          title="Example OPDS Entry" />
    ```

* Auto-discovery links MAY be epxressed using HTTP headers as per RFC5988

### 7.2 Aggregating OPDS Catalogs

* Catalogs MAY be aggregated the same way as Atom Feeds
* Aggregators SHOULD use the `atom:source` element from RFC4287 4.2.11 to include info about the original Catalog

### 
