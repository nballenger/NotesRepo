# Notes on Carto's Visualization Tools

## Overview

From [https://carto.com/platform/solutions-visualization/](https://carto.com/platform/solutions-visualization/)

* **Airship** - design library and CSS framework
* **CARTO VL** - JS library for vector (I think?)
* **CARTOFRAMES** - Python package for creating data science workflows
* **SQL API** - data api
* **Import API** - data upload management
* **Data Services API** - programmatically categorize data subsets

## Airship

From [https://carto.com/developers/airship/](https://carto.com/developers/airship/)

* "tools designed to facilitate the development of location intelligence apps by offering layouts, basic patterns, templates, CSS classes, components, widgets, and much more"

### Airship Guides: Introduction

From [https://carto.com/developers/airship/guides/introduction/](https://carto.com/developers/airship/guides/introduction/)

* Composed of three parts that can be used separately:
    * CSS framework
    * web components
    * icons
* Airship does not render maps, you have to do that with CARTO.js or CARTO-VL
* Airship handles only the layout and UI
* Simplest way to use it is via their CDN:

    ```
    <head>
        <!-- Include CSS elements -->
        <link rel="stylesheet" href="https://libs.cartocdn.com/airship-style/v2.0.5/airship.css">
        <!-- Include icons -->
        <link rel="stylesheet" href="https://libs.cartocdn.com/airship-icons/v2.0.5/icons.css">
        <!-- Include airship components -->
        <script src="https://libs.cartocdn.com/airship-components/v2.0.5/airship.js"></script>
        <!-- Include Mapbox GL JS -->
        <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.js"></script>
        <!-- Include Mapbox GL CSS -->
        <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.css" rel="stylesheet" />
    </head>
    ```

### Airship Guides: Getting Started

* Via npm, install three packages:
    * `@carto/airship-styles`
    * `@carto/airship-icons`
    * `@carto/airship-components`
* Via CDN, load as above
* 
