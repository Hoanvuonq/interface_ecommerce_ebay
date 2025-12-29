import {
  FaBriefcase,
  FaHome,
  FaLock,
  FaMapMarkerAlt,
  FaUniversity,
  FaUser,
  FaWallet,
} from "react-icons/fa";

export const menuItems = [
  { key: "info", label: "Hồ sơ của tôi", icon: FaUser },
  { key: "address", label: "Địa chỉ giao hàng", icon: FaMapMarkerAlt },
  { key: "wallet", label: "Ví điện tử", icon: FaWallet },
  { key: "bank-account", label: "Tài khoản ngân hàng", icon: FaUniversity },
  { key: "password", label: "Đổi mật khẩu", icon: FaLock },
];

export const menuAddressItems = [
  { val: "HOME", label: "Nhà riêng", icon: FaHome },
  { val: "OFFICE", label: "Văn phòng", icon: FaBriefcase },
  { val: "OTHER", label: "Khác", icon: FaMapMarkerAlt },
];
