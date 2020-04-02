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
