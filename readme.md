![PatternEx logo](./src/public/images/logo.png)

# PatternEx

## Developing

### Built With

Project build with React, Redux, React-Router, React-Intl etc.

### Prerequisites

To be able to run this project you'll have to have:

- Node.js > `6.0.0.`
- NPM
- Yarn



### Setting up DEVELOPMENT

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://robertpamfilebytex@bitbucket.org/patternex/ptrx-ui.git
```

If you develop in the new app (localhost:8090) run the following:
-----------------------
In first terminal:

```shell
#!shell
    ~ $ cd ptrx-ui/
    ptrx-ui/ $ npm install
    ptrx-ui/ $ npm run webpack
    ptrx-ui/ $ node app.js
```

In a second terminal

```shell
#!shell
    ~ $ cd ptrx-ui/ui
    ptrx-ui/ui $ yarn install
    ptrx-ui/ui $ yarn start:dev
```

Open browser at https://localhost:8843 and login than open http://localhost:8090.

If you develop in the current app (localhost:8443):
-----------------------
In first terminal

```shell
#!shell
    ~ $ cd ptrx-ui/
    ptrx-ui/ $ npm install
    ptrx-ui/ $ npm run webpack
    ptrx-ui/ $ node app.js
```

In a second terminal

```shell
#!shell
    ~ $ cd ptrx-ui/ui
    ptrx-ui/ui $ yarn install
    ptrx-ui/ui $ yarn build:dev
```

Open browser at https://localhost:8843.

** Important **

1. Remove node_modules if you have errors related to node_modules and run again npm install (in ptrx-ui/)
1. Be sure to diff server-config.json.example with your server-config.json

### Setting up PRODUCTION

```shell
#!shell
    ~ $ cd ptrx-ui/
    ptrx-ui/ $ npm install
    ptrx-ui/ $ npm run webpack
    ptrx-ui/ $ cd ui/
    ptrx-ui/ui $ yarn install
    ptrx-ui/ui $ yarn build:prod
```

### Other links:

1. [Tests](./.wiki/tests.md)
1. [Style Guide](./.wiki/styleguide.md)
1. [Configuration](./.wiki/configuration.md)
1. [Contributing](./.wiki/contributing.md)
