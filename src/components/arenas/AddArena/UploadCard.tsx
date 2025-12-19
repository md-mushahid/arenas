'use client'

import { Upload, message } from 'antd'
import { CameraOutlined, VideoCameraOutlined, LoadingOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import type { UploadFile, UploadProps } from 'antd'
import { uploadImage } from '@/actions/upload'

interface UploadCardProps {
  title: string
  accept: string
  icon: 'camera' | 'video'
  onUpload?: (url: string) => void
  initialImage?: string
}

export default function UploadCard({ title, accept, icon, onUpload, initialImage }: UploadCardProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  // Initialize with existing image if provided
  useEffect(() => {
    if (initialImage) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: initialImage,
        },
      ])
    }
  }, [initialImage])

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadImage(formData)
      
      if (onSuccess) onSuccess('ok')
      if (onUpload) onUpload(result.url)
      message.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      if (onError) onError(new Error('Upload failed'))
      message.error('Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList,
    customRequest,
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
        {fileList.length < 1 && (
          <div className="flex flex-col items-center justify-center py-8">
            {loading ? (
              <LoadingOutlined className="text-gray-500 text-3xl mb-3" />
            ) : icon === 'camera' ? (
              <CameraOutlined className="text-gray-500 text-4xl mb-3" />
            ) : (
              <VideoCameraOutlined className="text-gray-500 text-4xl mb-3" />
            )}
            <p className="text-gray-400 text-xs text-center leading-relaxed">
              {loading ? 'Uploading...' : (
                <>
                  Add {icon === 'camera' ? 'photo' : 'video'} of<br />
                  320*180 pixels<br />
                  or more
                </>
              )}
            </p>
          </div>
        )}
      </Upload>
    </div>
  )
}

