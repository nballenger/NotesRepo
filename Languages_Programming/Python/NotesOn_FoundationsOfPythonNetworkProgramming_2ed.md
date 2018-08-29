# Notes on <u>Foundations of Python Network Programming, 2nd Ed.</u>

## Chapter Summaries

### Chapter 1: Introduction to Client/Server Networking

* virtualenv is a very useful package for testing libraries

### Chapter 2: UDP

#### Should You Read This Chapter?

* "If you even think you want to use the UDP protocol, then you probably want to use a message queue system instead."
* "Use UDP only if you really want to be interacting with a very low level of the IP network stack."

#### Addresses and Port Numbers

* IPv4 addresses are four dot separated quads
* port numbers follow a colon

#### Port Number Ranges

* Many port numbers are already spoken for--see /etc/services
* DHCP is capable of some auto configuration on connection
* There are three tiers of ports:
    * Well-Known, 0-1023, controlled by root user
    * Registered, 1024-49151, available to any user
    * Free pool, 49152-65535, used by the OS randomly

#### Sockets
* Sockets are sort of like file descriptors, for networking
* You ask for a socket to be bound to a port
* Basic socket usage example, server:

```Python        
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(('127.0.0.1', 1060))
print 'Listening at', s.getsockname()
while True:
    data, address = s.recvfrom(65535)
```
        
* Opening a UDP socket happens via ``socket.SOCK_DGRAM``
* ``bind()`` requests a UDP network address, which is a combo of an IP address or hostname and a UDP port number
* Basic socket usage example, client:
       
```Python 
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.sendto('This is my message', ('127.0.0.1', PORT))
data, address = s.recvfrom(65535)
```
            
#### Unreliability, Backoff, Blocking, Timeouts

* UDP is unreliable in that it doesn't automatically reply, or tell you about dropped packets.
* Applications that use UDP should back off if they don't get responses, because they'll otherwise flood the network.
* Imposing a rising delay between resends is a good backoff.

#### Connecting UDP Sockets
* a ``connect()`` call on a socket object obviates the need to use sendto() to send to a specific server/port
* ``connect()`` also guarantees that the received data will come from the same server as was sent to (though is not secure against a dedicated man in the middle attack)
* ``connect()`` does not send anything across the network by itself

#### Request IDs: A Good Idea

* It's a good idea to pass a request id with each UDP request sent, so that you can tell which request a response relates to.
* Request IDs should be non-sequential as a very basic security measure

#### Binding to Interfaces

* You can bind a socket to a particular external IP of the machine your code is running on, and it will only listen for requests addressed to that IP
* Requests originating on the localhost can send to that particular IP using any originating IP they have access to, 127.0.0.1 or otherwise.
* Multiple processes cannot listen using the same IP address and port number
* The IP network stack thinks of UDP in terms of "socket names" that are always a pair linking an IP interface and a UDP port number. Socket names are what cannot conflict among listening processes.

#### UDP Fragmentation

* IP will send small UDP packets singly, but will split up larger UDP packets into smaller physical packets.
* Larger UDP packets are more likely to be dropped, since any dropped portion kills the entire packet.
* You may want to find a way to detect the MTU (maximum transmission unit) between you and a target host, and regulate your packet size accordingly.

#### Socket Options
* Methods are ``getsockopt()`` and ``setsockopt()``
* Calls name the option group in which the option lives, then the option
* Example calls:

```Python            
value = s.getsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST)
s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, value)
```
            
* Common options: ``SO_BROADCAST``, ``SO_DONTROUTE``, ``SO_TYPE``
* See man socket(7), udp(7), tcp(7)

#### Broadcast
* Packets can be sent to an entire subnet at once
* To use broadcast, turn it on with:

```Python        
s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
```
            
* A subnet's broadcast address is xxx.xxx.xxx.255

#### When to Use UDP
* When you are using a protocol that already exists, and it uses UDP
* "Because unreliable subnet broadcast is a great pattern for your application, and UDP supports it perfectly."

### Chapter 3: TCP

#### How TCP Works

* TCP allows applications to send streams of data that, if they arrive, are guaranteed to arrive intact, in order, and without duplication.
* TCP hides the packetization of data from your application, which only understands it as a stream.
* Instead of sequential numbers, TCP uses a counter that counts the number of bytes transmitted. A 1024 byte packet with a sequence number of 7200 would be followed by a packet with a sequence number of 8224.
* The initial sequence number is chosen randomly.

#### When to Use TCP

* When you want to send something larger than very small packets (since you incur an overhead in SYN-ACK/FIN-ACK communications)
* When you want intelligent re-transmission of any lost packets
* When you want flow control and exponential backoff built into the protocol
* When you want a long-term relationship (multiple requests) between client and server

#### What TCP Sockets Mean

* Since TCP is stateful, ``connect()`` kicks off the handshake protocol and is fundamental
* ``connect()`` can fail, since it does communicate over the network
* On the server side, a new socket is created with a successful handshake
* Two types of TCP sockets exist:
    * passive: holds the socket name (address and port), cannot send or receive, alerts the OS to willingness to receive incoming connections
    * active, connected: bound to one particular remote conversation partner, with their own IP address and port number. Can be used only for talking back and forth with that partner, and can be read and written to without worrying about how the resulting data will be packetized. In some cases can be passed around like a file handle.
* Multiple active sockets can share the same socket name--the unique combination will be: ``(local_ip, local_port, remote_ip, remote_port)``
            
#### A Simple TCP Client and Server

* Example server code:

```Python        
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

def recv_all(sock, length):
    data = ''
    while len(data) < length:
        more = sock.recv(length - len(data))
        if not more:
            raise EOFError
        data += more
    return data
    
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('127.0.0.1', 1060))
s.listen(1)
while True:
    sc, sockname = s.accept()
    message = recv_all(sc, 16)
    sc.sendall('Farewell, client')
    sc.close()
```
            
* Example client code:
```Python
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('127.0.0.1', 1060))
s.sendall('Hi there, server')
reply = recv_all(s,16)
s.close()
```
            
* A ``send()`` call can encounter three states:
    * Data can be immediately accepted by the system, because the network interface is free to transmit, or because the system has room to copy the data to a temp outgoing buffer. Full length of your data is immediately returned.
    * Network card is busy or outgoing buffer is full. send() blocks, pausing the program until the data can be accepted.
    * Outgoing buffers are _almost_ full, but not quite. Part of the data is accepted, but the rest has to wait. send() completes immediately and returns the number of bytes accepted from the beginning of your data string.
* A ``send()`` call has to be wrapped like so:

```Python        
bytes_sent = 0
while bytes_sent < len(message):
    message_remaining = message[bytes_sent:]
    bytes_sent += s.send(message_remaining)
```
                
* The standard socket library gives us ``sendall()`` to bypass the need for that loop.
* No equivalent exists for ``recv()``, so you must loop it.

#### One Socket per Conversation

* Once a TCP socket has had listen() run on it, it cannot be used to send or receive
* A listening socket can only receive incoming connections through ``accept()``
* The listening socket returns, via ``accept()``, a new socket that is able to handle conversations
* A socket returned by ``accept()`` works like a client socket, and can use ``sendall()`` and ``recv()``
* The integer argument to ``listen()`` tells it how many waiting connections can stack up (between being received and granted an active socket) before the OS turns new connections away with connection errors

#### Address Already in Use

* If you don't specify ``SO_REUSEADDR`` via ``setsockopt()``, your socket may not be able to be reused for several minutes after it is terminated.
* The OS will keep it open for a while, because it can't definitively tell if the client has received the final ACK packet issued

####Binding to Interfaces

* Once you bind to an address and port, connections to any other port/address will be refused before reaching the application layer.

#### Deadlock

* If you attempt to send a very large stream of data, it is possible that both the server's output buffer and the client's input buffer have both filled up, and TCP has used its window adjustment protocol to signal this fact and stop the socket from sending more data that would have to be discarded and later resent.
* Deadlocks can be avoided in two ways:
    * They can use socket options to turn off blocking, so that calls like ``send()`` and ``recv()`` return immediately if they find they cannot send any data yet.
    * They can process data from several inputs at a time, either by splitting into separate threads or processes--one tasked with sending data into a socket, perhaps, and another tasked with reading data back out--or by running OS calls like ``select()`` or ``poll()`` that let them wait on busy outgoing and incoming sockets at the same time, and respond to whichever is ready.

#### Closed Connections, Half-Open Connections

* There may be conditions in which it is appropriate for a socket to stop reading, or stop writing, without fully closing.
* You can issue a ``shutdown()`` call to end either direction of communication in a two way socket:
    * ``SHUT_WR``, indicates the caller will be writing no more data to the socket, and reads from the other end should act like it is closed.
    * ```SHUT_RD``, Used to turn off the incoming socket stream, so an EOF error is encountered if your peer tries to send any more data to you on the socket.
    * ``SHUT_RDWR`` Closes communication in both directions on the socket. Different from calling ``close()`` on the socket, because while ``close()`` merely ends your process's relationship with the socket, while ``shutdown()`` with ``SHUT_RDWR`` immediately disables the socket for all connected processes.

#### Using TCP Streams like Files

* Python makes sure that read() and write() are methods only called on file objects, and send() and recv() are only called on sockets--no object can do both.
* You occasionally want to treat a socket like a file object, for passing to modules like pickle, json, zlib, etc.
* To do that, you can use the socket's makefile() method:
        
```Python
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
f = s.makefile()
```
