import React from "react";
import Image from "next/image";
import vol1 from "../../assets/vol1.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Organization, type User } from "@prisma/client";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";

// type Organization = {
//   id: string;
//   orgName: string | null;
//   phoneNumber: string | null;
//   bio: string | null;
//   mission: string | null;
//   vision: string | null;
//   objectives: string | null;
//   userId: string;
//   user: {
//     image: string;

//   };
// };

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
  };
};

const EventCard = ({ event }: EventProps) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const { formattedDate, formattedTime } = getDate(event.date);

  return (
    <Link
      href={`/homepage/event/${event.id}`}
      className=" relative h-72 w-72  cursor-pointer  flex-col  overflow-hidden  rounded-md  object-fill shadow-2xl"
    >
      <Image
        src={vol1}
        className="left-0 top-0 h-2/5 w-full object-cover"
        alt="sunset "
      />
      <div className="mx-4 mt-7 h-3/5 max-w-[300px] font-custom-lexend text-customBlack-100">
        <p className="text-gradient mb-3 overflow-hidden  text-ellipsis whitespace-nowrap font-custom-epilogue text-sm font-bold">
          {event.organizedBy.toLocaleUpperCase()}
        </p>
        <p className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap  text-sm font-bold">
          {event.name}
        </p>
        <div className=" flex items-center gap-1">
          <EventIcon className="h-4 w-4" />
          <p className=" italic" style={{ fontSize: "10px" }}>
            {event.date.toLocaleString()}
          </p>
        </div>
        <div className=" flex items-center gap-1">
          <PlaceIcon className="h-4 w-4" />
          <p className=" italic" style={{ fontSize: "10px" }}>
            {event.location.toLocaleString()}
          </p>
        </div>

        <hr className="my-1 flex  w-full border-t-2 border-customBlack-75" />
        <p className=" mb-8  overflow-hidden  overflow-ellipsis  whitespace-nowrap text-sm ">
          {event.details}
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

function getDate(eventDate: Date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[eventDate.getMonth()];
  const date = eventDate.getDate();
  const year = eventDate.getFullYear();
  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();

  const time = eventDate.getTime();

  console.log(hours);

  const formattedDate = `${month} ${date} ${year}`;
  const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return { formattedDate, formattedTime };
}
