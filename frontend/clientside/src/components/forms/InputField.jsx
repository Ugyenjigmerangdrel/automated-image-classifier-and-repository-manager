const InputField = ({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  nameValue,
}) => (
  <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition">
    {Icon && <Icon className="text-gray-500 mr-3" size={20} />}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={nameValue}
      className="bg-transparent outline-none flex-1 text-gray-800"
    />
  </div>
);

export default InputField;
