import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#42a5f5", "#90caf9"]; // Blue tones for Verified/Not Verified

function StatusPieChart({ refreshTrigger }) {
  const [data, setData] = useState([]);

  const fetchChartData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all");
      const users = res.data;

      if (users.length === 0) {
        setData([]);
        return;
      }

      const verified = users.filter((u) => u.status?.verified).length;
      const notVerified = users.length - verified;

      setData([
        { name: "Verified", value: verified },
        { name: "Not Verified", value: notVerified },
      ]);
    } catch (err) {
      console.error("Failed to fetch chart data", err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [refreshTrigger]);

  return (
    <div style={{
      width: "100%",
      height: 320,
      margin: "30px 0",
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      padding: "16px"
    }}>
      <h3 style={{
        textAlign: "center",
        marginBottom: "20px",
        color: "#0d47a1"
      }}>
        Verification Status Overview
      </h3>

      {data.length > 0 ? (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#42a5f5"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" iconType="circle" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center", color: "#999", marginTop: "60px" }}>
          No data available to display chart.
        </p>
      )}
    </div>
  );
}

export default StatusPieChart;
