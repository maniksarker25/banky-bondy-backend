/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_PAYMENT_STATUS } from '../../utilities/enum';
import Audio from '../audio/audio.model';
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
const donorGrowthChartData = async (year: number) => {
    const currentYear = year || new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    const chartData = await Donate.aggregate([
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
                totalDonate: { $sum: 1 },
            },
        },
        {
            $project: {
                month: '$_id',
                totalDonate: 1,
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
        totalDonate:
            chartData.find((item) => item.month === index + 1)?.totalDonate ||
            0,
    }));

    const yearsResult = await Donate.aggregate([
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

const getAudioPieChartData = async () => {
    const audioStats = await Audio.aggregate([
        {
            $group: {
                _id: null,
                shortAudioCount: {
                    $sum: { $cond: [{ $lt: ['$duration', 300] }, 1, 0] },
                },
                longAudioCount: {
                    $sum: { $cond: [{ $gte: ['$duration', 300] }, 1, 0] },
                },
                totalCount: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                shortAudioCount: 1,
                longAudioCount: 1,
                totalCount: 1,
            },
        },
    ]);
    const stats = audioStats[0] || {
        shortAudioCount: 0,
        longAudioCount: 0,
        totalCount: 0,
    };

    return stats;
};

const MetaService = {
    getDashboardMetaData,
    getUserChartData,
    getAudioPieChartData,
    donorGrowthChartData,
};

export default MetaService;
