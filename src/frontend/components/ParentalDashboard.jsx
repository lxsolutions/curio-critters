
import React, { useState, useEffect } from 'react';
import { get, set } from "idb-keyval";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ParentalDashboard = () => {
  const [userData, setUserData] = useState(null);
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
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!userData) {
    return (
      <div className="parental-dashboard min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-white">Loading parental dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="parental-dashboard min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-8">
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

        {/* Pet Care Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Pet Care Activity</h2>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {petCareLogs.length > 0 ? (
              petCareLogs.map((log, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{log.action}</span>
                  <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pet care activities recorded yet.</p>
            )}
          </ul>
        </div>

        {/* Quest Progress Card */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Quest Progress</h2>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {questProgress.length > 0 ? (
              questProgress.map((quest, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{quest.quest_id}</span>
                  <span className={`text-xs ${quest.completed ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                    {quest.completed ? 'Completed ✓' : 'In Progress'}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No quests completed yet.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section mt-12 bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Learning Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Progress */}
          <div className="progress-card bg-indigo-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-indigo-700">Overall Progress</h3>
            <p className="text-2xl font-bold mt-2 text-indigo-600">85%</p>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="progress-card bg-indigo-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-indigo-700">Strengths</h3>
            <ul className="mt-2 space-y-1">
              {learningMetrics.slice(0, 3).map((metric, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-sm text-gray-700">{metric.topic}</span>
                  <span className="ml-auto text-xs font-semibold text-green-600">⭐ {metric.average_score.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="progress-card bg-indigo-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-indigo-700">Areas to Improve</h3>
            <ul className="mt-2 space-y-1">
              {learningMetrics.slice(-3).map((metric, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-sm text-gray-700">{metric.topic}</span>
                  <span className="ml-auto text-xs font-semibold text-red-500">⚠️ {metric.average_score.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
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
