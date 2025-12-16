
"use client";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import UploadCard from "./UploadCard";
import { useAuthState } from "@/hooks/useAuthState";
import { auth } from "@/lib/firebaseConfig";

interface NameFormValues {
  name: string;
  contact_email?: string;
  contact_number?: string;
  address: string;
  city: string;
  country: string;
}

export default function NameTab({ onClose }: { onClose: () => void }) {
  const { user } = useAuthState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any): Promise<void> => {
    if (!user) {
      alert("You must be logged in to create an arena");
      return;
    }

    setLoading(true);

    try {
      // Get the user's ID token
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error("Failed to get authentication token");
      }

      // Send request to API
      const response = await fetch("/api/arena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: values.name,
          address: values.address,
          city: values.city,
          country: values.country,
          contact_email: values.contact_email,
          contact_number: values.contact_number,
          cover_image_url: "/images/image-1.jpg",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create arena");
      }

      alert("Arena created successfully!");
      form.resetFields();
      onClose();
      
      // Reload or navigate as needed
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating arena:", error);
      alert(error.message || "Failed to create arena");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        label={<span className="text-white">Adresse</span>}
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
        <UploadCard title="Arena image" accept="image/*" icon="camera" />
      </div>
      <div className="flex justify-end pt-6">
        <Button 
          type="primary" 
          htmlType="submit" 
          className="px-8"
          loading={loading}
          disabled={loading}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}