"use client";

import { Drawer, Form, Input, Button, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { getArena, updateArena } from "@/actions/arena";
import { CloseOutlined } from "@ant-design/icons";
import UploadCard from "./AddArena/UploadCard"; // Making reused component accessible

interface EditArenaDrawerProps {
  open: boolean;
  onClose: () => void;
  arenaId: string | null;
  onSuccess?: () => void;
}

export default function EditArenaDrawer({
  open,
  onClose,
  arenaId,
  onSuccess,
}: EditArenaDrawerProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (open && arenaId) {
      fetchArenaData(arenaId);
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [open, arenaId]);

  const fetchArenaData = async (id: string) => {
    try {
      setFetching(true);
      const data = await getArena(id);
      if (data) {
        form.setFieldsValue(data);
        if (data.cover_image_url) {
          setImageUrl(data.cover_image_url);
        }
      } else {
        message.error("Arena not found");
        onClose();
      }
    } catch (error) {
      console.error("Failed to fetch arena:", error);
      message.error("Failed to load arena details");
    } finally {
      setFetching(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!arenaId) return;

    try {
      setLoading(true);
      await updateArena(arenaId, {
        ...values,
        cover_image_url: imageUrl,
      });
      message.success("Arena updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update arena:", error);
      message.error("Failed to update arena");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="large"
      closeIcon={null}
      styles={{
        header: { display: "none" },
        body: { padding: 0, background: "#0a0e13" },
      }}
    >
      <div className="sticky top-0 z-10 bg-[#0a0e13] border-b border-[#2a3142] px-8 py-6 flex items-center justify-between">
        <h2 className="text-white text-2xl font-semibold">Edit Arena</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#252d3f] rounded-lg"
        >
          <CloseOutlined className="text-xl" />
        </button>
      </div>

      <div className="px-8 py-6">
        {fetching ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-5"
          >
            <Form.Item
              label={<span className="text-white">Arena name *</span>}
              name="name"
              rules={[{ required: true, message: "Please enter arena name" }]}
            >
              <Input className="dark-input" />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-white">Email</span>}
                name="contact_email"
              >
                <Input className="dark-input" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Phone</span>}
                name="contact_number"
              >
                <Input className="dark-input" />
              </Form.Item>
            </div>
            <Form.Item
              label={<span className="text-white">Address</span>}
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input className="dark-input" />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-white">City</span>}
                name="city"
                rules={[{ required: true }]}
              >
                <Input className="dark-input" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Country *</span>}
                name="country"
                rules={[{ required: true }]}
              >
                <Input className="dark-input" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <UploadCard 
                title="Arena image" 
                accept="image/*" 
                icon="camera"
                onUpload={setImageUrl}
                initialImage={imageUrl}
              />
            </div>
            <div className="flex justify-end pt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="px-8"
                loading={loading}
                disabled={loading}
              >
                Update
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Drawer>
  );
}
