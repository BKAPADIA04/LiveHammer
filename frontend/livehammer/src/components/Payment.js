import React from 'react'
import { useLocation } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';

export default function Payment() {
  const location = useLocation();
  const {email,payment} = location.state || {};
  return (
    <div>
      <h1>Payment Page</h1>
      <h1>{email}</h1>
      <h1>{payment}</h1>
    </div>
  )
}
