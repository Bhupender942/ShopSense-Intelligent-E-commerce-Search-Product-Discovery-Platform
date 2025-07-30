"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, ImageIcon, X, Loader2 } from "lucide-react";
import { useImageSearch } from "@/hooks/use-image-search";

interface ImageSearchProps {
  onSearchComplete: (products: any[], uploadedImage: string | null) => void;
  category?: string;
}

const ImageSearch: React.FC<ImageSearchProps> = ({
  onSearchComplete,
  category,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, searchByImage } = useImageSearch();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if the file is an image
    if (!file.type.match(/^image\/(jpeg|png|gif|webp|jpg)$/)) {
      alert("Please upload an image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFile(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearchClick = async () => {
    if (!file) {
      console.error("No file selected for image search");
      return;
    }

    try {
      console.log("Initiating image search with file:", file.name);
      const result = await searchByImage(file, category);

      // The hook will update the search results state
      // Notify the parent component with the results
      if (onSearchComplete) {
        console.log("Calling onSearchComplete with results");
        onSearchComplete(result?.products || [], result?.uploadedImage || null);
      }
    } catch (error) {
      console.error("Image search error:", error);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Search by Image</h3>
        <p className="text-sm text-gray-600">
          Upload an image to find similar products
        </p>
      </div>

      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()} // Make entire area clickable
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-800">
                Upload an image
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop an image here, or click to select
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCameraCapture();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain bg-gray-100"
            />

            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSearchClick}
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center space-x-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  <span>Search with this Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
