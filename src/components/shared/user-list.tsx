'use client'

import { trpc } from '@/trpc/client'

export function UserList() {
  const { data } = trpc.users.getAll.useQuery()

  return (
    <>
      {data?.map((user) => (
        <div key={user.id}>
          <p>{user.age}</p>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </>
  )
}
