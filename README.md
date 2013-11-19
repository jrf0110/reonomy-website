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

* Navbar uses anchor padding to produce height, so when you hover, it highlights from top to bottom
* The navbar request a demo button was built with plain html+css - The font weight doesn't look quite as nice as the PSD
* I added a maximum width to site content
* Marketing points line-height increase by a few pixels