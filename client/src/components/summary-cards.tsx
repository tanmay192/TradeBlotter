import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Clock, Target } from "lucide-react";
import { type Trade } from "@shared/schema";
import { calculateTradeMetrics, formatCurrency } from "@/lib/trade-utils";

export default function SummaryCards() {
  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    queryKey: ['/api/trades'],
  });

  const { data: capitalData } = useQuery<{ totalCapital: number }>({
    queryKey: ['/api/capital'],
  });

  const totalCapital = capitalData?.totalCapital || 0;
  const metrics = calculateTradeMetrics(trades, totalCapital);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Capital */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Capital</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(totalCapital)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className={`text-sm font-medium ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-500 ml-2">portfolio return</span>
          </div>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total P&L</p>
              <p className={`text-2xl font-bold ${metrics.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(metrics.totalPL)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className={`text-sm font-medium ${metrics.bookedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.bookedPL)}
            </span>
            <span className="text-xs text-slate-500 ml-2">booked</span>
          </div>
        </CardContent>
      </Card>

      {/* Deployed Capital */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Deployed Capital</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(metrics.deployedCapital)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-sm text-slate-600 font-medium">
              {formatCurrency(metrics.freeCapital)}
            </span>
            <span className="text-xs text-slate-500 ml-2">free capital</span>
          </div>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Win Rate</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.winRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-sm text-slate-600 font-medium">{metrics.totalTrades} trades</span>
            <span className="text-xs text-slate-500 ml-2">total</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
