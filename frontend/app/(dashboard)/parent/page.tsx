"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuth } from "@/components/layout/providers";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { User, FileText, Calendar, ShieldCheck, DownloadCloud } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ParentDashboardPage() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ["parent-dashboard"],
    queryFn: () => api<any>("/parents/me", { token }),
    enabled: !!token,
  });

  const student = data?.student;
  const achievements = data?.achievements || [];
  const documents = data?.documents || [];

  const downloadMutation = useMutation({
    mutationFn: (id: string) => api<{ downloadUrl: string }>(`/documents/${id}/download-url`, { token }),
    onSuccess: (payload) => {
      if (payload?.downloadUrl) {
        window.open(payload.downloadUrl, "_blank", "noopener,noreferrer");
      }
    },
  });

  return (
    <DashboardShell
      title="Parent dashboard"
      subtitle="View your connected child's academic profile, achievements, and documents."
      nav={[{ label: "Overview", href: "/parent" }]}
    >
      {/* ── Status Banner ── */}
      <div className="flex items-center gap-3 mb-2 animate-fade-up">
        <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 rounded-full text-[10px] font-bold text-brand-600 uppercase tracking-widest">
          <ShieldCheck size={12} />
          Parental Access Active
        </div>
      </div>

      {/* STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <StatCard label="Child ID" value={student?.studentId ?? "-"} helper="Connected profile" />
        <StatCard label="Department" value={student?.department ?? "-"} helper="Academic branch" />
        <StatCard label="CGPA" value={student?.cgpa ?? "-"} helper="Cumulative GPA" />
        <StatCard label="Achievements" value={achievements.length} helper="Verified entries" />
      </section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
        
        {/* STUDENT PROFILE CARD */}
        <div className="bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:border-brand-100 transition-colors">
          <div className="p-5 sm:p-6 bg-gradient-to-br from-brand-50/50 to-white border-b border-surface-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-display text-2xl font-semibold border-2 border-white shadow-md">
              {student?.fullName?.[0] ?? "S"}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-0.5">
                 <h2 className="font-display font-semibold text-xl text-ink truncate leading-tight tracking-tight">{student?.fullName}</h2>
                 <span className="shrink-0 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[8px] font-bold uppercase tracking-widest">VERIFIED</span>
               </div>
               <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter truncate">{student?.program} &bull; {student?.department}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-surface-50">
            {[
              { label: "Program",   value: student?.program },
              { label: "Admission", value: student?.admissionCategory },
              { label: "Year",      value: student?.year },
              { label: "Semester",  value: student?.semester },
              { label: "Grad Year", value: student?.graduationYear },
              { label: "Backlogs",  value: student?.backlogs ?? 0 },
            ].map((f, i) => (
              <div key={i} className="bg-white p-3.5 flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{f.label?.slice(0, 8)}</span>
                <span className="text-xs font-semibold text-ink truncate">{f.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENTS CARD */}
        <div className="bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-sm hover:border-brand-100 transition-colors">
          <div className="px-5 py-3 border-b border-surface-50 flex items-center justify-between bg-surface-50/30">
            <h3 className="font-sans text-[10px] font-bold text-ink flex items-center gap-2 uppercase tracking-widest">
              <FileText size={14} className="text-brand-500" />
              Shared Documents
            </h3>
            <span className="text-[9px] font-bold text-slate-400 px-2 py-0.5 bg-white rounded-full border border-surface-50">
              {documents.length} FILES
            </span>
          </div>
          <div className="p-3 flex flex-col gap-2">
             {documents.length === 0 ? (
               <div className="text-center py-8 text-slate-400 text-[11px] font-bold border border-dashed border-surface-100 rounded-2xl uppercase tracking-tighter">
                 No docs shared
               </div>
             ) : (
               documents.map((doc: any, i: number) => (
                 <div key={doc._id} className="group flex items-center gap-3 p-2.5 rounded-2xl border border-surface-50 hover:bg-brand-50/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-surface-50 text-slate-400 flex items-center justify-center group-hover:bg-white transition-colors">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-xs text-ink truncate leading-tight tracking-tight">{doc.title}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{doc.type?.slice(0, 15)}</p>
                    </div>
                    <button 
                      className="p-2 rounded-xl text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                      onClick={() => downloadMutation.mutate(doc._id)}
                    >
                      <DownloadCloud size={14} />
                    </button>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>

      {/* ACHIEVEMENT TIMELINE CARD */}
      <div className="mt-6 bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-sm animate-fade-up hover:border-brand-100 transition-all" style={{ animationDelay: "150ms" }}>
        <div className="px-5 py-3 border-b border-surface-50 flex items-center justify-between bg-surface-50/20">
           <h3 className="font-sans text-[10px] font-bold text-ink flex items-center gap-2 uppercase tracking-widest">
            <Calendar size={14} className="text-brand-500" />
            Achievement History
          </h3>
        </div>
        <div className="p-0 overflow-x-auto">
           {achievements.length === 0 ? (
             <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest italic">
               No entries found.
             </div>
           ) : (
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50/10">
                    <th className="px-6 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-surface-50">Achievement details</th>
                    <th className="px-6 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-surface-50">Awarded</th>
                    <th className="px-6 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-surface-50">State</th>
                    <th className="px-6 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-surface-50 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50">
                  {achievements.map((item: any) => {
                    const statusClass = STATUS_STYLE[item.status] || "bg-slate-50 text-slate-500 border-slate-100";
                    return (
                      <tr key={item._id} className="hover:bg-brand-50/10 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-0.5">
                             <div className="font-display font-semibold text-ink text-xs tracking-tight">{item.title}</div>
                             <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-tighter">{item.category}</div>
                             <p className="text-[10px] text-slate-400 leading-snug mt-1 max-w-md line-clamp-2">{item.description}</p>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-widest shadow-sm", statusClass)}>
                             {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button
                             disabled={!item.certificateUrl}
                             className={cn(
                               "p-2 rounded-xl transition-all shadow-sm",
                               item.certificateUrl 
                                 ? "bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white border border-brand-100" 
                                 : "bg-surface-50 text-slate-300 border border-surface-50 cursor-not-allowed"
                             )}
                             onClick={() => item.certificateUrl && window.open(item.certificateUrl, "_blank")}
                           >
                             <DownloadCloud size={16} />
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
             </table>
           )}
        </div>
      </div>
    </DashboardShell>
  );
}
