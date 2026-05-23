import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd'
import { getBossList, updateBoss } from '../../api/boss'

export default function BossList() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [current, setCurrent] = useState<any>(null)
  const [form] = Form.useForm()

  const loadData = async () => {
    setLoading(true)
    try {
      const res: any = await getBossList()
      setData(res.data?.list || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const columns = [
    { title: '老板编号', dataIndex: 'bossNo', width: 120 },
    { title: '注册日期', dataIndex: 'firstRechargeDate', width: 120 },
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: '性别', dataIndex: 'gender', width: 80 },
    { title: '联系微信', dataIndex: 'wechat', width: 140 },
    { title: '联系手机', dataIndex: 'phone', width: 130 },
    {
      title: '累计充值',
      dataIndex: 'totalRecharge',
      width: 120,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '累计赠送',
      dataIndex: 'totalGift',
      width: 100,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '累计消费',
      dataIndex: 'totalConsume',
      width: 100,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '剩余余额',
      dataIndex: 'balance',
      width: 120,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number) => v === 1 ? '启用' : '禁用',
    },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => {
          setCurrent(record)
          form.setFieldsValue(record)
          setDetailVisible(true)
        }}>详情</Button>
      ),
    },
  ]

  const handleUpdate = async (values: any) => {
    await updateBoss(current.id, values)
    message.success('更新成功')
    setDetailVisible(false)
    loadData()
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>老板名单</h2>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />

      <Modal title="老板详情" open={detailVisible} onCancel={() => setDetailVisible(false)}
        onOk={() => form.submit()} width={600} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="nickname" label="昵称" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="性别" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="male">男</Select.Option>
                <Select.Option value="female">女</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="wechat" label="联系微信" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="联系手机" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}
