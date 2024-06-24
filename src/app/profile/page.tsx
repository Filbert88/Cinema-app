import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import Profile from "@/src/components/profile";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, email: true }
  });

  const userBalance = user?.balance ? Number(user.balance) : 0;
  const userEmail = user?.email || '';  
  const userName = session.user.name ?? '';

  return (
    <main className="bg-black">
      <Profile
        name={userName}
        balance={userBalance}
        email={userEmail}
      />
    </main>
  );
};

export default ProfilePage;
