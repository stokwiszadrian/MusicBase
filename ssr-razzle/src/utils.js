function getKeycloakConfig() {
  return typeof window !== 'undefined' && window.env !== 'undefined'
    ? {
        // client
        url: window.env.url,
        clientId: window.env.clientId,
        realm: window.env.realm,
      }
    : {
        //server
        "realm": "Project-realm",
        "url": "http://localhost:8080/",
        "clientId": 'auth-app-client',
      }
}

function getKeycloakInit() {
  return typeof window !== 'undefined' && window.env !== 'undefined'
    ? {
        // client
        "pkceMethod": 'S256',
        "onLoad": 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }
    : {
        //server
        "pkceMethod": "S256",
        "onLoad": 'check-sso',
        checkLoginIframe: false,
      }
}

export { getKeycloakConfig, getKeycloakInit }