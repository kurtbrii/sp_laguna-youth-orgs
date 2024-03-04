import React from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Organization, type User } from "@prisma/client";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import { router } from "@trpc/server";
import { useRouter } from "next/router";

type ActivitiesCardProps = {
  activity: ActivityProps["activity"];
  searchText: string;
};

type ActivityProps = {
  activity: {
    id: string;
    name: string;
    details: string;
    date: Date;
    createdAt: Date;
    location: string;
    images: string[];
    organization: {
      orgName: string;
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

const ActivitiesCard: React.FC<ActivitiesCardProps> = ({
  activity,
  searchText,
}) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();

  const handleClick = () => {
    void router.push(`/homepage/activities/${activity.id}`);
  };

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
    <div
      onClick={() => handleClick()}
      className=" relative z-10 flex w-72  transform  cursor-pointer  flex-col  overflow-hidden rounded-md object-fill shadow-2xl transition-transform duration-300 hover:scale-105"
      style={{ height: "27rem" }}
    >
      <style jsx global>{`
        .highlight {
          color: #00bd6e;
          font-weight: black;
        }
      `}</style>
      <Image
        src={
          activity.images.length === 0
            ? vol2
            : `https://res.cloudinary.com/dif5glv4a/image/upload/${activity.images[0]}`
        }
        className="h-2/5 w-full object-cover"
        alt="sunset "
        width={300}
        height={300}
      />
      <div className="mx-4 mt-7 h-3/5 max-w-[300px] font-custom-lexend text-customBlack-100">
        <p className="mb-2 overflow-hidden text-ellipsis  whitespace-nowrap font-custom-epilogue text-sm font-black text-primary">
          {highlightText(
            activity.organization.orgName.toLocaleUpperCase(),
            searchText,
          )}
        </p>
        <p className="mb-2 overflow-hidden text-ellipsis  whitespace-nowrap  text-sm font-bold">
          {highlightText(activity.name, searchText)}
        </p>
        <div className=" flex items-center gap-1">
          <EventIcon className="h-4 w-4" />
          <p className=" italic" style={{ fontSize: "10px" }}>
            {activity.date.toLocaleString()}
          </p>
        </div>
        <div className=" flex items-center gap-1">
          <PlaceIcon className="h-4 w-4" />
          <p
            className="overflow-hidden text-ellipsis  whitespace-nowrap italic"
            style={{ fontSize: "10px" }}
          >
            {highlightText(activity.location, searchText)}
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
    </div>
  );
};

export default ActivitiesCard;
