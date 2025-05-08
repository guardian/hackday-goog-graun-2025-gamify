# Hackday project

Hacky hack hack

# Getting started

## Starting the UI:

`mise use node`
`npm i`
`npm run dev`

## Starting the Gemini agent server

Set up the `gcloud` CLI and run `gcloud auth login`, then do:

`mise use python`
`pip install adk`
`adk api_server`

Watch out for CORS errors. Didn't have the time to fix properly (which would probably involve manually setting up a web server using something like Flask). To test, run your browser with security disabled (easier in Chrome than Firefox).

Look [in docs](https://google.github.io/adk-docs/get-started/quickstart/) if that doesn't work (I probably forgot something):
