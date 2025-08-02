import React from 'react'
import Card from '../components/common/Card'

const UserList = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
      </div>
      
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500">User management component will be implemented here</p>
        </div>
      </Card>
    </div>
  )
}

export default UserList
