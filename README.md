# bill-calendar
Simple calendar for keeping track of bills

There are three things I'm looking to accomplish with this app:
1. To help me get comfortable with web components
2. To see just how far I can get with no dependencies (other than a browser and a http server)
3. To build a nice fast app for keeping track of my bills

I certainly could add in a bunch of tooling, and it would allow things like index.html to be much cleaner,
but the idea here is to build something using only the features the browser provides.

## Running the app
To run the app locally you need a http server and a web browser (preferably a very recent version of Firefox, Safari, or Chrome, or a fork of one of those).
If you have Python you could do

```cd www && python3 -m http.server```

or if you have Node.js maybe

```cd www && npx http-server```

Then open the app in your browser using the url of the server you set up; probably `localhost:8080`

## Running tests
The app has a (very) basic test framework that runs in-browser.
To run tests, first start your http server as described in [Running the app](#running-the-app).
Then, navigate to `<base URL>/test` (so probably `localhost:8080/test`)
