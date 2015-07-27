# Notes on GitHub API Docs

https://developer.github.com/guides/

## Overview

* All these sections have projects in https://github.com/github/platform-samples

## Getting Started

https://developer.github.com/guides/getting-started/

* Most apps will use a wrapper library
* This section talks about underlying HTTP methods first
* Examples:

```Shell
$ curl https://api.github.com/zen
Responsive is better than fast.___________________________________________________
10:34:18 nick@slagathor Versioning (master)*
$ curl https://api.github.com/users/defunkt
{
  "login": "defunkt",
  "id": 2,
  "avatar_url": "https://avatars.githubusercontent.com/u/2?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/defunkt",
  "html_url": "https://github.com/defunkt",
  "followers_url": "https://api.github.com/users/defunkt/followers",
  "following_url": "https://api.github.com/users/defunkt/following{/other_user}",
  "gists_url": "https://api.github.com/users/defunkt/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/defunkt/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/defunkt/subscriptions",
  "organizations_url": "https://api.github.com/users/defunkt/orgs",
  "repos_url": "https://api.github.com/users/defunkt/repos",
  "events_url": "https://api.github.com/users/defunkt/events{/privacy}",
  "received_events_url": "https://api.github.com/users/defunkt/received_events",
  "type": "User",
  "site_admin": true,
  "name": "Chris Wanstrath",
  "company": "GitHub",
  "blog": "http://chriswanstrath.com/",
  "location": "San Francisco",
  "email": "chris@github.com",
  "hireable": true,
  "bio": null,
  "public_repos": 106,
  "public_gists": 279,
  "followers": 13898,
  "following": 208,
  "created_at": "2007-10-20T05:24:19Z",
  "updated_at": "2015-02-13T17:30:24Z"
}
___________________________________________________
10:34:31 nick@slagathor Versioning (master)*
$ curl -i https://api.github.com/users/defunkt
HTTP/1.1 200 OK
Server: GitHub.com
Date: Fri, 13 Feb 2015 18:34:44 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 1274
Status: 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 44
X-RateLimit-Reset: 1423853619
Cache-Control: public, max-age=60, s-maxage=60
Last-Modified: Fri, 13 Feb 2015 17:30:24 GMT
ETag: "e3e63c05830b4bd30ed31b32f0b8b8ea"
Vary: Accept
X-GitHub-Media-Type: github.v3
X-XSS-Protection: 1; mode=block
X-Frame-Options: deny
Content-Security-Policy: default-src 'none'
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval
Access-Control-Allow-Origin: *
X-GitHub-Request-Id: 188F45E2:12A9:58B401F:54DE43C3
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
X-Content-Type-Options: nosniff
Vary: Accept-Encoding
X-Served-By: dc1ce2bfb41810a06c705e83b388572d

{
  "login": "defunkt",
  "id": 2,
  "avatar_url": "https://avatars.githubusercontent.com/u/2?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/defunkt",
  "html_url": "https://github.com/defunkt",
  "followers_url": "https://api.github.com/users/defunkt/followers",
  "following_url": "https://api.github.com/users/defunkt/following{/other_user}",
  "gists_url": "https://api.github.com/users/defunkt/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/defunkt/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/defunkt/subscriptions",
  "organizations_url": "https://api.github.com/users/defunkt/orgs",
  "repos_url": "https://api.github.com/users/defunkt/repos",
  "events_url": "https://api.github.com/users/defunkt/events{/privacy}",
  "received_events_url": "https://api.github.com/users/defunkt/received_events",
  "type": "User",
  "site_admin": true,
  "name": "Chris Wanstrath",
  "company": "GitHub",
  "blog": "http://chriswanstrath.com/",
  "location": "San Francisco",
  "email": "chris@github.com",
  "hireable": true,
  "bio": null,
  "public_repos": 106,
  "public_gists": 279,
  "followers": 13898,
  "following": 208,
  "created_at": "2007-10-20T05:24:19Z",
  "updated_at": "2015-02-13T17:30:24Z"
}
```

