import { redirect } from "next/navigation";
import { isAdmin } from "./auth";

export async function requireAdmin(locale: string) {
  if (!(await isAdmin())) {
    redirect(`/${locale}/admin/login`);
  }
}
