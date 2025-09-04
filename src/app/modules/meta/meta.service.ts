/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_PAYMENT_STATUS } from '../../utilities/enum';
import { Donate } from '../donate/donate.model';
import NormalUser from '../normalUser/normalUser.model';
import { User } from '../user/user.model';

const getDashboardMetaData = async () => {
    const [totalUser, totalBlockAccount, donationStats] = await Promise.all([
        NormalUser.countDocuments(),
        User.countDocuments({ isBlocked: true }),
        Donate.aggregate([
            {
                $match: { status: ENUM_PAYMENT_STATUS.PAID },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    uniqueDonors: { $addToSet: '$user' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                    totalUniqueDonors: { $size: '$uniqueDonors' },
                },
            },
        ]),
    ]);

    const { totalAmount = 0, totalUniqueDonors = 0 } = donationStats[0] || {};

    return {
        totalUser,
        totalBlockAccount,
        totalDonationAmount: totalAmount,
        totalDonors: totalUniqueDonors,
    };
};

const getUserChartData = async (year: number) => {
    const currentYear = year || new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    const chartData = await NormalUser.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfYear,
                    $lt: endOfYear,
                },
            },
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                totalUser: { $sum: 1 },
            },
        },
        {
            $project: {
                month: '$_id',
                totalUser: 1,
                _id: 0,
            },
        },
        {
            $sort: { month: 1 },
        },
    ]);

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const data = Array.from({ length: 12 }, (_, index) => ({
        month: months[index],
        totalUser:
            chartData.find((item) => item.month === index + 1)?.totalUser || 0,
    }));

    const yearsResult = await NormalUser.aggregate([
        {
            $group: {
                _id: { $year: '$createdAt' },
            },
        },
        {
            $project: {
                year: '$_id',
                _id: 0,
            },
        },
        {
            $sort: { year: 1 },
        },
    ]);

    const yearsDropdown = yearsResult.map((item: any) => item.year);

    return {
        chartData: data,
        yearsDropdown,
    };
};

const MetaService = {
    getDashboardMetaData,
    getUserChartData,
};

export default MetaService;
