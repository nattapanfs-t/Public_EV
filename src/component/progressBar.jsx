import { Progress } from 'antd';

const conicColors = {
  '0%': '#87d068',
  '50%': '#ffe58f',
  '100%': '#ffccc7',
};

const ProgressBar = ({ currentStep, totalSteps }) => {
  const normalizedCurrentStep = Math.max(1, Math.min(currentStep, totalSteps));

  const progress = (((normalizedCurrentStep) / (totalSteps)) * 100).toFixed(1);

  return (
    <Progress percent={parseFloat(progress)} strokeColor={"#1677ff"} status="active" showInfo={false} />
  );
};

export default ProgressBar;
