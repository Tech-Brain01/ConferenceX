import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tab.jsx";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card.jsx";
import BookingAnalytics from "../../components/BookingAnalytics.jsx";
import RevenueAnalytics from "../../components/RevenueAnalytics.jsx";

export function Tab() {
  return (
    <div className="flex min-h-screen flex-col gap-6 items-center">
      <Tabs  defaultValue="Booking Analytics">
        <TabsList className="gap-10 ">
          <TabsTrigger className="" value="Booking Analytics">
            Booking Analytics
          </TabsTrigger>
          <TabsTrigger value="Revenue Analytics">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent className="text-black" value="Booking Analytics">
          <BookingAnalytics />
        </TabsContent>

        <TabsContent className="text-black" value="Revenue Analytics">
          <RevenueAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const Analytics = () => {
  return (
    <div className="flex items-center justify-center">
      <Tab />
    </div>
  );
};

export default Analytics;
