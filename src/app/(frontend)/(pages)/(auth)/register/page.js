import RegisterPageComponent from "@/app/(frontend)/(components)/register";
import "@/app/(frontend)/(components)/slide.css";
import SlideProvider from "../(slide)/slideProvider";
import "@/app/(frontend)/(components)/slide.css";
// import LoggedInSessionCheck from "@/app/(frontend)/(components)/LoggedInSessionCheck";

export const metadata = {
  title: "Sign Up For an Account on Sync!",
  description: "Account Signup on Sync",
};

export default async function RegisterPage() {
  return (
    <SlideProvider>
      {/* <LoggedInSessionCheck /> */}
      <RegisterPageComponent />
    </SlideProvider>
  );
}
