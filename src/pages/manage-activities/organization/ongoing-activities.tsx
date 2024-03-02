import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import OrgNav from "~/components/OrgNav";
import ActivitiesCard from "~/components/ActivitiesCard";

const OrgManageVolunteerRequests = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const org = user.data?.organization;

  const getOrganizations = api.volJoinOrg.getOrgOrVol.useQuery({
    orgId: org?.id,
    status: "PENDING",
  });

  const activity = api.activity.getActivities.useQuery({ orgId: org?.id });

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
          <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5">
            {activity?.data?.map((queryActivity) => (
              <ActivitiesCard
                key={queryActivity.id}
                activity={queryActivity}
                searchText={""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgManageVolunteerRequests;
