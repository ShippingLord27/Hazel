
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseClient.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Sample Data ---

const actors = [
    { id: 'actor-1', name: 'Keanu Reeves' },
    { id: 'actor-2', name: 'Laurence Fishburne' },
    { id: 'actor-3', name: 'Carrie-Anne Moss' },
    { id: 'actor-4', name: 'Al Pacino' },
    { id: 'actor-5', name: 'Marlon Brando' },
];

const movies = [
    {
        id: 'movie-1',
        title: 'The Matrix',
        release_year: 1999,
        genre: 'Sci-Fi',
        rating: 9,
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        tags: ['sci-fi', 'action', 'dystopian'],
        sequel_to: null,
        metadata: {
            director: 'The Wachowskis',
        },
        cast: [
            { actor_id: 'actor-1', role: 'main' },
            { actor_id: 'actor-2', role: 'main' },
            { actor_id: 'actor-3', role: 'supporting' },
        ]
    },
    {
        id: 'movie-2',
        title: 'The Godfather',
        release_year: 1972,
        genre: 'Crime',
        rating: 10,
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        tags: ['crime', 'drama', 'classic'],
        sequel_to: null,
        metadata: {
            director: 'Francis Ford Coppola',
        },
        cast: [
            { actor_id: 'actor-5', role: 'main' },
            { actor_id: 'actor-4', role: 'main' },
        ]
    },
];

const reviews = [
    {
        id: 'review-1',
        user_id: 'user-renter-1', // From your existing seed data
        movie_id: 'movie-1',
        rating: 10,
        review_text: 'An absolute masterpiece! Changed my perspective on reality.',
        review_date: new Date()
    }
];

const seedMovieDatabase = async () => {
    const batch = writeBatch(db);

    console.log('Seeding actors...');
    actors.forEach(actor => {
        const docRef = doc(db, 'actors', actor.id);
        batch.set(docRef, actor);
    });

    console.log('Seeding movies...');
    movies.forEach(movie => {
        const docRef = doc(db, 'movies', movie.id);
        batch.set(docRef, movie);
    });

    console.log('Seeding reviews...');
    reviews.forEach(review => {
        const docRef = doc(db, 'reviews', review.id);
        batch.set(docRef, review);
    });

    try {
        await batch.commit();
        console.log('--- Movie database seeding successful! ---');
    } catch (error) {
        console.error('--- Movie database seeding failed ---', error);
    }
};

seedMovieDatabase();
