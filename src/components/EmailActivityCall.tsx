/* eslint-disable @typescript-eslint/no-explicit-any */
import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import { api } from "~/utils/api";

interface EmailProps {
  subject: string;
  body: string;
}

const EmailActivityCall = ({
  activity,
  sessionEmail,
  role,
  volunteer,
  organization,
}: any) => {
  const addOrgOrVol = api.activityCall.createJoinActivity.useMutation();

  const [eventData, setEventData] = useState<EmailProps>({
    subject: "",
    body: "",
  });

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

  const handleButton = () => {
    if (role === "ORGANIZATION") {
      addOrgOrVol.mutate({
        activityId: activity?.id,
        orgId: organization?.id,
        subject: eventData.subject,
        body: eventData.subject,
      });
    } else {
      addOrgOrVol.mutate({
        activityId: activity?.id,
        volId: volunteer?.id,
        subject: eventData.subject,
        body: eventData.subject,
      });

      void emailjs.send(
        "service_sb8pzif",
        "template_g280rll",
        {
          user_name: `${volunteer?.firstName} ${volunteer?.middleInitial} ${volunteer?.lastName} ${volunteer?.suffix}`,
          subject: eventData.subject,
          body: eventData.body,
          from_email: sessionEmail,
          to_email: activity?.organization?.user?.email,
          action: "wants to volunteer on your activity",
          activity_name: activity?.name,
          activity_loc: activity?.location,
          activity_date: activity?.date,
          role: "Volunteer",
          user_email: sessionEmail,
          user_phone_number: volunteer?.phoneNumber,
        },
        "AxPqfUq-9Oy9tdLJv",
      );
    }

    // void emailjs.send(
    //   "service_sb8pzif",
    //   "template_g280rll",
    //   {
    //     user_name:
    //       role === "ORGANIZATION"
    //         ? organizationLoggedIn.orgName
    //         : `${volunteerLoggedIn?.firstName} ${volunteerLoggedIn?.middleInitial} ${volunteerLoggedIn?.lastName} ${volunteerLoggedIn?.suffix}`,
    //     subject: eventData.subject,
    //     body: eventData.body,
    //     from_email: sessionEmail,
    //     to_email: organizationEmail,
    //   },
    //   "AxPqfUq-9Oy9tdLJv",
    // );

    alert("Request Successul");
  };

  return (
    <>
      <form
        onSubmit={() => handleButton()}
        className="mx-40 mb-5 mt-5 flex flex-col gap-4 text-sm"
      >
        <input
          type="text"
          value={eventData.subject}
          name="subject"
          onChange={handleEventForm}
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Subject"
        />
        <textarea
          className=" w-full rounded border p-2 shadow "
          name="body"
          value={eventData.body}
          onChange={handleEventForm}
          rows={10}
          placeholder="Body"
        />
        <button type="submit" className="btn-active px-20 py-3">
          Send Email
        </button>
      </form>
      <button
        onClick={() =>
          void emailjs.send(
            "service_sb8pzif",
            "template_g280rll",
            {
              user_name: `${volunteer?.firstName} ${volunteer?.middleInitial} ${volunteer?.lastName} ${volunteer?.suffix}`,
              subject: eventData.subject,
              body: eventData.body,
              from_email: sessionEmail,
              to_email: activity?.organization?.user?.email,
              action: "wants to volunteer on your activity",
              activity_name: activity?.name,
              activity_loc: activity?.location,
              activity_date: activity?.date,
              role: "Volunteer",
              user_email: sessionEmail,
              user_phone_number: volunteer?.phoneNumber,
            },
            "AxPqfUq-9Oy9tdLJv",
          )
        }
      >
        {" "}
        sfd
      </button>
    </>
  );
};

export default EmailActivityCall;
