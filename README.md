# NodeSMA

### Steps to get the project running
1. install [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)
2. install `node.js` on your local machine
3. install [Angular-Cli](https://github.com/angular/angular-cli) with `npm install -g @angular/cli@latest`
4. run `npm install` from the command line

### Program entry points

The main entry point for the web app can be found under `WebApp/src/` most of the app files are under app. Lookup [Angular-Cli](https://github.com/angular/angular-cli) for more info on generating components and modules for Angular 2

The main entry point for the node.js/express backend is `bin/www` in the project root directory. Its setup so that anything in the /api url path will be captured by express

### Configurations

Ive set up development configurations and a production configuration

*"Dev-Serv"* and *"Dev-App"* must be run together

*"Development"* is a compound configuration and will run them together but can't be debugged with the debugger

__All Configurations will launch the server on localhost:3000__
