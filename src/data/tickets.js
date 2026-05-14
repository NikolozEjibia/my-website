export const AGENTS = [
  { id: 'a1', name: 'Giorgi M.',  avatar: 'GM', color: '#185FA5' },
  { id: 'a2', name: 'Ana K.',     avatar: 'AK', color: '#0F6E56' },
  { id: 'a3', name: 'Nino D.',    avatar: 'ND', color: '#BA7517' },
  { id: 'a4', name: 'Luka T.',    avatar: 'LT', color: '#A32D2D' },
];

let _id = 48;
function nid() { return '#TK-00' + (_id++); }

export const INITIAL_TICKETS = [
  { id: '#TK-0047', title: 'WiFi drops every 5 minutes in meeting room B',        category: 'WiFi',     status: 'open',        priority: 'high', assignee: null,  created: '08:42', updated: '08:42', via: 'wizard' },
  { id: '#TK-0046', title: 'Cannot print to floor 3 printer — paper jam error',   category: 'Printer',  status: 'in-progress', priority: 'med',  assignee: 'a1',  created: '09:14', updated: '10:30', via: 'direct' },
  { id: '#TK-0045', title: 'Outlook not syncing emails since yesterday',           category: 'Software', status: 'in-progress', priority: 'med',  assignee: 'a2',  created: '09:31', updated: '11:05', via: 'wizard' },
  { id: '#TK-0044', title: 'VPN access denied after password reset',               category: 'Account',  status: 'open',        priority: 'high', assignee: null,  created: '10:02', updated: '10:02', via: 'wizard' },
  { id: '#TK-0043', title: 'Second monitor flickers when connected via HDMI',      category: 'Hardware', status: 'open',        priority: 'low',  assignee: null,  created: '10:17', updated: '10:17', via: 'direct' },
  { id: '#TK-0042', title: 'Microsoft Teams audio cuts out in video calls',        category: 'Software', status: 'closed',      priority: 'med',  assignee: 'a1',  created: 'Yesterday', updated: 'Yesterday', via: 'wizard' },
  { id: '#TK-0041', title: 'Cannot install Visual Studio Code — permission error', category: 'Software', status: 'closed',      priority: 'low',  assignee: 'a2',  created: 'Yesterday', updated: 'Yesterday', via: 'direct' },
  { id: '#TK-0040', title: 'New employee account not created in Active Directory', category: 'Account',  status: 'closed',      priority: 'high', assignee: 'a3',  created: 'Yesterday', updated: 'Yesterday', via: 'direct' },
  { id: '#TK-0039', title: 'Keyboard double-typing letters on Dell laptop',        category: 'Hardware', status: 'closed',      priority: 'low',  assignee: 'a4',  created: '2 days ago', updated: '2 days ago', via: 'wizard' },
  { id: '#TK-0038', title: 'Shared drive not accessible after office move',        category: 'Account',  status: 'closed',      priority: 'high', assignee: 'a1',  created: '2 days ago', updated: '2 days ago', via: 'direct' },
];
