"use client";
import React from "react";
import { Input, Select, Button, Form } from "antd";
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';

// --- Type Definition for Form Data ---
interface ContactFormValues {
  email: string;
  phone: string;
  club: string;
  team: string;
  about: string;
}

// --- Dummy Data for Select Fields ---
const clubOptions = [
  { value: "club_a", label: "Clubname A" },
  { value: "club_b", label: "Clubname B" },
  { value: "club_c", label: "Clubname C" },
];

const teamOptions = [
  { value: "team_x", label: "Teamname X" },
  { value: "team_y", label: "Teamname Y" },
  { value: "team_z", label: "Teamname Z" },
];

// --- Main Contact Form Component ---
const ContactUsForm: React.FC = () => {
  const [form] = Form.useForm();
  
  // This function will execute when the form passes validation
  const onFinish: FormProps<ContactFormValues>['onFinish'] = (values) => {
    console.log("Form Submitted:", values);
    // Future Logic: This is where you will add your API submission or state management logic.
  };

  return (
    // The inner container wrapper provides the background shown in your screenshot
    <div className="p-8 bg-[#10151C]"> 
      <h3 className="text-xl font-semibold mb-6 text-white">Contact form</h3>
      
      <Form
        form={form}
        name="contact_form"
        onFinish={onFinish}
        layout="vertical"
        className="space-y-6"
        // Ensure all labels are white
        labelCol={{ span: 24 }} 
        wrapperCol={{ span: 24 }}
      >
        {/* Row 1: Email and Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="email"
            label={<span className="text-white">Email *</span>}
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input 
              placeholder="Label" 
              // Use your custom CSS class for dark styling
              className="dark-input h-12"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-white">Phone Number</span>}
          >
            <Input 
              placeholder="Label" 
              className="dark-input h-12"
              prefix={<PhoneOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </div>

        {/* Row 2: Club and Team (Uses Select component) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="club"
            label={<span className="text-white">Club</span>}
          >
            <Select
              placeholder="Clubname"
              options={clubOptions}
              // Use your custom CSS class for dark styling
              className="dark-select h-12"
            />
          </Form.Item>

          <Form.Item
            name="team"
            label={<span className="text-white">Team</span>}
          >
            <Select
              placeholder="Teamname"
              options={teamOptions}
              className="dark-select h-12"
            />
          </Form.Item>
        </div>

        {/* Row 3: About Textarea */}
        <Form.Item
          name="about"
          label={<span className="text-white">About..</span>}
        >
          <Input.TextArea
            rows={6}
            placeholder="Type your message here..."
            className="dark-input" 
            style={{ minHeight: '150px' }} 
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="!mb-0">
          <Button
            type="primary"
            htmlType="submit"
            // Ensure w-full and custom dark button class is used
            className="w-full h-12 text-lg font-semibold ant-btn-primary" 
          >
            SEND
          </Button>
        </Form.Item>
      </Form>
      
      {/* Footer Text (Policy Links) */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        By submitting this, you agree to the <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-400 hover:underline">Cookie Policy</a>.
      </p>
    </div>
  );
};

export default ContactUsForm;