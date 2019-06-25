# Notes on the Ruby Ecosystem

## "The Ruby Ecosystem for New Rubyists"

From [https://www.sitepoint.com/ruby-ecosystem-new-rubyists/](https://www.sitepoint.com/ruby-ecosystem-new-rubyists/)

Nov. 06, 2014

### Version Management

* Most people use a version manager. RVM, rbenv, etc.
* This person uses RVM, gives some example usage

    ```bash
    curl -sSL https://get.rvm.io | bash
    echo "source $HOME/.rvm/scripts/rvm" >> ~/.bash_profile
    source ~/.bash_profile
    # this should output "rvm is a function"
    type rvm | head -n 1
    rvm install 2.0.0
    rvm use 2.0.0
    rvm gemset create experimental
    rvm gemset use experimental
    ```

### Crafting Gems

* RubyGems is a packaging tool, provides `gem` cli util
* It's a package manager for Ruby libs/programs
* Usage: `gem install some_gem`
* Layout for a gem project:
    * `spec/`
        * `gem_name_spec.rb`
        * `spec_helper.rb`
    * `bin/`
        * `gem_name`
    * `lib/`
        * `gem_name.rb`
        * `gem_name/`
            * `source_file1.rb`
            * `source_file2.rb`
            * `...`
            * `version.rb`
    * `Gemfile`
    * `gem_name.gemspec`
    * `README.md`
    * `LICENSE`
    * `Rakefile`
* You can generate a gem template with `bundle gem gem_name`
* If bundler isn't installed with your Ruby, use `gem install bundler`
* There are (or were at time of writing) other tools for this

### The Load Path

* Ruby has a load path.
* It does not automatically include the source directory of a file in the load ath, so if file1.rb requires file2.rb from the same root, it won't find it unless that directory is included in the load path
* Ways to do that:
    * `ruby -I /path/to/dir file1.rb`
    * Requiring the direct path rather than the file name alone, like `require './file2'` rather than `require 'file2`
* When testing gems in development, you can add your source directories to the global `$LOAD_PATH` Ruby variable:

    ```Ruby
    # source of file1.rb
    $LOAD_PATH.unshift(".")
    require "file2"
    ```

* Typical usage uses `File::expand_path` to convert a relative path to an absolute one:

    ```Ruby
    # spec/spec_helper.rb
    lib = File.expand_path('../../lib', __FILE__)
    $LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

    require 'gem_name'   # finds it if it's in lib
    ```

* `$LOAD_PATH` is a simple array
* Note that `'../../lib` is one level up, not two, because `__FILE__` in that call specifies the directory to start in. Otherwise the CWD where hte ruby was executed is used.
* `$:` is an alias for `$LOAD_PATH`, because of course it fucking is.
* Any supporting gem code should go in a folder of the same name as the gem:

    ```
    lib/
        gem_name.rb
        gem_name/
            some_file.rb
    ```

* Source of `lib/gem_name.rb`:

    ```Ruby
    require 'gem_name/some_file'
    ```

* When a gem is installed, the contents of `lib` directory are placed in a directory that is already in Ruby's load path
* The load path shouldn't be modified in the code, and the gem name should be unique

### gemspec

* The `gemspec` file is where a gem is actually defined. It must exist in order to build a gem.
* Contents of a `gemspec` file:

    ```Ruby
    # gem_name.gemspec
    lib = File.expand_path("../lib", __FILE__)
    $LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
    require 'gem_name/version'

    Gem::Specification.new do |s|
        s.platform      = Gem::Platform::RUBY
        s.name          = 'gem_name'
        s.version       = GemName::VERSION
        s.authors       = ['Name']
        s.email         = ['email@email.com']
        s.homepage      = 'https://example.com'
        s.summary       = 'summary'
        s.description   = 'description'
        s.required_ruby_version = '>= 1.9.3'
        s.require_path  = 'lib'
        s.files         = Dir[LICENSE, README.md, 'lib/**/*']
        s.executables   = ['gem_name']

        s.add_dependency('sqlite3')
        s.add_development_dependency("rspec", ["~> 2.0"])
        s.add_development_dependency("simplecov")
    end
    ```

### Gemfile

* List of dependencies, versions, and sources
* Dependency line: `gem gem_name, version_constraint`
* Example file:

    ```Ruby
    source 'https://rubygems.org'

    gem 'nokogiri', '~> 1.4.2'

    group :development do
        gem 'sqlite3'
    end

    group :test do
        gem 'rspec'
        gem 'cucumber'
    end

    group :production do
        gem 'pg'
    end

    gemspec
    ```

* The `~>` operator increases the last digit until it rolls over, so `~> 1.4.2` is equivalent to `'>=1.4.2', '<1.5.0'`
* The last line, `gemspec`, tells bundler to install the dependencies listed in the gemspec file. Not required, particularly if all dependencies are in the Gemfile
* To sync your env to a gem's dependencies, run `bundle install` in the directoyr of the Gemfile
* Exclude groups via `bundle install --without production`
* Bundler creates `Gemfile.lock` when calculating dependencies
* If the project is a gem, do not put the lockfile under version control
* If the project is an application, DO version it

### Rakefile

* `rake` is a Ruby equivalent to `make`
* Mostly Rakefiles exist for convenience, stuff like `rake test`
* Example Rakefile:

    ```Ruby
    lib = File.expand_path("../lib", __FILE__)
    $LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
    require "gem_name/version"

    task :test do
        system "rpsec"
    end

    task :build do
        system "gem build gem_name.gemspec"
    end

    task :release => :build do
        system "gem push gem_name-#{GemName::VERSION}"
    end
    ```

### Building Gems

* `gem build` creates a `.gem` file that can be installed locall or pushed to a repository
* Filename includes the version set in the gemspec
* RubyGems is in the standard library (though it wasn't originally)

### Bundle Exec

* Prepending `bundle exec` to your commands (like `rake`) ensures the command is executed using the versions of the gems specified in the Gemfile.
* RVM makes gemsets with rubygems-bundler to avoid that problem,

### Ruby Implementations

* Reference implementation of Ruby has a GIL, so Ruby threads can run concurrently but not in parallel
* MRI is the reference implementation, there are others, some without a GIL

### Documentation

* When a gem is installed, you will often see a notification about `rdoc` and `ri` documentation being installed.
* `RDoc` is an embedded doc generator
* `ri` is like `man` for reading docs in the terminal
* If you use a version manager, you may have to manually generate docs, as with `rvm docs generate`
* To install a gem with no documentation, use `gem install gem_name --no-rdoc --no-ri`

### Pry

* Pry is an alternative to IRB, lets you see the original C source for methods

### Testing

* Multiple test frameworks: Test::Unit, RSpec, Minitest, Cucumber
* Typically tests go in `/test` or `/spec` at the project root
* RSpec has a test runner, `rspec`, that checks all specs in `spec/*_spec.rb`
* Directory structure:
    * `spec/`
        * `spec_helper.rb`
        * `gem_or_app_name/`
            * `models/`
                * `some_model_spec.rb`
            * `controllers/`
                * `some_controller_spec.rb`
* Example spec file:

    ```Ruby
    require "spec_helper"

    class Foo
        def hello
            "goodbye"
        end
    end

    describe Foo do
        before(:each) do
            @foo = Foo.new
        end

        it "says hello" do
            expect(@foo.hello).to eq "hello"
        end
    end
    ```

* SimpleCov is a popular code coverage tool that generates a coverage report
* You call it in the `spec_helper.rb` file:

    ```Ruby
    # spec/spec_helper.rb
    require "simplecov"

    SimpleCov.start
    ```

* `rspec` does not execute `spec/spec_helper.rb` automatically, each test file must include a `require 'spec_helper'` line at the top

# RoR - Architecture Review for Beginners

From [https://www.techcareerbooster.com/blog/ruby-on-rails-architecture-overview-for-beginners](https://www.techcareerbooster.com/blog/ruby-on-rails-architecture-overview-for-beginners)

## Parts of RoR:

* Models: representation of domain objects, interface to persistence layer
* Rails Server
* Routes
    * Configured in `config/routes.rb`
    * Every route needs to specify a controller and action of the controller
* Controllers and Actions
    * Controllers are Ruby classes
    * Actions are the public methods of those classes

# Quick Study of the Rails Directory Structure

From [https://www.sitepoint.com/a-quick-study-of-the-rails-directory-structure/](https://www.sitepoint.com/a-quick-study-of-the-rails-directory-structure/)

Typical structure, as prepped by `rails new`:

```
app/                                    # core app dir, MVC logic here
    assets/                             # static files for app front end
        images/                         # available via `image_tag("filename.png")`
        javascripts/                    # convention, 1:1 mapping of JS files to controllers
            application.js              # manifest for entire app's JS requirements
        stylesheets/                    # same naming convention, 1:1 w controllers
            application.css             # manifest for app stylesheets
    controllers/                        # all controller files, xxx_controller.rb
        application_controller.rb       # main controller all others inherit from
        concerns/                       # modules used across controllers
    helpers/                            # helper functions for views
        application_helper.rb           # root helper, methods here are available to all helpers/views
    mailers/                            # mail specific functions for the app
    models/                             # all model files, which are all ORMs
        concerns/                       # methods used across model files
    views/                              # view erb files, one per controller action by convention
        layouts/                        # layout for all view files, which they inherit
            application.html.erb        # default, layout for actions in ApplicationController
bin/                                    # binstubs for the Rails app (wrappers for gem executables)
    bundle/                             # all binstubs can be used in place of `bundle exec cmd`
    rails/                              # execute by calling directly, `bin/executable_name`
    rake/
    setup/
    spring/
config/                                 # All app config
    application.rb                      # main app config, for all environments
    boot.rb                             # verifies Gemfile present, sets BUNDLE_GEMFILE, reqs 'bundler/setup'
    database.yml                        # db config for the app, split by env
    environment.rb                      # requires 'application.rb' to init the Rails app
    environments/                       # env specific config files, by name
        development.rb
        production.rb
        test.rb
    initializers/                       # files to run during Rails init, all .rb files autorun in init
        assets.rb                       # config for the asset pipeline
        backtrace_silencers.rb          # filters to refine/silence stacktraces
        cookies_serializer.rb           # specs for the app's cookie serialization
        filter_parameter_logging.rb     # params for sensitive info to filter out of logs
        inflections.rb                  # singularizations / pluralizations
        mime_types.rb                   # MIME configs
        session_store.rb                # underlying session store for the app
        wrap_parameters.rb              # settings for wrapping parameters
    locales/                            # list of YAML files for each localization
        en.yml
    routes.rb                           # routes for the entire app
    secrets.yml                         # place to store app secrets
config.ru
db/                                     # all database related files: config, schema, migrations, seeds
    seeds.rb                            # prefills the database with required records
Gemfile                                 # gem dependency declarations, required for Rails
Gemfile.lock                            # gem dependency tree generated by bundler
lib/                                    # app specific libraries
    assets/                             # library assets that are not app specific
    tasks/                              # Rake tasks and other tasks
log/                                    # all log files, split by env
public/                                 # common web app files, available at host/filename.ext
    404.html
    422.html
    500.html
    favicon.ico
    robots.txt
Rakefile                                # requires application.rb, involes Rails.application.load_tasks
README.rdoc
test/                                   # all test files for the app, split by concern
    controllers/
    fixtures/
    helpers/
    integration/
    mailers/
    models/
    test_helper.rb
tmp/                                    # app temp dir, for caching mostly
    cache/
        assets/
vendor/                                 # vendor files, mostly js and css
assets/
    javascripts/
    stylesheets/
```

# Rails Routing from the Outside In

From [https://guides.rubyonrails.org/routing.html](https://guides.rubyonrails.org/routing.html)

* The router recognizes URLs and dispatches them to a controller action or a Rack application
* Can generate paths and URLs for use in views
* Connecting URLs to code
    * Example request: `GET /patients/17`
    * Route entry: `get '/patients/:id', to: 'patients#show'`
    * Which sends the request to the `show` action of the `patients` controller
* Generating Paths and URLs from code
    * Modified route: `get '/patients/:id', to: 'patients#show', as: 'patient'`
    * Controller code: `@patient = Patient.find(params[:id])`
    * View code: `<%= link_to 'Patient Record', patient_path(@patient) %>`
    * Generated route for initial request: `/patients/17`
* Configuring the Rails router
    * Routes live in `/config/routes.rb`, look like:

        ```Ruby
        Rails.application.routes.draw do
            resources :brands, only: [:index, :show] do
                resources :products, only: [:index, :show]
            end

            resource :basket, only: [:show, :update, :destroy]
            
            resolve("Basket") { route_for(:basket) }
        end
        ```

* Resource Routing: the Rails default
    * Lets you declare all common routes for a given resourceful controller
    * Resources on the Web
        * Resource routes map HTTP verbs to actions in a controller
        * Example request: `DELETE /photos/17`
        * Route: `resources :photos`
        * Dispatches request to `destroy` action on `photos` controller
    * CRUD, Verbs, and Actions
