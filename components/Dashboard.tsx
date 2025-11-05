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
