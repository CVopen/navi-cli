import { addCommand, updateCommand } from '@/api/command'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Select, Space } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { CommandItem, Visible } from '.'

import _ from 'lodash'

interface ModalType {
  visible: Visible
  setVisble: (type: Visible) => void
  setList: Function
  list: CommandItem[]
  defaultValue?: any
  setActive: Function
}

const defaultOptions = [
  { value: false, label: 'false' },
  { value: true, label: 'true' },
]

function index({ visible, setVisble, setList, list, defaultValue, setActive }: ModalType) {
  const [form] = Form.useForm()

  const [defaultData, setDefault] = useState(_.cloneDeep(defaultValue))

  useEffect(() => {
    if (visible === 2) setDefault(_.cloneDeep(defaultValue))
  }, [visible])

  useEffect(() => {
    if (visible !== 2) return
    console.log(defaultData)
    if (!defaultData.option || !defaultData.option.length) return form.setFieldsValue(defaultData)
    if (Array.isArray(defaultData.option[0])) {
      defaultData.option = defaultData.option.map((str: any) => {
        const option: {
          args: string
          defaults?: boolean
          description?: string
        } = { args: '' }
        option.args = str[0].match(/--(.*)/)[1]
        option.defaults = str[2]
        option.description = str[1]
        return option
      })
    } else {
      defaultData.option = [
        {
          args: defaultData.option[0].match(/--(.*)/)[1],
          defaults: defaultData.option[2],
          description: defaultData.option[1],
        },
      ]
    }
    form.setFieldsValue(defaultData)
  }, [defaultData])

  const onOk = () => {
    getValue().then((res) => {
      if (visible === 2) {
        const command = { ...res, id: defaultData.id }
        updateCommand(command).then(() => {
          const index = list.findIndex(({ id }: CommandItem) => id === command.id)
          list.splice(index, 1, command)
          setList([...list])
          setActive(command)
          message.success('修改命令成功')
          setVisble(0)
        })
      } else {
        addCommand(res).then((id) => {
          res.id = id
          setList([...list, res])
          setVisble(0)
          form.resetFields()
          message.success('添加命令成功')
        })
      }
    })
  }

  const onCancel = () => {
    setVisble(0)
    form.resetFields()
  }

  const getValue = () => {
    return form.validateFields().then((result: any) => {
      if (result.option) {
        result.option = result.option.map(({ args, defaults, description }: any) => [
          `-${args[0]}, --${args}`,
          description,
          defaults,
        ])
      }
      let cmd = result.name.trim()
      if (result.requiredParam) {
        cmd += ` <${result.requiredParam}>`
      }
      if (result.optionalParam) {
        cmd += ` [${result.optionalParam}]`
      }
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

  const validateRepeat = (_: any, value: string) => {
    if (visible === 2 && value === defaultData.name) {
      return Promise.resolve()
    }
    if (list.find(({ name }) => value === name) || ['init', 'vue', 'react', 'add', 'ui'].includes(value)) {
      return Promise.reject(new Error('重复命令!'))
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

  const optionValidate = (rule: any, value: string) => {
    const index = Number(rule.field.split('.')[1])
    return form.getFieldValue('option').find((item: any, i: number) => {
      if (index === i) return false
      return item.args === value
    })
      ? Promise.reject(new Error('命令选项不能重复!'))
      : Promise.resolve()
  }

  return (
    <Modal
      title={`${visible === 2 ? '修改' : '添加'}命令`}
      visible={!!visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
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
          rules={[{ required: true, message: '请输入命令名称!' }, { validator: validateRepeat }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="命令描述" name="description" rules={[{ required: true, message: '请输入命令描述!' }]}>
          <Input.TextArea maxLength={100} autoSize />
        </Form.Item>
        <Form.Item label="包名" name="packageName" rules={[{ required: true, message: '请输入包名!' }]}>
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
                    Add Option
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
                    rules={[
                      { required: true, message: '请输入命令参数' },
                      { validator: validateEnglish },
                      { validator: optionValidate },
                    ]}
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
