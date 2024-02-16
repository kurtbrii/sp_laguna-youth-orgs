// pages/homepage/organization/[id].js

import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

import {
  LinearTextGradient,
  RadialTextGradient,
  ConicTextGradient,
} from "react-text-gradients-and-animations";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// type OrganizationProps = {
//   id: string;
//   orgName: string;
//   phoneNumber: string;
//   mission: string;
//   bio: string;
//   vision: string;
//   objectives: string;
//   user: {
//     id: string;
//     role: string;
//     image: string | null;
//     email: string | null;
//   };
//   userId: string;
// };

const OrganizationPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const organizationsQuery = api.organization.getOne.useQuery({
    id: id as string,
  });

  const organization = organizationsQuery.data;

  const volJoinOrg = api.volJoinOrg.createVolJoinOrg.useMutation();

  const orgCheckJoin = api.volJoinOrg.getOrganizations.useQuery({
    orgId: id as string,
    volId: user.data?.volunteer?.id ?? "",
  });

  const deleteVolJoinOrg = api.volJoinOrg.deleteVolJoinOrg.useMutation();

  if (!id) {
    return <div>No organization ID provided</div>;
  }

  if (organizationsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (organizationsQuery.error ?? !organizationsQuery.data) {
    return <div>Error loading organization data</div>;
  }

  const handleJoinOrg = () => {
    volJoinOrg.mutate(
      {
        orgId: id as string,
        volId: user.data?.volunteer?.id ?? "  ",
      },
      {
        onSuccess: void orgCheckJoin.refetch(),
      },
    );
  };

  const handleDeleteVolJoinOrg = () => {
    deleteVolJoinOrg.mutate(
      {
        orgId: id as string,
        volId: user.data?.volunteer?.id ?? "",
      },
      {
        onSuccess: void orgCheckJoin.refetch(),
      },
    );
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
            <h1 className="text-gradient mb-3  font-custom-epilogue text-4xl font-extrabold">
              {organization?.orgName}
            </h1>

            <p className="mb-6 mr-32 text-sm">{organization?.bio}</p>

            {sessionStatus === "authenticated" &&
              user.data &&
              sessionData.user.id !== organization?.user.id && (
                <div className="flex gap-5">
                  {sessionData && user.data.role === "ORGANIZATION" ? (
                    // ! LOGIC IF ORGANIZAION
                    <>
                      <button className="btn-active px-8 py-3">
                        Request Partnership
                      </button>

                      <button className="btn-active px-8 py-3">
                        Request Sponsorship
                      </button>
                    </>
                  ) : (
                    // ! LOGIC IF VOLUNTEER
                    <>
                      {user.data.role === "VOLUNTEER" &&
                      orgCheckJoin.data?.[0]?.organizationId ? (
                        <button
                          className="btn-outline px-8 py-3"
                          onClick={() => handleDeleteVolJoinOrg()}
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <button
                          className="btn-active px-8 py-3"
                          onClick={() => handleJoinOrg()}
                        >
                          Join Organization
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
          </div>
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
          <div className="flex gap-4 "></div>
        </div>

        {/* ALL ACTIVITIES */}
        <div className="mb-24 flex flex-col gap-6">
          <h1 className="text-gradient flex   font-custom-epilogue text-4xl font-semibold">
            All Activities
          </h1>
          <div className="flex gap-4">
            {/* <OrgCard key={organization?.id} organization={organization} />
            <OrgCard key={organization?.id} organization={organization} />
            <OrgCard key={organization?.id} organization={organization} />
            <OrgCard key={organization?.id} organization={organization} /> */}
          </div>
        </div>

        {/* POOL OF SPEAKERS */}
        <div className="flex flex-col gap-6">
          <h1 className="text-gradient flex  font-custom-epilogue text-4xl font-semibold">
            Pool of Speakers
          </h1>
          <div className="flex gap-4"></div>
        </div>
      </div>
    </>
  );
};

export default OrganizationPage;
