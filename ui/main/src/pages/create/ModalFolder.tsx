import React, { ChangeEvent, memo, useEffect, useState } from 'react'
import { Button, Input, Modal } from 'antd'
import { FolderFilled } from '@ant-design/icons'
import { transformPath, validateFolderName } from '@/utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { getPathAsync } from '@/store/app'

interface ModalProps {
  isModalVisible: boolean
  setShow: (show: boolean) => void
}

function index({ isModalVisible, setShow }: ModalProps) {
  const [value, setValue] = useState('')

  const { createPath } = useAppSelector(({ app }) => app)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isModalVisible) setValue('')
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleCancel = () => {
    setShow(false)
  }

  const handleOk = () => {
    dispatch(getPathAsync({ path: transformPath([...createPath.path, value]), status: true }))
    setShow(false)
  }

  return (
    <Modal
      title="新建文件夹"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={
        <>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" disabled={validateFolderName(value)} onClick={handleOk}>
            创建
          </Button>
        </>
      }
    >
      <h3>文件夹名</h3>
      <Input value={value} onChange={onChange} prefix={<FolderFilled style={{ color: '#00141b' }} />} />
      <div style={{ color: '#e5e5e5' }}>你可以使用路径分隔符来创建嵌套的文件夹</div>
    </Modal>
  )
}

export default memo(index)
