import React from 'react';
import { UserResponses } from '@/types/conseil';

interface QuestionParfumActuelProps {
  userResponses: UserResponses;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
}

const QuestionParfumActuel: React.FC<QuestionParfumActuelProps> = ({ 
  userResponses, 
  handleInputChange, 
  nextStep 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 1/6</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
        <label htmlFor="parfumActuel" className="block text-lg font-medium text-primary-800 mb-3">
          Utilisez-vous déjà un parfum que vous aimez particulièrement ?
        </label>
        <p className="text-gray-600 mb-4">Si vous avez un parfum coup de cœur, dites-nous lequel. Cela peut nous aider à mieux cerner vos goûts !</p>
        <textarea
          id="parfumActuel"
          name="parfumActuel"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Ex: J'aime beaucoup Coco Mademoiselle de Chanel..."
          value={userResponses.parfumActuel}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex justify-end">
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

export default QuestionParfumActuel; 