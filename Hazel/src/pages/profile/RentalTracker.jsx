import React from 'react';
import { useApp } from '../../hooks/useApp';

// Component for a User's rental history
const UserRentalHistory = ({ userHistory, products, generateAndPrintReceipt }) => (
    <>
        <div className="profile-view-header">
            <h1>My Rental History</h1>
            <p>A log of all the items you've rented through HAZEL.</p>
        </div>
        <div id="rentalTrackerGrid">
            {userHistory.length > 0 ? (
                userHistory.map(rental => {
                    const product = products.find(p => p.id === rental.productId);
                    if (!product) return null;
                    
                    const handlePrint = () => {
                        const orderDetails = {
                            transactionId: rental.transactionId,
                            date: rental.rentalStartDate,
                            items: [{...rental}], // Pass as an array of items
                            rentalCost: rental.rentalTotalCost,
                            deliveryFee: rental.deliveryFee,
                            serviceFee: rental.serviceFee,
                            totalAmount: rental.totalAmount
                        };
                        generateAndPrintReceipt(orderDetails);
                    };

                    return (
                        <div key={rental.transactionId} className="rental-tracker-item">
                            <img src={product.image} alt={product.title} />
                            <div className="rental-tracker-info">
                                <h4>{product.title}</h4>
                                <p>Rented on: {new Date(rental.rentalStartDate).toLocaleDateString()}</p>
                                <p>Status: <span className="status-active">Completed</span></p>
                            </div>
                            <div className="rental-tracker-actions">
                                <button 
                                    className="btn btn-outline btn-small"
                                    onClick={handlePrint}
                                >
                                    <i className="fas fa-print"></i> Print Receipt
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>You have not rented any items yet.</p>
            )}
        </div>
    </>
);

// Component for an Owner's lent items history
const OwnerLentHistory = ({ lentHistory, products }) => (
    <>
        <div className="profile-view-header">
            <h1>Items You've Lent Out</h1>
            <p>A history of your items that have been rented by others.</p>
        </div>
        <div id="rentalTrackerGrid">
            {lentHistory.length > 0 ? (
                 lentHistory.map(rental => {
                    const product = products.find(p => p.id === rental.productId);
                    if (!product) return null;
                    return (
                        <div key={rental.transactionId} className="rental-tracker-item">
                            <img src={product.image} alt={product.title} />
                            <div className="rental-tracker-info">
                                <h4>{product.title}</h4>
                                <p>Rented by: {rental.renterName}</p>
                                <p>Start Date: {new Date(rental.rentalStartDate).toLocaleDateString()}</p>
                                <p>Status: <span className="status-rented">{rental.status}</span></p>
                            </div>
                        </div>
                    );
                })
            ) : (
                 <p>None of your items have been rented out yet.</p>
            )}
        </div>
    </>
);


const RentalTracker = () => {
    const { currentUser, products, rentalHistory, ownerLentHistory, generateAndPrintReceipt } = useApp();

    if (!currentUser) return null;
    
    return (
        <div className="profile-view">
            {currentUser.role === 'user' && 
                <UserRentalHistory 
                    userHistory={rentalHistory} 
                    products={products}
                    generateAndPrintReceipt={generateAndPrintReceipt} 
                />
            }
            {currentUser.role === 'owner' &&
                <OwnerLentHistory 
                    lentHistory={ownerLentHistory}
                    products={products}
                />
            }
        </div>
    );
};

export default RentalTracker;