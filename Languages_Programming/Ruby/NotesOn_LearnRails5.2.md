# Notes on Learn Rails 5.2: Accelerated Web Development with Ruby on Rails

By Stefan Wintermeyer; Apress, April 2018; ISBN 9781484234891

# Chapter 1: Ruby Introduction

* Book uses Ruby 2.5

# Chapter 2: First Steps with Rails

I got an install working, but it took some doing. Steps I took:

1. Set up a Dockerfile to create a container to run Rails on:

    ```Docker
    FROM ubuntu:18.04

    WORKDIR /rvm_install

    ADD ./rvm_install.sh .

    RUN apt-get update \
     && apt-get install -y \
        software-properties-common \
        curl

    RUN ./rvm_install.sh

    RUN adduser rubytest --ingroup rvm --disabled-password --gecos ""

    #USER rubytest:rvm
    SHELL ["/bin/bash", "-c"]

    RUN source /etc/profile.d/rvm.sh \
     && rvm install ruby

    RUN source /etc/profile.d/rvm.sh \
     && gem install rails

    RUN apt-get install -y nodejs
    ```

1. Built the image, started a container with:

    ```bash
    docker run -it -p="3000:3000" --mount type=bind,source="$(pwd)"/localvol,target=/home/rubytest/localvol ruby_testbed /bin/bash
    ```

1. On the container, did the following:

    ```bash
    su rubytest
    source /etc/profile.d/rvm.sh
    cd ~/localvol/
    rails new testproject
    mkdir gems
    cd testproject
    # Edit the Gemfile to add `gem 'tzinfo-data'`
    bundle install --path=/home/rubytest/localvol/gems
    rails db:migrate
    rails server -b "0.0.0.0"
    ```


* Rails automatically creates some static files in `public`
* If you add `public/foo.html` you'll be able to access it at `:3000/foo`
* Pages not handled by the Rails framework (static assets) produce no log lines
* `erb` files are a mixture of HTML and Ruby code
* `erb` == 'embedded ruby'
* `erb` pages are rendered as views
* You need a controller to use a view
* You can generate a controller with `rails generate controller NAME`
* Doing so will create a bunch of assets:
