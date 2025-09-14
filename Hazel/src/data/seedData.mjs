
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config.js';

export const seedDatabase = async () => {
    // Clear existing data
    const collections = ['products', 'categories', 'tags'];
    for (const coll of collections) {
        const querySnapshot = await getDocs(collection(db, coll));
        for (const doc of querySnapshot.docs) {
            await deleteDoc(doc.ref);
        }
    }

    // Add new data
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

    for (const product of products) {
        await addDoc(collection(db, 'products'), product);
    }

    const categories = [
        { name: 'Outdoor' },
        { name: 'Electronics' },
        { name: 'Party' },
        { name: 'Tools' },
        { name: 'Sports' },
        { name: 'Home' },
    ];

    for (const category of categories) {
        await addDoc(collection(db, 'categories'), category);
    }

    const tags = [
        { name: 'camping' },
        { name: 'hiking' },
        { name: 'outdoor' },
        { name: 'photography' },
        { name: 'camera' },
        { name: 'electronics' },
        { name: 'party' },
        { name: 'music' },
        { name: 'sound' },
    ];

    for (const tag of tags) {
        await addDoc(collection(db, 'tags'), tag);
    }

    console.log('Database seeded successfully');
};
