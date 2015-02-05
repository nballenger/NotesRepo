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
