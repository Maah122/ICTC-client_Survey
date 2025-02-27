import React, { useState ,useEffect } from "react";
import "./FormBuilder.css";
import addQ from '../images/173953461355455154.png';
import addS from '../images/173953461987347320.png';

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

export default function FormsBuilder({ onSave }) {  // Accept onSave prop
  const [form, setForm] = useState([
    { id: 1, type: "section", title: "Section 1", description: "Enter section description...", elements: [] }
  ]);



  const [currentPreviewSection, setCurrentPreviewSection] = useState(0);
  const [activeSection, setActiveSection] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState("New Form Title");
  const [formDescription, setFormDescription] = useState("Form description...");

  useEffect(() => {
    onSave({ surveyTitle: formTitle, surveyDescription: formDescription, sections: form });
  }, [form, formTitle, formDescription, onSave]);  
  
  const addSection = () => {
    const newSectionId = form.length + 1;
    setForm([...form, { id: newSectionId, type: "section", title: `Section ${newSectionId}`, description: "Enter section description...", elements: [] }]);
  };

  const addElement = () => {
    setForm(form.map(section => 
      section.id === activeSection
        ? { 
            ...section, 
            description: section.description ?? "", // Ensures description is always present
            elements: [
              ...(section.elements || []), // Ensures elements array exists
              { 
                type: "paragraph",  
                text: "",  
                options: [], 
                placeholder: "Enter text...", 
                required: false 
              }
            ] 
        }
        : section
    ));
}
  

  const removeElement = (sectionId, index) => {
    setForm(form.map(section =>
      section.id === sectionId
        ? { ...section, elements: section.elements.filter((_, i) => i !== index) }
        : section
    ));
  };

  const updateField = (sectionId, index, field, value) => {
    setForm(form.map(section =>
      section.id === sectionId
        ? { 
            ...section, 
            elements: section.elements.map((el, i) => 
              (i === index ? { ...el, [field]: value } : el)
            )
        }
        : section
    ));
  };
  

  const handleTypeChange = (sectionId, index, value) => {
    setForm(form.map(section =>
      section.id === sectionId
        ? { 
            ...section, 
            elements: section.elements.map((el, i) =>
              i === index
                ? { 
                    ...formElements.find(el => el.type === value),
                    question: section.elements[i].question,
                    options: [...(formElements.find(el => el.type === value)?.options || [])] 
                  }
                : el
            )
          }
        : section
    ));
  };

  const addOption = (sectionId, index) => {
    setForm(form.map(section =>
      section.id === sectionId
        ? { 
            ...section, 
            elements: section.elements.map((el, i) => 
              i === index ? { ...el, options: [...el.options, `Option ${el.options.length + 1}`] } : el
            )
          }
        : section
    ));
  };

  // Function to preview the form
  const previewForm = () => {
    setShowPreview(true);
  };

  const removeSection = (sectionId) => {
  setForm(form.filter(section => section.id !== sectionId));
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
      <Button onClick={previewForm} className="preview-button">Preview Form</Button> {/* New Preview Button */}

      {/* Form Builder */}
      <div className="form-elements">
        {form.map((section) => (
            <Card 
                key={section.id} 
                className={`form-card form-element-card ${activeSection === section.id ? "active-section" : ""}`}
                onClick={() => setActiveSection(section.id)}
                >
              {/* Delete Icon - Only appears when hovering */}
            <button 
                className="delete-icon"
                onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick
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
                onChange={(e) => setForm(form.map(s => s.id === section.id ? { ...s, title: e.target.value } : s))}
              />
              <textarea
                className="form-textarea section-description"
                placeholder="Section Description"
                value={section.description}
                onChange={(e) => setForm(form.map(s => s.id === section.id ? { ...s, description: e.target.value } : s))}
              />

              {/* Questions inside each section */}
              {section.elements.map((el, index) => (
                <Card key={index} className="form-question-card">
                    {/* Action Buttons */}
                    <div className="action-buttons">
                    <Button onClick={addSection} className="add-section-icon">
                        <img src={addS} alt="Add Section" className="add-question-img" />
                    </Button>
                    <Button onClick={addElement} className="add-question-icon">
                        <img src={addQ} alt="Add Question" className="add-question-img" />
                    </Button>
                    <button className="delete-icon" onClick={() => removeElement(section.id, index)}>🗑️</button>

                    {/* Toggle Required Button */}
                    <Button 
                        onClick={() => updateField(section.id, index, "required", !el.required)} 
                        className={`toggle-required-button ${el.required ? 'active' : ''}`}
                    >
                        {el.required ? "Required" : "Optional"}
                    </Button>
                    </div>
                  <div className="question-type-container">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter Question Text"
                      value={el.question}
                      onChange={(e) => updateField(section.id, index, "question", e.target.value)}
                    />
                    <select
                      className="form-select"
                      value={el.type}
                      onChange={(e) => handleTypeChange(section.id, index, e.target.value)}
                    >
                      {formElements.map((opt) => (
                        <option key={opt.type} value={opt.type}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {el.type === "paragraph" && (
                    <textarea className="form-textarea" placeholder={el.placeholder}></textarea>
                  )}

                  {(el.type === "checkboxes" || el.type === "radio" || el.type === "dropdown") && (
                    <>
                      {el.options.map((opt, i) => (
                        <div key={i} className="form-option">
                          {el.type === "checkboxes" && <input type="checkbox" disabled className="option-icon" />}
                          {el.type === "radio" && <input type="radio" disabled className="option-icon" />}
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateField(section.id, index, "options", [...el.options.slice(0, i), e.target.value, ...el.options.slice(i + 1)])}
                            className="form-input"
                          />
                        </div>
                      ))}
                      <Button onClick={() => addOption(section.id, index)} className="add-option-button">Add Option</Button>
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
      <h1>{formTitle}</h1>  {/* Display Form Title */}
      <p>{formDescription}</p> {/* Display Form Description */}
      <hr /> {/* Adds a separator */}

      <div key={form[currentPreviewSection].id} className="preview-section">
        <h3>{form[currentPreviewSection].title}</h3>
        <p>{form[currentPreviewSection].description}</p>
        {form[currentPreviewSection].elements.map((el, index) => (
  <div key={index} className="preview-question">
    <p>{el.question}</p>
    
    {el.type === "paragraph" && <textarea placeholder={el.placeholder} readOnly></textarea>}
    
    {(el.type === "checkboxes" || el.type === "radio") && (
      <div>
        {el.options.map((opt, i) => (
          <div key={i}>
            {el.type === "checkboxes" && <input type="checkbox" disabled />}
            {el.type === "radio" && <input type="radio" disabled />}
            <span>{opt}</span>
          </div>
        ))}
      </div>
    )}

    {el.type === "dropdown" && (
        <select 
  className="form-select" 
  value={el.selectedOption || ""} 
  onChange={(e) => updateField(form[currentPreviewSection].id, index, "selectedOption", e.target.value)}
>
  {el.options.map((opt, i) => (
    <option key={i} value={opt}>{opt}</option>
  ))}
</select>
    )}
  </div>
))}


      </div>

      {/* Navigation Buttons */}
      <div className="preview-navigation">
        {/* Conditionally render the "Back" button */}
        {form.length > 1 && currentPreviewSection > 0 && (
          <Button 
            onClick={() => setCurrentPreviewSection(currentPreviewSection - 1)}
            className="preview-nav-button"
          >
            Back
          </Button>
        )}

        {/* Conditionally render the "Next" button */}
        {form.length > 1 && currentPreviewSection < form.length - 1 && (
          <Button 
            onClick={() => setCurrentPreviewSection(currentPreviewSection + 1)}
            className="preview-nav-button"
          >
            Next
          </Button>
        )}

        {/* Close Preview Button */}
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
