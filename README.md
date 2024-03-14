# ConfigDN

Open source configuration management and feature flags.

# Hosted Version
There is a [hosted version](https://configdn.com) of ConfigDN available. This is a fully functional version of ConfigDN, hosted by us. We plan to charge for this in the future to help fund development, but for now it is free.

# Requirements

- Node.js (Recommended: LTS or newer)
- NPM
- Go 1.22+

# Building the project

To build the project, use the build script:

```bash
./build.sh
```

This script also builds the UI before a release. Alternatively, you can download a release from the [releases page](https://github.com/dBuidl/ConfigDN/releases).

# Running the project

To run the project, execute the executable built by the build script:

```bash
./ConfigDN serve
```

ConfigDN will then be available at:
- http://localhost:8090/ - UI
- http://localhost:8090/_/ - Admin UI (Make sure you visit this before making it public as the first person to visit it will be made an admin)

If you want a prettier interface for resetting passwords, you'll need to go into the admin UI, go to the settings icon then mail settings and update the action URL for reset password to `{APP_URL}/auth/reset-password/{TOKEN}`. You should probably set up an SMTP server while you're there and check over the other settings to make sure you're happy with them.