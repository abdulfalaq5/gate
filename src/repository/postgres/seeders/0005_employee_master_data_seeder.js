const { v4: uuidv4 } = require('uuid')

/**
 * Employee Master Data Seeder
 * Seeds master data required for employee import
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Creating Employee Master Data seeder...')
    
    // Common departments from the CSV data
    const departments = [
      'BOD',
      'IEC Customer Development', 
      'Logistic Container Segmentation',
      'Sales Container',
      'Product Container',
      'Marketing Container',
      'Nickel - segmentation',
      'Sales Maluku',
      'IM Maluku',
      'Marketing Maluku',
      'Sales Sul',
      'IM Sul',
      'Coal - Kalimantan Segmentation',
      'Sales Kal',
      'IM Kal',
      'Marketing Kal',
      'Coal - Sumatera Segmentation',
      'Sumatera (Sum)',
      'IM Sum',
      'IEL Spare Part',
      'IEL - Core Team',
      'Warehouse',
      'Inventory Management',
      'Process Excelent',
      'Order Management',
      'Sales & Network Development',
      'IEL-SC',
      'IEL - Angsana (Kal)',
      'IEL - Warehouse (Kal)',
      'IEL - Kendari (Sul)',
      'IEL - Warehouse (Sul-Kdi)',
      'IEL - Sofifi (Mal)',
      'IEL - Warehouse (Mal)',
      'IEL - Jakarta (Jav)',
      'IEL - Warehouse (Jav)',
      'IEL AfterSales',
      'Service',
      'Technical Support',
      'IEL-TS-Sulawesi',
      'After sales Sul',
      'IEL-TS-Maluku',
      'After Sales Maluku',
      'IEL-TS-Kalimantan',
      'Warranty',
      'Training',
      'MSO (Motor Sights Overseas)',
      'BOD-MSO',
      'Truck - MSO',
      'After Sales - MSO',
      'Spare Parts - MSO',
      'Business Support Center - MSO',
      'Finance - MSO',
      'HRGA - MSO',
      'IT - MSO',
      'Operation - MSO',
      'ITI',
      'MSF (Motor Sights Fleet)',
      'MSW (Motor Sights Waretech)',
      'CO Shared Service (MSI)',
      'ITI-HO',
      'ERP',
      'Supply Chain (SC)',
      'Custom',
      'Brand & Mkt',
      'Content',
      'FAT',
      'Finance',
      'TAX',
      'Financing',
      'HCCA',
      'Legal',
      'HR Operation',
      'HR Growth',
      'GA - Java (Jav)',
      'HR Training',
      'HR Recruitment',
      'Purchasing',
      'Chinese Member',
      'Spare Parts - Xian',
      'IEL - Purchase (Xian)',
      'HR-西安',
      'Warranty -xian',
      '研发-西安',
      'Have Multiple ID',
      'NAM (Not Active Member)',
      'ETI Company',
      'MSP (Motor Sights Philippines)'
    ]

    // Common titles from the CSV data
    const titles = [
      'President Director',
      'Vice President Director', 
      'Vice President',
      'Logistic Container',
      'Head of Sales - Logistic Container',
      'Data Analyst',
      'Head of Product Development',
      'Homologation',
      'Marketing - Logistic Container',
      'Executive Coordinator - NICKEL SEGMENTATION',
      'Cust Dev Consultant (MT)',
      'Senior Sales',
      'Nanny',
      'Security',
      'Finance & Purchasing',
      'HRGA',
      'Driver Operasional',
      'Facility Coordinator',
      'Office Boy',
      'Marketing - Nickel Segmentation (Sulawesi & Halmahera)',
      'Purchasing',
      'Cust Dev Consultant',
      'General Affair Staff',
      'Finance Chasier',
      'Finance Cashier',
      'Cleaner',
      'GM Sales Coal - Kalimantan',
      'Sales Coal',
      'Sales',
      'Sales Counter',
      'Cust Dev Consultant (MT)',
      'Head of Sales',
      'Head of Spare Part',
      'WH & Logistics Head',
      'Inventory Management Head',
      'Spare Part Engineer',
      'Inventory Analyst',
      'PX Manager',
      'Information Analyst',
      'Process Analyst',
      'HSE Supervisor',
      'Order Management Head',
      'Sparepart sales & Network Dev. Manager',
      'Supply Chain Coord.',
      'WH Coordinator',
      'Picker / 搬运工',
      'CS Representative',
      'Warehouse & Logistic',
      'Warehouse Coordinatior TMS2',
      'Coordinator Warehouse',
      'Admin Warehouse',
      'Logistic Coordinator',
      'Order Management',
      'Head of Service',
      'Service Marketing & Development Manager',
      'Staff Admin Service / 售后服务文员',
      'Admin Service / 销售后行政员',
      'PDI Staff',
      'Data Analyst (Service)',
      'Technical Service Manager',
      'SOP Standardization',
      'PDI Coordinator',
      'Coordinator Mechanic',
      'PDI Sulawesi',
      'Senior Engineer',
      'Senior Enginer - KIM, TID KFM',
      'Senior Enginer - STM',
      'Senior Enginer - KTM',
      'Senior Enginer - MRI',
      'Coordinator ASS',
      'Senior Engineer - TMS1, TMS2 & TID REI',
      'Senior Enginer - TMS 1, TMS 2 dan TID REI',
      'Senior Enginer - FTM, TID JAS',
      'Senior Enginer - STM, PP Presisi, SLS, CKB, TID BPN, FSI',
      'Senior Enginer - Jatra Gebe',
      'Senior Engineer - Jatra Gebe',
      'Senior Enginer',
      'Middle Mechanic',
      'Service Advisor',
      'Warranty Officer',
      'Trainer Mechanic',
      'Trainer DT',
      'Chinese Business Ãssistant',
      'CEO PT MSO',
      'Manager Of Chinese Customer',
      'Warehouse SPV',
      'Warehouse Head',
      'Warehouse',
      'Spare Part',
      'Picker / 搬运工',
      'Admin Warehouse',
      'Warehouse Coordinatior',
      'Picker - Staff',
      'Middle Picker',
      'Coordinator Admin',
      'Business Patner',
      'Logistic - Staff',
      'Warehouse Head',
      'Middle Picker',
      'Picker/Packer',
      'Warehouse Head Deputy',
      'Head of Warehouse',
      'Staff Admin Warehouse',
      'Picker / 搬运工 - Driver / 司机',
      'Operator Boom Truck',
      'After Sales Technical Support / 售后技术支持',
      'Technical Support',
      'After Sales Service Advisor',
      'After Sales',
      'Helper Mechanic / 维修帮助',
      'Junior Mechanic / 维修帮助',
      'Driver LV Operational',
      'Mechanic / 维修工',
      'Helper Mechanic / 维修工助理',
      'Helper Mechanic',
      'Junior Mechanic / 初级维修工',
      'Admin Service',
      'Junior Mechanic / 维修帮助',
      'Senior Mechanic / 高级维修工',
      'Helper Mechanic / 维修帮助',
      'Senior Mechanic',
      'Helper Mechanic-Driver',
      'Middle mechanic',
      'Staff Driver Operational',
      'Helper Mechanic / 维修帮助',
      'Middle Mechanic / 中级维修工',
      'Helper Mechanic / 维修帮助',
      'Finance Business Partner',
      'Staff Finance&Purchasing',
      'General Affair',
      'HR Generalist',
      'Finance & Purchasing Staff',
      'HR',
      'Staff GA',
      '智能仓储 Manager',
      'IT Business Partner',
      'Business Partnar of CN',
      'Bussiness Partner',
      'Assitant HR Chinese',
      'Mandarin Translator',
      'CTO',
      'UI/UX Internship',
      'Project Manager',
      'Front End Developer',
      'Software Engineer/Developer',
      'System Analyst',
      'Back End Developer',
      'Back End Supervisor',
      'Software Engineer',
      'IT Support ITI',
      'IT Support IEC',
      'IT Support and Helpdesk Supervisor',
      'Network Infrastructure Spv',
      'ERP Kingdee Staff',
      'ERP System Analyst',
      'Head of Customs & Supply Chain',
      'Supply Chain Spv',
      'Vehicle Logistic',
      'Exim Staff',
      'Customs Staff',
      'Customs SPV',
      'Import Spv',
      'Brand & Strategist',
      'Brand Supervisor',
      'Staff Graphic Designer',
      'Merchandising',
      'Brand Admin Intern',
      'Videographer',
      'PR & Social Media',
      'AR Intern',
      'Cost & Pricing',
      'Chief FInancial Officer (CFO)',
      'CLS Accounting Sr. Staff',
      'Sinosure SUPERVISOR',
      'Cashier Staff',
      'AR Staff',
      'General Accounting Supervisor',
      'Procurement Xian Inline Spv',
      'IEC Cashier Staff',
      'Finance Controller Supervisor',
      'Cashier Supervisor',
      'IEC & IEL AR Staff',
      'MSI & IES AR Staff',
      'AR Spv',
      'Tax Staff',
      'Tax Supervisor',
      'Financing Supervisor',
      'CHCCAO',
      'Intern Human Capital-Training',
      'Intern Human Capital-GA',
      'Intern Human Capital-Recruitment',
      'Legal Manager / 法律经理',
      'Permit Staff',
      'Legal Staff',
      'Admin Legal',
      'HR Operational Manager',
      'Payroll',
      'Data Analyst',
      'Compensation & Benefit Management',
      'GA - Asset Maintenance and Admin',
      'Receptionist',
      'Office Boy',
      'Driver',
      'GA - Supervisor',
      'Courier',
      'Resepsionis',
      'Training Supervisor',
      'Training Staff',
      'Admin Training',
      'Recruitment Supervisor',
      'Operations Recruitment',
      'Channel Development & Community',
      'Purchasing Head',
      'Purchasing',
      'Purchasing Manager',
      'Purchasing Supervisor',
      'SparePart Purchasing / 配件采购',
      '供应链 - 重卡组',
      'FIN - Finance Manager',
      'The email used by Finance',
      'Director',
      'HR',
      'General Manager PT ETI',
      'Legal',
      'R&D Tire Supervisor',
      'Finance',
      'Commissioner',
      'R&D Tyre Manage',
      'Chief Finance Officer',
      'MSP Staff'
    ]

    // Get default company for departments without specific company mapping
    const defaultCompany = await knex('companies')
      .where('is_delete', false)
      .first()

    if (!defaultCompany) {
      throw new Error('No companies found. Please ensure companies table has data.')
    }

    // Insert departments
    console.log('Inserting departments...')
    const departmentInserts = []
    
    for (const deptName of departments) {
      const existingDept = await knex('departments')
        .where('department_name', deptName)
        .where('is_delete', false)
        .first()
      
      if (!existingDept) {
        departmentInserts.push({
          department_id: uuidv4(),
          department_name: deptName,
          company_id: defaultCompany.company_id,
          created_by: null,
          created_at: new Date().toISOString()
        })
      }
    }

    if (departmentInserts.length > 0) {
      await knex('departments').insert(departmentInserts)
      console.log(`✅ Inserted ${departmentInserts.length} departments`)
    }

    // Insert titles for each department
    console.log('Inserting titles...')
    const titleInserts = []
    const allDepartments = await knex('departments')
      .where('is_delete', false)
      .select('department_id', 'department_name')
    
    for (const title of titles) {
      for (const dept of allDepartments) {
        const existingTitle = await knex('titles')
          .where('title_name', title)
          .where('department_id', dept.department_id)
          .where('is_delete', false)
          .first()
        
        if (!existingTitle) {
          titleInserts.push({
            title_id: uuidv4(),
            title_name: title,
            department_id: dept.department_id,
            created_by: null,
            created_at: new Date().toISOString()
          })
        }
      }
    }

    // Insert in batches to avoid memory issues
    const batchSize = 100
    for (let i = 0; i < titleInserts.length; i += batchSize) {
      const batch = titleInserts.slice(i, i + batchSize)
      await knex('titles').insert(batch)
    }
    
    console.log(`✅ Inserted ${titleInserts.length} titles`)
    
    console.log('✅ Employee Master Data seeder completed successfully!')
    console.log(`📊 Data inserted:`)
    console.log(`  - ${departmentInserts.length} Departments`)
    console.log(`  - ${titleInserts.length} Titles`)

  } catch (error) {
    console.error('❌ Employee Master Data seeder failed:', error)
    throw error
  }
}
