import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

// interface EventProps {
//   name: "";
//   organized_by: string;
//   createdAt: string;
//   details: string;
//   location: string;
//   organizationId: string;
//   date: string;
//   partners: string[];
// }

const EditOrganization = () => {
  const updateOrganization = api.organization.updaeOrganization.useMutation();

  const router = useRouter();
  const { data: sessionData, update } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  const org = user.data?.organization;

  const [orgData, setOrgData] = useState({
    phoneNumber: org?.phoneNumber,
    bio: org?.bio,
    mission: org?.mission,
    vision: org?.vision,
    objectives: org?.objectives,
  });

  useEffect(() => {
    setOrgData(() => ({
      phoneNumber: org?.phoneNumber,
      bio: org?.bio,
      mission: org?.mission,
      vision: org?.vision,
      objectives: org?.objectives,
    }));
  }, [orgId]);

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  const handleEventForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOrgData({
      ...orgData,
      [name]: value,
    });

    console.log(orgData);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitOrganization = (orgData: any) => {
    updateOrganization.mutate({
      id: org?.id ?? "",
      phoneNumber: orgData.phoneNumber,
      bio: orgData.bio,
      mission: orgData.mission,
      vision: orgData.vision,
      objectives: orgData.objectives,
    });

    void router.push("/profile/organization");
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          UPDATE PROFILE
        </p>
      </section>
      <form
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            More Information
          </p>
        </section>
        <input
          type="text"
          value={orgData.phoneNumber}
          name="phoneNumber"
          onChange={handleEventForm}
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Mobile Number"
        />
        <textarea
          className=" w-full rounded border p-2 shadow "
          name="bio"
          value={orgData.bio}
          onChange={handleEventForm}
          rows={10}
          placeholder="Bio"
        />

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Mission
          </p>
        </section>
        <textarea
          className=" w-full rounded border p-2 shadow "
          name="mission"
          value={orgData.mission}
          onChange={handleEventForm}
          rows={10}
          placeholder="Mission"
        />

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Vision
          </p>
        </section>
        <textarea
          className=" w-full rounded border p-2 shadow "
          name="vision"
          value={orgData.vision}
          onChange={handleEventForm}
          rows={10}
          placeholder="Vision"
        />

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Objectives
          </p>
        </section>
        <textarea
          className=" w-full rounded border p-2 shadow "
          name="objectives"
          value={orgData.objectives}
          onChange={handleEventForm}
          rows={10}
          placeholder="Objectives"
        />
      </form>

      <div className="my-20 flex justify-center">
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="btn-active px-40 py-3"
            onClick={() => {
              submitOrganization(orgData);
            }}
          >
            Update Profile
          </button>
          <button
            onClick={() => router.back()}
            type="reset"
            className="btn-outline   px-20 py-3"
            style={{ color: "#ec4b42", borderColor: "#ec4b42" }}
          >
            Discard
          </button>
          {/* <button onClick={() => alert(org?.id)}>buton</button> */}
        </div>
      </div>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default EditOrganization;
