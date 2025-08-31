import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialSimulatedUsers, initialRentalHistoryData } from '../data/initialData';

const TestDataSavePage = () => {
    const [status, setStatus] = useState('Ready to seed data.');
    const [isLoading, setIsLoading] = useState(false);

    const seedTable = async (tableName, data) => {
        setIsLoading(true);
        setStatus(`Clearing table: ${tableName}...`);

        // Use a filter that always evaluates to true to delete all rows.
        // For 'products' table, you can use 'id' if it's always present.
        // For 'profiles' table, use 'email'.
        const deleteFilterColumn = tableName === 'profiles' ? 'email' : 'id';
        const { error: deleteError } = await supabase.from(tableName).delete().neq(deleteFilterColumn, 'this_is_a_dummy_value_to_delete_all');

        if (deleteError) {
            setStatus(`Error clearing ${tableName}: ${deleteError.message}`);
            setIsLoading(false);
            return false;
        }

        setStatus(`Seeding ${data.length} records into ${tableName}...`);
        const { error: insertError } = await supabase.from(tableName).insert(data);
        if (insertError) {
            setStatus(`Error seeding ${tableName}: ${insertError.message}`);
            setIsLoading(false);
            return false;
        }

        setStatus(`Successfully seeded ${tableName}!`);
        setIsLoading(false);
        return true;
    };

    const handleSeedProducts = async () => {
        await seedTable('products', initialProductData);
    };

    const handleSeedProfiles = async () => {
        // Supabase insert requires an array, so we convert the users object to an array
        const usersArray = Object.values(initialSimulatedUsers);
        
        // Transform the data to match the database schema
        const transformedUsers = usersArray.map(user => {
            const dbUser = {
                ...user,
                // Convert arrays to comma-separated strings
                myListingIds: user.myListingIds.join(','),
                favoriteListingIds: user.favoriteListingIds.join(','),
                // Flatten paymentInfo object
                paymentCardNumber: user.paymentInfo?.cardNumber || null,
                paymentExpiryDate: user.paymentInfo?.expiryDate || null,
                paymentCvv: user.paymentInfo?.cvv || null,
            };
            // Remove the original nested object key
            delete dbUser.paymentInfo;
            return dbUser;
        });

        await seedTable('profiles', transformedUsers);
    };

    const handleSeedRentals = async () => {
        await seedTable('rental_history', initialRentalHistoryData);
    };
    
    const handleSeedAll = async () => {
        setIsLoading(true);
        setStatus('Starting full database seed...');
        
        if (!await seedTable('profiles', (() => {
            const transformed = Object.values(initialSimulatedUsers).map(user => {
                const dbUser = { ...user, myListingIds: user.myListingIds.join(','), favoriteListingIds: user.favoriteListingIds.join(','), paymentCardNumber: user.paymentInfo?.cardNumber || null, paymentExpiryDate: user.paymentInfo?.expiryDate || null, paymentCvv: user.paymentInfo?.cvv || null };
                delete dbUser.paymentInfo;
                return dbUser;
            });
            return transformed;
        })())) return; // Stop if seeding profiles fails

        if (!await seedTable('products', initialProductData)) return; // Stop if seeding products fails
        if (!await seedTable('rental_history', initialRentalHistoryData)) return; // Stop if seeding rentals fails
        
        setIsLoading(false);
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
                <strong>Status:</strong> {status}
            </div>
        </div>
    );
};

export default TestDataSavePage;