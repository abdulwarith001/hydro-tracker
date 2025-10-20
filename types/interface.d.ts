interface BackgroundLockContextValue {
  isLocked: boolean;
  unlock: () => void;
}

interface BackgroundLockProviderProps {
  children: React.ReactNode;
  lockTimeoutMinutes?: number; // Default 5 minutes
}

interface SendMoneyFormValues {
  counterparty: string;
  pin: string;
  reason: string;
  amount: string;
  key: string;
}

interface WalletTransferFormValues {
  recipient: string;
  pin: string;
  reason: string;
  amount: string;
  key: string;
}

interface WalletTransferRecipient {
  _id: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
  };
  virtualAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
    currency: string;
    _id: string;
  }[];
}

interface Transaction {
  __v: number;
  _id: string;
  amount: number;
  category: string;
  counterParty: {
    accountName: string;
    accountNumber: string;
    bank: {
      name: string;
    };
  };
  createdAt: string; // ISO date
  currency: string;
  description: string;
  fee: number;
  vat: number;
  form: "debit" | "credit" | "airtime" | "data";
  sessionId?: string;
  reference?: string;
  narration: string;
  sender: {
    _id: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
    currency: string;
  };
  status: "successful" | "failed" | "pending" | "processing";
  type: string;
  user: string;
  metadata: Record<string, any>;
}

interface CounterpartyTypes {
  bank: BankData | null;
  accountNumber: string;
  accountName: string;
  _id?: string;
  nickname?: string;
}

interface Budget {
  id: string;
  account: string;
  allocation: {
    needs: number;
    savings: number;
    wants: number;
  };
  spentAllocation: {
    needs: number;
    savings: number;
    wants: number;
  };
  budgetAmount: number;
  budgetBalance: number;
  budgetSource: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isRolledoverConfirmed: boolean;
  negativeBalance: number;
  rolloverAmount: number;
}

interface Allocation {
  needs: number;
  wants: number;
  savings: number;
}
