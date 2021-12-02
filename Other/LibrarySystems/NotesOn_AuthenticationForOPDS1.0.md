# Notes on Authentication for OPDS 1.0

From [https://drafts.opds.io/authentication-for-opds-1.0](https://drafts.opds.io/authentication-for-opds-1.0)

* Spec defines a standard way for OPDS Catalog providers and clients to:
    * provide relevant info for clients to display an authentication page
    * expose how a client can authenticate using various Authentication Flows
* Primary objective is to allow access to specific feeds (such as bookshelf and subscriptions) along with support for interactions that require authentication (specific acquisition links such as buy, borrow, and subscribe)

## 1. Overview

### 1.1 Terminology

* From OPDS spec:
    * OPDS Catalog - all the atom feeds and entries following this spec published together to describe a consolidated group of publications
    * Acquisition Link - `atom:link` element with a relation starting with `http://opds-spec.org/acquisition`; refers to the Resource that holds the content of the Publication, or the Resource through which it may be acquired for any Catalog Entry
* New Terms:
    * Authentication Document - A discovery document that indicates with Authentication Flows are supported, how to interact with them, and what should be displayed to the user
    * Authentication Flow - series of steps necessary to authenticate the user
    * Authentication Page - page with various info provided by the auth document, and input fields based on the auth flow
    * Authentication Provider - server that supports 1+ Authentication Flows to authenticate a client

### 1.2 Notational Conventions

* Uses the MUST, MUST NOT, etc. terms from RFC2119

## 2. Authentication Document

### 2.1 Introduction

* Auth Doc is a service discovery document
* Part of its content is meant to tell a client how to authenticate a user with a Catalog Provider:
    * list of supported auth flows
    * locations where specific interactions can be made
    * unique identifier for the catalog
* Rest of its content is meant to be displayed to the user:
    * title of the service
    * logo
    * text prompt
    * alternate labels for fields to display
    * registration link
    * resources where the user can get support

### 2.2 Content Conformance

* An auth doc MUST:
    * meet the conformance constraints for JSON docs, per RFC4627
    * parse as a single JSON object
    * be encoded in UTF-8
* Access to the auth doc MUST NOT require any authentication
* MIME type for the auth doc is `application/opds-authentication+json`
* HTTP servers MUST set the content type accordingly

### 2.3 Syntax

#### 2.3.1 Core Properties

* Auth doc MUST contain these keys:
    * `authentication` - object, list of supported authentication flows
    * `title` - string, title of the catalog being accessed
    * `id` - url, unique identifier for the catalog provider, and canonical location for the Authentication Document
* MAY contain
    * `description` - string, description of the service being displayed to the user

#### 2.3.2 Links

* Auth doc MAY contain a `links` object
* Used to associate the auth doc with resources not locally available
* `links` object contains 1+ links with the following keys:
    * `href` - URI or URI template of the linked resource, REQUIRED
    * `templated` - indicates `href` is a URI template, only required if `href` is a template
    * `type` - MIME type of linked resource
    * `title` - title of the linked resource
    * `rel` - relation between teh resource and its containing collection
    * `height` - height of the linked resource in pixels
    * `width`
    * `duration` - duration of linked resource in seconds
    * `bitrate` - bit rate of the linked resource in kbps
* This spec introduces these link relations:
    * `logo` - logo associated with the catalog provider
    * `register` - location where a user can register
    * `help` - support resources for the user

#### 2.3.3 Example

An auth doc that indicates the Catalog can support two auth flows, Basic and OAuth 2.0 via implicit grant:

```JSON
{
    "id": "http://example.com/auth.json",
    "title": "Public Library",
    "description": "Enter a valid library card number and PIN to authenticate.",
    "links": [
        {"rel": "logo", "href": "http://example.com/logo.jpg", "type": "image/jpeg", "width": 90, "height": 90},
        {"rel": "help", "href": "mailto:support@example.org"},
        {"rel": "help", "href": "tel:1800836482"},
        {"rel": "help", "href": "http://example.com/support", "type": "text/html"},
        {"rel": "register", "href": "http://example.com/registration", "type": "text/html"}
    ],
    "authentication": [
        {
            "type": "http://opds-spec.org/auth/basic",
            "labels": {
                "login": "Library card",
                "password": "PIN"
            }
        },
        {
            "type": "http://opds-spec.org/auth/oauth/implicit",
            "links": [
                {"rel": "authenticate", "href": "http://example.com/oauth", "type": "text/html"}
            ]
        }
    ]
}
```

### 2.4 Authentication Provider

* To require the client to authenticate, an Authentication Provider MUST send a 401
* In this context, the provider MUST also serve the auth document as the content of the response, with the proper MIME type in hte content type header
* Auth Provider MAY use the `Link` header from `RFC5988` to indicate the location of the auth document
* Link value MUST be identified by
    * `http://opds-spec.org/auth/document` relation
    * `application/opds-authentication+json` media type
* Example of using the Link header:

    ```
    GET /resource HTTP/1.1
    Link: <http://example.com/auth_document>;
            rel="http://opds-spec.org/auth/document";
            type="application/opds-authentication+json"
    ```

### 2.5 Client

* An OPDS client MUST detect the presence of an Authentication Document, whether it is served as content or in the link header
* Once the client detects it, it MUST select and trigger a specific auth flow from it
* For some auth flows, the client MUST display an Authentication Page
* An auth page MUST display all the info provided in the auth document

## 3. Authentication Flows

In addition to the auth doc, this spec also defines multiple scenarios to handle how the client is authenticated

### 3.1 Authentication Object

* Each auth doc contains at least one Authentication Object that describes how a client can use an auth flow
* The auth object MUST contain at least a `type`, which is a URI identifying the nature of the auth flow

#### 3.1.1 Labels

* An auth object MAY include a `labels` object
* That provides alternate labels for fields that the cleint will dispaly to the user
* All alternate labels MUST be provided as strings
* It MAY contain these keys:
    * `login` - alt label for a login; Basic Auth and OAuth with Resource Owner Password Credentials Grant
    * `password` - alt label for a password; Basic and OAuth w/ Resource Owner Password Credentials Grant

#### 3.1.2 Links

* An auth object MAY include a `links` object using the same syntax from 2.3.2
* Following link relations are defined in this context:
    * `authenticate` - location where a client can authenticate the user with OAuth, required if the auth flow list contains oauth
    * `refresh` - location where a client can refresh the access token by sending a refresh token

### 3.2 Use of TLS

* All resources MUST use TLS during each step of an auth flow
* Implementations MAY also support additional transport layer security

## 3.3 Basic Authentication

* To identify the use of Basic Auth, this spec defines a new `type` value:
    * `http://opds-spec.org/auth/basic`
* A client that detects and decides to use Basic Auth as an auth flow for a catalog MUST display an Authentication Page containing all the info from the auth doc
* The Authentication Page MUST contain two input fields for username ans password
* If the auth doc defines alternate labels, the auth page has to use them
* An OPDS client MAY store the credentials for future use, but should make best efforts to protect them
* Basic auth is weaker than other auth flows. Use others if you can.

## 3.4 OAuth 2.0

### 3.4.1 Introduction

* OAuth 2.0 defines several authentication flows, called authorization grant types in the OAuth spec
* They all follow the same principle: in exchange for an authorization grant, the client gets a token to access protected resources
* This spec defines how a subset of oauth 2.0 can be used as Authentication Flows
* Spec also adds support for endpoint discovery via auth documents

### 3.4.2 A Shared Client Identifier

* OAuth favors client registration; OPDS favors discovery and maxiumum interoperability
* Any auth provider that supports OPDS Authentication 1.0 and exposes an auth flow based on OAuth MUST identify all OPDS client using the following information:
    * Name: OPDS client
    * Identifier: `http://opds-spec.org/auth/client`
    * Callback URI: `opds://authorize/`
* The unique id used in the callback URI MUST have the same value as the identifier provided in the auth document
* Specific OPDS clients MAY also be registered by each Catalog, in order to be further identified

### 3.4.3 Bearer Token

* All of the OAuth based auth flows described in this doc rely on the `Authorization` header field in HTTP, to transmit an Access Token
* Example of using a bearer token to transmit an access token:

    ```
    GET /resource HTTP/1.1
    Host: server.example.com
    Authorization: Bearer mF_9.B5f-4.1JqM
    ```

### 3.4.4 Security Considerations

* All clients and auth providers SHOULD follow the security considerations in
    * Section 10 of RFC6749
    * Section 5 of RFC6750

### 3.4.5 Implicit Grant

* To identify the use of an Implicit Grant Authentication Flow (RFC6749 4.2), this spec defines a new type value:
    * `http://opds-spec.org/auth/oauth/implicit`
* A valid Authentication Object that lists the Implicit Grant as an available auth flow MUST also include a link identified by the `authenticate` relationship
* If a client decides to use that flow, it MUST NOT display an auth page
* Instead it MUST redirect to a webview/browser to the location indicated by the link with the `authenticate` rel
* If the authentication is successful, the auth provider MUST provide an Access Token Response with these restrictions:
    * it MUST use the OPDS callback URI
    * it MUST follow the requirements from RFC6749 4.2.2 Access Token Response
    * it MUST use the `id` query parameter to indicate the auth doc identifier
    * it MUST use `bearer` as the value of `token_type` query param
* Example of an OPDS callback containing an access token:

    ```
    opds://authorize/?id=http%3A%2F%2Fexample.org%2Fauth.json&access_token=9b3dc428-df5f-4bd2-9f0d-72497cbf8464&token_type=bearer
    ```

* An OPDS client can then associate that access token to an OPDS catalog and its auth provider using the unique identifier
* On receiving the access token, the client SHOULD attempt to authenticate on the same resource that initially prompted the auth document

### 3.4.6 Resource Owner Password Credentials Grant

* To identify the use of a Resource Owner Password Credentials Grant Auth Flow, this spec defines a type value:
    * `http://opds-spec.org/auth/oauth/password`
* A valid auth object that lists the Resource Owner Password Credentials Grant as an available auth flow MUST also include an `authenticate` link
* It MAY also include a `refresh` link if the auth provider includes a refresh token in the response document
* A client that detects and decides to use the Resource Owner Password Credentials as an auth flow for a catalog MUST display an auth page
* The auth page has to display username password fields, use alt labels if available
* An OPDS client MUST NOT store the credentials for future use
* In case of a successful request, the OAuth Response document MUST return an access token as a bearer token

### 3.4.7 OAuth Response Document

* This section isn't filled out. Ruh-roh.
