# Notes on Implementing SSL/TLS Using Cryptography and PKI

By Joshua Davies; Wiley, January 2011; ISBN 9780470920411

# Chapter 1: Understanding Internet Security

## What are secure sockets?

* Internet Protocol (RFC 971) defines packetized traffic standards
* Packets pass through many hosts en route
* Each router along the way is supposed to respond with an ICMP timeout packet (RFC 793) with its own address. Routers that cannot or will not are represented by asterisks in traceroute output.
* Connections between a sender and a receiver are 'sockets'
* When a client is ready to establish a connection, it sends a synchronize (SYN) packet to the server.
* If the server is willing to accept the connection, it responds with a SYN and acknowledge packet (SYN/ACK)
* The client sends an acknowledgement package (ACK), and both sides have agreed on a connection.
* Each connection is associated with a pair of ports: source and destination
* Source and destination ports are attached to each subsequent packet
* Ports are advertised via transport control protocol, TCP (RFC 793)
* TCP and IP are typically implemented together as TCP/IP
* A socket is an established TCP connection, created via three way handshake of SYN, SYN/ACK, ACK
* TCP guarantees that if a side transmits over the socket, that the other side sees the data in the order it was sent.
* However, IP requires that any intermediate router ALSO sees the data
* SSL is 'secure sockets layer', developed by Netscape
* Has been standardized and renamed Transport Layer Security (TLS)
* After a socket is established, SSL defines a second handshake

## "Insecure" Communications: Understanding the HTTP protocol

* Hypertext Transport Protocol (RFC 2616) is standard for web communications
* A web client (browser) establishes a socket with a web server
* HTTP standard port is 80
* After a socket is established, browser follows HTTP rules for requesting docs
* HTTP was primary motivator for SSL
* Originally SSL was an add on to HTTP, as 'HTTPS'

## Implementing an HTTP Client

* Most of the complexity in terms of protocol impelementation for a simple web browser is in the socket handling--establishing a socket and sending/receiving data over it
* Process of a request/response cycle in code:
    * Parse the supplied URL and extract the host name
    * Convert hostname to an IP address via DNS
    * Create a socket to the host via its IP address
    * Assuming your socket request is accepted, you have a cleartext socket
    * Issue a GET request for a resource, display the result
    * Close the socket
* HTTP requests are plain text, and made up of
    * `<verb> <resource_path> HTTP/<version>[CRLF]`
    * Colon separated header/value pairs, ending with CRLF
    * An empty CRLF
* An HTTP response has a standard format
    * `HTTP/<version> <response_code> <response_code_text>[CRLF]`
    * Colon separated header/value pairs, ending with CRLF
    * An empty CRLF/blank line end of header marker
    * Document requested
* Because this is all over a cleartext socket, everything transmitted is observable in plaintext to every intermediate host.
* If you want to protect it from eavesdroppers, you establish an SSL context prior to sending your HTTP request

## Adding Support for HTTP Proxies

* In a walled garden you can't just accept outside packets, so there's no clear route from a client to an external host.
* You set up a proxy server that can connect externally, and clients funnel their requests through that proxy.
    * Client establishes a socket to the proxy server
    * Issues its GET to the proxy server
    * Proxy server then:
        * examines the request to determine hostname and resolve an IP
        * connect to that IP on behalf of the client
        * re-issue the GET to the actual server
        * forward the response back to the client
* Standard format for specifying a proxy is

    ```
    http://[username:password@]hostname[:port]/
    ```

* For an authenticating proxy server, you have to supply an additional HTTP header with the proxy auth string, like

    ```
    Proxy-Authorization: [METHOD] [connection string]
    ```

* The `METHOD` is one of `BASIC` or `DIGEST` (per RFC 2617)

## Reliable Transmission of Binary Data with Base64 Encoding

* Problem Base64 solves: In early, modem-based systems, like email relay or UUCP systems, an unexpected byte outside ASCII 32-126 could cause problems. Consequently, trying to transport binary data like compressed images could cause issues. Multiple encoding methods were created to map binary data into the printable ASCII range, and one of the most popular was base64.
* Base64 divides input into 6-bit chunks (Base64 because 2**6 = 64)
* Maps each 6-bit input to a printable ASCII character
* First 52 combinations map to A-Z and a-z, next 10 are numerals 0-9
* Leaves two combinations left over to map--compatible implementations map them (arbitrarily) to `+` and `/`
* Since the input streams are typically multiples of 8 bits, there's a 6-bit offset problem. 24 is the LCM of 6 and 8, so the input has to be padded out to 24 bits.
* The encoder adds two `=` characters if the last chunk is 1 byte long
* Adds one `=` if the last chunk is two bytes long
* Adds nothing if the input is an even multiple of three bytes.
* The 6:8 ratio also means teh output is one third bigger than the input
* Pretty simple--most of the complexity is around non-aligned output
* Decoding is almost as easy, except you have to account for possibly invalid data
* Not every possible 8 bit combination is a legit Base64 character (which is the point of the whole thing in the first place)
* You also have to reject non-aligned input; if the input isn't a multiple of four, it didn't come from a conformant Base64 encoder
* When encoding you can take anything, decoding has to know it's getting input that actually came from a real Base64 encoder.
* The reason we're talking about Base64 is that `BASIC` authorization has the client pass a username and password that's base64 encoded before transmission, to provide a small bit of security against password leakage.

## Implementing an HTTP Server

* Web server operation:
    * Starts by establishing a socket on which to listen (default 80)
    * When it receives one, it reads an HTTP request and forms a response
    * Then either closes the connection (HTTP 1.0) or looks for another connection (HTTP 1.1+)


# Chapter 2: Protecting against eavesdroppers with symmetric cryptography

* Two broad categories of crypto algorithms, differing in key management:
    * Symmetric
    * Public (public key)
* In symmetric, the same key is used for encrypting and decrypting
* Some algorithms scramble to encode and descramble to decode, some are more like a modulo operation, where two successive applications of the same algorithm reproduce the cleartext.
* In all cases, sender and receiver must agree on the key before any encrypted communication can happen.

## Understanding Block Cipher Cryptography Algorithms

* Substitution ciphers are inherently weak
* One hardening technique is to operate on several characters at once
* Most common category of symmetric encryption algorithm is 'block cipher'
* Operates on a fixed range of bytes rather than a single character.

## Implementing the Data Encryption Standard (DES) Algorithm

* Implemented/specified by IBM (for the NSA) in 1974
* First publicly available computer-ready encryption algo
* Not considered very secure, though still in widespread use
* Most concepts in DES appear in other crypto algorithms
* Breaks its input into 8 byte blocks, scrambles them with an 8 byte key
* The scrambling involves a series of fixed permutations, rotations, and XORs
* The core of its security is from what the standard calls 'S boxes'
* S boxes are where 6 bits of input become 4 bits of output in a fixed, non-reversible (without the key) way
* Relies heavily on the XOR operation, whose logic table is

    ```
         0     1
      +-----+-----+
      |     |     |
    0 |  0  |  1  |
      |     |     |
      +-----------+
      |     |     |
    1 |  1  |  0  |
      |     |     |
      +-----+-----+
    ```

* XOR is interesting for crypto because it's reversible:

    ```
        0011        0110
    XOR 0101    XOR 0101
    --------    --------
        0110        0011
    ```

* DES is described with big endian conventions, where the first bit is most significant
* Intel x86 conventions are little endian, first bit least significant
* To match the spec, you operate on byte arrays rather than taking advantage of the wide integer types of the target hardware
* To implement DES, you need to be able to XOR byte arrays
* You also need a permute routine that moves bits around based on entries in a `permute_table` array
* That will be called many times, with different `permute_tables` values each time

### DES Initial Permutation

* This covers steps involved in encrypting a block of data with DES
* The input should undergo an initial permutation
* It serves no cryptographic purpose, unclear why it's in the spec, but it is.
* Works out to copying the second bit of the last byte into the first bit of the first byte of the output, followed by the second bit of the next to last byte into the second bit of the first byte of the output, and so on, so that the first byte of output consists of hte second bits of all of the input bytes, backward
* You do that until all the input bits are exhausted
* After the input is permuted, it is combined with the key in a series of 16 rounds
* Each round consists of:
    1. Expand bits 32-64 of the input to 48 bits
    1. XOR the expanded right half of the input with the key
    1. Use the output of that XOR to look up eight entries in the s-box table and overwrite the input with these contents
    1. Permute this output according to a specific p-table
    1. XOR that output with the left half of the input (bits 1-32) and swap sides so that the XORed left half becomes the right half, and the so far untouched right half becomes the left half. On the next round, the same series of operations are applied again, but on what used to be the right half.
* That procedure is called the 'Feistel function'
* Then the halfs are swapped one last time, and the output is subject to the inverse of the initial permutation, which undoes what the initial permutation did.

# Chapter 4: Authenticating Communications Using Digital Signatures

* Public key crypto involves generating two related keys, one of which can be used to encrypt a value, and the other of which can be used to decrypt that value.
* Technically doesn't matter which key is used in which role, though the algorithm defines one key as public and the other as private.
* If a value is encrypted with the private key, it can only be decrypted with the public key. Consequently, the private key can be used to prove identity--if you can produce an encrypted message which can be decrypted by the public key, by definition you are in possession of the private key.
* The holder of the private key generates some message M and sents it to the receiver unencrypted. Then the holder of the private key encrypts M using the private key and sends the resulting C to the receiver, who decrypts it with the public key. If M is equivalent to decrypted(C), you've proved identity.
* That digital signature can be combined with encryption: sender encrypts the request, signs the encrypted value, sends that to the receiver to verify.
* If changes are made in transit, the decrypted value won't match the signature.
* One problem is that it essentially doubles the length of each message, and public key crypto is too slow for large blocks of info.
* Generally you use public key crypto to encode a symmetric key for subsequent crypto operations. You can't do that for digital signatures, you're trying to prove that ssomebody with access to the private key generated the message.
* What you need is a shortened representation of the message that can be computed by both sides, so the sender can encrypt that using the private key, and the receiver can compute the same shortened representation, decrypt it using the public key and verify they're identical.

## Using Message Digests to Create Secure Document Surrogates

* The shortened representation of a message is a 'message digest'
* Simplest form of MD is a checksum, where given a byte array of arbitrary length, you add up the integer value of each byte, allowing the sum to overflow, and return the total.
* Checksums can be gamed though:
    * Sender wants to send message X, which checksums to 12345
    * Sender uses the private key to compute a signature Z
    * Attacker wants to change the message content, so engineers a checksum collision by choosing a different message which outputs the same checksum as the original.
* So for cryptographic security, you need a more secure message digest algorithm

### Implementing the MD5 Digest Algorithm

* One of the earliest message digest algorithms is MD2, which was followed by MD4
* Eventually followed by MD5, which is the last of the MD series
* All created by Ron Rivest, who was part of the RSA team

#### Understanding MD5

* Goal of MD5 or any secure hashing algorithm is to reduce an arbitrarily sized input into an n-bit hash so that it is very unlikely that two messages, regardless of length or content, produce identical hashes, and that it is impossible to specifically reverse-engineer a collision.
* In MD5, n is 128, so there are 2^128 possible MD5 hashes
* MD5 operates on 512-bit (64 byte) blocks of input
* Each block is reduced to a 128-bit (16 byte) hash
* With a 4:1 ratio of input to output blocks, there is automatically a 1 in 4 chance of a collision--challenge is to make it difficult or impossible to work backwards to find one.
* If the message to hash is greater than 512 bits, each 512 bit is hashed independently and the hashes are added together, being allowed to overflow, and the result is the final sum (which creates more potential for collisions).
* Message digests don't have to be reversible, so algorithm designers don't have to be so cautious with the number/type of operations done on the input.
* MD5 applies 64 transforms to each block of input, to shuffle bits unpredictably.
* Lots of implementation details here, skipping.

#### MD5 Vulnerabilities

* References the birthday paradox
* With 
* MD5 produces 128 bits for each input
* 2^128 


# Chapter 5: Creating a Network of Trust using X.509 Certificates

* "Fundamentally, the certificate is a holder for a public key."
* Contains a lot of other information about the subject of the key
* In the case of websites that's the DNS name of the site which has the corresponding private key, and the primary purpose of the cert is to present the user agent with a public key that should be used to encrypt a symmetric key that is subsequently used to protect the remainder of the connection's traffic.
* Summary of previous few chapters and how they go together:
    1. A symmetric algorithm and key is chosen
    1. Key exchanged using public-key techniques
    1. Everything is encrypted using the secret symmetric key, and authenticated using an HMAC with another secret key.
* Digitial signatures from chapter 4 are how certificates are authenticated, and how you can determine whether to trust a certificate.

## Putting It Together: The Secure Channel Protocol

* With symmetric encryption and a secure key exchange method, you can implement a secure channel against passive eavesdroppers
* Assuming that an attacker can see but not modify your data, you could adopt the simple secure channel protocol here:
    1. Client requests public key from the server
    1. Server sends public key to the client
    1. Client encrypts a symmetric key using the public key
    1. Client sends the encrypted session key to the server
    1. Server decrypts the session key using the private key
    1. Server sends acknowledgement to the client
    1. Normal conversation begins, everything encrypted with negotiated symmetric key
* Even if an attacker can view all packets exchanged, all that's visible is the public key, which isn't a secret
* A man in the middle attack can beat this, if it can intercept and modify traffic
* Problem is that the client implicitly trusts that the public key belongs to the server
* Solving that trust issue is the basis of most of the complexity of SSL/TLS
* Remainder of the book is spent looking at how to get around the problem
* Solution that SSL uses is to include a trusted intermediary
* The intermediary digitially signs the public key of the server, and the client must verify the signature. The signed public key is a 'certificate', and the trusted intermediary is a 'certificate authority' (CA)
* The client must have access to the public key of the CA so it can authenticate the signature before accepting the key as genuine.
* Web browsers have a list of trusted CAs with their public keys built in
* If the server can get a cert signed by the trusted CA, you should assume that a sufficiently motivated attacker could as well.
* What you need is a way to associate the public key with the server you're connecting to. Consequently a properly formatted cert needs to have not only the public key of the server, but also the domain name of the server that the public key belongs to, all signed by the trusted CA.
* Foils the MITM attack:
    1. Client requests a cert from the server
    1. MITM replaces that cert with their own
    1. Client validates the attacker's cert as legit because it's signed by a trusted CA, but sees that the domain doesn't match that of the server.
    1. The MITM can't forge a cert with the correct domain, because it's protected by a digital signature.
    1. If the MITM gets a digitally signed cert from the CA with the domain attacker.com, then changes that in the cert to server.com, the hash code in the signature won't match the hash code of the contents of the certificate, and the client rejects it.
* Bare minimum to protect against MITM attacks, you need:
    * A trusted CA
    * A certificate format that includes
        * the domain name
        * the public key
        * a digital signature issued by the CA
* An attacker could try to use an old cert, which is why certificates have a validity period--a not before date and a not after date. (Client is responsible for checking.)
* Only half a solution--if a private key is compromised, you want the certs based on it to stop being used immediately. So CAs keep a list of revoked certs, in a 'certificate revocation list' (CRL)
* To make that work, each certificate must include a serial ID that uniquely identifies it, which is what is entered into the CRL for clients to check against.
* Since there are multiple certificate authorities, a client needs some way to know whose public key to use to verify the signature, so each cert also includes an issuer that uniquely identifies the CA, and the client decides dynamically whether to trust the issuer.

### Encoding with ASN.1

* Certs need to be precisely defined. Would be a good use case for XML, but certificates predate XML
* They use Abstract Syntax Notation (ASN), which serves the same purpose as a DTD or an XSD might in an XML context--describes how elements are nested within one another, what order they can occur in, what type each is.
* Actual ASN.1 looks a lot like C language struct definition (but doesn't map to it)
* Cert format for SSL/TLS is defined/maintained by International Telecommunication Union (ITU), in a series of documents called the 'X series'
* Documents live in http://www.itu.int/rec/T-REC-X/en
* Each has a number, corresponding document is X.nnn (as in X.509)

#### Understanding Signed Certificate Structure

* ASN.1 is used to describe the structure of an X.509 certificate
* X.509 is the official standard for public-key certificates, and the format on which TLS 1.0 relies.
* Has had three revisions, currently on X.509v3
* Top level structure:

    ```ASN.1
    SEQUENCE {
        version                 [0] EXPLICIT Versiomn DEFAULT v1,
        serialNumber            CertificateSerialNumber,
        signature               AlgorithmIdentifier,
        issuer                  Name,
        validity                Validity,
        subject                 Name,
        subjectPublicKeyInfo    SubjectPublicKeyInfo,
        issuerUniqueID          [1] IMPLICIT UniqueIdentifier OPTIONAL,
                                -- If present, version shall be v2 or v3
        subjectUniqueID         [2] IMPLICIT UniqueIdentifier OPTIONAL,
                                -- If present, version shall be v2 or v3
        extensions              [3] EXPLICIT Extensions OPTIONAL,
                                -- If present, version shall be v3
    }
    ```

* An ASN.1 SEQUENCE is similar to a C `struct`, and groups other elements
* Most important of the ten above is `subjectPublicKeyInfo`, since the purpose of a cert is to transmit a public key
* Each subelement is a name followed by a type
* `version`
    * Integer between 0 and 2, where 0 is v1, 1 is v2, 2 is v3
    * Version indicates how to parse the other structures
    * If not present, defaults to v1
* `serialNumber`
    * The CA is required to assign a unique serial number to each cert issued
    * They're not necessarily globally unique, but should never be reused within the context of a single CA
    * Defined as an integer
* `signature`
    * Indicates the algorithm used to sign the certificate
    * Declaration for an algorithm identifier:

        ```
        AlgorithmIdentifier ::= SEQUENCE {
            algorithm       OBJECT IDENTIFIER,
            parameters      ANY DEFINED BY algorithm OPTIONAL
        }
        ```

    * The algorithm is an 'object identifier' type, used quite a bit in X.509 standard
    * OIDs describe an arbitrary hierarchy, and are pretty complex
    * Treat them as byte arrays, and keep track of the mappings of those
    * Any digital signature algorithm identifier must identify
        * the secure hashing algorithm applied
        * the encrypting algorithm
    * With MD5 and SHA for secure hashing, and RSA and DSS for private-key encryption, you end up with four OIDs for algorithm identifiers--but since MD5 isn't used with DSS, there are only three:
        * MD5 + RSA = `2A 86 48 86 F7 0D 01 01 04`
        * SHA-1 + RSA = `2A 86 48 86 F7 0D 01 01 05`
        * SHA-1 + DSS = `2A 86 52 CE 38 04 03`
    * X.690 and RFC 2313 have details on how the values are determined
    * All you care about is whether the third cert field is equal to once of those OIDs
* `issuer`
    * Issuer is a 'distinguished name' type
    * These are in the form of

        ```
        CN=common name,OU=org unit,O=org,L=city,ST=state,C=country
        ```

    * Intended to identify with some degree of uniqueness, a specific issuer
    * Not every field appears in every distinguished name, since some are optional (technically all of them are optional)
    * Declaration of the `Name` type:

        ```
        Name ::= CHOICE (
            RDNSequence
        }

        RDNSequence ::= SEQUENCE OF RelativeDistinguishedName

        RelativeDistinguishedName ::= SET OF AttributeTypeAndValue

        AttributeTypeAndValue ::= SEQUENCE {
            type    AttributeType,
            value   AttributeValue
        }

        AttributeType ::= OBJECT IDENTIFIER

        AttributeValue ::= ANY DEFINED BY AttributeType
        ```

    * A name is a variable length array of `AttributeTypeAndValue` structures
    * The attribute type is an OID, the value can be any type depending on OID
    * `CN`, `O`, `OU`, `L`, `ST` and `C` each have an OID value
    * All the OIDs you typically see in a distinguished name have attribute values that are typed as strongs
    * X.520 has details on attribute type OIDs, and a bunch of other types, since DNs can have a lot of detail
    * You really just need to identify an issuer well enough to make a trust decision, or present it to the user and let them decide
* `validity`
    * Represents a time window outside of which the cert is suspect
    * Declaration:

        ```
        Validity ::= SEQUENCE {
            notBefore   Time,
            notAfter    Time
        }

        Time ::= CHOICE {
            utcTime     UTCTime,
            generalTime GeneralizedTime
        }
        ```

    * Each of those time types is year, month, day, hour, minute, second, 'Z'
    * generalized time uses four digit year, utctime uses two digit year
* `subject`
    * Another relative distinguished name
    * Includes an optional number of identifying fields
    * Who the subject actually is (person, website, etc.) is poorly specified
    * Compromise has been to insert the domain name into the `CN` field of the subject name and let the client compare the domain name it thinks its connecting to against the domain name in the CN
    * However, that doesn't deal well with multiple subdomains
    * For that reason, it's acceptable for the `CN` field to include a wildcard listing
    * That introduces other problems, but they're esoteric (null terminator attack)
    * RFC 2247 extends X.509 subject name to include domain name components, split according to the DNS hierarchy
    * That means `www.whizbang.com` becomes `DC=www,DC=whizbang,DC=com`
    * The domain-name component (`DC`)  isn't that common, not recognized by all clients, so it's hard to get it into wide usage. (This was in 2011, mind you.)

