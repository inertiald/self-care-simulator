import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config'; // Your Firebase config
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image'; // Optional: if you have a logo

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState(''); // Optional: for user's name
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password should be at least 6 characters long.");
            return;
        }
        if (!displayName.trim()) {
            setError("Please enter your name.");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const authUser = userCredential.user;

            // Store additional user information in Firestore
            const userRef = doc(db, 'users', authUser.uid);
            await setDoc(userRef, {
                uid: authUser.uid,
                email: authUser.email,
                displayName: displayName.trim(),
                createdAt: serverTimestamp(), // Use Firestore server timestamp
                dailyWaterGoal: 8, // Default goal for the Self Care app
                // Initialize other default self-care settings here
                // e.g., sleepGoal: 8, activityGoal: 30 (minutes)
            });

            router.push('/'); // Redirect to dashboard or a "welcome" page
        } catch (err) {
            // Handle Firebase errors more gracefully
            if (err.code === 'auth/email-already-in-use') {
                setError('This email address is already in use.');
            } else if (err.code === 'auth/weak-password') {
                setError('The password is too weak.');
            } else {
                setError(err.message.replace("Firebase: ", ""));
            }
            console.error("Signup error:", err);
        }
        setLoading(false);
    };

    return (