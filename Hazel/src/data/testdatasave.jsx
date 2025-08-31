// FILE: src/data/testdatasave.jsx

import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialSimulatedUsers, initialRentalHistoryData } from './initialData';

const TestDataSavePage = () => {
    const [status, setStatus] = useState('Ready to seed data.');
    const [isLoading, setIsLoading] = useState(false);

    // Helper to transform user data for the database
    const transformUserForDb = (user) => {
        const transformedUser = {
            ...user,
            // Convert arrays to comma-separated strings for TEXT columns
            myListingIds: user.myListingIds.join(','),
            favoriteListingIds: user.favoriteListingIds.join(','),

            // Flatten the paymentInfo object into separate columns
            paymentCardNumber: user.paymentInfo ? user.paymentInfo.cardNumber : null,
            paymentExpiryDate: user.paymentInfo ? user.paymentInfo.expiryDate : null,
            paymentCvv: user.paymentInfo ? user.paymentInfo.cvv : null,
        };
        // Remove the original nested object as it doesn't exist as a column
        delete transformedUser.paymentInfo;
        return transformedUser;
    };


    const seedTable = async (tableName, data, isProfile = false) => {
        setIsLoading(true);
        setStatus(`Clearing table: ${tableName}...`);
        
        // Clear table using a filter that will always be true to delete all rows.
        const { error: deleteError } = await supabase.from(tableName).delete().neq('id', -1); // A condition that's always true for tables with 'id'
        if (deleteError) {
             // For profiles table which has 'email' as primary key
            const { error: deleteProfileError } = await supabase.from(tableName).delete().neq('email', 'a_non_existent_email@example.com');
            if(deleteProfileError) {
                setStatus(`Error clearing ${tableName}: ${deleteProfileError.message}`);
                setIsLoading(false);
                return false;
            }
        }

        const dataToInsert = isProfile ? data.map(transformUserForDb) : data;

        setStatus(`Seeding ${dataToInsert.length} records into ${tableName}...`);
        const { error: insertError } = await supabase.from(tableName).insert(dataToInsert);
        if (insertError) {
            setStatus(`Error seeding ${tableName}: ${insertError.message}`);
            setIsLoading(false);
            return false;
        }

        setStatus(`Successfully seeded ${tableName}!`);
        setIsLoading(false);
        return true;
    };

    const handleSeedProducts = () => {
        seedTable('products', initialProductData);
    };

    const handleSeedProfiles = () => {
        const usersArray = Object.values(initialSimulatedUsers);
        seedTable('profiles', usersArray, true);
    };

    const handleSeedRentals = () => {
        seedTable('rental_history', initialRentalHistoryData);
    };
    
    const handleSeedAll = async () => {
        setIsLoading(true);
        setStatus('Starting full database seed...');
        
        const profilesSuccess = await seedTable('profiles', Object.values(initialSimulatedUsers), true);
        if (!profilesSuccess) return; 
        
        const productsSuccess = await seedTable('products', initialProductData);
        if (!productsSuccess) return;

        const rentalsSuccess = await seedTable('rental_history', initialRentalHistoryData);
        if (!rentalsSuccess) return;

        setStatus('All tables seeded successfully!');
        setIsLoading(false);
    }

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
            <h1>Supabase Data Seeding</h1>
            <p>Use these buttons to populate your Supabase database with the initial test data.</p>
            <p><strong>Warning:</strong> This will delete all existing data in the tables before inserting the new data.</p>
            <div style={{ display: 'flex', gap: '1rem', margin: '1rem' }}>
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