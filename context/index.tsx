import { GeneralProvider } from "./general/state";
import { TodosProvider } from "./todos/state";
import { TasksProvider } from "./tasks/state";

const ContextProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <GeneralProvider>
      <TodosProvider>
        <TasksProvider>{children}</TasksProvider>
      </TodosProvider>
    </GeneralProvider>
  );
};

export default ContextProvider;
