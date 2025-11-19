
import React from 'react';
import RiskTable from './RiskTable';
import { RiskItem } from '../types';

interface RiskManagementProps {
    risks: RiskItem[];
    onLogNewRisk: () => void;
    onEditRisk: (risk: RiskItem) => void;
    onDeleteRisk: (riskId: string) => void;
}

const RiskManagement: React.FC<RiskManagementProps> = ({ risks, onLogNewRisk, onEditRisk, onDeleteRisk }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Risk Register</h1>
                <button 
                    onClick={onLogNewRisk}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors"
                >
                    Log New Risk
                </button>
            </div>
            <p className="text-base-content">
                This register contains all identified risks across the organization, categorized by type, impact, and likelihood.
            </p>
            <div className="bg-base-100 p-4 rounded-xl shadow-lg">
                <RiskTable risks={risks} onEdit={onEditRisk} onDelete={onDeleteRisk} />
            </div>
        </div>
    );
};

export default RiskManagement;
