import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="navbar-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
        </svg>
      )
    },
    
    
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/login'
  }

  return (
    <>
      <nav className="admin-top-navbar">
        {/* Brand/Logo */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            QD
          </div>
          <h1 className="navbar-title">QuickDesk</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`navbar-nav-item ${location.pathname === item.href ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Profile Section */}
        <div className="navbar-profile">
          <div className="navbar-profile-info">
            <p className="navbar-profile-name">Admin User</p>
            <p className="navbar-profile-role">Administrator</p>
          </div>
          <div className="navbar-avatar" onClick={handleLogout} title="Logout">
            A
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`navbar-nav-item ${location.pathname === item.href ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="navbar-mobile-profile">
          <div className="navbar-avatar">A</div>
          <div>
            <p className="navbar-profile-name">Admin User</p>
            <p className="navbar-profile-role">Administrator</p>
          </div>
          <button 
            className="btn-secondary"
            onClick={handleLogout}
            style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default TopNavbar
