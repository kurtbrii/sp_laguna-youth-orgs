import React, { useState } from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import router from "next/router";
import { api } from "~/utils/api";
import DeleteModal from "./DeleteModal";

type SpeakersProps = {
  speaker: {
    id: string;
    name: string;
    age: number;
    bio: string;
    organization: {
      user: {
        id: string;
        image: string | null;
      };
      orgName: string;
    };
  };
};

const SpeakersCard: React.FC<SpeakersProps> = ({ speaker }) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [toggleSeeMore, setToggleSeeMore] = useState(false);

  const [toggleModal, setToggleModal] = useState(false);

  const deleteSpeaker = api.speaker.deleteSpeaker.useMutation();

  const handleSeeMore = () => {
    setToggleSeeMore(!toggleSeeMore);
  };

  const handleEditButton = () => {
    void router.push({
      pathname: `/homepage/speakers/[id]/edit`,
      query: {
        id: speaker?.id,
      },
    });
  };

  const handleToggleButton = () => {
    setToggleModal(!toggleModal);
  };

  const handleDeleteButton = () => {
    deleteSpeaker.mutate({
      id: speaker.id,
    });

    void router.push("/homepage");
  };

  return (
    <>
      <div
        // href={`/homepage/speakers/${speaker.id}`}
        className="flex flex-col justify-between  rounded-md  p-4  text-customBlack-100 shadow-2xl"
        style={{ height: "17rem", width: "24rem" }}
      >
        <div className=" mb-2 flex  gap-4  font-custom-lexend ">
          <Image
            className="w-1/3 rounded-md"
            src={`${speaker.organization?.user?.image}`}
            height={80}
            width={80}
            alt="user image role"
            loading="lazy"
          />

          <div className="overflow-hidden">
            <p className="text-gradient overflow-hidden text-ellipsis whitespace-nowrap font-custom-epilogue text-lg font-extrabold">
              {speaker.name}
            </p>
            <p className="overflow-hidden  text-ellipsis whitespace-nowrap">
              from {speaker.organization.orgName}
            </p>
            <p className="text-ellipsis whitespace-nowrap">
              Age: {speaker.age}
            </p>
          </div>
        </div>

        <div
          className={`mb-4 line-clamp-3  ${toggleSeeMore ? "overflow-y-scroll" : "overflow-clip"}`}
          style={{ maxHeight: "6rem" }}
        >
          <p className="overflow-ellipsis">{speaker.bio}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleSeeMore()}
            className=" text-customBlack-50"
          >
            {toggleSeeMore ? <>See less ^</> : <>See more &gt;</>}
          </button>

          {sessionData?.user.id === speaker?.organization.user.id && (
            <div className="flex gap-4">
              <IconButton onClick={handleEditButton} size="small">
                <EditTwoToneIcon />
              </IconButton>
              <IconButton size="small" onClick={() => handleToggleButton()}>
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        toggleModal={toggleModal}
        handleToggleButton={handleToggleButton}
        handleDeleteButton={handleDeleteButton}
        string={"speaker"}
      />
    </>
  );
};

export default SpeakersCard;
