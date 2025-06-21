import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import { stripe } from '../../utilities/stripe';
import { Donate } from './donate.model';

const donate = async (userId: string, amount: number) => {
    const donateCreate = await Donate.create({ user: userId, amount: amount });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'nzd',
                    product_data: {
                        name: 'Donation',
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        metadata: {
            userId: userId.toString(),
            paymentPurpose: 'Donate',
            donateId: donateCreate._id.toString(),
        },
        success_url: `${config.stripe.stripe_payment_success_url}`,
        cancel_url: `${config.stripe.stripe_payment_cancel_url}`,
    });

    return { url: session.url };
};

const getAllDonner = async (query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(
        Donate.find().populate({ path: 'user', select: 'name profile_image' }),
        query
    )
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();
    return {
        meta,
        result,
    };
};

export const DonateService = {
    donate,
    getAllDonner,
};
