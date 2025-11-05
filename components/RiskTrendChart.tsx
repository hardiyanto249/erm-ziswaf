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