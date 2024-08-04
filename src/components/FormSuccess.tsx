import { RxCheckCircled } from "react-icons/rx";

// predefine object structure for the given 'props' object
interface FormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <RxCheckCircled className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
