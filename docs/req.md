buatkan satu module (ikuti module example yang sudah ada untuk format dan struktur pembuatannya sampai swegernya)
nama module candidate
buatkan migrasi tabel type_steerings
kolom: 
candidate_id uuid primary key
company_id uuid nullable
department_id uuid nullable
title_id uuid nullable
candidate_name varchar nullable
candidate_email varchar nullable
candidate_phone varchar nullable
candidate_religion varchar nullable
candidate_gender varchar nullable
candidate_marital_status varchar nullable
candidate_age number nullable
candidate_date_birth date nullable
candidate_nationality varchar nullable
candidate_city varchar nullable
candidate_state varchar nullable
candidate_country varchar nullable
candidate_address text nullable
candidate_foto text nullable
candidate_resume text nullable
candidate_number varchar nullable
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)
jakankan migrasinya ke database
buat proses CRUD untuk module typeSteering
buat swagger untuk module typeSteering

endpointnya:
POST /api/candidates/get (ambil data dari tabel candidates) filternya gini:
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc",
}

POST /api/candidates/create (buatkan data di tabel candidates)
multipart/form-data
untuk candidate_foto dan candidate_resume di upload ke minio gunakan function yg sudah ada

PUT /api/candidates/:id
multipart/form-data
untuk candidate_foto dan candidate_resume di upload ke minio gunakan function yg sudah ada
jangan sampai menimpa data yg sudah ada jika candidate_foto atau candidate_resume tidak diubah maka tidak perlu diupload

DELETE /api/candidates/:id

GET /api/candidates/:id
get data semua relasi dari tabel candidates

proses insert created_by dan updated_by dan deleted_by otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id

sesuaikan untuk paginasi dan validation dan response format sesuai yang sudah ada di utils/ dan jangan lupa di route dan di swegernya menggunakan verifyToken seperti module lainnya