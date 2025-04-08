'use client'

import z from 'zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/trpc/react'

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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InputSecure } from '@/components/ui/input-secure'
import toast from 'react-hot-toast'
import Link from 'next/link'

const formSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1)
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'Passwords do not match'
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

const SignUpPage = () => {
  const router = useRouter()
  const register = api.auth.register.useMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  async function onSubmit(values: FormValues) {
    register.mutate(values, {
      onSuccess: (data) => {
        if (!data.id) {
          toast.error('User not created')
          return
        }

        form.reset()
        router.push('/sign-in')
        toast.success('User created')
      },
      onError: (error) => {
        console.log('[ERROR_REGISTER]: ', error)
        toast.error(error.message)
      }
    })
  }

  return (
    <Card className="w-[90vw] max-w-sm">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>

        <CardDescription>
          Enter your credentials below to sign up
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jdoe@dev.com"
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
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <InputSecure placeholder="*********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              isLoading={register.isPending}
            >
              Sign up
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-primary underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SignUpPage
