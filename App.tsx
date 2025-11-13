
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RiskManagement from './components/RiskManagement';
import ShariaCompliance from './components/ShariaCompliance';
import ZisTracking from './components/ZisTracking'; // Import the new component
import LogRiskModal from './components/LogRiskModal';
import { RiskItem } from './types';
import { apiService } from './services/apiService';

type View = 'dashboard' | 'risks' | 'compliance' | 'zis-tracking'; // Add new view type

const App: React.FC = () => {
   const [activeView, setActiveView] = useState<View>('dashboard');

   const [isLogRiskModalOpen, setIsLogRiskModalOpen] = useState(false);

   const [risks, setRisks] = useState<RiskItem[]>([]);
   const [loading, setLoading] = useState(true);

   const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null);

   // Fetch risks from backend on component mount
   useEffect(() => {
     const fetchRisks = async () => {
       try {
         const fetchedRisks = await apiService.getRisks();
         setRisks(fetchedRisks);
       } catch (error) {
         console.error('Failed to fetch risks:', error);
         // Fallback to empty array if backend is not available
       } finally {
         setLoading(false);
       }
     };

     fetchRisks();
   }, []);

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

  const handleSaveRisk = async (riskToSave: RiskItem) => {
     try {
       if (editingRisk) {
         // Update existing risk
         await apiService.updateRisk(riskToSave.id, riskToSave);
         setRisks(prevRisks => prevRisks.map(r => (r.id === riskToSave.id ? riskToSave : r)));
       } else {
         // Create new risk
         const newRisk = await apiService.createRisk(riskToSave);
         setRisks(prevRisks => [...prevRisks, newRisk]);
       }
       setIsLogRiskModalOpen(false);
       setEditingRisk(null);
     } catch (error) {
       console.error('Failed to save risk:', error);
       alert('Failed to save risk. Please try again.');
     }
   };

  const handleDeleteRisk = async (riskId: string) => {
     if (window.confirm('Are you sure you want to delete this risk? This action cannot be undone.')) {
       try {
         await apiService.deleteRisk(riskId);
         setRisks(prevRisks => prevRisks.filter(r => r.id !== riskId));
       } catch (error) {
         console.error('Failed to delete risk:', error);
         alert('Failed to delete risk. Please try again.');
       }
     }
   };

  const renderView = () => {
     if (loading) {
       return (
         <div className="flex justify-center items-center h-64">
           <div className="loading loading-spinner loading-lg text-primary"></div>
           <span className="ml-4 text-white">Loading data from backend...</span>
         </div>
       );
     }

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
    <div className="flex flex-col min-h-screen bg-base-300 text-base-content font-sans lg:flex-row">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen lg:min-h-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-2 sm:p-4 md:p-6 lg:p-8">
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
