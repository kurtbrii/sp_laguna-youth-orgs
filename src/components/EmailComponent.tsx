/* eslint-disable @typescript-eslint/no-explicit-any */
import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import { api } from "~/utils/api";

interface EmailProps {
  subject: string;
  body: string;
}

const EmailComponent = ({
  orgId,
  organizationEmail,
  volunteerLoggedIn,
  organizationLoggedIn,
  sessionEmail,
  role,
}: any) => {
  const [eventData, setEventData] = useState<EmailProps>({
    subject: "",
    body: "",
  });

  const volJoinOrg = api.volJoinOrg.createVolJoinOrg.useMutation();

  const orgSponOrg = api.orgSponsorOrg.createOrgSponOrg.useMutation();

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
      orgSponOrg.mutate({
        orgRequesting: organizationLoggedIn?.id,
        orgAccepting: orgId,
        subject: eventData.subject,
        body: eventData.body,
      });
    } else {
      volJoinOrg.mutate({
        orgId: orgId,
        volId: volunteerLoggedIn?.id,
        subject: eventData.subject,
        body: eventData.body,
      });
    }

    void emailjs.send(
      "service_sb8pzif",
      "template_pm7npxj",
      {
        vol_name:
          role === "ORGANIZATION"
            ? organizationLoggedIn.orgName
            : `${volunteerLoggedIn?.firstName} ${volunteerLoggedIn?.middleInitial} ${volunteerLoggedIn?.lastName} ${volunteerLoggedIn?.suffix}`,
        subject: eventData.subject,
        body: eventData.body,
        from_email: sessionEmail,
        to_email: organizationEmail,
      },
      "AxPqfUq-9Oy9tdLJv",
    );

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

      <button onClick={() => alert(role)}> sfd</button>
    </>
  );
};

export default EmailComponent;
