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

export default function FormsBuilder({ surveyId, setSurveyData }) {
  const [form, setForm] = useState([]);
  const [currentPreviewSection, setCurrentPreviewSection] = useState(0);
  const [activeSection, setActiveSection] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const prevSurveyData = useRef(null);
  const isEditing = useRef(false); // Flag to track if we are editing

  // Fetch survey data when the component mounts or when surveyId changes
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (surveyId) {
          try {
              const response = await axios.get(`http://localhost:5000/api/surveys/${surveyId}`);
              const surveyData = response.data;
  
              // Normalize options here
              const normalizedSections = surveyData.sections.map(section => ({
                  ...section,
                  questions: section.questions.map(question => ({
                      ...question,
                      options: question.options.map(opt => ({
                          id: opt.id, // Ensure ID is included
                          text: opt.text,
                      }))
                  }))
              }));
  
              setForm(normalizedSections);
              setFormTitle(surveyData.title || "");
              setFormDescription(surveyData.description || "");
              isEditing.current = true; // Set editing flag
          } catch (error) {
              console.error("Error fetching survey data:", error);
              alert("Failed to fetch survey data. Please try again.");
          }
      }
  };

    fetchSurveyData();
  }, [surveyId]); // Only run this effect when surveyId changes

  useEffect(() => {
    const newSurveyData = {
      id: surveyId, // Use the survey ID from props
      title: formTitle,
      description: formDescription,
      sections: form,
    };

    console.log("Sending payload:", newSurveyData); // ✅ Log payload

    if (JSON.stringify(prevSurveyData.current) !== JSON.stringify(newSurveyData)) {
      prevSurveyData.current = newSurveyData;
        setSurveyData(newSurveyData);
    }
  }, [form, formTitle, formDescription, setSurveyData, surveyId]);

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
    const newForm = form.map(section => {
      if (section.id === activeSection) {
        return {
          ...section,
          questions: [
            ...section.questions,
            {
              id: null, // Let the backend recognize this as new
              text: "",
              type: "paragraph",
              options: [],
            }
          ]
        };
      }
      return section;
    });

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

  const handleToggleRequired = (sectionId, index) => {
    const newForm = form.map(section =>
        section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((q, i) =>
                    i === index ? { ...q, required: !q.required } : q // Toggle the required status
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
            questions: section.questions.map((el, i) =>
              i === index
                ? {
                    ...el,
                    options: [...el.options, { id: el.options.length + 1, text: `Option ${el.options.length + 1}` }]
                  }
                : el
            ),
          }
        : section
    );
    setForm(newForm);
  };

  const normalizeOptions = (options) => {
    return options.map(opt => ({
      text: typeof opt === "object" && opt.text ? opt.text : opt,
    }));
  };
  

  // Handle option text updates properly
const updateOption = (sectionId, questionIndex, optionIndex, value) => {
  const newForm = form.map(section =>
    section.id === sectionId
      ? {
          ...section,
          questions: section.questions.map((q, i) =>
            i === questionIndex
              ? {
                  ...q,
                  options: q.options.map((opt, j) =>
                    j === optionIndex ? { ...opt, text: value } : opt
                  )
                }
              : q
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
    // Reset the state
    setForm([]);
    setFormTitle("");
    setFormDescription("");
    setShowPreview(false); // Optionally hide the preview modal
    isEditing.current = false; // Reset editing flag
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
                  setForm(prevForm => prevForm.map((s) => (s.id === section.id ? { ...s, title: e.target.value } : s)))
                }
              />
              <textarea
                className="form-textarea section-description"
                placeholder="Section Description"
                value={section.description}
                onChange={(e) =>
                  setForm(prevForm => prevForm.map((s) => (s.id === section.id ? { ...s, description: e.target.value } : s)))
                }
              />
              {Array.isArray(section.questions) && section.questions.map((question, index) => (
                <Card key={question.id} className="form-question-card">
                  <div className="action-buttons">
                    <Button onClick={addSection} className="add-section-icon">
                      <img src={addS} alt="Add Section" className="add-question-img" />
                    </Button>
                    <Button onClick={addElement} className="add-question-icon">
                      <img src={addQ} alt="Add Question" className="add-question-img" />
                    </Button>
                    <button className="delete-icon" onClick={() => removeElement(section.id, index)}>
                      🗑️  
                    </button>
                    <Button 
                        onClick={() => handleToggleRequired(section.id, index)} 
                        className={`toggle-required-button ${question.required ? 'active' : ''}`}
                    >
                        {question.required === true ? "Required" : "Optional"}
                    </Button>
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
                            onChange={(e) => updateOption(section.id, index, i, e.target.value)}
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