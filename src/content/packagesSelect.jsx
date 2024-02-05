import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Spin, Button, Space, Avatar } from "antd";
import { useSpring, animated } from "react-spring";
import { useAuth } from "../authContext";
import { selectChargerId } from "../redux/slice/stationSlice";
import { generateQRCode } from "../redux/slice/paymentSlice";
import { fetchPackageDetails } from "../redux/slice/packageSlice";
import { fetchUnitPrices } from "../redux/slice/unitPriceSlice";
import { fetchCredit } from "../redux/slice/creditsSlice";
import ProgressBar from "../component/progressBar";
import { usePackageContext } from "../packageContext";
import Swal from "sweetalert2";

const Page3 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data, loading: packageLoading } = useSelector((state) => state.package);
  const { unitPricesData } = useSelector((state) => state.unitPrice);
  const { creditData } = useSelector((state) => state.credits);

  const { userId, setReferenceNo, setPackageId } = useAuth();
  const chargerId = useSelector(selectChargerId) || localStorage.getItem("chargerId");

  const { setSelectedPackage: contextSetSelectedPackage } = usePackageContext();

  useEffect(() => {
    dispatch(fetchPackageDetails());
    if (chargerId) {
      dispatch(fetchUnitPrices(chargerId));
    }
    if (userId) {
      dispatch(fetchCredit(userId));
    }
  }, [dispatch, chargerId, userId]);

  useEffect(() => {
    if (data) {
      const [selectedPackage] = data;
      contextSetSelectedPackage(selectedPackage);
    }
  }, [data, contextSetSelectedPackage]);

  const handleSelectAmount = (amount) => {
    setUserInput(amount);
  };

  const handleSelectPackage = async (packageId, selectedPrice, data) => {
    try {
      let price;

      if (data.isCustomized) {
        const selectedCustomized = data.packageCustomized.find(
          (customized) => customized.packagePrice === selectedPrice
        );
        price = selectedCustomized ? selectedCustomized.packagePrice : 0;
      } else {
        price = selectedPrice;
      }

      const confirmed = await Swal.fire({
        title: 'เลือกแพ็กเกจนี้',
        html: `คุณต้องการเลือกแพ็กเกจ ${data.packageName} <br /> ราคา ${price} บาท `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1677ff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
      });

      if (confirmed.isConfirmed) {
        setLoading(true);
        const packageDetailsAction = await dispatch(fetchPackageDetails());

        if (fetchPackageDetails.fulfilled.match(packageDetailsAction)) {
          const chargerPointId = localStorage.getItem('chargerPointId');

          const payload = {
            PackageId: packageId,
            PackagePrice: price,
            PackageCustomizedId: data.isCustomized ? "" : "",
            UserId: userId,
            ChargePointId: chargerPointId,
          };

          const generateQRCodeAction = await dispatch(generateQRCode(payload));
          const responseData = packageDetailsAction.payload.find(
            (pkg) => pkg.packageId === packageId
          );
          const referenceNo = generateQRCodeAction.payload.data.referenceNo;

          contextSetSelectedPackage({
            packageId,
            packageName: responseData?.packageName,
            packageDetail: responseData?.packageDetail,
            packagePrice: price,
          });

          setReferenceNo(referenceNo);
          setPackageId(packageId);
          localStorage.setItem('PackageId', packageId);
          localStorage.setItem('PackagePrice', price);
          localStorage.setItem('referenceNo', referenceNo);
          navigate('/page4');
        } else {
          console.error('Error fetching package details');
        }
      }
    } catch (error) {
      console.error('Error during Selected package:', error.message);
    }
  };


  const Number = ({ n }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 50,
      config: { mass: 0.5, tension: 15, friction: 5 },
    });
    return <animated.div>{number.to((n) => n.toFixed(2))}</animated.div>;
  };

  const TodayPriceDisplay = ({ value }) => (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "1.5em", marginBottom: "8px" }}>
        ราคาวันนี้ บาท/Kw
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Avatar
          src="/Image/plug.png"
          style={{
            width: "30px",
            height: "30px",
            marginRight: "8px",
            verticalAlign: "middle",
          }}
        />
        <span
          style={{
            color: "#3f8600",
            fontSize: "20px",
            verticalAlign: "middle",
          }}>
          {value}
        </span>
      </div>
    </div>
  );

  const RemainingCreditDisplay = ({ value }) => (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "1.5em", marginBottom: "8px" }}>เครดิตคงเหลือ</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Avatar
          src="/Image/save-money.png"
          style={{ width: "30px", height: "30px", marginRight: "8px" }}
        />
        <span
          style={{
            color: "rgb(96, 165, 250)",
            fontSize: "20px",
            display: "inline-block",
          }}>
          <Number n={value} />
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}>
      <Spin
        indicator={
          <div className="loader-container">
            <div className="loader "></div>
          </div>
        }
        fullscreen
        spinning={loading || packageLoading}
      />
      <ProgressBar currentStep={3} totalSteps={6} />
      <Card
        title={
          <h1 style={{ fontSize: "1.5em", margin: 0 }}>
            Package และ รายละเอียด
          </h1>
        }
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          width: "100%",
          marginTop: "16px",
        }}
        headStyle={{
          borderBottom: "3px solid #1677ff",
          padding: "0 16px",
        }}>
        <Row style={{ width: "100%" }}>
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ marginBottom: "16px" }}>
            <Card
              bordered={false}
              style={{
                border: "2px solid #60A5FA",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}>
              <TodayPriceDisplay
                value={<Number n={unitPricesData?.price || 0} />}
              />
            </Card>
          </Col>

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ marginBottom: "16px" }}>
            <Card
              bordered={false}
              style={{
                border: "2px solid #60A5FA",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}>
              <RemainingCreditDisplay
                value={creditData?.chargerTotalCredits || 0}
              />
            </Card>
          </Col>
        </Row>

        <Row style={{ margin: 0, width: "100%" }}>
          {data &&
            data.map((pkg) => (
              <Col
                key={pkg.packageId}
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={8}
                style={{ marginBottom: "16px" }}>
                <Card
                  style={{
                    backgroundColor: "#f5f6fa",
                    border: "2px solid #60A5FA",
                    height: "100%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                  headStyle={{
                    borderBottom: "2px solid #60A5FA",
                    padding: "0 16px",
                  }}>
                  {pkg.imageUrl && (
                    <img
                      src={pkg.imageUrl}
                      alt="Package Image"
                      onClick={() =>
                        handleSelectPackage(pkg.packageId, pkg.packagePrice, pkg)
                      }
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  )}
                  <h2>{pkg.packageName}</h2>
                  <h1>{pkg.packageDetail}</h1>
                  {pkg.isCustomized ? (
                    <div>
                      <h2>เลือกจำนวนเงินที่ท่านต้องการ</h2>
                      <Space
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          width: "100%",
                        }}>
                        {pkg.packageCustomized &&
                          [...pkg.packageCustomized]
                            .sort((a, b) => a.packagePrice - b.packagePrice)
                            .map((customized) => (
                              <div key={customized.packageCustomizedId}>
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    handleSelectAmount(customized.packagePrice)
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    fontSize: "1.05em",
                                    width: "100%",
                                  }}>
                                  {`${customized.packagePrice} ฿`}
                                </Button>
                              </div>
                            ))}
                        {/* <Input
                          type="number"
                          placeholder="กรุณาใส่จำนวนเงิน"
                          value={userInput}
                          onChange={handleUserInputChange}
                          style={{
                            width: "100%",
                            borderRadius: "20px",
                            fontSize: "1.05em",
                            boxShadow: "inset 3px 3px 8px #d4d3d3",
                          }}
                        /> */}
                      </Space>
                      <Button
                        type="primary"
                        onClick={() =>
                          handleSelectPackage(pkg.packageId, userInput, pkg)
                        }
                        style={{ marginTop: "22px", width: "100%" }}>
                        เลือกแพ็กเกจ
                      </Button>
                    </div>
                  ) : (
                    <button
                      className="main-menu-button"
                      style={{ color: "#65A30D" }}
                      onClick={() =>
                        handleSelectPackage(pkg.packageId, pkg.packagePrice, pkg)
                      }>
                      เลือกแพ็กเกจนี้
                    </button>
                  )}
                </Card>
              </Col>
            ))}
        </Row>
      </Card>
    </div>
  );
};

export default Page3;
