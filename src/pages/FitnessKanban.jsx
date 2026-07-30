import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { kanbanTests, kanbanStatuses, rankLabels, testTypeShort } from '../lib/mockData';

const columnColors = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
};

function KanbanCard({ test, onDragStart }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: test.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700/60 cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? 'opacity-30' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{test.refereeName}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${test.testType === 'interval' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'}`}>
          {testTypeShort[test.testType]}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{rankLabels[test.rank]}</span>
        <span>{test.testDate}</span>
      </div>
    </div>
  );
}

function KanbanColumn({ status, tests, onDragStart }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  const colors = columnColors[status.color];
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{status.label}</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">({tests.length})</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 p-3 rounded-xl min-h-[200px] transition-colors ${isOver ? 'bg-violet-500/5' : 'bg-gray-50 dark:bg-gray-700/30'}`}
      >
        {tests.map((test) => (
          <KanbanCard key={test.id} test={test} onDragStart={onDragStart} />
        ))}
        {tests.length === 0 && (
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-8">لا توجد اختبارات</div>
        )}
      </div>
    </div>
  );
}

function FitnessKanban() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tests, setTests] = useState(kanbanTests);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id;
    setTests((prev) => prev.map((t) => t.id === active.id ? { ...t, status: newStatus } : t));
  };

  const activeTest = tests.find((t) => t.id === activeId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">اختبارات اللياقة</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">اسحب البطاقات بين الأعمدة لتغيير الحالة</p>
            </div>

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {kanbanStatuses.map((status) => (
                  <KanbanColumn
                    key={status.id}
                    status={status}
                    tests={tests.filter((t) => t.status === status.id)}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeTest ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-100 dark:border-gray-700/60 opacity-90 rotate-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{activeTest.refereeName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${activeTest.testType === 'interval' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'}`}>
                        {testTypeShort[activeTest.testType]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{rankLabels[activeTest.rank]}</span>
                      <span>{activeTest.testDate}</span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FitnessKanban;
