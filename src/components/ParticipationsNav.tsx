/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import ParticipationsCard from "./ParticipationsCard";

const ParticipationNav = ({ orgId, tag, searchText }: any) => {
  const [activeLink, setActiveLink] = useState("");

  const [initialSearch, setInitialSearch] = useState<boolean>(true);

  const links = [
    "Health",
    "Education",
    "Economic Empowerment",
    "Social Inclusion and Equity",
    "Peace-Building and Security",
    "Governance",
    "Active Citizenship",
    "Environment",
    "Global Mobility",
    "Agriculture",
  ];

  const [linkData, setLinkData] = useState(tag ?? "Health");
  const [dataIndex, setDataIndex] = useState(0);

  const handleSetParticipation = (index: number) => {
    setLinkData(links[index]!);
    setDataIndex(index);
    setActiveLink(links[index]!);
  };

  const participationQuery = api.particpation.getParticipations.useQuery({
    orgId: initialSearch ? (orgId as string) : undefined,
    search: searchText,
  });

  useEffect(() => {
    if (initialSearch && searchText !== "") {
      setInitialSearch(false);
      setLinkData(linkData);
      setActiveLink(linkData);
    }
  }, [initialSearch, searchText]);

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
            dataIndex={tag === linkData ? links.indexOf(tag) : dataIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipationNav;
