const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

/**
 * Employees and Users Seeder
 * Seeds employee and user data from CSV
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Creating Employees and Users seeder...')
    
    // Employee data from CSV - first 50 records for testing
    const employeeData = [
      {
        name: '呼剑',
        account: 'HuJianeric',
        alias: 'Hu Jian',
        position: 'BOD',
        title: 'President Director',
        department: '剑展MOTORSIGHTSINTERNATIONAL/BOD',
        gender: 'Male',
        mobile: '6281315977268',
        officeNumber: '',
        email: '',
        address: '',
        exmailAccount: '',
        channel: 'hujianeric@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: '申舒萌',
        account: 'ShenShuMeng',
        alias: 'Shen Shumeng (Sarah)',
        position: 'BOD',
        title: 'Vice President Director',
        department: '剑展MOTORSIGHTSINTERNATIONAL/BOD',
        gender: 'Female',
        mobile: '6282213195555',
        officeNumber: '',
        email: '',
        address: 'Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240',
        exmailAccount: '',
        channel: 'shenshumeng@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'Yuli S_Jkt_MSI-IEL_VP',
        account: 'yulisaputro',
        alias: 'Yuli Saputro',
        position: 'Vice Precident',
        title: 'Vice President',
        department: '剑展MOTORSIGHTSINTERNATIONAL/BOD',
        gender: 'Male',
        mobile: '628119771165',
        officeNumber: '',
        email: 'saputroyuli@gmail.com',
        address: 'JL Garuda Mas III Blok D3/06 RT 003/ RW001 Tanjung Barat Jagakarsa',
        exmailAccount: '',
        channel: 'yuli_saputro@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'M M Herman_JKT_MSI-IEC_LogCon',
        account: 'mariomakariosherman',
        alias: '',
        position: '',
        title: 'Logistic Container',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Logistic Container Segmentation',
        gender: 'Male',
        mobile: '6281210286124',
        officeNumber: '',
        email: 'ryohermann@gmail..com',
        address: '',
        exmailAccount: '',
        channel: 'mariomakariosherman@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'I M Krisna PY_Jkt_MSI_LogisticHead',
        account: 'IMadeKrisnaPrabuYoga',
        alias: 'I Made Krisna Prabu Yoga',
        position: 'Sales Manager',
        title: 'Head of Sales - Logistic Container',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Logistic Container Segmentation/Sales Container',
        gender: 'Male',
        mobile: '6282210163649',
        officeNumber: '',
        email: 'imkrisnapy@indoequip.net',
        address: 'Duta Bintaro Blok D 11 No. 3A RT 004 RW 008 Kel. Kunciran Kec. Pinang. Tangerang',
        exmailAccount: '',
        channel: 'imadekrisnaprabuyoga@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'M Ashal A_JKT_MSI-IEC_DataAnalyst',
        account: 'muh.ashalassidiqie',
        alias: 'Diki Data Analyst',
        position: 'Data Analyzt',
        title: 'Data Analyst',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Logistic Container Segmentation/Sales Container',
        gender: 'Male',
        mobile: '6281284235258',
        officeNumber: '',
        email: 'ashal.assidiqie@gmail.com',
        address: '',
        exmailAccount: '',
        channel: 'ashal_assidiqie@id.indoequipservice.com',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'Ageng S_Jkt_MSI_HeadOfR&D',
        account: 'agengsaputro',
        alias: 'Ageng Saputro',
        position: 'RnD Manager',
        title: 'Head of Product Development',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Logistic Container Segmentation/Product Container',
        gender: 'Male',
        mobile: '628111636932',
        officeNumber: '',
        email: 'gaeng88@gmail.com',
        address: 'Jl. Pondok Jaya VIII / 14A RT008 RW006 Kel. Pela Mampang Kec. Mampang Prapatan, Jakarta Selatan',
        exmailAccount: '',
        channel: 'agengsaputro@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'M Yusri F R_Jkt_MSI_HomologationStaff',
        account: 'yusri',
        alias: 'Muhammad Yusri Fadli Romadhona',
        position: 'Homologation',
        title: 'Homologation',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Logistic Container Segmentation/Product Container',
        gender: 'Male',
        mobile: '6285832731405',
        officeNumber: '',
        email: 'muhammadyusrifadliroma@indoequip.net',
        address: 'Jl. Turi I No. 9 LK I, Kel. Tanjung Senang, Kec. Tanjung Senang, Bandar Lampung',
        exmailAccount: '',
        channel: 'yusri@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'Afif A_Jkt_MSI_Marketing',
        account: 'afifabiyyuna',
        alias: 'Afif Abiyyuna',
        position: 'Marketing - Logistic Container',
        title: 'Marketing - Logistic Container',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Logistic Container Segmentation/Marketing Container',
        gender: 'Male',
        mobile: '6281931671209',
        officeNumber: '',
        email: 'afifabiyyuna1210@gmail.com',
        address: 'Jl. Marzuki 2, No. 10 RT 03/RW 012, Penggilingan, Cakung',
        exmailAccount: '',
        channel: 'afifabiyyuna@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        name: 'Yoga FP_JKT_MSI-IEC_Mkt',
        account: 'yogafebrianpratama',
        alias: 'Yoga Febrian Pratama',
        position: '',
        title: 'Executive Coordinator - NICKEL SEGMENTATION',
        department: '剑展MOTORSIGHTSINTERNATIONAL/客户开发 (IEC)[EN:IEC Customer Development]/Nickel - segmentation[EN:Nickel - segmentation]',
        gender: 'Male',
        mobile: '6285182708746',
        officeNumber: '',
        email: 'yogafebrianpratama@indoequip.net',
        address: 'Jalan Simpang Gajah Mada No. 94',
        exmailAccount: '',
        channel: 'yoga_fp@motorsights.net',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      }
    ]

    // Get default role for users
    const defaultRole = await knex('roles')
      .where('role_name', 'Employee')
      .where('is_delete', false)
      .first()

    if (!defaultRole) {
      const anyRole = await knex('roles')
        .where('is_delete', false)
        .first()
      
      if (!anyRole) {
        throw new Error('No roles found in database. Please ensure roles table has data.')
      }
      defaultRole = anyRole
    }

    // Get or create genders
    const genders = ['Male', 'Female', 'Other']
    const genderMap = new Map()
    
    for (const genderName of genders) {
      let gender = await knex('genders')
        .where('gender_name', genderName)
        .where('is_delete', false)
        .first()
      
      if (!gender) {
        const genderId = uuidv4()
        await knex('genders').insert({
          gender_id: genderId,
          gender_name: genderName,
          created_by: null,
          created_at: new Date().toISOString()
        })
        genderMap.set(genderName, genderId)
      } else {
        genderMap.set(genderName, gender.gender_id)
      }
    }

    // Get default company
    const defaultCompany = await knex('companies')
      .where('is_delete', false)
      .first()

    if (!defaultCompany) {
      throw new Error('No companies found. Please ensure companies table has data.')
    }

    // Helper function to get or create department
    const getOrCreateDepartment = async (departmentPath) => {
      if (!departmentPath || !departmentPath.trim()) {
        return null
      }
      
      const departments = departmentPath.split('/').map(d => d.trim()).filter(d => d)
      if (departments.length === 0) return null
      
      const lastLevelDepartment = departments[departments.length - 1]
      
      // Try to find existing department
      let department = await knex('departments')
        .where('department_name', lastLevelDepartment)
        .where('is_delete', false)
        .first()
      
      if (!department) {
        // Try to match with company name
        const matchingCompany = await knex('companies')
          .where('is_delete', false)
          .whereRaw('LOWER(company_name) LIKE ?', [`%${lastLevelDepartment.toLowerCase()}%`])
          .first()
        
        const departmentId = uuidv4()
        await knex('departments').insert({
          department_id: departmentId,
          department_name: lastLevelDepartment,
          company_id: matchingCompany ? matchingCompany.company_id : defaultCompany.company_id,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        return departmentId
      }
      
      return department.department_id
    }

    // Helper function to get or create title
    const getOrCreateTitle = async (titleName, departmentId) => {
      if (!titleName || !titleName.trim() || !departmentId) {
        return null
      }
      
      const cleanTitleName = titleName.trim()
      
      let title = await knex('titles')
        .where('title_name', cleanTitleName)
        .where('department_id', departmentId)
        .where('is_delete', false)
        .first()
      
      if (!title) {
        const titleId = uuidv4()
        await knex('titles').insert({
          title_id: titleId,
          title_name: cleanTitleName,
          department_id: departmentId,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        return titleId
      }
      
      return title.title_id
    }

    // Process employee data
    console.log('Processing employee data...')
    
    const employeeInserts = []
    const userInserts = []
    
    for (const emp of employeeData) {
      try {
        // Skip if account or channel is empty
        if (!emp.account || !emp.channel) {
          console.log(`⚠️ Skipping employee: ${emp.name} - missing account or channel`)
          continue
        }
        
        // Check if user already exists
        const existingUser = await knex('users')
          .where('user_name', emp.account)
          .orWhere('user_email', emp.channel)
          .where('is_delete', false)
          .first()
        
        if (existingUser) {
          console.log(`⚠️ Skipping employee: ${emp.name} - user already exists`)
          continue
        }
        
        // Check if employee already exists
        const existingEmployee = await knex('employees')
          .where('employee_name', emp.alias || emp.name)
          .orWhere('employee_email', emp.email)
          .where('is_delete', false)
          .first()
        
        if (existingEmployee) {
          console.log(`⚠️ Skipping employee: ${emp.name} - employee already exists`)
          continue
        }
        
        // Get or create department
        const departmentId = await getOrCreateDepartment(emp.department)
        
        // Get or create title
        const titleId = departmentId ? await getOrCreateTitle(emp.title, departmentId) : null
        
        // Get gender ID
        const genderId = emp.gender ? genderMap.get(emp.gender) : null
        
        // Create employee
        const employeeId = uuidv4()
        employeeInserts.push({
          employee_id: employeeId,
          employee_name: emp.alias || emp.name,
          employee_email: emp.email || '',
          employee_mobile: emp.mobile || '',
          employee_office_number: emp.officeNumber || '',
          employee_address: emp.address || '',
          employee_exmail_account: emp.exmailAccount || '',
          employee_channel: emp.channel || '',
          employee_activation_status: emp.activationStatus || '',
          employee_disabled: emp.disabled === 'TRUE' || emp.disabled === '1' || emp.disabled === 'true',
          employee_wechat_workplace: emp.wechatWorkplace || '',
          title_id: titleId,
          gender_id: genderId,
          department_id: departmentId,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        // Create user
        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash('QwerMSI2025!', 5) // Default password
        
        userInserts.push({
          user_id: userId,
          employee_id: employeeId,
          role_id: defaultRole.role_id,
          user_name: emp.account,
          user_email: emp.channel,
          user_password: hashedPassword,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        console.log(`✅ Prepared: ${emp.alias || emp.name} (${emp.account})`)
        
      } catch (error) {
        console.error(`❌ Error processing employee ${emp.name}:`, error.message)
        continue
      }
    }
    
    // Insert employees in batches
    if (employeeInserts.length > 0) {
      const batchSize = 50
      for (let i = 0; i < employeeInserts.length; i += batchSize) {
        const batch = employeeInserts.slice(i, i + batchSize)
        await knex('employees').insert(batch)
      }
      console.log(`✅ Inserted ${employeeInserts.length} employees`)
    }
    
    // Insert users in batches
    if (userInserts.length > 0) {
      const batchSize = 50
      for (let i = 0; i < userInserts.length; i += batchSize) {
        const batch = userInserts.slice(i, i + batchSize)
        await knex('users').insert(batch)
      }
      console.log(`✅ Inserted ${userInserts.length} users`)
    }
    
    console.log('✅ Employees and Users seeder completed successfully!')
    console.log(`📊 Data inserted:`)
    console.log(`  - ${employeeInserts.length} Employees`)
    console.log(`  - ${userInserts.length} Users`)
    console.log(`  - Default password: QwerMSI2025!`)

  } catch (error) {
    console.error('❌ Employees and Users seeder failed:', error)
    throw error
  }
}
