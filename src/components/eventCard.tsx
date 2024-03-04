import React from "react";
import Image from "next/image";
import vol1 from "public/images/vol2.png";
import Link from "next/link";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";

type EventCardProps = {
  event: EventProps["event"];
  searchText: string;
};

type EventProps = {
  event: {
    id: string;
    name: string;
    organizedBy: string;
    createdAt: Date;
    details: string;
    location: string;
    organizationId: string;
    organization: {
      user: {
        image: string | null;
      };
    };
    date: Date;
    images: string[];
  };
};

const EventCard: React.FC<EventCardProps> = ({ event, searchText }) => {
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(regex, '<span class="highlight">$1</span>'),
        }}
      />
    );
  };

  return (
    <Link
      href={`/homepage/event/${event.id}`}
      className="relative h-72 w-72 transform cursor-pointer flex-col overflow-hidden  rounded-md  object-fill  shadow-2xl  transition-transform  duration-300 hover:scale-105"
    >
      <style jsx global>{`
        .highlight {
          color: #00bd6e;
          font-weight: black;
        }
      `}</style>
      <Image
        src={
          event.images.length === 0
            ? vol1
            : `https://res.cloudinary.com/dif5glv4a/image/upload/${event.images[0]}`
        }
        className="left-0 top-0 h-2/5 w-full object-cover blur-[1px]"
        alt="sunset "
        width={100}
        height={100}
      />
      <div className="mx-4 mt-7 h-3/5 max-w-[300px] font-custom-lexend text-customBlack-100">
        <div className="flex">
          <p className="mb-2 overflow-hidden text-ellipsis  whitespace-nowrap font-custom-epilogue text-sm font-black text-primary">
            {highlightText(event.organizedBy.toLocaleUpperCase(), searchText)}
          </p>
        </div>
        <p className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap  text-sm font-bold">
          {highlightText(event.name, searchText)}
        </p>
        <div className=" flex items-center gap-1">
          <EventIcon className="h-4 w-4" />
          <p className=" italic" style={{ fontSize: "10px" }}>
            {event.date.toLocaleString()}
          </p>
        </div>
        <div className=" flex items-center gap-1 overflow-hidden  overflow-ellipsis  whitespace-nowrap text-sm ">
          <PlaceIcon className="h-4 w-4" />
          <p
            className="overflow-hidden text-ellipsis  whitespace-nowrap italic"
            style={{ fontSize: "10px" }}
          >
            {highlightText(event.location, searchText)}
          </p>
        </div>

        <hr className="my-1 flex  w-full border-t-2 border-customBlack-75" />
        <p className=" mb-8  overflow-hidden  overflow-ellipsis  whitespace-nowrap text-sm ">
          {highlightText(event.details, searchText)}
        </p>
      </div>

      <Image
        className="absolute left-4 top-20 rounded-md"
        src={`${event.organization.user.image}`}
        height={60}
        width={60}
        alt="user image role"
      />
    </Link>
  );
};

export default EventCard;
