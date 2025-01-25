import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { SharedIcons } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { FileEdit } from './file-edit';
import Image from 'next/image';

interface FileWithPreview extends File {
  preview?: string;
}

interface UploadStatus {
  progress: number;
  error?: string;
  success?: boolean;
}

interface FileUploadProps {
  maxSize?: number;
  acceptedFileTypes?: Record<string, string[]> | string[];
  maxFiles?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  uploadIcon?: keyof typeof SharedIcons;
  title?: string;
  disablePreview?: boolean;
}

export const FileUpload = ({
  maxSize = 5,
  acceptedFileTypes = {
    'image/*': []
  },
  maxFiles = 5,
  multiple = true,
  onUpload,
  uploadIcon = 'uploadCloud',
  title = 'Upload Files',
  disablePreview = false
}: FileUploadProps) => {
  const normalizedAcceptedTypes = Array.isArray(acceptedFileTypes)
    ? acceptedFileTypes.reduce((acc, type) => {
        const mimeType = {
          PNG: { 'image/png': [] },
          JPG: { 'image/jpeg': [] },
          JPEG: { 'image/jpeg': [] },
          SVG: { 'image/svg+xml': [] }
        }[type.toUpperCase()];
        return { ...acc, ...mimeType };
      }, {})
    : acceptedFileTypes;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, UploadStatus>
  >({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleDrop = async (acceptedFiles: File[]) => {
    const filesToProcess = multiple ? acceptedFiles : [acceptedFiles[0]];

    const validFiles = filesToProcess.filter((file) => {
      const isValidType = Object.keys(normalizedAcceptedTypes).some((type) => {
        if (type.includes('*')) {
          return file.type.startsWith(type.split('/')[0]);
        }
        return file.type === type;
      });

      if (!isValidType) {
        setUploadStatus((prev) => ({
          ...prev,
          [file.name]: {
            progress: 0,
            error: `Invalid file type. Accepted types: ${
              Array.isArray(acceptedFileTypes)
                ? acceptedFileTypes.join(', ')
                : Object.keys(acceptedFileTypes).join(', ')
            }`
          }
        }));
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file) =>
      Object.assign(file, {
        preview:
          !disablePreview && file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined
      })
    );

    setFiles((prev) =>
      multiple ? [...prev, ...newFiles].slice(0, maxFiles) : newFiles
    );

    if (onUpload) {
      for (const file of newFiles) {
        setUploadStatus((prev) => ({
          ...prev,
          [file.name]: { progress: 0 }
        }));

        try {
          await onUpload([file]);
          setUploadStatus((prev) => ({
            ...prev,
            [file.name]: { progress: 100, success: true }
          }));
        } catch (error) {
          setUploadStatus((prev) => ({
            ...prev,
            [file.name]: {
              progress: 0,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          }));
        }
      }
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.name === fileName);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((file) => file.name !== fileName);
    });

    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  return (
    <div className="w-full">
      <Dropzone
        onDrop={handleDrop}
        maxSize={maxSize * 1024 * 1024}
        accept={normalizedAcceptedTypes}
        multiple={multiple}
      >
        {({ getRootProps, getInputProps, isDragActive }) => {
          const Icon = SharedIcons[uploadIcon];
          return (
            <div
              {...getRootProps()}
              className={cn(
                'flex h-auto min-h-[286px] w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-4 transition-colors hover:bg-neutral-50',
                isDragActive && 'border-primary bg-primary/5',
                'border-neutral-300'
              )}
            >
              <input {...getInputProps()} />
              <h6 className="mb-6">{title}</h6>

              {files.length === 0 ? (
                <>
                  <Icon className="mb-4 h-10 w-10 text-neutral-500" />
                  <div className="text-center">
                    <p className="mt-6">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="mt-2 text-sm text-neutral-500">
                      Max file size: {maxSize}MB |{' '}
                      {multiple ? `Up to ${maxFiles} files` : 'Single file'} |
                      Supported Formats:{' '}
                      {Object.values(acceptedFileTypes).join(', ')}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex flex-col gap-4 rounded-lg bg-neutral-50 px-3"
                    >
                      {file.preview ? (
                        <Image
                          src={file.preview}
                          alt={file.name}
                          className="mx-auto h-32 w-32 cursor-pointer rounded-full border border-neutral-200 object-cover"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(file.preview ?? null);
                          }}
                        />
                      ) : (
                        <SharedIcons.fileIcon className="mx-auto h-32 w-32 text-neutral-500" />
                      )}

                      <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center justify-between">
                          <p className="flex-1 truncate text-sm font-medium">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2">
                            {uploadStatus[file.name]?.success && (
                              <SharedIcons.checkCircle className="h-5 w-5 text-green-500" />
                            )}
                            {uploadStatus[file.name]?.error && (
                              <SharedIcons.alertCircle className="h-5 w-5 text-red-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.name);
                              }}
                            >
                              <SharedIcons.delete className="h-4 w-4 stroke-error-600" />
                            </Button>
                          </div>
                        </div>

                        {uploadStatus[file.name] && (
                          <div className="flex w-full flex-col gap-1">
                            <Progress
                              value={uploadStatus[file.name].progress}
                              className={cn(
                                'h-2 w-full rounded-full',
                                uploadStatus[file.name].success &&
                                  'bg-green-100 [&>div]:bg-green-500',
                                uploadStatus[file.name].error &&
                                  'bg-red-100 [&>div]:bg-red-500'
                              )}
                            />
                            {!uploadStatus[file.name].error &&
                              !uploadStatus[file.name].success && (
                                <p className="text-base">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              )}

                            {uploadStatus[file.name].error && (
                              <div className="flex items-center gap-2">
                                <p className="text-base text-red-500">
                                  {uploadStatus[file.name].error}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('refresh');
                                  }}
                                >
                                  <SharedIcons.refresh className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {uploadStatus[file.name].success && (
                              <p className="mt-2 text-sm">Upload Successful!</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </Dropzone>

      <FileEdit
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
        selectedImage={selectedImage ?? ''}
      />
    </div>
  );
};
