import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Spin } from "antd";
import OtpInputComponent from "../component/otpInputForm";
import Layout from "../component/mainLayout";

const Page2 = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const verify = useSelector((state) => state.user);

  const handleContinue = () => {
    if (!verify.loadingVerifyOTP) {
      navigate("/page3");
    }
  };

  const handleBackToPrevPage = () => {
    navigate(`/page1?chargerPointId=${localStorage.getItem("chargerPointId")}`);
  };

  return (
    <div>
      <Spin
        indicator={
          <div className="loader-container">
            <div className="loader "></div>
          </div>
        }
        fullscreen
        spinning={verify.loadingVerifyOTP}
      />
      <Layout
        title={
          <p
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "10px",
            }}>
            ระบบได้ส่งรหัส OTP ไปยังหมายเลขโทรศัพท์ของท่าน
          </p>
        }
        progressBarProps={{ currentStep: 2, totalSteps: 6 }}>
        <Card
          style={{
            border: "2px solid #60A5FA",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "100%",
            background: "#f5f6fa",
          }}>
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}>
            <OtpInputComponent
              value={otp}
              onChange={setOtp}
              onContinue={handleContinue}
              onBackToPrevPage={handleBackToPrevPage}
            />
          </div>
        </Card>
      </Layout>
    </div>
  );
};

export default Page2;
