import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Header() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-app py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo.svg" alt="Self Care Sim Logo" width={40} height={40} /> {/* Your Canva Logo */}
                    <span className="font-semibold text-xl text-primary">SelfCareSim</span>
                </Link>
                <nav className="flex items-center space-x-3 sm:space-x-5">
                    {!loading && user && (
                        <>
                            <Link href="/" className={`text-mediumtext hover:text-primary transition-colors ${router.pathname === '/' ? 'text-primary font-medium' : ''}`}>Dashboard</Link>
                            <Link href="/water" className={`text-mediumtext hover:text-primary transition-colors ${router.pathname === '/water' ? 'text-primary font-medium' : ''}`}>Water</Link>
                            {/* Add other links similarly */}
                            <Link href="/activity-rest" className={`text-mediumtext hover:text-primary transition-colors ${router.pathname === '/activity-rest' ? 'text-primary font-medium' : ''}`}>Activity/Rest</Link>
                        </>
                    )}
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : user ? (
                        <button
                            onClick={logout}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="text-mediumtext hover:text-primary transition-colors text-sm sm:text-base">Login</Link>
                            <Link href="/signup" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-accent text-white text-sm rounded-md hover:bg-accent-dark transition-colors">
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}