/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import BondRequest from './bondRequest.model';
import { IBondRequest } from './bondRequest.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { ENUM_BOND_REQUEST_STATUS } from './bondRequest.enum';

const createBondRequestIntoDB = async (
    userId: string,
    payload: IBondRequest
) => {
    return await BondRequest.create({ ...payload, user: userId });
};

const getAllBondRequests = async (query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(BondRequest.find(), query)
        .search(['give', 'get', 'location'])
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
const myBondRequests = async (
    userId: string,
    query: Record<string, unknown>
) => {
    const resultQuery = new QueryBuilder(
        BondRequest.find({ user: userId }),
        query
    )
        .search(['give', 'get', 'location'])
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

const getSingleBondRequest = async (id: string) => {
    const bondRequest = await BondRequest.findById(id);
    if (!bondRequest)
        throw new AppError(httpStatus.NOT_FOUND, 'BondRequest not found');
    return bondRequest;
};

const updateBondRequestIntoDB = async (
    userId: string,
    id: string,
    payload: Partial<IBondRequest>
) => {
    const bondRequest = await BondRequest.findOne({ _id: id, user: userId });
    if (!bondRequest)
        throw new AppError(httpStatus.NOT_FOUND, 'BondRequest not found');

    return await BondRequest.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBondRequestFromDB = async (userId: string, id: string) => {
    const bondRequest = await BondRequest.findOne({ user: userId, _id: id });
    if (!bondRequest)
        throw new AppError(httpStatus.NOT_FOUND, 'BondRequest not found');

    return await BondRequest.findByIdAndDelete(id);
};

// export const getMatchingBondRequest = async (
//     userId: string,
//     bondRequestId: string
// ): Promise<{ matchRequest: any[] }[]> => {
//     const maxCycleSize = 5;

//     // Step 1: Fetch the initiating bond request
//     const startRequest = await BondRequest.findOne({
//         _id: bondRequestId,
//         user: userId,
//         status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
//     })
//         .select('offer want status')
//         .lean();

//     if (!startRequest) {
//         throw new Error('Bond request not found or not eligible for linking.');
//     }

//     const matches: string[][] = [];

//     // Step 2: Find 2-user direct swaps
//     const directMatches = await BondRequest.find({
//         _id: { $ne: bondRequestId },
//         offer: startRequest.want,
//         want: startRequest.offer,
//         status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
//     })
//         .select('_id')
//         .lean();

//     for (const match of directMatches) {
//         matches.push([bondRequestId, match._id.toString()]);
//     }

//     // Step 3: Load all other pending bond requests
//     const otherRequests = await BondRequest.find({
//         _id: { $ne: bondRequestId },
//         status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
//     })
//         .select('user offer want')
//         .lean();

//     // Preprocess into lookup maps
//     const requestMap = new Map<string, (typeof otherRequests)[0]>();
//     const offerMap = new Map<string, string[]>();

//     for (const req of otherRequests) {
//         const id = req._id.toString();
//         requestMap.set(id, req);
//         if (!offerMap.has(req.offer)) offerMap.set(req.offer, []);
//         offerMap.get(req.offer)!.push(id);
//     }

//     const getWant = (id: string): string => {
//         if (id === bondRequestId) return startRequest.want;
//         return requestMap.get(id)!.want;
//     };

//     // Step 4: BFS for cycles of size 3–5
//     const queue: { path: string[]; seen: Set<string> }[] = [
//         { path: [bondRequestId], seen: new Set([bondRequestId]) },
//     ];
//     const seenHashes = new Set<string>();

//     while (queue.length) {
//         const { path, seen } = queue.shift()!;
//         const lastId = path[path.length - 1];
//         const lastWant = getWant(lastId);
//         const nextIds = offerMap.get(lastWant) || [];

//         for (const nextId of nextIds) {
//             if (seen.has(nextId)) {
//                 if (nextId === bondRequestId && path.length >= 3) {
//                     const cycle = [...path];
//                     const hash = [...cycle].sort().join('-');
//                     if (!seenHashes.has(hash)) {
//                         seenHashes.add(hash);
//                         matches.push(cycle);
//                     }
//                 }
//                 continue;
//             }

//             if (path.length < maxCycleSize) {
//                 queue.push({
//                     path: [...path, nextId],
//                     seen: new Set(seen).add(nextId),
//                 });
//             }
//         }
//     }

//     // Step 5: Populate all matchRequest arrays
//     const result: { matchRequest: any[] }[] = [];

//     for (const matchIds of matches) {
//         const populated = await BondRequest.find({
//             _id: { $in: matchIds },
//         })
//             .populate({ path: 'user', select: 'name profile_image' }) // Add any other fields you want to populate
//             .lean();

//         // Sort populated requests by input matchIds order
//         const ordered = matchIds.map((id) =>
//             populated.find((p) => p._id.toString() === id)
//         );

//         result.push({ matchRequest: ordered });
//     }

//     return result;
// };
// export const getMatchingBondRequest = async (
//     userId: string,
//     bondRequestId: string
// ): Promise<{ matchRequest: any[] }[]> => {
//     const maxCycleSize = 5;

//     // 1. Fetch the initiating bond request with location & radius
//     const startRequest = await BondRequest.findOne({
//         _id: bondRequestId,
//         user: userId,
//         status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
//     })
//         .select('offer want status location radius')
//         .lean();

//     if (!startRequest) {
//         throw new Error('Bond request not found or not eligible for linking.');
//     }

//     // 2. Build geolocation filter if applicable
//     const geoFilter: any = {};
//     if (startRequest.location && startRequest.radius) {
//         const [lng, lat] = startRequest.location.coordinates;
//         geoFilter.location = {
//             $geoWithin: {
//                 $centerSphere: [[lng, lat], startRequest.radius / 6371], // radius in radians
//             },
//         };
//     }

//     const baseQuery = {
//         _id: { $ne: bondRequestId },
//         status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
//         ...geoFilter,
//     };

//     const matches: string[][] = [];

//     // 3. Direct 2-user match
//     const directMatches = await BondRequest.find({
//         ...baseQuery,
//         offer: startRequest.want,
//         want: startRequest.offer,
//     })
//         .select('_id')
//         .lean();

//     for (const match of directMatches) {
//         matches.push([bondRequestId, match._id.toString()]);
//     }

//     // 4. Get all possible other requests for cycles (3–5)
//     const otherRequests = await BondRequest.find(baseQuery)
//         .select('user offer want location radius')
//         .lean();

//     // 5. Preprocess maps
//     const requestMap = new Map<string, (typeof otherRequests)[0]>();
//     const offerMap = new Map<string, string[]>();

//     for (const req of otherRequests) {
//         const id = req._id.toString();
//         requestMap.set(id, req);
//         if (!offerMap.has(req.offer)) offerMap.set(req.offer, []);
//         offerMap.get(req.offer)!.push(id);
//     }

//     const getWant = (id: string): string => {
//         if (id === bondRequestId) return startRequest.want;
//         return requestMap.get(id)!.want;
//     };

//     // 6. BFS for cycles (3–5)
//     const queue: { path: string[]; seen: Set<string> }[] = [
//         { path: [bondRequestId], seen: new Set([bondRequestId]) },
//     ];
//     const seenHashes = new Set<string>();

//     while (queue.length) {
//         const { path, seen } = queue.shift()!;
//         const lastId = path[path.length - 1];
//         const lastWant = getWant(lastId);
//         const nextIds = offerMap.get(lastWant) || [];

//         for (const nextId of nextIds) {
//             if (seen.has(nextId)) {
//                 if (nextId === bondRequestId && path.length >= 3) {
//                     const cycle = [...path];
//                     const hash = [...cycle].sort().join('-');
//                     if (!seenHashes.has(hash)) {
//                         seenHashes.add(hash);
//                         matches.push(cycle);
//                     }
//                 }
//                 continue;
//             }

//             if (path.length < maxCycleSize) {
//                 queue.push({
//                     path: [...path, nextId],
//                     seen: new Set(seen).add(nextId),
//                 });
//             }
//         }
//     }

//     // 7. Populate match requests
//     const result: { matchRequest: any[] }[] = [];

//     for (const matchIds of matches) {
//         const populated = await BondRequest.find({
//             _id: { $in: matchIds },
//         })
//             .populate({ path: 'user', select: 'name profile_image' })
//             .lean();

//         const ordered = matchIds.map((id) =>
//             populated.find((p) => p._id.toString() === id)
//         );

//         result.push({ matchRequest: ordered });
//     }

//     return result;
// };

export const getMatchingBondRequest = async (
    userId: string,
    bondRequestId: string
): Promise<{ matchRequest: any[] }[]> => {
    const maxCycleSize = 5;
    const maxResults = 100;

    // 1. Fetch initiating bond request
    const startRequest = await BondRequest.findOne({
        _id: bondRequestId,
        user: userId,
        status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
    })
        .select('offer want status location radius')
        .lean();

    if (!startRequest) {
        throw new Error('Bond request not found or not eligible for linking.');
    }

    // 2. Apply geolocation filter (if radius and location present)
    const geoFilter: any = {};
    if (startRequest.location && startRequest.radius) {
        const [lng, lat] = startRequest.location.coordinates;
        geoFilter.location = {
            $geoWithin: {
                $centerSphere: [[lng, lat], startRequest.radius / 6371], // km to radians
            },
        };
    }

    // 3. Base filter for other bond requests
    const baseQuery = {
        _id: { $ne: bondRequestId },
        status: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
        ...geoFilter,
    };

    const matches: string[][] = [];

    // 4. Direct 2-user match
    const directMatches = await BondRequest.find({
        ...baseQuery,
        offer: startRequest.want,
        want: startRequest.offer,
    })
        .select('_id')
        .lean();

    for (const match of directMatches) {
        matches.push([bondRequestId, match._id.toString()]);
    }

    // 5. Load all other requests for cycle match
    const otherRequests = await BondRequest.find(baseQuery)
        .select('_id user offer want location radius')
        .lean();

    // Build maps
    const requestMap = new Map<string, (typeof otherRequests)[0]>();
    const offerMap = new Map<string, string[]>();

    for (const req of otherRequests) {
        const id = req._id.toString();
        requestMap.set(id, req);
        if (!offerMap.has(req.offer)) offerMap.set(req.offer, []);
        offerMap.get(req.offer)!.push(id);
    }

    const getWant = (id: string): string => {
        if (id === bondRequestId) return startRequest.want;
        return requestMap.get(id)!.want;
    };

    // 6. BFS for 3–5-user cycles
    const queue: { path: string[]; seen: Set<string> }[] = [
        { path: [bondRequestId], seen: new Set([bondRequestId]) },
    ];

    const seenHashes = new Set<string>();

    while (queue.length) {
        const { path, seen } = queue.shift()!;
        const lastId = path[path.length - 1];
        const lastWant = getWant(lastId);
        const nextIds = offerMap.get(lastWant) || [];

        for (const nextId of nextIds) {
            if (seen.has(nextId)) {
                // cycle found
                if (nextId === bondRequestId && path.length >= 3) {
                    const cycle = [...path];
                    const hash = cycle.join('-'); // preserve order
                    if (!seenHashes.has(hash)) {
                        seenHashes.add(hash);
                        matches.push(cycle);
                        if (matches.length >= maxResults) break;
                    }
                }
                continue;
            }

            if (path.length < maxCycleSize) {
                queue.push({
                    path: [...path, nextId],
                    seen: new Set(seen).add(nextId),
                });
            }
        }

        if (matches.length >= maxResults) break;
    }

    // 7. Populate all requests with one DB call
    const allIds = [...new Set(matches.flat())];
    const allPopulated = await BondRequest.find({ _id: { $in: allIds } })
        .populate({ path: 'user', select: 'name profile_image' })
        .lean();

    const populatedMap = new Map(
        allPopulated.map((req) => [req._id.toString(), req])
    );

    // 8. Build final result
    const result: { matchRequest: any[] }[] = [];

    for (const matchIds of matches.slice(0, maxResults)) {
        const ordered = matchIds.map((id) => populatedMap.get(id));
        result.push({ matchRequest: ordered });
    }

    return result;
};

const bondRequestService = {
    createBondRequestIntoDB,
    getAllBondRequests,
    getSingleBondRequest,
    updateBondRequestIntoDB,
    deleteBondRequestFromDB,
    myBondRequests,
    getMatchingBondRequest,
};

export default bondRequestService;
