export const ADMIN_ROLE = 'SUPER ADMIN';
export const USER_ROLE = 'NORMAL USER';

export const INIT_PERMISSIONS = [
  {
    _id: '6780ec2f9d44e03ef6b0ea69',
    name: 'Tạo công ty',
    apiPath: '/companies',
    method: 'POST',
    module: 'Company',
    isDeleted: false,
    createdBy: {
      _id: '6780ec1e9d44e03ef6b0ea63',
      email: 'tien555@gmail.com',
    },
    deletedAt: null,
    createdAt: '2025-01-10T09:45:19.739Z',
    updatedAt: '2025-01-10T09:45:19.739Z',
    __v: 0,
  },
  {
    _id: '6780ec5b9d44e03ef6b0ea6e',
    name: 'Hiển thị công ty',
    apiPath: '/companies',
    method: 'GET',
    module: 'Company',
    isDeleted: false,
    createdBy: {
      _id: '6780ec1e9d44e03ef6b0ea63',
      email: 'tien555@gmail.com',
    },
    deletedAt: null,
    createdAt: '2025-01-10T09:46:03.908Z',
    updatedAt: '2025-01-10T09:46:03.908Z',
    __v: 0,
  },
  {
    _id: '6780ec979d44e03ef6b0ea73',
    name: 'Hiển thị công việc',
    apiPath: '/jobs',
    method: 'GET',
    module: 'Company',
    isDeleted: false,
    createdBy: {
      _id: '6780ec1e9d44e03ef6b0ea63',
      email: 'tien555@gmail.com',
    },
    deletedAt: null,
    createdAt: '2025-01-10T09:47:03.688Z',
    updatedAt: '2025-01-10T09:47:03.688Z',
    __v: 0,
  },
  {
    _id: '6780eca69d44e03ef6b0ea76',
    name: 'Thêm công việc',
    apiPath: '/jobs',
    method: 'POST',
    module: 'Company',
    isDeleted: false,
    createdBy: {
      _id: '6780ec1e9d44e03ef6b0ea63',
      email: 'tien555@gmail.com',
    },
    deletedAt: null,
    createdAt: '2025-01-10T09:47:18.460Z',
    updatedAt: '2025-01-10T09:47:18.460Z',
    __v: 0,
  },
];
