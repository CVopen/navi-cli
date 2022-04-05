import { addCommand } from '@/api/command'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Select, Space } from 'antd'
import React, { memo } from 'react'

interface ModalType {
  visible: boolean
  setVisble: (type: boolean) => void
  setList: Function
}

const defaultOptions = [
  { value: false, label: 'false' },
  { value: true, label: 'true' },
]

function index({ visible, setVisble }: ModalType) {
  const [form] = Form.useForm()

  const onOk = () => {
    getValue().then((res) => {
      addCommand(res).then((result) => {
        console.log(result)
      })
    })
  }

  const onCancel = () => {
    setVisble(false)
    form.resetFields()
  }

  const getValue = () => {
    return form.validateFields().then((result: any) => {
      if (result.option) {
        result.option = result.option.map(({ args, defaults, description }: any) => ({
          args: `-${args[0]}, --${args}`,
          defaults,
          description,
        }))
      }
      let cmd = result.name
      if (result.requiredParam) {
        cmd += ` <${result.requiredParam}>`
      }
      if (result.optionalParam) {
        cmd += ` [${result.optionalParam}]`
      }
      setVisble(false)
      return {
        cmd,
        ...result,
      }
    })
  }

  const validateEnglish = (_: any, value: string) => {
    if (/[^A-Za-z]/.test(value)) {
      return Promise.reject(new Error('必须为英文字符!'))
    }
    return Promise.resolve()
  }

  const paramValidate = (rule: any, value: string) => {
    if (!value) return Promise.resolve()
    const field = rule.field === 'requiredParam' ? 'optionalParam' : 'requiredParam'

    if (/[^A-Za-z]/.test(value)) {
      return Promise.reject(new Error('必须为英文字符!'))
    }
    if (form.getFieldValue(field) === value) {
      return Promise.reject(new Error('可选择参数和必选参数值不能相同!'))
    }
    return Promise.resolve()
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
        <Form.Item
          label="命令名称"
          name="name"
          rules={[{ required: true, message: '请输入命令名称!' }, { validator: validateEnglish }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="命令描述" name="description" rules={[{ required: true, message: '请输入命令描述!' }]}>
          <Input.TextArea maxLength={100} autoSize />
        </Form.Item>
        <Form.Item
          label="包名"
          name="packageName"
          rules={[{ required: true, message: '请输入包名!' }, { validator: validateEnglish }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="必选参数名" name="requiredParam" rules={[{ validator: paramValidate }]}>
          <Input />
        </Form.Item>
        <Form.Item label="可选参数名" name="optionalParam" rules={[{ validator: paramValidate }]}>
          <Input />
        </Form.Item>
        <Form.Item label="本地调试路径" name="targetPath">
          <Input />
        </Form.Item>
        <Form.List name="option">
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
                    style={{ width: 150 }}
                    rules={[{ required: true, message: '请输入命令参数' }, { validator: validateEnglish }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item key={'defaults' + field.key} name={[field.name, 'defaults']} style={{ width: 100 }}>
                    <Select options={defaultOptions} />
                  </Form.Item>
                  <Form.Item key={'description' + field.key} name={[field.name, 'description']} style={{ width: 240 }}>
                    <Input.TextArea maxLength={100} autoSize />
                  </Form.Item>
                  <Form.Item key={'btn' + field.key} style={{ width: 50 }} name={[field.name, 'btn']}>
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
