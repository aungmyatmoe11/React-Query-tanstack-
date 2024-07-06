import { useState } from "react";
export const TodoCard = ({ todo }) => {
  const [checked, setChecked] = useState(todo.completed);
  return (
    <div>
      {todo.title}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  );
};
