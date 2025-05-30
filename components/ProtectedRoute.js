import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from './Layout'; // Import Layout for consistent loading screen

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user && router.pathname !== '/login' && router.pathname !== '/signup') {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || (!user && router.pathname !== '/login' && router.pathname !== '/signup')) {
        return (
            <Layout> {/* Use Layout to show header/footer during load */}
                <div className="flex items-center justify-center h-[calc(100vh-200px)]"> {/* Adjust height based on header/footer */}
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </Layout>
        );
    }
    // Allow access to login/signup pages even if not authenticated
    if (!user && (router.pathname === '/login' || router.pathname === '/signup')) {
        return children;
    }
    // If user is authenticated, or it's an unprotected route that doesn't need this wrapper
    if (user || router.pathname === '/login' || router.pathname === '/signup') {
        return children;
    }


    return null; // Or redirect, though useEffect handles it
};

export default ProtectedRoute;