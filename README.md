# protractor-istanbul-plugin-example
A basic example that uses the [Angular Seed project](https://github.com/angular/angular-seed)

## usage

### pre-requisites
You need to have a NodeJS and NPM installed. Most version >= 0.12 should be okay, though I can't guarantee that protactor won't freak out (in which case, you're on your own).

You'll also need to be running this on Windows/Mac or Linux with some sort of display (Xvfb works too) exported correctly to ```$DISPLAY```.

Finally, the protractor configuration for this is set to use Firefox. Change that as desired.

### running
- git clone into a folder of your choice
- in that folder, run ```npm install```. If this fails, there is not much I can do for you, because your NodeJS setup probably just doesn't like this particular package.json layout.
- in that folder, run ```npm test```. This will kick off a chain of gulp tasks that will ultimately produce a text based coverage report, as well as an HTML report under ```./lcov-report/index.html```

### other notes
The main features of this particular example are the ```package.json``` setup, the ```e2e-tests/protractor.conf.js```, and the ```gulpfile.js``` files.
- ```package.json``` - This should have all of the correct versions for protractor-istanbul-plugin to work with istanbul and protractor.
- ```e2e-tests/protractor.conf.js``` - This includes the istanbul plugin configuration, as well as some other basic configuration for jasmine and selenium. This is also where you can change what browser gets launched instead of Firefox.
- ```e2e-tests/scenarios.js``` - I've commented out a test in here to force the coverage to be less than 100%. If you uncomment it, you can demonstrate that the coverage amount is updating correctly.
- ```gulpfile.js``` - This includes the build chain. I used gulp here b/c I'm comfortable with it. Additionally, as the protractor plugin itself is simply meant to dump out coverage files, it tooks some effort/kludging to get it to act like the command line version of istanbul. If desired, a simple shell script replacement would work as long as it does the following:
 - Installs the istanbul tools - ```npm install -g istanbul@0.3.22```
 - Copies out static files to a temporary hosting directory (tmp, in this case)
 - Instruments any JavaScript in the app out to the tmp folder (except for bower_components) - ```istanbul instrument -o tmp -x "**/bower_modules/**" app```
 - Somehow stands up a web server around the tmp folder
 - Runs the protractor tests against that web server
 - Creates a coverage report based on the files in the coverage folder - ```istanbul report --include "coverage/*.json" lcov text text-summary```
 - Cleans up the tmp and coverage directories between test runs

### TODO
I'll try and find time eventually to just pack this into a docker image that can be run. That will help take care of all the wild NodeJS issues and dependencies, hopefully. Otherwise, I badly need to get the actual plugin updated to work with newer Protractor versions.
