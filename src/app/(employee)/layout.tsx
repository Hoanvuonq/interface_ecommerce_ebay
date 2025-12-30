import { BaseEmployeeLayout } from "./employee/_layouts";

export default function EmployeeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseEmployeeLayout>
      {children}
    </BaseEmployeeLayout>
  );
}