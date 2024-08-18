import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';

import MessagesPage from "./pages/MessagesPage";
import OrdersPage from "./pages/OrdersPage";


function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li><Link to="/messages">Messages</Link></li>
          <li><Link to="/orders">Orders</Link></li>
        </ul>
      </nav>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}


export default App;
