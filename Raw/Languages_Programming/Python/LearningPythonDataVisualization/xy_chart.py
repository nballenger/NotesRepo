# -*- coding: utf-8 -*-
import pygal

xy_chart = pygal.XY()
xy_chart.add('Value 1', [(-50,-20), (100, 45)])
xy_chart.render_to_file('output/xy_chart.svg')
