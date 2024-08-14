export interface Child {
  childName: string;
  childGender: string;
  childDob: Date | null;
}

export interface EducationDetail {
  degree: string;
  stream: string;
  grade: string;
  university: string;
  startYear: string;
  endYear: string;
  educationId: string;
}

export interface EmploymentDetail {
  company: string;
  branch: string;
  role: string;
  joiningDate: Date | null;
  relievingDate: Date | null;
  isCurrentCompany: boolean;
}

interface ChildData {
    childName: string;
    childGender: string;
    childDob: Date | null;
  }
  
  interface BankDetail {
    bankName: string;
    accountNo: string;
    ifsCode: string;
  }
  
  export interface EmployeeData {
    empId: string | undefined;
    firstName: string | undefined;
    middleName: string | undefined;
    lastName: string | undefined;
    DOB: string | null;
    aadhaarNo: string | undefined;
    bloodGroup: string | undefined;
    childCount: string | undefined;
    childData: ChildData[];
    email: string | undefined;
    mobile: string | undefined;
    panNo: string | undefined;
    esi: string | undefined;
    identificationMark: string | undefined;
    hobbies: string | undefined;
    maritalStatus: string | undefined;
    spouse: string | undefined;
    fatherName: string | undefined;
    motherName: string | undefined;
    houseNoPermanent: string | undefined;
    colonyPermanent: string | undefined;
    cityPermanent: string | undefined;
    districtPermanent: string | undefined;
    countryPermanent: string | undefined;
    statePermanent: string | undefined;
    pinCodePermanent: string | undefined;
    houseNoPresent: string | undefined;
    colonyPresent: string | undefined;
    cityPresent: string | undefined;
    districtPresent: string | undefined;
    countryPresent: string | undefined;
    statePresent: string | undefined;
    pinCodePresent: string | undefined;
    department: string | undefined;
    designation: string | undefined;
    gender: string | undefined;
    companyData: EmploymentDetail[];
    educationData: EducationDetail[];
    bankDetail: BankDetail;
    empFamilyKey: string;
    uan: string | undefined;
  }
  
  export interface UpdateEmployeeResponse {
    success: boolean;
    message: string;
    add: any;
  }
  