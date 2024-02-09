import React from "react";
import Image from "next/image";
import vol2 from "../../assets/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Organization, type User } from "@prisma/client";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";

type ActivityProps = {
  activity: {
    id: string;
    name: string;
    details: string;
    date: Date;
    createdAt: Date;
    location: string;
    organization: {
      user: {
        id: string;
        image: string | null;
      };
    };
    hasOrganizations: boolean;
    hasVolunteers: boolean;
    hasParticipants: boolean;
    organizationId: string;
  };
};

const ActivitiesCard: React.FC<ActivityProps> = ({ activity }) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    <Link
      href={`/homepage/activities/${activity.id}`}
      className=" relative w-72  cursor-pointer  flex-col  overflow-hidden  rounded-md  object-fill shadow-2xl"
      style={{ height: "26rem" }}
    >
      <Image src={vol2} className="h-2/5 w-full object-cover" alt="sunset " />
      <div className="mx-4 mt-7 h-3/5 max-w-[300px] font-custom-lexend text-customBlack-100">
        <p className="text-gradient mb-3 overflow-hidden  text-ellipsis whitespace-nowrap font-custom-epilogue text-sm font-bold">
          {/* {activity.organizedBy.toLocaleUpperCase()} */}
        </p>
        <p className="mb-2 overflow-hidden text-ellipsis  whitespace-nowrap  text-sm font-bold">
          {activity.name}
        </p>
        <div className=" flex items-center gap-1">
          <EventIcon className="h-4 w-4" />
          <p className=" italic" style={{ fontSize: "10px" }}>
            {activity.date.toLocaleString()}
          </p>
        </div>
        <div className=" flex items-center gap-1">
          <PlaceIcon className="h-4 w-4" />
          <p className=" italic" style={{ fontSize: "10px" }}>
            {activity.location.toLocaleString()}
          </p>
        </div>
        <hr className="my-1 flex  w-full border-t-2 border-customBlack-75" />
        <p className=" mb-6  overflow-hidden  overflow-ellipsis  whitespace-nowrap text-sm">
          {activity.details}
        </p>
        <section className=" flex flex-wrap gap-2">
          {activity.hasOrganizations && (
            <div
              className="btn-outline border px-2 py-1"
              style={{ fontSize: "8px" }}
            >
              Partnership
            </div>
          )}

          {activity.hasParticipants && (
            <div
              className="btn-outline border px-2 py-1"
              style={{ fontSize: "8px" }}
            >
              Call for Participants
            </div>
          )}

          {activity.hasVolunteers && (
            <div
              className="btn-outline border px-2 py-1"
              style={{ fontSize: "8px" }}
            >
              Call for Volunteers
            </div>
          )}
        </section>
      </div>
      <Image
        className="absolute left-4 top-32 rounded-md"
        src={`${activity.organization?.user?.image}`}
        height={60}
        width={60}
        alt="user image role"
      />
    </Link>
  );
};

export default ActivitiesCard;
