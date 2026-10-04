import "../../styles/common/input.css";

function Input({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
  required = false,
  disabled = false,
}) {
  return (
    <div className="common-input-group">
      {label && (
        <label htmlFor={name} className="common-input-label">
          {label}

          {required && <span className="common-input-required">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`common-input ${error ? "has-error" : ""}`}
      />

      {error && <span className="common-input-error">{error}</span>}
    </div>
  );
}

export default Input;
