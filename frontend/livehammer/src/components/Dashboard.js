import React from 'react'
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const location = useLocation();
  const {email} = location.state || {};
  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{email}</h1>
    </div>
  )
}
