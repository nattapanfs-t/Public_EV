import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Page1 from "./content/mobileNumberInput";
import Page2 from "./content/otpVerify";
import Page3 from "./content/packagesSelect";
import Page4 from "./content/QRPayment";
import Page5 from "./content/chargingInfo";
import Page6 from "./content/chargingSumary";
import Page7 from "./content/taxInvoice";
import LastPage from "./content/lastPage";
import { AuthProvider } from "./authContext";
import { PackageProvider } from "./packageContext";
const App = () => {
  return (
    <AuthProvider>
      <PackageProvider>
        <Routes>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<Page4 />} />
          <Route path="/page5" element={<Page5 />} />
          <Route path="/page6" element={<Page6 />} />
          <Route path="/page7" element={<Page7 />} />
          <Route path="/last" element={<LastPage />} />
          <Route
            path="*"
            element={
              <Navigate to={`/page1?chargerPointId=${localStorage.getItem("chargerPointId")}`}/>}
          />
        </Routes>
      </PackageProvider>
    </AuthProvider>
  );
};

export default App;
