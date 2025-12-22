
export * from './services/shipment.service';
export * from './types/shipment.types';

import { shipmentService } from './services/shipment.service';

import type { PackagePriceRequest, PackageConkinResponse, GHNCostsRequest } from './types/shipment.types';

export const getConkinShipmentPrice = async (
    request: PackagePriceRequest
): Promise<PackageConkinResponse> => {
    return shipmentService.getConkinShipmentPrice(request);
};

// Export GHN functions
export const getGHNCosts = async (requestData: GHNCostsRequest) => {
    return shipmentService.getGHNCosts(requestData);
};


import type { CostsRequest, CostsShipmentResponse } from './types/shipment.types';

export const getCostsShipments = async (
    requestData: CostsRequest
): Promise<CostsShipmentResponse[]> => {
    return shipmentService.getCostsShipments(requestData);
};

