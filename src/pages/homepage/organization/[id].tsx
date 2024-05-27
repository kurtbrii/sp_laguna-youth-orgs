import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import EmailJoinOrSpon from "~/components/EmailJoinOrSpon";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EventCard from "~/components/eventCard";
import ActivitiesCard from "~/components/ActivitiesCard";
import { IconButton } from "@mui/material";
import { centersOfParticipation } from "~/utils/obj";

const OrganizationPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [toggleJoinOrg, setToggleJoinOrg] = useState(false);
  const [toggleSponOrg, setToggleSponOrg] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const organizationsQuery = api.organization.getOne.useQuery({
    id: id as string,
  });

  const organization = organizationsQuery.data;

  const isLoading = organizationsQuery.isLoading;

  const joinOrgScrollerRef = useRef<null | HTMLElement>(null);
  const sponOrgScrollerRef = useRef<null | HTMLElement>(null);

  // ! EVENTS
  const event = api.event.getEvents.useQuery({
    search: "",
    take: 3,
    orgId: id as string,
  });

  // ! ACTIVITIES
  const activity = api.activity.getActivities.useQuery({
    take: 3,
    orgId: id as string,
    centersTags: centersOfParticipation,
    customTags: [],
    filterCenterTags: [],
    filterCustomTags: [],
  });

  // ! VOLUNTEERS JOINING ORGANIZATIONS
  const orgCheckJoin = api.volJoinOrg.getOrgOrVol.useQuery({
    volId: user.data?.volunteer?.id ?? "",
    orgId: id as string,
  });

  const deleteVolJoinOrg = api.volJoinOrg.deleteVolJoinOrg.useMutation();

  // ! ORGANIZATIONS SPONSORING ORGANIZATIONS
  const orgCheckSpon = api.orgSponsorOrg.getBothOrganizations.useQuery({
    orgRequesting: user.data?.organization?.id ?? "",
    orgAccepting: id as string,
    status: "PENDING",
  });

  const deleteOrgSponOrg = api.orgSponsorOrg.deleteOrgSpon.useMutation();

  // ! VOLUNTEERS JOINING ORGANIZATIONS
  const handleToggleJoinOrg = () => {
    setToggleJoinOrg(!toggleJoinOrg);
  };

  const handleToggleSponOrg = () => {
    setToggleSponOrg(!toggleSponOrg);
  };

  const handleDeleteVolJoinOrg = () => {
    deleteVolJoinOrg.mutate({
      orgId: id as string,
      volId: user.data?.volunteer?.id ?? "",
    });

    alert("Delete Successful");
  };

  // ! ORGANIZATIONS SPONSORING ORGANIZATIONS
  const handleDeleteOrgSpon = () => {
    deleteOrgSponOrg.mutate({
      orgRequesting: user.data?.organization?.id ?? "",
      orgAccepting: id as string,
    });

    alert("Delete Successful");
  };

  useEffect(() => {
    if (toggleJoinOrg && joinOrgScrollerRef.current) {
      joinOrgScrollerRef?.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [toggleJoinOrg]);

  useEffect(() => {
    if (toggleSponOrg && sponOrgScrollerRef.current) {
      sponOrgScrollerRef?.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [toggleSponOrg]);

  return (
    <>
      <Navbar />
      <div className="mx-16  my-10 flex  flex-col justify-evenly font-custom-lexend  text-customBlack-100">
        {/* CONTACT INFO AND DETAILS */}
        <div className="mb-16 flex">
          {/* IMAGE, EMAIL, NUMBER */}
          <div className="flex min-w-96 flex-col">
            {isLoading ? (
              <div
                className="isLoading rounded-box border"
                style={{
                  width: "400px",
                  height: "400px",
                }}
              ></div>
            ) : (
              <Image
                src={organization?.user.image?.replace("s96-c", "s520-c") ?? ""}
                alt="Organization Image"
                height={400}
                width={400}
              />
            )}

            <p className="mt-2 flex items-center justify-between text-xs">
              <span className="font-bold">Email Address:</span>{" "}
              {isLoading ? (
                <span className="isLoading flex w-2/3"></span>
              ) : (
                <span className="flex w-2/3">{organization?.user?.email}</span>
              )}
            </p>

            <p className="mt-2 flex items-center justify-between text-xs">
              <span className="font-bold">Contact Number:</span>{" "}
              {isLoading ? (
                <span className="isLoading flex w-2/3"></span>
              ) : (
                <span className="flex w-2/3">{organization?.phoneNumber}</span>
              )}
            </p>
          </div>

          {/* BIO, NAME */}
          <div className="ml-16  flex w-full flex-col items-start justify-start">
            {isLoading ? (
              <div className="isLoading mb-3 flex h-10"></div>
            ) : (
              <div className="flex">
                <h1 className="text-gradient mb-3  font-custom-epilogue text-4xl font-extrabold">
                  {organization?.orgName}
                </h1>
              </div>
            )}

            {isLoading ? (
              <div className="mb-6 flex w-full flex-col gap-2">
                <div className="isLoading mr-32 h-5"></div>
                <div className="isLoading mr-32 h-5"></div>
                <div className="isLoading mr-32 h-5"></div>
              </div>
            ) : (
              <p className="mb-6 mr-32 text-sm">{organization?.bio}</p>
            )}

            {/* <p className="mb-6 mr-32 text-sm">{organization?.bio}</p> */}

            {!isLoading &&
              sessionStatus === "authenticated" &&
              user.data &&
              sessionData.user.id !== organization?.user.id && (
                // ! LOGIC IF ORGANIZATION
                <div className="flex gap-5">
                  {sessionData && user.data.role === "ORGANIZATION" ? (
                    orgCheckSpon.data?.[0]?.organizationRequesting ? (
                      <button
                        className="btn-outline px-8 py-3"
                        onClick={() => handleDeleteOrgSpon()}
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <button
                        className="btn-active px-8 py-3"
                        onClick={() => handleToggleSponOrg()}
                      >
                        Collaborate With Us!
                      </button>
                    )
                  ) : (
                    // ! LOGIC IF VOLUNTEER
                    <>
                      {user.data.role === "VOLUNTEER" &&
                      orgCheckJoin.data?.[0]?.organizationId ? (
                        orgCheckJoin.data?.[0]?.status === "PENDING" ? (
                          <button
                            className="btn-outline px-8 py-3"
                            onClick={() => handleDeleteVolJoinOrg()}
                          >
                            Cancel Request
                          </button>
                        ) : (
                          <button
                            className="btn-active cursor-no-drop px-8 py-3  opacity-60 hover:translate-y-0"
                            disabled
                          >
                            Already Joined
                          </button>
                        )
                      ) : (
                        <>
                          <button
                            className="btn-active px-8 py-3"
                            onClick={() => handleToggleJoinOrg()}
                          >
                            Join Organization
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
          </div>
          {/* <button onClick={() => alert(id)}>Button</button> */}
        </div>

        {/* MISSION, VISION, OBJECTIVES */}
        <div className="mb-20 flex flex-col gap-6">
          {/* Mission Vision */}
          <div className="mb-6 flex gap-4">
            <div className="flex w-1/2 flex-col">
              <h1 className="text-gradient mb-2 flex font-custom-epilogue text-2xl font-semibold">
                Mission
              </h1>
              <p>{organization?.mission}</p>
            </div>

            <div className="flex w-1/2 flex-col">
              <h1 className="text-gradient mb-2 flex font-custom-epilogue text-2xl font-semibold">
                Vision
              </h1>
              <p>{organization?.vision}</p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mb-4 flex gap-4">
            <div className="flex w-1/2 flex-col">
              <h1 className="text-gradient mb-2 flex font-custom-epilogue text-2xl font-semibold">
                Objectives
              </h1>
              <p>{organization?.objectives}</p>
            </div>

            <div className="flex w-1/2 flex-col"></div>
          </div>
        </div>

        {/* EVENTS ORGANIZED */}
        <div className=" mb-24 flex flex-col gap-6">
          <h1 className="text-gradient flex  font-custom-epilogue text-4xl font-semibold">
            Events Organized
          </h1>
          <div className="flex gap-4 phone:flex-col laptop:flex-col">
            <div className="mt mb-5 flex flex-wrap justify-start gap-7 phone:justify-center ">
              {event?.data?.map((queryEvent) => (
                <EventCard
                  searchText={""}
                  key={queryEvent.id}
                  event={queryEvent}
                />
              ))}
            </div>
            <IconButton
              className="self-center"
              onClick={() =>
                router.push(
                  `/homepage?id=${id as string}&name=${organization?.orgName}`,
                )
              }
            >
              <ArrowForwardRoundedIcon fontSize="large" />
            </IconButton>
          </div>
        </div>

        {/* ALL ACTIVITIES */}
        <div className="mb-24 flex flex-col gap-6">
          <h1 className="text-gradient flex   font-custom-epilogue text-4xl font-semibold">
            All Activities
          </h1>

          <div className="flex gap-4 phone:flex-col laptop:flex-col">
            <div className="mb-5  flex flex-wrap justify-start gap-7 phone:justify-center ">
              {activity?.data?.map((queryActivity) => (
                <ActivitiesCard
                  searchText={""}
                  key={queryActivity.id}
                  activity={queryActivity}
                  callOrParticipation={"call"}
                />
              ))}
            </div>
            <IconButton
              className="self-center"
              onClick={() =>
                router.push(
                  `/homepage/activities?id=${id as string}&name=${organization?.orgName}`,
                )
              }
            >
              <ArrowForwardRoundedIcon fontSize="large" />
            </IconButton>
          </div>
        </div>

        {toggleJoinOrg || toggleSponOrg ? (
          <>
            {toggleSponOrg && (
              <section
                ref={sponOrgScrollerRef}
                className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 "
              >
                <p className="font-custom-epilogue text-xl font-extrabold text-white">
                  Request for Collaboration
                </p>
              </section>
            )}

            {toggleJoinOrg && (
              <section
                className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 "
                ref={joinOrgScrollerRef}
              >
                <p className="font-custom-epilogue text-xl font-extrabold text-white">
                  Join Organization
                </p>
              </section>
            )}
            <EmailJoinOrSpon
              orgId={id as string}
              organizationEmail={organization?.user.email}
              volunteerLoggedIn={user.data?.volunteer}
              organizationLoggedIn={user.data?.organization}
              sessionEmail={sessionData?.user.email}
              role={user?.data?.role}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default OrganizationPage;
