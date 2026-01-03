declare class PaystackPop {
    constructor();
    checkout(options: {
        key: string;
        email: string;
        amount: number;
        reference?: string;
        currency?: string;
        subaccount?: string;
        bearer?: string;
        channels?: string[];
        metadata?: Record<string, any>;
        label?: string;
        onSuccess: (response: { reference: string; status: string; trans: string; transaction: string; message: string; }) => void;
        onCancel: () => void;
        onError?: (error: any) => void;
    }): void;
}
