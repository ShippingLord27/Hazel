import React from 'react';
import { useApp } from '../../hooks/useApp';

const mockRentals = {
    renting: [ { id: 2, status: 'Active', returnDate: '2025-10-30' } ],
    lentOut: [ { id: 3, status: 'Rented Out', returnDate: '2025-11-05', renter: 'Alice P.' } ]
};

const RentalTracker = () => {
    // 1. Get `products` directly from the context
    const { products } = useApp();

    return (
        <div className="profile-view">
            <div className="profile-view-header">
                <h1>Rental Tracker</h1>
                <p>Track the status of your current rentals and lent items.</p>
            </div>
            
            <h3>Items You Are Renting</h3>
            {mockRentals.renting.length > 0 ? mockRentals.renting.map(rental => {
                // 2. Use `products.find()` to get the product details
                const product = products.find(p => p.id === rental.id);
                if (!product) return null;
                return (
                    <div key={`renting-${rental.id}`} className="rental-tracker-item">
                        <img src={product.image} alt={product.title} />
                        <div className="rental-tracker-info">
                            <h4>{product.title}</h4>
                            <p>Status: <span className="status-active">{rental.status}</span></p>
                            <p>Return by: {new Date(rental.returnDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                );
            }) : <p>You are not currently renting any items.</p>}

             <h3>Items You Have Lent Out</h3>
             {mockRentals.lentOut.length > 0 ? mockRentals.lentOut.map(rental => {
                const product = products.find(p => p.id === rental.id);
                if (!product) return null;
                return (
                    <div key={`lent-${rental.id}`} className="rental-tracker-item">
                        <img src={product.image} alt={product.title} />
                        <div className="rental-tracker-info">
                            <h4>{product.title}</h4>
                            <p>Status: <span className="status-rented">{rental.status}</span></p>
                            <p>Rented by: {rental.renter}</p>
                            <p>Due back: {new Date(rental.returnDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                );
            }) : <p>You have no items currently lent out.</p>}
        </div>
    );
};

export default RentalTracker;