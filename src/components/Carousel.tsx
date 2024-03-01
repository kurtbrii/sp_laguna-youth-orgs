import * as React from "react";
import Image from "next/image";
import vol2 from "../../public/images/vol2.png";

// Example component definition
interface MyComponentProps {
  images: string[];
}

const Carousel = ({ images }: MyComponentProps) => {
  const defaultImage =
    "https://res.cloudinary.com/dif5glv4a/image/upload/v1708944527/cdgmbu9ede83ctoh2vlf.png";

  return (
    <div
      className={`${images.length > 1 && "carousel carousel-center"}  space-x-4 rounded-box border border-slate-300`}
      style={{
        width: "40%",
        height: "248px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {images.length !== 0 ? (
        images.map((data, index) => (
          <Image
            key={index}
            title={data}
            className={`carousel-item flex rounded-sm ${images.length === 1 ? "w-full rounded-l-2xl object-cover" : "w-3/4 object-cover"} ${index === images.length - 1 && "rounded-r-2xl"}`}
            src={`https://res.cloudinary.com/dif5glv4a/image/upload/${data}`}
            alt="Organization Image"
            height={300}
            width={300}
          />
        ))
      ) : (
        <Image
          className="carousel-item rounded-2xl object-contain shadow-black"
          src={vol2}
          alt="Organization Image"
          height={300}
          width={800}
        />
      )}
    </div>
  );
};

export default Carousel;
