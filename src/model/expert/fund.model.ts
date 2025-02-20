import mongoose from "mongoose"

 interface FundModelType  extends Document{
    expertId: mongoose.Schema.Types.ObjectId,
    fundAccountId: string
}

const fundSchema = new mongoose.Schema<FundModelType>({
    expertId:{ type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref:'expert' },
    fundAccountId:{type:String, required: true}
},{timestamps: true})

const FundAccount = mongoose.model('fundAccount', fundSchema)

export {FundModelType, FundAccount}