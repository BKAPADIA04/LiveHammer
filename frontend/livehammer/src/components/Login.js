import React,{useState} from 'react';
// import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import '../css/login.css';

export default function Login() {
    
    const [email, setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const host = 'http://localhost:8080';

    const handleGenerateOtp = async() => {
        if (!email || !phone) {
            setError('Please enter a valid email and phone number');
            return;
        }
        
        const url = `${host}/auth/user/requestOTP`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:email }),
        });

        const data = await response.json();
        console.log(data);
        setError('');
        setOtpSent(true);
        setOtp('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }
        alert(`OTP submitted: ${otp}`);
        setEmail('');
        setPhone('');
        setOtp('');
        setOtpSent(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 text-light">
            <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-4">User Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className="form-control"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    {otpSent && (
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">
                                OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className="form-control"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-success w-50"
                            onClick={handleGenerateOtp}
                        >
                            Generate OTP
                        </button>
                        <button type="submit" className="btn btn-primary w-50">
                            Submit
                        </button>
                    </div>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
}
