import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};