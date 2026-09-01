// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { supabase } from "./lib/supabase";

// type Guide = {
//   id: number;
//   name: string;
// };

// function App() {
//   const [guides, setGuides] = useState<Guide[]>([]);

//   useEffect(() => {
//     // const fetchGuides = async () => {
//     //   const { data, error } = await supabase
//     //     .from("guides")
//     //     .select("*")
//     //     .order("id");

//     //   if (error) {
//     //     console.error("Error loading guides:", error);
//     //     return;
//     //   }

//     //   setGuides(data);
//     // };

//     const fetchGuides = async () => {
//   const { data, error } = await supabase
//     .from("guides")
//     .select("*")
//     .order("id");

//   console.log("GUIDES:", data);
//   console.log("ERROR:", error);

//   if (error) {
//     console.error("Error loading guides:", error);
//     return;
//   }

//   setGuides(data);
// };
//     fetchGuides();
//   }, []);

//   return (
//     <div dir="rtl" className="min-h-screen bg-gray-50 p-8">
//       <div className="mx-auto max-w-7xl">

//         <h1 className="mb-6 text-3xl font-bold text-gray-800">
//           🏠 שיבוץ מדריכים
//         </h1>

//         <div className="mb-4">
//           {guides.map((guide) => (
//             <span key={guide.id} className="ml-2">
//               👤 {guide.name}
//             </span>
//           ))}
//         </div>

//         <div className="rounded-2xl bg-white p-6 shadow-lg">
//           <FullCalendar
//             plugins={[dayGridPlugin]}
//             initialView="dayGridMonth"
//             locale="he"
//             direction="rtl"
//             height="auto"
//           />
//         </div>

//       </div>
//     </div>
//   );
// }

// export default App;







// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { supabase } from "./lib/supabase";

// type Guide = {
//   id: number;
//   name: string;
// };

// type Assignment = {
//   id: number;
//   assignment_date: string;
//   guide_id: number;
// };

// function App() {
//   const [guides, setGuides] = useState<Guide[]>([]);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: guidesData, error: guidesError } = await supabase
//         .from("guides")
//         .select("*")
//         .order("id");

//       if (guidesError) {
//         console.error("Error loading guides:", guidesError);
//         return;
//       }

//       const { data: assignmentsData, error: assignmentsError } =
//         await supabase
//           .from("assignments")
//           .select("*")
//           .order("assignment_date");

//       if (assignmentsError) {
//         console.error("Error loading assignments:", assignmentsError);
//         return;
//       }

//       setGuides(guidesData ?? []);
//       setAssignments(assignmentsData ?? []);
//     };

//     fetchData();
//   }, []);

//   const handleDateClick = (info: { dateStr: string }) => {
//     setSelectedDate(info.dateStr);
//   };

//   const handleGuideSelect = async (guideId: number) => {
//     if (!selectedDate) return;

//     const existingAssignment = assignments.find(
//       (assignment) => assignment.assignment_date === selectedDate
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
//         return;
//       }

//       setAssignments((current) =>
//         current.map((assignment) =>
//           assignment.id === existingAssignment.id ? data : assignment
//         )
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
//         return;
//       }

//       setAssignments((current) => [...current, data]);
//     }

//     setSelectedDate(null);
//   };

//   const getGuideForDate = (date: string) => {
//     const assignment = assignments.find(
//       (item) => item.assignment_date === date
//     );

//     if (!assignment) return null;

//     return guides.find((guide) => guide.id === assignment.guide_id);
//   };

//   return (
//     <div dir="rtl" className="min-h-screen bg-gray-100 p-6 md:p-8">
//       <div className="mx-auto max-w-7xl">

//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             🏠 שיבוץ מדריכים
//           </h1>

//           <p className="mt-1 text-gray-500">
//             לחצי על יום כדי לשבץ מדריך
//           </p>
//         </div>

//         <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
//           <FullCalendar
//             plugins={[dayGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             locale="he"
//             direction="rtl"
//             height="auto"
//             dateClick={handleDateClick}
//           />
//         </div>

//         {selectedDate && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//             onClick={() => setSelectedDate(null)}
//           >
//             <div
//               className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
//               onClick={(event) => event.stopPropagation()}
//             >
//               <h2 className="mb-2 text-xl font-bold text-gray-800">
//                 בחירת מדריך
//               </h2>

//               <p className="mb-5 text-sm text-gray-500">
//                 תאריך: {selectedDate}
//               </p>

//               <div className="space-y-2">
//                 {guides.map((guide) => (
//                   <button
//                     key={guide.id}
//                     onClick={() => handleGuideSelect(guide.id)}
//                     className="w-full rounded-xl border border-gray-200 p-3 text-right transition hover:bg-blue-50"
//                   >
//                     👤 {guide.name}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 onClick={() => setSelectedDate(null)}
//                 className="mt-4 w-full rounded-xl bg-gray-100 p-3"
//               >
//                 ביטול
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default App;




































// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { supabase } from "./lib/supabase";

// type Guide = {
//   id: number;
//   name: string;
// };

// type Assignment = {
//   id: number;
//   assignment_date: string;
//   guide_id: number;
// };

// function App() {
//   const [guides, setGuides] = useState<Guide[]>([]);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);

//   const [popupPosition, setPopupPosition] = useState({
//     top: 0,
//     left: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: guidesData, error: guidesError } = await supabase
//         .from("guides")
//         .select("*")
//         .order("id");

//       if (guidesError) {
//         console.error("Error loading guides:", guidesError);
//         return;
//       }

//       const { data: assignmentsData, error: assignmentsError } =
//         await supabase
//           .from("assignments")
//           .select("*")
//           .order("assignment_date");

//       if (assignmentsError) {
//         console.error("Error loading assignments:", assignmentsError);
//         return;
//       }

//       setGuides(guidesData ?? []);
//       setAssignments(assignmentsData ?? []);
//     };

//     fetchData();
//   }, []);

//   const getGuideForDate = (date: string) => {
//     const assignment = assignments.find(
//       (item) => item.assignment_date === date
//     );

//     if (!assignment) return null;

//     return guides.find((guide) => guide.id === assignment.guide_id) ?? null;
//   };

//   const handleDateClick = (info: {
//     dateStr: string;
//     dayEl: HTMLElement;
//   }) => {
//     const rect = info.dayEl.getBoundingClientRect();

//     const popupWidth = 320;
//     const popupHeight = 400;
//     const gap = 10;

//     let left = rect.left + rect.width / 2 - popupWidth / 2;
//     let top = rect.bottom + gap;

//     if (left < 15) {
//       left = 15;
//     }

//     if (left + popupWidth > window.innerWidth - 15) {
//       left = window.innerWidth - popupWidth - 15;
//     }

//     // אם אין מספיק מקום מתחת ליום,
//     // החלונית תיפתח מעליו
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

//   const handleGuideSelect = async (guideId: number) => {
//     if (!selectedDate) return;

//     const existingAssignment = assignments.find(
//       (assignment) => assignment.assignment_date === selectedDate
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
//         return;
//       }

//       setAssignments((current) =>
//         current.map((assignment) =>
//           assignment.id === existingAssignment.id ? data : assignment
//         )
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
//         return;
//       }

//       setAssignments((current) => [...current, data]);
//     }

//     setSelectedDate(null);
//   };

//   const selectedGuide = selectedDate
//     ? getGuideForDate(selectedDate)
//     : null;

//   const formatDate = (date: string) => {
//     return new Date(`${date}T12:00:00`).toLocaleDateString("he-IL", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//     });
//   };

//   return (
//     <div dir="rtl" className="app">
//       <div className="page-container">

//         {/* HEADER */}
//         <header className="page-header">
//           <div className="title-area">
//             <div className="home-icon">
//               🏠
//             </div>

//             <div>
//               <h1>שיבוץ מדריכים</h1>

//               <p>
//                 ניהול המשמרות של הדירה
//               </p>
//             </div>
//           </div>

//           <div className="assignment-counter">
//             <div className="counter-icon">
//               ✓
//             </div>

//             <div>
//               <strong>{assignments.length}</strong>
//               <span>משמרות משובצות</span>
//             </div>
//           </div>
//         </header>

//         {/* CALENDAR */}
//         <section className="calendar-card">

//           <div className="calendar-header">
//             <div>
//               <h2>לוח המשמרות</h2>

//               <p>
//                 לחצי על יום כדי לבחור מדריך
//               </p>
//             </div>

//             <div className="calendar-badge">
//               📅 לוח חודשי
//             </div>
//           </div>

//           <div className="calendar-container">

//             <FullCalendar
//               plugins={[
//                 dayGridPlugin,
//                 interactionPlugin,
//               ]}
//               initialView="dayGridMonth"
//               locale="he"
//               direction="rtl"
//               height="auto"
//               fixedWeekCount={false}
//               dateClick={handleDateClick}
//               dayCellContent={(arg) => {

//                 const date = arg.date.toLocaleDateString("en-CA");

//                 const guide = getGuideForDate(date);

//                 return (
//                   <div className="day-content">

//                     {/* מספר היום */}
//                     <div className="day-number">
//                       {arg.dayNumberText}
//                     </div>

//                     {/* מדריך שנבחר */}
//                     {guide ? (
//                       <div className="assigned-guide">

//                         <div className="guide-avatar">
//                           {guide.name.charAt(0)}
//                         </div>

//                         <div className="guide-name">
//                           {guide.name}
//                         </div>

//                         <div className="check-icon">
//                           ✓
//                         </div>

//                       </div>
//                     ) : (
//                       <div className="empty-assignment">

//                         <span className="plus">
//                           +
//                         </span>

//                         <span>
//                           שיבוץ מדריך
//                         </span>

//                       </div>
//                     )}

//                   </div>
//                 );
//               }}
//             />

//           </div>
//         </section>
//       </div>

//       {/* שכבת רקע שקופה */}
//       {selectedDate && (
//         <div
//           className="popup-backdrop"
//           onClick={() => setSelectedDate(null)}
//         />
//       )}

//       {/* חלונית בחירת מדריך */}
//       {selectedDate && (
//         <div
//           className="guide-popup"
//           style={{
//             top: popupPosition.top,
//             left: popupPosition.left,
//           }}
//           onClick={(event) => event.stopPropagation()}
//         >

//           {/* כותרת */}
//           <div className="popup-header">

//             <div className="popup-icon">
//               👤
//             </div>

//             <div className="popup-title">
//               <strong>
//                 בחירת מדריך
//               </strong>

//               <span>
//                 {formatDate(selectedDate)}
//               </span>
//             </div>

//             <button
//               className="close-popup"
//               onClick={() => setSelectedDate(null)}
//             >
//               ×
//             </button>

//           </div>

//           {/* רשימת מדריכים */}
//           <div className="popup-body">

//             <div className="popup-label">
//               {selectedGuide
//                 ? "המדריך המשובץ כרגע"
//                 : "בחרי מדריך למשמרת"}
//             </div>

//             <div className="guides-list">

//               {guides.map((guide) => {
//                 const isSelected =
//                   selectedGuide?.id === guide.id;

//                 return (
//                   <button
//                     key={guide.id}
//                     className={`guide-option ${
//                       isSelected ? "selected" : ""
//                     }`}
//                     onClick={() =>
//                       handleGuideSelect(guide.id)
//                     }
//                   >

//                     <div className="option-avatar">
//                       {guide.name.charAt(0)}
//                     </div>

//                     <div className="option-details">
//                       <strong>
//                         {guide.name}
//                       </strong>

//                       <span>
//                         מדריך דירה
//                       </span>
//                     </div>

//                     {isSelected && (
//                       <div className="selected-check">
//                         ✓
//                       </div>
//                     )}

//                   </button>
//                 );
//               })}

//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;





import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { supabase } from "./lib/supabase";

type Guide = {
  id: number;
  name: string;
};

type Assignment = {
  id: number;
  assignment_date: string;
  guide_id: number;
};

function App() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: guidesData, error: guidesError } = await supabase
        .from("guides")
        .select("*")
        .order("id");

      if (guidesError) {
        console.error("Error loading guides:", guidesError);
        return;
      }

      const { data: assignmentsData, error: assignmentsError } =
        await supabase
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

    fetchData();
  }, []);

  // מחזיר תאריך בפורמט YYYY-MM-DD
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getGuideForDate = (date: string) => {
    const assignment = assignments.find(
      (item) => item.assignment_date === date
    );

    if (!assignment) return null;

    return (
      guides.find(
        (guide) => guide.id === assignment.guide_id
      ) ?? null
    );
  };

  const handleDateClick = (info: {
    dateStr: string;
    dayEl: HTMLElement;
  }) => {
    const rect = info.dayEl.getBoundingClientRect();

    const popupWidth = 320;
    const popupHeight = 400;
    const gap = 10;

    let left =
      rect.left +
      rect.width / 2 -
      popupWidth / 2;

    let top = rect.bottom + gap;

    if (left < 15) {
      left = 15;
    }

    if (left + popupWidth > window.innerWidth - 15) {
      left =
        window.innerWidth -
        popupWidth -
        15;
    }

    // אם אין מקום למטה - פותחים מעל היום
    if (
      top + popupHeight >
      window.innerHeight - 15
    ) {
      top =
        rect.top -
        popupHeight -
        gap;
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

  const handleGuideSelect = async (
    guideId: number
  ) => {
    if (!selectedDate) return;

    const existingAssignment =
      assignments.find(
        (assignment) =>
          assignment.assignment_date ===
          selectedDate
      );

    let savedAssignment: Assignment | null =
      null;

    // =========================
    // עדכון שיבוץ קיים
    // =========================

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
        console.error(
          "Error updating assignment:",
          error
        );

        alert(
          "אירעה שגיאה בעדכון השיבוץ"
        );

        return;
      }

      savedAssignment = data;

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id ===
          existingAssignment.id
            ? data
            : assignment
        )
      );
    }

    // =========================
    // יצירת שיבוץ חדש
    // =========================

    else {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          assignment_date: selectedDate,
          guide_id: guideId,
        })
        .select()
        .single();

      if (error) {
        console.error(
          "Error creating assignment:",
          error
        );

        alert(
          "אירעה שגיאה ביצירת השיבוץ"
        );

        return;
      }

      savedAssignment = data;

      setAssignments((current) => [
        ...current,
        data,
      ]);
    }

    // אם השמירה הצליחה -
    // סוגרים את החלונית
    if (savedAssignment) {
      setSelectedDate(null);
    }
  };

  const selectedGuide = selectedDate
    ? getGuideForDate(selectedDate)
    : null;

  const formatDisplayDate = (
    date: string
  ) => {
    return new Date(
      `${date}T12:00:00`
    ).toLocaleDateString(
      "he-IL",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );
  };

  return (
    <div dir="rtl" className="app">
      <div className="page-container">

        {/* =========================
            HEADER
        ========================= */}

        <header className="page-header">

          <div className="title-area">

            <div className="home-icon">
              🏠
            </div>

            <div>
              <h1>
                שיבוץ מדריכים
              </h1>

                  <p>
               רכז דירה: יאיר טל
              </p>
            </div>

          </div>

          <div className="assignment-counter">

            <div className="counter-icon">
              ✓
            </div>

            <div>
              <strong>
                {assignments.length}
              </strong>

              <span>
                משמרות משובצות
              </span>
            </div>

          </div>

        </header>

        {/* =========================
            CALENDAR
        ========================= */}

        <section className="calendar-card">

          <div className="calendar-header">

            <div>
              <h2>
                לוח המשמרות
              </h2>

              <p>
                לחצ/י על יום כדי לבחור מדריך
              </p>
            </div>

            <div className="calendar-badge">
              📅 לוח חודשי
            </div>

          </div>

          <div className="calendar-container">

            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              locale="he"
              direction="rtl"
              height="auto"
              fixedWeekCount={false}
              dateClick={handleDateClick}
              dayCellContent={(arg) => {

                /*
                 * חשוב:
                 * אנחנו מייצרים את התאריך
                 * לפי הזמן המקומי ולא לפי UTC.
                 */
                const date =
                  formatDateKey(arg.date);

                const guide =
                  getGuideForDate(date);

                return (
                  <div className="day-content">

                    {/* מספר היום */}

                    <div className="day-number">
                      {arg.dayNumberText}
                    </div>

                    {/* מדריך משובץ */}

                    {guide ? (

                      <div className="assigned-guide">

                        <div className="guide-avatar">
                          {guide.name.charAt(0)}
                        </div>

                        <div className="guide-name">
                          {guide.name}
                        </div>

                        <div className="check-icon">
                          ✓
                        </div>

                      </div>

                    ) : (

                      <div className="empty-assignment">

                        <span className="plus">
                          +
                        </span>

                        <span>
                          שיבוץ מדריך
                        </span>

                      </div>

                    )}

                  </div>
                );
              }}
            />

          </div>

        </section>

      </div>

      {/* =========================
          BACKDROP
      ========================= */}

      {selectedDate && (
        <div
          className="popup-backdrop"
          onClick={() =>
            setSelectedDate(null)
          }
        />
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
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          {/* HEADER */}

          <div className="popup-header">

            <div className="popup-icon">
              👤
            </div>

            <div className="popup-title">

              <strong>
                בחירת מדריך
              </strong>

              <span>
                {formatDisplayDate(
                  selectedDate
                )}
              </span>

            </div>

            <button
              className="close-popup"
              onClick={() =>
                setSelectedDate(null)
              }
            >
              ×
            </button>

          </div>

          {/* BODY */}

          <div className="popup-body">

            <div className="popup-label">

              {selectedGuide
                ? "המדריך המשובץ כרגע"
                : "בחרי מדריך למשמרת"}

            </div>

            <div className="guides-list">

              {guides.map((guide) => {

                const isSelected =
                  selectedGuide?.id ===
                  guide.id;

                return (

                  <button
                    key={guide.id}
                    className={`guide-option ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleGuideSelect(
                        guide.id
                      )
                    }
                  >

                    <div className="option-avatar">
                      {guide.name.charAt(0)}
                    </div>

                    <div className="option-details">

                      <strong>
                        {guide.name}
                      </strong>

                      <span>
                        מדריך דירה
                      </span>

                    </div>

                    {isSelected && (

                      <div className="selected-check">
                        ✓
                      </div>

                    )}

                  </button>

                );
              })}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;