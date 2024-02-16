import React, { ReactNode, useEffect, useState } from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useRouter } from "next/router";

type ParticipationProps = {
  data: {
    id: string;
    health: string;
    education: string;
    economicEmpowerment: string;
    socialInclusion: string;
    peaceBuilding: string;
    governance: string;
    activeCitizenship: string;
    environment: string;
    globalMobility: string;
    agriculture: string;
    organization: {
      user: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        role: string;
      };
      orgName: string;
    };
  };
  linkData: string;
  dataIndex: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ParticipationsCard = ({
  data,
  linkData,
  dataIndex,
}: ParticipationProps) => {
  const [toggleSeeMore, setToggleSeeMore] = useState(false);
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();

  const handleSeeMore = () => {
    setToggleSeeMore(!toggleSeeMore);
  };

  const getChosenParticipation = () => {
    switch (dataIndex) {
      case 0:
        return data.health;
      case 1:
        return data.education;
      case 2:
        return data.economicEmpowerment;
      case 3:
        return data.socialInclusion;
      case 4:
        return data.peaceBuilding;
      case 5:
        return data.governance;
      case 6:
        return data.activeCitizenship;
      case 7:
        return data.environment;
      case 8:
        return data.globalMobility;
      case 9:
        return data.agriculture;
      default:
        return data.health;
    }
  };

  const handleEditButton = () => {
    void router.push({
      pathname: `/profile/organization/edit`,
    });
  };

  return (
    <div
      // href={`/homepage/speakers/${speaker.id}`}
      className="flex flex-col justify-between  rounded-md  p-4  text-customBlack-100 shadow-2xl"
      style={{ height: "17rem", width: "24rem" }}
    >
      <div className=" mb-2 flex  gap-4  font-custom-lexend ">
        <Image
          className="rounded-md"
          src={`${data.organization?.user?.image}`}
          height={80}
          width={80}
          alt="user image role"
          loading="lazy"
        />

        <div className="overflow-hidden">
          <p className="text-gradient overflow-hidden text-ellipsis whitespace-nowrap font-custom-epilogue text-lg font-extrabold">
            {data.organization.orgName}
          </p>
          <p className="text-ellipsis whitespace-nowrap">{linkData}</p>
        </div>
      </div>

      <div
        className={`mb-4 line-clamp-3  ${toggleSeeMore ? "overflow-y-scroll" : "overflow-clip"}`}
        style={{ maxHeight: "6rem" }}
      >
        {getChosenParticipation()}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handleSeeMore()}
          className=" text-customBlack-50"
        >
          {toggleSeeMore ? <>See less ^</> : <>See more &gt;</>}
        </button>

        {sessionData?.user.id === data?.organization.user.id && (
          <div className="flex gap-4">
            <IconButton onClick={handleEditButton} size="small">
              <EditTwoToneIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationsCard;
