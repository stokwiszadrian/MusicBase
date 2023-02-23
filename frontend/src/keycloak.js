import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    "realm": "Project-realm",
    "auth-server-url": "http://localhost/",
    "ssl-required": "external",
    "resource": "spa-client",
    "public-client": true,
    "confidential-port": 0,
    "clientId": "spa-client",
    "url": "http://localhost/",
    checkLoginIframe: false,
    flow: 'implicit'
})

export default keycloak