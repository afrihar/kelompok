# kelompok-dasawisma

The goal of this project is to secure `kelompok-dasawisma` using [`Keycloak`](https://www.keycloak.org/)(with PKCE). `kelompok-dasawisma` consists of two applications: one is a [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/) Rest API called `kelompok-api` and another is a [ReactJS](https://reactjs.org/) application called `kelompok-ui`.

## Applications

- ### kelompok-data

  `Spring Boot` Web Java backend application that initialize data **kelompok**. inject data for Keycloak for user authentication & authorization and initialize master data to postgres.
  - Run the following `Maven` command to Build the jar application
    ```
    ./mvnw clean package -DskipTests=true
    ```
    
- ### kelompok-api

  `Spring Boot` Web Java backend application that exposes a Rest API to manage **kelompok**. Its secured endpoints can just be accessed if an access token (JWT) issued by `Keycloak` is provided.
  
  `kelompok-api` has the following endpoints

  | Endpoint                                                          | Secured | Roles                       |
  | ----------------------------------------------------------------- | ------- | --------------------------- |
  | `GET /api/userextras/me`                                          | Yes     | `PUSDATIN` and `KELURAHAN` |
  | `POST /api/userextras/me -d {avatar}`                             | Yes     | `PUSDATIN` and `KELURAHAN` | 

- ### kelompok-ui

  `kelompok-ui` uses [`Semantic UI React`](https://react.semantic-ui.com/) as CSS-styled framework.

## Prerequisites

- [`Java 11+`](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [`npm`](https://www.npmjs.com/get-npm)
- [`Docker`](https://www.docker.com/)
- [`Docker-Compose`](https://docs.docker.com/compose/install/)
- [`jq`](https://stedolan.github.io/jq)

## PKCE

As `Keycloak` supports [`PKCE`](https://tools.ietf.org/html/rfc7636) (`Proof Key for Code Exchange`) since version `7.0.0`, we are using it in this project. 

## Start environment

- In a terminal and inside `kelompok` root folder run
  ```
  docker-compose up -d
  ```

- Wait a little bit until all containers are Up (healthy). You can check their status running
  ```
  docker-compose ps
  ```

## Running kelompok-app using Maven & Npm

- **kelompok-api**

  - Open a terminal and navigate to `kelompok/kelompok-api` folder

  - Run the following `Maven` command to start the application
    ```
    ./mvnw clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=9080"
    ```

    Once the startup finishes, `KeycloakInitializerRunner.java` class will run and initialize `simpkk` realm in `Keycloak`. Basically, it will create:
    - Realm: `simpkk`
    - Client: `kelompok-dasawisma`
    - Client Roles: `PUSDATIN` and `KELURAHAN`
    - Two users
      - `rangga`: with roles `PUSDATIN` and `KELURAHAN`
      - `kel.ancol`: only with role `USER`

  - **Social Identity Providers** like `Google`, `Facebook`, `Twitter`, `GitHub`, etc can be configured by following the steps described in [`Keycloak` Documentation](https://www.keycloak.org/docs/latest/server_admin/#social-identity-providers)

- **kelompok-ui**

  - Open another terminal and navigate to `kelompok/kelompok-ui` folder

  - Run the command below if you are running the application for the first time
    ```
    npm install
    ```

  - Run the `npm` command below to start the application
    ```
    npm start
    ```

## Applications URLs

| Application    | URL                                   | Credentials                           |
| -------------- | ------------------------------------- | ------------------------------------- |
| kelompok-api   | http://localhost:9080/swagger-ui.html | [Access Token](#getting-access-token) |
| kelompok-ui    | http://localhost:3000                 |                                       |
| Keycloak       | http://localhost:8080/auth/admin/     |                                       |

## Testing kelompok-api endpoints

You can manage kelompok by accessing directly `kelompok-api` endpoints using the Swagger website or `curl`. However, for the secured endpoints like `POST /api/kelompok`, `PUT /api/kelompok/{id}`, `DELETE /api/kelompok/{id}`, etc, you need to inform an access token issued by `Keycloak`.

### Getting Access Token

- Open a terminal

- Run the following commands to get the access token
  ```
  ACCESS_TOKEN="$(curl -s -X POST \
    "http://localhost:8080/auth/realms/simpkk/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=rangga" \
    -d "password=P@ssw0rd" \
    -d "grant_type=password" \
    -d "client_id=kelompok-dasawisma" | jq -r .access_token)"

  echo $ACCESS_TOKEN
  ```

### Calling kelompok-api endpoints using Swagger

- Access `kelompok-api` Swagger website, http://localhost:9080/swagger-ui.html

- Click on `Authorize` button.

- In the form that opens, paste the `access token` (obtained at [getting-access-token](#getting-access-token)) in the `Value` field. Then, click on `Authorize` and on `Close` to finalize.

- Done! You can now access the secured endpoints

## Shutdown

- Go to `kelompok-api` and `kelompok-ui` terminals and press `Ctrl+C` on each one

- To stop and remove docker-compose containers, networks and volumes, run the command below in `kelompok` root folder
  ```
  docker-compose down -v
  ```

## How to upgrade kelompok-ui dependencies to latest version

- In a terminal, make sure you are in `kelompok/kelompok-ui` folder

- Run the following commands
  ```
  npm i -g npm-check-updates
  ncu -u
  npm install
  ```