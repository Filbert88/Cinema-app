import Popup from "../components/popup";
import  Mainpage  from "./mainPage/page";
// import Mainpage from "../components/mainPage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 sm:p-10 bg-black">
      <Mainpage />
    </main>
  );
}
