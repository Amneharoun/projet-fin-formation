import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tdebord from "./pages/Tdebord"
import Medicament from "./pages/Medicament"
import Layout from "./components/Layout";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Commandes from "./pages/Commandes";
import Factures from "./pages/Factures";
import Utilisateurs from "./pages/Utilisateurs";
import VerifyOtp from "./pages/VerifyOtp";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tdebord" element={<Tdebord />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOtp />} />
            <Route path="/medicament" element={<Medicament />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
};


export default App;


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/Onboarding" element={<Onboarding />} />
//         <Route path="/Verification" element={<Verification />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




