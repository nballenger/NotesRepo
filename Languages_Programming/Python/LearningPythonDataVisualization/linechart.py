# -*- coding: utf-8 -*-
import pygal

# Create a new line chart
line = pygal.Line()
line.title = 'Website hits in the past 2 years'

line.x_labels = map(str, range(2012,2014))
line.add('Page views', [None, 0, 12, 32, 72, 148])
line.render_to_file('output/linechart.svg')
