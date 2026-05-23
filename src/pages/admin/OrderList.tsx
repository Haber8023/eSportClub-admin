import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, DatePicker, Space, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getOrderList, createOrder, confirmOrder, rejectOrder } from '../../api/order'
import { getBossList } from '../../api/boss'
import { getCompanionList } from '../../api/companion'
import { getGameCategories, getDiscounts, getCommissionRates } from '../../api/dict'
import dayjs from 'dayjs'

const STATUS_MAP: Record<string, string> = {
  dispatched: '已派单',
  pending_confirm: '待验收',
  confirmed: '已验收',
  confirmed_error: '验收异常',
  settled: '已结算',
  cancelled: '已取消',
}

const GAME_OPTIONS = [
  { label: '三角洲', value: '三角洲' },
  { label: '瓦', value: '瓦' },
  { label: '英雄联盟', value: '英雄联盟' },
  { label: 'Steam', value: 'Steam' },
]

export default function OrderList() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [bosses, setBosses] = useState<any[]>([])
  const [companions, setCompanions] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<any[]>([])
  const [commissionRates, setCommissionRates] = useState<any[]>([])
  const [selectedBoss, setSelectedBoss] = useState<number>()
  const [selectedCompanion, setSelectedCompanion] = useState<number>()
  const [selectedGame, setSelectedGame] = useState<string>()
  const [unitPrice, setUnitPrice] = useState(0)
  const [extraFees, setExtraFees] = useState<number>(0)
  const [duration, setDuration] = useState<number>(1)
  const [selectedDiscount, setSelectedDiscount] = useState<number>(1)

  const loadData = async () => {
    setLoading(true)
    try {
      const res: any = await getOrderList()
      setData(res.data?.list || [])
    } finally { setLoading(false) }
  }

  useEffect(() => {
    loadData()
    getBossList().then((r: any) => setBosses(r.data?.list || []))
    getCompanionList().then((r: any) => setCompanions(r.data?.list || []))
    getDiscounts().then((r: any) => setDiscounts(r.data || []))
    getCommissionRates().then((r: any) => setCommissionRates(r.data || []))
  }, [])

  const orderTotal = (unitPrice + extraFees) * duration
  const discountedTotal = orderTotal * selectedDiscount
  const commissionRate = Number(form.getFieldValue('commissionRate')) || 0.8
  const companionIncome = discountedTotal * commissionRate

  const handleCreate = async (values: any) => {
    await createOrder({
      ...values,
      orderDate: values.orderDate?.format('YYYY-MM-DD'),
      orderTotal: +orderTotal.toFixed(2),
      discountedTotal: +discountedTotal.toFixed(2),
      companionIncome: +companionIncome.toFixed(2),
      shopIncome: +(discountedTotal - companionIncome).toFixed(2),
    })
    message.success('创建成功')
    setModalVisible(false)
    loadData()
  }

  const columns = [
    { title: '订单编号', dataIndex: 'orderNo', width: 160 },
    { title: '订单日期', dataIndex: 'orderDate', width: 120 },
    { title: '老板', dataIndex: 'bossNickname', width: 100 },
    { title: '陪玩', dataIndex: 'companionNickname', width: 100 },
    { title: '游戏', dataIndex: 'gameCategory', width: 100 },
    { title: '游戏项目', dataIndex: 'gameItem', width: 120 },
    {
      title: '订单总计',
      dataIndex: 'orderTotal',
      width: 120,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '折后总计',
      dataIndex: 'discountedTotal',
      width: 120,
      render: (v: number) => `¥${v?.toFixed(2) || '0.00'}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => STATUS_MAP[v] || v,
    },
    {
      title: '操作',
      width: 180,
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'pending_confirm' && (
            <>
              <Button size="small" type="primary" onClick={() => confirmOrder(record.id).then(() => loadData())}>
                验收
              </Button>
              <Button size="small" danger onClick={() => {
                const reason = prompt('请输入驳回原因')
                if (reason) rejectOrder(record.id, reason).then(() => loadData())
              }}>
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>派单订单</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          创建订单
        </Button>
      </div>

      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` }}
      />

      <Modal title="创建订单" open={modalVisible} onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()} width={700} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleCreate} initialValues={{ orderDate: dayjs() }}>
          <Form.Item name="orderDate" label="订单日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="bossId" label="老板" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择老板" showSearch
                onChange={(v) => setSelectedBoss(v)}>
                {bosses.map((b: any) => <Select.Option key={b.id} value={b.id}>{b.nickname}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="companionId" label="陪玩" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择陪玩" showSearch
                onChange={(v) => setSelectedCompanion(v)}>
                {companions.map((c: any) => <Select.Option key={c.id} value={c.id}>{c.nickname}</Select.Option>)}
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="gameCategory" label="游戏类别" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择游戏" onChange={(v) => setSelectedGame(v)}>
                {GAME_OPTIONS.map((g) => <Select.Option key={g.value} value={g.value}>{g.label}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="gameItem" label="游戏项目" style={{ flex: 1 }}>
              <Input placeholder="如：钻石段位" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="unitPrice" label="陪玩单价" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} step={10} style={{ width: '100%' }} onChange={(v) => setUnitPrice(v || 0)} />
            </Form.Item>
            <Form.Item name="duration" label="时长（小时）" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} onChange={(v) => setDuration(v || 1)} />
            </Form.Item>
            <Form.Item name="discount" label="折扣" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择折扣" onChange={(v) => setSelectedDiscount(v)}>
                {discounts.map((d: any) => <Select.Option key={d.id} value={d.value}>{d.value}折</Select.Option>)}
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="commissionRate" label="陪玩提成" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择提成率" onChange={(v) => form.setFieldValue('commissionRate', v)}>
                {commissionRates.map((c: any) => <Select.Option key={c.id} value={c.value}>{c.value*100}%</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="订单总计" style={{ flex: 1 }}>
              <Input value={`¥${orderTotal.toFixed(2)}`} disabled />
            </Form.Item>
            <Form.Item label="折后总计" style={{ flex: 1 }}>
              <Input value={`¥${discountedTotal.toFixed(2)}`} disabled />
            </Form.Item>
            <Form.Item label="陪玩收入" style={{ flex: 1 }}>
              <Input value={`¥${companionIncome.toFixed(2)}`} disabled />
            </Form.Item>
          </Space>
          <Form.Item name="csRemark" label="客服备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
