import { notFound } from 'next/navigation';
import { reports, getReport } from '@/lib/reports';
import { WizardShell } from '@/components/wizard/WizardShell';

export function generateStaticParams() {
  return reports.map((r) => ({ id: r.id }));
}

export default function WizardPage({ params }: { params: { id: string } }) {
  const report = getReport(params.id);
  if (!report) notFound();
  return <WizardShell report={report} />;
}
