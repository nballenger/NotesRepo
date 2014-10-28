# Django Templates

## Syntax Overview

From django-docs-1.7-en/topics/templates.html

### Templates

* Templates are text files, can generate any text based format.
* Template contains variables, interpolated when the template is evaluated.
* Also tags, which control logic within the template.

#### Variables

* Enclosed in double braces: ``{{ variable }}``
* Var names are [_a-zA-Z0-9]+
* Period operator gives variable attribute access
* For variables that don't exist, TEMPLATE_STRING_IF_INVALID is used, '' by default

#### Filters

* Exist to modify variable display
* Written following a variable, separated by a pipe: ``{{ name|lower }}``
* Can be chained: ``{{ text|escape|linebreaks }}``
* Can take arguments: ``{{ bio|truncatewords:30 }}``

#### Tags

* Enclosed in brace plus percent: ``{% tag %}``
* Can create text, control logical flow, or load external information
* Some have start/end: ``{% tag %} ... {% endtag %}``

#### Comments

* Enclosed in brace plus hashmark: ``{# comment #}``
* Newlines are not permitted inside the delimiters.
* Use the comment tag for multiline comments.

#### Template inheritance

* Typical pattern is to build a base template that defines blocks child templates can override

Example base:

```
<html>
<head>
    <title>{% block title %}My Page{% endblock %}</title>
</head>
<body>
    <div id="content">
    {% block content %}
    This is the content.
    {% endblock %}
    </div>
</body>
</html>
```

Example child:

```
{% extends 'base.html' %}

{% block title %}My Particular Page{% endblock %}

{% block content %}
{% for entry in blog_entries %}
    <h2>{{ entry.title }}</h2>
    <p>{{ entry.body }}</p>
{% endfor %}
{% endblock %}
```

* Three level inheritance:
    * Create a ``base.html`` that holds main site wrapper
    * Create a ``base_SECTIONNAME.html`` template for each site section.
    * Create individual templates for each page type, to extend the section template
* If you use ``{% extends %}``, it must be the first template tag in the template.
* Give ``{% block %}`` tags reasonable defaults.
* Add numerous ``{% block %}`` sections to the base templates.
* If you're duplicating content across templates, make it a block.
* If you want content from the parent template, you can use ``{{ block.super }}``
* You can optionally name ``endblock`` tags: ``{% block content %}{% endblock content %}``
* Block tag names must be unique within a template.

#### Automatic HTML escaping

* Run untrusted variables through the ``escape`` filter.
* Consider using Django's auto-escaping
* By default, Django will escape ``&lt; &gt; ' " &amp;``
* To turn off auto-escaping:
    * For individual variables: ``{{ varname|safe }}``
    * For template blocks: ``{% autoescape off %} {{ varname }} {% endautoescape %}``
* String literals passed as arguments to filters are inserted without automatic escaping.

#### Accessing method calls

* You may call methods on Django models, but you may not pass them arguments from template code--do it in the view.

#### Custom tag and filter libraries

* Some apps provide tag and filter libraries.
* To access in a template, use the ``load`` tag
* You can import multiple library names in one call: ``{% load humanize i18n %}``

```
{% load humanize %}

{{ 45000|intcomma }}
```

* Note that the ``load`` tag will only make the tags/filters available to the current template, no others in the inheritance chain.


## Built-in Template Tags and Filters

From /django-docs-1.7-en/ref/templates/builtins.html#ref-templates-builtins-filters

<table>
    <thead>
        <tr>
            <th>Tag</th>
            <th>Purpose</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><code>autoescape</code></th>
            <td>Controls current autoescape behavior, takes <code>on</code> or <code>off</code> as an argument.</td>
            <td>
<pre>
{% autoescape on %}
{{ body }}
{% endautoescape %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>block</code></th>
            <td>Defines a block that can be overridden by child templates.</td>
            <td>
<pre>
{# Parent #}
{% block sidebar %}Parent sidebar!{% endblock %}

...

{# Child #}

{% extends 'parent.html' %}
{% block sidebar %}Child sidebar!{% endblock %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>comment</code></th>
            <td>Ignores everything between tags.</td>
            <td>
<pre>
Some text.
{% comment %}
{% block notrendered %}Whee!{% endblock %}
{% endcomment %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>csrf_token</code></th>
            <td>Injects cross site request forgery token.</td>
            <td>
<pre>
{% csrf_token %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>cycle</code></th>
            <td>Produces one of its arguments each time the tag is encountered. Loops at end of args.</td>
            <td>
<pre>
{% for o in some_list %}
    &lt;tr class="{% cycle 'row1' 'row2' 'row3' %}"&gt;
        ...
    &lt;/tr&gt;
{% endfor %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>debug</code></th>
            <td>Outputs a lot of debug info.</td>
            <td><pre>{% debug %}</pre></td>
        </tr>
        <tr>
            <th><code>extends</code></th>
            <td>Indicates this template extends a parent.</td>
            <td><pre>{% extends 'base.html' %}</pre> or <pre>{% extends parent_var %}</pre></td>
        </tr>
        <tr>
            <th><code>filter</code></th>
            <td>Passes content of the block through one or more filters.</td>
            <td>
<pre>
{% filter force_escape|lower %}
    This text will be HTML escaped and lowercase.
{% endfilter %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>firstof</code></th>
            <td>Outputs first True argument, or nothing if all are False.</td>
            <td>
<pre>
{% firstof var1 var2 var3 %}
</pre>
which is equvialent to
<pre>
{% if var1 %}
    {{ var1|safe }}
{% elif var2 %}
    {{ var2|safe }}
{% elif var3 %}
    {{ var3|safe }}
{% endif %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>for</code></th>
            <td>Loops over an array using a context var.
                <br>Has variables available in the loop:
                <ul>
                    <li><code>forloop.counter</code></li>
                    <li><code>forloop.counter0</code></li>
                    <li><code>forloop.revcounter</code></li>
                    <li><code>forloop.revcounter0</code></li>
                    <li><code>forloop.first</code></li>
                    <li><code>forloop.last</code></li>
                    <li><code>forloop.parentloop</code></li>
                </ul>
            </td>
            <td>
<pre>
&lt;ul&gt;
{% for athlete in athlete_list %}
    &lt;li&gt;{{ athlete.name }}&lt;/li&gt;
{% endfor %}
&lt;/ul&gt;
</pre>
            </td>
        </tr>
        <tr>
            <th><code>for ... empty</code></th>
            <td><code>for</code> can take an optional <code>empty</code> clause for what to display if the given array is empty.</td>
            <td>
<pre>
{% for item in items %}
    {{ item.name }}
{% empty %}
    No items!
{% endfor %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>if</code></th>
            <td>Conditionally outputs the block contents.</td>
            <td>
<pre>
{% if items %}
    Number of items: {{ items|length }}
{% endif %}
</pre>
            </td>
        </tr>
        <tr>
            <th>Boolean operators</th>
            <td><code>if</code> tags can use <code>and</code>, <code>or</code>, and <code>not</code>. <code>and</code> and <code>or</code> may be used together, and having higher precedence.</td>
            <td>
<pre>
{% if a and b %}
    foo
{% endif %}

{% if c or d %}
    bar
{% endif %}

{% if not e %}
    baz
{% endif %}

{# This is like (a and b) or c: #}
{% if a and b or c %}
    pop
{% endif %}
</pre>
            </td>
        </tr>
        <tr>
            <th>Equality Operators</th>
            <td><code>if</code> blocks may also use <code>== != &lt; &gt; &lt;= &gt;=</code> and <code>in</code> in tests.</td>
            <td></td>
        </tr>
        <tr>
            <th>Filters</th>
            <td><code>if</code> blocks may use filters in tests.</td>
            <td>
<pre>
{% if messages|length &gt;= 100 %}
Lots of messages!
{% endif %}
</pre>
            </td>
        </tr>
        <tr>
            <th><code>ifchanged</code></th>
            <td>Check if a value has changed since last loop iteration.</td>
            <td>
<pre>
Archive for {{ year }}

{% for date in days %}
    {% ifchanged %}{{ date|date:"F" }}{% endifchanged %}
    {{ date|date:"M/d"|lower }}
{% endfor %}
            </td>
        </tr>
        <tr>
            <th><code>ifequal</code></th>
            <td>Output block contents if two args are equal.</td>
            <td>
<pre>
{% ifequal user.pk comment.user_id %}
...
{% endifequal %}
</pre>
            </td>
        </tr>
        <tr>    
            <th><code>ifnotequal</code></th>
            <td>Inverse of <code>ifequal</code>.</td>
            <td></td>
        </tr>
        <tr>
            <th><code>include</code></th>
            <td>Loads a template, renders it with the current context. Can also load any object with a <code>render()</code> method as of 1.7.</td>
            <td>
<pre>
{% include template_name_var %}
</pre>
            </td>
        </tr>
        <tr>
            <th>
    </tbody>
</table>
