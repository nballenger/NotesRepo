# Notes on the openssl CLI utility

From http://man.openbsd.org/openssl

* OpenSSL is a crypto toolkit that implements TLS v1 and some crypto standards
* `openssl` is a CLI tool for using crypto functions of the OpenSSL library
* Listing commands:

    ```
    openssl list-standard-commands
    openssl list-message-digest-commands
    openssl list-cipher-commands
    openssl list-cipher-algorithms
    openssl list-message-digest-algorithms
    openssl list-public-key-algorithms
    ```

## Standard Commands

### ASN1PARSE

* Diagnostic utility that can parse ASN.1 structures, and extract data from ASN.1 formatted data.
* Usage: `openssl asn1parse [options]`
* Options:
    * `-dlimit N` - dump first N bytes of unknown data in hex
    * `-dump` - dump unknown data as hex
    * `-genconf file` - generate encoded data based on file
    * `-genstr string` - generate encoded data based on string
    * `-i` - indent output
    * `-in file` - input file to read
    * `-inform der|pem|txt` - input format
    * `-length N` - bytes to parse, default is to EOF
    * `-noout` - do not output parsed version of input
    * `-offset N` - starting offset to begin parsing
    * `-oid file` - file containing additional object identifiers (OIDs)
    * `-out file` - The DER-encoded output file
    * `-strparse N` - parse content octets of the ASN.1 object starting at offset N

### CA

* Minimal certificate authority application. Can be used to sign cert requests in various forms and generate CRLs. Also maintains a text DB of issued certs.
* Usage: `openssl ca [options]`
* Options:
    * `-batch` - batch mode, no questions asked, all certs certified automatically
    * `-cert file` - CA cert file
    * `-config file` - alternative config file
    * `-create_serial` - if reading the serial from the text file specified in config fails, create a new random serial to use as next
    * `-days N` - number of days to certify for
    * `-enddate [YY]YYMMDDHHMMSSZ` - expiry date
    * `-extensions section` - section of the config containing cert extensions to be added when a certificate is issued. Defaults to `x509_extensions` unless `-extfile` option is used. If not present, issues V1 cert, if present (even empty) issues V3.
    * `-extfile file` - additional config file to read cert extensions from
    * `-in file` - input file with a single certificate request to be signed by the CA
    * `-infiles` - if present must be last option, all subsequent args are assumed to be filenames with certificate requests
    * `-key password` - password used to encrypt the private key
    * `-keyfile file` - private key to sign requests with
    * `-keyform pem|der` - private key file format, default is pem
    * `-md algorithm` - message digest to use, `md5` or `sha1`, etc.
    * `-msie_hack` - legacy option for very old IE versions
    * `-multivalue-rdn` - causes the `-subj` arg to be interpreted with full support for multivalued RDNs, like `"/DC=org/DC=OpenSSL/DC=users/UID=123456+CN=John Doe"`
    * `-name section` - specifies config file section to use (overrides `default_ca` in the `ca` section)
    * `-noemailDN` - the DN of a cert can contain the EMAIL field if present in the request DN, but it is good policy just having the email set into the altName extension of the certificate. When this option is set, the EMAIL field is removed from the cert's subject and set only in the eventually present extensions. Can us `email_in_dn` keyword in config file to enable this behavior.
    * `-notext` - don't output text form of a cert to the output file
    * `-out file` - output file to output certificates to, default is STDOUT
    * `-outdir directory` - directory to putput certs to. Will be written to a file consisting of serial number in hex with `.pem` extension
    * `-passin arg` - key password source
    * `-policy arg` - Define the CA policy to use. Policy section in the config file is a set of vars corresponding to cert DN fields. Values may be one of `match` (value must match the same field in the CA cert), `supplied` (value must be present), or `optional` (value may be present). Any fields not mentioned in the policy section are silently deleted, unless the `-preserveDN` option is set.
    * `-preserveDN` - normally the DN order of a cert is the same as the order of the fields in the relevant policy section. If this option is set, the order is the same as the request. Largely for compatibility with older IE enrollment control.
    * `-selfsign` - indicates the issued certs are to be signed with the key the certificate requests were signed with, given with `-keyfile`. Cert requests signed with a different key are ignored. If `-gencrl`, `spkac`, or `-ss_cert` are given, `-selfsign` is ignored.
    * `-sigopt nm:v` - pass options to the signature algorithm during sign or certify operations. Name/value pairs are algorithm specific.
    * `-spkac file` - file with a single Netscape signed public key and challenge.
    * `-ss_cert file` - single self-signed cert to be signed by the CA
    * `-startdate [YY]YYMMDDHHMMSSZ` - start date of the cert
    * `-subj arg` - supercedes the subject name given in the request. Arg must be formatted as `/type0=value0/type1=value1/type2=...`. Characters may be escaped by backslash, no spaces are skipped.
    * `-utf8` - interpret field values read from terminal or config file as UTF8 strings. By default they're interpreted as ASCII.
    * `-verbose`


### GENRSA

* Generates an RSA private key.
* Usage: `openssl genrsa [options] [numbits]`
* Options:
    * `-3` | `-f4` - Public exponent to use, either 3 or 65537, default 65537
    * `-aes128` | `-aes192` | `-aes256` | `-camellia128` | `-camellia192` | `-camellia256` | `-des` | `-des3` | `-idea` - Encrypt with AES, CAMELLIA, DES, triple DES, or IDEA ciphers, respectively, before output. If none used, no encryption used, if encryption sued, a pass phrase is prompted for
    * `-out file` - output file to write to, or STDOUT
    * `-passout arg` - output file password source
    * `numbits` - size of the private key to generate, in bits. Must be last. 

### REQ

* Primarily creates and processes certificate requests in PKCS#10 format
* Can also create self-signed certificates for use as root CAs
* Usage: `openssl req [options]`
* Options:
    * `-addext ext` - add specific extension to the cert (if `-x509` option present) or certificate request. Arg must be in k=v form as it would appear in a config file, may be given multiple times.
    * `-asn1-kludge` - produce requests in an invalid format for picky CAs
    * `-batch` - noninteractive mode
    * `-config file` - specify alternative config file
    * `-days N` - number of days to certify the certificate for, used with `-x509`
    * `-extensions section` - specify alt sections to include cert extensions or cert request extensions, allowing several different sections to be used in the same configuration file
    * `-reqexts section` - same as above
    * `-in file` - input file to read a request from, or STDIN. Request only read if the creation options `-new` and `-newkey` are not specified
    * `-inform der|pem` - input format
    * `-key keyfile` - file to read the private key from. Also accepts PKCS#8 format private keys for PEM format files.
    * `-keyform der|pem` - format of private key specified in `-key`, default pem
    * `-keyout file` - file to write the new private key to. If unspecified, uses filename present in the config file.
    * `-md5` | `-sha1` | `-sha256` - message digest to sign the request with. Overrides digest algorithm in the config file.
    * `-modulus` - print the value of the modulus of the public key contained in the request
    * `-multivalue-rdn` - causes `-subj` to be interpreted with full support for multivalued RDNs.
    * `-nameopt option` - determine how the subject or issuer names are displayed. `option` can be a single option or multiple options separated by commas. Alternatively, the options may e used more than once to set multiple options.
    * `-reqopt option` - same as above
    * `-new` - generate a new certificate request. User prompted for relevant field values, based on fields specified in the configuration file and any requested extensions. If `-key` is not used, generates a new RSA private key using info from config file.
    * `-newhdr` - add the word NEW to the PEM file header and footer lines in the outputted request. Some software and CAs need this.
    * `-newkey arg` - Create a new cert request and a new private key. Arg takes one of several forms:
        * `rsa:Nbits` generates RSA key Nbits in size. If size omitted, uses default key size
        * `dsa:file` - generates DSA key using parameters in file
        * `param:file` - generates key using params or cert in file
        * all other algorithms support form `algorithm:file`
    * `-no-asn1-kludge`
    * `-nodes` - Do not encrypt the private key
    * `-noout` - do not output encoded version of the request
    * `-out file` - output file to write to, or STDOUT
    * `-outform der|pem` - output format
    * `-passin arg` - key password source
    * `-passout arg` - output file password source
    * `-pkeyopt opt:value` - set the public key algorithm `opt` to `value`
    * `-pubkey` - output the public key
    * `-reqopt option` - customize output format used with `-text`, `option` arg can be single or comma separated multiple. See also `-certopt` in the x509 command
    * `-set_serial N` - serial number to use when outputting self signed cert. May be decimal or hex starting with `0x`.
    * `-sigopt nm:v` - pass options to the signature algorithm during sign operation
    * `-subj arg` - replaces subject field of input request with the specified data and output the modified request. `arg` must be formatted as `/type0=value0/type1=value1/type2=...`
    * `-subject` - print request subject or certificate subject if `-x509` is specified
    * `-text` - print cert request in plain text
    * `-utf8` - interpret field values as UTF8 strings
    * `-verbose`
    * `-verify` - verify the signature on the request
    * `-x509` - output a self-signed certificate instead of a certificate request. Typically used to generate a test cert or self signed root CA. Extensions added to the cert if any are specified in the config file. Unless specified with `-set_serial`, serial is 0.
* Configuration options are specified in the "req" section of the configuration file. Options for the config file:
    * `attributes` - Section containing any request attributes, format the same as `distinguished_name`
    * `default_bits` - default key size in bits
    * `default_keyfile` - default file to write a private key to, or STDOUT
    * `default_md` - digest to use, can be md5, sha1, sha256 (default)
    * `distinguished_name` - section with distinguished name fields to prompt for when generating a cert or cert request
    * `encrypt_key` - if set to `no` and a private key is generated, it is not encrypted. Equivalent to `-nodes` option.
    * `input_password` | `output_password` - passwords for private key file and output private key file
    * `oid_file` - file with additional object identifiers
    * `oid_section` - section in the config with additional object identifiers
    * `prompt` - if 'no', disables prompting for cert fields and takes values from the config directly. Also changes the expected format of `distinguished_name` and `attributes` section.
    * `req_extensions` - config file section with list of extensions to add to the certificate request. Can be overridden by `-reqexts`
    * `string_mask` - limit string types for encoding certain fields. Allowed values:
        * `utf8only` - UTF8String, default
        * `default` - PrintableString, IA5String, T61String, BMPString, UTF8String
        * `pkix` - IA5String, BMPString, UTF8String, PrintableString
        * `nombstr` - PrintableString, IA5String, T61String, UnoversalString
        * `MASK:number` - explicit bitmask of permitted types
    * `utf8` - if set to `yes`, field values interpreted as UTF8 strings
    * `x509_extensions` - section with list of extensions to add to a cert generated when the `-x509` switch is used. 

#### Distinguished Name and Attribute sections

* Two formats for DN and attribute sections
* If `-prompt` is absent or not set to `no`, the file contains field prompting info in the form:
    
    ```
    fieldName="prompt"                          <-- prompt text
    fieldName_default="default field value"     <-- default value
    fieldName_min = 2                           <-- min
    fieldName_max = 4                           <-- max
    ```

* Some fields (like `organizationName`) can be used more than once in a DN
* If the `fieldName` contains some characters followed by a full stop they're ignored, so you could have

    ```
    1.organizationName="prompt 1"
    2.organizationName="prompt 2"
    ```

* Actual permitted field names are any OID short or long names
* They're compiled into openssl, usually include:
    * `commonName`
    * `countryName`
    * `localityName`
    * `organizationName`
    * `organizationalUnitName`
    * `stateOrProvinceName`
    * `emailAddress`
    * `name`
    * `surname`
    * `givenName`
    * `initials`
    * `dnQualifier`

### RSA

* Processes RSA keys
* Usage: `openssl rsa [options]`
* Options:

### VERIFY

* Verifies certificate chains
* Usage: `openssl verify [options] [certificates]`
* Options:
    * `-CAfile file` - file of trusted certificates. Should contain multiple certificates in PEM format, concatenated together.
    * `-CApath directory` - directory of trusted certificates
    * `-check_ss_sig` - verify signature on self signed root CA, disabled by default
    * `-CRLfile file` - should contain one or more CRLs in PEM format
    * `-crl_check` - check end entity cert validity by attempting to look up a valid CRL
    * `-crl_check_all` - check validity of all certs in the chain by attempting to look up valid CRLs
    * `-explicit_policy` - set policy variable `require-explicit-policy`
    * `-extended_crl` - enable extended CRL features like indirect CRLs
    * `-help` - print a usage message
    * `-ignore_critical` - ignore critical extensions instead of rejecting the cert
    * `-inhibit_any` - set policy variable `inhibit-any-policy`
    * `-inhibit_map` - set policy variable `inhibit-policy-mapping`
    * `-issuer_checks` - print diagnostics relating to searches for the issuer certificate
    * `-policy_check` - enable cert policy processing
    * `-purpose purpose` - intended use for the certificate, without it no chain verification is done. Accepted uses are:
        * `sslclient`
        * `sslserver`
        * `nssslserver`
        * `smimesign`
        * `smimeencrypt`
        * `crlsign`
        * `any`
        * `ocsphelper`
    * `-trusted file` - file of trusted certs
    * `-untrusted file` - file of untrusted certs
    * `-verbose`
    * `-x509_strict` - disable workarounds for broken certs which have to be disabled for x.509 compliance
* `certificates` is one or more PEM certs to verify, or from STDIN
