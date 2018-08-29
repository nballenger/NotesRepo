# Notes on ReportLab PDF generation python library

From http://www.reportlab.com/docs/reportlab-userguide.pdf

## Chapter 2: Graphics and Text with `pdfgen`

* `pdfgen` package is lowest level PDF generation interface
* It's basically a sequence of painting instructions
* Interface object is the `canvas`
* Lower left corner of the page is (0,0); x goes right, y goes up
* Example:

```Python
from reportlab.pdfgen import canvas
def hello(c):
    c.drawString(100,100,"Hello World")
c = canvas.Canvas("hello.pdf")
hello(c)
c.showPage()
c.save()
```

* `showPage` makes it stop drawing on the current page
* `save` generates the document
* `canvas` constructor:

```Python
def __init__(self,
             filename,
             pagesize=(595.27,841.89),
             bottomup=1,
             pageCompression=0,
             encoding=rl_config.defaultEncoding,
             verbosity=0,
             encrypt=None):
```

* You can pass in a file path or an open file object
* PDF is a binary format, so don't try to inline it into something else
* `pagesize` is a tuple of two numbers in points, which are 1/72 of an inch
* Default size is A4, but you can get different sizes from `reportlab.lib.pagesizes`:

```Python
from reportlab.lib.pagesizes import letter, A4
myCanvas = Canvas("myfile.pdf", pagesize=letter)
width, height = letter
```

* `bottomup` switches coordinate systems (DEPRECATED)
* `pageCompression` determines whether PDF ops for each page is compressed
* compression off by default, because it's slow
* If size matters set it to 1 to get smaller output docs
* Images are always compressed, and you only save space if you have a lot of text and/or vectors
* `encoding` option is obsolete, can be omitted
* text passed to reportlab should always be a unicode string object or a UTF-8 encoded byte string
* demo script `reportlab/demos/stdfonts.py` will print test docs showing all code points in all fonts
* `verbosity` sets how much logging is done; zero by default
* `encrypt` determines whether it's encrypted, off by default


## Chapter 5: PLATYPUS: Page Layout and Typography Using Scripts

* High level page layout library
* Several layers, top down:
    * `DocTemplates` - outermost container for the document
    * `PageTemplates` - specs for page layouts
    * `Frames` - regions in pages
    * `Flowables` - text or graphic elements to flow into the doc
    * `pdfgen.Canvas` - lowest level that ultimately receives the others
* `DocTemplates` contain one or more `PageTemplates` each of which contain one or more `Frames`
* `Flowables` are things that can be flowed into a `Frame`, like a `Paragraph` or `Table`
* To use it, you create a document from a `DocTemplate` class and pass a list of `Flowables` to its `build` method.
*
