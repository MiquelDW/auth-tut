import { FaExclamationTriangle } from "react-icons/fa";
import CardWrapper from "./CardWrapper";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <FaExclamationTriangle className="h-7 w-7 text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
