import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ closeModal, initialTab }) => {
    const { login, signup, logout } = useApp();
    const navigate = useNavigate();

    const [view, setView] = useState('initial');
    const [activeTab, setActiveTab] = useState(initialTab || 'login');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });
    const resetForms = () => { setErrorMessage(''); setLoginData({ email: '', password: '' }); setSignupData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }); };
    const handleViewChange = (newView) => { setView(newView); setActiveTab(initialTab || 'login'); resetForms(); };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        const user = await login(loginData.email, loginData.password);
        setIsLoading(false);

        if (user && user.profile) {
            const portalRole = view === 'user' ? 'renter' : view;
            if (portalRole !== 'admin' && user.profile.role !== portalRole) {
                setErrorMessage(`That's a '${user.profile.role}' account. Please log in from the correct portal.`);
                await logout();
                return;
            }
            closeModal();
            if (user.profile.role === 'admin') navigate('/admin');
            else navigate('/profile');
        } else {
            setErrorMessage('Invalid credentials or profile not found.');
        }
    };

    const handleSignupSubmit = async (e, role) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        setErrorMessage('');
        setIsLoading(true);
        const user = await signup({ firstName: signupData.firstName, lastName: signupData.lastName, email: signupData.email, password: signupData.password }, role);
        setIsLoading(false);
        if (user) {
            resetForms();
        } else {
            // The context already shows a toast, but we can set a local message too.
            setErrorMessage('Signup failed. The email might already be in use.');
        }
    };

    const BackLink = () => (<a href="#" className="modal-footer-back-link" onClick={(e) => { e.preventDefault(); handleViewChange('initial'); }}>&larr; Back to selection</a>);

    const getModalTitle = () => {
        if (view === 'initial') return 'Join or Sign In';
        const roleName = view === 'user' ? 'Renter' : view.charAt(0).toUpperCase() + view.slice(1);
        const actionName = activeTab === 'login' ? 'Login' : 'Sign Up';
        return `${roleName} ${actionName}`;
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 id="modalTitle">{getModalTitle()}</h2>
                    <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                    {view === 'initial' && (
                        <div className="auth-role-selection">
                            <h3>How would you like to proceed?</h3>
                            <button className="btn btn-primary" onClick={() => handleViewChange('user')}>I want to Rent Items</button>
                            <button className="btn btn-outline" onClick={() => handleViewChange('owner')}>I want to List Items</button>
                            <button className="btn btn-secondary" onClick={() => handleViewChange('admin')}>Admin Portal</button>
                        </div>
                    )}
                    {(view === 'user' || view === 'owner' || view === 'admin') && (
                        <>
                            <div className="tab-container">
                                <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</div>
                                <div className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</div>
                            </div>

                            <form id="loginForm" className={`form-container ${activeTab === 'login' ? 'active' : ''}`} onSubmit={handleLoginSubmit}>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required /></div>
                                <div className="form-group"><label>Password</label><input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required /></div>
                                {activeTab === 'login' && errorMessage && <div className="error-message">{errorMessage}</div>}
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                            </form>

                            <form id="signupForm" className={`form-container ${activeTab === 'signup' ? 'active' : ''}`} onSubmit={(e) => handleSignupSubmit(e, view)}>
                                <div className="form-group"><label>First Name</label><input type="text" name="firstName" value={signupData.firstName} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Last Name</label><input type="text" name="lastName" value={signupData.lastName} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={signupData.email} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Password</label><input type="password" name="password" value={signupData.password} onChange={handleSignupChange} required /></div>
                                <div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required /></div>
                                {activeTab === 'signup' && errorMessage && <div className="error-message">{errorMessage}</div>}
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Signing Up...' : `Sign Up`}</button>
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