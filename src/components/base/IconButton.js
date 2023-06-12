const IconButton = ({ icon: Icon, className, red, ...props }) => {
  return (
    <>
      <button
        className={`rounded-md p-0.5 opacity-80 hover:opacity-100 ${
          !red ? `bg-zinc-900/50` : `bg-red-900/80`
        } ${className}`}
        {...props}
      >
        <Icon className="w-6" />
      </button>
    </>
  );
};

export default IconButton;
