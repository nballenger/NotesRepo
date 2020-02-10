# Notes on Single Page App tracking with Google Analytics

## Single Page Application Tracking

Source: [https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications)

### Overview

* Single Page Application (SPA) - web app that loads all resources for navigation on first page load, with subsequent content loaded dynamically based on user actions.
* SPAs may or may not update the document URL to emulate traditional navigation
* Default GA snippet works with traditional websites, because it runs on page load, but SPAs only run the GA snippet one time, so subsequent pageviews have to be manually tracked on content load

### Tracking virtual pageviews

* When the app loads content and updates the document URL, the data stored in the tracker should also be updated with the `set` command, and a new pageview hit should be sent with `send`:

    ```javascript
    ga('set', 'page', '/new-path/new-page.html');
    ga('send', 'pageview');
    ```

* `send` accepts an optional `page` third argument, but don't use it for SPAs, because fields passed via `send` are not set on the tracker, and apply ONLY to the current hit. Update the tracker, then send the hit.

### Handling multiple URLs for the same resource

* Some SPAs only update the hash portion of the URL when loading content dynamically, which can cause multiple page paths to point to the same resource.
* In that case, choose a canonical URL and only send that `page` value to GA
* Hypothetical: all the following can reach the About Us page:
    * `/about.html`
    * `/#about.html`
    * `/home.html#about.html`
* Track all of them under one canonical url like `/about.html` to create coherent reports

### Important considerations

* **Do not update the document referrer**
    * If you create a tracker with the `create` command, `document.referrer` is stored in the tracker's `referrer` field. In an SPA with no full page loads other than the first, the `referrer` field does not change. Don't change it.
* **Do not update the document location**
    * `document.location` goes into the tracker's `location` field, which may contain GA campaign data or other metadata in query params.
    * Updating any campaign fields or metadata that GA is checking for can cause the current session to end and a new one to begin, so don't update `location` when tracking virtual pageviews--use the `page` field.
* **Do not create new trackers**
    * Don't try to create multiple trackers to mimic how the regular GA snippet works, it just makes problems.
