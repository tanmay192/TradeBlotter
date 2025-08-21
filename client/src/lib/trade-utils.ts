import { type Trade } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculatePL(trade: Trade) {
  const buyPrice = parseFloat(trade.buyPrice);
  const quantity = parseFloat(trade.quantity);
  const totalBuyValue = buyPrice * quantity;
  
  let sellPrice = 0;
  let totalSellValue = 0;
  let amount = 0;
  let percentage = 0;

  if (trade.sellPrice && !trade.isOpen) {
    // Completed trade
    sellPrice = parseFloat(trade.sellPrice);
    totalSellValue = sellPrice * quantity;
    amount = totalSellValue - totalBuyValue;
    percentage = (amount / totalBuyValue) * 100;
  } else {
    // Open position - for MTM we would need current market price
    // For now, showing unrealized P&L as 0
    amount = 0;
    percentage = 0;
  }

  return { amount, percentage, totalBuyValue, totalSellValue };
}

export function formatDateRange(buyDate: string, sellDate?: string | null): string {
  const buyDateObj = new Date(buyDate);
  const formatOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric' 
  };
  
  const formattedBuyDate = buyDateObj.toLocaleDateString('en-US', formatOptions);
  
  if (!sellDate) {
    return `${formattedBuyDate} - Open`;
  }
  
  const sellDateObj = new Date(sellDate);
  const formattedSellDate = sellDateObj.toLocaleDateString('en-US', formatOptions);
  
  return `${formattedBuyDate} - ${formattedSellDate}`;
}

export function calculateTradeMetrics(trades: Trade[], totalCapital: number = 0) {
  let totalPortfolioValue = 0;
  let totalPL = 0;
  let bookedPL = 0;
  let mtmPL = 0;
  let openPositions = 0;
  let openValue = 0;
  let deployedCapital = 0;
  let completedTrades = 0;
  let winningTrades = 0;

  trades.forEach(trade => {
    const pl = calculatePL(trade);
    const quantity = parseFloat(trade.quantity);
    const buyPrice = parseFloat(trade.buyPrice);
    
    totalPortfolioValue += pl.totalBuyValue;
    
    if (trade.isOpen) {
      openPositions++;
      openValue += pl.totalBuyValue;
      deployedCapital += pl.totalBuyValue;
      mtmPL += pl.amount; // For now 0, would be actual MTM with live prices
    } else {
      completedTrades++;
      bookedPL += pl.amount;
      if (pl.amount > 0) winningTrades++;
    }
    
    totalPL += pl.amount;
  });

  const winRate = completedTrades > 0 ? (winningTrades / completedTrades) * 100 : 0;
  const totalReturn = totalCapital > 0 ? (totalPL / totalCapital) * 100 : 0;
  const freeCapital = Math.max(0, totalCapital - deployedCapital);
  const capitalUtilization = totalCapital > 0 ? (deployedCapital / totalCapital) * 100 : 0;

  return {
    totalPortfolioValue,
    totalPL,
    bookedPL,
    mtmPL,
    openPositions,
    openValue,
    deployedCapital,
    freeCapital,
    totalCapital,
    capitalUtilization,
    winRate,
    totalTrades: trades.length,
    totalReturn,
  };
}

export function getQuarter(date: string): string {
  const month = new Date(date).getMonth() + 1;
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  return 'Q4';
}

export function getQuarterlyAnalytics(trades: Trade[], year: number) {
  const quarters = { Q1: [], Q2: [], Q3: [], Q4: [] } as Record<string, Trade[]>;
  
  // Group trades by quarter
  trades.forEach(trade => {
    const tradeYear = new Date(trade.buyDate).getFullYear();
    if (tradeYear === year) {
      const quarter = getQuarter(trade.buyDate);
      quarters[quarter].push(trade);
    }
  });

  // Calculate metrics for each quarter
  const quarterlyData = {} as Record<string, {
    bookedPL: number;
    mtmPL: number;
    returnPercentage: number;
    totalTrades: number;
  }>;

  Object.entries(quarters).forEach(([quarter, quarterTrades]) => {
    let bookedPL = 0;
    let mtmPL = 0;
    let totalInvestment = 0;
    
    quarterTrades.forEach(trade => {
      const pl = calculatePL(trade);
      totalInvestment += pl.totalBuyValue;
      
      if (trade.isOpen) {
        mtmPL += pl.amount;
      } else {
        bookedPL += pl.amount;
      }
    });

    const totalPL = bookedPL + mtmPL;
    const returnPercentage = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

    quarterlyData[quarter] = {
      bookedPL,
      mtmPL,
      returnPercentage,
      totalTrades: quarterTrades.length,
    };
  });

  return quarterlyData;
}
