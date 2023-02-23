# Baza albumów muzycznych

Aplikacja pozwala na przechowywanie danych albumów muzycznych i wykonywanie operacji CRUD na tych danych. Dane zapisywane są na stałe do bazy MongoDB, a także tymczasowo w bazie Redis. Rekordy z bazy Redis wykorzystywane są do śledzenia ostatnio dodanych / zmodyfikowanych albumów.

## Opis poszczególnych serwisów

- Authorization server - serwer Keycloak, uruchamiany jako kontener za pomocą polecenia  
`docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:17.0.0 start-dev`.   
utworzono na nim osobny realm, w którym operują wszyscy klienci i użytkownicy tej aplikacji

- Resource server - serwer ExpressJS uruchamiany lokalnie, połączony z bazami danych Redis i Mongo ( uruchamiane jako kontenery ). Endpointy zabezpieczone są przez Keycloak - serwis dokonuje inspekcji tokenów

- Client SPA - aplikacja React realizująca flow "Implicit grant" w celu autoryzacji użytkownika

- Client SSR - aplikacja React-Razzle realizująca flow "Authorization code grant" w celu autoryzacji

- Client Node.js - serwis ExpressJS realizująca flow "Client Credential grant" w celu autoryzacji/ W swoich endpointach odwołuje się do endpointów z zabezpieczonego API.

