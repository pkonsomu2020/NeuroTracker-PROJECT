import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { ONBOARDING_QUESTIONS } from '../../utils/constants';
import { OnboardingAnswers } from '../../types';
import { useSettingsStore } from '../../store/useSettingsStore';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const { completeOnboarding } = useSettingsStore();
  const navigate = useNavigate();

  const totalSteps = ONBOARDING_QUESTIONS.length;
  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];

  const handleOptionSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(answers as OnboardingAnswers);
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isOptionSelected = answers[currentQuestion.id as keyof OnboardingAnswers] !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Brain className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to NeuroTrack</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Let's personalize your experience with a few quick questions.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Question {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    answers[currentQuestion.id as keyof OnboardingAnswers] === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-400'
                      : 'border-gray-300 hover:border-primary-300 dark:border-gray-600 dark:hover:border-primary-500'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!isOptionSelected}
              >
                {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;