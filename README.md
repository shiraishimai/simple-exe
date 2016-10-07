# simple-exe

Simple, easy command executor. No settings needed.
### Installation
```sh
$ npm install simple-exe
```

### Usage
Command String format:
```sh
var exe = require("simple-exe");
exe("echo Hello World!", err => {
    if (err) {
        console.log("Error with code:", err);
        throw err;
    }
    // ...
});
```
Simple-exe uses space to separate arguments, which means, if your argument contains spaces, you cannot just execute it in String format.

Command Array format:
```sh
exe(["echo", "Hello World!"], err => {
    // ...
});
```
