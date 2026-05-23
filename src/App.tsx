import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import OrderList from './pages/admin/OrderList'
import BossList from './pages/admin/BossList'
import CompanionList from './pages/admin/CompanionList'
import RechargeList from './pages/admin/RechargeList'
import SystemConfig from './pages/admin/SystemConfig'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="bosses" element={<BossList />} />
        <Route path="companions" element={<CompanionList />} />
        <Route path="recharges" element={<RechargeList />} />
        <Route path="system" element={<SystemConfig />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  )
}

export default App
