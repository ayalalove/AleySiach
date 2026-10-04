const API_URL = "http://localhost:3000";

export const api = {
  guides: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/guides`);
      return response.json();
    },

    create: async (name: string) => {
      const response = await fetch(`${API_URL}/guides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      return response.json();
    },

    update: async (id: string, name: string) => {
      const response = await fetch(`${API_URL}/guides/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/guides/${id}`, {
        method: "DELETE",
      });

      return response.json();
    },
  },

  assignments: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/assignments`);
      return response.json();
    },

    create: async (assignment_date: string, guide_id: string) => {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment_date,
          guide_id,
        }),
      });

      return response.json();
    },

    update: async (
      id: string,
      assignment_date: string,
      guide_id: string,
    ) => {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment_date,
          guide_id,
        }),
      });

      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: "DELETE",
      });

      return response.json();
    },
  },

  reminders: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/reminders`);
      return response.json();
    },

    create: async (
      reminder_date: string,
      title: string,
      content: string | null,
    ) => {
      const response = await fetch(`${API_URL}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reminder_date,
          title,
          content,
        }),
      });

      return response.json();
    },

    update: async (
      id: string,
      reminder_date: string,
      title: string,
      content: string | null,
    ) => {
      const response = await fetch(`${API_URL}/reminders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reminder_date,
          title,
          content,
        }),
      });

      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/reminders/${id}`, {
        method: "DELETE",
      });

      return response.json();
    },
  },
};