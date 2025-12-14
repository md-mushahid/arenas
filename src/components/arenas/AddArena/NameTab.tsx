"use client";
import { Button, Form, Input } from "antd";
import UploadCard from "./UploadCard";
import { useAuthState } from "@/hooks/useAuthState";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface NameFormValues {
  arenaName: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
}

export default function NameTab({ onClose }: { onClose: () => void }) {
  const { user } = useAuthState();
  const [form] = Form.useForm<NameFormValues>();
  const onFinish = async (values: NameFormValues): Promise<void> => {
    const arenaData = { ...values, uid: user?.uid, access: 'public', full: 1, seven: 0, rooms: 0, rating: 5 };
    const arenasCollection = collection(db, "arenas");
    await addDoc(arenasCollection, arenaData);
    window.location.reload();
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
        name="arenaName"
        rules={[{ required: true, message: "Please enter arena name" }]}
      >
        <Input className="dark-input" />
      </Form.Item>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          label={<span className="text-white">eMail</span>}
          name="email"
        >
          <Input className="dark-input" />
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Phone</span>}
          name="phone"
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
          rules={[{ required: true }]}
        >
          <Input className="dark-input" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <UploadCard title="Arena image" accept="image/*" icon="camera" />
      </div>
      <div className="flex justify-end pt-6">
        <Button type="primary" htmlType="submit" className="px-8">
          Save
        </Button>
      </div>
    </Form>
  );
}
