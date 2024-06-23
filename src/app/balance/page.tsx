import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import Balance from "@/src/components/balance";
import { redirect } from "next/navigation";

const BalancePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  if (!session.user.name) {
    return;
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id, name: session.user.name },
    select: { balance: true },
  });

  const initialBalance = user?.balance ? Number(user.balance) : 0;

  return (
    <main className="bg-black">
      <Balance
        initialBalance={initialBalance}
        userId={session.user.id}
        name={session.user.name}
      />
    </main>
  );
};

export default BalancePage;