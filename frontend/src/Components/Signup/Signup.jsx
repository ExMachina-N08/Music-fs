import React from "react";
import { SpotifyFilled } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, InputNumber, message } from "antd";
import axiosInstance from "../../service";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    let formData = { ...values };
    const isArtistSignup = location.pathname === "/auth/artist/signup";
    const endpoint = isArtistSignup ? "/artist/register" : "/user/register";

    if (isArtistSignup) {
      formData.role = "artist";
    }

    try {
      const response = await axiosInstance.post(endpoint, formData);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        message.success("Account created successfully!");
        navigate("/auth/login");
      } else {
        message.error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message
      );
      message.error(
        "Error creating account. Please check your inputs or try again later."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4">
      <div className="bg-green-600 rounded-lg p-8 shadow-lg max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <SpotifyFilled style={{ fontSize: 60, color: "black" }} />
        </div>
        <h1 className="text-3xl font-bold text-center text-black mb-8">
          Signup to Music Apps
        </h1>
        <Form
          name="normal-signup"
          className="space-y-6"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-black">Email</span>}
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              className="rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Username</span>}
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              className="rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Name</span>}
            name="name"
            rules={[
              {
                required: true,
                message: "Please type in name you want to display!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              className="rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-500" />}
              className="rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Age</span>}
            name="age"
            rules={[
              {
                required: true,
                message: "Please input your age!",
                type: "number",
                min: 1,
              },
            ]}
          >
            <InputNumber min={1} className="w-full rounded" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="text-white"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md text-lg"
            >
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/auth/login" className="block text-center text-white">
              Already have an account? Login here
            </Link>
            <Link
              to="/auth/artist/signup"
              className="block text-center text-white"
            >
              Are you an artist? Signup here
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
