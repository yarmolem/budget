'use client'

import z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InputSecure } from '@/components/ui/input-secure'

import { signIn } from '@/lib/auth-client'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

const SignInPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'cris@dev.com',
      password: 'Admin123'
    }
  })

  async function onSubmit(values: FormValues) {
    await signIn.email(
      {
        email: values.email,
        password: values.password
      },
      {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: () => {
          setLoading(false)
          router.replace('/dashboard')
        },
        onError: (error) => {
          setLoading(false)
          toast.error(error.error.message)
          console.log({ msg: error.error.message })
        }
      }
    )
  }

  return (
    <Card className="w-[90vw] max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>

        <CardDescription>
          Enter your credentials below to sign in
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputSecure placeholder="*********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button isLoading={loading} type="submit" className="mt-6 w-full">
              Sign in
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="text-primary underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SignInPage
