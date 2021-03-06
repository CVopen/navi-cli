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
          message: '????????????',
          description: `???'${transformPath(targetPath)}'????????????'${res.name.trim()}'??????, ???????????????: ${time}.`,
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
      title="???????????????"
      visible={isModalVisible}
      onCancel={handleCancel}
      forceRender
      footer={
        <>
          <Button onClick={handleCancel} icon={<CloseOutlined />}>
            ??? ???
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOk}>
            ??? ???
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="???????????????"
          required
          tooltip={{
            title: `????????????: ${transformPath(targetPath)}`,
            icon: <InfoCircleOutlined style={{ color: '#fff' }} />,
          }}
          rules={[
            {
              validator(_, value) {
                if (!value) return Promise.reject('????????????????????????!')
                if (validatePkg(value).errors) return Promise.reject('????????????????????????!')
                return Promise.resolve()
              },
            },
          ]}
          name="name"
        >
          <Input placeholder="???????????????" />
        </Form.Item>
        <div className="row-form-item">
          <Form.Item label="?????????git" valuePropName="checked" name="git">
            <Switch defaultChecked={true} />
          </Form.Item>
          <Form.Item label="??????????????????" valuePropName="checked" name="force">
            <Switch />
          </Form.Item>
        </div>
        <Form.Item
          label="????????????"
          tooltip={{ title: '??????????????????', icon: <InfoCircleOutlined style={{ color: '#fff' }} /> }}
          name="packageName"
          rules={[{ required: true, message: '?????????????????????!' }]}
        >
          <Select placeholder="???????????????" onChange={handleSelect}>
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
