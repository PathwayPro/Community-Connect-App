import { FileUpload } from '@/shared/components/upload/file-upload';

export const UploadResume = () => {
  return (
    <div>
      <FileUpload
        title="Upload your Resume"
        maxSize={10} // 10MB
        acceptedFileTypes={['JPG', 'PNG', 'PDF']}
        multiple={false}
        uploadIcon="fileIcon"
        disablePreview={true}
        onUpload={async (files) => {
          // Implement your upload logic here
          // e.g., using FormData and fetch
          const formData = new FormData();
          files.forEach((file) => formData.append('files', file));

          await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
        }}
      />
    </div>
  );
};
