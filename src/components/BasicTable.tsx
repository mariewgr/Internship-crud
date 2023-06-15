import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { User } from "../contexts/UsersContext";
import UserRow from "./UserRow";

type BasicTableProps = {
  users: User[];
};

export default function BasicTable(p: BasicTableProps) {
  const rows = ["Name", "Birthdate", "Actions"];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {rows.map((row) => (
              <TableCell align="center">
                <p style={{ fontWeight: "bold" }}>{row}</p>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {p.users.map((user: User) => (
            <UserRow user={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
