  import React, { useState, useEffect, useRef } from "react";
  import "./FormBuilder.css";
  import addQ from '../images/173953461355455154.png';
  import addS from '../images/173953461987347320.png';
  import axios from "axios";

  const Button = ({ children, onClick, className }) => {
    return (
      <button onClick={onClick} className={`form-button ${className}`}>
        {children}
      </button>
    );
  };

  const Card = ({ children, className, onClick }) => {
    return (
      <div className={`form-card ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  };

  const formElements = [
    { type: "paragraph", label: "Paragraph", placeholder: "Enter text..." },
    { type: "checkboxes", label: "Checkboxes", options: ["Option 1"] },
    { type: "dropdown", label: "Dropdown", options: ["Option 1"] },
    { type: "radio", label: "Radio Button", options: ["Option 1"] },
  ];

  export default function FormsBuilder({ setSurveyData }) {
    const [form, setForm] = useState([]);
    const [currentPreviewSection, setCurrentPreviewSection] = useState(0);
    const [activeSection, setActiveSection] = useState(1);
    const [showPreview, setShowPreview] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const prevSurveyData = useRef(null);

    useEffect(() => {
      const newSurveyData = {
        id: localStorage.getItem("surveyId") || null, // Ensure ID is stored and retrieved
        title: formTitle,
        description: formDescription,
        sections: form,
      };
    
      if (JSON.stringify(prevSurveyData.current) !== JSON.stringify(newSurveyData)) {
        setSurveyData(newSurveyData);
        prevSurveyData.current = newSurveyData;
      }
    }, [form, formTitle, formDescription, setSurveyData]);
    

    // Load form data from localStorage when the component mounts
    useEffect(() => {
      const savedForm = JSON.parse(localStorage.getItem("form"));
      const savedFormTitle = localStorage.getItem("formTitle");
      const savedFormDescription = localStorage.getItem("formDescription");

      if (savedForm) {
        setForm(savedForm);
      }

      if (savedFormTitle) {
        setFormTitle(savedFormTitle);
      }

      if (savedFormDescription) {
        setFormDescription(savedFormDescription);
      }
    }, []);  // Empty dependency array means this runs only once when the component mounts

    

    // Save form data to localStorage whenever the form state changes
    useEffect(() => {
      if (form.length > 0) {
        localStorage.setItem("form", JSON.stringify(form));
      }
      localStorage.setItem("formTitle", formTitle);
      localStorage.setItem("formDescription", formDescription);
    }, [form, formTitle, formDescription]);

    useEffect(() => {
      fetchSurveyData();
    }, []);

    const fetchSurveyData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/surveys/details");
        console.log("Fetched surveys:", response.data); // Debugging line
    
        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstSurvey = response.data[0];
    
          // Store the survey ID
          localStorage.setItem("surveyId", firstSurvey.id || "");
    
          setFormTitle(firstSurvey.title || "");
          setFormDescription(firstSurvey.description || "");
          setForm(Array.isArray(firstSurvey.sections) ? firstSurvey.sections : []);
    
          // Update local storage with the new survey data
          localStorage.setItem("form", JSON.stringify(firstSurvey.sections));
          localStorage.setItem("formTitle", firstSurvey.title || "");
          localStorage.setItem("formDescription", firstSurvey.description || "");
        } else {
          setForm([]); // Ensure form is always an array
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);
        setForm([]); // Set to an empty array in case of an error
      }
    };
    

    const addSection = () => {
      const newSectionId = form.length + 1;
      const newForm = [
        ...form,
        {
          id: newSectionId,
          title: `Section ${newSectionId}`,
          description: "Enter section description...",
          questions: [] // Initialize as an empty array
        }
      ];
      setForm(newForm);
    };
    

    const addElement = () => {
      const newForm = form.map(section =>
        section.id === activeSection
          ? {
              ...section,
              questions: [
                ...section.questions, // Ensure you are using questions here
                { id: Date.now(), text: "", type: "paragraph", options: [] }
              ]
            }
          : section
      );
      setForm(newForm);
    };

    const removeElement = (sectionId, index) => {
      const newForm = form.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: Array.isArray(section.questions) ? section.questions.filter((_, i) => i !== index) : [] // Check if questions is an array
            }
          : section
      );
      setForm(newForm);
    };

    const updateField = (sectionId, index, field, value) => {
      const newForm = form.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q, i) =>
                i === index ? { ...q, [field]: value } : q
              ),
            }
          : section
      );
      setForm(newForm);
    };  

    const handleTypeChange = (sectionId, index, value) => {
      const newForm = form.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: Array.isArray(section.questions) ? section.questions.map((q, i) =>
                i === index
                  ? {
                      ...q,
                      type: value,
                      options: value === "checkboxes" ? ["Option 1"] : [] // Initialize options based on type
                    }
                  : q
              ) : [] // If questions is not an array, set it to an empty array
            }
          : section
      );
      setForm(newForm);
    };

    const addOption = (sectionId, index) => {
      const newForm = form.map(section =>
        section.id === sectionId
          ? {
              ...section,
              elements: section.elements.map((el, i) =>
                i === index ? { ...el, options: [...el.options, `Option ${el.options.length + 1}`] } : el
              ),
            }
          : section
      );
      setForm(newForm);
    };

    const previewForm = () => {
      setShowPreview(true);
    };

    const removeSection = (sectionId) => {
      const newForm = form.filter(section => section.id !== sectionId);
      setForm(newForm);
    };

    const resetForm = () => {
      // Clear localStorage data
      localStorage.removeItem("form");
      localStorage.removeItem("formTitle");
      localStorage.removeItem("formDescription");
    
      // Reset the state
      setForm([]);
      setFormTitle("");
      setFormDescription("");
      setShowPreview(false); // Optionally hide the preview modal
    };

    return (
      <div className="form-builder-container">
        <div className="title-container-border">
          <input
            type="text"
            className="form-input form-title"
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <textarea
            className="form-textarea form-description"
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
        </div>
        <Button onClick={addSection} className="add-section-button">Add Section</Button>
        <Button onClick={addElement} className="add-question-button">Add Question</Button>
        <Button onClick={previewForm} className="preview-button">Preview Form</Button>
        <Button onClick={resetForm} className="reset-form-button">Reset Form</Button>
        
        <div className="form-elements">
          {Array.isArray(form) && form.map((section) => (
            <Card
              key={section.id}
              className={`form-card form-element-card ${activeSection === section.id ? "active-section" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <button
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(section.id);
                }}
              >
                🗑️
              </button>
              <div className="sub-container-border">
                <input
                  type="text"
                  className="form-input section-title"
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) =>
                    setForm(form.map((s) => (s.id === section.id ? { ...s, title: e.target.value } : s)))
                  }
                />
                <textarea
                  className="form-textarea section-description"
                  placeholder="Section Description"
                  value={section.description}
                  onChange={(e) =>
                    setForm(form.map((s) => (s.id === section.id ? { ...s, description: e.target.value } : s)))
                  }
                />
                {Array.isArray(section.questions) && section.questions.map((question, index) => (
                  <Card key={question.id} className="form-question-card">
                    <div className="action-buttons">
                      <Button onClick={addElement} className="add-question-icon">
                        <img src={addQ} alt="Add Question" className="add-question-img" />
                      </Button>
                      <button className="delete-icon" onClick={() => removeElement(section.id, index)}>
                        🗑️  
                      </button>
                    </div>
                    <div className="question-type-container">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter Question Text"
                        value={question.text}
                        onChange={(e) => updateField(section.id, index, "text", e.target.value)}
                      />
                      <select
                        className="form-select"
                        value={question.type}
                        onChange={(e) => handleTypeChange(section.id, index, e.target.value)}
                      >
                        {formElements.map((opt) => (
                          <option key={opt.type} value={opt.type}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {question.type === "paragraph" && (
                      <textarea className="form-textarea" placeholder="Your answer here..."></textarea>
                    )}

                    {(question.type === "checkboxes" || question.type === "radio" || question.type === "dropdown") && (
                      <>
                        {Array.isArray(question.options) && question.options.map((opt, i) => (
                          <div key={`option-${section.id}-${index}-${i}`} className="form-option">
                            {question.type === "checkboxes" && <input type="checkbox" disabled />}
                            {question.type === "radio" && <input type="radio" disabled />}
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) =>
                                updateField(
                                  section.id,
                                  index,
                                  "options",
                                  [...question.options.slice(0, i), { ...opt, text: e.target.value }, ...question.options.slice(i + 1)]
                                )
                              }
                              className="form-input"
                            />
                          </div>
                        ))}
                        <Button onClick={() => addOption(section.id, index)} className="add-option-button">
                          Add Option
                        </Button>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {showPreview && (
          <div className="preview-modal">
            <div className="preview-content">
              <h2>Form Preview</h2>
              <h1>{formTitle}</h1>
              <p>{formDescription}</p>
              <hr />

              <div key={form[currentPreviewSection].id} className="preview-section">
                <h3>{form[currentPreviewSection].title}</h3>
                <p>{form[currentPreviewSection].description}</p>
                
                {/* Accessing questions correctly */}
                {Array.isArray(form[currentPreviewSection].questions) && form[currentPreviewSection].questions.map((question, index) => (
                  <div key={question.id} className="preview-question">
                    <p>{question.text}</p>

                    {question.type === "paragraph" && (
                      <textarea placeholder="Your answer here..." readOnly></textarea>
                    )}

                    {(question.type === "checkboxes" || question.type === "radio") && (
                      <div>
                        {Array.isArray(question.options) && question.options.map((opt) => (
                          <div key={opt.id}>
                            {question.type === "checkboxes" && <input type="checkbox" disabled />}
                            {question.type === "radio" && <input type="radio" disabled />}
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {question.type === "dropdown" && (
                      <select className="form-select" value={question.selectedOption || ""} onChange={(e) => updateField(form[currentPreviewSection].id, index, "selectedOption", e.target.value)}>
                        {Array.isArray(question.options) && question.options.map((opt) => (
                          <option key={opt.id} value={opt.text}>
                            {opt.text}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="preview-navigation">
                {form.length > 1 && currentPreviewSection > 0 && (
                  <Button
                    onClick={() => setCurrentPreviewSection(currentPreviewSection - 1)}
                    className="preview-nav-button"
                  >
                    Back
                  </Button>
                )}

                {form.length > 1 && currentPreviewSection < form.length - 1 && (
                  <Button
                    onClick={() => setCurrentPreviewSection(currentPreviewSection + 1)}
                    className="preview-nav-button"
                  >
                    Next
                  </Button>
                )}

                <Button onClick={() => setShowPreview(false)} className="close-preview-button">
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }