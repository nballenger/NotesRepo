# Notes on `nodemon`

From documentation: https://github.com/remy/nodemon#nodemon

* Originally for restarting crashed or hanging processes
* Now supports clean exit processes, so if yours exits but a file changes, it'll restart the process
* If you need to manually restart while it's running, you can type `rs` with a carriage return
* Has local and global config files named `nodemon.json`, or any file specified with `--config`
* Overrides: CLI args override local conf override global conf
* Config file can take any command line arg as JSON keys
* You can optionally put your config into package.json, under a `nodemonConfig` key
