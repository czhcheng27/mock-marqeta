type ClassValue = string | false | null | undefined;

export function joinClasses(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
