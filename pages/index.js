import Layout from '../components/Layout';
import RequisiteCard from '../components/RequisiteCard';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, limit, orderBy, doc } from 'firebase/firestore';
import Image from 'next/image'; // For illustrations

// Define your requisites data
const selfCareRequisitesList = [
    { id: 'air', name: 'Air', description: 'Maintaining sufficient intake of air.', icon: '/images/icons/air.svg', link: '/air', statusKey: 'airStatus' },
    { id: 'water', name: 'Water', description: 'Ensuring adequate intake of water.', icon: '/images/icons/water.svg', link: '/water', statusKey: 'waterIntakePercentage' },
    { id: 'food', name: 'Food', description: 'Maintaining a sufficient intake of food.', icon: '/images/icons/food.svg', link: '/food', statusKey: 'foodStatus' },
    // ... Add all 8 requisites with appropriate 'statusKey' for fetching data
    { id: 'activity-rest', name: 'Activity & Rest', description: 'Balancing activity and rest.', icon: '/images/icons/activity.svg', link: '/activity-rest', statusKey: 'activityBalance' },
    { id: 'solitude-social', name: 'Solitude & Social', description: 'Balancing solitude and social interaction.', icon: '/images/icons/social.svg', link: '/solitude-social', statusKey: 'socialBalance' },
    { id: 'hazard-prevention', name: 'Hazard Prevention', description: 'Preventing hazards to human life.', icon: '/images/icons/hazard.svg', link: '/hazard-prevention', statusKey: 'hazardCheck' },
    { id: 'normality-promotion', name: 'Promotion of Normality', description: 'Promoting human functioning.', icon: '/images/icons/normality.svg', link: '/normality-promotion', statusKey: 'normalityProgress' },
];


export default function HomePage() {
    const { user } = useAuth();
    const [requisiteStatuses, setRequisiteStatuses] = useState({});
    const [loadingStatuses, setLoadingStatuses] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user) {
            // Attempt to get a display name, fallback to email part
            setUserName(user.displayName || user.email?.split('@')[0] || 'User');

            const fetchAllStatuses = async () => {
                setLoadingStatuses(true);
                const statuses = {};
                const today = new Date().toISOString().split('T')[0];

                // Example: Fetch Water Status
                if (selfCareRequisitesList.find(r => r.id === 'water')) {
                    const waterLogCollection = collection(db, 'users', user.uid, 'waterLogs');
                    const qWater = query(waterLogCollection, where("date", "==", today));
                    const waterSnapshots = await getDocs(qWater);
                    let totalWaterToday = 0;
                    waterSnapshots.forEach(doc => totalWaterToday += doc.data().amount);
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    const waterGoal = userDocSnap.data()?.dailyWaterGoal || 8;
                    statuses.waterIntakePercentage = Math.min((totalWaterToday / waterGoal) * 100, 100).toFixed(0);
                }

                // TODO: Implement fetching logic for other statuses similarly
                // statuses.foodStatus = await fetchFoodStatus(user.uid, today);
                // statuses.activityBalance = await fetchActivityBalance(user.uid, today);
                // For now, mock others
                statuses.airStatus = "Good";
                statuses.foodStatus = "Tracked";
                statuses.activityBalance = "Balanced";


                setRequisiteStatuses(statuses);
                setLoadingStatuses(false);
            };
            fetchAllStatuses();
        }
    }, [user]);

    if (!user) return null; // ProtectedRoute handles redirect

    return (
        <Layout>
            <div className="mb-8 p-6 bg-gradient-to-r from-primary to-blue-400 rounded-xl shadow-lg text-white">
                <h1 className="text-3xl md:text-4xl font-bold">Welcome, {userName}!</h1>
                <p className="mt-1 text-lg opacity-90">Your personal self-care dashboard.</p>
            </div>

            {/* Overall Progress - Placeholder for a nice Canva graphic or chart */}
            <div className="mb-10 p-6 bg-white rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overall Well-being Snapshot</h2>
                <div className="w-full max-w-lg mx-auto h-56 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image src="/images/illustrations/dashboard-placeholder.svg" alt="Overall Status" width={350} height={200} />
                </div>
                <p className="mt-3 text-mediumtext">Visualizing your journey to a balanced life.</p>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Your Self-Care Requisites</h2>
            {loadingStatuses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => ( // Shimmer placeholders
                        <div key={i} className="bg-white p-5 rounded-xl shadow-md animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6">
                    {selfCareRequisitesList.map(req => (
                        <RequisiteCard
                            key={req.id}
                            name={req.name}
                            description={req.description}
                            icon={req.icon}
                            link={req.link}
                            status={requisiteStatuses[req.statusKey]}
                        />
                    ))}
                </div>
            )}
        </Layout>
    );
}