import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, onSnapshot, Timestamp, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2'; // For historical chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WaterPage() {
    const { user } = useAuth();
    const [waterIntakeToday, setWaterIntakeToday] = useState(0);
    const [log, setLog] = useState([]);
    const [dailyGoal, setDailyGoal] = useState(8);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogging, setIsLogging] = useState(false);
    const [customAmount, setCustomAmount] = useState(1);
    const [historicalData, setHistoricalData] = useState(null);

    const todayStr = new Date().toISOString().split('T')[0];

    // Fetch user's daily water goal and initialize
    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists() && docSnap.data().dailyWaterGoal) {
                    setDailyGoal(docSnap.data().dailyWaterGoal);
                }
            }).catch(error => console.error("Error fetching daily goal:", error));
        }
    }, [user]);

    // Fetch and listen to water logs for today
    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        const waterLogCollection = collection(db, 'users', user.uid, 'waterLogs');
        const q = query(waterLogCollection, where("date", "==", todayStr), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const logsData = [];
            let totalToday = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                logsData.push({ id: doc.id, ...data, timestamp: data.timestamp.toDate() });
                totalToday += data.amount;
            });
            setLog(logsData);
            setWaterIntakeToday(totalToday);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching water logs: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, todayStr]);

    // Fetch historical data for chart (e.g., last 7 days)
    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            const history = {};
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const currentGoal = userDocSnap.data()?.dailyWaterGoal || 8;

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                history[dateStr] = { logged: 0, goal: currentGoal }; // Assume goal is constant for simplicity or fetch daily if it changes

                const q = query(collection(db, 'users', user.uid, 'waterLogs'), where("date", "==", dateStr));
                const daySnap = await getDocs(q);
                daySnap.forEach(logDoc => history[dateStr].logged += logDoc.data().amount);
            }
            setHistoricalData({
                labels: Object.keys(history),
                datasets: [
                    {
                        label: 'Water Intake (glasses)',
                        data: Object.values(history).map(d => d.logged),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Tailwind primary
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Daily Goal (glasses)',
                        data: Object.values(history).map(d => d.goal),
                        type: 'line',
                        borderColor: 'rgba(255, 99, 132, 0.8)', // Accent color
                        fill: false,
                        tension: 0.1,
                    }
                ]
            });
        };
        fetchHistory();
    }, [user]);


    const handleLogWater = async (amount) => {
        if (!user || amount <= 0 || isLogging) return;
        setIsLogging(true);
        const newEntry = {
            amount: Number(amount),
            timestamp: Timestamp.now(),
            date: todayStr,
        };
        try {
            await addDoc(collection(db, 'users', user.uid, 'waterLogs'), newEntry);
        } catch (error) {
            console.error("Error adding water log: ", error);
            alert("Failed to log water.");
        }
        setIsLogging(false);
    };

    const handleUpdateGoal = async () => {
        const newGoal = parseFloat(prompt("Enter new daily water goal (glasses):", dailyGoal));
        if (!user || isNaN(newGoal) || newGoal <= 0) {
            alert("Invalid goal amount.");
            return;
        }
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, { dailyWaterGoal: newGoal }, { merge: true });
            setDailyGoal(newGoal);
            alert("Goal updated successfully!");
        } catch (error) {
            console.error("Error updating goal: ", error);
            alert("Failed to update goal.");
        }
    };

    const waterLevelPercentage = dailyGoal > 0 ? Math.min((waterIntakeToday / dailyGoal) * 100, 100) : 0;

    if (isLoading) {
        return <Layout><div className="flex items-center justify-center h-64 text-primary font-semibold">Loading water data... <div className="ml-3 w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div></Layout>;
    }

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Tracker and Actions */}
                <div className="lg:w-[40%] bg-white p-5 sm:p-6 rounded-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
                        <Image src="/images/icons/water.svg" alt="Water Icon" width={32} height={32} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Water Intake</h1>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-3xl sm:text-4xl font-bold text-primary">
                            {waterIntakeToday.toFixed(1)} <span className="text-xl text-mediumtext">/ {dailyGoal} glasses</span>
                        </p>
                        <p className="text-sm text-mediumtext mt-1">Today's Progress</p>
                    </div>

                    {/* Dynamic Water Bottle Visual */}
                    <div className="w-28 sm:w-32 h-52 sm:h-60 mx-auto border-2 border-gray-300 rounded-t-3xl rounded-b-lg relative mb-2 bg-gray-100 overflow-hidden shadow-inner">
                        <div
                            className="absolute bottom-0 w-full bg-blue-400 transition-all duration-700 ease-out"
                            style={{ height: `${waterLevelPercentage}%` }}
                        >
                            {waterLevelPercentage > 10 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold opacity-70">
                                    {waterLevelPercentage.toFixed(0)}%
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div className="bg-primary h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${waterLevelPercentage}%` }}></div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <h3 className="text-md font-semibold text-gray-700">Log Your Water:</h3>
                        <div className="flex items-stretch space-x-2">
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(Math.max(0.1, parseFloat(e.target.value)))}
                                min="0.1" step="0.1"
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                            <button onClick={() => handleLogWater(customAmount)} disabled={isLogging} className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow hover:shadow-md disabled:opacity-60">
                                {isLogging ? 'Logging...' : `Log ${customAmount} ${customAmount === 1 ? "glass" : "glasses"}`}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {[0.5, 1, 1.5].map(amount => (
                                <button key={amount} onClick={() => handleLogWater(amount)} disabled={isLogging} className="px-2 py-1.5 bg-blue-100 text-primary-dark rounded-md hover:bg-blue-200 transition-colors disabled:opacity-60">+{amount}</button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleUpdateGoal} className="w-full text-sm py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                        Update Daily Goal ({dailyGoal} glasses)
                    </button>
                </div>

                {/* Right Column: Log and Info/Chart */}
                <div className="lg:w-[60%] space-y-6">
                    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Today's Intake Log:</h3>
                        {log.length === 0 && !isLoading ? (
                            <p className="text-mediumtext italic">No water logged yet today. Stay hydrated! 💧</p>
                        ) : (
                            <ul className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                                {log.map((entry) => (
                                    <li key={entry.id} className="flex justify-between items-center p-2.5 bg-lightbg rounded-lg text-sm shadow-sm">
                                        <span className="font-medium text-darktext">{entry.amount.toFixed(1)} glass(es)</span>
                                        <span className="text-xs text-lighttext">{entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Hydration Habits (Last 7 Days)</h3>
                        {historicalData ? (
                            <div className="h-64 sm:h-72"> {/* Constrain chart height */}
                                <Bar data={historicalData} options={{ maintainAspectRatio: false, responsive: true, scales: { y: { beginAtZero: true }} }} />
                            </div>
                        ) : <p className="text-mediumtext">Loading chart data...</p>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}