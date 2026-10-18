import LoginPage from "@/components/template/Login";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return (
    <div>
      <LoginPage />
    </div>
  );
}

export default page;
