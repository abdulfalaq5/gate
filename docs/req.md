buatkan satu module (ikuti module example yang sudah ada untuk format dan struktur pembuatannya sampai swegernya)
nama module note
buatkan migrasi tabel notes
kolom: 
note_id
candidate_id
employee_id get user_id dari token prossnya mirip seperti module interview
notes
noted_description (text) (nullable), 
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)

jakankan migrasinya ke database
buat proses CRUD untuk module notes
buat swagger untuk module notes

endpointnya:
POST /api/on_board_dnoteocument/get (ambil data dari tabel note) filternya gini:
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc",
    "candidate_id": "" (uuid, string kosong, null, nan)
}

POST /api/note/create (buatkan data di tabel note)

PUT /api/on_board_document/:id

DELETE /api/background_check/:id
GET /api/background_check/:id

proses insert created_by dan updated_by dan deleted_by otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id

sesuaikan untuk paginasi dan validation dan response format sesuai yang sudah ada di utils/ dan jangan lupa di route dan di swegernya menggunakan verifyToken seperti module lainnya