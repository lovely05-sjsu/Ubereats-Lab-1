import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('customer'); // Default selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Password validation check (for example: at least 6 characters)
  const isPasswordValid = password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    axios.post('http://localhost:2000/api/auth/signup', { name, email, password, type })
      .then(response => {
        alert('Signup successful!');
        navigate('/login');
      })
      .catch(error => {
        setError('Signup failed. Please try again.');
        console.error("Error during signup:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {!isPasswordValid && password && (
            <small className="text-danger">Password must be at least 6 characters.</small>
          )}
        </div>

        {/* ✅ Added "Type" as a radio button */}
        <div className="form-group">
          <label>User Type</label>
          <div>
            <input 
              type="radio" 
              id="customer" 
              name="type" 
              value="customer" 
              checked={type === 'customer'}
              onChange={(e) => setType(e.target.value)} 
            />
            <label htmlFor="customer" className="ml-2">Customer</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="restaurant" 
              name="type" 
              value="restaurant" 
              checked={type === 'restaurant'}
              onChange={(e) => setType(e.target.value)} 
            />
            <label htmlFor="restaurant" className="ml-2">Restaurant</label>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-3" 
          disabled={loading || !isPasswordValid}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
