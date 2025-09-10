
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseClient.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Sample Data ---

const users = [
    { id: 'user-owner-1', firstName: 'John', lastName: 'Doe', role: 'owner', email: 'owner1@example.com', profile_pic_url: 'https://randomuser.me/api/portraits/men/1.jpg', location: 'New York, USA', member_since: Timestamp.fromDate(new Date('2023-01-15')) },
    { id: 'user-renter-1', firstName: 'Jane', lastName: 'Smith', role: 'renter', email: 'renter1@example.com', profile_pic_url: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'London, UK', member_since: Timestamp.fromDate(new Date('2023-02-20')) },
    { id: 'user-admin-1', firstName: 'Admin', lastName: 'User', role: 'admin', email: 'admin@example.com', profile_pic_url: 'https://randomuser.me/api/portraits/lego/1.jpg', location: 'HQ', member_since: Timestamp.fromDate(new Date('2023-01-01')) },
];

const categories = [
    { id: 'cat-outdoor', name: 'Outdoor Gear' },
    { id: 'cat-electronics', name: 'Electronics' },
    { id: 'cat-party', name: 'Party Supplies' },
];

const tags = [
    { id: 'tag-camping', name: 'camping' },
    { id: 'tag-hiking', name: 'hiking' },
    { id: 'tag-photography', name: 'photography' },
    { id: 'tag-music', name: 'music' },
];

const items = [
    {
        id: 'item-1',
        ownerId: 'user-owner-1',
        title: 'High-Performance Camping Tent',
        description: 'A spacious and durable tent perfect for weekend getaways. Sleeps 4 people comfortably and is easy to set up.',
        categoryId: 'cat-outdoor',
        tags: ['tag-camping', 'tag-hiking'],
        price_per_day: 25.00,
        availability: true,
        image_url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
        owner_terms: 'Handle with care. Return clean.'
    },
    {
        id: 'item-2',
        ownerId: 'user-owner-1',
        title: 'Professional DSLR Camera',
        description: 'Capture stunning photos with this Canon EOS 5D Mark IV. Comes with a 24-70mm lens.',
        categoryId: 'cat-electronics',
        tags: ['tag-photography'],
        price_per_day: 50.00,
        availability: true,
        image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        owner_terms: 'Lens cap and battery must be returned.'
    },
];

const chatThreads = [
    {
        id: 'thread-1',
        itemId: 'item-1',
        participants: ['user-owner-1', 'user-renter-1'],
        createdAt: Timestamp.now(),
    }
];

const chatMessages = [
    {
        threadId: 'thread-1',
        id: 'msg-1',
        senderId: 'user-renter-1',
        content: 'Hi, is this tent available for the next weekend?',
        createdAt: Timestamp.now()
    },
    {
        threadId: 'thread-1',
        id: 'msg-2',
        senderId: 'user-owner-1',
        content: 'Yes, it is! Let me know if you have any questions.',
        createdAt: Timestamp.now()
    }
];

const favorites = [
    { userId: 'user-renter-1', itemId: 'item-1' },
    { userId: 'user-renter-1', itemId: 'item-2' },
];

const transactions = [
    {
        id: 'txn-1',
        renterId: 'user-renter-1',
        itemId: 'item-2',
        startDate: Timestamp.fromDate(new Date('2023-10-01')),
        endDate: Timestamp.fromDate(new Date('2023-10-05')),
        total_amount: 200.00,
        status: 'completed',
        payment_method: 'credit_card',
    }
];

const seedDatabase = async () => {
    const batch = writeBatch(db);

    console.log('Seeding users (as profiles)...');
    users.forEach(user => {
        const { id, ...userData } = user;
        batch.set(doc(db, 'users', id), userData);
    });

    console.log('Seeding categories...');
    categories.forEach(category => {
        batch.set(doc(db, 'categories', category.id), { name: category.name });
    });

    console.log('Seeding tags...');
    tags.forEach(tag => {
        batch.set(doc(db, 'tags', tag.id), { name: tag.name });
    });

    console.log('Seeding items...');
    items.forEach(item => {
        const { id, ...itemData } = item;
        batch.set(doc(db, 'items', id), itemData);
    });

    console.log('Seeding chat threads...');
    chatThreads.forEach(thread => {
        const { id, ...threadData } = thread;
        batch.set(doc(db, 'chat_threads', id), threadData);
    });

    console.log('Seeding chat messages...');
    chatMessages.forEach(message => {
        const { threadId, id, ...messageData } = message;
        batch.set(doc(db, 'chat_threads', threadId, 'messages', id), messageData);
    });

    console.log('Seeding favorites...');
    favorites.forEach((fav, index) => {
        batch.set(doc(db, 'favorites', `fav-${index}`), fav);
    });

    console.log('Seeding transactions...');
    transactions.forEach(txn => {
        const { id, ...txnData } = txn;
        batch.set(doc(db, 'transactions', id), txnData);
    });


    try {
        await batch.commit();
        console.log('--- Database seeding successful! ---');
    } catch (error) {
        console.error('--- Database seeding failed ---', error);
    }
};

seedDatabase();
