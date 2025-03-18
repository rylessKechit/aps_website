import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { BookingProvider } from './context/BookingContext';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBookingButton from './components/layout/MobileBookingButton';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Styles
import './assets/styles/App.css';
import './assets/styles/animations.css';
import './assets/styles/vehiclesCard.css';
import './assets/styles/services.css';

function App() {
  return (
    <AppProvider>
      <BookingProvider>
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>
            <MobileBookingButton />
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AppProvider>
  );
}

export default App;