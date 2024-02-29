import * as React from "react";
import Image from "next/image";

// Example component definition
interface MyComponentProps {
  images: string[];
}

const Carousel = ({ images }: MyComponentProps) => {
  const defaultImage =
    "https://res.cloudinary.com/dif5glv4a/image/upload/v1708944527/cdgmbu9ede83ctoh2vlf.png";

  return (
    <div
      className="carousel carousel-center space-x-4 rounded-box border border-slate-300"
      style={{
        width: "50%", // Use 100% width for responsiveness
        height: "300px", // Set a fixed height for all images
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* v1709171109/events/yyy3qebdtlbztpix5kxl.png
      https://res.cloudinary.com/dif5glv4a/image/upload/v1709171109/events/yyy3qebdtlbztpix5kxl.png */}
      {images.length !== 0 ? (
        images.map((data, index) => (
          <Image
            key={index}
            title={data}
            className="carousel-item flex rounded-md object-contain"
            src={`https://res.cloudinary.com/dif5glv4a/image/upload/${data}`}
            alt="Organization Image"
            height={300}
            width={300}
            // https://res.cloudinary.com/dif5glv4a/image/upload/v1709170560/events/psusggknwua4yd8epprk.png
          />
        ))
      ) : (
        <Image
          className="carousel-item rounded-md object-contain"
          src={defaultImage}
          alt="Organization Image"
          height={300}
          width={800}
        />
      )}
    </div>
  );
};

export default Carousel;
