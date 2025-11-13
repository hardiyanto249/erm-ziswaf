
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { apiService } from '../services/apiService';

// --- Reusable Components ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">{title}</h2>
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
     const [totalCollected, setTotalCollected] = useState(0);
     const [totalDistributed, setTotalDistributed] = useState(0);
     const [donors, setDonors] = useState(0);
     const [beneficiaries, setBeneficiaries] = useState(0);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
         const fetchZisStats = async () => {
             try {
                 const stats = await apiService.getZisStats();
                 setTotalCollected(stats.data.collection_total);
                 setTotalDistributed(stats.data.distribution_total);
                 setDonors(stats.data.donors);
                 setBeneficiaries(stats.data.beneficiaries);
             } catch (error) {
                 console.error('Failed to fetch ZIS stats:', error);
                 // Fallback to mock data if backend is not available
                 setTotalCollected(925000000);
                 setTotalDistributed(710000000);
                 setDonors(15480);
                 setBeneficiaries(8950);
             } finally {
                 setLoading(false);
             }
         };

         fetchZisStats();

         // Keep real-time updates for demo purposes
         const interval = setInterval(() => {
             setTotalCollected(prev => prev + Math.floor(Math.random() * 1000000));
             setTotalDistributed(prev => prev + Math.floor(Math.random() * 800000));
         }, 3000); // Update every 3 seconds

         return () => clearInterval(interval);
     }, []);

    const managedFunds = totalCollected - totalDistributed;
     const operationalEfficiency = ((totalDistributed / totalCollected) * 100).toFixed(2);


    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Monitoring & Tracking ZIS</h1>
                <p className="mt-2 text-sm sm:text-base text-base-content max-w-3xl">
                    Overview of the Zakat, Infaq, and Sadaqah fund lifecycle from collection to distribution.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* --- PENGHIMPUNAN --- */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    <Section title="Penghimpunan (Collection)">
                        <div className="space-y-3 sm:space-y-4">
                            <KpiCard title="Total Dana Terhimpun" value={formatCurrency(totalCollected)} icon={<CollectionIcon />} />
                            <KpiCard title="Jumlah Muzakki" value={donors.toLocaleString()} icon={<DonorIcon />} />
                            <KpiCard title="Rata-rata Donasi" value={formatCurrency(totalCollected / (donors || 1))} icon={<CollectionIcon />} />
                        </div>
                        <div className="h-48 sm:h-64 mt-4 sm:mt-6">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={collectionData} cx="50%" cy="50%" labelLine={false} outerRadius={60} fill="#8884d8" dataKey="value" nameKey="name">
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
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                     {/* --- PENGELOLAAN --- */}
                    <Section title="Pengelolaan (Management)">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                            <KpiCard title="Dana Kelolaan Saat Ini" value={formatCurrency(managedFunds)} icon={<ManagementIcon />} />
                            <KpiCard title="Efisiensi Operasional" value={`${operationalEfficiency}%`} icon={<ManagementIcon />} />
                             <KpiCard title="Dana Produktif" value={formatCurrency(150000000)} icon={<ManagementIcon />} />
                        </div>
                    </Section>

                    {/* --- PENDISTRIBUSIAN --- */}
                    <Section title="Pendistribusian (Distribution)">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                             <KpiCard title="Total Dana Tersalurkan" value={formatCurrency(totalDistributed)} icon={<DistributionIcon />} />
                             <KpiCard title="Jumlah Mustahik" value={beneficiaries.toLocaleString()} icon={<BeneficiaryIcon />} />
                             <KpiCard title="Jangkauan Program" value="15 Provinsi" icon={<DistributionIcon />} />
                        </div>
                        <div className="h-64 sm:h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={distributionData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis type="number" stroke="#a6adbb" tickFormatter={(value) => `${value / 1000000} Jt`} />
                                    <YAxis type="category" dataKey="name" stroke="#a6adbb" width={60} tick={{ fontSize: 11 }} />
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
