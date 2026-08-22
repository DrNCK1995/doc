import * as React from "react";
import { ParentToolsHeader } from "@/components/layout/parent-tools-header";

export default function ToolsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <ParentToolsHeader title="Child health" />
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
