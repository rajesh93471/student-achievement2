"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/components/layout/providers";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Award, ExternalLink, MessageSquare, ListFilter, Trash2, CheckSquare } from "lucide-react";

export default function AdminApprovalsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [feedbackById, setFeedbackById] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const { data } = useQuery({
    queryKey: ["admin-approvals"],
    queryFn: () => api<{ achievements: any[] }>("/achievements?status=pending", { token }),
    enabled: !!token,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, recommendedForAward }: { id: string; status: "approved" | "rejected"; recommendedForAward: boolean }) =>
      api(`/achievements/${id}/review`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          status,
          feedback: feedbackById[id] || "",
          recommendedForAward,
        }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });

  const achievements = data?.achievements || [];
  const selectedList = achievements.filter((item, index) => {
    const itemId = item._id || item.id || `achievement-${index}`;
    return selectedIds[itemId];
  });
  const allSelected = achievements.length > 0 && selectedList.length === achievements.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds({});
      return;
    }
    const next: Record<string, boolean> = {};
    achievements.forEach((item, index) => {
      next[item._id || item.id || `achievement-${index}`] = true;
    });
    setSelectedIds(next);
  };

  const approveSelected = async () => {
    for (const item of selectedList) {
      const itemId = item._id || item.id;
      if (!itemId) continue;
      await reviewMutation.mutateAsync({
        id: itemId,
        status: "approved",
        recommendedForAward: false,
      });
    }
    setSelectedIds({});
  };

  return (
    <DashboardShell
      title="Approvals Queue"
      subtitle="Review, approve, and comment on student achievement submissions."
      nav={[
        { label: "Overview", href: "/admin" },
        { label: "Students", href: "/admin/students" },
        { label: "Student achievements", href: "/admin/student-achievements" },
        { label: "Approvals", href: "/admin/approvals" },
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Reports", href: "/admin/reports" },
      ]}
    >
      {/* ── Bulk Actions Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2 animate-fade-up">
        <div className="flex items-center gap-2">
          <button 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
              allSelected ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-white text-slate-500 border-surface-200 hover:border-brand-200 hover:text-brand-600"
            )}
            onClick={toggleSelectAll}
          >
            <CheckSquare size={14} />
            {allSelected ? "DESELECT" : "SELECT ALL"}
          </button>
          
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm disabled:opacity-40"
            disabled={selectedList.length === 0 || reviewMutation.isPending}
            onClick={approveSelected}
          >
            <CheckCircle2 size={14} />
            APPROVE ({selectedList.length})
          </button>
        </div>
        
        <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-full text-[9px] font-bold text-amber-700 uppercase tracking-widest">
          <ListFilter size={10} />
          {achievements.length} PENDING
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex flex-col gap-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {achievements.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-surface-200 rounded-3xl bg-white">
            <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-100" />
            <h3 className="font-display font-semibold text-xl text-ink mb-1">Queue is empty</h3>
            <p className="text-xs text-slate-400 font-medium">All student achievements have been processed.</p>
          </div>
        ) : (
          achievements.map((item, index) => {
            const itemId = item._id || item.id || `achievement-${index}`;
            return (
              <div key={itemId} className="bg-white border border-surface-200 rounded-3xl overflow-hidden hover:border-brand-300 transition-all">
                <div className="px-5 py-3 border-b border-surface-50 bg-surface-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      checked={!!selectedIds[itemId]}
                      onChange={(e) => setSelectedIds(c => ({ ...c, [itemId]: e.target.checked }))}
                    />
                    <div>
                      <h3 className="font-display font-semibold text-base text-ink leading-tight">{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.student?.fullName}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden sm:block"></span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.student?.studentId}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden sm:block"></span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-bold uppercase tracking-widest shrink-0">PENDING</span>
                  </div>
                </div>

                <div className="p-5">
                  {item.description && <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{item.description}</p>}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <MessageSquare size={10} />
                        Review Note
                      </label>
                      <textarea
                        className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-4 py-2.5 text-ink text-sm font-medium outline-none transition-all focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 min-h-[60px] resize-none"
                        placeholder="Add private review note..."
                        value={feedbackById[itemId] || ""}
                        onChange={(e) => setFeedbackById(c => ({ ...c, [itemId]: e.target.value }))}
                      />
                    </div>

                    {item.certificateUrl && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verification</span>
                        <a 
                          href={item.certificateUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center px-4 py-3 rounded-2xl border border-surface-100 bg-surface-50 hover:bg-brand-50 hover:border-brand-200 text-brand-600 transition-all gap-2"
                        >
                          <ExternalLink size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">View Doc</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-surface-50">
                    <button
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-md active:translate-y-0 disabled:opacity-50"
                      disabled={reviewMutation.isPending}
                      onClick={() => reviewMutation.mutate({ id: itemId, status: "approved", recommendedForAward: false })}
                    >
                      <CheckCircle2 size={14} />
                      APPROVE
                    </button>
                    <button
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-[10px] font-bold hover:bg-brand-700 hover:-translate-y-0.5 transition-all shadow-md active:translate-y-0 disabled:opacity-50"
                      disabled={reviewMutation.isPending}
                      onClick={() => reviewMutation.mutate({ id: itemId, status: "approved", recommendedForAward: true })}
                    >
                      <Award size={14} />
                      APPROVE + RECOMMEND
                    </button>
                    <button
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-bold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all disabled:opacity-50"
                      disabled={reviewMutation.isPending}
                      onClick={() => reviewMutation.mutate({ id: itemId, status: "rejected", recommendedForAward: false })}
                    >
                      <XCircle size={14} />
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
