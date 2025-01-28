import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-gray-900 fixed w-full z-50 border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-gold-500" />
            <span className="text-xl font-bold text-white">SmartHome</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/services" active={isActive('/services')}>Services</NavLink>
            <NavLink to="/about" active={isActive('/about')}>About</NavLink>
            <NavLink to="/blog" active={isActive('/blog')}>Blog</NavLink>
            <NavLink to="/contact" active={isActive('/contact')}>Contact</NavLink>
          </div>
          
          <Link 
            to="/contact" 
            className="hidden md:block bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-gray-800`}>
        <div className="px-4 py-2 space-y-2">
          <MobileNavLink to="/" active={isActive('/')}>Home</MobileNavLink>
          <MobileNavLink to="/services" active={isActive('/services')}>Services</MobileNavLink>
          <MobileNavLink to="/about" active={isActive('/about')}>About</MobileNavLink>
          <MobileNavLink to="/blog" active={isActive('/blog')}>Blog</MobileNavLink>
          <MobileNavLink to="/contact" active={isActive('/contact')}>Contact</MobileNavLink>
          <Link 
            to="/contact" 
            className="block w-full text-center bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      to={to}
      className={`${
        active 
          ? 'text-gold-500 font-semibold'
          : 'text-gray-300 hover:text-gold-500'
      } transition-colors`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      to={to}
      className={`block py-2 px-4 rounded ${
        active 
          ? 'bg-gray-700 text-gold-500'
          : 'text-gray-300 hover:bg-gray-700 hover:text-gold-500'
      } transition-colors`}
    >
      {children}
    </Link>
  );
}

export default Navbar;