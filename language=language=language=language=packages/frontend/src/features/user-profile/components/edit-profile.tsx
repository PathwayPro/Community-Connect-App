const handleProfilePictureUpload = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // Convert File to string URL or path
    const fileUrl = URL.createObjectURL(files[0]);
    methods.setValue("pictureUploadLink", fileUrl, { shouldValidate: true });
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

const handleResumeUpload = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // Convert File to string URL or path
    const fileUrl = URL.createObjectURL(files[0]);
    methods.setValue("resumeUploadLink", fileUrl, { shouldValidate: true });
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
