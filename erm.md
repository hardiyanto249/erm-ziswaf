
# ERM for Sharia Philanthropy - Complete Codebase

## Overview
This is a complete Enterprise Risk Management (ERM) dashboard for Sharia Philanthropic Institutions, designed to monitor and manage financial, reputational, operational, and compliance risks based on a holistic, qualitative approach.

## Project Structure

### Root Files

#### .gitignore
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

#### App.tsx
```tsx
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
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ERM for Sharia Philanthropy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'base-100': '#1d232a',
              'base-200': '#191e24',
              'base-300': '#15191e',
              'base-content': '#a6adbb',
              'primary': '#36d399',
              'secondary': '#fbbd23',
              'accent': '#37cdbe',
              'neutral': '#1f2937',
              'info': '#3abff8',
              'success': '#36d399',
              'warning': '#fbbd23',
              'error': '#f87272',
            },
          }
        }
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.28.0",
    "recharts": "https://aistudiocdn.com/recharts@^3.3.0"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

#### index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### metadata.json
```json
{
  "name": "ERM for Sharia Philanthropy",
  "description": "A conceptual Enterprise Risk Management (ERM) dashboard for Sharia Philanthropic Institutions, designed to monitor and manage financial, reputational, operational, and compliance risks based on a holistic, qualitative approach.",
  "requestFramePermissions": []
}
```

#### package.json
```json
{
  "name": "erm-for-sharia-philanthropy",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@google/genai": "^1.28.0",
    "recharts": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

#### README.md
```
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FTPxzxmU7Wplz3niMMKFS5VbZRsngrIl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

#### types.ts
```ts
export enum RiskCategory {
  Operational = 'Operational',
  Reputation = 'Reputation',
  ShariaCompliance = 'Sharia Compliance',
}

export enum RiskImpact {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum RiskLikelihood {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum RiskStatus {
  Open = 'Open',
  Mitigated = 'Mitigated',
  Monitoring = 'Monitoring',
  Closed = 'Closed',
}

export interface RiskItem {
  id: string;
  description: string;
  category: keyof typeof RiskCategory;
  impact: keyof typeof RiskImpact;
  likelihood: keyof typeof RiskLikelihood;
  status: keyof typeof RiskStatus;
}

export interface Kpi {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ComplianceItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Utility function to get the display-friendly name of a risk category from its key.
 * @param category The key of the RiskCategory enum (e.g., 'ShariaCompliance')
 * @returns The display string (e.g., 'Sharia Compliance')
 */
export const getCategoryDisplayName = (category: keyof typeof RiskCategory): string => {
    return RiskCategory[category];
};
```

#### vite.config.ts
```ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

### Components

#### AddComplianceItemModal.tsx
```tsx
import React, { useState } from 'react';

interface AddComplianceItemModalProps {
  onClose: () => void;
  onSave: (text: string) => void;
}

const AddComplianceItemModal: React.FC<AddComplianceItemModalProps> = ({ onClose, onSave }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!text.trim()) {
      setError('Checklist item description cannot be empty.');
      return;
    }
    setError(null);
    onSave(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Add New Checklist Item</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
          </div>
          <div className="space-y-2">
            <label htmlFor="item-text" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="item-text"
              rows={3}
              className="w-full p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Enter the new compliance check item..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-error text-center">{error}</p>}
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-base-300 text-white hover:bg-opacity-80 transition">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-80 transition">Save Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComplianceItemModal;
```

#### ComplianceChecklist.tsx
```tsx
import React from 'react';
import { ComplianceItem } from '../types';

interface ComplianceChecklistProps {
    items: ComplianceItem[];
    onToggleItem: (id: string) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ items, onToggleItem }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Compliance Verification Checklist</h3>
            {items.map(item => (
                <div
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className="flex items-center p-4 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
                >
                    <div className={`w-6 h-6 rounded-md flex-shrink-0 mr-4 flex items-center justify-center ${item.completed ? 'bg-primary' : 'bg-base-100 border-2 border-base-content'}`}>
                        {item.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className={`flex-grow ${item.completed ? 'line-through text-gray-500' : 'text-base-content'}`}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ComplianceChecklist;
```

#### Dashboard.tsx
```tsx
import React, { useState, useEffect, useMemo } from 'react';
import KpiCard from './KpiCard';
import GaugeChart from './GaugeChart';
import RiskTable from './RiskTable';
import RiskCategoryChart from './RiskCategoryChart';
import RiskTrendChart from './RiskTrendChart';
import RiskMatrix from './RiskMatrix';
import { RiskItem, Kpi, RiskCategory, RiskStatus, getCategoryDisplayName } from '../types';

const rhaGoodThreshold = 12.5;
const acrGoodThreshold = 10;

// Early Warning System (EWS) Component
const EarlyWarningBanner: React.FC<{ messages: string[] }> = ({ messages }) => {
    if (messages.length === 0) return null;

    return (
        <div className="bg-yellow-500/20 border-l-4 border-yellow-400 text-yellow-300 p-4 rounded-lg shadow-lg mb-8" role="alert">
            <div className="flex items-center">
                <div className="py-1">
                    <svg className="fill-current h-6 w-6 text-yellow-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8h2v-2H9v2z"/></svg>
                </div>
                <div>
                    <p className="font-bold text-white">Early Warning System Activated</p>
                    <ul className="list-disc list-inside text-sm">
                        {messages.map((msg, index) => <li key={index}>{msg}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};


interface DashboardProps {
    risks: RiskItem[];
}

const Dashboard: React.FC<DashboardProps> = ({risks}) => {
    const [rhaValue, setRhaValue] = useState(14.8);
    const [acrValue, setAcrValue] = useState(8.5);
    
    // Effect to simulate real-time data updates for RHA and ACR
    useEffect(() => {
        const interval = setInterval(() => {
            // Fluctuate RHA between 10 and 20
            setRhaValue(prev => Math.max(10, Math.min(20, prev + (Math.random() - 0.5) * 0.3)));
             // Fluctuate ACR between 5 and 15
            setAcrValue(prev => Math.max(5, Math.min(15, prev + (Math.random() - 0.5) * 0.4)));
        }, 4000); // Update every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const highPriorityRisks = risks.filter(risk => (risk.impact === 'Critical' || risk.impact === 'High') && risk.status === 'Open');
    const complianceIssuesCount = risks.filter(r => r.category === 'ShariaCompliance' && r.status === 'Open').length;

    // KPI data is now calculated dynamically based on the risks prop
    const kpiData: Kpi[] = [
        { title: "Total Risks Logged", value: risks.length.toString(), description: "All identified risks", trend: 'stable' },
        { title: "Open Critical/High Risks", value: highPriorityRisks.length.toString(), description: "Requiring immediate attention", trend: highPriorityRisks.length > 3 ? 'up' : 'stable' },
        { title: "Compliance Issues", value: complianceIssuesCount.toString(), description: "Open Sharia compliance risks", trend: complianceIssuesCount > 1 ? 'up' : 'down' },
        { title: "Avg. Mitigation Time", value: "12 days", description: "Time to close open risks", trend: 'stable' },
    ];

    // EWS Logic now uses dynamic state values
    const warningMessages: string[] = [];
    const hasOpenCriticalRisk = risks.some(r => r.impact === 'Critical' && r.status === 'Open');
    
    if (hasOpenCriticalRisk) {
        warningMessages.push("Terdapat risiko 'Kritis' yang masih berstatus 'Open'. Perlu penanganan segera.");
    }
    if (rhaValue > rhaGoodThreshold) {
        warningMessages.push(`Rasio Hak Amil (RHA) (${rhaValue.toFixed(1)}%) melebihi batas ideal (${rhaGoodThreshold}%).`);
    }
    if (acrValue > acrGoodThreshold) {
        warningMessages.push(`Saldo Kas Mengendap (ACR) (${acrValue.toFixed(1)}%) melebihi batas ideal (${acrGoodThreshold}%).`);
    }

    const categoryChartData = useMemo(() => {
        // Initialize counts for all categories and statuses to ensure they always appear
        const categoryKeys = Object.keys(RiskCategory) as (keyof typeof RiskCategory)[];
        
        // FIX: Use a more generic, mutable type for categoryCounts to resolve readonly property errors
        // that can occur with mapped types over enums. This resolves errors on lines 86 and 91.
        const categoryCounts: { [key: string]: { [key: string]: number } } = {};
        
        categoryKeys.forEach(catKey => {
            categoryCounts[catKey] = { Open: 0, Mitigated: 0, Monitoring: 0, Closed: 0 };
        });

        risks.forEach(risk => {
            if (categoryCounts[risk.category]) {
                categoryCounts[risk.category][risk.status]++;
            }
        });

        return categoryKeys.map(catKey => ({
            name: getCategoryDisplayName(catKey),
            ...categoryCounts[catKey]
        }));
    }, [risks]);


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>
            
            {/* Early Warning System Banner */}
            <EarlyWarningBanner messages={warningMessages} />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
            
            {/* Reputational Risk Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-base-100 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Reputational Risk Indicators</h3>
                    <p className="text-sm text-base-content mb-6">Monitoring key ratios to prevent fraud and maintain public trust (Amanah).</p>
                    <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                        <GaugeChart
                            value={parseFloat(rhaValue.toFixed(1))}
                            maxValue={25}
                            label="Rasio Hak Amil (RHA)"
                            unit="%"
                            goodThreshold={rhaGoodThreshold}
                            warningThreshold={15}
                        />
                        <GaugeChart
                            value={parseFloat(acrValue.toFixed(1))}
                            maxValue={20}
                            label="Saldo Kas Mengendap (ACR)"
                            unit="%"
                            goodThreshold={acrGoodThreshold}
                            warningThreshold={15}
                        />
                    </div>
                </div>
                <div className="bg-base-100 p-6 rounded-xl shadow-lg flex flex-col">
                    <h3 className="text-xl font-semibold text-white mb-4">High Priority Risks</h3>
                    <p className="text-sm text-base-content mb-4">Risks requiring immediate attention.</p>
                    <div className="flex-grow overflow-y-auto">
                        <RiskTable risks={highPriorityRisks} isCompact={true} />
                    </div>
                </div>
            </div>
            {/* Risk Matrix */}
            <div className="bg-base-100 p-6 rounded-xl shadow-lg">
                <RiskMatrix risks={risks} />
            </div>
             {/* Risk Category Distribution Chart */}
            <div className="bg-base-100 p-6 rounded-xl shadow-lg">
                 <RiskCategoryChart data={categoryChartData} />
            </div>
            {/* Risk Trend Chart */}
            <div className="bg-base-100 p-6 rounded-xl shadow-lg">
                <RiskTrendChart />
            </div>
        </div>
    );
};

export default Dashboard;
```

#### GaugeChart.tsx
```tsx
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  goodThreshold: number;
  warningThreshold: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, maxValue, label, unit, goodThreshold, warningThreshold }) => {
  const percentage = (value / maxValue) * 100;
  
  const color = useMemo(() => {
    if (value <= goodThreshold) return '#36d399'; // success
    if (value <= warningThreshold) return '#fbbd23'; // warning
    return '#f87272'; // error
  }, [value, goodThreshold, warningThreshold]);

  const data = [
    { name: 'value', value: value },
    { name: 'remaining', value: maxValue - value },
  ];

  const startAngle = 180;
  const endAngle = 0;

  return (
    <div className="flex flex-col items-center w-full max-w-xs">
        <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        dataKey="value"
                        startAngle={startAngle}
                        endAngle={endAngle}
                        innerRadius="60%"
                        outerRadius="100%"
                        paddingAngle={0}
                        // FIX: Removed invalid 'blendStroke' prop. It is not a valid prop for the Pie component and was causing a TypeScript error.
                    >
                        <Cell fill={color} stroke={color} />
                        <Cell fill="#374151" stroke="#374151" />
                        <Label
                            value={`${value}${unit}`}
                            position="center"
                            dy={-15}
                            fontSize="24px"
                            fontWeight="bold"
                            fill="#FFFFFF"
                        />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
      <p className="text-base-content font-semibold mt-2 text-center">{label}</p>
      <p className="text-xs text-gray-500">Batas Ideal: < {goodThreshold}{unit}</p>
    </div>
  );
};

export default GaugeChart;
```

#### GeminiAssistantModal.tsx
```tsx
import React, { useState, useCallback } from 'react';
import { identifyRisksFromScenario } from '../services/geminiService';
import { RiskItem } from '../types';

interface GeminiAssistantModalProps {
  onClose: () => void;
  onAddRisks: (newRisks: RiskItem[]) => void;
  currentRiskCount: number;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({ onClose, onAddRisks, currentRiskCount }) => {
  const [scenario, setScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!scenario.trim()) {
      setError("Please describe a scenario.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newRisks = await identifyRisksFromScenario(scenario, currentRiskCount + 1);
      onAddRisks(newRisks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [scenario, onAddRisks, currentRiskCount]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Gemini Risk Assistant</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          <p className="text-base-content">
            Describe a new initiative, process, or event. Gemini will analyze it based on the ERM framework and identify potential risks.
          </p>
          <div>
            <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-2">
              Scenario Description
            </label>
            <textarea
              id="scenario"
              rows={4}
              className="w-full p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="E.g., 'Meluncurkan kampanye pengumpulan dana qurban secara online melalui platform media sosial baru...'"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-error text-center">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-base-300 text-white hover:bg-opacity-80 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-80 transition flex items-center justify-center disabled:bg-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Analyze & Identify Risks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistantModal;
```

#### Header.tsx
```tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center h-20 px-6 bg-base-100 border-b border-base-300">
      <h2 className="text-2xl font-semibold text-white">Risk Management Dashboard</h2>
    </header>
  );
};

export default Header;
```

#### KpiCard.tsx
```tsx
import React from 'react';
import { Kpi } from '../types';

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 1.5a.5.5 0 01.5.5v12.586l3.293-3.293a.5.5 0 11.707.707l-4 4a.5.5 0 01-.707 0l-4-4a.5.5 0 01.707-.707L11 14.586V2a.5.5 0 01.5-.5z" clipRule="evenodd" transform="rotate(180 10 10)"/></svg>;
    if (trend === 'down') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM6.28 8.22a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l2.25-2.25a.75.75 0 011.06 0zm9.94 1.06a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 011.06-1.06l2.25 2.25a.75.75 0 010 1.06z" clipRule="evenodd" transform="rotate(180 12 12)"/></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" /></svg>;
};


const KpiCard: React.FC<Kpi> = ({ title, value, description, trend }) => {
    return (
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border-l-4 border-primary transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-base-content">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className="p-2 bg-base-300 rounded-full">
                    <TrendIcon trend={trend} />
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">{description}</p>
        </div>
    );
};

export default KpiCard;
```

#### LogRiskModal.tsx
```tsx
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
```

#### RiskCategoryChart.tsx
```tsx
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface ChartData {
    name: string;
    Open?: number;
    Mitigated?: number;
    Monitoring?: number;
    Closed?: number;
}

interface RiskCategoryChartProps {
    data: ChartData[];
}

const statusColors = {
    Open: '#f87272',       // error
    Monitoring: '#fbbd23',  // warning
    Mitigated: '#36d399',   // success
    Closed: '#a6adbb',      // base-content
};


const RiskCategoryChart: React.FC<RiskCategoryChartProps> = ({ data }) => {
    return (
        <div className="h-80">
#### RiskMatrix.tsx
```tsx
import React, { useMemo } from 'react';
import { RiskItem, RiskImpact, RiskLikelihood } from '../types';

interface RiskMatrixProps {
    risks: RiskItem[];
}

// Define the order of levels for the matrix axes, from highest to lowest impact
const impactLevels: (keyof typeof RiskImpact)[] = ['Critical', 'High', 'Medium', 'Low'];
// Define the order of levels for the matrix axes, from lowest to highest likelihood
const likelihoodLevels: (keyof typeof RiskLikelihood)[] = ['Low', 'Medium', 'High'];

// Function to determine the risk level and corresponding color based on impact and likelihood
const getCellConfig = (impact: keyof typeof RiskImpact, likelihood: keyof typeof RiskLikelihood): { color: string; label: string } => {
    // Red for severe risks (highest impact/likelihood combinations)
    if ((impact === 'Critical' && likelihood === 'High') || (impact === 'Critical' && likelihood === 'Medium') || (impact === 'High' && likelihood === 'High')) {
        return { color: 'bg-red-700/80 hover:bg-red-600/80 border-red-600/50', label: 'Severe' };
    }
    // Orange for high risks
    if ((impact === 'Critical' && likelihood === 'Low') || (impact === 'High' && likelihood === 'Medium') || (impact === 'Medium' && likelihood === 'High')) {
        return { color: 'bg-orange-600/80 hover:bg-orange-500/80 border-orange-500/50', label: 'High' };
    }
    // Yellow for moderate risks
    if ((impact === 'High' && likelihood === 'Low') || (impact === 'Medium' && likelihood === 'Medium')) {
        return { color: 'bg-yellow-500/80 hover:bg-yellow-400/80 border-yellow-400/50', label: 'Moderate' };
    }
    // Lighter Green for low risks
    if ((impact === 'Medium' && likelihood === 'Low') || (impact === 'Low' && likelihood === 'High') || (impact === 'Low' && likelihood === 'Medium')) {
        return { color: 'bg-green-600/70 hover:bg-green-500/70 border-green-500/50', label: 'Low' };
    }
    // Darker Green for minor risks (lowest impact and likelihood)
    if (impact === 'Low' && likelihood === 'Low') {
        return { color: 'bg-green-800/70 hover:bg-green-700/70 border-green-700/50', label: 'Minor' };
    }
    // Default fallback color
    return { color: 'bg-base-300 hover:bg-base-200', label: 'Unknown' };
};


const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {

    const matrixData = useMemo(() => {
        const grid: { [impact: string]: { [likelihood: string]: RiskItem[] } } = {};
        
        impactLevels.forEach(impact => {
            grid[impact] = {};
            likelihoodLevels.forEach(likelihood => {
                grid[impact][likelihood] = [];
            });
        });

        risks.forEach(risk => {
            // Ensure the risk's impact and likelihood are valid keys before assigning
            if (grid[risk.impact] && grid[risk.impact][risk.likelihood]) {
                grid[risk.impact][risk.likelihood].push(risk);
            }
        });
        return grid;
    }, [risks]);


    return (
        <div className="relative pt-8 pl-8 pb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Risk Matrix (Impact vs. Likelihood)</h3>
            <p className="text-sm text-base-content mb-6">
                Visual representation of the current risk landscape. Each cell shows the number of risks for a given combination.
            </p>
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-[auto_1fr_1fr_1fr_1fr] gap-1.5 bg-base-200 rounded-lg p-2">
                {/* Top-left empty cell */}
                <div />

                {/* Likelihood labels (X-axis) */}
                {likelihoodLevels.map(level => (
                    <div key={level} className="text-center font-bold text-base-content py-2">{level}</div>
                ))}

                {/* Impact labels (Y-axis) and Matrix Cells */}
                {impactLevels.map(impactLevel => (
                    <React.Fragment key={impactLevel}>
                        <div className="flex items-center justify-end font-bold text-base-content px-3 text-right">{impactLevel}</div>
                        {likelihoodLevels.map(likelihoodLevel => {
                             const cellRisks = matrixData[impactLevel][likelihoodLevel];
                             const cellConfig = getCellConfig(impactLevel, likelihoodLevel);
                             const tooltipText = cellRisks.length > 0
                                ? `Risks (${cellRisks.length}):\n${cellRisks.map(r => `- ${r.description}`).join('\n')}`
                                : `No risks for ${impactLevel} Impact / ${likelihoodLevel} Likelihood`;
                            
                            return (
                                <div
                                    key={`${impactLevel}-${likelihoodLevel}`}
                                    title={tooltipText}
                                    aria-label={tooltipText}
                                    className={`aspect-square rounded-md flex items-center justify-center transition-colors duration-200 border cursor-pointer ${cellConfig.color}`}
                                >
                                    <span className="text-3xl font-extrabold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
                                        {cellRisks.length > 0 ? cellRisks.length : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg font-bold text-white">
                <span>Likelihood</span>
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 -rotate-90 text-lg font-bold text-white">
                 <span>Impact</span>
            </div>
        </div>
    );
};

export default RiskMatrix;
```

#### RiskTable.tsx
```tsx
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
```

#### RiskTrendChart.tsx
```tsx
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

// Define colors for the risk categories based on the application's theme
const categoryColors = {
    Operational: '#3abff8',     // info
    Reputation: '#fbbd23',      // secondary/warning
    ShariaCompliance: '#36d399',// primary/success
};

// Function to generate mock data for the last 12 months by category
const generateTrendData = () => {
    const data = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    
    // Initial counts for each category
    let operationalCount = 10;
    let reputationCount = 5;
    let shariaCount = 3;

    for (let i = 11; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const month = monthNames[date.getMonth()];

        // Simulate fluctuations for each category count over time
        operationalCount = Math.max(5, operationalCount + Math.floor(Math.random() * 4) - 2); // Fluctuate by -2 to +1
        reputationCount = Math.max(2, reputationCount + Math.floor(Math.random() * 3) - 1);  // Fluctuate by -1 to +1
        shariaCount = Math.max(1, shariaCount + Math.floor(Math.random() * 3) - 1);    // Fluctuate by -1 to +1

        data.push({
            month: month,
            Operational: operationalCount,
            Reputation: reputationCount,
            ShariaCompliance: shariaCount,
        });
    }
    return data;
};

const RiskTrendChart: React.FC = () => {
    const trendData = useMemo(() => generateTrendData(), []);

    return (
        <div className="h-80">
            <h3 className="text-xl font-semibold text-white mb-4">Risk Trend Over Last Year</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={trendData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1}/>
                    <XAxis dataKey="month" stroke="#a6adbb" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#a6adbb" allowDecimals={false} width={40} />
                    <Tooltip
                        cursor={{ stroke: '#37cdbe', strokeWidth: 1, strokeDasharray: '3 3' }}
                        contentStyle={{
                            backgroundColor: '#191e24',
                            borderColor: '#15191e',
                            borderRadius: '0.5rem',
                            color: '#a6adbb'
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Line type="monotone" dataKey="Operational" name="Operational" stroke={categoryColors.Operational} strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Reputation" name="Reputation" stroke={categoryColors.Reputation} strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="ShariaCompliance" name="Sharia Compliance" stroke={categoryColors.ShariaCompliance} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RiskTrendChart;
```

#### ShariaCompliance.tsx
```tsx
import React, { useState } from 'react';
import ComplianceChecklist from './ComplianceChecklist';
import AddComplianceItemModal from './AddComplianceItemModal';
import { ComplianceItem } from '../types';

const initialComplianceItems: ComplianceItem[] = [
    { id: 'sc-1', text: 'Struktur akad pengumpulan dana (ZIS) telah disetujui DPS.', completed: true },
    { id: 'sc-2', text: 'Proses penyaluran dana sesuai dengan 8 golongan (ashnaf).', completed: true },
    { id: 'sc-3', text: 'Investasi dana ZIS ditempatkan pada instrumen syariah yang bebas riba.', completed: false },
    { id: 'sc-4', text: 'Laporan keuangan tahunan telah diaudit oleh auditor syariah.', completed: true },
    { id: 'sc-5', text: 'Rasio Hak Amil (RHA) tidak melebihi batas yang ditetapkan syariat.', completed: true },
    { id: 'sc-6', text: 'Tidak ada saldo kas mengendap yang berlebihan (di luar batas ideal ACR).', completed: true },
    { id: 'sc-7', text: 'Seluruh kampanye dan materi promosi telah ditinjau oleh DPS.', completed: false },
    { id: 'sc-8', text: 'Mekanisme penanganan keluhan dan sengketa sesuai prinsip syariah.', completed: true },
    { id: 'sc-9', text: 'SOP (Standar Operasional Prosedur) internal telah divalidasi oleh DPS.', completed: false },
    { id: 'sc-10', text: 'Pelatihan reguler mengenai prinsip muamalah diberikan kepada amil.', completed: true },
    { id: 'sc-11', text: 'Mekanisme pemisahan dan penyaluran dana non-halal yang tidak sengaja diterima.', completed: false },
    { id: 'sc-12', text: 'Kerahasiaan dan keamanan data muzakki dan mustahik terjamin.', completed: true },
    { id: 'sc-13', text: 'Laporan kepatuhan syariah disampaikan secara berkala kepada DPS.', completed: false },
];

const ShariaCompliance: React.FC = () => {
    const [items, setItems] = useState<ComplianceItem[]>(initialComplianceItems);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };
    
    const handleAddItem = (text: string) => {
        const newItem: ComplianceItem = {
            id: `sc-${Date.now()}`, // Using timestamp for a more unique ID
            text,
            completed: false,
        };
        setItems(prevItems => [...prevItems, newItem]);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Sharia Compliance Monitoring</h1>
                        <p className="mt-2 text-base-content max-w-3xl">
                            Ensuring all operations, contracts, and instruments align with the principles and fatwas established by the Sharia Supervisory Board (Dewan Pengawas Syariah - DPS).
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors flex-shrink-0"
                    >
                        Add New Item
                    </button>
                </div>
                <div className="bg-base-100 p-6 rounded-xl shadow-lg">
                    <ComplianceChecklist items={items} onToggleItem={handleToggleItem} />
                </div>
            </div>
            {isModalOpen && (
                <AddComplianceItemModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddItem}
                />
            )}
        </>
    );
};

export default ShariaCompliance;
```

#### Sidebar.tsx
```tsx
import React from 'react';

const DashboardIcon = () => (
    <svg xmlns="http://www.w.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
);

const RiskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const ComplianceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const TrackingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


interface SidebarProps {
  activeView: string;
  setActiveView: (view: 'dashboard' | 'risks' | 'compliance' | 'zis-tracking') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'risks', icon: <RiskIcon />, label: 'Risk Management' },
    { id: 'compliance', icon: <ComplianceIcon />, label: 'Sharia Compliance' },
    { id: 'zis-tracking', icon: <TrackingIcon />, label: 'ZIS Tracking' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-base-100 text-base-content flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-base-300">
        <h1 className="text-xl md:text-2xl font-bold text-white hidden md:block">ERM Syariah</h1>
        <div className="md:hidden text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.789-2.75 9.566-1.74 2.777-2.75 5.434-2.75 5.434h11c0 0-1.01-2.657-2.75-5.434C13.009 17.789 12 14.517 12 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-2.345.384-4.618 1.116-6.733a12.028 12.028 0 012.793-4.402 12.028 12.028 0 00-13.818 4.402C2.384 6.382 2 8.655 2 11c0 3.517 1.009 6.789 2.75 9.566" />
            </svg>
        </div>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as 'dashboard' | 'risks' | 'compliance' | 'zis-tracking')}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-primary text-white'
                : 'hover:bg-base-300'
            }`}
          >
            {item.icon}
            <span className="ml-4 font-semibold hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-base-300">
          <p className="text-xs text-center text-gray-500 hidden md:block">
              Perancangan Konseptual Aplikasi ERM
          </p>
      </div>
    </aside>
  );
};

export default Sidebar;
```

#### ZisTracking.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';

// --- Reusable Components ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        {children}
    </div>
);

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-base-200 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-primary/20 text-primary rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-base-content">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

// --- Icons ---
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const DonorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ManagementIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const DistributionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const BeneficiaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg>;

// --- Mock Data ---
const collectionData = [
    { name: 'Zakat', value: 450000000 },
    { name: 'Infaq/Sadaqah', value: 280000000 },
    { name: 'Wakaf', value: 120000000 },
    { name: 'DSKL', value: 75000000 },
];
const COLORS = ['#36d399', '#3abff8', '#fbbd23', '#a6adbb'];

const distributionData = [
    { name: 'Fakir', Saldo: 110000000 }, { name: 'Miskin', Saldo: 150000000 },
    { name: 'Amil', Saldo: 85000000 }, { name: 'Mualaf', Saldo: 50000000 },
    { name: 'Riqab', Saldo: 20000000 }, { name: 'Gharim', Saldo: 70000000 },
    { name: 'Fisabilillah', Saldo: 180000000 }, { name: 'Ibnu Sabil', Saldo: 45000000 },
];

const formatCurrency = (value: number) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;


const ZisTracking: React.FC = () => {
    const [totalCollected, setTotalCollected] = useState(925000000);
    const [totalDistributed, setTotalDistributed] = useState(710000000);

    useEffect(() => {
        const interval = setInterval(() => {
            setTotalCollected(prev => prev + Math.floor(Math.random() * 1000000));
            setTotalDistributed(prev => prev + Math.floor(Math.random() * 800000));
        }, 3000); // Update every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const managedFunds = totalCollected - totalDistributed;
    const operationalEfficiency = ((85000000 / totalCollected) * 100).toFixed(2);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Monitoring & Tracking ZIS</h1>
                <p className="mt-2 text-base-content max-w-3xl">
                    Overview of the Zakat, Infaq, and Sadaqah fund lifecycle from collection to distribution.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- PENGHIMPUNAN --- */}
                <div className="lg:col-span-1 space-y-6">
                    <Section title="Penghimpunan (Collection)">
                        <div className="space-y-4">
                            <KpiCard title="Total Dana Terhimpun" value={formatCurrency(totalCollected)} icon={<CollectionIcon />} />
                            <KpiCard title="Jumlah Muzakki" value="15,480" icon={<DonorIcon />} />
                            <KpiCard title="Rata-rata Donasi" value={formatCurrency(totalCollected / 15480)} icon={<CollectionIcon />} />
                        </div>
                        <div className="h-64 mt-6">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={collectionData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                                        {collectionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Section>
                </div>

                {/* --- PENGELOLAAN & PENDISTRIBUSIAN --- */}
                <div className="lg:col-span-2 space-y-8">
                     {/* --- PENGELOLAAN --- */}
                    <Section title="Pengelolaan (Management)">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <KpiCard title="Dana Kelolaan Saat Ini" value={formatCurrency(managedFunds)} icon={<ManagementIcon />} />
                            <KpiCard title="Efisiensi Operasional" value={`${operationalEfficiency}%`} icon={<ManagementIcon />} />
                             <KpiCard title="Dana Produktif" value={formatCurrency(150000000)} icon={<ManagementIcon />} />
                        </div>
                    </Section>

                    {/* --- PENDISTRIBUSIAN --- */}
                    <Section title="Pendistribusian (Distribution)">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                             <KpiCard title="Total Dana Tersalurkan" value={formatCurrency(totalDistributed)} icon={<DistributionIcon />} />
                             <KpiCard title="Jumlah Mustahik" value="8,950" icon={<BeneficiaryIcon />} />
                             <KpiCard title="Jangkauan Program" value="15 Provinsi" icon={<DistributionIcon />} />
                        </div>
                        <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={distributionData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis type="number" stroke="#a6adbb" tickFormatter={(value) => `${value / 1000000} Jt`} />
                                    <YAxis type="category" dataKey="name" stroke="#a6adbb" width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
                                    <Bar dataKey="Saldo" fill="#36d399" name="Disalurkan" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default ZisTracking;
```

### Services

#### geminiService.ts
```ts
import { GoogleGenAI, Type } from "@google/genai";
import { RiskItem, RiskCategory, RiskImpact, RiskLikelihood, RiskStatus } from '../types';

// This is a mock implementation. In a real application, you would make an API call.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const riskSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      description: {
        type: Type.STRING,
        description: "A concise description of the identified risk.",
      },
      category: {
        type: Type.STRING,
        enum: Object.keys(RiskCategory),
        description: "The category of the risk.",
      },
      impact: {
        type: Type.STRING,
        enum: Object.keys(RiskImpact),
        description: "The potential impact of the risk if it occurs.",
      },
      likelihood: {
        type: Type.STRING,
        enum: Object.keys(RiskLikelihood),
        description: "The likelihood of the risk occurring.",
      },
    },
    required: ["description", "category", "impact", "likelihood"],
  },
};

export const identifyRisksFromScenario = async (prompt: string, startId: number): Promise<RiskItem[]> => {
  console.log("Simulating Gemini API call with prompt:", prompt);
  console.log("Using schema:", riskSchema);

  // In a real app, you would use this:
  /*
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Based on the following scenario for a Sharia Philanthropic Institution, identify potential risks. Scenario: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: riskSchema,
    },
  });
  const identifiedRisks = JSON.parse(response.text);
  */
  
  // Mock response for demonstration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockResponse = [
    {
      description: "Data privasi muzakki (donatur) bocor akibat serangan siber pada platform online.",
      category: "Operational",
      impact: "High",
      likelihood: "Medium"
    },
    {
      description: "Persepsi publik negatif karena kampanye dianggap tidak transparan.",
      category: "Reputation",
      impact: "Critical",
      likelihood: "Medium"
    },
    {
      description: "Metode pembayaran online yang digunakan tidak sepenuhnya patuh syariah.",
      // Fix: Corrected 'Sharia Compliance' to 'ShariaCompliance' to match the 'RiskCategory' enum key.
      category: "ShariaCompliance",
      impact: "High",
      likelihood: "Low"
    }
  ];

  if (Math.random() > 0.1) { // 90% chance of success
    const newRisks: RiskItem[] = mockResponse.map((risk, index) => ({
      ...risk,
      id: `AI-${(startId + index).toString().padStart(3, '0')}`,
      status: 'Open',
    }) as RiskItem);
    return newRisks;
  } else { // 10% chance of failure
    throw new Error("Simulated API Error: Failed to analyze risks.");
  }
};
```

### Project Structure Summary

The project is a React-based ERM dashboard with the following key features:
- Dashboard with KPI cards, risk charts, and early warning system
- Risk management with manual and AI-assisted risk logging
- Sharia compliance checklist
- ZIS tracking with collection, management, and distribution visualization
- Responsive design using Tailwind CSS and DaisyUI components
- Integration with Google's Gemini AI for risk identification

All code has been consolidated into this single erm.md file with clear structure and readable formatting.
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis dataKey="name" stroke="#a6adbb" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#a6adbb" allowDecimals={false} width={40} />
                    <Tooltip
                        cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                        contentStyle={{
                            backgroundColor: '#191e24',
                            borderColor: '#15191e',
                            borderRadius: '0.5rem',
                            color: '#a6adbb'
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="Open" stackId="a" fill={statusColors.Open} name="Open" />
                    <Bar dataKey="Monitoring" stackId="a" fill={statusColors.Monitoring} name="Monitoring" />
                    <Bar dataKey="Mitigated" stackId="a" fill={statusColors.Mitigated} name="Mitigated" />
                    <Bar dataKey="Closed" stackId="a" fill={statusColors.Closed} name="Closed" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RiskCategoryChart;
```

#### RiskManagement.tsx
```tsx
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
```

#### RiskMatrix.tsx
```tsx
import React, { useMemo } from 'react';
import { RiskItem, RiskImpact, RiskLikelihood } from '../types';

interface RiskMatrixProps {
    risks: RiskItem[];
}

// Define the order of levels for the matrix axes, from highest to lowest impact
const impactLevels: (keyof typeof RiskImpact)[] = ['Critical', 'High', 'Medium', 'Low'];
// Define the order of levels for the matrix axes, from lowest to highest likelihood
const likelihoodLevels: (keyof typeof RiskLikelihood)[] = ['Low', 'Medium', 'High'];

// Function to determine the risk level and corresponding color based on impact and likelihood
const getCellConfig = (impact: keyof typeof RiskImpact, likelihood: keyof typeof RiskLikelihood): { color: string; label: string } => {
    // Red for severe risks (highest impact/likelihood combinations)
    if ((impact === 'Critical' && likelihood === 'High') || (impact === 'Critical' && likelihood === 'Medium') || (impact === 'High' && likelihood === 'High')) {
        return { color: 'bg-red-700/80 hover:bg-red-600/80 border-red-600/50', label: 'Severe' };
    }
    // Orange for high risks
    if ((impact === 'Critical' && likelihood === 'Low') || (impact === 'High' && likelihood === 'Medium') || (impact === 'Medium' && likelihood === 'High')) {
        return { color: 'bg-orange-600/80 hover:bg-orange-500/80 border-orange-500/50', label: 'High' };
    }
    // Yellow for moderate risks
    if ((impact === 'High' && likelihood === 'Low') || (impact === 'Medium' && likelihood === 'Medium')) {
        return { color: 'bg-yellow-500/80 hover:bg-yellow-400/80 border-yellow-400/50', label: 'Moderate' };
    }
    // Lighter Green for low risks
    if ((impact === 'Medium' && likelihood === 'Low') || (impact === 'Low' && likelihood === 'High') || (impact === 'Low' && likelihood === 'Medium')) {
        return { color: 'bg-green-600/70 hover:bg-green-500/70 border-green-500/50', label: 'Low' };
    }
    // Darker Green for minor risks (lowest impact and likelihood)
    if (impact === 'Low' && likelihood === 'Low') {
        return { color: 'bg-green-800/70 hover:bg-green-700/70 border-green-700/50', label: 'Minor' };
    }
    // Default fallback color
    return { color: 'bg-base-300 hover:bg-base-200', label: 'Unknown' };
};


const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {

    const matrixData = useMemo(() => {
        const grid: { [impact: string]: { [likelihood: string]: RiskItem[] } } = {};
        
        impactLevels.forEach(impact => {
            grid[impact] = {};
            likelihoodLevels.forEach(likelihood => {
                grid[impact][likelihood] = [];
            });
        });

        risks.forEach(risk => {
            // Ensure the risk's impact and likelihood are valid keys before assigning
            if (grid[risk.impact] && grid[risk.impact][risk.likelihood]) {
                grid[risk.impact][risk.likelihood].push(risk);
            }
        });
        return grid;
    }, [risks]);


    return (
        <div className="relative pt-8 pl-8 pb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Risk Matrix (Impact vs. Likelihood)</h3>
            <p className="text-sm text-base-content mb-6">
                Visual representation of the current risk landscape. Each cell shows the number of risks for a given combination.
            </p>
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-[auto_1fr_1fr_1fr_1fr] gap-1.5 bg-base-200 rounded-lg p-2">
                {/* Top-left empty cell */}
                <div />

                {/* Likelihood labels (X-axis) */}
                {likelihoodLevels.map(level => (
                    <div key={level} className="text-center font-bold text-base-content py-2">{level}</div>
                ))}

                {/* Impact labels (Y-axis) and Matrix Cells */}
                {impactLevels.map(impactLevel => (
                    <React.Fragment key={impactLevel}>
                        <div className="flex items-center justify-end font-bold text-base-content px-3 text-right">{impactLevel}</div>
                        {likelihoodLevels.map(likelihoodLevel => {
                             const cellRisks = matrixData[impactLevel][likelihoodLevel];
                             const cellConfig = getCellConfig(impactLevel, likelihoodLevel);
                             const tooltipText = cellRisks.length > 0
                                ? `Risks (${cellRisks.length}):\n${cellRisks.map(r => `- ${r.description}`).join('\n')}`
                                : `No risks for ${impactLevel} Impact / ${likelihoodLevel} Likelihood`;
                            
                            return (
                                <div
                                    key={`${impactLevel}-${likelihoodLevel}`}
                                    title={tooltipText}
                                    aria-label={tooltipText}
                                    className={`aspect-square rounded-md flex items-center justify-center transition-colors duration-200 border cursor-pointer ${cellConfig.color}`}
                                >
                                    <span className="text-3xl font-extrabold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
                                        {cellRisks.length > 0 ? cellRisks.length : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg font-bold text-white">
                <span>Likelihood</span>
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 -rotate-90 text-lg font-bold text-white">
                 <span>Impact</span>
            </div>
        </div>
    );
};

export default RiskMatrix;