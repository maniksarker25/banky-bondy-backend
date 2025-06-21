import { model, Schema } from 'mongoose';
import { IBondLink } from './bondLink.interface';
import { ENUM_BOND_LINK_STATUS } from './bondLink.enum';

const BondLinkSchema = new Schema<IBondLink>({
    name: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'NormalUser' }],
    requestedBonds: [{ type: Schema.Types.ObjectId, ref: 'BondRequest' }],
    status: {
        type: String,
        enum: Object.values(ENUM_BOND_LINK_STATUS),
        default: ENUM_BOND_LINK_STATUS.Ongoing,
    },
    createdAt: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

export const BondLink = model<IBondLink>('BondLink', BondLinkSchema);
