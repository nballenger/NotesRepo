# Notes on Google Analytics

From [https://developers.google.com/analytics/devguides/collection/analyticsjs](https://developers.google.com/analytics/devguides/collection/analyticsjs)

# Adding analytics.js to your site

## The JS measurement snippet

* The JS snippet should be added near the top of the head tag, before any other script or css tags. Replace `UA-XXXXX-Y` (the `'GA_MEASUREMENT_ID'`) with the property ID of the GA property you want to work with:

    ```javascript
    <!-- Google Analytics -->
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');
    </script>
    <!-- End Google Analytics -->
    ```

* That does the following:
    1. Starts async downloading the analytics.js library from a google CDN
    1. Initializes a global `ga` function (the 'ga() command queue') that lets you schedule commands to run once the library is fully loaded and initialized
    1. Adds a command to the queue to create a new object tracker with the property id
    1. Adds another command to send a pageview for the current page
* The previous snippet doesn't let modern browsers preload teh script
* This allows for preloading, though it can degrade to sync loading on IE9 and older mobile browsers that don't allow the `async` script attribute. Only use this if your site visitors use mostly modern browsers:

    ```javascript
    <!-- Google Analytics -->
    <script>
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');
    </script>
    <script async src='https://www.google-analytics.com/analytics.js'></script>
    <!-- End Google Analytics -->
    ```

### What data does the tracking snippet capture?

* Adding the snippet sends a pageview for each page a user visits. GA can infer from what it collects:
    * Total time a user was on the site
    * Time a user spends on each page, what order the pages were visited in
    * What internal links were clicked based on url of next pageview
* It also captures IP, UA string, and initial page inspection data to infer:
    * geographic location of user
    * what browser and OS they're using
    * screen size and flash/java capabilities
    * referring site

# How analytics.js works

* Most everything happens via the `ga()` command queue

## The ga command queue

* It adds commands to a queue to wait for analytics.js to load and initialize
* Tracking snippet adds `ga.q` property as an empty array, appends commands to it
* On load, the library inspects the queue and executes it in order
* After that the `ga()` function object is redefined, so all subsequent calls execute immediately

## Adding commands to the queue

* All calls to `ga()` have a common signature:

    ```javascript
    ga('<COMMAND>'[, '<ARG1>', '<ARGN>']);
    ```

* The command may be a global method on the `ga` object, or an instance method on a tracker object
* Unrecognized commands are ignored

## Command Parameters

* Each command/method accepts parameters in a number of formats, to make it easier to pass commonly used fields
* All commands accept a final `fieldsObject` param to specify fields.
* Simple then complex examples of two commands:

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');

    ga('create', {
        trackingId: 'UA-XXXXX-Y',
        cookieDomain: 'auto'
    });
    ga('send', {
        higType: 'pageView'
    });
    ```

# Creating Trackers

* Tracker objects collect and store data, and send it on to GA
* When creating one, you specify a tracking id / property id and a cookie domain (which specifies how cookies are stored--recommended to use 'auto')
* If a cookie doesn't exist for the domain, a client id is generated and stored in the cookie, and the user is identified as new. If one exists already, the user is 'returning'
* On create, trackers gather browsing context info

## The create method

* Multiple ways to create them, most common is `ga('create', 'UA-XXXXX-Y', 'auto');`

## Naming trackers

* You can pass a fourth argument, `name`, to `create`
* Required if you want to use more than one tracker in a single page
* Without setting a name, you create a default tracker with the name `t0`

## Specifying fields at creation time

* You can pass a fields object as the last argument, which lets you set any analytics.js fields at create time to be stored on the tracker, and apply to all hits that are sent. You can also use it to specify all fields to be sent as arguments:

    ```javascript
    // parameter passing plus custom fields
    ga('create', 'UA-XXXXX-Y', 'auto', 'myTracker', {
        userId: '12345'
    });

    // fields object for all params including custom
    ga('create', {
        trackingId: 'UA-XXXXX-Y',
        cookieDomain: 'auto',
        name: 'myTracker',
        userId: '12345'
    });
    ```

## Working with multiple trackers

* Useful for sites with multiple owners each overseeing a section
* You need a tracker per property id, and N-1 must have names
* To run commands on a specific tracker, prefix the command name with the tracker name

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('create', 'UA-XXXXX-Z', 'auto', 'clientTracker');

    ga('send', 'pageview'); // sends to default
    ga('clientTracker.send', 'pageview'); // sends to named
    ```

# Getting and Setting tracker data

* To get or set fields you need a reference to the tracker object itself
* You therefore have to wait until after `create` executes, via the ready callback

## The ready callback

* You add it to the command queue, and it is invoked after load/init and all previous commands execute in order
* Adding a ready callback to the queue after adding create ensures that the ready callback is executed after the tracker is created
* If a default tracker exists when the ready callback is invoked, it is passed as the callback's first/only argument:

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto');

    ga(function(tracker) {
        // logs tracker created above to the console
        console.log(tracker);
    });
    ```

## Getting trackers via ga object methods

* If you're using a named tracker, you can access it via an object method once the `ga` object is fully redefined post-init
* Two methods are used, `getByName` and `getAll` to access tracker objects:

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto', 'myTracker');

    ga(function() {
        console.log(ga.getByName('myTracker'));
    });

    ga('create', 'UA-XXXXX-Y', 'auto', 'tracker1');
    ga('create', 'UA-XXXXX-Z', 'auto', 'tracker2');

    ga(function() {
        console.log(ga.getAll());
    });
    ```

## Getting data stored on a tracker

* You can use the `get` method to access a value of any field on a tracker:

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto');

    ga(function(tracker) {
        console.log(tracker.get('name'));
        console.log(tracker.get('clientId'));
        console.log(tracker.get('referrer'));
    });
    ```

* You can update data on a tracker using the `set` method, either on a tracker or via the queue
    * queue: `ga('set', 'page', '/about');`
    * named: `ga('myTracker.set', 'page', 'about');`
    * on the tracker: `ga(function(tracker) { tracker.set('page', '/about'); });`
* Note that tracker objects do not update themselves. If a user resizes a window, the tracker won't know unless you manually update it.

## Ampersand Syntax

* Tracker fields are usually get and set using their field names, but you can refer to them by their 'Measurement Protocol parameter names' as well:

    ```javascript
    ga(function(tracker) {
        console.log(tracker.get('title')); // by name
        console.log(tracker.get('&dt')); // by mp param name
    });
    ```

* Ampersand syntax is not recommended. Only use it if a field name for a parameter doesn't exist, which really only happens when the Measurement Protocol is updated and analytics.js hasn't caught up.

# Sending data to Google Analytics

* Last line of the measurement snippet adds a `send` command to the queue to send a pageview to GA
* The tracker does the sending, the data sent is what's in the tracker at send time

## Hits, hit types, and the Measurement Protocol

* When a tracker sends data it's called sending a hit
* Every hit must have a hit type
* Hit types include:
    * `pageview`
    * `screenview`
    * `event`
    * `transaction`
    * `item`
    * `social`
    * `exception`
    * `timing`
* The hit is an HTTP request made of field and value pairs encoded as a query string, and sent to the Measurement Protocol
* You can see requests going to `google-analytics.com/collect`

## What data gets sent

* Trackers send all fields currently stored and that are valid Measurement Protocol parmeters
* To send fields with the current hit only, pass them as argument to `send`
* To have field data sent with all subsequent hits, update the tracker with `set`

## The send method

* Can be called on a tracker or by adding to the queue
* Mostly you use the queue, since usually you don't have a reference to the tracker
* Signature via the queue:

    ```javascript
    ga('[trackerName.]send', [hitType], [...fields], [fieldsObject]);
    ```

* Examples:

    ```javascript
    ga('send', {
        hitType: 'event',
        eventCategory: 'Video',
        eventAction: 'play',
        eventLabel: 'cats.mp4'
    });

    // alternately
    ga('send', 'event', 'Video', 'play', 'cats.mp4');

    // on a tracker object instead of the queue
    ga(function(tracker) {
        tracker.send('event', 'Video', 'play', 'cats.mp4');
    });
    ```

## Knowing when the hit has been sent

* Use case is doing something immediately after send is complete
* Commonly you'd do it when you're sending a user away from the page--send the hit, then complete the redirect, since JS commonly stops completely when page unload begins
* To be notified when the hit is done sending, set the `hitCallback` field:

    ```javascript
    // gets ref to a form element
    var form = document.getElementById('signup-form');

    form.addEventListener('submit', function(event) {
        // prevent browser from submiting the form and starting page unload
        event.preventDefault();

        // sent the GA hit, resubmit the form on completion
        ga('send', 'event', 'Signup Form', 'submit', {
            hitCallback: function() {
                form.submit();
            }
        });
    });
    ```

* The above works, but if the analytics library fails to load, the callback won't run and the form never submits. 
* **Whenever you put critical site functionality inside a `hitCallback` function, you should always use a timeout function to handle cases where the analytics.js library fails to load.**
* Update of the code to use a timeout:

    ```javascript
    var form = document.getElementById('signup-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        setTimeout(submitForm, 1000); // calls submitForm after 1s

        // tracks whether form has been submitted, which prevents the form
        // from being submitted twice if hitCallback fires normally
        var formSubmitted = false;

        function submitForm() {
            if (!formSubmitted) {
                formSubmitted = true;
                form.submit();
            }
        }

        // send the hit, resubmit on completion
        ga('send', 'event', 'Signup Form', 'submit', {
            hitCallback: submitForm
        });
    });
    ```

* Just create a utility function if you do it frequently, like

    ```javascript
    function createFunctionWithTimeout(callback, opt_timeout) {
      var called = false;
      function fn() {
        if (!called) {
          called = true;
          callback();
        }
      }
      setTimeout(fn, opt_timeout || 1000);
      return fn;
    }
    ```

## Specifying different transport mechanisms

* By default analytics.js picks the HTTP method and transport mechanism to optimally send hits
* Options:
    * `image` - uses an `Image` object
    * `xhr` - uses `XMLHttpRequest` object
    * `beacon` - uses `navigator.sendBeacon` method
* `image` and `xhr` share the problem where hits are not sent after the start of page unload, but the last one is a new HTML feature to solve that problem. 
* If the user's browser supports `navigator.sendBeacon`, you can specify `beacon` as the `transport` mechanism and not worry about setting a hit callback
* Code ot use it in browsers that support it:

    ```javascript
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('set', 'transport', 'beacon');
    ```

* Right now it only uses that if the browser supports it AND you explicitly set it, will probably default to it in the future for supporting browsers.

# Using Plugins

## Requiring plugins

* `require` command takes a plugin name, registers it for use with `ga()` command queue
* Full signature: `ga('[trackerName.]require', pluginName, [pluginOptions]);`
* The `require` command initializes the plugin methods, but does not load the plugin script itself. You need to manually add the code the page for 3rd party or self-written plugins, via a script tag.

    ```javascript
    <script>
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('require', 'linkTracker');
    ga('send', 'pageview');
    </script>

    <!--Note: plugin scripts must be included after the tracking snippet. -->
    <script async src="/path/to/link-tracker-plugin.js"></script>
    ```

* Official plugins are loaded on require.
* More stuff here about loading/using plugins, skipping for the moment.

# Debugging

## Debug version of the library

* Change the URL to use `.../analytics_debug.js`
* Don't use for prod, quite a bit bigger, slows things down.

## Testing without sending hits

* Debug version sends real hits; if you don't want to, you can disable the `sendHitTask` task and nothing will send. On localhost, this would prevent hits from being sent:

    ```javascript
    [...]

    ga('create', 'UA-XXXXX-Y', 'auto');

    if (location.hostname == 'localhost') {
        ga('set', 'sendHitTask', null);
    }

    ga('send', 'pageview');

    [...]
    ```

## Trace debugging

* Enabling it gives more verbose console output
* Load the debug version, add this to the tracking snippet before any calls to the command queue:

    ```javascript
    [...]

    window.ga_debug = {trace: true};
    
    ga('create' [...]
    ```

## GA Debugger Chrome extension

* Available at [https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

## Google Tag Assistant

* Chrome extension to help validate tracking code on your website, troubleshoot common problems
* Useful for debugging and testing locally before deploying code
* Tag Assistant lets you record a typical user flow, keeping track of all hits you send, checking them for problems, gives you a full report of interactions.


========

# Tracking Common User Interactions

## Page Tracking

* Measures views for a particular page. Can be document based or virtual pageviews (requires explicit send)
* The tracking snippet includes a command to create a tracker and send a pageview to GA. That includes `document.title` and `document.location`
* The default tracker does not set the `page` field, but if set manually it will be used as the page path in report (overriding `location`)
* Sending a pageview hit:

    ```javascript
    ga('send', 'pageview', [page], [fieldsObject]);
    ```

* Primary fields relevant to tracking pageviews:
    * `title` - page title
    * `location` - url being tracked
    * `page` - path portion of URL, should start with `/`
* None of them individually is required, but one of `page` or `location` must be present or the hit is invalid
* Examples

    ```javascript
    ga('send', 'pageview', location.pathname);

    ga('send', {
        hitType: 'pageview',
        page: location.pathname
    });
    ```

* If the URL you want to track is different from the one in the browser's address bar, you can specify `page` explicitly. Common solution when, say, you have multiple URLs that you want to track as one, like tracking `/user/USER_ID/profile`, `/user/USER_ID/account`, and `/user/USER_ID/notifications` but you want to remove the unique ids:

    ```javascript
    // checks for userID in URL, removes it if found
    if (document.location.pathname.indexOf('user/' + userId) > -1) {
        var page = document.location.pathname.replace('user/' + userId, 'user');
        ga('send', 'pageview', page);
    }
    ```

* Sends hits to `/user/profile`, `/user/account`, `/user/notifications` so they aggregate properly.
* The above sends for a single hit, if you set it on the tracker it sends for all subsequent hits: `ga('set', 'page', page);`
* If you run a single page app, you need to track virtual pageviews.

## Event Measurement

* Event - user interaction with content that can be measures independently from a web page or screen load. Examples are downloads, mobile ad clicks, flash elements, ajax embedded elements, and video plays

## Implementation

* Generally: `ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);`

### Event Fields

* `eventCategory` - text, required, typically object interacted with ("Video")
* `eventAction` - text, required, type of interaction ("Play")
* `eventLabel` - text, optional, categorizes events ("Fall Campaign")
* `eventValue` - integer, optional, numeric value associated with event

## Examples

```javascript
ga('send', {
    hitType: 'event',
    eventCategory: 'Videos',
    eventAction: 'play',
    eventLabel: 'Fall Campaign'
});
```

### Measure outbound links and forms

* If a user clicks a link or submits a form to an external domain, that action isn't captured unless you manually tell GA about it
* Outbound link and form event measurement can be done by sending events and specifying the destination URL in an event field

    ```javascript
    function handleOutboundLinkClicks(event) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'click',
            eventLabel: event.target.href,
            transport: 'beacon'
        });
    }
    ```

* Can be tricky since browsers typically stop JS on page unload
* One solution is to set the `transport` field to `beacon`, as above

### Non-interaction events

* If you specify `nonInteraction` as `true` in your sent params, it won't be counted as an interaction

# User Timings

* Intended for devs to measure latency of ajax requests and loading web resources

## Implementation

```javascript
ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel], [fieldsObject]);
```

### User Timings Fields

* `timingCategory`, text, required, string for categorizing user timing variables into logical groups
* `timingVar`, text, required, string to identify variable being recorded
* `timingValue`, integer, required, number in ms elapsed time to report
* `timingLabel`, text, optional, string for adding flexibility in visualizing

## Examples

```javascript
ga('send', 'timing', 'JS Dependencies', 'load', 3549);

ga('send', {
    hitType: 'timing',
    timingCategory: 'JS Dependencies',
    timingVar: 'load',
    timingValue: 3549
});
```

### Measuring time

* You're responsible for the timing code
* Easiest way is to create a timestamp before and after something, and get the delta
* Most modern browsers support the Navigation Timing API, which puts methods in `window.performance`
* Example using `performance.now()`, which returns time elapsed since the page first started loading

    ```javascript
    // Feature detects Navigation Timing API support
    if (window.performance) {
        // gets me since page load, rounds to int
        var timeSincePageLoad = Math.round(performance.now());
        ga('send', 'timing', 'JS Dependencies', 'load', timeSincePageLoad);
    }
    ```

## Sampling Considerations

* GA samples timing hits during processing to ensure an equitable distribution of system resources for this feature
* Rate at which timing hits are sampled is determined by hte total number of pageview hits received during the previous day for the property
    * 0-1000 pageview hit count previous day, max 100 timing hits processed today
    * 1k-100k, 10% of total pageview hit count
    * 100k-1M, 10,000 timing hits today
    * 1M+, 1% of total pageview hit count

### Limiting the number of hits sent

* `analytics.js` lets you control the percentage of hits sent via the `sampleRate` and `siteSpeedSampleRate` configuration options
* By default those are set to 100% and 1%, respectively
* You can adjust those to be closer to what GA will actually process

# Exception Tracking

* Lets you measure number and type of crashes or errors on a property

## Implementation

```javascript
ga('send', 'exception', [fieldsObject]);
```

### Exception fields

* `exDescription`, text, optional, description of exception
* `exFatal`, boolean, optional, true if fatal

```javascript
try {
    window.possiblyUndefinedFunction();
} catch(err) {
    ga('send', 'exception', {
        'exDescription': err.message,
        'exFatal': false
    });
}
```

# Custom Dimensions and Metrics

* Lets you send custom data to GA
* Can be used to segment and measure differences in all sorts of stuff
* 
