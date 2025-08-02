import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNavbar from './TopNavbar'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <TopNavbar />
      
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
