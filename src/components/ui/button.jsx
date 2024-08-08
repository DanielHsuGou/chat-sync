import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-primary-foreground transition-all hover:shadow-md hover:shadow-blue-400 duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-white border-2 border-blue-500 hover:border-blue-500 transition-all hover:shadow-md hover:shadow-blue-400 duration-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        solid:
          "bg-white border-2 border-blue-500 hover:border-blue-500 transition-all hover:shadow-md hover:shadow-sky-200 duration-200",
        black:
          "bg-gray-500 text-primary-foreground transition-all hover:shadow-md hover:shadow-gray-400 duration-200",
        red: "bg-red-400 text-primary-foreground transition-all hover:shadow-md hover:shadow-red-400 duration-200",
        unset: "hover:bg-sky-400 hover:text-white",
        active:
          "bg-indigo-500 text-primary-foreground transition-all duration-200",
        grey: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        round: "h-12 rounded-3xl px-8 hover:h-16",
        icon: "h-10 w-10",
        friend: "px-3 py-1 lg:text-base text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
