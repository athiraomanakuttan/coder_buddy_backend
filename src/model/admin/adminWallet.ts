import mongoose from "mongoose";

interface AdminTransactionType {
    paymentId: string,
    amount: number,
    dateTime : string | Date
}
interface AdminWalletDataType {
    expertId: string,
    amount: number,
    transaction:AdminTransactionType[]
}


const walletSchema = new mongoose.Schema<AdminWalletDataType>({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment",
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        dateTime: {
            type: Date,
            default: Date.now()
        }
    }]
}, { timestamps: true });

const AdminWallet = mongoose.model<AdminWalletDataType>("adminWallet", walletSchema);


export { AdminWalletDataType , AdminWallet}