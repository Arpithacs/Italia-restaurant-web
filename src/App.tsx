import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Menu from './components/Menu';
import OrderCustomization from './components/OrderCustomization';
import Cart from './components/Cart';
import SignUpLogin from './components/SignUpLogin';
import Contact from './components/Contact';
import Feedback from './components/Feedback';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-stone-50/20 text-stone-900">
            {/* Navigational Header */}
            <Header />

            {/* Main viewports wrapper */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/order/:id" element={<OrderCustomization />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signup" element={<SignUpLogin />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/order-history" element={<OrderHistory />} />
                
                {/* Fallback route handles */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Base footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
