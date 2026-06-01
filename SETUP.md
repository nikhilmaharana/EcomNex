Project Setup

Frontend
- Copy `frontend/.env.example` to `frontend/.env`.
- Set `VITE_API_BASE_URL` when the API is not available through the Vite `/api` proxy.
- Restart the dev server (`npm run dev`) after changing `.env`.

Backend
- Copy `backend/.env.example` to `backend/.env`.
- Set `MONGO_URI` to the MongoDB database the API should use.
- Set `CONTACT_EMAIL` to the email address that should receive contact messages.
- For real email sending, either set `EMAIL_SERVICE` with `EMAIL_USER` and `EMAIL_PASS`, or set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS`.
- Without email credentials, the contact endpoint accepts the message and reports that delivery is disabled for the environment.

Quick local run
- Start backend:

```bash
cd backend
cp .env.example .env   # fill values
npm install
npm run start
```

- Start frontend:

```bash
cd frontend
cp .env.example .env   # fill values
npm install
npm run dev
```

Database check
- With the backend running, open or request `http://localhost:5000/api/health`.
- A healthy API returns status `ok` and database `connected`.
- If MongoDB is unreachable, backend startup fails with a connection message and the health endpoint is not served.

Admin account
- Public signup creates only buyer and seller accounts.
- Set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`.
- From `backend`, run `npm run admin:create`.
- Open `/adminlogin` and log in with that admin email and password.

Demo data
- To create demo buyer, seller, admin, and products in the configured MongoDB database, run `npm run seed` from `backend`.
- Demo credentials are printed by the seed script. Use them for local development only.

Testing contact endpoint
- With backend running, POST to `http://localhost:5000/api/contact` with JSON `{ "name":"You","email":"you@example.com","message":"Hi" }`.
