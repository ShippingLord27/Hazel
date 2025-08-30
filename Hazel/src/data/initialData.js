export const initialProductData = [
    {
                id: 1,
                title: "DSLR Camera",
                fullTitle: "Canon EOS 90D DSLR Camera",
                category: "Electronics",
                price: 25, 
                priceDisplay: "₱25/day",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                description: "Professional-grade Canon EOS 90D DSLR camera with 32.5MP APS-C sensor and 4K video capabilities.",
                ownerId: "alice.photo@example.com",
                ownerName: "Alice Photo",
                reviews: [],
                trackingTagId: "HZL-CAM-001",
                ownerTerms: "Handle with extreme care. Renter is liable for any damage to the lens or sensor. Late fee is ₱500/day."
            },
            {
                id: 2,
                title: "Mountain Bike",
                fullTitle: "Trek Marlin 5 Mountain Bike",
                category: "Vehicles",
                price: 20,
                priceDisplay: "₱20/day",
                image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                description: "High-quality Trek Marlin 5 mountain bike perfect for trail riding and outdoor adventures.",
                ownerId: "bob.rider@example.com",
                ownerName: "Bob Rider",
                reviews: [],
                trackingTagId: "HZL-BIK-002",
                ownerTerms: "Bike must be returned clean. No extreme downhill or stunt riding."
            },
            {
                id: 3,
                title: "Power Drill Set",
                fullTitle: "DeWalt Power Drill Set",
                category: "Tools",
                price: 15,
                priceDisplay: "₱15/day",
                image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                description: "Professional power drill set with multiple attachments and accessories.",
                ownerId: "john.doe@example.com", 
                ownerName: "John Doe",
                reviews: [],
                trackingTagId: "HZL-TOL-003",
                ownerTerms: ""
            },
            {
                id: 4,
                title: "Bounce House",
                fullTitle: "Commercial Grade Bounce House",
                category: "Party",
                price: 75,
                priceDisplay: "₱75/day",
                image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                description: "Commercial-grade bounce house perfect for birthday parties.",
                ownerId: "alice.photo@example.com",
                ownerName: "Alice Photo",
                reviews: [],
                trackingTagId: "HZL-PTY-004",
                ownerTerms: "No shoes, sharp objects, or food/drinks allowed inside the bounce house."
            },
            {
                id: 5,
                title: "Single Kayak",
                fullTitle: "Perception Pescador Pro 10.0 Kayak",
                category: "Sports",
                price: 35,
                priceDisplay: "₱35/day",
                image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                description: "High-performance fishing kayak perfect for lakes and rivers.",
                ownerId: "john.doe@example.com", 
                ownerName: "John Doe",
                reviews: [],
                trackingTagId: "HZL-SPT-005",
                ownerTerms: "Do not use in saltwater. Must be rinsed before return."
            },
            {
                id: 6,
                title: "HD Projector",
                fullTitle: "Epson Home Cinema 1080 HD Projector",
                category: "Electronics",
                price: 30,
                priceDisplay: "₱30/day",
                image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                description: "High-quality 1080p HD projector perfect for movie nights.",
                ownerId: "bob.rider@example.com",
                ownerName: "Bob Rider",
                reviews: [],
                trackingTagId: "HZL-ELC-006",
                ownerTerms: ""
            }
];

export const initialSimulatedUsers = {
    "john.doe@example.com": {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "123",
        profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
        memberSince: "June 2020",
        location: "San Francisco, CA",
        myListingIds: [3, 5],
        favoriteListingIds: [],
        activeRentalsCount: 2,
        totalEarningsAmount: 12537.50,
        totalListingViews: 1230,
        role: 'owner',
        verificationStatus: 'verified',
        paymentInfo: null
    },
      "jane.smith@example.com": {
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                password: "123",
                profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
                memberSince: "July 2021",
                location: "New York, NY",
                myListingIds: [],
                favoriteListingIds: [3, 4],
                activeRentalsCount: 1,
                totalEarningsAmount: 0,
                totalListingViews: 0,
                role: 'user',
                verificationStatus: 'verified',
                paymentInfo: {
                    cardNumber: '4242424242421234',
                    expiryDate: '12/26',
                    cvv: '123'
                }
            },
            "admin@hazel.com": {
                firstName: "Super",
                lastName: "Admin",
                email: "admin@hazel.com",
                password: "admin",
                profilePic: "https://randomuser.me/api/portraits/lego/0.jpg",
                memberSince: "Jan 2024",
                location: "Hazel HQ",
                myListingIds: [],
                favoriteListingIds: [],
                activeRentalsCount: 0,
                totalEarningsAmount: 0,
                totalListingViews: 0,
                role: 'admin',
                verificationStatus: 'verified',
                paymentInfo: null
            },
            "alice.photo@example.com": { 
                firstName: "Alice",
                lastName: "Photo",
                email: "alice.photo@example.com",
                password: "123",
                profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
                location: "Los Angeles, CA",
                myListingIds: [1, 4],
                favoriteListingIds: [],
                activeRentalsCount: 1,
                totalEarningsAmount: 5000.00,
                totalListingViews: 500,
                role: 'owner',
                verificationStatus: 'pending',
                paymentInfo: null
            },
            "bob.rider@example.com": { 
                firstName: "Bob",
                lastName: "Rider",
                email: "bob.rider@example.com",
                password: "123",
                profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
                location: "Denver, CO",
                myListingIds: [2, 6],
                favoriteListingIds: [],
                activeRentalsCount: 3,
                totalEarningsAmount: 7525.00,
                totalListingViews: 800,
                role: 'owner',
                verificationStatus: 'unverified',
                paymentInfo: null
            }
};
export const initialRentalAgreement = `By renting this item, you agree to the Hazel platform terms of service. You are responsible for the item during the rental period and must return it in the same condition you received it, accounting for normal wear and tear. Late returns may be subject to additional fees as specified by the owner. Please communicate promptly with the item owner regarding pickup, drop-off, and any issues that may arise.`;

// Mock data for user's rental history
export const initialRentalHistory = {
    "jane.smith@example.com": [
        {
            transactionId: 'HZL-TRX-1667894400',
            productId: 2, // Mountain Bike
            rentalStartDate: '2025-10-15',
            rentalDurationDays: 3,
            rentalTotalCost: 50.00, // 20 * 2.5 for 3 days
            deliveryFee: 15.00,
            serviceFee: 2.50, // 5% of 50
            totalAmount: 67.50
        }
    ]
};

// Mock data for owner's lent item history
export const initialOwnerLentHistory = {
    "bob.rider@example.com": [
        {
            transactionId: 'HZL-TRX-1667894400',
            productId: 2, // Mountain Bike
            renterName: "Jane Smith",
            rentalStartDate: '2025-10-15',
            status: 'Completed'
        }
    ]
};