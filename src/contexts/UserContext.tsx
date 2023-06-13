// import { createContext, useContext, useState } from "react";
// import { User } from "../App";

// const UserContext = createContext<User>({
//   id: "",
//   firstName: "",
//   lastName: "",
//   birthdate: null,
//   imageUrl: "",
// });
// const UserContextUpdater = createContext(null);

// export function getUserContext() {
//   return UserContext;
// }

// export function updateUserContext() {
//   return UserContextUpdater;
// }

// export function UserProvider({ children }) {
//   const [user, setUser] = useState<User>({
//     id: "",
//     firstName: "",
//     lastName: "",
//     birthdate: null,
//     imageUrl: "",
//   });

//   function setUserContext(newUser: User) {
//     setUser(newUser);
//   }

//   return (
//     <UserContext.Provider value={user}>
//       <UserContextUpdater.Provider value={setUserContext}>
//         {children}
//       </UserContextUpdater.Provider>
//     </UserContext.Provider>
//   );
// }
