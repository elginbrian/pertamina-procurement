import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.join(__dirname, 'src/data/mock');

const generateIdFromName = (name: string, prefix: string) => {
  return prefix + '-' + name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() + '-' + Math.floor(Math.random() * 1000);
}

// Map cache for consistency
const users: Record<string, any> = {};
const getUser = (name: string) => {
  if (!name) return { id: "USR-UNKNOWN", name: "Unknown" };
  const cleanName = name.replace(/^P3 - |^FPP - /, '');
  if (!users[cleanName]) {
    users[cleanName] = {
      id: generateIdFromName(cleanName, 'USR'),
      name: cleanName
    };
  }
  return users[cleanName];
};

const depts: Record<string, any> = {};
const getDept = (name: string) => {
  if (!name) return { id: "DEPT-UNKNOWN", name: "Unknown" };
  if (!depts[name]) {
    depts[name] = {
      id: generateIdFromName(name, 'DEPT'),
      name: name
    };
  }
  return depts[name];
};

// 1. Migrate Requests
const reqPath = path.join(dataDir, 'requests.json');
let requests = JSON.parse(fs.readFileSync(reqPath, 'utf8'));
requests = requests.map((req: any) => {
  const newReq = { ...req };
  newReq.pic = getUser(req.pic);
  newReq.fpp = getUser(req.fpp);
  newReq.department = getDept(req.department);
  newReq.amount = req.amountRaw;
  newReq.stageStartedAt = new Date(Date.now() - (req.daysInStage || 0) * 86400000).toISOString();
  
  delete newReq.amountRaw;
  delete newReq.daysInStage;
  
  return newReq;
});
fs.writeFileSync(reqPath, JSON.stringify(requests, null, 2));

// 2. Migrate Documents
const docPath = path.join(dataDir, 'documents.json');
let documents = JSON.parse(fs.readFileSync(docPath, 'utf8'));
documents = documents.map((doc: any) => {
  const newDoc = { ...doc };
  newDoc.pic = getUser(doc.pic);
  newDoc.fileUrl = `https://storage.pertamina.com/mock/${doc.fileName || 'file.pdf'}`;
  newDoc.mimeType = doc.fileName?.endsWith('.pdf') ? 'application/pdf' : 
                    doc.fileName?.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
                    'application/octet-stream';
  delete newDoc.fileName;
  delete newDoc.fileSize;
  return newDoc;
});
fs.writeFileSync(docPath, JSON.stringify(documents, null, 2));

// 3. Migrate Guarantees
const guarPath = path.join(dataDir, 'guarantees.json');
let guarantees = JSON.parse(fs.readFileSync(guarPath, 'utf8'));
guarantees = guarantees.map((guar: any) => {
  const newGuar = { ...guar };
  newGuar.pic = getUser(guar.pic);
  newGuar.vendor = getUser(guar.vendor); // treat vendor as user for now
  newGuar.value = guar.valueRaw;
  
  delete newGuar.valueRaw;
  delete newGuar.remainingDays;
  return newGuar;
});
fs.writeFileSync(guarPath, JSON.stringify(guarantees, null, 2));

// 4. Migrate Deadlines
const deadPath = path.join(dataDir, 'deadlines.json');
let deadlines = JSON.parse(fs.readFileSync(deadPath, 'utf8'));
deadlines = deadlines.map((dl: any) => {
  const newDl = { ...dl };
  newDl.pic = getUser(dl.pic);
  newDl.department = getDept(dl.department);
  delete newDl.daysRemaining;
  return newDl;
});
fs.writeFileSync(deadPath, JSON.stringify(deadlines, null, 2));

// 5. Migrate Actions
const actPath = path.join(dataDir, 'actions.json');
let actions = JSON.parse(fs.readFileSync(actPath, 'utf8'));
actions = actions.map((act: any) => {
  const newAct = { ...act };
  newAct.assignee = getUser(act.assignee);
  return newAct;
});
fs.writeFileSync(actPath, JSON.stringify(actions, null, 2));

console.log('Migration complete!');
