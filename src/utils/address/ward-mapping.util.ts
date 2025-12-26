import addressData, { Ward, WardMapping, Province } from 'vietnam-address-database';

interface OldAddress {
    old_ward_name: string;
    old_district_name: string;
    old_province_name: string;
}

let wardMappingsCache: WardMapping[] | null = null;


function getWardMappings(): WardMapping[] {
    if (wardMappingsCache) {
        return wardMappingsCache;
    }

    let mappings: WardMapping[] = [];

    addressData.forEach((item) => {
        if (item.type === 'table' && item.name === 'ward_mappings' && item.data) {
            mappings = item.data as WardMapping[];
        }
    });

    wardMappingsCache = mappings;
    return mappings;
}

/**
 * Tìm ward mapping dựa trên ward code mới
 * @param newWardCode - Mã ward mới (ward_code từ Ward)
 * @param newWardName - Tên ward mới (name từ Ward)
 * @param newProvinceCode - Mã tỉnh/thành phố mới (province_code từ Ward)
 * @returns OldAddress hoặc null nếu không tìm thấy
 */
export function findOldAddressByNewWardCode(
    newWardCode: string,
    newWardName?: string,
    newProvinceCode?: string
): OldAddress | null {
    const mappings = getWardMappings();

    // Tìm mapping theo new_ward_code
    const mapping = mappings.find((m) => m.new_ward_code === newWardCode);

    if (mapping) {
        return {
            old_ward_name: mapping.old_ward_name,
            old_district_name: mapping.old_district_name,
            old_province_name: mapping.old_province_name,
        };
    }

    if (newWardName && newProvinceCode) {
        let provinceName = '';
        addressData.forEach((item) => {
            if (item.type === 'table' && item.name === 'provinces' && item.data) {
                const provinces = item.data as any[];
                const province = provinces.find((p) => p.province_code === newProvinceCode);
                if (province) {
                    provinceName = province.name;
                }
            }
        });

        const mappingByName = mappings.find(
            (m) =>
                m.new_ward_name === newWardName &&
                m.new_province_name === provinceName
        );

        if (mappingByName) {
            return {
                old_ward_name: mappingByName.old_ward_name,
                old_district_name: mappingByName.old_district_name,
                old_province_name: mappingByName.old_province_name,
            };
        }
    }

    return null;
}

/**
 * Tìm ward mapping dựa trên ward name và province name
 * @param wardName - Tên ward (có thể là tên mới hoặc tên cũ)
 * @param provinceName - Tên tỉnh/thành phố (có thể là tên mới hoặc tên cũ)
 * @returns OldAddress hoặc null nếu không tìm thấy
 */
export function findOldAddressByName(
    wardName: string,
    provinceName: string
): OldAddress | null {
    const mappings = getWardMappings();

    if (!wardName || !provinceName) {
        return null;
    }

    const normalizedWardName = wardName.trim();
    const normalizedProvinceName = provinceName.trim();

    let mapping = mappings.find(
        (m) =>
            m.new_ward_name === normalizedWardName &&
            m.new_province_name === normalizedProvinceName
    );

    if (!mapping) {
        mapping = mappings.find(
            (m) =>
                (m.new_ward_name?.trim() === normalizedWardName ||
                    m.new_ward_name?.includes(normalizedWardName) ||
                    normalizedWardName.includes(m.new_ward_name || '')) &&
                (m.new_province_name?.trim() === normalizedProvinceName ||
                    m.new_province_name?.includes(normalizedProvinceName) ||
                    normalizedProvinceName.includes(m.new_province_name || ''))
        );
    }

    if (mapping) {
        return {
            old_ward_name: mapping.old_ward_name,
            old_district_name: mapping.old_district_name,
            old_province_name: mapping.old_province_name,
        };
    }

    return null;
}

/**
 * Map ward từ Ward object sang old address format
 * @param ward - Ward object từ vietnam-address-database
 * @returns OldAddress hoặc null nếu không tìm thấy mapping
 */
export function mapWardToOldAddress(ward: Ward): OldAddress | null {
    return findOldAddressByNewWardCode(
        ward.ward_code,
        ward.name,
        ward.province_code
    );
}

/**
 * Lấy ward từ vietnam-address-database dựa trên province và district
 * @param provinceName - Tên tỉnh/thành phố
 * @param districtName - Tên quận/huyện
 * @returns Ward name đầu tiên tìm thấy hoặc null
 */
export function getWardFromProvinceAndDistrict(
    provinceName: string,
    districtName: string
): string | null {
    let provinces: Province[] = [];
    let wards: Ward[] = [];

    addressData.forEach((item) => {
        if (item.type === 'table') {
            if (item.name === 'provinces' && item.data) {
                provinces = item.data as Province[];
            } else if (item.name === 'wards' && item.data) {
                wards = item.data as Ward[];
            }
        }
    });

    const province = provinces.find(
        (p) => p.name === provinceName || p.name.includes(provinceName) || provinceName.includes(p.name)
    );

    if (!province) {
        return null;
    }

    const mappings = getWardMappings();
    const mapping = mappings.find(
        (m) =>
            m.new_province_name === provinceName &&
            (m.old_district_name === districtName || m.new_ward_name?.includes(districtName))
    );

    if (mapping) {
        const ward = wards.find(
            (w) => w.province_code === province.province_code && w.name === mapping.new_ward_name
        );
        if (ward) {
            return ward.name;
        }
    }
    const firstWard = wards.find((w) => w.province_code === province.province_code);
    return firstWard ? firstWard.name : null;
}

/**
 * Map address từ format mới sang format cũ cho GHN API
 * @param wardName - Tên ward mới
 * @param provinceName - Tên tỉnh/thành phố mới
 * @param provinceCode - Mã tỉnh/thành phố (optional, để tìm chính xác hơn)
 * @returns OldAddress với old_ward_name, old_district_name, old_province_name
 */
export function mapAddressToOldFormat(
    wardName: string,
    provinceName: string,
    provinceCode?: string
): OldAddress {
    const mapping = findOldAddressByName(wardName, provinceName);

    if (mapping) {
        return mapping;
    }

    return {
        old_ward_name: '',
        old_district_name: '',
        old_province_name: '',
    };
}

