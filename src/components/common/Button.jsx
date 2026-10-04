import "../../styles/common/button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  const className = [
    "common-button",
    `common-button-${variant}`,
    `common-button-${size}`,
    fullWidth ? "common-button-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
