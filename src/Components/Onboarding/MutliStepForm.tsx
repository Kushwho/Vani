import React, { useState, useEffect } from 'react';

type SimpleOption = string;
type OtherOption = { value: string; isOther: true };
type Option = SimpleOption | OtherOption;

type Step = {
  question: string;
  options: Option[];
  inputType: 'radio' | 'text';
  key: string;
};

type FormValue = string | { value: string; isOther: true };
type FormData = Record<string, FormValue>;

const MultiStepForm = ({ steps }: { steps: Step[] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [debug, setDebug] = useState<string>('');

  useEffect(() => {
    setDebug(`Steps received: ${JSON.stringify(steps)}`);
    if (steps && steps.length > 0) {
      setIsLoading(false);
      setDebug(prev => `${prev}\nSteps loaded successfully.`);
    } else {
      setDebug(prev => `${prev}\nNo steps or empty steps array received.`);
    }
  }, [steps]);

  const handleInputChange = (key: string, value: string, isOther: boolean = false) => {
    setFormData(prev => ({
      ...prev,
      [key]: isOther ? { value, isOther: true } : value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setDebug(prev => `${prev}\nForm submitted: ${JSON.stringify(formData)}`);
  };

  const renderInput = (step: Step) => {
    const { inputType, options, key } = step;

    if (inputType === 'radio') {
      return (
        <div className="space-y-2">
          {options.map((option, index) => {
            const isOtherOption = typeof option === 'object' && option.isOther;
            const optionValue = isOtherOption ? option.value : option;
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value={optionValue}
                    checked={
                      formData[key] === optionValue || 
                      (typeof formData[key] === 'object' && formData[key].value === optionValue)
                    }
                    onChange={() => handleInputChange(key, optionValue, isOtherOption)}
                    className="form-radio text-blue-600"
                  />
                  <span>{optionValue}</span>
                </label>
                {isOtherOption && 
                 ((typeof formData[key] === 'object' && formData[key].isOther) || formData[key] === optionValue) && (
                  <input
                    type="text"
                    value={typeof formData[key] === 'object' ? formData[key].value : ''}
                    onChange={(e) => handleInputChange(key, e.target.value, true)}
                    placeholder="Please specify..."
                    className="ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    } else if (inputType === 'text') {
      return (
        <input
          type="text"
          value={typeof formData[key] === 'string' ? formData[key] : ''}
          onChange={(e) => handleInputChange(key, e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <p>Loading...</p>
        <pre className="mt-4 text-left text-sm bg-gray-100 p-2 rounded">
          Debug Info:
          {debug}
        </pre>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">No steps provided.</p>
        <pre className="mt-4 text-left text-sm bg-gray-100 p-2 rounded">
          Debug Info:
          {debug}
        </pre>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{currentStepData.question}</h2>
        {renderInput(currentStepData)}
      </div>
      <div className="px-6 py-4 bg-gray-50 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
      <pre className="mt-4 text-left text-sm bg-gray-100 p-2 rounded">
        Debug Info:
        {debug}
      </pre>
    </div>
  );
};

export default MultiStepForm;