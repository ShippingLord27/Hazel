import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ closeModal }) => {
    const { login, signup } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
    const [errorMessage, setErrorMessage] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        const user = login(loginData.email, loginData.password);
        if (user) {
            closeModal();
            navigate(user.isAdmin ? '/admin' : '/profile');
        } else {
            setErrorMessage('Invalid credentials. Try admin@hazel.com / admin');
        }
    };

    const handleSignupSubmit = (e) => {
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
        });
        if (user) {
            closeModal();
            navigate('/profile');
        } else {
            setErrorMessage('This email is already registered.');
        }
    };
    
    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 id="modalTitle">{activeTab === 'login' ? 'Login' : 'Sign Up'}</h2>
                    <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>×</button>
                </div>
                
                <div className="modal-body">
                    <div className="tab-container">
                        <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</div>
                        <div className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</div>
                    </div>
                    
                    <form id="loginForm" className={`form-container ${activeTab === 'login' ? 'active' : ''}`} onSubmit={handleLoginSubmit}>
                        <div className="form-group"><label htmlFor="loginEmail">Email</label><input type="email" id="loginEmail" name="email" value={loginData.email} onChange={handleLoginChange} required /></div>
                        <div className="form-group"><label htmlFor="loginPassword">Password</label><input type="password" id="loginPassword" name="password" value={loginData.password} onChange={handleLoginChange} required /></div>
                        {activeTab === 'login' && errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button type="submit" className="btn btn-primary">Login</button>
                        <div className="form-footer"><p>Don't have an account? <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('signup');}}>Sign Up</a></p></div>
                    </form>
                    
                    <form id="signupForm" className={`form-container ${activeTab === 'signup' ? 'active' : ''}`} onSubmit={handleSignupSubmit}>
                        <div className="form-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" name="firstName" value={signupData.firstName} onChange={handleSignupChange} required /></div>
                        <div className="form-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" name="lastName" value={signupData.lastName} onChange={handleSignupChange} required /></div>
                        <div className="form-group"><label htmlFor="signupEmail">Email</label><input type="email" id="signupEmail" name="email" value={signupData.email} onChange={handleSignupChange} required /></div>
                        <div className="form-group"><label htmlFor="signupPassword">Password</label><input type="password" id="signupPassword" name="password" value={signupData.password} onChange={handleSignupChange} required /></div>
                        <div className="form-group"><label htmlFor="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required /></div>
                        {activeTab === 'signup' && errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                        <div className="form-footer"><p>Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('login');}}>Login</a></p></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;