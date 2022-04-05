import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Space } from 'antd'
import React, { memo, useState } from 'react'

interface ModalType {
  visible: boolean
  setVisble: (type: boolean) => void
}

const defaultOptions = [
  { value: false, label: 'false' },
  { value: true, label: 'true' },
]

function index({ visible, setVisble }: ModalType) {
  const [form] = Form.useForm()
  const [packageValidate, setPackageValidate] = useState<'success' | 'error'>('success')

  const onOk = () => {
    getValue().then((res) => {})
  }

  const onCancel = () => {
    setVisble(false)
  }

  const getValue = () => {
    return form.validateFields().then((result: any) => {
      if (result.options) {
        result.options = result.options.map(({ args, defaults, description }: any) => ({
          args,
          defaults,
          description,
        }))
      }
      console.log('result', result)
      setVisble(false)
      return result
    })
  }

  return (
    <Modal title="添加命令" visible={visible} onOk={onOk} onCancel={onCancel} width={600}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item label="命令名称" name="name" rules={[{ required: true, message: '请输入命令名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="命令描述" name="description" rules={[{ required: true, message: '请输入命令描述!' }]}>
          <Input.TextArea maxLength={100} autoSize />
        </Form.Item>
        <Form.Item
          label="包名"
          name="packageName"
          rules={[{ required: true, message: '请输入包名!' }]}
          validateStatus={packageValidate}
        >
          <Input />
        </Form.Item>
        <Form.Item label="必选参数名" name="requiredParam">
          <Input />
        </Form.Item>
        <Form.Item label="可选参数名" name="optionalParam">
          <Input />
        </Form.Item>
        <Form.Item label="本地调试路径" name="targetPath">
          <Input />
        </Form.Item>
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {!fields.length && (
                <Form.Item name="bt" style={{ width: 200 }}>
                  <Button type="primary" onClick={add} block icon={<PlusOutlined />}>
                    Add sights
                  </Button>
                </Form.Item>
              )}
              {fields.map((field) => (
                <Space key={field.key}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'args']}
                    key={'args' + field.key}
                    style={{ width: 120 }}
                    rules={[{ required: true, message: '请输入命令参数' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item key={'defaults' + field.key} name={[field.name, 'defaults']} style={{ width: 120 }}>
                    <Select options={defaultOptions} />
                  </Form.Item>
                  <Form.Item key={'description' + field.key} name={[field.name, 'description']} style={{ width: 240 }}>
                    <Input.TextArea maxLength={100} autoSize />
                  </Form.Item>
                  <Form.Item key={'btn' + field.key} style={{ width: 60 }} name={[field.name, 'btn']}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <PlusOutlined style={{ cursor: 'pointer' }} onClick={() => add()} />
                      <MinusOutlined style={{ cursor: 'pointer' }} onClick={() => remove(field.name)} />
                    </div>
                  </Form.Item>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

export default memo(index)
