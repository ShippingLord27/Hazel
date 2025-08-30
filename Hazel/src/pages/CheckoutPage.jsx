import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const CheckoutPage = () => {
    // 1. Get `products` array directly from the context
    const { cart, currentUser, products, clearCart, showToast, rentalAgreementTemplate, users } = useApp();
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (!currentUser || cart.length === 0) {
            showToast("Your cart is empty or you are not logged in.");
            navigate('/products');
        }
    }, [currentUser, cart, navigate, showToast]);

    const rentalCost = cart.reduce((sum, item) => sum + item.rentalTotalCost, 0);
    const deliveryFee = cart.reduce((sum, item) => sum + item.deliveryFee, 0);
    const serviceFee = rentalCost * 0.05;
    const totalAmount = rentalCost + deliveryFee + serviceFee;
    
    const agreementContent = useMemo(() => {
        // 2. Use `products.find()` inside the memo
        const uniqueOwnerIds = [...new Set(cart.map(item => products.find(p => p.id === item.productId)?.ownerId).filter(Boolean))];
        
        const ownerTerms = uniqueOwnerIds.map(ownerId => {
            const owner = users[ownerId];
            const ownerItems = cart.filter(item => products.find(p => p.id === item.productId)?.ownerId === ownerId);
            const termsList = ownerItems
                .map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return product?.ownerTerms ? `<li><strong>${product.title}:</strong> ${product.ownerTerms}</li>` : null;
                })
                .filter(Boolean)
                .join('');
            
            return termsList ? `<div class="agreement-item"><h4>Terms from ${owner.firstName} ${owner.lastName}</h4><ul>${termsList}</ul></div>` : '';
        }).join('');

        return `<div class="agreement-item"><p>${rentalAgreementTemplate.replace(/\n/g, '<br>')}</p></div>${ownerTerms}`;
    }, [cart, products, rentalAgreementTemplate, users]); // 3. Add `products` to dependency array

    const generateAndDownloadReceipt = (transactionId) => {
        let receiptContent = `HAZEL RENTAL RECEIPT\nTransaction ID: ${transactionId}\nDate: ${new Date().toLocaleString()}\n\n`;
        cart.forEach(item => {
            // 4. Use `products.find()` here as well
            const product = products.find(p => p.id === item.productId);
            if (product) {
                receiptContent += `- ${product.title}\n  Duration: ${item.rentalDurationDays} day(s)\n  Cost: ₱${item.rentalTotalCost.toFixed(2)}\n`;
            }
        });
        receiptContent += `\nSubtotal: ₱${rentalCost.toFixed(2)}\nDelivery: ₱${deliveryFee.toFixed(2)}\nService Fee: ₱${serviceFee.toFixed(2)}\nTOTAL: ₱${totalAmount.toFixed(2)}`;
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Hazel_Receipt_${transactionId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        showToast("Processing payment...");
        setTimeout(() => {
            setIsProcessing(false);
            setIsConfirmed(true);
            showToast("Rental Confirmed! Thank you.");
            clearCart();
        }, 2000);
    };

    if (isConfirmed) {
        const transactionId = `HZL-TRX-${Date.now()}`;
        return (
            <div className="page active" style={{ paddingTop: '70px' }}>
                <div className="container checkout-page-container">
                    <div id="checkoutConfirmationSection" style={{display: 'block', textAlign: 'center', padding: '50px 0'}}>
                        <i className="fas fa-check-circle" style={{fontSize: '5em', color: 'var(--success-color)'}}></i>
                        <h2>Rental Confirmed!</h2>
                        <p>Thank you for your order. A receipt has been generated for your records.</p>
                        <button className="btn btn-success" onClick={() => generateAndDownloadReceipt(transactionId)}><i className="fas fa-download"></i> Download Receipt</button>
                        <button className="btn btn-primary" style={{marginLeft: '10px'}} onClick={() => navigate('/profile')}>Go to Profile</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="page active" id="checkout-page" style={{ paddingTop: '70px' }}>
            <div className="container checkout-page-container">
                <section className="checkout-header-section">
                    <h1>Complete Your Rental</h1>
                    <p>Please review and agree to the terms before payment.</p>
                </section>
                <div className="checkout-content-grid">
                    <div className="checkout-forms-container">
                        <div id="checkout-agreement-section">
                            <h3>Rental Agreement</h3>
                            <div className="agreement-content" dangerouslySetInnerHTML={{ __html: agreementContent }}></div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="checkbox" id="checkoutAgreementCheckbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                <label htmlFor="checkoutAgreementCheckbox" style={{ marginBottom: 0 }}>I have read and agree to all terms.</label>
                            </div>
                        </div>
                        <div id="checkout-payment-section" className={!agreed ? 'disabled' : ''}>
                            <form id="checkoutForm" onSubmit={handleSubmit}>
                                <div className="checkout-section"><h3>Payment Details</h3></div>
                                <div className="form-group"><label htmlFor="checkoutCardNumber">Card Number</label><input type="text" id="checkoutCardNumber" placeholder="4242 4242 4242 4242" required /></div>
                                <div className="form-group-row">
                                    <div className="form-group"><label htmlFor="checkoutExpiryDate">Expiry Date</label><input type="text" id="checkoutExpiryDate" placeholder="MM/YY" required /></div>
                                    <div className="form-group"><label htmlFor="checkoutCvv">CVV</label><input type="text" id="checkoutCvv" placeholder="123" required /></div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block" disabled={!agreed || isProcessing}>
                                    {isProcessing ? 'Processing...' : `Confirm & Pay ₱${totalAmount.toFixed(2)}`}
                                </button>
                            </form>
                        </div>
                    </div>
                    <aside className="checkout-order-summary">
                        <h2>Order Summary</h2>
                        <div id="checkoutItemDetails">
                            {cart.map(item => {
                                // 5. Final use of `products.find()` in the JSX
                                const product = products.find(p => p.id === item.productId);
                                if (!product) return null;
                                return (
                                    <div className="checkout-summary-item" key={item.productId}>
                                        <img src={product.image} alt={product.title} />
                                        <div className="checkout-summary-item-info">
                                            <h4>{product.title}</h4>
                                            <p>{item.rentalDurationDays} day(s) at ₱{item.rentalTotalCost.toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="checkout-price-breakdown">
                            <div className="price-row"><span className="label">Rental Cost:</span> <span>₱{rentalCost.toFixed(2)}</span></div>
                            <div className="price-row"><span className="label">Delivery Fee:</span> <span>₱{deliveryFee.toFixed(2)}</span></div>
                            <div className="price-row"><span className="label">Service Fee (5%):</span> <span>₱{serviceFee.toFixed(2)}</span></div>
                            <hr/>
                            <div className="price-row total"><span className="label">Total:</span> <span>₱{totalAmount.toFixed(2)}</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;