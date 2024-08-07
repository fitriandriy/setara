// Tipe data untuk item favorit dan tersimpan
export type EwalletUser = {
    id?: string;
    owner_id?: string;
    ewallet_user_id?: string;
    favorite?: boolean | undefined;
    ewallet_user_name: string;
    ewallet_user_image_path: string;
    ewallet_user_phone_number: string;
    ewallet_name: string;
}

// Tipe data untuk respons API
export type ResponseEWallet = {
    total_favorites: number;
    total_saved: number; 
    favorites: EwalletUser[];
    saved: EwalletUser[];
}


export type SearchEWalletReq = {
    noEwallet: string
    ewalletId: string
}



export type TransactionEWalletReq = {
    idEwallet: string
    destinationPhoneNumber: string
    amount: number
    mpin: string
    note: string | undefined
    savedAccount: true
}

interface User {
    accountNumber: string;
    name: string;
    imagePath: string;
    bankName: string;
}

interface Ewallet {
    name: string;
}

interface UserEwallet {
    name: string;
    phoneNumber: string;
    imagePath: string;
    ewallet: Ewallet;
}

export type TransactionEWalletRes = {
    code: number;
    user: User;
    userEwallet: UserEwallet;
    amount: number;
    adminFee: number;
    totalAmount: number;
}



