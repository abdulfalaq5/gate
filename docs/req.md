buatkan satu module (ikuti module example yang sudah ada untuk format dan struktur pembuatannya sampai swegernya)
nama module background_check
buatkan migrasi tabel background_checks
kolom: 
background_check_id uuid PK
candidate_id uuid nullable
background_check_note text nullable
background_file text nullable
background_status enum (hired, rejected, hold)
background_description (text) (nullable), 
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)

di tabel candidates tolong tambahkan kolom candidate_status (enum = new, interviewed, scheduled, completed, hired, rejected, hold) (default new)
jakankan migrasinya ke database
buat proses CRUD untuk module background_check
buat swagger untuk module background_check

endpointnya:
POST /api/background_check/get (ambil data dari tabel background_checks) filternya gini:
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc",
}

POST /api/background_check/create (buatkan data di tabel background_checks)
body type multipart form data
jika background_status = hired maka otomatis akan update di tabel candidates di kolom candidate_status hired
jika background_status = rejected maka otomatis akan update di tabel candidates di kolom candidate_status rejected
jika background_status = hold maka otomatis akan update di tabel candidates di kolom candidate_status hold

background_file ini upload file ke minio, gunakan function upload ke minio yg sudah ada untuk dir minionya ini background-check/files

PUT /api/background_check/:id
body type multipart form data
body type multipart form data
jika background_status = hired maka otomatis akan update di tabel candidates di kolom candidate_status hired
jika background_status = rejected maka otomatis akan update di tabel candidates di kolom candidate_status rejected
jika background_status = hold maka otomatis akan update di tabel candidates di kolom candidate_status hold

background_file ini upload file ke minio, gunakan function upload ke minio yg sudah ada untuk dir minionya ini background-check/files

DELETE /api/background_check/:id
GET /api/background_check/:id

proses insert created_by dan updated_by dan deleted_by otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id

sesuaikan untuk paginasi dan validation dan response format sesuai yang sudah ada di utils/ dan jangan lupa di route dan di swegernya menggunakan verifyToken seperti module lainnya