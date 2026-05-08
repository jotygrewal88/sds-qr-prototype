import { redirect } from "next/navigation";

export default function Home() {
  redirect("/admin/access-points");
}
