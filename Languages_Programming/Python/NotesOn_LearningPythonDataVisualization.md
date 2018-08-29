# Notes on Learning Python Data Visualization

By Chad Adams, Packt Publishing, 2014

## Chapter 1: Setting Up Your Development Environment

* Covers 2.7 on win/os x/ubuntu
* Reviews easy_install and pip
* Installs lxml xml parser/writer

## Chapter 2: Python Refresher

* Looks at using ``pil``, ``pillow``, ``svgwrite``

## Chapter 3: Getting Started with pygal

### Why use pygal?

* Install: ``sudo pip install pygal``

#### Building a line chart

* Example is charting site visits over two years

```Python
# -*- coding: utf-8 -*-
import pygal

# Create a new line chart
line = pygal.Line()
line.title = 'Website hits in the past 2 years'

line.x_labels = map(str, range(2012,2014))
line.add('Page views', [None, 0, 12, 32, 72, 148])
line.render_to_file('output/linechart.svg')
```

### Stacked Line Charts

```Python
# -*- coding: utf-8 -*-
import pygal

# Create a new stacked line chart
line = pygal.StackedLine(fill=True)
line.title = 'Web hits in the past two years'
line.x_labels = map(str, range(2012, 2014))
line.add('Site A', [None, 0, 12, 32, 72, 148])
line.add('Site B', [2, 16, 12, 87, 91, 342])
line.add('Site C', [42, 55, 84, 88, 90, 171])

line.render_to_file('output/stacked_linechart.svg')
```

### Simple Bar Charts

```Python
# -*- coding: utf-8 -*-
import pygal

bar = pygal.Bar()
bar.title = 'Searches for term: sleep'
bar.x_labels = map(str, range(2011, 2015))
bar.add('Searches', [81, 88, 88, 100])
bar.render_to_file('output/bar_chart.svg')
```

### Stacked Bar Charts

```Python
# -*- coding: utf-8 -*-
import pygal

bar = pygal.StackedBar()
bar.title = 'Searches for term: sleep'
bar.x_labels = map(str, range(2011, 2015))
bar.add('Men', [81, 88, 88, 100])
bar.add('Women', [78, 84, 69, 92])
bar.render_to_file('output/stacked_bar_chart.svg')
```

### Horizontal Bar Charts

```Python
# -*- coding: utf-8 -*-
import pygal

bar = pygal.HorizontalBar()
bar.title = 'Searches for term: sleep in April'
bar.add('Searches', [81,88,88,100])
bar.render_to_file('output/horizontal_bar_chart.svg')
```

### XY Charts

```Python
# -*- coding: utf-8 -*-
import pygal

xy_chart = pygal.XY()
xy_chart.add('Value 1', [(-50,-20), (100, 45)])
xy_chart.render_to_file('output/xy_chart.svg')
```

### Scatter Plots

```Python
# -*- coding: utf-8 -*-
import pygal

xy_chart = pygal.XY(stroke=False)
xy_chart.add('Value 1', [(-50,-30), (100,45), (120,56),
             (168,102), (211,192), (279,211)])
xy_chart.add('Value 2', [(-2,-14), (370,444), (391,464),
             (399,512), (412, 569), (789,896)])
xy_chart.add('Value 3', [(2,10), (142,164), (184,216),
             (203,243), (208,335), (243,301)])
xy_chart.render_to_file('output/scatter_xy_chart.svg')
```
