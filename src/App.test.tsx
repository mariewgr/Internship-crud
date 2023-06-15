import { createMockStore } from "state-decorator/test";
import { User, config } from "./contexts/UsersContext";
import { filteredUsers } from "./components/HomePage";
import { configHomePage } from "./components/HomePage";
import dayjs from "dayjs";

describe("UsersContext", () => {
  const store = createMockStore(config);
  const users: User[] = [
    {
      id: "1",
      firstName: "toto",
      lastName: "toto",
      birthdate: null,
      imageUrl: "http",
    },
  ];
  it("setUsers", async () => {
    const { state } = await store
      .setPartialState({ users: [] })
      .getAction("setUsers")
      .call(users);

    expect(state.users).toBe(users);
  });

  it("loadUsers", async () => {
    const { state } = await store
      .setPartialState({ users })
      .getAction("loadUsers")
      .promiseResolves({ total: 10, users: users, count: 2 })
      .call();

    expect(state.users).toBe(users);
  });

  it("deleteUser", async () => {
    const { state, actions } = await store
      .setPartialState({ users: users })
      .getAction("deleteUser")
      .promiseResolves({ deleted: "ok" })
      .call("1");

    expect(state.users).toStrictEqual([]);
  });

  it("createUser", async () => {
    const user = {
      id: "2",
      firstName: "john",
      lastName: "DOe",
      birthdate: null,
      imageUrl: "http",
    };
    const { state } = await store
      .setPartialState({ users: [] })
      .getAction("createUser")
      .promiseResolves(user)
      .call("1", "john", "DOe", null, "http");

    expect(state.users.length).toBe(1);
    expect(state.users[0]).toBe(user);
  });
  it("updateUser", async () => {
    const user = {
      id: "2",
      firstName: "john",
      lastName: "DOe",
      birthdate: null,
      imageUrl: "http",
    };

    const expectedUser = {
      id: "2",
      firstName: "john",
      lastName: "Doe2",
      birthdate: null,
      imageUrl: "http",
    };
    const { state } = await store
      .setPartialState({ users: [user] })
      .getAction("updateUser")
      .promiseResolves(expectedUser)
      .call("2", "john", "Doe2", null, "http");

    expect(state.users[0].lastName).toBe("Doe2");
  });
});

describe("Filers and search", () => {
  const store = createMockStore(configHomePage);
  const users: User[] = [
    {
      id: "1",
      firstName: "toto",
      lastName: "toto",
      birthdate: null,
      imageUrl: "http",
    },
    {
      id: "1",
      firstName: "tata",
      lastName: "tata",
      birthdate: dayjs(),
      imageUrl: "http",
    },
  ];
  it("searchBar", async () => {
    const { state } = await store.getAction("setUsers").call(users);

    const newUsers = filteredUsers(users, false, 0, "to");

    expect(newUsers.length).toBe(1);
    expect(newUsers[0].firstName).toBe("toto");
  });
  it("checkBox", async () => {
    const { state } = await store.getAction("setUsers").call(users);

    const newUsers = filteredUsers(users, true, 0, "");

    expect(newUsers.length).toBe(1);
  });
  it("yearFilter", async () => {
    const { state } = await store.getAction("setUsers").call(users);

    const newUsers = filteredUsers(users, false, 2023, "");

    expect(newUsers.length).toBe(1);
  });
});
