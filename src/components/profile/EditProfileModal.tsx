"use client";

import { Modal, Form, Input, Button, message, Spin } from "antd";
import { useState, useEffect } from "react";
import { updateUser } from "@/actions/user";
import UploadCard from "@/components/arenas/AddArena/UploadCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // User object from useAuthState or useCurrentUser
  onSuccess?: () => void;
}

export default function EditProfileModal({
  open,
  onClose,
  user,
  onSuccess,
}: EditProfileModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { userInfo } = useCurrentUser(user);

  useEffect(() => {
    if (open && userInfo) {
      form.setFieldsValue({
        name: userInfo.name || user?.displayName,
        email: userInfo.email || user?.email,
        // Add other fields as needed
      });
      if (userInfo.photoURL || user?.photoURL) {
        setImageUrl(userInfo.photoURL || user?.photoURL);
      }
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [open, userInfo, user]);

  const onFinish = async (values: any) => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      await updateUser(user.uid, {
        name: values.name,
        photoURL: imageUrl,
      });
      message.success("Profile updated successfully");
      if (onSuccess) onSuccess();
      onClose();
      // Optional: Force reload to update context if not using strict state management for user
      // window.location.reload(); 
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Profile"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4 pt-4"
      >
        <div className="flex justify-center mb-6">
           <UploadCard 
                title="" 
                accept="image/*" 
                icon="camera"
                onUpload={setImageUrl}
                initialImage={imageUrl}
            />
        </div>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
        >
          <Input disabled />
        </Form.Item>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
