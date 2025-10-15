import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tab.jsx";
import BookingAnalytics from "../../components/BookingAnalytics.jsx";
import RevenueAnalytics from "../../components/RevenueAnalytics.jsx";

export function Tab() {
  return (
    <div className="flex flex-col gap-6 min-h-full w-full ">
      <Tabs defaultValue="Booking Analytics">
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
    <div className="flex-1">
      <Tab />
    </div>
  );
};

export default Analytics;
