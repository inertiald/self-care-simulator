import '../styles/globals.css'; // Your global styles with Tailwind directives
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute'; // Import the component
import Head from 'next/head'; // For setting global head elements like title

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider> {/* Provides authentication context to the entire app */}
            <Head>
                <title>Self Care Simulator</title> {/* Default title */}
                <meta name="description" content="Your personal journey to better self-care." />
                <link rel="icon" href="/favicon.ico" /> {/* Ensure you have a favicon */}
            </Head>
            <ProtectedRoute> {/* Wraps all page components */}
                <Component {...pageProps} /> {/* The actual page component being rendered */}
            </ProtectedRoute>
        </AuthProvider>
    );
}

export default MyApp;