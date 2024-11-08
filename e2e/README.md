# End-to-end and interaction testing
E2E testing runs in a docker container. There is a shell script (`./scripts/end-to-end.sh`) that provides configuration to automate several Docker-related commands. 

Parameters:
-p : Configure the port on which Storybook will be served. Defaults to 9009 if no value is specified.
-c : Configure the name of the Docker container. Defaults to e2e if no value is specified.
-f : Specify the function(s) you'd like to run. You can add multiple -f parameters followed by function name, like `-f build_container -f run_container`
-t : This parameter lets you specify the Docker build target. This should be either `serve` or `test`.

Functions:
`build_container` : Builds a Docker container, where the build target is specified using a -t flag (the default target is `test`).
`run_container` : Runs the built Docker container.
`end_to_end` : Performs playwright test command inside the Docker container for end-to-end testing. Requires the container to be running.
`interaction` : Performs the interaction tests inside the Docker container against the storybook instance. Requires the container to be running.

If Docker is not installed on your machine, running the script will prompt you to install Docker. If no function(s) are defined using -f flag, it runs `end_to_end` and `interaction` function by default.

## Build targets
The `test` target is self-contained and meant to run mostly in the build pipeline. The `serve` target is most useful during local development. When the `serve` container is run, it will mount a volume from your local machine and start a dev server, so you get persistent storage without having to rebuild the image. 

## Getting Started

First, make sure the script is executable: 

```bash
# from the project root
chmod +x ./e2e/script/end-to-end.sh
```

Examples:

```bash
# builds the test container (also will run the tests)
./e2e/script/end-to-end.sh -f build_container -t test
```

```bash
# builds the serve container and start it
./e2e/script/end-to-end.sh -f build_container -t serve -f run_container
```

```bash
# Runs the default tasks `end_to_end` and `interaction`
./e2e/script/end-to-end.sh
```
