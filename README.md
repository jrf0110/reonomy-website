# Reonomy Website

Modularized as much as possible. Mostly dependency free.

## Running

You need the grunt-cli installed globally:

```
npm install -g grunt-cli
```

Then to start up a server and watch for changes, run:

```
grunt
```

To build a distributable version, run:

```
grunt build
```

## Deviations from the design

There were a number of places where I made a design choice that I thought Reonomy would favor over what was provided in the design. Here's a list of those choices:

* I added a maximum width to site content
* Marketing points line-height increase by a few pixels