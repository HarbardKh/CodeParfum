import React from 'react';
import { UserResponses, senteurOptions } from '@/types/conseil';

interface QuestionSenteursProps {
  userResponses: UserResponses;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const QuestionSenteurs: React.FC<QuestionSenteursProps> = ({ 
  userResponses, 
  handleCheckboxChange, 
  nextStep, 
  prevStep 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 2/6</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
        <label className="block text-lg font-medium text-primary-800 mb-3">
          Quelles senteurs vous attirent instinctivement ?
        </label>
        <p className="text-gray-600 mb-4">Choisissez toutes les familles qui vous plaisent, même si c'est juste une impression !</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {senteurOptions.map(option => (
            <div key={option.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={option.id}
                  name="scenteurs"
                  type="checkbox"
                  value={option.value}
                  checked={userResponses.scenteurs.includes(option.value)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={option.id} className="text-gray-700 cursor-pointer">{option.label}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
        >
          Question suivante
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuestionSenteurs; 