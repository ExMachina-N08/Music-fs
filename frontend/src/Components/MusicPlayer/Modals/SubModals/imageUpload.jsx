import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ImageUpload = () => {
  const [fileList, setFileList] = useState([]); // Store selected file list
  const navigate = useNavigate();

  // Get albumId and artistId from localStorage
  const albumData = JSON.parse(localStorage.getItem("albumData"));
  const artistId = albumData?.artistId;
  const albumId = albumData?.albumId;

  // Handle file change and only keep the latest selected file
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Keep only the latest selected file
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!fileList.length) {
      return message.error("Please upload a cover image!");
    }

    const formData = new FormData();
    formData.append("coverImage", fileList[0].originFileObj); // Add the selected file
    formData.append("albumId", albumId); // Append albumId
    formData.append("artistId", artistId); // Append artistId

    try {
      // Make POST request to backend to upload the image
      const response = await axios.post(
        "http://localhost:8080/api/upload/cover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // If successful, navigate or give feedback
      message.success("Cover image uploaded successfully!");
      navigate("/success"); // Redirect to a success or album details page
    } catch (error) {
      console.error("Error uploading cover image:", error);
      message.error("Failed to upload cover image.");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Upload Album Cover Image</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item label="Album ID" hidden>
          <Input disabled value={albumId} />
        </Form.Item>

        <Form.Item label="Artist ID" hidden>
          <Input disabled value={artistId} />
        </Form.Item>

        {/* File Upload Field */}
        <Form.Item
          label="Cover Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
            fileList={fileList} // Show selected file in the upload component
            accept="image/*" // Restrict to image files
          >
            <Button icon={<UploadOutlined />}>Select Cover Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ImageUpload;
