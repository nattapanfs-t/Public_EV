import "../App.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Spin, Skeleton } from "antd";
import { fetchChargerDetails, stopCharger } from "../redux/slice/chargerSlice";
import Thunder from "../../Public/Image/thunder.png";
import { FieldTimeOutlined, ThunderboltFilled } from "@ant-design/icons";
import Layout from "../component/mainLayout";
import addNotification from "react-push-notification";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const Page5 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [notificationTriggered, setNotificationTriggered] = useState(false);
  const chargerDetail = useSelector((state) => state.charger);
  const { stationData } = useSelector((state) => state.station);
  const chargerPointId = localStorage.getItem("chargerPointId");

  const chargerData = chargerDetail.data || [];
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const shouldContinueFetching = useRef(true);

  const checkChargingStatus = async () => {
    try {
      const action = await dispatch(fetchChargerDetails(chargerPointId));
      const chargerDetail = action.payload;

      if (chargerDetail && chargerDetail.data.cnStatus === "charging") {
        setLoading(false);
        console.log("Here we go again");
        if (!notificationTriggered) {
          addNotification({
            title: "เริ่มการชาร์จ",
            native: true,
          });
          setNotificationTriggered(true);
        }

        shouldContinueFetching.current = true;
      } else if (chargerDetail && chargerDetail.data.cnStatus.trim().toLowerCase() === "finishing") {
        await handleStopCharging();
        navigate("/page6");
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching charger details:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const action = await dispatch(fetchChargerDetails(chargerPointId));
        console.log(action.payload.data.cnStatus);
        if (shouldContinueFetching.current) {
          checkChargingStatus();
        }
      } catch (error) {
        console.error("Error fetching initial charger details:", error);
      }
    };

    fetchData();

    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    intervalRef.current = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerIntervalRef.current);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch, chargerPointId]);

  const handleStopCharging = async () => {
    try {
      setLoading(true);

      clearInterval(timerIntervalRef.current);
      await dispatch(stopCharger(chargerPointId));
      addNotification({
        title: "เสร็จสิ้นการชาร์จ",
        native: true,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error stopping charging:", error);
      setLoading(false);
    }
  };

  dayjs.extend(customParseFormat);
  const customTimeFormat = (time, timer) =>
  dayjs(time, "HH:mm:ss").add(timer, "second").format("HH:mm:ss");

  const fontSize = window.innerWidth < 576 ? "1rem" : "1.8rem";
  return (
    <div>
      <Spin
        tip={
          chargerData?.[0]?.cnStatus?.trim().toLowerCase() === "available" ? (
            <p style={{ fontSize: "25px" }}>กำลังเตรียมพร้อม</p>
          ) : chargerData?.[0]?.cnStatus?.trim().toLowerCase() ===
            "charging" ? (
            <p style={{ fontSize: "25px" }}>Loading</p>
          ) : (
            <p style={{ fontSize: "25px" }}>ไม่พร้อมใช้งาน</p>
          )
        }
        indicator={
          <div className="loader-container" style={{ marginRight: "10px" }}>
            <div className="loader "></div>
          </div>
        }
        fullscreen
        spinning={loading}
      />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}>
          <Skeleton active paragraph={{ rows: 13 }} />
        </div>
      ) : (
        <Layout
          title={stationData?.station?.stationName}
          progressBarProps={{ currentStep: 5, totalSteps: 6 }}>
          {chargerData &&
            chargerData.length > 0 &&
            chargerData.map((charger) => (
              <Card
                key={charger.cpId}
                style={{
                  border: "2px solid #60A5FA",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  marginBottom: "20px",
                  backgroundColor: "#f5f6fa",
                }}>
                <div className="battery">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        zIndex: "1",
                      }}>
                      <img
                        src={Thunder}
                        style={{
                          width: "1.5rem",
                          height: "2rem",
                        }}
                      />
                      <h3
                        style={{
                          marginLeft: "0.5rem",
                          color: "#1677ff",
                          fontSize: fontSize,
                        }}>
                        {charger.chargerCurrentPower.toFixed(0)} kW
                      </h3>
                    </div>
                  </div>
                </div>
                {charger.cnStatus === "charging" ? (
                  <p style={{ fontSize: "25px", color: "#1677ff" }}>
                    กำลังชาร์จ...
                  </p>
                ) : charger.cnStatus === "finishing" ? (
                  <p style={{ fontSize: "25px", color: "#1677ff" }}>
                    เสร็จสิ้นการชาร์จ
                  </p>
                ) : (
                  <p style={{ fontSize: "25px", color: "#1677ff" }}>
                    ไม่พร้อมใช้งาน
                  </p>
                )}
                <div
                  style={{
                    borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                    paddingTop: "10px",
                  }}>
                  <h2 style={{ whiteSpace: "pre-line" }}>
                    <ThunderboltFilled style={{ color: "#FDE047" }} />{" "}
                    ชาร์จไปแล้ว{""}
                    {charger.chargerCurrentPower.toFixed(2)} kW
                    <ThunderboltFilled style={{ color: "#FDE047" }} />
                  </h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem",
                    borderTop: "1px solid",
                    borderColor: "rgba(0,0,0,0.2)",
                  }}>
                  <div
                    style={{
                      width: "100%",
                      borderColor: "rgba(0,0,0,0.2)",
                      fontSize: "0.95rem",
                    }}>
                    <p>
                      <FieldTimeOutlined /> เวลาเริ่มการชาร์จ
                    </p>
                    <h2>
                      {dayjs(charger.transStart).format("HH:mm:ss")}
                    </h2>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      borderLeft: "1px solid rgba(0,0,0,0.2)",
                      marginLeft: "-10px",
                      paddingLeft: "5px",
                      fontSize: "0.95rem",
                    }}>
                    <p>
                      <FieldTimeOutlined /> ระยะเวลาที่ชาร์จ
                    </p>
                    <h2>{customTimeFormat(charger.chargerCurrentTime, timer)}</h2>
                  </div>
                </div>
              </Card>
            ))}

          <div
            style={{
              marginTop: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}>
            <Button
              type="primary"
              onClick={handleStopCharging}
              disabled={loading}
              style={{ width: "100%", height: "35px" }}>
              หยุดการชาร์จ
            </Button>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Page5;
