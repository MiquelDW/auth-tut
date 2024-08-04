// Layout Component that wraps around all routes inside folder 'auth'
// it ensures a consistent layout for all routes within the folder 'auth'
// this Layout component will be given to the Root Layout component as a child
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      {children}
    </div>
  );
};

export default AuthLayout;
