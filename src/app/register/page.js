import RegisterPage from "@/components/template/Register";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function page() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return (
    <div>
      <RegisterPage />
    </div>
  );
}

export default page;
