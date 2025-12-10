'use client'

import { Upload } from 'antd'
import { CameraOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { UploadFile, UploadProps } from 'antd'

interface UploadCardProps {
  title: string
  accept: string
  icon: 'camera' | 'video'
}

export default function UploadCard({ title, accept, icon }: UploadCardProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    maxCount: 1,
    accept,
  }

  return (
    <div>
      <label className="block text-gray-300 text-sm mb-3">{title}</label>
      <Upload {...uploadProps} className="arena-upload">
        {fileList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            {icon === 'camera' ? (
              <CameraOutlined className="text-gray-500 text-4xl mb-3" />
            ) : (
              <VideoCameraOutlined className="text-gray-500 text-4xl mb-3" />
            )}
            <p className="text-gray-400 text-xs text-center leading-relaxed">
              Add {icon === 'camera' ? 'photo' : 'video'} of<br />
              320*180 pixels<br />
              or more
            </p>
          </div>
        )}
      </Upload>
    </div>
  )
}

