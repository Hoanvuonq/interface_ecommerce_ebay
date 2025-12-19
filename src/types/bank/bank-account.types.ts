/**
 * Bank Account Types - Unified cho cả Shop & Buyer
 */

export enum BankAccountType {
    SHOP = "SHOP",
    BUYER = "BUYER",
    ADMIN = "ADMIN",
}

export interface BankAccountResponse {
    bankAccountId: string;
    userId: string;
    accountType: BankAccountType;
    bankAccountNumber: string;
    bankName: string;
    bankAccountHolder: string;
    branch?: string;
    default: boolean;
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    deleted?: boolean;
    version?: number;
}

export interface CreateBankAccountRequest {
    bankAccountNumber: string;
    bankName: string;
    bankAccountHolder: string;
    branch?: string;
    accountType?: BankAccountType;
    isDefault?: boolean;
}

export interface UpdateBankAccountRequest {
    bankAccountNumber?: string;
    bankName?: string;
    bankAccountHolder?: string;
    branch?: string;
    isDefault?: boolean;
}

export interface BankInfo {
    code: string;
    shortName: string;
    fullName: string;
}

