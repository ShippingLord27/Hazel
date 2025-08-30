let loginBtn, signupBtns, authModal, loginTab, signupTab, loginForm, signupForm,
            switchToSignup, switchToLogin, modalTitle, loginErrorMessage, signupErrorMessage,
            mobileMenuBtn, mainNav, profilePage, logoutBtnProfile, profilePicSidebar, toast,
            productFilterItems, productCards, homePage, aboutPage, contactPage, faqPage, privacyPolicyPage,
            homeLogo, browseBtn, viewListingBtns, /* navLinks removed as general selector, specific ones still used */
            searchInput, searchResults, darkModeToggle,
            allProductsPage, allProductsGrid, productsPageSearchInput, productsPageFilterItems, noProductsFoundMessage,
            categoriesDropdownToggle,

            profileSidebarName, profileSidebarEmail, profileWelcomeName,
            profileViews, profileSidebarLinks,
            analyticsTotalListings, analyticsActiveRentals, analyticsTotalEarnings, analyticsListingViews,
            myListingsGrid, noMyListingsMessage, addListingFromProfileBtn,
            favoritesGrid, noFavoritesMessage,

            loggedOutNavButtons, loggedInNavButtons, headerProfileLink, headerLogoutBtn, adminDashboardLinkHeader, headerCartLink, cartItemCountBadge,

            cartPage, cartItemsContainer, cartSubtotalEl, cartServiceFeeEl, cartTotalEl, cartDiscountInput, cartApplyDiscountBtn, proceedToCheckoutBtn,
            
            checkoutPage, checkoutItemDetailsContainer, checkoutRentalCostEl, checkoutDeliveryFeeEl, checkoutServiceFeeEl, checkoutTotalAmountEl,
            checkoutFullNameInput, checkoutEmailInput, checkoutPhoneInput, checkoutCardNumberInput, checkoutExpiryDateInput, checkoutCvvInput,
            checkoutForm, checkoutFormMessageEl,
            checkoutAgreementSection, checkoutPaymentSection, checkoutAgreementCheckbox, checkoutConfirmPayBtn,
            checkoutOwnerMessageSection, checkoutOwnerMessageContent, checkoutDownloadReceiptBtn, checkoutConfirmationSection,
            
            rentalTrackerGrid, noRentalsMessage,

            profileVerificationSection, verificationStatusEl, uploadIdInput, startFaceScanBtn,

            reviewModal, reviewModalTitle, reviewForm, reviewProductIdInput, reviewStarRatingContainer,
            reviewRatingValueInput, reviewerNameInput, reviewTextInput, reviewFormMessageEl, ratingErrorEl,
            reviewerNameErrorEl, reviewTextErrorEl,

            editListingModal, editListingModalTitle, editListingForm, editListingProductIdInput,
            editListingTitleInput, editListingFullTitleInput, editListingCategorySelect, editListingPriceInput,

            editListingImageInput, editListingDescriptionTextarea, editListingFormMessageEl, editListingTrackingTagInput, editListingOwnerTermsTextarea,

            createListingModal, createListingModalTitle, createListingForm,
            createListingTitleInput, createListingFullTitleInput, createListingCategorySelect, createListingPriceInput,
            createListingImageInput, createListingDescriptionTextarea, createListingFormMessageEl, createListingTrackingTagInput, createListingOwnerTermsTextarea,

            chatWidgetContainer, chatToggleBtn, chatWidget, chatHeaderContactName,
            chatMessagesContainer, chatMessageInput, chatSendMessageBtn, closeChatWidgetBtn,

            profileSettingsForm, settingsFirstNameInput, settingsLastNameInput, settingsEmailInput,
            settingsProfilePicUrlInput, settingsLocationInput, settingsCurrentPasswordInput,
            settingsNewPasswordInput, settingsConfirmNewPasswordInput, settingsFormMessageEl,

            adminDashboardPage, adminSidebarPic, adminSidebarName, adminSidebarEmail,
            adminSidebarLinks, logoutBtnAdminDashboard, adminViews,
            adminTotalUsers, adminTotalListingsSite, adminActiveRentalsSite, adminTotalSiteEarnings,
            adminUserTableBody, adminNoUsersMessage,
            adminListingsGrid, adminNoListingsMessage,
            adminContactUsTemplateTextarea, adminRentalAgreementTemplateTextarea, adminSaveTemplatesBtn, adminTemplatesFormMessageEl,
            adminSettingsForm, adminSettingsFirstNameInput, adminSettingsLastNameInput, adminSettingsEmailInput,
            adminSettingsProfilePicUrlInput, adminSettingsCurrentPasswordInput, adminSettingsNewPasswordInput,
            adminSettingsConfirmNewPasswordInput, adminSettingsFormMessageEl;


        const commonFooterHTML = `
            <div class="container">
                <div class="footer-container">
                    <div class="footer-col">
                        <h3>About HAZEL</h3>
                        <p>We are the leading rental platform connecting people who need items with those who have them to rent.</p>
                    </div>
                    <div class="footer-col">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="#" class="nav-link" data-page="home">Home</a></li>
                            <li><a href="#" class="nav-link" data-page="all-products">Products</a></li>
                            <li><a href="#" class="nav-link" data-page="about-page">About Us</a></li>
                            <li><a href="#" class="nav-link" data-page="contact-page">Contact Us</a></li>
                            <li><a href="#" class="nav-link" data-page="faq-page">FAQ</a></li>
                            <li><a href="#" class="nav-link" data-page="privacy-policy-page">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                         <h3>Categories</h3>
                        <ul class="footer-links">
                            <li><a href="#" class="nav-link" data-page="all-products" data-filter-target="tools">Tools</a></li>
                            <li><a href="#" class="nav-link" data-page="all-products" data-filter-target="electronics">Electronics</a></li>
                            <li><a href="#" class="nav-link" data-page="all-products" data-filter-target="vehicles">Vehicles</a></li>
                            <li><a href="#" class="nav-link" data-page="all-products" data-filter-target="party">Party Equipment</a></li>
                            <li><a href="#" class="nav-link" data-page="all-products" data-filter-target="sports">Sports Gear</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h3>Contact Us</h3>
                        <ul class="footer-links">
                            <li><i class="fas fa-map-marker-alt"></i> 123 Rental St, City</li>
                            <li><i class="fas fa-phone"></i> (02) 8123-4567</li>
                            <li><i class="fas fa-envelope"></i> info@hazel.com</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© 2025 HAZEL. All Rights Reserved.</p>
                </div>
            </div>
        `;

        let currentUser = null;
        let currentChatPartner = { id: 'support', name: 'HAZEL Support', context: null };
        let cart = []; // Shopping cart

        const simulatedUsers = {
            "john.doe@example.com": {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "123",
                profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
                memberSince: "June 2020",
                location: "San Francisco, CA",
                myListingIds: [3, 5],
                favoriteListingIds: [1, 6],
                activeRentalsCount: 2,
                totalEarningsAmount: 12537.50,
                totalListingViews: 1230,
                isAdmin: false,
                verificationStatus: 'verified' // 'unverified', 'pending', 'verified'
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
                isAdmin: true,
                verificationStatus: 'verified'
            },
            "alice.photo@example.com": { // Changed from owner_dslr_camera to email
                firstName: "Alice",
                lastName: "Photo",
                email: "alice.photo@example.com",
                password: "123",
                profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
                location: "Los Angeles, CA",
                myListingIds: [1, 4],
                favoriteListingIds: [2],
                activeRentalsCount: 1,
                totalEarningsAmount: 5000.00,
                totalListingViews: 500,
                isAdmin: false,
                verificationStatus: 'pending'
            },
            "bob.rider@example.com": { // Changed from owner_mountain_bike to email
                firstName: "Bob",
                lastName: "Rider",
                email: "bob.rider@example.com",
                password: "123",
                profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
                location: "Denver, CO",
                myListingIds: [2, 6],
                favoriteListingIds: [5],
                activeRentalsCount: 3,
                totalEarningsAmount: 7525.00,
                totalListingViews: 800,
                isAdmin: false,
                verificationStatus: 'unverified'
            }
        };

        function initializeCoreDOMElements() {
            loginBtn = document.getElementById('loginBtn');
            signupBtns = document.querySelectorAll('.signup-trigger-btn');
            authModal = document.getElementById('authModal');
            loginTab = document.getElementById('loginTab');
            signupTab = document.getElementById('signupTab');
            loginForm = document.getElementById('loginForm');
            signupForm = document.getElementById('signupForm');
            switchToSignup = document.getElementById('switchToSignup');
            switchToLogin = document.getElementById('switchToLogin');
            modalTitle = document.getElementById('modalTitle');
            loginErrorMessage = document.getElementById('loginErrorMessage');
            signupErrorMessage = document.getElementById('signupErrorMessage');
            mobileMenuBtn = document.getElementById('mobileMenuBtn');
            mainNav = document.querySelector('header .main-nav');
            profilePage = document.getElementById('profilePage');
            profilePicSidebar = document.getElementById('profilePicSidebar');
            toast = document.getElementById('toast');
            productFilterItems = document.querySelectorAll('#home-page .products-filter li');
            productCards = document.querySelectorAll('#home-page .products-grid .product-card');
            homePage = document.getElementById('home-page');
            aboutPage = document.getElementById('about-page');
            contactPage = document.getElementById('contact-page');
            faqPage = document.getElementById('faq-page');
            privacyPolicyPage = document.getElementById('privacy-policy-page');
            homeLogo = document.getElementById('homeLogo');
            browseBtn = document.getElementById('browseBtn');
            viewListingBtns = document.querySelectorAll('#home-page .view-listing');
            searchInput = document.getElementById('searchInput');
            searchResults = document.getElementById('searchResults');
            darkModeToggle = document.getElementById('darkModeToggle');

            allProductsPage = document.getElementById('all-products-page');
            allProductsGrid = document.getElementById('allProductsGrid');
            productsPageSearchInput = document.getElementById('productsPageSearchInput');
            productsPageFilterItems = document.querySelectorAll('#productsPageFilter li');
            noProductsFoundMessage = document.getElementById('noProductsFoundMessage');

            categoriesDropdownToggle = document.querySelector('.categories-dropdown-toggle');


            profileSidebarName = document.getElementById('profileSidebarName');
            profileSidebarEmail = document.getElementById('profileSidebarEmail');
            profileWelcomeName = document.getElementById('profileWelcomeName');
            profileViews = document.querySelectorAll('.profile-view');
            profileSidebarLinks = document.querySelectorAll('#profilePage .profile-sidebar .sidebar-menu a');
            logoutBtnProfile = document.getElementById('logoutBtnProfile');
            analyticsTotalListings = document.getElementById('analyticsTotalListings');
            analyticsActiveRentals = document.getElementById('analyticsActiveRentals');
            analyticsTotalEarnings = document.getElementById('analyticsTotalEarnings');
            analyticsListingViews = document.getElementById('analyticsListingViews');
            myListingsGrid = document.getElementById('myListingsGrid');
            noMyListingsMessage = document.getElementById('noMyListingsMessage');
            addListingFromProfileBtn = document.getElementById('addListingFromProfileBtn');
            favoritesGrid = document.getElementById('favoritesGrid');
            noFavoritesMessage = document.getElementById('noFavoritesMessage');


            loggedOutNavButtons = document.getElementById('loggedOutNavButtons');
            loggedInNavButtons = document.getElementById('loggedInNavButtons');
            headerProfileLink = document.getElementById('headerProfileLink');
            headerLogoutBtn = document.getElementById('headerLogoutBtn');
            adminDashboardLinkHeader = document.getElementById('adminDashboardLink');
            headerCartLink = document.getElementById('headerCartLink');
            cartItemCountBadge = document.getElementById('cartItemCount');


            cartPage = document.getElementById('cart-page');
            if(cartPage){
                cartItemsContainer = document.getElementById('cartItemsContainer');
                cartSubtotalEl = document.getElementById('cartSubtotal');
                cartServiceFeeEl = document.getElementById('cartServiceFee');
                cartTotalEl = document.getElementById('cartTotal');
                cartDiscountInput = document.getElementById('cartDiscountInput');
                cartApplyDiscountBtn = document.getElementById('cartApplyDiscountBtn');
                proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
            }

            checkoutPage = document.getElementById('checkout-page');
            if (checkoutPage) {
                checkoutItemDetailsContainer = document.getElementById('checkoutItemDetails');
                checkoutRentalCostEl = document.getElementById('checkoutRentalCost');
                checkoutDeliveryFeeEl = document.getElementById('checkoutDeliveryFee');
                checkoutServiceFeeEl = document.getElementById('checkoutServiceFee');
                checkoutTotalAmountEl = document.getElementById('checkoutTotalAmount');
                checkoutFullNameInput = document.getElementById('checkoutFullName');
                checkoutEmailInput = document.getElementById('checkoutEmail');
                checkoutPhoneInput = document.getElementById('checkoutPhone');
                checkoutCardNumberInput = document.getElementById('checkoutCardNumber');
                checkoutExpiryDateInput = document.getElementById('checkoutExpiryDate');
                checkoutCvvInput = document.getElementById('checkoutCvv');
                checkoutForm = document.getElementById('checkoutForm');
                checkoutFormMessageEl = document.getElementById('checkoutFormMessage');
                checkoutOwnerMessageSection = document.getElementById('checkoutOwnerMessageSection');
                checkoutOwnerMessageContent = document.getElementById('checkoutOwnerMessageContent');

                checkoutAgreementSection = document.getElementById('checkout-agreement-section');
                checkoutPaymentSection = document.getElementById('checkout-payment-section');
                checkoutAgreementCheckbox = document.getElementById('checkoutAgreementCheckbox');
                checkoutConfirmPayBtn = document.getElementById('checkoutConfirmPayBtn');
                checkoutConfirmationSection = document.getElementById('checkoutConfirmationSection');
                checkoutDownloadReceiptBtn = document.getElementById('checkoutDownloadReceiptBtn');
            }
            
            rentalTrackerGrid = document.getElementById('rentalTrackerGrid');
            noRentalsMessage = document.getElementById('noRentalsMessage');

            profileVerificationSection = document.getElementById('profileVerificationSection');
            verificationStatusEl = document.getElementById('verificationStatus');
            uploadIdInput = document.getElementById('uploadIdInput');
            startFaceScanBtn = document.getElementById('startFaceScanBtn');


            reviewModal = document.getElementById('reviewModal');
            if (reviewModal) {
                reviewModalTitle = document.getElementById('reviewModalTitle');
                reviewForm = document.getElementById('reviewForm');
                reviewProductIdInput = document.getElementById('reviewProductId');
                reviewStarRatingContainer = document.getElementById('reviewStarRating');
                reviewRatingValueInput = document.getElementById('reviewRatingValue');
                reviewerNameInput = document.getElementById('reviewerName');
                reviewTextInput = document.getElementById('reviewText');
                reviewFormMessageEl = document.getElementById('reviewFormMessage');
                ratingErrorEl = document.getElementById('ratingError');
                reviewerNameErrorEl = document.getElementById('reviewerNameError');
                reviewTextErrorEl = document.getElementById('reviewTextError');
            }


            createListingModal = document.getElementById('createListingModal');
            if (createListingModal) {
                createListingModalTitle = document.getElementById('createListingModalTitle');
                createListingForm = document.getElementById('createListingForm');
                createListingTitleInput = document.getElementById('createListingTitleInput');
                createListingFullTitleInput = document.getElementById('createListingFullTitleInput');
                createListingCategorySelect = document.getElementById('createListingCategorySelect');
                createListingPriceInput = document.getElementById('createListingPriceInput');
                createListingImageInput = document.getElementById('createListingImageInput');
                createListingDescriptionTextarea = document.getElementById('createListingDescriptionTextarea');
                createListingFormMessageEl = document.getElementById('createListingFormMessage');
                createListingTrackingTagInput = document.getElementById('createListingTrackingTagInput');
                createListingOwnerTermsTextarea = document.getElementById('createListingOwnerTermsTextarea');
            }


            editListingModal = document.getElementById('editListingModal');
            if (editListingModal) {
                editListingModalTitle = document.getElementById('editListingModalTitle');
                editListingForm = document.getElementById('editListingForm');
                editListingProductIdInput = document.getElementById('editListingProductId');
                editListingTitleInput = document.getElementById('editListingTitleInput');
                editListingFullTitleInput = document.getElementById('editListingFullTitleInput');
                editListingCategorySelect = document.getElementById('editListingCategorySelect');
                editListingPriceInput = document.getElementById('editListingPriceInput');
                editListingImageInput = document.getElementById('editListingImageInput');
                editListingDescriptionTextarea = document.getElementById('editListingDescriptionTextarea');
                editListingFormMessageEl = document.getElementById('editListingFormMessage');
                editListingTrackingTagInput = document.getElementById('editListingTrackingTagInput');
                editListingOwnerTermsTextarea = document.getElementById('editListingOwnerTermsTextarea');
            }


            chatWidgetContainer = document.querySelector('.chat-widget-container');
            chatToggleBtn = document.getElementById('chatToggleBtn');
            chatWidget = document.getElementById('chatWidget');
            chatHeaderContactName = document.getElementById('chatHeaderContactName');
            chatMessagesContainer = document.getElementById('chatMessagesContainer');
            chatMessageInput = document.getElementById('chatMessageInput');
            chatSendMessageBtn = document.getElementById('chatSendMessageBtn');
            closeChatWidgetBtn = document.getElementById('closeChatWidgetBtn');


            profileSettingsForm = document.getElementById('profileSettingsForm');
            if (profileSettingsForm) {
                settingsFirstNameInput = document.getElementById('settingsFirstName');
                settingsLastNameInput = document.getElementById('settingsLastName');
                settingsEmailInput = document.getElementById('settingsEmail');
                settingsProfilePicUrlInput = document.getElementById('settingsProfilePicUrl');
                settingsLocationInput = document.getElementById('settingsLocation');
                settingsCurrentPasswordInput = document.getElementById('settingsCurrentPassword');
                settingsNewPasswordInput = document.getElementById('settingsNewPassword');
                settingsConfirmNewPasswordInput = document.getElementById('settingsConfirmNewPassword');
                settingsFormMessageEl = document.getElementById('settingsFormMessage');
            }


            adminDashboardPage = document.getElementById('adminDashboardPage');
            if (adminDashboardPage) {
                adminSidebarPic = document.getElementById('adminSidebarPic');
                adminSidebarName = document.getElementById('adminSidebarName');
                adminSidebarEmail = document.getElementById('adminSidebarEmail');
                adminSidebarLinks = document.querySelectorAll('#adminDashboardPage .admin-sidebar .sidebar-menu a');
                logoutBtnAdminDashboard = document.getElementById('logoutBtnAdminDashboard');
                adminViews = document.querySelectorAll('#adminDashboardPage .admin-view');

                adminTotalUsers = document.getElementById('adminTotalUsers');
                adminTotalListingsSite = document.getElementById('adminTotalListings');
                adminActiveRentalsSite = document.getElementById('adminActiveRentals');
                adminTotalSiteEarnings = document.getElementById('adminTotalSiteEarnings');

                adminUserTableBody = document.querySelector('#adminUserTable tbody');
                adminNoUsersMessage = document.getElementById('adminNoUsersMessage');

                adminListingsGrid = document.getElementById('adminListingsGrid');
                adminNoListingsMessage = document.getElementById('adminNoListingsMessage');

                adminContactUsTemplateTextarea = document.getElementById('adminContactUsTemplate');
                adminRentalAgreementTemplateTextarea = document.getElementById('adminRentalAgreementTemplate');
                adminSaveTemplatesBtn = document.getElementById('adminSaveTemplatesBtn');
                adminTemplatesFormMessageEl = document.getElementById('adminTemplatesFormMessage');

                adminSettingsForm = document.getElementById('adminSettingsForm');
                adminSettingsFirstNameInput = document.getElementById('adminSettingsFirstName');
                adminSettingsLastNameInput = document.getElementById('adminSettingsLastName');
                adminSettingsEmailInput = document.getElementById('adminSettingsEmail');
                adminSettingsProfilePicUrlInput = document.getElementById('adminSettingsProfilePicUrl');
                adminSettingsCurrentPasswordInput = document.getElementById('adminSettingsCurrentPassword');
                adminSettingsNewPasswordInput = document.getElementById('adminSettingsNewPassword');
                adminSettingsConfirmNewPasswordInput = document.getElementById('adminSettingsConfirmNewPassword');
                adminSettingsFormMessageEl = document.getElementById('adminSettingsFormMessage');
            }


            document.querySelectorAll('.common-footer').forEach(footerElement => {
                footerElement.innerHTML = commonFooterHTML;
            });
        }

        let currentPage = 'home';

        const productData = [
            {
                id: 1,
                title: "DSLR Camera",
                fullTitle: "Canon EOS 90D DSLR Camera",
                category: "Electronics",
                price: 25, // Base price as number
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

        function getProductById(id) {
            return productData.find(p => p.id === parseInt(id));
        }

        function updateHeaderAuthState() {
            if (!loggedOutNavButtons || !loggedInNavButtons) return;

            if (currentUser) {
                loggedOutNavButtons.style.display = 'none';
                loggedInNavButtons.style.display = 'flex';
                updateCartIcon();
                if (adminDashboardLinkHeader) {
                    adminDashboardLinkHeader.style.display = 'none'; 
                }
            } else {
                loggedOutNavButtons.style.display = 'flex';
                loggedInNavButtons.style.display = 'none';
                 if (adminDashboardLinkHeader) {
                    adminDashboardLinkHeader.style.display = 'none';
                }
                cart = []; // Clear cart on logout
                updateCartIcon();
            }
        }


        function showModal(modalId) {
            const targetModal = document.getElementById(modalId);
            if (!targetModal) return;
            targetModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            if (modalId === 'authModal') {
                 switchTab(loginForm.classList.contains('active') ? 'login' : 'signup');
            } else if (modalId === 'reviewModal') {
                if (reviewForm) reviewForm.reset();
                if (reviewRatingValueInput) reviewRatingValueInput.value = '';
                 if(reviewStarRatingContainer) {
                    reviewStarRatingContainer.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
                }
                if(reviewFormMessageEl) reviewFormMessageEl.style.display = 'none';
                ['ratingError', 'reviewerNameError', 'reviewTextError'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '';
                });
                if (currentUser && reviewerNameInput) {
                    reviewerNameInput.value = `${currentUser.firstName} ${currentUser.lastName}`;
                }
            } else if (modalId === 'editListingModal') {
                if (editListingForm) editListingForm.reset();
                if (editListingFormMessageEl) editListingFormMessageEl.style.display = 'none';
                 ['editListingTitleError', 'editListingFullTitleError', 'editListingCategoryError', 'editListingPriceError', 'editListingImageError', 'editListingDescriptionError', 'editListingTrackingTagError'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '';
                });
            } else if (modalId === 'createListingModal') {
                if (createListingForm) createListingForm.reset();
                if (createListingFormMessageEl) createListingFormMessageEl.style.display = 'none';
                ['createListingTitleError', 'createListingFullTitleError', 'createListingCategoryError', 'createListingPriceError', 'createListingImageError', 'createListingDescriptionError', 'createListingTrackingTagError'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '';
                });
            }
        }

        function hideModal(modalId) {
            const targetModal = document.getElementById(modalId);
            if (!targetModal) return;
            targetModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }


        function switchTab(tabName) {
            if (!loginTab || !signupTab || !loginForm || !signupForm || !modalTitle) return;
            const isLogin = tabName === 'login';
            loginTab.classList.toggle('active', isLogin);
            signupTab.classList.toggle('active', !isLogin);
            loginForm.classList.toggle('active', isLogin);
            signupForm.classList.toggle('active', !isLogin);
            modalTitle.textContent = isLogin ? 'Login' : 'Sign Up';
            if (loginErrorMessage) loginErrorMessage.textContent = '';
            if (signupErrorMessage) signupErrorMessage.textContent = '';
        }

        function setActivePageDisplay(targetPageElement) {
            document.querySelectorAll('.page').forEach(p => {
                p.style.display = 'none';
                p.classList.remove('active');
            });
            if (targetPageElement) {
                targetPageElement.style.display = 'block';
                targetPageElement.classList.add('active');
            } else if (homePage) {
                homePage.style.display = 'block';
                homePage.classList.add('active');
            }
        }

        function showProfilePage() {
            if (!currentUser || currentUser.isAdmin) {
                 if (currentUser && currentUser.isAdmin) {
                    showAdminDashboardPage(); // Admins go to admin dashboard via profile link
                    return;
                 }
                showModal('authModal');
                showToast("Please login to view your profile.");
                return;
            }
            setActivePageDisplay(profilePage);
            if (profileSidebarName) profileSidebarName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            if (profileSidebarEmail) profileSidebarEmail.textContent = currentUser.email;
            if (profilePicSidebar) profilePicSidebar.src = currentUser.profilePic;
            if (profileWelcomeName) profileWelcomeName.textContent = currentUser.firstName;
            updateAnalyticsDashboard();
            const hashParts = window.location.hash.substring(1).split('/');
            const profileSubView = (hashParts.length > 1 && hashParts[0] === 'profile') ? hashParts[1] : 'dashboard';
            showProfileView(profileSubView);
        }

        function updateAnalyticsDashboard() {
            if (!currentUser || !analyticsTotalListings || currentUser.isAdmin) return;
            analyticsTotalListings.textContent = currentUser.myListingIds.length;
            analyticsActiveRentals.textContent = currentUser.activeRentalsCount;
            analyticsTotalEarnings.textContent = `₱${currentUser.totalEarningsAmount.toFixed(2)}`;
            analyticsListingViews.textContent = currentUser.totalListingViews;
        }

        function populateSettingsForm() {
            if (!currentUser || !profileSettingsForm || currentUser.isAdmin) return;
            settingsFirstNameInput.value = currentUser.firstName || '';
            settingsLastNameInput.value = currentUser.lastName || '';
            settingsEmailInput.value = currentUser.email || '';
            settingsProfilePicUrlInput.value = currentUser.profilePic || '';
            settingsLocationInput.value = currentUser.location || '';

            settingsCurrentPasswordInput.value = '';
            settingsNewPasswordInput.value = '';
            settingsConfirmNewPasswordInput.value = '';

            if (settingsFormMessageEl) settingsFormMessageEl.style.display = 'none';
            document.querySelectorAll('#profileSettingsForm .error-message').forEach(el => el.textContent = '');
            populateVerificationStatus();
        }

        function populateVerificationStatus() {
            if (!currentUser || !profileVerificationSection || currentUser.isAdmin) return;
            
            const status = currentUser.verificationStatus;
            let statusHTML = '';
            let showForm = false;

            switch(status) {
                case 'verified':
                    statusHTML = `<span class="status-verified"><i class="fas fa-check-circle"></i> Verified</span>`;
                    break;
                case 'pending':
                    statusHTML = `<span class="status-pending"><i class="fas fa-clock"></i> Pending Review</span>`;
                    break;
                case 'unverified':
                default:
                    statusHTML = `<span class="status-unverified"><i class="fas fa-times-circle"></i> Unverified</span>`;
                    showForm = true;
                    break;
            }
            verificationStatusEl.innerHTML = `Your current status is: ${statusHTML}`;
            
            uploadIdInput.style.display = showForm ? 'block' : 'none';
            uploadIdInput.previousElementSibling.style.display = showForm ? 'block' : 'none'; // The label
            startFaceScanBtn.style.display = showForm ? 'block' : 'none';
        }


        function showProfileView(viewId) {
            if (profileViews) {
                profileViews.forEach(view => {
                    view.style.display = 'none';
                    view.classList.remove('active-profile-view');
                });
            }
            const targetView = document.getElementById(`profile-${viewId}-view`);
            if (targetView) {
                targetView.style.display = 'block';
                targetView.classList.add('active-profile-view');
            }

            if (profileSidebarLinks) {
                profileSidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.view === viewId) {
                        link.classList.add('active');
                    }
                });
            }

            if (viewId === 'my-listings') populateMyListings();
            if (viewId === 'favorites') populateFavorites();
            if (viewId === 'settings') populateSettingsForm();
            if (viewId === 'rental-tracker') populateRentalTracker();
        }

        function createProductCardForProfile(product, type, isAdminView = false) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;

            let metaButtons = '';
            if (type === 'my-listing' || (type === 'admin-listing' && isAdminView)) {
                metaButtons = `
                    <button class="btn btn-outline btn-small edit-my-listing" data-id="${product.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-small delete-my-listing" data-id="${product.id}"><i class="fas fa-trash"></i> Delete</button>
                `;
                 if (isAdminView) {
                    const owner = simulatedUsers[product.ownerId];
                    metaButtons += `<div class="admin-listing-owner-info">Owner: ${owner ? owner.firstName + ' ' + owner.lastName : 'N/A'}</div>`;
                    metaButtons += `<div class="admin-listing-owner-info">Tag ID: ${product.trackingTagId || 'N/A'}</div>`;
                    if(product.ownerTerms) {
                         metaButtons += `<div class="admin-listing-owner-info" title="${product.ownerTerms}">Terms: ${product.ownerTerms.substring(0, 20)}...</div>`;
                    }
                }
            } else if (type === 'favorite') {
                const isFavorite = currentUser && currentUser.favoriteListingIds.includes(product.id);
                metaButtons = `
                    <button class="btn btn-primary view-listing btn-small" data-id="${product.id}">Details</button>
                    <button class="btn btn-icon favorite-toggle-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}" aria-label="Toggle Favorite">
                        <i class="fas fa-heart"></i>
                    </button>
                `;
            } else {
                 metaButtons = `<button class="btn btn-primary view-listing btn-small" data-id="${product.id}">Details</button>`;
            }


            card.innerHTML = `
                <img src="${product.image || getProductImage(product.id)}" alt="${product.title}" class="product-img">
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">${product.priceDisplay}</div>
                    <div class="product-meta profile-card-meta">
                        ${metaButtons}
                    </div>
                </div>
            `;

            const viewDetailsBtn = card.querySelector('.view-listing');
            if(viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', function() {
                    showListingPage(this.dataset.id);
                });
            }
            const editBtn = card.querySelector('.edit-my-listing');
            if(editBtn) {
                editBtn.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    const productToEdit = getProductById(productId);
                    if (productToEdit && (currentUser.email === productToEdit.ownerId || currentUser.isAdmin) && editListingModal) {
                        editListingProductIdInput.value = productToEdit.id;
                        editListingTitleInput.value = productToEdit.title;
                        editListingFullTitleInput.value = productToEdit.fullTitle || productToEdit.title;
                        editListingCategorySelect.value = productToEdit.category.toLowerCase();
                        editListingPriceInput.value = productToEdit.priceDisplay;
                        editListingImageInput.value = productToEdit.image;
                        editListingDescriptionTextarea.value = productToEdit.description || '';
                        editListingTrackingTagInput.value = productToEdit.trackingTagId || '';
                        editListingOwnerTermsTextarea.value = productToEdit.ownerTerms || '';
                        if (editListingModalTitle) editListingModalTitle.textContent = `Edit: ${productToEdit.title}`;
                        showModal('editListingModal');
                    } else if (!currentUser.isAdmin) {
                        showToast("You can only edit your own listings.");
                    }
                });
            }
            const deleteBtn = card.querySelector('.delete-my-listing');
            if(deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    const productToDelete = getProductById(productId);
                    if (!productToDelete) return;

                    if (currentUser.email !== productToDelete.ownerId && !currentUser.isAdmin) {
                        showToast("You can only delete your own listings.");
                        return;
                    }

                    if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
                        const productIndex = productData.findIndex(p => p.id === productId);
                        if (productIndex > -1) {
                            productData.splice(productIndex, 1);
                        }

                        const owner = simulatedUsers[productToDelete.ownerId];
                        if (owner) {
                            owner.myListingIds = owner.myListingIds.filter(id => id !== productId);
                        }

                        if(document.getElementById('profile-my-listings-view')?.classList.contains('active-profile-view')) populateMyListings();
                        if(document.getElementById('admin-listing-management-view')?.classList.contains('active-admin-view')) populateAdminListingManagement();

                        if(currentUser && !currentUser.isAdmin) updateAnalyticsDashboard();
                        else if (currentUser && currentUser.isAdmin) populateAdminOverview();


                        const homePageCard = document.querySelector(`#home-page .product-card[data-product-id="${productId}"]`);
                        if (homePageCard) homePageCard.remove();
                        const allProductsPageCard = document.querySelector(`#all-products-page .product-card[data-product-id="${productId}"]`);
                         if (allProductsPageCard) allProductsPageCard.remove();

                        showToast(`Listing ID: ${productId} deleted.`);
                    }
                });
            }
             const favToggleBtn = card.querySelector('.favorite-toggle-btn');
            if (favToggleBtn) {
                favToggleBtn.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    toggleFavorite(productId);
                    if (document.getElementById('profile-favorites-view')?.classList.contains('active-profile-view')) {
                        populateFavorites();
                    } else {
                        this.classList.toggle('active', currentUser.favoriteListingIds.includes(productId));
                    }
                });
            }
            return card;
        }

        function populateMyListings() {
            if (!myListingsGrid || !currentUser || currentUser.isAdmin) return;
            myListingsGrid.innerHTML = '';
            const userListings = productData.filter(p => currentUser.myListingIds.includes(p.id));

            if (userListings.length === 0) {
                if (noMyListingsMessage) noMyListingsMessage.style.display = 'block';
            } else {
                if (noMyListingsMessage) noMyListingsMessage.style.display = 'none';
                userListings.forEach(product => {
                    myListingsGrid.appendChild(createProductCardForProfile(product, 'my-listing'));
                });
            }
        }

        function populateFavorites() {
            if (!favoritesGrid || !currentUser || currentUser.isAdmin) return;
            favoritesGrid.innerHTML = '';
            const userFavorites = productData.filter(p => currentUser.favoriteListingIds.includes(p.id));

            if (userFavorites.length === 0) {
                if (noFavoritesMessage) noFavoritesMessage.style.display = 'block';
            } else {
                if (noFavoritesMessage) noFavoritesMessage.style.display = 'none';
                userFavorites.forEach(product => {
                    favoritesGrid.appendChild(createProductCardForProfile(product, 'favorite'));
                });
            }
        }

        function toggleFavorite(productId) {
            if (!currentUser) {
                showModal('authModal');
                showToast("Please login to manage favorites.");
                return;
            }
             if (currentUser.isAdmin) {
                showToast("Admins cannot manage favorites through this interface.");
                return;
            }
            const id = parseInt(productId);
            const index = currentUser.favoriteListingIds.indexOf(id);
            if (index > -1) {
                currentUser.favoriteListingIds.splice(index, 1);
                showToast('Removed from favorites!');
            } else {
                currentUser.favoriteListingIds.push(id);
                showToast('Added to favorites!');
            }
            const allProductCardFavoriteButton = document.querySelector(`#allProductsGrid .product-card[data-product-id="${id}"] .favorite-toggle-btn`);
            if(allProductCardFavoriteButton) {
                allProductCardFavoriteButton.classList.toggle('active', currentUser.favoriteListingIds.includes(id));
            }
        }

        /**
         * [FIXED] This function has been refactored to be more robust.
         * It now handles both pre-existing and dynamically-created listing pages
         * in a single, clear code path without recursion. This ensures all product
         * detail pages load correctly.
         */
        function showListingPage(id) {
            const product = getProductById(id);

            // 1. Validate that the product exists
            if (!product) {
                showToast(`Listing with ID ${id} not found.`);
                showHomePage();
                return;
            }

            // 2. Find the page element, or create it if it doesn't exist
            let targetListingPage = document.getElementById(`listing-page-${id}`);

            if (!targetListingPage) {
                targetListingPage = createDynamicListingPageDOM(product);
                if (!targetListingPage) {
                    showToast(`Could not create listing page for '${product.title}'.`);
                    showHomePage();
                    return;
                }
                document.body.appendChild(targetListingPage);
            }
            
            // 3. Populate page content with product data
            const listingTitleEl = targetListingPage.querySelector('.listing-title');
            if (listingTitleEl) listingTitleEl.textContent = product.fullTitle || product.title;

            const listingPriceEl = targetListingPage.querySelector('.listing-price');
            if (listingPriceEl) listingPriceEl.textContent = product.priceDisplay;

            const mainImageEl = targetListingPage.querySelector('.main-image');
            if (mainImageEl) mainImageEl.src = product.image;

            const firstThumbnail = targetListingPage.querySelector('.thumbnail-images .thumbnail-img:first-child');
            if(firstThumbnail) firstThumbnail.src = product.image;

            const descriptionEl = targetListingPage.querySelector('.listing-description p:first-of-type');
            if (descriptionEl && product.description) descriptionEl.textContent = product.description;
            
            const trackingTagEl = targetListingPage.querySelector('.listing-tracking-id');
            if (trackingTagEl) trackingTagEl.textContent = product.trackingTagId || 'N/A';

            const chatWithOwnerBtn = targetListingPage.querySelector('.listing-chat-owner-btn');
            if (chatWithOwnerBtn) {
                if (currentUser && currentUser.email === product.ownerId) {
                    chatWithOwnerBtn.style.display = 'none';
                } else {
                    chatWithOwnerBtn.style.display = 'block';
                    chatWithOwnerBtn.onclick = () => {
                        if (!currentUser) {
                            showModal('authModal');
                            showToast("Please login to chat with the owner.");
                            return;
                        }
                        openChatWith({
                            id: product.ownerId,
                            name: product.ownerName,
                            context: `Regarding: ${product.title}`
                        });
                    };
                }
            }

            // 4. Show the page
            setActivePageDisplay(targetListingPage);

            // 5. Attach event listeners for elements inside the page
            targetListingPage.querySelectorAll('.thumbnail-img').forEach(thumb => {
                thumb.onclick = function() {
                    const mainImage = this.closest('.listing-content')?.querySelector('.main-image');
                    if (mainImage) mainImage.src = this.src;
                };
            });
            const rentalDaysSelect = targetListingPage.querySelector(`#rentalDays${id}`);
            if (rentalDaysSelect) rentalDaysSelect.onchange = handleRentalDaysChange;
            
            const rentalDateInput = targetListingPage.querySelector(`#rentalDate${id}`);
            if (rentalDateInput) rentalDateInput.min = new Date().toISOString().split('T')[0];

            // 6. Finalize navigation
            window.scrollTo(0, 0);
            updateHistory(`listing-${id}`);
        }

         function createDynamicListingPageDOM(product) {
            const newListingPageDiv = document.createElement('div');
            newListingPageDiv.classList.add('page', 'listing-page');
            newListingPageDiv.id = `listing-page-${product.id}`;
            newListingPageDiv.style.display = 'none';

            let basePriceNum = product.price || 0;

            newListingPageDiv.innerHTML = `
                <div class="container listing-container">
                    <div class="listing-content">
                        <div class="listing-images">
                            <div class="thumbnail-images">
                                <img src="${product.image}" alt="${product.title} Thumbnail 1" class="thumbnail-img">
                            </div>
                            <img src="${product.image}" alt="${product.title}" class="main-image">
                        </div>
                        <div class="listing-details">
                            <h1 class="listing-title">${product.fullTitle || product.title}</h1>
                            <div class="listing-price">${product.priceDisplay}</div>
                            <div class="listing-meta">
                                <div class="meta-item"><i class="fas fa-tag"></i> Tracking ID: <span class="listing-tracking-id">${product.trackingTagId || 'N/A'}</span></div>
                            </div>
                            <div class="listing-description"><p>${product.description || 'No description available.'}</p></div>
                            <div class="rental-options">
                                <div class="option-group">
                                    <label for="rentalDays${product.id}">Rental Duration</label>
                                    <select id="rentalDays${product.id}" data-product-id="${product.id}">
                                        <option value="1" data-price="${basePriceNum * 1}">1 day - ₱${(basePriceNum).toFixed(2)}</option>
                                        <option value="3" data-price="${(basePriceNum * 2.5).toFixed(2)}">3 days - ₱${(basePriceNum * 2.5).toFixed(2)}</option>
                                        <option value="7" data-price="${(basePriceNum * 5).toFixed(2)}">7 days - ₱${(basePriceNum * 5).toFixed(2)}</option>
                                    </select>
                                </div>
                                <div class="option-group">
                                    <label for="deliveryOption${product.id}">Delivery Option</label>
                                    <select id="deliveryOption${product.id}">
                                        <option value="pickup" data-fee="0">Pickup - Free</option>
                                        <option value="delivery" data-fee="15">Delivery - ₱15</option>
                                    </select>
                                </div>
                                <div class="option-group">
                                    <label for="rentalDate${product.id}">Rental Start Date</label>
                                    <input type="date" id="rentalDate${product.id}">
                                </div>
                            </div>
                            <button class="btn btn-primary btn-block listing-add-to-cart-btn" data-listing-id="${product.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                            <button class="btn btn-outline btn-block listing-chat-owner-btn" data-listing-id="${product.id}"><i class="fas fa-comments"></i> Chat with Owner</button>
                        </div>
                    </div>
                    <div class="reviews-section" id="reviews-section-${product.id}">
                        <h3>Customer Reviews</h3>
                        ${(product.reviews && product.reviews.length > 0) ? product.reviews.map(review => `
                            <div class="review-card">
                                <div class="review-header">
                                    <div class="reviewer">
                                        <img src="${review.img || 'https://randomuser.me/api/portraits/lego/1.jpg'}" alt="${review.name}" class="reviewer-img">
                                        <div class="reviewer-name">${review.name}</div>
                                    </div>
                                    <div class="review-date">${review.date}</div>
                                </div>
                                <div class="review-rating">${getRatingStars(review.rating, true)}</div>
                                <p>${review.text}</p>
                            </div>
                        `).join('') : '<p>No reviews yet for this listing.</p>'}
                        <button class="btn btn-outline leave-review-btn" style="margin-top: 20px;" data-listing-id="${product.id}">Leave a Review</button>
                    </div>
                </div>
                 <footer class="common-footer"></footer>`;
            
            const footerEl = newListingPageDiv.querySelector('.common-footer');
            if(footerEl) footerEl.innerHTML = commonFooterHTML;
            
            return newListingPageDiv;
        }


        function handleRentalDaysChange() {
            const listingPage = this.closest('.listing-page');
            if (!listingPage) return;

            const selectedOption = this.options[this.selectedIndex];
            const rentalPrice = parseFloat(selectedOption.dataset.price);
            const numDays = parseInt(selectedOption.value);
            const perDayPrice = rentalPrice / numDays;

            const priceElement = listingPage.querySelector('.listing-details .listing-price');
            const listingIdStr = listingPage.id.split('-')[2];
            const product = getProductById(parseInt(listingIdStr));

            if (priceElement && product) {
                 priceElement.textContent = `₱${rentalPrice.toFixed(2)} for ${numDays} day(s) (₱${perDayPrice.toFixed(2)}/day)`;
            }
        }

        function showHomePage() {
            setActivePageDisplay(homePage);
            const homeGrid = document.querySelector('#home-page .products-grid');
            if (homeGrid) {
                homeGrid.innerHTML = '';
                productData.slice(0, 6).forEach(p => {
                     const card = document.createElement('div');
                        card.className = 'product-card';
                        card.dataset.category = p.category.toLowerCase();
                        card.dataset.productId = p.id;
                        card.innerHTML = `
                            <img src="${p.image}" alt="${p.title}" class="product-img">
                            <div class="product-info">
                                <span class="product-category">${p.category}</span>
                                <h3 class="product-title">${p.title}</h3>
                                <div class="product-price">${p.priceDisplay}</div>
                                <div class="product-meta">
                                    <div class="product-rating">${getRatingStars(p.id)}</div>
                                    <button class="btn btn-primary view-listing" data-id="${p.id}">View Details</button>
                                </div>
                            </div>`;
                        const viewBtn = card.querySelector('.view-listing');
                        if(viewBtn) viewBtn.addEventListener('click', function() { showListingPage(this.dataset.id); });
                        homeGrid.appendChild(card);
                });
            }
            window.scrollTo(0, 0);
            updateHistory('home');
        }

        function showAboutPage() {
            setActivePageDisplay(aboutPage);
            window.scrollTo(0, 0);
            updateHistory('about-page');
        }

        function showContactPage() {
            setActivePageDisplay(contactPage);
            window.scrollTo(0, 0);
            updateHistory('contact-page');
        }

        function showFaqPage() {
            setActivePageDisplay(faqPage);
            window.scrollTo(0, 0);
            updateHistory('faq-page');
        }

        function showPrivacyPolicyPage() {
            setActivePageDisplay(privacyPolicyPage);
            window.scrollTo(0, 0);
            updateHistory('privacy-policy-page');
        }

        function showAllProductsPage(targetCategory = 'all') {
            setActivePageDisplay(allProductsPage);
            if (productsPageSearchInput) productsPageSearchInput.value = '';
            if (productsPageFilterItems) {
                 productsPageFilterItems.forEach(i => i.classList.remove('active'));
                 const targetFilterItem = document.querySelector(`#productsPageFilter li[data-filter="${targetCategory}"]`);
                 if (targetFilterItem) targetFilterItem.classList.add('active');
                 else {
                    const allFilter = document.querySelector('#productsPageFilter li[data-filter="all"]');
                    if (allFilter) allFilter.classList.add('active');
                 }
            }
            handleAllProductsSearchAndFilter();
            window.scrollTo(0, 0);
            updateHistory(`all-products${targetCategory !== 'all' ? '?filter=' + targetCategory : ''}`);
        }

        function showCheckoutPage() {
            if (!currentUser) {
                showModal('authModal');
                showToast("Please login to proceed to checkout.");
                return;
            }
            if (currentUser.isAdmin) {
                showToast("Admins cannot rent items.");
                return;
            }
            if (cart.length === 0) {
                showToast("Your cart is empty.");
                showCartPage();
                return;
            }
            if (currentUser.verificationStatus !== 'verified') {
                showToast("Please complete your identity verification before checking out.", 5000);
                navigateToPage('profile/settings');
                return;
            }

            setActivePageDisplay(checkoutPage);
            
            // Reset checkout page state
            checkoutForm.reset();
            checkoutAgreementCheckbox.checked = false;
            checkoutPaymentSection.classList.add('disabled');
            checkoutConfirmPayBtn.disabled = true;
            checkoutForm.style.display = 'block';
            checkoutConfirmationSection.style.display = 'none';

            // Populate Order Summary
            checkoutItemDetailsContainer.innerHTML = cart.map(item => {
                const product = getProductById(item.productId);
                return `
                <div class="checkout-summary-item">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="checkout-summary-item-info">
                         <h4>${product.title}</h4>
                         <p>${item.rentalDurationDays} day(s) at ₱${item.rentalTotalCost.toFixed(2)}</p>
                    </div>
                </div>`;
            }).join('');
            
            const rentalCost = cart.reduce((sum, item) => sum + item.rentalTotalCost, 0);
            const deliveryFee = cart.reduce((sum, item) => sum + item.deliveryFee, 0);
            const serviceFeeRate = 0.05;
            const serviceFee = rentalCost * serviceFeeRate;
            const totalAmount = rentalCost + deliveryFee + serviceFee;

            checkoutRentalCostEl.textContent = `₱${rentalCost.toFixed(2)}`;
            checkoutDeliveryFeeEl.textContent = `₱${deliveryFee.toFixed(2)}`;
            checkoutServiceFeeEl.textContent = `₱${serviceFee.toFixed(2)}`;
            checkoutTotalAmountEl.textContent = `₱${totalAmount.toFixed(2)}`;

            // Populate User Info
            if (currentUser) {
                checkoutFullNameInput.value = `${currentUser.firstName} ${currentUser.lastName}`;
                checkoutEmailInput.value = currentUser.email;
            }

            // Populate Agreement Section
            const siteAgreement = adminRentalAgreementTemplateTextarea.value.replace(/\[OWNER_SPECIFIC_TERMS_PLACEHOLDER\]/g, "");
            let agreementHTML = `<div class="agreement-item"><h3>Site-Wide Rental Agreement</h3><p>${siteAgreement.replace(/\n/g, '<br>')}</p></div>`;

            const uniqueOwnerIds = [...new Set(cart.map(item => getProductById(item.productId).ownerId))];

            uniqueOwnerIds.forEach(ownerId => {
                const owner = simulatedUsers[ownerId];
                const ownerItems = cart.filter(item => getProductById(item.productId).ownerId === ownerId);
                const ownerTerms = ownerItems.map(item => {
                    const product = getProductById(item.productId);
                    return product.ownerTerms ? `<li><strong>${product.title}:</strong> ${product.ownerTerms}</li>` : '';
                }).join('');

                if (ownerTerms) {
                    agreementHTML += `<div class="agreement-item"><h3>Terms from ${owner.firstName} ${owner.lastName}</h3><ul>${ownerTerms}</ul></div>`;
                }
            });
            checkoutAgreementSection.querySelector('.agreement-content').innerHTML = agreementHTML;

            window.scrollTo(0, 0);
            updateHistory('checkout');
        }


        function updateHistory(pageId) {
            if (pageId !== currentPage) {
                currentPage = pageId;
                window.history.pushState({ page: pageId }, '', `#${pageId}`);
            }
        }

        window.addEventListener('popstate', function(event) {
            const pageId = (event.state && event.state.page) || window.location.hash.substring(1) || 'home';
            navigateToPage(pageId);
        });

        function navigateToPage(pageId) {
            const pageIdParts = pageId.split('?')[0].split('/');
            const basePageId = pageIdParts[0];
            const queryParams = new URLSearchParams(pageId.split('?')[1] || '');
            const filterTarget = queryParams.get('filter');


            if (basePageId === 'home') showHomePage();
            else if (basePageId === 'cart') showCartPage();
            else if (basePageId === 'checkout') {
                if (cart.length === 0) {
                    showToast("Your cart is empty. Returning to products page.");
                    showAllProductsPage();
                } else {
                     showCheckoutPage();
                }
            }
            else if (basePageId === 'profile') {
                 if (!currentUser || (currentUser && currentUser.isAdmin)) { 
                    if (currentUser && currentUser.isAdmin) { 
                        showAdminDashboardPage(); 
                    } else { 
                        showModal('authModal');
                        showToast("Please login to view your profile.");
                        if (window.location.hash !== '#home' && window.location.hash !== '') {
                             window.history.pushState({ page: 'home' }, '', '#home');
                             showHomePage();
                        }
                    }
                } else { 
                    showProfilePage();
                }
            }
            else if (basePageId === 'admin') {
                if (!currentUser || !currentUser.isAdmin) {
                    showToast("Access Denied. Admin only.");
                    showHomePage();
                    updateHistory('home');
                } else {
                    const adminSubView = pageIdParts.length > 1 ? pageIdParts[1] : 'overview';
                    showAdminDashboardPage(adminSubView);
                }
            }
            else if (basePageId === 'about-page') showAboutPage();
            else if (basePageId === 'contact-page') showContactPage();
            else if (basePageId === 'faq-page') showFaqPage();
            else if (basePageId === 'privacy-policy-page') showPrivacyPolicyPage();
            else if (basePageId === 'all-products') showAllProductsPage(filterTarget || 'all');
            else if (basePageId.startsWith('listing-')) {
                const idPart = basePageId.substring('listing-'.length);
                const id = parseInt(idPart);
                if (!isNaN(id)) showListingPage(id);
                else showHomePage();
            } else {
                showHomePage();
            }
            currentPage = pageId;
        }

        function initFromUrl() {
            const hash = window.location.hash.substring(1);
            updateHeaderAuthState();
            navigateToPage(hash || 'home');
        }

        function logoutUser() {
            currentUser = null;
            cart = [];
            updateHeaderAuthState();
            showHomePage();
            showToast('You have been logged out');
            updateHistory('home');
            if (chatWidget && chatWidget.classList.contains('open')) {
                toggleChatWidget();
            }
        }

        function showToast(message, duration = 3000) {
            if (!toast) return;
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }

        function filterProducts(category) {
            const homePageProductCards = document.querySelectorAll('#home-page .products-grid .product-card');
            if (homePageProductCards && homePageProductCards.length > 0) {
                homePageProductCards.forEach(card => {
                    const product = getProductById(card.dataset.productId);
                    if (!product) {
                        card.style.display = 'none';
                        return;
                    }
                    card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
                });
            }
        }

        function displaySearchResults(results) {
            if (!searchResults) return;
            searchResults.innerHTML = '';
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No products found</div>';
            } else {
                results.forEach(product => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `<div class="product-title">${product.title}</div><div class="product-category">${product.category}</div><div class="product-price">${product.priceDisplay}</div>`;
                    resultItem.addEventListener('click', () => {
                        showListingPage(product.id);
                        if (searchInput) searchInput.value = '';
                        searchResults.classList.remove('active');
                    });
                    searchResults.appendChild(resultItem);
                });
            }
            searchResults.classList.add('active');
        }

        function getProductImage(productId) {
            const product = getProductById(productId);
            return product ? product.image : "https://via.placeholder.com/500x300.png?text=Product+Image";
        }

        function getRatingStars(productIdOrRatingValue, isValue = false) {
            let rating = 0;
            if (isValue) {
                rating = parseFloat(productIdOrRatingValue);
            } else {
                const product = getProductById(parseInt(productIdOrRatingValue));
                if (product && product.reviews && product.reviews.length > 0) {
                    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
                    rating = sum / product.reviews.length;
                } else {
                    const homeCardRatingEl = document.querySelector(`#home-page .product-card[data-product-id="${productIdOrRatingValue}"] .product-rating`);
                    if (homeCardRatingEl && homeCardRatingEl.innerHTML.trim() !== '') return homeCardRatingEl.innerHTML; 
                    return Array(5).fill(0).map((_, i) => i < 3 ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>').join(''); // Default to 3 stars
                }
            }

            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) starsHTML += '<i class="fas fa-star"></i>';
                else if (i - 0.5 <= rating) starsHTML += '<i class="fas fa-star-half-alt"></i>';
                else starsHTML += '<i class="far fa-star"></i>';
            }
            return starsHTML;
        }

        function populateAllProductsGrid(productsToDisplay) {
            if (!allProductsGrid) return;
            allProductsGrid.innerHTML = '';
            if (productsToDisplay.length === 0) {
                if (noProductsFoundMessage) noProductsFoundMessage.style.display = 'block';
                return;
            }
            if (noProductsFoundMessage) noProductsFoundMessage.style.display = 'none';

            productsToDisplay.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.dataset.category = product.category.toLowerCase();
                card.dataset.productId = product.id;

                const isFavorite = currentUser && !currentUser.isAdmin && currentUser.favoriteListingIds.includes(product.id);

                card.innerHTML = `
                    <img src="${product.image || getProductImage(product.id)}" alt="${product.title}" class="product-img">
                    <div class="product-info">
                        <span class="product-category">${product.category}</span>
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price">${product.priceDisplay}</div>
                        <div class="product-meta">
                            <div class="product-rating">
                                ${getRatingStars(product.id)}
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-primary view-listing btn-small" data-id="${product.id}">Details</button>
                                ${currentUser && !currentUser.isAdmin ? `
                                <button class="btn btn-icon favorite-toggle-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}" aria-label="Toggle Favorite">
                                    <i class="fas fa-heart"></i>
                                </button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                const viewDetailsBtn = card.querySelector('.view-listing');
                if(viewDetailsBtn) {
                    viewDetailsBtn.addEventListener('click', function() { showListingPage(this.dataset.id); });
                }
                const favBtn = card.querySelector('.favorite-toggle-btn');
                if(favBtn) {
                    favBtn.addEventListener('click', function() {
                        toggleFavorite(this.dataset.id);
                    });
                }
                allProductsGrid.appendChild(card);
            });
        }

        function handleAllProductsSearchAndFilter() {
            if (!allProductsGrid) return;
            const searchTerm = productsPageSearchInput ? productsPageSearchInput.value.toLowerCase() : '';
            const activeFilterItem = document.querySelector('#productsPageFilter li.active');
            const currentCategory = activeFilterItem ? activeFilterItem.dataset.filter : 'all';
            let filteredProducts = [...productData];
            if (currentCategory !== 'all') {
                filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === currentCategory);
            }
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product =>
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    (product.fullTitle && product.fullTitle.toLowerCase().includes(searchTerm)) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm))
                );
            }
            populateAllProductsGrid(filteredProducts);
        }

        function toggleChatWidget() {
            if (chatWidget) chatWidget.classList.toggle('open');
        }

        function openChatWith(partnerDetails) {
            if (!currentUser) {
                showModal('authModal');
                showToast("Please login to chat.");
                return;
            }
            currentChatPartner = partnerDetails;
            if (chatHeaderContactName) chatHeaderContactName.textContent = `Chat with ${currentChatPartner.name}`;
            if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';

            if (currentChatPartner.context) {
                addChatMessageToUI(currentChatPartner.context, 'system');
            }
             addChatMessageToUI(`Hello! You are now chatting with ${currentChatPartner.name}.`, 'received', currentChatPartner.name);


            if (chatWidget && !chatWidget.classList.contains('open')) {
                toggleChatWidget();
            }
        }

        function addChatMessageToUI(text, type, senderName = 'You') {
            if (!chatMessagesContainer) return;
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', type);

            let messageHTML = '';
            if (type !== 'system') {
                messageHTML += `<span class="message-sender">${type === 'sent' ? (currentUser?.firstName || 'You') : senderName}</span>`;
            }
            messageHTML += text;
            messageDiv.innerHTML = messageHTML;


            chatMessagesContainer.appendChild(messageDiv);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }

        function handleSendChatMessage() {
            if (!chatMessageInput || !currentUser) return;
            const messageText = chatMessageInput.value.trim();
            if (messageText === '') return;

            addChatMessageToUI(messageText, 'sent');
            chatMessageInput.value = '';

            setTimeout(() => {
                let replyText = "Thanks for your message! I'll get back to you soon.";
                if (currentChatPartner.id === 'support') {
                    replyText = "HAZEL Support: We've received your message and will assist you shortly.";
                } else if (currentChatPartner.name) {
                    replyText = `${currentChatPartner.name}: Got it! I'll check on that.`;
                }
                addChatMessageToUI(replyText, 'received', currentChatPartner.name);
            }, 1500);
        }

        function generateNewProductId() {
            if (productData.length === 0) return 1;
            return Math.max(...productData.map(p => p.id)) + 1;
        }

        function showAdminDashboardPage(viewId = 'overview') {
            if (!currentUser || !currentUser.isAdmin) {
                showToast("Access Denied.");
                navigateToPage('home');
                return;
            }
            setActivePageDisplay(adminDashboardPage);
            if (adminSidebarName) adminSidebarName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            if (adminSidebarEmail) adminSidebarEmail.textContent = currentUser.email;
            if (adminSidebarPic) adminSidebarPic.src = currentUser.profilePic;

            showAdminView(viewId);
            updateHistory(`admin/${viewId}`);
        }

        function showAdminView(viewId) {
            if (adminViews) {
                adminViews.forEach(view => {
                    view.style.display = 'none';
                    view.classList.remove('active-admin-view');
                });
            }
            const targetView = document.getElementById(`admin-${viewId}-view`);
            if (targetView) {
                targetView.style.display = 'block';
                targetView.classList.add('active-admin-view');
            }

            if (adminSidebarLinks) {
                adminSidebarLinks.forEach(link => {
                    link.classList.remove('active-admin-view'); 
                    if (link.dataset.view === viewId) {
                        link.classList.add('active-admin-view');
                    }
                });
            }

            if (viewId === 'overview') populateAdminOverview();
            if (viewId === 'user-management') populateAdminUserManagement();
            if (viewId === 'listing-management') populateAdminListingManagement();
            if (viewId === 'settings') populateAdminSettingsForm();
        }

        function populateAdminOverview() {
            if (!currentUser || !currentUser.isAdmin) return;
            if (adminTotalUsers) adminTotalUsers.textContent = Object.keys(simulatedUsers).length;
            if (adminTotalListingsSite) adminTotalListingsSite.textContent = productData.length;
            if (adminActiveRentalsSite) adminActiveRentalsSite.textContent = productData.length * 2 + 5; 
            if (adminTotalSiteEarnings) adminTotalSiteEarnings.textContent = `₱${(productData.length * 2512.50).toFixed(2)}`;
        }

        function populateAdminUserManagement() {
            if (!adminUserTableBody || !currentUser || !currentUser.isAdmin) return;
            adminUserTableBody.innerHTML = '';
            if (Object.keys(simulatedUsers).length === 0) {
                if(adminNoUsersMessage) adminNoUsersMessage.style.display = 'block';
                return;
            }
            if(adminNoUsersMessage) adminNoUsersMessage.style.display = 'none';

            for (const email in simulatedUsers) {
                const user = simulatedUsers[email];
                const row = adminUserTableBody.insertRow();
                row.insertCell().textContent = `${user.firstName} ${user.lastName}`;
                row.insertCell().textContent = user.email;
                row.insertCell().textContent = user.isAdmin ? 'Admin' : (user.myListingIds.length > 0 ? 'Owner' : 'User');
                
                const statusCell = row.insertCell();
                let statusClass = `status-${user.verificationStatus}`;
                statusCell.innerHTML = `<span class="${statusClass}">${user.verificationStatus}</span>`;
                
                const actionsCell = row.insertCell();
                actionsCell.className = 'actions-cell';
                let actionButtons = `<button class="btn btn-outline btn-small admin-view-user-btn" data-email="${email}">View</button>`;
                if (user.verificationStatus === 'pending') {
                    actionButtons += `
                        <button class="btn btn-success btn-small admin-approve-verify-btn" data-email="${email}">Approve</button>
                        <button class="btn btn-danger btn-small admin-reject-verify-btn" data-email="${email}">Reject</button>
                    `;
                }
                actionsCell.innerHTML = actionButtons;
            }
            
            document.querySelectorAll('.admin-view-user-btn').forEach(btn => {
                btn.addEventListener('click', () => showToast(`Viewing user ${btn.dataset.email} (mock)`));
            });
            document.querySelectorAll('.admin-approve-verify-btn').forEach(btn => {
                btn.addEventListener('click', () => approveVerification(btn.dataset.email));
            });
            document.querySelectorAll('.admin-reject-verify-btn').forEach(btn => {
                btn.addEventListener('click', () => rejectVerification(btn.dataset.email));
            });
        }

        function approveVerification(email) {
            if (simulatedUsers[email]) {
                simulatedUsers[email].verificationStatus = 'verified';
                showToast(`Verification for ${email} approved.`);
                populateAdminUserManagement();
            }
        }
        
        function rejectVerification(email) {
            if (simulatedUsers[email]) {
                simulatedUsers[email].verificationStatus = 'unverified'; // Or a 'rejected' status if needed
                showToast(`Verification for ${email} rejected.`);
                populateAdminUserManagement();
            }
        }

        function populateAdminListingManagement() {
            if (!adminListingsGrid || !currentUser || !currentUser.isAdmin) return;
            adminListingsGrid.innerHTML = '';
            if (productData.length === 0) {
                if(adminNoListingsMessage) adminNoListingsMessage.style.display = 'block';
                return;
            }
             if(adminNoListingsMessage) adminNoListingsMessage.style.display = 'none';
            productData.forEach(product => {
                adminListingsGrid.appendChild(createProductCardForProfile(product, 'admin-listing', true));
            });
        }

        function populateAdminSettingsForm() {
            if (!currentUser || !currentUser.isAdmin || !adminSettingsForm) return;
            adminSettingsFirstNameInput.value = currentUser.firstName || '';
            adminSettingsLastNameInput.value = currentUser.lastName || '';
            adminSettingsEmailInput.value = currentUser.email || '';
            adminSettingsProfilePicUrlInput.value = currentUser.profilePic || '';

            adminSettingsCurrentPasswordInput.value = '';
            adminSettingsNewPasswordInput.value = '';
            adminSettingsConfirmNewPasswordInput.value = '';

            if (adminSettingsFormMessageEl) adminSettingsFormMessageEl.style.display = 'none';
            document.querySelectorAll('#adminSettingsForm .error-message').forEach(el => el.textContent = '');
        }

        function updateCartIcon() {
            if (!cartItemCountBadge) return;
            if (cart.length > 0 && currentUser && !currentUser.isAdmin) {
                cartItemCountBadge.textContent = cart.length;
                cartItemCountBadge.style.display = 'flex';
            } else {
                cartItemCountBadge.style.display = 'none';
            }
        }
        
        function addToCart(productId, rentalData) {
            if (!currentUser) {
                showModal('authModal');
                showToast("Please login to add items to your cart.");
                return;
            }
            if (currentUser.isAdmin) {
                showToast("Admins cannot rent items.");
                return;
            }
        
            const existingItemIndex = cart.findIndex(item => item.productId === productId);
            if (existingItemIndex > -1) {
                showToast("This item is already in your cart. You can adjust details at checkout.");
                navigateToPage('cart');
                return;
            }
        
            cart.push({
                productId: productId,
                ...rentalData
            });
            showToast("Item added to cart!");
            updateCartIcon();
        }

        function removeFromCart(cartIndex) {
            if (cart[cartIndex]) {
                cart.splice(cartIndex, 1);
                showToast("Item removed from cart.");
                populateCartPage();
                updateCartIcon();
            }
        }

        function showCartPage() {
            if (!currentUser) {
                showModal('authModal');
                showToast("Please login to view your cart.");
                return;
            }
            setActivePageDisplay(cartPage);
            populateCartPage();
            updateHistory('cart');
        }

        function populateCartPage() {
            if (!cartPage || !currentUser) return;
        
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `<p class="cart-empty-message">Your shopping cart is empty.</p>`;
                proceedToCheckoutBtn.disabled = true;
            } else {
                cartItemsContainer.innerHTML = cart.map((item, index) => {
                    const product = getProductById(item.productId);
                    if (!product) return '';
                    return `
                        <div class="cart-item">
                            <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h3>${product.fullTitle}</h3>
                                <p>Duration: ${item.rentalDurationDays} day(s)</p>
                                <p>Start Date: ${new Date(item.rentalStartDate).toLocaleDateString()}</p>
                            </div>
                            <div class="cart-item-price">₱${item.rentalTotalCost.toFixed(2)}</div>
                            <button class="cart-item-remove-btn" data-cart-index="${index}">&times;</button>
                        </div>
                    `;
                }).join('');
                proceedToCheckoutBtn.disabled = false;
            }
            
            updateCartTotals();
        
            document.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeFromCart(parseInt(this.dataset.cartIndex));
                });
            });
        }
        
        function updateCartTotals() {
            const subtotal = cart.reduce((sum, item) => sum + item.rentalTotalCost, 0);
            const serviceFee = subtotal * 0.05; // 5% service fee
            const total = subtotal + serviceFee;
        
            cartSubtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
            cartServiceFeeEl.textContent = `₱${serviceFee.toFixed(2)}`;
            cartTotalEl.textContent = `₱${total.toFixed(2)}`;
        }

        function populateRentalTracker() {
            if (!rentalTrackerGrid || !currentUser || currentUser.isAdmin) return;
        
            // This is a MOCK implementation. A real app would fetch this data.
            const rentingItems = [
                { id: 2, status: 'Active', returnDate: '2025-10-30' },
            ];
            const lentOutItems = [
                { id: 3, status: 'Rented Out', returnDate: '2025-11-05', renter: 'Alice P.' },
            ];
        
            rentalTrackerGrid.innerHTML = '';
            let contentAdded = false;
        
            if (rentingItems.length > 0) {
                contentAdded = true;
                rentalTrackerGrid.innerHTML += '<h3>Items You Are Renting</h3>';
                rentingItems.forEach(rental => {
                    const product = getProductById(rental.id);
                    if (product) {
                        rentalTrackerGrid.innerHTML += `
                            <div class="rental-tracker-item">
                                <img src="${product.image}" alt="${product.title}">
                                <div class="rental-tracker-info">
                                    <h4>${product.title}</h4>
                                    <p>Status: <span class="status-active">${rental.status}</span></p>
                                    <p>Return by: ${new Date(rental.returnDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        `;
                    }
                });
            }
        
            if (lentOutItems.length > 0) {
                contentAdded = true;
                rentalTrackerGrid.innerHTML += '<h3>Items You Have Lent Out</h3>';
                lentOutItems.forEach(rental => {
                    const product = getProductById(rental.id);
                    if (product) {
                        rentalTrackerGrid.innerHTML += `
                            <div class="rental-tracker-item">
                                <img src="${product.image}" alt="${product.title}">
                                <div class="rental-tracker-info">
                                    <h4>${product.title}</h4>
                                    <p>Status: <span class="status-rented">${rental.status}</span></p>
                                    <p>Due back: ${new Date(rental.returnDate).toLocaleDateString()}</p>
                                    <p>Rented by: ${rental.renter}</p>
                                </div>
                            </div>
                        `;
                    }
                });
            }
        
            noRentalsMessage.style.display = contentAdded ? 'none' : 'block';
        }
        
        function generateAndDownloadReceipt(transactionId) {
            let receiptContent = `
        ========================================
                 HAZEL RENTAL RECEIPT
        ========================================
        Transaction ID: ${transactionId}
        Date: ${new Date().toLocaleString()}
        
        Rented by:
        ${currentUser.firstName} ${currentUser.lastName}
        ${currentUser.email}
        
        ----------------------------------------
        ITEMS RENTED
        ----------------------------------------
        `;
        
            let subtotal = 0;
            cart.forEach(item => {
                const product = getProductById(item.productId);
                receiptContent += `
        - ${product.title}
          Duration: ${item.rentalDurationDays} day(s)
          Cost: ₱${item.rentalTotalCost.toFixed(2)}
        `;
                subtotal += item.rentalTotalCost;
            });
        
            const deliveryFee = cart.reduce((sum, item) => sum + item.deliveryFee, 0);
            const serviceFee = subtotal * 0.05;
            const total = subtotal + deliveryFee + serviceFee;
        
            receiptContent += `
        ----------------------------------------
        SUMMARY
        ----------------------------------------
        Subtotal:       ₱${subtotal.toFixed(2)}
        Delivery Fees:  ₱${deliveryFee.toFixed(2)}
        Service Fee:    ₱${serviceFee.toFixed(2)}
        
        TOTAL:          ₱${total.toFixed(2)}
        ========================================
        
        Thank you for using HAZEL!
        `;
        
            const blob = new Blob([receiptContent.trim()], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Hazel_Receipt_${transactionId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        initializeEventListeners();

        function initializeEventListeners() {
            if (loginBtn) loginBtn.addEventListener('click', () => showModal('authModal'));
            if (signupBtns) signupBtns.forEach(btn => btn.addEventListener('click', () => showModal('authModal')));


            if (authModal) {
                if (loginTab) loginTab.addEventListener('click', () => switchTab('login'));
                if (signupTab) signupTab.addEventListener('click', () => switchTab('signup'));
                if (switchToSignup) switchToSignup.addEventListener('click', (e) => { e.preventDefault(); switchTab('signup'); });
                if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });
            }

            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const emailInput = loginForm.querySelector('#loginEmail');
                    const passwordInput = loginForm.querySelector('#loginPassword');
                    const email = emailInput ? emailInput.value : null;
                    const password = passwordInput ? passwordInput.value : null;

                    if (email && password && simulatedUsers[email] && password === simulatedUsers[email].password) {
                        currentUser = JSON.parse(JSON.stringify(simulatedUsers[email])); // Deep copy
                        updateHeaderAuthState();
                        hideModal('authModal');
                        if (currentUser.isAdmin) {
                            showAdminDashboardPage();
                        } else {
                            showProfilePage();
                        }
                        showToast('Login successful!');
                    } else {
                        if(loginErrorMessage) loginErrorMessage.textContent = 'Invalid email or password. Defaults: admin@hazel.com / admin';
                    }
                });
            }

            if (signupForm) {
                signupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const firstNameInput = signupForm.querySelector('#firstName');
                    const lastNameInput = signupForm.querySelector('#lastName');
                    const emailInput = signupForm.querySelector('#signupEmail');
                    const passInput = signupForm.querySelector('#signupPassword');
                    const confirmPassInput = signupForm.querySelector('#confirmPassword');

                    const firstName = firstNameInput ? firstNameInput.value : null;
                    const lastName = lastNameInput ? lastNameInput.value : null;
                    const email = emailInput ? emailInput.value : null;
                    const pass = passInput ? passInput.value : null;
                    const confirmPass = confirmPassInput ? confirmPassInput.value : null;


                    if (!firstName || !lastName || !email || !pass || !confirmPass) {
                        if(signupErrorMessage) signupErrorMessage.textContent = 'All fields are required.';
                        return;
                    }
                    if (pass !== confirmPass) {
                        if(signupErrorMessage) signupErrorMessage.textContent = 'Passwords do not match';
                        return;
                    }
                    if (simulatedUsers[email]) {
                         if(signupErrorMessage) signupErrorMessage.textContent = 'Email already registered. Please login.';
                         return;
                    }
                    // Create new user
                    currentUser = {
                        firstName: firstName, lastName: lastName, email: email, password: pass,
                        profilePic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`, 
                        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        location: "New Member City, ST", myListingIds: [], favoriteListingIds: [],
                        activeRentalsCount: 0, totalEarningsAmount: 0, totalListingViews: 0,
                        isAdmin: false,
                        verificationStatus: 'unverified'
                    };
                    simulatedUsers[email] = JSON.parse(JSON.stringify(currentUser)); // Add to simulated users, deep copy
                    updateHeaderAuthState();
                    hideModal('authModal');
                    showProfilePage();
                    showToast('Account created successfully!');
                });
            }


            if (mobileMenuBtn && mainNav) {
                const menuIcon = mobileMenuBtn.querySelector('i');
                mobileMenuBtn.addEventListener('click', () => {
                    mainNav.classList.toggle('active');
                    if (menuIcon) {
                        menuIcon.classList.toggle('fa-bars');
                        menuIcon.classList.toggle('fa-times');
                    }
                    if (!mainNav.classList.contains('active')) {
                        const openCategoriesDropdown = mainNav.querySelector('.has-dropdown.open');
                        if (openCategoriesDropdown) {
                            openCategoriesDropdown.classList.remove('open');
                            const icon = openCategoriesDropdown.querySelector('.dropdown-icon');
                            if (icon) {
                                icon.classList.remove('fa-chevron-up');
                                icon.classList.add('fa-chevron-down');
                            }
                        }
                    }
                });
            }

            if (logoutBtnProfile) logoutBtnProfile.addEventListener('click', logoutUser);
            if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', logoutUser);
            if (logoutBtnAdminDashboard) logoutBtnAdminDashboard.addEventListener('click', logoutUser);

            if (uploadIdInput) {
                uploadIdInput.addEventListener('change', () => {
                    if (uploadIdInput.files.length > 0) {
                        showToast(`ID '${uploadIdInput.files[0].name}' selected. Click 'Start Face Scan' to proceed.`);
                    }
                });
            }

            if (startFaceScanBtn) {
                startFaceScanBtn.addEventListener('click', () => {
                    if (uploadIdInput.files.length === 0) {
                        showToast('Please select an ID file first.');
                        return;
                    }
                    showToast('Simulating face scan... Please wait.', 4000);
                    setTimeout(() => {
                        currentUser.verificationStatus = 'pending';
                        simulatedUsers[currentUser.email].verificationStatus = 'pending';
                        showToast('Verification submitted for review!', 4000);
                        populateVerificationStatus();
                    }, 4000);
                });
            }


            function closeMobileMenuIfNeeded() {
                if (window.innerWidth <= 768 && mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const menuIcon = mobileMenuBtn.querySelector('i');
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                    }
                    const openCategoriesDropdown = mainNav.querySelector('.has-dropdown.open');
                    if (openCategoriesDropdown) {
                        openCategoriesDropdown.classList.remove('open');
                        const icon = openCategoriesDropdown.querySelector('.dropdown-icon');
                        if (icon) {
                            icon.classList.remove('fa-chevron-up');
                            icon.classList.add('fa-chevron-down');
                        }
                    }
                }
            }

            if (headerProfileLink) {
                 headerProfileLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToPage('profile');
                    closeMobileMenuIfNeeded();
                });
            }
             if (headerCartLink) {
                 headerCartLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToPage('cart');
                    closeMobileMenuIfNeeded();
                });
            }
            if (adminDashboardLinkHeader) { 
                adminDashboardLinkHeader.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToPage('admin/overview');
                    closeMobileMenuIfNeeded();
                });
            }

            // Event delegation for all .nav-link elements
            document.body.addEventListener('click', (e) => {
                const targetLink = e.target.closest('.nav-link');
                if (targetLink) {
                    if (targetLink.classList.contains('categories-dropdown-toggle') ||
                        targetLink.id === 'headerProfileLink' ||
                        targetLink.id === 'adminDashboardLink' ||
                        targetLink.id === 'headerCartLink' ||
                        targetLink.closest('.form-footer')) {
                        return;
                    }

                    e.preventDefault();
                    const page = targetLink.dataset.page;
                    const filterTarget = targetLink.dataset.filterTarget;
                    closeMobileMenuIfNeeded();

                    let navigateToId = page;
                    if (page === 'all-products' && filterTarget) {
                        navigateToId = `${page}?filter=${filterTarget}`;
                    }

                    if (navigateToId) {
                         navigateToPage(navigateToId);
                    }
                }
            });


            if (profilePicSidebar) profilePicSidebar.addEventListener('click', () => {
                 if(currentUser && !currentUser.isAdmin) { 
                    const newPic = prompt("Enter new profile picture URL:", currentUser.profilePic);
                    if (newPic && newPic.trim() !== "") {
                        try {
                            new URL(newPic); 
                            currentUser.profilePic = newPic;
                            profilePicSidebar.src = currentUser.profilePic;
                            if(simulatedUsers[currentUser.email]) simulatedUsers[currentUser.email].profilePic = newPic;
                            showToast('Profile picture updated!');
                            if (settingsProfilePicUrlInput && document.getElementById('profile-settings-view').classList.contains('active-profile-view')) {
                                settingsProfilePicUrlInput.value = newPic;
                            }
                        } catch (_) {
                            showToast('Invalid URL format for profile picture.');
                        }
                    }
                 }
            });

            const homePageProductFilterItems = document.querySelectorAll('#home-page .products-filter li');
            if (homePageProductFilterItems) homePageProductFilterItems.forEach(item => {
                item.addEventListener('click', () => {
                    homePageProductFilterItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    filterProducts(item.dataset.filter);
                });
            });

            if (categoriesDropdownToggle) {
                categoriesDropdownToggle.addEventListener('click', function(e) {
                    e.preventDefault(); 
                    const parentLi = this.closest('.has-dropdown');
                    if (parentLi) {
                        parentLi.classList.toggle('open');
                        const icon = this.querySelector('.dropdown-icon');
                        if (icon) { icon.classList.toggle('fa-chevron-up'); icon.classList.toggle('fa-chevron-down');}
                    }
                });
            }

            if (homeLogo) homeLogo.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });
            if (browseBtn) browseBtn.addEventListener('click', () => {
                 const productsSection = document.querySelector('#home-page .products');
                 if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
            });

            document.querySelectorAll('#home-page .view-listing').forEach(btn => {
                btn.addEventListener('click', function() { showListingPage(this.dataset.id); });
            });


            window.addEventListener('resize', () => {
                if (mainNav && mobileMenuBtn) {
                    const menuIcon = mobileMenuBtn.querySelector('i');
                    if (window.innerWidth > 768) {
                        mainNav.classList.remove('active');
                        if (menuIcon) {
                            menuIcon.classList.remove('fa-times');
                            menuIcon.classList.add('fa-bars');
                        }
                        mainNav.style.maxHeight = '';
                        mainNav.style.paddingTop = '';
                        mainNav.style.paddingBottom = '';
                        mainNav.style.borderTopColor = '';

                        const openCategoriesDropdown = mainNav.querySelector('.has-dropdown.open');
                        if (openCategoriesDropdown) {
                            openCategoriesDropdown.classList.remove('open');
                            const icon = openCategoriesDropdown.querySelector('.dropdown-icon');
                            if (icon) {
                                icon.classList.remove('fa-chevron-up');
                                icon.classList.add('fa-chevron-down');
                            }
                        }
                    }

                }
            });


            if (darkModeToggle) {
                const currentTheme = localStorage.getItem('theme') || 'light';
                document.body.classList.toggle('dark-mode', currentTheme === 'dark');
                darkModeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i> Light mode' : '<i class="fas fa-moon"></i> Dark mode';
                darkModeToggle.addEventListener('click', () => {
                    const isDark = document.body.classList.toggle('dark-mode');
                    localStorage.setItem('theme', isDark ? 'dark' : 'light');
                    darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light mode' : '<i class="fas fa-moon"></i> Dark mode';
                });
            }

            if (searchInput && searchResults) {
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    if (searchTerm.length === 0) {
                        searchResults.innerHTML = '';
                        searchResults.classList.remove('active'); return;
                    }
                    const filtered = productData.filter(p => p.title.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm));
                    displaySearchResults(filtered);
                });
                document.addEventListener('click', (e) => { // Close results if click outside
                    if (searchResults && !searchResults.contains(e.target) && searchInput && !searchInput.contains(e.target)) {
                        searchResults.classList.remove('active');
                    }
                });
            }

            if (productsPageSearchInput) {
                productsPageSearchInput.addEventListener('input', handleAllProductsSearchAndFilter);
            }

            const allProdPageFilters = document.querySelectorAll('#productsPageFilter li');
            if (allProdPageFilters) {
                allProdPageFilters.forEach(item => {
                    item.addEventListener('click', function() {
                        allProdPageFilters.forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                        handleAllProductsSearchAndFilter();
                    });
                });
            }

            if(profileSidebarLinks) {
                profileSidebarLinks.forEach(link => {
                    if (link.id === 'logoutBtnProfile') return; // Logout already handled
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const viewTarget = this.dataset.view;
                        showProfileView(viewTarget);
                        const newHash = viewTarget === 'dashboard' ? 'profile' : `profile/${viewTarget}`;
                        updateHistory(newHash);
                    });
                });
            }
            if(addListingFromProfileBtn) {
                addListingFromProfileBtn.addEventListener('click', () => {
                    if (!currentUser || currentUser.isAdmin) {
                        showModal('authModal');
                        showToast("Please login as a user/owner to add a listing.");
                        return;
                    }
                    showModal('createListingModal');
                });
            }

            const contactFormElement = document.getElementById('contactForm');
            if (contactFormElement) {
                contactFormElement.addEventListener('submit', function(e) {
                    e.preventDefault();
                    document.querySelectorAll('#contactForm .error-message').forEach(el => el.textContent = '');
                    const nameInput = document.getElementById('contactName');
                    const emailInput = document.getElementById('contactEmail');
                    const subjectInput = document.getElementById('contactSubject');
                    const messageInput = document.getElementById('contactMessage');
                    const formMessage = document.getElementById('contactFormMessage');
                    let isValid = true;
                    if (!nameInput.value.trim()) { document.getElementById('nameError').textContent = 'Name is required'; isValid = false; }
                    if (!emailInput.value.trim()) { document.getElementById('emailError').textContent = 'Email is required'; isValid = false; }
                    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) { document.getElementById('emailError').textContent = 'Invalid email format'; isValid = false; }
                    if (!subjectInput.value.trim()) { document.getElementById('subjectError').textContent = 'Subject is required'; isValid = false; }
                    if (!messageInput.value.trim()) { document.getElementById('messageError').textContent = 'Message is required'; isValid = false; }
                    if (!isValid) return;
                    if (formMessage) {
                        formMessage.textContent = 'Thank you! Your message has been sent.';
                        formMessage.className = 'form-message success';
                        formMessage.style.display = 'block';
                        contactFormElement.reset();
                        setTimeout(() => { formMessage.style.display = 'none'; formMessage.className = 'form-message'; }, 5000);
                    }
                });
            }

            const faqQuestions = document.querySelectorAll('#faq-page .faq-question');
            if (faqQuestions) {
                faqQuestions.forEach(question => {
                    question.addEventListener('click', function() {
                        const faqItem = this.closest('.faq-item');
                        if (!faqItem) return;

                        faqItem.classList.toggle('active');
                        const answer = faqItem.querySelector('.faq-answer');

                        if (faqItem.classList.contains('active')) {
                            answer.style.maxHeight = answer.scrollHeight + "px";
                        } else {
                            answer.style.maxHeight = null;
                        }
                    });
                });
            }

            document.body.addEventListener('click', function(e) {
                if (e.target && e.target.classList.contains('listing-add-to-cart-btn')) {
                    if (!currentUser) {
                        showModal('authModal');
                        showToast("Please login to rent an item.");
                        return;
                    }
                     if (currentUser.isAdmin) {
                        showToast("Admins cannot rent items through this interface.");
                        return;
                    }
                    const listingId = e.target.dataset.listingId;
                    const product = getProductById(listingId);
                    if (!product) {
                        showToast("Error: Product not found.");
                        return;
                    }

                    const listingPageDiv = e.target.closest('.listing-page');
                    if (!listingPageDiv) {
                         showToast("Error: Could not find listing details.");
                         return;
                    }

                    const rentalDaysSelect = listingPageDiv.querySelector(`#rentalDays${listingId}`);
                    const deliveryOptionSelect = listingPageDiv.querySelector(`#deliveryOption${listingId}`);
                    const rentalDateInput = listingPageDiv.querySelector(`#rentalDate${listingId}`);

                    if (!rentalDaysSelect || !deliveryOptionSelect || !rentalDateInput || !rentalDateInput.value) {
                        showToast("Please select rental duration, delivery option, and start date.");
                        return;
                    }

                    const selectedDurationOption = rentalDaysSelect.options[rentalDaysSelect.selectedIndex];
                    const rentalDurationDays = parseInt(selectedDurationOption.value);
                    const rentalTotalCost = parseFloat(selectedDurationOption.dataset.price);

                    const selectedDeliveryOption = deliveryOptionSelect.options[deliveryOptionSelect.selectedIndex];
                    const deliveryOption = selectedDeliveryOption.value;
                    const deliveryFee = parseFloat(selectedDeliveryOption.dataset.fee);

                    const rentalStartDate = rentalDateInput.value;

                    const rentalData = {
                        rentalDurationDays: rentalDurationDays,
                        rentalTotalCost: rentalTotalCost,
                        deliveryOption: deliveryOption,
                        deliveryFee: deliveryFee,
                        rentalStartDate: rentalStartDate
                    };

                    addToCart(parseInt(listingId), rentalData);
                }
            });

            if (cartApplyDiscountBtn) {
                cartApplyDiscountBtn.addEventListener('click', () => {
                    if (cartDiscountInput.value.trim().toUpperCase() === 'SAVE10') {
                        showToast("10% discount applied (mock)!");
                        // In a real app, you'd recalculate totals here
                    } else {
                        showToast("Invalid discount code.");
                    }
                });
            }
            if (proceedToCheckoutBtn) {
                proceedToCheckoutBtn.addEventListener('click', () => navigateToPage('checkout'));
            }

            if(checkoutAgreementCheckbox) {
                checkoutAgreementCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        checkoutPaymentSection.classList.remove('disabled');
                        checkoutConfirmPayBtn.disabled = false;
                    } else {
                        checkoutPaymentSection.classList.add('disabled');
                        checkoutConfirmPayBtn.disabled = true;
                    }
                });
            }

            if (checkoutForm) {
                checkoutForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    document.querySelectorAll('#checkoutForm .error-message').forEach(el => el.textContent = '');
                    checkoutFormMessageEl.style.display = 'none';

                    let isValid = true;
                    if (!checkoutFullNameInput.value.trim()) {
                        document.getElementById('checkoutFullNameError').textContent = 'Full name is required.'; isValid = false;
                    }
                    if (!checkoutEmailInput.value.trim()) {
                        document.getElementById('checkoutEmailError').textContent = 'Email is required.'; isValid = false;
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutEmailInput.value)) {
                        document.getElementById('checkoutEmailError').textContent = 'Invalid email format.'; isValid = false;
                    }
                    if (!checkoutCardNumberInput.value.trim() || !/^\d{13,19}$/.test(checkoutCardNumberInput.value.replace(/\s/g, ''))) {
                        document.getElementById('checkoutCardNumberError').textContent = 'Valid card number is required.'; isValid = false;
                    }
                    if (!checkoutExpiryDateInput.value.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(checkoutExpiryDateInput.value)) {
                         document.getElementById('checkoutExpiryDateError').textContent = 'Valid expiry date (MM/YY) is required.'; isValid = false;
                    }
                    if (!checkoutCvvInput.value.trim() || !/^\d{3,4}$/.test(checkoutCvvInput.value)) {
                         document.getElementById('checkoutCvvError').textContent = 'Valid CVV (3 or 4 digits) is required.'; isValid = false;
                    }

                    if (!isValid) {
                        checkoutFormMessageEl.textContent = 'Please correct the errors above.';
                        checkoutFormMessageEl.className = 'form-message error';
                        checkoutFormMessageEl.style.display = 'block';
                        return;
                    }
                    checkoutFormMessageEl.textContent = 'Processing payment...';
                    checkoutFormMessageEl.className = 'form-message'; 
                    checkoutFormMessageEl.style.display = 'block';

                    setTimeout(() => {
                        const transactionId = `HZL-TRX-${Date.now()}`;
                        showToast('Rental confirmed! Thank you for your order.');
                        checkoutForm.style.display = 'none';
                        checkoutConfirmationSection.style.display = 'block';
                        
                        checkoutDownloadReceiptBtn.onclick = () => generateAndDownloadReceipt(transactionId);

                        if(currentUser && !currentUser.isAdmin) {
                            currentUser.activeRentalsCount = (currentUser.activeRentalsCount || 0) + cart.length;
                        }
                        cart = []; // Empty the cart
                        updateCartIcon();
                    }, 2000);
                });
            }


            document.body.addEventListener('click', function(e) {
                if (e.target.classList.contains('leave-review-btn')) {
                    const listingId = e.target.dataset.listingId;
                    if (!currentUser) {
                        showModal('authModal');
                        showToast("Please login to leave a review.");
                        return;
                    }
                    if (currentUser.isAdmin) {
                        showToast("Admins cannot leave reviews through this interface.");
                        return;
                    }
                    if (reviewProductIdInput) reviewProductIdInput.value = listingId;
                    if (reviewModalTitle) {
                         const product = getProductById(listingId);
                         reviewModalTitle.textContent = `Review: ${product ? product.title : 'Item'}`;
                    }
                    showModal('reviewModal');
                }
            });

            if (reviewStarRatingContainer) {
                const stars = reviewStarRatingContainer.querySelectorAll('.star');
                stars.forEach(star => {
                    star.addEventListener('click', function() {
                        const rating = this.dataset.value;
                        if (reviewRatingValueInput) reviewRatingValueInput.value = rating;
                        stars.forEach(s => s.classList.toggle('selected', parseInt(s.dataset.value) <= parseInt(rating)));
                        if(document.getElementById('ratingError')) document.getElementById('ratingError').textContent = '';
                    });
                    star.addEventListener('mouseover', function() {
                        const hoverValue = this.dataset.value;
                        stars.forEach(s => s.style.color = parseInt(s.dataset.value) <= parseInt(hoverValue) ? '#ffc107' : (document.body.classList.contains('dark-mode') ? '#555' : 'var(--gray-color)'));
                    });
                    star.addEventListener('mouseout', function() {
                        const currentRating = reviewRatingValueInput ? reviewRatingValueInput.value : 0;
                        stars.forEach(s => {
                            s.style.color = '';
                            s.classList.toggle('selected', parseInt(s.dataset.value) <= parseInt(currentRating));
                        });
                    });
                });
            }

            if (reviewForm) {
                reviewForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    ['ratingError', 'reviewerNameError', 'reviewTextError'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.textContent = '';
                    });
                    if(reviewFormMessageEl) reviewFormMessageEl.style.display = 'none';

                    let isValid = true;
                    const rating = reviewRatingValueInput.value;
                    const reviewerName = reviewerNameInput.value.trim();
                    const reviewText = reviewTextInput.value.trim();
                    const productId = reviewProductIdInput.value;

                    if (!rating) { if(document.getElementById('ratingError')) document.getElementById('ratingError').textContent = 'Please select a rating.'; isValid = false; }
                    if (!reviewerName) { if(document.getElementById('reviewerNameError')) document.getElementById('reviewerNameError').textContent = 'Name is required.'; isValid = false; }
                    if (!reviewText) { if(document.getElementById('reviewTextError')) document.getElementById('reviewTextError').textContent = 'Review text is required.'; isValid = false; }

                    if (!isValid) return;

                    const newReview = {
                        name: reviewerName, date: "Just now", rating: parseInt(rating),
                        text: reviewText, img: currentUser ? currentUser.profilePic : `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`
                    };

                    const product = getProductById(productId);
                    if (product) {
                        if (!product.reviews) product.reviews = [];
                        product.reviews.unshift(newReview);
                    }

                    const reviewsSection = document.querySelector(`#listing-page-${productId} .reviews-section`);
                    if (reviewsSection) {
                        const reviewCardHTML = `
                            <div class="review-card">
                                <div class="review-header"><div class="reviewer"><img src="${newReview.img}" alt="${newReview.name}" class="reviewer-img"><div class="reviewer-name">${newReview.name}</div></div><div class="review-date">${newReview.date}</div></div>
                                <div class="review-rating">${getRatingStars(newReview.rating, true)}</div> <p>${newReview.text}</p>
                            </div>`;
                        const h3 = reviewsSection.querySelector('h3');
                        if(h3) h3.insertAdjacentHTML('afterend', reviewCardHTML);
                        else reviewsSection.insertAdjacentHTML('beforeend', reviewCardHTML);
                    }

                    if (reviewFormMessageEl) {
                        reviewFormMessageEl.textContent = 'Review submitted successfully!';
                        reviewFormMessageEl.className = 'form-message success';
                        reviewFormMessageEl.style.display = 'block';
                    }
                    showToast('Review submitted!');
                    setTimeout(() => hideModal('reviewModal'), 1500);
                });
            }

            if (createListingForm) {
                createListingForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                     ['createListingTitleError', 'createListingFullTitleError', 'createListingCategoryError', 'createListingPriceError', 'createListingImageError', 'createListingDescriptionError', 'createListingTrackingTagError'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.textContent = '';
                    });
                    if (createListingFormMessageEl) createListingFormMessageEl.style.display = 'none';

                    let isValid = true;
                    const title = createListingTitleInput.value.trim();
                    const fullTitle = createListingFullTitleInput.value.trim();
                    const category = createListingCategorySelect.value;
                    const priceDisplay = createListingPriceInput.value.trim();
                    const image = createListingImageInput.value.trim();
                    const description = createListingDescriptionTextarea.value.trim();
                    const trackingTagId = createListingTrackingTagInput.value.trim();
                    const ownerTerms = createListingOwnerTermsTextarea.value.trim();
                    
                    if (!title) { document.getElementById('createListingTitleError').textContent = 'Title is required.'; isValid = false; }
                    if (!fullTitle) { document.getElementById('createListingFullTitleError').textContent = 'Full title is required.'; isValid = false; }
                    if (!category) { document.getElementById('createListingCategoryError').textContent = 'Category is required.'; isValid = false; }
                    if (!trackingTagId) { document.getElementById('createListingTrackingTagError').textContent = 'Tracking Tag ID is required.'; isValid = false; }

                    let priceNumber = 0;
                    if (!priceDisplay) { document.getElementById('createListingPriceError').textContent = 'Price is required.'; isValid = false; }
                    else {
                        const priceMatch = priceDisplay.match(/(\d+(\.\d+)?)/);
                        if (!priceMatch) {
                            document.getElementById('createListingPriceError').textContent = 'Invalid price format (e.g., ₱500/day or 500).'; isValid = false;
                        } else {
                            priceNumber = parseFloat(priceMatch[0]);
                        }
                    }
                    if (!image) { document.getElementById('createListingImageError').textContent = 'Image URL is required.'; isValid = false; }
                    else {
                        try { new URL(image); }
                        catch (_) { document.getElementById('createListingImageError').textContent = 'Invalid image URL.'; isValid = false; }
                    }
                    if (!description) { document.getElementById('createListingDescriptionError').textContent = 'Description is required.'; isValid = false; }

                    if (!isValid) return;

                    const newProductId = generateNewProductId();
                    const newProduct = {
                        id: newProductId,
                        title: title,
                        fullTitle: fullTitle,
                        category: category.charAt(0).toUpperCase() + category.slice(1),
                        price: priceNumber,
                        priceDisplay: priceDisplay,
                        image: image,
                        description: description,
                        ownerId: currentUser.email,
                        ownerName: `${currentUser.firstName} ${currentUser.lastName}`,
                        reviews: [],
                        trackingTagId: trackingTagId,
                        ownerTerms: ownerTerms
                    };

                    productData.push(newProduct);
                    if (currentUser && !currentUser.isAdmin) {
                        currentUser.myListingIds.push(newProductId);
                        if(simulatedUsers[currentUser.email]) simulatedUsers[currentUser.email].myListingIds.push(newProductId);
                    }


                    if (document.getElementById('profile-my-listings-view')?.classList.contains('active-profile-view')) populateMyListings();
                    if (document.getElementById('admin-listing-management-view')?.classList.contains('active-admin-view')) populateAdminListingManagement();

                    if(currentUser && !currentUser.isAdmin) updateAnalyticsDashboard();
                    else if (currentUser && currentUser.isAdmin) populateAdminOverview();

                    if (allProductsPage.classList.contains('active')) {
                        handleAllProductsSearchAndFilter();
                    }

                    const newListingPageDiv = createDynamicListingPageDOM(newProduct);
                    if (newListingPageDiv) {
                        document.body.appendChild(newListingPageDiv);
                    }

                    if (createListingFormMessageEl) {
                        createListingFormMessageEl.textContent = 'Listing created successfully!';
                        createListingFormMessageEl.className = 'form-message success';
                        createListingFormMessageEl.style.display = 'block';
                    }
                    showToast('Listing created!');
                    setTimeout(() => {
                        hideModal('createListingModal');
                        if(currentUser && !currentUser.isAdmin) showProfileView('my-listings');
                        else if (currentUser && currentUser.isAdmin) showAdminView('listing-management');
                    }, 1500);
                });
            }


            if (editListingForm) {
                editListingForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    ['editListingTitleError', 'editListingFullTitleError', 'editListingCategoryError', 'editListingPriceError', 'editListingImageError', 'editListingDescriptionError', 'editListingTrackingTagError'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.textContent = '';
                    });
                    if (editListingFormMessageEl) editListingFormMessageEl.style.display = 'none';

                    let isValid = true;
                    const productId = parseInt(editListingProductIdInput.value);
                    const title = editListingTitleInput.value.trim();
                    const fullTitle = editListingFullTitleInput.value.trim();
                    const category = editListingCategorySelect.value;
                    const priceDisplay = editListingPriceInput.value.trim();
                    const image = editListingImageInput.value.trim();
                    const description = editListingDescriptionTextarea.value.trim();
                    const trackingTagId = editListingTrackingTagInput.value.trim();
                    const ownerTerms = editListingOwnerTermsTextarea.value.trim();

                    if (!title) { document.getElementById('editListingTitleError').textContent = 'Title is required.'; isValid = false; }
                    if (!fullTitle) { document.getElementById('editListingFullTitleError').textContent = 'Full title is required.'; isValid = false; }
                    if (!category) { document.getElementById('editListingCategoryError').textContent = 'Category is required.'; isValid = false; }
                    if (!trackingTagId) { document.getElementById('editListingTrackingTagError').textContent = 'Tracking Tag ID is required.'; isValid = false; }
                    
                    let priceNumber = 0;
                     if (!priceDisplay) { document.getElementById('editListingPriceError').textContent = 'Price is required.'; isValid = false; }
                     else {
                        const priceMatch = priceDisplay.match(/(\d+(\.\d+)?)/);
                        if (!priceMatch) {
                            document.getElementById('editListingPriceError').textContent = 'Invalid price format (e.g., ₱500/day).'; isValid = false;
                        } else {
                            priceNumber = parseFloat(priceMatch[0]);
                        }
                    }
                    if (!image) { document.getElementById('editListingImageError').textContent = 'Image URL is required.'; isValid = false; }
                    else {
                        try { new URL(image); } catch (_) { document.getElementById('editListingImageError').textContent = 'Invalid image URL.'; isValid = false; }
                    }
                    if (!description) { document.getElementById('editListingDescriptionError').textContent = 'Description is required.'; isValid = false; }

                    if (!isValid) return;

                    const productIndex = productData.findIndex(p => p.id === productId);
                    if (productIndex > -1) {
                        productData[productIndex].title = title;
                        productData[productIndex].fullTitle = fullTitle;
                        productData[productIndex].category = category.charAt(0).toUpperCase() + category.slice(1);
                        productData[productIndex].price = priceNumber;
                        productData[productIndex].priceDisplay = priceDisplay;
                        productData[productIndex].image = image;
                        productData[productIndex].description = description;
                        productData[productIndex].trackingTagId = trackingTagId;
                        productData[productIndex].ownerTerms = ownerTerms;

                        if(document.getElementById('profile-my-listings-view')?.classList.contains('active-profile-view')) populateMyListings();
                        if(document.getElementById('admin-listing-management-view')?.classList.contains('active-admin-view')) populateAdminListingManagement();

                        const listingPageElement = document.getElementById(`listing-page-${productId}`);
                        if (listingPageElement) {
                            listingPageElement.querySelector('.listing-title').textContent = fullTitle;
                            listingPageElement.querySelector('.listing-price').textContent = priceDisplay;
                            listingPageElement.querySelector('.main-image').src = image;
                            listingPageElement.querySelector('.thumbnail-images .thumbnail-img:first-child').src = image;
                            listingPageElement.querySelector('.listing-description > p:first-of-type').textContent = description;
                            listingPageElement.querySelector('.listing-tracking-id').textContent = trackingTagId;
                        }
                        const homePageCard = document.querySelector(`#home-page .product-card[data-product-id="${productId}"]`);
                        if (homePageCard) {
                            homePageCard.querySelector('.product-title').textContent = title;
                            homePageCard.querySelector('.product-category').textContent = productData[productIndex].category;
                            homePageCard.querySelector('.product-price').textContent = priceDisplay;
                            homePageCard.querySelector('.product-img').src = image;
                            homePageCard.dataset.category = category.toLowerCase();
                        }
                        const allProductsPageCard = document.querySelector(`#all-products-page .product-card[data-product-id="${productId}"]`);
                        if (allProductsPageCard) {
                            allProductsPageCard.querySelector('.product-title').textContent = title;
                            allProductsPageCard.querySelector('.product-category').textContent = productData[productIndex].category;
                            allProductsPageCard.querySelector('.product-price').textContent = priceDisplay;
                            allProductsPageCard.querySelector('.product-img').src = image;
                            allProductsPageCard.dataset.category = category.toLowerCase();
                        }


                        if (editListingFormMessageEl) {
                            editListingFormMessageEl.textContent = 'Listing updated successfully!';
                            editListingFormMessageEl.className = 'form-message success';
                            editListingFormMessageEl.style.display = 'block';
                        }
                        showToast('Listing updated!');
                        setTimeout(() => {
                            hideModal('editListingModal');
                        }, 1500);

                    } else {
                        if (editListingFormMessageEl) {
                            editListingFormMessageEl.textContent = 'Error: Product not found.';
                            editListingFormMessageEl.className = 'form-message error';
                            editListingFormMessageEl.style.display = 'block';
                        }
                    }
                });
            }

            if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChatWidget);
            if (closeChatWidgetBtn) closeChatWidgetBtn.addEventListener('click', toggleChatWidget);
            if (chatSendMessageBtn) chatSendMessageBtn.addEventListener('click', handleSendChatMessage);
            if (chatMessageInput) {
                chatMessageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        handleSendChatMessage();
                    }
                });
            }
            if (profileSettingsForm) {
                profileSettingsForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (!currentUser || currentUser.isAdmin) return;

                    document.querySelectorAll('#profileSettingsForm .error-message').forEach(el => el.textContent = '');
                    if(settingsFormMessageEl) settingsFormMessageEl.style.display = 'none';

                    let isValid = true;
                    const firstName = settingsFirstNameInput.value.trim();
                    const lastName = settingsLastNameInput.value.trim();
                    const profilePicUrl = settingsProfilePicUrlInput.value.trim();
                    const location = settingsLocationInput.value.trim();
                    const currentPassword = settingsCurrentPasswordInput.value;
                    const newPassword = settingsNewPasswordInput.value;
                    const confirmNewPassword = settingsConfirmNewPasswordInput.value;

                    if (!firstName) {
                        document.getElementById('settingsFirstNameError').textContent = 'First name is required.'; isValid = false;
                    }
                    if (!lastName) {
                        document.getElementById('settingsLastNameError').textContent = 'Last name is required.'; isValid = false;
                    }
                    if (profilePicUrl) {
                        try { new URL(profilePicUrl); }
                        catch (_) {
                            document.getElementById('settingsProfilePicUrlError').textContent = 'Invalid URL format.'; isValid = false;
                        }
                    }

                    let passwordChanged = false;
                    if (newPassword || currentPassword) {
                        if (!currentPassword) {
                            document.getElementById('settingsCurrentPasswordError').textContent = 'Current password is required to change password.'; isValid = false;
                        } else if (currentPassword !== currentUser.password) {
                            document.getElementById('settingsCurrentPasswordError').textContent = 'Incorrect current password.'; isValid = false;
                        }
                        if (!newPassword) {
                            document.getElementById('settingsNewPasswordError').textContent = 'New password is required if changing.'; isValid = false;
                        } else if (newPassword.length < 6) {
                            document.getElementById('settingsNewPasswordError').textContent = 'Must be at least 6 characters.'; isValid = false;
                        }
                        if (newPassword !== confirmNewPassword) {
                            document.getElementById('settingsConfirmNewPasswordError').textContent = 'Passwords do not match.'; isValid = false;
                        }
                        if(isValid && currentPassword && newPassword) passwordChanged = true;
                    }

                    if (!isValid) {
                        if (settingsFormMessageEl) {
                            settingsFormMessageEl.textContent = 'Please correct the errors above.';
                            settingsFormMessageEl.className = 'form-message error';
                            settingsFormMessageEl.style.display = 'block';
                        }
                        return;
                    }

                    currentUser.firstName = firstName;
                    currentUser.lastName = lastName;
                    if (profilePicUrl) currentUser.profilePic = profilePicUrl;
                    if (location) currentUser.location = location;
                    if (passwordChanged) {
                        currentUser.password = newPassword;
                    }

                    if (simulatedUsers[currentUser.email]) {
                        simulatedUsers[currentUser.email] = { ...simulatedUsers[currentUser.email], ...currentUser };
                    }

                    if (profileSidebarName) profileSidebarName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                    if (profilePicSidebar) profilePicSidebar.src = currentUser.profilePic;
                    if (profileWelcomeName) profileWelcomeName.textContent = currentUser.firstName;

                    settingsCurrentPasswordInput.value = '';
                    settingsNewPasswordInput.value = '';
                    settingsConfirmNewPasswordInput.value = '';

                    if (settingsFormMessageEl) {
                        settingsFormMessageEl.textContent = 'Settings saved successfully!';
                        settingsFormMessageEl.className = 'form-message success';
                        settingsFormMessageEl.style.display = 'block';
                    }
                    showToast('Profile settings updated!');
                });
            }

            if (adminSidebarLinks) {
                adminSidebarLinks.forEach(link => {
                    if (link.id === 'logoutBtnAdminDashboard') return;
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const viewTarget = this.dataset.view;
                        showAdminView(viewTarget);
                        updateHistory(`admin/${viewTarget}`);
                    });
                });
            }
            if (adminSaveTemplatesBtn) {
                adminSaveTemplatesBtn.addEventListener('click', () => {
                    if (adminTemplatesFormMessageEl) {
                        adminTemplatesFormMessageEl.textContent = "Templates saved (mock).";
                        adminTemplatesFormMessageEl.className = 'form-message success';
                        adminTemplatesFormMessageEl.style.display = 'block';
                        setTimeout(() => adminTemplatesFormMessageEl.style.display = 'none', 3000);
                    }
                    showToast("Templates saved (mock).");
                });
            }
             if (adminSettingsForm) {
                adminSettingsForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (!currentUser || !currentUser.isAdmin) return;

                    document.querySelectorAll('#adminSettingsForm .error-message').forEach(el => el.textContent = '');
                    if(adminSettingsFormMessageEl) adminSettingsFormMessageEl.style.display = 'none';

                    let isValid = true;
                    const firstName = adminSettingsFirstNameInput.value.trim();
                    const lastName = adminSettingsLastNameInput.value.trim();
                    const profilePicUrl = adminSettingsProfilePicUrlInput.value.trim();
                    const currentPassword = adminSettingsCurrentPasswordInput.value;
                    const newPassword = adminSettingsNewPasswordInput.value;
                    const confirmNewPassword = adminSettingsConfirmNewPasswordInput.value;

                    if (!firstName) { document.getElementById('adminSettingsFirstNameError').textContent = 'First name is required.'; isValid = false; }
                    if (!lastName) { document.getElementById('adminSettingsLastNameError').textContent = 'Last name is required.'; isValid = false; }
                    if (profilePicUrl) {
                        try { new URL(profilePicUrl); }
                        catch (_) { document.getElementById('adminSettingsProfilePicUrlError').textContent = 'Invalid URL format.'; isValid = false; }
                    }

                    let passwordChanged = false;
                    if (newPassword || currentPassword) {
                        if (!currentPassword) { document.getElementById('adminSettingsCurrentPasswordError').textContent = 'Current password required to change.'; isValid = false; }
                        else if (currentPassword !== currentUser.password) { document.getElementById('adminSettingsCurrentPasswordError').textContent = 'Incorrect current password.'; isValid = false; }
                        if (!newPassword) { document.getElementById('adminSettingsNewPasswordError').textContent = 'New password required.'; isValid = false; }
                        else if (newPassword.length < 6) { document.getElementById('adminSettingsNewPasswordError').textContent = 'New password too short.'; isValid = false; }
                        if (newPassword !== confirmNewPassword) { document.getElementById('adminSettingsConfirmNewPasswordError').textContent = 'Passwords do not match.'; isValid = false; }
                        if(isValid && currentPassword && newPassword) passwordChanged = true;
                    }

                    if (!isValid) {
                        if (adminSettingsFormMessageEl) {
                            adminSettingsFormMessageEl.textContent = 'Please correct errors.';
                            adminSettingsFormMessageEl.className = 'form-message error';
                            adminSettingsFormMessageEl.style.display = 'block';
                        }
                        return;
                    }

                    currentUser.firstName = firstName;
                    currentUser.lastName = lastName;
                    if (profilePicUrl) currentUser.profilePic = profilePicUrl;
                    if (passwordChanged) currentUser.password = newPassword;

                    if (simulatedUsers[currentUser.email]) {
                        simulatedUsers[currentUser.email] = { ...simulatedUsers[currentUser.email], ...currentUser };
                    }

                    if (adminSidebarName) adminSidebarName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                    if (adminSidebarPic) adminSidebarPic.src = currentUser.profilePic;

                    adminSettingsCurrentPasswordInput.value = '';
                    adminSettingsNewPasswordInput.value = '';
                    adminSettingsConfirmNewPasswordInput.value = '';

                    if (adminSettingsFormMessageEl) {
                        adminSettingsFormMessageEl.textContent = 'Admin settings saved!';
                        adminSettingsFormMessageEl.className = 'form-message success';
                        adminSettingsFormMessageEl.style.display = 'block';
                    }
                    showToast('Admin settings updated!');
                });
            }


        }

        document.addEventListener('DOMContentLoaded', () => {
            initializeCoreDOMElements();
            initializeEventListeners();
            initFromUrl();
        });