import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardEdit,
  FileSpreadsheet,
  Plus,
  Search,
  Download,
  Printer,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  Building2,
  TrendingUp,
  AlertTriangle,
  Copy,
  Sparkles,
  Check,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

// ============================================================================
// 1. CONSTANTS & BASELINE 2026 PORTFOLIO DATA (30 FARMS / 1,270 SOWS)
// ============================================================================
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const MONTH_SEASONALITY = [
  1.00, 0.96, 1.04, 1.01, 0.98, 1.02, 1.03, 0.99, 1.01, 1.00, 0.97, 0.99
];

const INITIAL_FARM_PROFILES = [
  // 15 Active / Synced Farms
  { id: 'FARM-01', name: 'Green Valley Swine Farm', type: 'Farrow-to-Finish', sows: 85, boars: 6, gilts: 18, status: 'Active / Synced', targetAnnualBorn: 1280, farrowRate: 91.2, litterIndex: 2.32, wsi: 6.5 },
  { id: 'FARM-02', name: 'San Isidro Breeding Station', type: 'Sow-Weaner', sows: 65, boars: 5, gilts: 14, status: 'Active / Synced', targetAnnualBorn: 960, farrowRate: 90.5, litterIndex: 2.28, wsi: 7.0 },
  { id: 'FARM-03', name: 'Calamba Agro-Industrial Piggery', type: 'Farrow-to-Finish', sows: 95, boars: 7, gilts: 21, status: 'Active / Synced', targetAnnualBorn: 1450, farrowRate: 91.8, litterIndex: 2.34, wsi: 6.2 },
  { id: 'FARM-04', name: 'Batangas Premier Swine Hub', type: 'Farrow-to-Finish', sows: 75, boars: 5, gilts: 16, status: 'Active / Synced', targetAnnualBorn: 1120, farrowRate: 90.8, litterIndex: 2.29, wsi: 6.8 },
  { id: 'FARM-05', name: 'Rosario Breeders Corp.', type: 'Farrow-to-Wean', sows: 55, boars: 4, gilts: 12, status: 'Active / Synced', targetAnnualBorn: 810, farrowRate: 89.6, litterIndex: 2.25, wsi: 7.2 },
  { id: 'FARM-06', name: 'Tagaytay Highland Pork Project', type: 'Farrow-to-Finish', sows: 60, boars: 4, gilts: 13, status: 'Active / Synced', targetAnnualBorn: 890, farrowRate: 90.4, litterIndex: 2.27, wsi: 7.0 },
  { id: 'FARM-07', name: 'Lipeno Swine Breeding Farm', type: 'Farrow-to-Finish', sows: 70, boars: 5, gilts: 15, status: 'Active / Synced', targetAnnualBorn: 1050, farrowRate: 91.0, litterIndex: 2.30, wsi: 6.6 },
  { id: 'FARM-08', name: 'Cavite Agricultural Ventures', type: 'Sow-Weaner', sows: 50, boars: 4, gilts: 11, status: 'Active / Synced', targetAnnualBorn: 730, farrowRate: 89.2, litterIndex: 2.24, wsi: 7.3 },
  { id: 'FARM-09', name: 'Laguna Elite Swine Project', type: 'Farrow-to-Finish', sows: 60, boars: 4, gilts: 13, status: 'Active / Synced', targetAnnualBorn: 900, farrowRate: 90.6, litterIndex: 2.28, wsi: 6.9 },
  { id: 'FARM-10', name: 'Alaminos Swine Enterprise', type: 'Farrow-to-Wean', sows: 45, boars: 3, gilts: 10, status: 'Active / Synced', targetAnnualBorn: 660, farrowRate: 89.4, litterIndex: 2.24, wsi: 7.1 },
  { id: 'FARM-11', name: 'Tanauan Prime Piggery', type: 'Farrow-to-Finish', sows: 45, boars: 3, gilts: 10, status: 'Active / Synced', targetAnnualBorn: 670, farrowRate: 90.1, litterIndex: 2.26, wsi: 7.0 },
  { id: 'FARM-12', name: 'Mendez Livestock Farm', type: 'Sow-Weaner', sows: 35, boars: 3, gilts: 8, status: 'Active / Synced', targetAnnualBorn: 510, farrowRate: 88.8, litterIndex: 2.22, wsi: 7.5 },
  { id: 'FARM-13', name: 'Silang Agro-Swine Hub', type: 'Farrow-to-Finish', sows: 30, boars: 2, gilts: 7, status: 'Active / Synced', targetAnnualBorn: 440, farrowRate: 89.5, litterIndex: 2.25, wsi: 7.2 },
  { id: 'FARM-14', name: 'Naic Breeding Operation', type: 'Farrow-to-Wean', sows: 25, boars: 2, gilts: 6, status: 'Active / Synced', targetAnnualBorn: 360, farrowRate: 88.5, litterIndex: 2.20, wsi: 7.6 },
  { id: 'FARM-15', name: 'Trece Martires Swine Corp.', type: 'Farrow-to-Finish', sows: 22, boars: 2, gilts: 5, status: 'Active / Synced', targetAnnualBorn: 330, farrowRate: 89.0, litterIndex: 2.23, wsi: 7.4 },

  // 4 Pending Sync Farms
  { id: 'FARM-16', name: 'Lucena Livestock Coop', type: 'Farrow-to-Finish', sows: 38, boars: 3, gilts: 8, status: 'Pending Sync', targetAnnualBorn: 520, farrowRate: 88.2, litterIndex: 2.20, wsi: 7.6 },
  { id: 'FARM-17', name: 'Quezon Techno-Piggery', type: 'Sow-Weaner', sows: 32, boars: 2, gilts: 7, status: 'Pending Sync', targetAnnualBorn: 430, farrowRate: 87.8, litterIndex: 2.18, wsi: 7.8 },
  { id: 'FARM-18', name: 'Tayabas Pork Producers', type: 'Farrow-to-Wean', sows: 28, boars: 2, gilts: 6, status: 'Pending Sync', targetAnnualBorn: 370, farrowRate: 87.5, litterIndex: 2.17, wsi: 7.9 },
  { id: 'FARM-19', name: 'Candelaria Swine Project', type: 'Farrow-to-Finish', sows: 25, boars: 2, gilts: 6, status: 'Pending Sync', targetAnnualBorn: 340, farrowRate: 88.0, litterIndex: 2.19, wsi: 7.7 },

  // 11 Inactive Farms (Total Sows = 1,270 across all 30)
  { id: 'FARM-20', name: 'Sariaya Agro-Livestock Inc.', type: 'Farrow-to-Finish', sows: 35, boars: 2, gilts: 8, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-21', name: 'Tiaong Heritage Piggery', type: 'Sow-Weaner', sows: 32, boars: 2, gilts: 7, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-22', name: 'Dolores Highland Swine', type: 'Farrow-to-Wean', sows: 30, boars: 2, gilts: 7, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-23', name: 'San Pablo Swine Growers', type: 'Farrow-to-Finish', sows: 34, boars: 2, gilts: 7, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-24', name: 'Nagcarlan Breeders Guild', type: 'Sow-Weaner', sows: 28, boars: 2, gilts: 6, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-25', name: 'Liliw Valley Pork Farm', type: 'Farrow-to-Finish', sows: 31, boars: 2, gilts: 7, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-26', name: 'Magdalena Swine Enterprise', type: 'Farrow-to-Wean', sows: 29, boars: 2, gilts: 6, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-27', name: 'Pagsanjan River Piggery', type: 'Farrow-to-Finish', sows: 33, boars: 2, gilts: 7, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-28', name: 'Sta. Cruz Delta Swine', type: 'Sow-Weaner', sows: 27, boars: 2, gilts: 6, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-29', name: 'Pililla Windmill Hog Farm', type: 'Farrow-to-Finish', sows: 26, boars: 2, gilts: 6, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 },
  { id: 'FARM-30', name: 'Cardona Swine Cooperative', type: 'Farrow-to-Wean', sows: 25, boars: 2, gilts: 5, status: 'Inactive', targetAnnualBorn: 0, farrowRate: 0, litterIndex: 0, wsi: 0 }
];

// ============================================================================
// 2. DATA GENERATION & CALCULATION ENGINE
// ============================================================================

/**
 * Generates baseline 12-month raw input records for a farm profile.
 * Note: For farms 1-19, targetAnnualBorn sums to 13,820 across all 19,
 * with Active/Synced (1-15) summing to 12,160 born!
 */
function buildInitialFarmMonths(profile) {
  const isInactive = profile.status === 'Inactive' || profile.targetAnnualBorn === 0;
  const isFarrowToFinish = profile.type === 'Farrow-to-Finish';
  const monthlyBornTarget = profile.targetAnnualBorn / 12;

  const months = {};
  MONTHS.forEach((m, idx) => {
    const season = MONTH_SEASONALITY[idx];

    if (isInactive) {
      months[m] = {
        // I. Breeding
        noOfBred: 0,
        weanToServiceInterval: 0,
        repeatBreeders: 0,
        // II. Farrowing
        bredToFarrow: 0,
        noOfFarrowings: 0,
        farrowingInterval: 0,
        litterIndex: 0,
        totalPigletsBorn: 0,
        stillbirth: 0,
        mummified: 0,
        condemned: 0,
        servicesPerLitter: 0,
        aveBirthWeight: 0,
        // III. Weaning
        totalLittersWeaned: 0,
        totalPigletsWeaned: 0,
        aveWeaningWeight: 0,
        aveWeaningAge: 0,
        adj30DayWt: 0,
        // IV. Starter to Finisher
        startFatteningWt: 0,
        aveStarterAge: 0,
        ave75DayWt: 0,
        aveFinisherLiveWt: 0,
        primeSold: 0,
        oversizeSold: 0,
        slowGrowSold: 0,
        emergencySold: 0,
        aveMarketAge: 0,
        adgGrams: 0,
        adj150DayWt: 0,
        adj180DayWt: 0,
        starterFinisherMortRate: 0,
        // V. Herd Mortality
        mortSucklings: 0,
        mortWeaners: 0,
        mortFinishers: 0,
        mortSows: 0,
        mortBoars: 0,
        mortGilts: 0,
        // VI. Inventory (End of Month)
        invSucklings: 0,
        invWeaners: 0,
        invFinishers: 0,
        invSows: profile.sows,
        invBoars: profile.boars,
        invGilts: profile.gilts
      };
      return;
    }

    const totalBorn = Math.max(1, Math.round(monthlyBornTarget * season));
    const avgBornPerLitter = 10.4;
    const farrowings = Math.max(1, Math.round(totalBorn / avgBornPerLitter));
    const bredToFarrow = Math.max(farrowings, Math.round(farrowings / (profile.farrowRate / 100)));
    const noOfBred = Math.round(bredToFarrow * 1.12);
    const repeatBreeders = Math.max(0, Math.round(noOfBred * 0.075));

    const stillbirth = Math.round(totalBorn * 0.032);
    const mummified = Math.round(totalBorn * 0.01);
    const condemned = idx % 4 === 0 && profile.sows >= 60 ? 1 : 0;
    const bornAlive = Math.max(0, totalBorn - stillbirth - mummified - condemned);

    const littersWeaned = farrowings;
    const pigletsWeaned = Math.max(0, Math.round(bornAlive * 0.946));

    // Finisher metrics only for Farrow-to-Finish
    const totalSold = isFarrowToFinish ? Math.round(pigletsWeaned * 0.955) : 0;
    const primeSold = isFarrowToFinish ? Math.round(totalSold * 0.92) : 0;
    const oversizeSold = isFarrowToFinish ? Math.round(totalSold * 0.015) : 0;
    const slowGrowSold = isFarrowToFinish ? Math.round(totalSold * 0.045) : 0;
    const emergencySold = isFarrowToFinish ? Math.max(0, totalSold - primeSold - oversizeSold - slowGrowSold) : 0;

    // Standing inventories
    const invSucklings = Math.round(bornAlive * 0.93);
    const invWeaners = isFarrowToFinish ? Math.round(pigletsWeaned * 2.05) : Math.round(pigletsWeaned * 0.35);
    const invFinishers = isFarrowToFinish ? Math.round(pigletsWeaned * 3.15) : 0;

    // Mortalities
    const mortSucklings = Math.max(0, bornAlive - pigletsWeaned);
    const mortWeaners = Math.max(0, Math.round(invWeaners * 0.011));
    const mortFinishers = isFarrowToFinish ? Math.max(0, Math.round(invFinishers * 0.013)) : 0;
    const mortSows = idx % 3 === 0 && profile.sows >= 50 ? 1 : 0;
    const mortBoars = 0;
    const mortGilts = idx % 6 === 0 && profile.gilts >= 12 ? 1 : 0;

    months[m] = {
      // I. Breeding
      noOfBred,
      weanToServiceInterval: Number((profile.wsi + (idx % 3 === 0 ? 0.2 : -0.1)).toFixed(1)),
      repeatBreeders,
      // II. Farrowing
      bredToFarrow,
      noOfFarrowings: farrowings,
      farrowingInterval: 146 - (idx % 3),
      litterIndex: profile.litterIndex,
      totalPigletsBorn: totalBorn,
      stillbirth,
      mummified,
      condemned,
      servicesPerLitter: 1.92,
      aveBirthWeight: 1.42,
      // III. Weaning
      totalLittersWeaned: littersWeaned,
      totalPigletsWeaned: pigletsWeaned,
      aveWeaningWeight: 6.65,
      aveWeaningAge: 28,
      adj30DayWt: 8.35,
      // IV. Starter to Finisher
      startFatteningWt: isFarrowToFinish ? 25.5 : 0,
      aveStarterAge: isFarrowToFinish ? 70 : 0,
      ave75DayWt: isFarrowToFinish ? 55.8 : 0,
      aveFinisherLiveWt: isFarrowToFinish ? 112.4 : 0,
      primeSold,
      oversizeSold,
      slowGrowSold,
      emergencySold,
      aveMarketAge: isFarrowToFinish ? 166 : 0,
      adgGrams: isFarrowToFinish ? 572 : 0,
      adj150DayWt: isFarrowToFinish ? 95.0 : 0,
      adj180DayWt: isFarrowToFinish ? 123.5 : 0,
      starterFinisherMortRate: isFarrowToFinish ? 1.15 : 0,
      // V. Herd Mortality
      mortSucklings,
      mortWeaners,
      mortFinishers,
      mortSows,
      mortBoars,
      mortGilts,
      // VI. Inventory
      invSucklings,
      invWeaners,
      invFinishers,
      invSows: profile.sows,
      invBoars: profile.boars,
      invGilts: profile.gilts
    };
  });

  return months;
}

function buildInitialDatabase() {
  return INITIAL_FARM_PROFILES.map((profile) => ({
    ...profile,
    months: buildInitialFarmMonths(profile)
  }));
}

/**
 * Computes all derived PIgS metrics for a single month record,
 * including beginning-of-month inventory carryover from the prior month.
 */
function computeMonthDerived(mData, prevMonthEndInv = null) {
  const repeatPct = mData.noOfBred > 0 ? (mData.repeatBreeders / mData.noOfBred) * 100 : 0;
  const farrowingRate = mData.bredToFarrow > 0 ? (mData.noOfFarrowings / mData.bredToFarrow) * 100 : 0;

  const bornAlive = Math.max(
    0,
    mData.totalPigletsBorn - mData.stillbirth - mData.mummified - mData.condemned
  );
  const bornExclMM = Math.max(0, mData.totalPigletsBorn - mData.mummified);

  const farr = mData.noOfFarrowings;
  const bornPerLitter = farr > 0 ? mData.totalPigletsBorn / farr : 0;
  const bornExclMMPerLitter = farr > 0 ? bornExclMM / farr : 0;
  const bornAlivePerLitter = farr > 0 ? bornAlive / farr : 0;
  const stillbornPerLitter = farr > 0 ? mData.stillbirth / farr : 0;
  const mummifiedPerLitter = farr > 0 ? mData.mummified / farr : 0;

  const aveWeaningSize = mData.totalLittersWeaned > 0 ? mData.totalPigletsWeaned / mData.totalLittersWeaned : 0;
  const preWeaningMort = bornAlive > 0 ? Math.max(0, ((bornAlive - mData.totalPigletsWeaned) / bornAlive) * 100) : 0;
  const postWeaningMort = mData.totalPigletsWeaned > 0 ? (mData.mortWeaners / mData.totalPigletsWeaned) * 100 : 0;
  const pwsy = aveWeaningSize * mData.litterIndex;

  const totalFinishersSold =
    mData.primeSold + mData.oversizeSold + mData.slowGrowSold + mData.emergencySold;

  const endInventory =
    mData.invSucklings +
    mData.invWeaners +
    mData.invFinishers +
    mData.invSows +
    mData.invBoars +
    mData.invGilts;

  const startInventory = prevMonthEndInv !== null ? prevMonthEndInv : endInventory;
  const aveInventory = Math.round((startInventory + endInventory) / 2);

  const totalMortality =
    mData.mortSucklings +
    mData.mortWeaners +
    mData.mortFinishers +
    mData.mortSows +
    mData.mortBoars +
    mData.mortGilts;

  const herdMortPct = aveInventory > 0 ? (totalMortality / aveInventory) * 100 : 0;

  return {
    ...mData,
    repeatPct,
    farrowingRate,
    bornAlive,
    bornExclMM,
    bornPerLitter,
    bornExclMMPerLitter,
    bornAlivePerLitter,
    stillbornPerLitter,
    mummifiedPerLitter,
    aveWeaningSize,
    preWeaningMort,
    postWeaningMort,
    pwsy,
    totalFinishersSold,
    startInventory,
    aveInventory,
    totalMortality,
    endInventory,
    herdMortPct
  };
}

/**
 * Generates the complete 12-month + Annual/Avg computed dataset for one farm.
 */
function computeFarmReport(farm) {
  const monthly = {};
  let prevEnd = null;

  MONTHS.forEach((m) => {
    const derived = computeMonthDerived(farm.months[m], prevEnd);
    monthly[m] = derived;
    prevEnd = derived.endInventory;
  });

  // Helper to sum or average across active months (or all 12 months)
  const sumKey = (key) => MONTHS.reduce((acc, m) => acc + (monthly[m][key] || 0), 0);
  const avgActiveKey = (key) => {
    const active = MONTHS.filter((m) => monthly[m][key] > 0);
    if (active.length === 0) return 0;
    return active.reduce((acc, m) => acc + monthly[m][key], 0) / active.length;
  };
  const avgAllKey = (key) => MONTHS.reduce((acc, m) => acc + (monthly[m][key] || 0), 0) / 12;

  const totalBred = sumKey('noOfBred');
  const totalRepeat = sumKey('repeatBreeders');
  const totalBredToFarrow = sumKey('bredToFarrow');
  const totalFarrowings = sumKey('noOfFarrowings');
  const totalBorn = sumKey('totalPigletsBorn');
  const totalBornAlive = sumKey('bornAlive');
  const totalStillbirth = sumKey('stillbirth');
  const totalMummified = sumKey('mummified');
  const totalCondemned = sumKey('condemned');
  const totalBornExclMM = sumKey('bornExclMM');
  const totalLittersWeaned = sumKey('totalLittersWeaned');
  const totalPigletsWeaned = sumKey('totalPigletsWeaned');
  const totalFinishersSold = sumKey('totalFinishersSold');

  const annual = {
    noOfBred: totalBred,
    weanToServiceInterval: avgActiveKey('weanToServiceInterval'),
    repeatBreeders: totalRepeat,
    repeatPct: totalBred > 0 ? (totalRepeat / totalBred) * 100 : 0,

    bredToFarrow: totalBredToFarrow,
    noOfFarrowings: totalFarrowings,
    farrowingInterval: avgActiveKey('farrowingInterval'),
    farrowingRate: totalBredToFarrow > 0 ? (totalFarrowings / totalBredToFarrow) * 100 : 0,
    litterIndex: avgActiveKey('litterIndex'),
    totalPigletsBorn: totalBorn,
    bornAlive: totalBornAlive,
    stillbirth: totalStillbirth,
    mummified: totalMummified,
    condemned: totalCondemned,
    servicesPerLitter: avgActiveKey('servicesPerLitter'),
    bornPerLitter: totalFarrowings > 0 ? totalBorn / totalFarrowings : 0,
    bornExclMMPerLitter: totalFarrowings > 0 ? totalBornExclMM / totalFarrowings : 0,
    bornAlivePerLitter: totalFarrowings > 0 ? totalBornAlive / totalFarrowings : 0,
    stillbornPerLitter: totalFarrowings > 0 ? totalStillbirth / totalFarrowings : 0,
    mummifiedPerLitter: totalFarrowings > 0 ? totalMummified / totalFarrowings : 0,
    aveBirthWeight: avgActiveKey('aveBirthWeight'),

    totalLittersWeaned,
    totalPigletsWeaned,
    aveWeaningSize: totalLittersWeaned > 0 ? totalPigletsWeaned / totalLittersWeaned : 0,
    aveWeaningWeight: avgActiveKey('aveWeaningWeight'),
    aveWeaningAge: avgActiveKey('aveWeaningAge'),
    adj30DayWt: avgActiveKey('adj30DayWt'),
    pwsy: avgActiveKey('pwsy'),
    preWeaningMort: totalBornAlive > 0 ? Math.max(0, ((totalBornAlive - totalPigletsWeaned) / totalBornAlive) * 100) : 0,
    postWeaningMort: totalPigletsWeaned > 0 ? (sumKey('mortWeaners') / totalPigletsWeaned) * 100 : 0,

    startFatteningWt: avgActiveKey('startFatteningWt'),
    aveStarterAge: avgActiveKey('aveStarterAge'),
    ave75DayWt: avgActiveKey('ave75DayWt'),
    aveFinisherLiveWt: avgActiveKey('aveFinisherLiveWt'),
    totalFinishersSold,
    primeSold: sumKey('primeSold'),
    oversizeSold: sumKey('oversizeSold'),
    slowGrowSold: sumKey('slowGrowSold'),
    emergencySold: sumKey('emergencySold'),
    aveMarketAge: avgActiveKey('aveMarketAge'),
    adgGrams: avgActiveKey('adgGrams'),
    adj150DayWt: avgActiveKey('adj150DayWt'),
    adj180DayWt: avgActiveKey('adj180DayWt'),
    starterFinisherMortRate: avgActiveKey('starterFinisherMortRate'),

    aveInventory: Math.round(avgAllKey('aveInventory')),
    mortSucklings: sumKey('mortSucklings'),
    mortWeaners: sumKey('mortWeaners'),
    mortFinishers: sumKey('mortFinishers'),
    mortSows: sumKey('mortSows'),
    mortBoars: sumKey('mortBoars'),
    mortGilts: sumKey('mortGilts'),
    herdMortPct: avgActiveKey('herdMortPct'),

    startInventory: monthly['JAN'].startInventory,
    invSucklings: monthly['DEC'].invSucklings,
    invWeaners: monthly['DEC'].invWeaners,
    invFinishers: monthly['DEC'].invFinishers,
    invSows: monthly['DEC'].invSows,
    invBoars: monthly['DEC'].invBoars,
    invGilts: monthly['DEC'].invGilts,
    endInventory: monthly['DEC'].endInventory
  };

  return { farm, monthly, annual };
}

/**
 * Consolidates an array of farms into a single master portfolio PIgS report.
 */
function consolidatePortfolio(farms) {
  const farmReports = farms.map(computeFarmReport);
  const monthly = {};

  MONTHS.forEach((m) => {
    const sumM = (key) => farmReports.reduce((acc, r) => acc + (r.monthly[m][key] || 0), 0);
    const weightedAvgM = (valKey, weightKey) => {
      let num = 0;
      let den = 0;
      farmReports.forEach((r) => {
        const val = r.monthly[m][valKey] || 0;
        const w = r.monthly[m][weightKey] || 0;
        if (val > 0 && w > 0) {
          num += val * w;
          den += w;
        }
      });
      return den > 0 ? num / den : 0;
    };

    const noOfBred = sumM('noOfBred');
    const repeatBreeders = sumM('repeatBreeders');
    const bredToFarrow = sumM('bredToFarrow');
    const noOfFarrowings = sumM('noOfFarrowings');
    const totalPigletsBorn = sumM('totalPigletsBorn');
    const bornAlive = sumM('bornAlive');
    const stillbirth = sumM('stillbirth');
    const mummified = sumM('mummified');
    const condemned = sumM('condemned');
    const bornExclMM = sumM('bornExclMM');
    const totalLittersWeaned = sumM('totalLittersWeaned');
    const totalPigletsWeaned = sumM('totalPigletsWeaned');
    const totalFinishersSold = sumM('totalFinishersSold');

    const startInventory = sumM('startInventory');
    const aveInventory = sumM('aveInventory');
    const endInventory = sumM('endInventory');
    const totalMortality = sumM('totalMortality');

    const aveWeaningSize = totalLittersWeaned > 0 ? totalPigletsWeaned / totalLittersWeaned : 0;
    const litterIndex = weightedAvgM('litterIndex', 'invSows');

    monthly[m] = {
      noOfBred,
      weanToServiceInterval: weightedAvgM('weanToServiceInterval', 'noOfBred'),
      repeatBreeders,
      repeatPct: noOfBred > 0 ? (repeatBreeders / noOfBred) * 100 : 0,

      bredToFarrow,
      noOfFarrowings,
      farrowingInterval: weightedAvgM('farrowingInterval', 'noOfFarrowings'),
      farrowingRate: bredToFarrow > 0 ? (noOfFarrowings / bredToFarrow) * 100 : 0,
      litterIndex,
      totalPigletsBorn,
      bornAlive,
      stillbirth,
      mummified,
      condemned,
      servicesPerLitter: weightedAvgM('servicesPerLitter', 'noOfFarrowings'),
      bornPerLitter: noOfFarrowings > 0 ? totalPigletsBorn / noOfFarrowings : 0,
      bornExclMMPerLitter: noOfFarrowings > 0 ? bornExclMM / noOfFarrowings : 0,
      bornAlivePerLitter: noOfFarrowings > 0 ? bornAlive / noOfFarrowings : 0,
      stillbornPerLitter: noOfFarrowings > 0 ? stillbirth / noOfFarrowings : 0,
      mummifiedPerLitter: noOfFarrowings > 0 ? mummified / noOfFarrowings : 0,
      aveBirthWeight: weightedAvgM('aveBirthWeight', 'totalPigletsBorn'),

      totalLittersWeaned,
      totalPigletsWeaned,
      aveWeaningSize,
      aveWeaningWeight: weightedAvgM('aveWeaningWeight', 'totalPigletsWeaned'),
      aveWeaningAge: weightedAvgM('aveWeaningAge', 'totalLittersWeaned'),
      adj30DayWt: weightedAvgM('adj30DayWt', 'totalPigletsWeaned'),
      pwsy: aveWeaningSize * litterIndex,
      preWeaningMort: bornAlive > 0 ? Math.max(0, ((bornAlive - totalPigletsWeaned) / bornAlive) * 100) : 0,
      postWeaningMort: totalPigletsWeaned > 0 ? (sumM('mortWeaners') / totalPigletsWeaned) * 100 : 0,

      startFatteningWt: weightedAvgM('startFatteningWt', 'totalFinishersSold'),
      aveStarterAge: weightedAvgM('aveStarterAge', 'totalFinishersSold'),
      ave75DayWt: weightedAvgM('ave75DayWt', 'totalFinishersSold'),
      aveFinisherLiveWt: weightedAvgM('aveFinisherLiveWt', 'totalFinishersSold'),
      totalFinishersSold,
      primeSold: sumM('primeSold'),
      oversizeSold: sumM('oversizeSold'),
      slowGrowSold: sumM('slowGrowSold'),
      emergencySold: sumM('emergencySold'),
      aveMarketAge: weightedAvgM('aveMarketAge', 'totalFinishersSold'),
      adgGrams: weightedAvgM('adgGrams', 'totalFinishersSold'),
      adj150DayWt: weightedAvgM('adj150DayWt', 'totalFinishersSold'),
      adj180DayWt: weightedAvgM('adj180DayWt', 'totalFinishersSold'),
      starterFinisherMortRate: weightedAvgM('starterFinisherMortRate', 'invFinishers'),

      aveInventory,
      mortSucklings: sumM('mortSucklings'),
      mortWeaners: sumM('mortWeaners'),
      mortFinishers: sumM('mortFinishers'),
      mortSows: sumM('mortSows'),
      mortBoars: sumM('mortBoars'),
      mortGilts: sumM('mortGilts'),
      herdMortPct: aveInventory > 0 ? (totalMortality / aveInventory) * 100 : 0,

      startInventory,
      invSucklings: sumM('invSucklings'),
      invWeaners: sumM('invWeaners'),
      invFinishers: sumM('invFinishers'),
      invSows: sumM('invSows'),
      invBoars: sumM('invBoars'),
      invGilts: sumM('invGilts'),
      endInventory
    };
  });

  // Compute consolidated annual column
  const sumA = (key) => MONTHS.reduce((acc, m) => acc + (monthly[m][key] || 0), 0);
  const avgA = (key) => {
    const active = MONTHS.filter((m) => monthly[m][key] > 0);
    return active.length > 0 ? active.reduce((acc, m) => acc + monthly[m][key], 0) / active.length : 0;
  };

  const totalBred = sumA('noOfBred');
  const totalRepeat = sumA('repeatBreeders');
  const totalBredToFarrow = sumA('bredToFarrow');
  const totalFarrowings = sumA('noOfFarrowings');
  const totalBorn = sumA('totalPigletsBorn');
  const totalBornAlive = sumA('bornAlive');
  const totalStillbirth = sumA('stillbirth');
  const totalMummified = sumA('mummified');
  const totalCondemned = sumA('condemned');
  const totalLittersWeaned = sumA('totalLittersWeaned');
  const totalPigletsWeaned = sumA('totalPigletsWeaned');

  const annual = {
    noOfBred: totalBred,
    weanToServiceInterval: avgA('weanToServiceInterval'),
    repeatBreeders: totalRepeat,
    repeatPct: totalBred > 0 ? (totalRepeat / totalBred) * 100 : 0,

    bredToFarrow: totalBredToFarrow,
    noOfFarrowings: totalFarrowings,
    farrowingInterval: avgA('farrowingInterval'),
    farrowingRate: totalBredToFarrow > 0 ? (totalFarrowings / totalBredToFarrow) * 100 : 0,
    litterIndex: avgA('litterIndex'),
    totalPigletsBorn: totalBorn,
    bornAlive: totalBornAlive,
    stillbirth: totalStillbirth,
    mummified: totalMummified,
    condemned: totalCondemned,
    servicesPerLitter: avgA('servicesPerLitter'),
    bornPerLitter: totalFarrowings > 0 ? totalBorn / totalFarrowings : 0,
    bornExclMMPerLitter: totalFarrowings > 0 ? (totalBorn - totalMummified) / totalFarrowings : 0,
    bornAlivePerLitter: totalFarrowings > 0 ? totalBornAlive / totalFarrowings : 0,
    stillbornPerLitter: totalFarrowings > 0 ? totalStillbirth / totalFarrowings : 0,
    mummifiedPerLitter: totalFarrowings > 0 ? totalMummified / totalFarrowings : 0,
    aveBirthWeight: avgA('aveBirthWeight'),

    totalLittersWeaned,
    totalPigletsWeaned,
    aveWeaningSize: totalLittersWeaned > 0 ? totalPigletsWeaned / totalLittersWeaned : 0,
    aveWeaningWeight: avgA('aveWeaningWeight'),
    aveWeaningAge: avgA('aveWeaningAge'),
    adj30DayWt: avgA('adj30DayWt'),
    pwsy: avgA('pwsy'),
    preWeaningMort: totalBornAlive > 0 ? Math.max(0, ((totalBornAlive - totalPigletsWeaned) / totalBornAlive) * 100) : 0,
    postWeaningMort: totalPigletsWeaned > 0 ? (sumA('mortWeaners') / totalPigletsWeaned) * 100 : 0,

    startFatteningWt: avgA('startFatteningWt'),
    aveStarterAge: avgA('aveStarterAge'),
    ave75DayWt: avgA('ave75DayWt'),
    aveFinisherLiveWt: avgA('aveFinisherLiveWt'),
    totalFinishersSold: sumA('totalFinishersSold'),
    primeSold: sumA('primeSold'),
    oversizeSold: sumA('oversizeSold'),
    slowGrowSold: sumA('slowGrowSold'),
    emergencySold: sumA('emergencySold'),
    aveMarketAge: avgA('aveMarketAge'),
    adgGrams: avgA('adgGrams'),
    adj150DayWt: avgA('adj150DayWt'),
    adj180DayWt: avgA('adj180DayWt'),
    starterFinisherMortRate: avgA('starterFinisherMortRate'),

    aveInventory: Math.round(MONTHS.reduce((acc, m) => acc + monthly[m].aveInventory, 0) / 12),
    mortSucklings: sumA('mortSucklings'),
    mortWeaners: sumA('mortWeaners'),
    mortFinishers: sumA('mortFinishers'),
    mortSows: sumA('mortSows'),
    mortBoars: sumA('mortBoars'),
    mortGilts: sumA('mortGilts'),
    herdMortPct: avgA('herdMortPct'),

    startInventory: monthly['JAN'].startInventory,
    invSucklings: monthly['DEC'].invSucklings,
    invWeaners: monthly['DEC'].invWeaners,
    invFinishers: monthly['DEC'].invFinishers,
    invSows: monthly['DEC'].invSows,
    invBoars: monthly['DEC'].invBoars,
    invGilts: monthly['DEC'].invGilts,
    endInventory: monthly['DEC'].endInventory
  };

  return { farmReports, monthly, annual };
}

// ============================================================================
// 3. EXACT 6-SECTION PIgS ROW SPECIFICATION (FOR TABLE & CSV EXPORT)
// ============================================================================
const PIGS_REPORT_ROWS = [
  { type: 'header', label: 'Parameters' },
  { type: 'section', label: 'I. Breeding:' },
  { key: 'noOfBred', label: 'No. of Bred (hd)', fmt: 'int' },
  { key: 'weanToServiceInterval', label: 'Weaning to Service Interval (day)', fmt: 'dec1' },
  { key: 'repeatBreeders', label: 'Repeat Breeders', fmt: 'int' },
  { key: 'repeatPct', label: 'Repeat %', fmt: 'dec1', computed: true },

  { type: 'section', label: 'II. Farrowing' },
  { key: 'bredToFarrow', label: 'Bred to Farrow (hd)', fmt: 'int' },
  { key: 'noOfFarrowings', label: 'No. of Farrowings (hd)', fmt: 'int' },
  { key: 'farrowingInterval', label: 'Farrowing interval (day)', fmt: 'int' },
  { key: 'farrowingRate', label: 'Farrowing Rate (%)', fmt: 'dec1', computed: true },
  { key: 'litterIndex', label: 'Litter Index (12 mo period)', fmt: 'dec2' },
  { key: 'totalPigletsBorn', label: 'Total Piglets Born (hd)', fmt: 'int' },
  { key: 'bornAlive', label: 'Total Piglets Born Alive (hd)', fmt: 'int', computed: true },
  { key: 'stillbirth', label: 'Stillbirth (hd)', fmt: 'int' },
  { key: 'mummified', label: 'Mummified (hd)', fmt: 'int' },
  { key: 'condemned', label: 'Condemned (hd)', fmt: 'int' },
  { key: 'servicesPerLitter', label: 'Services per Litter', fmt: 'dec2' },
  { key: 'bornPerLitter', label: 'Piglets Born per Litter', fmt: 'dec2', computed: true },
  { key: 'bornExclMMPerLitter', label: 'Piglets Born per Litter (excl MM)', fmt: 'dec2', computed: true },
  { key: 'bornAlivePerLitter', label: 'Piglets Born Alive Per Litter', fmt: 'dec2', computed: true },
  { key: 'stillbornPerLitter', label: 'Stillborn Per Litter', fmt: 'dec2', computed: true },
  { key: 'mummifiedPerLitter', label: 'Mummified Per Litter', fmt: 'dec2', computed: true },
  { key: 'aveBirthWeight', label: 'Ave Birth Weight (kg)', fmt: 'dec2' },

  { type: 'header', label: 'Parameters' },
  { type: 'section', label: 'III. Weaning' },
  { key: 'totalLittersWeaned', label: 'Total Litters Weaned', fmt: 'int' },
  { key: 'totalPigletsWeaned', label: 'Total Piglets Weaned', fmt: 'int' },
  { key: 'aveWeaningSize', label: 'Ave Weaning Size (hd)', fmt: 'dec2', computed: true },
  { key: 'aveWeaningWeight', label: 'Ave Weaning Weight (kg)', fmt: 'dec2' },
  { key: 'aveWeaningAge', label: 'Ave Weaning Age (day)', fmt: 'int' },
  { key: 'adj30DayWt', label: 'Adjusted 30-day Wt (kg)', fmt: 'dec2' },
  { key: 'pwsy', label: 'PWSY', fmt: 'dec1', computed: true },
  { key: 'preWeaningMort', label: 'Pre-Weaning Mortality (%)', fmt: 'dec1', computed: true },
  { key: 'postWeaningMort', label: 'Post Weaning Mortality (%)', fmt: 'dec1', computed: true },

  { type: 'header', label: 'Parameters' },
  { type: 'section', label: 'IV. Starter to Finisher' },
  { key: 'startFatteningWt', label: 'Ave Weight at the Start of Fattening', fmt: 'dec1' },
  { key: 'aveStarterAge', label: 'Ave Age in Days', fmt: 'int' },
  { key: 'ave75DayWt', label: 'Ave 75-Day Wt (kg)', fmt: 'dec1' },
  { key: 'aveFinisherLiveWt', label: 'Ave Finisher Live Wt (kg)', fmt: 'dec1' },
  { key: 'totalFinishersSold', label: 'Total Finishers Sold (hd)', fmt: 'int', computed: true },
  { key: 'primeSold', label: 'Prime', fmt: 'int' },
  { key: 'oversizeSold', label: 'Oversize (121 kg and above)', fmt: 'int' },
  { key: 'slowGrowSold', label: 'Slow Grow', fmt: 'int' },
  { key: 'emergencySold', label: 'Emergency Sale', fmt: 'int' },
  { key: 'aveMarketAge', label: 'Ave Market Age (day)', fmt: 'int' },
  { key: 'adgGrams', label: 'ADG, grams (Starter to Market)', fmt: 'int' },
  { key: 'adj150DayWt', label: 'Adjusted 150-day Wt (kg)', fmt: 'dec1' },
  { key: 'adj180DayWt', label: 'Adjusted 180-day Wt (kg)', fmt: 'dec1' },
  { key: 'starterFinisherMortRate', label: 'Mortality Rate (Starter-Finisher)', fmt: 'pct2' },

  { type: 'section', label: 'V. Herd Mortality' },
  { key: 'aveInventory', label: 'Ave Inventory (hd)', fmt: 'int', computed: true },
  { type: 'section', label: 'Stage (Total Hd)' },
  { key: 'mortSucklings', label: 'Sucklings', fmt: 'int' },
  { key: 'mortWeaners', label: 'Weaners', fmt: 'int' },
  { key: 'mortFinishers', label: 'Finishers', fmt: 'int' },
  { key: 'mortSows', label: 'Sows', fmt: 'int' },
  { key: 'mortBoars', label: 'Boars', fmt: 'int' },
  { key: 'mortGilts', label: 'Gilts', fmt: 'int' },
  { key: 'herdMortPct', label: '% Herd Mortality', fmt: 'pct2', computed: true },

  { type: 'header', label: 'VI. Inventory on Last Day of the Month:' },
  { key: 'startInventory', label: 'Inventory, 1st of the Month', fmt: 'int', computed: true },
  { key: 'aveInventory', label: 'Inventory for this month', fmt: 'int', computed: true },
  { key: 'invSucklings', label: 'Sucklings', fmt: 'int' },
  { key: 'invWeaners', label: 'Weaners', fmt: 'int' },
  { key: 'invFinishers', label: 'Finishers', fmt: 'int' },
  { key: 'invSows', label: 'Sows', fmt: 'int' },
  { key: 'invBoars', label: 'Boars', fmt: 'int' },
  { key: 'invGilts', label: 'Gilts', fmt: 'int' },
  { key: 'endInventory', label: 'Inventory, end of the Month Total', fmt: 'int', computed: true, bold: true }
];

function formatCellValue(val, fmt, isCsv = false) {
  if (val === undefined || val === null || isNaN(val)) return isCsv ? '0' : '—';
  if (fmt === 'int') {
    const rounded = Math.round(val);
    return isCsv ? String(rounded) : rounded.toLocaleString();
  }
  if (fmt === 'dec1') return Number(val).toFixed(1);
  if (fmt === 'dec2') return Number(val).toFixed(2);
  if (fmt === 'pct2') return `${Number(val).toFixed(2)}%`;
  return String(val);
}

// ============================================================================
// 4. REUSABLE UI COMPONENTS
// ============================================================================

function StatusBadge({ status }) {
  if (status === 'Active / Synced') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Active / Synced
      </span>
    );
  }
  if (status === 'Pending Sync') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Pending Sync
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <XCircle className="w-3.5 h-3.5 text-slate-400" />
      Inactive
    </span>
  );
}

function PigsMatrixTable({ reportData, title, subtitle }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-[#1E3A5F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded border border-white/15 self-start sm:self-auto">
          PIgS 6-Section Standard Format
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
              <th className="sticky left-0 z-10 bg-slate-100 text-left py-2.5 px-3 font-bold min-w-[240px] border-r border-slate-200">
                Parameters
              </th>
              {MONTHS.map((m) => (
                <th key={m} className="py-2.5 px-2.5 text-right font-semibold min-w-[68px]">
                  {m}
                </th>
              ))}
              <th className="py-2.5 px-3 text-right font-bold bg-emerald-50 text-emerald-900 border-l border-emerald-200 min-w-[92px]">
                ANNUAL / AVG
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PIGS_REPORT_ROWS.map((row, idx) => {
              if (row.type === 'header') {
                if (idx === 0) return null; // Already rendered in thead
                return (
                  <tr key={`hdr-${idx}`} className="bg-slate-100/90 text-slate-700 font-semibold border-y border-slate-200">
                    <td className="sticky left-0 z-10 bg-slate-100 py-2 px-3 border-r border-slate-200">
                      {row.label}
                    </td>
                    {MONTHS.map((m) => (
                      <td key={m} className="py-2 px-2.5 text-right text-[11px] text-slate-500">
                        {m}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-[11px] bg-emerald-50/70 text-emerald-800 border-l border-emerald-200">
                      ANNUAL / AVG
                    </td>
                  </tr>
                );
              }

              if (row.type === 'section') {
                return (
                  <tr key={`sec-${idx}`} className="bg-[#1E3A5F]/5 text-[#1E3A5F] font-bold">
                    <td
                      colSpan={14}
                      className="sticky left-0 z-10 py-2 px-3 text-xs tracking-wide uppercase"
                    >
                      {row.label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={`${row.key}-${idx}`}
                  className={`hover:bg-slate-50 transition-colors ${
                    row.bold
                      ? 'bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300'
                      : row.computed
                      ? 'bg-emerald-50/20 text-slate-800 font-medium'
                      : 'text-slate-700'
                  }`}
                >
                  <td
                    className={`sticky left-0 z-10 py-1.5 px-3 border-r border-slate-200 ${
                      row.bold ? 'bg-slate-100' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{row.label}</span>
                      {row.computed && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
                          auto
                        </span>
                      )}
                    </div>
                  </td>
                  {MONTHS.map((m) => (
                    <td key={m} className="py-1.5 px-2.5 text-right tabular-nums">
                      {formatCellValue(reportData.monthly[m][row.key], row.fmt)}
                    </td>
                  ))}
                  <td className="py-1.5 px-3 text-right font-bold tabular-nums bg-emerald-50/50 text-emerald-950 border-l border-emerald-200">
                    {formatCellValue(reportData.annual[row.key], row.fmt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// 5. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const STORAGE_KEY = 'itcph_pigs_portfolio_2026_v1';

  const [farms, setFarms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read localStorage:', e);
    }
    return buildInitialDatabase();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farms));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [farms]);

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'entry' | 'report'
  const [selectedFarmId, setSelectedFarmId] = useState('FARM-01');
  const [selectedMonth, setSelectedMonth] = useState('JAN');
  const [reportTargetId, setReportTargetId] = useState('CONSOLIDATED'); // 'CONSOLIDATED' or farm.id

  // Directory Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Add Farm Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFarmForm, setNewFarmForm] = useState({
    name: '',
    type: 'Farrow-to-Finish',
    sows: 40,
    boars: 3,
    gilts: 9,
    status: 'Active / Synced'
  });

  // Toast Notification
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  // Master Consolidated Calculation
  const consolidated = useMemo(() => consolidatePortfolio(farms), [farms]);

  // Portfolio Executive KPIs
  const kpis = useMemo(() => {
    const totalFarms = farms.length;
    const activeFarms = farms.filter((f) => f.status === 'Active / Synced');
    const pendingFarms = farms.filter((f) => f.status === 'Pending Sync');
    const inactiveFarms = farms.filter((f) => f.status === 'Inactive');

    const totalSows = farms.reduce((sum, f) => sum + (Number(f.sows) || 0), 0);

    // Active/Synced annual born (12,160 baseline) vs All Farms annual born
    const activeAnnualBorn = consolidated.farmReports
      .filter((r) => r.farm.status === 'Active / Synced')
      .reduce((sum, r) => sum + r.annual.totalPigletsBorn, 0);

    const allAnnualBorn = consolidated.annual.totalPigletsBorn;

    return {
      totalFarms,
      activeCount: activeFarms.length,
      pendingCount: pendingFarms.length,
      inactiveCount: inactiveFarms.length,
      totalSows,
      activeAnnualBorn,
      allAnnualBorn,
      avgFarrowingRate: consolidated.annual.farrowingRate,
      avgLitterIndex: consolidated.annual.litterIndex,
      standingInventory: consolidated.annual.endInventory
    };
  }, [farms, consolidated]);

  // Filtered Directory List
  const filteredReports = useMemo(() => {
    return consolidated.farmReports.filter(({ farm }) => {
      const matchesSearch =
        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || farm.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || farm.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [consolidated, searchQuery, statusFilter, typeFilter]);

  // Chart Datasets
  const farmBarChartData = useMemo(() => {
    return consolidated.farmReports
      .filter((r) => r.annual.totalPigletsBorn > 0)
      .map((r) => ({
        name: r.farm.name.replace(/(Swine|Farm|Piggery|Project|Corp\.|Hub|Station|Coop|Ventures|Enterprise|Operation|Producers)/g, '').trim(),
        fullName: r.farm.name,
        born: Math.round(r.annual.totalPigletsBorn),
        weaned: Math.round(r.annual.totalPigletsWeaned),
        sows: r.farm.sows
      }));
  }, [consolidated]);

  const monthlyTrendData = useMemo(() => {
    return MONTHS.map((m) => ({
      month: m,
      born: Math.round(consolidated.monthly[m].totalPigletsBorn),
      bornAlive: Math.round(consolidated.monthly[m].bornAlive),
      weaned: Math.round(consolidated.monthly[m].totalPigletsWeaned),
      sold: Math.round(consolidated.monthly[m].totalFinishersSold)
    }));
  }, [consolidated]);

  // Active Farm in Editor
  const activeFarmReport = useMemo(() => {
    return (
      consolidated.farmReports.find((r) => r.farm.id === selectedFarmId) ||
      consolidated.farmReports[0]
    );
  }, [consolidated, selectedFarmId]);

  const currentMonthRaw = activeFarmReport?.farm.months[selectedMonth];
  const currentMonthComputed = activeFarmReport?.monthly[selectedMonth];

  // Real-time Validation Checks for Current Month
  const validationWarnings = useMemo(() => {
    if (!currentMonthRaw) return [];
    const warnings = [];
    if (currentMonthRaw.noOfFarrowings > currentMonthRaw.bredToFarrow) {
      warnings.push('No. of Farrowings exceeds Bred to Farrow (Farrowing Rate > 100%).');
    }
    if (currentMonthRaw.repeatBreeders > currentMonthRaw.noOfBred) {
      warnings.push('Repeat Breeders exceeds total No. of Bred.');
    }
    if (
      currentMonthRaw.stillbirth + currentMonthRaw.mummified + currentMonthRaw.condemned >
      currentMonthRaw.totalPigletsBorn
    ) {
      warnings.push('Sum of Stillbirth, Mummified, and Condemned exceeds Total Piglets Born.');
    }
    if (currentMonthComputed && currentMonthRaw.totalPigletsWeaned > currentMonthComputed.bornAlive) {
      warnings.push('Total Piglets Weaned exceeds Piglets Born Alive (verify cross-fostering).');
    }
    return warnings;
  }, [currentMonthRaw, currentMonthComputed]);

  // Handlers for Data Entry Updates
  const updateMonthField = (field, rawVal) => {
    const val = rawVal === '' ? 0 : Math.max(0, Number(rawVal));
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id !== selectedFarmId) return f;
        const updatedMonths = {
          ...f.months,
          [selectedMonth]: {
            ...f.months[selectedMonth],
            [field]: val
          }
        };
        // Keep farm-level sow/boar/gilt profile synced with inventory edits
        const updatedSows = field === 'invSows' ? val : f.sows;
        const updatedBoars = field === 'invBoars' ? val : f.boars;
        const updatedGilts = field === 'invGilts' ? val : f.gilts;

        return {
          ...f,
          sows: updatedSows,
          boars: updatedBoars,
          gilts: updatedGilts,
          months: updatedMonths
        };
      })
    );
  };

  const updateFarmMeta = (field, value) => {
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id !== selectedFarmId) return f;
        return { ...f, [field]: value };
      })
    );
    triggerToast(`Updated ${activeFarmReport.farm.name} profile.`);
  };

  const applyMonthToAllMonths = (withSeasonality = false) => {
    if (!currentMonthRaw) return;
    const countFields = new Set([
      'noOfBred', 'repeatBreeders', 'bredToFarrow', 'noOfFarrowings',
      'totalPigletsBorn', 'stillbirth', 'mummified', 'condemned',
      'totalLittersWeaned', 'totalPigletsWeaned',
      'primeSold', 'oversizeSold', 'slowGrowSold', 'emergencySold',
      'mortSucklings', 'mortWeaners', 'mortFinishers'
    ]);

    setFarms((prev) =>
      prev.map((f) => {
        if (f.id !== selectedFarmId) return f;
        const nextMonths = {};
        MONTHS.forEach((m, idx) => {
          const factor = withSeasonality ? MONTH_SEASONALITY[idx] : 1;
          const cloned = { ...currentMonthRaw };
          if (withSeasonality) {
            Object.keys(cloned).forEach((k) => {
              if (countFields.has(k)) {
                cloned[k] = Math.round(cloned[k] * factor);
              }
            });
          }
          nextMonths[m] = cloned;
        });
        return { ...f, months: nextMonths };
      })
    );

    triggerToast(
      withSeasonality
        ? `Applied ${selectedMonth} baseline across all 12 months with seasonal curves!`
        : `Copied ${selectedMonth} entries identically to all 12 months!`
    );
  };

  const handleAddNewFarm = (e) => {
    e.preventDefault();
    if (!newFarmForm.name.trim()) return;

    const nextNum = farms.length + 1;
    const newId = `FARM-${String(nextNum).padStart(2, '0')}`;
    const sows = Math.max(1, Number(newFarmForm.sows) || 1);
    const boars = Math.max(0, Number(newFarmForm.boars) || 0);
    const gilts = Math.max(0, Number(newFarmForm.gilts) || 0);

    const isInactive = newFarmForm.status === 'Inactive';
    const targetAnnualBorn = isInactive ? 0 : Math.round(sows * 14.8);

    const profile = {
      id: newId,
      name: newFarmForm.name.trim(),
      type: newFarmForm.type,
      sows,
      boars,
      gilts,
      status: newFarmForm.status,
      targetAnnualBorn,
      farrowRate: isInactive ? 0 : 90.0,
      litterIndex: isInactive ? 0 : 2.26,
      wsi: isInactive ? 0 : 7.0
    };

    const newFarm = {
      ...profile,
      months: buildInitialFarmMonths(profile)
    };

    setFarms((prev) => [...prev, newFarm]);
    setSelectedFarmId(newId);
    setShowAddModal(false);
    setNewFarmForm({
      name: '',
      type: 'Farrow-to-Finish',
      sows: 40,
      boars: 3,
      gilts: 9,
      status: 'Active / Synced'
    });
    setActiveTab('entry');
    triggerToast(`Added ${profile.name} (${newId}) to portfolio!`);
  };

  const handleResetBaseline = () => {
    const fresh = buildInitialDatabase();
    setFarms(fresh);
    setSelectedFarmId('FARM-01');
    setSelectedMonth('JAN');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    triggerToast('Reset portfolio to 2026 Baseline (30 Farms / 1,270 Sows).');
  };

  // ==========================================================================
  // 6. CSV EXPORT GENERATORS
  // ==========================================================================
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPigsCsv = (reportObj, filename) => {
    const lines = [];
    lines.push('PIgS,,,,,,,,,,,,');

    PIGS_REPORT_ROWS.forEach((row) => {
      if (row.type === 'header') {
        lines.push(`${row.label},JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC`);
      } else if (row.type === 'section') {
        lines.push(`${row.label},,,,,,,,,,,,`);
      } else {
        const vals = MONTHS.map((m) => formatCellValue(reportObj.monthly[m][row.key], row.fmt, true));
        const safeLabel = row.label.includes(',') ? `"${row.label}"` : row.label;
        lines.push(`${safeLabel},${vals.join(',')}`);
      }
    });

    downloadFile(lines.join('\n'), filename);
    triggerToast(`Downloaded ${filename}`);
  };

  const exportDirectorySummaryCsv = () => {
    const headers = [
      'Farm ID',
      'Farm Name',
      'Farm Type',
      'Sow Level (hd)',
      'Boars (hd)',
      'Gilts (hd)',
      'App Sync Status',
      'Avg Bred/Mo',
      'Wean-to-Service (d)',
      'Farrowing Rate (%)',
      'Litter Index',
      'Annual Piglets Born (hd)',
      'Annual Piglets Weaned (hd)',
      'Annual Finishers Sold (hd)',
      'Ending Standing Inventory (hd)'
    ];

    const rows = consolidated.farmReports.map(({ farm, annual }) => [
      farm.id,
      `"${farm.name}"`,
      farm.type,
      farm.sows,
      farm.boars,
      farm.gilts,
      farm.status,
      Math.round(annual.noOfBred / 12),
      annual.weanToServiceInterval.toFixed(1),
      annual.farrowingRate.toFixed(1),
      annual.litterIndex.toFixed(2),
      Math.round(annual.totalPigletsBorn),
      Math.round(annual.totalPigletsWeaned),
      Math.round(annual.totalFinishersSold),
      Math.round(annual.endInventory)
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csv, 'ITCPH_30_Farms_Portfolio_Summary_2026.csv');
    triggerToast('Downloaded ITCPH_30_Farms_Portfolio_Summary_2026.csv');
  };

  // ==========================================================================
  // 7. RENDER
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1E3A5F] text-white px-4 py-3 rounded-xl shadow-lg border border-white/15 flex items-center gap-2.5 text-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Enterprise Header */}
      <header className="bg-[#1E3A5F] text-white shadow-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/90 border border-emerald-400/30 flex items-center justify-center shadow-inner shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight">
                    ITCPH PIgS Swine Production System
                  </h1>
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    2026 Portfolio
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Multi-Farm Herd Data Entry, Validation &amp; Automated Consolidation Engine
                </p>
              </div>
            </div>

            {/* Primary Navigation Tabs */}
            <nav className="flex items-center gap-1.5 bg-[#152a45] p-1 rounded-xl border border-white/10 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Portfolio Consolidation</span>
              </button>

              <button
                onClick={() => setActiveTab('entry')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'entry'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ClipboardEdit className="w-4 h-4" />
                <span>Farm Data Entry</span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'report'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>PIgS Report &amp; Export</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ==================================================================
            VIEW 1: PORTFOLIO CONSOLIDATION DASHBOARD (MASTER VIEW)
           ================================================================== */}
        {activeTab === 'dashboard' && (
          <>
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Portfolio Executive Consolidation
                </h2>
                <p className="text-sm text-slate-500">
                  Real-time roll-up across {kpis.totalFarms} registered swine farms ({kpis.totalSows.toLocaleString()} total sows)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#166534] hover:bg-emerald-800 text-white shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Farm
                </button>
                <button
                  onClick={() => exportPigsCsv(consolidated, 'PIgS_consolidated_30farms_1270sows.csv')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4 text-[#1E3A5F]" />
                  Export Consolidated PIgS CSV
                </button>
                <button
                  onClick={handleResetBaseline}
                  title="Restore 2026 30-Farm / 1,270-Sow Baseline"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden lg:inline">Reset Baseline</span>
                </button>
              </div>
            </div>

            {/* Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* KPI 1: Total Farms & Sync Breakdown */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Registered Farms
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">{kpis.totalFarms}</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {kpis.activeCount} Active
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Pending: <strong className="text-amber-600">{kpis.pendingCount}</strong></span>
                  <span>Inactive: <strong className="text-slate-600">{kpis.inactiveCount}</strong></span>
                </div>
              </div>

              {/* KPI 2: Total Sow Inventory */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Sow Level
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-[#1E3A5F]">
                    {kpis.totalSows.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-slate-500">head</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Standing Herd: <strong className="text-slate-700">{kpis.standingInventory.toLocaleString()} hd</strong>
                </div>
              </div>

              {/* KPI 3: Annual Piglets Born */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Annual Piglets Born
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-[#166534]">
                    {Math.round(kpis.activeAnnualBorn).toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-emerald-700">active</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Incl. Pending Sync: <strong className="text-slate-700">{Math.round(kpis.allAnnualBorn).toLocaleString()} hd</strong>
                </div>
              </div>

              {/* KPI 4: Avg Farrowing Rate */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Portfolio Farrowing Rate
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {kpis.avgFarrowingRate.toFixed(1)}%
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Benchmark Target: <strong className="text-slate-700">≥ 88.0%</strong>
                </div>
              </div>

              {/* KPI 5: Avg Litter Index */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Avg Litter Index
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {kpis.avgLitterIndex.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">litters/sow/yr</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  PWSY Avg: <strong className="text-slate-700">{consolidated.annual.pwsy.toFixed(1)}</strong>
                </div>
              </div>
            </div>

            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart: Annual Piglets Born by Farm */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Annual Piglets Born &amp; Weaned by Farm
                    </h3>
                    <p className="text-xs text-slate-500">
                      Active &amp; Pending Sync farms ranked by annual farrowing volume
                    </p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={farmBarChartData} margin={{ top: 5, right: 10, left: -15, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#475569' }}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="born" name="Piglets Born" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="weaned" name="Piglets Weaned" fill="#166534" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart: Monthly Consolidated Production Trends */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Monthly Consolidated Production Flow (JAN–DEC)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Portfolio-wide monthly Born, Born Alive, Weaned, and Finishers Sold
                    </p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line
                        type="monotone"
                        dataKey="born"
                        name="Total Born"
                        stroke="#1E3A5F"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weaned"
                        name="Piglets Weaned"
                        stroke="#166534"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sold"
                        name="Finishers Sold"
                        stroke="#D97706"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 30-Farm Directory Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Registered Swine Farms Directory ({filteredReports.length} of {farms.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select any farm to input monthly records or inspect its individual PIgS report
                  </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search farm or ID..."
                      className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] w-48 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-sm border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    >
                      <option value="ALL">All Sync Statuses</option>
                      <option value="Active / Synced">Active / Synced</option>
                      <option value="Pending Sync">Pending Sync</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="text-sm border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    >
                      <option value="ALL">All Farm Types</option>
                      <option value="Farrow-to-Finish">Farrow-to-Finish</option>
                      <option value="Sow-Weaner">Sow-Weaner</option>
                      <option value="Farrow-to-Wean">Farrow-to-Wean</option>
                    </select>
                  </div>

                  <button
                    onClick={exportDirectorySummaryCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Directory CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3.5 font-bold">Farm ID</th>
                      <th className="py-3 px-3.5 font-bold">Farm Name</th>
                      <th className="py-3 px-3.5 font-bold">Operation Type</th>
                      <th className="py-3 px-3 text-right font-bold">Sows</th>
                      <th className="py-3 px-3 text-right font-bold">Avg Bred/Mo</th>
                      <th className="py-3 px-3 text-right font-bold">WSI (d)</th>
                      <th className="py-3 px-3 text-right font-bold">Farrow %</th>
                      <th className="py-3 px-3 text-right font-bold">Litter Idx</th>
                      <th className="py-3 px-3 text-right font-bold">Annual Born</th>
                      <th className="py-3 px-3.5 font-bold">Sync Status</th>
                      <th className="py-3 px-3.5 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.map(({ farm, annual }) => (
                      <tr key={farm.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-600">
                          {farm.id}
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                          {farm.name}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {farm.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#1E3A5F] tabular-nums">
                          {farm.sows}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                          {Math.round(annual.noOfBred / 12)}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                          {annual.weanToServiceInterval > 0 ? annual.weanToServiceInterval.toFixed(1) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-800">
                          {annual.farrowingRate > 0 ? `${annual.farrowingRate.toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                          {annual.litterIndex > 0 ? annual.litterIndex.toFixed(2) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold tabular-nums text-[#166534]">
                          {Math.round(annual.totalPigletsBorn).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <StatusBadge status={farm.status} />
                        </td>
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedFarmId(farm.id);
                                setActiveTab('entry');
                              }}
                              className="px-2.5 py-1 rounded bg-[#1E3A5F] hover:bg-[#162c49] text-white font-medium transition-colors"
                            >
                              Edit Data
                            </button>
                            <button
                              onClick={() => {
                                setReportTargetId(farm.id);
                                setActiveTab('report');
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors"
                            >
                              PIgS Report
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consolidated 6-Section PIgS Master Report Table */}
            <PigsMatrixTable
              reportData={consolidated}
              title={`Consolidated Portfolio PIgS Report (${farms.length} Farms | ${kpis.totalSows.toLocaleString()} Sows)`}
              subtitle="Live aggregated headcounts and weighted herd performance metrics across JAN–DEC"
            />
          </>
        )}

        {/* ==================================================================
            VIEW 2: FARM DATA ENTRY & EDITOR VIEW (PER-USER INPUT FORM)
           ================================================================== */}
        {activeTab === 'entry' && activeFarmReport && currentMonthRaw && (
          <div className="space-y-6">
            {/* Editor Header & Farm/Month Selectors */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#1E3A5F] text-white">
                      {activeFarmReport.farm.id}
                    </span>
                    <StatusBadge status={activeFarmReport.farm.status} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {activeFarmReport.farm.name} — Monthly Herd Data Entry
                  </h2>
                  <p className="text-xs text-slate-500">
                    All edits automatically recalculate derived PIgS rates and roll up into the Master Portfolio Consolidation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Farm
                  </button>
                  <button
                    onClick={() => {
                      setReportTargetId(activeFarmReport.farm.id);
                      setActiveTab('report');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1E3A5F] hover:bg-[#152a45] text-white shadow-sm transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Preview Individual PIgS Report
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Farm Switcher & Profile Quick Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Select Farm User Account
                  </label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.id} — {f.name} ({f.sows} sows • {f.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Operation Type
                  </label>
                  <select
                    value={activeFarmReport.farm.type}
                    onChange={(e) => updateFarmMeta('type', e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    <option value="Farrow-to-Finish">Farrow-to-Finish</option>
                    <option value="Sow-Weaner">Sow-Weaner</option>
                    <option value="Farrow-to-Wean">Farrow-to-Wean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    App Sync Status
                  </label>
                  <select
                    value={activeFarmReport.farm.status}
                    onChange={(e) => updateFarmMeta('status', e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    <option value="Active / Synced">Active / Synced</option>
                    <option value="Pending Sync">Pending Sync</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Month Selector Tabs + Fast Entry Helpers */}
              <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedMonth === m
                          ? 'bg-[#166534] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyMonthToAllMonths(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy {selectedMonth} to All Months
                  </button>
                  <button
                    type="button"
                    onClick={() => applyMonthToAllMonths(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Populate 12-Mo Seasonality
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Validation Banner */}
            {validationWarnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Data Validation Alerts ({selectedMonth})
                  </h4>
                  <ul className="mt-1 text-xs text-amber-800 list-disc list-inside space-y-0.5">
                    {validationWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 6-Section Structured Input Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SECTION I: BREEDING */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#1E3A5F] text-white flex items-center justify-between">
                  <h3 className="text-sm font-bold">I. Breeding ({selectedMonth})</h3>
                  <span className="text-xs bg-white/15 px-2 py-0.5 rounded">
                    Repeat %: <strong>{currentMonthComputed.repeatPct.toFixed(1)}%</strong>
                  </span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      No. of Bred (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.noOfBred}
                      onChange={(e) => updateMonthField('noOfBred', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Wean-to-Service (days)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={currentMonthRaw.weanToServiceInterval}
                      onChange={(e) => updateMonthField('weanToServiceInterval', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Repeat Breeders (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.repeatBreeders}
                      onChange={(e) => updateMonthField('repeatBreeders', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION III: WEANING */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#1E3A5F] text-white flex items-center justify-between">
                  <h3 className="text-sm font-bold">III. Weaning ({selectedMonth})</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-white/15 px-2 py-0.5 rounded">
                      Wean Size: <strong>{currentMonthComputed.aveWeaningSize.toFixed(2)}</strong>
                    </span>
                    <span className="bg-emerald-500/30 px-2 py-0.5 rounded">
                      PWSY: <strong>{currentMonthComputed.pwsy.toFixed(1)}</strong>
                    </span>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Total Litters Weaned
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.totalLittersWeaned}
                      onChange={(e) => updateMonthField('totalLittersWeaned', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Total Piglets Weaned
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.totalPigletsWeaned}
                      onChange={(e) => updateMonthField('totalPigletsWeaned', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Ave Weaning Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={currentMonthRaw.aveWeaningWeight}
                      onChange={(e) => updateMonthField('aveWeaningWeight', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Ave Weaning Age (d)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.aveWeaningAge}
                      onChange={(e) => updateMonthField('aveWeaningAge', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Adj. 30-day Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={currentMonthRaw.adj30DayWt}
                      onChange={(e) => updateMonthField('adj30DayWt', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col justify-center">
                    <span className="text-[11px] text-slate-500">Pre-Wean Mort.</span>
                    <span className="text-sm font-bold text-slate-800">
                      {currentMonthComputed.preWeaningMort.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION II: FARROWING (FULL WIDTH) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#1E3A5F] text-white flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold">II. Farrowing Performance ({selectedMonth})</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-white/15 px-2 py-0.5 rounded">
                      Farrowing Rate: <strong>{currentMonthComputed.farrowingRate.toFixed(1)}%</strong>
                    </span>
                    <span className="bg-emerald-500/30 px-2 py-0.5 rounded">
                      Born Alive: <strong>{currentMonthComputed.bornAlive} hd</strong>
                    </span>
                    <span className="bg-white/15 px-2 py-0.5 rounded">
                      Born/Litter: <strong>{currentMonthComputed.bornPerLitter.toFixed(2)}</strong>
                    </span>
                    <span className="bg-white/15 px-2 py-0.5 rounded">
                      Born Alive/Litter: <strong>{currentMonthComputed.bornAlivePerLitter.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Bred to Farrow (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.bredToFarrow}
                      onChange={(e) => updateMonthField('bredToFarrow', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      No. of Farrowings (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.noOfFarrowings}
                      onChange={(e) => updateMonthField('noOfFarrowings', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Farrowing Interval (d)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.farrowingInterval}
                      onChange={(e) => updateMonthField('farrowingInterval', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Litter Index (12 mo)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentMonthRaw.litterIndex}
                      onChange={(e) => updateMonthField('litterIndex', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Services per Litter
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentMonthRaw.servicesPerLitter}
                      onChange={(e) => updateMonthField('servicesPerLitter', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Total Piglets Born (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.totalPigletsBorn}
                      onChange={(e) => updateMonthField('totalPigletsBorn', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Stillbirth (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.stillbirth}
                      onChange={(e) => updateMonthField('stillbirth', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Mummified (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.mummified}
                      onChange={(e) => updateMonthField('mummified', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Condemned (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.condemned}
                      onChange={(e) => updateMonthField('condemned', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Ave Birth Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={currentMonthRaw.aveBirthWeight}
                      onChange={(e) => updateMonthField('aveBirthWeight', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION IV: STARTER TO FINISHER (FULL WIDTH) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#1E3A5F] text-white flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">IV. Starter to Finisher ({selectedMonth})</h3>
                    {activeFarmReport.farm.type !== 'Farrow-to-Finish' && (
                      <span className="text-[11px] bg-amber-500/25 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded">
                        {activeFarmReport.farm.type} (Optional / Zeroed by Default)
                      </span>
                    )}
                  </div>
                  <span className="text-xs bg-emerald-500/30 px-2.5 py-0.5 rounded">
                    Total Finishers Sold: <strong>{currentMonthComputed.totalFinishersSold} hd</strong>
                  </span>
                </div>

                <div className="p-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Start Fattening Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={currentMonthRaw.startFatteningWt}
                      onChange={(e) => updateMonthField('startFatteningWt', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ave Starter Age (d)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.aveStarterAge}
                      onChange={(e) => updateMonthField('aveStarterAge', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ave 75-Day Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={currentMonthRaw.ave75DayWt}
                      onChange={(e) => updateMonthField('ave75DayWt', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Finisher Live Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={currentMonthRaw.aveFinisherLiveWt}
                      onChange={(e) => updateMonthField('aveFinisherLiveWt', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ave Market Age (d)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.aveMarketAge}
                      onChange={(e) => updateMonthField('aveMarketAge', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      ADG (grams/day)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.adgGrams}
                      onChange={(e) => updateMonthField('adgGrams', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Finisher Mort. (%)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={currentMonthRaw.starterFinisherMortRate}
                      onChange={(e) => updateMonthField('starterFinisherMortRate', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>

                  {/* Sales Breakdown */}
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-700 mb-1">
                      Prime Sold (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.primeSold}
                      onChange={(e) => updateMonthField('primeSold', e.target.value)}
                      className="w-full text-sm font-semibold border border-emerald-300 bg-emerald-50/30 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Oversize ≥121kg (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.oversizeSold}
                      onChange={(e) => updateMonthField('oversizeSold', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Slow Grow (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.slowGrowSold}
                      onChange={(e) => updateMonthField('slowGrowSold', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Emergency Sale (hd)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMonthRaw.emergencySold}
                      onChange={(e) => updateMonthField('emergencySold', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Adj. 150-day Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={currentMonthRaw.adj150DayWt}
                      onChange={(e) => updateMonthField('adj150DayWt', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Adj. 180-day Wt (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={currentMonthRaw.adj180DayWt}
                      onChange={(e) => updateMonthField('adj180DayWt', e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION V: HERD MORTALITY */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#1E3A5F] text-white flex items-center justify-between">
                  <h3 className="text-sm font-bold">V. Herd Mortality ({selectedMonth})</h3>
                  <span className="text-xs bg-white/15 px-2 py-0.5 rounded">
                    % Herd Mortality: <strong>{currentMonthComputed.herdMortPct.toFixed(2)}%</strong>
                  </span>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    ['mortSucklings', 'Sucklings (hd)'],
                    ['mortWeaners', 'Weaners (hd)'],
                    ['mortFinishers', 'Finishers (hd)'],
                    ['mortSows', 'Sows (hd)'],
                    ['mortBoars', 'Boars (hd)'],
                    ['mortGilts', 'Gilts (hd)']
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={currentMonthRaw[key]}
                        onChange={(e) => updateMonthField(key, e.target.value)}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION VI: END-OF-MONTH INVENTORY */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#1E3A5F] text-white flex items-center justify-between">
                  <h3 className="text-sm font-bold">VI. End-of-Month Inventory ({selectedMonth})</h3>
                  <span className="text-xs bg-emerald-500/30 px-2 py-0.5 rounded">
                    Ending Total: <strong>{currentMonthComputed.endInventory.toLocaleString()} hd</strong>
                  </span>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    ['invSucklings', 'Sucklings (hd)'],
                    ['invWeaners', 'Weaners (hd)'],
                    ['invFinishers', 'Finishers (hd)'],
                    ['invSows', 'Sows (hd)'],
                    ['invBoars', 'Boars (hd)'],
                    ['invGilts', 'Gilts (hd)']
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={currentMonthRaw[key]}
                        onChange={(e) => updateMonthField(key, e.target.value)}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            VIEW 3: INDIVIDUAL FARM & CONSOLIDATED REPORT + EXPORT VIEW
           ================================================================== */}
        {activeTab === 'report' && (
          <div className="space-y-5">
            {/* Report Controls Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
              <div className="flex-1 max-w-xl">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Report Scope (Consolidated Portfolio or Individual Farm User)
                </label>
                <select
                  value={reportTargetId}
                  onChange={(e) => setReportTargetId(e.target.value)}
                  className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                >
                  <option value="CONSOLIDATED">
                    ★ CONSOLIDATED PORTFOLIO REPORT ({farms.length} Farms / {kpis.totalSows.toLocaleString()} Sows)
                  </option>
                  {consolidated.farmReports.map(({ farm }) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.id} — {farm.name} ({farm.type} • {farm.sows} Sows • {farm.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {reportTargetId !== 'CONSOLIDATED' && (
                  <button
                    onClick={() => {
                      setSelectedFarmId(reportTargetId);
                      setActiveTab('entry');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
                  >
                    <ClipboardEdit className="w-4 h-4" />
                    Edit Farm Data
                  </button>
                )}

                <button
                  onClick={() => {
                    if (reportTargetId === 'CONSOLIDATED') {
                      exportPigsCsv(
                        consolidated,
                        `PIgS_consolidated_${farms.length}farms_${kpis.totalSows}sows.csv`
                      );
                    } else {
                      const target = consolidated.farmReports.find((r) => r.farm.id === reportTargetId);
                      if (target) {
                        const slug = target.farm.name.replace(/[^a-zA-Z0-9]+/g, '_');
                        exportPigsCsv(target, `PIgS_${target.farm.id}_${slug}.csv`);
                      }
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#166534] hover:bg-emerald-800 text-white shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PIgS CSV
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#1E3A5F] hover:bg-[#152a45] text-white shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>

            {/* Render Selected Report */}
            {reportTargetId === 'CONSOLIDATED' ? (
              <PigsMatrixTable
                reportData={consolidated}
                title={`ITCPH Consolidated PIgS Report — ${farms.length} Farms (${kpis.totalSows.toLocaleString()} Sows)`}
                subtitle={`Active/Synced: ${kpis.activeCount} • Pending Sync: ${kpis.pendingCount} • Inactive: ${kpis.inactiveCount}`}
              />
            ) : (
              (() => {
                const target =
                  consolidated.farmReports.find((r) => r.farm.id === reportTargetId) ||
                  consolidated.farmReports[0];
                return (
                  <PigsMatrixTable
                    reportData={target}
                    title={`${target.farm.id}: ${target.farm.name} — Individual PIgS Report`}
                    subtitle={`Operation Type: ${target.farm.type} | Sow Level: ${target.farm.sows} hd | Status: ${target.farm.status}`}
                  />
                );
              })()
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          ADD NEW FARM MODAL
         ==================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#1E3A5F] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Register New Swine Farm</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-300 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewFarm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Farm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lipa City Model Swine Farm"
                  value={newFarmForm.name}
                  onChange={(e) => setNewFarmForm({ ...newFarmForm, name: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operation Type
                  </label>
                  <select
                    value={newFarmForm.type}
                    onChange={(e) => setNewFarmForm({ ...newFarmForm, type: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Farrow-to-Finish">Farrow-to-Finish</option>
                    <option value="Sow-Weaner">Sow-Weaner</option>
                    <option value="Farrow-to-Wean">Farrow-to-Wean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Sync Status
                  </label>
                  <select
                    value={newFarmForm.status}
                    onChange={(e) => setNewFarmForm({ ...newFarmForm, status: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Active / Synced">Active / Synced</option>
                    <option value="Pending Sync">Pending Sync</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sow Level (hd)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFarmForm.sows}
                    onChange={(e) => setNewFarmForm({ ...newFarmForm, sows: e.target.value })}
                    className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Boars (hd)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newFarmForm.boars}
                    onChange={(e) => setNewFarmForm({ ...newFarmForm, boars: e.target.value })}
                    className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gilts (hd)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newFarmForm.gilts}
                    onChange={(e) => setNewFarmForm({ ...newFarmForm, gilts: e.target.value })}
                    className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#166534] hover:bg-emerald-800 text-white shadow-sm"
                >
                  Create Farm &amp; Open Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}