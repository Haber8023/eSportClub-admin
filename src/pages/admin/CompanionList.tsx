import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, message, Tag } from 'antd'
import { getCompanionList, changeCompanionStatus } from '../../api/companion'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: '在职', color: 'green' },
  leave: { label: '离职', color: 'gray' },
  vacation: { label: '请假', color: 'orange' },
  blacklisted: { label: '黑名单', color: 'red' },
}

const AUDIT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待审核', color: 'orange' },
  approved: { label: '已通过', color: 'green' },
  rejected: { label: '已驳回', color: 'red' },
}

export default function CompanionList() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const res: any = await getCompanionList()
      setData(res.data?.list || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const columns = [
    { title: '陪玩编号', dataIndex: 'companionNo', width: 120 },
    { title: '入职日期', dataIndex: 'hireDate', width: 120 },
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: '性别', dataIndex: 'gender', width: 80 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '微信号', dataIndex: 'wechat', width: 140 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => {
        const s = STATUS_MAP[v] || { label: v, color: 'default' }
        return <Tag color={s.color}>{s.label}</Tag>
      },
    },
    {
      title: '审核状态',
      dataIndex: 'statusAudit',
      width: 100,
      render: (v: string) => {
        const s = AUDIT_STATUS_MAP[v] || { label: v, color: 'default' }
        return <Tag color={s.color}>{s.label}</Tag>
      },
    },
    {
      title: '提成率',
      dataIndex: 'commissionRate',
      width: 80,
      render: (v: number) => `${(v * 100).toFixed(0)}%`,
    },
    {
      title: '订单收入',
      dataIndex: 'orderIncome',
      width: 120,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '操作',
      width: 160,
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => {
            // TODO: 详情展开
          }}>详情</Button>
          {record.status !== 'active' && (
            <Button size="small" type="primary" onClick={() =>
              changeCompanionStatus(record.id, 'active').then(() => loadData())
            }>在职</Button>
          )}
          {record.status !== 'leave' && (
            <Button size="small" onClick={() =>
              changeCompanionStatus(record.id, 'leave').then(() => loadData())
            }>离职</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>陪玩名单</h2>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />
    </div>
  )
}
