import validatePkg from 'validate-npm-package-name'
import { CloseOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select } from 'antd'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { store } from '@/store'
import { transformPath } from '@/utils'
import { createProject, getProjectSelect, getTemplateList } from '@/api'
import { templateItem } from '../Template'

interface ModalProps {
  isModalVisible: boolean
  setShow: (show: boolean) => void
}

interface ProjectInfo {
  message: string
  name: string
  tip: string
}

function index({ isModalVisible, setShow }: ModalProps) {
  const [form] = Form.useForm()

  const targetPath = transformPath(store.getState().app.createPath.path)

  const [list, setList] = useState<templateItem[]>([])
  const [projectList, setProjectList] = useState<ProjectInfo[]>([])

  useEffect(() => {
    if (isModalVisible) {
      getList()
    } else {
      form.resetFields()
      setProjectList([])
    }
  }, [isModalVisible])

  const handleOk = useCallback(() => {
    form.validateFields().then((res) => {
      const ignoreKeyList = ['name', 'packageName']
      const projectInfo = Object.keys(res).reduce((target, key) => {
        if (!ignoreKeyList.includes(key)) {
          target[key] = res[key]
        }
        return target
      }, {} as { [key: string]: string })
      projectInfo.projectName = res.name.trim()
      const params = {
        name: res.name.trim(),
        packageName: res.packageName,
        targetPath,
        projectInfo,
      }
      createProject(params)
    })
  }, [])

  const handleCancel = useCallback(() => setShow(false), [])

  const getList = useCallback(() => {
    getTemplateList().then((res) => setList(res as unknown as templateItem[]))
  }, [])

  const handleSelect = useCallback((name: string) => {
    const nameValue = form.getFieldValue('name')
    const packageName = form.getFieldValue('packageName')
    form.resetFields()
    form.setFieldsValue({ name: nameValue, packageName })
    getProjectSelect({ name }).then((res) => setProjectList(res as unknown as ProjectInfo[]))
  }, [])

  return (
    <Modal
      title="创建新项目"
      visible={isModalVisible}
      onCancel={handleCancel}
      forceRender
      footer={
        <>
          <Button onClick={handleCancel} icon={<CloseOutlined />}>
            取 消
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOk}>
            创 建
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="项目文件夹"
          required
          tooltip={{
            title: `创建位置: ${targetPath}`,
            icon: <InfoCircleOutlined style={{ color: '#fff' }} />,
          }}
          rules={[
            {
              validator(_, value) {
                if (!value) return Promise.reject('请输入项目文件夹!')
                if (validatePkg(value).errors) return Promise.reject('文件夹名称不合法!')
                return Promise.resolve()
              },
            },
          ]}
          name="name"
        >
          <Input placeholder="输入项目名" />
        </Form.Item>
        <Form.Item
          label="选择模板"
          tooltip={{ title: '选择对应模板', icon: <InfoCircleOutlined style={{ color: '#fff' }} /> }}
          name="packageName"
          rules={[{ required: true, message: '请选择对应模板!' }]}
        >
          <Select placeholder="请选择模板" onChange={handleSelect}>
            {list.map((item) => (
              <Select.Option key={item.id || item.name} value={item.name}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {projectList.map(({ message, tip, name }, index) => (
          <Form.Item
            key={new Date().getTime() + index}
            label={message}
            tooltip={{ title: tip, icon: <InfoCircleOutlined style={{ color: '#fff' }} /> }}
            rules={[{ required: true, message: tip }]}
            name={name}
          >
            <Input placeholder={tip} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}
export default memo(index)
