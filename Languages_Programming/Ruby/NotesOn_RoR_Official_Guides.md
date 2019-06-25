# Notes on the official guides at rubyonrails.org

Should use the 4.2 docs: [https://guides.rubyonrails.org/v4.2/](https://guides.rubyonrails.org/v4.2/)

## Getting Started

From [https://guides.rubyonrails.org/v4.2/getting_started.html](https://guides.rubyonrails.org/v4.2/getting_started.html)

* Rails philosophy, two major guiding principles:
    * don't repeat yourself
    * convention over configuration

### 3. Creating a new rails project

* 3.1 Installing Rails
    * Make sure you have ruby and sqlite3
    * Install rails with `gem install rails`
* 3.2 Creating the Blog application
    * In the target directory, run `rails new blog`

### 4. Hello, Rails!

* 4.1 Starting up the web server
    * Run `bin/rails server`
    * You need a JS runtime or you'll see `execjs` errors during asset compilation
    * Hit `http://localhost:3000/` to see the welcome page
* 4.2 Say "Hello", Rails
    * Need to create a controller and a view
    * Run `bin/rails generate controller welcome index` to create a welcome controller with an index action
    * Hit `http://localhost:3000/welcome/index.html`
* 4.3 Setting the application home page
    * To set the root controller, edit the `root` line in `config/routes.rb`:

        ```Ruby
        root 'welcome#index'
        ```

### 5. Getting Up and Running

* Going to create a 'resource'
* A resource is a 'collection of similar objects, with CRUD actions
* Rails provides the `resources` method that declares a standard REST resource
* Add an `article` resource to `config/routes.rb`:

    ```Ruby
    Rails.application.routes.draw do 
        resources :articles

        root 'welcome#index'
    end
    ```

* Running `bin/rake routes` will show the defined routes
* 5.1 Laying down the ground work
    * Requests can be made to `/articles/new` given the resource created
    * However it gives a routing error, because no controller is defined to serve the request
    * Create an articles controller: `bin/rails generate controller articles`
    * Define a `new` action inside the `ArticlesController` in `app/controllers/articles_controller.rb`:

        ```Ruby
        class ArticlesController < ApplicationController
            def new
            end
        end
        ```

    * The route and controller work, but there's no template
    * Simplest template would be a blank file at `app/views/articles/new.html.erb`
    * The extensions of the filename are important. The first extension is the format, html, and the second is the handler that will be used to interpret it. Format can be `html`, handler must be `erb`, `builder`, or `coffee`
* 5.2 The First Form
    * File contents to create a form:

        ```ERB
        <h1>New Article</h1>

        <%= form_for :article, url: articles_path do |f| %>
          <p>
            <%= f.label :title %><br>
            <%= f.text_field :title %>
          </p>

          <p>
            <%= f.label :text %><br>
            <%= f.text_area :text %>
          </p>

          <p>
            <%= f.submit %>
          </p>
        <% end %>
        ```

    * The `form_for` call takes an identifying object argument
    * Inside the method block, the `FormBuilder` object is represented by `f`
    * To have the form action pass to a different url (by default it self-submits), we use the `url` argument to `form_for`, which uses the `articles_path` helper that tells Rails to point the form to the URI pattern associated with the `articles` prefix.
    * By default the form will send a POST to that route, which is associated with `ArticlesController#create`
* 5.3 Creating articles
    * Define that action in `app/controllers/articles_controller.rb`:

        ```Ruby
        class ArticlesController < ApplicationController
          def new
          end

          def create
            render plain: params[:article].inspect
          end
        end
        ```

    * That `render` method is taking a hash with a key of `plain` and a value of `params[:article].inspect`
    * The `params` method returns an `ActiveSupport::HashWithIndifferentAccess` object, that lets you access hash keys.
* 5.4 Creating the Article model
