The Express Micro API Generator
===============================


Starting a project from scratch with Express is easy -- there are already countless generators that do so. However, these projects are entirely based around building websites. In an age of microservices and small APIs, the standard structure of an Express app is cumbersome and does not help with the separation of concerns we expect.

The Express Micro API Generator is here to help you with scaffolding all the boring details of an API. Logging? Got you covered, `bunyan` and its companion middleware are already set up from the start. Storage? Well, we don't enforce database designs, but repositories come with `Rx` and events bundled. Authentication? We put `jwt`, but you can swap it for `Passport.JS` or `passwordless`!

What's included
---------------

The following is a short list of all the goodies we install:
- bluebird
- bunyan
- cors
- jsonwebtoken
- lodash
- request
- rx
- webworker-threads

Don't like something? Send a pull request with an option to make it optional! Most of these libs are only loosely coupled with the app, so it's not difficult. ;)

Commands
--------

We assume you already set up your local repo and project folder. You know, the place where you will put your `README.md`, `.gitignore` and `LICENSE.md` (remember your license!). If you haven't, just `mkdir my-awesome-project` and `cd` inside it.

    yo express-micro

Will create all the folders, files and stuff you need for the project to work. It will ask you for a project name! Usually it's the same as the parent folder. Be creative!

    yo express-micro:controller myController

Will create a new `controller`. It will _not_ bind it to a route or to the app just yet, working on that! (we're still far from 1.0!)

Other commands are:

    yo express-micro:middleware middleware
    yo express-micro:repository myRepo
    yo express-micro:service myService
