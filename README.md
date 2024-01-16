# 🔗 Connectors

This is a [T3 Stack](https://create.t3.gg/) project that aims to create a better experience around playing New York Times' game [Connections](https://www.nytimes.com/games/connections). It is available to play right now at [connectorsbeta.vercel.app](https://connectorsbeta.vercel.app)!

## Features

- Create your own game of Connectors and send them to your friends
- Play your custom games of Connectors and share your results with the world
- View the most popular custom games created
- View the most recent custom games created

## Motivation

Connectors was a project created to enhance one of my favourite games for myself and my friends, along with getting more familiar with NextJS 14 and React Server Components. Connectors uses React Server Components to leverage vital data fetching and computation on the server, for less JavaScript on the client. It also takes advantage of the newest NextJS features, including the metadata API, NextJS fonts, OpenGraph optimizationss, and __dynamic OpenGraph image generation for each puzzle__. Connectors is also fully viewport responsive, and has __dark mode__!

## The Stack

Connectors uses the following technologies:

- [NextJS](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Prisma](https://www.prisma.io/)

## Local Deployment

To deploy a version of Connectors for yourself, you will need a MySQL database (and that's it!). Add the database URL to a `.env` file. Your `.env` file should look like this:

```bash
DATABASE_URL=your database URL
```

Then, run the following commands:

```bash
npm install
npm run db:push
npm run dev
```

Visiting [http://localhost:3000](http://localhost:3000) will show you the Connectors homepage.
