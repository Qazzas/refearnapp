export const getResponsiveSelectWidth = (isPreview: boolean) => {
  return isPreview
    ? "w-[58px]  min-[425px]:w-[72px] h-8 px-2 text-xs"
    : "w-[70px] xs:w-[80px] m:w-[100px] h-9 px-2 text-sm"
}
export const getResponsiveCardHeight = (isPreview: boolean) => {
  return isPreview ? "h-[400px] xs:h-[360px]" : "h-[540px] m:h-[500px]"
}
