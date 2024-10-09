import { Modal, Button, Form, Input } from "antd";
import React, { useContext, useState } from "react";
import { PlayerContext } from "../../../Context/PlayerContext";
import { useAuth } from "../../../Context/AuthContext";
import EditProfileModal from "./EditProfileModal";
import axiosInstance from "../../../../service";
import "./profile.css";
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Profile = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { isProfileModalOpen, closeProfileModal } = useContext(PlayerContext);
  const [isLoginMode, setIsLoginMode] = useState(!isAuthenticated);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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
        login(userData, authToken, authRefreshToken);
        setIsLoginMode(false);
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    closeProfileModal();
  };

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
  };

  return (
    <>
      <Modal
        open={isProfileModalOpen}
        onCancel={closeProfileModal}
        footer={null}
        className="modal-custom"
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <div className="bg-gray-700 p-5 rounded-lg text-white">
          <Form
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            className="p-5 mt-4"
          >
            {isAuthenticated ? (
              <>
                {/* Display username and email above the logout button */}
                <div className="mb-4">
                  <p className="text-lg text-white font-bold">
                    Username: {user?.name}
                  </p>
                  <p className="text-sm text-gray-400">Email: {user?.email}</p>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="link"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-400 border-none"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                  <Input className="bg-gray-700 text-white" />
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
                  <Input.Password className="bg-gray-700 text-white" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isVisible={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
};

export default Profile;
