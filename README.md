# Description

This is a template for quickly spinning up demo environments to play around with things.

Ping @philipshen (Phil) or @quackingduck (Myles) if you get stuck or have questions.

# Usage

- Clone this repo or download a .zip
- `npm i`
- `npm run dev` Will get this to start running at http://localhost:3000

See notes below for instructions on developing the client & server as well as deploying.

# Client

Start the client with `npm run dev`.

The entry point for client dev lives in `src/App.jsx`.

# Server

Start the server with `npm run dev:server`.

The server hot reloads with Nodemon. Everything in the `./server` directory will run in the server.

# Deployment

This will autodeploy to LayerCI.

If you just want to deploy frontend code, use `deploy.sh` to push this to GitHub Pages. Since we have a private GitHub account, this is private because it uses a secret URL.

# Tips & Tricks

## Hotkeys

On the frontend, you can:
Use `d` to view the "demo" tab
Use `p` to view the "previews" tab for component previews
