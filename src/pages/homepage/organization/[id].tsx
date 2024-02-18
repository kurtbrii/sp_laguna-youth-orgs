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

  // ! VOLUNTEERS JOINING ORGANIZATIONS
  const orgCheckJoin = api.volJoinOrg.getOrgOrVol.useQuery({
    volId: user.data?.volunteer?.id ?? "",
    orgId: id as string,
  });

  const volJoinOrg = api.volJoinOrg.createVolJoinOrg.useMutation();

  const deleteVolJoinOrg = api.volJoinOrg.deleteVolJoinOrg.useMutation();

  // ! ORGANIZATIONS SPONSORING ORGANIZATIONS
  const orgCheckSpon = api.orgSponsorOrg.getBothOrganizations.useQuery({
    orgRequesting: user.data?.organization?.id ?? "",
    orgAccepting: id as string,
  });

  const orgSponOrg = api.orgSponsorOrg.createOrgSponOrg.useMutation();

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
  const handleJoinOrg = () => {
    volJoinOrg.mutate({
      orgId: id as string,
      volId: user.data?.volunteer?.id ?? "",
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
  const handleOrgSpon = () => {
    orgSponOrg.mutate({
      orgRequesting: user.data?.organization?.id ?? "",
      orgAccepting: id as string,
    });

    alert("successful");
  };

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
            <h1 className="text-gradient mb-3  font-custom-epilogue text-4xl font-extrabold">
              {organization?.orgName}
            </h1>

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
                        onClick={() => handleOrgSpon()}
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
          <button onClick={() => alert(id)}>Button</button>
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
