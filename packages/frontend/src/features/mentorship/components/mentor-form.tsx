import MentorshipForm from './common/mentorship-form';

const MentorForm = () => {
  return (
    <div className="flex w-full justify-center">
      <MentorshipForm
        title="Apply to be a Mentor"
        description="Have you provided mentorship in other organizations (yes or no)? If yes, provide details (optional)"
      />
    </div>
  );
};

export default MentorForm;
