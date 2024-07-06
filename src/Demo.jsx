import { useState } from "react";
import { addTodo, fetchTodos } from "./api";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { TodoCard } from "./components/TodoCard";
import { useNavigate } from "react-router-dom";

export const Demo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);

  // todos => ["todos"]
  // todos/1 => ["todos" , todo.id]
  // todos?useId=1 => ["todos", {userId : 1}]
  // todos/2/comments => ["todos", todo.id, comments]

  const { data: todos, isLoading } = useQuery({
    // enabled : true,// ! ennabled true hma call validation pone san myo
    queryKey: ["todos", { search }],
    // keepPreviousData : true, // ! for pagination
    queryFn: (obj) => {
      console.log(obj);
      return fetchTodos(search);
    },
    staleTime: Infinity, // ! mean cache phan htr tr
    cacheTime: 0, // ! cache ma phan tp tr
    // refetchInterval : 1000, // ! every 1 sec refreshing
    // initialData: [{ id: 1, title: "inital data" }], // ! Initial data will never fetch back , use for raw bind
    // placeholderData : [{ id: 1, title: "Placeholder data" }], // ! placeholder data will bind later
    // refetchOnWindowFocus : false
  });

  // ! with query detail
  // const queries = useQueries({
  //   queries : (todos ?? [])?.map(todo => {
  //     return {
  //       queryKey : ['todos', todo.id],
  //       queryFn: () => getDetail(todo.id)
  //     }
  //   })
  // })

  // ! prefetch data
  // function onHoverFetch () {
  //   queryClient.prefetchQuery({
  //     queryKey : ['todos', 1],
  //     queryFn : () => getDetail(1)
  //   })
  // }

  const { mutateAsync: addTodoMutation, isLoading: addIsLoading } = useMutation(
    {
      mutationFn: addTodo,
      onSuccess: (newTodo, variables, context) => {
        console.log(newTodo, variables, context);
        queryClient.invalidateQueries({ queryKey: ["todos"] }); // ! for normal one page
        // ? if create and want to go created page do this
        // queryClient.setQueryData(['todos', newTodo.id], newTodo);
        // navigate(`/todos/${newTodo.id}`);
      },
      // onMutate: (variables) => { // ! ma p kim mr lote lox ya tr
      //   console.log(`mutate_${JSON.stringify(variables)}`);
      //   return Object.assign(variables, { a: "asdf" });
      // },
      // retry : 3,// ! retry
    }
  );

  // const { data: paginateTodo, isLoading:paginateLoading,isPreviousData} = useQuery({
  //     queryKey : ["paginateTodo", {page}],
  //     keepPreviousData : true,
  //     queryFn : () => getPaginateData(page)
  // });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <small>{isPreviousData && 'Previous Data'}</small> */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          disabled={addIsLoading}
          onClick={async () => {
            try {
              await addTodoMutation({ title });
              setTitle("");
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Add Todo
        </button>
      </div>
      {todos?.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}

      <br />
      <p>Pagination</p>
      <div></div>
      {/* {data?.nextPage && (
        <button onClick={() => setPage(data?.mextPage)}>Next</button>
      )} */}
    </div>
  );
};
