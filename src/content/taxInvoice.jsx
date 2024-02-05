import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Checkbox,
  Button,
  Modal,
  Radio,
  Row,
  Col,
  Select,
} from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import Swal from "sweetalert2";
import Layout from "../component/mainLayout";
import { postTaxInvoice } from "../redux/slice/taxInvoiceSlice";

const Page7 = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [personType, setPersonType] = useState("individual");
  const [office, setOffice] = useState("headOffice");

  const handleCheckboxClick = () => {
    setVisible(true);
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields(); 
      dispatch(postTaxInvoice(values));
      handleSuccess();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleSuccess = () => {
    Swal.fire({
      title: "บันทึกข้อมูลเรียบร้อย",
      text: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/last");
      }
    });
  };


  const closeModal = () => {
    setVisible(false);
  };

  const branchSelection = () => {
    return (
      <Form.Item label="สำนักงานใหญ่">
        <Radio.Group onChange={(e) => setOffice(e.target.value)} value={office}>
          <Radio value="headOffice">ใช่</Radio>
          <Radio value="branch">ไม่</Radio>
        </Radio.Group>
      </Form.Item>
    );
  };

  const renderTaxInfoSection = () => {
    const taxInfoLabel =
      personType === "individual"
        ? "หมายเลขประจำตัวผู้เสียภาษี"
        : "รหัสประจำตัวผู้เสียภาษีนิติบุคคล";

    return (
      <>
        <h2>ข้อมูลภาษี</h2>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item name="TaxpayerNo">
              <Input
                placeholder={taxInfoLabel}
                style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item name="addressForTaxInvoice">
              <Select
                placeholder="ที่อยู่สำหรับออกใบกำกับภาษี"
                style={{ width: "100%", textAlign:"left", boxShadow: "inset 1px 1px 5px #d4d3d3" }}
                options={[{ value: "กรุงเทพมหานคร", label: "กรุงเทพมหานคร" }]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item name="CustomerAddress">
              <Input
                placeholder="รายละเอียดที่อยู่"
                style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item name="zipCode">
              <Input
                placeholder="รหัสไปรษณีย์"
                style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const renderLegalInfoSection = () => (
    <>
      {branchSelection()}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="CustomerName">
            <Input
              placeholder="ชื่อบริษัท"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="CustomerEmail">
            <Input
              placeholder="อีเมล"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="CustomerPhone">
            <Input
              placeholder="หมายเลขโทรศัพท์"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderBranchOffice = () => (
    <>
      {branchSelection()}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="CustomerName">
            <Input
              placeholder="ชื่อบริษัท"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="BranchName">
            <Input
              placeholder="ชื่อสาขา"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="BranchCode">
            <Input
              placeholder="รหัสประจำสาขา"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="CustomerEmail">
            <Input
              placeholder="อีเมล"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="CustomerPhone">
            <Input
              placeholder="หมายเลขโทรศัพท์"
              style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderIndividualInfoSection = () => (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Form.Item name="CustomerName">
          <Input
            placeholder="ชื่อ-นามสกุล"
            style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Form.Item name="CustomerEmail">
          <Input
            placeholder="อีเมล"
            style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Form.Item name="CustomerPhone">
          <Input
            placeholder="หมายเลขโทรศัพท์"
            style={{ boxShadow: "inset 1px 1px 5px #d4d3d3" }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Layout
      title={
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
          }}>
          ขอใบกำกับภาษีเต็มรูปแบบ
        </p>
      }>
      <Card
        style={{
          border: "2px solid #60A5FA",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          width: "100%",
          background: "#f5f6fa",
        }}>
        <h2>ข้อมูลเบื้องต้น</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConfirm}
          style={{ width: "100%", margin: "0 auto" }}>
          <Form.Item label="ประเภท">
            <Radio.Group
              onChange={(e) => setPersonType(e.target.value)}
              value={personType}>
              <Radio value="individual">บุคคลธรรมดา</Radio>
              <Radio value="legal">นิติบุคคล</Radio>
            </Radio.Group>
          </Form.Item>

          {personType === "legal" && office !== "branch" && (
            <Form.Item name="legalInfo">{renderLegalInfoSection()}</Form.Item>
          )}

          {office === "branch" && personType === "legal" && (
            <Form.Item name="branchOffice">{renderBranchOffice()}</Form.Item>
          )}

          {personType === "individual" && (
            <Form.Item name="individualInfo">
              {renderIndividualInfoSection()}
            </Form.Item>
          )}

          {renderTaxInfoSection()}

          <Form.Item>
            <Checkbox onChange={(e) => e.preventDefault()}>
              ยอมรับการเก็บข้อมูลส่วนบุคคล{" "}
              <span
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={handleCheckboxClick}>
                อ่านข้อตกลง
              </span>
            </Checkbox>
            <Modal open={visible} onCancel={closeModal} footer={null} centered>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  padding: "15px",
                  color: "#333",
                  width: "95%",
                  margin: "auto",
                  textAlign: "center",
                }}>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#333",
                    textShadow: "1px 1px 1px rgba(0, 0, 0, 0.3)",
                    marginBottom: "16px",
                    whiteSpace: "nowrap",
                  }}>
                  <InfoCircleFilled /> ข้อตกลงการเก็บข้อมูลส่วนบุคคล
                </h2>
                <p
                  style={{
                    marginBottom: "16px",
                    lineHeight: "1.5",
                    fontSize: "1.1rem",
                  }}>
                  <strong>ข้อตกลงที่ 1:</strong>{" "}
                  ........................................
                </p>
                <p
                  style={{
                    marginBottom: "16px",
                    lineHeight: "1.5",
                    fontSize: "1.1rem",
                  }}>
                  <strong>ข้อตกลงที่ 2:</strong>{" "}
                  ........................................
                </p>
                <p
                  style={{
                    marginBottom: "16px",
                    lineHeight: "1.5",
                    fontSize: "1.1rem",
                  }}>
                  <strong>ข้อตกลงที่ 3:</strong>{" "}
                  ........................................
                </p>
              </div>
            </Modal>
          </Form.Item>
          <Form.Item>
            <Checkbox>บันทึกข้อมูล</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default Page7;
