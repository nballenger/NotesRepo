# Notes on AWS Cognito

From [https://docs.aws.amazon.com/cognito/index.html#lang/en_us](https://docs.aws.amazon.com/cognito/index.html#lang/en_us)

# What is Amazon Cognito

* Does:
    * authentication
    * authorization
    * user management
* Two main parts are:
    * user pools - user directories that provide sign up and sign in options
    * identity pools - let you grant users access to AWS services
* Common scenario
    * goal: authenticate user, grant them access to another AWS service
    * steps
        1. App user signs in through a user pool, gets user pool tokens
        1. App exchanges the user pool token for AWS creds via identity pool
        1. App user can use AWS creds to access AWS services

## Features

* User Pools
    * A user pool is a user directory in Cognito
    * Users sign into the app through Cognito, or federate through IdP
    * All users (federated or not) have a directory profile you can access by SDK
* User pools provide:
    * Sign-up and sign-in services
    * Built-in, customizable web UI for sign in
    * Social sign in (Facebook, Google, Login with Amazon)
    * Sign in through SAML and OIDC identity providers
    * User directory management and user profiles
    * MFA, checks for compromised credentials, account takeover protection, phone and email verification
    * Customized workflows and user migration through Lambda triggers
* Identity Pools
    * Users get temp. AWS creds
    * Support anonymous guest users
    * Also support following providers for authenticating users for identity pools:
        * Amazon cognito user pools
        * Social sign in with Facebook, Google, and Login with Amazon
        * OpenID Connect (OIDC) providers
        * SAML identity providers
        * Developer authenticated identities
    * To save user profile info, your identity pool needs to be integrated with a user pool

## Regional Data Considerations

* User pools are created in one Region, and store data only in that region
* They can send user data to another region, if configured correctly
* Includes details here about how emails are regionally routed.


