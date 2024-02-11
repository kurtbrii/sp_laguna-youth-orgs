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

const ParticipationNav = () => {
  const router = useRouter();

  const [activeLink, setActiveLink] = useState<string>("");

  const [toggleProfileButton, setToggleButton] = useState(false);

  const [toggleGetInvolved, setToggleGetInvolved] = useState(false);

  useEffect(() => {
    // Get the current route pathname
    const currentRoute = router.asPath;

    // Set active link based on the current route
    if (currentRoute === "/homepage") {
      setActiveLink("home");
    } else if (currentRoute === "/homepage/how-it-works") {
      setActiveLink("howItWorks");
    } else if (currentRoute === "/homepage/find-organizations") {
      setActiveLink("findOrganizations");
    } else if (currentRoute === "/homepage/activities") {
      setActiveLink("getInvolved");
    } else if (
      currentRoute === "/profile/organization" ||
      currentRoute === "/profile/volunteer"
    ) {
      setActiveLink("profile");
    } else {
      setActiveLink("");
    }
  }, [router.asPath]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  // const create = api.particpation.createParticipation.useMutation();

  // const handleCreate = () => {
  //   create.mutate({
  //     orgId: "clsh0h772000apsfxa3047hqy",
  //   });
  // };

  const links = [
    "Health",
    "Education",
    "Economic Empowerment",
    "Social Inclusion and Equity",
    "Peace-Building and Security",
    "Governance",
    "ActiveCitizenship",
    "Environment",
    "Global Mobility",
    "Agriculture",
  ];

  const [linkData, setLinkData] = useState("Health");
  const [dataIndex, setDataIndex] = useState(0);

  const handleSetParticipation = (index: number) => {
    setLinkData(links[index]!);
    setDataIndex(index);
  };

  const participationQuery = api.particpation.getParticipations.useQuery({});

  // const handleGetParticipation = (index: number) => {};

  return (
    // navbar
    <div className="my-12 flex flex-col gap-2">
      <hr className="flex  w-full border-t-2 border-customBlack-25" />
      <nav className="px-32 py-6">
        <ul className="flex flex-grow flex-wrap items-center justify-center gap-8">
          {links.map((link, index) => (
            <li
              onClick={() => handleSetParticipation(index)}
              key={index}
              className={`cursor-pointer ${activeLink === link ? "text-secondary" : "text-primary"}`}
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      <hr className="flex  w-full border-t-2 border-customBlack-25" />

      <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5">
        {participationQuery.data?.map((data, index) => (
          <ParticipationsCard
            key={index}
            data={data}
            linkData={linkData}
            dataIndex={dataIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipationNav;
