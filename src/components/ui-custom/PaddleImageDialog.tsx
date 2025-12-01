import { AppDialog } from "@/components/ui-custom/AppDialog"
import { usePaddleImage } from "@/provider/PaddleImageProvider"
import Image from "next/image"

export function PaddleImageDialog() {
  const { dialogOpen, selectedImage, setDialogOpen } = usePaddleImage()

  return (
    <AppDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      affiliate={false}
      showFooter={false}
      title="Preview"
    >
      {selectedImage && (
        <div className="flex justify-center items-center w-full">
          <Image
            src={selectedImage}
            alt="Preview"
            width={1600}
            height={1000}
            className="
              rounded-lg
              w-full
              max-w-3xl
              max-h-[85vh]
              object-contain
            "
          />
        </div>
      )}
    </AppDialog>
  )
}
