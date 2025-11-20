# Google Forms Lite Clone

A simplified, yet powerful clone of Google Forms built as a test task for the Trainee Front-End Developer position. This application allows users to create, view, fill out, and analyze responses for custom forms.

The project is structured as a monorepo using pnpm workspaces, featuring a React front-end and a GraphQL back-end.

## Core Features

*   **Form Builder:** Create forms with a title, description, and multiple question types.
*   **Multiple Question Types:** Supports Text, Date, Multiple Choice, and Checkboxes.
*   **Form Filler:** A clean interface for users to fill out and submit forms.
*   **Response Viewer:** Review individual submissions for each form.
*   **Client-Side Validation:** Ensures that required fields are filled correctly.
*   **Correct Answer Checking:** Set correct answers in the builder and see the score upon submission and in the response viewer.

## Tech Stack

### Front-End
*   React
*   TypeScript
*   Redux Toolkit (with RTK Query)
*   React Router
*   Vite
*   CSS

### Back-End
*   Node.js
*   Apollo Server
*   Express
*   GraphQL

### Monorepo & Tooling
*   pnpm Workspaces
*   Concurrently
*   GraphQL Code Generator
*   ESLint
*   TypeScript

## Project Structure

The project is a monorepo containing two main packages:

```
/
├── client/         # React front-end application
├── server/         # GraphQL back-end server
├── .gitignore
├── package.json    # Root package.json with scripts to run both apps
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
*   Node.js (v18.x or higher is recommended)
*   pnpm (v8.x or higher is recommended)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone google-forms_test
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd google_forms_test
    ```

3.  **Install all dependencies:**
    This command will install dependencies for both the `client` and `server` workspaces.
    ```bash
    pnpm install
    ```

4.  **Run the project in development mode:**
    This script uses `concurrently` to start both the back-end server and the front-end client.
    ```bash
    pnpm dev
    ```

After running the command, the applications will be available at:
*   **Front-End Client:** http://localhost:5173
*   **GraphQL Playground:** http://localhost:4000/graphql

## Available Scripts

From the root directory, you can run the following commands:

*   `pnpm dev`: Starts both the client and server.
*   `pnpm dev:client`: Starts only the client application.
*   `pnpm dev:server`: Starts only the server application.

## Architectural Highlights

*   **Monorepo with pnpm:** The project utilizes pnpm workspaces for efficient dependency management and a clean project structure.
*   **State Management with RTK Query:** The client-side state, especially async data fetching, is managed by Redux Toolkit's RTK Query. This simplifies data fetching, caching, and invalidation.
*   **GraphQL Code Generation:** Types and RTK Query hooks are automatically generated from the GraphQL schema and operations, ensuring type safety and reducing boilerplate.
*   **Separation of Concerns (Custom Hooks):** The "business logic" for each page is encapsulated in custom React hooks (`useFormBuilder`, `useFormFiller`, etc.). This keeps the components clean, declarative, and focused solely on rendering the UI.
