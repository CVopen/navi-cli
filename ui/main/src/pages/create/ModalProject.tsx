import validatePkg from 'validate-npm-package-name'
import { CloseOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, notification, Select, Switch } from 'antd'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { formatDate, transformPath } from '@/utils'
import { createProject, getProjectSelect, getTemplateList } from '@/api'
import { templateItem } from '../Template'
import { getPathAsync } from '@/store/app'
import { useNavigate } from 'react-router-dom'

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

  const targetPath = useAppSelector(({ app }) => app.createPath.path)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
        git: res.git,
        force: res.force,
        targetPath: transformPath(targetPath),
        projectInfo,
      }
      createProject(params).then((time) => {
        dispatch(getPathAsync({ path: transformPath(targetPath) }))
        navigate(`/project?local=${transformPath([...targetPath, res.name.trim()])}`)
        time = formatDate(time)
        notification.success({
          message: '创建成功',
          description: `在'${transformPath(targetPath)}'创建项目'${res.name.trim()}'成功, 创建时间为: ${time}.`,
        })
      })
    })
  }, [targetPath])

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
            title: `创建位置: ${transformPath(targetPath)}`,
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
        <div className="row-form-item">
          <Form.Item label="初始化git" valuePropName="checked" name="git">
            <Switch defaultChecked={true} />
          </Form.Item>
          <Form.Item label="强制创建项目" valuePropName="checked" name="force">
            <Switch />
          </Form.Item>
        </div>
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
