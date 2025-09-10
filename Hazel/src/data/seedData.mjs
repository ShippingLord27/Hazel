
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseClient.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Sample Data ---

// Note: For a real app, user IDs would come from Firebase Auth.
// We'll use placeholder IDs here for demonstration.
const users = [
    { id: 'user-owner-1', firstName: 'John', lastName: 'Doe', role: 'owner', email: 'owner1@example.com', profile_pic: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 'user-renter-1', firstName: 'Jane', lastName: 'Smith', role: 'renter', email: 'renter1@example.com', profile_pic: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 'user-admin-1', firstName: 'Admin', lastName: 'User', role: 'admin', email: 'admin@example.com', profile_pic: 'https://randomuser.me/api/portraits/lego/1.jpg' },
];

const products = [
    { 
        title: 'High-Performance Camping Tent', 
        description: 'A spacious and durable tent perfect for weekend getaways. Sleeps 4 people comfortably and is easy to set up.',
        owner_id: 'user-owner-1',
        category: 'Outdoor',
        price_per_day: '25.00',
        status: 'approved',
        tags: ['camping', 'hiking', 'outdoor'],
        image_url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        availability: true,
    },
    { 
        title: 'Professional DSLR Camera', 
        description: 'Capture stunning photos with this Canon EOS 5D Mark IV. Comes with a 24-70mm lens.',
        owner_id: 'user-owner-1',
        category: 'Electronics',
        price_per_day: '50.00',
        status: 'approved',
        tags: ['photography', 'camera', 'electronics'],
        image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
        availability: true,
    },
    { 
        title: 'Portable Party Speaker', 
        description: 'Liven up any event with this powerful and portable Bluetooth speaker. Long battery life and great sound quality.',
        owner_id: 'user-owner-1',
        category: 'Party',
        price_per_day: '15.00',
        status: 'pending',
        tags: ['party', 'music', 'sound'],
        image_url: 'https://images.unsplash.com/photo-1545454675-3532b6637b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        availability: true,
    },
];

const categories = [
    { name: 'Tools' },
    { name: 'Electronics' },
    { name: 'Vehicles' },
    { name: 'Sports' },
    { name: 'Party & Events' },
    { name: 'Home & Garden' },
    { name: 'Apparel' },
    { name: 'Kitchen Appliances' },
];

const seedDatabase = async () => {
    const batch = writeBatch(db);

    // Seed Users
    console.log('Seeding users...');
    users.forEach(user => {
        const docRef = doc(db, 'users', user.id);
        batch.set(docRef, user);
    });
    console.log('Users added to batch.');

    // Seed Products
    console.log('Seeding products...');
    products.forEach(product => {
        const docRef = doc(collection(db, 'products')); // Auto-generate ID
        batch.set(docRef, product);
    });
    console.log('Products added to batch.');

    // Seed Categories
    console.log('Seeding categories...');
    categories.forEach(category => {
        const docRef = doc(collection(db, 'categories')); // Auto-generate ID
        batch.set(docRef, category);
    });
    console.log('Categories added to batch.');

    try {
        await batch.commit();
        console.log('--- Database seeding successful! ---');
    } catch (error) {
        console.error('--- Database seeding failed ---', error);
    }
};

seedDatabase();
