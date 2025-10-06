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
import { Plus, LogOut, ArrowLeft, Trash2, TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react';
import { auth, db, const_app_id, const_initial_auth_token } from '@/lib/firebase';

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
    const [currency, setCurrency] = useState('USD');

    const collectionPath = (collectionName) => `artifacts/${const_app_id || 'default-app-id'}/users/${user.uid}/${collectionName}`;

    useEffect(() => {
        if (!user || !db) return;

        const incomeQuery = query(collection(db, collectionPath('incomes')), orderBy('timestamp', 'desc'));
        const unsubscribeIncomes = onSnapshot(incomeQuery, (snapshot) => setIncomes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

        const expenseQuery = query(collection(db, collectionPath('expenses')), orderBy('timestamp', 'desc'));
        const unsubscribeExpenses = onSnapshot(expenseQuery, (snapshot) => setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

        return () => { unsubscribeIncomes(); unsubscribeExpenses(); };
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
            default: return <Dashboard incomes={incomes} expenses={expenses} setView={setView} handleDelete={handleDeleteTransaction} currency={currency} />;
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
const Dashboard = ({ incomes, expenses, setView, handleDelete, currency }) => {
    const [filter, setFilter] = useState('month');
    const currencySymbol = currencies[currency]?.symbol || '$';

    const filteredData = useMemo(() => {
        if (filter === 'all') return { filteredIncomes: incomes, filteredExpenses: expenses };
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const filteredIncomes = incomes.filter(i => i.timestamp && i.timestamp.toDate() >= startOfMonth);
        const filteredExpenses = expenses.filter(e => e.timestamp && e.timestamp.toDate() >= startOfMonth);
        return { filteredIncomes, filteredExpenses };
    }, [incomes, expenses, filter]);

    const { filteredIncomes, filteredExpenses } = filteredData;

    const totalIncome = filteredIncomes.reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + convert(item.amount, item.currency, currency), 0);
    const balance = totalIncome - totalExpense;

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
                <div className="p-1 bg-gray-200 rounded-lg flex">
                    <button onClick={() => setFilter('month')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'month' ? 'bg-white shadow' : 'text-gray-600'}`}>This Month</button>
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow' : 'text-gray-600'}`}>All Time</button>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setView('add-income')} className="flex items-center px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow"><Plus className="w-5 h-5 mr-2"/> Add Income</button>
                    <button onClick={() => setView('add-expense')} className="flex items-center px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow"><Plus className="w-5 h-5 mr-2"/> Add Expense</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedView delay={100}><SummaryCard title="Total Income" amount={totalIncome} color="green" icon={<TrendingUp />} currencySymbol={currencySymbol} /></AnimatedView>
                <AnimatedView delay={200}><SummaryCard title="Total Expense" amount={totalExpense} color="red" icon={<TrendingDown />} currencySymbol={currencySymbol} /></AnimatedView>
                <AnimatedView delay={300}><SummaryCard title="Balance" amount={balance} color="blue" icon={<LayoutDashboard />} currencySymbol={currencySymbol} /></AnimatedView>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedView delay={400}><ChartContainer title="Expense Breakdown">{expenseByCategory.length > 0 ? (<ResponsiveContainer width="100%" height={300}><PieChart><Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>{expenseByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value) => `${currencySymbol}${value.toFixed(2)}`} /><Legend /></PieChart></ResponsiveContainer>) : <NoDataMessage />}</ChartContainer></AnimatedView>
                <AnimatedView delay={500}><ChartContainer title="Income vs. Expense">{barChartData.length > 0 ? (<ResponsiveContainer width="100%" height={300}><BarChart data={barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => `${currencySymbol}${value.toFixed(2)}`} /><Legend /><Bar dataKey="income" fill="#22c55e" /><Bar dataKey="expense" fill="#ef4444" /></BarChart></ResponsiveContainer>) : <NoDataMessage />}</ChartContainer></AnimatedView>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedView delay={600}><TransactionList title="Recent Incomes" transactions={filteredIncomes.slice(0, 5)} type="income" handleDelete={handleDelete} displayCurrency={currency} /></AnimatedView>
                <AnimatedView delay={700}><TransactionList title="Recent Expenses" transactions={filteredExpenses.slice(0, 5)} type="expense" handleDelete={handleDelete} displayCurrency={currency} /></AnimatedView>
            </div>
        </div>
    );
};

// --- Dashboard Helper Components ---
const SummaryCard = ({ title, amount, color, icon, currencySymbol }) => {
    const textColors = { green: 'text-green-600', red: 'text-red-600', blue: 'text-blue-600' };
    const bgColors = { green: 'bg-green-100', red: 'bg-red-100', blue: 'bg-blue-100' };
    return (
        <div className={`p-6 bg-white rounded-2xl shadow-md flex items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className={`text-3xl font-bold ${textColors[color]}`}>{currencySymbol}{amount.toFixed(2)}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColors[color]} ${textColors[color]}`}>{React.cloneElement(icon, { className: "w-6 h-6" })}</div>
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
                        <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                            <div>
                                <p className="font-medium">{t.source || t.category}</p>
                                <p className="text-sm text-gray-500">{t.timestamp ? t.timestamp.toDate().toLocaleDateString() : 'No date'}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-4 justify-end">
                                    <p className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{currencySymbol}{convertedAmount.toFixed(2)}</p>
                                    <button onClick={() => handleDelete(type, t.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                                </div>
                                {t.currency && t.currency !== displayCurrency && (
                                    <p className="text-xs text-gray-400">({currencies[t.currency]?.symbol}{t.amount.toFixed(2)})</p>
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!amount || (isIncome && !source)) { alert('Please fill all fields'); return; }
        const data = isIncome ? { source, amount } : { category, amount };
        onSubmit(type, data);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-lg mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-gray-100 mr-4"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-gray-900">Add New {isIncome ? 'Income' : 'Expense'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currencies[currency].symbol})</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isIncome ? 'Source' : 'Category'}</label>
                    {isIncome ? (
                        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g., Monthly Salary" className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    ) : (
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    )}
                </div>
                <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">Add {isIncome ? 'Income' : 'Expense'}</button>
            </form>
        </div>
    );
};