// may diff
import Pusher from "pusher";
import PusherClient from "pusher-js";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "ap1",
  useTLS: true,
});

export const pusherclient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: "ap1",
    // encrypted: true,
  }
);
