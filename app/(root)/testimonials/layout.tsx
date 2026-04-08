import ProjectHeader from "@/components/ProjectHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black">
      <ProjectHeader />
      <div>{children}</div>
    </div>
  );
}
