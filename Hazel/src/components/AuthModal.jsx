import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ closeModal, initialTab }) => {
    const { login, signup } = useApp();
    const navigate = useNavigate();

    // 'initial', 'user', 'owner', 'admin'
    const [view, setView] = useState('initial');
    // 'login' or 'signup'
    const [activeTab, setActiveTab] = useState(initialTab || 'login');
    const [errorMessage, setErrorMessage] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const resetForms = () => {
        setErrorMessage('');
        setLoginData({ email: '', password: '' });
        setSignupData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    };

    const handleViewChange = (newView) => {
        setView(newView);
        setActiveTab(initialTab || 'login'); // Default to the tab the user initially clicked
        resetForms();
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        const user = login(loginData.email, loginData.password);
        if (user) {
            closeModal();
            if (user.role === 'admin') navigate('/admin');
            else navigate('/profile');
        } else {
            setErrorMessage('Invalid credentials. Please check email and password.');
        }
    };

    const handleSignupSubmit = (e, role) => {
        e.preventDefault();
        setErrorMessage('');
        if (signupData.password !== signupData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        const user = signup({
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
            password: signupData.password
        }, role);

        if (user) {
            closeModal();
            navigate('/profile');
        } else {
            setErrorMessage('This email is already registered.');
        }
    };

    const BackLink = () => (
        <a href="#" className="modal-footer-back-link" onClick={(e) => { e.preventDefault(); handleViewChange('initial'); }}>
            &larr; Back to selection
        </a>
    );

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 id="modalTitle">
                        {view === 'initial' && 'Join or Sign In'}
                        {view === 'user' && (activeTab === 'login' ? 'User Login' : 'User Sign Up')}
                        {view === 'owner' && (activeTab === 'login' ? 'Owner Login' : 'Owner Sign Up')}
                        {view === 'admin' && 'Admin Login'}
                    </h2>
                    <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>×</button>
                </div>

                <div className="modal-body">
                    {view === 'initial' && (
                        <div className="auth-role-selection">
                            <h3>How would you like to proceed?</h3>
                            <button className="btn btn-primary" onClick={() => handleViewChange('user')}>I want to Rent Items (User)</button>
                            <button className="btn btn-outline" onClick={() => handleViewChange('owner')}>I want to List Items (Owner)</button>
                            <button className="btn btn-secondary" onClick={() => handleViewChange('admin')}>Admin Login</button>
                        </div>
                    )}

                    {(view === 'user' || view === 'owner') && (
                        <>
                            <div className="tab-container">
                                <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</div>
                                <div className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</div>
                            </div>
                            
                            <form id="loginForm" className={`form-container ${activeTab === 'login' ? 'active' : ''}`} onSubmit={handleLoginSubmit}>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required /></div>
                                <div className="form-group"><label>Password</label><input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required /></div>
                                {activeTab === 'login' && errorMessage && <div className="error-message">{errorMessage}</div>}
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                            
                            <form id="signupForm" className={`form-container ${activeTab === 'signup' ? 'active' : ''}`} onSubmit={(e) => handleSignupSubmit(e, view)}>
                                <div className="form-group"><label>First Name</label><input type="text" name="firstName" value={signupData.firstName} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Last Name</label><input type="text" name="lastName" value={signupData.lastName} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={signupData.email} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Password</label><input type="password" name="password" value={signupData.password} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required /></div>
                                {activeTab === 'signup' && errorMessage && <div className="error-message">{errorMessage}</div>}
                                <button type="submit" className="btn btn-primary">Sign Up as {view.charAt(0).toUpperCase() + view.slice(1)}</button>
                            </form>

                            <BackLink />
                        </>
                    )}

                    {view === 'admin' && (
                        <>
                            <form className="form-container active" onSubmit={handleLoginSubmit}>
                                <div className="form-group"><label>Admin Email</label><input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required /></div>
                                <div className="form-group"><label>Password</label><input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required /></div>
                                {errorMessage && <div className="error-message">{errorMessage}</div>}
                                <button type="submit" className="btn btn-primary">Admin Login</button>
                            </form>
                            <BackLink />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;