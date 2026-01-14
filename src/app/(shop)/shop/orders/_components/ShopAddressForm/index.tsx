// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Card,
//   Button,
//   Tag,
//   Typography,
//   Divider,
//   Spin,
//   Form,
//   Select,
//   Modal,
//   App,
// } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import { useGetAllShopAddresses } from "../../../vouchers/_hooks/useShopAddress";
// import { getStoredUserDetail } from "@/utils/jwt";
// import addressData, { Province, Ward } from "vietnam-address-database";
// import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
// import { InputField, ButtonField, TextAreaField, FormInput ,Checkbox} from "@/components";
// import Porta
// import {
//   useCreateShopAddress,
//   useUpdateShopAddress,
// } from "../../../vouchers/_hooks/useShopAddress";
// import {
//   Address,
//   CreateShopAddressRequest,
//   UpdateShopAddressRequest,
// } from "@/app/(main)/shop/_types/dto/shop.dto";
// import { AddressFormModal } from "../AddressFormModal";

// const { Title, Text } = Typography;

// export type AddressType = "PICKUP" | "RETURN" | "BOTH" | "OTHER";

// export interface ShopAddress {
//   addressId: string;
//   address: Address;
//   type: AddressType;
//   fullName: string;
//   phone: string;
//   default: boolean;
//   defaultPickup: boolean;
//   defaultReturn: boolean;
// }

// export default function ShopAddressForm() {
//   const [addresses, setAddresses] = useState<ShopAddress[]>([]);
//   const {
//     handleGetAllShopAddresses,
//     loading,
//     error: errorGetAll,
//   } = useGetAllShopAddresses();
//   const users = useMemo(() => getStoredUserDetail(), []);
//   const shopId = users?.shopId;

//   const [modalForm] = Form.useForm();
//   const [open, setOpen] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<ShopAddress | null>(
//     null
//   );
//   // Sử dụng vietnam-address-database thay vì API
//   const [provinces, setProvinces] = useState<Province[]>([]);
//   const [allWards, setAllWards] = useState<Ward[]>([]);
//   const [wards, setWards] = useState<Ward[]>([]);
//   const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
//   const [selectedCountry, setSelectedCountry] = useState<string>("Vietnam");

//   const {
//     handleCreateShopAddress,
//     loading: creating,
//     error: errorCreate,
//   } = useCreateShopAddress();
//   const {
//     handleUpdateShopAddress,
//     loading: updating,
//     error: errorUpdate,
//   } = useUpdateShopAddress();

//   const { notification } = App.useApp();

//   // Parse vietnam-address-database để lấy provinces và wards (giống như buyer address)
//   useEffect(() => {
//     if (provinces.length === 0 || allWards.length === 0) {
//       try {
//         // Parse addressData để lấy provinces và wards (giống như AddressManagement.tsx)
//         let provincesData: Province[] = [];
//         let wardsData: Ward[] = [];

//         addressData.forEach((item: any) => {
//           if (item.type === "table") {
//             if (item.name === "provinces" && item.data) {
//               provincesData = item.data as Province[];
//             } else if (item.name === "wards" && item.data) {
//               wardsData = item.data as Ward[];
//             }
//           }
//         });

//         setProvinces(provincesData);
//         setAllWards(wardsData);
//         console.log(
//           "✅ Loaded provinces:",
//           provincesData.length,
//           "wards:",
//           wardsData.length
//         );
//       } catch (error) {
//         console.error("❌ Error parsing addressData:", error);
//       }
//     }
//   }, []); // Chỉ chạy một lần khi component mount

//   // Filter wards theo selectedProvinceCode
//   useEffect(() => {
//     if (selectedProvinceCode && allWards.length > 0) {
//       const filteredWards = allWards.filter(
//         (w) => w.province_code === selectedProvinceCode
//       );
//       setWards(filteredWards);
//       console.log(
//         `✅ Filtered ${filteredWards.length} wards for province ${selectedProvinceCode}`
//       );
//     } else {
//       setWards([]);
//     }
//   }, [selectedProvinceCode, allWards]);

//   // Lấy danh sách địa chỉ
//   useEffect(() => {
//     if (!shopId) return;
//     (async () => {
//       try {
//         const res = await handleGetAllShopAddresses(shopId);
//         if (res?.data) setAddresses(res.data);
//       } catch (err: any) {
//         console.error("Error loading addresses:", err);
//         // Vì React state update là async, errorGetAll có thể chưa được update
//         const errorMessage =
//           err?.message ||
//           errorGetAll ||
//           "Không thể tải danh sách địa chỉ. Vui lòng thử lại!";
//         notification.error({
//           message: "Lỗi",
//           description: errorMessage,
//         });
//       }
//     })();
//   }, [shopId]);

//   // Khi bấm Sửa → điền form
//   useEffect(() => {
//     if (open && editingAddress) {
//       const formValues: any = {
//         fullName: editingAddress.fullName,
//         phone: editingAddress.phone,
//         country: "Vietnam",
//         addressDetail: editingAddress.address.detail,
//         default: editingAddress.default,
//         defaultPickup: editingAddress.defaultPickup,
//         defaultReturn: editingAddress.defaultReturn,
//       };

//       // Nếu có provinceCode, set lại province và load wards
//       if (editingAddress.address.provinceCode) {
//         formValues.province = editingAddress.address.provinceName;
//         formValues.provinceCode = editingAddress.address.provinceCode;
//         formValues.provinceName = editingAddress.address.provinceName;
//         setSelectedProvinceCode(editingAddress.address.provinceCode);
//       } else if (editingAddress.address.provinceName) {
//         formValues.province = editingAddress.address.provinceName;
//         // Tìm province code từ name (tìm theo name trong vietnam-address-database)
//         const foundProvince = provinces.find(
//           (p) =>
//             p.name === editingAddress.address.provinceName ||
//             p.name.includes(editingAddress.address.provinceName) ||
//             editingAddress.address.provinceName.includes(p.name)
//         );
//         if (foundProvince) {
//           formValues.provinceCode = foundProvince.province_code;
//           formValues.provinceName = foundProvince.name;
//           setSelectedProvinceCode(foundProvince.province_code);
//         }
//       }

//       // Nếu có wardCode, set lại ward
//       if (editingAddress.address.wardCode) {
//         formValues.ward =
//           editingAddress.address.wardName || editingAddress.address.wardCode;
//         formValues.wardCode = editingAddress.address.wardCode;
//         formValues.wardName = editingAddress.address.wardName;
//       } else if (editingAddress.address.districtName) {
//         // Fallback: dùng district như ward
//         formValues.ward = editingAddress.address.districtName;
//         formValues.wardName = editingAddress.address.districtName;
//       }

//       modalForm.setFieldsValue(formValues);
//       setSelectedCountry(formValues.country || "Vietnam");
//     } else if (!editingAddress) {
//       modalForm.resetFields();
//       setSelectedProvinceCode("");
//       setWards([]);
//       // Set country mặc định
//       modalForm.setFieldsValue({
//         country: "Vietnam",
//       });
//       setSelectedCountry("Vietnam");
//     }
//   }, [editingAddress, open]); // Loại bỏ modalForm và provinces khỏi dependency để tránh loop

//   const handleDelete = (addressId: string) => {
//     setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
//     notification.success({
//       message: "Thành công",
//       description: "Đã xóa địa chỉ thành công!",
//     });
//   };

//   const handleOpenAdd = () => {
//     setEditingAddress(null);
//     modalForm.resetFields();
//     setOpen(true);
//   };

//   const handleOpenEdit = (address: ShopAddress) => {
//     setEditingAddress(address);
//     setOpen(true);
//   };

//   const handleSave = async () => {
//     try {
//       const values = await modalForm.validateFields();
//       console.log("Form Values:", values);

//       const wardName = values.wardName || values.ward || "";
//       const provinceName = values.provinceName || values.province || "";

//       // Map sang old format từ ward_mappings
//       const oldAddress = mapAddressToOldFormat(wardName, provinceName);

//       console.log("🔍 Shop Address Mapping:", {
//         wardName,
//         provinceName,
//         oldAddress,
//         found: !!oldAddress.old_ward_name,
//       });

//       const addressPayload:
//         | CreateShopAddressRequest
//         | UpdateShopAddressRequest = {
//         address: {
//           countryCode: "VN",
//           countryName: "Vietnam",
//           provinceCode: values.provinceCode || values.province || "",
//           provinceName: provinceName,
//           districtCode: values.districtCode || "",
//           districtName: values.districtName || "",
//           wardCode: values.wardCode || "",
//           wardName: wardName,
//           detail: values.addressDetail,
//           // Thêm old format từ ward_mappings (chỉ khi tìm thấy mapping)
//           ...(oldAddress.old_ward_name && {
//             districtNameOld: oldAddress.old_district_name,
//             provinceNameOld: oldAddress.old_province_name,
//             wardNameOld: oldAddress.old_ward_name,
//           }),
//         },
//         detail: values.addressDetail,
//         fullName: values.fullName,
//         phone: values.phone,
//         isDefault: values.default,
//         isDefaultPickup: values.defaultPickup,
//         isDefaultReturn: values.defaultReturn,
//       };
//       console.log("📤 Address Payload:", addressPayload);

//       if (editingAddress) {
//         await handleUpdateShopAddress(
//           shopId,
//           editingAddress.addressId,
//           addressPayload
//         );
//         notification.success({
//           message: "Thành công",
//           description: "Cập nhật địa chỉ thành công!",
//         });
//       } else {
//         await handleCreateShopAddress(shopId, addressPayload);
//         notification.success({
//           message: "Thành công",
//           description: "Thêm địa chỉ mới thành công!",
//         });
//       }

//       // ✅ Refetch lại danh sách sau khi thêm/sửa
//       const res = await handleGetAllShopAddresses(shopId);
//       if (res?.data) setAddresses(res.data);

//       // ✅ Reset form & đóng modal
//       modalForm.resetFields();
//       setEditingAddress(null);
//       setOpen(false);
//     } catch (err: any) {
//       console.error("Error saving address:", err);
//       // Vì React state update là async, errorCreate/errorUpdate có thể chưa được update
//       const errorMessage =
//         err?.message ||
//         errorCreate ||
//         errorUpdate ||
//         "Không thể lưu địa chỉ. Vui lòng thử lại!";
//       notification.error({
//         message: "Thất bại",
//         description: errorMessage,
//       });
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
//       <div className="flex justify-between items-center mb-4">
//         <Title level={4} className="!mb-0 text-gray-800">
//           Địa Chỉ Vận Chuyển
//         </Title>
//         <ButtonField
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={handleOpenAdd}
//           block={false}
//         >
//           Thêm địa chỉ mới
//         </ButtonField>
//       </div>

//       <Divider className="mb-4" />

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <Spin size="large" />
//         </div>
//       ) : addresses.length === 0 ? (
//         <div className="text-center text-slate-500 py-4">
//           Chưa có địa chỉ nào
//         </div>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {addresses.map((item, index) => {
//             const isProtected =
//               item.default || item.defaultPickup || item.defaultReturn;

//             return (
//               <Card
//                 key={item.addressId}
//                 className="hover:shadow-md transition-shadow"
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Text className="font-medium text-gray-700">
//                         Address {index + 1}
//                       </Text>
//                       {item.default && <Tag color="#36cfc9">Mặc định</Tag>}
//                       {item.defaultPickup && (
//                         <Tag color="#fa8c16">Địa chỉ lấy hàng</Tag>
//                       )}
//                       {item.defaultReturn && (
//                         <Tag color="#faad14">Địa chỉ trả hàng</Tag>
//                       )}
//                     </div>
//                     <div className="text-gray-800 font-semibold">
//                       Họ và tên : {item.fullName}
//                     </div>
//                     <div className="text-gray-800 font-semibold">
//                       Số điện thoại: {item.phone}
//                     </div>
//                     <div className="text-gray-800 mt-1 font-semibold">
//                       Địa chỉ chi tiết : {item.address.detail}
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-end gap-1">
//                     <Button
//                       type="link"
//                       icon={<EditOutlined />}
//                       onClick={() => handleOpenEdit(item)}
//                     >
//                       Sửa
//                     </Button>
//                     {!isProtected && (
//                       <Button
//                         danger
//                         type="link"
//                         icon={<DeleteOutlined />}
//                         className="!text-red-500"
//                         onClick={() => handleDelete(item.addressId)}
//                       >
//                         Xóa
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* ✅ Modal thêm/sửa */}
//       <Modal
//         title={
//           <span className="text-lg font-semibold">
//             {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
//           </span>
//         }
//         width={600}
//         open={open}
//         onCancel={() => {
//           setOpen(false);
//           modalForm.resetFields();
//           setEditingAddress(null);
//         }}
//         maskClosable={false}
//         footer={
//           <div className="flex justify-end gap-3">
//             <ButtonField
//               type="default"
//               onClick={() => {
//                 modalForm.resetFields();
//                 setOpen(false);
//                 setEditingAddress(null);
//               }}
//             >
//               Hủy
//             </ButtonField>
//             <ButtonField type="primary" onClick={handleSave}>
//               Lưu
//             </ButtonField>
//           </div>
//         }
//         confirmLoading={creating || updating}
//         forceRender
//       >
//         <Spin spinning={creating || updating}>
//           <Form form={modalForm} layout="vertical">
//             <InputField
//               label="Họ & Tên"
//               name="fullName"
//               placeholder="Họ và tên"
//               maxLength={50}
//               rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
//             />

//             <InputField
//               label="Số điện thoại"
//               name="phone"
//               placeholder="Số điện thoại"
//               inputMode="tel"
//               maxLength={11}
//               rules={[
//                 { required: true, message: "Vui lòng nhập số điện thoại" },
//                 {
//                   pattern: /^(0\d{9,10})$/,
//                   message:
//                     "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)",
//                 },
//               ]}
//             />

//             {/* ✅ Không lồng Form.Item */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Form.Item
//                 name="country"
//                 label="Quốc gia"
//                 rules={[{ required: true, message: "Chọn Quốc gia" }]}
//                 initialValue="Vietnam"
//               >
//                 <Select
//                   placeholder="Chọn Quốc gia"
//                   showSearch
//                   filterOption={(input, option) => {
//                     const label = String(
//                       option?.label ?? option?.children ?? ""
//                     );
//                     return label.toLowerCase().includes(input.toLowerCase());
//                   }}
//                   onChange={(value) => {
//                     setSelectedCountry(value);
//                     modalForm.setFieldsValue({
//                       province: undefined,
//                       ward: undefined,
//                     });
//                     setSelectedProvinceCode("");
//                     setWards([]);
//                   }}
//                 >
//                   <Select.Option key="VN" value="Vietnam">
//                     Việt Nam
//                   </Select.Option>
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 name="province"
//                 label="Tỉnh/Thành phố"
//                 rules={[{ required: true, message: "Chọn Tỉnh/Thành phố" }]}
//               >
//                 <Select
//                   placeholder="Tỉnh/Thành phố"
//                   allowClear
//                   showSearch
//                   filterOption={(input, option) => {
//                     const label = String(
//                       option?.label ?? option?.children ?? ""
//                     );
//                     return label.toLowerCase().includes(input.toLowerCase());
//                   }}
//                   disabled={!provinces.length || !selectedCountry}
//                   onChange={(value, option: any) => {
//                     modalForm.setFieldsValue({ ward: undefined });
//                     setSelectedProvinceCode("");
//                     setWards([]);
//                     if (value && option) {
//                       const provinceCode = option.key || option.value;
//                       setSelectedProvinceCode(provinceCode);
//                       modalForm.setFieldsValue({
//                         provinceCode: provinceCode,
//                         provinceName: option.children || value,
//                       });
//                     }
//                   }}
//                 >
//                   {provinces.map((p) => (
//                     <Select.Option key={p.province_code} value={p.name}>
//                       {p.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 name="ward"
//                 label="Phường/Xã"
//                 rules={[{ required: true, message: "Chọn Phường/Xã" }]}
//               >
//                 <Select
//                   placeholder="Phường/Xã"
//                   allowClear
//                   showSearch
//                   filterOption={(input, option) => {
//                     const label = String(
//                       option?.label ?? option?.children ?? ""
//                     );
//                     return label.toLowerCase().includes(input.toLowerCase());
//                   }}
//                   disabled={!wards.length || !selectedProvinceCode}
//                   onChange={(value, option: any) => {
//                     if (value && option) {
//                       const wardCode = option.key || option.value;
//                       modalForm.setFieldsValue({
//                         wardCode: wardCode,
//                         wardName: option.children || value,
//                       });
//                     }
//                   }}
//                 >
//                   {wards.map((w) => (
//                     <Select.Option key={w.ward_code} value={w.name}>
//                       {w.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </div>

//             {/* Hidden fields để lưu code và name */}
//             <Form.Item name="provinceCode" hidden>
//               <input type="hidden" />
//             </Form.Item>
//             <Form.Item name="provinceName" hidden>
//               <input type="hidden" />
//             </Form.Item>
//             <Form.Item name="wardCode" hidden>
//               <input type="hidden" />
//             </Form.Item>
//             <Form.Item name="wardName" hidden>
//               <input type="hidden" />
//             </Form.Item>

//             <TextAreaField
//               label="Địa chỉ chi tiết (ví dụ: Số nhà, tên đường)"
//               name="addressDetail"
//               rows={2}
//               placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
//               maxLength={200}
//               rules={[
//                 { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
//               ]}
//             />

//             <div className="mt-2 space-y-1">
//               <Form.Item
//                 name="default"
//                 valuePropName="checked"
//                 style={{ marginBottom: 4 }}
//               >
//                 <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
//               </Form.Item>
//               <Form.Item
//                 name="defaultPickup"
//                 valuePropName="checked"
//                 style={{ marginBottom: 4 }}
//               >
//                 <Checkbox>Đặt làm địa chỉ lấy hàng</Checkbox>
//               </Form.Item>
//               <Form.Item
//                 name="defaultReturn"
//                 valuePropName="checked"
//                 style={{ marginBottom: 0 }}
//               >
//                 <Checkbox>Đặt làm địa chỉ trả hàng</Checkbox>
//               </Form.Item>
//             </div>
//           </Form>
//         </Spin>
//       </Modal>
//      <AddressFormModal
//   open={open}
//   onClose={() => {
//     setOpen(false);
//     setEditingAddress(null);
//     // modalForm.resetFields(); // Nếu đã bỏ hẳn Antd thì không cần dòng này
//   }}
//   editingAddress={editingAddress}
//   handleSave={handleSave} // Hàm xử lý logic lưu
//   creating={creating}     // Biến loading khi thêm mới
//   updating={updating}     // Biến loading khi cập nhật
//   provinces={provinces}
//   wards={wards}
//   onProvinceChange={(code, name) => {
//     // Logic khi đổi tỉnh: setSelectedProvinceCode(code) và fetch wards
//     setSelectedProvinceCode(code);
//     // Gọi hàm fetch xã phường ở đây
//   }}
// />
//     </div>
//   );
// }

import React from 'react'

export const ShopAddressForm = () => {
  return (
    <div>test</div>
  )
}
