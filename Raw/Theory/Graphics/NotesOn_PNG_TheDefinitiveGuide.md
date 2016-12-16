# Notes on PNG: The Definitive Guide

By Greg Roelofs; O'Reilly Media Inc, 1999; ISBN 9781565925427

## Chapter 1: An Introduction to PNG

* Stands for Portable Network Graphics
* Supports:
    * lossless compression
    * transparency
    * a range of color depths
    * gamma correction
    * standard color space
    * embedded textual information

### 1.1 Overview of Image Properties

* Raster vs vector--PNG is raster
* Rasters are 2D arrays of pixels
* Rasters also have depth--number of possible colors for a pixel
* Raw size before compression = width * height * (bits in color depth)
* Three main image types within raster:
    * indexed-color / psuedocolor / colormapped / palette-based - stores a copy of each color value needed for the image in a palette. The image is then index values referencing the palette entries.
    * grayscale - values directly correspond to values between black and white
    * truecolor - three values for each pixel, for RGB. Truecolor requires at least 1B per sample
* Sample - one component of a single color or value
* Channel - collection of all samples of a given type in an image--all green components of every pixel, for instance.
* A grayscale image has one channel, RGB image has three, not applicable to palette-based
* Transparency adds an 'alpha channel' that gives the level of opacity for a pixel
* Palette-based images don't typically have an alpha channel, instead using specific palette entries to correspond to transparency
* Quantization - converting from a high color depth to a lower color depth by grouping similar colors from the high depth into 'buckets' at the lower depth.
* Dithering - mixing adjacent or nearby pixels of available colors to give the appearance of other colors not available at that depth.
* Lossless compression - preserves the exact image data bit for bit
* Lossy compression - discards some data from the original in exchange for better compression

### 1.2 What is PNG good for?

* Useful format for storing the intermediate stages of an image.
* Lossless and supports 48bit truecolor and 16bit grayscale, so saving, restoring, resaving an image does not degrade its quality. JPEG suffers from this.
* Has full transparency. JPEG has no transparency, GIF has only fully transparent pixels, TIFF has full transparency as part of the standard but does not require it in all implementations.
* Where TIFF allows picking and choosing which features to implement in applications, PNG leaves almost no room for differing implementations.

#### 1.2.1 Alpha Channels

* Also known as a 'mask channel'
* Associates varying levels of transparency with a pixel
* All three basic PNG image types (RGB, grayscale, palette-based) can have alpha channels, but mostly the truecolor ones do, creating RGBA.
* Anti-aliasing - creating the illusion of smooth curves in a rectangular grid of pixels by smoothly varying the pixels' colors. Problematic in the absence of variable transparency because it must be done against a background of a set color, or risk creating a halo effect when used against another color.
* Alpha blending - anti-aliasing which uses transparency as a placeholder for the background color

#### 1.2.2 Gamma and Color Correction

* Refers to the ability to correct for differences in how computers / monitors interpret color values.
* Gamma information associates a single number with a computer display system, to try to characterize the effect of that particular system on color.

#### 1.2.3 Interlacing and Progressive Display

* PNG supports two dimensional interlacing, involves no stretching at all on more than half its passes.
* This is way less of a concern now, I imagine.

#### 1.2.4 Compression


## Chapter 8: PNG Basics

* Fundamental building block of PNG images is the 'chunk'
* Other than the first 8 bytes in the file, PNG images are nothing but chunks

### 8.1 Chunks

* Chunks all have the same structure:
    1. **length**: 4 byte length in big-endian format
    1. **type**: 4 byte chunk type
    1. **data**: Between 0 and 2,147,483,647 bytes of chunk data
    1. **CRC**: 4 byte cyclic redundancy check value
* Length field refers only to the data, not the type or CRC
* CRC covers both the type and the data, and is always present even if there is no data
* Type is a sequence of binary values, corresponding to the upper and lowercase ASCII letters
* By convention it is reasonable to refer to chunks by their ASCII names
* Types are usually mnemonic, but also case sensitive because of the conversion from ASCII to binary codes
* Because each of the four bytes in the type correspond to an ASCII character (which are 7 bits), each has an extra bit
* Each extra bit is interpreted as follows:
    * First character extra bit: indicates whether the chunk is critical or ancillary. Ancillary chunks may be ignored if a decoder does not recognize them, but warnings must be issued if a critical chunk is not understood.
    * Second character extra bit: whether the chunk is public or private. Public chunks are defined in the specification or registered as official; private chunks are application specific.
    * Third character extra bit: reserved for future use
    * Fourth character extra bit: intended for image editors rather than viewers, indicates whether an editing program encountering an unknown ancillary chunk can safely copy it into the new file.

### 8.2 PNG Signature

* First 8 bytes are not a chunk, but are a critical component because they identify it as a PNG file regardless of filename.
* The signature bytes are more than an identifier, because they allow detection of common file transfer corruptions
* The bytes are:
    1. `137` - byte with its most significant bit set ("8 bit character")
    1. `80` - P
    1. `78` - N
    1. `71` - G
    1. `13` - Carriage return / ^M
    1. `10` - Line feed / ^j
    1. `26` - ^z
    1. `10` - Line feed / ^j

### 8.3 A Word on Color Representation

* Lots of different color spaces / models

### 8.4 The Simplest PNG

* Simplest PNG is made up of four pieces:
    * 8 byte PNG signature
    * IHDR image header chunk
    * IDAT image data chunk
    * IEND end of image chunk

### 8.5 PNG Image Types

#### 8.5.1 Palette-based

* Use the PLTE chunk
* support 4 pixel depths (1,2,4,8 bits) for max of 2, 4, 16, or 256 palette entries.

#### 8.5.2 Palett-Based with Transparency

* The tRNS transparency chunk is ancillary
* Exactly analogous to the PLTE chunk

#### 8.5.3 Grayscale

* Depths of 1, 2, 4, 8, 16 bits are supported

#### 8.5.4 Grayscale with transparency

* This is palette style, with a single color or gray value is marked as fully transparent

#### 8.5.5 Grayscale with Alpha Channel
