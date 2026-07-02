export interface BirthdayEntry {
  id: string;
  name: string;
  dob: string; // ISO yyyy-mm-dd
}

// Shape used only for the add-form / API payload — email is write-only and
// never echoed back by the API (see /api/birthdays), so it isn't part of
// BirthdayEntry (the shape used for the list the client keeps in state).
export interface NewBirthdayInput {
  name: string;
  dob: string;
  email: string;
}
