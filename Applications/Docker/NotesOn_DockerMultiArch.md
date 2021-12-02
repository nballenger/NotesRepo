# Notes on Docker Multi-Architecture

# Docker Blog, "Multi-arch build and images, the simple way", 2020-04-30

From https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/

* Each Docker image is represented by a manifest, which is a JSON file with all the info about the image, including references to each layer, hash of the image, size, platform it should work on, etc.
* Manifests can be referenced by a tag
* Example command:

    ```shell
    docker manifest inspect --verbose rustlang/rust:nightly-slim
    ```

* Question: how to put multiple images, each supporting a different architecture, behind the same tag? Need to make the manifest file contain a list of manifests, so the engine can pick a matching one at runtime.
* That's called a 'manifest list'
* Two ways to build a multiarch image
    * using `docker manifest`
    * using `docker buildx`
* Example `Dockerfile` they're using

    ```
    ARG ARCH=
    FROM ${ARCH}debian:buster-slim

    RUN apt-get update \
     && apt-get install -y curl \
     && rm -rf /var/lib/apt/lists/*

    ENTRYPOINT ["curl"]
    ```

* Building the hard way, with docker manifest
    * oldest tool by Docker that can build multiarch images
    * first have to build and push images for each arch to Docker Hub
    * then combine all the images in a manifest list referenced by a tag, and reference them in a manifest list using the `docker manifest` command:

        ```
        # AMD64
        $ docker build -t your-username/multiarch-example:manifest-amd64 --build-arg ARCH=amd64/ .
        $ docker push your-username/multiarch-example:manifest-amd64

        # ARM32V7
        $ docker build -t your-username/multiarch-example:manifest-arm32v7 --build-arg ARCH=arm32v7/ .
        $ docker push your-username/multiarch-example:manifest-arm32v7

        # ARM64V8
        $ docker build -t your-username/multiarch-example:manifest-arm64v8 --build-arg ARCH=arm64v8/ .
        $ docker push your-username/multiarch-example:manifest-arm64v8

        $ docker manifest create \
        > your-username/multiarch-example:manifest-latest \
        > --amend your-username/multiarch-example:manifest-amd64 \
        > --amend your-username/multiarch-example:manifest-arm32v7 \
        > --amend your-username/multiarch-example:manifest-arm64v8

        $ docker manifest push your-username/multiarch-example:manifest-latest
        ```

* The simple way with `docker buildx`, which lets you do it in one command

    ```
    $ docker buildx build \
    > --push \
    > --platform linux/arm/v7,linux/arm64/v8,linux/amd64 \
    > --tag your-username/multiarch-example:buildx-latest .
    ```

* Targeting GitHub Actions to build a multi-arch image and push to DockerHub
* Example `.github/workflows/image.yml`

    ```
    name: build our image

    on:
      push:
        branches: main

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: checkout code
            uses: actions/checkout@v2
          - name: install buildx
            uses: crazy-max/ghaction-docker-buildx@v1
            with:
              version: latest
          - name: build the image
          run: |
            docker buildx build \
              --tag your-username/multiarch-example:latest \
              --platform linux/arm/v7,linux/arm64/v8,linux/amd64 .
    ```

* To push you have to get an access token on docker hub, in security settings, then update the GH action config file and add a login step before the build, where you do

    ```
    - name: login to docker hub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
    ```

# Docker Buildx Documentation

From https://docs.docker.com/buildx/working-with-buildx/

## Overview

* Buildx is a CLI plubin that extends `docker` command with buildkit support

## Install

* Included in Docker Desktop
* Can install the latest `buildx` binary from the releases page on GitHub
* that's at https://github.com/docker/buildx/releases/latest
* Put that in `~/.docker/cli-plugins` with name `docker-buildx`
* then do `chmod a+x ~/.docker/cli-plugins/docker-buildx`
* Using buildx from inside a Dockerfile through the `docker/buildx-bin` image

    ```
    FROM docker
    COPY --from=docker/buildx-bin /buildx /usr/libexec/docker/cli-plugins/docker-buildx
    RUN docker buildx version
    ```

## Set buildx as the default builder

* Running `docker buildx install` sets up the docker builder command as an alias to `docker buildx`, which lets `docker build` use the current buildx builder
* If you want to remove that alias, do `docker buildx uninstall`

## Build with buildx

* To start a new build, run `docker buildx build .`
* Uses the buildkit engine, so you don't need `DOCKER_BUILDKIT=1`
* Supports features available for `docker build` like output config, inline build caching, specifying target platform ,etc.
* Also supports new features like building manifest lists, distributed caching, exporting build results to OCI image tarballs
* You can run Buildx in different configurations exposed through a driver concept(?)
* Current there's a `docker` driver that uses the BuildKit library bundled into the Docker daemon binary, and a `docker-container` driver that automatically launches BuildKit inside a Docker container
* Mostly similar, but the `docker` driver doesn't support everything because the version in the docker daemon uses a different storage component.
* All images built with the `docker` driver are automatically added to the output of `docker images` by default, whereas when using other drivers the method for outputting an image has to be selected with `--output`

## Work with builder instances

* By default Buildx uses the `docker` driver if it's supported
* Buildx lets you create new instances of isolated builders, which you can use to get a scoped environment for your CI builds that doesn't change the state of the shared daemon, or for isolating builds for different projects
* You can create a new instance for a set of remote nodes, forming a build farm, and quickly switch between them
* Create new instances with `docker buildx create`, which creates a new builder instance with a single node, based on your current configuration
* To use a remote node, specify `DOCKER_HOST` or the remote context name while creating the builder
* After creating a builder, manage its lifecycle using
    * `docker buildx inspect`
    * `docker buildx stop`
    * `docker buildx rm`
    * `docker buildx ls`
* After creating a new builder you can append new nodes to it
* To switch between builders, use `docker buildx use <name>`
* You can also use `docker context` to provide names for remote Docker API endpoints
* Buildx integrates with `docker context` to ensure all the contexts automatically get a default builder instance
* You can set the context name as the target when you create a new builder instance or when you add a node

## Build multi-platform images

* When you invoke a build, you can set `--platform` to specify the target for the build output
* If the current builder instance is backed by the `docker-container` driver, you can specify multiple platforms together, in which case it builds a manifest list with images for all specified architectures
* If you use that image in `docker run` or `docker service`, Docker picks the right image based on the node's platform
* Three strategies for building multi-platform images:
    1. Use the QEMU emulation support in the kernel
    1. Build on multiple native nodes using the same builder instance
    1. Using a stage in Dockerfile to cross-compile to different architectures
* QEMU is the easiest way to get started if your node already supports it (Docker Desktop does)
* When Buildkit needs to run a binary for a different architecture, it automatically loads it through a binary registered in the `binfmt_misc` handler
* For QEMU binaries registered with `binfmt_misc` on the host OS to work transparently inside containers, they must be registered with the `fix_binary` flag. That requires a kernel gte 4.8, and `binfmt-support>=2.1.7`
* You can check for proper registration by checking if `F` is among the flags in `/proc/sys/fs/binfmt_misc/qemu-*`

# README at the buildx GitHub

From https://github.com/docker/buildx


