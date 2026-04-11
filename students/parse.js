const fs = require('fs');

const text = fs.readFileSync('/Users/doanson/Desktop/DS-PRJ/students/std_id.md', 'utf-8');
const lines = text.split('\n');

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const students = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || line === 'Student' || line === 'Thành viên') continue;
  
  // Parse name and mssv
  const match = line.match(/^(.*?)\s*(\d{8,9})$/);
  if (match) {
    let name = match[1].trim();
    let mssv = match[2].trim();
    if (mssv.length === 8) mssv = '0' + mssv;
    
    const parts = name.split(/\s+/);
    let password = parts[parts.length - 1];
    password = removeAccents(password).toLowerCase();
    
    students.push({ mssv, name, password });
  } else if (line.match(/^\d{8,9}$/)) {
     // Some cases might be just id? No, the log shows "Name ID"
  } else if (!line.match(/^[0-9]+$/)) {
     // Is there any line that is JUST name without MSSV?
     // We will assume the file format is strictly "Name <MSSV>" on one line as shown in view_file.
  }
}

// Generate Markdown
let md = `# Danh Sách Sinh Viên Đăng Nhập\n\n| STT | Họ Tên Hiển Thị | Tên Đăng Nhập (MSSV) | Mật Khẩu (Password) |\n|---|---|---|---|\n`;
students.forEach((s, i) => {
  md += `| ${i+1} | ${s.name} - ${s.mssv} | \`${s.mssv}\` | \`${s.password}\` |\n`;
});
fs.writeFileSync('/Users/doanson/Desktop/DS-PRJ/students/admin_students_list.md', md, 'utf-8');

// Generate JSON map for the database
const voterProfiles = {};
students.forEach(s => {
  voterProfiles[s.mssv] = { name: `${s.name} - ${s.mssv}`, password: s.password, fingerprint: '' };
});
fs.writeFileSync('/Users/doanson/Desktop/DS-PRJ/students/parsed_profiles.json', JSON.stringify(voterProfiles, null, 2), 'utf-8');

console.log(`Parsed ${students.length} students.`);
