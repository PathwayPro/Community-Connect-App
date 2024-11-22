# Community Connect

Community Connect is an innovative and interactive web application designed to establish a vibrant and inclusive digital space for individuals within the immigrant community. It serves as a comprehensive platform that enables immigrants to connect, collaborate, and empower each other, fostering a sense of belonging and support.

## Product Vision

To establish a secure environment within the tech community where immigrants can build genuine connections, learn, and receive support from fellow immigrants.

---

## Repository Overview

This monorepo houses the frontend and backend components of the **Community Connect** application, built with modern, scalable technologies and organized using [Lerna](https://lerna.js.org/) for efficient package management. The repository also employs best practices for code quality and consistency, such as linting and commit standards.

### Tech Stack

- **Frontend**: Next.js + TypeScript
- **Backend**: Nest.js + TypeScript
- **Database**: MongoDB
- **Monorepo Management**: Lerna
- **Quality Tools**:
  - **Husky**: For Git hooks (e.g., pre-commit and pre-push checks)
  - **Commitlint**: To enforce consistent commit message formats

---

## Project Structure

```plaintext
community-connect/
├── .github/
├── packages/
│   ├── frontend/   # Next.js + TypeScript application for the user interface
│   └── backend/    # Nest.js + TypeScript application for the API
├── .husky/         # Husky configuration for Git hooks
├── commitlint.config.js # Commitlint rules for commit message formatting
├── lerna.json      # Lerna configuration file
├── package.json    # Root package configuration
└── README.md       # High-level overview of the repository
```

## Key Directories

**packages/frontend**
Contains the Next.js application that serves the user-facing interface. Detailed setup, usage instructions, and local development guidelines are available in the frontend's README.

**packages/backend**
Houses the Nest.js API application that powers the backend services of the platform, including user authentication, data management, and other business logic. See the backend's README for more details.

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm (preferred package manager)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PathwayPro/Community-Connect-App.git
   cd community-connect-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment Variables
   Each package requires its own environment configuration file. Refer to the respective README files in packages/frontend and packages/backend.

## Development

### Running the Applications

- Frontend:

  ```bash
  cd packages/frontend
  npm run dev
  ```

- Backend:
  ```bash
  cd packages/backend
  npm run start:dev
  ```

## Code Quality and Git Workflow

This repository enforces strict code quality standards through the following tools:

- This repository enforces strict code quality standards through the following tools:

  ```bash
  npm run lint
  ```

- Commit Message Validation: Ensured by Husky and Commitlint.

  - Commit messages must follow the Conventional Commits specification.
  - Example commit message:
    ```bash
    feat(backend): add user authentication API
    ```

- Pre-Commit Hooks: Automatically run linting and tests before allowing commits.

## Contributing

We welcome contributions to **Community Connect**! Please refer to our [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get started.

---

## License

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md).

---

## Contact

For questions or feedback, feel free to reach out to the team at **immigranttechiesab@gmail.com**.

---
