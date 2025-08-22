import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Target, Calendar } from "lucide-react";
import { type Trade } from "@shared/schema";
import { getQuarterlyAnalytics, formatCurrency } from "@/lib/trade-utils";

export default function TradingInsights() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [chartType, setChartType] = useState<'quarterly' | 'yearly'>('quarterly');

  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    queryKey: ['/api/trades'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate quarterly data for the selected year
  const quarterlyData = getQuarterlyAnalytics(trades, parseInt(selectedYear));
  
  // Transform quarterly data for chart
  const chartData = Object.entries(quarterlyData).map(([quarter, data]) => ({
    quarter,
    quarterName: quarter === 'Q1' ? 'Q1 (Jan-Mar)' : 
                 quarter === 'Q2' ? 'Q2 (Apr-Jun)' : 
                 quarter === 'Q3' ? 'Q3 (Jul-Sep)' : 'Q4 (Oct-Dec)',
    roi: data.returnPercentage,
    bookedPL: data.bookedPL,
    trades: data.totalTrades,
  }));

  // Calculate yearly data for all available years
  const yearlyData: Array<{
    year: string;
    roi: number;
    bookedPL: number;
    trades: number;
  }> = [];
  const yearsSet = new Set(trades.map(trade => new Date(trade.buyDate).getFullYear()));
  const years = Array.from(yearsSet).sort();
  
  years.forEach(year => {
    const yearlyQuarters = getQuarterlyAnalytics(trades, year);
    let totalBookedPL = 0;
    let totalInvestment = 0;
    let totalTrades = 0;

    Object.values(yearlyQuarters).forEach(quarter => {
      totalBookedPL += quarter.bookedPL;
      totalInvestment += quarter.totalInvestment;
      totalTrades += quarter.totalTrades;
    });

    const yearlyROI = totalInvestment > 0 ? (totalBookedPL / totalInvestment) * 100 : 0;

    yearlyData.push({
      year: year.toString(),
      roi: yearlyROI,
      bookedPL: totalBookedPL,
      trades: totalTrades,
    });
  });

  // Get best and worst performing quarters/years
  const currentData = chartType === 'quarterly' ? chartData : yearlyData;
  const bestPeriod = currentData.reduce((best, current) => 
    current.roi > best.roi ? current : best, currentData[0] || { roi: 0, quarter: '', year: '' });
  const worstPeriod = currentData.reduce((worst, current) => 
    current.roi < worst.roi ? current : worst, currentData[0] || { roi: 0, quarter: '', year: '' });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-800">{chartType === 'quarterly' ? data.quarterName : `Year ${label}`}</p>
          <p className="text-sm text-slate-600">
            ROI: <span className={`font-semibold ${data.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.roi >= 0 ? '+' : ''}{data.roi.toFixed(2)}%
            </span>
          </p>
          <p className="text-sm text-slate-600">
            P&L: <span className={`font-semibold ${data.bookedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.bookedPL)}
            </span>
          </p>
          <p className="text-sm text-slate-600">Trades: {data.trades}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trading Insights</CardTitle>
          <div className="flex space-x-2">
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {chartType === 'quarterly' && (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentData.length > 0 ? (
          <>
            {/* ROI Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'quarterly' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="quarter" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="roi" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="roi" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Performance Summary */}
            <div className="space-y-4">
              <h3 className="font-medium text-slate-700">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Best Performance */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-slate-800">
                        Best {chartType === 'quarterly' ? 'Quarter' : 'Year'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {chartType === 'quarterly' ? (bestPeriod as any).quarterName : (bestPeriod as any).year}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      +{bestPeriod.roi?.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatCurrency(bestPeriod.bookedPL || 0)}
                    </div>
                  </div>
                </div>

                {/* Worst Performance */}
                {worstPeriod.roi < bestPeriod.roi && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-red-600" />
                      <div>
                        <div className="font-medium text-slate-800">
                          Lowest {chartType === 'quarterly' ? 'Quarter' : 'Year'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {chartType === 'quarterly' ? (worstPeriod as any).quarterName : (worstPeriod as any).year}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        {worstPeriod.roi?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatCurrency(worstPeriod.bookedPL || 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm">No trading data available</p>
            <p className="text-xs text-slate-400">Add some trades to see performance insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}