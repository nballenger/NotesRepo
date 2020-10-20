# Notes on Django Forms (Django v2.2)

From https://docs.djangoproject.com/en/2.2/topics/forms/

* An HTML form must specify two things in addition to input elements:
    * URL the data will be returned to
    * HTTP method the data will be sent by
* Only GET and POST are valid methods for forms
* Django handles three parts of work involving forms:
    * preparing and restructuring data to make it ready to render
    * creating HTML forms for the data
    * receiving and processing submitted forms and data from a client
* A Django `Form` subclass describes a form and how it works and appears
* A form class's fields map to input elements
* Fields are themselves classes, which manage form data and do validation on submit
* Form fields are represented in the client via HTML widgets
* Each field type has a default widget type, which may be overridden
* Typical rendering process for an object in Django:
    1. retrieve and instantiate it in the view
    1. pass that to a template context
    1. expand it to HTML markup using template variables
* Forms typically don't require retrieval from a database, and are instantiated directly in the view.
* On instantiation, you can leave the form empty or pre-populate with (eg):
    * data from a saved model instance
    * data collated from other sources
    * data received from a previous form submission

## Building a form

* In HTML, a form would look like:

    ```HTML
    <form action="/your-name/" method="post">
        <label for="your_name">Your name: </label>
        <input id="your_name" type="text" name="your_name" value="{{ current_name }}">
        <input type="submit" value="OK">
    </form>
    ```

* In Django, you need a `Form` subclass. `forms.py`:

    ```Python
    from django import forms

    class NameForm(forms.Form):
        your_name = forms.CharField(label='Your name', max_length=100)
    ```

* The `label` param is what will render as the input label
* `max_length` does both HTML limiting and BE validation
* A `Form` instance has `is_valid()` to run validation on all fields
* When that runs, if all fields have valid data, will
    * return `True`
    * put form's data in the `cleaned_data` attribute
* The rendered form doesn't include `<form>` tags or a submit button, you have to put those in the template
* Form data is sent to a view for processing, generally the same view that published the form
* To handle the form you have to instantiate it in the view for the URL where you want it published. `views.py`:

    ```Python
    from django.http import HttpResponseRedirect
    from django.shortcuts import render

    from .forms import NameForm

    def get_name(request):
        if request.method == 'POST':
            form = NameForm(request.POST)
            if form.is_valid():
                return HttpResponseRedirect('/thanks/')
        else:
            form = NameForm()

        return render(request, 'name.html', {'form': form})
    ```

* If you end up there with a GET, creates an empty form instance and puts it in the template context to render
* If submitted with POST, view creates a form instance and populates it with data from the request, which is binding the data to the form (it's now a 'bound form')
* If it's not valid, go back to the template with the now bound form, so the HTML is populated with the submitted data for correction
* If it is valid, the validated data is in `cleaned_data`, and you can use that to do work before sending a redirect.
* The template could look like (`name.html`):

    ```
    <form action="/your-name/" method="post">
        {% csrf_token %}
        {{ form }}
        <input type="submit" value="Submit">
    </form>
    ```

## More about Form classes

* All of them are subclasses of either of:  
    * `django.forms.Form`
    * `django.forms.ModelForm`
* Both of which inherit from a private base class, `BaseForm`
* Bound vs. unbound:
    * An unbound form has no data associated with it, and is empty or has default values on render
    * A bound form has submitted data, and can be validated
    * The form's `is_bound` attribute tells you whether it has data

## More on fields


