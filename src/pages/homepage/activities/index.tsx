import React, { useState } from "react";
import NavBar from "~/components/NavBar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Router, { useRouter } from "next/router";
import EventCard from "~/components/EventCard";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Organization } from "@prisma/client";

import { Profile } from "next-auth";

const Index = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const event = api.event.getEvents.useQuery();

  const handleFetchEvents = () => {
    console.log(event.data);
  };

  type EventProps = {
    id: string;
    name: string;
    organizedBy: string;
    createdAt: string;
    details: string;
    location: string;
    organizationId: string;
    organization: Organization;
    date: Date;
  };

  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <NavBar />
      {/* ADD EVENT AND SEARCH BAR */}
      <div className="mx-10  flex flex-col">
        <div className=" my-4 flex h-12 flex-col justify-between  ">
          <h1 className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text font-custom-epilogue text-2xl font-extrabold text-transparent ">
            Get Involved
          </h1>
        </div>

        <div className=" flex items-center justify-between">
          {/* SEARCH FUNCTION */}
          <div className="flex w-3/5 items-center">
            <input
              type="text"
              value={searchText}
              name="search"
              onChange={handleSearchChange}
              className="flex-1 rounded-l p-2  shadow-lg"
              placeholder="Search"
            />
            <button className="bg-gradient mr-7 flex rounded-r border-gray-300 p-2 shadow-lg ">
              <SearchIcon style={{ color: "white" }} />
            </button>

            <IconButton className="flex">
              <TuneIcon />
            </IconButton>
          </div>

          {/* ADD EVENT */}
          {sessionData && sessionData?.user.role !== "VOLUNTEER" && (
            <button
              className="btn-active w-1/4 px-2 py-2"
              onClick={() => router.push("/homepage/activities/add")}
            >
              Promote an Activity
            </button>
          )}
        </div>

        {/* <button onClick={() }>button</button> */}
      </div>

      {/* EVENT CARD */}
      {/* TODO: FIX PREVIOUS: when added */}
      {/* <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5">
        {event?.data?.map((event: EventProps) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div> */}
    </div>
  );
};

export default Index;
