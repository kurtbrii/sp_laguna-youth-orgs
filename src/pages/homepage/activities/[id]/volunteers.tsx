/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Navbar from "~/components/navbar";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import VolunteersCall from "~/components/VolunteersCall";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";

const CallForVolunteers = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const volunteer = user.data?.volunteer;

  const getPendingOrgOrVol = api.activityCall.getOrgOrVol.useQuery({
    activityId: id as string,
    volId: volunteer?.id,
    status: "PENDING",
  });

  const updateStatus = api.activityCall.updateActivityCall.useMutation();

  // const activityQuery = api.activity?.getOne.useQuery({
  //   id: id as string,
  // });

  const handleAccept = (volId: string) => {
    updateStatus.mutate({
      activityId: id as string,
      volId: volId,
    });
  };

  const rows: any = [];

  getPendingOrgOrVol.data?.map((data, index) => {
    // console.log(data.volunteer?.firstName);

    const pendingData = {
      id: data?.volunteer?.id,
      name: data.volunteer?.firstName,
      sex: data?.volunteer?.sex,
      age: data?.volunteer?.age,
      phoneNumber: data?.volunteer?.phoneNumber,
      action: (
        <IconButton onClick={() => handleAccept(data?.volunteer?.id ?? "")}>
          <AddCircleIcon />
        </IconButton>
      ),
    };

    rows.push(pendingData);
    // <VolunteersCall key={index} volunteer={data?.volunteer} />
  });

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          Call for Volunteers
        </p>
      </section>

      <div className="mx-24 my-12">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Sex</TableCell>
                <TableCell align="right">Age</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell align="right">Add</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.sex}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell align="right">{row.phoneNumber}</TableCell>
                  <TableCell align="right">{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* <div className="flex flex-col p-40">
        <div className="flex justify-around gap-4">
          <p>Name</p>
          <p>Address</p>
          <p>Email Address</p>
        </div>

        {getPendingOrgOrVol.data?.map((data, index) => (
          <VolunteersCall key={index} volunteer={data?.volunteer} />
        ))}
      </div> */}
    </div>
  );
};

export default CallForVolunteers;
