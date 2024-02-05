import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [otpId, setOtpId] = useState(null);
  const [referenceNo, setReferenceNo] = useState(null);
  const [packageId, setPackageId] = useState(null);

  const setUserIdAndContinue = (userId) => {
    setUserId(userId);
    localStorage.setItem('userId', userId);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const collectAllValuesToLocalStorage = () => {
    const allValues = {
      userId,
      mobile,
      otpId,
      referenceNo,
      packageId,
    };

    for (const key in allValues) {
      localStorage.setItem(key, allValues[key]);
    }
  };

  return (
    <AuthContext.Provider value={{
      userId,
      mobile,
      otpId,
      referenceNo,
      packageId,
      setUserId,
      setMobile,
      setUserIdAndContinue,
      setOtpId,
      setReferenceNo,
      setPackageId,
      collectAllValuesToLocalStorage,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
