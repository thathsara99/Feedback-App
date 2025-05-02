import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #9d50bb, #6e48aa)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      color:"#fff"
    }}>
    <Result
      status="success"
      title="Thank you for your feedback!" 
      extra={<Button type="primary" onClick={() => navigate('/')}>Back to Login</Button>}
    />
    </div>
  );
}

export default ThankYouPage;