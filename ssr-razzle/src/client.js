import App from './App'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { hydrate } from 'react-dom'

import { Cookies, SSRKeycloakProvider } from '@react-keycloak/ssr'

import { getKeycloakConfig, getKeycloakInit } from './utils'

const cookiePersistor = new Cookies()
hydrate(
  <SSRKeycloakProvider
    keycloakConfig={getKeycloakConfig()}
    persistor={cookiePersistor}
    initOptions={getKeycloakInit()}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SSRKeycloakProvider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}