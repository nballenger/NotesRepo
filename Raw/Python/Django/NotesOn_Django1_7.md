# Django 1.7 Notes

## Models

From [https://docs.djangoproject.com/en/1.7/topics/db/models/](https://docs.djangoproject.com/en/1.7/topics/db/models/)

* Models are classes subclassing ``django.db.models.Model``
* Attributes represent database fields.
* Table names are derived from model metadata, but can be overridden.
* You register your models by adding your app to ``INSTALLED_APPS``
* After adding to ``INSTALLED_APPS`` run ``manage.py migrate`` and/or ``makemigrations``

### Fields

#### Basic Fields

* Attributes should be instances of ``Field`` classes, which will determine:
    * Database column type
    * Default HTML widget to use in rendered forms
    * Minimal validation requirements
* Fields have common options you can set at definition: ``null``, ``blank``, ``choices``, ``default``, ``help_text``, ``primary_key``, ``unique``, etc.
* By default every model has this primary key: ``id = models.AutoField(primary_key=True)``
* Everything but the relational fields takes an optional first argument to be the verbose name of that field
* For the relational Fields, use the ``verbose_name`` keyword argument
* Don't capitalize the first letter of the verbose name

#### Relational Fields

* Built-ins for the three most common relations: one to many, many to many, one to one
* One-to-many example, using ``django.db.models.ForeignKey``:

```Python
from django.db import models

class Manufacturer(models.Model):
    pass

class Car(models.Model):
    manufacturer = models.ForeignKey(Manufacturer)
```

* Many-to-many example, using ``django.db.models.ManyToManyField``:

```Python
from django.db import models

class Topping(models.Model):
	pass
	
class Pizza(models.Model):
	toppings = models.ManyToManyField(Topping)
```

* Put a ``ManyToManyField`` in either model, **but not both**.
* Generally put the ``ManyToManyField`` in the object that's going to be edited in a form.
* Example of associating data with the relationship in a many-to-many:

```Python
from django.db import models

class Person(models.Model):
	name = models.CharField(max_length=128)
	
	def __unicode__(self):
		return self.name
		
class Group(models.Model):
	name = models.CharField(max_length=128)
	members = models.ManyToManyField(Person, through='Membership')
	
	def __unicode__(self):
		return self.name
		
class Membership(models.Model):
	person = models.ForeignKey(Person)
	group = models.ForeignKey(Group)
	date_joined = models.DateField()
	invite_reason = models.CharField(max_length=64)


ringo = Person.objects.create(name="Ringo Starr")
paul = Person.objects.create(name="Paul McCartney")
beatles = Group.objects.create(name="The Beatles")
m1 = Membership(person=ringo, group=beatles, date_joined=date(1962, 8, 16),
                invite_reason="Needed drummer.")
m1.save()

beatles.members.all()  # returns [<Person: Ringo Starr>]
ringo.group_set.all()  # returns [<Group: The Beatles>]

# THESE WON'T WORK:
beatles.members.add(paul)					# Not at all
beatles.members.create(name="George")	# Error
beatles.members = [paul, ringo]			# Nope
```

* Specific caveats to using a ``through`` class in many-to-many:
	* Intermediate model must contain only one foreign key to the source model, or you have to explicitly define the foreign keys using ``ManyToManyField.through_fields``
	* You can have two foreign keys in a recursive many to many
	* If you do a recursive many to many, you must use ``symmetrical=False``
* Example of a one to one relationship with ``django.db.models.OneToOneField``:

```Python
from django.db import models
from geography.models import ZipCode

class Restaurant(models.Model):
	zip_code = models.ForeignKey(ZipCode)
```

#### Custom Fields

From [https://docs.djangoproject.com/en/1.7/howto/custom-model-fields/](https://docs.djangoproject.com/en/1.7/howto/custom-model-fields/)

* Example object: wrapping a Python object representing the deal of a hand of cards in Bridge. Class:

```Python
class Hand(object):
	""" A hand of cards """
	
	def __init__(self, north, east, south, west):
		# Input params are lists of cards ('Ah', '9s', etc)
		self.north = north
		self.east = east
		self.south = south
		self.west = west
```

### Meta Options

* Example of model metadata via an inner ``class Meta``:

```Python
from django.db import models

class Ox(models.Model):
	horn_length = models.IntegerField()
	
	class Meta:
		ordering = ["horn_length"]
		verbose_name_plural = "oxen"
```

* Metadata is 'anything that's not a field' like ordering options, db tablename, human readable names, etc.

### Model Attributes

* The ``objects`` attribute is a ``Manager``, which is an interface through which you can run query operations. 
* The default name is ``objects`` though that can be overridden.

### Methods

* Adding methods to a model gives you 'row-level functionality', biz logic stays in the model.
* Example of a model with custom methods:

```Python
from django.db import models

class Person(models.Model):
	first_name = models.CharField(max_length=50)
	last_name = models.CharField(max_length=50)
	birth_date = models.DateField()
	
	def baby_boomer_status(self):
		"Returns the person's baby-boomer status."
		import datetime
		if self.birth_date < datetime.date(1945, 8, 1):
			return "Pre-boomer"
		elif self.birth_date < datetime.date(1965, 1, 1):
			return "Baby boomer"
		else:
			return "Post-boomer"
			
	def _get_full_name(self):
		"Returns the person's full name."
		return '%s %s' % (self.first_name, self.last_name)
		
	full_name = property(_get_full_name)
```

* You typically want to define ``__unicode__`` and ``get_absolute_url()``
* You may want to override methods like ``save()`` and ``delete()``

### Inheritance

* Mostly like normal Python class inheritance
* Base class should always subclass ``django.db.models.Model``
* Three styles of inheritance in Django:
	1. Abstract base classes, where parents are just common functionality holders
	2. Multi-table inheritance, where you subclass an existing model and want each model to have a separate database table
	3. Proxy models, which let you modify the Python-level behavior of a model without changing the fields at all

#### Abstract Base Classes

* Putting ``abstract=True`` in the ``Meta`` class means a model won't be used to create tables.
* Raises an exception to have fields in an abstract base class with the same name as fields in a child class.
* Example:

```Python
from django.db import models

class CommonInfo(models.Model):
	name = models.CharField(max_length=100)
	age = models.PositiveIntegerField()
	
	class Meta:
		abstract = True
		
class Student(CommonInfo):
	home_group = models.CharField(max_length=5)
```

* If a child doesn't declare its own ``Meta`` class it will inherit the parent's.
* The child can subclass the parent's ``Meta`` to extend it:

```Python
from django.db import models

class CommonInfo(models.Model):
	class Meta:
		abstract = True
		ordering = ['name']
		
class Student(CommonInfo):
	class Meta(CommonInfo.Meta):
		db_table = 'student_info'
```

* Note that ``abstract=True`` is automatically switched to ``False`` for child classes, so that they don't become abstract by default.
* If you use ``related_name`` with ``ForeignKey`` or ``ManyToManyField``, you have to specify a unique reverse name for the field. That'd be a problem in an abstract base class, since each child would inherit the name.
* When you use ``related_name`` in an abstract base class, part of the name should contain ``%(app_label)s`` and ``%(class)s``:

```Python
from django.db import models

class Base(models.Model):
	m2m = models.ManyToManyField(
		OtherModel, 
		related_name="%(app_label)s_%(class)s_related"
	)
	
class ChildA(Base):		# reverse name = common_childa_related
	pass
	
class ChildB(Base):		# reverse name = common_childb_related
	pass
```

#### Multi-table Inheritance

* In multi-table inheritance, each model in the hierarchy corresponds to its own db table, and the inheritance relationship creates links between child and each parent by an automatically created ``OneToOneField``:

```Python
from django.db import models

class Place(models.Model):
	name = models.CharField(max_length=50)
	address = models.CharField(max_length=80)
	
class Restaurant(Place):
	serves_hot_dogs = models.BooleanField(default=False)
	serves_pizza = models.BooleanField(default=False)
	
# Both of these work:
Place.objects.filter(name="Bob's Cafe")
Restaurants.objects.filter(name="Bob's Cafe")

p = Place.objects.get(id=12)
p.restaurant						# Returns associated Restaurant obj
```

* In multi-table inheritance, children shouldn't inherit their parent's ``Meta`` class, so they don't have access to it.
* Exceptions to that: if the child doesn't specify ``ordering`` or ``get_latest_by``, it inherits them
* Multi-table inheritance's automatic ``OneToOneField`` uses up the name that is the default ``related_name`` value for ``ForeignKey`` and ``ManyToManyField`` relations, so if you use those on a subclass of a parent model, you **must** explicitly define the ``related_name`` attribute for each field.

#### Proxy Models

* If you want to change the Python behavior of a model (change the default manager, add a method, etc) without creating a new db table, you can create a proxy for the original model.
* Creation, delete, update on the proxy go into the db table of the original.
* You declare a proxy model as normal, with ``proxy = True`` in the ``Meta``:

```Python
from django.db import models

class Person(models.Model):
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=30)
	
class MyPerson(Person):
	class Meta:
		proxy = True
		
	def do_something(self):
		pass
		
class OrderedPerson(Person):
	class Meta:
		proxy = True
		ordering = ["last_name"]
```

* Note that a queryset for Person objects will not return MyPerson objects, only a queryset on MyPerson objects will.
* A proxy model must inherit from exactly one non-abstract model class.
* If you don't specify any model managers on a proxy model, it inherits the managers from its model parents.
* Changing the default manager:

```Python
from django.db import models

class NewManager(models.Manager):
	pass
	
class MyPerson(Person):
	objects = NewManager()
	
	class Meta:
		proxy = True
```

#### Multiple Inheritance

* Django models can inherit from multiple parents, but normal name resolution rules still apply
* Main use case for this is mixins
* In 1.7+, you have to use an explicit ``AutoField`` in base models rather than rely on the implicit ``id`` field, or you'll get name clashes.



## Forms

From [https://docs.djangoproject.com/en/1.7/topics/forms/](https://docs.djangoproject.com/en/1.7/topics/forms/)

### HTML Forms

* Elements inside ``&lt;form&gt;`` tags
* Can be builtins or complex js widgets
* Form must specify an action URL and the HTTP method it'll use
* Browsers can only deal with ``GET`` and ``POST``

### Django's Role in Forms

* Django handles three parts of the work involved informs:
	* Preparing and restructuring data ready for rendering
	* Creating HTML forms for the data
	* receiving and processing submitted forms and data from the client

### Forms in Django

#### Django ``Form`` class

* ``Form`` instance describes a form, determines how it functions/appears
* ``Form`` instance attributes map to HTML form elements
* ``ModelForm`` instances map a model instance's fields to HTML form elements via  a ``Form``
* General pattern of rendering an object in Django:
	1. Instantiate it in the view
	2. Pass it to the template context
	3. expand it to HTML markup using template variables
* Rendering forms is similar, but you often don't retrieve it from the database, instead instantiating it in the view as empty.
* You can leave a form empty or populate it with data from a model instance, previous form submission, or other source.

### Building a Form

* Goal is to generate HTML form that takes a user's name and submits it to ``/your-name/``
* ``Form`` subclass that  provides a starting point:

```Python
from django import forms

class NameForm(forms.Form):
	your_name = forms.CharField(label='Your name', max_length=100)
```

* Which would render as a label and input, with no wrapping form tags
* Example of handling the form in the view:

```Python
from django.shortcuts import render
from django.http import HttpResponseRedirect

def get_name(request):
	# If POST, we need to process form data
	if request.method == 'POST':
		# Create form instance, populate with request data
		form = NameForm(request.POST)
		# Check validity
		if form.is_valid():
			# Process data in form.cleaned_data as required
			# redirect to new URL
			return HttpResponseRedirect('/thanks/')
			
	# if a GET (or other method) create blank form
	else:
		form = NameForm()
		
	return render(request, 'name.html', {'form': form})
```

* And the template to render it:

```
<form action="/your-name/" method="POST">
	{% csrf_token %}
	{{ form }}
	<input type="submit" value="Submit" />
</form>
```

### More about ``Form`` Classes

* There are 'bound' and 'unbound' forms:
	* An unbound form has no data associated with it, renders as empty/defaults
	* Bound form has submitted data, can be used to validate that data
* If an invalid bound form is rendered, it can include inline error messages
* Forms have an ``is_bound()`` method
* Each field type is associated with a Widget class, that renders an HTML form widget
* When data is submitted with a form and validated by calling ``is_valid()``, the validated data is in ``form.cleaned_data`` as Python types
* Example of handing form data in the view handling the form:

```Python
from django.core.mail import send_mail

if form.is_valid();
	subject = form.cleaned_data['subject']
	message = form.cleaned_data['message']
	sender = form.cleaned_data['sender']
	cc_myself = form.cleaned_data['cc_myself']
	
	recipients = ['info@example.com']
	if cc_myself:
		recipients.append(sender)
		
	send_mail(subject, message, sender, recipients)
	return HttpResponseRedirect('/thanks/')
```

### Working with Form Templates

* Calling ``{{form}}`` in a template will render the entire thing's labels/inputs
* You can also use:
	* ``{{ form.as_table }}``
	* ``{{ form.as_p }}``
	* ``{{ form.as_ul }}``
* You need to provide wrapper table or ul elements in the template
* To render fields manually, use ``{{ form.name_of_field }}``:

```
{{ form.non_field_errors }}
<div class="fieldWrapper">
	{{ form.subject.errors }}
	<label for="id_subject">Email subject:</label>
	{{ form.subject }}
</div>
```

* ``{{ form.name_of_field.errors }}`` displays an unordered list of form errors with a class of ``errorlist``
* You can loop over errors to customize directly:

```
{% if form.subject.errors %}
	<ol>
	{% for error in form.subject.errors %}
		<li><strong>{{ error|escape }}</strong></li>
	{% endfor %}
	</ol>
{% endif %}
```

* You can loop over fields with ``for field in form``
* Useful attributes:
	* ``field.label``
	* ``field.label_tag``
	* ``field.id_for_label``
	* ``field.value``
	* ``field.html_name``
	* ``field.help_text``
	* ``field.errors``
	* ``field.is_hidden``
	* ``field.field``