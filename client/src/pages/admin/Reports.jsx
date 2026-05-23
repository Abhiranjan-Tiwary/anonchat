import { useState } from "react";
import Table from "../../components/Table.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";
import { reportRows } from "./pageUtils.jsx";

export default function AdminReports() {
  const token = useAuthStore((state) => state.token);
  const { reports, updateReport } = useAdminStore();
  const { toast } = useToast();
  const [status, setStatus] = useState("all");
  const filtered = reports.filter((report) => status === "all" || report.status === status);

  async function action(reportId, nextAction) {
    await updateReport(token, reportId, nextAction);
    toast("Report updated.", "success");
  }

  return (
    <Card>
      <CardHeader
        title="Reports Queue"
        subtitle="Resolve reported messages with accountable moderation actions."
        action={<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All reports</option><option value="open">Open</option><option value="hidden">Hidden</option><option value="dismissed">Dismissed</option></select>}
      />
      <Table columns={["User", "Report", "Status", "Time", "Actions"]} rows={reportRows(filtered, action)} emptyTitle="No reports" />
    </Card>
  );
}
