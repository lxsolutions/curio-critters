
import React, { useState, useEffect } from 'react';
import { get, set } from "idb-keyval";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ParentalDashboard = () => {
  const [userData, setUserData] = useState(null);
  const userId = userData ? userData.userId : null;
  const token = userData ? userData.token : null;
  const [learningMetrics, setLearningMetrics] = useState([]);
  const [petCareLogs, setPetCareLogs] = useState([]);
  const [questProgress, setQuestProgress] = useState([]);

  // Load user data from localStorage or IndexedDB
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);

        // Load metrics from backend with authentication
        try {
          const response = await fetch(`/api/users/${parsedUser.userId}/metrics`, {
            headers: { 'Authorization': `Bearer ${parsedUser.token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setLearningMetrics(data);
          } else {
            // Fallback to IndexedDB
            const pending = await get("pendingMetrics");
            if (pending) {
              setLearningMetrics([pending]);
            }
          }
        } catch (error) {
          console.error('Error loading learning metrics:', error);
        }

        // Load pet care logs from backend with authentication
        try {
          const response = await fetch(`/api/users/${parsedUser.userId}/pet-care-logs`, {
            headers: { 'Authorization': `Bearer ${parsedUser.token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setPetCareLogs(data);
          }
        } catch (error) {
          console.error('Error loading pet care logs:', error);
        }

        // Load quest progress from backend with authentication
        try {
          const response = await fetch(`/api/quests/user/${parsedUser.userId}`, {
            headers: { 'Authorization': `Bearer ${parsedUser.token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setQuestProgress(data);
          }
        } catch (error) {
          console.error('Error loading quest progress:', error);
        }
      }
    };

    loadUserData();
  }, []);

  // Sync any pending data when back online
  useEffect(() => {
    const handleOnline = async () => {
      const pendingMetrics = await get("pendingMetrics");
      if (pendingMetrics) {
        try {
          await fetch('/api/users/1/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingMetrics)
          });
          await set("pendingMetrics", null);
        } catch (error) {
          console.error('Error syncing metrics:', error);
        }
      }

      const pendingProgress = await get("pendingProgress");
      if (pendingProgress) {
        try {
          await fetch('/api/progress/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingProgress)
          });
          await set("pendingProgress", null);
        } catch (error) {
          console.error('Error syncing progress:', error);
        }
      }

      const pendingPetCare = await get("pendingPetCare");
      if (pendingPetCare) {
        try {
          await fetch('/api/users/1/pet-care-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingPetCare)
          });
          await set("pendingPetCare", null);
        } catch (error) {
          console.error('Error syncing pet care logs:', error);
        }
      }
    };

    if (navigator.onLine) {
      handleOnline();
    }

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Render loading state while data is being loaded
  if (!userData) {
    return (
      <div className="loading-container flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
      {/* Dashboard Header */}
      <div className="dashboard-header mb-8">
        <h1 className="text-3xl font-bold text-white">Parental Dashboard</h1>
        <p className="text-lg text-indigo-200 mt-2">Welcome, {userData.username}'s Parent!</p>
      </div>

      <div className="dashboard-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Learning Progress Card */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Learning Progress</h2>
          <div className="chart-container h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={learningMetrics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average_score" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pet Care Logs Card */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Pet Care Activity</h2>
          <ul className="pet-care-logs h-64 overflow-y-auto pr-2">
            {petCareLogs.length > 0 ? (
              petCareLogs.map((log, index) => (
                <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100 mb-3 last:border-b-0">
                  <div>
                    <p className="text-sm text-gray-700">{new Date(log.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{log.activity} with {log.petName}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No pet care activities yet</p>
            )}
          </ul>
        </div>

        {/* Quest Progress Card */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Quest Progress</h2>
          {questProgress.length > 0 ? (
            questProgress.map((quest, index) => (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg shadow-inner">
                <p className="text-sm font-semibold text-indigo-700">{quest.name}</p>
                <progress
                  className="w-full h-2 mt-1 bg-gray-200 rounded"
                  value={quest.progress}
                  max="100"
                ></progress>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No quests completed yet</p>
          )}
        </div>
      </div>

      {/* Offline Sync Status */}
      <div className="offline-sync mt-8 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Offline Sync Status</h2>
        {navigator.onLine ? (
          <p className="text-sm text-green-600 flex items-center">
            ✅ Online - All data is synced
          </p>
        ) : (
          <p className="text-sm text-yellow-600 flex items-center">
                            📶 Offline - Data will sync when back online
                          </p>
        )}
      </div>
    </div>
  );
};

export default ParentalDashboard;
