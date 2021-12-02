# Notes on SIP2

## Wikipedia page

From https://en.wikipedia.org/wiki/Standard_Interchange_Protocol

* Proprietary standard (owned by 3M) for communication between library computer systems and self-service circulation terminals
* Version 2.0 (SIP2) is the de-facto standard for library self-service apps
* Protocol covers requests to perform operations, does not define how a connection is established, only specifies the format of messages sent.
* Every operation requested will be attempted immediately and permitted or not
* No built in encryption, usually sent by encrypted tunnel (stunnel or SSH)

## PDF: SIP standard protocol 2.0.pdf

Found at the bottom of https://nccardinalsupport.org/index.php?pg=kb.page&id=430

### Introduction

* SIP provides standard interface between an Automaged Circulation System (ACS) and library automation devices
* Acronyms and abbreviations used:
    * ACS - Automated Circulation System
    * SC - 3M SelfCheck system or any library automation device dealing with patrons or library materials
    * NISO - National International Standards Organizationa

### Command Messages to the ACS

#### Patron Status Request

* SC requesting patron info from the ACS
* ACS must respond with a Patron Status Response message
* Format:

    ```
    23<language><trans_date><institution_id><patron_id><terminal_pw><patron_pw>
    ```

* Fields:
    * language - 3-char, fixed length, required
    * trans date - 18-char, fixed length, required, YYYYMMDDZZZZHHMMSS
    * institution id - variable length, required
    * patron id - variable length, required
    * terminal pw - variable length, required
    * patron pw - variable length, required

#### Checkout

* Used by SC to request checkout of an item
* Also used to cancel a Checkin request that did not successfully complete
* ACS must respond with a Checkout Response message
* Format:

    ```
    11<SC_renewal_policy><no_block><trans_date><nb_due_date><institution_id><patron_id><item_id><terminal_pw><patron_pw><item_properties><fee_acknowledged><cancel>
    ```

* Fields:
    * SC renewal policy - 1-char, fixed length, required, Y or N
    * no block - 1-char, fixed-length, required, Y or N
    * transaction date, 18-char, fixed-length, required, YYYYMMDDZZZZHHMMSS

### Standard Protocol Rules and Regulations

* Standalone Messages
    * All message/response pairs should be standalone (stateless)
    * Example: Not required for the SC to send a Patron Status Request Message and get a response from the ACS before the SC sends a Checkout Message, because the Checkout Message contains everything needed for the ACS to perform a Checkout operation and construct a Checkout Response Message
* Commands
    * Command identifiers that are unrecognized are ignored, which allows adding new commands to be added in the future.
    * All recognized commands sent by the SC to the ACS require a response
    * The ACS Status Message Response will not be sent by the ACS unsolicited
* Fields
    * Fields with unrecognized field identifiers should be ignored
* Packet format
    * Messages to/from the ACS have the same general format
    * Message packet begins with a command identifier
    * That's followed by fixed-length fields without field identifiers
    * Then by fixed- and variable-length fields with field identifiers
    * Message ends with a carriage return
    * Fixed length fields MUST appear in the order given in the spec for each message
    * Fields with field identifiers may be sent in any order, following the fixed length fields
    * For some messages multiples of the same var-length field may be sent
    * In general the packet only contains ASCII characters
    * Command id is two ASCII characters
    * Fixed and variable-length fields are composed of ASCII characters
    * Field identifiers are ASCII characters
    * Message terminator is an ASCII character
    * Default charset is English 850
    * If another charset is required, the SC and ACS must mutually define it
* Message Terminator
    * All messages must end in a carraige return, hex `0d`
    * That character is interpreted as the end, may not be used elsewhere
* Nulls
    * Null codes cannot appear anywhere (hex `00`) in the message
* Variable-length fields
    * Start with 2 field identifiers, followed by 0 to 255 characters from a mutually agreed upon character set, ending with a pipe (hex `7c`
    * The pipe is a delimiter, so it can't be used elsewhere in the message
    * Some languages use `7c` as a printable character, in which case another delimiter character should be defined. The field delimiter code should be configurable in the SC
    * When var-length or optional fields have no value, leave them out
    * Starting in v2, the following rules are used in assigning field ids:
        * All fields added to pre-existing messages are assigned field ids
        * All var-length fields are assigned field identifiers
        * All optional fields are assigned field identifiers
        * 
