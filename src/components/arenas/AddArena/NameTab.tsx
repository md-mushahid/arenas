'use client'

import { Button, Form, Input, Select } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import UploadCard from './UploadCard'

interface NameFormValues {
  arenaName: string
  email?: string
  phone?: string
  address: string
  city: string
  country: string
}

export default function NameTab({ onClose} : { onClose: () => void }) {
  const [form] = Form.useForm<NameFormValues>()

  const onFinish = (values: NameFormValues): void => {
    console.log(values)
    onClose()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-5"
    >
      <Form.Item
        label={<span className="text-white">Arena name *</span>}
        name="arenaName"
        rules={[{ required: true, message: 'Please enter arena name' }]}
      >
        <Input className="dark-input" />
      </Form.Item>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          label={<span className="text-white">eMail</span>}
          name="email"
        >
          <Input className="dark-input" />
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Phone</span>}
          name="phone"
        >
          <Input className="dark-input" />
        </Form.Item>
      </div>
      <Form.Item
        label={<span className="text-white">Adresse</span>}
        name="address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input
          prefix={<EnvironmentOutlined className="text-gray-400" />}
          className="dark-input"
        />
      </Form.Item>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          label={<span className="text-white">City</span>}
          name="city"
          initialValue="Sollentuna"
          rules={[{ required: true }]}
        >
          <Select className="dark-select">
            <Select.Option value="Sollentuna">Sollentuna</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Country *</span>}
          name="country"
          initialValue="Sweden"
          rules={[{ required: true }]}
        >
          <Select className="dark-select">
            <Select.Option value="Sweden">Sweden</Select.Option>
          </Select>
        </Form.Item>
      </div>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <UploadCard
          title="Arena image"
          accept="image/*"
          icon="camera"
        />
        <UploadCard
          title="Arena video"
          accept="video/*"
          icon="video"
        />
      </div>
      <div className="flex justify-end pt-6">
        <Button type="primary" htmlType="submit" className="px-8">
          Save
        </Button>
      </div>
    </Form>
  )
}
