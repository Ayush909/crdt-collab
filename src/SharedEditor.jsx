import { yText } from "./yjssetup";
import { useEffect, useState } from "react";

const SharedEditor = () => {
  const [value, setValue] = useState(yText.toString());

  useEffect(() => {
    const observer = () => {
      setValue(yText.toString());
    };
    yText.observe(observer);

    return () => {
      yText.unobserve(observer);
    };
  }, []);

  const handleChange = (event) => {
    const newValue = event.target.value;
    yText.delete(0, yText.length);
    yText.insert(0, newValue);
  };

  console.log("Rendering SharedEditor with value:", value);

  return <textarea value={value} onChange={handleChange} rows={5} cols={40} />;
};

export default SharedEditor;
