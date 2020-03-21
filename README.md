## Description

This is to show my backend node js skill. I have built this project similir like [funretro.io](http://funretro.io/) for demo purpose using nestjs framework. [Nestjs](https://nestjs.com/)

## Features

- User signup and sign in
- User authentication and authorizations using JWT token
- Authenticated users can create boards, control the created board and share the board link to anyone
- Non authenicated users who received a board link can access and write their task or feedback.
- Users can vote the task/feedback and delete or edit the take which they owned.
- All users are connected via websocket and will recieve realtime updates.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Author - [Sajankumar Vijayan](https://sajankumarv.com)
- Twitter - [@sajan58603046](https://twitter.com/sajan58603046)

## License

It is [MIT licensed](LICENSE).
