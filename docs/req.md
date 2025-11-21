buatkan satu module (ikuti module example yang sudah ada untuk format dan struktur pembuatannya sampai swegernya)
nama module on_board_document
buatkan migrasi tabel on_board_documents
kolom: 
on_board_document_id uuid PK
candidate_id uuid nullable
on_board_document_name (varchar) (nullable)
on_board_document_file (text) (nullable)
on_board_document_description (text) (nullable), 
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)

jakankan migrasinya ke database
buat proses CRUD untuk module on_board_documents
buat swagger untuk module on_board_documents

endpointnya:
POST /api/on_board_document/get (ambil data dari tabel on_board_documents) filternya gini:
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc",
    "candidate_id": "" (uuid, string kosong, null, nan)
}

POST /api/on_board_document/create (buatkan data di tabel on_board_documents)
body type multipart form data

on_board_document_file ini upload file ke minio, gunakan function upload ke minio yg sudah ada untuk dir minionya ini on-board-documents/files

PUT /api/on_board_document/:id
body type multipart form data

on_board_document_file ini upload file ke minio, gunakan function upload ke minio yg sudah ada untuk dir minionya ini on-board-documents/files

DELETE /api/background_check/:id
GET /api/background_check/:id

proses insert created_by dan updated_by dan deleted_by otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id

sesuaikan untuk paginasi dan validation dan response format sesuai yang sudah ada di utils/ dan jangan lupa di route dan di swegernya menggunakan verifyToken seperti module lainnya