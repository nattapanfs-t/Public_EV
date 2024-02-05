import React, { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { Input, Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { verifyOTP } from "../redux/slice/userSlice";
import Swal from "sweetalert2";

const OtpInputComponent = ({
  value: propValue,
  onChange,
  onContinue,
  onBackToPrevPage,
  placeholder,
}) => {
  const [countdown, setCountdown] = useState(90);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const { mobile, setUserId, setUserIdAndContinue } = useAuth();
  const otpId = useSelector((state) => state.user.otpId);
  const dispatch = useDispatch();

  const handleChange = (otp) => {
    const numericValue = otp.replace(/\D/g, "");
    if (onChange) {
      onChange(numericValue);
    }
  };

  const handleResendOTP = () => {
    if (!isButtonDisabled) {
      setCountdown(90);
      setIsButtonDisabled(true);
      setIsCountdownActive(true);
      onChange("");
    }
  };

  const startCountdown = () => {
    setIsButtonDisabled(true);
    setIsCountdownActive(true);

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(intervalId);
          setIsButtonDisabled(false);
          setIsCountdownActive(false);
          return 90;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isCountdownActive) {
      startCountdown();
    }
  }, [isCountdownActive]);

  useEffect(() => {
    if (isButtonDisabled && countdown > 0) {
      const timeoutId = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isButtonDisabled, countdown]);

  useEffect(() => {
    if (isButtonDisabled && countdown === 0) {
      setIsButtonDisabled(false);
    }
  }, [countdown, isButtonDisabled]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleVerifyOTP = async () => {
    try {
      if (!otpId) {
        console.error("OTP ID is undefined");
        return;
      }

      const action = await dispatch(
        verifyOTP({
          otpId,
          otpCode: propValue,
          mobile,
        })
      );

      if (verifyOTP.fulfilled.match(action)) {
        const responseData = action.payload.data;

        if (responseData) {
          const { isErrorCount, isExprCode, result, userId } = responseData;
          if (isErrorCount) {
            Swal.fire({
              icon: "error",
              title: "หมดเวลาการใช้งาน",
              text: "กรุณาขอ OTP ใหม่",
            });
          } else if (isExprCode) {
            Swal.fire({
              icon: "error",
              title: "ไม่ถูกต้อง",
              html: `รหัส OTP ไม่ถูกต้องครบจำนวน<br />กรุณาขอ OTP ใหม่`,
            });
          } else if (!result) {
            Swal.fire({
              icon: "error",
              title: "ไม่ถูกต้อง",
              text: "รหัส OTP ไม่ถูกต้องกรุณากรอกใหม่อีกครั้ง",
            });
          } else {
            localStorage.setItem("userId", userId);
            console.log("OTP verification success");
            console.log("UserId :", userId);
            setUserIdAndContinue(userId);
            onContinue();
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "รหัสOTPไม่ถูกต้องกรุณากรอกใหม่อีกครั้ง",
          });
        }
      }
    } catch (error) {
      console.error("รหัสOTPไม่ถูกต้องกรุณากรอกใหม่อีกครั้ง", error);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        margin: "auto",
        maxWidth: "100%",
        borderBottom: "",
      }}>
      <p style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "10px" }}>
        กรุณากรอกรหัส OTP:
      </p>
      <div
        style={{
          maxWidth: "300px",
          borderRadius: "15px",
          overflow: "hidden",
          margin: "auto",
        }}>
        <OTPInput
          value={propValue}
          onChange={handleChange}
          numInputs={6}
          separator={
            <span style={{ margin: "0 5px", fontSize: "1.5rem" }}>-</span>
          }
          containerStyle="otp-input-container"
          inputStyle="otp-input"
          isInputNum
          shouldAutoFocus
          placeholder={placeholder}
          renderInput={(inputProps) => (
            <Input
              {...inputProps}
              type="number"
              style={{
                width: "40px",
                height: "40px",
                fontSize: "1rem",
                textAlign: "center",
                margin: "0 5px",
                borderRadius: "10px",
                border: "1px solid #d4d3d3",
                boxShadow: "inset 1px 1px 5px #d4d3d3",
              }}
            />
          )}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}>
          <Button
            type="primary"
            onClick={handleVerifyOTP}
            disabled={propValue.length !== 6}
            style={{ width: "48%", borderRadius: "6px" }}>
            ยืนยัน
          </Button>
          <Button
            type="primary"
            onClick={onBackToPrevPage}
            style={{
              backgroundColor: "#A8A29E",
              width: "48%",
              borderRadius: "6px",
              marginBottom: "5px",
            }}>
            <RollbackOutlined /> ย้อนกลับ
          </Button>
        </div>
      </div>
      <p style={{ margin: "0", marginTop: "5px" }}>ไม่ได้รับรหัสOTP?</p>
      <span
        style={{
          cursor: "pointer",
          color: "#A8A29E",
          fontSize: "1rem",
          display: "inline-block",
          marginBottom: "5px",
        }}
        onClick={handleResendOTP}
        disabled={isButtonDisabled}>
        {isButtonDisabled
          ? `ขอรหัส OTP อีกครั้งใน (${countdown}s)`
          : "ขอรหัส OTP ใหม่"}
      </span>
    </div>
  );
};

export default OtpInputComponent;
