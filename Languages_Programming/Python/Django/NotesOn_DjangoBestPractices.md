# Notes on Django Best Practices

From https://django-best-practices.readthedocs.io/en/latest/projects.html

## Django Projects

* Almost every project consists of:
    * Settings
    * URLconf
    * WSGI file
    * Local Applications
    * Templates
    * Static Media
    * manage.py

### Settings

* Lives in the root, in `settings.py`
* It can be useful to use multiple settings files
* Any solution for multiple settings files should meet these reqs:
    * All important settings files are version controlled
    * All settings inherit from a common base
* For handling file paths, let Python generate absolute path names

    ```Python
    import os
    DIRNAME = os.path.dirname(__file__)
    # ...
    STATIC_ROOT = os.path.join(DIRNAME, 'static')
    ```

### URLconf

* By default lives in `urls.py` in the root of the project
* Whenever possible, just include URLconfs from applications
* You may need different URLconfs for different environments
* You can use `ROOT_URLCONF` to achieve this
* Directory structure:

    ```
    myproject/
        settings/
            __init__.py
            base.py         <-- shared by all envs
            dev.py
            production.py
        urls/
            __init__.py
            base.py         <-- shared by all envs
            dev.py
            production.py
    ...
    ```

### WSGI File

* Tells the WSGI server how to serve your project
* Lives in `wsgi.py` typically

### Local Applications

* Django apps that are domain-specific to your project
* Live in the project module, would not have use outside it
* If you bring in third party code, add it via your pip requirements
* If you put project apps inside the project namespace, you avoid polluting the global namespace / running into naming conflicts

### Templates

* Live in one of two places, inside the app or at the project root
* Recommend keeping all templates in the project template directory unless you plan on including your app in multiple projects or developing it as a package
* Django's generic views give a good pattern for naming templates
* Most generic view templates are name formatted `[app]/[model]_[function].html`
* Example: template to list all contacts (`Contact` model) in an address book app (`address_book`), gives `address_book/contact_list.html`
* Detail view might be `address_book/contact_detail.html`
* When using inclusion tags or other partial templates, keep them in an `includes` directory inside the application template directory
* Example: an inclusion tag to render a contact form inside the address book app might be templated at `address_book/includes/contact_form.html`

### Static Media

* Two types: user-generated content and media needed to render the site
* Best practice is that your own static media lives inside your project and your VCS. 
* User uploads go elsewhere, so you use `django.contrib.staticfiles`
* That gives you a `static` template tag that will properly locate static files, which leaves `MEDIA_URL` and `MEDIA_ROOT` to manage user generated content
