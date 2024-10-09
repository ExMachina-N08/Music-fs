import { Modal, Button, Form, Input } from "antd";
import React, { useContext, useState } from "react";
import { PlayerContext } from "../../../Context/PlayerContext";

const EditProfileModal = ({ isVisible, onClose }) => {
  const { setUsername, updateProfile } = useContext(PlayerContext);
  const [previewImage, setPreviewImage] = useState("");
  const [file, setFile] = useState(null);
  const [isImageReady, setImageReady] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setImageReady(true);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const onFinish = (values) => {
    const { name, password } = values.user;
    setUsername(name);
    localStorage.setItem("username", name);
    localStorage.setItem("password", btoa(password));
    if (previewImage && isImageReady) {
      localStorage.setItem("profileImage", previewImage);
    }
    updateProfile(name, previewImage);
    onClose();
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className="modal-custom"
      bodyStyle={{
        backgroundColor: "#1a1a1a",
        padding: 0,
      }}
      style={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <div className="bg-gray-800 p-5 rounded-lg text-white">
        <Form name="edit-profile" onFinish={onFinish} className="p-5 mt-4">
          <Form.Item label="Upload Image" className="text-white">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-gray-700 text-white"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100%", marginTop: 8 }}
                className="rounded-lg"
              />
            )}
          </Form.Item>
          <Form.Item
            name={["user", "name"]}
            label="Username"
            rules={[{ required: true }]}
          >
            <Input className="bg-gray-700 text-white" />
          </Form.Item>
          <Form.Item
            name={["user", "password"]}
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="bg-gray-700 text-white" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isImageReady && file}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
