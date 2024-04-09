import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import OrgNav from "~/components/OrgNav";
import VolunteerList from "~/components/VolunteerList";

const OrgManageVolunteerRequests = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const org = user.data?.organization;

  const { data: getOrganizations, refetch } =
    api.volJoinOrg.getOrgOrVol.useQuery({
      orgId: org?.id,
      status: "PENDING",
    });

  const handleUpdate = async () => {
    await refetch();
  };

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
          {getOrganizations?.map((data, index) => (
            <VolunteerList
              key={index}
              data={data}
              volunteer={data.volunteer}
              organization={org}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrgManageVolunteerRequests;
