import React from "react";
import "./login.css";
import { SpotifyFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useAuth } from "../Context/AuthContext";
import axiosInstance from "../../service";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = response.data.user;
        const authToken = response.data.token;
        const authRefreshToken = response.data.refreshToken;

        await login(userData, authToken, authRefreshToken);
        navigate("/");
      } else {
        console.error("Login failed:", response.data.message);
        message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Error logging in. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-div">
      <SpotifyFilled style={{ fontSize: 60 }} />
      <h1>Log in to Music Apps</h1>
      <Form
        name="normal-login"
        variant="filled"
        className="login-form"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 700 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ span: 6 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ fontSize: 22 }}
          >
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/auth/signup">Signup Here</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
