# Community Connect - Backend

This is the backend application of the Community Connect Application and this README provides steps on how to set up and run the Nest.js app after cloning the repository.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) or the appropriate database for the project

---

## Steps to Set Up and Run

### 1. Clone the Repository

1. Clone the repository:

    ```bash
    git clone https://github.com/PathwayPro/Community-Connect-App.git
    ```

2. Navigate to the Project Directory
    Change to the cloned project's directory:

    ```bash
    cd community-connect-app/packages/backend
    ```

3. Install Dependencies
    Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Configure Environment Variables
    The application requires environment variables to run. Create an .env file in the root directory:

    - Check the `.env.example` file for the sample structure of environmental variables

5. Start the Application
    Run the application in development mode:

    ```bash
    npm run start:dev
    ```

    Access the application at `http://localhost:3001` (or the specified port in .env).

### 2. Set Up and configure Prisma ORM

1. Run `npm install` (dependencies already in package.json)

2. Set `DATABASE_URL` in .env

    ```bash
    DATABASE_URL="postgresql://[DB_USER]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]?schema=public"
    ```

3. The database schema is defined in the prisma/schema.prisma file.
    
    > **[See the schema documentation](https://www.prisma.io/docs/orm/prisma-schema)**

4. Regenerate the Prisma Client after any updates in the schema:

    ```bash
    npx prisma generate
    ```
5. Generate migrations files and apply them into the database:

    ```bash
    npx prisma migrate dev
    ```

---
> **NOTE:** The Prisma service is defined in prisma/prisma.service.ts and registered in src/app.module.ts for accessibility through the application.
---

## API Reference
Visit [API REFERENCE](API-REFERENCE.md)
