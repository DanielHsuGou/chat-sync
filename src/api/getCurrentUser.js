import { getSession } from "next-auth/react";
import { getUsers } from "./getUsers";

export default async function getCurrentUser() {
  const session = await getSession();
  //   console.log("Session:", session.user.email);
  const users = await getUsers();
  //   console.log("user:", users.user);
  if (session) {
    const user = users.user.find((u) => u.email === session.user.email);
    if (user) {
      return user;
    }
  }
}
