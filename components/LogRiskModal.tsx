
import React, { useState, useEffect } from 'react';
import { RiskItem, RiskCategory, RiskImpact, RiskLikelihood, RiskStatus } from '../types';

interface LogRiskModalProps {
  onClose: () => void;
  onSave: (risk: RiskItem) => void;
  riskToEdit?: RiskItem | null;
  currentRiskCount: number;
}

const LogRiskModal: React.FC<LogRiskModalProps> = ({ onClose, onSave, riskToEdit, currentRiskCount }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<keyof typeof RiskCategory>('Operational');
  const [impact, setImpact] = useState<keyof typeof RiskImpact>('Low');
  const [likelihood, setLikelihood] = useState<keyof typeof RiskLikelihood>('Low');
  const [status, setStatus] = useState<keyof typeof RiskStatus>('Open');
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!riskToEdit;

  useEffect(() => {
    if (isEditMode) {
      setDescription(riskToEdit.description);
      setCategory(riskToEdit.category);
      setImpact(riskToEdit.impact);
      setLikelihood(riskToEdit.likelihood);
      setStatus(riskToEdit.status);
    }
  }, [riskToEdit, isEditMode]);

  const handleSave = () => {
    if (!description.trim()) {
      setError('Description cannot be empty.');
      return;
    }
    setError(null);

    const newRisk: RiskItem = {
      id: isEditMode ? riskToEdit.id : `MN-${(currentRiskCount + 1).toString().padStart(3, '0')}`,
      description,
      category,
      impact,
      likelihood,
      status,
    };
    onSave(newRisk);
    onClose();
  };

  const renderSelectOptions = (enumObject: object) => {
    return Object.entries(enumObject).map(([key, value]) => (
      <option key={key} value={key}>{value}</option>
    ));
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Risk' : 'Log New Risk'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
          </div>
          <p className="text-base-content">
            {isEditMode ? 'Update the details for the existing risk.' : 'Manually record a new risk identified by your team.'}
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                id="description"
                rows={3}
                className="w-full p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="Describe the potential risk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as keyof typeof RiskCategory)} className="w-full p-3 bg-base-200 border border-base-300 rounded-lg">
                        {renderSelectOptions(RiskCategory)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as keyof typeof RiskStatus)} className="w-full p-3 bg-base-200 border border-base-300 rounded-lg">
                        {renderSelectOptions(RiskStatus)}
                    </select>
                </div>
                <div>
                    <label htmlFor="impact" className="block text-sm font-medium text-gray-300 mb-2">Impact</label>
                    <select id="impact" value={impact} onChange={e => setImpact(e.target.value as keyof typeof RiskImpact)} className="w-full p-3 bg-base-200 border border-base-300 rounded-lg">
                        {renderSelectOptions(RiskImpact)}
                    </select>
                </div>
                <div>
                    <label htmlFor="likelihood" className="block text-sm font-medium text-gray-300 mb-2">Likelihood</label>
                    <select id="likelihood" value={likelihood} onChange={e => setLikelihood(e.target.value as keyof typeof RiskLikelihood)} className="w-full p-3 bg-base-200 border border-base-300 rounded-lg">
                        {renderSelectOptions(RiskLikelihood)}
                    </select>
                </div>
            </div>
          </div>
          {error && <p className="text-sm text-error text-center">{error}</p>}
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-base-300 text-white hover:bg-opacity-80 transition">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-80 transition">Save Risk</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogRiskModal;
