# -*- coding: utf-8 -*-
import pygal

bar = pygal.StackedBar()
bar.title = 'Searches for term: sleep'
bar.x_labels = map(str, range(2011, 2015))
bar.add('Men', [81, 88, 88, 100])
bar.add('Women', [78, 84, 69, 92])
bar.render_to_file('output/stacked_bar_chart.svg')
