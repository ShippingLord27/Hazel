import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialSimulatedUsers, initialRentalHistoryData } from '../data/initialData';

const TestDataSavePage = () => {
    const [status, setStatus] = useState('Ready to seed data.');
    const [isLoading, setIsLoading] = useState(false);

    const seedTable = async (tableName, data, options = {}) => {
        setIsLoading(true);
        setStatus(`Clearing table: ${tableName}...`);
        const { error: deleteError } = await supabase.from(tableName).delete().neq('id', 0); // Clear table
        if (deleteError) {
            setStatus(`Error clearing ${tableName}: ${deleteError.message}`);
            setIsLoading(false);
            return;
        }

        setStatus(`Seeding ${data.length} records into ${tableName}...`);
        const { error: insertError } = await supabase.from(tableName).insert(data);
        if (insertError) {
            setStatus(`Error seeding ${tableName}: ${insertError.message}`);
            setIsLoading(false);
            return;
        }

        setStatus(`Successfully seeded ${tableName}!`);
        setIsLoading(false);
    };

    const handleSeedProducts = () => {
        seedTable('products', initialProductData);
    };

    const handleSeedProfiles = () => {
        // Supabase insert requires an array, so we convert the users object to an array
        const usersArray = Object.values(initialSimulatedUsers);
        seedTable('profiles', usersArray);
    };

    const handleSeedRentals = () => {
        seedTable('rental_history', initialRentalHistoryData);
    };
    
    const handleSeedAll = async () => {
        await seedTable('products', initialProductData);
        await seedTable('profiles', Object.values(initialSimulatedUsers));
        await seedTable('rental_history', initialRentalHistoryData);
        setStatus('All tables seeded successfully!');
    }

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
            <h1>Supabase Data Seeding</h1>
            <p>Use these buttons to populate your Supabase database with the initial test data.</p>
            <p><strong>Warning:</strong> This will delete all existing data in the tables before inserting the new data.</p>
            <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                <button onClick={handleSeedProducts} disabled={isLoading}>Seed Products</button>
                <button onClick={handleSeedProfiles} disabled={isLoading}>Seed Profiles</button>
                <button onClick={handleSeedRentals} disabled={isLoading}>Seed Rental History</button>
                <button onClick={handleSeedAll} disabled={isLoading} style={{fontWeight: 'bold'}}>SEED ALL</button>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', border: '1px solid #ccc' }}>
                <strong>Status:</strong> {isLoading ? 'Processing...' : status}
            </div>
        </div>
    );
};

export default TestDataSavePage;