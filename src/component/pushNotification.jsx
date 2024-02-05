import { useNotification } from 'react-web-notification';

const PushNotification = () => {
  const { showNotification } = useNotification();

  const handlePaymentSuccess = () => {
    showNotification('ชำระเงินสำเร็จ', {
      body: 'การชำระเงินเสร็จสมบูรณ์',
      icon: '/path/to/icon.png', 
    });
  };

  const handleChargingStart = () => {
    showNotification('เริ่มชาร์จ', {
      body: 'การชาร์จได้เริ่มขึ้น',
      icon: '/path/to/icon.png', 
      onClick: () => {
      },
    });
  };

  const handleChargingStop = () => {
    showNotification('หยุดชาร์จ', {
      body: 'การชาร์จถูกหยุด',
      icon: '/path/to/icon.png', 
    });
  };

  return { handlePaymentSuccess, handleChargingStart, handleChargingStop };
};

export default PushNotification;
