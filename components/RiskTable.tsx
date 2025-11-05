
import React from 'react';
import { RiskItem, getCategoryDisplayName } from '../types';

interface RiskTableProps {
  risks: RiskItem[];
  isCompact?: boolean;
  onEdit?: (risk: RiskItem) => void;
  onDelete?: (riskId: string) => void;
}

const getImpactColor = (impact: string) => {
    switch (impact) {
        case 'Critical': return 'bg-red-500/20 text-red-400 border border-red-500/30';
        case 'High': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'Low': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-red-500';
        case 'Monitoring': return 'bg-yellow-500';
        case 'Mitigated': return 'bg-green-500';
        case 'Closed': return 'bg-gray-500';
        default: return 'bg-gray-700';
    }
}

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const RiskTable: React.FC<RiskTableProps> = ({ risks, isCompact = false, onEdit, onDelete }) => {
  const hasActions = !!(onEdit && onDelete);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-base-content">
        <thead className="text-xs text-gray-400 uppercase bg-base-300">
          <tr>
            {!isCompact && <th scope="col" className="px-6 py-3">ID</th>}
            <th scope="col" className="px-6 py-3">Description</th>
            {!isCompact && <th scope="col" className="px-6 py-3">Category</th>}
            <th scope="col" className="px-6 py-3">Impact</th>
            {!isCompact && <th scope="col" className="px-6 py-3">Likelihood</th>}
            <th scope="col" className="px-6 py-3">Status</th>
            {!isCompact && hasActions && <th scope="col" className="px-6 py-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {risks.length === 0 ? (
            <tr>
                <td colSpan={isCompact ? 3 : (hasActions ? 7 : 6)} className="text-center py-8 text-gray-500">No risks to display.</td>
            </tr>
          ) : (
            risks.map((risk) => (
              <tr key={risk.id} className="bg-base-100 border-b border-base-300 hover:bg-base-200">
                {!isCompact && <td className="px-6 py-4 font-medium text-gray-300 whitespace-nowrap">{risk.id}</td>}
                <td className="px-6 py-4 max-w-xs truncate" title={risk.description}>{risk.description}</td>
                {!isCompact && <td className="px-6 py-4">{getCategoryDisplayName(risk.category)}</td>}
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(risk.impact)}`}>
                    {risk.impact}
                  </span>
                </td>
                {!isCompact && <td className="px-6 py-4">{risk.likelihood}</td>}
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(risk.status)} mr-2`}></div>
                        {risk.status}
                    </div>
                </td>
                {!isCompact && hasActions && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => onEdit(risk)} className="p-2 text-yellow-400 hover:bg-base-300 rounded-full transition-colors" aria-label="Edit Risk"><EditIcon /></button>
                        <button onClick={() => onDelete(risk.id)} className="p-2 text-red-400 hover:bg-base-300 rounded-full transition-colors" aria-label="Delete Risk"><DeleteIcon /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
