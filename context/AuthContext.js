import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userRef = doc(db, 'users', authUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUser({ uid: authUser.uid, email: authUser.email, ...userSnap.data() });
                } else {
                    // Create new user doc in Firestore
                    const newUserProfile = {
                        uid: authUser.uid,
                        email: authUser.email,
                        createdAt: new Date(),
                        dailyWaterGoal: 8, // Default goal
                        // Initialize other self-care defaults here
                    };
                    await setDoc(userRef, newUserProfile);
                    setUser(newUserProfile);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        setLoading(true);
        await firebaseSignOut(auth);
        setUser(null);
        router.push('/login');
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);