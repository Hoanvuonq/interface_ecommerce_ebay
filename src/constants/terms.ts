export type TermItem = {
    title: string;
    content: (string | { type: 'list'; items: string[] })[];
};

export const TERMS_HEADER = {
    updated: "20/11/2025",
    effective: "20/11/2025",
    company: {
        name: "CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ VẬN CHUYỂN QUỐC TẾ EBAY",
        nameEn: "EBAY TRADING AND INTERNATIONAL SHIPPING SERVICE COMPANY LIMITED",
        tax: "0316436339",
        address: "300 Độc Lập, Phường Tân Quý, Quận Tân Phú, Thành phố Hồ Chí Minh, Việt Nam",
        taxAddress: "300 Độc Lập, Phường Phú Thọ Hòa, TP Hồ Chí Minh, Việt Nam",
        email: "ebayexpressvn@gmail.com",
        hotline: "0932 070 787"
    }
};

export const TERMS_CONTENT: TermItem[] = [
    {
        title: "1. CHẤP NHẬN ĐIỀU KHOẢN",
        content: [
            "1.1. Chào mừng bạn đến với nền tảng CaLaTha.vn (bao gồm website và ứng dụng di động CaLaTha) được vận hành bởi Công ty TNHH Thương Mại Và Dịch Vụ Vận Chuyển Quốc Tế EBAY (\"CaLaTha\", \"chúng tôi\", \"của chúng tôi\").",
            "1.2. Bằng việc truy cập, sử dụng hoặc đăng ký tài khoản trên Nền tảng CaLaTha, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ các Điều khoản sử dụng này (\"Điều khoản\"). Nếu bạn không đồng ý với bất kỳ phần nào của Điều khoản này, vui lòng không sử dụng Nền tảng của chúng tôi.",
            "1.3. Chúng tôi có quyền sửa đổi, bổ sung hoặc thay thế các Điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng Nền tảng sau khi có thay đổi được xem là bạn đã chấp nhận các thay đổi đó."
        ]
    },
    {
        title: "2. ĐỊNH NGHĨA",
        content: [
            '2.1. <strong>"Nền tảng"</strong> có nghĩa là website CaLaTha.vn và ứng dụng di động CaLaTha, bao gồm tất cả các trang, tính năng, dịch vụ và nội dung được cung cấp trên đó.',
            '2.2. <strong>"Người dùng"</strong> có nghĩa là bất kỳ cá nhân hoặc tổ chức nào truy cập hoặc sử dụng Nền tảng, bao gồm Người mua và Người bán.',
            '2.3. <strong>"Người mua"</strong> có nghĩa là người dùng mua sản phẩm hoặc dịch vụ trên Nền tảng.',
            '2.4. <strong>"Người bán"</strong> có nghĩa là người dùng bán sản phẩm hoặc dịch vụ trên Nền tảng, bao gồm các Shop.',
            '2.5. <strong>"Dịch vụ"</strong> có nghĩa là tất cả các dịch vụ được cung cấp trên Nền tảng, bao gồm nhưng không giới hạn: mua bán sản phẩm, thanh toán, vận chuyển, hỗ trợ khách hàng.'
        ]
    },
    {
        title: "3. ĐĂNG KÝ TÀI KHOẢN",
        content: [
            "3.1. Để sử dụng một số tính năng của Nền tảng, bạn cần đăng ký tài khoản. Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký.",
            "3.2. Bạn có trách nhiệm bảo mật thông tin đăng nhập và mật khẩu của bạn. Bạn chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn.",
            "3.3. Bạn phải từ 18 tuổi trở lên để đăng ký tài khoản. Nếu bạn dưới 18 tuổi, bạn cần có sự đồng ý của cha mẹ hoặc người giám hộ.",
            "3.4. Chúng tôi có quyền từ chối hoặc hủy tài khoản của bạn nếu bạn vi phạm các Điều khoản này hoặc có hành vi gian lận, lừa đảo."
        ]
    },
    {
        title: "4. SỬ DỤNG NỀN TẢNG",
        content: [
            "4.1. Bạn được phép sử dụng Nền tảng cho mục đích hợp pháp và phù hợp với các Điều khoản này.",
            "4.2. Bạn không được phép:",
            {
                type: 'list',
                items: [
                    "Sử dụng Nền tảng cho bất kỳ mục đích bất hợp pháp nào;",
                    "Vi phạm bất kỳ luật, quy định hoặc quy tắc nào có liên quan;",
                    "Xâm phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba;",
                    "Gửi, đăng tải hoặc truyền bất kỳ nội dung nào có tính chất lừa đảo, xúc phạm, đe dọa, khiêu dâm, bất hợp pháp hoặc vi phạm quyền của người khác;",
                    "Sử dụng robot, spider, scraper hoặc các công cụ tự động khác để truy cập Nền tảng;",
                    "Can thiệp hoặc phá hoại hoạt động của Nền tảng;",
                    "Tạo tài khoản giả mạo hoặc sử dụng thông tin của người khác;",
                    "Thực hiện bất kỳ hành vi nào có thể gây hại cho Nền tảng, người dùng khác hoặc chúng tôi."
                ]
            }
        ]
    },
    {
        title: "5. MUA SẮM TRÊN NỀN TẢNG",
        content: [
            "5.1. Khi bạn mua sản phẩm trên Nền tảng, bạn đồng ý mua sản phẩm từ Người bán được liệt kê trên Nền tảng. CaLaTha chỉ là nền tảng kết nối giữa Người mua và Người bán, không phải là bên bán hàng.",
            "5.2. Giá cả, mô tả sản phẩm và thông tin khác được hiển thị trên Nền tảng do Người bán cung cấp. Chúng tôi không đảm bảo tính chính xác của thông tin này.",
            "5.3. Bạn chịu trách nhiệm thanh toán đầy đủ và đúng hạn cho các giao dịch mua hàng của bạn.",
            "5.4. Chúng tôi có quyền từ chối hoặc hủy bất kỳ đơn hàng nào nếu có dấu hiệu gian lận, lừa đảo hoặc vi phạm các Điều khoản này."
        ]
    },
    {
        title: "6. BÁN HÀNG TRÊN NỀN TẢNG",
        content: [
            "6.1. Nếu bạn là Người bán, bạn phải tuân thủ các quy định về bán hàng trên Nền tảng, bao gồm nhưng không giới hạn:",
            {
                type: 'list',
                items: [
                    "Cung cấp thông tin sản phẩm chính xác, đầy đủ;",
                    "Đảm bảo sản phẩm của bạn không vi phạm quyền sở hữu trí tuệ, pháp luật hoặc quy định;",
                    "Xử lý đơn hàng và giao hàng đúng hạn;",
                    "Xử lý khiếu nại và trả hàng theo quy định;",
                    "Tuân thủ các chính sách về giá cả, khuyến mãi và quảng cáo."
                ]
            },
            "6.2. Chúng tôi có quyền từ chối, gỡ bỏ hoặc đình chỉ bất kỳ sản phẩm hoặc tài khoản Người bán nào vi phạm các Điều khoản này.",
            "6.3. Người bán chịu trách nhiệm về thuế và các nghĩa vụ pháp lý khác liên quan đến hoạt động bán hàng của mình."
        ]
    },
    {
        title: "7. THANH TOÁN",
        content: [
            "7.1. Chúng tôi cung cấp các phương thức thanh toán khác nhau trên Nền tảng. Bạn có thể chọn phương thức thanh toán phù hợp với bạn.",
            "7.2. Thanh toán được xử lý thông qua các nhà cung cấp dịch vụ thanh toán bên thứ ba. Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn.",
            "7.3. Bạn chịu trách nhiệm đảm bảo rằng bạn có đủ quyền và quỹ để thực hiện thanh toán."
        ]
    },
    {
        title: "8. VẬN CHUYỂN VÀ GIAO HÀNG",
        content: [
            "8.1. Vận chuyển và giao hàng được thực hiện bởi Người bán hoặc các đối tác vận chuyển của chúng tôi.",
            "8.2. Thời gian giao hàng có thể thay đổi tùy thuộc vào địa điểm giao hàng, phương thức vận chuyển và các yếu tố khác.",
            "8.3. Bạn chịu trách nhiệm cung cấp địa chỉ giao hàng chính xác. Chúng tôi không chịu trách nhiệm nếu giao hàng thất bại do địa chỉ không chính xác."
        ]
    },
    {
        title: "9. TRẢ HÀNG VÀ HOÀN TIỀN",
        content: [
            "9.1. Chính sách trả hàng và hoàn tiền được quy định trong Chính sách Trả hàng và Hoàn tiền của chúng tôi, có thể được cập nhật từ thời gian này sang thời gian khác.",
            "9.2. Người mua có quyền trả hàng và yêu cầu hoàn tiền trong các trường hợp được quy định, ví dụ: sản phẩm bị lỗi, không đúng mô tả, không nhận được hàng.",
            "9.3. Người bán có trách nhiệm xử lý yêu cầu trả hàng và hoàn tiền theo quy định."
        ]
    },
    {
        title: "10. QUYỀN SỞ HỮU TRÍ TUỆ",
        content: [
            "10.1. Tất cả nội dung trên Nền tảng, bao gồm nhưng không giới hạn: văn bản, hình ảnh, logo, biểu tượng, phần mềm, là tài sản của CaLaTha hoặc được cấp phép cho CaLaTha sử dụng.",
            "10.2. Bạn không được phép sao chép, sử dụng, phân phối hoặc tạo ra các tác phẩm phái sinh từ nội dung trên Nền tảng mà không có sự cho phép bằng văn bản của chúng tôi.",
            "10.3. Nếu bạn tin rằng nội dung trên Nền tảng vi phạm quyền sở hữu trí tuệ của bạn, vui lòng liên hệ với chúng tôi."
        ]
    },
    {
        title: "11. MIỄN TRỪ TRÁCH NHIỆM",
        content: [
            "11.1. CaLaTha chỉ là nền tảng kết nối giữa Người mua và Người bán. Chúng tôi không phải là bên bán hàng hoặc cung cấp dịch vụ, trừ khi được quy định rõ ràng.",
            "11.2. Chúng tôi không đảm bảo rằng Nền tảng sẽ luôn hoạt động không gián đoạn, không có lỗi hoặc an toàn. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng Nền tảng.",
            "11.3. Chúng tôi không chịu trách nhiệm cho chất lượng, an toàn, tính hợp pháp của sản phẩm hoặc dịch vụ được bán trên Nền tảng.",
            "11.4. Chúng tôi không chịu trách nhiệm cho các tranh chấp giữa Người mua và Người bán. Tuy nhiên, chúng tôi có thể hỗ trợ giải quyết tranh chấp theo quy định."
        ]
    },
    {
        title: "12. GIỚI HẠN TRÁCH NHIỆM",
        content: [
            "12.1. Trong phạm vi tối đa được pháp luật cho phép, trách nhiệm của CaLaTha đối với bạn được giới hạn ở mức tối đa bằng số tiền bạn đã thanh toán cho chúng tôi trong 12 tháng trước khi có yêu cầu bồi thường.",
            "12.2. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào, bao gồm nhưng không giới hạn: mất lợi nhuận, mất dữ liệu, mất cơ hội kinh doanh."
        ]
    },
    {
        title: "13. BỒI THƯỜNG",
        content: [
            "13.1. Bạn đồng ý bồi thường và giữ cho CaLaTha, các công ty liên kết, nhân viên, đại lý và đối tác của chúng tôi không bị thiệt hại do:",
            {
                type: 'list',
                items: [
                    "Vi phạm các Điều khoản này;",
                    "Vi phạm quyền của bên thứ ba;",
                    "Sử dụng Nền tảng một cách bất hợp pháp hoặc vi phạm pháp luật."
                ]
            }
        ]
    },
    {
        title: "14. CHẤM DỨT",
        content: [
            "14.1. Chúng tôi có quyền chấm dứt hoặc đình chỉ tài khoản và quyền truy cập của bạn vào Nền tảng bất cứ lúc nào, với hoặc không có lý do, với hoặc không có thông báo trước.",
            "14.2. Bạn có thể chấm dứt tài khoản của bạn bất cứ lúc nào bằng cách liên hệ với chúng tôi hoặc sử dụng tính năng xóa tài khoản trên Nền tảng.",
            "14.3. Sau khi chấm dứt, bạn sẽ không còn quyền truy cập vào tài khoản và dữ liệu của bạn. Chúng tôi có thể xóa hoặc vô danh hóa dữ liệu của bạn theo quy định pháp luật."
        ]
    },
    {
        title: "15. LUẬT ÁP DỤNG VÀ GIẢI QUYẾT TRANH CHẤP",
        content: [
            "15.1. Các Điều khoản này được điều chỉnh bởi pháp luật Việt Nam.",
            "15.2. Mọi tranh chấp phát sinh từ hoặc liên quan đến các Điều khoản này sẽ được giải quyết thông qua thương lượng. Nếu không thể thương lượng, tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam."
        ]
    },
    {
        title: "16. CÁC QUY ĐỊNH KHÁC",
        content: [
            "16.1. Nếu bất kỳ điều khoản nào trong các Điều khoản này bị coi là vô hiệu hoặc không thể thực thi, các điều khoản còn lại vẫn có hiệu lực đầy đủ.",
            "16.2. Chúng tôi có quyền chuyển nhượng quyền và nghĩa vụ của chúng tôi theo các Điều khoản này cho bên thứ ba mà không cần sự đồng ý của bạn.",
            "16.3. Các Điều khoản này cùng với Chính sách Bảo mật và các chính sách khác được đăng trên Nền tảng tạo thành toàn bộ thỏa thuận giữa bạn và CaLaTha."
        ]
    },
    {
        title: "17. LIÊN HỆ",
        content: [
            "Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi:",
        ]
    },
];