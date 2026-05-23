import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, message } from 'antd'
import {
  DashboardOutlined, TeamOutlined, ShoppingOutlined, WalletOutlined,
  TrophyOutlined, CustomerServiceOutlined, SettingOutlined, LogoutOutlined,
} from '@ant-design/icons'
import api from '../api/axios'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/admin/bosses', icon: <TeamOutlined />, label: '老板名单' },
  { key: '/admin/companions', icon: <TrophyOutlined />, label: '陪玩名单' },
  { key: '/admin/orders', icon: <ShoppingOutlined />, label: '派单订单' },
  { key: '/admin/recharges', icon: <WalletOutlined />, label: '充值详情' },
  { key: '/admin/finance', icon: <WalletOutlined />, label: '财务工作台' },
  { key: '/admin/complaints', icon: <CustomerServiceOutlined />, label: '售后工作台' },
  { key: '/admin/system', icon: <SettingOutlined />, label: '系统配置' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    api.get('/auth/me').then((res: any) => {
      if (res.code === 0 || res.success) {
        setAdmin(res.data)
      } else {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }).catch(() => { localStorage.removeItem('token'); navigate('/login') })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    navigate('/login')
    message.success('已退出登录')
  }

  const userMenu = {
    items: [
      { key: 'profile', label: '个人信息' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
    ],
    onClick: ({ key }: any) => { if (key === 'logout') handleLogout() },
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={220}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, overflow: 'auto' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          ⚔ eSportClub
        </div>
        <Menu theme="dark" mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems} style={{ marginTop: 8 }}
          onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout style={{ marginLeft: 220 }}>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'flex-end',
          borderBottom: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Dropdown menu={userMenu} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar style={{ background: '#667eea' }}>{admin?.nickname?.[0] || 'A'}</Avatar>
              <span style={{ fontWeight: 500 }}>{admin?.nickname || admin?.username || '管理员'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, background: '#fff', borderRadius: 8, minHeight: 280, padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
