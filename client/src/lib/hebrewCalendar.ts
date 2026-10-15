import {
  HDate,
  HebrewCalendar,
  Locale,
  flags,
  gematriya,
  type Event,
} from "@hebcal/core";

const LOCALE = "he-x-NoNikud";

// מתוך המועדים המודרניים מציגים רק את המרכזיים
const MODERN_ALLOWED = new Set([
  "Yom HaShoah",
  "Yom HaZikaron",
  "Yom HaAtzma'ut",
  "Yom Yerushalayim",
]);

export type HebrewEventType = "shabbat" | "chag" | "other";

export type HebrewEvent = {
  title: string;
  type: HebrewEventType;
};

export type HebrewDayInfo = {
  hebrewDate: string;
  events: HebrewEvent[];
  isChag: boolean;
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getHebrewMonthName = (hd: HDate) =>
  Locale.gettext(hd.getMonthName(), LOCALE);

// "ג׳" — ובראש חודש עברי גם שם החודש: "א׳ חשון"
export const getShortHebrewDate = (date: Date) => {
  const hd = new HDate(date);
  const day = gematriya(hd.getDate());

  return hd.getDate() === 1 ? `${day} ${getHebrewMonthName(hd)}` : day;
};

// =========================
// חודש עברי
// =========================

// היום הלועזי שבו מתחיל החודש העברי של התאריך הנתון (א׳ בחודש)
export const getHebrewMonthStart = (date: Date) => {
  const hd = new HDate(date);

  return new HDate(1, hd.getMonth(), hd.getFullYear()).greg();
};

// היום הלועזי האחרון בחודש העברי שמתחיל ב-start
export const getHebrewMonthEnd = (start: Date) => {
  const hd = new HDate(start);

  return new HDate(hd.daysInMonth(), hd.getMonth(), hd.getFullYear()).greg();
};

// מעבר לחודש העברי הקודם (-1) או הבא (+1)
export const shiftHebrewMonth = (start: Date, delta: 1 | -1) => {
  const target =
    delta === 1 ? new Date(getHebrewMonthEnd(start)) : new Date(start);

  target.setDate(target.getDate() + delta);

  return getHebrewMonthStart(target);
};

// מספר השבועות (שורות בלוח) שהחודש העברי פורש עליהם
export const getHebrewMonthWeeks = (start: Date) => {
  const end = getHebrewMonthEnd(start);
  const daysInGrid =
    start.getDay() +
    Math.round((end.getTime() - start.getTime()) / 86_400_000) +
    1;

  return Math.ceil(daysInGrid / 7);
};

// "חשון תשפ״ז · אוקטובר–נובמבר 2026"
export const getHebrewMonthTitle = (start: Date) => {
  const hd = new HDate(start);
  const end = getHebrewMonthEnd(start);

  const hebrew = `${getHebrewMonthName(hd)} ${gematriya(hd.getFullYear())}`;

  const monthName = (date: Date) =>
    date.toLocaleDateString("he-IL", { month: "long" });

  let gregorian: string;

  if (start.getFullYear() !== end.getFullYear()) {
    gregorian = `${monthName(start)} ${start.getFullYear()}–${monthName(end)} ${end.getFullYear()}`;
  } else if (start.getMonth() !== end.getMonth()) {
    gregorian = `${monthName(start)}–${monthName(end)} ${end.getFullYear()}`;
  } else {
    gregorian = `${monthName(start)} ${end.getFullYear()}`;
  }

  return `${hebrew} · ${gregorian}`;
};

// "ג׳ חשון תשפ״ז"
export const getFullHebrewDate = (date: Date) =>
  new HDate(date).renderGematriya(true);

const getEventType = (event: Event): HebrewEventType => {
  const eventFlags = event.getFlags();

  if (eventFlags & flags.CHAG) return "chag";

  if (eventFlags & (flags.PARSHA_HASHAVUA | flags.SPECIAL_SHABBAT)) {
    return "shabbat";
  }

  return "other";
};

const isEventShown = (event: Event) => {
  if (event.getFlags() & flags.MODERN_HOLIDAY) {
    return MODERN_ALLOWED.has(event.getDesc());
  }

  return true;
};

// מחזיר מפה של "YYYY-MM-DD" → תאריך עברי ומועדים, לטווח התאריכים הנתון
export const getHebrewDays = (start: Date, end: Date) => {
  const days = new Map<string, HebrewDayInfo>();

  for (
    let date = new Date(start);
    date < end;
    date.setDate(date.getDate() + 1)
  ) {
    days.set(formatDateKey(date), {
      hebrewDate: getShortHebrewDate(date),
      events: [],
      isChag: false,
    });
  }

  const events = HebrewCalendar.calendar({
    start,
    end,
    il: true,
    sedrot: true,
  });

  events.filter(isEventShown).forEach((event) => {
    const day = days.get(formatDateKey(event.getDate().greg()));

    if (!day) return;

    const type = getEventType(event);

    day.events.push({ title: event.render(LOCALE), type });

    if (type === "chag") {
      day.isChag = true;
    }
  });

  return days;
};
