export const categories = [
  {
    id: 'wifi', icon: '📶',
    labelKey: 'cat_wifi',
    keywords: [
      'wifi','internet','network','connection','disconnect','router','signal','wireless','lan','ethernet',
      'ვაიფაი','ინტერნეტი','ქსელი','კავშირი','როუტერი','სიგნალი','უკაბელო',
      'ვერ უკავშირდება','კოვდება','ვერ ჩაერთო','არ მუშაობს ინტერნეტი','კავშირი წყდება',
    ],
  },
  {
    id: 'hardware', icon: '🖥',
    labelKey: 'cat_hardware',
    keywords: [
      'hardware','monitor','screen','keyboard','mouse','usb','device','display','laptop','computer','cable','port',
      'მონიტორი','ეკრანი','კლავიატურა','თაგვი','ლეპტოპი','კომპიუტერი','კაბელი','მოწყობილობა',
      'ვერ ჩაირთო','არ ჩაირთვება','გაითიშა','ციმციმებს',
    ],
  },
  {
    id: 'software', icon: '💻',
    labelKey: 'cat_software',
    keywords: [
      'software','install','app','application','crash','error','teams','outlook','office','browser','update','slow','freeze',
      'პროგრამა','დაინსტალირება','გაყინვა','კრაშდება','შეცდომა','ბრაუზერი','ნელი','იყინება',
      'ვერ იხსნება','ვერ ეშვება','არ მუშაობს',
    ],
  },
  {
    id: 'account', icon: '🔑',
    labelKey: 'cat_account',
    keywords: [
      'account','password','login','access','vpn','email','permission','user','locked','reset','sign','auth',
      'პაროლი','ანგარიში','შესვლა','წვდომა','ლოქდება','დაბლოკილია','ელფოსტა','გადაყენება',
      'ვერ შევდივარ','ვერ ვხსნი','შესვლა ვერ ხერხდება',
    ],
  },
  {
    id: 'printer', icon: '🖨',
    labelKey: 'cat_printer',
    keywords: [
      'print','printer','scan','paper','toner','ink','queue','driver',
      'პრინტერი','დაბეჭდვა','ქაღალდი','სკანირება','ტონერი','ჯამი','ვერ ბეჭდავს','არ ბეჭდავს',
    ],
  },
  {
    id: 'other', icon: '❓',
    labelKey: 'cat_other',
    keywords: [],
  },
];

export const flows = {
  wifi: {
    steps: [
      { id:'s0', q:'Is WiFi enabled on your device? (Check the taskbar or Settings → Network)', q_ka:'WiFi ჩართულია თქვენს მოწყობილობაზე? (შეამოწმეთ taskbar ან პარამეტრები → ქსელი)', yes:'s1', no:'fix_wifi_off' },
      { id:'s1', q:'Does the same problem happen on other devices too (phone, another laptop)?', q_ka:'იგივე პრობლემა სხვა მოწყობილობებზეც გვაქვს? (ტელეფონი, სხვა ლეპტოპი)', yes:'fix_router', no:'s2' },
      { id:'s2', q:'Have you tried turning WiFi off and back on, or restarting your device?', q_ka:'სცადეთ WiFi გამოთიშვა/ჩართვა ან მოწყობილობის გადატვირთვა?', yes:'s3', no:'action_restart' },
      { id:'s3', q:'Are you within 20 meters of the access point with no thick walls between you?', q_ka:'Router-იდან 20 მეტრის რადიუსში ხართ სქელი კედლების გარეშე?', yes:'escalate', no:'fix_range' },
    ],
    results: {
      fix_wifi_off:   { success:true,  title:'WiFi is turned off',             title_ka:'WiFi გამორთულია',                       desc:'Enable WiFi via the taskbar icon or Settings → Network & Internet → WiFi. Try Fn + WiFi key if toggle is missing.',          desc_ka:'ჩართეთ WiFi taskbar-ის ხატულით ან პარამეტრები → ქსელი. თუ ღილაკი არ ჩანს სცადეთ Fn + WiFi კლავიში.' },
      fix_router:     { success:true,  title:'Router / access point issue',    title_ka:'Router-ის პრობლემა',                    desc:'Restart the router: unplug for 30 seconds then plug back in. Contact network admin if you have no physical access.',          desc_ka:'გადატვირთეთ router: 30 წამით გათიშეთ, შემდეგ ჩართეთ. თუ წვდომა არ გაქვთ — ქსელის ადმინს დაუკავშირდით.' },
      action_restart: { success:true,  title:'Try a restart first',            title_ka:'პირველ რიგში გადატვირთეთ',              desc:'Turn WiFi off, wait 10 seconds, turn on again. If it persists, do a full computer restart to clear driver issues.',             desc_ka:'გამოთიშეთ WiFi, 10 წამი დაიცადეთ, ჩართეთ. თუ კვლავ არ მუშაობს — გადატვირთეთ კომპიუტერი.' },
      fix_range:      { success:true,  title:'Move closer to the access point',title_ka:'Router-თან ახლოს გადაადგილდით',        desc:'Try 5–10 meters from the router without walls. If signal improves, a WiFi extender may be needed in your area.',               desc_ka:'სცადეთ 5-10 მეტრის მანძილზე კედლების გარეშე. სიგნალის გაუმჯობესების შემთხვევაში WiFi გამაძლიერებელი დაგჭირდება.' },
      escalate:       { success:false, title:'Escalating to the network team', title_ka:'გადაეცემა ქსელის გუნდს',               desc:"Basic troubleshooting didn't resolve the issue. A ticket will be created for the network team to run diagnostics.",             desc_ka:'მარტივი ნაბიჯებით პრობლემა ვერ გადაიჭრა. ტიკეტი შეიქმნება ქსელის გუნდისთვის.' },
    },
  },
  hardware: {
    steps: [
      { id:'s0', q:'Is the device powered on and showing any lights or sounds?', q_ka:'მოწყობილობა ჩართულია და შუქი ან ხმა გამოსდის?', yes:'s1', no:'fix_power' },
      { id:'s1', q:'Have you tried unplugging and reconnecting the device (cable or USB)?', q_ka:'სცადეთ კაბელის ამოღება და ხელახლა ჩართვა?', yes:'s2', no:'action_replug' },
      { id:'s2', q:'Does the same problem occur when connecting to another computer?', q_ka:'სხვა კომპიუტერზე მიერთებისასაც იგივე პრობლემა გვაქვს?', yes:'escalate', no:'fix_driver' },
    ],
    results: {
      fix_power:     { success:true,  title:'Check power connections',   title_ka:'შეამოწმეთ კვების კაბელი',          desc:'Ensure the power cable is firmly connected. For USB devices, try a different USB port.',                                           desc_ka:'დარწმუნდით კაბელი მჭიდროდ ჩართულია. USB მოწყობილობებისთვის სცადეთ სხვა USB პორტი.' },
      action_replug: { success:true,  title:'Replug the device',         title_ka:'ხელახლა ჩართეთ მოწყობილობა',     desc:'Unplug, wait 5 seconds, plug back in. Try a different port or cable if available.',                                              desc_ka:'ამოიღეთ კაბელი, 5 წამი დაიცადეთ, ჩართეთ. სხვა პორტი ან კაბელი სცადეთ.' },
      fix_driver:    { success:true,  title:'Likely a driver issue',     title_ka:'სავარაუდოდ Driver-ის პრობლემაა',  desc:'Open Device Manager (right-click Start), find the device, right-click → Update driver.',                                          desc_ka:'გახსენით Device Manager (Start-ზე მარჯ. კლიკი), იპოვეთ მოწყობილობა → Update driver.' },
      escalate:      { success:false, title:'Hardware fault detected',   title_ka:'აპარატურის გაუმართაობა',          desc:'The device fails on multiple computers. A ticket will be created for hardware repair or replacement.',                           desc_ka:'მოწყობილობა სხვა კომპიუტერზეც ვერ მუშაობს. ტიკეტი შეიქმნება შეკეთებისთვის.' },
    },
  },
  software: {
    steps: [
      { id:'s0', q:'Have you tried fully closing and reopening the application?', q_ka:'სცადეთ პროგრამის სრულად დახურვა და ხელახლა გახსნა?', yes:'s1', no:'action_restart' },
      { id:'s1', q:'Is the software up to date? (Check Help → Updates or Windows Update)', q_ka:'პროგრამა განახლებულია? (Help → Updates ან Windows Update)', yes:'s2', no:'action_update' },
      { id:'s2', q:'Does the problem occur for other users on the same machine?', q_ka:'სხვა მომხმარებლებსაც ამ კომპიუტერზე იგივე პრობლემა აქვთ?', yes:'escalate', no:'fix_profile' },
    ],
    results: {
      action_restart: { success:true,  title:'Fully restart the app',    title_ka:'სრულად გადატვირთეთ პროგრამა',     desc:'Close the app, check Task Manager (Ctrl+Shift+Esc) for background processes, then reopen.',                                       desc_ka:'დახურეთ, Task Manager-ში (Ctrl+Shift+Esc) ფონური პროცესები შეამოწმეთ, ხელახლა გახსენით.' },
      action_update:  { success:true,  title:'Update the software',      title_ka:'განაახლეთ პროგრამა',              desc:'Go to Help → Check for Updates, or run Windows Update from Settings → Update & Security.',                                        desc_ka:'Help → Check for Updates, ან Windows Update გაუშვით პარამეტრებიდან.' },
      fix_profile:    { success:true,  title:'User profile issue',       title_ka:'მომხმარებლის პროფილის პრობლემა',  desc:'Try signing out and back in. IT can reset your application profile without affecting your files.',                               desc_ka:'სცადეთ გამოსვლა და ხელახლა შესვლა. IT-ს შეუძლია პროფილის გადაყენება ფაილების დაუზიანებლად.' },
      escalate:       { success:false, title:'System-level issue',       title_ka:'სისტემური პრობლემა',              desc:'Multiple users are affected. A ticket will be created for the IT team to investigate.',                                          desc_ka:'რამდენიმე მომხმარებელი დაზარალდა. ტიკეტი შეიქმნება IT-ს გამოსაძიებლად.' },
    },
  },
  account: {
    steps: [
      { id:'s0', q:'Have you recently changed your password or had it reset by IT?', q_ka:'ახლახან შეიცვალა ან IT-მ გადააყენა თქვენი პაროლი?', yes:'s1', no:'s2' },
      { id:'s1', q:'Have you updated the new password in all apps — Teams, Outlook, VPN?', q_ka:'ახალი პაროლი ყველა პროგრამაში შეიყვანეთ? (Teams, Outlook, VPN)', yes:'escalate', no:'fix_update_pw' },
      { id:'s2', q:'Are you seeing "account locked" or "too many login attempts"?', q_ka:'ჩნდება "ანგარიში დაბლოკილია" ან "ბევრჯერ ცდა" შეტყობინება?', yes:'fix_locked', no:'escalate' },
    ],
    results: {
      fix_update_pw: { success:true,  title:'Update your password everywhere', title_ka:'პაროლი ყველა პროგრამაში შეიყვანეთ', desc:'Re-enter your new password in Teams, Outlook, and VPN client — each will prompt you.',                               desc_ka:'Teams-ში, Outlook-ში და VPN-ში ახალი პაროლი ხელახლა შეიყვანეთ.' },
      fix_locked:    { success:true,  title:'Account is locked',              title_ka:'ანგარიში დაბლოკილია',             desc:'Wait 15 minutes for auto-unlock. If still locked, contact IT to unlock manually.',                               desc_ka:'15 წუთი დაიცადეთ. თუ კვლავ ლოქია — IT-ს დაუკავშირდით.' },
      escalate:      { success:false, title:'Access issue requires IT review', title_ka:'IT-ის ჩარევა საჭიროა',            desc:"Your access problem can't be resolved through self-service. A ticket will be created.",                          desc_ka:'ეს პრობლემა თვითმომსახურებით ვერ გვარდება. ტიკეტი შეიქმნება.' },
    },
  },
  printer: {
    steps: [
      { id:'s0', q:'Is the printer powered on and showing ready/idle status?', q_ka:'პრინტერი ჩართულია და Ready/Idle სტატუსს აჩვენებს?', yes:'s1', no:'fix_power' },
      { id:'s1', q:'Is there paper in the tray and no jam indicator on the display?', q_ka:'ქაღალდი გოდოლშია და ჯამის ინდიკატორი არ ანათებს?', yes:'s2', no:'fix_paper' },
      { id:'s2', q:'Have you tried clearing the print queue and printing again?', q_ka:'სცადეთ print queue-ს გაწმენდა და ხელახლა დაბეჭდვა?', yes:'escalate', no:'fix_queue' },
    ],
    results: {
      fix_power: { success:true,  title:'Power on the printer',         title_ka:'ჩართეთ პრინტერი',               desc:'Press the power button and wait 30–60 seconds for full initialization.',                                           desc_ka:'დააჭირეთ ჩართვის ღილაკს და 30-60 წამი დაიცადეთ.' },
      fix_paper: { success:true,  title:'Paper or jam issue',           title_ka:'ქაღალდის ან ჯამის პრობლემა',    desc:'Load paper into the tray. If jammed, gently remove stuck paper from all access panels.',                          desc_ka:'ჩადეთ ქაღალდი. ჯამის შემთხვევაში ნაზად ამოიღეთ გარჭობილი ქაღალდი.' },
      fix_queue: { success:true,  title:'Clear the print queue',        title_ka:'გაასუფთავეთ print queue',        desc:'Open Start → Printers, cancel all queued jobs, then restart the Print Spooler service.',                          desc_ka:'Start → Printers, გააუქმეთ ყველა სამუშაო, Print Spooler გადატვირთეთ.' },
      escalate:  { success:false, title:'Printer needs IT attention',   title_ka:'პრინტერს IT-ის ჩარევა სჭირდება', desc:"Basic fixes didn't work. A ticket will be created — IT may need to reinstall the driver.",                       desc_ka:'მარტივი ნაბიჯები არ გამოვიდა. ტიკეტი შეიქმნება.' },
    },
  },
  other: {
    steps: [
      { id:'s0', q:'Have you tried restarting your computer to see if the issue persists?', q_ka:'სცადეთ კომპიუტერის გადატვირთვა, პრობლემა კვლავ მეორდება?', yes:'s1', no:'action_restart' },
      { id:'s1', q:'Has this issue happened before, or is it the first time?', q_ka:'ეს პრობლემა ადრეც მოგდგამდათ, თუ პირველად?', yes:'escalate_recurring', no:'escalate' },
    ],
    results: {
      action_restart:     { success:true,  title:'Try a restart first',         title_ka:'პირველ რიგში გადატვირთეთ',     desc:'Save your work, restart, and check if the problem still occurs.',                                desc_ka:'შეინახეთ სამუშაო, გადატვირთეთ და შეამოწმეთ პრობლემა გაქრა.' },
      escalate_recurring: { success:false, title:'Recurring issue — escalating',title_ka:'განმეორებადი პრობლემა',        desc:'Since this has happened before, IT needs to investigate the root cause.',                          desc_ka:'ვინაიდან ეს ადრეც მომხდარა, IT-ს ძირეული მიზეზის გამოძიება სჭირდება.' },
      escalate:           { success:false, title:'Creating a support ticket',   title_ka:'ტიკეტი იქმნება',               desc:"We'll send your request to the IT team with full details. They'll follow up shortly.",            desc_ka:'თქვენი მოთხოვნა IT გუნდს გადაეგზავნება. მალე დაგიკავშირდებიან.' },
    },
  },
};
