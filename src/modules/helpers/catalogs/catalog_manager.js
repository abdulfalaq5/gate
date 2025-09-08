/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
const moment = require('moment');
require('moment/locale/id');
const { body_responses } = require('./properties')

class CatalogManager {
  constructor(responses, type) {
    this.responses = responses;
    this.type = type;
    moment.locale('id');
  }

  getParamField() {
    return this.type === 'car' ? body_responses.car : body_responses.bike
  }

  convertStatus(status, value) {
    if (status == 'Menyusul') {
      return `${value} HK`
    }
    return status
  }

  convertFormatDate(value, format) {
    return moment(value).format(format);
  }

  convertFormatCurrency(value) {
    const currency = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    return currency
  }

  getExcelStyled(condition) {
    if (condition == 7) {
      return {
        font: {
          name: 'Roboto Normal', bold: false, color: { argb: 'ffffffff' }, size: 9
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff780505' }
        }
      }
    }
    return {
      font: {
        name: 'Roboto Normal', bold: false, color: { argb: '00000000' }, size: 9
      },
    }
  }

  mappingBodyData(rows) {
    const param = this.getParamField();
    const pdfData = [];
    const excelData = [];
    rows.map((r) => {
      const styleName = parseInt(r?.[param.allocation_status], 10) == 7 ? 'dangerCell' : 'normalCell';
      const excelStyle = this.getExcelStyled(parseInt(r?.[param.allocation_status], 10))
        pdfData.push([
          { text: r?.[param.lot_number], style: styleName, },
          { text: r?.[param.allocation_lane], style: styleName, },
        { text: r?.[param.police_number], style: styleName, },
        { text: `${r?.[param.brand_name]}/${r?.[param.type_name]}`, style: styleName, },
        // { text: r?.[param.brand_name], style: styleName, },
        // { text: r?.[param.type_name], style: styleName, },
        { text: r?.[param.year], style: styleName, },
        { text: r?.[param.transmission], style: styleName, },
        { text: r?.[param.cc], style: styleName, },
        { text: r?.[param.color], style: styleName, },
        { text: r?.[param.odometers], style: styleName, },
        { text: r?.[param.exterior_grade], style: styleName, },
        { text: r?.[param.interior_grade] == undefined ? '' : r?.[param.interior_grade], style: styleName, },
        { text: r?.[param.engine_grade], style: styleName, },
        { text: this.convertStatus(r?.[param.bpkb_status], r?.[param.bpkb_value]), style: styleName, },
        { text: r?.[param.invoice_status], style: styleName, },
        { text: !r?.[param.valid_period_stnk] ? '-' : this.convertFormatDate(r?.[param.valid_period_stnk], 'DD-MM-YYYY'), style: styleName, },
        { text: r?.[param.kur_status] == 1 ? 'Ada' : 'Tidak Ada', style: styleName, },
        { text: r?.[param.nik_status], style: styleName, },
        { text: r?.[param.kwitansi_status], style: styleName, },
        { text: r?.[param.sph_status], style: styleName, },
        { text: this.convertFormatCurrency(r?.[param.allocation_start_price]), style: styleName, }, // format currency
        { text: r?.[param.pool_location_name], style: styleName, },
        { text: r?.[param.unit_desc], style: styleName, },
        { text: r?.[param.document_description], style: styleName, },
      ])

      excelData.push([
        { text: r?.[param.lot_number], excelStyle },
        { text: r?.[param.allocation_lane], excelStyle },
        { text: r?.[param.police_number], excelStyle },
        { text: r?.[param.brand_name], excelStyle },
        { text: r?.[param.type_name], excelStyle },
        { text: r?.[param.year], excelStyle },
        { text: r?.[param.transmission], excelStyle },
        { text: r?.[param.cc], excelStyle },
        { text: r?.[param.color], excelStyle },
        { text: r?.[param.odometers], excelStyle },
        { text: r?.[param.exterior_grade], excelStyle },
        { text: r?.[param.interior_grade] == undefined ? '' : r?.[param.interior_grade], excelStyle },
        { text: r?.[param.engine_grade], excelStyle },
        { text: this.convertStatus(r?.[param.bpkb_status], r?.[param.bpkb_value]), excelStyle },
        { text: r?.[param.invoice_status], excelStyle },
        { text: !r?.[param.valid_period_stnk] ? '-' : this.convertFormatDate(r?.[param.valid_period_stnk], 'DD-MM-YYYY'), excelStyle },
        { text: r?.[param.kur_status] == 1 ? 'Ada' : 'Tidak Ada', excelStyle },
        { text: r?.[param.nik_status], excelStyle },
        { text: r?.[param.kwitansi_status], excelStyle },
        { text: r?.[param.sph_status], excelStyle },
        { text: this.convertFormatCurrency(r?.[param.allocation_start_price]), excelStyle }, // format currency
        { text: r?.[param.pool_location_name], excelStyle },
        { text: r?.[param.frame_number], excelStyle },
        { text: r?.[param.engine_number], excelStyle },
        { text: r?.[param.unit_desc], excelStyle },
        { text: r?.[param.document_description], excelStyle },
      ])
    })  
    return {
      pdf: pdfData,
      excel: excelData
    };
  }

  makeData() {
    const dateNow = Date.now()
    return {
      catalog_description: this.responses.catalog_description ? this.responses.catalog_description.toUpperCase() : '',
      cover_title: this.type === 'car' ? 'Cetak Katalog Mobil' : 'Cetak Katalog Motor',
      location_name: this.responses.location_name,
      auction_name: this.responses.auction_name,
      auction_start_date: this.convertFormatDate(this.responses.auction_start_date, 'D MMMM YYYY'),
      file_path: {
        pdf: {
          filename: `catalogue-lot-${this.type}_${dateNow}.pdf`,
          path: `public/pdf/catalogue-lot-${this.type}_${dateNow}.pdf`
        },
        excel: {
          filename: `catalogue-lot-${this.type}_${dateNow}.xlsx`,
          path: `public/excel/catalogue-lot-${this.type}_${dateNow}.xlsx`
        },
      },
      top_headers: {
        label_title: this.type === 'car' ? 'Daftar Lot Mobil' : 'Daftar Lot Motor',
        label_auction: `Lelang ${this.type ==='car' ? 'Mobil' : 'Motor'} Bekas Murah ${this.responses.location_name} - ${this.convertFormatDate(this.responses.auction_start_date, 'D MMMM YYYY')}`,
        label_name: this.responses.location_name
      },
      data: this.mappingBodyData(this.responses.data)
    }
  }
}

module.exports = {
  CatalogManager
}
