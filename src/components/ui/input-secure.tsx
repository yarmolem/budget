import React, { type ComponentPropsWithRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from './input'

type InputSecureProps = Omit<ComponentPropsWithRef<typeof Input>, 'type'>

const InputSecure = (props: InputSecureProps) => {
  const [show, setShow] = React.useState(false)

  return (
    <Input
      type={show ? 'text' : 'password'}
      rightIcon={
        <button type="button" onClick={() => setShow((x) => !x)}>
          {show ? <EyeOff /> : <Eye />}
          <span className="sr-only">
            {show ? 'Hide password' : 'Show password'}
          </span>
        </button>
      }
      {...props}
    />
  )
}

export { InputSecure }
