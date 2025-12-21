This is an example of microservices architecture in NestJS.

### Features of this example

- Auth microservice for authentication, users microservice for managing users and gateway as an entry point for client
  requests.

- Passport lib is used for managing authentication(credentials and jwt). Also connected Redis for refresh tokens.

- PostgreSQL is used as main database.

- Microservices communicate via NestJS built-in Transport TCP.

### Running the example with Docker

1. in root folder run `pnpm install` (if you're using npm or any other package manager you should run install command in
   each folder
   which contains package.json)
2. create .env files (it's for example only so I put all needed creds in .env.example. Run `cp .env.example .env` in
   folders: auth, gateway and users)
3. in root folder run `docker compose up -d --build`
4. in users folder run migrations `npm run typeorm:run-migrations`

App is running on 3001 port (could be changed in .env)

To create user send POST request to `/users` with body
`{
    "username": "some_user",
    "password": "some_password"
}`

For login use the same body and send POST request to `/auth/login`