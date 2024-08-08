import { BiError } from "react-icons/bi";

// predefine object structure for the given 'props' object
interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  // display nothing when value for 'message' is not provided
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <BiError className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
