import { Card, Row, Col, Statistic } from 'antd'
import { TeamOutlined, TrophyOutlined, ShoppingOutlined, WalletOutlined } from '@ant-design/icons'

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>工作台</h2>
      <Row gutter={16}>
        {[
          { title: '老板总数', value: 0, icon: <TeamOutlined />, color: '#667eea' },
          { title: '陪玩总数', value: 0, icon: <TrophyOutlined />, color: '#764ba2' },
          { title: '今日订单', value: 0, icon: <ShoppingOutlined />, color: '#f5222d' },
          { title: '待结算金额', value: '¥0.00', icon: <WalletOutlined />, color: '#faad14' },
        ].map((item, i) => (
          <Col span={6} key={i}>
            <Card bordered={false} style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <Statistic title={item.title} value={item.value}
                prefix={<span style={{ color: item.color }}>{item.icon}</span>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
