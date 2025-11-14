import { signOut } from "next-auth/react";

signOut({ callbackUrl: "/admin/login" });
