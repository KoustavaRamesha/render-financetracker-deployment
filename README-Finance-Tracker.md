# Finance Tracker

A comprehensive personal finance tracking application built with Next.js, Firebase, and TypeScript.

## Features

- **User Authentication**: Sign in with Google or email/password (no anonymous access)
- **Income & Expense Tracking**: Add and categorize your financial transactions
- **Currency Support**: Multiple currencies with automatic conversion (USD, INR, CNY, JPY, CAD, AUD)
- **Interactive Charts**: Visual breakdown of expenses and income vs expense comparisons
- **Dashboard Overview**: Real-time summary of your financial status
- **Transaction Management**: View, add, and delete transactions
- **Time Filtering**: View data for current month or all time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## Getting Started

The application is already set up and running. You can access it at `http://localhost:3000`.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

The project is already initialized with all necessary dependencies installed.

### Usage

1. **Authentication**: 
   - Sign in with your Google account
   - Create an account with email and password
   - **Note**: Anonymous access is not available - you must create an account to use the app

2. **Adding Transactions**:
   - Click "Add Income" to record your earnings
   - Click "Add Expense" to record your spending
   - Select appropriate categories for expenses
   - All amounts are recorded in your selected currency

3. **Viewing Data**:
   - Dashboard shows summary cards for total income, expenses, and balance
   - Pie chart shows expense breakdown by category
   - Bar chart compares income vs expenses over time
   - Recent transactions lists show your latest financial activities

4. **Currency Management**:
   - Use the currency selector in the header to change your preferred currency
   - All amounts are automatically converted to your selected currency
   - Original currency amounts are shown in transaction details

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main Finance Tracker component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   ├── db.ts                 # Database utilities
│   └── utils.ts              # Utility functions
└── components/
    └── ui/                   # shadcn/ui components
```

## Firebase Configuration

The application uses Firebase for authentication and data storage. The configuration is already set up in `src/lib/firebase.ts` with the following services:

- Firebase Authentication (Google, Email/Password, Anonymous)
- Firestore Database (for storing transactions)

## Data Model

### Income Transactions
- `id`: Unique identifier
- `source`: Income source (e.g., "Salary", "Bonus")
- `amount`: Transaction amount
- `currency`: Original currency
- `timestamp`: Transaction date
- `userId`: User identifier

### Expense Transactions
- `id`: Unique identifier
- `category`: Expense category (e.g., "Food", "Transport")
- `amount`: Transaction amount
- `currency`: Original currency
- `timestamp`: Transaction date
- `userId`: User identifier

## Development

The project includes the following scripts:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Features in Detail

### Authentication Flow
1. User visits the application and sees the login screen
2. User must authenticate with Google or email/password (no anonymous option)
3. After successful authentication, user is redirected to the main dashboard
4. User data is associated with their authenticated account for persistence

### Dashboard Components
- **Summary Cards**: Show total income, expenses, and balance
- **Expense Breakdown**: Pie chart showing spending by category
- **Income vs Expense**: Bar chart showing financial trends over time
- **Recent Transactions**: Lists of latest income and expense entries

### Transaction Management
- Add new income/expense with forms
- Delete existing transactions with confirmation
- Automatic currency conversion
- Real-time updates using Firestore listeners

### Currency System
- Base currency: USD
- Supported currencies: USD, INR, CNY, JPY, CAD, AUD
- Automatic conversion based on predefined exchange rates
- Display both original and converted amounts

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

The layout adapts to different screen sizes using Tailwind CSS responsive classes.

## Security

- Firebase Authentication handles user security
- User data is isolated by user ID
- Firestore security rules ensure data privacy
- No sensitive data is exposed on the client side

## Future Enhancements

Potential features for future development:
- Budget tracking and alerts
- Recurring transactions
- Investment tracking
- Goal setting and progress tracking
- Export functionality (PDF, CSV)
- Advanced reporting and analytics
- Multi-user support for families
- Receipt attachment functionality
- Password recovery and account management features