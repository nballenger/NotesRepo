# Django REST Framework

## Serialization

### Basic Serialization Case

Model we're working on serializing:

```Python
from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted((item, item) for item in get_all_styles())


class Snippet(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	title = models.CharField(max_length=100, blank=True, default='')
	code = models.TextField()
	linenos = models.BooleanField(default=False)
	language = models.CharField(choices=LANGUAGE_CHOICES,
									  default='python',
									  max_length=100)
	style = models.CharField(choices=STYLE_CHOICES,
								  default='friendly',
								  max_length=100)
								  
	class Meta:
		ordering = ('created',)
```

Declaring a serializer class in ``appname/serializers.py``:

```Python
from django.forms import widgets
from rest_framework import serializers
from snippets.models import Snippet, LANGUAGE_CHOICES, STYLE_CHOICES


class SnippetSerializer(serializers.Serializer):
	pk = serializers.Field()	# `Field` is untyped, read-only field
	title = serializers.CharField(required=False, max_length=100)
	code = serializers.CharField(widget=widgets.Textarea,
									   max_length=100000)
	linenos = serializers.BooleanField(required=False)
	language = serializers.ChoiceField(choices=LANGUAGE_CHOICES,
											  default='python')
	style = serializers.ChoiceField(choices=STYLE_CHOICES,
										  default='friendly')
										  
	def restore_object(self, attrs, instance=None):
		"""
		Create or update a new snippet instance, given a dictionary
		of deserialized field values.
		
		Note that if we don't define this method, then deserializing
		data will simply return a dictionary of items.
		"""
		
		if instance:
			# Update existing instance
			instance.title = attrs.get('title', instance.title)
			instance.code = attrs.get('code', instance.code)
			instance.linenos = attrs.get('linenos', instance.linenos)
			instance.language = attrs.get('language', instance.language)
			instance.style = attrs.get('style', instance.style)
			return instance
			
		# Create new instance
		return Snippet(**attrs)
```

Using the declared classes:

```Python
from snippets.models import Snippet
from snippets.serializers import SnippetSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

snippet = Snippet(code='foo = "bar"\n')
snippet.save()

snippet = Snippet(code='print "hello, world"\n')
snippet.save()

# Serialize an instance of Snippet
serializer = SnippetSerializer(snippet)

# Render data as json string
content = JSONRenderer().render(serializer.data)

# Deserialize by parsing stream into Python native datatypes
# and restoring native datatypes into an object instance
from rest_framework.compat import BytesIO

stream = BytesIO(content)
data = JSONParser().parse(stream)
serializer = SnippetSerializer(data=data)
serializer.is_valid() 	# should return True
serializer.object		# instance of Snippet

# Serializing a queryset by adding many=True flag:
serializer = SnippetSerializer(Snippet.objects.all(), many=True)
```

### Using ModelSerializers

REST framework has both ``Serializer`` and ``ModelSerializer`` classes, which are like Django's ``Form`` and ``ModelForm`` classes.

Refactoring ``SnippetSerializer`` to use ``ModelSerializer`` to avoid duplicating code declared in the model:

```Python
class SnippetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Snippet
		fields = ('id', 'title', 'code', 'linenos', 'language', 'style')
```

### Writing Regular Django views using a Serializer

Create a subclass of HttpResponse to render data into json:

```Python
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from snippets.models import Snippet
from snippets.serializers import SnippetSerializer

class JSONResponse(HttpResponse):
    """ An HttpResponse that renders content as JSON """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)
```

Root of the API is a view that lists all existing snippets, lets you create new one:

```Python
@csrf_exempt
def snippet_list(request):
    """ List all code snippets or create new snippet. """
    
    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SnippetSerializer(data=data)
        if serializer.is_valid()
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)
```

## Requests and Responses

From [http://www.django-rest-framework.org/tutorial/2-requests-and-responses](http://www.django-rest-framework.org/tutorial/2-requests-and-responses)

### Request Objects

``Request`` extends ``HttpRequest`` with more flexible request parsing. Core of it is ``request.DATA``, which handles arbitrary data and works for ``POST``, ``PUT``, and ``PATCH``.

### Response Objects

``Response`` is a type of ``TemplateResponse`` that takes unrendered content, figures out what content type to return to the client.

```
return Response(data) # Renders to content type requested by client
```

### Status Codes

The ``status`` module gives you explicit response code identifiers, like ``HTTP_400_BAD_REQUEST``

### Wrapping API Views

Two wrappers for writing API views:

1. ``@api_view`` decorator for function based views
1. ``APIView`` class for class based views

### Pulling it all together

Refactoring views to use the above:

```Python
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from snippets.models import Snippet
from snippets.serializers import SnippetSerializer


@api_view(['GET', 'POST'])
def snippet_list(request, format=None):
    """ List all snippets, or create a new snippet. """

    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SnippetSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def snippet_detail(request, pk, format=None):
    """ Retrieve, update, or delete a snippet instance. """

    try:
        snippet = Snippet.objects.get(pk=pk)
    except Snippet.DoesNotExist:
        return Response(serializer.data)

    if request.method == 'GET':
        serializer = SnippetSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SnippetSerializer(snippet, data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

Amend ``urls.py`` to deal with format suffix patterns:

```Python
from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = patterns('snippets.views',
    url(r'^snippets/$', 'snippet_list'),
    url(r'^snippets/(?P<pk>[0-9]+)$', 'snippet_detail'),
)

urlpatterns = format_suffix_patterns(urlpatterns)
```

## Class Based Views
