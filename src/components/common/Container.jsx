function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`
        btn
        btn-${variant}
        btn-${size}
        ${fullWidth ? "btn-full" : ""}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
