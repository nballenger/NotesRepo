# Notes on Mastering Concurrency in Go

By Nathan Kozyra, Packt Publishing, 2014

ISBN: 978-1-78398-348-3

## Executive Summary

## Chapter Notes

### Chapter 1: An Introduction to Concurrency in Go

#### Introducing goroutines

* Hello world that does some concurrent work:

```Go
package main

import (
    "fmt"
    "time"
)

type Job struct {
    i int
    max int
    text string
}

func outputText(j *Job) {
    for j.i < j.max {
        time.Sleep(1 * time.Millisecond)
        fmt.Println(j.text)
        j.i++
    }
}

func main() {
    hello := new(Job)
    world := new(Job)

    hello.text = "hello"
    hello.i = 0
    hello.max = 3
    
    world.text="world"
    world.i = 0
    world.max = 5

    go outputText(hello)
    outputText(world)
}
```
