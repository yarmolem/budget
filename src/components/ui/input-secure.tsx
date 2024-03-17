import React, { type ElementRef, type ComponentPropsWithRef } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "./input";

const InputSecure = React.forwardRef<
  ElementRef<typeof Input>,
  ComponentPropsWithRef<typeof Input>
>(({ type: _type, ...props }, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <Input
      ref={ref}
      type={show ? "text" : "password"}
      rightIcon={
        <button type="button" onClick={() => setShow((x) => !x)}>
          {show ? <EyeOff /> : <Eye />}
          <span className="sr-only">
            {show ? "Hide password" : "Show password"}
          </span>
        </button>
      }
      {...props}
    />
  );
});
InputSecure.displayName = "InputSecure";

export { InputSecure };
