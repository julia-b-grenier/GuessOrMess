import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const DeckUpload = () => {
  const toast = useRef<Toast>(null);

  const onUpload = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <FileUpload
        mode="basic"
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        maxFileSize={1000000}
        onUpload={onUpload}
      />
    </div>
  );
};

export default DeckUpload;
