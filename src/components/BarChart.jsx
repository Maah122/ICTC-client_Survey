import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample data: Number of responses per office
const data = [
  { office: "Accounting", responses: 35 },
  { office: "Alumni Center", responses: 20 },
  { office: "CED School", responses: 50 },
];

const BarChart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="office" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="responses" fill="#8884d8" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
