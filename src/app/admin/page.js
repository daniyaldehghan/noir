import AdminDashboard from "@/components/template/AdminPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session || session.user.role !== "admin") redirect("/");
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}

export default page;
