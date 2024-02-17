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

const OrgNav = () => {
  const router = useRouter();

  const [activeLink, setActiveLink] = useState<string>("");

  const [toggleProfileButton, setToggleButton] = useState(false);

  const [toggleGetInvolved, setToggleGetInvolved] = useState(false);

  useEffect(() => {
    // Get the current route pathname
    const currentRoute = router.asPath;

    // Set active link based on the current route
    if (currentRoute === "/manage-activities/organization/volunteer-requests") {
      setActiveLink("Join Organization Requests");
    } else if (
      currentRoute === "/manage-activities/organization/ongoing-activities"
    ) {
      setActiveLink("Ongoing Activities");
    } else if (
      currentRoute === "/manage-activities/organization/partnership-requests"
    ) {
      setActiveLink("Partnership Requests");
    } else if (
      currentRoute === "/manage-activities/organization/sponsorship-requests"
    ) {
      setActiveLink("Join Organization Requests");
    }
  }, [router.asPath]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const links = [
    "Join Organization Requests",
    "Ongoing Activities",
    "Partnership Requests",
    "Sponsorship Requests",
  ];
  const linksNav = [
    "volunteer-requests",
    "ongoing-activities",
    "partnership-requests",
    "sponsorship-requests",
  ];

  const [linkData, setLinkData] = useState("Join Organization Requests");
  const [dataIndex, setDataIndex] = useState(0);

  return (
    // navbar
    <div className="mb-12 flex flex-col gap-2 font-custom-lexend text-customBlack-100">
      <hr className="flex  w-full border-t-2 border-customBlack-25" />
      <nav className="px-32 py-6">
        <ul className="flex flex-grow flex-wrap items-center justify-center gap-8">
          {links.map((link, index) => (
            <li
              onClick={() => router.push(linksNav[index]!)}
              key={index}
              className={`cursor-pointer ${activeLink === link ? "font-extrabold text-secondary" : "text-primary"}`}
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      <hr className="flex  w-full border-t-2 border-customBlack-25" />
    </div>
  );
};

export default OrgNav;
