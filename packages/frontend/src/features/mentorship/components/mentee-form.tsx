import MentorshipForm from './common/mentorship-form';

const MenteeForm = () => {
  return (
    <div className="flex w-full justify-center">
      <MentorshipForm
        title="Apply to be a Mentee"
        description="Why do you want to be mentored?"
      />
    </div>
  );
};

export default MenteeForm;
