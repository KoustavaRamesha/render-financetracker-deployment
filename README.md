💰 Finance Tracker: Smart Personal Budgeting AppA modern, responsive, and secure personal finance application designed to help you effortlessly track incomes, manage expenses, and visualize your financial health in real-time. Built with React and powered by Google's Firebase.✨ Key Features Highlights⚡ Real-Time Tracking: Instantly see changes to your income, expenses, and net balance.🌍 Multi-Currency Support: Convert and view transactions in USD, INR, CNY, JPY, CAD, and AUD.📊 Powerful Visualization: Analyze spending patterns with interactive Pie Charts and Bar Charts powered by Recharts.🔒 Secure Authentication: Utilizes Firebase Authentication with Google Sign-In and Email/Password options.🗑️ Intuitive Management: Simple interface for adding, updating, and deleting transactions with confirmation modals.🎯 Detailed Features1. Authentication & SecurityThe application is secured using Firebase Authentication.Flexible Login: Users can securely sign in using their Google Account or a standard Email and Password combination.User Isolation: Data (incomes and expenses) is stored in Firestore under a unique user path, ensuring private financial data is isolated and secure.2. Financial TrackingIncome Management: Track various income sources (e.g., Salary, Investment, Gift).Expense Categorization: Categorize expenses for better analysis (e.g., Food, Housing, Utilities, Entertainment).Timestamping: Every transaction is automatically timestamped for accurate record-keeping and filtering.3. Multi-Currency SupportThe application supports currency conversion for comprehensive global finance tracking.Users can select a Display Currency (e.g., USD).All transactions are converted and summarized into the chosen display currency using predefined exchange rates for consolidated reporting.4. Data VisualizationThe Dashboard provides clear, animated visual insights into your finances:Summary Cards: Quick view of Total Income, Total Expense, and Net Balance.Expense Breakdown (Pie Chart): Visualizes spending distribution across categories for the current month.Income vs. Expense (Bar Chart): Compares monthly performance over time.5. User ExperienceFully Responsive: Optimized layout using Tailwind CSS for seamless use on mobile, tablet, and desktop.Animated Transitions: Smooth visual effects are used for loading states and view changes to create an engaging experience.Confirmation Modals: Prevents accidental deletion of financial records.🚀 Getting Started GuideFollow these steps to get a copy of the project up and running on your local machine.PrerequisitesYou need the following installed:Node.js (LTS recommended)npm or yarnA Firebase Project configured with Firestore and Authentication (Google and Email/Password providers enabled).Step-by-step InstallationClone the repository:git clone <your-repo-url>
cd finance-tracker
Install dependencies:npm install
# or
yarn install
Firebase Configuration (Environment Variables):For a production deployment or local development outside of a controlled environment, you would typically use a .env file. Since this app uses a static firebaseConfig block, ensure your Firebase project's keys match the configuration within the main React component file, especially if you plan to share this on GitHub.Note for Canvas/Immersive Users: The application is configured to automatically detect and use the injected environment variables (__app_id, __firebase_config, __initial_auth_token) for seamless operation.Development Server StartupRun the application locally:npm start
# or
yarn start
The application should open automatically in your browser at http://localhost:3000.📖 Usage Guide1. AuthenticationUpon first launch, you will be directed to the login screen:Select "Sign in with Google" for the fastest access.Alternatively, use the Email/Password form to Sign Up or Log In.2. Adding TransactionsFrom the Dashboard, click the "Add Income" (Green) or "Add Expense" (Red) button.Enter the Amount and the Source (for Income) or select a Category (for Expense).Click Add Income/Expense. The transaction will immediately appear on your Dashboard and update your charts.3. Viewing AnalyticsThe Dashboard provides an immediate overview.Use the filter toggle (This Month / All Time) to change the scope of the summary cards and the expense breakdown chart.Scroll down to see Recent Incomes and Recent Expenses lists.4. Currency ManagementUse the dropdown selector in the top-right corner of the header to change the primary display currency (e.g., from USD to INR).All summary totals and converted amounts in the transaction lists will update automatically.🛠️ Technical DocumentationTechnology StackCategoryTechnologyPurposeFrontendReact (V18+)Core JavaScript library for building the user interface.StylingTailwind CSSUtility-first CSS framework for rapid, responsive design.Data VisualizationRechartsReact component library for building highly customizable charts.BackendFirebase FirestoreNoSQL cloud database for real-time transaction storage.AuthenticationFirebase AuthProvides secure user authentication services.IconsLucide-ReactClean, modern icon library for UI elements.Project StructureThe entire application logic is contained within a single App.jsx (or .js) file, following best practices for single-file, deployable React components in certain environments. Key components include:App: Main component handling Firebase initialization and routing (Auth vs. Tracker).AuthScreen: Handles Google and Email/Password sign-in/up.FinanceTracker: Main application wrapper, manages incomes, expenses state, and currency setting.Dashboard: Presents summary, charts, and transaction lists.AddTransactionForm: Component for adding new income or expense records.SummaryCard, ChartContainer, TransactionList: Reusable UI/data components.Available ScriptsIn the project directory, you can run:CommandDescriptionnpm startRuns the app in the development mode. Opens http://localhost:3000 in the browser.npm run buildBuilds the app for production to the build folder.Deployment InstructionsThis application is typically deployed as a static site due to its React frontend.Build: Run npm run build.Host: Upload the contents of the generated build folder to any static hosting service (e.g., Firebase Hosting, Netlify, Vercel).Firebase Rules: Ensure your Firestore Security Rules permit authenticated users to read and write to their specific collections (e.g., /artifacts/{appId}/users/{userId}/incomes).🛡️ Security & Data ModelData Model (Firestore)Data is stored per user for maximum privacy.Collection PathDocument Fields (Example)Description/artifacts/{appId}/users/{userId}/incomesamount, currency, source, timestamp, userIdRecords of all user incomes./artifacts/{appId}/users/{userId}/expensesamount, currency, category, timestamp, userIdRecords of all user expenses.Security FeaturesAuthentication Check: All database operations (reads/writes) are conditional on a successful Firebase Auth user session.Input Validation: Client-side validation ensures fields are filled and amounts are valid numbers before submitting to the database.🤝 ContributingWe welcome contributions! If you have suggestions for new features, bug fixes, or improvements, please:Fork the repository.Create a new feature branch (git checkout -b feature/AmazingFeature).Commit your changes (git commit -m 'Add amazing feature').Push to the branch (git push origin feature/AmazingFeature).Open a Pull Request.Design SystemFont: Inter (via Tailwind defaults)Colors: Tailwind Blue (Primary), Green (Income), Red (Expense).UI: Strongly favors rounded corners and elevated card-style layouts.🛣️ Future & SupportPlanned EnhancementsRecurring Transactions: Feature to automatically add monthly or weekly transactions.Budgeting Goals: Ability to set monthly spending limits per category.Date Filtering: Allow filtering transactions by custom date ranges.Troubleshooting GuideIssuePotential CauseSolution"Everything else is broken"Incorrect Firebase initialization timing (exports are undefined).Ensure your Firebase initialization code runs immediately on import and not conditionally inside a window check.Charts show "No data"Transactions are missing or data filtering is too aggressive.Check your Firestore to confirm data exists, and ensure your currency conversion logic is not failing on unexpected values.Login failsFirebase provider not enabled.Verify that Google Sign-In and Email/Password are enabled in your Firebase project console under Authentication > Sign-in method.📜 LicenseDistributed under the MIT License. See LICENSE for more information.Built with ❤️ and designed for financial freedom.
>>>>>>> 1dd4ab71b5be2da6518627f05c779cf665949f53
# 🚀 My Finance Tracker

A personal finance management application built with modern web technologies for tracking expenses, budgets, and financial goals.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.



## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

---

Built with ❤️ for the developer community.
=======
💰 Finance Tracker: Smart Personal Budgeting AppA modern, responsive, and secure personal finance application designed to help you effortlessly track incomes, manage expenses, and visualize your financial health in real-time. Built with React and powered by Google's Firebase.✨ Key Features Highlights⚡ Real-Time Tracking: Instantly see changes to your income, expenses, and net balance.🌍 Multi-Currency Support: Convert and view transactions in USD, INR, CNY, JPY, CAD, and AUD.📊 Powerful Visualization: Analyze spending patterns with interactive Pie Charts and Bar Charts powered by Recharts.🔒 Secure Authentication: Utilizes Firebase Authentication with Google Sign-In and Email/Password options.🗑️ Intuitive Management: Simple interface for adding, updating, and deleting transactions with confirmation modals.🎯 Detailed Features1. Authentication & SecurityThe application is secured using Firebase Authentication.Flexible Login: Users can securely sign in using their Google Account or a standard Email and Password combination.User Isolation: Data (incomes and expenses) is stored in Firestore under a unique user path, ensuring private financial data is isolated and secure.2. Financial TrackingIncome Management: Track various income sources (e.g., Salary, Investment, Gift).Expense Categorization: Categorize expenses for better analysis (e.g., Food, Housing, Utilities, Entertainment).Timestamping: Every transaction is automatically timestamped for accurate record-keeping and filtering.3. Multi-Currency SupportThe application supports currency conversion for comprehensive global finance tracking.Users can select a Display Currency (e.g., USD).All transactions are converted and summarized into the chosen display currency using predefined exchange rates for consolidated reporting.4. Data VisualizationThe Dashboard provides clear, animated visual insights into your finances:Summary Cards: Quick view of Total Income, Total Expense, and Net Balance.Expense Breakdown (Pie Chart): Visualizes spending distribution across categories for the current month.Income vs. Expense (Bar Chart): Compares monthly performance over time.5. User ExperienceFully Responsive: Optimized layout using Tailwind CSS for seamless use on mobile, tablet, and desktop.Animated Transitions: Smooth visual effects are used for loading states and view changes to create an engaging experience.Confirmation Modals: Prevents accidental deletion of financial records.🚀 Getting Started GuideFollow these steps to get a copy of the project up and running on your local machine.PrerequisitesYou need the following installed:Node.js (LTS recommended)npm or yarnA Firebase Project configured with Firestore and Authentication (Google and Email/Password providers enabled).Step-by-step InstallationClone the repository:git clone <your-repo-url>
cd finance-tracker
Install dependencies:npm install
# or
yarn install
Firebase Configuration (Environment Variables):For a production deployment or local development outside of a controlled environment, you would typically use a .env file. Since this app uses a static firebaseConfig block, ensure your Firebase project's keys match the configuration within the main React component file, especially if you plan to share this on GitHub.Note for Canvas/Immersive Users: The application is configured to automatically detect and use the injected environment variables (__app_id, __firebase_config, __initial_auth_token) for seamless operation.Development Server StartupRun the application locally:npm start
# or
yarn start
The application should open automatically in your browser at http://localhost:3000.📖 Usage Guide1. AuthenticationUpon first launch, you will be directed to the login screen:Select "Sign in with Google" for the fastest access.Alternatively, use the Email/Password form to Sign Up or Log In.2. Adding TransactionsFrom the Dashboard, click the "Add Income" (Green) or "Add Expense" (Red) button.Enter the Amount and the Source (for Income) or select a Category (for Expense).Click Add Income/Expense. The transaction will immediately appear on your Dashboard and update your charts.3. Viewing AnalyticsThe Dashboard provides an immediate overview.Use the filter toggle (This Month / All Time) to change the scope of the summary cards and the expense breakdown chart.Scroll down to see Recent Incomes and Recent Expenses lists.4. Currency ManagementUse the dropdown selector in the top-right corner of the header to change the primary display currency (e.g., from USD to INR).All summary totals and converted amounts in the transaction lists will update automatically.🛠️ Technical DocumentationTechnology StackCategoryTechnologyPurposeFrontendReact (V18+)Core JavaScript library for building the user interface.StylingTailwind CSSUtility-first CSS framework for rapid, responsive design.Data VisualizationRechartsReact component library for building highly customizable charts.BackendFirebase FirestoreNoSQL cloud database for real-time transaction storage.AuthenticationFirebase AuthProvides secure user authentication services.IconsLucide-ReactClean, modern icon library for UI elements.Project StructureThe entire application logic is contained within a single App.jsx (or .js) file, following best practices for single-file, deployable React components in certain environments. Key components include:App: Main component handling Firebase initialization and routing (Auth vs. Tracker).AuthScreen: Handles Google and Email/Password sign-in/up.FinanceTracker: Main application wrapper, manages incomes, expenses state, and currency setting.Dashboard: Presents summary, charts, and transaction lists.AddTransactionForm: Component for adding new income or expense records.SummaryCard, ChartContainer, TransactionList: Reusable UI/data components.Available ScriptsIn the project directory, you can run:CommandDescriptionnpm startRuns the app in the development mode. Opens http://localhost:3000 in the browser.npm run buildBuilds the app for production to the build folder.Deployment InstructionsThis application is typically deployed as a static site due to its React frontend.Build: Run npm run build.Host: Upload the contents of the generated build folder to any static hosting service (e.g., Firebase Hosting, Netlify, Vercel).Firebase Rules: Ensure your Firestore Security Rules permit authenticated users to read and write to their specific collections (e.g., /artifacts/{appId}/users/{userId}/incomes).🛡️ Security & Data ModelData Model (Firestore)Data is stored per user for maximum privacy.Collection PathDocument Fields (Example)Description/artifacts/{appId}/users/{userId}/incomesamount, currency, source, timestamp, userIdRecords of all user incomes./artifacts/{appId}/users/{userId}/expensesamount, currency, category, timestamp, userIdRecords of all user expenses.Security FeaturesAuthentication Check: All database operations (reads/writes) are conditional on a successful Firebase Auth user session.Input Validation: Client-side validation ensures fields are filled and amounts are valid numbers before submitting to the database.🤝 ContributingWe welcome contributions! If you have suggestions for new features, bug fixes, or improvements, please:Fork the repository.Create a new feature branch (git checkout -b feature/AmazingFeature).Commit your changes (git commit -m 'Add amazing feature').Push to the branch (git push origin feature/AmazingFeature).Open a Pull Request.Design SystemFont: Inter (via Tailwind defaults)Colors: Tailwind Blue (Primary), Green (Income), Red (Expense).UI: Strongly favors rounded corners and elevated card-style layouts.🛣️ Future & SupportPlanned EnhancementsRecurring Transactions: Feature to automatically add monthly or weekly transactions.Budgeting Goals: Ability to set monthly spending limits per category.Date Filtering: Allow filtering transactions by custom date ranges.Troubleshooting GuideIssuePotential CauseSolution"Everything else is broken"Incorrect Firebase initialization timing (exports are undefined).Ensure your Firebase initialization code runs immediately on import and not conditionally inside a window check.Charts show "No data"Transactions are missing or data filtering is too aggressive.Check your Firestore to confirm data exists, and ensure your currency conversion logic is not failing on unexpected values.Login failsFirebase provider not enabled.Verify that Google Sign-In and Email/Password are enabled in your Firebase project console under Authentication > Sign-in method.📜 LicenseDistributed under the MIT License. See LICENSE for more information.Built with ❤️ and designed for financial freedom.
>>>>>>> 1dd4ab71b5be2da6518627f05c779cf665949f53
