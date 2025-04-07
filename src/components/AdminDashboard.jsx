  import Navbar from "../global/NavBar";
  import AdminSidebar from "../global/AdminSideBar";
  import { getUserFromToken } from "../utils/auth";
  import React, { useState, useEffect } from "react";
  import axios from "axios"; // Import Axios
  import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";

  // Helper function to shorten long office names
  const shortenText = (text, maxLength = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const officeNameToCode = {
    "Accounting Division": "AD",
    "Alumni and Endowment Fund Center": "AEFC",
    "Cashiering Division": "CD",
    "CED - Integrated Development School": "CED-IDS",
    "Center for Advanced Education and Lifelong Learning": "CAELL",
    "Center for Information and Communication Technology": "CICT",
    "College of Education": "COE",
    "Hostel": "HSTL",
    "Human Resource Management Division": "HRMD",
    "Infrastructure Services Division": "ISD",
    "Knowledge and Technology Transfer Office": "KTTO",
    "Legal Services Office": "LSO",
    "MSU-IIT Center for Resiliency": "C4R",
    "Natural Science Museum": "NSM",
    "Office of Admissions, Scholarships and Grants": "OASG",
    "Office of Guidance and Counseling": "OGC",
    "Office of Medical, Dental and Health Services": "OMDHS",
    "Office of Monitoring and Evaluation": "OME",
    "Office of Sports Development": "OSD",
    "Office of Student Development Services": "OSDS",
    "Office of the Campus Secretary": "OCS",
    "Office of the University Registrar": "OUR",
    "Procurement Management Division": "PMD",
    "Security and Investigation Division": "SID",
    "Supply and Property Management Division": "SPMD",
    "University Library": "UL",
    "WE CARE Office": "WECARE"
  };

  const CustomTooltip = ({ active, payload, coordinate }) => {
    if (active && payload && payload.length) {
      const { clientX, clientY } = coordinate;
      const tooltipWidth = Math.min(payload[0].payload.name?.length * 8, 250);
      return (
        <div
          style={{
            position: "absolute",
            top: clientY + 10,
            left: clientX + 10,
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            width: tooltipWidth,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <p style={{ fontWeight: "bold", margin: 0 }}>{payload[0].payload.name}</p>
          <p style={{ margin: 0 }}>Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };  

  

  const AdminDashboard = () => {
    const user = getUserFromToken();
    const isLimited = user?.user_rights === "Limited";
    const [officeOptions, setOfficeOptions] = useState([]);
    const [surveyOptions, setSurveyOptions] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState("");
    const [selectedSurvey, setSelectedSurvey] = useState("");
    const [chartWidth, setChartWidth] = useState(400);
    const [totalRespondents, setTotalRespondents] = useState(null); // State to hold total respondents
    const [responseData, setResponseData] = useState([]); // State to hold fetched response data
    const [answerData, setAnswerData] = useState([]);


    useEffect(() => {
      const updateChartWidth = () => {
        setChartWidth(window.innerWidth < 600 ? 300 : 500);
      };
      updateChartWidth();
      window.addEventListener("resize", updateChartWidth);
      return () => window.removeEventListener("resize", updateChartWidth);
    }, []);

    const fetchOffices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/offices");
        const allOffices = response.data;
    
        if (isLimited) {
          // Get office codes from user
          const userOfficeCodes = user.office.split(",").map(code => code.trim());
    
          // Filter office list using the mapping
          const matched = allOffices.filter((office) => {
            const code = officeNameToCode[office.name];
            return userOfficeCodes.includes(code);
          });
    
          setOfficeOptions(matched);
    
          if (matched.length === 1) {
            setSelectedOffice(matched[0].id);
          }
        } else {
          setOfficeOptions(allOffices);
        }
      } catch (err) {
        console.error("Error loading offices:", err);
      }
    };       

    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/surveys");
        console.log("Fetched surveys:", response.data); // ← Add this line
        setSurveyOptions(response.data);
      } catch (err) {
        console.error("Error loading surveys:", err);
      }
    };    

    const fetchTotalRespondents = async (officeId, surveyId) => {
      try {
        const endpoint = officeId ? `http://localhost:5000/api/responses/${officeId}/${surveyId}` : `http://localhost:5000/api/responses/all/${surveyId}`;
        const response = await axios.get(endpoint);
        setTotalRespondents(response.data.length);
        setResponseData(response.data);
      } catch (err) {
        console.error("Error fetching total respondents:", err);
      }
    };
    
    const fetchAnswerData = async (officeId, surveyId) => {
      try {
        const endpoint = officeId ? `http://localhost:5000/api/answers/${officeId}/${surveyId}` : `http://localhost:5000/api/answers/all/${surveyId}`;
        const response = await axios.get(endpoint);
        console.log("Fetched answer data:", response.data);
        setAnswerData(response.data);
      } catch (err) {
        console.error("Error fetching answer data:", err);
      }
    };        

    useEffect(() => {
      fetchOffices(); // Call the fetch function for offices
      fetchSurveys(); // Call the fetch function for surveys
    }, []);

    useEffect(() => {
      if (selectedSurvey) {
        fetchTotalRespondents(selectedOffice, selectedSurvey);
        fetchAnswerData(selectedOffice, selectedSurvey);
      }
    }, [selectedOffice, selectedSurvey]);

    const optionSets = [
      {
        label: "Visibility",
        options: [
          { text: "Easy to see" },
          { text: "Somewhat easy to see" },
          { text: "Difficult to see" },
          { text: "Not visible at all" },
          { text: "N/A" }
        ]
      },
      {
        label: "Helpfulness",
        options: [
          { text: "Helped very much" },
          { text: "Somewhat helped" },
          { text: "Did not help" },
          { text: "N/A" }
        ]
      },
      {
        label: "CC Awareness",
        options: [
          { text: "I know what a CC is and I saw this office’s CC." },
          { text: "I know what a CC is but I did NOT see this office’s CC." },
          { text: "I learned of the CC only when I saw this office’s CC." },
          { text: "I do not know what a CC is and I did not see one in this office. (Answer ‘N/A’ on CC2 and CC3)" }
        ]
      }
    ];
    
    const formatCombinedChartData = () => {
      let combined = [];
    
      optionSets.forEach(({ label, options }) => {
        options.forEach(option => {
          const count = answerData.filter(ans => ans.text.trim() === option.text).length;
          combined.push({
            category: label,
            name: option.text,
            count
          });
        });
      });
    
      return combined;
    };

    const chart1Data = formatCombinedChartData();

    const q4Options = [
      "Strongly Agree",
      "Agree",
      "Neither Agree nor Disagree",
      "Disagree",
      "Strongly Disagree",
      "Not Applicable"
    ];
    
    const chart2Data = q4Options.map(label => ({
      name: label,
      count: answerData.filter(ans => ans.text.trim() === label).length
    }));

    console.log("fetched total Responsnes", totalRespondents);
    
    return (
      <div>
        <Navbar />
        <div className="d-flex">
          <AdminSidebar />
          <div className="dashboard-container flex-grow-1 p-4">
            <div className="view-officeresponse d-flex gap-3">
              <select value={selectedOffice} onChange={(e) => setSelectedOffice(Number(e.target.value))}>
                <option value="">Select an office</option>
                {officeOptions.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
              <select value={selectedSurvey} onChange={(e) => setSelectedSurvey(Number(e.target.value))}>
                <option value="">Select a survey</option>
                {surveyOptions.map((survey) => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>

              <div className="response-data mt-4">
                {surveyOptions.length > 0 && (
                  <div className="alert alert-info">
                    {selectedOffice ? 
                      `${officeOptions.find((o) => o.id === Number(selectedOffice))?.name} - ${surveyOptions.find((s) => s.id === Number(selectedSurvey))?.title}` 
                      : `All Offices - ${surveyOptions.find((s) => s.id === Number(selectedSurvey))?.title}`
                    }
                  </div>
                )}
              </div>

            <div className="d-flex mt-4 gap-4">
              <div className="flex-grow-1 p-3 text-center rounded alert alert-info" style={{ backgroundColor: "#d0e7ff", color: "#333", minWidth: '0' }}>
                <h5>Total Responses </h5>
                <p className="fs-4 fw-bold">{totalRespondents !== null ? totalRespondents : "Loading..."}</p>
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
              {/* Bar Chart for Q1: Visibility, Helpfulness, and CC Awareness */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <h5>Q1–Q3: Visibility, Helpfulness, CC Awareness</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chart1Data}>
                    <XAxis dataKey="name" tickFormatter={(name) => shortenText(name, 15)} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart for Q4: Agreement Levels */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <h5>Q4: Agreement Levels</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={chart2Data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <Tooltip content={<CustomTooltip />} />
                    <Radar name="Responses" dataKey="count" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AdminDashboard;