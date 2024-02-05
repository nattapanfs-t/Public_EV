import "../App.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Card, Spin  } from "antd";
import { registerUser } from "../redux/slice/userSlice";
import { fetchStationDetails } from "../redux/slice/stationSlice";
import Layout from "../component/mainLayout";
import { useAuth } from "../authContext";
import Swal from "sweetalert2";

const Page1 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { stationData } = useSelector((state) => state.station);
  const station = useSelector((state)=>state.station);
  const register = useSelector((state)=> state.user);
  const { setMobile, setOtpId } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputPhoneNumber = async () => {
    try {
      if (!/^\d{10}$/.test(phoneNumber)) {
        Swal.fire({
          icon: "error",
          title: "ไม่ถูกต้อง",
          text: "หมายเลขโทรศัพท์ไม่ถูกต้อง",
        });
        return;
      }

      const action = await dispatch(registerUser(phoneNumber));
      console.log("Registration successful");

      const responseData = action.payload.data;
      if (responseData !== null) {
        const otpId = responseData.otpId;
        setMobile(phoneNumber);
        setOtpId(otpId);
        localStorage.setItem("mobile", phoneNumber);
        navigate("/page2");
      } else {
        Swal.fire({
          icon: "error",
          text: "หมายเลขโทรศัพท์ไม่ถูกต้อง",
        });
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    } 
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const chargerPointId = urlSearchParams.get("chargerPointId");
  
    const fetchData = async () => {
      if (chargerPointId) {
        localStorage.setItem("chargerPointId", chargerPointId);
        try {
          const response = await dispatch(fetchStationDetails(chargerPointId));
          if (response && response.payload === null) {
            Swal.fire({
              icon: "error",
              text: "กรุณาติดต่อผู้ดูแลระบบ",
              showConfirmButton: false,
              allowOutsideClick: false,
            });
          }
        } catch (error) {
          console.error("Error fetching station details:", error.message);
          throw error;
        }
      } else {
        Swal.fire({
          icon: "error",
          text: "กรุณาติดต่อผู้ดูแลระบบ",
          showConfirmButton: false,
          allowOutsideClick: false,
        });
      }
    };
    fetchData();
  }, [dispatch, location.search]);

  return (
    <div>
      <Spin
        indicator={
          <div className="loader-container">
            <div className="loader "></div>
          </div>
        }
        fullscreen
        spinning={station.loading || register.loadingRegister}
      />
        <Layout
          title={stationData?.station?.stationName}
          progressBarProps={{ currentStep: 1, totalSteps: 6 }}
        >
          <Card
            style={{
              border: "2px solid #60A5FA",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginBottom: "20px",
              backgroundColor: "#f5f6fa",
            }}
          >
            <div style={{ textAlign: "left", fontSize: "1.04em" }}>
              <p>
                <strong>ที่ตั้ง:</strong> {stationData?.station?.address}
              </p>
              <p>
                <strong>หมายเลขหัวชาร์จ:</strong>{" "}
                {stationData?.chargerPoint?.cnNo}
              </p>
              <p>
                <strong>ประเภทหัวชาร์จ:</strong>{" "}
                {stationData?.chargerPoint?.chargerPointType}
              </p>
              <p>
                <strong>สถานะหัวชาร์จ:</strong>{" "}
                {stationData?.chargerPoint?.cnStatus}
              </p>
              <ul style={{ paddingLeft: "20px" }}>
                {stationData?.chargerPoint?.availableConnectors?.map(
                  (connector, index) => (
                    <li key={index}>
                      {connector.type} - {connector.power} ({connector.status})
                    </li>
                  )
                )}
              </ul>
            </div>
          </Card>
          <Card
            style={{
              border: "2px solid #60A5FA",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <p
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                กรุณากรอกหมายเลขโทรศัพท์เพื่อรับ OTP:
              </p>
              <Input
                type="number"
                value={phoneNumber}
                onChange={(e) => {
                  const inputText = e.target.value;
                  const numericValue = inputText.replace(/\D/g, "");

                  if (numericValue.length <= 10) {
                    setPhoneNumber(numericValue);
                  }
                }}
                placeholder="กรอกหมายเลขโทรศัพท์"
                style={{
                  width: "100%",
                  boxShadow: "inset 3px 3px 8px #d4d3d3",
                  borderRadius: "30px",
                }}
              />

              <div
                style={{
                  marginTop: "15px",
                  marginBottom: "10px",
                  width: "100%",
                }}
              >
                <Button
                  type="primary"
                  onClick={handleInputPhoneNumber}
                  style={{ width: "100%" }}
                  disabled={phoneNumber.length !== 10}
                >
                  ขอรับ OTP
                </Button>
              </div>
            </div>
          </Card>
        </Layout>
    </div>
  );
};

export default Page1;
