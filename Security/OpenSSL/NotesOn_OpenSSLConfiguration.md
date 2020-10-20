# Notes on OpenSSL Configuration

From http://man.openbsd.org/openssl.cnf.5

* Conf files divided into sections
* Section starts with `[ section_name ]`
* Section ends at start of next section or EOF
* First section is special, is the 'default section', usually unnamed
* Names are looked up in named sections if any, then default section
* Environment mapped to a section called `ENV`
* Comments start with `#`
* Each section is a name followed by `name=value` pairs
* `name` can be alphanumeric plus period, comma, semicolon, underscore
* Value is the string following the `=` until end of line, trimmed of whitespace
* Value strings undergo variable expansion
* Expansion happens for strings of form `$name` or `${name}`
* That will subsitute the named variable in the current section
* Can also do `$section::name` or `${section::name}`, which will look up in other sections
* You can sub in env values with `$ENV::name`
* Can assign to env vars using the name `ENV::name`
* You can escape certain characters using quotes or `\`
* You can do multiline by making the last character a backslash
* Also recognizes `\n`, `\r`, `\b`, `\t`

## X509v3 config

From http://man.openbsd.org/x509v3.cnf.5

* Several OpenSSL utilities can add extensions to a certificate or cert request based on the contents of a config file.
* Each line of the extension section is of the form `ext_name=[critical,] ext_opts`
* Four main types of extension:
    * string extensions
        * have a strong which contains either the value or how it is obtained
        * Ex: `nsComment="This is a comment."`
    * multi-valued extensions
        * Have a short form and a long form
        * Short form is list of names/values
        * Ex: `basicConstraints=critical,CA:true,pathlen:1`
        * Long form lets you put values in a separate section:

            ```
            basicConstraints=critical,@bs_section

            [bs_section]
            CA=true
            pathlen=1
            ```

    * raw extensions
        * syntax governed by extension code
        * correct syntax defined by extension code itself
        * look at certificate policies extension as an example
    * arbitrary extensions
        * If an extension type is unsupported, must use the arbitrary type

### Standard Extensions

#### Basic Constraints

* Multi-valued extension
* Indicates whether a cert is a CA certificate
* First (mandatory) name is CA followed by TRUE or FALSE
* If true, then an optional `pathlen` name followed by non-negative value can be included
* Ex: `basicConstraints=critical,CA:TRUE, pathlen:0`
* A CA cert must include the basicConstraints value with CA true
* An end user cert must either set CA to false or exclude the extension entirely
* `pathlen` param indicates max number of CAs that can appear below this one in a chain. So a CA with a pathlen of zero can only be used to sign end user certs, no further CAs

#### Key Usage

* Multi-valued extension
* List of names of the permitted key usages
* Supported names:
    * `digitalSignature`
    * `nonRepudiation`
    * `keyEncipherment`
    * `dataEncipherment`
    * `keyAgreement`
    * `keyCertSign`
    * `cRLSign`
    * `encipherOnly`
    * `decipherOnly`
* Examples:
    * `keyUsage=digitalSignature, nonRepudiation`
    * `keyUsage=critical, keyCertSign`

#### Extended Key Usage

* Consists of a list of usages indicating purposes for which the certificate public key can be used.
* Can either be object short names or dotted numeric OIDs
* Any OID may be used, but only some values make sense
* In particular these PKIX, NS, MS values are meaningful:
    * `serverAuth` - SSL/TLS web server authentication
    * `clientAuth` - SSL/TLS web client authentication
    * `codeSigning` 
    * `emailProtection`
    * `timeStamping` - trusted timestamping
    * `OCSPSigning`
    * `ipsecIKE` - IPsec internet key exchange
    * `msCodeInd` - msoft individual code signing
    * `msCodeCom` - msoft commercial code signing
    * `msCTLSign` - msoft trust list signing
    * `msEFS` - msoft encrypted file system
* Examples:
    * `extendedKeyUsage=critical,codeSigning,1.2.3.4`
    * `extendedKeyUsage=serverAuth,clientAuth`

#### Subject Key Identifier

* String extension with two values
    * `hash` - automatically follows RFC 3280 guidelines
    * hex string giving extension value to include (strongly discouraged)

#### Authority Key Identifier

* Permits two options, `keyid` and `issuer`
* Both can take optional value `always`
* If `keyid` is present, an attempt is made to copy the subject key identifier from the parent cert. If value `always` is present, an error is returned if the option fails.
* `issuer` option copies the issuer and serial number from the issuer certificate
* That will only be done if `keyid` option fails or is not include, unless the `always` flag will always include the value
* Example: `authorityKeyIdentifier=keyid,issuer`

#### Subject Alternative Name

* Allows various literal alues to be included in the config file
* Values include
    * email - an email address
    * URI - a uniform resource identifier
    * DNS - a dns domain name
    * RID - registered ID: OBJECT IDENTIFIER
    * IP - an IP address
    * dirName - distinguished name
    * otherName
* The email option can include a special `copy` value, which will automatically include any email addresses in the cert subject name in the extension
* IP can be v4 or v6
* dirName should point to a section containing the distinguished name to use as a set of name value pairs. Multi-valued AVAs can be fored by prefacing the name with `+`
* otherName can include arbitrary data associated with an OID
* Examples
    * `subjectAltName=email:copy,email:my@other.address,URI:http://my.url.here`
    * `subjectAltName=IP:192.168.7.1`
    * `subjectAltName=IP:13::17`
    * `subjectAltName=email:my@other.address,RID:1.2.3.4`
    * `subjectAltName=otherName:1.2.3.4;UTF8:some other identifier`
* Long form:

    ```
    subjectAltName=dirName:dir_sect

    [dir_sect]
    C=UK
    O=My Organization
    OU=My Unit
    CN=My Name
    ```

#### Issuer Alternative Name

* Supports all the literal options of subject alternative name
* Does not support `email:copy` because that doesn't make sense
* Does support additional `issuer:copy` option that will copy all the subject alternative name values from the issuer certificate if possible
* Ex. `issuerAltName = issuer:copy`

#### Authority Info Access

* Gives details about how to access certain information relating to the CA
* Syntax is `accessOID; location` where `location` has same syntax as SAN
* `accessOID` can be any valid OID, though only some values are meaningful

#### CRL Distribution Points

* Multi-valued extension whose options can be either name:value pairs in same form as SAN, or a single value representing a section name containing all the distribution point fields
* Simple examples:
    * `crlDistributionPoints=URI:http://myhost.com/myca.crl`
    * `crlDistributionPoints=URI:http://my.com/my.crl,URI:http://oth.com/my.crl`
* Full distribution point example:

    ```
    crlDistributionPoints=crldp1_section

    [ crldp1_section ]
    fullname=URI:http://myhost.com/myca.crl
    CRLissuer=dirName:issuer_sect
    reasons=keyCompromise, CACompromise

    [ issuer_sect ]
    C=UK
    O=Organization
    CN=Some Name
    ```

#### Issuing Distribution Point

* Should only appear in CRLs
* Multivalued, syntax similar to the section pointed to by the CRL distribution points extension

#### Certificate Policies

* Raw extension
* All fields can be set using the appropriate syntax
* If you follow PKIX recommendations and just use one OID, then you just include the value of the OID. Multiple OIDs can be separated by commas
* If you want to include qualifiers, then the policy OID and qualifiers need to be specified in a separate section, done using `@section` syntax instead of a literal OID
* Long form example:

    ```
    certificatePolicies=ia5org,1.2.3.4,1.5.6.7.8,@polsect

    [ polsect ]
    policyIdentifier = 1.3.5.8
    CPS.1="http://my.host.name/"
    CPS.2="http://my.your.name/"
    userNotice.1=@notice

    [ notice ]
    explicitText="Explicit Text Here"
    organization="Org Name"
    noticeNumbers=1,2,3,4
    ```

#### Policy Constraints

* Multivalued extension
* Consists of two possible names, `requireExplicitPolicy` or `inhibitPolicyMapping`
* Also a non-negative integer value
* At least one component must be present
* Ex: `policyConstraints = requireExplicitPolicy:3`

#### Inhibit Any Policy

* String extension, value must be non-negative integer
* `inhibitAnyPolicy = 2`

#### Name Constraints

* Multivalued
* Name should begin with `permitted` or `excluded` followed by `;`
* Rest of the name and the value follows syntax of subjectAltName
* `email:copy` not supported
* `IP` form should be an IP address and subnet mask separated by a slash
* Examples:
    * `nameConstraints=permitted;IP:192.168.0.0/255.255.0.0`
    * `nameConstraints=permitted;email:.somedomain.com`
    * `nameConstraints=excluded;email:.com`

#### OCSP No Check

* String extension, but its value is ignored
* Ex: `noCheck = ignored`

#### TLS Feature (aka Must Staple)

* Multi-valued extension
* List of TLS extension identifiers
* Each identifier may be a number from 0-65535 or a supported name
* When a TLS client sends a listed extension, the TLS server is expected to include that extension in its reply
* Supported names are `status_request` and `status_request_v2`
* Ex: `tlsfeature = status_request`

