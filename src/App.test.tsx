import { createMockStore } from "state-decorator/test";
import { config } from "./App";

describe("App", () => {
  const store = createMockStore(config);
  const users = [
    {
      id: "1",
      firstName: "toto",
      lastName: "toto",
      birthdate: "1",
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

    expect(state.users).toBe(users);
    expect(actions.loadUsers).toHaveBeenCalled();
  });

  it("createUser", async () => {
    const user = {
      id: "2",
      firstName: "john",
      lastName: "DOe",
      birthdate: "3",
      imageUrl: "http",
    };
    const { state } = await store
      .setPartialState({ users: [] })
      .getAction("createUser")
      .promiseResolves(user)
      .call("john", "DOe", "3", "http");

    expect(state.users.length).toBe(1);
    expect(state.users[0]).toBe(user);
  });
});
