import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, Space, message, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getRechargeList, createRecharge, confirmRecharge } from '../../api/recharge'
import { getBossList } from '../../api/boss'
import { getDiscounts } from '../../api/dict'
import dayjs from 'dayjs'

const TYPE_MAP: Record<string, string> = {
  new_card: '新客户开卡', old_recharge: '老客户续存', old_card: '老客户开卡',
}
const ACCOUNT_TYPE_MAP: Record<string, string> = {
  retail: '散户', silver: '银卡', gold: '金卡', diamond: '钻石卡',
}
const STATUS_MAP: Record<string, string> = {
  pending: '待确认', confirmed: '已确认', cancelled: '已取消',
}

export default function RechargeList() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [bosses, setBosses] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<any[]>([])
  const [rechargeType, setRechargeType] = useState<string>('new_card')

  const loadData = async () => {
    setLoading(true)
    try {
      const res: any = await getRechargeList()
      setData(res.data?.list || [])
    } finally { setLoading(false) }
  }

  useEffect(() => {
    loadData()
    getBossList().then((r: any) => setBosses(r.data?.list || []))
    getDiscounts().then((r: any) => setDiscounts(r.data || []))
  }, [])

  const handleCreate = async (values: any) => {
    await createRecharge({ ...values, type: rechargeType })
    message.success('创建成功')
    setModalVisible(false)
    loadData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '日期', dataIndex: 'createdAt', width: 120, render: (v: string) => v?.slice(0, 10) },
    { title: '老板', dataIndex: 'bossNickname', width: 120 },
    { title: '类型', dataIndex: 'type', width: 120, render: (v: string) => TYPE_MAP[v] || v },
    { title: '账户类型', dataIndex: 'accountType', width: 100, render: (v: string) => ACCOUNT_TYPE_MAP[v] || v },
    { title: '充值金额', dataIndex: 'rechargeAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2)}` },
    { title: '赠送金额', dataIndex: 'giftAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2)}` },
    { title: '折扣', dataIndex: 'discount', width: 80, render: (v: number) => v ? `${v}折` : '-' },
    { title: '状态', dataIndex: 'status', width: 100, render: (v: string) => STATUS_MAP[v] || v },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: any) => record.status === 'pending' ? (
        <Button size="small" type="primary" onClick={() => confirmRecharge(record.id).then(() => loadData())}>
          确认
        </Button>
      ) : null,
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>充值详情</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          充值/开卡
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />

      <Modal title="充值/开卡" open={modalVisible} onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()} width={700} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="操作类型">
            <Select value={rechargeType} onChange={(v) => setRechargeType(v)}>
              <Select.Option value="new_card">新客户开卡</Select.Option>
              <Select.Option value="old_recharge">老客户续存</Select.Option>
              <Select.Option value="old_card">老客户开卡</Select.Option>
            </Select>
          </Form.Item>
          {rechargeType === 'new_card' && (
            <>
              <Space style={{ width: '100%' }} size={16}>
                <Form.Item name="nickname" label="老板昵称" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
                <Form.Item name="gender" label="性别" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Select>
                    <Select.Option value="male">男</Select.Option>
                    <Select.Option value="female">女</Select.Option>
                  </Select>
                </Form.Option>
              </Space>
              <Space style={{ width: '100%' }} size={16}>
                <Form.Item name="wechat" label="联系微信" style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
                <Form.Item name="phone" label="联系手机" style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
              </Space>
            </>
          )}
          {rechargeType !== 'new_card' && (
            <Form.Item name="bossId" label="选择老板" rules={[{ required: true }]}>
              <Select placeholder="搜索老板" showSearch>
                {bosses.map((b: any) => <Select.Option key={b.id} value={b.id}>{b.nickname}</Select.Option>)}
              </Select>
            </Form.Item>
          )}
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="accountType" label="账户类型" style={{ flex: 1 }}>
              <Select placeholder="选择账户类型">
                <Select.Option value="retail">散户</Select.Option>
                <Select.Option value="silver">银卡</Select.Option>
                <Select.Option value="gold">金卡</Select.Option>
                <Select.Option value="diamond">钻石卡</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="discount" label="折扣" style={{ flex: 1 }}>
              <Select>
                {discounts.map((d: any) => <Select.Option key={d.id} value={d.value}>{d.value}折</Select.Option>)}
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="rechargeAmount" label="充值金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="giftAmount" label="赠送金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="paymentMethod" label="支付方式">
            <Select mode="multiple">
              <Select.Option value="alipay">支付宝</Select.Option>
              <Select.Option value="wechat">微信</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
