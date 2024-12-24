import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/login.css';
import bodyImage from '../images/otp.jpg';

export default function Login() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const host = 'http://localhost:8080';

    const handleGenerateOtp = async () => {
        if (!email) {
            setError('Please enter a valid email');
            return;
        }
        setLoading(true);
        const url1 = `${host}/user/search`;
        const response1 = await fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });

        const data1 = await response1.json();
        console.log(data1);

        if (data1.success === true && data1.found === true) {
            const url = `${host}/auth/user/requestOTP`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();
            console.log(data);

            setError('');
            setOtpSent(true);
            setOtp('');
        } else {
            return setError('User not registered!');
        }
        setLoading(false);
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }
        setLoading(true);
        const url = `${host}/auth/user/verifyOTP`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, otp: otp }),
        });

        const data = await response.json();
        setLoading(false);
        if (data.success === true) {
            console.log(data);
            navigate('/agora');
            setEmail('');
            setOtp('');
            setOtpSent(false);
            setError('');
        } else {
            setError(data.error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 text-light">
            <div className="card p-4 w-100" style={{ maxWidth: '500px' , Height:'50vh'}}>
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
                    <div className="mt-3">
                        <button
                            type="button"
                            className="btn btn-link p-0 text-info"
                            onClick={handleGenerateOtp}
                            disabled={otpSent || loading}
                        >
                        {loading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                &nbsp; Sending...
                            </span>
                        ) : otpSent && (
                            "OTP Sent! Didn't get a code? Click on Generate OTP again"
                        )}
                        </button>
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
