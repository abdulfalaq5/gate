/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { pdfGenerator, pdfGeneratorDebug } = require('../../../utils')
const { static_image } = require('./properties')

class CatalogPDFGenerate {
  constructor(responses, type, feeSetting) {
    this.responses = responses;
    this.type = type
    this.feeSetting = feeSetting
    this.docDef = {
      pageSize: {
        width: 1200,
        height: 595.4
      },
      pageOrientation: 'landscape',
      pageMargins: [15, 25, 15, 20],
      content: this.getContent(),
      images: {
        logo: static_image.logo_base_64
      },
      styles: {
        blockTitle: { bold: true, fontSize: 12 },
        tableHeaders: {
          bold: true, fillColor: '#060f6b', fontSize: 10, alignment: 'center', color: '#ffffff'
        },
        dangerCell: { fillColor: '#a1061e', color: '#FFFFFF', fontSize: 8.5 },
        warningCell: { fillColor: '#d1ac06', color: '#FFFFFF', fontSize: 8.5 },
        normalCell: { fillColor: '#FFFFFF', color: '#000000', fontSize: 8.5 },
      },
      defaultStyle: {
        fontSize: 12,
      }
    }
  }

  formatCurrency(amount) {
    // Convert the number to a string
    let formattedAmount = amount.toString();

    // Use a regular expression to insert commas every three digits from the end
    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Return the formatted string
    return formattedAmount;
  }

  getHeaders() {
    return {
      header_width: [
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10,
        'auto', 10,
      ],
      header_body: [
        [
          { text: 'LOT', style: 'tableHeaders', rowSpan: 2 },
          { text: 'LANE', style: 'tableHeaders', rowSpan: 2 },
          { text: 'NOPOL', style: 'tableHeaders', rowSpan: 2 },
          { text: 'MEREK/TIPE', style: 'tableHeaders', rowSpan: 2 },
          // { text: 'TIPE', style: 'tableHeaders', rowSpan: 2 },
          { text: 'TAHUN', style: 'tableHeaders', rowSpan: 2 },
          { text: 'TRANSMISI', style: 'tableHeaders', rowSpan: 2 },
          { text: 'CC', style: 'tableHeaders', rowSpan: 2 },
          { text: 'WARNA', style: 'tableHeaders', rowSpan: 2 },
          { text: 'ODO (KM)', style: 'tableHeaders', rowSpan: 2 },
          { text: 'GRADING', style: 'tableHeaders', colSpan: 3 },
          {},
          {},
          { text: 'BPKB', style: 'tableHeaders', rowSpan: 2 },
          { text: 'FKT', style: 'tableHeaders', rowSpan: 2 },
          { text: 'TGL PAJAK', style: 'tableHeaders', rowSpan: 2 },
          { text: 'KEUR', style: 'tableHeaders', rowSpan: 2 },
          { text: 'NIK', style: 'tableHeaders', rowSpan: 2 },
          { text: 'KWT', style: 'tableHeaders', rowSpan: 2 },
          { text: 'SPH', style: 'tableHeaders', rowSpan: 2 },
          { text: 'HARGA DASAR', style: 'tableHeaders', rowSpan: 2 },
          { text: 'LOKASI POOL', style: 'tableHeaders', rowSpan: 2 },
          // { text: 'NOKA', style: 'tableHeaders', rowSpan: 2 },
          // { text: 'NOSIN', style: 'tableHeaders', rowSpan: 2 },
          { text: 'KETERANGAN UNIT', style: 'tableHeaders', rowSpan: 2 },
          { text: 'KETERANGAN DOKUMEN', style: 'tableHeaders', rowSpan: 2 }
        ],
        [
          {},
          {},
          {},
          // {},
          {},
          {},
          {},
          {},
          {},
          {},
          { text: 'EKS', style: 'tableHeaders' },
          { text: 'INT', style: 'tableHeaders' },
          { text: 'MSN', style: 'tableHeaders' },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          // {},
          // {},
          {},
          {}
        ]
      ]
    }
  }

  // Static Informasi untuk bagian bawah
  getFooters() {
    const adminCarFee = this.formatCurrency(Number(process?.env?.CAR_FEE ?? 0));
    const adminBikeFee = this.formatCurrency(Number(process?.env?.BIKE_FEE ?? 0));
    const percentCarFee = Number(process?.env?.PERCENT_CAR_FEE ?? 0)

    const nominalCompare = this.formatCurrency(process?.env?.NOMINAL_COMPARE)

    let strInfoMobil = '';
    if (percentCarFee == null) {
      strInfoMobil = `untuk mobil sebesar Rp. ${adminCarFee},-/unit.`
    } else {
      strInfoMobil = `untuk mobil dibawah Harga Rp. ${nominalCompare},- sebesar Rp. ${adminCarFee},-/unit dan diatas harga Rp. ${nominalCompare},- sebesar ${percentCarFee}% dari harga terbentuk (unit).`
    }

    const strInfoMotor = `Biaya administrasi untuk motor sebesar Rp.${adminBikeFee},-/unit yang dimenangkan.`

    return {
      body: [
        [
          {
            text: 'KETERANGAN PENTING : (WAJIB UNTUK DIBACA)',
            alignment: 'left',
            style: 'blockTitle'
          }
        ],
        [
          {
            text: '1. Daftar Lot ini hanya merupakan panduan semata bukan sebuah acuan sehingga tidak dapat dijadikan sebagai bahan acuan untuk sebuah keberatan/complain.',
            alignment: 'left',
          }
        ],
        [
          {
            text: '2. Calon Peserta Lelang diwajibkan untuk melihat kondisi obyek lelang saat waktu Open House.',
            alignment: 'left',
          }
        ],
        [
          {
            text: '3. Calon Peserta Lelang diwajibkan melakukan CEK FISIK KENDARAAN DAN DOKUMEN dengan sebaik-baiknya karena kami MENJUAL APA ADANYA.',
            alignment: 'left',
          }
        ],
        [
          {
            columns: [
              {
                text: '4. Pemenang lelang akan dikenakan biaya administrasi',
                alignment: 'left',
                width: 300,
              },
              {
                text: ` ${strInfoMobil}`,
                style: { color: '#a81207' }
              }
            ]
          }
        ],
        [
          {
            text: strInfoMotor,
            style: { color: '#a81207' },
            marginLeft: 11
          }
        ],
        [
          {
            text: '5. Pelunasan paling lambat 3 hari kerja setelah hari lelang, apabila tidak dilunasi dalam dalam jangka waktu sesuai ketentuan maka akan dianggap wanprestasi dan uang deposit akan HANGUS',
            alignment: 'left',
          }
        ],

        [
          {
            text: '6. Hari SABTU, MINGGU dan HARI LIBUR NASIONAL tidak dihitung sebagai Hari Kerja.',
            alignment: 'left',
          }
        ],

        [
          {
            text: '7. Peserta Lelang yang tidak memenangkan lelang, uang deposit akan di kembalikan tanpa potongan. Untuk deposit via transfer Maksimal pengembalian lelang 6 hari kerja setelah lelang.',
            alignment: 'left',
          }
        ],

        [
          {
            text: '8. Khusus complain No Rangka dan No Mesin Paling Lambat 120 HARI SETELAH TANGGAL LELANG.',
            alignment: 'left',
          }
        ],

        [
          {
            text: '9. Rekening a/n PT Universal Collection BANK BCA a/c no. 733.155.8889',
            alignment: 'left',
          }
        ],

        [
          {
            text: '10. Peserta lelang wajib mengembalikan NIPL setelah pelaksanaan lelang selesai (hari H). Apabila NIPL hilang/tertinggal akan dikenakan denda sebesar Rp 50.000,-/NIPL.',
            alignment: 'left',
          }
        ],

        [
          {
            text: '11. Pengambilan Unit Lelang maximum 5 hari kerja setelah hari Lelang. Apabila pengambilan unit lebih dari jangka waktu sesuai ketentuan maka akan dikenakan Denda Rp 200.000,-/HARI.',
            alignment: 'left',
          }
        ],

        [
          {
            text: '12. Dan pihak PT Universal Collection tidak akan bertanggung jawab apabila terjadi KERUSAKAN atau KEHILANGAN pada unit tersebut.',
            alignment: 'left',
          }
        ],

        [
          {
            text: '13. Grading : Eks.=Eksterior - Int.=Interior - Msn.=Mesin',
            alignment: 'left',
          }
        ],

      ]
    }
  }

  getTopInformation() {
    const tops = [
      this.responses.top_headers.label_title,
      this.responses.top_headers.label_auction,
      this.responses.top_headers.label_name,
    ].map((x) => [{
      text: x,
      alignment: 'left',
      style: 'blockTitle'
    }])

    return [
      {
        image: 'logo',
        width: 150,
        alignment: 'left',
        margin: [0, 0, 0, 15]
      },
      {
        margin: [30, 0, 0, 15],
        alignment: 'left',
        table: {
          body: tops,
        },
        layout: {
          hLineWidth(i, node) {
            if (i === 0 || i === node.table.body.length) {
              return 0;
            }
            return (i === node.table.headerRows) ? 2 : 1;
          },
          vLineWidth(i) {
            return 0;
          },
          hLineColor(i) {
            return '#ffffff';
          },
          paddingLeft(i) {
            return i === 0 ? 0 : 8;
          },
          paddingRight(i, node) {
            return (i === node.table.widths.length - 1) ? 0 : 8;
          }
        }
      },
      {
        margin: [15, 0, 30, 0],
        alignment: 'right',
        text: this.responses.catalog_description,
        style: 'blockDesc'
      }
    ]
  }

  // Get content
  getContent() {
    const headers = this.getHeaders();

    const body = [
      ...headers.header_body,
      ...this.responses.data.pdf
    ];

    const content = [
      {
        columns: this.getTopInformation(),
      },
      {
        widths: headers.header_width,
        table: {
          headerRows: 2,
          body
        },
        layout: {
          hLineWidth(i, node) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
          },
          vLineWidth(i, node) {
            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
          },
          pageBreak: 'avoid'
        }
      },
      {
        margin: [0, 20, 0, 0],
        style: {
          border: []
        },
        alignment: 'left',
        table: this.getFooters(),
        layout: {
          hLineWidth(i, node) {
            if (i === 0 || i === node.table.body.length) {
              return 0;
            }
            return (i === node.table.headerRows) ? 2 : 1;
          },
          vLineWidth(i) {
            return 0;
          },
          hLineColor(i) {
            return '#ffffff';
          },
        }
      }
    ]
    return content;
  }

  async makePdf() {
    const generate = await pdfGenerator(this.docDef, this.responses.file_path.pdf.path)
    return generate
  }

  async downloadPdf(res) {
    return pdfGeneratorDebug(this.docDef, this.responses.file_path.pdf.path, res)
  }
}

module.exports = {
  CatalogPDFGenerate
}
