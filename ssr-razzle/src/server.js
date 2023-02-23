import App from './App';
import React from 'react';
import { MemoryRouter, matchPath } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import "isomorphic-fetch";
import routes from "./routes.js"
import { ExpressCookies, SSRKeycloakProvider } from '@react-keycloak/ssr'
import { getKeycloakConfig, getKeycloakInit } from './utils'
import { Cookies } from '@react-keycloak/ssr';

const cookie = new Cookies()

const cookieParser = require('cookie-parser')
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
  assets[entrypoint].css.map(asset=>
    `<link rel="stylesheet" href="${asset}">`
  ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint] ? assets[entrypoint].js ?
  assets[entrypoint].js.map(asset=>
    `<script src="${asset}" ${extra.join(" ")}></script>`
  ).join('') : '' : '';
};

export const renderApp = (req, res, initialData) => {
  const context = {};

  const cookiePersistor = ExpressCookies(req)
  const markup = renderToString(
    <SSRKeycloakProvider
      keycloakConfig={getKeycloakConfig()}
      persistor={cookiePersistor}
      initOptions={getKeycloakInit()}
      autoRefreshToken={true}
      
      
    >
      <MemoryRouter location={req.url}>
        <App initialData={initialData}/>
      </MemoryRouter>
    </SSRKeycloakProvider>
  );
  const html = `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${cssLinksFromAssets(assets, 'client')}
      <script>window.__initialData__ = ${JSON.stringify(initialData)}</script>
      <script>window.env = ${JSON.stringify(getKeycloakConfig())}</script>
  </head>
  <body>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(assets, 'client', 'defer', 'crossorigin')}
  </body>
</html>`
  return {context, html};
}

const server = express();
const cors = require('cors')
server.use(cors())
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(cookieParser())
  .get('/*', (req, res) => {
   const currentRoute = routes.find(route => matchPath(route, req.url))
   if (currentRoute) {
    const requestInitialData = currentRoute.component.requestInitialData && currentRoute.component.requestInitialData(req.url);

    Promise.resolve(requestInitialData)
      .then(initialData => {
        const {context, html} = renderApp(req, res, initialData);
        if (context.url) {
          res.redirect(context.url);
        } else {
          res.status(200).send(html);
        }
      })
      .catch(rej => {
        console.log(rej)
        const {context, html} = renderApp(req, res, {});
        if (context.url) {
          res.redirect(context.url);
        } else {
          res.status(200).send(html);
        }
      })
   }

  });

export default server;
