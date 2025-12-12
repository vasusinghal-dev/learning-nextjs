import Link from "next/link";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard/analytics">Analytics</Link>
          </li>
          <li>
            <Link href="/dashboard/settings">Settings</Link>
          </li>
          <li>
            <Link href="/dashboard/profile">Profile</Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
};
export default DashboardLayout;
