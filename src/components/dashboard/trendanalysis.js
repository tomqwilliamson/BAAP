// src/components/Dashboard/TrendAnalysis.js - Trend charts and analysis
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function TrendAnalysis({ data }) {
  const categoryData = [
    { subject: 'Code Quality', A: data.categoryScores?.codeQuality || 0, fullMark: 100 },
    { subject: 'Security', A: data.categoryScores?.security || 0, fullMark: 100 },
    { subject: 'Infrastructure', A: data.categoryScores?.infrastructure || 0, fullMark: 100 },
    { subject: 'DevOps Maturity', A: data.categoryScores?.devOpsMaturity || 0, fullMark: 100 },
    { subject: 'Database Optimization', A: data.categoryScores?.databaseOptimization || 0, fullMark: 100 },
    { subject: 'Documentation', A: data.categoryScores?.documentation || 0, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Assessment Categories Radar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={categoryData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrendAnalysis;