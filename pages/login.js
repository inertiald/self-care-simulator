import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout'; // Optional: wrap in main layout or use a simpler one

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
            console.error("Login error:", err);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/30 to-accent/30 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-primary">Welcome Back!</h1>
                {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-mediumtext">Email</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-mediumtext">Password</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p className="text-sm text-center text-mediumtext">
                    No account? <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">Sign up</Link>
                </p>
            </div>
        </div>
    );
}