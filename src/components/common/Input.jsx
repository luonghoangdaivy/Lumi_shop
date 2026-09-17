function Input({ label, placeholder, type = "text", value, onChange, error }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      <input
        className={`form-input ${error ? "input-error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default Input;
