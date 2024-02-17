import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import OrgNav from "~/components/OrgNav";
import SponsorsList from "~/components/SponsorsList";

const SponsorshipRequest = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const org = user.data?.organization;

  const getOrganizations = api.orgSponsorOrg.getBothOrganizations.useQuery({
    orgAccepting: org?.id,
    status: "PENDING",
  });

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mx-10  flex flex-col">
        <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            MANAGE ACTIVITIES
          </p>
        </section>

        <OrgNav />

        <div>
          {getOrganizations?.data?.map((data, index) => (
            <SponsorsList
              key={index}
              orgRequesting={data.organizationRequesting}
              orgAcceptingId={org?.id}
            />

            // <VolunteerList
            //   key={index}
            //   volunteer={data.volunteer}
            //   organization={org}
            // />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipRequest;
