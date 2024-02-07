import React from "react";
import Image from "next/image";
import vol2 from "../../assets/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Organization, type User } from "@prisma/client";

type EventProps = {
  event: {
    id: string;
    name: string;
    organizedBy: string;
    createdAt: string;
    details: string;
    location: string;
    organizationId: string;
    organization: Organization;
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
      <Image src={vol2} className="h-2/5 w-full object-cover" alt="sunset " />
      <div className="mx-4 mt-7 h-3/5 max-w-[300px] font-custom-lexend text-customBlack-100">
        <p className="text-gradient mb-3 overflow-hidden  text-ellipsis whitespace-nowrap font-custom-epilogue text-sm font-bold">
          {event.organizedBy.toLocaleUpperCase()}
        </p>
        <p className="overflow-hidden text-ellipsis  whitespace-nowrap  text-sm font-bold">
          {event.name}
        </p>
        <p className=" italic" style={{ fontSize: "10px" }}>
          {event.date.toLocaleString()}
        </p>
        <hr className="my-1 flex  w-full border-t-2 border-customBlack-75" />
        <p className=" overflow-hidden  overflow-ellipsis   text-sm ">
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
