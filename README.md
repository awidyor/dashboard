# Manajemen Akses Web

This project is a web-based access jt application that is used to manage user access. This application is built using the NuxtJS framework and uses the Prisma ORM to connect to the database.

Live website hosted on Vercel: [https://manajemen-akses.vercel.app/](https://manajemen-akses.vercel.app/)

## 🖥️ Running Locally

1. Clone this repository

    ```bash
    git clone https://github.com/project-based2/manajemen-akses
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Pull environment variables from dotenv website, you can see the cli command [here](https://www.dotenv.org/docs/dotenv-vault)

    ```bash
    npx dotenv-vault@latest pull
    ```

4. Run the development server

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦️ Build Setup

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## ⚛️ Tech Stack

-   [TypeScript](https://www.typescriptlang.org/)
-   [Nuxt 3](https://nuxt.com)
-   [Prisma ORM](https://www.prisma.io/)
-   [tRPC 10](https://trpc-nuxt.vercel.app/)
-   [Tailwind CSS](https://tailwindcss.com/)

## 📝️ Documentation

### Database Schema

You can change the database schema by editing the `schema.prisma` file. After that, you can run the following command to generate the database schema:

```bash
npm run generate
```

you can read more about the Prisma ORM [here](https://www.prisma.io/docs/concepts/overview/what-is-prisma).

If you want to change the database to local, you can change the `DATABASE_URL` environment variable in the `.env` file to the local database URL. example:

```env
DATABASE_URL="mysql://user:password@localhost:3306/manajemen_akses"
```

Then change the `schema.prisma` file to the local database schema. example:

```prisma
datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
}
```

### tRPC API

You can add or edit the API by editing the `server/trpc/routers/[name].ts` file. After that, you can add the API router to the `server/trpc/routers/index.ts` file. You can read more about tRPC for Nuxt [here](https://trpc-nuxt.vercel.app/).

To consume the API, you can use the `useQuery` and `useMutation` hooks from tRPC. You can read more example usage of the hooks [here](https://trpc-nuxt.vercel.app/get-started/tips/mutation).

If you want to fetch data inside the tRPC function, you can do it like this:

```ts
import { z } from "zod";

export const exampleRouter = router({
    getUsers: publicProcedure.query(async () => {
        const users = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        ).then((res) => res.json());

        return users;
    }),
});
```

### NuxtJS

You can read more about NuxtJS [here](https://nuxt.com/docs/getting-started/introduction).

### Tailwind CSS

You can read more about Tailwind CSS [here](https://tailwindcss.com/docs).

### Kinde

You can read more about Kinde for Nuxt [here](https://kinde.com/docs/developer-tools/nuxt-module/).

### Vercel

You can read more about Vercel for Nuxt [here](https://vercel.com/docs/frameworks/nuxt) and you can read more about Vercel Storage [here](https://vercel.com/docs/storage/vercel-postgres).
