import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  );
}
