import React, { ChangeEventHandler, useEffect, useState } from "react";
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

const EditVolunteer = () => {
  const updateVolunteer = api.volunteer.updateVolunteer.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const volunteeerId = user.data?.volunteer?.id ?? "";

  const volunteer = user.data?.volunteer;

  const [volunteerData, setVolunteerData] = useState({
    phoneNumber: volunteer?.phoneNumber,
    bio: volunteer?.bio,
    sex: volunteer?.sex,
    age: volunteer?.age,
  });

  useEffect(() => {
    setVolunteerData(() => ({
      phoneNumber: volunteer?.phoneNumber,
      bio: volunteer?.bio,
      sex: volunteer?.sex,
      age: volunteer?.age,
    }));
  }, [volunteeerId]);

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.volunteer) {
    return <div>Error loading user data</div>;
  }

  const handleEventForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVolunteerData({
      ...volunteerData,
      [name]: value,
    });

    console.log(volunteerData);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitOrganization = (volunteerData: any) => {
    updateVolunteer.mutate({
      id: volunteer?.id ?? "",
      phoneNumber: volunteerData.phoneNumber,
      bio: volunteerData.bio,
      sex: volunteerData.sex,
      age: parseInt(volunteerData.age),
    });

    void router.push("/profile/volunteer");
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
        {/* <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            More Information
          </p>
        </section> */}

        <input
          type="text"
          value={volunteerData.phoneNumber}
          name="phoneNumber"
          onChange={handleEventForm}
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Mobile Number"
        />

        <textarea
          className=" w-full rounded border p-2 shadow "
          name="bio"
          value={volunteerData.bio ?? ""}
          onChange={handleEventForm}
          rows={10}
          placeholder="Bio"
        />

        <div className="flex gap-3">
          <input
            className=" w-1/2 rounded border p-2 shadow "
            name="age"
            value={volunteerData.age?.toString()}
            onChange={handleEventForm}
            placeholder="Age"
          />

          <select
            id="example-dropdown"
            name="sex"
            className=" w-1/2 rounded border p-2 shadow "
            onChange={handleEventForm}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* <input
          type=""
            className=" w-1/2 rounded border p-2 shadow "
            name="sex"
            value={volunteerData.sex ?? ""}
            onChange={handleEventForm}
            placeholder="Sex"
          /> */}
        </div>
      </form>

      <div className="my-20 flex justify-center">
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="btn-active px-40 py-3"
            onClick={() => {
              submitOrganization(volunteerData);
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
          {/* <button onClick={() => alert(volunteerData.sex)}>buton</button> */}
        </div>
      </div>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default EditVolunteer;
