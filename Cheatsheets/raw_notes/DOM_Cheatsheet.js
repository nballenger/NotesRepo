/**********************************************************/
/*                                                        */
/*                                                        */
/*  DOM Cheatsheet, based on the book DOM Enlightenment   */
/*                                                        */
/*                                                        */
/**********************************************************/


/**********************************************************/
/*                                                        */
/*  The Node Constructor Object                           */
/*                                                        */
/**********************************************************/

/*
    - The DOM is a hierarchy of JavaScript Node objects.
    - Some objects have a longer inheritance chain:
        Object < Node < Element < HTMLElement < (e.g. HTML*Element)
        Object < Node < Attr (deprecated in DOM4)
        Object < Node < CharacterData < Text
        Object < Node < Document < HTMLDocument
        Object < Node < DocumentFragment
        
    - There are a number of node types, stored as integer mappings:
        ELEMENT_NODE                                    1
        ATTRIBUTE_NODE                                  2
        TEXT_NODE                                       3
        CDATA_SECTION_NODE                              4
        ENTITY_REFERENCE_NODE                           5
        ENTITY_NODE                                     6
        PROCESSING_INSTRUCTION_NODE                     7
        COMMENT_NODE                                    8
        DOCUMENT_NODE                                   9
        DOCUMENT_TYPE_NODE                              10
        DOCUMENT_FRAGMENT_NODE                          11
        NOTATION_NODE                                   12
        DOCUMENT_POSITION_DISCONNECTED                  1
        DOCUMENT_POSITION_PRECEDING                     2
        DOCUMENT_POSITION_FOLLOWING                     4
        DOCUMENT_POSITION_CONTAINS                      8
        DOCUMENT_POSITION_CONTAINED_BY                  16
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC       32    

    - Use nodeType (which returns the int code) to get a node's type
    - Use nodeValue to get the value of Text and Comment nodes
    - Element and Text nodes are created and manipulated from JS with:
        createElement()
        createTextNode()
        createAttribute() // deprecated, use get|set|removeAttribute()
        createComment()         
        getAttribute()
        setAttribute()
        removeAttribute()
        
    - You can add nodes to the DOM with JavaScript strings via innerHTML, outerHTML,
        textContent, insertAdjacentHTML():
*/

    document.getElementById('A').innerHTML   = '<strong>Hi</strong>';
    document.getElementById('B').outerHTML   = '<div id="B" class="new">Hi</div>';
    document.getElementById('C').textContent = 'dude';
    
    // refers to <i id="elm">how</i>
    var elm = document.getElementById('elm');
    elm.insertAdjacentHTML('beforebegin', '<span>Hey-</span>');
    elm.insertAdjacentHTML('afterbegin',  '<span>dude-</span>');
    elm.insertAdjacentHTML('beforeend',   '<span>-are</span>');
    elm.insertAdjacentHTML('afterend',    '<span>-you?</span>');

    // produces: <span>Hey-</span><i id="elm"><span>dude-</span>
    //   how<span>-are</span></i><span>-you?</span>
        
/*
    - innerHTML has a large overhead, use it sparingly
    - insertAdjacentHTML with beforebegin and afterend will only work if the node is
        in the DOM tree and has a parent element
    - textContent gets the content of all elements, innerText won't get style or script
    - insertAdjacentElement and insertAdjacentText are available everywhere but FF
    - You can pull data back out as strings with innerHTML, outerHTML, and textContent
    - textContent, innerText, and outerText get all text nodes inside a selected node  
    
    - You can add Node objects to the DOM with appendChild() and insertBefore:
*/

    // refers to <p>Hi</p>
    var elementNode = document.createElement('strong');
    var textNode = document.createTextNode(' Dude');
    
    document.querySelector('p').appendChild(elementNode);
    document.querySelector('strong').appendChild(textNode);    
    // creates <p>Hi<strong Dude</strong></p>
    
    var text1 = document.createTextNode('1');
    var li = document.createElement('li');
    li.appendChild(text1);
    
    var ul = document.querySelector('ul');
    ul.insertBefore(li, ul.firstChild);    
    
/*

    - insertBefore wants two parameters, the node to be inserted and the reference node in
        the document before which you would like the node inserted
    - insertBefore with no second parameter behaves like appendChild
    
    
    - Use removeChild() and replaceChild() to remove and replace nodes
    - Multiple steps: select the node, gain access to its parent, invoke removeChild() on
        the parent, passing in the reference to the node to remove:    
*/

    // remove element node
    var divA = document.getElementById('A');
    divA.parentNode.removeChild(divA);
    
    // remove text node
    var divB = document.getElementById('B').firstChild;
    divB.parentNode.removeChild(divB);
    
    // replace element node
    var divA = document.getElementById('A');
    var newSpan = document.createElement('span');
    newSpan.textContent = 'Howdy';
    divA.parentNode.replaceChild(newSpan, divA);
    
    // replace text node
    var divB = document.getElementById('B').firstChild;
    var newText = document.createTextNode('buddy');
    divB.parentNode.replaceChild(newText, divB);

/*
    - Watch for memory leaks: replaceChild and removeChild return the nodes they act on,
        so the node is not gone from memory, just the current live document
        
    - Clone existing nodes with cloneNode():
*/

    // Simple copy:
    var cloneUL = document.querySelector('ul').cloneNode();
    
    // Deep copy:
    var cloneUL = document.querySelector('ul').cloneNode(true);
    
/*
    - Note that clones of element nodes will bring all attributes and their values, but
        anything added with addEventListener or node.onclick is not cloned
    - cloneNode() can lead to duplicate element ids in a document
*/
    
/**********************************************************/
/*  Node Collections: NodeList and HTMLCollection         */
/**********************************************************/

/*
    - When selecting groups from a tree or accessing predefined sets of nodes, the nodes
        are placed in a NodeList (like document.querySelectorAll('*')) or an HTMLCollection
        (like document.scripts)
    - A collection can be live or static--part of the live document or a snapshot
    - By default the nodes inside are sorted by tree order, taking the linear path
        from tree trunk to branches
    - The collections have a length property that reflects the number of elements
    
    - the childNodes property gives an array like NodeList of all immediate child nodes:
*/

    var ulElementChildNodes = document.querySelector('ul').childNodes;
    
    Array.prototype.forEach.call(ulElementChildNodes, function(item) {
        console.log(item);
    });

/*
    - childNodes includes not only Element nodes but all other node types
    - [].forEach is from ECMAScript 5
    - You can convert a NodeList or HTMLCollection to an Array:
*/

    // HTMLCollection, not an array
    var linksArray = [];
    if (! Array.isArray(document.links)) {
        linksArray = Array.prototype.slice.call(document.links);
    }
    
    // NodeList, not an array
    var linksArray2 = [];
    if (! Array.isArray(document.querySelector('a'))) {
        linksArray2 = Array.prototype.slice.call(document.querySelector('a'));
    }
    
/**********************************************************/
/*  DOM Traversal properties and methods                  */
/**********************************************************/
/*
    - From an existing node reference, you can get a different node reference by traversing
        the DOM using these properties:
        
        - parentNode
        - firstChild
        - lastChild
        - nextSibling
        - previousSibling
        
    - The traversal will include both element, text, and comment nodes
    - You can traverse just elements with:
    
        - firstElementChild
        - lastElementChild
        - nextElementChild
        - previousElementChild
        - children
        - parentElement
        - childElementCount // gives the number of child elements of a node

    - You can use contains() to find out whether a node is inside another node:
*/
    
    // evaluates to true for a well formed document
    var inside = document.querySelector('html').contains(document.querySelector('body'));

/*        
    - compareDocumentPosition() will let you request information about a node relative to
        the node passed in
    - Info returned is as follows, in numeric codes:
    
        Code        Info
        0           Elements are identical
        1           DOCUMENT_POSITION_DISCONNECTED - nodes not in the same doc
        2           DOCUMENT_POSITION_PRECEDING - passed in node precedes selected node
        4           DOCUMENT_POSITION_FOLLOWING - passed in node follows selected node
        8           DOCUMENT_POSITION_CONTAINS  - passed in node is an ancestor of selected node
        16,10       DOCUMENT_POSITION_CONTAINED_BY (16,10 in hex) - passed in node
                        is a descendant of the selected node
                        
    - Since nodes can have multiple relationships, the returned number is a combination
        of the appropriate codes, so contains(16) and precedes(4) will return 20
*/

/**********************************************************/
/*  Node Comparisons                                      */
/**********************************************************/
/*
    - DOM3 spec says two nodes are identical if and only if:
        - They are of the same type
        - These attributes are equal: nodeName, localName, namespaceURI, prefix, nodeValue
        - The attributes NamedNodeMaps are equal
        - The childNodes NodeLists are equal
        
    - Calling isEqualNode() will ask if the node is equal to the one passed in
    - If you don't care if they're exactly equal, but want to check for two references
        being to the same node, just use ===
*/


/**********************************************************/
/*                                                        */
/*  Document Nodes                                        */
/*                                                        */
/**********************************************************/

/*
    - The HTMLDocument constructor creates a DOCUMENT_NODE (window.document) in the DOM
    - Noteworthy properties and methods of the window.document object:
        - doctype
        - documentElement
        - implementation.*
        - activeElement
        - body
        - head
        - title
        - lastModified
        - referrer
        - URL
        - defaultview
        - compatMode
        - ownerDocument
        - hasFocus()    
        
    - You can extract information about the document from the document object:
*/

    var d = document;
    console.log('title = '+d.title);
    console.log('url = '+d.URL);
    console.log('referrer = '+d.referrer);
    console.log('lastModified = '+d.lastModified);
    console.log('compatibility mode = '+d.compatMode);
    
/*
    - document nodes can contain one DocumentType node object and one Element node object
    - Don't confuse window.document with the Document object
    - window.document is the head of the DOM
    
    - document Provides Shortcuts to <!DOCTYPE>, <html>, <head>, and <body>
        - document.doctype === <!DOCTYPE>
        - document.documentElement === <html lang="en">
        - document.head === <head>
        - document.body === <body>    
*/