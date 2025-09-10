
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseClient.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newTags = [
    'DIY', 'Power Tool', 'Photography', 'Video', 'Outdoor', 'Camping',
    'Event', 'Party', 'Kitchen', 'Appliance', 'Gardening',
    'Construction', 'Formal Wear', 'Watersports', 'Sports'
];

const addTags = async () => {
    const batch = writeBatch(db);
    const tagsRef = collection(db, 'tags');

    console.log('Fetching existing tags to prevent duplicates...');
    const querySnapshot = await getDocs(tagsRef);
    const existingTags = new Set(querySnapshot.docs.map(doc => doc.data().name.toLowerCase()));
    console.log(`Found ${existingTags.size} existing tags.`);

    let tagsAddedCount = 0;
    newTags.forEach(tagName => {
        if (!existingTags.has(tagName.toLowerCase())) {
            const tagId = `tag-${tagName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;
            const docRef = doc(db, 'tags', tagId);
            batch.set(docRef, { name: tagName });
            console.log(`Adding new tag: "${tagName}"`);
            tagsAddedCount++;
        } else {
            console.log(`Tag "${tagName}" already exists. Skipping.`);
        }
    });

    if (tagsAddedCount > 0) {
        try {
            await batch.commit();
            console.log(`--- Successfully added ${tagsAddedCount} new tags to the database! ---`);
        } catch (error) {
            console.error('--- Failed to add new tags ---', error);
        }
    } else {
        console.log('--- No new tags to add. ---');
    }
};

addTags();
