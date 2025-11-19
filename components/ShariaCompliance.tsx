
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