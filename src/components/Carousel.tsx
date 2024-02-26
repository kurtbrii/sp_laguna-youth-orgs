import * as React from "react";
import Image from "next/image";
import "google.png";

// Example component definition
interface MyComponentProps {
  images: string[];
}

const Carousel = ({ images }: MyComponentProps) => {
  return (
    <div className="carousel carousel-center rounded-box max-w-md space-x-4 border border-slate-300">
      {images.length !== 0 ? (
        images.map((url, index) => (
          <Image
            key={index}
            className="carousel-item flex w-full rounded-md object-fill phone:w-1/3"
            src={url}
            alt="Organization Image"
            height={300}
            width={300}
            layout="responsive"
            style={{ width: "100%" }} // Add this line
          />
        ))
      ) : (
        <Image
          className="carousel-item flex w-full rounded-md object-fill phone:w-1/3"
          src={
            "https://res.cloudinary.com/dif5glv4a/image/upload/v1708944527/cdgmbu9ede83ctoh2vlf.png"
          }
          alt="Organization Image"
          height={300}
          width={300}
          layout="responsive"
          style={{ width: "100%" }} // Add this line
        />
      )}
    </div>
  );
};

// ...

export default Carousel;
