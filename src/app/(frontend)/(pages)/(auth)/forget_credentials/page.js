import ForgetPageComponent from "@/app/(frontend)/(components)/forget";
import SlideProvider from "../(slide)/slideProvider";
// import LoggedInSessionCheck from "@/app/(frontend)/(components)/LoggedInSessionCheck";

export const metadata = {
  title: "Account Recovery",
  description: "Account Recovery on Sync",
};

export default function ForgetCreds() {
  return (
    <SlideProvider>
      {/* <LoggedInSessionCheck /> */}
      <ForgetPageComponent />
    </SlideProvider>
  );
}
