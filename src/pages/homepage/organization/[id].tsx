import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EmailJoinOrSpon from "~/components/EmailJoinOrSpon";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EventCard from "~/components/eventCard";
import ActivitiesCard from "~/components/ActivitiesCard";
import { IconButton } from "@mui/material";

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

  // ! AUTHENTICATED OR NOT
  if (!id) {
    return <div>No organization ID provided</div>;
  }

  if (organizationsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (organizationsQuery.error ?? !organizationsQuery.data) {
    return <div>Error loading organization data</div>;
  }

  // ! VOLUNTEERS JOINING ORGANIZATIONS
  const handleToggleJoinOrg = () => {
    setToggleJoinOrg(!toggleJoinOrg);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Add smooth scrolling effect
    });
  };

  const handleToggleSponOrg = () => {
    setToggleSponOrg(!toggleSponOrg);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Add smooth scrolling effect
    });
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

  return (
    <>
      <Navbar />
      <div className="mx-16  my-10 flex  flex-col justify-evenly font-custom-lexend  text-customBlack-100">
        {/* CONTACT INFO AND DETAILS */}
        <div className="mb-16 grid grid-flow-col">
          <div className="flex-flex-col">
            <Image
              src={organization?.user.image ?? ""}
              alt="Organization Image"
              height={300}
              width={300}
            />
            <p className="text-xs">
              <span className="font-bold">Email Address:</span>{" "}
              {organization?.user?.email}
            </p>

            <p className=" text-xs">
              <span className="font-bold">Contact Number:</span>{" "}
              {organization?.phoneNumber}
            </p>
          </div>

          <div className="flex-start  ml-16 flex flex-col">
            <div className="flex">
              <h1 className="text-gradient mb-3  font-custom-epilogue text-4xl font-extrabold">
                {organization?.orgName}
              </h1>
            </div>

            <p className="mb-6 mr-32 text-sm">{organization?.bio}</p>

            {sessionStatus === "authenticated" &&
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

                        // onClick={() => handleOrgSpon()}
                      >
                        Request Sponsorship
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
                  callOrParticipation={""}
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

        {/* POOL OF SPEAKERS */}
        {/* <div className="mb-20 flex flex-col gap-6">
          <h1 className="text-gradient flex  font-custom-epilogue text-4xl font-semibold">
            Pool of Speakers
          </h1>
          <div className="flex gap-4"></div>
        </div> */}

        {toggleJoinOrg || toggleSponOrg ? (
          <>
            {toggleSponOrg && (
              <section className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 ">
                <p className="font-custom-epilogue text-xl font-extrabold text-white">
                  Request Sponsorship
                </p>
              </section>
            )}

            {toggleJoinOrg && (
              <section className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 ">
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
