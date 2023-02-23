import { useKeycloak } from "@react-keycloak/ssr";
import "isomorphic-fetch"
import { getKeycloakInit } from "./utils";

const Home  = () => {
  const { keycloak } = useKeycloak()
  let username = ""
  if (typeof keycloak.idTokenParsed !== 'undefined') {
    username = keycloak.idTokenParsed.preferred_username
  }

  // console.log(keycloak)

    return (
      <div>
          {!keycloak.authenticated ? (
             <h2>Witaj! Zaloguj się, aby mieć dostęp do aplikacji.</h2>
          ) : (
            <h2>Witaj z powrotem, {username}!</h2>
          )}
         
          {!keycloak.authenticated ? (
            <button onClick={() => keycloak.login()}>Login</button>
          ) : (
            <button onClick={() => keycloak.logout()}>Logout</button>
          )}
      </div>
    );
  
}


export default Home;
