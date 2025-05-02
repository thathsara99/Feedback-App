import React, { useState } from "react";
import { Card, Typography, Row, Col, Modal } from "antd";
import { GoogleOutlined, FacebookOutlined,SmileOutlined } from "@ant-design/icons";
import QRCode from "react-qr-code";
import Logo from '../vintage-tea-emporium-logo-white.png'

const { Title, Paragraph } = Typography;
import { useNavigate } from 'react-router-dom';



// Review URLs
const googleReviewURL = "https://www.google.co.uk/search?sca_esv=b897ea522cee66a6&si=APYL9btvhO6SAb8jF9HqTZMMa7vs_teLnZaEVrJZwRKFIIKjodjiv6Q2k2zend2pqchvOMhhUiyvdfF6GJtjc01ADPiLwCSaz22v1hmX13xqzceAIc1S1Hx2TbvG4a90Yg00J0n7TQ9OlbpgoiK3YSzT7d2rG7S_8w%3D%3D&q=Vintage+Tea+Emporium+Reviews&sa=X&ved=2ahUKEwisj9qPsfqMAxVHTEEAHVG4HAEQ0bkNegQILRAE&biw=1366&bih=639&dpr=1#lrd=0x487a11abe85fef5f:0xdc3a1f7b5dcfcb55,3,,,,"; // Replace with real Google review link
const tripAdvisorReviewURL = "https://www.tripadvisor.co.uk/UserReviewEdit-g504161-d2323996-The_Vintage_Tea_Emporium-Uttoxeter_Staffordshire_England.html"; // Replace with real TripAdvisor review link
const facebook= "https://www.facebook.com/vintageteatuttoxeter/reviews";

function LoginPage() {
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);
  const [isTripAdvisorModalVisible, setIsTripAdvisorModalVisible] = useState(false);
  const [isFaceBookModalVisible, setIsFaceBookModalVisible] = useState(false);

  const handleGoogleClick = () => {
    setIsGoogleModalVisible(true);
  };

  const handleTripAdvisorClick = () => {
    setIsTripAdvisorModalVisible(true);
  };

  const handleFacebookClick = () => {
    setIsFaceBookModalVisible(true);
  };

  const navigate = useNavigate();


  const handleLeaveOtherReview = () => {
    navigate('/feedback');
  };

  return (
    <div
    style={{
      minHeight: "100vh",
      paddingTop: "10vh",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('http://vintageteaemporium.co.uk/wp-content/uploads/2014/05/dsc02506.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: 20,
      width: "100%",
    }}
    >
      
      <Row>
        <Col md={6}>
        </Col>
        <Col md={12}>
        <center>
        <img
              src={Logo}
              style={{ width: "20%" }}
            />  
        </center>
        <br/>
        <center><h1 style={{ color: "#fff" }} className="title">Leave a Review</h1></center>
      
     
      <Paragraph className="ptext " style={{ color: "#eee", textAlign: "center",  fontSize: "21px"}}>
        <div className="overlay">We’d love your feedback! Scan the QR code to leave a quick review about
        your experience at Vintage Tea Emporium. <br/>Your words mean the world to us.</div>
        
      </Paragraph>
      </Col>
      </Row>
      

      <Row gutter={24} style={{ marginTop: 40 }}>
        {/* Google Review Card */}
        <Col md={6}>
        </Col>
        <Col md={6} xs={24}>
          <Card
            hoverable
            style={{
             // width: 240,
              textAlign: "center",
              backgroundColor: "#E03F32",
              border: "1px solid #fff",
              color: "#fff",
              marginTop:"22px"
            }}
            onClick={handleGoogleClick}
          >
            <GoogleOutlined style={{ fontSize: 48, color: "#fff" }} />
            <Title level={3} style={{ color: "#fff", marginTop: 16 }}>
              Leave a Google Review
            </Title>
          </Card>
        </Col>

        {/* TripAdvisor Review Card */}
        <Col md={6} xs={24}>
          <Card
            hoverable
            style={{
             // width: 240,
              textAlign: "center",
              backgroundColor: "#1CBA80",
              border: "1px solid #fff",
              color: "#fff",
               marginTop:"22px"
            }}
            onClick={handleTripAdvisorClick}
          >
            <img
              src="https://www.svgrepo.com/show/333614/trip-advisor.svg"
              alt="TripAdvisor"
              style={{ width: 48, height: 48 }}
            />
            <Title level={3} style={{ color: "#fff", marginTop: 16 }}>
              Leave a TripAdvisor Review
            </Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} >
        {/* Google Review Card */}
        <Col md={6}>
        </Col>
        <Col md={6} xs={24}>
          <Card
            hoverable
            style={{
             // width: 240,
              textAlign: "center",
              backgroundColor: "#0866FF",
              border: "1px solid #fff",
              color: "#fff",
              marginTop:"22px"
            }}
            onClick={handleFacebookClick}
          >
            <FacebookOutlined style={{ fontSize: 48, color: "#fff" }} />
            <Title level={3} style={{ color: "#fff", marginTop: 16 }}>
              Leave a Facebook Review
            </Title>
          </Card>
        </Col>

        {/* TripAdvisor Review Card */}
        <Col md={6} xs={24}>
          <Card
            hoverable
            style={{
             // width: 240,
              textAlign: "center",
              backgroundColor: "#EE6C4D",
              border: "1px solid #fff",
              color: "#fff",
               marginTop:"22px"
            }}
            onClick={handleLeaveOtherReview}
          >
            <SmileOutlined style={{ fontSize: 48, color: "#fff" }} />
            <Title level={3} style={{ color: "#fff", marginTop: 16 }}>
              Leave a Other Review
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Google Modal */}
      <Modal
        title="Scan to Leave a Review on Google"
        open={isGoogleModalVisible}
        footer={null}
        onCancel={() => setIsGoogleModalVisible(false)}
        centered
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        <div style={{ textAlign: "center", padding: 20 }}>
          <QRCode value={googleReviewURL} bgColor="#FFFFFF" fgColor="#000000" style={{background:"#fff"}} />
          <Paragraph style={{ marginTop: 20 }}>
            Open your phone camera and scan this QR code to write a Google review!
          </Paragraph>
        </div>
      </Modal>

      {/* TripAdvisor Modal */}
      <Modal
        title="Scan to Leave a Review on TripAdvisor"
        open={isTripAdvisorModalVisible}
        footer={null}
        onCancel={() => setIsTripAdvisorModalVisible(false)}
        centered
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        <div style={{ textAlign: "center", padding: 20 }}>
          <QRCode value={tripAdvisorReviewURL} bgColor="#FFFFFF" fgColor="#000000" style={{background:"#fff"}} />
          <Paragraph style={{ marginTop: 20 }}>
            Open your phone camera and scan this QR code to write a TripAdvisor review!
          </Paragraph>
        </div>
      </Modal>

       {/* Facebook Modal */}
       <Modal
        title="Scan to Leave a Review on FaceBook"
        open={isFaceBookModalVisible}
        footer={null}
        onCancel={() => setIsFaceBookModalVisible(false)}
        centered
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        <div style={{ textAlign: "center", padding: 20 }}>
          <QRCode value={facebook} bgColor="#FFFFFF" fgColor="#000000" style={{background:"#fff"}} />
          <Paragraph style={{ marginTop: 20 }}>
            Open your phone camera and scan this QR code to write a FaceBook review!
          </Paragraph>
        </div>
      </Modal>

      <footer style={{
        padding: "1rem",
        textAlign: "center",
        color: "#fff",
        fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
        width: "100%",
        position: "relative",
        zIndex: 2
      }}>
        © {new Date().getFullYear()} Vintage Tea Emporium. All rights reserved.
      </footer>

    </div>
  );
}

export default LoginPage;

