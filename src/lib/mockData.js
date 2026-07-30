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
  interval: 'RSA (Interval)',
  endurance: 'تحمل',
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
