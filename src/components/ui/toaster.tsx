import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

/** Ensure description is a valid React child (string/number). Objects like { msg } from APIs must not be rendered directly. */
function toToastDescription(description: React.ReactNode): React.ReactNode {
  if (description == null) return null
  if (typeof description === 'object' && !React.isValidElement(description) && !Array.isArray(description)) {
    const obj = description as any
    if (typeof obj.msg === 'string') return obj.msg
    if (typeof obj.message === 'string') return obj.message
    return JSON.stringify(description)
  }
  return description
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const safeDescription = toToastDescription(description)
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {safeDescription != null && safeDescription !== '' && (
                <ToastDescription>{safeDescription}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
