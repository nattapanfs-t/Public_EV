import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Row, Col } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../component/mainLayout";
import dayjs from "dayjs";
import { fetchChargerDetails } from "../redux/slice/chargerSlice";

const Page6 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chargerDetail = useSelector((state) => state.charger);
  const chargerData = chargerDetail.data || [];

  const handleClickFinish = () => {
    navigate("/last");
  };

  useEffect(() => {
    const chargerPointId = localStorage.getItem("chargerPointId");
    dispatch(fetchChargerDetails(chargerPointId));
  }, [dispatch]);

  return (
    <Layout
      title={
        <p style={{ fontWeight: "bold", marginBottom: "10px", margin: 0 }}>
          สรุปการใช้งาน
        </p>
      }
      progressBarProps={{ currentStep: 6, totalSteps: 6 }}>
       {Array.isArray(chargerData) && chargerData.map((charger) => (
          <Card
            key={charger.cpId}
            style={{
              border: "2px solid #60A5FA",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginBottom: "20px",
              backgroundColor: "#f5f6fa",
            }}>
            <Row
              gutter={[24, 6]}
              style={{
                fontSize: "32px",
                justifyContent: "start",
              }}>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ fontSize: "1rem" }}>
                <p>เวลาเริ่มการชาร์จ</p>
                <h2>{dayjs(charger.transStart).format("HH:mm:ss")}</h2>
                <p>ระยะเวลาที่ชาร์จ</p>
                <h2>{dayjs(charger.chargerCurrentTime, "HH:mm:ss").format("HH:mm:ss")}</h2>
                <p>เครดิตที่ใช้</p>
                <h2>{charger.chargerUseCredits}</h2>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ fontSize: "1rem" }}>
                <p>เวลาสิ้นสุดการชาร์จ</p>
                <h2>{dayjs(charger.transUpdate).format("HH:mm:ss")}</h2>
                <p>พลังงานที่ใช้ (kW)</p>
                <h2>{charger.chargerCurrentPower}</h2>
                <p>เครดิตคงเหลือ</p>
                <h2>{charger.chargerTotalCredits}</h2>
              </Col>
            </Row>
            <Row
              gutter={[16, 16]}
              style={{
                width: "90%",
                margin: "0 auto",
                paddingTop: "10px",
                justifyContent: "center",
              }}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Button
                  type="primary"
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                  onClick={handleClickFinish}>
                  เสร็จสิ้น
                </Button>
                {/* <Link to="/page7">
                  <button className="main-menu-button">
                    ขอใบกำกับภาษีแบบเต็ม
                  </button>
                </Link> */}
              </Col>
            </Row>
          </Card>
        ))}
    </Layout>
  );
};

export default Page6;
