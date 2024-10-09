import React from "react";
import { SpotifyFilled } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Removed json
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, InputNumber } from "antd"; // Removed ConfigProvider
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function called on form submission success
  const onFinish = (values) => {
    console.log("Success:", values);

    // Create formData object from values
    let formData = { ...values };

    // Check if the path is "/artist/signup" and set the role to "artist"
    if (location.pathname === "/auth/artist/signup") {
      formData = { ...formData, role: "artist" }; // Add role to formData for artists

      axios
        .post("http://localhost:8080/api/artist/register", formData)
        .then((response) => {
          console.log("Artist created successfully");
          localStorage.setItem("userData", JSON.stringify(formData));
          navigate("/auth/login");
        })
        .catch((error) => {
          console.error("Error creating artist:", error);
        });

      return; // Prevent further execution if the artist API call is made
    }

    // Regular user registration
    axios
      .post("http://localhost:8080/api/user/register", formData)
      .then((response) => {
        console.log("Account created successfully");
        localStorage.setItem("userData", JSON.stringify(formData));
        navigate("/auth/login");
      })
      .catch((error) => {
        console.error("Error creating account:", error);
      });
  };

  // Function called on form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-div">
      <SpotifyFilled style={{ fontSize: 60 }} />
      <h1>Signup to Music Apps </h1>
      <Form
        name="normal-login"
        variant="filled"
        className="login-form"
        layout="vertical"
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: 700,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please type in name you want to display!",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            {
              required: true,
              message: "Please input your age!",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            span: 6,
          }}
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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
