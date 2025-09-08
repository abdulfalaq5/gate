/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */

const ExcelJS = require('exceljs')
const { static_image } = require('./properties')
const { excelGenerator } = require('../../../utils')

class CatalogExcelGenerate {
  constructor(responses, type, feeSetting = null) {
    this.responses = responses;
    this.type = type;
    this.feeSetting = feeSetting

    this.workBook = new ExcelJS.Workbook();
    this.workBook.created = new Date();
    this.workSheet = this.workBook.addWorksheet(
      type == 'car' ? 'Catalog Mobil' : 'Catalog Motor'
    );
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
      content: [
        [
          { text: 'LOT', type: 'rowspan', merge: { rows: 2 } },
          { text: 'LANE', type: 'rowspan', merge: { rows: 2 } },
          { text: 'NOPOL', type: 'rowspan', merge: { rows: 2 } },
          { text: 'MEREK', type: 'rowspan', merge: { rows: 2 } },
          { text: 'TIPE', type: 'rowspan', merge: { rows: 2 } },
          { text: 'TAHUN', type: 'rowspan', merge: { rows: 2 } },
          { text: 'TRANSMISI', type: 'rowspan', merge: { rows: 2 } },
          { text: 'CC', type: 'rowspan', merge: { rows: 2 } },
          { text: 'WARNA', type: 'rowspan', merge: { rows: 2 } },
          { text: 'ODOMETER (KM)', type: 'rowspan', merge: { rows: 2 } },
          { text: 'GRADING', type: 'colspan', merge: { cols: 3 } },
          { text: 'BPKB', type: 'rowspan', merge: { rows: 2 } },
          { text: 'FKT', type: 'rowspan', merge: { rows: 2 } },
          { text: 'TGL PAJAK', type: 'rowspan', merge: { rows: 2 } },
          { text: 'KEUR', type: 'rowspan', merge: { rows: 2 } },
          { text: 'NIK', type: 'rowspan', merge: { rows: 2 } },
          { text: 'KWT', type: 'rowspan', merge: { rows: 2 } },
          { text: 'SPH', type: 'rowspan', merge: { rows: 2 } },
          { text: 'HARGA DASAR', type: 'rowspan', merge: { rows: 2 } },
          { text: 'LOKASI POOL', type: 'rowspan', merge: { rows: 2 } },
          { text: 'NOKA', type: 'rowspan', merge: { rows: 2 } },
          { text: 'NOSIN', type: 'rowspan', merge: { rows: 2 } },
          { text: 'KETERANGAN UNIT', type: 'rowspan', merge: { rows: 2 } },
          { text: 'KETERANGAN DOKUMEN', type: 'rowspan', merge: { rows: 2 } }
        ],
        [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          { text: 'EKS', type: 'none' },
          { text: 'INT', type: 'none' },
          { text: 'MSN', type: 'none' },
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ]
      ],
      styled: {
        font: { bold: true, color: { argb: 'ffffffff' }, size: 10 },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff060f6b' }
        },
        border: {
          top: { style: 'thin', color: { argb: 'fffefefe' } },
          left: { style: 'thin', color: { argb: 'fffefefe' } },
          bottom: { style: 'thin', color: { argb: 'fffefefe' } },
          right: { style: 'thin', color: { argb: 'fffefefe' } }
        }
      }
    }
  }

  getFooters() {
    const adminCarFee = this.formatCurrency(Number(process?.env?.CAR_FEE ?? 0));
    const adminBikeFee = this.formatCurrency(Number(process?.env?.BIKE_FEE ?? 0));
    const percentCarFee = Number(process?.env?.PERCENT_CAR_FEE ?? 0)

    const nominalCompare = this.formatCurrency(process?.env?.NOMINAL_COMPARE)

    let strInfo = '';
    if (percentCarFee == null) {
      strInfo = `untuk mobil sebesar Rp. ${adminCarFee},-/unit. Biaya administrasi untuk motor sebesar Rp. ${adminBikeFee},-/unit yang dimenangkan`
    } else {
      strInfo = `untuk mobil dibawah Harga Rp. ${nominalCompare},- sebesar Rp. ${adminCarFee},-/unit dan diatas harga Rp. ${nominalCompare},- sebesar ${percentCarFee}% dari harga terbentuk (unit). Biaya administrasi untuk motor sebesar Rp. ${adminBikeFee},-/unit yang dimenangkan.`
    }

    return [
      [
        {
          text: 'KETERANGAN PENTING : (WAJIB UNTUK DIBACA)',
          style: {
            font: {
              name: 'Roboto Bold', bold: true, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '1. Daftar Lot ini hanya merupakan panduan semata bukan sebuah acuan sehingga tidak dapat dijadikan sebagai bahan acuan untuk sebuah keberatan/complain.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '2. Calon Peserta Lelang diwajibkan untuk melihat kondisi obyek lelang saat waktu Open House.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '3. Calon Peserta Lelang diwajibkan melakukan CEK FISIK KENDARAAN DAN DOKUMEN dengan sebaik-baiknya karena kami MENJUAL APA ADANYA.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '4. Pemenang lelang akan dikenakan biaya administrasi',
          type: 'colspan',
          merge: { cols: 4 },
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        },
        {
          text: `  ${strInfo}`,
          style: {
            font: {
              name: 'Roboto Bold', bold: true, color: { argb: 'ffa81207' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '5. Pelunasan paling lambat 3 hari kerja setelah hari lelang, apabila tidak dilunasi dalam dalam jangka waktu sesuai ketentuan maka akan dianggap wanprestasi dan uang deposit akan HANGUS',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '6. Hari SABTU, MINGGU dan HARI LIBUR NASIONAL tidak dihitung sebagai Hari Kerja.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '7. Peserta Lelang yang tidak memenangkan lelang, uang deposit akan di kembalikan tanpa potongan. Untuk deposit via transfer Maksimal pengembalian lelang 6 hari kerja setelah lelang.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '8. Khusus complain No Rangka dan No Mesin Paling Lambat 120 HARI SETELAH TANGGAL LELANG.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '9. Rekening a/n PT Universal Collection BANK BCA a/c no. 733.155.8889',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '10. Peserta lelang wajib mengembalikan NIPL setelah pelaksanaan lelang selesai (hari H). Apabila NIPL hilang/tertinggal akan dikenakan denda sebesar Rp 50.000,-/NIPL.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '11. Pengambilan Unit Lelang maximum 5 hari kerja setelah hari Lelang. Apabila pengambilan unit lebih dari jangka waktu sesuai ketentuan maka akan dikenakan Denda Rp 200.000,-/HARI.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '12. Dan pihak PT Universal Collection tidak akan bertanggung jawab apabila terjadi KERUSAKAN atau KEHILANGAN pada unit tersebut.',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
      [
        {
          text: '13. Grading : Eks.=Eksterior - Int.=Interior - Msn.=Mesin',
          style: {
            font: {
              name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 10
            },
            alignment: { horizontal: 'left' },
          }
        }
      ],
    ]
  }

  getTopInformation() {
    return {
      images: {
        logo: static_image.logo_base_64
      },
      data: [
        this.responses.top_headers.label_title,
        this.responses.top_headers.label_auction,
        this.responses.top_headers.label_name,
      ],
      styled: {
        font: {
          name: 'Roboto Bold',
          bold: true,
          color: { argb: '00000000' },
          size: 11
        }
      },
      description: this.responses.catalog_description

    }
  }

  createHeader() {
    const headers = this.getHeaders()
    let rows = this.workSheet.lastRow.number + 2;
    for (let i = 0; i < headers.content.length; i++) {
      let column = 1;
      for (let j = 0; j < headers.content[i].length; j++) {
        const content = headers.content[i][j];
        if (content == null) {
          column += 1
          continue;
        }

        this.workSheet.getCell(rows, column).value = content.text
        this.workSheet.getCell(rows, column).style = headers.styled
        this.workSheet.getColumn(column).width = 12

        if (content.type == 'rowspan') {
          this.workSheet.mergeCells(rows, column, (rows + content.merge.rows) - 1, column)
        } else if (content.type == 'colspan') {
          this.workSheet.mergeCells(rows, column, rows, (column + content.merge.cols) - 1)
          column = (column + content.merge.cols) - 1;
        }
        column += 1
      }

      rows++;
    }
  }

  createTopInformation() {
    const topInformation = this.getTopInformation();

    const imageLogo = this.workBook.addImage({
      base64: topInformation.images.logo,
      extension: 'jpg'
    })

    this.workSheet.addImage(imageLogo, {
      tl: { col: 0, row: 1 },
      ext: { width: 250, height: 65 }
    })

    // Set top information to cell
    for (let i = 0; i < topInformation.data.length; i++) {
      const cellRows = this.workSheet.getCell(`D${i + 2}`);
      cellRows.value = topInformation.data[i];
      cellRows.style = topInformation.styled
    }

    const cellDescription = this.workSheet.getCell('W2')
    cellDescription.value = topInformation.description
    cellDescription.style = {
      font: {
        name: 'Roboto Bold',
        bold: true,
        color: { argb: '00000000' },
        size: 14
      }
    }
    this.workSheet.mergeCells('W2:X3');
    this.workSheet.getCell('W2').alignment = { vertical: 'middle', horizontal: 'center' }
  }

  createContent() {
    let row = this.workSheet.lastRow.number + 1;
    for (let i = 0; i < this.responses.data.excel.length; i++) {
      let column = 1;
      for (let j = 0; j < this.responses.data.excel[i].length; j++) {
        const element = this.responses.data.excel[i][j];
        this.workSheet.getCell(row, column).value = element.text
        this.workSheet.getCell(row, column).style = element.excelStyle
        column++
      }
      row++;
    }
  }

  createBottomInformation() {
    const bottoms = this.getFooters();
    let row = this.workSheet.lastRow.number + 2;
    for (let i = 0; i < bottoms.length; i++) {
      let column = 1;
      for (let j = 0; j < bottoms[i].length; j++) {
        const content = bottoms[i][j];

        if (content == null) {
          column += 1
          continue;
        }

        this.workSheet.getCell(row, column).value = content.text
        this.workSheet.getCell(row, column).style = content.style

        if (content?.type && content?.type == 'rowspan') {
          this.workSheet.mergeCells(row, column, (row + content.merge.rows) - 1, column)
        } else if (content?.type && content?.type == 'colspan') {
          this.workSheet.mergeCells(row, column, row, (column + content.merge.cols) - 1)
          column = (column + content.merge.cols) - 1;
        }

        column += 1
      }
      row++
    }
  }

  async makeExcel() {
    this.createTopInformation();
    this.createHeader();
    this.createContent();
    this.createBottomInformation()

    const generate = await excelGenerator(this.workBook, this.responses.file_path.excel.path);
    return generate
  }
}

module.exports = {
  CatalogExcelGenerate
}
