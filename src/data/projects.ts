export interface ProjectScreenshot {
  src: string;
  caption: string;
  category: string;
}

export interface ProjectData {
  id: string;
  title: string;
  role: string;
  description: string;
  longDescription: string;
  tags: string[];
  features: string[];
  color: string;
  accentColor: string;
  screenshots: ProjectScreenshot[];
}

// Helper to import all images from a directory using Vite's glob import
const clinicAdminImages = import.meta.glob('/src/projects/clinic appointment/Admin/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const clinicAdminSettingsImages = import.meta.glob('/src/projects/clinic appointment/Admin/Settings Pages/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const clinicPatientImages = import.meta.glob('/src/projects/clinic appointment/Patient/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const employeeCandidateImages = import.meta.glob('/src/projects/employee management/Candidate/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const employeeEmployeeImages = import.meta.glob('/src/projects/employee management/Employee/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const employeeHrImages = import.meta.glob('/src/projects/employee management/Hr/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const employeeHrSettingsImages = import.meta.glob('/src/projects/employee management/Hr/Setting Pages/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const employeeManagerImages = import.meta.glob('/src/projects/employee management/Manager/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const violationImages = import.meta.glob('/src/projects/student violation module/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function toScreenshots(images: Record<string, string>, category: string): ProjectScreenshot[] {
  return Object.entries(images).map(([path, src]) => {
    const filename = path.split('/').pop()?.replace('.png', '') || '';
    return {
      src,
      caption: filename.replace(/Screenshot \d{4}-\d{2}-\d{2} /, ''),
      category,
    };
  });
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'clinic-appointment-system',
    title: 'PLP Clinic Appointment System',
    role: 'Full-Stack Developer',
    description: 'A web-based clinic management application developed for Pamantasan ng Lungsod ng Pasig (PLP). It digitizes and streamlines the process of scheduling, managing, and tracking medical appointments within the university\'s health clinic.',
    longDescription: `A comprehensive web-based clinic management application developed for Pamantasan ng Lungsod ng Pasig (PLP). The system digitizes and streamlines the entire process of scheduling, managing, and tracking medical appointments within the university's health clinic.

The platform serves both clinic staff and patients, providing role-specific dashboards and functionalities. Clinic administrators can manage appointments with capacity control, generate exportable reports in Excel and PDF formats, and configure system settings. Patients can book appointments, view their medical history, and receive notifications about their scheduled visits.

Security is a core focus, featuring login attempt locking to prevent brute-force attacks and role-based access control to ensure data privacy and integrity.`,
    tags: ['PHP', 'MySQL', 'MariaDB', 'XAMPP'],
    features: [
      'Role-based access (Clinic Staff & Patients)',
      'Secure authentication with login attempt locking',
      'Appointment management with capacity control',
      'Bulk appointment creation & cancellation',
      'Exportable reports (Excel/PDF)',
      'Patient medical history tracking',
      'System configuration & settings management',
    ],
    color: 'from-blue-500 to-cyan-400',
    accentColor: '#3b82f6',
    screenshots: [
      ...toScreenshots(clinicAdminImages, 'Admin'),
      ...toScreenshots(clinicAdminSettingsImages, 'Admin Settings'),
      ...toScreenshots(clinicPatientImages, 'Patient'),
    ],
  },
  {
    id: 'employee-management-system',
    title: 'ACME Employee Management System',
    role: 'Full-Stack Developer',
    description: 'A comprehensive, web-based portal designed to streamline human resources operations and centralize the employee lifecycle with robust Role-Based Access Control (RBAC).',
    longDescription: `A comprehensive, web-based portal designed to streamline human resources operations and centralize the employee lifecycle with robust Role-Based Access Control (RBAC).

The system features four distinct portals — HR, Manager, Employee, and Candidate — each tailored with specific functionalities and permissions. HR administrators have full control over recruitment pipelines, onboarding processes, and employee records. Managers can evaluate performance, manage leave requests, oversee their team members, and request for a new employee.

Key integrations include SendGrid API for automated email notifications and Google Drive API for cloud-based document management. The system also supports automated Certificate of Employment (COE) generation, reducing administrative overhead significantly.`,
    tags: ['PHP', 'MySQL', 'Bootstrap', 'SendGrid API', 'Google Drive API'],
    features: [
      '4 distinct portals: HR, Manager, Employee, Candidate',
      'Recruitment pipeline & onboarding tracking',
      'Leave management & performance evaluations',
      'Automated Certificate of Employment (COE) generation',
      'Cloud document upload via Google Drive',
      'Email notifications via SendGrid',
      'Comprehensive employee lifecycle management',
    ],
    color: 'from-violet-500 to-fuchsia-400',
    accentColor: '#8b5cf6',
    screenshots: [
      ...toScreenshots(employeeCandidateImages, 'Candidate Portal'),
      ...toScreenshots(employeeEmployeeImages, 'Employee Portal'),
      ...toScreenshots(employeeHrImages, 'HR Portal'),
      ...toScreenshots(employeeHrSettingsImages, 'HR Settings'),
      ...toScreenshots(employeeManagerImages, 'Manager Portal'),
    ],
  },
  {
    id: 'student-violations-module',
    title: 'ISAMS: Student Violations Module',
    role: 'Frontend/Full-Stack Developer',
    description: 'A premium, high-performance desktop application engineered for the College of Computer Studies (CCS). The Student Violations Module digitizes the disciplinary process with evidence-based compliance.',
    longDescription: `A premium, high-performance desktop application engineered for the College of Computer Studies (CCS). The Student Violations Module digitizes the entire disciplinary process with evidence-based compliance and real-time tracking.

Built with modern technologies including React 19, Vite, and Tauri 2, the application delivers native desktop performance while maintaining the flexibility of web technologies. Supabase powers the backend with real-time database capabilities, authentication, and storage.

The module tracks violations through their complete lifecycle — from pending reports to final resolution — with comprehensive sanction deadline monitoring, evidence integration via Google Drive, and institutional-grade reporting with official branding.`,
    tags: ['React 19', 'Vite', 'Tauri 2', 'Supabase', 'Tailwind CSS 4'],
    features: [
      'Violation lifecycle tracking (Pending to Resolved)',
      'Sanction deadline tracking & accountability',
      'Evidence integration via Google Drive',
      'Disciplinary analytics & real-time insights',
      'Institutional reporting with official branding',
      'Real-time database with Supabase',
      'Native desktop performance with Tauri 2',
    ],
    color: 'from-emerald-500 to-teal-400',
    accentColor: '#10b981',
    screenshots: [
      ...toScreenshots(violationImages, 'Violations Module'),
    ],
  },
];

export function getProjectById(id: string): ProjectData | undefined {
  return PROJECTS.find(p => p.id === id);
}
