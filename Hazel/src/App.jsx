import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout and Main Pages
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// --- NEWLY ADDED CHAT PAGE IMPORT ---
import ChatPage from './pages/ChatPage'; 

// Data seeding utility page
import TestDataSavePage from './data/testdatasave';

// Profile Sub-pages
import ProfileDashboard from './pages/profile/ProfileDashboard';
import MyListings from './pages/profile/MyListings';
import Favorites from './pages/profile/Favorites';
import ProfileSettings from './pages/profile/ProfileSettings';
import RentalTracker from './pages/profile/RentalTracker';

// Admin Sub-pages
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import ListingManagement from './pages/admin/ListingManagement';
import AdminSettings from './pages/admin/AdminSettings';
import ContentManagement from './pages/admin/ContentManagement';

function App() {
  return (
    <Routes>
      {/* This Route wraps all pages that should have the Header and Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<AllProductsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="listing/:id" element={<ListingDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        
        {/* --- NEWLY ADDED CHAT ROUTE --- */}
        {/* This makes the /chat URL render your new ChatPage component */}
        <Route path="chat" element={<ChatPage />} />

        {/* Nested Profile Routes */}
        <Route path="profile" element={<ProfilePage />}>
          <Route index element={<ProfileDashboard />} />
          <Route path="my-listings" element={<MyListings />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="rental-tracker" element={<RentalTracker />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
        
        {/* Nested Admin Routes */}
        <Route path="admin" element={<AdminDashboardPage />}>
           <Route index element={<AdminOverview />} />
           <Route path="users" element={<UserManagement />} />
           <Route path="listings" element={<ListingManagement />} />
           <Route path="content" element={<ContentManagement />} />
           <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* This route is outside the main Layout, so it will be a blank page */}
      <Route path="/seed-data" element={<TestDataSavePage />} />
    </Routes>
  );
}

export default App;