import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";
import { $Enums, User } from "@prisma/client";
import Image from "next/image";
import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SponsorsList = ({ body, orgRequesting, orgAcceptingId }: any) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const approveStatus = api.orgSponsorOrg.updateOrgSpon.useMutation();

  const discardOrg = api.orgSponsorOrg.deleteOrgSpon.useMutation();

  const handleApproveVol = () => {
    approveStatus.mutate({
      orgRequesting: orgRequesting.id,
      orgAccepting: orgAcceptingId,
    });

    alert("Request Approved");
  };

  const handleDiscard = () => {
    discardOrg.mutate({
      orgRequesting: orgRequesting.id,
      orgAccepting: orgAcceptingId,
    });
    alert("Request Discarded");
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      style={{
        color: `${expanded ? "white" : "var(--black-100)"}`,
        marginBottom: "30px",
      }}
    >
      <AccordionSummary
        aria-controls="panel1-content"
        style={{
          background: `${expanded ? "linear-gradient(to right, var(--primary), var(--secondary))" : "white"}`,
          color: `${expanded ? "white" : "var(--black-100)"}`,
          fontWeight: "bold",
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        {orgRequesting.orgName}
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex gap-4 py-6 font-custom-lexend text-customBlack-100">
          <Image
            className="h-full w-1/5 rounded-md object-cover"
            src={`${orgRequesting.user.image}`}
            height={300}
            width={300}
            alt="user image role"
          />
          <div className="flex w-4/5 flex-col">
            <p className="text-gradient text-lg font-bold">
              {orgRequesting.orgName}
            </p>
            <p>Email: {orgRequesting.user.email}</p>
            <p className="mb-5">Phone Number: {orgRequesting.phoneNumber}</p>
            <p className="italic text-primary">Bio</p>
            <p
              className="mb-10"
              style={{
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                hyphens: "auto",
              }}
            >
              {orgRequesting.bio}
            </p>

            <p className="italic text-primary">Email Content</p>
            <p
              className="mb-10"
              style={{
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                hyphens: "auto",
              }}
            >
              {body}
            </p>

            <div className="flex gap-4">
              <button
                className="btn-active w-1/2 px-16 py-2"
                onClick={() => handleApproveVol()}
              >
                Confirm
              </button>

              <button
                className="btn-outline w-1/2 px-16 py-2"
                style={{ color: "var(--red)", borderColor: "var(--red)" }}
                onClick={() => handleDiscard()}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
        {/* <button onClick={() => alert(orgRequesting.id)}>buton</button> */}
      </AccordionDetails>
    </Accordion>
  );
};

export default SponsorsList;
