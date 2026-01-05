import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = (props) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        className:
          "rounded-xl border backdrop-blur-xl shadow-lg px-4 py-3",
      }}
      style={{
        /* DEFAULT */
        "--normal-bg": "hsl(222 47% 11%)",
        "--normal-text": "hsl(210 40% 98%)",
        "--normal-border": "hsl(217 33% 20%)",

        /* SUCCESS */
        "--success-bg": "rgba(22, 163, 74, 0.15)",
        "--success-text": "rgb(187, 247, 208)",
        "--success-border": "rgba(22, 163, 74, 0.4)",

        /* ERROR */
        "--error-bg": "rgba(220, 38, 38, 0.15)",
        "--error-text": "rgb(254, 202, 202)",
        "--error-border": "rgba(220, 38, 38, 0.4)",

        /* WARNING */
        "--warning-bg": "rgba(234, 179, 8, 0.15)",
        "--warning-text": "rgb(254, 240, 138)",
        "--warning-border": "rgba(234, 179, 8, 0.4)",

        /* INFO */
        "--info-bg": "rgba(59, 130, 246, 0.15)",
        "--info-text": "rgb(191, 219, 254)",
        "--info-border": "rgba(59, 130, 246, 0.4)",

        "--border-radius": "16px",
      }}
      {...props}
    />
  )
}

export { Toaster }
