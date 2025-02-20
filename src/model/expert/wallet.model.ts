import mongoose from "mongoose";

interface TransactionType {
    _id ?: string,
    paymentId: string | null,
    amount: number,
    transactionType?:string,
    dateTime : string | Date
}
interface WalletDataType {
    expertId: string,
    amount: number,
    transaction:TransactionType[]
}



const walletSchema = new mongoose.Schema<WalletDataType>({
    expertId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    transaction: [{
        paymentId: {
            type: String,
            default: null
        },
        amount:{
            type: Number,
            required: true
        },
        dateTime: {
            type: Date,
            default: Date.now()
        },
        transactionType : {
            type: String,
            default:"credited",
            enum :["debited","credited"]
        }
    }]
}, { timestamps: true });

const Wallet = mongoose.model<WalletDataType>("wallet", walletSchema);


export { WalletDataType , Wallet}