# GoalGoat

This is a progressive web app for tracking habits or goals.

This application is based off of the Inrupt Solid UI example project: https://github.com/inrupt/solid-ui-react-example-project which is bound by the license found at the end of this README.

## Folder structure

Files in `./certificates` are verbatim from https://github.com/inrupt/solid-ui-react-example-project

Nearly all of the components used in this application are located in `./components`.

`./pages` contains the main pages necessary for the application to function. These closely resemble their countesrparts from the Inrupt Solid UI example project.

`./public` contains some public files necessary for this to function as a progressive web application (PWA).

`./util` contains the main data structures used within the application.

## Build

Install npm, NodeJS and yarn. Execute `yarn` in this directory. You may then execute `yarn dev` to run it locally at https://127.0.0.1:3000/. Please note that the HTTPS is required, and visiting it over HTTP will give you an error. 

Running this in `yarn dev` will break the manifest and service worker. Consider exporting it to a static website as explained by the instructions below.

## Export to static website

Install npx. Execute `npx next build`, and then `npx next export`. The finished static webpage will be outputted in the `./out` directory.


## Solid UI example project license

```
Copyright (c) 2020 Jack Lawson
Copyright 2020 Inrupt Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```