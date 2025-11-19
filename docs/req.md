buatkan satu module (ikuti module example yang sudah ada untuk format dan struktur pembuatannya sampai swegernya)
nama module schedule_interview
buatkan migrasi tabel schedule_interviews
kolom: 
schedule_interview_id (uuid)
candidate_id (uuid)
assign_role (varchar nullable)
schedule_interview_date (date nullable)
schedule_interview_time (time nullable)
schedule_interview_duration (varchar nullable)
schedule_interview_description
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)


jakankan migrasinya ke database
buat proses CRUD untuk module schedule_interview
buat swagger untuk module schedule_interview

endpointnya:
POST /api/schedule_interview/get (ambil data dari tabel candidates) filternya gini:
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc",
}

POST /api/schedule_interview/create

PUT /api/schedule_interview/:id

DELETE /api/schedule_interview/:id

GET /api/schedule_interview/:id
get data semua relasi dari tabel schedule_interview

proses insert created_by dan updated_by dan deleted_by otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id

sesuaikan untuk paginasi dan validation dan response format sesuai yang sudah ada di utils/ dan jangan lupa di route dan di swegernya menggunakan verifyToken seperti module lainnya