const Button = ({ children, className, ...props }) => {
  return (
    <>
      <button
        className={`rounded-full bg-sky-600 px-4 py-1 hover:bg-sky-700 ${className}`}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
