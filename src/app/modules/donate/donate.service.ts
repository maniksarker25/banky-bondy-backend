import QueryBuilder from '../../builder/QueryBuilder';
import { stripe } from '../../utilities/stripe';
import { Donate } from './donate.model';

const donate = async (userId: string, amount: number) => {
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
        },
        success_url: `${process.env.CLIENT_BASE_URL}/donation-success`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/donation-cancel`,
    });

    return { url: session.url };
};

const getAllDonner = async (query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(Donate.find(), query)
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
