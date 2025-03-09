import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";

// Office options and survey data
const officeOptions = [
  { id: 1, officeName: "Accounting Division" },
  { id: 2, officeName: "Alumni and Endowment Fund Center" },
  { id: 3, officeName: "CED - Integrated Development School" },
  { id: 4, officeName: "Human Resource Department" },
  { id: 5, officeName: "IT Services Office" },
  { id: 6, officeName: "Research & Development" },
];

const surveyOptions = [
  { id: 1, surveyName: "Employee Satisfaction Survey" },
  { id: 2, surveyName: "Customer Service Evaluation" },
  { id: 3, surveyName: "Workplace Environment Survey" },
  { id: 4, surveyName: "Training Program Assessment" }, 
];

const responseData = [
  { officeId: 1, surveyId: 1, responses: 210, satisfaction: 80, efficiency: 75, engagement: 85 },
  { officeId: 2, surveyId: 1, responses: 160, satisfaction: 85, efficiency: 72, engagement: 79 },
  { officeId: 3, surveyId: 1, responses: 200, satisfaction: 82, efficiency: 79, engagement: 88 },
  { officeId: 4, surveyId: 1, responses: 220, satisfaction: 77, efficiency: 81, engagement: 75 },
  { officeId: 5, surveyId: 1, responses: 230, satisfaction: 79, efficiency: 84, engagement: 82 },
  { officeId: 6, surveyId: 1, responses: 240, satisfaction: 86, efficiency: 79, engagement: 88 },
];

// Helper function to shorten long office names
const shortenText = (text, maxLength = 20) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Custom Tooltip component with responsive width
const CustomTooltip = ({ active, payload, coordinate }) => {
  if (active && payload && payload.length) {
    const { clientX, clientY } = coordinate;
    // Adjust tooltip width based on content length
    const tooltipWidth = Math.min(payload[0].payload.name.length * 8, 250); // 8px per character, with a max width of 250px

    return (
      <div
        style={{
          position: "absolute",
          top: clientY + 10, // Adjust this for vertical positioning
          left: clientX + 10, // Adjust this for horizontal positioning
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          width: tooltipWidth, // Dynamic width based on content
          pointerEvents: "none", // Prevents tooltip from affecting UI
          zIndex: 10,
        }}
      >
        <p style={{ fontWeight: "bold", margin: 0 }}>{payload[0].payload.name}</p>
        <p style={{ margin: 0 }}>Responses: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [chartWidth, setChartWidth] = useState(400);

  useEffect(() => {
    const updateChartWidth = () => {
      setChartWidth(window.innerWidth < 600 ? 300 : 500);
    };
    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  const selectedData = responseData.find(
    (item) => item.officeId == selectedOffice && item.surveyId == selectedSurvey
  );

  const barChartData = responseData
    .filter((item) => item.surveyId == selectedSurvey)
    .map((item) => ({
      name: officeOptions.find((office) => office.id == item.officeId)?.officeName || "Unknown",
      shortName: shortenText(officeOptions.find((office) => office.id == item.officeId)?.officeName || "Unknown"),
      responses: item.responses,
    }));

  const radarData = selectedData
    ? [
        { metric: "Satisfaction", value: selectedData.satisfaction },
        { metric: "Efficiency", value: selectedData.efficiency },
        { metric: "Engagement", value: selectedData.engagement },
      ]
    : [];

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="dashboard-container flex-grow-1 p-4">
          <div className="view-officeresponse d-flex gap-3">
            <select value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
              <option value="">Select an office</option>
              {officeOptions.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.officeName}
                </option>
              ))}
            </select>
            <select value={selectedSurvey} onChange={(e) => setSelectedSurvey(e.target.value)}>
              <option value="">Select a survey</option>
              {surveyOptions.map((survey) => (
                <option key={survey.id} value={survey.id}>
                  {survey.surveyName}
                </option>
              ))}
            </select>
          </div>

          <div className="response-data mt-4">
          {selectedOffice && selectedSurvey ? (
            selectedData ? (
              <>
                <div className="alert alert-info">
                  {officeOptions.find((o) => o.id == selectedOffice)?.officeName} - {surveyOptions.find((s) => s.id == selectedSurvey)?.surveyName}
                </div>
              </>
            ) : (
              <div className="alert alert-warning">No data found for this selection.</div>
            )
          ) : (
            <div className="alert alert-secondary">Please select an office and a survey.</div>
          )}
        </div>

          <div className="d-flex mt-4 gap-4">
          {/* Total Respondents Box */}
          <div className="flex-grow-1 p-3 text-center rounded alert alert-info" style={{ backgroundColor: "#d0e7ff", color: "#333", minWidth: '0' }}>
            <h5>Total Respondents</h5>
            <p className="fs-4 fw-bold">{selectedData ? selectedData.responses : "N/A"}</p>
          </div>

          {/* Empty Gray Box 1 */}
          <div className="flex-grow-1 p-3 text-center rounded alert alert-info" style={{ backgroundColor: "#d3d3d3", color: "#333", minWidth: '0' }}>
          <h5>Placeholder</h5>
          </div>

          {/* Empty Gray Box 2 */}
          <div className="flex-grow-1 p-3 text-center rounded alert alert-info" style={{ backgroundColor: "#d3d3d3", color: "#333", minWidth: '0' }}>
          <h5>Placeholder</h5>
          </div>
        </div>
          {/* Visualization Section */}
          <div className="d-flex mt-4 gap-4 flex-wrap">
            {/* Responsive Bar Chart */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h5>Survey Responses by Office</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={barChartData} barSize={20}>
                  <XAxis type="number" />
                  <YAxis
                    dataKey="shortName"
                    type="category"
                    width={Math.max(100, Math.min(chartWidth / 3, 200))}
                    tick={{ angle: 0 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="responses" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Responsive Radar Chart */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h5>Survey Metrics</h5>
              {selectedData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <Radar name="Metrics" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="alert alert-secondary">Select an office and survey to view metrics.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
