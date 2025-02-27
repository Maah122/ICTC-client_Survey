import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBarQuest from "../global/NavBarQuest";
import axios from "axios";


const surveyQuestions3Optional = [
    { name: "comment", type: "text", label: "To better improve our service, please state your comments/suggestions and the issues you have encountered below:", placeholder: "Your answer" },
    { name: "email", type: "email", label: "Email address (optional):", placeholder: "Your answer" },
    { name: "contact", type: "text", label: "Mobile Number (optional):", placeholder: "Your answer" }
];


const OfficeSurvey = () => {
    const { surveyId, officeId } = useParams();
    const navigate = useNavigate();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const [serviceType, setserviceType] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [otherServiceType, setOtherServicesType] = useState("");
    const [age, setAge] = useState("");
    const [personnelList, setPersonnelList] = useState([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState([]);
    const [step, setStep] = useState(1); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [roles, setRoles] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [regions, setRegions] = useState([]);
    const [roleType, setRoleType] = useState([]);
    const [clientType, setClientType] = useState("");
    const [sexType, setSexType] = useState("");
    const [collegeType, setCollegeType] = useState("");
    const [residenceType, setResidenceType] = useState("");
    const [comment, setComment] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [selectedSurveyId, setSelectedSurveyId] = useState(null);
    const [selectedOfficeId, setSelectedOfficeId] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [responseId, setResponseId] = useState(null);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [survey, setSurvey] = useState(null);
    const [error, setError] = useState(null);
    const [section1, setSection1] = useState(null);
    const [section2, setSection2] = useState(null);

    useEffect(() => {
        const fetchOffice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/offices/${officeId}`);
                setOffice(response.data);
            } catch (error) {
                console.error("Error fetching office:", error);
                setOffice(null);
            } finally {
                setLoading(false);
            }
        };

        if (officeId) {
            fetchOffice();
            fetchServices();
            fetchPersonnel();
        } else {
            setLoading(false);
        }
    }, [officeId]);

    useEffect(() => {
        setSelectedSurveyId(surveyId);
        setSelectedOfficeId(officeId);
    }, [surveyId, officeId]);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/surveys/${surveyId}`);
                console.log(response.data);
    
                setSurvey(response.data); // Store full survey data
    
                // Ensure sections exist before accessing them
                if (response.data.sections && response.data.sections.length > 1) {
                    setSection1(response.data.sections[0]); // Get Section 1
                    setSection2(response.data.sections[1]); // Get Section 2
                } else if (response.data.sections && response.data.sections.length === 1) {
                    setSection1(response.data.sections[0]); // Only Section 1 exists
                    setSection2(null); // No Section 2
                } else {
                    setSection1(null);
                    setSection2(null);
                }
            } catch (err) {
                console.error("Error fetching survey:", err);
                setError("Failed to load survey");
            } finally {
                setLoading(false);
            }
        };
    
        fetchSurvey();
    }, [surveyId]); // Re-run when surveyId changes
    


    const fetchServices = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/offices/${officeId}/services`);
            const data = await response.json();
            setserviceType(data); // Store fetched services
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };
  
    const fetchPersonnel = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/offices/${officeId}/personnel`);
            const data = await response.json();
            setPersonnelList(data); // Store fetched personnel list
        } catch (error) {
            console.error("Error fetching personnel:", error);
        }
    };

    useEffect(() => {
        // Fetch roles
        axios.get("http://localhost:5000/api/infos/roles")
            .then(response => setRoles(response.data))
            .catch(error => console.error("Error fetching roles:", error));

        // Fetch colleges
        axios.get("http://localhost:5000/api/infos/colleges")
            .then(response => setColleges(response.data))
            .catch(error => console.error("Error fetching colleges:", error));

        // Fetch regions
        axios.get("http://localhost:5000/api/infos/regions")
            .then(response => setRegions(response.data))
            .catch(error => console.error("Error fetching regions:", error));
    }, []);     

      const validateStep = () => {
        if (step === 1) {
            // Validate step 1 fields
            if (!clientType || !roleType || !sexType || !collegeType || !age || !residenceType || !selectedService) {
                setValidationMessage("Please fill in all required fields in Step 1.");
                setIsValidationModalOpen(true);
                return false;
            }
        } else if (step === 2) {
            // Validate step 2 fields
            const allAnswered = section1.questions.every(question => {
                return responses[question.id]; // Check if each question has a response
            });
            if (!allAnswered) {
                setValidationMessage("Please answer all questions in Step 2.");
                setIsValidationModalOpen(true);
                return false;
            }
        } else if (step === 3) {
            // Validate step 3 fields
            const allAnswered = section2.questions.every(question => {
                return responses[question.id]; // Check if each question has a response
            });
            if (!allAnswered) {
                setValidationMessage("Please answer all questions in Step 3.");
                setIsValidationModalOpen(true);
                return false;
            }
        }
        return true; // All validations passed
    };
   
    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };
    const handleBack = () => setStep(step - 1);

    const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
  
      setSelectedPersonnel((prevSelected) =>
        checked
          ? [...prevSelected, value] // Add to array if checked
          : prevSelected.filter((person) => person !== value) // Remove if unchecked
      );
    };

    const handleAnswerChange = (questionId, value) => {
        setResponses((prev) => ({ ...prev, [questionId]: value }));
        setSelectedAnswers((prev) => {
            const existingAnswerIndex = prev.findIndex(answer => answer.questionId === questionId);
            if (existingAnswerIndex > -1) {
                // Update existing answer
                const updatedAnswers = [...prev];
                updatedAnswers[existingAnswerIndex] = { questionId, value };
                return updatedAnswers;
            } else {
                // Add new answer
                return [...prev, { questionId, value }];
            }
        });
    };
    

    const handleSubmit = async () => {
        // // Validate all required fields before submission
        // if (!validateStep()) {
        //     return; // If validation fails, do not proceed with submission
        // }
    
        // Trim and convert roleType to lowercase
        roleType.trim().toLowerCase();
    
        console.log("Submitting with these answers:", {
            survey_id: selectedSurveyId,
            office_id: selectedOfficeId,
            type: clientType,
            role: roleType,
            sex: sexType.toLowerCase(),
            age: age,
            region: residenceType,
            email: email,
            phone: phone,
            comment: comment,
            answers: selectedAnswers.map(answer => ({ questionId: answer.questionId, answer: answer.value })),
        });
    
        try {
            const response = await axios.post("http://localhost:5000/api/responses/submit", {
                survey_id: selectedSurveyId,
                office_id: selectedOfficeId,
                type: clientType,
                role: roleType,
                sex: sexType,
                age: age,
                region: residenceType,
                email: email,
                phone: phone,
                comment: comment,
                answers: selectedAnswers,
            });
    
            console.log("Response Data:", response);
            const id = response.data.response_id; // Adjust based on your actual response structure
            setResponseId(id);
            setIsSuccessModalOpen(true); // Open the success modal
            setIsModalOpen(false); // Close the previous modal
        } catch (error) {
            console.error("Error submitting survey response:", error.response?.data || error.message);
            alert("Failed to submit survey response.");
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
        navigate("/clientsurvey"); // Navigate to /clientsurvey after closing the modal
    };
        
    
    if (loading) {
        return <h2>Loading office details...</h2>;
    }

    if (!office) {
        return <h2>Office not found!</h2>;
    }

    const renderQuestion = (question) => {
        switch (question.type) {
            case "radio":
                return (
                    <div className="radio-group two-row">
                        {question.options.map((option) => (
                            <label key={option.id}>
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={option.text}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                />
                                {option.text}
                            </label>
                        ))}
                    </div>
                );
    
            case "checkboxes":
                return (
                    <div className="checkbox-group">
                        {question.options.map((option) => (
                            <label key={option.id}>
                                <input
                                    type="checkbox"
                                    name={`question_${question.id}`}
                                    value={option.text}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.checked ? option.text : "")}
                                />
                                {option.text}
                            </label>
                        ))}
                    </div>
                );
    
            case "dropdown":
                return (
                    <select
                        name={`question_${question.id}`}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    >
                        <option value="">Select an option</option>
                        {question.options.map((option) => (
                            <option key={option.id} value={option.text}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                );
    
            case "paragraph":
                return (
                    <textarea
                        name={`question_${question.id}`}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Type your answer here..."
                        rows="4"
                        className="textarea-input"
                    />
                );
    
            default:
                return <p>Unsupported Question Type</p>;
        }
    };
    

    return (
        <div className="parent-container-questions">
          <NavBarQuest/>
          <div className="headertext">
            <p>{office.name} - Client Satisfaction Measurement Survey</p>
          </div>
           {/* Stepper Header */}
           <div className="stepper-wrapper">
            <div className="stepper-container">
            <div className="step">
                <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
            </div>
            <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
            <div className="step">
                <div className={`step-circle ${step >= 2 ? "active" : ""}`}>2</div>
            </div>
            <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
            <div className="step">
                <div className={`step-circle ${step >= 3 ? "active" : ""}`}>3</div>
            </div>
            </div>
            </div>
                    {step === 1 && (
                <div className="survey-container-questions">
                                {/* Left Side - Client Type with Radio Buttons */}
                        <div className="survey-container-questions-left">
                            <div className="instruction-1">
                                <p className="instructions-header2">Client Type:</p>
                                <div className="radio-group">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="Citizen" 
                                            checked={clientType === "Citizen"}
                                            onChange={(e) => setClientType(e.target.value)}
                                        />
                                        Citizen
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="Business" 
                                            checked={clientType === "Business"}
                                            onChange={(e) => setClientType(e.target.value)}
                                        />
                                        Business
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="Government" 
                                            checked={clientType === "Government"}
                                            onChange={(e) => setClientType(e.target.value)}
                                        />
                                        Government (Employee or another agency)
                                    </label>
                                </div>
                            </div>
                            <div className="instruction-1">
                                <p className="instructions-header2">I am a/an:</p>
                                <select 
                                    className="dropdown-select" 
                                    value={roleType} // Ensure roleType is a scalar value
                                    onChange={(e) => setRoleType(e.target.value)}
                                >
                                    <option value="">-- Select One --</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="instruction-1">
                                <p className="instructions-header2">Sex at Birth:</p>
                                <div className="radio-group">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="sexType" 
                                            value="male" 
                                            checked={sexType === "male"}
                                            onChange={(e) => setSexType(e.target.value)}
                                        />
                                        Male
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="sexType" 
                                            value="female" 
                                            checked={sexType === "female"}
                                            onChange={(e) => setSexType(e.target.value)}
                                        />
                                        Female
                                    </label>
                                </div>
                            </div>
                            <div className="instruction-1">
                            <p className="instructions-header2">Your Office/College:</p>
                            <select 
                                className="dropdown-select" 
                                value={collegeType} 
                                onChange={(e) => setCollegeType(e.target.value)}
                            >
                                <option value="">-- Select One --</option>
                                {colleges.map((college) => (
                                    <option key={college.id} value={college.name}>
                                        {college.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                            <div className="instruction-1">
                                <p className="instructions-header2">Your Age:</p>
                                <input 
                                type="number"  // Enforce numeric input
                                name="age" 
                                className="input-full"  // Add class for styling
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min="0" // Prevents negative age input
                                placeholder="Enter your age" // Adds a placeholder for better UX
                                />
                            </div>
                        </div>             
                        <div className="survey-container-questions-right">
                        <div className="instruction-1">
                            <p className="instructions-header2">Region of Residence:</p>
                            <select 
                                className="dropdown-select" 
                                value={residenceType} 
                                onChange={(e) => setResidenceType(e.target.value)}
                            >
                                <option value="">-- Select One --</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.name}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                                    <div className="instruction-1">
                                <p className="instructions-header2">Service Availed:</p>
                                <div className="radio-group">
                                    {serviceType.map((service) => (
                                        <label key={service.id}>
                                            <input
                                                type="radio"
                                                name="serviceType"
                                                value={service.name}
                                                checked={selectedService === service.name}
                                                onChange={(e) => setSelectedService(e.target.value)}
                                            />
                                            {service.name}
                                        </label>
                                    ))}
                                    <label className="radio-option other-option">
                                    <input 
                                        type="radio" 
                                        name="serviceType" 
                                        value="Other" 
                                        checked={selectedService === "Other"}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                    />
                                    Other
                                    {/* The text field is always visible */}
                                    <input 
                                        type="text" 
                                        className="other-textfield"
                                        placeholder="Please specify"
                                        value={otherServiceType}
                                        onChange={(e) => setOtherServicesType(e.target.value)}
                                    />
                                </label>
                                </div>
                            </div>
                            <div className="instruction-1">
                            <p>Personnel you transacted with:</p>
                            <div className="checkbox-group">
                                {personnelList.map((person) => (
                                    <label key={person.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="personnel"
                                            value={person.name}
                                            checked={selectedPersonnel.includes(person.name)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {person.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                        )}

                    {step === 2 && section1 && (
                        <div className="survey-container-questions">
                            <div className="survey-container-questions-left">
                                <div className="instruction-1">
                                    <p className="instructions-header">{section1.title}</p>
                                    <p className="description-body">{section1.description}</p>
                                </div>

                                {section1.questions.slice(0, 2).map((question) => (
                                    <div key={question.id} className="instruction-1">
                                        <p className="instructions-header2">{question.text}</p>
                                        {renderQuestion(question)}
                                    </div>
                                ))}
                            </div>

                            <div className="survey-container-questions-right">
                                {section1.questions.length > 2 && (
                                    <div key={section1.questions[2].id} className="instruction-1">
                                        <p className="instructions-header2">{section1.questions[2].text}</p>
                                        {renderQuestion(section1.questions[2])}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}




                    {step === 3 && section2 && (
                        <div className="survey-container-questions">
                            <div className="survey-container-questions-left">
                                <div className="instruction-1">
                                    <p className="instructions-header">{section2.title}</p>
                                    <p className="description-body">{section2.description}</p>
                                </div>

                                {section2.questions.slice(0, Math.ceil(section2.questions.length / 2)).map((question) => (
                                    <div key={question.id} className="instruction-1">
                                        <p className="instructions-header2">{question.text}</p>
                                        {renderQuestion(question)}
                                    </div>
                                ))}
                            </div>

                            <div className="survey-container-questions-right">
                                {section2.questions.slice(Math.ceil(section2.questions.length / 2)).map((question) => (
                                    <div key={question.id} className="instruction-1">
                                        <p className="instructions-header2">{question.text}</p>
                                        {renderQuestion(question)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}




                     {/* Navigation Buttons */}
                     <div className="button-container">
                    {step > 1 && (
                        <button className="back-button show" onClick={handleBack}>
                        Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button className="next-button" onClick={handleNext}>
                            Next
                        </button>
                    ) : (
                        <button 
                            className="next-button" 
                            onClick={() => {
                                if (validateStep()) {
                                    setIsModalOpen(true); // Open the modal if validation passes
                                } else {
                                    alert("Please fill in all required fields before submitting."); // Alert if validation fails
                                }
                            }} 
                        >
                            Submit
                        </button>
                    )}
                    </div>
                    {/* Success Modal */}
                    {isSuccessModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2 className="modal-title">Submission Successful</h2>
                                <p className="modal-text">
                                    Survey response submitted successfully! Your reference number is {responseId}.
                                </p>
                                <div className="modal-buttons">
                                    <button className="confirm-btn" onClick={closeSuccessModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation Modal */}
                    {isValidationModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2 className="modal-title">Validation Error</h2>
                                <p className="modal-text">{validationMessage}</p>
                                <div className="modal-buttons">
                                    <button className="confirm-btn" onClick={() => setIsValidationModalOpen(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2 className="modal-title">MSU-IIT Client Satisfaction Survey</h2>

                                <div className="modal-body">
                                    <p className="modal-text">
                                        Dear Students, Faculty Members, and Staff,
                                    </p>
                                    <p className="modal-text">
                                        We highly encourage you to participate in the MSU-IIT Client Satisfaction Survey 
                                        to help us improve our services and better address your needs. Your feedback is 
                                        essential in ensuring that we provide quality support and continuously enhance 
                                        the university's processes.
                                    </p>
                                    <p className="modal-text">
                                        Before proceeding, please confirm your agreement with the Data Privacy Act of 2012:
                                    </p>
                                </div>

                                <label className="modal-checkbox1">
                                    <input type="checkbox" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
                                    <span>I have read and agree to the terms and conditions in compliance with the Data Privacy Act of 2012.</span>
                                </label>
                                
                                <div className="modal-buttons">
                                    <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button 
                                        className={`confirm-btn ${isAgreed ? "active" : "disabled"}`} 
                                        onClick={handleSubmit} 
                                        disabled={!isAgreed}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
        </div>
      );
};

export default OfficeSurvey;