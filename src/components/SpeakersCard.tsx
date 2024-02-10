import React, { useState } from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Organization, type User } from "@prisma/client";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Dialog, Modal } from "@mui/material";

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
    };
  };
};

const SpeakersCard: React.FC<SpeakersProps> = ({ speaker }) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [toggleModal, setToggleModal] = useState(false);

  const handleModal = () => {
    setToggleModal(!toggleModal);
  };

  return (
    <>
      <div
        onClick={() => handleModal()}
        // href={`/homepage/speakers/${speaker.id}`}
        className=" relative w-72  cursor-pointer  flex-col  overflow-hidden  rounded-md  object-fill shadow-2xl"
        style={{ height: "26rem" }}
      >
        <Image
          src={vol2}
          className="h-2/5 w-full object-cover"
          alt="sunset "
          loading="lazy"
        />
        <div className="mx-4 mt-7 h-3/5 max-w-[300px] font-custom-lexend text-customBlack-100"></div>
        <Image
          className="absolute left-4 top-32 rounded-md"
          src={`${speaker.organization?.user?.image}`}
          height={60}
          width={60}
          alt="user image role"
          loading="lazy"
        />
      </div>
      {toggleModal && (
        <Dialog
          className=" text-customBlack-100"
          open={toggleModal}
          onClose={handleModal}
        >
          <Box sx={{ width: 400, height: 200, padding: 12 }}>
            <div className="self-center">
              <h2 id="parent-modal-title">Text in a modal</h2>
              <p id="parent-modal-description">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </p>
            </div>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default SpeakersCard;
