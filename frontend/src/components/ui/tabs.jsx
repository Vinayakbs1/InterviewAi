import React from "react";
import { cn } from "@/lib/utils";

// Create a context for tabs
const TabsContext = React.createContext({
  value: undefined,
  onValueChange: () => {},
});

const Tabs = React.forwardRef(({ className, defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const setValue = isControlled ? onValueChange : setUncontrolledValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
        data-state={value ? "active" : "inactive"}
        data-value={value}
      >
        {React.Children.map(props.children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child, {
            value: child.props.value || value,
            onValueChange: setValue,
          });
        })}
      </div>
    </TabsContext.Provider>
  );
});

const TabsList = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
        className
      )}
      role="tablist"
      {...props}
    />
  );
});

const TabsTrigger = React.forwardRef(
  ({ className, value, onValueChange, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const handleClick = () => {
      if (onValueChange) {
        onValueChange(value);
      } else if (context.onValueChange) {
        context.onValueChange(value);
      }
    };

    const isActive = props["data-state"] === "active" || value === context.value || (onValueChange && value === props.value);

    return (
      <button
        ref={ref}
        role="tab"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",
          className
        )}
        onClick={handleClick}
        data-state={isActive ? "active" : "inactive"}
        {...props}
      />
    );
  }
);

const TabsContent = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext);
    const isSelected = selectedValue === value;
    
    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
          className
        )}
        data-state={isSelected ? "active" : "inactive"}
        {...props}
      />
    );
  }
);

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };