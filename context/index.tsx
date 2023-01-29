import { GeneralProvider } from "./general/state";
import { TodosProvider } from "./todos/state";
import { TasksProvider } from "./tasks/state";
import { TemplatesProvider } from "./templates/state";

const ContextProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <GeneralProvider>
      <TodosProvider>
        <TemplatesProvider>
          <TasksProvider>{children}</TasksProvider>
        </TemplatesProvider>
      </TodosProvider>
    </GeneralProvider>
  );
};

export default ContextProvider;
