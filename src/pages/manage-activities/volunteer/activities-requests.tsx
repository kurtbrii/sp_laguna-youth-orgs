import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import VolunteerNav from "~/components/VolunteerNav";
import ActivityList from "~/components/ActivityList";

const VolunteerManageActivities = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const volunteerQuery = api.volunteer.getOne.useQuery({
    userId: sessionData?.user.id,
  });

  const volunteer = volunteerQuery.data;
  const getMyActivities = api.activityCall.getOrgOrVol.useQuery({
    volId: volunteer?.id,
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

        <VolunteerNav />

        <div className="mb-12 flex flex-col justify-center gap-4 ">
          {getMyActivities.data?.map((data, index) => (
            <ActivityList key={index} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerManageActivities;
