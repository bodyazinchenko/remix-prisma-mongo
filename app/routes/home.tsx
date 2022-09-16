import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/Layout";
import { UserPanel } from "~/components/UserPanel";
import { getOtherUsers } from "~/utils/user.server";
import { getFilteredKudos } from "~/utils/kudos.server";
import { Kudo } from "~/components/Kudo";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const otherUsers = await getOtherUsers(userId)
  const kudos = await getFilteredKudos(userId, {}, {})
  return json({ users: otherUsers, kudos })
}

export default function Home() {
  const { users, kudos } = useLoaderData();
  console.log('kudos', kudos)
  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          {/* Search Bar Goes Here */}
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {kudos.map((kudo) => (
                <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
              ))}
            </div>
            {/* Recent Kudos Goes Here */}
          </div>
        </div>
      </div>
    </Layout>
  )
}