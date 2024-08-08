import LoginPageComponent from "@/app/(frontend)/(components)/login";
import "@/app/(frontend)/(components)/slide.css";
import SlideProvider from "../(slide)/slideProvider";
import { AuthProvider } from "@/app/AuthProvider";
import LoggedInSessionCheck from "@/app/(frontend)/(components)/LoggedInSessionCheck";

export const metadata = {
  title: "Sign In to Sync",
  description: "Account Sign-in",
};

export default async function LoginPage() {
  return (
    <AuthProvider>
      <LoggedInSessionCheck />
      <SlideProvider>
        <LoginPageComponent />
      </SlideProvider>
    </AuthProvider>
  );
}
