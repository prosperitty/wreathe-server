# Wreathe (Server)

Wreathe is a social app specifically for market participants to discuss financial analysis and price action in markets. In this repository, contains the server-side code for building RESTful API's.

The technology used to build the server-side are Express(Node.js Framework), Typescript(Typechecker), and Prisma(ORM), Websockets(Websocket API), Express Validator, and JWT.

## Overview

This project was built to test my abilities in building full stack apps with modern technologies. After building projects with MERN stack technology, I researched modern technologies and found that Next.js(React Framework), TailwindCSS(CSS Framework), Typescript(Javascript Typechecker), Postgresql(Database), Prisma(ORM), Express(Node.js Framework), and other technologies, are among the most popular modern web development technologies in 2024. Building this project has taught me a vast amount of information on building applications in modern times.

#### Some learning takeaways:

- WebSockets(Websocket API/socket.io)
- Typescipt
- Prisma ORM
- JSON Web Tokens
- PostgreSQL

## Functionlity

I wanted this project to be a social app like twitter to test if I had the ability to build social media apps similar to twitter. On the server side, this would involve building RESTful API's to interact and provide data to the client side. This would include building API endpoints, which would handle operations such as:

- Authentication
  - JWT authentication
  - Refresh Tokens/Access Tokens
  - Refresh Token API endpoint
  - Securing Passwords with bcrypt
  - Validating credentials with express-validator
  - CRUD user credentials and saving to the Database
- CRUD operations for posts
  - Post interactions(Liking, Unliking, Commenting)
  - Validating with express-validator
  - Building Models
- Building a feed page
  - API Endpoint to query for posts based on user's followings
  - Sort data based on most recent posts
- Profile page
  - API Endpoint to query for posts based on user's posts, likes, comments
  - Edit Credentials API endpoint
  - Validate with express-validator
  - Update Credentials with Prisma query
  - Build Follow or Unfollow models
  - Authenticate user's so that only thery can edit their own page
- Messaging app
  - Opening connection with the client side
  - Handle notifying user's when connected to a chatroom
  - Handle realtime messaging with websockets and Send data back to client
  - Private Messages with other users one-to-one
- Search
  - API endpoint to query for users and send to client

### Authentication

Building authentication functionality grew to be one of the most challenging aspects of this project. This project would have been much simpler if I just built a simple JWT authentication function, or used Auth0/passport, but I was far more worried about how to handle the security aspects of authenticating users. Delving into authentication was like falling into a rabbit hole where there are multiple scenarios and practices to use when building authentication with JWT.

One method I came across and decided to implement to this project was the concept of building refresh tokens and access tokens with JWT to authenticate users. As far as my understanding goes, the purpose of building the refresh token was to generate this token on user authentication, save it somewhere in the server side(on a user model), use the token to authenticate users and authorize users to view content by providing an access token to verify with. The access token is generated on the server, along with the refresh token, which is then sent to the client to be saved _**in memory**_. Whenever a user decides to view a page that requires authorization, the client side fetches a request to a refreshToken endpoint, and uses the access token that was provided to the client to verify with the refresh token provided on the server side.

The challenges grew when trying to save the access token in memory because this would involve making a request to the server each time a user needed to be authorized on a page. My assumption to this was that this probably wouldn't scale well, and finding a solution to this proved to be difficult. However, this assumption of mine came before i discovered the ability of server components. [Next.js](https://nextjs.org/docs/app/building-your-application/authentication) has a valuable resource for handling authentication with server components. It was a little to late to discover this resource as i had already built the logic using client components. I did a naive approach and provided both refresh token and access token to the client and saved to a cookie(prone to XSS attacks if not securely transmitted), but i want to revisit implementing and handling this logic better in the future.

All together, It might have been naive to build an authentication system almost from scratch, and not from Auth0/passport, but this turned to be an incredibly valuable lesson for building authentication systems with JWT. Far more knowledge was gained by venturing with this approach, especially when security is of the utmost importance for applications.

### CRUD

CRUD was a familiar concept to implement and much similar to building the Blog App with MERN stack technology. However, this time around this app was built with new technology such as Postgres, Prisma, and Typescript. Spending hours learning and implementing this technology turned out to be incredible. I had found that the Prisma documentation was far more friendly than mongoose and using Postgres had been a valuable experience. This along with typescript, proved to me why these technologies are popular in modern web development. I used familiar MVC concepts i knew to build API endpoints necessary to handle CRUD operations for users, posts ,likes, comments, and messaging.

#### Takeaways

- None of the code i wrote seemed clean
- Learn testing with jest
- Learn SOLID Principles
- Learn advanced Javascript

### Message App

Building this app involved learning about Websockets. I had thought about using socket.io at first, but then I came across a tweet by Guillermo Rauch that was about socket.io. At first, I had thought socket.io was still popularly used in modern web dev, but reading Guillermo's tweet sounded as if it was ancient and the comments made this even more so. Along the comments, I discovered that browsers now have the Websocket API and a comment mentioned that using this API involves one less package to use(socket.io). Therefore, I decided to use the Websocket API to build the message app.

Although I learned to use the Websocket API, I had alot more questions such as, what was socket.io used for years ago? Does socket.io use websockets or not? What can socket.io be used for today? Overall, what are the differences between the websocket API and socket.io?

Opening the connection on the server side seemed alot similar to socket.io, however, It required alot of research to learn how to handle sending messages back to the client(Lack of JS concepts).

#### The takeways of Websockets

- It can be used to open and connect browser and server
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) provides a list of websocket tools
- Can be used for realtime messaging
- Utilized for notifications
- Opening chatrooms like twitch chat
- [Javascript.info](https://javascript.info/websocket) provides valuable information on websockets

#### Challenges:

- Websockets seemed fairly simple to learn but challenges arose when building with Next.js involving client-side rendering or server-side rendering. I had thought i could use server side rendering to build a realtime messaging feature, but I was just met with bugs in the end.
- Realtime messaging can be achieved by transferring data between browser and server, but I had considered the best practice on saving messages while chatting.
  - Should we save after or before the message is sent?(Make a query to the database to save the message)
    - Saving a message before receiving from a websocket slowed down the realtime messaging while a fetch request was awaiting to be resolved to save the message to the database
    - Saving after solves this problem but then:
  - What if the message fails to save to the DB?
    - This would cause a bug where the end user can see the message if connected to the chatroom, but the message won't be shown when refreshing the page because it was not saved.
    - A solution could be to continue to try and save the message on failure (i'm sure there's caveats to this)
  - Do big social media apps like instagram or twitter have servers that are lightning fast to make the DM messaging almost realtime?
    - Probably not worth considering this because alot of work and time was considered to make these apps work efficiently.
    - My use case could be different depending on what the app requires
