import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

// interface ActivityProps {
//   name: string;
//   details: string;
//   date: string;
//   createdAt: string;
//   location: string;

//   hasOrganizations: boolean;
//   hasVolunteers: boolean;
//   hasParticipants: boolean;
//   organizationId: string;
// }

const EditSpeaker = () => {
  const editSpeaker = api.speaker.updateSpeaker.useMutation();

  const router = useRouter();

  const { id } = router.query;

  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const speakerQuery = api.speaker.getSpeaker.useQuery({
    id: id as string,
  });

  const speakerQueryData = speakerQuery.data;

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  const speakerQueryDataForm = {
    name: speakerQueryData?.name ?? "",
    bio: speakerQueryData?.bio ?? "",
    age: speakerQueryData?.age ?? 10,
  };

  const [speakerData, setSpeakerData] = useState({
    name: "",
    bio: "",
    age: 10,
  });

  useEffect(() => {
    if (speakerQueryData) {
      setSpeakerData(speakerQueryDataForm);
    }
  }, [speakerQueryData]);

  useEffect(() => {
    setSpeakerData((prevSpeakerData) => ({
      ...prevSpeakerData,
      organizationId: orgId,
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
    setSpeakerData({
      ...speakerData,
      [name]: value,
    });

    console.log(speakerData);
  };

  const submitSpeaker = () => {
    editSpeaker.mutate({
      name: speakerData.name,
      bio: speakerData.bio,
      age: speakerData.age,
      id: id as string,
    });

    window.location.replace("/homepage/speakers");
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          EDIT SPEAKER
        </p>
      </section>
      <form
        // onSubmit={() => submitEvent(eventData)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <div className="flex gap-2">
          <input
            type=""
            value={speakerData.name}
            name="name"
            onChange={handleEventForm}
            className="mb-2 h-12 w-4/6 rounded border p-2 shadow"
            placeholder="Volunteer Name"
          />
          <input
            type="number"
            value={speakerData.age}
            name="age"
            onChange={handleEventForm}
            className="h-12 w-2/6 rounded border p-2 shadow"
            placeholder="Age"
            min={10}
            max={60}
          />
        </div>

        <textarea
          className=" w-full rounded border p-2 shadow "
          name="bio"
          value={speakerData.bio}
          onChange={handleEventForm}
          rows={10}
          placeholder="Bio/Advocacies"
        />
      </form>

      <div className="my-20 flex justify-center">
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-active px-20 py-3"
            onClick={() => {
              submitSpeaker();
            }}
          >
            Edit Speaker
          </button>
          <button
            onClick={() => router.back()}
            type="reset"
            className="btn-outline   px-20 py-3"
            style={{ color: "#ec4b42", borderColor: "#ec4b42" }}
          >
            Discard
          </button>
        </div>
      </div>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default EditSpeaker;
