import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Set the API base URL, with a fallback for local development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const ImageUpload = () => {
  const [fileList, setFileList] = useState([]); // Store selected file list
  const navigate = useNavigate();

  // Get albumId and artistId from localStorage
  const albumData = JSON.parse(localStorage.getItem("albumData"));
  const artistId = albumData?.artistId;
  const albumId = albumData?.albumId;

  // Redirect if album data is missing
  if (!albumId || !artistId) {
    message.error("Album data is missing. Please upload an album first.");
    navigate("/upload"); // Redirect to upload page or other appropriate page
    return null; // Render nothing while redirecting
  }

  // Handle file change and keep only the latest selected file
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
        `${API_BASE_URL}/api/upload/cover`,
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
            maxCount={1} // Restrict to one file
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
