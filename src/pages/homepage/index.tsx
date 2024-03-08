import React, { useState, KeyboardEvent } from "react";
import Navbar from "~/components/navbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Router, { useRouter } from "next/router";
import EventCard from "~/components/eventCard";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Test from "~/components/Test";

const Index = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  type EventProps = {
    id: string;
    name: string;
    organizedBy: string;
    createdAt: Date;
    details: string;
    location: string;
    organizationId: string;
    organization: {
      user: {
        image: string | null;
      };
    };
    date: Date;
  };

  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const event = api.event.getEvents.useQuery({ search: searchText });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [toggleFilter, setToggleFilter] = useState(false);
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100 ">
      <Navbar />
      {/* ADD EVENT AND SEARCH BAR */}
      <div className="mx-10  flex flex-col">
        <div className=" my-4 flex h-12 flex-col justify-between  ">
          <div className="flex">
            <h1 className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text font-custom-epilogue text-2xl font-extrabold text-transparent ">
              Recent Events
            </h1>
          </div>
        </div>

        <div className=" flex items-center justify-between phone:flex-col">
          {/* SEARCH FUNCTION */}
          <div className="flex w-2/5 items-center phone:w-full">
            <input
              type="text"
              value={searchText}
              name="search"
              onChange={handleSearchChange}
              className="flex-1 rounded-l p-2 shadow-inner"
              placeholder="Search"
            />

            <div
              className={`ml-12 rounded-t-md ${toggleFilter && "bg-gradient "}`}
            >
              <IconButton
                className="flex"
                onClick={handleToggleFilter}
                style={toggleFilter ? { color: "white" } : {}}
              >
                <TuneIcon />
              </IconButton>
            </div>
          </div>

          {/* ADD EVENT */}
          {sessionData && sessionData?.user.role !== "VOLUNTEER" && (
            <button
              className="btn-active w-1/5 px-4 py-2 phone:mt-5 phone:w-full"
              onClick={() => router.push("/homepage/event/add")}
            >
              Add Event
            </button>
          )}
        </div>

        {/* <button onClick={() }>button</button> */}
      </div>

      {toggleFilter && (
        <div className="bg-gradient mx-10 rounded-md  px-10 py-5 ">
          <p className="text-white">ihg</p>
          <p>ihg</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
        </div>
      )}

      {/* EVENT CARD */}
      {/* TODO: FIX PREVIOUS: when added */}
      <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5">
        {event?.data?.map((eventQuery) => (
          <EventCard
            key={eventQuery.id}
            event={eventQuery}
            searchText={searchText}
          />
        ))}
      </div>

      <Test />
    </div>
  );
};

export default Index;
