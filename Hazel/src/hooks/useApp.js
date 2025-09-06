import { useContext } from 'react';
// --- FIX: Use a named import to get the context object ---
import { AppContext } from '../contexts/AppContext';

export const useApp = () => useContext(AppContext);