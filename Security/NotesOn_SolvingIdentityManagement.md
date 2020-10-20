# Notes on Solving Identity Management in Modern Applications: Demystifying Oauth 2.0, OpenId Connect, and SAML 2.0

By Yvonne Wilson, Abhishek Hingnikar; Apress, Dec. 2019; ISBN 9781484250952

# Chapter 1: The Hydra of Modern Identity

* Book covers 3 identity protocols
    * OAuth 2.0
    * OpenID Connect (OIDC)
    * Security Assertion Markup Language (SAML) 2.0

## Design Questions

* Who are your users: employees, consumers, or a business?
* How will users log in? Is there an existing account available to them that they would like to reuse?
* Can your application be used anonymously or is authentication needed?
* What kind of delivery, web or native, does your app intend to provide?
* Will your app need to call any APIs? If so, who owns the data that your application will retrieve?
* How sensitive is the data that your application handles?
* What access controls requirements are needed?
* How long should a user's session last?
* Is there more than one application in your system? If so, will users benefit from single sign on?
* What should happen when users log out?
* Are there any compliance requirements with this data?

# Chapter 2: The Life of an Identity

* Terms
    * 'Identifier' - A single attribute that can uniquely identify a person or entity in a specific concept. Email addresses, passport numbers, etc.
    * 'Identity' - A collection of attributes associated with a specific person or entity in a particular context. Includes one or more identifiers, may contain other attributes. A person may have more than one identity. Machines can have identities.
    * 'Account' - A local construct within a given application or application suite that is used to perform actions in that context. May have its own identifier in addition to the identity associated with it, to provide a level of separation.
* A person logs in to use an account which has various identity attributes associated with it, and which enables them to perform actions within a system.
* An Identity Management System (IdM) is a set of services that support the creation, modification, and removal of identities and associated accounts, and authentication / authorization

## Events in the Life of an Identity

1. Provisioning
    * Creating an account and associated identity information
    * Involves obtaining or assigning a unique identifier for the identity, creating an account, and associating identity profile attributes with the account
1. Authorization
    * In creation process, it's often necessary to specify what the account can do, in the form of privileges.
1. Authentication
    * To access content / exercise privileges, a user needs to authenticate
    * They provide an identifier to the account, and credentials
1. Access Policy Enforcement
    * Once a user is authenticated and associated with an account, you have to enforce access policy, to make sure actions taken by the user are allowed by the privileges they've been granted.
1. Sessions
    * Most applications only allow a user to remain active for a limited period.
    * They do this by managing a session for the user. The session tracks info like authentication status, the auth mechanism or strength level, when the auth occurred, and a user identifier.
1. Single Sign-On
    * SSO is the ability to access multiple protected resources or applications without having to re-authenticate.
    * Requires that a set of applications delegate authentication to a single entity.
1. Stronger Authentication
    * Step-up authentication and multi-factor authentication (MFA)
    * MFA requires something you know and something you have
    * Step-up is the act of elevating an existing auth session to a higher level by authenticating with a stronger form of authentication.
1. Logout
    * Session termination for an authenticated session
    * Distinct from timing out
1. Account Management
    * Changing attributes of an identity / account
    * Changing authentication token safely, requires a secondary means of establishing identity, such as email recovery.
1. Deprovisioning
    * Removing an account's permissions, or the entire account

# Chapter 3: Evolution of Identity

## Identity Management Approaches

* Curated list of approaches that have been used for
    * Managing identity
    * Authentication and authorization

### Per-Application Identity Silo

* Each application had its own identity repository and auth systems
* Different username and password for each application
* Profile changes could not automatically propagate
* Still in use pretty widely

### Centralized User Repository

* More and more general purpose or wide purpose software meant a need for better identity management
* Companies implemented directory services to centralize user identity info
* Directory services are optimized for frequent reads, occasional writes
* Typical of large, on-site commercial business applications
* Improvements to siloed, per-app approach:
    * Centralized user profile means single place to update
    * Single place for credential grants and revocations
    * Single user identity for multiple applications
* Disadvantages:
    * No session management from central directory
    * Only one set of creds per user, but user still had to auth with each app separately
    * User creds therefore exposed to each app's security / risk model

### Early SSO Servers

* Single Sign-on and Identity and Access Management (IAM) servers popped up
* Typically these would:
    * Redirect the user's browser to an SSO server
    * Have the user authenticate against the SSO server
    * App receives auth results in a secure, predetermined way
    * If user tried to auth with a second app, it would redirect to SSO and detect an existing session, then redirect back to app 2 without forcing a re-authentication
* Advantages:
    * Multiple app access with one authentication
    * User creds only exposed to the SSO server, never in the hands of app code
    * Single location for auth mechanisms and grant/revocation
* Disadvantages:
    * Early SSO interaction loops were proprietary
    * Time consuming to implement
    * Adoption only really workable in large companies
    * Limited by reliance on cookies, which only work within a single domain

### Federated Identity and SAML 2.0

* Lots of new SaaS applications for identity management cropped up
* Business units could adopt them without going through central IT
* Those apps didn't provide a good way to manage employee identities, so it would be difficult for a company to track accounts representing employees
* Users went back to having to remember a password per application
* Single sign-on across internal apps didn't extend to external SaaS apps
* SAML 2.0 published in 2005. Advantages:
    * Provided a solution for web single sign-on across domains and federated identity
    * Perfect for enterprises with SaaS applications
    * Let the apps redirect corporate users to a corporate auth services, known as an Identity Provider (IdP) for authentication
    * Identity federation let you link an identity in an app to an identity at the IdP
    * Let companies have advantages of SSO with internal and external SaaS apps
    * Users had a single username/password
    * Enterprise had centralized control point for internal/external identities
    * Single place to implement password policy and MFA
* Disadvantages:
    * Broad protocol for many scenarios, so complex to implement
    * No viable business model for it to address customer facing scenarios
    * Only solved authentication, didn't help with API authorization

### WS-FED

* Web Services Federation Language (WS-Fed)
* Federation framework, created by industry coalition as part of `WS-*` specs
* Published as OASIS standard in 2009
* Provided mechanisms whereby "authorized access to resources managed in one realm can be provided to security principles whose identities are managed in other realms."
* Used in lots of enterprise environments, still being used actively

### OPENID

* Worth looking at for its user-centric identity concept
* SAML 2.0 was employee-facing, consumer users still forced to register with each consumer facing website. 
* New industry group formed to create a 'user-centric' identity solution
* Included user-controlled identity for the consumer use case
* Original OpenID protocol didn't see wide adoption
* Laid groundwork for OpenID Connect

### OAUTH 2.0

* Case: retrieving uploaded content on behalf of a user (like getting your photos in a social media app)
* If a secondary app needed to get the media, it would have to have the user's creds
* Needed a way for a user to authorize an app to retrieve content from an API on their behalf, without having to expose their actual credentials.
* The OAuth protocol was made to do that
* OAuth 2.0 lets a user authorize one application (the 'client') to make requests to an API (the 'resource server') on their behalf
* The app interacts with an authorization server that authenticates the user as part of getting their consent for the client to access their resources.
* The client app gets a token that lets it call the resource server
* Solved an important API authorization use case
* Hadn't previously been a viable business model for consumer facing SSO, but this made it attractive for platforms (Google, FB, etc.) to be an OAuth provider performing consumer-facing SSO, because it would drive people to create and use accounts on those platforms.
* One problem: OAuth 2.0 wasn't designed as a general authentication service, and couldn't be securely used without proprietary additions to the pure OAuth 2.0 feature set.

### OPENID CONNECT (OIDC)

* OpenID Connect (OIDC) designed to provide a key feature for authentication
* OAuth 2.0 servers were able to authenticate users, but the framework didn't have a standard way to securely convey the identity of an authenticated user to an application.
* OIDC provided a solution--sits as a layer on top of OAuth 2.0
* Provides info in a standard format to apps about the identity of an authenticated user
* Provides a solution for applications for user authentication AND API authorization
* You can delegate authentication and password reset logic to an OIDC provider
* OIDC provides the web SSO benefits of SAML 2.0, and in combination with OAuth 2.0, gives you a solution for authentication and API authorization

## Standard Protocols

* Next few chapters describe three common industry standard identity protocols
* Why use an industry standard protocol?
    * Widely scrutinized because they're an open standard
    * Widely used, so you get broad interoperability
    * If you want to access user profile data from places like Google, you have to
    * If you want to serve enterprise needs, you have to
    * SSO provides convenience to users
    * The protocols are already implemented in lots of language libraries
* Don't roll your own. Seriously.

# Chapter 4: Identity Provisioning

## Provisioning Options

* Involves getting users and creating accounts and identity profiles for them
* Possible scenarios where that can happen:
    * User signs up for an application account
    * User creates a new identity via a self-registration form
    * You send users invitations to self-register
    * User identities are transferred from some other user repository
    * Leveraging an existing identity provider
    * An admin or automated process creates identities

### Self Registration

* User fills out a form, you store the info
* Requires privacy notices about data retention and usage
* Advantages:
    * Ability to collect user info not asked for elsewhere
    * Control over the registration UX
    * Scalability via self-service
* Disadvantages:
    * May deter some new users
    * Potential liability of storing credentials
* Progressive Profiling
    * Instead of requesting attributes all up front, asking for more over time
* Invite-Only Registration
    * Specific users are invited to sign up
    * Maybe invitations are triggered by another user, or an admin
    * Can be used for situations where you need to create an account in order to assign privileges to it before sending the invitation, such as employee accounts for new hires.
    * Advantages
        * some protection against registration by bad actors / bots
    * Disadvantages
        * Work to implement and control access to it
        * Work to issue invitations
        * May deter some prospective users

### Identity Migration

* You can move identities from one repository to another
* Passwords are a challenge to move, because they should be stored hashed
* You have to maintain the algorithm for hashing to move them
* Solutions include
    * Support the legacy hashing algorithm
        * Advantages include avoiding password resets, transferring all accounts
        * Disadvantages include implementing the hashing algo, liability of storing the login credentials, and inherits weaknesses of the legacy algo
    * Bulk Identity Migration
        * Extracts user data minus password hashes
        * Must include validated email addresses to send password reset link to
        * Advantages: transfers all accounts, enables immediate shutdown of legacy user repository, no latency at login time to check against legacy, code to transfer identities can be independent of app code
        * Disadvantages: moves all accounts, even inactive ones, unless filtered; requires all users to set new password; migrating all at once can cause a wide outage; if multiple apps use the legacy repo, they all have to migrate at the same time; liability of storing creds.
    * Gradual Migration of Users
        * Transfers gradually as people log into the new system
        * Advantages: inactive accounts can be weeded out, no password resets required, spreads risk of outages out, can support continued use of legacy signup mechanisms during migration.
        * Disadvantages: requires legacy repo be accessible from new app's auth mechanism, legacy store must remain accessible until enough identities are transferred, transfer mechanism must remain active throughout migration, user's first login may have some latency, implementation work cannot be easily decoupled from app team
    * Administrative Account Creation
        * Have an admin or process create new accounts/identities
        * Should take into account
            * Size of the organization
            * Frequency of new user addition
            * Whether provisioning has to be done across domains
    * Admin variant: Manual Account Creation
        * Only practical for very small organizations (low tens)
    * Admin variant: Automated Account Creation
        * Used often for employee identities
    * Admin variant: Cross-Domain Account Creation
        * Can occur when
            * Maintaining employee accounts in external SaaS apps
            * Maintaining partner accounts in corp. identity repos or apps
            * Maintaining business customer user accounts in biz-facing apps
            * Maintaining guest professor or student accounts in collaborating university systems
        * Ideally uses auth protocols to move around tokens, but may still require provisioning / synchronizing identity info across domains if:
            * Apps not designed to extract identity info from auth tokens
            * The identity profile info is too large to convey in auth tokens
            * user logins not frequent enough to keep profile info up to date
        * Provisioning of accounts and identity info across domains still commonly done using SCIM (System for Cross-domain Identity Management)

### Leverage Existing Identity Service

* Uses an identity at an IdP service like Facebook or Google
* App delegates responsibility for authentication to an IdP, receives back a security token with info about the authenticated session info, and optionally attributes about the user.
* Advantages: 
    * Better UX if it reduces the data required to sign up
    * Easier for user to remember password if IdP account used frequency
    * May not have to implement a login form or account recovery mechanism if all users authenticate via the IdP
* Disadvantages:
    * May have to collect profile info not available from the IdP
    * Need to evaluate service and availability levels of the external IdP to make sure it meets your needs
    * May require additional development or config for each IdP you enable
    * May require collaborative troubleshooting with another org when issues come up

## Selecting an External Identity Service

* Need to consider strength of the external IdP's security
* Factors to look at:
    * Validation of the info used to establish the identity
    * The identity's implementation that prevents it from being forged or used by others
    * Recognition of certain issuers of identity as authoritative for a particular domain
* Characteristics of strong identities:
    * Linked to a real person who can be held accountable for actions taken
    * Identity attributes are validated during account issuance process
    * Issued by entity regarded as authoritative for the context
    * Contains anti-forgery / unauthorized use mechanisms
* Characteristics of weak identities:
    * Anonymous, can't be linked to a real person
    * Little validation of identity attributes
    * Issued by an identity with little recognized authority
    * Few protections against forgery / unauthorized use

### Self-Registered Identities

* A self-registered identity like a basic email account, is a week identity
* Not typically considered authoritative for identity information
* Most suited to consumer facing applications without strongly validated identity data

### Organization Identities

* Online identities issued by an organization
* Meet some criteria of a strong identity, since for instance you must show ID when starting a new job, so a job issued identity is somewhat verified
* Most companies implement some stronger forms of authentication, like password policies, MFA requirements, etc.
* Typically a user can't sign into external SaaS with an org identity
* Primarily suitable for use by apps selected by the org to provide services to org members.

### Government Identities

* Government issued online identities are stronger identities, since they have stringent real world identity documentation.

### Industry Consortium Identities

* Networks of NGOs issue identities

## Identity Provider Selection

* Consumer facing apps without strong validation requirements let you choose self-registered identities
* Employee-facing apps can't rely on IdP accounts that are self-registered
* An org controlled IdP provides a single place where the org can provision accounts
* Several cloud vendors like Google, Okta, etc. provide cloud-based IdPs
* If you're creating an app with business customers, you'll likely need to integrate with their preferred IdP options
* Best to do this via standard protocols like OIDC and SAML 2.0
* Identity providers for different customer types:
    * Business to consumer: Social IdP, Cloud IdP
    * Business to employee: Cloud IdP, any OIDC or SAML 2.0 compliant IdP
    * Business to business: Cloud IdP, any OIDC or SAML 2.0 compliant IdP controlled by the business customer

## Choosing and Validating Identity Attributes

* How to identify a user?
* Email is widely adopted but has issues
* It includes a domain, which provides uniqueness across domains, and eliminates the need
* User selected usernames are also have advantages and disadvantages
* Advantages of different account identifiers:
    * Email
        * Advantages: globally unique, domain specific name
        * Disadvantages:
            * May need to be changed by the user
            * May be reassigned by email provider to new user
            * May be reassigned by corporate provider to new user
            * Terminated by employer if user leaves
            * Not all companies issue email addresses
            * Children may not have email addresses
            * Family members may share an email address
            * May expose personal info like user's name
            * Exposure as display name may result in spam
    * Username
        * Advantages: 
            * Easier to set up multiple accounts at a site
            * May be shorter to type on mobile devices
            * Can be used in searches, allowing other attributes with personal data to be encrypted
        * Disadvantages
            * Only unique within an app domain
            * Merging user repositories problematic
            * May be harder for a user to remember which username was used
            * A user may want to change a username over time
            * May expose personal info if used for display
    * Phone number
        * Advantages
            * Globally unique in a country
            * No need to hunt for a free identifier
            * May be easier for a user to remember than a username
        * Disadvantages
            * Exposure as display name may result in spam
            * Can be reassigned to a new user
            * May involve a charge for the user to obtain
            * More difficult to set up multiple accounts at once
            * May be changed by user for various reasons
            * may be terminated by phone provider

## Suggestions

* Lots of problems can be avoided by not using the same attribute for multiple purposes.
* Use a different attribute for:
    * Log in identifier
    * Display name
    * Notification / communication / account recovery
    * Internal account implementation
        * Linking an identity/account to app records
        * Capturing user activity in log files
        * Continuous identifier for a user over time for audit purposes
* Other suggestions:
    * Avoid exposing identifiers that may contain personal data
    * Use an internal account ID in log files to avoid exposing personal data
    * Use an internal ID in app records
    * Let users specify a display name for use on screens/printouts
    * Identifiers/attributes for login, display, and notification should be distinct and changeable
    * Allow setting multiple attributes for notification purposes, like primary and secondary email addresses
    * Allowing a long username with special characters, changeable by users, enables some flexibility. A separate profile attribute than username should be used for notification/contact purposes.

## Validating Critical Attributes

* Need to validate email addresses and other attributes if used in security/privacy contexts, like
    * authorization decisions
    * account recovery
    * delivery of sensitive information to the user


# Chapter 5: OAuth 2.0 and API Authorization

* Modern applications often have APIs
* Apps need authorization to make API calls directly and on behalf of a user
* OAuth 2.0 provides a solution for authorizing apps to call APIs

## API Authorization

## OAuth 2.0

* Published in 2012, designed to enable an app to obtain authorization to call third party APIs without needing to know the user's actual credentials.
* Primary use case involves a user, the 'resource owner', who wants to let an application have access to a protected resource at a logically separate site, the 'resource server'.
* With OAuth 2.0, an app sends an authorization request to an authorization server for the third party API. The auth server returns a security token that can be used by the application to access the API.
* In the auth request, the app indicates the scope of what it wants from the API, and the auth server evaluates the request before conditionally returning the token.
* If it is asking for content owned by the user, the auth server authenticates the user and then asks the user to give their consent for the app to access the requested data.
* Note that OAuth 2.0 provides an authorization solution, but NOT an authentication solution.
* The access token is only intended for access within a scope, not for conveying information about the authentication event, or the user. 
* OIDC can be used to authenticate a user to an application.

## Terminology

### Roles

* Four roles involved in an authorization request:
    * Resource Server - the server storing protected resources
    * Resource Owner - user or other entity that owns the protected resources
    * Client - app that wants access to the protected resources
    * Authorization Server - service trusted by the resource server to authorize applications to call the resource server.

### Confidential vs Public Clients

* Two client types in OAuth 2.0:
    * Confidential Client - app running on a protected server, which can securely store confidential secrets to authenticate itself to an authorization server, or use another secure authentication mechanism for that purpose.
    * Public Client - app that executes primarily on the user's client device or in the client browser, and which cannot securely store a secret or use other means to authenticate itself to an authorization server.

### Client Profiles

* Three profiles based on app topologies:
    * Web Application - confidential client with code executing on a protected, backend server. Server can securely store secrets needed for the client to authenticate itself, and tokens received from the authorization server.
    * User Agent-Based App - Assumed to be a public client with code executing in the user's browser.
    * Native Application - assumed to be a public client installed and executing on the user's device, mobile or desktop.

### Tokens and Authorization Code

* Two security tokens and an intermediary authorization code
    * Authorization Code - intermediary, opaque code returned to an application and used to obtain an access token and optionally a refresh token. Each authoriazation code is used only once.
    * Access Token - token used by an app to access an API. Represents the app's authorization to call an API, and has an expiration.
    * Refresh Token - optional token that can be used by an app to request a new access token when a prior access token has expired.

## How it Works

* Spec defines four methods by which apps get authorization to call an API
* Each uses a different type of credential to represent the authorization
* The creds are called 'authorization grants'
* Type to use depends on the use case and type of app
* Types:
    * Authorization code grant
    * Implicit grant
    * Resource owner password credentials grant
    * Client credentials grant

### Authorization Code Grant

* Uses two requests from the app to the auth server to get an access token
* First request redirects the user's browser to the auth endpoint at the auth server, with a request to authorize an API call to be made on the user's behalf
* After getting permission, redirects back to app with an authorization code
* App uses the auth code to send a second, backchannel request to the auth server's token endpoint, to get an access token
* Auth server response with access token, app can use it to call the API
* Process:
    1. User/Resource Owner accesses Application
    1. Application redirects to Authorization Server's authorize endpoint with authorization request
    1. Authorization Server prompts user for authentication and consent
    1. User authenticates, provides consent for authuroization request
    1. Authorization Server redirects back to Application's callback URL with authorization code
    1. Application calls Authorization Server's token endpoint, passing authorization code
    1. Authorization Server response with Access Token / Refresh Token
    1. Application calls Resource Server / API using the Access Token
* Originally optimized for confidential clients
* Second request could be made by application back end directly to Authorization Server, to authenticate itself when getting an Access Token
* Proof Key for Code Exchange (PKCE) allows public clients to use this grant type

#### Authorization Code Grant Type + PKCE

* PKCE is a mechanism used with authorization/token requests to ensure that the Application that requested an auth code is the same application that uses that code to get an Access Token
* App creates a cryptographically random string ('code verifier'), long enough to provide protection against brute force guessing
* App computes a derived value ('code challenge') from the code verifier
* When the App sends an authorization request in step 2, it includes the code challenge and the method used to derive it
* When the App sends the auth code to the auth server's token endpoint, it includes the code verifier
* Auth server transforms the code verifier value using the transformation method received in the auth request, and checks that the result matches the code challenge sent with the auth request
* Only the legitimate App knows the code verifier to pass in step 6 that will match the code challenge in step 2
* PKCE spec has 2 transform methods: plain and S256
    * Plain - code challenge and verifier are identical (no protection from compromise)
    * Apps using code grant + PKCE should use S256, which uses a base64 URL encoded SHA256 has of the code verifier to protect it

#### The Authorization Request

* Sample App's API Authorization Request with PKCE, sent to an Authorization Server's authorization endpoint:

    ```
    GET /authorize?

    response_type=code
    & client_id=<client_id>
    & state=<state>
    & scope=<scope>
    & redirect_uri=<callback_uri>
    & resource=<API_identifier>
    & code_challenge=<PKCE_code_challenge>
    & code_challenge_method=S256 HTTP/1.1
    Host: authorizationserver.com
    ```

* Parameters in an Authorization Request:
    * `response_type` - OAuth 2.0 grant type. `code` used for authorization code grant type
    * `client_id` - identifier for the Application, assigned when it registered with the Authorization Server
    * `state` - Non-guessable string, unique for each call, opaque to the Authorization Server, used by the client to track state between a corresponding request and response to mitigate CSRF attacks.
    * `scope` - Scope of access privileges being requested, like `get:documents`
    * `redirect_uri` - where the Authorization Server should send its response
    * `resource` - Identifier for a specific API registered at an Authorization Server for which the access token is requested. Defined in 'Resource Indicators for OAuth 2.0' extension. Mostly used in deployments with custom APIs, not needed unless there are multiple possible APIs.
    * `code_challenge` - PKCE code challenge derived from the PKCE code verifier
    * `code_challenge_method` - 'S256' or 'plain'. Use 'S256'.

#### Response

* Sends to the callback uri:

    ```
    HTTP/1.1 302 Found
    Location: https://clientapplication.com/callback?code=<authcode>&state=<state>
    ```

* Parameters
    * `code` - authorization code to be used by the application to request an access token
    * `state` - state value, unmodified, sent in the authorization request. The app must validate that the state value in the response matches the state value sent in the original request.

#### Calling the Token Endpoint

* Sent to token endpoint:

    ```
    POST /token HTTP/1.1
    Host: authorizationserver.com
    Content-Type: application/x-www-form-urlencoded

    grant_type=authorization_code
    & code=<authorization_code>
    & client_id=<client_id>
    & code_verifier=<code_verifier>
    & redirect_uri=<callback_uri>
    ```

* Parameters
    * `grant_type` - must be `authorization_code` for the auth code grant
    * `code` - authorization code received in response to authorization call
    * `client_id` - identifier for the app
    * `code_verifier` - PKCE code verifier value from which the code challenge was derived. Unguessable, cryptographically random string between 43 and 128 characters, characters `A-Za-z0-9` and `-._~`
    * `redirect_uri` - callback URI for the authorization server's response
* Response from the token endpoint:

    ```
    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8
    Cache-Control: no-store
    Pragma: no-cache

        {
            "access_token":"<access_token_for_API>",
            "token_type":"Bearer",
            "expires_in":<token_expiration>,
            "refresh_token":"<refresh_token>"
        }
    ```

* Parameters
    * `access_token` - access token to use for API calls
    * `token_type` - type of token issues, e.g. `Bearer`
    * `expires_in` - how long the token is valid
    * `refresh_token` - optional, up to the auth server's discretion to return

### Implicit Grant

* Implicit grant type, optimized for use with public clients like single page apps
* Returns an access token in one request
* Designed when CORS (Cross-Origin Resource Sharing) wasn't widely implemented, so web pages could only make calls to the domain they were loaded from, so they couldn't call an auth server's token endpoint.
* To compensate for that, the implicit grant type has the auth server respond to an authorization request by returning tokens to the app in a redirect with a URL hash fragment.
* Process:
    1. Resource Owner accesses the Application
    1. Application redirects browser to Authorization Server's authorize endpoint, with Authorization Request
    1. Authorization Server prompts user to authenticate and provide consent
    1. User authenticates, provides consent
    1. Authorization Server redirects to app's callback URL with access token
    1. App uses access token to call Resource Server (API)
* CORS is generally supported now, so the implicit grant type isn't needed for its original purpose, and returning an access token in a URL hash fragment potentially leaks via browser history or referer headers.
* Use the authorization code grant type + PKCE instead.
* New specs define alternate response modes that can mitigate some of the issues with this grant type.

#### The Authorization Request

* Params similar to the previous grant type, but a response type of `token` indicates use of the implicit grant type, and `response_mode` set to `form_post`

    ```
    GET /authorize?

    response_type=token
    & response_mode=form_post
    & client_id=<client_id>
    & scope=<scope>
    & redirect_uri=<callback_uri>
    & resource=<API identifier>
    & state=<state> HTTP/1.1
    Host: authorizationserver.com
    ```

### Resource Owner Password Credentials Grant

* Supports situations where an app is trusted to handle end-user creds and no other grant type is possible
* App collects user's credentials directly, does not redirect to authorization server
* App passes the collected creds to the auth server for validation during request for an access token
* This type is discouraged, as it exposes the user's creds to the application
* Does not include a user consent step, so the app can request any access at all
* Primarily recommended for user migration use cases where they have to go from one repo to another with incompatible hashing methods
* Process:
    1. Resource owner accesses the application
    1. App prompts user for credentials
    1. User provides credentials to App
    1. App sends token request to the Authorization Server's token endpoint
    1. Authorization Server responds with access token
    1. Application calls the resource server (API), using the access token

### Client Credentials Grant

* Used when an app calls an API to access resources the application owns
* Process:
    1. App sends authorization request including app's creds to the auth server
    1. Authorization Server validates creds, responds with access token
    1. App calls resource server (API) using access token
    1. Steps repeat if the access token has expired by the next time the app calls the API
* No end-user interaction with the auth server is required
* App credentials serve as the authorization for the app

### Calling an API

* Typical call using an access token:

    ```
    GET /api-endpoint HTTP/1.1
    Host: api-server.com
    Authorization: Bearer <access_token>
    ```

### Refresh Token

* OAuth tokens have an expiration. An app could make a new auth request on token expiry, but there's an alternative approach for traditional web apps and native clients that involve a refresh token.
* You can use a refresh token to get a new access token when the old one expires
* Not used in all scenarios:
    * Not with client credentials grant, because an app can simply request an access token any time with no need for user interaction
    * Static refresh tokens are not used with public clients
* There is a document, "OAuth 2.0 Security Best Current Practice" that specifies, you know, best practices.
* The 2.0 spec didn't include a mechanism for apps to request refresh tokens, so the issuance is at the discretion of authorization servers
* Sample call to a token endpoint to get a new access token:

    ```
    POST /token HTTP/1.1
    Host: authorizationserver.com
    Authorization: Basic <encoded app credentials>
    Content-Type: application/x-www-form-urlencoded

    grant_type=refresh_token
    & refresh_token=<refresh_token>
    ```

### Guidance

* An SDK may abstract some of the underlying communication mechanisms
* Recommended that access token duration be short lived, and a new token obtained if necessary on expiry
* Exact durating should be based on the sensitivity of the resources guarded

# Chapter 6: OpenID Connect

* OAuth 2.0 provides a framework for authorizing apps to call APIs, but is not designed for authenticating users to applications.
* OIDC provides an identity service layer on top of OAuth 2.0

## Problem to Solve

* A user needs to be authenticated to access an application
* OIDC enables an app to delegate user authentication to an OAuth 2.0 authorization server, and have it return claims about the authenticated user and authentication event in a standard format.
* Process
    1. User accesses an application
    1. App redirects browser to an authorization server that implements OIDC (which OIDC calls an OpenID Provider)
    1. The OpenID Provider interacts with the user to authenticate them
    1. After authentication, the user's browser is redirected back to the app. App can request that claims about the authenticated user be returned in a security token called an ID Token.
    1. Alternatively it can request an OAuth token, and use it to call the OpenID Provider's UserInfo endpoint to get the claims.
* Because OIDC is a layer on top of OAuth, an app can use an OpenID Provider for both user authentication and authorization to call the OpenID Provider's API.

## Terminology

### Roles

* End User - a subject to be authenticated
* OpenId Provider (OP) - an OAuth authorization server that implements OIDC and can authenticate a user and return claims about the authenticated user and the authentication event to a relying party (application).
* Relying Party (RP) - OAuth client which delegates user authentication to an OP and requests claims about the user from the OP. (Generally we use 'application' for the relying party, but it could be another IdP)

### Client Types

* Has Public and Confidential application types similar to OAuth 2.0

### Tokens and Authorization Code

* OIDC uses the authorization code, access token, and refresh token as OAuth does
* ID Token - token used to convey claims about an authentication event and user to a relying party

### Endpoints

* Uses authorization and token endpoints as in OAuth
* UserInfo Endpoint - returns claims about an authenticated user. Requires an access token, claims returned are governed by the access token.

### ID Token

* Security token used by an OP to convey claims to an app
* Encoded in JSON Web Token (JWT) format
* Sample:

    ```
    Header (algorithm and type of token)
    {
        "alg":"RS256",
        "Typ":"JWT"
    }

    Payload (claims)
    {
        "iss":"http://openidprovider.com",
        "sub":"1234567890",
        "aud":"<base_64_string>",
        "nonce":"<base_64_string>",
        "exp":1516239322,
        "iat":1516239022,
        "name":"Fred Doe",
        "admin":true,
        "auth_time":1516239021,
        "acr":"1",
        "amr":"pwd"
    }

    Signature
    ```

* JWT is designed to convey claims between two parties
* An ID Token consist of header, payload, and signature
* Header has info on type of object (JWT), and the algorithm used to protect the integrity of the claims in the payload.
* Common algorithms:
    * HS256 (HMAC with SHA256)
    * RS256 (RSA Signature with SHA256)
* Payload contains claims about the user and the authentication event
* Signature contains a digital signature based on the payload section of the ID Token and a secret key known to the OpenID Provider
* The OP signs the JWT in accordance with the JSON Web Signature (JWS) spec
* A relying party can validate the signature
* For confidentiality, the OP can optionally encrypt the JWT using JSON Web Encryption (JWE), which produces a nested JWT
* Parameters in the claims section:
    * `iss` - issuer of the token, in URL format, typically the OP
    * `sub` - Unique (to OP), case-sensitive string ID for the authenticated user or subject entity, no more than 255 ASCII characters. Never reassinged.
    * `aud` - Client ID of the relying party (app). Single, case-sensitive string or an array of the same if multiple audiences
    * `exp` - expiration time for the ID token, as epoch time
    * `iat` - Time of issuance, as epoch time
    * `auth_time` - Time of authentication in epoch time
    * `nonce` - Unguessable, case-sensitive string value passed in authentication request from relying party and added by OP to an ID Token, to link the token to a relying party application session and facilitate detection of replayed ID tokens.
    * `amr` - String with an authentication method reference. Comes from Authentication Method Reference Values specification
    * `acr` - String with an authentication context class reference, indicates authentication context class for the auth mechanism used to authenticate the subject of the ID Token.
    * `azp` - Client ID of the authorized party to which the ID Token is issued. Typically not used unless the token only has a single audience in `aud` claim, and that audience is different from the authorized party.
* Tokens can have additional claims beyond the above. Examples of standard claims:
    * user name and variants
    * email address, email verified
    * locale
    * picture
* A list is in the OIDC core specification, section 5.1
* Specific OIDC request types may involve additional claims

## How it Works

* OIDC defines three different flows by which an app can interact with an OP to make an authentication request

### OIDC Flows

* Designed around the constraints of different types of apps, are somewhat similar to the OAuth grant types. OIDC core spec defines these flows:
    * Authorization Code Flow
    * Implicit Flow
    * Hybrid Flow

### OIDC Authorization Code Flow

* Similar to OAuth authorization code grant, relies on two requests and an intermediary authorization code

#TODO: Finish this chapter

# Chapter 7: SAML 2.0

* Security Assertion Markup Language
* Provides two important features: Cross-domain single sign on (SSO, and ID federation

## Problem to Solve

* Most common use case is cross domain SSO: user needs to access apps in different domains, without having to establish an account and authentication identity in each.
* Designed as an "XML-based framework for describing and exchanging security information between online business partners."
* Allows delegation of user authentication to a remote identity provider, which returns a post-authentication assertion about the authenticated user and authentication event.
* Also lets an app and IdP use a common, shared identifier for a user, to exchange information about the user--this is 'federated identity.'
* Federation can use the same identifier across systems, or an opaque, internal identifier which is mapped to the identifier used by the user in each system.

## Terminology

* Subject - entity about which security information will be exchanged, typically a user
* SAML Assertion - XML-based message containing security info about a subject
* SAML Profile - Spec that defines how to use SAML messages for a business use case, like cross-doman SSO
* Identity Provider - Role defined for the SAML SSO profile. An IdP is a server which issues SAML assertions about an authenticated subject in the context of x-domain SSO
* Service Provider - Role for SAML x-domain SSO. The SP delegates authentication to an IdP and relies on information about an authenticated subject in a SAML assertion
* Trust Relationship - Agreement between a SAML service provider and a SAML IdP, whereby the service provider trusts assertions issued by the IdP
* SAML Protocol Binding - Description of how SAML message elements are mapped onto standard communication protocols like HTTP, for transmission between service providers and identity providers. In practice, SAML request/response is typically over HTTPS using either HTTP-Redirect or HTTP-POST, using those bindings respectively.

## How it Works

* Most common scenario is x-domain SSO:
    * User wants to use an application
    * Application is a SAML Service Provider (SP)
    * Application delegates user authentication to a SAML identity provider (IdP), which may be in a different domain.
    * IdP authenticates a user, returns a security token (a SAML assertion) to the app
    * The SAML assertion provides info on the authentication event and subject
* Note that an entity acting as an IdP can also act as an SP, by further delegating to yet another IdP
* To establish the ability to do x-domain SSO, the orgs owning the SP and IdP exchange metadata containing info like URL endpoints and certificates with which to validate digitally signed messages.
* The metadata allows the creation/configuration of a trust relationship, and must be done before the IdP can authenticate users for the SP
* Once the trust relationship is configured, when a user accesses the SP, the SP redirects the user's browser to the IdP with a SAML authentication request message
* The IdP authenticates the user and redirects them back to the SP with a SAML authentication response message.
* The response contains a SAML assertion about the user and auth event, or an error

### SP-Initiated SSO

* Simplest form of x-domain SSO:
    1. User starts at the SP (thus 'SP-initiated')
    1. SP redirects to IdP with SAML authentication request
    1. IdP interacts with user for authentication
    1. User authenticates, IdP validates creds
    1. IdP redirects browser back to SP with SAML response with SAML authentication assertion. Response is sent to the SP's Assertion Consumer Service (ACS) URL
    1. SP consumes and validates the SAML response, responds to user's original request

### Single Sign-On

* Multiple SPs can delegate to the same IdP
* A user can authenticate for App A, and use the same browser session to access App B without having to authenticate again, since the IdP will recognize their session.

### IdP-Initiated Flow

* User starts at the IdP, IdP redirects to the SP with a SAML response message, without the SP having requested authentication
* Found in some enterprise environments with access via corporate portal.
* Useful in enterprises, makes sure user goes to correct SP to avoid phishing.
* Process:
    1. User visits corporate portal
    1. Portal redirects to IdP with SAML authentication request
    1. IdP interacts with user for authentication
    1. User authenticates, IdP validates creds
    1. IdP redirects back to portal with a SAML response (response #1)
    1. User is logged into the portal, shown content including list of applications
    1. User clicks through to an app. Link directs browser to the IdP with a parameter indicating the desired SP/app, IdP checks the user's session. (we assume it's valid)
    1. IdP redirects user to the SP's Assertion Consumer Service URL with a new SAML response (response #2) for that SP/app
    1. SP/app consumes the SAML response and authentication assertion, renders appropriate page/resource(s) to the user, based on their identity and privileges.

### Identity Federation

* Establishes an agreed-upon identifier used between an SP and an IdP to refer to a subject
* Lets the SP delegate authentication to the IdP and get back an authentication assertion with claims including an identifier for the authenticated subject that will be recognizable by the SP.
* Admins for the SP and IdP exchange metadata about their environments, use it to set up federation information between the two.
* In practice, admins of IdP configure it to send assertions to SPs that have appropriate identifiers and attributes for the application
* Link between an identity at an SP and an IdP can be set up in different ways, but in practice the user's email address is often used as the identifier.
* Can be problematic since a user may need to change their email, and using it as an identifier can conflict with privacy requirements.
* Using a specific identifier attribute can be requested dynamically within a request, or an IdP can be configured to send a particular identifier to an SP.
* Also possible for IdP and SP to exchange info using an opaque, internal identifier for a user, mapped on each side to a user's profile. Not common in practice.
* Approach to use is set when the two parties exchange metadata and configure their infrastructure to establish the federation

## Authentication Brokers

* Can be used by apps to enable support for multiple authentication protocols and mechanisms.
* If you want to use OIDC for authentication, you can get requests to support SAML from people who want their users authenticated at their corporate SAML identity provider.
* SAML is complex to implement and support, so an alternative is to use an authentication broker to simplify the task of supporting SAML
* If you don't use an authentication broker, at least use a library--don't roll your own

## Configuration

* Service Provider configuration elements:
    * SSO URL - single sign-on URL of the IdP, where the SP sends auth requests
    * Certificate - Certificate(s) from the IdP, to validate signatures on SAML responses and assertions from the IdP. Also used if the SP sends encrypted requests.
    * Protocol Binding - binding to use when sending requests, HTTP-Redirect for simple requests, HTTP-POST for signed requests (recommended)
    * Request Signing - Whether to sign SAML authentication requests, and if so by which signature algorithm. (recommended)
    * Request Encryption - Whether to digitally encrypt a SAML authenticatin request
* Identity Provider configuration elements:
    * ACS URL - The Assertion Consumer Service URL of the SP
    * Certificate - Certificate(s) from the SP, to validate signatures on SAML requests, and if responses are to be encrypted.
    * Protocol Binding - HTTP-POST typically required to accommodate signed messages
    * Response Signing - Whether to digitally sign the SAML authentication response, the assertion, or both, and the signature algorithm. Signing is mandatory.
    * Response Encryption - Whether to digitally encrypt a SAML response
* Once both providers are configured and you've attempted a trial authentication, initial failures are common. 
* Debug by attempting to authenticate, capturing a trace of the SAML request/response, and looking into them.
