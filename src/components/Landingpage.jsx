
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../App.css";
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../global/NavBar";
import banner from "../images/banner.png";
import axios from "axios";

const description = [
    "As we journey towards influencing the future, the Office of the Vice-Chancellor for Strategic Initiatives (OVCSI), through the Office of Monitoring and Evaluation (OME), conducts a semestral performance evaluation of internal and external services of the offices in the University. This survey will definitely help the management improve the delivery of its services to the clientele.",
    "In view of this, we would like to know and gather your thoughts on how a particular office has served your needs and met your satisfaction in terms of the services you have availed by taking time in answering this survey. Your objective and honest answer in this survey will be highly appreciated.",
    "This Client Satisfaction Measurement (CSM) tracks the customer experience of government offices. Your feedback on your recently concluded transaction will help this office provide a better service. Personal information shared will be kept confidential and you always have the option to not answer this form.",
    "Let us journey together to a greater MSU-IIT!"
  ];
  
const LandingPage = () => {
    const navigate = useNavigate();
    const [selectedOffice, setSelectedOffice] = useState("");
    const [offices, setOffices] = useState([]);

    //fetch offices from backend
    useEffect(() => {
        const fetchOffices = async () => {
          try {
            const response = await fetch("http://localhost:5000/api/offices");
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched offices:", data); // Debugging
            setOffices(data);
          } catch (error) {
            console.error("Error fetching offices:", error);
          }
        };
      
        fetchOffices();
      }, []);
      

      const handleNext = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/surveys"); // Fetch all surveys
            const surveys = response.data;
    
            // Find the first survey where status is true
            const activeSurvey = surveys.find(survey => survey.status === true);
    
            if (!activeSurvey) {
                alert("No active surveys available.");
                return;
            }
    
            if (selectedOffice) {
                navigate(`/office/${selectedOffice}/survey/${activeSurvey.id}`);
            } else {
                alert("Please select an office first.");
            }
        } catch (error) {
            console.error("Error fetching surveys:", error.response?.data || error.message);
            alert("Failed to check survey status.");
        }
    };
    
    
    return (
        <div>
            <Navbar/>
            <div className="survey-container">
            {/* Header Banner */}
            <div className="banner">
                <img src={banner} alt="Client Satisfaction Measurement" className="banner-img" />
            </div>

            {/* Survey Description */}
            <div className="survey-content">
                {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
                ))}

                {/* Survey Dropdown */}
                <h3>Client Satisfactory Survey</h3>
                <div className="survey-dropdown">
                <select value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
                <option value="">-- Choose --</option>
                {offices.map((office) => (
                    <option key={office.id} value={office.id}>{office.name}</option>
                ))}
            </select>
                </div>
                <button className="next-btn"  onClick={handleNext}> Next </button>
            </div>
            </div>
        </div>
    );
};

export default LandingPage;
