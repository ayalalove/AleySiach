// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { supabase } from "../../lib/supabase";
// import "./SchedulePage.css";

// type Guide = {
//   id: number;
//   name: string;
// };

// type Reminder = {
//   id: number;
//   reminder_date: string;
//   title: string;
//   content: string | null;
// };
// type Assignment = {
//   id: number;
//   assignment_date: string;
//   guide_id: number;
// };

// function SchedulePage() {
//   const [guides, setGuides] = useState<Guide[]>([]);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);

//   const [popupPosition, setPopupPosition] = useState({
//     top: 0,
//     left: 0,
//   });

//   const [editingGuideId, setEditingGuideId] = useState<number | null>(null);

//   const [editingGuideName, setEditingGuideName] = useState("");

//   const [savingGuide, setSavingGuide] = useState(false);
//   const [newGuideName, setNewGuideName] = useState("");
//   const [addingGuide, setAddingGuide] = useState(false);

//   const [reminders, setReminders] = useState<Reminder[]>([]);
//   const [showReminderPopup, setShowReminderPopup] = useState(false);
//   const [reminderTitle, setReminderTitle] = useState("");
//   const [reminderContent, setReminderContent] = useState("");
//   const [viewingReminder, setViewingReminder] = useState<Reminder | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const { data: guidesData, error: guidesError } = await supabase
//       .from("guides")
//       .select("*")
//       .order("id");

//     if (guidesError) {
//       console.error("Error loading guides:", guidesError);
//       return;
//     }

//     const { data: assignmentsData, error: assignmentsError } = await supabase
//       .from("assignments")
//       .select("*")
//       .order("assignment_date");

//     if (assignmentsError) {
//       console.error("Error loading assignments:", assignmentsError);
//       return;
//     }

//     const { data: remindersData, error: remindersError } = await supabase
//       .from("reminders")
//       .select("*")
//       .order("reminder_date");

//     if (remindersError) {
//       console.error("Error loading reminders:", remindersError);
//       return;
//     }
//     // setGuides(guidesData ?? []);
//     // setAssignments(assignmentsData ?? []);
//     setGuides(guidesData ?? []);
//     setAssignments(assignmentsData ?? []);
//     setReminders(remindersData ?? []);
//   };
//   const getMonthlyAssignments = (guideId: number) => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();

//     return assignments.filter((assignment) => {
//       const date = new Date(`${assignment.assignment_date}T12:00:00`);

//       return (
//         assignment.guide_id === guideId &&
//         date.getFullYear() === year &&
//         date.getMonth() === month
//       );
//     }).length;
//   };
//   const addGuide = async () => {
//     const trimmedName = newGuideName.trim();

//     if (!trimmedName) {
//       alert("יש להזין שם מדריך");
//       return;
//     }

//     setAddingGuide(true);

//     const { data, error } = await supabase
//       .from("guides")
//       .insert({
//         name: trimmedName,
//       })
//       .select()
//       .single();

//     setAddingGuide(false);

//     if (error) {
//       console.error("Error adding guide:", error);
//       alert(`שגיאה בהוספת המדריך:\n${error.message}`);
//       return;
//     }

//     setGuides((current) => [...current, data]);
//     setNewGuideName("");
//   };
//   const formatDateKey = (date: Date) => {
//     const year = date.getFullYear();

//     const month = String(date.getMonth() + 1).padStart(2, "0");

//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   const getGuideForDate = (date: string) => {
//     const assignment = assignments.find(
//       (item) => item.assignment_date === date,
//     );

//     if (!assignment) {
//       return null;
//     }

//     return guides.find((guide) => guide.id === assignment.guide_id) ?? null;
//   };

//   const handleDateClick = (info: { dateStr: string; dayEl: HTMLElement }) => {
//     const rect = info.dayEl.getBoundingClientRect();

//     const popupWidth = 320;
//     const popupHeight = 450;
//     const gap = 10;

//     let left = rect.left + rect.width / 2 - popupWidth / 2;

//     let top = rect.bottom + gap;

//     if (left < 15) {
//       left = 15;
//     }

//     if (left + popupWidth > window.innerWidth - 15) {
//       left = window.innerWidth - popupWidth - 15;
//     }

//     if (top + popupHeight > window.innerHeight - 15) {
//       top = rect.top - popupHeight - gap;
//     }

//     if (top < 15) {
//       top = 15;
//     }

//     setPopupPosition({
//       top,
//       left,
//     });

//     setSelectedDate(info.dateStr);
//   };

//   // =========================
//   // בחירת מדריך
//   // =========================

//   const handleGuideSelect = async (guideId: number) => {
//     if (!selectedDate) return;

//     const existingAssignment = assignments.find(
//       (assignment) => assignment.assignment_date === selectedDate,
//     );

//     if (existingAssignment) {
//       const { data, error } = await supabase
//         .from("assignments")
//         .update({
//           guide_id: guideId,
//         })
//         .eq("id", existingAssignment.id)
//         .select()
//         .single();

//       if (error) {
//         console.error("Error updating assignment:", error);

//         alert(`שגיאה בעדכון השיבוץ:\n${error.message}`);

//         return;
//       }

//       setAssignments((current) =>
//         current.map((assignment) =>
//           assignment.id === existingAssignment.id ? data : assignment,
//         ),
//       );
//     } else {
//       const { data, error } = await supabase
//         .from("assignments")
//         .insert({
//           assignment_date: selectedDate,
//           guide_id: guideId,
//         })
//         .select()
//         .single();

//       if (error) {
//         console.error("Error creating assignment:", error);

//         alert(`שגיאה ביצירת השיבוץ:\n${error.message}`);

//         return;
//       }

//       setAssignments((current) => [...current, data]);
//     }

//     // סוגרים את החלונית
//     setSelectedDate(null);
//   };

//   // =========================
//   // ביטול שיבוץ
//   // =========================

//   const handleCancelAssignment = async () => {
//     if (!selectedDate) return;

//     const existingAssignment = assignments.find(
//       (assignment) => assignment.assignment_date === selectedDate,
//     );

//     if (!existingAssignment) {
//       setSelectedDate(null);
//       return;
//     }

//     const { error } = await supabase
//       .from("assignments")
//       .delete()
//       .eq("id", existingAssignment.id);

//     if (error) {
//       console.error("Error deleting assignment:", error);

//       alert(`שגיאה בביטול השיבוץ:\n${error.message}`);

//       return;
//     }

//     setAssignments((current) =>
//       current.filter((assignment) => assignment.id !== existingAssignment.id),
//     );

//     // סוגרים את החלונית
//     setSelectedDate(null);
//   };

//   // =========================
//   // התחלת עריכת מדריך
//   // =========================

//   const startEditingGuide = (guide: Guide) => {
//     setEditingGuideId(guide.id);
//     setEditingGuideName(guide.name);
//   };

//   // =========================
//   // ביטול עריכת מדריך
//   // =========================

//   const cancelEditingGuide = () => {
//     setEditingGuideId(null);
//     setEditingGuideName("");
//   };

//   // =========================
//   // שמירת שם מדריך
//   // =========================

//   const saveGuideName = async (guideId: number) => {
//     const trimmedName = editingGuideName.trim();

//     if (!trimmedName) {
//       alert("יש להזין שם מדריך");
//       return;
//     }

//     setSavingGuide(true);

//     const { data, error } = await supabase
//       .from("guides")
//       .update({
//         name: trimmedName,
//       })
//       .eq("id", guideId)
//       .select()
//       .single();

//     setSavingGuide(false);

//     if (error) {
//       console.error("Error updating guide:", error);

//       alert(`שגיאה בעדכון המדריך:\n${error.message}`);

//       return;
//     }

//     setGuides((current) =>
//       current.map((guide) => (guide.id === guideId ? data : guide)),
//     );

//     setEditingGuideId(null);
//     setEditingGuideName("");
//   };

//   const deleteGuide = async (guide: Guide) => {
//     const confirmed = window.confirm(
//       `האם את בטוחה שאת רוצה להסיר את המדריך "${guide.name}"?`,
//     );

//     if (!confirmed) return;

//     // בודקים האם המדריך משובץ
//     const hasAssignments = assignments.some(
//       (assignment) => assignment.guide_id === guide.id,
//     );

//     if (hasAssignments) {
//       alert(
//         `לא ניתן להסיר את "${guide.name}" כי הוא משובץ כרגע באחד או יותר מהימים.\n\nבטלי קודם את השיבוצים שלו ואז נסי שוב.`,
//       );

//       return;
//     }

//     const { error } = await supabase.from("guides").delete().eq("id", guide.id);

//     if (error) {
//       console.error("Error deleting guide:", error);

//       alert(`שגיאה בהסרת המדריך:\n${error.message}`);

//       return;
//     }

//     // מעדכנים את הרשימה במסך
//     setGuides((current) => current.filter((item) => item.id !== guide.id));
//   };

//   const selectedGuide = selectedDate ? getGuideForDate(selectedDate) : null;

//   const formatDisplayDate = (date: string) => {
//     return new Date(`${date}T12:00:00`).toLocaleDateString("he-IL", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//     });
//   };

//   return (
//     <div dir="rtl" className="app">
//       <div className="page-container">
//         {/* =========================
//             HEADER
//         ========================= */}

//         <header className="page-header">
//           <div className="title-area">
//             <div className="home-icon">🏠</div>

//             <div>
//               <h1>שיבוץ מדריכים</h1>

//               <p>ניהול המשמרות של הדירה</p>
//             </div>
//           </div>

//           {/* <div className="assignment-counter">
//             <div className="counter-icon">✓</div>

//             <div>
//               <strong>{assignments.length}</strong>

//               <span>משמרות משובצות</span>
//             </div>
//           </div> */}
//           <div className="monthly-summary">
//             <div className="monthly-summary-title">
//               <span>📊</span>
//               <strong>סיכום משמרות החודש</strong>
//             </div>

//             <div className="monthly-summary-list">
//               {guides.map((guide) => (
//                 <div key={guide.id} className="monthly-summary-item">
//                   <span className="summary-guide-name">{guide.name}</span>

//                   <span className="summary-count">
//                     {getMonthlyAssignments(guide.id)} משמרות
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </header>

//         {/* =========================
//             MAIN CONTENT
//         ========================= */}

//         <div className="main-layout">
//           {/* =========================
//               CALENDAR
//           ========================= */}

//           <section className="calendar-card">
//             <div className="calendar-header">
//               <div>
//                 <h2>לוח המשמרות</h2>

//                 <p>לחצי על יום כדי לבחור מדריך</p>
//               </div>

//               <div className="calendar-badge">📅 לוח חודשי</div>
//             </div>

//             <div className="calendar-container">
//               <FullCalendar
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 locale="he"
//                 direction="rtl"
//                 height="auto"
//                 fixedWeekCount={false}
//                 dateClick={handleDateClick}
//                 datesSet={(info) => {
//                   setCurrentMonth(info.view.currentStart);
//                 }}
//                 dayCellContent={(arg) => {
//                   const date = formatDateKey(arg.date);

//                   const guide = getGuideForDate(date);

//                   return (
//                     <div className="day-content">
//                       {/* <div className="day-number">{arg.dayNumberText}</div> */}

//                       {guide ? (
//                         <div className="assigned-guide">
//                           <div className="guide-name">{guide.name}</div>

//                           <div className="check-icon">✓</div>
//                         </div>
//                       ) : (
//                         <div className="empty-assignment">
//                           <span className="plus">+</span>

//                           <span>שיבוץ מדריך</span>
//                         </div>
//                       )}

//                       {/* תזכורת */}
//                       {reminders
//                         .filter((reminder) => reminder.reminder_date === date)
//                         .map((reminder) => (
//                           <div
//                             key={reminder.id}
//                             className="day-reminder"
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               setViewingReminder(reminder);
//                             }}
//                           >
//                             🔔 {reminder.title}
//                           </div>
//                         ))}
//                       <div className="day-number-row">
//                         <div className="day-number">{arg.dayNumberText}</div>

//                         <button
//                           className="add-reminder-button"
//                           onClick={(event) => {
//                             event.stopPropagation();
//                             setSelectedDate(date);
//                             setShowReminderPopup(true);
//                           }}
//                         >
//                           🔔+
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 }}
//               />
//             </div>
//           </section>

//           {/* =========================
//               GUIDES SIDEBAR
//           ========================= */}

//           <aside className="guides-card">
//             <div className="guides-card-header">
//               <div className="guides-header-icon">👥</div>

//               <div>
//                 <h2>מדריכים בדירה</h2>

//                 <p>{guides.length} מדריכים</p>
//               </div>
//             </div>

//             <div className="guides-card-body">
//               {guides.map((guide) => {
//                 const isEditing = editingGuideId === guide.id;

//                 return (
//                   <div key={guide.id} className="guide-management-item">
//                     <div className="management-avatar">
//                       {guide.name.charAt(0)}
//                     </div>

//                     {isEditing ? (
//                       <div className="edit-guide-area">
//                         <input
//                           value={editingGuideName}
//                           onChange={(event) =>
//                             setEditingGuideName(event.target.value)
//                           }
//                           autoFocus
//                           onKeyDown={(event) => {
//                             if (event.key === "Enter") {
//                               saveGuideName(guide.id);
//                             }

//                             if (event.key === "Escape") {
//                               cancelEditingGuide();
//                             }
//                           }}
//                         />

//                         <div className="edit-actions">
//                           <button
//                             className="save-guide"
//                             onClick={() => saveGuideName(guide.id)}
//                             disabled={savingGuide}
//                           >
//                             ✓ שמירה
//                           </button>

//                           <button
//                             className="cancel-guide"
//                             onClick={cancelEditingGuide}
//                           >
//                             ביטול
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="management-name">{guide.name}</div>
//                         <div className="guide-actions">
//                           <button
//                             className="edit-guide-button"
//                             onClick={() => startEditingGuide(guide)}
//                             title="עריכת שם"
//                           >
//                             ✏️
//                           </button>

//                           <button
//                             className="delete-guide-button"
//                             onClick={() => deleteGuide(guide)}
//                             title="הסרת מדריך"
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 );
//               })}

//               <div className="add-guide-area">
//                 <input
//                   value={newGuideName}
//                   onChange={(event) => setNewGuideName(event.target.value)}
//                   placeholder="שם המדריך"
//                   onKeyDown={(event) => {
//                     if (event.key === "Enter") {
//                       addGuide();
//                     }
//                   }}
//                 />

//                 <button
//                   className="add-guide-button"
//                   onClick={addGuide}
//                   disabled={addingGuide}
//                 >
//                   + הוספת מדריך
//                 </button>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* =========================
//           BACKDROP
//       ========================= */}

//       {selectedDate && !showReminderPopup && (
//         <div className="popup-backdrop" onClick={() => setSelectedDate(null)} />
//       )}

//       {/* GUIDE POPUP */}

//       {selectedDate && !showReminderPopup && (
//         <div
//           className="guide-popup"
//           style={{
//             top: popupPosition.top,
//             left: popupPosition.left,
//           }}
//           onClick={(event) => event.stopPropagation()}
//         >
//           <div className="popup-header">
//             <div className="popup-icon">👤</div>

//             <div className="popup-title">
//               <strong>בחירת מדריך</strong>

//               <span>{formatDisplayDate(selectedDate)}</span>
//             </div>

//             <button
//               className="close-popup"
//               onClick={() => setSelectedDate(null)}
//             >
//               ×
//             </button>
//           </div>

//           <div className="popup-body">
//             <div className="popup-label">
//               {selectedGuide ? "המדריך המשובץ כרגע" : "בחרי מדריך למשמרת"}
//             </div>

//             <div className="guides-list">
//               {guides.map((guide) => {
//                 const isSelected = selectedGuide?.id === guide.id;

//                 return (
//                   <button
//                     key={guide.id}
//                     className={`guide-option ${isSelected ? "selected" : ""}`}
//                     onClick={() => handleGuideSelect(guide.id)}
//                   >
//                     <div className="option-avatar">{guide.name.charAt(0)}</div>

//                     <div className="option-details">
//                       <strong>{guide.name}</strong>

//                       <span>מדריך דירה</span>
//                     </div>

//                     {isSelected && <div className="selected-check">✓</div>}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* ביטול שיבוץ */}

//             {selectedGuide && (
//               <button
//                 className="remove-assignment-button"
//                 onClick={handleCancelAssignment}
//               >
//                 <span>🗑️</span>

//                 <span>ביטול שיבוץ</span>
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {showReminderPopup && selectedDate && (
//         <div
//           className="reminder-popup"
//           onClick={(event) => event.stopPropagation()}
//         >
//           <h3>הוספת תזכורת</h3>

//           <input
//             type="text"
//             placeholder="כותרת התזכורת"
//             value={reminderTitle}
//             onChange={(event) => setReminderTitle(event.target.value)}
//           />

//           <textarea
//             placeholder="תוכן התזכורת"
//             value={reminderContent}
//             onChange={(event) => setReminderContent(event.target.value)}
//           />

//           <div className="reminder-popup-buttons">
//             <button
//               onClick={() => {
//                 setShowReminderPopup(false);
//                 setReminderTitle("");
//                 setReminderContent("");
//               }}
//             >
//               ביטול
//             </button>

//            <button
//   onClick={async () => {
//     if (!reminderTitle.trim()) {
//       return;
//     }

//     const { data, error } = await supabase
//       .from("reminders")
//       .insert({
//         reminder_date: selectedDate,
//         title: reminderTitle.trim(),
//         content: reminderContent.trim() || null,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Error adding reminder:", error);
//       return;
//     }

//     setReminders((prev) => [...prev, data]);

//     setReminderTitle("");
//     setReminderContent("");
//     setShowReminderPopup(false);
//     setSelectedDate(null);
//   }}
// >
//   הוספה
// </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SchedulePage;

import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "../../api/api";
import {
  getFullHebrewDate,
  getHebrewDays,
  getHebrewMonthEnd,
  getHebrewMonthStart,
  getHebrewMonthTitle,
  getHebrewMonthWeeks,
  shiftHebrewMonth,
  type HebrewDayInfo,
} from "../../lib/hebrewCalendar";
import "./SchedulePage.css";

type Guide = {
  _id: string;
  name: string;
};

type Reminder = {
  _id: string;
  reminder_date: string;
  title: string;
  content: string | null;
};

type Assignment = {
  _id: string;
  assignment_date: string;
  guide_id: string;
};

function SchedulePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  // היום הלועזי של א׳ בחודש העברי המוצג
  const [hebrewMonthStart, setHebrewMonthStart] = useState(() =>
    getHebrewMonthStart(new Date()),
  );
  const hebrewMonthEnd = getHebrewMonthEnd(hebrewMonthStart);
  const [visibleRange, setVisibleRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const hebrewDays = useMemo(
    () =>
      visibleRange
        ? getHebrewDays(visibleRange.start, visibleRange.end)
        : new Map<string, HebrewDayInfo>(),
    [visibleRange],
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
  });

  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [editingGuideName, setEditingGuideName] = useState("");

  const [savingGuide, setSavingGuide] = useState(false);
  const [newGuideName, setNewGuideName] = useState("");
  const [addingGuide, setAddingGuide] = useState(false);

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderDay, setReminderDay] = useState<string | null>(null);
  const [reminderForm, setReminderForm] = useState<{
    id: string | null;
    title: string;
    content: string;
  } | null>(null);
  const [savingReminder, setSavingReminder] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [guidesData, assignmentsData, remindersData] = await Promise.all([
        api.guides.getAll(),
        api.assignments.getAll(),
        api.reminders.getAll(),
      ]);

      setGuides(guidesData ?? []);
      setAssignments(assignmentsData ?? []);
      setReminders(remindersData ?? []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // משמרות בחודש העברי המוצג
  const getMonthlyAssignments = (guideId: string) => {
    const startKey = formatDateKey(hebrewMonthStart);
    const endKey = formatDateKey(hebrewMonthEnd);

    return assignments.filter(
      (assignment) =>
        assignment.guide_id === guideId &&
        assignment.assignment_date >= startKey &&
        assignment.assignment_date <= endKey,
    ).length;
  };

  const addGuide = async () => {
    const trimmedName = newGuideName.trim();

    if (!trimmedName) {
      alert("יש להזין שם מדריך");
      return;
    }

    setAddingGuide(true);

    try {
      const data = await api.guides.create(trimmedName);

      if (!data?._id) {
        alert("שגיאה בהוספת המדריך");
        return;
      }

      setGuides((current) => [...current, data]);
      setNewGuideName("");
    } catch (error) {
      console.error("Error adding guide:", error);
      alert("שגיאה בהוספת המדריך");
    } finally {
      setAddingGuide(false);
    }
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getGuideForDate = (date: string) => {
    const assignment = assignments.find(
      (item) => item.assignment_date === date,
    );

    if (!assignment) {
      return null;
    }

    return guides.find((guide) => guide._id === assignment.guide_id) ?? null;
  };

  const handleDateClick = (info: {
    dateStr: string;
    dayEl: HTMLElement;
    jsEvent: MouseEvent;
  }) => {
    // לחיצה על פעמון או על תזכורת לא פותחת בחירת מדריך
    const target = info.jsEvent.target as HTMLElement | null;

    if (target?.closest(".reminder-bell, .day-reminder")) {
      return;
    }

    const rect = info.dayEl.getBoundingClientRect();

    const popupWidth = 320;
    const popupHeight = 450;
    const gap = 10;

    let left = rect.left + rect.width / 2 - popupWidth / 2;
    let top = rect.bottom + gap;

    if (left < 15) {
      left = 15;
    }

    if (left + popupWidth > window.innerWidth - 15) {
      left = window.innerWidth - popupWidth - 15;
    }

    if (top + popupHeight > window.innerHeight - 15) {
      top = rect.top - popupHeight - gap;
    }

    if (top < 15) {
      top = 15;
    }

    setPopupPosition({
      top,
      left,
    });

    setSelectedDate(info.dateStr);
  };

  // =========================
  // בחירת מדריך
  // =========================

  const handleGuideSelect = async (guideId: string) => {
    if (!selectedDate) return;

    const existingAssignment = assignments.find(
      (assignment) => assignment.assignment_date === selectedDate,
    );

    try {
      if (existingAssignment) {
        const data = await api.assignments.update(
          existingAssignment._id,
          selectedDate,
          guideId,
        );

        if (!data?._id) {
          alert("שגיאה בעדכון השיבוץ");
          return;
        }

        setAssignments((current) =>
          current.map((assignment) =>
            assignment._id === existingAssignment._id ? data : assignment,
          ),
        );
      } else {
        const data = await api.assignments.create(selectedDate, guideId);

        if (!data?._id) {
          alert(data?.message || "שגיאה ביצירת השיבוץ");
          return;
        }

        setAssignments((current) => [...current, data]);
      }

      setSelectedDate(null);
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("שגיאה בשמירת השיבוץ");
    }
  };

  // =========================
  // ביטול שיבוץ
  // =========================

  const handleCancelAssignment = async () => {
    if (!selectedDate) return;

    const existingAssignment = assignments.find(
      (assignment) => assignment.assignment_date === selectedDate,
    );

    if (!existingAssignment) {
      setSelectedDate(null);
      return;
    }

    try {
      const result = await api.assignments.delete(existingAssignment._id);

      if (result?.success === false) {
        alert(result.message || "שגיאה בביטול השיבוץ");
        return;
      }

      setAssignments((current) =>
        current.filter(
          (assignment) => assignment._id !== existingAssignment._id,
        ),
      );

      setSelectedDate(null);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("שגיאה בביטול השיבוץ");
    }
  };

  // =========================
  // התחלת עריכת מדריך
  // =========================

  const startEditingGuide = (guide: Guide) => {
    setEditingGuideId(guide._id);
    setEditingGuideName(guide.name);
  };

  // =========================
  // ביטול עריכת מדריך
  // =========================

  const cancelEditingGuide = () => {
    setEditingGuideId(null);
    setEditingGuideName("");
  };

  // =========================
  // שמירת שם מדריך
  // =========================

  const saveGuideName = async (guideId: string) => {
    const trimmedName = editingGuideName.trim();

    if (!trimmedName) {
      alert("יש להזין שם מדריך");
      return;
    }

    setSavingGuide(true);

    try {
      const data = await api.guides.update(guideId, trimmedName);

      if (!data?._id) {
        alert("שגיאה בעדכון המדריך");
        return;
      }

      setGuides((current) =>
        current.map((guide) => (guide._id === guideId ? data : guide)),
      );

      setEditingGuideId(null);
      setEditingGuideName("");
    } catch (error) {
      console.error("Error updating guide:", error);
      alert("שגיאה בעדכון המדריך");
    } finally {
      setSavingGuide(false);
    }
  };

  // =========================
  // מחיקת מדריך
  // =========================

  const deleteGuide = async (guide: Guide) => {
    const confirmed = window.confirm(
      `האם את בטוחה שאת רוצה להסיר את המדריך "${guide.name}"?`,
    );

    if (!confirmed) return;

    const hasAssignments = assignments.some(
      (assignment) => assignment.guide_id === guide._id,
    );

    if (hasAssignments) {
      alert(
        `לא ניתן להסיר את "${guide.name}" כי הוא משובץ כרגע באחד או יותר מהימים.\n\nבטלי קודם את השיבוצים שלו ואז נסי שוב.`,
      );

      return;
    }

    try {
      const result = await api.guides.delete(guide._id);

      if (result?.success === false) {
        alert(result.message || "שגיאה בהסרת המדריך");
        return;
      }

      setGuides((current) => current.filter((item) => item._id !== guide._id));
    } catch (error) {
      console.error("Error deleting guide:", error);
      alert("שגיאה בהסרת המדריך");
    }
  };

  // =========================
  // תזכורות
  // =========================

  const getRemindersForDate = (date: string) =>
    reminders.filter((reminder) => reminder.reminder_date === date);

  const openReminderDay = (date: string, startAdding: boolean) => {
    setReminderDay(date);
    setReminderForm(startAdding ? { id: null, title: "", content: "" } : null);
  };

  const closeReminderDay = () => {
    setReminderDay(null);
    setReminderForm(null);
  };

  const startEditingReminder = (reminder: Reminder) => {
    setReminderForm({
      id: reminder._id,
      title: reminder.title,
      content: reminder.content ?? "",
    });
  };

  const saveReminder = async () => {
    if (!reminderDay || !reminderForm) return;

    const title = reminderForm.title.trim();
    const content = reminderForm.content.trim() || null;

    if (!title) {
      alert("יש להזין כותרת לתזכורת");
      return;
    }

    setSavingReminder(true);

    try {
      if (reminderForm.id) {
        const data = await api.reminders.update(
          reminderForm.id,
          reminderDay,
          title,
          content,
        );

        if (!data?._id) {
          alert("שגיאה בעדכון התזכורת");
          return;
        }

        setReminders((current) =>
          current.map((reminder) =>
            reminder._id === data._id ? data : reminder,
          ),
        );
      } else {
        const data = await api.reminders.create(reminderDay, title, content);

        if (!data?._id) {
          alert("שגיאה בהוספת התזכורת");
          return;
        }

        setReminders((current) => [...current, data]);
      }

      setReminderForm(null);
    } catch (error) {
      console.error("Error saving reminder:", error);
      alert("שגיאה בשמירת התזכורת");
    } finally {
      setSavingReminder(false);
    }
  };

  const deleteReminder = async (reminder: Reminder) => {
    const confirmed = window.confirm(
      `האם את בטוחה שאת רוצה למחוק את התזכורת "${reminder.title}"?`,
    );

    if (!confirmed) return;

    try {
      const result = await api.reminders.delete(reminder._id);

      if (result?.success === false) {
        alert(result.message || "שגיאה במחיקת התזכורת");
        return;
      }

      setReminders((current) =>
        current.filter((item) => item._id !== reminder._id),
      );

      if (reminderForm?.id === reminder._id) {
        setReminderForm(null);
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      alert("שגיאה במחיקת התזכורת");
    }
  };

  const selectedGuide = selectedDate ? getGuideForDate(selectedDate) : null;

  const formatDisplayDate = (date: string) => {
    const dateObject = new Date(`${date}T12:00:00`);

    const gregorian = dateObject.toLocaleDateString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return `${gregorian} · ${getFullHebrewDate(dateObject)}`;
  };

  return (
    <div dir="rtl" className="app">
      <div className="page-container">
        {/* =========================
            HEADER
        ========================= */}

        <header className="page-header">
          <div className="title-area">
            <div className="home-icon">🏠</div>

            <div>
              <h1>שיבוץ מדריכים</h1>

              <p>ניהול המשמרות של הדירה</p>
            </div>
          </div>

          <div className="monthly-summary">
            <div className="monthly-summary-title">
              <span>📊</span>
              <strong>סיכום משמרות החודש</strong>
            </div>

            <div className="monthly-summary-list">
              {guides.map((guide) => (
                <div key={guide._id} className="monthly-summary-item">
                  <span className="summary-guide-name">{guide.name}</span>

                  <span className="summary-count">
                    {getMonthlyAssignments(guide._id)} משמרות
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="main-layout">
          {/* =========================
              CALENDAR
          ========================= */}

          <section className="calendar-card">
            <div className="calendar-header">
              <div>
                <h2>לוח המשמרות</h2>

                <p>לחצי על יום כדי לבחור מדריך</p>
              </div>

              <div className="calendar-badge">📅 לוח חודשי</div>
            </div>

            <div className="calendar-container">
              {/* הלוח מציג חודש עברי: מ-א׳ בחודש ועד סופו.
                  בכל מעבר חודש הלוח נבנה מחדש עם מספר השבועות המתאים */}
              <FullCalendar
                key={formatDateKey(hebrewMonthStart)}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="hebrewMonth"
                initialDate={hebrewMonthStart}
                views={{
                  hebrewMonth: {
                    type: "dayGrid",
                    duration: { weeks: getHebrewMonthWeeks(hebrewMonthStart) },
                  },
                }}
                locale="he"
                direction="rtl"
                height="auto"
                headerToolbar={{
                  start: "title",
                  center: "",
                  end: "hebToday hebPrev,hebNext",
                }}
                customButtons={{
                  hebPrev: {
                    icon: "chevron-right",
                    hint: "החודש הקודם",
                    click: () =>
                      setHebrewMonthStart((current) =>
                        shiftHebrewMonth(current, -1),
                      ),
                  },
                  hebNext: {
                    icon: "chevron-left",
                    hint: "החודש הבא",
                    click: () =>
                      setHebrewMonthStart((current) =>
                        shiftHebrewMonth(current, 1),
                      ),
                  },
                  hebToday: {
                    text: "היום",
                    click: () =>
                      setHebrewMonthStart(getHebrewMonthStart(new Date())),
                  },
                }}
                titleFormat={() => getHebrewMonthTitle(hebrewMonthStart)}
                dateClick={handleDateClick}
                datesSet={(info) => {
                  setVisibleRange({ start: info.start, end: info.end });
                }}
                dayCellClassNames={(arg) => {
                  const classes: string[] = [];

                  if (
                    arg.date < hebrewMonthStart ||
                    arg.date > hebrewMonthEnd
                  ) {
                    classes.push("other-hebrew-month");
                  }

                  if (arg.date.getDay() === 6) {
                    classes.push("shabbat-day");
                  }

                  if (hebrewDays.get(formatDateKey(arg.date))?.isChag) {
                    classes.push("chag-day");
                  }

                  return classes;
                }}
                dayCellContent={(arg) => {
                  const date = formatDateKey(arg.date);

                  const guide = getGuideForDate(date);

                  const dayReminders = getRemindersForDate(date);

                  const hebrewDay = hebrewDays.get(date);

                  return (
                    <div className="day-content">
                      {guide ? (
                        <div className="assigned-guide">
                          <div className="guide-name">{guide.name}</div>

                          <div className="check-icon">✓</div>
                        </div>
                      ) : (
                        <div className="empty-assignment">
                          <span className="plus">+</span>

                          <span>שיבוץ מדריך</span>
                        </div>
                      )}

                      {/* תזכורות */}
                      {dayReminders.length > 0 && (
                        <div className="day-reminders">
                          {dayReminders.slice(0, 2).map((reminder) => (
                            <button
                              key={reminder._id}
                              className="day-reminder"
                              title={reminder.title}
                              onClick={(event) => {
                                event.stopPropagation();
                                openReminderDay(date, false);
                              }}
                            >
                              {reminder.title}
                            </button>
                          ))}

                          {dayReminders.length > 2 && (
                            <button
                              className="day-reminder more"
                              onClick={(event) => {
                                event.stopPropagation();
                                openReminderDay(date, false);
                              }}
                            >
                              +{dayReminders.length - 2} נוספות
                            </button>
                          )}
                        </div>
                      )}

                      <div className="day-footer">
                      {hebrewDay && hebrewDay.events.length > 0 && (
                        <div className="day-holidays">
                          {hebrewDay.events.slice(0, 2).map((holiday) => (
                            <div
                              key={holiday.title}
                              className={`day-holiday ${holiday.type}`}
                              title={holiday.title}
                            >
                              {holiday.title}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="day-number-row">
                        <div className="day-dates">
                          <div className="day-number">{arg.date.getDate()}</div>

                          {hebrewDay && (
                            <span className="hebrew-date">
                              {hebrewDay.hebrewDate}
                            </span>
                          )}
                        </div>

                        <button
                          className={`reminder-bell ${
                            dayReminders.length > 0 ? "has-reminders" : ""
                          }`}
                          title={
                            dayReminders.length > 0
                              ? "תזכורות ליום זה"
                              : "הוספת תזכורת"
                          }
                          aria-label="תזכורות"
                          onClick={(event) => {
                            event.stopPropagation();
                            openReminderDay(date, dayReminders.length === 0);
                          }}
                        >
                          🔔
                        </button>
                      </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </section>

          {/* =========================
              GUIDES SIDEBAR
          ========================= */}

          <aside className="guides-card">
            <div className="guides-card-header">
              <div className="guides-header-icon">👥</div>

              <div>
                <h2>מדריכים בדירה</h2>

                <p>{guides.length} מדריכים</p>
              </div>
            </div>

            <div className="guides-card-body">
              {guides.map((guide) => {
                const isEditing = editingGuideId === guide._id;

                return (
                  <div key={guide._id} className="guide-management-item">
                    <div className="management-avatar">
                      {guide.name.charAt(0)}
                    </div>

                    {isEditing ? (
                      <div className="edit-guide-area">
                        <input
                          value={editingGuideName}
                          onChange={(event) =>
                            setEditingGuideName(event.target.value)
                          }
                          autoFocus
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              saveGuideName(guide._id);
                            }

                            if (event.key === "Escape") {
                              cancelEditingGuide();
                            }
                          }}
                        />

                        <div className="edit-actions">
                          <button
                            className="save-guide"
                            onClick={() => saveGuideName(guide._id)}
                            disabled={savingGuide}
                          >
                            ✓ שמירה
                          </button>

                          <button
                            className="cancel-guide"
                            onClick={cancelEditingGuide}
                          >
                            ביטול
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="management-name">{guide.name}</div>

                        <div className="guide-actions">
                          <button
                            className="edit-guide-button"
                            onClick={() => startEditingGuide(guide)}
                            title="עריכת שם"
                          >
                            ✏️
                          </button>

                          <button
                            className="delete-guide-button"
                            onClick={() => deleteGuide(guide)}
                            title="הסרת מדריך"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <div className="add-guide-area">
                <input
                  value={newGuideName}
                  onChange={(event) => setNewGuideName(event.target.value)}
                  placeholder="שם המדריך"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addGuide();
                    }
                  }}
                />

                <button
                  className="add-guide-button"
                  onClick={addGuide}
                  disabled={addingGuide}
                >
                  + הוספת מדריך
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================
          BACKDROP
      ========================= */}

      {selectedDate && (
        <div className="popup-backdrop" onClick={() => setSelectedDate(null)} />
      )}

      {/* GUIDE POPUP */}

      {selectedDate && (
        <div
          className="guide-popup"
          style={{
            top: popupPosition.top,
            left: popupPosition.left,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="popup-header">
            <div className="popup-icon">👤</div>

            <div className="popup-title">
              <strong>בחירת מדריך</strong>

              <span>{formatDisplayDate(selectedDate)}</span>
            </div>

            <button
              className="close-popup"
              onClick={() => setSelectedDate(null)}
            >
              ×
            </button>
          </div>

          <div className="popup-body">
            <div className="popup-label">
              {selectedGuide ? "המדריך המשובץ כרגע" : "בחרי מדריך למשמרת"}
            </div>

            <div className="guides-list">
              {guides.map((guide) => {
                const isSelected = selectedGuide?._id === guide._id;

                return (
                  <button
                    key={guide._id}
                    className={`guide-option ${isSelected ? "selected" : ""}`}
                    onClick={() => handleGuideSelect(guide._id)}
                  >
                    <div className="option-avatar">{guide.name.charAt(0)}</div>

                    <div className="option-details">
                      <strong>{guide.name}</strong>

                      <span>מדריך דירה</span>
                    </div>

                    {isSelected && <div className="selected-check">✓</div>}
                  </button>
                );
              })}
            </div>

            {selectedGuide && (
              <button
                className="remove-assignment-button"
                onClick={handleCancelAssignment}
              >
                <span>🗑️</span>

                <span>ביטול שיבוץ</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================
          REMINDERS MODAL
      ========================= */}

      {reminderDay && (
        <div className="reminder-backdrop" onClick={closeReminderDay}>
          <div
            className="reminder-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="popup-header">
              <div className="popup-icon reminder-icon">🔔</div>

              <div className="popup-title">
                <strong>תזכורות</strong>

                <span>{formatDisplayDate(reminderDay)}</span>
              </div>

              <button className="close-popup" onClick={closeReminderDay}>
                ×
              </button>
            </div>

            <div className="reminder-modal-body">
              {getRemindersForDate(reminderDay).length === 0 &&
                !reminderForm && (
                  <div className="reminder-empty">אין תזכורות ליום זה</div>
                )}

              {getRemindersForDate(reminderDay).map((reminder) =>
                reminderForm?.id === reminder._id ? null : (
                  <div key={reminder._id} className="reminder-item">
                    <div className="reminder-item-text">
                      <strong>{reminder.title}</strong>

                      {reminder.content && <p>{reminder.content}</p>}
                    </div>

                    <div className="reminder-item-actions">
                      <button
                        className="reminder-icon-button"
                        onClick={() => startEditingReminder(reminder)}
                        title="עריכת תזכורת"
                      >
                        ✏️
                      </button>

                      <button
                        className="reminder-icon-button danger"
                        onClick={() => deleteReminder(reminder)}
                        title="מחיקת תזכורת"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ),
              )}

              {reminderForm ? (
                <div className="reminder-form">
                  <div className="reminder-form-label">
                    {reminderForm.id ? "עריכת תזכורת" : "תזכורת חדשה"}
                  </div>

                  <input
                    type="text"
                    placeholder="כותרת התזכורת"
                    value={reminderForm.title}
                    autoFocus
                    onChange={(event) =>
                      setReminderForm({
                        ...reminderForm,
                        title: event.target.value,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        saveReminder();
                      }
                    }}
                  />

                  <textarea
                    placeholder="פרטים נוספים (לא חובה)"
                    value={reminderForm.content}
                    onChange={(event) =>
                      setReminderForm({
                        ...reminderForm,
                        content: event.target.value,
                      })
                    }
                  />

                  <div className="reminder-form-buttons">
                    <button
                      className="reminder-cancel-button"
                      onClick={() => setReminderForm(null)}
                    >
                      ביטול
                    </button>

                    <button
                      className="reminder-save-button"
                      onClick={saveReminder}
                      disabled={savingReminder}
                    >
                      {reminderForm.id ? "✓ שמירה" : "+ הוספה"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="add-reminder-trigger"
                  onClick={() =>
                    setReminderForm({ id: null, title: "", content: "" })
                  }
                >
                  + הוספת תזכורת
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default SchedulePage;
