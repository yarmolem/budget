import { trpc } from '@/trpc/server'
import { Button } from '@/components/ui/button'
import Hello from '@/components/shared/hello'

export default async function Home() {
  const data = await trpc.hello({ name: 'SERVER' })

  return (
    <>
      <h1 className="text-4xl font-bold">{data}</h1>
      <Hello />
      <Button>Click me</Button>
    </>
  )
}
