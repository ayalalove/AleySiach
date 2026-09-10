import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { supabase } from "../../lib/supabase";
import "./SchedulePage.css";

type Guide = {
  id: number;
  name: string;
};

type Assignment = {
  id: number;
  assignment_date: string;
  guide_id: number;
};

function SchedulePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
  });

  const [editingGuideId, setEditingGuideId] = useState<number | null>(null);

  const [editingGuideName, setEditingGuideName] = useState("");

  const [savingGuide, setSavingGuide] = useState(false);
  const [newGuideName, setNewGuideName] = useState("");
  const [addingGuide, setAddingGuide] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: guidesData, error: guidesError } = await supabase
      .from("guides")
      .select("*")
      .order("id");

    if (guidesError) {
      console.error("Error loading guides:", guidesError);
      return;
    }

    const { data: assignmentsData, error: assignmentsError } = await supabase
      .from("assignments")
      .select("*")
      .order("assignment_date");

    if (assignmentsError) {
      console.error("Error loading assignments:", assignmentsError);
      return;
    }

    setGuides(guidesData ?? []);
    setAssignments(assignmentsData ?? []);
  };
  const getMonthlyAssignments = (guideId: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    return assignments.filter((assignment) => {
      const date = new Date(`${assignment.assignment_date}T12:00:00`);

      return (
        assignment.guide_id === guideId &&
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    }).length;
  };
  const addGuide = async () => {
    const trimmedName = newGuideName.trim();

    if (!trimmedName) {
      alert("יש להזין שם מדריך");
      return;
    }

    setAddingGuide(true);

    const { data, error } = await supabase
      .from("guides")
      .insert({
        name: trimmedName,
      })
      .select()
      .single();

    setAddingGuide(false);

    if (error) {
      console.error("Error adding guide:", error);
      alert(`שגיאה בהוספת המדריך:\n${error.message}`);
      return;
    }

    setGuides((current) => [...current, data]);
    setNewGuideName("");
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

    return guides.find((guide) => guide.id === assignment.guide_id) ?? null;
  };

  const handleDateClick = (info: { dateStr: string; dayEl: HTMLElement }) => {
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

  const handleGuideSelect = async (guideId: number) => {
    if (!selectedDate) return;

    const existingAssignment = assignments.find(
      (assignment) => assignment.assignment_date === selectedDate,
    );

    if (existingAssignment) {
      const { data, error } = await supabase
        .from("assignments")
        .update({
          guide_id: guideId,
        })
        .eq("id", existingAssignment.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating assignment:", error);

        alert(`שגיאה בעדכון השיבוץ:\n${error.message}`);

        return;
      }

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === existingAssignment.id ? data : assignment,
        ),
      );
    } else {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          assignment_date: selectedDate,
          guide_id: guideId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating assignment:", error);

        alert(`שגיאה ביצירת השיבוץ:\n${error.message}`);

        return;
      }

      setAssignments((current) => [...current, data]);
    }

    // סוגרים את החלונית
    setSelectedDate(null);
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

    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", existingAssignment.id);

    if (error) {
      console.error("Error deleting assignment:", error);

      alert(`שגיאה בביטול השיבוץ:\n${error.message}`);

      return;
    }

    setAssignments((current) =>
      current.filter((assignment) => assignment.id !== existingAssignment.id),
    );

    // סוגרים את החלונית
    setSelectedDate(null);
  };

  // =========================
  // התחלת עריכת מדריך
  // =========================

  const startEditingGuide = (guide: Guide) => {
    setEditingGuideId(guide.id);
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

  const saveGuideName = async (guideId: number) => {
    const trimmedName = editingGuideName.trim();

    if (!trimmedName) {
      alert("יש להזין שם מדריך");
      return;
    }

    setSavingGuide(true);

    const { data, error } = await supabase
      .from("guides")
      .update({
        name: trimmedName,
      })
      .eq("id", guideId)
      .select()
      .single();

    setSavingGuide(false);

    if (error) {
      console.error("Error updating guide:", error);

      alert(`שגיאה בעדכון המדריך:\n${error.message}`);

      return;
    }

    setGuides((current) =>
      current.map((guide) => (guide.id === guideId ? data : guide)),
    );

    setEditingGuideId(null);
    setEditingGuideName("");
  };

  const deleteGuide = async (guide: Guide) => {
    const confirmed = window.confirm(
      `האם את בטוחה שאת רוצה להסיר את המדריך "${guide.name}"?`,
    );

    if (!confirmed) return;

    // בודקים האם המדריך משובץ
    const hasAssignments = assignments.some(
      (assignment) => assignment.guide_id === guide.id,
    );

    if (hasAssignments) {
      alert(
        `לא ניתן להסיר את "${guide.name}" כי הוא משובץ כרגע באחד או יותר מהימים.\n\nבטלי קודם את השיבוצים שלו ואז נסי שוב.`,
      );

      return;
    }

    const { error } = await supabase.from("guides").delete().eq("id", guide.id);

    if (error) {
      console.error("Error deleting guide:", error);

      alert(`שגיאה בהסרת המדריך:\n${error.message}`);

      return;
    }

    // מעדכנים את הרשימה במסך
    setGuides((current) => current.filter((item) => item.id !== guide.id));
  };

  const selectedGuide = selectedDate ? getGuideForDate(selectedDate) : null;

  const formatDisplayDate = (date: string) => {
    return new Date(`${date}T12:00:00`).toLocaleDateString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
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

          {/* <div className="assignment-counter">
            <div className="counter-icon">✓</div>

            <div>
              <strong>{assignments.length}</strong>

              <span>משמרות משובצות</span>
            </div>
          </div> */}
          <div className="monthly-summary">
            <div className="monthly-summary-title">
              <span>📊</span>
              <strong>סיכום משמרות החודש</strong>
            </div>

            <div className="monthly-summary-list">
              {guides.map((guide) => (
                <div key={guide.id} className="monthly-summary-item">
                  <span className="summary-guide-name">{guide.name}</span>

                  <span className="summary-count">
                    {getMonthlyAssignments(guide.id)} משמרות
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
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="he"
                direction="rtl"
                height="auto"
                fixedWeekCount={false}
                dateClick={handleDateClick}
                datesSet={(info) => {
                  setCurrentMonth(info.view.currentStart);
                }}
                dayCellContent={(arg) => {
                  const date = formatDateKey(arg.date);

                  const guide = getGuideForDate(date);

                  return (
                    <div className="day-content">
                      <div className="day-number">{arg.dayNumberText}</div>

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
                const isEditing = editingGuideId === guide.id;

                return (
                  <div key={guide.id} className="guide-management-item">
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
                              saveGuideName(guide.id);
                            }

                            if (event.key === "Escape") {
                              cancelEditingGuide();
                            }
                          }}
                        />

                        <div className="edit-actions">
                          <button
                            className="save-guide"
                            onClick={() => saveGuideName(guide.id)}
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

      {/* =========================
          GUIDE POPUP
      ========================= */}

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
                const isSelected = selectedGuide?.id === guide.id;

                return (
                  <button
                    key={guide.id}
                    className={`guide-option ${isSelected ? "selected" : ""}`}
                    onClick={() => handleGuideSelect(guide.id)}
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

            {/* ביטול שיבוץ */}

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
    </div>
  );
}

export default SchedulePage;
