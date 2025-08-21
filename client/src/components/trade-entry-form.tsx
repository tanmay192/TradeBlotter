import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { insertTradeSchema, type InsertTrade } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function TradeEntryForm() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTrade>({
    resolver: zodResolver(insertTradeSchema),
    defaultValues: {
      scripName: '',
      quantity: 0,
      buyPrice: 0,
      sellPrice: undefined,
      buyDate: new Date().toISOString().split('T')[0],
      sellDate: undefined,
    }
  });

  const createTradeMutation = useMutation({
    mutationFn: async (data: InsertTrade) => {
      const response = await apiRequest('POST', '/api/trades', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      form.reset();
      toast({
        title: "Trade added successfully",
        description: "Your trade has been recorded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding trade",
        description: error.message || "Failed to add trade",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTrade) => {
    // If it's a buy-only trade, don't include sell data
    if (tradeType === 'buy') {
      data.sellPrice = undefined;
      data.sellDate = undefined;
    }
    createTradeMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add New Trade</CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={tradeType === 'buy' ? 'default' : 'outline'}
              onClick={() => setTradeType('buy')}
            >
              Buy
            </Button>
            <Button
              size="sm"
              variant={tradeType === 'sell' ? 'default' : 'outline'}
              onClick={() => setTradeType('sell')}
            >
              Complete Trade
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="scripName">Scrip Name</Label>
              <Input
                id="scripName"
                placeholder="e.g., RELIANCE, TCS, INFY"
                {...form.register('scripName')}
              />
              {form.formState.errors.scripName && (
                <p className="text-sm text-red-600">{form.formState.errors.scripName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="100"
                {...form.register('quantity', { valueAsNumber: true })}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-600">{form.formState.errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price (₹)</Label>
              <Input
                id="buyPrice"
                type="number"
                step="0.01"
                placeholder="1250.75"
                {...form.register('buyPrice', { valueAsNumber: true })}
              />
              {form.formState.errors.buyPrice && (
                <p className="text-sm text-red-600">{form.formState.errors.buyPrice.message}</p>
              )}
            </div>
            {tradeType === 'sell' && (
              <div className="space-y-2">
                <Label htmlFor="sellPrice">Sell Price (₹)</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  placeholder="1340.25"
                  {...form.register('sellPrice', { valueAsNumber: true })}
                />
                {form.formState.errors.sellPrice && (
                  <p className="text-sm text-red-600">{form.formState.errors.sellPrice.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buyDate">Buy Date</Label>
              <Input
                id="buyDate"
                type="date"
                {...form.register('buyDate')}
              />
              {form.formState.errors.buyDate && (
                <p className="text-sm text-red-600">{form.formState.errors.buyDate.message}</p>
              )}
            </div>
            {tradeType === 'sell' && (
              <div className="space-y-2">
                <Label htmlFor="sellDate">Sell Date</Label>
                <Input
                  id="sellDate"
                  type="date"
                  {...form.register('sellDate')}
                />
                {form.formState.errors.sellDate && (
                  <p className="text-sm text-red-600">{form.formState.errors.sellDate.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Clear
            </Button>
            <Button 
              type="submit" 
              disabled={createTradeMutation.isPending}
            >
              {createTradeMutation.isPending ? 'Adding...' : 'Add Trade'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
