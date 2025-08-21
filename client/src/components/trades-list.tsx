import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Trade } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, calculatePL, formatDateRange } from "@/lib/trade-utils";
import EditTradeDialog from "@/components/edit-trade-dialog";

export default function TradesList() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'open'>('all');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    queryKey: ['/api/trades'],
  });

  const deleteTradeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/trades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      toast({
        title: "Trade deleted",
        description: "The trade has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive",
      });
    },
  });

  const filteredTrades = trades.filter(trade => {
    if (filter === 'completed') return !trade.isOpen;
    if (filter === 'open') return trade.isOpen;
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteTradeMutation.mutate(id);
    }
  };

  const handleEdit = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedTrade(null);
    setIsEditDialogOpen(false);
  };

  const exportTrades = () => {
    const csvContent = [
      ['Scrip', 'Quantity', 'Buy Price', 'Sell Price', 'P&L', 'Return %', 'Buy Date', 'Sell Date', 'Status'],
      ...filteredTrades.map(trade => {
        const pl = calculatePL(trade);
        return [
          trade.scripName,
          trade.quantity,
          trade.buyPrice,
          trade.sellPrice || 'N/A',
          pl.amount.toString(),
          `${pl.percentage.toFixed(2)}%`,
          trade.buyDate,
          trade.sellDate || 'Open',
          trade.isOpen ? 'Open' : 'Completed'
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trades.csv';
    a.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Trades</CardTitle>
          <div className="flex space-x-2">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="open">Open Positions</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportTrades}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scrip</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Buy Price</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Return %</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No trades found. Add your first trade to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrades.map((trade) => {
                  const pl = calculatePL(trade);
                  return (
                    <TableRow key={trade.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="font-medium text-slate-800">{trade.scripName}</div>
                        <div className="text-xs text-slate-500">NSE</div>
                      </TableCell>
                      <TableCell className="text-slate-600">{trade.quantity}</TableCell>
                      <TableCell className="text-slate-600">
                        {formatCurrency(parseFloat(trade.buyPrice))}
                      </TableCell>
                      <TableCell>
                        {trade.sellPrice ? (
                          formatCurrency(parseFloat(trade.sellPrice))
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Open
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${pl.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pl.amount >= 0 ? '+' : ''}{formatCurrency(pl.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${pl.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pl.amount >= 0 ? '+' : ''}{pl.percentage.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        <div>{formatDateRange(trade.buyDate, trade.sellDate)}</div>
                        <div className="text-xs text-slate-400">
                          {trade.isOpen ? 'Ongoing' : `${Math.ceil((new Date(trade.sellDate!).getTime() - new Date(trade.buyDate).getTime()) / (1000 * 60 * 60 * 24))} days`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-2"
                            onClick={() => handleEdit(trade)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-2 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(trade.id)}
                            disabled={deleteTradeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {filteredTrades.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">1-{Math.min(10, filteredTrades.length)}</span> of{' '}
              <span className="font-medium">{filteredTrades.length}</span> trades
            </div>
          </div>
        )}
      </CardContent>
      
      <EditTradeDialog
        trade={selectedTrade}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </Card>
  );
}
