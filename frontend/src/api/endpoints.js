// Mirrors backend/routes/*.route.js exactly.
// NOTE: apply/:id is a GET on the backend (not POST) - keep it that way here too.

export const USER_API = {
  REGISTER: "/user/register", // POST
  LOGIN: "/user/login", // POST
  LOGOUT: "/user/logout", // GET
  UPDATE_PROFILE: "/user/profile/update", // PUT (multipart if resume upload added later)
};

export const JOB_API = {
  POST_JOB: "/job/post", // POST
  GET_ALL_JOBS: "/job/get", // GET  ?keyword=
  GET_ADMIN_JOBS: "/job/getadminjobs", // GET
  GET_JOB_BY_ID: (id) => `/job/get/${id}`, // GET
};

export const COMPANY_API = {
  REGISTER: "/company/register", // POST
  GET_ALL: "/company/get", // GET
  GET_BY_ID: (id) => `/company/get/${id}`, // GET
  UPDATE: (id) => `/company/update/${id}`, // PUT
};

export const APPLICATION_API = {
  APPLY: (id) => `/application/apply/${id}`, // GET
  GET_APPLIED_JOBS: "/application/get", // GET
  GET_APPLICANTS: (id) => `/application/${id}/applicants`, // GET
  UPDATE_STATUS: (id) => `/application/status/${id}/update`, // POST
};
