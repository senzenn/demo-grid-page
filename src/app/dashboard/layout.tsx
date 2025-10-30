export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col pt-20 md:pt-24">
      {children}
    </main>
  );
}

