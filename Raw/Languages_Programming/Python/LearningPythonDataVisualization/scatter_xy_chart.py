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
