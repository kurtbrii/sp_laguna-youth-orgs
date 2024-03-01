/* eslint-disable @typescript-eslint/no-explicit-any */
import { CldUploadWidget } from "next-cloudinary";
import React from "react";

const UploadImage = ({ handleAddImages, string }: any) => {
  return (
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
        </div>

        <CldUploadWidget
          uploadPreset={
            string === "events"
              ? "fb3chpuf"
              : string === "activities"
                ? "cuzmdy9w"
                : ""
          }
          options={{
            sources: ["local", "camera", "google_drive", "url"],
            maxFiles: 4,
            folder: "events",
          }}
          onSuccess={async (response) => {
            // alert("Upload successful");
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const imageUrl = await response.info.path;
            handleAddImages(imageUrl);
            console.log(response);
          }}
        >
          {({ open }) => (
            <>
              <button
                className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
              >
                Upload an Image
              </button>

              {/* Add a delete button that triggers a delete function */}
            </>
          )}
        </CldUploadWidget>
      </label>
    </div>
  );
};

export default UploadImage;
