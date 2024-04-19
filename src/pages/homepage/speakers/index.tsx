/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import SpeakersCard from "~/components/SpeakersCard";
import EmailSpeakers from "~/components/EmailSpeakers";

const Speakers = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const [searchText, setSearchText] = useState("");

  const [take, setTake] = useState(12);

  const handleLoadMore = () => {
    setTake(take + 12);
  };

  const speakers = api.speaker.getSpeakers.useQuery({
    search: searchText,
    take: take,
  });

  const router = useRouter();

  const [speakerEmail, setSpeaker] = useState({});

  const [toggleEmailSpeaker, setToggleEmailSpeaker] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [allSpeakers, setAllSpeakers] = useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggleEmailSpeaker = (speaker: any) => {
    setToggleEmailSpeaker(!toggleEmailSpeaker);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Add smooth scrolling effect
    });

    setSpeaker(speaker);
  };

  useEffect(() => {
    if (speakers?.data) {
      setAllSpeakers([...speakers?.data]);
    }
  }, [speakers?.data]);

  return (
    <div className=" flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      {/* ADD SPEAKERS AND SEARCH BAR */}
      <div className="mx-10 my-4 flex flex-col">
        <div className="flex h-16">
          <h1 className="text-gradient mb-6 font-custom-epilogue text-2xl  font-extrabold">
            Pool of Speakers
          </h1>
        </div>

        <div className=" flex items-center justify-between">
          <div className="flex w-2/5 items-center phone:w-full">
            <input
              type="text"
              value={searchText}
              name="search"
              onChange={handleSearchChange}
              className="flex-1 rounded-l p-2 shadow-lg"
              placeholder="Search"
            />
          </div>

          {/* ADD SPEAKERS */}
          {sessionData && sessionData?.user.role !== "VOLUNTEER" && (
            <button
              className="btn-active w-1/4 px-2 py-2"
              onClick={() => router.push("/homepage/speakers/add")}
            >
              Add Speaker
            </button>
          )}
        </div>
      </div>
      {/* SPEAKERS CARD */}
      <div className="mx-10 mb-5 mt-10 flex flex-wrap justify-center gap-3">
        {allSpeakers?.map((querySpeaker) => (
          <SpeakersCard
            key={querySpeaker.id}
            speaker={querySpeaker}
            handleToggleEmailSpeaker={handleToggleEmailSpeaker}
          />
        ))}
      </div>

      {speakers && speakers?.data && speakers?.data?.length == take && (
        <button
          className="btn-active mb-10 mt-10 w-1/5 self-center px-4 py-2 phone:mt-5 phone:w-full"
          onClick={() => handleLoadMore()}
        >
          Load More
        </button>
      )}

      {/* EMAIL SPEAKER */}
      {toggleEmailSpeaker && (
        <>
          <section className="mx-40 mt-20 flex flex-row items-center justify-center bg-secondary p-4 ">
            <p className="font-custom-epilogue text-xl font-extrabold text-white">
              INVITE SPEAKER
            </p>
          </section>
          <EmailSpeakers
            sessionEmail={sessionData?.user.email}
            orgName={user.data?.organization?.orgName}
            speakerEmail={speakerEmail}
          />
        </>
      )}
    </div>
  );
};

export default Speakers;
