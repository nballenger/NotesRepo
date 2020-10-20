# Notes on Class-Based Views in Django 2.2

From [https://docs.djangoproject.com/en/2.2/topics/class-based-views/intro/](https://docs.djangoproject.com/en/2.2/topics/class-based-views/intro/)

* Differences/advantages over function based:
    * Code for HTTP methods is via separate methods, not conditional branching
    * OO techniques like mixins can be used

## History

* Originally there was only the view function contract
* Function got an `HttpRequest` object, expected to pass back an `HttpResponse`
* For idiom and pattern reuse, function based generic views implemented
* Those weren't extensible beyond some simple configuration
* Class based generics created to make view development easier
* Implemented via mixins, should be more extensible/flexible

## Using Class-Based Views

* Lets you respond to different HTTP method requests with different class instance methods
* Class based get:

    ```Python
    from django.http import HttpResponse
    from django.views import View

    class MyView(View):
        def get(self, request):
            # view logic here
            return HttpResponse('result')
    ```

* The URL resolve expects to send request/args to a callable, so class based views have an `as_view()` method that returns a callable
* That function creates a class instance, calls `setup()` to init, then calls `dispatch()`, which looks at the request to determine HTTP verb, so it can relay to the matching method or raise `HttpResponseNotAllowed`

    ```Python
    from django.urls import path
    from myapp.views import MyView

    urlpatterns = [
        path('about/', MyView.as_view()),
    ]
    ```

* What the methods return are equivalent to what a function would, in the form of an `HttpResponse` like object, so you can use http shortcuts or `TemplateResponse` objects.
* Class attributes aren't required on views, but can be useful
* Two ways to configure
    1. subclassing and overriding attributes/methods
    1. configuring class attributes as keyword arguments to `as_view()`
* Subclass:

    ```Python
    from django.http import HttpResponse
    from django.views import View

    class GreetingView(View):
        greeting = 'Good Day'

        def get(self, request):
            return HttpResponse(self.greeting)

    class MorningGreetingView(GreetingView):
        greeting = 'Good Morning'
    ```

* Keword args to `as_view()`:
    
    ```Python
    urlpatterns = [
        path('about/', GreetingView.as_view(greeting="G'day")),
    ]
    ```

## Using Mixins

* You can only inherit from one generic view, the rest should be mixins

## Handling forms with class-based views

# Class-Based Views: Subclassing Generic Views

From [https://docs.djangoproject.com/en/2.2/topics/class-based-views/#subclassing-generic-views](https://docs.djangoproject.com/en/2.2/topics/class-based-views/#subclassing-generic-views)

* Consider a view that displays one template, `about.html`. There's a generic view, `TemplateView` that will do this, so we subclass it and override the template name:

    ```Python
    # some_app/views.py
    from django.views.generic import TemplateView

    class AboutView(TemplateView):
        template_name = "about.html"
    ```

* Add it to the URLconf, using `as_view()`:

    ```Python
    # urls.py
    from django.urls import path
    from some_app.views import AboutView

    urlpatterns = [
        path('about/', AboutView.as_view()),
    ]
    ```

## Supporting other HTTP methods

* Someone wants to use the views as an API, we want to have a list view so a client can see what is new since last update.
* Map the URL to book list view:

    ```Python
    from django.urls import path
    from books.views import BookListView

    urlpatterns = [
        path('books/', BookListView.as_view()),
    ]
    ```

* Create the view:

    ```Python
    from django.http import HttpResponse
    from django.views.generic import ListView
    from books.models import Book

    class BookListView(ListView):
        model = Book

        def head(self, *args, **kwargs):
            last_book = self.get_queryset().latest('publication_date')
            response = HttpResponse('')
            # RFC 1123 date format
            response['Last-Modified'] = last_book.publication_date.strftime('%a, %d %b %Y %H:%M:%S GMT')
            return response
    ```

* Hitting the view with a GET gives you an object list via the `book_list.html` template and the get method in `ListView`
* Hitting with with HEAD sends an empty body with a `Last-Modified` header

# Built-in Class-based Views API
