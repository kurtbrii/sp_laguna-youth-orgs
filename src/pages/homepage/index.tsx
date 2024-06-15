/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Navbar from "~/components/navbar";
import { useRouter } from "next/router";
import EventCard from "~/components/eventCard";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";

const Index = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const { id, name } = router.query;

  const [searchText, setSearchText] = useState((name as string) ?? "");

  const [initialSearch, setInitialSearch] = useState<boolean>(true);

  const [take, setTake] = useState(12);

  const handleLoadMore = () => {
    setTake(take + 12);
  };

  const { data: event, isLoading: cardsLoading } = api.event.getEvents.useQuery(
    {
      take: take,
      search: searchText,
      orgId: initialSearch ? (id as string) : undefined,
      archived: false,
    },
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [toggleFilter, setToggleFilter] = useState(false);
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    if (initialSearch && searchText !== "") {
      setInitialSearch(false);
    }
  }, [initialSearch, searchText]);

  useEffect(() => {
    if (event) {
      setAllEvents([...event]);
    }
  }, [event]);

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
              className="flex-1 rounded-l p-2 shadow-lg"
              placeholder="Search"
            />

            {/* <div
              className={`ml-12 rounded-t-md ${toggleFilter && "bg-gradient "}`}
            >
              <IconButton
                className="flex"
                onClick={handleToggleFilter}
                style={toggleFilter ? { color: "white" } : {}}
              >
                <TuneIcon />
              </IconButton>
            </div> */}
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

      {/* {toggleFilter && (
        <div className="bg-gradient mx-10 rounded-md  px-10 py-5 ">
          <p className="text-white">ihg</p>
          <p>ihg</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
        </div>
      )} */}

      {/* EVENT CARD */}

      {cardsLoading && allEvents.length === 0 ? (
        <LoadingBar />
      ) : (
        <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5">
          {allEvents?.map((eventQuery) => (
            <EventCard
              key={eventQuery.id}
              event={eventQuery}
              searchText={searchText}
            />
          ))}
        </div>
      )}

      {event && event?.length == take && (
        <button
          className="btn-active mb-10 mt-10 w-1/5 self-center px-4 py-2 phone:mt-5 phone:w-full"
          onClick={() => handleLoadMore()}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Index;
