import React, { useState } from "react";
import { Button, Input, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const faces = [
  { label: 'Excellent', emoji: '😄' },
  { label: 'Good', emoji: '😊' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Bad', emoji: '😕' },
  { label: 'Poor', emoji: '😡' },
];

function FeedbackPage() {
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/thankyou');
  };

  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      minHeight: '100vh',
      background: `url('http://vintageteaemporium.co.uk/wp-content/uploads/2016/09/dsc02562.jpg') no-repeat center center/cover`,
      fontFamily: "'Georgia', serif", // Vintage font
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Title style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)', // Responsive font size
        fontWeight: 'bold',
        color: '#fff',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
        marginBottom: '40px'
      }} level={2}>How was your experience?</Title>
      
      <Space size='large' style={{ marginTop: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
        {faces.map((face, index) => (
          <div
            key={index}
            style={{
              cursor: 'pointer',
              transform: selected === index ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.3s',
              background: 'rgba(255, 255, 255, 0.7)',  // Vintage card effect
              padding: '15px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              width: '100px',
              textAlign: 'center',
              margin: '10px'
            }}
            onClick={() => setSelected(index)}
          >
            <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>{face.emoji}</div>
            <div>{face.label}</div>
          </div>
        ))}
      </Space>

      <div style={{ marginTop: 40 }}>
        <TextArea
          rows={4}
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '12px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#333',
            border: '1px solid #ddd',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Georgia', serif"
          }}
        />
      </div>

      <Button
        type="primary"
        size="large"
        style={{
          marginTop: '20px',
          borderRadius: '30px', // Vintage button
          padding: '10px 40px',
          backgroundColor: '#8B5C7A', // Soft vintage color
          borderColor: '#8B5C7A',
          fontSize: 'clamp(0.9rem, 3vw, 1rem)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }}
        disabled={selected === null}
        onClick={handleSubmit}
      >
        Send Feedback
      </Button>
      
      <footer style={{
        padding: "1rem",
        textAlign: "center",
        color: "#fff",
        fontSize: "clamp(0.8rem, 2.5vw, 1rem)", // Responsive font size
        width: "100%",
        position: "relative",
        zIndex: 2,
        marginTop: 'auto'
      }}>
        © {new Date().getFullYear()} Vintage Tea Emporium. All rights reserved.
      </footer>
    </div>
  );
}

export default FeedbackPage;
