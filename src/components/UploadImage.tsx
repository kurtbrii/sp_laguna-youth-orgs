/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

interface UploadImageProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({
  images,
  onImagesChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | undefined>();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage("");
    const fileList = e.target.files;

    if (fileList !== null) {
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

      const newFiles: File[] = [];

      for (const file of fileList) {
        const fileType = file.type;

        if (validImageTypes.includes(fileType)) {
          newFiles.push(file);
        } else {
          setMessage("Only images are accepted");
        }
      }

      setFiles((prevFiles) =>
        prevFiles ? [...prevFiles, ...newFiles] : newFiles,
      );
      const fileNames = newFiles.map((file) => file.name);
      onImagesChange([...images, ...fileNames]);
    }
  };

  const removeImage = (fileName: string) => {
    setFiles((prevFiles) =>
      prevFiles ? prevFiles.filter((file) => file.name !== fileName) : [],
    );
    // onImagesChange([...images.filter((img) => img.name !== fileName)]);
  };

  return (
    <>
      <div className="flex items-center justify-center px-3">
        <div className="w-[360px] rounded-lg bg-gray-50 shadow-xl md:w-1/2">
          <div className="m-4">
            <span className="mb-1 flex items-center justify-center text-[12px] text-red-500">
              {message}
            </span>

            <div className="flex w-full items-center justify-center">
              <label className="flex h-32 w-full cursor-pointer flex-col rounded-md border-2 border-dashed hover:border-gray-300 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 group-hover:text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    Select a photo
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFile}
                  className="opacity-0"
                  multiple={true}
                  name="files[]"
                />
              </label>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file, key) => (
                <div key={key} className="relative overflow-hidden">
                  <IconButton
                    onClick={() => {
                      removeImage(file.name);
                    }}
                    className="mdi mdi-close absolute right-1 cursor-pointer hover:text-white"
                  >
                    <ClearIcon />
                  </IconButton>
                  <Image
                    title={file.name}
                    className="h-20 w-20 rounded-md"
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded file ${key}`}
                    width={20}
                    height={20}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* {files.map((file, key) => (
          <div key={key}>{file.name}</div>
        ))} */}
      </div>
    </>
  );
};

export default UploadImage;
