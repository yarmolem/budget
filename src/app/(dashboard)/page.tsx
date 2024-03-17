"use client";

import { useSession } from "next-auth/react";
import React from "react";

const DashboardHome = () => {
  const session = useSession();

  return (
    <div>
      <h1>Bienvenido: {session.data?.user.name}</h1>
    </div>
  );
};

export default DashboardHome;
