import React, { ReactNode, useEffect, useState } from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import ParticipationsCard from "./ParticipationsCard";

const VolunteerNav = () => {
  const router = useRouter();

  const [activeLink, setActiveLink] = useState<string>("");

  const [toggleProfileButton, setToggleButton] = useState(false);

  const [toggleGetInvolved, setToggleGetInvolved] = useState(false);

  useEffect(() => {
    // Get the current route pathname
    const currentRoute = router.asPath;

    // Set active link based on the current route
    if (currentRoute === "/manage-activities/volunteer/org-requests") {
      setActiveLink("Join Organization Requests");
    } else if (
      currentRoute === "/manage-activities/volunteer/activities-requests"
    ) {
      setActiveLink("Join Activiy Request");
    }
  }, [router.asPath]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const links = ["Join Organization Requests", "Join Activiy Request"];
  const linksNav = [
    "/manage-activities/volunteer/org-requests",
    "/manage-activities/volunteer/activities-requests",
  ];

  return (
    // navbar
    <div className="mb-12 flex flex-col gap-2">
      <hr className="flex  w-full border-t-2 border-customBlack-25 " />
      <nav className="px-32 py-6">
        <ul className="flex flex-grow flex-wrap items-center justify-center gap-8 font-custom-lexend">
          {links.map((link, index) => (
            <li
              onClick={() => router.push(linksNav[index]!)}
              key={index}
              className={`cursor-pointer ${activeLink === link ? "text-secondary" : "text-primary"}`}
            >
              {link}
            </li>
          ))}
        </ul>
      </nav>

      <hr className="flex  w-full border-t-2 border-customBlack-25" />
    </div>
  );
};

export default VolunteerNav;
