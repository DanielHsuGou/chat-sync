import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetch(`/api/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
          } else {
            setMessage(data.message);
          }
        })
        .catch((error) => {
          setMessage("Error verifying email");
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}
