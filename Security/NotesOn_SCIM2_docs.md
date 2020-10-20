# Notes on SCIM 2 Documentation

# SCIM info from SimpleCloud.info

From [http://www.simplecloud.info/](http://www.simplecloud.info/)

## Overview

* SCIM - System for Cross-Domain Identity Management
* Puts emphasis on "simplicity of development and integration, while applying existing authentication, authorization, and privacy models."
* Provides a common user schema and extension model, and binding docs to provide patterns for exchanging the schema over standard protocols.
* Summary:

    > In essence: make it fast, cheap, and easy to move users in to, out of, and around the cloud.

### Model

* Everything derives from a `Resource`, with attributes
    * `id`
    * `externalid`
    * `meta`
* RFC7643 defines `User`, `Group`, and `EnterpriseUser` to extend common attributes
* Hierarchy:

    ```
    Resource
    |
    |__ User
    |   |
    |   |__ EnterpriseUser
    |
    |__ Group
    |
    |__ [Others...]
    ```

### Example User

* User data encoded as a SCIM object in JSON:

    ```JSON
    {
      "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
      "id":"2819c223-7f76-453a-919d-413861904646",
      "externalId":"bjensen",
      "meta":{
        "resourceType": "User",
        "created":"2011-08-01T18:29:49.793Z",
        "lastModified":"2011-08-01T18:29:49.793Z",
        "location":"https://example.com/v2/Users/2819c223...",
        "version":"W\/\"f250dd84f0671c3\""
      },
      "name":{
        "formatted": "Ms. Barbara J Jensen, III",
        "familyName": "Jensen",
        "givenName": "Barbara",
        "middleName": "Jane",
        "honorificPrefix": "Ms.",
        "honorificSuffix": "III"
      },
      "userName":"bjensen",
      "phoneNumbers":[
        {
          "value":"555-555-8377",
          "type":"work"
        }
      ],
      "emails":[
        {
          "value":"bjensen@example.com",
          "type":"work",
          "primary": true
        }
      ]
    }
    ```

### Example Group

* Groups model organizational structure of provisioned resources
* Groups can contain users or other groups
* JSON example:

    ```JSON
    {
      "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
      "id":"e9e30dba-f08f-4109-8486-d5c6a331660a",
      "displayName": "Tour Guides",
      "members":[
        {
          "value": "2819c223-7f76-453a-919d-413861904646",
          "$ref": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
          "display": "Babs Jensen"
        },
        {
          "value": "902c246b-6245-4190-8e05-00816be7344a",
          "$ref": "https://example.com/v2/Users/902c246b-6245-4190-8e05-00816be7344a",
          "display": "Mandy Pepperidge"
        }
      ],
      "meta": {
        "resourceType": "Group",
        "created": "2010-01-23T04:56:22Z",
        "lastModified": "2011-05-13T04:42:34Z",
        "version": "W\/\"3694e05e9dff592\"",
        "location": "https://example.com/v2/Groups/e9e30dba-f08f-4109-8486-d5c6a331660a"
      }
    }
    ```

### Operations

* For resource manipulation, SCIM provides a REST API
* Provides the following operations:
    * Create: `POST /{version}/{resource}`
    * Read: `GET /{version}/{resource}/{id}`
    * Replace: `PUT /{version}/{resource}/{id}`
    * Delete: `DELETE /{version}/{resource}/{id}`
    * Update: `PATCH /{version}/{resource}/{id}`
    * Search: `GET /{version}/{resource}?filter={attr}{op}{value}&sortBy={attrName}&sortOrder={ascending|descending}`
    * Bulk: `POST /{version}/Bulk`

### Discovery

* For interoperability, provides three endpoints for feature and attribute discovery:
    * `GET /ServiceProviderConfig` - spec compliance, auth schemes, data models
    * `GET /ResourceTypes` - resource type discovery
    * `GET /Schemas` - resource introspection, attribute extensions

### Create Request

* Send a POST to the resource's end point
* Version included in URL, supports multiple versions concurrently
* Available versions discoverable via `/ServiceProviderConfig` endpoint
* Example POST for user creation:

    ```
    POST /v2/Users  HTTP/1.1
    Accept: application/json
    Authorization: Bearer h480djs93hd8
    Host: example.com
    Content-Length: ...
    Content-Type: application/json

    {
      "schemas":["urn:ietf:params:scim:schemas:core:2.0:User"],
      "externalId":"bjensen",
      "userName":"bjensen",
      "name":{
        "familyName":"Jensen",
        "givenName":"Barbara"
      }
    }
    ```

### Create Response

* Returned response includes additional data including id and metadata added by server
* Location header gives new home for the resource
* Example response:

    ```
    HTTP/1.1 201 Created
    Content-Type: application/scim+json
    Location: https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646
    ETag: W/"e180ee84f0671b1"

    {
      "schemas":["urn:ietf:params:scim:schemas:core:2.0:User"],
      "id":"2819c223-7f76-453a-919d-413861904646",
      "externalId":"bjensen",
      "meta":{
        "resourceType":"User",
        "created":"2011-08-01T21:32:44.882Z",
        "lastModified":"2011-08-01T21:32:44.882Z",
        "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
        "version":"W\/\"e180ee84f0671b1\""
      },
      "name":{
        "familyName":"Jensen",
        "givenName":"Barbara"
      },
      "userName":"bjensen"
    }
    ```

### Get Request

```
GET /v2/Users/2819c223-7f76-453a-919d-413861904646 HTTP/1.1
Host: example.com
Accept: application/scim+json
Authorization: Bearer h480djs93hd8
```

### Get Response

* The Etag header can be used in subsequent requests to prevent concurrent modifications to Resources

```
HTTP/1.1 200 OK HTTP/1.1
Content-Type: application/scim+json
Location: https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646
ETag: W/"e180ee84f0671b1"

{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id":"2819c223-7f76-453a-919d-413861904646",
  "externalId":"bjensen",
  "meta":{
    "resourceType": "User",
    "created":"2011-08-01T18:29:49.793Z",
    "lastModified":"2011-08-01T18:29:49.793Z",
    "location":"https://example.com/v2/Users/2819c223...",
    "version":"W\/\"f250dd84f0671c3\""
  },
  "name":{
    "formatted": "Ms. Barbara J Jensen, III",
    "familyName": "Jensen",
    "givenName": "Barbara",
    "middleName": "Jane",
    "honorificPrefix": "Ms.",
    "honorificSuffix": "III"
  },
  "userName":"bjensen",
  "phoneNumbers":[
    {
      "value":"555-555-8377",
      "type":"work"
    }
  ],
  "emails":[
    {
      "value":"bjensen@example.com",
      "type":"work",
      "primary": true
    }
  ]
}
```

### Filter Request

* Query the Resource endpoint with no ID to get a set of resources
* Typically includes a filter, supports multiple ops like equals, contains, starts with, etc.
* Can also sort the output on an attribute, and in a direction
* Possible to limit returned attributes of the resources, and get only a subset of the found set.
* Filter request URL format, broken up by GET param:

    ```
    https://myhost/{version}/{resource}
        ?filter={attribute}{op}{value}
        &sortBy={attributeName}
        &sortOrder={ascending|descending}
        &attributes={attributes}
    ```

* Specific example, without URL entity substitution:

    ```
    https://myhost/v1/Users
        ?filter=title pr and userType eq "Employee"
        &sortBy=title
        &sortOrder=ascending
        &attributes=title,username
    ```

### Filter Response

```
{
  "schemas":["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
  "totalResults":2,
  "Resources":[
    {
      "id":"c3a26dd3-27a0-4dec-a2ac-ce211e105f97",
      "title":"Assistant VP",
      "userName":"bjensen"
    },
    {
      "id":"a4a25dd3-17a0-4dac-a2ac-ce211e125f57",
      "title":"VP",
      "userName":"jsmith"
    }
  ]
}
```

## Specification

* SCIM 2.0 released as RFCs in September 2015:
    * RFC7643 - SCIM Core Schema
    * RFC7644 - SCIM Protocol
    * RFC7642 - SCIM Definitions, Overview, Concepts, and Requirements

# Notes from the Documentation for django-scim2 package

From [https://django-scim2.readthedocs.io/en/stable/](https://django-scim2.readthedocs.io/en/stable/)

* Only supports PostgreSQL for a db layer

## Installation

* Install with pip as `django-scim2`
* Add to `INSTALLED_APPS` as `django_scim`
* Add the URL patterns to your root `urls.py`, with the mandatory namespace `scim`:

    ```Python
    # Django 2+
    urlpatterns = [
        ...
        path('scim/v2/', include('django_scim.urls')),
    ]
    ```

* Add the settings appropriate to your app in `settings.py` (those below are minimum required for configuration, but there are more):

    ```Python
    SCIM_SERVICE_PROVIDER = {
        'NETLOC': 'localhost',
        'AUTHENTICATION_SCHEMES': [
            {
                'type': 'oauth2',
                'name': 'OAuth 2',
                'description': 'OAuth 2 implemented wit bearer token',
            },
        ],
    },
    ```

## Adapters

From [https://django-scim2.readthedocs.io/en/stable/adapters.html](https://django-scim2.readthedocs.io/en/stable/adapters.html)

* Adapters convert the data model described in the SCIM 2 spec to a data model that fits the data provided by the application implementing a SCIM api.
* An adapter is instantiated with a model instance:

    ```Python
    user = get_user_model().objects.get(id=1)
    scim_user = SCIMUser(user)
    ```


