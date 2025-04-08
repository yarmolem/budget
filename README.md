# Budget App

A modern, full-stack budget tracking application built with Next.js, tRPC, and Drizzle ORM. This application helps users manage their finances by tracking income and expenses, categorizing transactions, and providing insightful analytics.

## Features

- 📊 **Dashboard Overview**

  - Real-time financial KPIs
  - Transaction history visualization
  - Category-wise spending analysis
  - Date range filtering for transactions

- 💰 **Transaction Management**

  - Add, edit, and delete transactions
  - Categorize transactions (income/expense)
  - Add tags for better organization
  - Support for multiple payment methods
  - Transaction history with pagination

- 📑 **Category Management**

  - Create and manage custom categories
  - Color coding for visual organization
  - Income/expense categorization
  - Bulk category operations

- 🌐 **Internationalization**

  - Multi-language support
  - Automatic language detection
  - Easy translation management

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Intuitive navigation
  - Real-time feedback with toast notifications

## Tech Stack

- **Frontend**

  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - React Hook Form
  - Zod for validation

- **Backend**

  - tRPC for type-safe API
  - Drizzle ORM
  - Turso (SQLite) database
  - NextAuth.js for authentication

- **Development Tools**
  - ESLint
  - TypeScript
  - Drizzle Kit for database migrations

## Getting Started

1. Clone the repository

```bash
git clone [your-repo-url]
cd budget-app
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```env
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
TURSO_CONNECTION_URL="your-turso-connection-url"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

4. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Management

- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- Open database studio: `npm run db:studio`

## Future Improvements

Here are some potential improvements and optimizations that could be implemented:

- **Performance Optimizations**

  - [] Implement server-side caching for frequently accessed data
  - [] Add database query optimization and indexing
  - [] Implement lazy loading for transaction history
  - [] Add pagination for large datasets

- **Feature Enhancements**

  - [] Add budget planning and forecasting
  - [] Implement recurring transactions
  - [] Add export/import functionality for transactions
  - [] Create financial reports and analytics
  - [] Add support for multiple currencies
  - [] Implement data backup and restore functionality

- **User Experience**

  - [] Add keyboard shortcuts for common actions
  - [] Implement drag-and-drop for transaction categorization
  - [] Add bulk transaction operations
  - [] Create a mobile app version
  - [] Add more visualization options for financial data

- **Security**
  - [] Implement two-factor authentication
  - [] Add audit logs for sensitive operations
  - [] Enhance data encryption
  - [] Add role-based access control

## License

This project is licensed under the MIT License - see the LICENSE file for details.
