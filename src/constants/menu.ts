export const USER_MENU = [
	{ key: 'profile', icon: 'user', label: 'Thông tin cá nhân', roles: ['BUYER'] },
	{ key: 'orders', icon: 'cart', label: 'Đơn hàng của tôi', roles: ['BUYER'] },
	{ key: 'wishlist', icon: 'heart', label: 'Yêu thích', roles: ['BUYER'] },
	{ key: 'shop', icon: 'shop', label: 'Quản lý shop', roles: ['SHOP'] },
	{ key: 'employee', icon: 'team', label: 'Quản lý nhân viên', roles: ['ADMIN','LOGISTICS','BUSINESS','ACCOUNTANT','EXECUTIVE','IT','SALE','FINANCE'] },
	{ key: 'logout', icon: 'logout', label: 'Đăng xuất', danger: true, roles: ['ALL'] },
	{ key: 'login', icon: 'login', label: 'Đăng nhập', roles: ['GUEST'] },
	{ key: 'register', label: 'Đăng ký', roles: ['GUEST'] },
];
