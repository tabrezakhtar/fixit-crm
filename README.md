# Fixit CRM

Fixit CRM is a repair-shop dashboard for tracking customers, equipment repair jobs, technicians, and appointments. It uses Next.js, Mantine, Prisma, and PostgreSQL.

## Features

- Dashboard with repair-job status, recent work, and today's schedule
- Customer, equipment, repair-job, and appointment views
- Password-protected guest access using a signed session cookie
- PostgreSQL data access through Prisma

## Requirements

- Node.js compatible with the versions required by Next.js 16
- pnpm 9
- PostgreSQL

## Getting started

1. Install dependencies:

	```sh
	pnpm install
	```

2. Create a `.env` file in the project root:

	```dotenv
	DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fixit_crm?schema=public"
	GUEST_PASSWORD="choose-a-local-password"
	SESSION_SECRET="replace-with-a-long-random-secret"
	```

	`DATABASE_URL` must point to a PostgreSQL database. `GUEST_PASSWORD` protects the app's sign-in form. `SESSION_SECRET` signs dashboard sessions; keep it private and use a strong value.

3. Create and apply the database migration, then load sample data:

	```sh
	pnpm db:migrate
	pnpm db:seed
	```

	**Warning:** seeding deletes existing appointments, repair jobs, technicians, and customers before inserting sample data.

4. Start the development server:

	```sh
	pnpm dev
	```

	Open [http://localhost:3000](http://localhost:3000) and sign in with the `GUEST_PASSWORD` value.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Generate the Prisma client and build the app |
| `pnpm start` | Start the production server |
| `pnpm db:migrate` | Create and apply development database migrations |
| `pnpm db:seed` | Replace database contents with sample CRM data |
| `pnpm test` | Run type generation, formatting, lint, type checks, and Jest |
