import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Spin } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import ProgressBar from "../component/progressBar";
import { selectChargerId } from "../redux/slice/stationSlice";
import { useAuth } from "../authContext";
import {
  makePayment,
  selectImageData,
  setImageData,
} from "../redux/slice/paymentSlice";
import { Notifications } from "react-push-notification";
import { usePackageContext } from "../packageContext";
import axios from "axios";

const Page4 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useAuth();
  const { selectedPackage } = usePackageContext();
  const payment = useSelector((state)=>state.payment);
  const packageId = localStorage.getItem("PackageId");
  const imageData = useSelector(selectImageData);
  const referenceNo = localStorage.getItem("referenceNo");
  const chargerPointId = localStorage.getItem("chargerPointId");
  const chargerId =
    useSelector(selectChargerId) || localStorage.getItem("chargerId");

  useEffect(() => {
    initializePushNotifications();
    const storedImageData = localStorage.getItem("imageData");
    if (storedImageData) {
      dispatch(setImageData(storedImageData));
      setImageData(storedImageData);
    }
  }, [dispatch]);

  useEffect(() => {
    if (imageData) {
      if (localStorage.getItem("imageData")) {
      }
      localStorage.setItem("imageData", imageData);
    }
  }, [imageData]);

  const URL = window.Configs.urlApi;

  const handleFinishPayment = async () => {
    try {
      const paymentData = {
        ReferenceNo: referenceNo,
        chargerId: chargerId,
        chargePointId: chargerPointId,
        PackageId: packageId,
        UserId: userId,
      };

      const response = await dispatch(makePayment(paymentData));

      if (response.payload && response.payload.status.statusCode === 200) {
        const responseData = response.payload.data;

        if (responseData.isPaid) {
          localStorage.setItem(
            "paymentData",
            JSON.stringify({
              referenceNo,
              packageId,
              selectedPackage,
              chargerId,
            })
          );
          localStorage.setItem("identityKey", responseData.identityKey);
          navigate("/page5");
        } else {
          await processPayment(responseData);
        }
      } else {
        console.error(
          "Payment failed with status code:",
          response?.payload?.status
        );
      }
    } catch (error) {
      console.error("Error during payment:", error.message);
    }
  };

  const processPayment = async (paymentData) => {
    try {
      let isPaid = false;

      while (!isPaid) {
        await new Promise((resolve) => setTimeout(resolve, 10000));

        const paymentStatusResponse = await axios.post(
          `${URL}/Payment/paid`,
          {},
          {
            headers: {
              Authorization: `Bearer ${paymentData.identityKey}`,
            },
          }
        );

        if (
          paymentStatusResponse &&
          paymentStatusResponse.data &&
          paymentStatusResponse.data.isPaid
        ) {
          console.log("Payment is successful:", paymentStatusResponse.data);
          isPaid = true;
          await handleEvChargerStart(paymentData);
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error.message);
    }
  };

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        subscribeToPush();
      }
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "yourServerPublicKey",
      });

      sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  };

  const sendSubscriptionToServer = async (subscription) => {
    // Implement logic to send the subscription to your server
  };

  const handleSaveQRCode = async () => {
    if (imageData) {
      const result = await Swal.fire({
        title: "บันทึก QR Code",
        text: "คุณต้องการบันทึก QR Code ใช่หรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่",
      });

      if (result.isConfirmed) {
        const canvas = document.createElement("canvas");
        const image = document.createElement("img");

        image.src = `data:image/png;base64,${imageData}`;

        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);

          const dataURL = canvas.toDataURL("image/png");

          const link = document.createElement("a");
          link.href = dataURL;
          link.download = "QR_Code.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      console.log("No image data received from the API");
    }
  };

  const fontSize = window.innerWidth < 576 ? "1.2rem" : "27px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
      <Spin
        indicator={
          <div className="loader-container">
            <div className="loader"></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <p
                style={{
                  marginLeft: "30px",
                  color: "white",
                  whiteSpace: "nowrap",
                }}>
                กำลังประมวลผลการชำระเงิน...
              </p>
            </div>
          </div>
        }
        fullscreen
        spinning={payment.paidLoading}
      />
      <ProgressBar currentStep={4} totalSteps={6} />
      <Card
        title={
          <h2
            style={{
              fontSize: fontSize,
              textAlign: "center",
              marginBottom: "10px",
            }}>
            กรุณาสแกน QR Code เพื่อชำระเงิน
          </h2>
        }
        style={{
          margin: "auto",
          maxWidth: "500px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        headStyle={{
          borderBottom: "3px solid #1677ff",
          padding: "0 16px",
          width: "100%",
        }}>
        <div>
          <div>
            {imageData ? (
              <img
                src={`data:image/png;base64,${imageData}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  borderRadius: "5px",
                }}
                alt="QR Code"
              />
            ) : (
              <p>No image data received from the API</p>
            )}
          </div>
        </div>
        <div style={{ marginTop: "10px", width: "100%" }}>
          <div style={{ marginBottom: "10px", textAlign: "center" }}>
            {selectedPackage && (
              <div>
                <h2 style={{ fontSize: "16px" }}>
                  {selectedPackage.packageName}
                </h2>
                <h2>฿ {selectedPackage.packagePrice} บาท</h2>
              </div>
            )}
            <button
              className="main-menu-button"
              style={{
                color: "#65A30D",
                fontSize: "15px",
                marginBottom: "10px",
              }}
              onClick={handleSaveQRCode}>
              <VerticalAlignBottomOutlined /> บันทึก QR Code
            </button>
          </div>
          <Notifications />
          <Button
            type="primary"
            onClick={handleFinishPayment}
            style={{ width: "100%" }}>
            เสร็จสิ้น
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Page4;
