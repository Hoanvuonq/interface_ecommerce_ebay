/**
 * Error Codes - Frontend
 * Cấu trúc tương tự Backend ErrorCode
 * Format: { code: number, message: string }
 */

export interface ErrorCode {
    code: number;
    message: string;
}

export const ERROR_CODES = {
    // ===== VALIDATION BASE =====
    ID_NOT_EMPTY: { code: 100, message: "Id không được để trống" },

    // ===== TÀI KHOẢN (200-299) =====
    USERNAME_REQUIRED: { code: 200, message: "Tên đăng nhập không được để trống" },
    PASSWORD_REQUIRED: { code: 201, message: "Mật khẩu không được để trống" },
    PASSWORD_INVALID_LENGTH: { code: 202, message: "Mật khẩu phải có ít nhất 6 ký tự và không quá 30 ký tự" },
    PASSWORD_WEAK: { code: 203, message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số" },
    CONFIRM_PASSWORD_NOT_BLANK: { code: 204, message: "Mật khẩu xác nhận không được để trống" },
    CONFIRM_PASSWORD_INVALID_LENGTH: { code: 205, message: "Mật khẩu xác nhận phải có độ dài từ 6 đến 30 ký tự" },
    CONFIRM_PASSWORD_WEAK: { code: 206, message: "Mật khẩu xác nhận phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số" },
    PASSWORD_NOT_MATCH: { code: 207, message: "Mật khẩu mới và mật khẩu xác nhận không khớp" },
    USERNAME_ALREADY_EXISTS: { code: 208, message: "Tên đăng nhập đã tồn tại" },
    EMAIL_ALREADY_EXISTS: { code: 209, message: "Email đã tồn tại" },
    USERNAME_INVALID_LENGTH: { code: 210, message: "Tên đăng nhập phải có độ dài từ 4 đến 30 ký tự" },
    PASSWORD_MIN_LENGTH: { code: 211, message: "Mật khẩu phải có ít nhất 6 ký tự" },
    OLD_PASSWORD_REQUIRED: { code: 212, message: "Mật khẩu cũ không được để trống" },
    NEW_PASSWORD_NOT_BLANK: { code: 213, message: "Mật khẩu mới không được để trống" },
    NEW_PASSWORD_MIN_LENGTH: { code: 214, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
    NEW_PASSWORD_WEAK: { code: 215, message: "Mật khẩu mới phải bắt đầu bằng chữ hoa, chứa ít nhất 1 chữ thường và 1 chữ số" },
    IMAGE_URL_TOO_LONG: { code: 216, message: "URL hình ảnh không được vượt quá 255 ký tự" },
    ACCOUNT_LOCK_REASON_TOO_LONG: { code: 217, message: "Lý do khóa tài khoản không được vượt quá 500 ký tự" },
    ACCOUNT_CREATION_FAILED: { code: 218, message: "Lỗi khi tạo tài khoản" },
    PASSWORD_CHANGE_FAILED: { code: 219, message: "Lỗi khi đổi mật khẩu" },
    OLD_PASSWORD_INCORRECT: { code: 220, message: "Mật khẩu cũ không đúng" },
    ACCOUNT_LOCK_FAILED: { code: 221, message: "Lỗi khi khóa tài khoản" },
    ACCOUNT_UNLOCK_FAILED: { code: 222, message: "Lỗi khi mở khóa tài khoản" },
    ACCOUNT_DELETION_FAILED: { code: 223, message: "Lỗi khi xóa tài khoản" },
    ACCOUNT_UPDATE_FAILED: { code: 224, message: "Lỗi khi cập nhật tài khoản" },
    ACCOUNT_PERMISSION_UPDATE_FAILED: { code: 225, message: "Lỗi khi cập nhật quyền hạn cho tài khoản" },
    GET_ACCOUNT_LIST_FAILED: { code: 226, message: "Lỗi khi lấy danh sách tài khoản" },
    GET_ACCOUNT_DETAIL_FAILED: { code: 227, message: "Lỗi khi lấy chi tiết tài khoản" },
    GET_ACCOUNT_DETAIL_CURRENT_FAILED: { code: 228, message: "Lỗi khi lấy chi tiết tài khoản đang đăng nhập" },
    USER_ID_NOT_BLANK: { code: 229, message: "UserId không được để trống" },
    ACCOUNT_ALREADY_EXISTS: { code: 230, message: "Tài khoản đã tồn tại" },

    // ===== INFO TÀI KHOẢN (300-399) =====
    FULLNAME_NOT_BLANK: { code: 300, message: "Họ và tên không được để trống" },
    FULLNAME_TOO_LONG: { code: 301, message: "Họ và tên không được vượt quá 100 ký tự" },
    PHONE_NOT_BLANK: { code: 302, message: "Số điện thoại không được để trống" },
    PHONE_TOO_LONG: { code: 303, message: "Số điện thoại không được vượt quá 25 ký tự" },
    DATE_OF_BIRTH_INVALID: { code: 304, message: "Ngày sinh phải là ngày trong quá khứ" },
    GENDER_NOT_BLANK: { code: 305, message: "Giới tính không được để trống" },
    DATE_OF_BIRTH_NOT_NULL: { code: 306, message: "Ngày sinh không được để trống" },
    INVALID_STATUS_TRANSITION: { code: 307, message: "Không thể chuyển từ trạng thái hiện tại sang trạng thái yêu cầu" },

    // ===== BUYER (400-499) =====
    RECIPIENT_NAME_NOT_BLANK: { code: 400, message: "Tên người nhận không được để trống" },
    RECIPIENT_NAME_TOO_LONG: { code: 401, message: "Tên người nhận không được vượt quá 100 ký tự" },
    BUYER_NOT_FOUND: { code: 402, message: "Không tìm thấy người mua" },
    BUYER_MAX_ADDRESS_EXCEEDED: { code: 403, message: "Địa chỉ chỉ được có tối đa 5 địa chỉ" },
    BUYER_ADDRESS_CREATION_FAILED: { code: 404, message: "Lỗi khi tạo địa chỉ" },
    BUYER_ADDRESS_NOT_FOUND: { code: 405, message: "Không tìm thấy địa chỉ" },
    ADDRESS_NOT_BELONG_TO_BUYER: { code: 406, message: "Địa chỉ không thuộc người mua hiện tại" },
    BUYER_ADDRESS_UPDATE_FAILED: { code: 407, message: "Lỗi khi cập nhật địa chỉ" },
    BUYER_ADDRESS_DELETION_FAILED: { code: 408, message: "Lỗi khi xóa địa chỉ" },
    BUYER_ID_NOT_BLANK: { code: 409, message: "Id người mua không được để trống" },
    BUYER_INFO_ALREADY_EXISTS: { code: 410, message: "Thông tin người mua đã tồn tại cho tài khoản này" },
    BUYER_INFO_CREATION_FAILED: { code: 411, message: "Lỗi khi tạo thông tin người mua" },
    BUYER_INFO_UPDATE_FAILED: { code: 412, message: "Lỗi khi cập nhật thông tin người mua" },
    BUYER_INFO_NOT_FOUND: { code: 413, message: "Thông tin người mua không tìm thấy" },
    BUYER_INFO_DETAIL_NOT_FOUND: { code: 414, message: "Chi tiết thông tin người mua không tìm thấy" },

    // ===== SHOP (600-899) =====
    SHOP_NAME_NOT_BLANK: { code: 600, message: "Tên shop không được để trống" },
    SHOP_NAME_INVALID_PATTERN: { code: 601, message: "Tên shop phải có ít nhất 2 từ" },
    SHOP_NAME_TOO_LONG: { code: 602, message: "Tên shop không được vượt quá 30 ký tự" },
    SHOP_DESCRIPTION_TOO_LONG: { code: 603, message: "Mô tả shop không được vượt quá 500 ký tự" },
    REJECTED_REASON_TOO_LONG: { code: 604, message: "Lý do từ chối không được vượt quá 500 ký tự" },
    VERIFIED_BY_TOO_LONG: { code: 605, message: "Tên người xác minh không được vượt quá 100 ký tự" },
    SHOP_NOT_NULL: { code: 606, message: "Shop không được để trống" },
    LOGO_URL_NOT_BLANK: { code: 607, message: "Logo không được để trống" },
    LOGO_URL_TOO_LONG: { code: 608, message: "URL logo không được vượt quá 255 ký tự" },
    BANNER_URL_TOO_LONG: { code: 609, message: "URL banner không được vượt quá 255 ký tự" },
    SHOP_NOT_FOUND: { code: 610, message: "Không tìm thấy shop" },
    SHOP_ID_REQUIRED: { code: 611, message: "Id shop bắt buộc nhập" },
    SHOP_INFO_ALREADY_EXISTS: { code: 612, message: "Thông tin cửa hàng đã tồn tại" },
    UPLOAD_SHOP_LOGO_FAILED: { code: 613, message: "Tải lên logo cửa hàng thất bại" },
    SHOP_CREATION_FAILED: { code: 614, message: "Tạo cửa hàng thất bại" },
    SHOP_UPDATE_FAILED: { code: 615, message: "Cập nhật cửa hàng thất bại" },
    SHOP_FETCH_LIST_FAILED: { code: 616, message: "Lấy danh sách cửa hàng thất bại" },
    SHOP_FETCH_DETAIL_FAILED: { code: 617, message: "Xem chi tiết cửa hàng thất bại" },
    SHOP_LEGAL_TAX_NOT_VERIFIED: { code: 618, message: "Thông tin định danh và thuế chưa được xác minh đầy đủ" },
    SHOP_VERIFY_FAILED: { code: 619, message: "Xác minh cửa hàng thất bại" },
    SHOP_SUSPEND_FAILED: { code: 620, message: "Tạm ngưng cửa hàng thất bại" },
    SHOP_CHANGE_VACATION_ONLY_ACTIVE: { code: 621, message: "Chỉ shop đang hoạt động mới có thể thay đổi chế độ nghỉ" },

    // Shop Legal (640-659)
    NATIONALITY_NOT_BLANK: { code: 640, message: "Quốc tịch không được để trống" },
    NATIONALITY_TOO_LONG: { code: 641, message: "Quốc tịch không được vượt quá 100 ký tự" },
    IDENTITY_TYPE_REQUIRED: { code: 642, message: "Loại giấy tờ không được để trống" },
    IDENTITY_NUMBER_NOT_BLANK: { code: 643, message: "Số giấy tờ không được để trống" },
    IDENTITY_NUMBER_TOO_LONG: { code: 644, message: "Số giấy tờ không được vượt quá 20 ký tự" },
    IDENTITY_NUMBER_ALPHANUMERIC_ONLY: { code: 645, message: "Số giấy tờ chỉ được chứa chữ và số" },
    FRONT_IMAGE_URL_NOT_BLANK: { code: 646, message: "URL ảnh mặt trước không được để trống" },
    FRONT_IMAGE_URL_TOO_LONG: { code: 647, message: "URL ảnh mặt trước không được vượt quá 255 ký tự" },
    BACK_IMAGE_URL_NOT_BLANK: { code: 648, message: "URL ảnh mặt sau không được để trống" },
    BACK_IMAGE_URL_TOO_LONG: { code: 649, message: "URL ảnh mặt sau không được vượt quá 255 ký tự" },
    FACE_IMAGE_URL_NOT_BLANK: { code: 650, message: "URL ảnh sinh trắc học khuôn mặt không được để trống" },
    FACE_IMAGE_URL_TOO_LONG: { code: 651, message: "URL ảnh sinh trắc học khuôn mặt không được vượt quá 255 ký tự" },

    // Shop Tax (680-699)
    BUSINESS_TYPE_NOT_NULL: { code: 680, message: "Loại hình kinh doanh không được để trống" },
    REGISTERED_ADDRESS_NOT_NULL: { code: 681, message: "Địa chỉ đăng ký không được để trống" },
    TAX_ID_NOT_BLANK: { code: 682, message: "Mã số thuế không được để trống" },
    TAX_ID_INVALID: { code: 683, message: "Mã số thuế phải có từ 10 đến 14 chữ số" },
    TAX_ID_DUPLICATE: { code: 684, message: "Mã số thuế đã tồn tại" },
    VACATION_STATUS_NOT_NULL: { code: 685, message: "Trạng thái nghỉ không được để trống" },
    SHOP_VERIFIED_STATUS_NOT_NULL: { code: 686, message: "Trạng thái xác minh không được để trống" },

    // Shop Bank (720-739)
    BANK_ACCOUNT_NUMBER_NOT_BLANK: { code: 720, message: "Số tài khoản ngân hàng không được để trống" },
    BANK_ACCOUNT_NUMBER_INVALID: { code: 721, message: "Số tài khoản ngân hàng phải có từ 4 đến 30 chữ số" },
    BANK_NAME_NOT_BLANK: { code: 722, message: "Tên ngân hàng không được để trống" },
    BANK_NAME_TOO_LONG: { code: 723, message: "Tên ngân hàng không được vượt quá 100 ký tự" },
    BANK_ACCOUNT_HOLDER_NOT_BLANK: { code: 724, message: "Tên chủ tài khoản không được để trống" },
    BANK_ACCOUNT_HOLDER_TOO_LONG: { code: 725, message: "Tên chủ tài khoản không được vượt quá 100 ký tự" },

    // Shop Address (760-779)
    SHOP_MAX_ADDRESS_EXCEEDED: { code: 760, message: "Một shop chỉ được có tối đa 5 địa chỉ" },
    SHOP_ADDRESS_CREATION_FAILED: { code: 761, message: "Lỗi khi tạo địa chỉ shop" },
    SHOP_ADDRESS_UPDATE_FAILED: { code: 762, message: "Lỗi khi cập nhật địa chỉ shop" },
    GET_SHOP_ADDRESS_LIST_FAILED: { code: 763, message: "Lỗi khi lấy danh sách địa chỉ shop" },
    GET_SHOP_ADDRESS_DETAIL_FAILED: { code: 764, message: "Lỗi khi lấy chi tiết địa chỉ shop" },
    SHOP_ADDRESS_NOT_FOUND: { code: 765, message: "Không tìm thấy địa chỉ shop" },
    SHOP_ADDRESS_NOT_BELONG_TO_SHOP: { code: 766, message: "Địa chỉ không thuộc về shop với id đã cho" },
    SHOP_MUST_HAVE_AT_LEAST_ONE_DEFAULT_ADDRESS: { code: 767, message: "Shop phải có ít nhất một địa chỉ mặc định" },
    ERROR_APPLY_DEFAULT_FLAG_FOR_SHOP: { code: 768, message: "Lỗi khi áp dụng cờ mặc định cho địa chỉ shop" },

    // Shop Legal Info (800-839)
    SHOP_LEGAL_CREATION_FAILED: { code: 800, message: "Tạo thông tin định danh cho shop thất bại" },
    SHOP_LEGAL_UPDATE_FAILED: { code: 801, message: "Cập nhật thông tin định danh cho shop thất bại" },
    SHOP_LEGAL_VERIFY_FAILED: { code: 802, message: "Xác minh thông tin định danh cho shop thất bại" },
    SHOP_LEGAL_NOT_FOUND: { code: 803, message: "Không tìm thấy thông tin định danh của shop" },
    GET_SHOP_LEGAL_DETAIL_FAILED: { code: 804, message: "Lấy chi tiết thông tin định danh của shop thất bại" },
    LEGAL_INFO_NOT_BELONG_TO_SHOP: { code: 805, message: "Thông tin định danh không thuộc về shop hiện tại" },
    SHOP_LEGAL_ALREADY_EXISTS: { code: 806, message: "Shop đã có thông tin định danh" },
    UPLOAD_LEGAL_IMAGES_FAILED: { code: 807, message: "Tải lên hình ảnh giấy tờ định danh thất bại" },
    LEGAL_INFO_UNDER_REVIEW_CANNOT_UPDATE: { code: 808, message: "Thông tin pháp lý đang được xem xét, không thể cập nhật" },
    LEGAL_INFO_UPDATE_INTERVAL_NOT_REACHED: { code: 809, message: "Thông tin định danh chỉ có thể được cập nhật sau mỗi 30 ngày kể từ lần cập nhật gần nhất" },

    // Shop Tax Info (840-859)
    SHOP_TAX_ALREADY_EXISTS: { code: 840, message: "Shop đã có thông tin thuế" },
    SHOP_TAX_CREATION_FAILED: { code: 841, message: "Lỗi khi tạo thông tin thuế cho shop" },
    SHOP_TAX_UPDATE_FAILED: { code: 842, message: "Lỗi khi cập nhật thông tin thuế cho shop" },
    SHOP_TAX_FETCH_DETAIL_FAILED: { code: 843, message: "Lỗi khi lấy chi tiết thông tin thuế của shop" },
    SHOP_TAX_VERIFY_FAILED: { code: 844, message: "Lỗi khi xác minh thông tin thuế của shop" },
    TAX_INFO_UNDER_REVIEW_CANNOT_UPDATE: { code: 845, message: "Thông tin thuế đang được xem xét, không thể cập nhật" },
    TAX_INFO_UPDATE_INTERVAL_NOT_REACHED: { code: 846, message: "Thông tin thuế chỉ có thể được cập nhật sau mỗi 30 ngày kể từ lần cập nhật gần nhất" },
    TAX_INFO_NOT_BELONG_TO_SHOP: { code: 847, message: "Thông tin thuế không thuộc về shop hiện tại" },
    SHOP_TAX_NOT_FOUND: { code: 848, message: "Không tìm thấy thông tin thuế của shop" },

    // ===== USER (1000-1099) =====
    PASSWORD_FAILED: { code: 1000, message: "Không tìm thấy người dùng" },
    USER_NOT_FOUND: { code: 1001, message: "Không tìm thấy người dùng" },
    DUPLICATE_USER: { code: 1002, message: "Người dùng đã tồn tại" },
    INVALID_CREDENTIALS: { code: 1003, message: "Thông tin đăng nhập không hợp lệ" },
    ACCESS_DENIED: { code: 1004, message: "Truy cập bị từ chối" },
    UNAUTHORIZED: { code: 1005, message: "Không có quyền truy cập" },
    INSUFFICIENT_PERMISSIONS: { code: 1006, message: "Người dùng không có đủ quyền" },
    USER_ACCOUNT_LOCKED: { code: 1007, message: "Tài khoản người dùng đã bị khóa" },
    USER_ACCOUNT_DISABLED: { code: 1008, message: "Tài khoản người dùng đã bị vô hiệu hóa" },
    PASSWORD_EXPIRED: { code: 1009, message: "Mật khẩu đã hết hạn" },
    USER_DEACTIVATED: { code: 1010, message: "Tài khoản người dùng đã bị vô hiệu hóa" },
    USER_LOCKED: { code: 1011, message: "Tài khoản người dùng đã bị khóa" },
    USER_ALREADY_DELETED: { code: 1012, message: "Tài khoản người dùng đã bị xóa" },
    USER_PENDING: { code: 1013, message: "Tài khoản người dùng đang chờ xác minh" },
    UNAUTHORIZED_ACCESS: { code: 1014, message: "Không có quyền truy cập" },
    USER_ALREADY_EXISTS: { code: 1015, message: "Người dùng đã tồn tại" },
    USER_HAS_OVERDUE_LOAN: { code: 1016, message: "Người dùng có khoản vay quá hạn chưa trả" },
    CANNOT_LOCK_SELF: { code: 1017, message: "Không thể tự khóa tài khoản của chính mình" },
    USER_ALREADY_LOCKED: { code: 1018, message: "Tài khoản đã bị khóa trước đó rồi" },
    CANNOT_DELETE_SELF: { code: 1019, message: "Không thể tự xóa tài khoản của chính mình" },
    CANNOT_UPDATE_SELF: { code: 1020, message: "Không thể tự cập nhật tài khoản của chính mình" },
    ROLE_PERMISSION_OUT_OF_SCOPE: { code: 1021, message: "Bạn chỉ có thể cấp quyền trong phạm vi quyền bạn có!" },

    // ===== AUTHENTICATION (2000-2099) =====
    TOKEN_EXPIRED: { code: 2001, message: "Token đã hết hạn" },
    TOKEN_INVALID: { code: 2002, message: "Token không hợp lệ" },
    TOKEN_MISSING: { code: 2003, message: "Thiếu token" },
    RATE_LIMIT_EXCEEDED: { code: 2004, message: "Đã vượt quá giới hạn yêu cầu" },
    SESSION_EXPIRED: { code: 2005, message: "Phiên làm việc đã hết hạn" },
    TOKEN_GENERATION_FAILED: { code: 2006, message: "Tạo token thất bại" },
    TOKEN_REVOKED: { code: 2007, message: "Refresh token đã bị thu hồi" },
    TOKEN_ALREADY_EXISTS: { code: 2008, message: "Token đã tồn tại" },
    TOKEN_REQUIRED: { code: 2009, message: "Token là bắt buộc" },
    TOKEN_TOO_LONG: { code: 2010, message: "Token không được vượt quá 255 ký tự" },

    // ===== REFRESH TOKEN (2300-2399) =====
    REFRESH_TOKEN_REQUIRED: { code: 2300, message: "Refresh Token không được để trống" },
    REFRESH_TOKEN_ALREADY_EXISTS: { code: 2301, message: "Refresh token đã tồn tại" },
    REFRESH_TOKEN_CREATION_FAILED: { code: 2302, message: "Lỗi khi tạo refresh token" },
    REFRESH_TOKEN_RETRIEVAL_FAILED: { code: 2303, message: "Lỗi khi lấy refresh token" },
    REFRESH_TOKEN_VERIFICATION_FAILED: { code: 2304, message: "Lỗi khi xác minh refresh token" },
    REFRESH_TOKEN_REVOKE_FAILED: { code: 2305, message: "Lỗi khi thu hồi refresh token" },
    REFRESH_TOKEN_DELETION_FAILED: { code: 2306, message: "Lỗi khi xóa refresh token" },

    // ===== EMAIL (2400-2499) =====
    EMAIL_REQUIRED: { code: 2400, message: "Email là bắt buộc" },
    EMAIL_INVALID: { code: 2401, message: "Địa chỉ email không hợp lệ" },
    EMAIL_TOO_LONG: { code: 2402, message: "Địa chỉ email không được vượt quá 100 ký tự" },

    // ===== OTP (2500-2599) =====
    OTP_EXPIRED: { code: 2500, message: "Mã OTP đã hết hạn" },
    OTP_ALREADY_USED: { code: 2501, message: "Mã OTP đã được sử dụng" },
    TOO_MANY_REQUESTS: { code: 2502, message: "Vui lòng đợi trước khi gửi lại OTP." },
    UNSUPPORTED_OTP_TYPE: { code: 2503, message: "Loại OTP không được hỗ trợ" },
    OTP_INVALID: { code: 2504, message: "Mã OTP không hợp lệ" },
    OTP_USED: { code: 2505, message: "Mã OTP đã được sử dụng" },
    OTP_CODE_REQUIRED: { code: 2506, message: "Mã OTP không được để trống" },
    OTP_CODE_INVALID_LENGTH: { code: 2507, message: "Mã OTP phải gồm đúng 6 ký tự" },
    OTP_TYPE_REQUIRED: { code: 2508, message: "Loại OTP không được để trống" },
    OTP_CREATION_FAILED: { code: 2509, message: "Lỗi khi tạo OTP mới" },
    OTP_RESEND_FAILED: { code: 2510, message: "Lỗi khi gửi lại OTP" },
    OTP_NOT_FOUND_FOR_EMAIL: { code: 2511, message: "Không tìm thấy mã OTP cho email này" },
    OTP_CODE_MISMATCH: { code: 2512, message: "Mã OTP không khớp, vui lòng nhập lại mã mới nhất đã được gửi tới email của bạn" },
    OTP_CODE_ALREADY_USED: { code: 2513, message: "Mã OTP này đã được sử dụng, vui lòng yêu cầu mã mới" },
    OTP_CODE_EXPIRED: { code: 2514, message: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới" },
    OTP_VERIFICATION_FAILED: { code: 2515, message: "Lỗi khi xác minh OTP" },

    // ===== ROLE (2600-2699) =====
    ROLE_NAME_REQUIRED: { code: 2600, message: "Tên vai trò là bắt buộc" },
    ROLE_NAME_TOO_LONG: { code: 2601, message: "Tên vai trò không được vượt quá 30 ký tự" },
    ROLE_DESCRIPTION_TOO_LONG: { code: 2602, message: "Mô tả vai trò không được vượt quá 500 ký tự" },
    ROLE_NAME_ALREADY_EXISTS: { code: 2603, message: "Tên vai trò đã tồn tại trong hệ thống" },
    ROLE_CREATION_FAILED: { code: 2604, message: "Lỗi khi tạo vai trò" },
    ROLE_ID_NOT_FOUND: { code: 2605, message: "Mã vai trò không tồn tại trong hệ thống" },
    ROLE_DELETION_FAILED: { code: 2606, message: "Lỗi khi xóa vai trò" },
    ROLE_UPDATE_FAILED: { code: 2607, message: "Lỗi khi cập nhật vai trò" },
    GET_ROLE_LIST_FAILED: { code: 2608, message: "Lấy danh sách vai trò thất bại" },
    GET_ROLE_DETAIL_FAILED: { code: 2609, message: "Xem chi tiết vai trò thất bại" },
    EMPLOYEE_ROLE_REQUIRED: { code: 2610, message: "Role của nhân viên không được để trống" },
    ADMIN_ROLE_NOT_FOUND: { code: 2611, message: "Role ADMIN chưa tồn tại" },
    ROLE_NOT_FOUND: { code: 2612, message: "Role chưa tồn tại" },

    // ===== PERMISSION (2700-2799) =====
    PERMISSION_NAME_REQUIRED: { code: 2700, message: "Tên quyền hạn là bắt buộc" },
    PERMISSION_NAME_TOO_LONG: { code: 2701, message: "Tên quyền hạn từ 5 ký từ và không được vượt quá 30 ký tự" },
    PERMISSION_DESCRIPTION_TOO_LONG: { code: 2702, message: "Mô tả quyền hạn không được vượt quá 500 ký tự" },
    PERMISSION_NAME_ALREADY_EXISTS: { code: 2703, message: "Tên quyền hạn đã tồn tại trong hệ thống" },
    PERMISSION_CREATION_FAILED: { code: 2704, message: "Lỗi khi tạo quyền hạn" },
    PERMISSION_ID_NOT_FOUND: { code: 2705, message: "Mã quyền hạn không tồn tại trong hệ thống" },
    PERMISSION_DELETION_FAILED: { code: 2706, message: "Lỗi khi xóa quyền hạn" },
    PERMISSION_UPDATE_FAILED: { code: 2707, message: "Lỗi khi cập nhật quyền hạn" },
    GET_PERMISSION_LIST_FAILED: { code: 2708, message: "Lấy danh sách quyền hạn thất bại" },
    GET_PERMISSION_DETAIL_FAILED: { code: 2709, message: "Xem chi tiết quyền hạn thất bại" },
    PERMISSIONS_LIST_EMPTY: { code: 2710, message: "Danh sách quyền hạn không được để trống" },
    PERMISSION_EXCEEDS_PARENT: { code: 2711, message: "Gán quyền vượt quá quyền cha" },

    // ===== ADDRESS (2800-2899) =====
    DETAIL_ADDRESS_NOT_BLANK: { code: 2800, message: "Địa chỉ chi tiết không được để trống" },
    DETAIL_ADDRESS_TOO_LONG: { code: 2801, message: "Địa chỉ chi tiết không được vượt quá 255 ký tự" },
    ADDRESS_TOO_LONG: { code: 2802, message: "Địa chỉ không được vượt quá 500 ký tự" },
    DISTRICT_NOT_BLANK: { code: 2803, message: "Quận / Huyện không được để trống" },
    PROVINCE_NOT_BLANK: { code: 2804, message: "Tỉnh / Thành phố không được để trống" },
    COUNTRY_NOT_BLANK: { code: 2805, message: "Quốc gia không được để trống" },
    WARD_NOT_BLANK: { code: 2806, message: "Phường / Xã không được để trống" },
    ADDRESS_NOT_BLANK: { code: 2807, message: "Địa chỉ không được để trống" },

    // ===== REQUEST AND INPUT (3000-3099) =====
    INVALID_REQUEST: { code: 3001, message: "Dữ liệu yêu cầu không hợp lệ" },
    MISSING_REQUIRED_FIELDS: { code: 3002, message: "Thiếu các trường bắt buộc" },
    DATA_FORMAT_ERROR: { code: 3003, message: "Định dạng dữ liệu không hợp lệ" },
    UNSUPPORTED_MEDIA_TYPE: { code: 3004, message: "Loại phương tiện không được hỗ trợ" },
    RESOURCE_CONFLICT: { code: 3005, message: "Xung đột tài nguyên" },
    RESOURCE_NOT_FOUND: { code: 3006, message: "Không tìm thấy tài nguyên" },

    // ===== DOCUMENT AND FILE (4000-4099) =====
    INVALID_LOCATION_TYPE: { code: 4000, message: "Loại vị trí không hợp lệ" },
    DOCUMENT_NOT_FOUND: { code: 4001, message: "Không tìm thấy tài liệu" },
    DUPLICATE_DOCUMENT: { code: 4002, message: "Tài liệu đã tồn tại" },
    FILE_UPLOAD_FAILED: { code: 4003, message: "Tải lên tệp thất bại" },
    FILE_NOT_FOUND: { code: 4004, message: "Không tìm thấy tệp" },
    FILE_TOO_LARGE: { code: 4005, message: "Tệp quá lớn" },
    FILE_FORMAT_UNSUPPORTED: { code: 4006, message: "Định dạng tệp không được hỗ trợ" },
    DOCUMENT_TYPE_NOT_FOUND: { code: 4007, message: "Không tìm thấy loại tài liệu" },
    DOCUMENT_ALREADY_FAVORITE: { code: 4008, message: "Tài liệu đã được đánh dấu yêu thích" },
    COURSE_NOT_FOUND: { code: 4009, message: "Không tìm thấy khóa học" },

    // ===== DATABASE (5000-5099) =====
    DATA_UNIQUE: { code: 5000, message: "Dữ liệu phải là duy nhất" },
    DATABASE_ERROR: { code: 5001, message: "Lỗi cơ sở dữ liệu" },
    DATA_INTEGRITY_VIOLATION: { code: 5002, message: "Vi phạm tính toàn vẹn dữ liệu" },
    TRANSACTION_FAILED: { code: 5003, message: "Giao dịch cơ sở dữ liệu thất bại" },
    TRANSACTION_NOT_FOUND: { code: 5004, message: "Không tìm thấy giao dịch mượn" },
    FINE_NOT_FOUND: { code: 5005, message: "Không tìm thấy tiền phạt" },
    POLICY_NOT_FOUND: { code: 5006, message: "Không tìm thấy chính sách mượn" },

    // ===== SYSTEM (6000-6099) =====
    SERVER_ERROR: { code: 6001, message: "Lỗi máy chủ nội bộ" },
    SERVICE_UNAVAILABLE: { code: 6002, message: "Dịch vụ tạm thời không khả dụng" },
    GATEWAY_TIMEOUT: { code: 6003, message: "Hết thời gian chờ cổng" },
    CONFIGURATION_ERROR: { code: 6004, message: "Lỗi cấu hình hệ thống" },
    UNKNOWN_ERROR: { code: 6005, message: "Đã xảy ra lỗi không xác định" },
    FORBIDDEN: { code: 6006, message: "Truy cập bị cấm" },

    // ===== NOTIFICATION (7000-7099) =====
    NOTIFICATION_NOT_FOUND: { code: 7001, message: "Không tìm thấy thông báo" },
    NOTIFICATION_SENDING_ERROR: { code: 7002, message: "Lỗi gửi thông báo" },
    NOTIFICATION_INVALID_STATUS: { code: 7003, message: "Thông báo có trạng thái không hợp lệ" },

    // ===== REVIEW (8000-8099) =====
    REVIEW_ALREADY_EXISTS: { code: 8001, message: "Đánh giá đã tồn tại" },
    REVIEW_NOT_FOUND: { code: 8002, message: "Không tìm thấy đánh giá" },
    USER_HAS_NOT_BORROWED_DOCUMENT: { code: 8003, message: "Người dùng chưa mượn tài liệu này" },

    // ===== PRODUCT (9000-9099) =====
    PRODUCT_NOT_FOUND: { code: 9001, message: "Không tìm thấy sản phẩm" },
    MEDIA_NOT_FOUND: { code: 9002, message: "Không tìm thấy media" },
    PRODUCT_ALREADY_EXISTS: { code: 9003, message: "Sản phẩm đã tồn tại" },
    PRODUCT_SKU_DUPLICATE: { code: 9004, message: "Mã SKU đã tồn tại" },
    PRODUCT_SLUG_DUPLICATE: { code: 9005, message: "Slug sản phẩm đã tồn tại" },
    PRODUCT_INACTIVE: { code: 9006, message: "Sản phẩm không hoạt động" },
    PRODUCT_OUT_OF_STOCK: { code: 9007, message: "Sản phẩm hết hàng" },
    PRODUCT_INSUFFICIENT_STOCK: { code: 9008, message: "Không đủ hàng trong kho" },
    PRODUCT_MEDIA_CREATION_FAILED: { code: 9009, message: "Tạo media sản phẩm thất bại" },

    // ===== CATEGORY (9100-9199) =====
    CATEGORY_NOT_FOUND: { code: 9101, message: "Không tìm thấy danh mục" },
    CATEGORY_ALREADY_EXISTS: { code: 9102, message: "Danh mục đã tồn tại" },
    CATEGORY_NAME_DUPLICATE: { code: 9103, message: "Tên danh mục đã tồn tại" },
    CATEGORY_SLUG_DUPLICATE: { code: 9104, message: "Slug danh mục đã tồn tại" },
    CATEGORY_NOT_ACTIVE: { code: 9105, message: "Danh mục không hoạt động" },
    CATEGORY_NOT_LEAF: { code: 9106, message: "Chỉ có thể tạo sản phẩm trong danh mục lá" },
    CATEGORY_HAS_CHILDREN: { code: 9107, message: "Không thể xóa danh mục có danh mục con" },
    CATEGORY_HAS_PRODUCTS: { code: 9108, message: "Không thể xóa danh mục có sản phẩm" },

    // ===== PRODUCT VARIANT (9200-9299) =====
    VARIANT_NOT_FOUND: { code: 9201, message: "Không tìm thấy biến thể sản phẩm" },
    VARIANT_ALREADY_EXISTS: { code: 9202, message: "Biến thể sản phẩm đã tồn tại" },
    VARIANT_SKU_DUPLICATE: { code: 9203, message: "Mã SKU biến thể đã tồn tại" },
    PRODUCT_VARIANT_CREATION_FAILED: { code: 9204, message: "Tạo biến thể sản phẩm thất bại" },

    // ===== PRODUCT OPTION (9300-9399) =====
    OPTION_NOT_FOUND: { code: 9301, message: "Không tìm thấy tùy chọn sản phẩm" },
    OPTION_VALUE_NOT_FOUND: { code: 9302, message: "Không tìm thấy giá trị tùy chọn" },
    OPTION_ALREADY_EXISTS: { code: 9303, message: "Tùy chọn sản phẩm đã tồn tại" },
    PRODUCT_OPTION_CREATION_FAILED: { code: 9304, message: "Tạo tùy chọn sản phẩm thất bại" },

    // ===== INVENTORY (9400-9499) =====
    INVENTORY_NOT_FOUND: { code: 9401, message: "Không tìm thấy thông tin tồn kho" },
    INVENTORY_INSUFFICIENT: { code: 9402, message: "Không đủ hàng trong kho" },
    INVENTORY_NEGATIVE_STOCK: { code: 9403, message: "Số lượng tồn kho không thể âm" },

    // ===== FILE SYSTEM (10000-10099) =====
    CLOUDINARY_UPLOAD_FAILED: { code: 10000, message: "Tải lên Cloudinary thất bại" },
    UNSUPPORTED_FILE: { code: 10001, message: "Tệp không được hỗ trợ" },
    FILE_PROCESSING_ERROR: { code: 10002, message: "Lỗi xử lý tệp" },
    INVALID_STATUS: { code: 10003, message: "Trạng thái không hợp lệ" },
    INTERNAL_SERVER_ERROR: { code: 10004, message: "Lỗi máy chủ nội bộ" },
    LICENSE_NOT_FOUND: { code: 10005, message: "Không tìm thấy giấy phép" },
    LICENSE_EXPIRED: { code: 10006, message: "Giấy phép đã hết hạn" },
    DECRYPTION_ERROR: { code: 10007, message: "Lỗi giải mã" },
    INVALID_CONTENT_KEY: { code: 10008, message: "Khóa nội dung không hợp lệ" },
    SESSION_CREATION_ERROR: { code: 10009, message: "Lỗi tạo phiên" },
    DEVICE_LIMIT_EXCEEDED: { code: 10010, message: "Vượt quá số thiết bị được phép" },
    INVALID_INPUT: { code: 10011, message: "Dữ liệu đầu vào không hợp lệ" },

    // ===== CART & ORDER (11100-11199) =====
    PRODUCT_OPTION_NOT_FOUND: { code: 11111, message: "Không tìm thấy tùy chọn sản phẩm" },
    CART_NOT_FOUND: { code: 11112, message: "Không tìm thấy giỏ hàng" },
    CART_ITEM_NOT_FOUND: { code: 11113, message: "Không tìm thấy sản phẩm trong giỏ hàng" },
    ORDER_NOT_FOUND: { code: 11114, message: "Không tìm thấy đơn hàng" },

    // ===== IDEMPOTENCY (12000-12099) =====
    IDEMPOTENCY_KEY_REQUIRED: { code: 12001, message: "Idempotency-Key header is required" },
    IDEMPOTENCY_KEY_IN_USE: { code: 12002, message: "Request đang được xử lý, vui lòng đợi" },
    IDEMPOTENCY_KEY_INVALID: { code: 12003, message: "Idempotency key không hợp lệ" },
    IDEMPOTENCY_KEY_EXPIRED: { code: 12004, message: "Idempotency key đã hết hạn" },

    // ===== ETAG (13000-13099) =====
    ETAG_MISMATCH: { code: 13001, message: "ETag mismatch. Resource has been modified" },

    // ===== VOUCHER (14000-14999) =====
    // Validation
    VOUCHER_CODE_NOT_EMPTY: { code: 14001, message: "Mã voucher không được để trống" },
    VOUCHER_VOUCHER_TYPE_NOT_EMPTY: { code: 14002, message: "Loại voucher không được để trống" },
    VOUCHER_DISCOUNT_METHOD_NOT_EMPTY: { code: 14003, message: "Phương thức giảm giá không được để trống" },
    VOUCHER_DISCOUNT_TARGET_NOT_EMPTY: { code: 14004, message: "Mục tiêu giảm giá không được để trống" },
    VOUCHER_DISCOUNT_VALUE_NOT_EMPTY: { code: 14005, message: "Giá trị giảm giá không được để trống" },
    VOUCHER_MIN_ORDER_VALUE_NOT_EMPTY: { code: 14006, message: "Giá trị tối thiểu đơn hàng không được để trống" },
    VOUCHER_MAX_DISCOUNT_NOT_EMPTY: { code: 14007, message: "Giá trị giảm giá tối đa không được để trống" },
    VOUCHER_START_DATE_NOT_EMPTY: { code: 14008, message: "Ngày bắt đầu không được để trống" },
    VOUCHER_END_DATE_NOT_EMPTY: { code: 14009, message: "Ngày kết thúc không được để trống" },
    VOUCHER_USAGE_LIMIT_NOT_EMPTY: { code: 14010, message: "Số lần sử dụng không được để trống" },
    VOUCHER_CODE_VALID: { code: 14011, message: "Mã voucher phải có 6 ký tự trở lên" },

    // Price validation
    VOUCHER_DISCOUNT_VALUE_POSITIVE: { code: 14012, message: "Giá trị giảm giá phải lớn hơn 0" },
    VOUCHER_MIN_ORDER_VALUE_POSITIVE: { code: 14013, message: "Giá trị tối thiểu đơn hàng phải lớn hơn 0" },
    VOUCHER_MAX_DISCOUNT_POSITIVE: { code: 14014, message: "Giá trị giảm giá tối đa phải lớn hơn 0" },
    VOUCHER_USAGE_LIMIT_POSITIVE: { code: 14015, message: "Số lần sử dụng phải lớn hơn 0" },
    VOUCHER_START_DATE_NOT_IN_FUTURE: { code: 14016, message: "Ngày bắt đầu phải là ngày trong tương lai" },
    VOUCHER_END_DATE_NOT_IN_FUTURE: { code: 14017, message: "Ngày kết thúc phải là ngày trong tương lai" },
    VOUCHER_END_DATE_NOT_AFTER_START_DATE: { code: 14018, message: "Ngày kết thúc phải là sau ngày bắt đầu" },

    // Exceptions
    VOUCHER_CODE_DUPLICATE: { code: 14019, message: "Mã voucher đã tồn tại" },
    VOUCHER_CREATE_FAIL: { code: 14901, message: "Tạo voucher thất bại" },
    VOUCHER_UPDATE_FAIL: { code: 14902, message: "Cập nhật voucher thất bại" },
    VOUCHER_DELETE_FAIL: { code: 14903, message: "Xóa voucher thất bại" },
    VOUCHER_USED_UP: { code: 14904, message: "Voucher đã hết số lượng" },
    VOUCHER_EXPIRED: { code: 14905, message: "Voucher đã hết hạn" },
    VOUCHER_INACTIVE: { code: 14906, message: "Voucher đã bị vô hiệu hóa" },
    VOUCHER_ARCHIVED: { code: 14907, message: "Voucher đã bị lưu trữ" },
    VOUCHER_SCHEDULED: { code: 14908, message: "Voucher đang được chuẩn bị ra mắt" },
    VOUCHER_ACTIVE: { code: 14909, message: "Voucher đang hoạt động" },
    VOUCHER_ACTIVATE_FAIL: { code: 14910, message: "Kích hoạt voucher thất bại" },
    VOUCHER_NOT_ACTIVE: { code: 14911, message: "Voucher không đang hoạt động" },
    VOUCHER_DEACTIVATE_FAIL: { code: 14912, message: "Hủy kích hoạt voucher thất bại" },
    VOUCHER_SCHEDULED_TIME_INVALID: { code: 14913, message: "Thời gian lên lịch không hợp lệ" },
    VOUCHER_NOT_DRAFT: { code: 14914, message: "Voucher không ở trạng thái DRAFT" },
    VOUCHER_SCHEDULE_FAIL: { code: 14915, message: "Lên lịch voucher thất bại" },
    VOUCHER_ALREADY_ARCHIVED: { code: 14916, message: "Voucher đã bị lưu trữ" },
    VOUCHER_ACTIVE_CANNOT_ARCHIVE: { code: 14917, message: "Voucher đang hoạt động không thể lưu trữ" },
    VOUCHER_ARCHIVE_FAIL: { code: 14918, message: "Lưu trữ voucher thất bại" },
    VOUCHER_NOT_ARCHIVED: { code: 14919, message: "Voucher không bị lưu trữ" },
    VOUCHER_CANNOT_ACTIVATE: { code: 14920, message: "Voucher không thể kích hoạt" },
    VOUCHER_NOT_FOUND: { code: 14921, message: "Voucher không tồn tại" },
    VOUCHER_NOT_FOUND_BY_CODE: { code: 14922, message: "Voucher không tồn tại với mã này" },
    VOUCHER_NOT_FOUND_BY_ID: { code: 14923, message: "Voucher không tồn tại với id này" },
    VOUCHER_NOT_FOUND_BY_SHOP_ID: { code: 14924, message: "Voucher không tồn tại với shop này" },
    VOUCHER_NOT_FOUND_BY_PRODUCT_ID: { code: 14925, message: "Voucher không tồn tại với sản phẩm này" },
    VOUCHER_NOT_FOUND_BY_CUSTOMER_ID: { code: 14926, message: "Voucher không tồn tại với khách hàng này" },
    VOUCHER_NOT_FOUND_BY_SHOP_ID_AND_PRODUCT_ID: { code: 14927, message: "Voucher không tồn tại với shop và sản phẩm này" },
    VOUCHER_OBJECT_NOT_EMPTY: { code: 14928, message: "Voucher object không được để trống" },
    VOUCHER_OBJECT_TYPE_NOT_EMPTY: { code: 14929, message: "Voucher object type không được để trống" },
    VOUCHER_IS_PLATFORM_CAN_NOT_UPDATE_OBJECT: { code: 14930, message: "Voucher là toàn sàn nên không thể cập nhật object" },

    // ===== EMPLOYEE - DEPARTMENT (15000-15099) =====
    DEPARTMENT_CREATION_FAILED: { code: 15000, message: "Lỗi không thể tạo phòng ban" },
    DEPARTMENT_UPDATE_FAILED: { code: 15001, message: "Lỗi không thể cập nhật phòng ban" },
    DEPARTMENT_NOT_FOUND: { code: 15002, message: "Lỗi không tìm thấy phòng ban" },
    DEPARTMENT_FETCH_FAILED: { code: 15003, message: "Lỗi khi lấy danh sách phòng ban" },
    DEPARTMENT_DETAIL_FETCH_FAILED: { code: 15004, message: "Lỗi khi lấy chi tiết phòng ban" },
    DEPARTMENT_NAME_NOT_BLANK: { code: 15005, message: "Tên phòng ban không được để trống" },
    DEPARTMENT_NAME_TOO_LONG: { code: 15006, message: "Tên phòng ban không được vượt quá 200 ký tự" },
    DEPARTMENT_DESCRIPTION_TOO_LONG: { code: 15007, message: "Mô tả phòng ban không được vượt quá 500 ký tự" },
    DEPARTMENT_NAME_ALREADY_EXISTS: { code: 15008, message: "Tên phòng ban đã tồn tại trong hệ thống" },

    // ===== EMPLOYEE - POSITION (15100-15199) =====
    POSITION_CREATION_FAILED: { code: 15100, message: "Không thể tạo chức vụ" },
    POSITION_UPDATE_FAILED: { code: 15101, message: "Không thể cập nhật chức vụ" },
    POSITION_NOT_FOUND: { code: 15102, message: "Không tìm thấy chức vụ" },
    POSITIONS_FETCH_FAILED: { code: 15103, message: "Lỗi khi lấy danh sách chức vụ" },
    POSITION_REMOVE_FAILED: { code: 15104, message: "Không thể xóa chức vụ" },
    POSITION_NOT_BLANK: { code: 15105, message: "Chức vụ không được để trống" },
    POSITION_NAME_NOT_BLANK: { code: 15106, message: "Tên chức vụ không được để trống" },
    POSITION_NAME_TOO_LONG: { code: 15107, message: "Tên chức vụ không được vượt quá 150 ký tự" },
    POSITION_LEVEL_NOT_NULL: { code: 15108, message: "Cấp bậc chức vụ không được để trống" },
    POSITION_LEVEL_MIN: { code: 15109, message: "Cấp bậc chức vụ phải tối thiểu là 1" },
    POSITION_LEVEL_MAX: { code: 15110, message: "Cấp bậc chức vụ không được vượt quá 10" },
    POSITION_DEFAULT_ROLE_NOT_BLANK: { code: 15111, message: "Vai trò mặc định không được để trống" },
    POSITION_DESCRIPTION_TOO_LONG: { code: 15112, message: "Mô tả chức vụ không được vượt quá 500 ký tự" },
    POSITION_NOT_BELONG_TO_DEPARTMENT: { code: 15113, message: "Vị trí không thuộc về phòng ban này" },
    POSITION_NAME_ALREADY_EXISTS_IN_DEPARTMENT: { code: 15114, message: "Tên chức vụ đã tồn tại trong phòng ban này" },
    GET_POSITION_LIST_IN_DEPARTMENT_FAILED: { code: 15115, message: "Lỗi khi lấy danh sách chức vụ trong phòng ban" },
    ADD_POSITION_TO_DEPARTMENT_FAILED: { code: 15116, message: "Lỗi khi thêm chức vụ vào phòng ban" },
    REMOVE_POSITION_FROM_DEPARTMENT_FAILED: { code: 15117, message: "Lỗi hệ thống khi xóa chức vụ khỏi phòng ban" },
    ADD_LIST_POSITION_TO_DEPARTMENT_FAILED: { code: 15118, message: "Lỗi khi thêm danh sách chức vụ vào phòng ban" },

    // ===== EMPLOYEE - GENERAL (15200-15299) =====
    INVALID_DEPARTMENT_ID: { code: 15200, message: "Mã phòng ban không hợp lệ hoặc không tồn tại" },
    INVALID_POSITION_NAME: { code: 15201, message: "Tên chức vụ không hợp lệ hoặc trùng lặp" },
    DEPARTMENT_ALREADY_EXISTS: { code: 15202, message: "Phòng ban đã tồn tại" },
    POSITION_ALREADY_EXISTS: { code: 15203, message: "Chức vụ đã tồn tại trong phòng ban này" },

    // ===== EMPLOYEE - WORK TYPE (15300-15399) =====
    WORK_TYPE_NOT_NULL: { code: 15300, message: "Loại hình làm việc không được để trống" },
    START_DATE_NOT_NULL: { code: 15301, message: "Ngày bắt đầu làm việc không được để trống" },
    EMPLOYEE_STATUS_NOT_NULL: { code: 15302, message: "Trạng thái làm việc không được để trống" },

    // ===== EMPLOYEE - PAYROLL (15400-15499) =====
    PAY_MONTH_NOT_BLANK: { code: 15400, message: "Tháng trả lương không được để trống" },
    PAY_MONTH_INVALID_FORMAT: { code: 15401, message: "Tháng trả lương phải có định dạng YYYY-MM (ví dụ: 2025-10)" },
    BASE_SALARY_NOT_NULL: { code: 15402, message: "Lương cơ bản không được để trống" },
    BASE_SALARY_POSITIVE: { code: 15403, message: "Lương cơ bản phải lớn hơn 0" },
    BONUS_NON_NEGATIVE: { code: 15404, message: "Tiền thưởng không được âm" },
    DEDUCTION_NON_NEGATIVE: { code: 15405, message: "Khoản khấu trừ không được âm" },
    ATTACHMENT_URL_TOO_LONG: { code: 15406, message: "URL tệp đính kèm không được vượt quá 255 ký tự" },
    PAID_DATE_NOT_NULL: { code: 15407, message: "Ngày thanh toán không được để trống" },
    BASE_SALARY_DECIMAL_LIMIT: { code: 15408, message: "Lương cơ bản chỉ được có tối đa 2 chữ số thập phân" },
    BONUS_DECIMAL_LIMIT: { code: 15409, message: "Tiền thưởng chỉ được có tối đa 2 chữ số thập phân" },
    DEDUCTION_DECIMAL_LIMIT: { code: 15410, message: "Khoản khấu trừ chỉ được có tối đa 2 chữ số thập phân" },
    TOTAL_DECIMAL_LIMIT: { code: 15411, message: "Tổng tiền chỉ được có tối đa 2 chữ số thập phân" },
    OLD_SALARY_NOT_NULL: { code: 15412, message: "Mức lương cũ không được để trống" },
    OLD_SALARY_POSITIVE: { code: 15413, message: "Mức lương cũ phải lớn hơn 0" },
    OLD_SALARY_DECIMAL_LIMIT: { code: 15414, message: "Mức lương cũ chỉ được có tối đa 2 chữ số thập phân" },
    NEW_SALARY_NOT_NULL: { code: 15415, message: "Mức lương mới không được để trống" },
    NEW_SALARY_POSITIVE: { code: 15416, message: "Mức lương mới phải lớn hơn 0" },
    NEW_SALARY_DECIMAL_LIMIT: { code: 15417, message: "Mức lương mới chỉ được có tối đa 2 chữ số thập phân" },
    EFFECTIVE_DATE_NOT_NULL: { code: 15418, message: "Ngày áp dụng lương mới không được để trống" },
    EFFECTIVE_DATE_NOT_FUTURE: { code: 15419, message: "Ngày áp dụng lương mới không được là ngày trong tương lai" },
    REASON_TOO_LONG: { code: 15420, message: "Lý do thay đổi lương không được vượt quá 255 ký tự" },
    PAYROLL_ALREADY_EXISTS_FOR_EMPLOYEE: { code: 15421, message: "Bảng lương của tháng này đã tồn tại cho nhân viên" },
    PAYROLL_CREATION_FAILED: { code: 15422, message: "Lỗi khi tạo bảng lương" },
    PAYROLL_UPDATE_FAILED: { code: 15423, message: "Lỗi khi cập nhật bảng lương" },
    PAYROLL_FETCH_LIST_FAILED: { code: 15424, message: "Lỗi khi lấy danh sách bảng lương" },
    PAYROLL_NOT_FOUND_FOR_EMPLOYEE: { code: 15425, message: "Không tìm thấy bảng lương với nhân viên" },
    PAYROLL_FETCH_LIST_BY_EMPLOYEE_FAILED: { code: 15426, message: "Lỗi khi lấy danh sách bảng lương theo nhân viên" },
    PAYROLL_MARK_AS_PAID_FAILED: { code: 15427, message: "Lỗi khi đánh dấu trả lương" },
    PAYROLL_DELETE_FAILED: { code: 15428, message: "Lỗi khi xóa bảng lương" },

    // ===== EMPLOYEE - MANAGEMENT (15500-15599) =====
    EMPLOYEE_LEVEL_INVALID: { code: 15500, message: "Không thể tạo nhân viên có cấp bậc bằng hoặc cao hơn cấp bậc hiện tại" },
    DEPARTMENT_HEAD_CREATE_EMPLOYEE_RESTRICTED: { code: 15501, message: "Trưởng phòng chỉ được tạo nhân viên trong phòng ban của mình" },
    MANAGER_NOT_FOUND: { code: 15502, message: "Không tìm thấy quản lý" },
    EMPLOYEE_CREATION_FAILED: { code: 15503, message: "Lỗi khi tạo tài khoản và thông tin nhân viên" },
    EMPLOYEE_UPDATE_FAILED: { code: 15504, message: "Lỗi khi cập nhật thông tin nhân viên" },
    GET_EMPLOYEE_DETAIL_FAILED: { code: 15505, message: "Lỗi khi lấy chi tiết thông tin nhân viên" },
    GET_EMPLOYEE_INFO_FAILED: { code: 15506, message: "Lỗi khi lấy thông tin nhân viên" },
    GET_ALL_EMPLOYEES_FAILED: { code: 15507, message: "Lỗi khi lấy danh sách thông tin nhân viên" },
    EMPLOYEE_NOT_FOUND: { code: 15508, message: "Không tìm thấy thông tin nhân viên" },
} as const;

/**
 * Helper function: Get error by code
 */
export const getErrorByCode = (code: number): ErrorCode | undefined => {
    return Object.values(ERROR_CODES).find(error => error.code === code);
};

/**
 * Helper function: Get error message by code
 */
export const getErrorMessageByCode = (code: number): string => {
    const error = getErrorByCode(code);
    return error?.message || "Đã xảy ra lỗi không xác định";
};

/**
 * Helper function: Check if error code exists
 */
export const isValidErrorCode = (code: number): boolean => {
    return Object.values(ERROR_CODES).some(error => error.code === code);
};

