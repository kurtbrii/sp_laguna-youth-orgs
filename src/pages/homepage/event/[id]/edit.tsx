import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import UploadImage from "~/components/UploadImage";
import Image from "next/image";
import LocationForm from "~/components/LocationForm";

interface EventProps {
  name: string;
  createdAt: string;
  details: string;
  location: string;
  organizationId: string;
  date: string;
  partners: string[];
  images: string[];
  organizedBy: string;
}

const EditEvent = () => {
  const updateEvent = api.event.updateEvent.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const { id } = router.query;

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  const eventQuery = api.event.getOne.useQuery({
    id: id as string,
  });

  const eventQueryData = eventQuery.data;

  const eventQueryDataForm = {
    name: eventQueryData?.name ?? "",
    createdAt: eventQueryData?.createdAt?.toLocaleString() ?? "",
    details: eventQueryData?.details ?? "",
    location: eventQueryData?.location ?? "",
    organizedBy: eventQueryData?.organizedBy ?? "",
    organizationId: orgId,
    date: eventQueryData?.date?.toLocaleDateString() ?? "",
    partners: eventQueryData?.partners ?? [],
    images: eventQueryData?.images ?? [],
  };

  const [partner, setPartner] = useState("");

  const [eventData, setEventData] = useState<EventProps>({
    name: "",
    createdAt: "",
    details: "",
    location: "",
    organizedBy: "",
    organizationId: orgId,
    date: "",
    partners: [],
    images: [],
  });

  useEffect(() => {
    if (eventQuery.data) {
      setEventData(eventQueryDataForm);
    }
  }, [eventQuery.data?.images]);

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

  const handlePartner = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartner(e.target.value);

    console.log(partner);
  };

  const handleEventForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });

    console.log(eventData);
  };

  const submitEvent = (eventData: EventProps) => {
    updateEvent.mutate({
      id: id as string,
      name: eventData.name,
      organizedBy: user?.data?.organization?.orgName ?? "",
      details: eventData.details,
      location: eventData.location,
      organizationId: orgId,
      date: eventData.date,
      partners: eventData.partners,
      images: eventData.images,
    });

    window.location.replace("/homepage");
  };

  const handleAddPartner = () => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      partners: [...prevEventData.partners, partner],
    }));

    // Clear the partner input field
    setPartner("");
  };

  const handleRemovePartner = (index: number) => {
    setEventData((prevEventData) => {
      const newPartners = [...prevEventData.partners];
      newPartners.splice(index, 1);
      return {
        ...prevEventData,
        partners: newPartners,
      };
    });
  };

  const handleAddImages = (newImageUrl: string) => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      images: [...prevEventData.images, newImageUrl],
    }));
  };

  const handleRemoveImage = (imageNameToRemove: string) => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      images: prevEventData.images.filter(
        (imageName) => imageName !== imageNameToRemove,
      ),
    }));
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          EDIT EVENT
        </p>
      </section>
      <form
        // onSubmit={() => submitEvent(eventData)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <input
          type="text"
          value={eventData.name}
          name="name"
          onChange={handleEventForm}
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Event Name"
        />

        <textarea
          className=" w-full rounded border p-2 shadow "
          name="details"
          value={eventData.details}
          onChange={handleEventForm}
          rows={10}
          placeholder="Details"
        />

        <div className="flex gap-2">
          <LocationForm
            handleChange={(value) =>
              setEventData((prevEventData) => ({
                ...prevEventData,
                location: value,
              }))
            }
            string={eventData.location}
          />
          {/* <input
            type=""
            value={eventData.location}
            name="location"
            onChange={handleEventForm}
            className="mb-10 h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Location"
          /> */}
          <input
            type="datetime-local"
            value={eventData.date}
            name="date"
            onChange={handleEventForm}
            className="h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Input Date"
          />
        </div>

        <div>
          <input
            type="text"
            name="partner"
            value={partner}
            className=" h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Input Partner"
            onChange={handlePartner}
          />
          <IconButton className="h-12 w-12" onClick={handleAddPartner}>
            <AddBoxIcon />
          </IconButton>
          <div className="mt-2 flex flex-col">
            {eventData?.partners?.map((partner: string, index: number) => (
              <div key={index} className="flex">
                <p className="w-1/2 text-sm">{partner}</p>
                <IconButton onClick={() => handleRemovePartner(index)}>
                  <ClearIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        <UploadImage string={"events"} handleAddImages={handleAddImages} />

        <div className=" flex flex-wrap justify-center gap-4">
          {eventData.images.map((data, index) => (
            <div className="relative " key={index}>
              <div className="absolute right-0 top-0">
                <IconButton
                  onClick={() => {
                    handleRemoveImage(data);
                  }}
                  className="mdi mdi-close cursor-pointer hover:text-white"
                >
                  <ClearIcon />
                </IconButton>
              </div>

              <div
                style={{
                  width: "240px", // Use 100% width for responsiveness
                  height: "150px", // Set a fixed height for all images
                  display: "flex",
                }}
              >
                <Image
                  title={data}
                  className="rounded-md object-cover shadow-xl"
                  src={`https://res.cloudinary.com/dif5glv4a/image/upload/${data}`}
                  alt={`Uploaded file ${index}`}
                  width={240}
                  height={150}
                />
              </div>

              <button onClick={() => console.log(eventData)}>dsd</button>
            </div>
          ))}
        </div>
      </form>

      <div className="my-20 flex justify-center">
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-active px-20 py-3"
            onClick={() => {
              submitEvent(eventData);
            }}
          >
            Edit Event
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
    </div>
  );
};

export default EditEvent;
