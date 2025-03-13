import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavBarQuest from "../global/NavBarQuest";
import axios from "axios";

const OfficeSurvey = () => {
    const { surveyId, officeId } = useParams();
    const navigate = useNavigate();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const [serviceType, setServiceType] = useState([]);
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
    const [roleType, setRoleType] = useState("");
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
    const [validationErrors, setValidationErrors] = useState({}); // Track validation errors
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false); // Validation modal state
    const [validationMessage, setValidationMessage] = useState(""); // Validation message
    const [survey, setSurvey] = useState(null);
    const [error, setError] = useState(null);
    const [sections, setSections] = useState([]); // Store all sections
    const location = useLocation(); // Get the current location

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
                setSurvey(response.data); // Store full survey data
                setSections(response.data.sections || []); // Store all sections
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
            setServiceType(data); // Store fetched services
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
        const errors = {};
        if (step === 1) {
            // Validate step 1 fields
            if (!clientType) errors.clientType = true;
            if (!roleType) errors.roleType = true;
            if (!sexType) errors.sexType = true;
            if (!collegeType) errors.collegeType = true;
            if (!age) errors.age = true;
            if (!residenceType) errors.residenceType = true;
            if (!selectedService) errors.selectedService = true;
            if (!selectedPersonnel) errors.selectedPersonnel = true;
        } else if (step > 1 && step <= sections.length) {
            // Validate questions in the current section
            const currentSection = sections[step - 2]; // Adjust for zero-based index
            currentSection.questions.forEach(question => {
                if (question.required && !responses[question.id]) {
                    errors[question.id] = true; // Mark as error if required question is not answered
                }
            });
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };

   
    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        } else {
            // If there are validation errors, highlight the required fields
            setValidationErrors((prev) => ({
                ...prev,
                // Add logic to highlight required fields
            }));
        }
    };

    const handleBack = () => {
        if (step === 1) {
            // Navigate to /clientsurvey if on step 1
            navigate("/clientsurvey");
        } else {
            // Go back to the previous step
            setStep(step - 1);
        }
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

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedPersonnel((prevSelected) =>
            checked
                ? [...prevSelected, value] // Add to array if checked
                : prevSelected.filter((person) => person !== value) // Remove if unchecked
        );
    };

    const handleSubmit = async () => {
        
        
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
        const isError = validationErrors[question.id] || false; // Check if there's a validation error
        const inputClass = isError ? "input-error" : ""; // Apply error class if there's a validation error

        switch (question.type) {
            case "radio":
                return (
                    <div className={`radio-group two-row ${inputClass}`}>
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
                    <div className={`checkbox-group ${inputClass}`}>
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
                        className={inputClass}
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
                        className={`textarea-input ${inputClass}`}
                        name={`question_${question.id}`}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Type your answer here..."
                        rows="4"
                    />
                );

            default:
                return <p>Unsupported Question Type</p>;
        }
    };

    return (
        <div className="parent-container-questions">
            <NavBarQuest />
            <div className="headertext">
                <p>{office.name} - {survey?.title}</p>
            </div>
            <div className="stepper-wrapper">
                <div className="stepper-container">
                    <div className="step">
                        <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
                    </div>
                    <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
                    {sections.map((_, index) => (
                        <React.Fragment key={index}>
                            <div className="step">
                                <div className={`step-circle ${step >= index + 2 ? "active" : ""}`}>{index + 2}</div>
                            </div>
                            {index < sections.length - 1 && (
                                <div className={`step-line ${step >= index + 3 ? "active" : ""}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Render Step 1 */}
            {step === 1 && (
                <div className="survey-container-questions">
                    <div className="survey-container-questions-left"> 
                        <div className="instruction-1">
                            <p className="instructions-header2">Client Type:</p>
                            <div className={`radio-group ${validationErrors.clientType ? "input-error" : ""}`}>
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
                                className={`dropdown-select ${validationErrors.roleType ? "input-error" : ""}`} 
                                value={roleType} 
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
                            <div className={`radio-group ${validationErrors.sexType ? "input-error" : ""}`}>
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
                                className={`dropdown-select ${validationErrors.collegeType ? "input-error" : ""}`} 
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
                                type="number" 
                                name="age" 
                                className={`input-full ${validationErrors.age ? "input-error" : ""}`} 
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min="0" 
                                placeholder="Enter your age" 
                            />
                        </div>
                    </div>             
                    <div className="survey-container-questions-right">
                        <div className="instruction-1">
                            <p className="instructions-header2">Region of Residence:</p>
                            <select 
                                className={`dropdown-select ${validationErrors.residenceType ? "input-error" : ""}`} 
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
                            <div className={`radio-group ${validationErrors.selectedService ? "input-error" : ""}`}>
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
                            <div className={`checkbox-group ${validationErrors.selectedPersonnel ? "input-error" : ""}`}>
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

            {/* Render Sections Dynamically */}
            {step > 1 && (
                <div className="survey-container-questions">
                {step === 2 && sections.length > 0 && (
                    <div className="survey-container-questions-left">
                        <div className="instruction-1">
                            <p className="instructions-header">{sections[0].title}</p>
                            <p className="description-body">{sections[0].description}</p>
                        </div>
                        {/* Display the first half of the questions */}
                        {sections[0].questions.slice(0, Math.ceil(sections[0].questions.length / 2)).map((question) => (
                            <div key={question.id} className="instruction-1">
                                <p className={`instructions-header2 ${validationErrors[question.id] ? "input-error" : ""}`}>{question.text}</p>
                                {renderQuestion(question)}
                            </div>
                        ))}
                    </div>
                )}
            
                {step === 2 && sections.length > 0 && (
                    <div className="survey-container-questions-right">
                        {/* Display the second half of the questions */}
                        {sections[0].questions.slice(Math.ceil(sections[0].questions.length / 2)).map((question) => (
                            <div key={question.id} className="instruction-1">
                                <p className={`instructions-header2 ${validationErrors[question.id] ? "input-error" : ""}`}>{question.text}</p>
                                {renderQuestion(question)}
                            </div>
                        ))}
                    </div>
                )}
            
                {step === 3 && sections.length > 1 && (
                    <div className="survey-container-questions-left">
                        <div className="instruction-1">
                            <p className="instructions-header">{sections[1].title}</p>
                            <p className="description-body">{sections[1].description}</p>
                        </div>
                        {/* Display the first half of the questions for section 2 */}
                        {sections[1].questions.slice(0, Math.ceil(sections[1].questions.length / 2)).map((question) => (
                            <div key={question.id} className="instruction-1">
                                <p className={`instructions-header2 ${validationErrors[question.id] ? "input-error" : ""}`}>{question.text}</p>
                                {renderQuestion(question)}
                            </div>
                        ))}
                    </div>
                )}
            
                {step === 3 && sections.length > 1 && (
                    <div className="survey-container-questions-right">
                        {/* Display the second half of the questions for section 2 */}
                        {sections[1].questions.slice(Math.ceil(sections[1].questions.length / 2)).map((question) => (
                            <div key={question.id} className="instruction-1">
                                <p className={`instructions-header2 ${validationErrors[question.id] ? "input-error" : ""}`}>{question.text}</p>
                                {renderQuestion(question)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            )}

            {/* Navigation Buttons */}
            <div className="button-container">
                {step === 1 && (
                    <button className="back-button" onClick={handleBack}>
                        Back
                    </button>
                )}
                {step > 1 && (
                    <button className="back-button" onClick={handleBack}>
                        Back
                    </button>
                )}
                {step < sections.length + 1 ? (
                    <button className="next-button" onClick={handleNext}>
                        Next
                    </button>
                ) : (
                    <button 
                        className="next-button" 
                        onClick={() => {
                            if (validateStep()) {
                                setIsModalOpen(true); // Open the modal if validation passes
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