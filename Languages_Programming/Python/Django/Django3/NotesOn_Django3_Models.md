# Notes on Django 3 Models

From https://docs.djangoproject.com/en/3.0/topics/db/models/

* Every model is a class that subclasses `django.db.models.Model`
* Every model attribute represents a database field
* Table names are automatically derived from the model metadata, but can be overridden
* Models automatically get an `id` field, though can be overridden
* Having defined models, you have to include your app in `INSTALLED_APPS` in your `settings.py` to add the module name that contains your `models.py` file
* Having added to `INSTALLED_APPS` you have to run `makemigrations` and `migrate`

## Fields

* Only required part of a model is the list of db fields it defines
* Each field should be an instance of an appropriate `Field` class
* Field class types define
    * column type to store
    * default HTML widget to use when rendering a form field
    * minimal validation requirements
* Common field arguments:
    * `null` - if `True`, django stores empty values as NULL, default `False`
    * `blank` - if `True`, field is allowed to be blank, default `False`
    * `choices` - sequence of 2-tuples, like `[('db_val', 'display_name'), (...)]`
    * `default` - default value, can be value or callable, if callable called on object create
    * `help_text` - documentation text
    * `primary_key` - if `True`, primary key for the model. If no field specified, django adds an `IntegerField` to hold the primary key.
    * `unique` - if `True`, field must be unique throughout table
* Every field except the relational ones take an optional first positional argument, which is the verbose name: `first_name = models.CharField("person's first name", max_length=30)`
* In the relational fields the first arg has to be a model class, so you have to use the `verbose_name` keyword argument: 

    ```Python
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, verbose_name="related poll")
    ```

### Relationships

* Many to one uses `django.db.models.ForeignKey`

    ```Python
    from django.db import models

    class Manufacturer(models.Model):
        # ...
        pass

    class Car(models.Model):
        manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    ```

* Suggested but not required that the name of a `ForeignKey` field is the name of the model, lowercased
* Many to many relationships use `ManyToManyField`

    ```Python
    from django.db import models

    class Topping(models.Model):
        pass

    class Pizza(models.Model):
        toppings = models.ManyToManyField(Topping)
    ```

* Suggested but not required that the name is plural describing set of related objects
* Doesn't matter which model has the many to many field, but only put it in one, not both
* Generally you put the many to many field in the object that will be edited on a form
* You can associate data with the relationship by specifying a model as the relation:

    ```Python
    from django.db import models

    class Person(models.Model):
        name = models.CharField(max_length=128)

        def __str__(self):
            return self.name

    class Group(models.Model):
        name = models.CharField(max_length=128)
        members = models.ManyToManyField(Person, through='Membership')

        def __str__(self):
            return self.name

    class Membership(models.Model):
        person = models.ForeignKey(Person, on_delete=models.CASCADE)
        group = models.ForeignKey(Group, on_delete=models.CASCADE)
        date_joined = models.DateField()
        invite_reason = models.CharField(max_length=64)
    ```

* Restrictions on the intermediate model:
    * Must contain one and only one foreign key to the source model (`Group`), or you must explicitly specify the foreign keys django should use using `ManyToManyField.through_fields`. Similar restriction on the foreign key to the target model.
    * For many to many self join you can have two references to the same model, but they're treated as the two sides of the relation.
* Creating instances of the relationship:

    ```Python
    ringo = Person.objects.create(name="Ringo")
    beatles = Group.objects.create(name="The Beatles")
    m1 = Membership(person=ringo, group=beatles, date_joined=date(1962,8,16), invite_reason="drummer")
    m1.save()
    beatles.members.all()       # <QuerySet [<Person: Ringo>]>
    ringo.group_set.all()       # <QuerySet [<Group: The Beatles>]>;
    ```
