"use client"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { useState } from "react"

interface FeatureDemoProps {
  videoId: string
  title: string
  description?: string
  affiliate?: boolean
}

export function FeatureDemo({
  videoId,
  title,
  description,
  affiliate = false,
}: FeatureDemoProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0 shadow-sm"
        title="Watch Demo"
      >
        <Play className="w-4 h-4 fill-current ml-0.5" />
      </Button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        affiliate={affiliate}
        showFooter={false}
      >
        <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden border bg-black">
          <iframe
            src={`https://www.loom.com/embed/${videoId}`}
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </AppDialog>
    </>
  )
}
