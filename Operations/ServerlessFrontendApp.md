# Notes on deploying a serverless front end app to AWS

From the [serverless-stack.com chapter on deploying the frontend](https://serverless-stack.com/chapters/deploy-the-frontend.html)

## Deploy the Frontend

* Basic setup requires
    1. Uploading application assets
    1. Using a CDN to serve those assets
    1. Pointing a domain at the CDN distribution
    1. Switching to HTTPS with an SSL cert
* AWS services involved:
    * S3 for asset hosting
    * CloudFront for CDN service
    * Route53 for domain management
    * Certificate Manager for SSL/TLS certs

### Create an S3 bucket

* Bucket region doesn't matter because service is via CDN
* Uncheck 
    * "block new public bucket policies"
    * "block public and cross account access if bucket has public policies"
* Create the bucket
* Add a bucket policy like

    ```JSON
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadForGetBucketObjects",
                "Effect": "Allow",
                "Principal": "*",
                "Action": ["s3:GetObject"],
                "Resource":["arn:aws:s3:::NAME_OF_BUCKET/*"]
            }
        ]
    }
    ```

* Enable static website hosting in the Properties tab of the bucket
* Select "use this bucket to host a website"
* Add `index.html` as the Index document and Error document
* Copy out the accessible URL from the Endpoint section of the static website hosting pane

### Deploy to S3

* Build the app
* Upload to the bucket with something like 

    ```bash
    aws s3 sync build/ s3://NAME_OF_BUCKET
    ```

### Create a CloudFront distribution

* Create a distribution in CF
* Specify the origin domain name. Do not use the options in the CF interface dropdown, because those are the REST API endpoints for the bucket, not the static website target
* Paste the URL of the bucket from S3 into the Origin Domain Name field
* Set "Compress objects automatically" to "yes", which causes files that can be compressed to get gzipped to speed up delivery
* Set the "Default Root Object" to "index.html"
* Create the distribution
* You'll get a domain name for the distro once it creates
* In this case the index.html is set as the error page, which returns a 404. We don't actually want that, because 4xx and 5xx may get blocked by firewalls. We want to return a 200 instead, even for cases where there's no route in the React Router
* You have to set up a custom error response, which is done through the "Error Pages" tab of the cloudfront distribution
* Choose "Create Custom Error Response"
* Customize the 404, by setting `/index.html` as the Response Page Path, and 200 for the HTTP Response Code. This tells CF to respond to any 404 responses from the bucket with index.html and a 200.

### Set up your domain with cloudfront

* Get a domain name in R53
* Edit the CF distribution General tab
* In Alternate Domain Names (CNAMEs), add the new domain name
* Go to R53 hosted zones, and create a Public Hosted Zone for the domain
* Create a Record Set in the details screen for the zone
* Leave the "Name" field empty since we're using the bare domain
* Set "Alias" to "Yes" since it's going to point at the CF distro
* In "Alias Target" dropdown, pick the CF distro
* Hit create to add the record set
* CF distros enable IPv6 by default, so we need an AAAA record as well
* Create another record set, pick AAAA - IPv6 address as the type
* Use the same settings as before and create it
* Can take a while to update the DNS

### Set up WWW domain redirect

* Create a new S3 bucket, name doesn't matter
* Use all default settings
* In Properties, Static Website Hosting, select Redirect requests
* Fill in the domain to redirect towards
* Copy the Endpoint URL
* Now make a CF distro to point to this S3 redirect bucket
* In that, copy the S3 Endpoint as the Origin Domain Name
* In the CNAMES, use the www prepended version of the R53 domain name
* Create the distro
* In R53, create a new record set
* use `www` as the Name, set Alias to Yes, pick the new CF distro from the Alias Target dropdown
* Add an AAAA record to support IPv6

### Set up SSL

* In Certificate Manager, us-east-1 (or whatever region the CF distros are in)
* Request a certificate, type in the domain name
* Use "Add another name to this certificate" to add the www version
* Select "DNS validation" as the validation method
* On the validation screen expand the two domains to validate
* Use the "Create record in Route 53" button
* Create the cert (can take a while)
* Now associate the certificate (once created) with the CF distros
* In the General tab of the CF distro, switch SSL certificate to Custom SSL certificate and select the created cert
* In the Behaviors tab, edit the default
* Switch the Viewer Protocol Policy to Redirect HTTP to HTTPS
* Do the same for the other (www) CF distro
* leave the Viewer Protocol Policy as HTTP and HTTPS, because you want users to go straight to the HTTPS version of the non-www domain, instead of redirecting to the HTTPS version of the www before then redirecting to the non-www HTTPS
* Update hte S3 redirect bucket created for the www, because it is currently redirecting to the HTTP version of the non-www
* IN Properties, Static Website Hosting, change Protocol to HTTPS

## Deploy Updates

* Process is similar to original deploy. Steps:
    * Build the app with changes
    * Deploy to the main S3 bucket
    * Invalidate the cache in both CF distros

### Update the App

* Make some changes.

### Deploy again

* Build the app (in this example `npm run build`
* Upload to s3

    ```bash
    aws s3 sync build/ s3://NAME_OF_BUCKET --delete
    ```

* Invalidate the CF cache
* You can invalidate individual objects by path, or by wildcard
* You need the Distribution ID of both CF distros
* Use the CLI to do the invalidation:

    ```bash
    CF_MAIN="abc123"
    CF_WWW="def456"
    aws cloudfront create-invalidation --distribution-id CF_MAIN --paths "/*"
    aws cloudfront create-invalidation --distribution-id CF_WWW --paths "/*"
    ```

* Once the invalidation completes, the full changeset should be available
* Optionally, add a deploy command to npm by adding to the scripts section of `package.json`:

    ```JSON
    {
        ...
        "scripts": {
            "predeploy": "npm run build",
            "deploy": "aws s3 sync build/ s3://NAME_OF_BUCKET --delete",
            "postdeploy": "aws cloudfront create-invalidation [rest of command]"
        }
        ...
    }
    ```

* Now if you run `npm run deploy` it will execute all three steps
