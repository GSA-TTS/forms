## Migrating from Docker Desktop to Podman

If you already have Docker Desktop installed and need to migrate to Podman, follow these steps:


### Step 1: Install Podman

First, you need to install Podman. If you're using Homebrew, you can install it with:

```bash
brew install podman
```

### Step 2: Initialize and Start Podman Machine

Initialize and start the Podman machine:

```bash
podman machine init
podman machine start
```

### Step 3: Uninstall Docker Desktop

1. Open Docker Desktop.
2. From the Docker menu, select the Troubleshoot icon.
3. Click Uninstall.
4. Confirm the uninstallation.

Alternatively, you can uninstall Docker Desktop from the CLI:

```bash
/Applications/Docker.app/Contents/MacOS/uninstall
```

After uninstalling Docker Desktop, you may want to remove residual files:

```bash
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
```

### Step 4: Emulate Docker CLI Using Podman

Follow the steps [here](https://podman-desktop.io/docs/migrating-from-docker/emulating-docker-cli-with-podman#linux--macos) to create a script to emulate Docker CLI using Podman. This allows you to use Docker commands transparently.

### Step 5: Configure Environment Variables

Set the necessary environment variables to ensure testcontainers works correctly with Podman. Add the following lines to your shell configuration file (~/.zshrc for Zsh or ~/.bashrc for Bash):

```bash
export DOCKER_HOST=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
```

### Step 6: Apply Changes

After adding the above lines to your shell configuration file, apply the changes by reloading your shell configuration:

For Zsh:
```bash
source ~/.zshrc
```

For Bash:
```bash
source ~/.bashrc
```

### Step 7: Verify Environment and Run Tests

Ensure the environment variables are set and run your tests:

```bash
echo $DOCKER_HOST
echo $TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE
echo $TESTCONTAINERS_RYUK_DISABLED

pnpm test
```

## Setting Up Podman for New Team Members

If you're new to the team and need to start with Podman, follow these steps:

### Step 1: Install Podman

Install Podman using Homebrew:

```bash
brew install podman
```

### Step 2: Initialize and Start Podman Machine

Initialize and start the Podman machine:

```bash
podman machine init
podman machine start
```

### Step 3: Emulate Docker CLI Using Podman

Follow the steps [here](https://podman-desktop.io/docs/migrating-from-docker/emulating-docker-cli-with-podman#linux--macos) to create a script to emulate Docker CLI using Podman. This allows you to use Docker commands transparently.

### Step 4: [Set Environment Variables](https://github.com/testcontainers/testcontainers-node/blob/08da47baeaa9a43f29aec3a9bb1ce67a3bc1849f/docs/supported-container-runtimes.md)

Set the necessary environment variables to ensure testcontainers works correctly with Podman. Add the following lines to your shell configuration file (~/.zshrc for Zsh or ~/.bashrc for Bash):

```bash
export DOCKER_HOST=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
```

### Step 5: Apply Changes

After adding the above lines to your shell configuration file, apply the changes by reloading your shell configuration:

For Zsh:
```bash
source ~/.zshrc
```

For Bash:
```bash
source ~/.bashrc
```

### Step 6: Verify Environment and Run Tests

Ensure the environment variables are set and run your tests:

```bash
echo $DOCKER_HOST
echo $TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE
echo $TESTCONTAINERS_RYUK_DISABLED

pnpm test
```

# Optional: Troubleshooting nvm, Node.js, and pnpm Issues

If you encounter issues with nvm, node, or pnpm, follow these steps:

## Issue: Commands Not Found

### Step 1: Edit Your Shell Configuration File

Open your shell configuration file in a text editor. For Zsh:

```bash
nano ~/.zshrc
```

Or for Bash:
```bash
nano ~/.bashrc
```

### Step 2: Add nvm Initialization

Add the following lines to ensure nvm is properly initialized upon starting a new shell session:

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

### Step 3: Add Paths for pnpm

Add the following lines to ensure pnpm is correctly added to the PATH:

```bash
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
```

### Step 4: Apply Changes

Save the file and close the editor. Apply the changes by reloading your shell configuration:

For Zsh:
```bash
source ~/.zshrc
```

For Bash:
```bash
source ~/.bashrc
```

### Step 5: Verify Installations

Ensure that node, nvm, and pnpm are properly installed and accessible:

```bash
node -v
nvm -v
pnpm -v
```
