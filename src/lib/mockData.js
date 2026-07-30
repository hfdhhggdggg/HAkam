export const referees = [
  { id: '1', name: 'أحمد محمد علي', nationalId: '29001012345678', rank: 'international', governorate: 'القاهرة', status: 'active', lastTest: '2024-09-15', avatar: '/src/images/user-36-05.jpg' },
  { id: '2', name: 'محمود سعيد إبراهيم', nationalId: '28503054321987', rank: 'first', governorate: 'الإسكندرية', status: 'active', lastTest: '2024-08-22', avatar: '/src/images/user-36-06.jpg' },
  { id: '3', name: 'كريم حسن عبد الله', nationalId: '29207123456789', rank: 'first', governorate: 'الجيزة', status: 'suspended', lastTest: '2024-07-10', avatar: '/src/images/user-36-07.jpg' },
  { id: '4', name: 'عمرو شريف فؤاد', nationalId: '28803129876543', rank: 'second', governorate: 'المنوفية', status: 'active', lastTest: '2024-09-01', avatar: '/src/images/user-36-08.jpg' },
  { id: '5', name: 'ياسر إبراهيم منصور', nationalId: '29109011223344', rank: 'second', governorate: 'الغربية', status: 'active', lastTest: '2024-08-30', avatar: '/src/images/user-36-09.jpg' },
  { id: '6', name: 'هاني عادل سمير', nationalId: '28701055667788', rank: 'international', governorate: 'القاهرة', status: 'active', lastTest: '2024-09-20', avatar: '/src/images/user-36-05.jpg' },
  { id: '7', name: 'طارق جمال الدين', nationalId: '29303059988776', rank: 'first', governorate: 'أسيوط', status: 'suspended', lastTest: '2024-06-15', avatar: '/src/images/user-36-06.jpg' },
  { id: '8', name: 'وليد رفعت لبيب', nationalId: '28607084455667', rank: 'second', governorate: 'الشرقية', status: 'active', lastTest: '2024-09-05', avatar: '/src/images/user-36-07.jpg' },
];

export const physicalTrainers = [
  { id: 'tr1', name: 'د. خالد فؤاد', nationalId: '28001015566778', assignedRefereeIds: ['1', '2', '3', '6'] },
  { id: 'tr2', name: 'م. أمير رضا', nationalId: '28303058877665', assignedRefereeIds: ['4', '5', '7', '8'] },
];

export const roleLabels = {
  admin: 'إدارة الاتحاد',
  trainer: 'معد بدني',
  referee: 'حكم',
};

export const rankLabels = {
  international: 'دولي',
  first: 'أولى',
  second: 'تانية',
};

export const statusLabels = {
  active: 'نشط',
  suspended: 'معطّل',
  pending: 'في انتظار المراجعة',
};

export const governorates = ['القاهرة', 'الإسكندرية', 'الجيزة', 'المنوفية', 'الغربية', 'أسيوط', 'الشرقية', 'الدقهلية', 'بني سويف', 'قنا'];

export const fitnessTests = [
  { id: 't1', refereeId: '1', testType: 'interval', season: '2024-2025', runTime: 5.2, walkTime: 6.1, result: 'pass', failureReason: null, testDate: '2024-09-15' },
  { id: 't2', refereeId: '1', testType: 'endurance', season: '2024-2025', runTime: 12.1, walkTime: null, result: 'pass', failureReason: null, testDate: '2024-09-15' },
  { id: 't3', refereeId: '2', testType: 'interval', season: '2024-2025', runTime: 5.8, walkTime: 6.5, result: 'pass', failureReason: null, testDate: '2024-08-22' },
  { id: 't4', refereeId: '3', testType: 'interval', season: '2024-2025', runTime: 6.4, walkTime: 7.2, result: 'fail', failureReason: 'تأخر جري', testDate: '2024-07-10' },
  { id: 't5', refereeId: '4', testType: 'endurance', season: '2024-2025', runTime: 13.5, walkTime: null, result: 'fail', failureReason: 'تأخر مشي', testDate: '2024-09-01' },
  { id: 't6', refereeId: '5', testType: 'interval', season: '2024-2025', runTime: 5.5, walkTime: 6.3, result: 'pass', failureReason: null, testDate: '2024-08-30' },
  { id: 't7', refereeId: '6', testType: 'interval', season: '2024-2025', runTime: 5.1, walkTime: 6.0, result: 'pass', failureReason: null, testDate: '2024-09-20' },
  { id: 't8', refereeId: '7', testType: 'endurance', season: '2024-2025', runTime: 14.2, walkTime: null, result: 'fail', failureReason: 'تأخر جري', testDate: '2024-06-15' },
  { id: 't9', refereeId: '8', testType: 'interval', season: '2024-2025', runTime: 5.7, walkTime: 6.4, result: 'pass', failureReason: null, testDate: '2024-09-05' },
];

export const testTypeLabels = {
  interval: 'الفواصل الزمنية (Interval)',
  rsa: 'السرعة المتكررة (RSA)',
  endurance: 'تحمل',
};

export const testTypeShort = {
  interval: 'Interval',
  rsa: 'RSA',
};

export const registrationRequests = [
  { id: 'r1', nationalId: '29501019988776', fullName: 'سامح فتحي علي', rank: 'second', governorate: 'الدقهلية', status: 'pending', phone: '01012349988', createdAt: '2024-09-25' },
  { id: 'r2', nationalId: '29403025566778', fullName: 'إسلام نبيل سعد', rank: 'first', governorate: 'بني سويف', status: 'pending', phone: '01156789001', createdAt: '2024-09-24' },
  { id: 'r3', nationalId: '29607083344556', fullName: 'رامي أشرف زكي', rank: 'second', governorate: 'قنا', status: 'pending', phone: '01267890011', createdAt: '2024-09-23' },
];

export const activities = [
  { id: 'a1', type: 'test_result', description: 'تم تسجيل نتيجة اختبار لياقة للحكم أحمد محمد علي', refereeId: '1', createdAt: '2024-09-25', group: 'today' },
  { id: 'a2', type: 'registration', description: 'طلب تسجيل جديد من سامح فتحي علي', refereeId: null, createdAt: '2024-09-25', group: 'today' },
  { id: 'a3', type: 'activation', description: 'تم تفعيل حساب الحكم ياسر إبراهيم منصور', refereeId: '5', createdAt: '2024-09-25', group: 'today' },
  { id: 'a4', type: 'test_result', description: 'تم تسجيل نتيجة اختبار لياقة للحكم عمرو شريف فؤاد', refereeId: '4', createdAt: '2024-09-24', group: 'yesterday' },
  { id: 'a5', type: 'suspension', description: 'تم تعطيل حساب الحكم كريم حسن عبد الله', refereeId: '3', createdAt: '2024-09-24', group: 'yesterday' },
];

export const refereeCountByRank = {
  international: 2,
  first: 3,
  second: 3,
};

export const refereeCountByGovernorate = [
  { governorate: 'القاهرة', count: 2 },
  { governorate: 'الإسكندرية', count: 1 },
  { governorate: 'الجيزة', count: 1 },
  { governorate: 'المنوفية', count: 1 },
  { governorate: 'الغربية', count: 1 },
  { governorate: 'أسيوط', count: 1 },
  { governorate: 'الشرقية', count: 1 },
];

export const passFailBySeason = [
  { season: '2022-2023', pass: 42, fail: 8 },
  { season: '2023-2024', pass: 48, fail: 6 },
  { season: '2024-2025', pass: 38, fail: 12 },
];

export const passRateByTestType = [
  { testType: 'RSA (Interval)', total: 45, pass: 38, rate: 84.4 },
  { testType: 'تحمل', total: 30, pass: 22, rate: 73.3 },
];

export const failureReasons = [
  { reason: 'تأخر جري', count: 7 },
  { reason: 'تأخر مشي', count: 4 },
  { reason: 'عدم استكمال الاختبار', count: 3 },
  { reason: 'إصابة أثناء الاختبار', count: 2 },
];

export const fitnessOverSeasons = [
  { season: '2022-2023', current: 42, previous: 38, average: 40 },
  { season: '2023-2024', current: 48, previous: 42, average: 45 },
  { season: '2024-2025', current: 38, previous: 48, average: 43 },
];

// Stats page data
export const seasons = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];

export const passRateByRankOverSeasons = [
  { season: '2020-2021', international: 90, first: 85, second: 70 },
  { season: '2021-2022', international: 92, first: 82, second: 75 },
  { season: '2022-2023', international: 95, first: 88, second: 72 },
  { season: '2023-2024', international: 93, first: 86, second: 78 },
  { season: '2024-2025', international: 96, first: 84, second: 68 },
];

export const passRateIntervalVsRsa = [
  { season: '2020-2021', interval: 88, rsa: 80 },
  { season: '2021-2022', interval: 90, rsa: 82 },
  { season: '2022-2023', interval: 85, rsa: 79 },
  { season: '2023-2024', interval: 87, rsa: 84 },
  { season: '2024-2025', interval: 82, rsa: 81 },
];

export const failureReasonsDetailed = [
  { reason: 'تأخر جري', count: 18, percentage: 38.3 },
  { reason: 'تأخر مشي', count: 12, percentage: 25.5 },
  { reason: 'عدم استكمال الاختبار', count: 8, percentage: 17.0 },
  { reason: 'إصابة أثناء الاختبار', count: 5, percentage: 10.6 },
  { reason: 'تأخر دخول منطقة المشي', count: 4, percentage: 8.6 },
];

export const refereeCountByGovernorateFull = [
  { governorate: 'القاهرة', count: 14 },
  { governorate: 'الإسكندرية', count: 9 },
  { governorate: 'الجيزة', count: 7 },
  { governorate: 'المنوفية', count: 5 },
  { governorate: 'الغربية', count: 5 },
  { governorate: 'الشرقية', count: 4 },
  { governorate: 'الدقهلية', count: 4 },
  { governorate: 'أسيوط', count: 3 },
  { governorate: 'بني سويف', count: 3 },
  { governorate: 'قنا', count: 2 },
];

// Kanban test data
export const kanbanTests = [
  { id: 'k1', refereeId: '1', refereeName: 'أحمد محمد علي', testType: 'interval', testDate: '2024-10-05', rank: 'international', status: 'scheduled' },
  { id: 'k2', refereeId: '2', refereeName: 'محمود سعيد إبراهيم', testType: 'rsa', testDate: '2024-10-06', rank: 'first', status: 'scheduled' },
  { id: 'k3', refereeId: '4', refereeName: 'عمرو شريف فؤاد', testType: 'interval', testDate: '2024-10-07', rank: 'second', status: 'in-progress' },
  { id: 'k4', refereeId: '5', refereeName: 'ياسر إبراهيم منصور', testType: 'rsa', testDate: '2024-10-07', rank: 'second', status: 'in-progress' },
  { id: 'k5', refereeId: '6', refereeName: 'هاني عادل سمير', testType: 'interval', testDate: '2024-10-04', rank: 'international', status: 'awaiting-result' },
  { id: 'k6', refereeId: '8', refereeName: 'وليد رفعت لبيب', testType: 'rsa', testDate: '2024-10-03', rank: 'second', status: 'awaiting-result' },
  { id: 'k7', refereeId: '3', refereeName: 'كريم حسن عبد الله', testType: 'interval', testDate: '2024-09-15', rank: 'first', status: 'completed' },
  { id: 'k8', refereeId: '7', refereeName: 'طارق جمال الدين', testType: 'rsa', testDate: '2024-09-12', rank: 'first', status: 'completed' },
  { id: 'k9', refereeId: '1', refereeName: 'أحمد محمد علي', testType: 'rsa', testDate: '2024-09-10', rank: 'international', status: 'completed' },
];

export const kanbanStatuses = [
  { id: 'scheduled', label: 'مجدول', color: 'blue' },
  { id: 'in-progress', label: 'جاري التنفيذ', color: 'amber' },
  { id: 'awaiting-result', label: 'بانتظار إدخال النتيجة', color: 'violet' },
  { id: 'completed', label: 'مكتمل', color: 'green' },
];

// Messages data
export const conversations = [
  {
    id: 'c1',
    refereeId: '1',
    name: 'أحمد محمد علي',
    avatar: '/src/images/user-36-05.jpg',
    unread: true,
    messages: [
      { id: 'm1', sender: 'them', text: 'السلام عليكم، عايز أسأل عن موعد اختبار اللياقة القادم', time: '10:30 ص' },
      { id: 'm2', sender: 'me', text: 'وعليكم السلام، الموعد يوم 5 أكتوبر القادم', time: '10:32 ص' },
      { id: 'm3', sender: 'them', text: 'شكراً، هل هناك أي استعدادات مطلوبة؟', time: '10:33 ص' },
      { id: 'm4', sender: 'me', text: 'نعم، يرجى الالتزام ببرنامج التدريب المرسل مسبقاً', time: '10:35 ص' },
    ],
  },
  {
    id: 'c2',
    refereeId: '2',
    name: 'محمود سعيد إبراهيم',
    avatar: '/src/images/user-36-06.jpg',
    unread: true,
    messages: [
      { id: 'm5', sender: 'them', text: 'تحية طيبة، عندي إصابة بسيطة في الركبة', time: '09:15 ص' },
      { id: 'm6', sender: 'me', text: 'هل تم عرضها على الطبيب؟', time: '09:20 ص' },
      { id: 'm7', sender: 'them', text: 'نعم، الطبيب نصحني بالراحة 3 أيام', time: '09:22 ص' },
    ],
  },
  {
    id: 'c3',
    refereeId: '4',
    name: 'عمرو شريف فؤاد',
    avatar: '/src/images/user-36-08.jpg',
    unread: false,
    messages: [
      { id: 'm8', sender: 'them', text: 'ممكن أعرف نتيجة اختباري الأخير؟', time: '08:00 ص' },
      { id: 'm9', sender: 'me', text: 'النتيجة ناجح، سيتم إرسال التفاصيل عبر الإيميل', time: '08:05 ص' },
      { id: 'm10', sender: 'them', text: 'شكراً جزيلاً', time: '08:06 ص' },
    ],
  },
  {
    id: 'c4',
    refereeId: '6',
    name: 'هاني عادل سمير',
    avatar: '/src/images/user-36-05.jpg',
    unread: true,
    messages: [
      { id: 'm11', sender: 'them', text: 'متى يتوفر جدول المباريات الجديد؟', time: '11:00 ص' },
      { id: 'm12', sender: 'me', text: 'سيتم نشره الأسبوع القادم', time: '11:02 ص' },
      { id: 'm13', sender: 'them', text: 'تمام، في انتظاره', time: '11:03 ص' },
    ],
  },
];

// Test result records for the List page
export const testResults = [
  { id: 'tr1', refereeId: '1', refereeName: 'أحمد محمد علي', testType: 'interval', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-09-15' },
  { id: 'tr2', refereeId: '1', refereeName: 'أحمد محمد علي', testType: 'rsa', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-09-10' },
  { id: 'tr3', refereeId: '2', refereeName: 'محمود سعيد إبراهيم', testType: 'interval', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-08-22' },
  { id: 'tr4', refereeId: '3', refereeName: 'كريم حسن عبد الله', testType: 'interval', season: '2024-2025', result: 'fail', failureReason: 'تأخر جري', testDate: '2024-07-10' },
  { id: 'tr5', refereeId: '4', refereeName: 'عمرو شريف فؤاد', testType: 'rsa', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-09-01' },
  { id: 'tr6', refereeId: '5', refereeName: 'ياسر إبراهيم منصور', testType: 'interval', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-08-30' },
  { id: 'tr7', refereeId: '6', refereeName: 'هاني عادل سمير', testType: 'interval', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-09-20' },
  { id: 'tr8', refereeId: '7', refereeName: 'طارق جمال الدين', testType: 'rsa', season: '2024-2025', result: 'fail', failureReason: 'عدم استكمال الاختبار', testDate: '2024-06-15' },
  { id: 'tr9', refereeId: '8', refereeName: 'وليد رفعت لبيب', testType: 'interval', season: '2024-2025', result: 'pass', failureReason: null, testDate: '2024-09-05' },
  { id: 'tr10', refereeId: '2', refereeName: 'محمود سعيد إبراهيم', testType: 'rsa', season: '2023-2024', result: 'pass', failureReason: null, testDate: '2023-10-15' },
  { id: 'tr11', refereeId: '3', refereeName: 'كريم حسن عبد الله', testType: 'interval', season: '2023-2024', result: 'fail', failureReason: 'تأخر مشي', testDate: '2023-09-20' },
  { id: 'tr12', refereeId: '5', refereeName: 'ياسر إبراهيم منصور', testType: 'rsa', season: '2023-2024', result: 'pass', failureReason: null, testDate: '2023-08-10' },
];

// Interval test protocol thresholds (configurable per rank)
export const intervalTestThresholds = {
  international: { runLimit: 15, walkLimit: 18 },
  first: { runLimit: 15, walkLimit: 18 },
  second: { runLimit: 17, walkLimit: 20 },
  lower: { runLimit: 18, walkLimit: 22 },
};

// RSA test default threshold (editable in settings, pending federation confirmation)
export const rsaTestThreshold = 6.0;

// مجموعات تدريبية
export const trainingGroups = [
  { id: 'g1', name: 'المجموعة الأولى - دولي', description: 'مجموعة الحكام الدوليين للإعداد البدني المتقدم', refereeIds: ['1', '6', '2'] },
  { id: 'g2', name: 'المجموعة الثانية - أولى', description: 'مجموعة حكام الدرجة الأولى للتحضير البدني', refereeIds: ['3', '7', '4', '5'] },
  { id: 'g3', name: 'مجموعة التعافي', description: 'مجموعة الحكام في فترة التعافي من الإصابات', refereeIds: ['8', '3'] },
];

export const trainingTypeLabels = {
  general: 'لياقة عامة',
  interval: 'تحضير Interval',
  recovery: 'تعافي',
};

export const trainingTypeColors = {
  general: { bg: 'bg-sky-500', text: 'text-sky-700', dot: 'bg-sky-500', light: 'bg-sky-100' },
  interval: { bg: 'bg-violet-500', text: 'text-violet-700', dot: 'bg-violet-500', light: 'bg-violet-100' },
  recovery: { bg: 'bg-emerald-500', text: 'text-emerald-700', dot: 'bg-emerald-500', light: 'bg-emerald-100' },
};

// جلسات تدريب (تظهر في التقويم)
export const trainingSessions = [
  { id: 's1', groupId: 'g1', date: '2025-07-02', time: '08:00', location: 'ملعب القاهرة الدولي', type: 'general', attendance: [{ refereeId: '1', status: 'present' }, { refereeId: '6', status: 'present' }, { refereeId: '2', status: 'present' }], notes: '' },
  { id: 's2', groupId: 'g1', date: '2025-07-07', time: '08:00', location: 'ملعب القاهرة الدولي', type: 'interval', attendance: [{ refereeId: '1', status: 'present' }, { refereeId: '6', status: 'present' }, { refereeId: '2', status: 'absent' }], notes: '' },
  { id: 's3', groupId: 'g2', date: '2025-07-03', time: '17:00', location: 'ملعب الإسكندرية', type: 'general', attendance: [{ refereeId: '3', status: 'present' }, { refereeId: '7', status: 'present' }, { refereeId: '4', status: 'present' }, { refereeId: '5', status: 'excused' }], notes: '' },
  { id: 's4', groupId: 'g2', date: '2025-07-09', time: '17:00', location: 'ملعب الإسكندرية', type: 'interval', attendance: [{ refereeId: '3', status: 'present' }, { refereeId: '7', status: 'absent' }, { refereeId: '4', status: 'present' }, { refereeId: '5', status: 'present' }], notes: '' },
  { id: 's5', groupId: 'g3', date: '2025-07-04', time: '10:00', location: 'مركز التأهيل - الجيزة', type: 'recovery', attendance: [{ refereeId: '8', status: 'present' }, { refereeId: '3', status: 'present' }], notes: '' },
  { id: 's6', groupId: 'g1', date: '2025-07-14', time: '08:00', location: 'ملعب القاهرة الدولي', type: 'general', attendance: [{ refereeId: '1', status: 'present' }, { refereeId: '6', status: 'present' }, { refereeId: '2', status: 'present' }], notes: '' },
  { id: 's7', groupId: 'g2', date: '2025-07-16', time: '17:00', location: 'ملعب الإسكندرية', type: 'recovery', attendance: [{ refereeId: '3', status: 'present' }, { refereeId: '7', status: 'present' }, { refereeId: '4', status: 'present' }, { refereeId: '5', status: 'present' }], notes: '' },
  { id: 's8', groupId: 'g1', date: '2025-07-21', time: '08:00', location: 'ملعب القاهرة الدولي', type: 'interval', attendance: [{ refereeId: '1', status: 'present' }, { refereeId: '6', status: 'present' }, { refereeId: '2', status: 'present' }], notes: '' },
  { id: 's9', groupId: 'g3', date: '2025-07-23', time: '10:00', location: 'مركز التأهيل - الجيزة', type: 'recovery', attendance: [{ refereeId: '8', status: 'present' }, { refereeId: '3', status: 'excused' }], notes: '' },
  { id: 's10', groupId: 'g2', date: '2025-07-28', time: '17:00', location: 'ملعب الإسكندرية', type: 'interval', attendance: [{ refereeId: '3', status: 'present' }, { refereeId: '7', status: 'present' }, { refereeId: '4', status: 'absent' }, { refereeId: '5', status: 'present' }], notes: '' },
  { id: 's11', groupId: 'g1', date: '2025-08-04', time: '08:00', location: 'ملعب القاهرة الدولي', type: 'general', attendance: [{ refereeId: '1', status: 'present' }, { refereeId: '6', status: 'present' }, { refereeId: '2', status: 'present' }], notes: '' },
  { id: 's12', groupId: 'g2', date: '2025-08-06', time: '17:00', location: 'ملعب الإسكندرية', type: 'interval', attendance: [{ refereeId: '3', status: 'present' }, { refereeId: '7', status: 'present' }, { refereeId: '4', status: 'present' }, { refereeId: '5', status: 'present' }], notes: '' },
  { id: 's13', groupId: 'g3', date: '2025-08-11', time: '10:00', location: 'مركز التأهيل - الجيزة', type: 'recovery', attendance: [{ refereeId: '8', status: 'present' }, { refereeId: '3', status: 'present' }], notes: '' },
  { id: 's14', groupId: 'g1', date: '2025-08-13', time: '08:00', location: 'ملعب القاهرة الدولي', type: 'interval', attendance: [{ refereeId: '1', status: 'present' }, { refereeId: '6', status: 'present' }, { refereeId: '2', status: 'present' }], notes: '' },
  { id: 's15', groupId: 'g2', date: '2025-08-20', time: '17:00', location: 'ملعب الإسكندرية', type: 'general', attendance: [{ refereeId: '3', status: 'present' }, { refereeId: '7', status: 'present' }, { refereeId: '4', status: 'present' }, { refereeId: '5', status: 'present' }], notes: '' },
];

// تقييمات RPE لكل حكم بعد كل جلسة
export const rpeRecords = [
  { id: 'rpe1', sessionId: 's1', refereeId: '1', rpeScore: 7, date: '2025-07-02' },
  { id: 'rpe2', sessionId: 's1', refereeId: '6', rpeScore: 6, date: '2025-07-02' },
  { id: 'rpe3', sessionId: 's1', refereeId: '2', rpeScore: 8, date: '2025-07-02' },
  { id: 'rpe4', sessionId: 's2', refereeId: '1', rpeScore: 9, date: '2025-07-07' },
  { id: 'rpe5', sessionId: 's2', refereeId: '6', rpeScore: 8, date: '2025-07-07' },
  { id: 'rpe6', sessionId: 's3', refereeId: '3', rpeScore: 5, date: '2025-07-03' },
  { id: 'rpe7', sessionId: 's3', refereeId: '7', rpeScore: 6, date: '2025-07-03' },
  { id: 'rpe8', sessionId: 's3', refereeId: '4', rpeScore: 7, date: '2025-07-03' },
  { id: 'rpe9', sessionId: 's4', refereeId: '3', rpeScore: 8, date: '2025-07-09' },
  { id: 'rpe10', sessionId: 's4', refereeId: '4', rpeScore: 9, date: '2025-07-09' },
  { id: 'rpe11', sessionId: 's4', refereeId: '5', rpeScore: 7, date: '2025-07-09' },
  { id: 'rpe12', sessionId: 's5', refereeId: '8', rpeScore: 3, date: '2025-07-04' },
  { id: 'rpe13', sessionId: 's5', refereeId: '3', rpeScore: 4, date: '2025-07-04' },
  { id: 'rpe14', sessionId: 's6', refereeId: '1', rpeScore: 6, date: '2025-07-14' },
  { id: 'rpe15', sessionId: 's6', refereeId: '6', rpeScore: 5, date: '2025-07-14' },
  { id: 'rpe16', sessionId: 's6', refereeId: '2', rpeScore: 7, date: '2025-07-14' },
  { id: 'rpe17', sessionId: 's7', refereeId: '3', rpeScore: 4, date: '2025-07-16' },
  { id: 'rpe18', sessionId: 's7', refereeId: '7', rpeScore: 5, date: '2025-07-16' },
  { id: 'rpe19', sessionId: 's7', refereeId: '4', rpeScore: 3, date: '2025-07-16' },
  { id: 'rpe20', sessionId: 's7', refereeId: '5', rpeScore: 4, date: '2025-07-16' },
  { id: 'rpe21', sessionId: 's8', refereeId: '1', rpeScore: 9, date: '2025-07-21' },
  { id: 'rpe22', sessionId: 's8', refereeId: '6', rpeScore: 8, date: '2025-07-21' },
  { id: 'rpe23', sessionId: 's8', refereeId: '2', rpeScore: 10, date: '2025-07-21' },
  { id: 'rpe24', sessionId: 's9', refereeId: '8', rpeScore: 2, date: '2025-07-23' },
  { id: 'rpe25', sessionId: 's10', refereeId: '3', rpeScore: 8, date: '2025-07-28' },
  { id: 'rpe26', sessionId: 's10', refereeId: '7', rpeScore: 9, date: '2025-07-28' },
  { id: 'rpe27', sessionId: 's10', refereeId: '5', rpeScore: 7, date: '2025-07-28' },
];
