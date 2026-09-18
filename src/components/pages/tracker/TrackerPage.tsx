"use client";

import { useState, useMemo } from "react";
import { TrackerItem, TrackerStage } from "./types";
import { useProcurement } from "@/context/ProcurementContext";
import { useRouter } from "next/navigation";
import type { ProcurementOperationalStatus } from "@/types";
import { getDeadlineTiming } from "@/lib/deadlineUtils";
import { TrackerHeader } from "./TrackerHeader";
import { TrackerList } from "./TrackerList";
import { TrackerKanbanBoard } from "./TrackerKanbanBoard";
import { TrackerDeadlines } from "./TrackerDeadlines";
import { TrackerDetailModal } from "./TrackerDetailModal";
import { TrackerStatsPanel } from "./TrackerStatsPanel";
import { DeadlineEditor, DeadlineCreator, AddRequestModal } from "./TrackerModals";

export default function TrackerPage() {
  const { state, moveRequestStep, updateRequestOperationalStatus, addRequest, addDeadline, updateDeadline } = useProcurement();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [operationalStatusFilter, setOperationalStatusFilter] = useState<ProcurementOperationalStatus | "All">("All");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [expandedRelatedId, setExpandedRelatedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeadlineId, setEditingDeadlineId] = useState<string | null>(null);
  const [addingDeadlineRequestId, setAddingDeadlineRequestId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusReasonDraft, setStatusReasonDraft] = useState("");

  const openRequestDetail = (requestId: string) => {
    setShowFullTimeline(false);
    setStatusReasonDraft(state.requests.find(request => request.id === requestId)?.operationalStatusReason ?? "");
    setSelectedRequestId(requestId);
  };

  const timeStatusMap = useMemo(() => {
    const map: Record<string, string> = {};
    state.deadlines.forEach(d => {
      const prev = map[d.requestId];
      const timing = getDeadlineTiming(d.targetDate, state.settings.slaWarningDays, d.status);
      const rank = { "Overdue": 3, "At Risk": 2, "On Track": 1, "Selesai": 0 } as const;
      if (!prev || rank[timing.status as keyof typeof rank] > rank[prev as keyof typeof rank]) {
        map[d.requestId] = timing.status;
      }
    });
    return map;
  }, [state.deadlines, state.settings.slaWarningDays]);

  const items: TrackerItem[] = useMemo(() => state.requests.map(r => ({
    id: r.id,
    title: r.title,
    pic: r.pic,
    amount: r.amount,
    stage: r.stage,
    operationalStatus: r.operationalStatus,
    currentStep: r.currentStep,
    department: r.department,
    stageStartedAt: r.stageStartedAt,
    isUrgent: r.isUrgent,
  })), [state.requests]);

  const deadlines = useMemo(() => state.deadlines.map(deadline => ({
    ...deadline,
    ...getDeadlineTiming(deadline.targetDate, state.settings.slaWarningDays, deadline.status),
  })), [state.deadlines, state.settings.slaWarningDays]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.pic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = departmentFilter === "All" || item.department.name === departmentFilter;
      const matchesOperationalStatus = operationalStatusFilter === "All" || item.operationalStatus === operationalStatusFilter;
      
      return matchesSearch && matchesDept && matchesOperationalStatus;
    });
  }, [items, searchQuery, departmentFilter, operationalStatusFilter]);

  const itemsByStage = useMemo(() => {
    const grouped = { "On Going": [], "On Hold": [], "Batal": [] } as Record<TrackerStage, TrackerItem[]>;
    filteredItems.forEach(item => grouped[item.operationalStatus].push(item));
    return grouped;
  }, [filteredItems]);

  const totalItemsCount = filteredItems.length;
  const onGoingCount = filteredItems.filter(item => item.operationalStatus === "On Going").length;
  const onHoldCount = filteredItems.filter(item => item.operationalStatus === "On Hold").length;
  const cancelledCount = filteredItems.filter(item => item.operationalStatus === "Batal").length;
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("itemId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TrackerStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("itemId");
    updateRequestOperationalStatus(id, status);
  };

  return (
    <div className="space-y-6 pb-12">
      <TrackerHeader 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter}
        operationalStatusFilter={operationalStatusFilter} setOperationalStatusFilter={setOperationalStatusFilter}
        viewMode={viewMode} setViewMode={setViewMode}
      />

      {viewMode === "list" && (
        <div className="grid gap-5" style={{ gridTemplateColumns: "220px 1fr" }}>
          {/* Stats panel — same size as kanban column */}
          <div className="self-start">
            <TrackerStatsPanel
              totalItemsCount={totalItemsCount}
              onGoingCount={onGoingCount}
              onHoldCount={onHoldCount}
              cancelledCount={cancelledCount}
              onAddRequest={() => setShowAddModal(true)}
            />
          </div>
          {/* List table — fills grid cell, scrolls horizontally inside */}
          <div className="min-w-0">
            <TrackerList 
              filteredItems={filteredItems} 
              timeStatusMap={timeStatusMap} 
              openRequestDetail={openRequestDetail} 
            />
          </div>
        </div>
      )}

      {viewMode === "kanban" && (
        <TrackerKanbanBoard 
          totalItemsCount={totalItemsCount} onGoingCount={onGoingCount} onHoldCount={onHoldCount} cancelledCount={cancelledCount}
          itemsByStage={itemsByStage} timeStatusMap={timeStatusMap}
          expandedCardId={expandedCardId} setExpandedCardId={setExpandedCardId}
          handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}
          openRequestDetail={openRequestDetail}
          onAddRequest={() => setShowAddModal(true)}
        />
      )}

      <TrackerDeadlines 
        deadlines={deadlines} requests={state.requests}
        openRequestDetail={openRequestDetail} setEditingDeadlineId={setEditingDeadlineId}
      />

      {editingDeadlineId && (() => {
        const deadline = state.deadlines.find(item => item.id === editingDeadlineId);
        if (!deadline) return null;
        return <DeadlineEditor deadline={deadline} onClose={() => setEditingDeadlineId(null)} onSave={(changes) => { updateDeadline(deadline.id, changes); setEditingDeadlineId(null); }} />;
      })()}

      {addingDeadlineRequestId && (() => {
        const request = state.requests.find(item => item.id === addingDeadlineRequestId);
        if (!request) return null;
        return <DeadlineCreator requestId={request.id} pic={request.pic} department={request.department} onClose={() => setAddingDeadlineRequestId(null)} onSave={(deadline) => { addDeadline(deadline); setAddingDeadlineRequestId(null); }} />;
      })()}

      {selectedRequestId && (() => {
        const docs = state.documents.filter(d => d.requestId === selectedRequestId);
        const guars = state.guarantees.filter(d => d.requestId === selectedRequestId);
        const slas = state.deadlines.filter(d => d.requestId === selectedRequestId).map(deadline => ({ ...deadline, ...getDeadlineTiming(deadline.targetDate, state.settings.slaWarningDays, deadline.status) }));
        const history = state.history.filter(item => item.requestId === selectedRequestId);
        const request = state.requests.find(r => r.id === selectedRequestId);
        const milestones = state.milestones.filter(m => m.requestId === selectedRequestId);
        
        return <TrackerDetailModal 
          selectedRequestId={selectedRequestId} setSelectedRequestId={setSelectedRequestId}
          request={request} milestones={milestones} docs={docs} guars={guars} slas={slas} history={history}
          showFullTimeline={showFullTimeline} setShowFullTimeline={setShowFullTimeline}
          statusReasonDraft={statusReasonDraft} setStatusReasonDraft={setStatusReasonDraft}
          moveRequestStep={moveRequestStep} updateRequestOperationalStatus={updateRequestOperationalStatus}
          expandedRelatedId={expandedRelatedId} setExpandedRelatedId={setExpandedRelatedId}
          router={router} setAddingDeadlineRequestId={setAddingDeadlineRequestId} setEditingDeadlineId={setEditingDeadlineId}
        />;
      })()}

      {showAddModal && <AddRequestModal onClose={() => setShowAddModal(false)} onSave={(req) => { addRequest(req); setShowAddModal(false); }} />}
    </div>
  );
}
