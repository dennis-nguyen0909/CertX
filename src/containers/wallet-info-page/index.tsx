"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useWalletTransactions } from "@/hooks/wallet/use-wallet-transactions";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { BarChart3, Copy, Menu, QrCode, Download, Filter } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { CopyableCell } from "@/components/ui/copyable-cell";

import { useColumns } from "./use-colulmns";
import { useWalletInfo } from "@/hooks/wallet/use-wallet-info";

export default function WalletPage() {
  const { setPagination, ...pagination } = usePaginationQuery();
  const { data: walletInfo } = useWalletInfo();

  const { data: transactions, isLoading } = useWalletTransactions({
    page: pagination.pageIndex + 1,
    size: (pagination.pageSize = 25),
  });
  const columns = useColumns;
  console.log("transactions", transactions);
  console.log("walletInfo", walletInfo);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Address</h1>
              <div className="flex items-center gap-2">
                <CopyableCell
                  value={walletInfo?.address || ""}
                  display={
                    <span className="text-gray-600 font-mono text-sm">
                      {walletInfo?.address}
                    </span>
                  }
                  tooltipLabel="Copy Address"
                  iconSize={12}
                  iconClassName="text-gray-400"
                />
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <QrCode className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>View on Explorer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  ETH Balance
                </div>
                <div className="text-lg font-semibold">
                  💰 {walletInfo?.balanceEth} ETH
                </div>
                <div className="text-xs text-gray-500 mt-2">Gas Price</div>
                <div className="text-sm">{walletInfo?.gasPriceGwei} Gwei</div>
                <div className="text-xs text-gray-500 mt-2">Nonce</div>
                <div className="text-sm">{walletInfo?.nonce}</div>
              </div>
            </CardContent>
          </Card>

          {/* More Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                More Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Transactions Sent
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    Latest: <span className="text-blue-600">27 mins ago ↗</span>
                  </span>
                  <span>
                    First: <span className="text-blue-600">22 days ago ↗</span>
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Funded By
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-mono text-sm">
                    0xb2dE751D...6c61B537d
                  </span>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <span className="text-blue-600 text-sm">33 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multichain Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Multichain Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">N/A</div>
              <div className="mt-4 text-right">
                <span className="text-xs text-gray-400">Ad</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Section */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Tabs defaultValue="transactions" className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="token-transfers">
                      Token Transfers (ERC-20)
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="transactions" className="mt-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BarChart3 className="h-4 w-4" />
                        Latest 25 from a total of 25 transactions
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Page Data
                        </Button>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-md border min-w-[900px]">
                      <DataTable
                        columns={columns}
                        data={transactions?.items || []}
                        listMeta={transactions?.meta}
                        isLoading={isLoading}
                        onPaginationChange={setPagination}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="token-transfers">
                  <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                      No token transfers found
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
