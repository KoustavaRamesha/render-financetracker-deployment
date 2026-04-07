'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithCustomToken
} from 'firebase/auth';
import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot,
    serverTimestamp,
    doc,
    deleteDoc,
    orderBy
} from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Plus, LogOut, ArrowLeft, Trash2, TrendingUp, TrendingDown, LayoutDashboard, Search, Bell, Target, Download, RefreshCcw } from 'lucide-react';
import { auth, db, const_app_id, const_initial_auth_token } from '@/lib/firebase';
import { formatNumber } from '@/lib/utils';
import { io } from 'socket.io-client';

// --- CURRENCY & CATEGORY CONSTANTS ---
const currencies = {
    USD: { symbol: '$', name: 'US Dollar', rate: 1 },
    INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.50 },
    CNY: { symbol: '¥', name: 'Chinese Yuan', rate: 7.25 },
    JPY: { symbol: '¥', name: 'Japanese Yen', rate: 157.00 },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.37 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.50 },
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0'];
const incomeCategories = ['Salary', 'Bonus', 'Rent', 'Investment', 'Gift', 'Other'];
const expenseCategories = ['Food', 'Transport', 'Utilities', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Education', 'Other'];

// --- Helper Functions ---
const convert = (amount, from, to) => {
    if (!from || !to || !currencies[from] || !currencies[to] || from === to) return amount;
    const amountInUSD = amount / currencies[from].rate;
    return amountInUSD * currencies[to].rate;
};

// --- Main App Component ---
export default function FinanceTracker() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                // No automatic anonymous sign-in - user must explicitly authenticate
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
            {user ? <FinanceTrackerMain user={user} /> : <AuthScreen />}
        </div>
    );
}

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
);

// --- Animation Wrapper Component ---
const AnimatedView = ({ children, delay = 0 }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {children}
        </div>
    );
};

// --- Authentication Screen Component ---
const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setError('');
            await signInWithPopup(auth, provider);
        } catch (err) {
            if (err.code === 'auth/unauthorized-domain') {
                setError('This domain is not authorized for Firebase authentication. Please add localhost:3000 to Firebase authorized domains in the Firebase Console.');
                console.error('Firebase unauthorized domain error. Please add localhost:3000 to authorized domains:', err);
            } else {
                setError(err.message);
                console.error("Google Sign-In Error:", err);
            }
        }
    };
    
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            if (err.code === 'auth/unauthorized-domain') {
                setError('This domain is not authorized for Firebase authentication. Please add localhost:3000 to Firebase authorized domains in the Firebase Console.');
                console.error('Firebase unauthorized domain error. Please add localhost:3000 to authorized domains:', err);
            } else {
                setError(err.message);
                console.error("Email Auth Error:", err);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <AnimatedView>
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Finance Tracker</h1>
                        <p className="mt-2 text-gray-600">{isLogin ? "Welcome back!" : "Create your account"}</p>
                        <p className="mt-1 text-sm text-gray-500">Sign in to track your finances</p>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                    <form onSubmit={handleEmailAuth} className="space-y-6">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">{isLogin ? 'Log In' : 'Sign Up'}</button>
                    </form>
                    <div className="flex items-center justify-between">
                        <div className="w-full h-px bg-gray-300"></div><span className="px-2 text-sm text-gray-500">OR</span><div className="w-full h-px bg-gray-300"></div>
                    </div>
                    <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                        Sign in with Google
                    </button>
                    <p className="text-sm text-center text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-semibold text-blue-600 hover:underline">{isLogin ? 'Sign Up' : 'Log In'}</button>
                    </p>
                </div>
            </AnimatedView>
        </div>
    );
};

// --- Main Finance Tracker Component ---
const FinanceTrackerMain = ({ user }) => {
    const [view, setView] = useState('dashboard');
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [socket, setSocket] = useState(null);

    const collectionPath = (collectionName) => `artifacts/${const_app_id || 'default-app-id'}/users/${user.uid}/${collectionName}`;

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket as any);
        return () => { newSocket.close(); };
    }, []);

    useEffect(() => {
        if (!user || !db) return;

        const incomeQuery = query(collection(db, collectionPath('incomes')), orderBy('timestamp', 'desc'));
        const unsubscribeIncomes = onSnapshot(incomeQuery, (snapshot) => setIncomes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

        const expenseQuery = query(collection(db, collectionPath('expenses')), orderBy('timestamp', 'desc'));
        const unsubscribeExpenses = onSnapshot(expenseQuery, (snapshot) => setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

        const budgetQuery = query(collection(db, collectionPath('budgets')));
        const unsubscribeBudgets = onSnapshot(budgetQuery, (snapshot) => setBudgets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

        const savingsQuery = query(collection(db, collectionPath('savingsGoals')));
        const unsubscribeSavings = onSnapshot(savingsQuery, (snapshot) => setSavingsGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

        return () => { unsubscribeIncomes(); unsubscribeExpenses(); unsubscribeBudgets(); unsubscribeSavings(); };
    }, [user]);

    const handleAddTransaction = async (type, data) => {
        const collectionName = type === 'income' ? 'incomes' : 'expenses';
        try {
            await addDoc(collection(db, collectionPath(collectionName)), {
                ...data,
                amount: parseFloat(data.amount),
                currency: currency,
                timestamp: serverTimestamp(),
                userId: user.uid
            });
            setView('dashboard');
        } catch (error) {
            console.error(`Error adding ${type}:`, error);
        }
    };
    
    const handleDeleteTransaction = async (type, id) => {
        if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
            const collectionName = type === 'income' ? 'incomes' : 'expenses';
            try {
                await deleteDoc(doc(db, collectionPath(collectionName), id));
            } catch(error) {
                console.error(`Error deleting ${type}:`, error);
            }
        }
    };

    const renderView = () => {
        switch (view) {
            case 'add-income': return <AnimatedView><AddTransactionForm type="income" onSubmit={handleAddTransaction} setView={setView} currency={currency} /></AnimatedView>;
            case 'add-expense': return <AnimatedView><AddTransactionForm type="expense" onSubmit={handleAddTransaction} setView={setView} currency={currency} /></AnimatedView>;
            case 'manage-budgets': return <AnimatedView><BudgetManagement budgets={budgets} onSubmit={(data) => handleAddData('budgets', data)} setView={setView} currency={currency} /></AnimatedView>;
            case 'manage-savings': return <AnimatedView><SavingsManagement savings={savingsGoals} onSubmit={(data) => handleAddData('savingsGoals', data)} setView={setView} currency={currency} /></AnimatedView>;
            default: return <Dashboard incomes={incomes} expenses={expenses} budgets={budgets} savingsGoals={savingsGoals} setView={setView} handleDelete={handleDeleteTransaction} currency={currency} socket={socket} />;
        }
    };

    const handleAddData = async (collectionName, data) => {
        try {
            await addDoc(collection(db, collectionPath(collectionName)), {
                ...data,
                currency,
                userId: user.uid,
                timestamp: serverTimestamp()
            });
            setView('dashboard');
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Header user={user} currency={currency} setCurrency={setCurrency} />
            <main className="mt-6">{renderView()}</main>
        </div>
    );
};

// --- Header Component ---
const Header = ({ user, currency, setCurrency }) => {
    const handleSignOut = async () => {
        try { await signOut(auth); } catch (error) { console.error("Sign Out Error:", error); }
    };

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Finances</h1>
                <p className="text-sm text-gray-500">Welcome, {user.displayName || user.email}</p>
            </div>
            <div className="flex items-center gap-4">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Object.keys(currencies).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
                <button onClick={handleSignOut} className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-all duration-300 transform hover:scale-105">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
            </div>
        </header>
    );
};

// --- Dashboard Component ---
const Dashboard = ({ incomes, expenses, budgets, savingsGoals, setView, handleDelete, currency, socket }) => {
    const [filter, setFilter] = useState('month');
    const [search, setSearch] = useState('');
    const currencySymbol = currencies[currency]?.symbol || '$';

    const filteredData = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        let filteredIncomes = incomes;
        let filteredExpenses = expenses;

        if (filter === 'month') {
            filteredIncomes = incomes.filter(i => i.timestamp && i.timestamp.toDate() >= startOfMonth);
            filteredExpenses = expenses.filter(e => e.timestamp && e.timestamp.toDate() >= startOfMonth);
        }

        const prevIncomes = incomes.filter(i => i.timestamp && i.timestamp.toDate() >= prevMonthStart && i.timestamp.toDate() < startOfMonth);
        const prevExpenses = expenses.filter(e => e.timestamp && e.timestamp.toDate() >= prevMonthStart && e.timestamp.toDate() < startOfMonth);

        if (search) {
            const s = search.toLowerCase();
            filteredIncomes = filteredIncomes.filter(i => (i.source || '').toLowerCase().includes(s) || (i.amount || '').toString().includes(s));
            filteredExpenses = filteredExpenses.filter(e => (e.category || '').toLowerCase().includes(s) || (e.amount || '').toString().includes(s));
        }

        return { filteredIncomes, filteredExpenses, prevIncomes, prevExpenses };
    }, [incomes, expenses, filter, search]);

    const { filteredIncomes, filteredExpenses, prevIncomes, prevExpenses } = filteredData;

    const totalIncome = filteredIncomes.reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);
    const balance = totalIncome - totalExpense;

    const prevTotalIncome = prevIncomes.reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);
    const prevTotalExpense = prevExpenses.reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);

    const incomeDelta = prevTotalIncome ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100 : 0;
    const expenseDelta = prevTotalExpense ? ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100 : 0;

    const expenseByCategory = useMemo(() => {
        const categoryMap = {};
        filteredExpenses.forEach(expense => {
            const convertedAmount = convert(expense.amount, expense.currency, currency);
            categoryMap[expense.category] = (categoryMap[expense.category] || 0) + convertedAmount;
        });
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [filteredExpenses, currency]);

    const barChartData = useMemo(() => {
       const dataMap = {};
       [...filteredIncomes, ...filteredExpenses].forEach(t => {
           if (t.timestamp) {
               const month = t.timestamp.toDate().toLocaleString('default', { month: 'short', year: '2-digit' });
               if (!dataMap[month]) dataMap[month] = { name: month, income: 0, expense: 0 };
               const convertedAmount = convert(t.amount, t.currency, currency);
               if (t.source) dataMap[month].income += convertedAmount;
               else dataMap[month].expense += convertedAmount;
           }
       });
       return Object.values(dataMap).reverse();
    }, [filteredIncomes, filteredExpenses, currency]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <div className="p-1 bg-gray-200 rounded-lg flex">
                        <button onClick={() => setFilter('month')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'month' ? 'bg-white shadow' : 'text-gray-600'}`}>This Month</button>
                        <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow' : 'text-gray-600'}`}>All Time</button>
                    </div>
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <button onClick={() => setView('add-income')} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow"><Plus className="w-4 h-4 mr-2"/> Income</button>
                    <button onClick={() => setView('add-expense')} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow"><Plus className="w-4 h-4 mr-2"/> Expense</button>
                    <button onClick={() => setView('manage-budgets')} className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow"><Bell className="w-4 h-4 mr-2"/> Budgets</button>
                    <button onClick={() => setView('manage-savings')} className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow"><Target className="w-4 h-4 mr-2"/> Savings</button>
                    <CSVExport data={[...filteredIncomes, ...filteredExpenses]} currency={currency} />
                </div>
            </div>

            {/* AI Insight Banner */}
            {incomeDelta > 0 && expenseDelta > incomeDelta && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                    <TrendingUp className="text-blue-600 w-5 h-5" />
                    <p className="text-blue-800 text-sm">Insight: Your expenses are growing faster ({expenseDelta.toFixed(1)}%) than your income ({incomeDelta.toFixed(1)}%) this month. Consider checking your budgets.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedView delay={100}><SummaryCard title="Total Income" amount={totalIncome} delta={incomeDelta} color="green" icon={<TrendingUp />} currencySymbol={currencySymbol} /></AnimatedView>
                <AnimatedView delay={200}><SummaryCard title="Total Expense" amount={totalExpense} delta={expenseDelta} color="red" icon={<TrendingDown />} currencySymbol={currencySymbol} /></AnimatedView>
                <AnimatedView delay={300}><SummaryCard title="Balance" amount={balance} color="blue" icon={<LayoutDashboard />} currencySymbol={currencySymbol} /></AnimatedView>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Progress Section */}
                <AnimatedView delay={350}>
                    <div className="bg-white p-6 rounded-2xl shadow-md h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Budget Progress</h3>
                            <button onClick={() => setView('manage-budgets')} className="text-blue-600 text-sm hover:underline">Edit Budgets</button>
                        </div>
                        <div className="space-y-6">
                            {budgets.length > 0 ? budgets.map(budget => {
                                const spent = filteredExpenses.filter(e => e.category === budget.category).reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);
                                const convertedBudget = convert(budget.amount, budget.currency || 'USD', currency);
                                const percentage = Math.min((spent / convertedBudget) * 100, 100);
                                const isOver = spent > convertedBudget;
                                const isWarning = percentage > 80;
                                
                                if (isWarning && socket) socket.emit('notification', `Warning: You have used ${percentage.toFixed(0)}% of your ${budget.category} budget!`);

                                return (
                                    <div key={budget.id} className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-700">{budget.category}</span>
                                            <span className={isOver ? 'text-red-600' : 'text-gray-500'}>
                                                {currencySymbol}{formatNumber(spent)} / {currencySymbol}{formatNumber(convertedBudget)}
                                                {isOver && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">OVER</span>}
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                            <div className={`h-full transition-all duration-500 ease-out ${isOver ? 'bg-red-500' : (isWarning ? 'bg-amber-500' : 'bg-green-500')}`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            }) : <NoDataMessage />}
                        </div>
                    </div>
                </AnimatedView>

                {/* Savings Goals Section */}
                <AnimatedView delay={370}>
                    <div className="bg-white p-6 rounded-2xl shadow-md h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Savings Goals</h3>
                            <button onClick={() => setView('manage-savings')} className="text-blue-600 text-sm hover:underline">Manage Goals</button>
                        </div>
                        <div className="space-y-6">
                            {savingsGoals.length > 0 ? savingsGoals.map(goal => {
                                const convertedCurrent = convert(goal.currentAmount, goal.currency || 'USD', currency);
                                const convertedTarget = convert(goal.targetAmount, goal.currency || 'USD', currency);
                                const progress = Math.min((convertedCurrent / convertedTarget) * 100, 100);
                                return (
                                    <div key={goal.id} className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-700">{goal.name}</span>
                                            <span className="text-gray-500">{currencySymbol}{formatNumber(convertedCurrent)} of {currencySymbol}{formatNumber(convertedTarget)}</span>
                                        </div>
                                        <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                                            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-right text-gray-400">{progress.toFixed(0)}% achieved</p>
                                    </div>
                                );
                            }) : <NoDataMessage />}
                        </div>
                    </div>
                </AnimatedView>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedView delay={400}><ChartContainer title="Expense Breakdown">{expenseByCategory.length > 0 ? (<ResponsiveContainer width="100%" height={300}><PieChart><Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>{expenseByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value) => `${currencySymbol}${formatNumber(value)}`} /><Legend /></PieChart></ResponsiveContainer>) : <NoDataMessage />}</ChartContainer></AnimatedView>
                <AnimatedView delay={500}><ChartContainer title="Income vs. Expense">{barChartData.length > 0 ? (<ResponsiveContainer width="100%" height={300}><BarChart data={barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => `${currencySymbol}${formatNumber(value)}`} /><Legend /><Bar dataKey="income" fill="#22c55e" /><Bar dataKey="expense" fill="#ef4444" /></BarChart></ResponsiveContainer>) : <NoDataMessage />}</ChartContainer></AnimatedView>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedView delay={600}><TransactionList title="Recent Incomes" transactions={filteredIncomes.slice(0, 5)} type="income" handleDelete={handleDelete} displayCurrency={currency} /></AnimatedView>
                <AnimatedView delay={700}><TransactionList title="Recent Expenses" transactions={filteredExpenses.slice(0, 5)} type="expense" handleDelete={handleDelete} displayCurrency={currency} /></AnimatedView>
            </div>
        </div>
    );
};

// --- Dashboard Helper Components ---
const SummaryCard = ({ title, amount, color, icon, currencySymbol, delta }) => {
    const textColors = { green: 'text-green-600', red: 'text-red-600', blue: 'text-blue-600' };
    const bgColors = { green: 'bg-green-100', red: 'bg-red-100', blue: 'bg-blue-100' };
    const borderColors = { green: 'border-green-500', red: 'border-red-500', blue: 'border-blue-500' };
    return (
        <div className={`p-6 bg-white rounded-2xl shadow-md border-b-4 ${borderColors[color]} transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className={`text-3xl font-bold ${textColors[color]}`}>{currencySymbol}{formatNumber(amount)}</p>
                    {delta !== undefined && delta !== 0 && (
                        <p className={`text-xs mt-1 font-semibold ${delta >= 0 ? (color === 'red' ? 'text-red-500' : 'text-green-600') : (color === 'red' ? 'text-green-600' : 'text-red-500')}`}>
                            {delta >= 0 ? '↑' : '↓'}{Math.abs(delta).toFixed(1)}% vs last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${bgColors[color]} ${textColors[color]}`}>{React.cloneElement(icon, { className: "w-6 h-6" })}</div>
            </div>
        </div>
    );
};

const ChartContainer = ({ title, children }) => (<div className="bg-white p-6 rounded-2xl shadow-md"><h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>{children}</div>);
const NoDataMessage = () => (<div className="flex items-center justify-center h-[300px] text-gray-500"><p>No data available for this period.</p></div>);

const TransactionList = ({ title, transactions, type, handleDelete, displayCurrency }) => {
    const currencySymbol = currencies[displayCurrency]?.symbol || '$';
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {transactions.length > 0 ? transactions.map(t => {
                    const convertedAmount = convert(t.amount, t.currency, displayCurrency);
                    return (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100 border border-transparent hover:border-gray-200">
                            <div className="flex items-center gap-3">
                                {t.isRecurring && <RefreshCcw className="w-4 h-4 text-blue-500" strokeWidth={3} />}
                                <div>
                                    <p className="font-semibold flex items-center gap-2">
                                        {t.source || t.category}
                                        {t.isRecurring && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Recurring</span>}
                                    </p>
                                    <p className="text-xs text-gray-400">{t.timestamp ? t.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-3 justify-end">
                                    <p className={`font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{currencySymbol}{formatNumber(convertedAmount)}</p>
                                    <button onClick={() => handleDelete(type, t.id)} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4"/></button>
                                </div>
                                {t.currency && t.currency !== displayCurrency && (
                                    <p className="text-[10px] text-gray-400">({currencies[t.currency]?.symbol}{formatNumber(t.amount)})</p>
                                )}
                            </div>
                        </div>
                    );
                }) : <p className="text-gray-500 text-sm">No recent transactions.</p>}
            </div>
        </div>
    );
};

// --- Add Transaction Form Component ---
const AddTransactionForm = ({ type, onSubmit, setView, currency }) => {
    const isIncome = type === 'income';
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(expenseCategories[0]);
    const [source, setSource] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState('monthly');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!amount || (isIncome && !source)) { alert('Please fill all fields'); return; }
        const data = isIncome ? { source, amount, isRecurring, frequency } : { category, amount, isRecurring, frequency };
        onSubmit(type, data);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto border border-gray-100">
            <div className="flex items-center mb-6">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-gray-100 mr-4 transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-900">Add New {isIncome ? 'Income' : 'Expense'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currencies[currency].symbol})</label>
                    <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isIncome ? 'Source' : 'Category'}</label>
                    {isIncome ? (
                        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g., Monthly Salary" className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                    ) : (
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all">
                            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    )}
                </div>
                <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Recurring Transaction?</label>
                        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </div>
                    {isRecurring && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Frequency</label>
                            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    )}
                </div>
                <button type="submit" className="w-full py-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-200">Add {isIncome ? 'Income' : 'Expense'}</button>
            </form>
        </div>
    );
};

// --- Budget Management Component ---
const BudgetManagement = ({ budgets, onSubmit, setView, currency }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(expenseCategories[0]);
    const currencySymbol = currencies[currency]?.symbol || '$';
    
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto border border-gray-100">
            <div className="flex items-center mb-6">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-gray-100 mr-4"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-900">Set Monthly Budget</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit({ category, amount: parseFloat(amount) }); }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                        {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit ({currencySymbol})</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <button type="submit" className="w-full py-4 font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-300">Save Budget</button>
            </form>
            <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Existing Budgets</h3>
                <div className="space-y-2">
                    {budgets.map(b => {
                        const convertedAmount = convert(b.amount, b.currency || 'USD', currency);
                        return (
                            <div key={b.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{b.category}</span>
                                <span className="text-gray-600 font-bold">{currencySymbol}{formatNumber(convertedAmount)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Savings Management Component ---
const SavingsManagement = ({ savings, onSubmit, setView, currency }) => {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [current, setCurrent] = useState('');
    const currencySymbol = currencies[currency]?.symbol || '$';

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto border border-gray-100">
            <div className="flex items-center mb-6">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-gray-100 mr-4"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-900">New Savings Goal</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, targetAmount: parseFloat(target), currentAmount: parseFloat(current) }); }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. New Car" className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ({currencySymbol})</label>
                    <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Progress ({currencySymbol})</label>
                    <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <button type="submit" className="w-full py-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300">Create Goal</button>
            </form>
        </div>
    );
};

// --- Export Helper ---
const CSVExport = ({ data, currency }) => {
    const exportCSV = () => {
        const headers = ['Type', 'Category/Source', 'Amount', 'Currency', 'Date', 'Recurring'];
        const rows = data.map(t => [
            t.source ? 'Income' : 'Expense',
            t.source || t.category,
            t.amount,
            t.currency || currency,
            t.timestamp ? t.timestamp.toDate().toISOString() : '',
            t.isRecurring ? 'Yes' : 'No'
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <button onClick={exportCSV} className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
            <Download className="w-4 h-4 mr-2" /> Export
        </button>
    );
};