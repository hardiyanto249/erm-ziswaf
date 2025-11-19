
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RiskManagement from './components/RiskManagement';
import ShariaCompliance from './components/ShariaCompliance';
import ZisTracking from './components/ZisTracking'; // Import the new component
import LogRiskModal from './components/LogRiskModal';
import { RiskItem } from './types';

type View = 'dashboard' | 'risks' | 'compliance' | 'zis-tracking'; // Add new view type

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  const [isLogRiskModalOpen, setIsLogRiskModalOpen] = useState(false);

  const [risks, setRisks] = useState<RiskItem[]>([
    { id: 'OP-001', description: 'Kurang tepat dalam menentukan delapan ashnaf', category: 'Operational', impact: 'High', likelihood: 'Medium', status: 'Open' },
    { id: 'OP-002', description: 'Keterlambatan proses pencairan dana kepada mustahik', category: 'Operational', impact: 'Medium', likelihood: 'Low', status: 'Mitigated' },
    { id: 'RP-001', description: 'Kampanye negatif di media sosial', category: 'Reputation', impact: 'Critical', likelihood: 'Medium', status: 'Monitoring' },
    { id: 'SH-001', description: 'Instrumen investasi dana ZIS tidak sesuai fatwa DPS', category: 'ShariaCompliance', impact: 'Critical', likelihood: 'Low', status: 'Open' },
    { id: 'OP-003', description: 'Kegagalan sistem IT saat pengumpulan dana online', category: 'Operational', impact: 'High', likelihood: 'Low', status: 'Mitigated' },
  ]);
  
  const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null);

  // Handlers for Manual Log/Edit Modal
  const handleOpenLogRiskModal = () => {
    setEditingRisk(null);
    setIsLogRiskModalOpen(true);
  };
  
  const handleOpenEditRiskModal = (risk: RiskItem) => {
    setEditingRisk(risk);
    setIsLogRiskModalOpen(true);
  };

  const handleCloseLogRiskModal = () => {
    setIsLogRiskModalOpen(false);
    setEditingRisk(null);
  };

  const handleSaveRisk = (riskToSave: RiskItem) => {
    setRisks(prevRisks => {
      const isExisting = prevRisks.some(r => r.id === riskToSave.id);
      if (isExisting) {
        return prevRisks.map(r => (r.id === riskToSave.id ? riskToSave : r));
      } else {
        return [...prevRisks, riskToSave];
      }
    });
    setIsLogRiskModalOpen(false);
    setEditingRisk(null);
  };

  const handleDeleteRisk = (riskId: string) => {
    if (window.confirm('Are you sure you want to delete this risk? This action cannot be undone.')) {
        setRisks(prevRisks => prevRisks.filter(r => r.id !== riskId));
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard risks={risks} />;
      case 'risks':
        return (
          <RiskManagement 
            risks={risks} 
            onLogNewRisk={handleOpenLogRiskModal}
            onEditRisk={handleOpenEditRiskModal}
            onDeleteRisk={handleDeleteRisk}
          />
        );
      case 'compliance':
        return <ShariaCompliance />;
      case 'zis-tracking': // Add case for the new view
        return <ZisTracking />;
      default:
        return <Dashboard risks={risks} />;
    }
  };

  return (
    <div className="flex h-screen bg-base-300 text-base-content font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 md:p-8">
          {renderView()}
        </main>
      </div>
      {isLogRiskModalOpen && (
        <LogRiskModal
          onClose={handleCloseLogRiskModal}
          onSave={handleSaveRisk}
          riskToEdit={editingRisk}
          currentRiskCount={risks.length}
        />
      )}
    </div>
  );
};

export default App;
