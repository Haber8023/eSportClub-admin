import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import api from '../../api/axios'

const { TextArea } = Input

export default function SystemConfig() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/admin/system-config').then((res: any) => {
      if (res.code === 0 || res.success) {
        form.setFieldsValue(res.data)
      }
    })
  }, [])

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      await api.put('/admin/system-config', values)
      message.success('保存成功')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统配置</h2>
      <Card title="站点信息">
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ maxWidth: 600 }}>
          <Form.Item name="siteName" label="站点名称">
            <Input />
          </Form.Item>
          <Form.Item name="siteTitle" label="主标题">
            <Input />
          </Form.Item>
          <Form.Item name="siteSubtitle" label="副标题">
            <Input />
          </Form.Item>
          <Form.Item name="welcomeMessage" label="欢迎语">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="copyright" label="版权声明">
            <Input />
          </Form.Item>
          <Form.Item name="icpInfo" label="备案信息">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>保存配置</Button>
        </Form>
      </Card>
    </div>
  )
}
