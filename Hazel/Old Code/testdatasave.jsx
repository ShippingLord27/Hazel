import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialSimulatedUsers, initialRentalHistoryData, initialTagsData, initialProductTagsData } from './initialData';
const TestDataSavePage = () => {
const [status, setStatus] = useState('Ready to seed data.');
const [isLoading, setIsLoading] = useState(false);

// Helper to transform user data for the database
const transformUserForDb = (user) => {
    const transformedUser = { ...user, myListingIds: user.myListingIds.join(','), favoriteListingIds: user.favoriteListingIds.join(','), paymentCardNumber: user.paymentInfo ? user.paymentInfo.cardNumber : null, paymentExpiryDate: user.paymentInfo ? user.paymentInfo.expiryDate : null, paymentCvv: user.paymentInfo ? user.paymentInfo.cvv : null, };
    delete transformedUser.paymentInfo;
    return transformedUser;
};


const seedTable = async (tableName, data, isProfile = false) => {
    setIsLoading(true);
    setStatus(`Clearing table: ${tableName}...`);
    
    const { error: deleteError } = await supabase.from(tableName).delete().neq(isProfile ? 'email' : 'id', 'a_non_existent_value');
    if (deleteError) {
        setStatus(`Error clearing ${tableName}: ${deleteError.message}`);
        setIsLoading(false);
        return false;
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

const handleSeedAll = async () => {
    setIsLoading(true);
    setStatus('Starting full database seed...');
    
    // Clear tables in reverse order of dependency
    setStatus('Clearing product_tags...');
    await supabase.from('product_tags').delete().neq('product_id', -1);
    setStatus('Clearing rental_history...');
    await supabase.from('rental_history').delete().neq('id', -1);
    setStatus('Clearing products...');
    await supabase.from('products').delete().neq('id', -1);
    setStatus('Clearing tags...');
    await supabase.from('tags').delete().neq('id', -1);
    setStatus('Clearing profiles...');
    await supabase.from('profiles').delete().neq('email', 'non-existent@email.com');
    
    // Seed tables in order of dependency
    const profilesSuccess = await seedTable('profiles', Object.values(initialSimulatedUsers), true);
    if (!profilesSuccess) { setIsLoading(false); return; }
    
    const productsSuccess = await seedTable('products', initialProductData.map(({tags, ...rest}) => rest)); // Remove tags array before inserting
    if (!productsSuccess) { setIsLoading(false); return; }

    const rentalsSuccess = await seedTable('rental_history', initialRentalHistoryData);
    if (!rentalsSuccess) { setIsLoading(false); return; }

    const tagsSuccess = await seedTable('tags', initialTagsData);
    if (!tagsSuccess) { setIsLoading(false); return; }

    // Fetch tag IDs to map to product_tags
    const { data: tagsMap, error: tagsError } = await supabase.from('tags').select('id, name');
    if (tagsError) { setStatus('Error fetching tag IDs'); setIsLoading(false); return; }
    const tagNameToId = tagsMap.reduce((acc, tag) => { acc[tag.name] = tag.id; return acc; }, {});
    
    const productTagsDataForDb = initialProductTagsData.map(pt => ({
        product_id: pt.product_id,
        tag_id: tagNameToId[pt.tag_name]
    }));
    
    const productTagsSuccess = await seedTable('product_tags', productTagsDataForDb);
    if (!productTagsSuccess) { setIsLoading(false); return; }


    setStatus('All tables seeded successfully!');
    setIsLoading(false);
}

return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <h1>Supabase Data Seeding</h1>
        <p>Use this button to populate your Supabase database with the initial test data.</p>
        <p><strong>Warning:</strong> This will delete all existing data in the tables before inserting the new data.</p>
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem' }}>
            <button onClick={handleSeedAll} disabled={isLoading} style={{fontWeight: 'bold'}}>SEED ALL DATA</button>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', border: '1px solid #ccc' }}>
            <strong>Status:</strong> {isLoading ? 'Processing...' : status}
        </div>
    </div>
);
};
export default TestDataSavePage;