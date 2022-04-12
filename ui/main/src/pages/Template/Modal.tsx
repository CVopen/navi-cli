import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Space } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import _ from 'lodash'

import { addTemplate, updateTemplate } from '@/api/template'

import { templateItem, Visible } from '.'

interface ModalType {
  visible: Visible
  setVisble: (type: Visible) => void
  setList: Function
  list: templateItem[]
  defaultValue?: any
  setActive: Function
}

function index({ visible, setVisble, setList, list, defaultValue, setActive }: ModalType) {
  const [form] = Form.useForm()

  const [defaultData, setDefault] = useState(_.cloneDeep(defaultValue))

  useEffect(() => {
    if (visible === 2) setDefault(_.cloneDeep(defaultValue))
  }, [visible])

  useEffect(() => {
    if (visible !== 2) return
    if (!defaultData.ignore || !defaultData.ignore.length) return form.setFieldsValue(defaultData)
    defaultData.ignore = defaultData.ignore.map((file: string) => ({ file }))
    form.setFieldsValue(defaultData)
  }, [defaultData])

  const onOk = () => {
    getValue().then((res) => {
      if (visible === 2) {
        const template = { ...res, id: defaultData.id }
        updateTemplate(template).then(() => {
          const index = list.findIndex(({ id }: templateItem) => id === template.id)
          list.splice(index, 1, template)
          setList([...list])
          setActive(template)
          setVisble(0)
          message.success('修改模板信息成功')
        })
      } else {
        addTemplate(res).then((id) => {
          res.id = id
          setList([...list, res])
          setVisble(0)
          form.resetFields()
          message.success('添加模板信息成功')
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
      if (result.ignore) {
        result.ignore = result.ignore.map(({ file }: any) => file)
      }
      return result
    })
  }

  return (
    <Modal
      title={`${visible === 2 ? '修改' : '添加'}模板信息`}
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
        <Form.Item label="描述" name="label" rules={[{ required: true, message: '请输入描述!' }]}>
          <Input.TextArea placeholder="包名描述" maxLength={30} autoSize />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
          <Input placeholder="npm 包名" />
        </Form.Item>
        <Form.List name="ignore">
          {(fields, { add, remove }) => (
            <>
              {!fields.length && (
                <Form.Item name="bt" style={{ width: 200 }}>
                  <Button type="primary" onClick={add} block icon={<PlusOutlined />}>
                    Add Template
                  </Button>
                </Form.Item>
              )}
              {fields.map((field) => (
                <Space key={field.key}>
                  <Form.Item {...field} name={[field.name, 'file']} key={'file' + field.key} style={{ width: 400 }}>
                    <Input placeholder="请输入glob规则" />
                  </Form.Item>
                  <Form.Item key={'btn' + field.key} style={{ width: 100 }} name={[field.name, 'btn']}>
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
