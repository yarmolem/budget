import { trpc } from '@/trpc/server'
import { Button } from '@/components/ui/button'
import { Hello } from '@/components/shared/hello'
import { UserList } from '@/components/shared/user-list'

export default async function Home() {
  const data = await trpc.hello({ name: 'SERVER' })

  return (
    <>
      <h1 className="text-4xl font-bold">{data}</h1>
      <Hello />
      <UserList />
      <Button>Click me</Button>
    </>
  )
}
