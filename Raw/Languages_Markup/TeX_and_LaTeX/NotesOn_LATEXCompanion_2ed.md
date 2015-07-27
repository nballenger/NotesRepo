# Notes on The LATEX Companion, 2nd Ed.

By Frank Mittelbach, Michel Goossens, Johannes Braams, David Carlisle, Chris Rowley; Addison-Wesley Professional 2004; ISBN 978-0-201-36299-2

## Chapter 1: Introduction

### 1.1 A Brief History

* '77, Knuth started TEX at Stanford to do book typesetting.
* Early '90s, Knuth stops further TEX development for stability
* Leslie Lamport in the '80s starts working on LATEX document prep system
* LATEX uses TEX's typesetting engine and macro system to 'implement a declarative document description language based on [...] Scribe by Brian Reid.'
* First widely used language for describing logical structure of a wide range of document types.
* Introduces (as did Scribe) 'logical design', which says authors should only have to worry about logical structure of their material, not presentation
* Got adopted real widely, bunch of dev stuff happened.
* By '91 Frank Mittelbach and Rainer Schopf take over support and maintenance
* Big rebuild in '94 to add a bunch of features, breaks some backward compatibility
* Lots of packages developed in late '90s
* Project team refuses to 'enhance' the kernel to avoid project drift, bugs

### 1.2 Today's System

* Looks at the files used by a typical LATEX system
* File types:
    * `.tex`, `.dtx`, `.ltx` - text input documents
    * `.bbl` - bibliography input
    * `.ind`, `.gnd` - index and glossary
    * `.tex` - internal graphics
    * `.ps`, `.eps`, `.tif`, `.png`, `.jpg`, `.gif`, `.pdf` - external graphics
    * `.clo`, `.cls`, `.sty` - layout and structure
    * `.def` - encoding definitions
    * `.ldf` - language definitions
    * `.fd` - font access definitions
    * `.cfg` - configuration data
    * `.aux` - auxiliary input and output
    * `.toc` - output table of contents
    * `.lof`, `.lot` - list of figures, list of tables
    * `.fmt` - low level format input
    * `.tfm` - font metrics input
    * `.dvi`, `.pdf` - output results
    * `.log` - transcript
    * `.aux`, `.bbl` - output bibliography
    * `.bib`, `.bst`, `.blg` - database, style, transcript for bibliography
    * `.idx`, `.ind` - input/output for index
    * `.ist`, `.ilg` - style / transcript for index
* Structure is typically a master file that uses subsidiary files
* It also needs several files with structure and layout definitions:
    * `.cls` class files 
    * `.clo` option files
    * `.sty` package files
* LATEX comes with five standard doc classes: article, report, book, slides, letter, and also usually comes with language def files for the `babel` system, and encoding def files for the `inputenc`/`fontenc` packages.
* Info about glyphs to be typeset is in font metric files. Gives dimensions of glyphs, but not their shapes, which are in font definition files.
* Output will be:
    * A `.dvi` device independent formatted document
    * Possibly a `.pdf` page description format document
    * The `.dvi` file doesn't have rendering info, only names/locations of fonts and glyphs. A `.pdf` can hold the rendering info.
    * `.aux`, `.toc`, `.lof`, `.lot` files can hold cross references
    * The `.log` file has a transcript of the run.
    * You may need to render the dvi file through postscript to get it viewable
    
### 1.3 Working with this book

* Chapter summary, typographic conventions, rules for example use

## Chapter 2: The Structure of a LATEX Document

### 2.1 The structure of a source file

* A document belongs to a class of documents having the same general (logical) structure.
* You start your file with a `\documentclass` command to define which class it belongs to. The doc class defines the logical commands and environments available, and the default formatting
* You can use packages by putting one or more `\usepackage` commands after `\documentclass`
* Anything between `\documentclass` and `\begin{document}` is the 'document preamble'
* Contents of the preamble:
    * All style parameters via packages, class files, or in the document
    * Any additional non-standard changes to the current document, such as:
        * Changing standard settings for params in a class file
        * Adding packages and using them
        * Changing stanard settings for package parameters
        * Modifying your own local packages

#### 2.1.1 Processing of options and packages

* There's a distinction between declared options of a class or package and general purpose package files: general purpose packages are declared with `\usepackage`, while options are properties of the document (if used in `\documentclass`) or properties of packages (if given in `\usepackage`).
* Package options must be declared in the package to be referenced in `\usepackage`, while document class options not declared in the class def are treated as global options.
* All options to `\documentclass` are passed as class options to all `\usepackage` declarations, with unused ones ignored silently by the packages.
* You can specify multiple packages if they take the same options: `\usepackage[german]{babel,varioref}` (where `german` is the option)
* When `\begin{document}` is reached, all global options are checked to see whether each has been used by at least one package, issues warning if not.

#### 2.1.2 Splitting the source file into parts
