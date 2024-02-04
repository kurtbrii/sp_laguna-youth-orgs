import React, { useEffect, useState } from "react";
import NavBar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

interface EventProps {
  name: "";
  organized_by: string;
  createdAt: string;
  details: string;
  location: string;
  organizationId: string;
}

const Add = () => {
  const createEvent = api.event.createEvent.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const orgId = user.data?.organization?.id || ""; // Ensure to handle potential undefined

  const [eventData, setEventData] = useState<EventProps>({
    name: "",
    organized_by: "",
    createdAt: "",
    details: "",
    location: "",
    organizationId: orgId,
  });

  useEffect(() => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      organizationId: orgId,
    }));
  }, [orgId]);

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  const handleEventForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });

    console.log(eventData);
  };

  const submitEvent = (eventData: EventProps) => {
    createEvent.mutate({
      name: eventData.name,
      organizedBy: user.data.organization.orgName,
      details: eventData.details,
      location: eventData.location,
      organizationId: orgId,
    });

    console.log("hello");
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <NavBar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          ADD AN EVENT
        </p>
      </section>
      <form
        // onSubmit={() => submitEvent(eventData)}
        id="myForm"
        className="mx-40 my-12 flex flex-col gap-4 text-sm"
      >
        <input
          type="text"
          value={eventData.name}
          name="name"
          onChange={handleEventForm}
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="First Name"
        />

        <input
          className=" w-full rounded border p-2 shadow"
          name="details"
          value={eventData.details}
          onChange={handleEventForm}
          // rows={10}
          placeholder="Details"
        />

        <input
          type=""
          value={eventData.location}
          name="location"
          onChange={handleEventForm}
          className="mb-20 h-12 w-full rounded border p-2 shadow"
          placeholder="Location"
        />
      </form>

      <div className="flex justify-center">
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-active px-20 py-3"
            onClick={() => submitEvent(eventData)}
          >
            Create Event
          </button>
          <button
            onClick={() => window.location.replace("/homepage")}
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

export default Add;
