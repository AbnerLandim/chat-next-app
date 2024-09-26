import { Dispatch, SetStateAction } from "react";

export const handlePasteItem =
  (e: ClipboardEvent) => (setPreview: Dispatch<SetStateAction<string>>) => {
    const clipboardItems = e?.clipboardData?.items;
    const items = [].slice
      .call(clipboardItems)
      .filter((each: any) => /^image\//.test(each.type));

    if (items.length === 0) return;

    const item: any = items[0];
    const blob = item.getAsFile();

    const srcFromImg = URL.createObjectURL(blob);
    setPreview(srcFromImg);
    const file = new File([blob], "file name", {
      type: "image/jpeg",
      lastModified: new Date().getTime(),
    });
    const container = new DataTransfer();
    container.items.add(file);
    const filesForInput = container.files;
    const filesElement: any = document.querySelector("#file_input");
    filesElement.files = filesForInput;
  };
