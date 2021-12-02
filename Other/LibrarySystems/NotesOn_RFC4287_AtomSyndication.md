# Notes on the Atom Syndication Format, RFC 4287

From https://datatracker.ietf.org/doc/html/rfc4287

* From 2005; specifies an XML-based content/metadata syndication standard

## 1. Introduction

* XML-based document format, describes lists of related info known as "feeds"
* Feeds are made of "entries", each with extensible metadata
* Primary use case is syndication of Web content to sites and user agents

### 1.1 Examples:

Simple, single-entry feed document:

```XML
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">

 <title>Example Feed</title>
 <link href="http://example.org/"/>
 <updated>2003-12-13T18:30:02Z</updated>
 <author>
   <name>John Doe</name>
 </author>
 <id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>

 <entry>
   <title>Atom-Powered Robots Run Amok</title>
   <link href="http://example.org/2003/12/13/atom03"/>
   <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
   <updated>2003-12-13T18:30:02Z</updated>
   <summary>Some text.</summary>
 </entry>

</feed>
```

Bigger, still single-entry feed document:

```XML
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
 <title type="text">dive into mark</title>
 <subtitle type="html">
   A &lt;em&gt;lot&lt;/em&gt; of effort
   went into making this effortless
 </subtitle>
 <updated>2005-07-31T12:29:29Z</updated>
 <id>tag:example.org,2003:3</id>
 <link rel="alternate" type="text/html"
  hreflang="en" href="http://example.org/"/>
 <link rel="self" type="application/atom+xml"
  href="http://example.org/feed.atom"/>
 <rights>Copyright (c) 2003, Mark Pilgrim</rights>
 <generator uri="http://www.example.com/" version="1.0">
   Example Toolkit
 </generator>
 <entry>
   <title>Atom draft-07 snapshot</title>
   <link rel="alternate" type="text/html"
    href="http://example.org/2005/04/02/atom"/>
   <link rel="enclosure" type="audio/mpeg" length="1337"
    href="http://example.org/audio/ph34r_my_podcast.mp3"/>
   <id>tag:example.org,2003:3.2397</id>
   <updated>2005-07-31T12:29:29Z</updated>
   <published>2003-12-13T08:29:29-04:00</published>
   <author>
     <name>Mark Pilgrim</name>
     <uri>http://example.org/</uri>
     <email>f8dy@example.com</email>
   </author>
   <contributor>
     <name>Sam Ruby</name>
   </contributor>
   <contributor>
     <name>Joe Gregorio</name>
   </contributor>
   <content type="xhtml" xml:lang="en"
    xml:base="http://diveintomark.org/">
     <div xmlns="http://www.w3.org/1999/xhtml">
       <p><i>[Update: The Atom draft is finished.]</i></p>
     </div>
   </content>
 </entry>
</feed>
```

### 1.2 Namespace and Version

* Namespace URI is `http://www.w3.org/2005/Atom`

### 1.3 Notational Conventions

* Spec describes Atom Feed Documents and Atom Entry Documents
* Also puts some requirements on Atom Processors
* Uses the namespace prefix `atom:` for the namespace URI

## 2. Atom Documents

* Atom Feed Document - representation of an Atom feed, including metadata about that feed, and some or all of its associated entries.
* Root element is `atom:feed`
* Atom Entry Document - exactly one Atom entry, outside the context of a feed
* Root element is `atom:entry`
* Both docs are associated with the media type `application/atom+xml`
* MUST be well formed XML
* No DTD defined for Atom Documents, so just valid XML is fine
* You can use IRIs and URIs interchangeably, as long as the URI is a valid IRI
* If an IRI that is not a URI is used, it MUST be mapped to a URI
* When an IRI is serving as an `atom:id` value, it MUST NOT be mapped that way
* Any element can have an `xml:base` attribute to define the base URI/IRI for resolving relative references
* Any element can have an `xml:lang` attribute to indicate the natural language of the element and its descendents
* Atom is an extensible format
* Atom Processors MAY keep state sourced from feed documents and combine them with other feed documents to facilitate a contiguous view of the contents of a feed

## 3. Common Atom Constructs

* Note: there MUST NOT be any white space in a Date construct or in any IRI

### 3.1 Text Constructs

* Contains human-readable text, usually in small quantities
* Content of Text constructs is language sensitive
* 3.1.1 The "type" attribute
    * text constructs MAY have a "type" attribute
    * when present, must be `"text"|"html"|"xhtml"`
    * processors must default to `"text"`
    * MIME types MUST NOT be used as values of type attribute
    * 3.1.1.1 Text
        * If the value is `"text"`, the content MUST NOT contain child elements
        * Procesors MAY collapse white space and display text how they want to
    * 3.1.1.2 HTML
        * If the value is `"html"`, the content MUST NOT contain child elements
        * the content SHOULD be suitable for handling as HTML
        * any markup MUST be escaped
        * HTML markup SHOULD be such that it could validly appear directly inside an HTML div element after unescaping
    * 3.1.1.3 XHTML
        * If the value is `"xhtml"`, content MUST be a single XHTML div element
        * That element MUST NOT be considered part of the content

### 3.2 Person Constructs

* A Person construct describes a person or similar entity
* No significance to order of appearance of child elements
* 3.2.1 The `atom:name` element
    * conveys a human-readable name
    * is language sensitive
    * Person constructs MUST contain exactly one `aton:name`
* 3.2.2 The `atom:uri` element
    * conveys an IRI associated with the person
    * Person constructs MAY contain 0 or 1 `atom:uri` element
    * content MUST be an IRI reference
* 3.2.3 The `atom:email` element
    * conveys an email address for the person
    * Person constructs MAY contain 0 or 1 `atom:email` elements
    * Content must conform to `addr-spec` portion of RFC2822

### 3.3 Date Constructs

* Element whose content MUST conform to date-time part of RFC3339
* Uppercase T character MUST separate date and time
* Uppercase Z character MUST be present in the absence of a numeric time zone offset
* Valid Date constructs:

    ```XML
    <updated>2003-12-13T18:30:02Z</updated>
    <updated>2003-12-13T18:30:02.25Z</updated>
    <updated>2003-12-13T18:30:02+01:00</updated>
    <updated>2003-12-13T18:30:02.25+01:00</updated>
    ```

* Values SHOULD be as accurate as possible

## 4. Atom Element Definitions

### 4.1 Container Elements

* 4.1.1 The `atom:feed` element
    * top level / document element of an Atom Feed Document
    * element children are metadata elements and zero or more `atom:entry` elements
    * Child elements:
        * 1+ `atom:author` elements, unless all `atom:entry` elements contain at least one `atom:author` element
        * 0+ `atom:category` elements
        * 0+ `atom:contributor` elements
        * 0-1 `atom:generator` elements
        * 0-1 `atom:icon` elements
        * 0-1 `atom:logo` elements
        * 1 `atom:id` element
        * 1 `atom:link` element with a rel of `self`, with the preferred IRI for retrieving Atom Feed Documents representing this feed
        * 0-1 `atom:link` elements with rel of `alternate` and identical values for `hreflang` and `type` attributes
        * 0+ `atom:link` elements other than those already described
        * 0-1 `atom:rights` elements
        * 0-1 `atom:subtitle` elements
        * 1 `atom:title` element
        * 1 `atom:updated` element
    * 4.1.1.1 Providing Textual Content
        * It is advisable that each `atom:entry` element contain
            * a non-empty `atom:title` element
            * a non-empty `atom:content` element when that element is present
            * a non-empty `atom:summary` element when the entry contains no `atom:content` element
* 4.1.2 The `atom:entry` element
    * Represents an individual entry
    * Can be a child of `atom:feed` or be the document element of a stand alone Atom Entry Document
    * Child elements:
        * 1+ `atom:author` elements, unless the `atom:entry` contains an `atom:source` element that contains an `atom:author` element, or, in an Atom Feed Document, the `atom:feed` element contains an `atom:author` element itself
        * 0+ `atom:category` elements
        * 0-1 `atom:content` element
        * 0+ `atom:contributor` elements
        * 1 `atom:id` element
        * `atom:entry` elements with no child `atom:content` element must have at least one `atom:link` element with a rel attribute of `"alternate"`
        * 0-1 `atom:link` elements with a rel of "alternate" and the same values for type and hreflang
        * 0+ additional `atom:link` elements other than those already described
        * 0-1 `atom:published` element
        * 0-1 `atom:rights` element
        * 0-1 `atom:source` element
        * MUST contain an `atom:summary` in either of these cases:
            * `atom:entry` contains an `atom:content` with a `src` attribute (and is therefore empty)
            * `atom:entry` contains Base64 encoded content, as in the `type` attribute of `atom:content` is a MIME media type but not an XML media type, does not start with `text/` or end with `/xml` or `+xml`
        * 0-1 `atom:summary` element
        * 1 `atom:title` element
        * 1 `atom:updated` element
* 4.1.3 The `atom:content` element
    * Either contains or links to the content of hte entry
    * is language sensitive
    * 4.1.3.1 The "type" attribute
        * MAY be one of `"text"|"html"|"xhtml"`
        * otherwise MUST conform to syntax of a MIME media type
        * MUST NOT be a composite type
        * processors default to `"text"`
    * 4.1.3.2 The "src" attribute
        * `atom:content` MAY have a src attribute
        * Value MUST be an IRI reference
        * If the src attribute is present, the type attribute should be provided and MUST be a MIME type
    * 4.1.3.3 Processing Model
        * Atom Documents MUST conform to the following rules
        * Atom Processors MUST interpret `atom:content` according to the first available rule
        * Rules:
            1. If the value of `type` is `"text"`, the content of `atom:content` MUST NOT contain child elements, since it's supposed to be human readable. Therefore, processors MAY collapse white space including line breaks, and display the text with things like justification, proportional fonts, etc.
            1. If the value of `type` is `"html"`, the content of `atom:content` MUST NOT contain child elements, and SHOULD be suitable for handling as HTML. Markup MUST be escaped.
            1. If teh value of `type` is `"xhtml"` the content of `atom:content` MUST be a single XHTML div, which is not part of the content
            1. If the value of `type` is an XML media type or ends with `/xml` or `+xml`, the content of `atom:content` MAY include child elements and SHOULD be suitable for handling as the included media type. If the src attribute is not provided, that would normally mean the element would have a single child element that would be the root element of the xml document of the type indicated.
            1. If teh value of `type` starts with `text/` the content of `atom:content` MUST NOT contain child elements
            1. For all other values of `type`, the content of `atom:content` MUST be a valid Base64 encoding. When decoded, it SHOULD be suitable for handling as the indicated media type.
    * 4.1.3.4 Examples

### 4.2 Metadata Elements

* 4.2.1 The `atom:author` element
    * is a Person construct indicating the author of the entry or feed
    * if an `atom:entry` element doesn't have `atom:author` elements, then the `atom:author` elements of the contained `atom:source` element are considered to apply
    * In an Atom Feed document, the `atom:author` elements of the containing `atom:feed` are considered to apply to the entry if there are no `atom:author` elements in the locations described above
* 4.2.2 The `atom:category` element
    * conveys info about a category associated with an entry or feed
    * 4.2.2.1 The `term` attribute
        * string that identifies the category to which the entry or feed belongs
        * category elements MUST have a `term` attribute
    * 4.2.2.2 The `scheme` attribute
        * an IRI identifying a categorization scheme
        * categories MAY have a scheme attribute
    * 4.2.2.3 The `label` attribute
        * human readable label for display in end user applications
        * language sensitive
        * entities represent their corresponding characters, not markup
        * categories MAY have a label attribute
* 4.2.3 The `atom:contributor` element
    
