import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#b0f4c2] text-[#005803] font-bold hover:bg-[#a0e4b2] shadow-md transform transition-transform active:translate-y-0.5 active:shadow-sm",
        destructive:
          "bg-gradient-to-b from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 border-2 border-red-800 shadow-md shadow-red-900/50 transform transition-transform active:translate-y-0.5 active:shadow-sm",
        outline:
          "bg-transparent border-2 border-[#005803] text-[#005803] hover:bg-[#b0f4c2]/20 hover:text-[#005803] shadow-md shadow-green-900/30 transform transition-transform active:translate-y-0.5 active:shadow-sm",
        secondary:
          "bg-[#4eea53] text-[#005803] hover:bg-[#3eda43] shadow-md transform transition-transform active:translate-y-0.5 active:shadow-sm",
        ghost:
          "bg-transparent text-[#005803] hover:bg-[#b0f4c2]/20 hover:text-[#005803] transform transition-transform active:translate-y-0.5",
        link: "bg-transparent text-[#005803] underline-offset-4 hover:underline",
        white:
          "bg-[#b0f4c2] text-[#005803] hover:bg-[#a0e4b2] shadow-md transform transition-transform active:translate-y-0.5 active:shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }), "text-white")} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
