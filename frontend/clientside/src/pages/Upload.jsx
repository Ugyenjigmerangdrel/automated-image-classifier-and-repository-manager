import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";

const API_HEAD = import.meta.env.VITE_API;
const Upload = () => {
  const { userToken } = useAuth();
  // State to store uploaded files
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle loading

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    // Only accept image files and create a preview URL
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    setFiles((prevFiles) => [
      ...prevFiles,
      ...imageFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  };

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*", // Only accept image files
    multiple: true, // Allow multiple file uploads
  });

  // Clean up the created preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  // Handle file upload
  const handleUpload = async () => {
    setLoading(true); // Start loading spinner

    // Prepare form data to send files to the API
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      // Replace the URL with your actual API endpoint
      const response = await fetch(`${API_HEAD}/api/images/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        alert("Files uploaded successfully!");
        setFiles([]); // Clear the files after successful upload
      } else {
        alert("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="m-auto w-[80vw] h-[80vh] p-5">
      <h1 className="text-3xl mb-5">Upload</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${
          isDragActive ? "border-blue-400 bg-blue-100" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the files here...</p>
        ) : (
          <p className="text-gray-600">
            Drag & drop image files here, or click to select image files
          </p>
        )}
      </div>

      {/* Display uploaded files */}
      <div className="mt-5">
        {files.length > 0 && (
          <>
            <h2 className="text-2xl mb-3">Selected Files:</h2>
            <ul>
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center border-b pb-2 mb-2"
                >
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-16 h-16 mr-3 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Upload Button */}
            <div className="mt-5">
              <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L8 3.5 4 8V4a8 8 0 014-4z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;
