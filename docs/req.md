buatkan satu module (ikuti module example yang sudah ada untuk format dan struktur pembuatannya sampai swegernya)
nama module interview
buatkan migrasi tabel interviews
kolom: 
interview_id (uuid) pk
schedule_interview_id (uuid)(nullable)
employee_id (uuid)(nullable) proses insert otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id
interview_company_value (varchar)(nullable)
interview_comment (varchar)(nullable)
interview_total_score (varchar)(nullable)
interview_description (varchar)(nullable)
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)

buatkan migrasi tabel detail_interviews
kolom: 
detail_interview_id uuid pk
interview_id (uuid)(nullable)
detail_interview_aspect (varchar)(nullable)
detail_interview_question (varchar)(nullable)
detail_interview_answer (varchar)(nullable)
detail_interview_score (varchar)(nullable)
detail_interview_description (varchar)(nullable)
created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, is_delete (boolean)

jakankan migrasinya ke database
buat proses CRUD untuk module interview
buat swagger untuk module interview

endpointnya:
POST /api/interview/get (ambil data dari tabel candidates) filternya gini:
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc",
}

POST /api/interview/create
bodyrequstnya ini:
{
  "schedule_interview_id": "123e4567-e89b-12d3-a456-426614174000",
  "interviews": [
    {
      "company_value": "Integrity",
      "comment": "Kandidat menunjukkan kemampuan leadership yang baik.",
      "total_score":"98",
      "detail_interviews": [
        {
          "aspect": "Leadership",
          "question": "Bagaimana Anda menangani konflik dalam tim?",
          "answer": "Saya selalu mencoba mendengarkan semua pihak dan mencari solusi yang adil.",
          "score": 85
        },
        {
          "aspect": "Communication",
          "question": "Bagaimana Anda berkomunikasi dengan stakeholder?",
          "answer": "Saya selalu transparan dan terbuka dalam komunikasi.",
          "score": 90
        }
      ]
    },
    {
      "company_value": "Excellence",
      "comment": "Kandidat menunjukkan kemampuan technical skills yang baik.",
      "total_score":"98",
      "detail_interviews": [
        {
          "aspect": "Technical Skills",
          "question": "Apa pengalaman Anda dengan teknologi modern?",
          "answer": "Saya telah menggunakan React, Node.js, dan PostgreSQL dalam project terakhir.",
          "score": 88
        }
      ]
    }
  ]
}

PUT /api/interview/:id (bidy request samakan dnegan POST juga)

DELETE /api/interview/:id

GET /api/interview/:id
get data semua relasi dari tabel interview

proses insert created_by dan updated_by dan deleted_by otomatis dari token yang dikirimkan, ini berisi uud dari token ada employee_id atau user_id

sesuaikan untuk paginasi dan validation dan response format sesuai yang sudah ada di utils/ dan jangan lupa di route dan di swegernya menggunakan verifyToken seperti module lainnya